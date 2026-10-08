import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  Send, 
  Plus, 
  RefreshCw, 
  Search, 
  Download,
  AlertCircle
} from 'lucide-react';
import { Language, ApprovalEntry } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { INITIAL_APPROVED_KEYS, REPO_METADATA } from '../data/repoFiles';
import { 
  formatKey, 
  extractKeyNumber, 
  generateFullKey, 
  getTelegramApprovalUrl, 
  checkKeyApproval 
} from '../utils/approval';

interface ApprovalManagerProps {
  lang: Language;
}

export const ApprovalManager: React.FC<ApprovalManagerProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [keys, setKeys] = useState<ApprovalEntry[]>(INITIAL_APPROVED_KEYS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'paid' | 'trial'>('all');
  
  // Test / validation state
  const [inputKey, setInputKey] = useState('');
  const [validationResult, setValidationResult] = useState<ReturnType<typeof checkKeyApproval> | null>(null);
  
  // Generated token
  const [generatedToken, setGeneratedToken] = useState(generateFullKey());
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedValidationKey, setCopiedValidationKey] = useState(false);

  // Add new key modal / form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKeyNumber, setNewKeyNumber] = useState('');
  const [newName, setNewName] = useState('');
  const [newDuration, setNewDuration] = useState('30 Days');
  const [newPrice, setNewPrice] = useState('600 BDT');
  const [newType, setNewType] = useState<'paid' | 'admin' | 'trial'>('paid');

  const handleValidate = (keyToTest?: string) => {
    const val = keyToTest !== undefined ? keyToTest : inputKey;
    if (!val.trim()) return;
    const res = checkKeyApproval(val, keys);
    setValidationResult(res);
  };

  const handleGenerateNew = () => {
    const token = generateFullKey();
    setGeneratedToken(token);
    setInputKey(token.rawKey);
    handleValidate(token.rawKey);
  };

  const handleCopy = (text: string, isGen: boolean = true) => {
    navigator.clipboard.writeText(text);
    if (isGen) {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedValidationKey(true);
      setTimeout(() => setCopiedValidationKey(false), 2000);
    }
  };

  const handleAddKey = (e: React.FormEvent) => {
    e.preventDefault();
    const num = extractKeyNumber(newKeyNumber) || newKeyNumber.trim();
    if (!num) return;

    const newEntry: ApprovalEntry = {
      id: 'custom_' + Date.now(),
      rawKey: formatKey(num),
      keyNumber: num,
      type: newType,
      name: newName || (newType === 'admin' ? 'Custom Admin' : 'Custom User ' + num),
      duration: newDuration,
      durationBn: newDuration,
      price: newPrice,
      expiryNote: 'Manually added in AP-SM Manager',
      sourceFile: 'custom',
    };

    setKeys([newEntry, ...keys]);
    setShowAddModal(false);
    setNewKeyNumber('');
    setNewName('');
    setInputKey(newEntry.rawKey);
    handleValidate(newEntry.rawKey);
  };

  const exportApprovalTxt = () => {
    const adminKeys = keys.filter(k => k.type === 'admin');
    const paidKeys = keys.filter(k => k.type !== 'admin');

    let text = '#_________/Admin\\________\n';
    adminKeys.forEach(k => {
      text += `${k.rawKey}\n`;
      if (k.name) text += `${k.name}\n`;
    });

    text += '#_________/paid user\\________\n';
    paidKeys.forEach(k => {
      text += `${k.name ? '#' + k.name + ' >> ' : ''}${k.rawKey} ${k.duration ? k.duration : ''}\n`;
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Approval.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredKeys = keys.filter(k => {
    const matchesFilter = filterType === 'all' || k.type === filterType;
    const matchesSearch = 
      k.keyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.rawKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (k.name && k.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Token Generator (Left 6 Cols) */}
        <div className="lg:col-span-6 bg-[#0d131f] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-400" />
              {t.deviceKeyGen}
            </h2>
            <button
              onClick={handleGenerateNew}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'নতুন টোকেন বানান' : 'Generate Token'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'bn'
              ? 'টার্মাক্স স্ক্রিপ্ট রান করার সময় আপনার ফোনের হার্ডওয়্যার আইডি অনুযায়ী একটি কিউ টোকেন তৈরি হয়। নিচের ফরম্যাটটি সিয়াম টিমের অফিসিয়াল সিনট্যাক্স:'
              : 'When launching AP-SM in Termux, the script generates a machine device key. Below is the authentic SIAM format required for authorization:'
            }
          </p>

          <div className="space-y-2">
            <div className="bg-[#05080e] border border-emerald-500/30 rounded-lg p-3 font-mono text-emerald-400 text-xs sm:text-sm flex items-center justify-between shadow-inner">
              <span className="font-semibold select-all break-all">{generatedToken.rawKey}</span>
              <button
                onClick={() => handleCopy(generatedToken.rawKey, true)}
                className="ml-2 text-slate-400 hover:text-emerald-400 shrink-0 p-1 rounded"
                title="Copy Key"
              >
                {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Key ID: <strong className="text-slate-200">{generatedToken.keyNumber}</strong></span>
              <span>Format: <strong className="text-emerald-400">SM~(ID=(SIAM)=ID)~SM</strong></span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <a
              href={getTelegramApprovalUrl(generatedToken.rawKey)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>{t.telegramRequest}</span>
            </a>
            <button
              onClick={() => {
                setInputKey(generatedToken.rawKey);
                handleValidate(generatedToken.rawKey);
              }}
              className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.validateKey}</span>
            </button>
          </div>
        </div>

        {/* Live Key Validator & Status Check (Right 6 Cols) */}
        <div className="lg:col-span-6 bg-[#0d131f] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {t.validateKey} &amp; Status
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Database: <strong className="text-emerald-400">{keys.length} Keys</strong>
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
                placeholder={t.inputKeyPlaceholder}
                className="flex-1 bg-[#060a10] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleValidate()}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shrink-0"
              >
                {t.validateKey}
              </button>
            </div>
            <div className="flex flex-wrap gap-1 text-[11px] text-slate-400">
              <span>Quick Test:</span>
              <button 
                onClick={() => { setInputKey('10453'); handleValidate('10453'); }}
                className="text-emerald-400 hover:underline font-mono"
              >
                10453 (Siam)
              </button>
              <span>·</span>
              <button 
                onClick={() => { setInputKey('10462'); handleValidate('10462'); }}
                className="text-sky-400 hover:underline font-mono"
              >
                10462 (Rakib)
              </button>
              <span>·</span>
              <button 
                onClick={() => { setInputKey('10689'); handleValidate('10689'); }}
                className="text-amber-400 hover:underline font-mono"
              >
                10689 (Evann)
              </button>
              <span>·</span>
              <button 
                onClick={() => { setInputKey('99999'); handleValidate('99999'); }}
                className="text-rose-400 hover:underline font-mono"
              >
                99999 (Unapproved)
              </button>
            </div>
          </div>

          {/* Validation Result Box */}
          {validationResult && (
            <div className={`p-3.5 rounded-lg border ${
              validationResult.approved 
                ? 'bg-emerald-950/30 border-emerald-500/40' 
                : 'bg-rose-950/20 border-rose-500/40'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {validationResult.approved ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-xs text-white">
                      {validationResult.approved 
                        ? (lang === 'bn' ? '✓ কী অনুমোদিত (APPROVED)' : '✓ KEY APPROVED & ACTIVE')
                        : (lang === 'bn' ? '✗ কী অননুমোদিত (NOT APPROVED)' : '✗ KEY NOT APPROVED')
                      }
                    </div>
                    <div className="text-[11px] font-mono text-slate-300">
                      {validationResult.formattedKey}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(validationResult.formattedKey, false)}
                  className="text-slate-400 hover:text-slate-200 p-1"
                  title="Copy"
                >
                  {copiedValidationKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {validationResult.approved && validationResult.entry && (
                <div className="mt-2.5 pt-2 border-t border-emerald-950/60 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">User / Holder: </span>
                    <strong className="text-slate-200">{validationResult.entry.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Type: </span>
                    <strong className={`font-mono uppercase ${
                      validationResult.entry.type === 'admin' ? 'text-emerald-400' : 'text-sky-400'
                    }`}>
                      {validationResult.entry.type}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Duration: </span>
                    <span className="text-slate-200">
                      {lang === 'bn' ? validationResult.entry.durationBn : validationResult.entry.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Source: </span>
                    <span className="text-amber-400 font-mono">{validationResult.entry.sourceFile}</span>
                  </div>
                </div>
              )}

              {!validationResult.approved && (
                <div className="mt-2 text-xs text-rose-300/90 flex items-center justify-between">
                  <span>
                    {lang === 'bn' 
                      ? 'টুল চালু করতে এই টোকেনটি সিয়াম অ্যাডমিনকে পাঠিয়ে অনুমোদন নিন।'
                      : 'Send this token to Siam Admin on Telegram for instant license approval.'
                    }
                  </span>
                  <a
                    href={getTelegramApprovalUrl(validationResult.formattedKey)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-[11px] shrink-0"
                  >
                    Request
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Approved Licenses Database Table */}
      <div className="bg-[#0d131f] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {t.approvedListTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'bn'
                ? 'Approval.txt এবং apvl.txt থেকে নিষ্কাশিত সক্রিয় লাইসেন্স ও মেয়াদ তালিকা'
                : 'Active authorized keys, admins, and subscriber tiers loaded from Approval.txt & apvl.txt'
              }
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addKeyBtn}</span>
            </button>
            <button
              onClick={exportApprovalTxt}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Approval.txt</span>
            </button>
          </div>
        </div>

        {/* Filter bar and search */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center space-x-1.5 bg-[#060a10] p-1 rounded-lg border border-slate-800 w-full sm:w-auto">
            {(['all', 'admin', 'paid', 'trial'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${
                  filterType === type
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'all' ? t.filterAll : type}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search key or name..."
              className="w-full bg-[#060a10] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Table of Keys */}
        <div className="overflow-x-auto border border-slate-800/80 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080d15] text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Key ID &amp; Syntax</th>
                <th className="px-4 py-3">Assigned User</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Duration / Validity</th>
                <th className="px-4 py-3">Price / Tier</th>
                <th className="px-4 py-3">Source File</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredKeys.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-emerald-400 select-all">{item.rawKey}</span>
                  </td>
                  <td className="px-4 py-3 font-sans text-slate-200 font-medium">
                    {item.name || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      item.type === 'admin'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : item.type === 'paid'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-slate-300">
                    {lang === 'bn' ? item.durationBn : item.duration}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {item.price || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-400 text-[11px]">{item.sourceFile}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setInputKey(item.rawKey);
                        handleValidate(item.rawKey);
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors"
                      title="Validate"
                    >
                      Test
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Key Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0d131f] border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                {t.addKeyBtn}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddKey} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Key Number (Digits or full SM~ format)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newKeyNumber}
                    onChange={(e) => setNewKeyNumber(e.target.value)}
                    placeholder="e.g. 10999"
                    className="flex-1 bg-[#060a10] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setNewKeyNumber(generateFullKey().keyNumber)}
                    className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono"
                  >
                    Random
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Assigned User Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Tanvir VIP User"
                  className="w-full bg-[#060a10] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Role / Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#060a10] border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="paid">Paid User</option>
                    <option value="admin">Admin</option>
                    <option value="trial">Free Trial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="e.g. 30 Days"
                    className="w-full bg-[#060a10] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Price / Fee
                </label>
                <input
                  type="text"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="e.g. 600 BDT or $2.50"
                  className="w-full bg-[#060a10] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
