import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Plus, 
  Clock, 
  Trash2, 
  Key, 
  Layers, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Language, TotpAccount } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  DEFAULT_TOTP_ACCOUNTS, 
  generateTotpCode, 
  getTotpRemainingSeconds, 
  cleanSecret, 
  isValidBase32Secret, 
  generateRandomSecret 
} from '../utils/totp';

interface TotpAuthenticatorProps {
  lang: Language;
}

export const TotpAuthenticator: React.FC<TotpAuthenticatorProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [accounts, setAccounts] = useState<TotpAccount[]>(() => {
    const saved = localStorage.getItem('apsm_totp_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_TOTP_ACCOUNTS;
      }
    }
    return DEFAULT_TOTP_ACCOUNTS;
  });

  const [remainingSeconds, setRemainingSeconds] = useState(getTotpRemainingSeconds());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New account form
  const [showAddModal, setShowAddModal] = useState(false);
  const [label, setLabel] = useState('');
  const [issuer, setIssuer] = useState('Meta / Facebook');
  const [secret, setSecret] = useState('');
  const [formError, setFormError] = useState('');

  // Batch extractor
  const [batchInput, setBatchInput] = useState('');
  const [batchResults, setBatchResults] = useState<{ label: string; secret: string; code: string; valid: boolean }[]>([]);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds(getTotpRemainingSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save accounts to localStorage
  useEffect(() => {
    localStorage.setItem('apsm_totp_accounts', JSON.stringify(accounts));
  }, [accounts]);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cleanSecret(secret);
    if (!clean) {
      setFormError('Secret key cannot be empty');
      return;
    }
    if (!isValidBase32Secret(clean)) {
      setFormError('Invalid Base32 secret. Must contain only letters A-Z and digits 2-7.');
      return;
    }

    const newAcc: TotpAccount = {
      id: 'acc_' + Date.now(),
      label: label.trim() || 'Account ' + (accounts.length + 1),
      issuer: issuer.trim() || 'Meta / Facebook',
      secret: clean,
      digits: 6,
      period: 30,
      createdAt: Date.now(),
    };

    setAccounts([newAcc, ...accounts]);
    setShowAddModal(false);
    setLabel('');
    setSecret('');
    setFormError('');
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter((a) => a.id !== id));
  };

  const handleExtractBatch = () => {
    if (!batchInput.trim()) return;
    const lines = batchInput.split('\n').filter((l) => l.trim().length > 0);
    const results = lines.map((line, idx) => {
      let accLabel = `Account ${idx + 1}`;
      let secretStr = line.trim();

      if (line.includes('|')) {
        const parts = line.split('|');
        accLabel = parts[0].trim();
        secretStr = parts[1].trim();
      } else if (line.includes(':')) {
        const parts = line.split(':');
        accLabel = parts[0].trim();
        secretStr = parts[1].trim();
      }

      const clean = cleanSecret(secretStr);
      const valid = isValidBase32Secret(clean);
      const code = valid ? generateTotpCode(clean) : 'INVALID';

      return {
        label: accLabel,
        secret: clean,
        code,
        valid,
      };
    });

    setBatchResults(results);
  };

  const progressPercentage = (remainingSeconds / 30) * 100;

  return (
    <div className="space-y-6">
      {/* Header & Status */}
      <div className="bg-[#0d131f] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {t.totpTitle}
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              pyotp Engine
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {t.totpDesc}
          </p>
        </div>

        {/* Live Timer Counter */}
        <div className="flex items-center gap-4 bg-[#060a10] border border-slate-800 px-4 py-2.5 rounded-lg self-start md:self-auto">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">{t.expiresIn}:</span>
            <span className={`font-bold ${remainingSeconds <= 5 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
              {remainingSeconds}s
            </span>
          </div>

          {/* Mini progress bar */}
          <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                remainingSeconds <= 5 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addNewAccount}</span>
          </button>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const code = generateTotpCode(acc.secret, acc.digits, acc.period);
          const isCopied = copiedId === acc.id;

          return (
            <div
              key={acc.id}
              className="bg-[#0d131f] border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 space-y-3 transition-all relative overflow-hidden group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {acc.issuer}
                  </span>
                  <h3 className="text-sm font-bold text-white truncate max-w-[180px]">
                    {acc.label}
                  </h3>
                </div>
                <button
                  onClick={() => handleDeleteAccount(acc.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Account"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* OTP Code Display */}
              <div className="bg-[#05080e] border border-emerald-500/20 rounded-lg p-3 flex items-center justify-between">
                <span className="font-mono text-2xl font-bold tracking-widest text-emerald-400 select-all">
                  {code}
                </span>
                <button
                  onClick={() => handleCopy(code, acc.id)}
                  className={`p-2 rounded-md transition-colors ${
                    isCopied
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  }`}
                  title="Copy OTP"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span className="truncate max-w-[150px]" title={acc.secret}>
                  Secret: {acc.secret.substring(0, 6)}...
                </span>
                <span className="text-emerald-400 font-semibold">{remainingSeconds}s</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Batch 2FA Extractor Section */}
      <div className="bg-[#0d131f] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              {t.batch2fa}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {lang === 'bn' ? 'একাধিক অ্যাকাউন্টের ওটিপি একবারে দেখুন' : 'Extract multiple OTPs at once'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <textarea
              rows={4}
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder="FB Siam 01|JBSWY3DPEHPK3PXP&#10;FB Rakib VIP|KZXW6YTBOJWGS3TU"
              className="w-full bg-[#060a10] border border-slate-700 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleExtractBatch}
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.extractCodes}</span>
            </button>
          </div>

          <div className="bg-[#060a10] border border-slate-800 rounded-lg p-3 max-h-[160px] overflow-y-auto space-y-2">
            {batchResults.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
                {lang === 'bn' ? 'ওটিপি কোড ফলাফল এখানে দেখা যাবে' : 'Extracted live OTP codes will appear here'}
              </div>
            ) : (
              batchResults.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-300 truncate max-w-[140px]">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold tracking-wider">{item.code}</span>
                    {item.valid && (
                      <button
                        onClick={() => handleCopy(item.code, `batch-${idx}`)}
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        {copiedId === `batch-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add 2FA Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0d131f] border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                {t.addNewAccount}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-3">
              {formError && (
                <div className="p-2 rounded bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.accountName}
                </label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Siam Facebook Clone #1"
                  className="w-full bg-[#060a10] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Issuer / Platform
                </label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Meta / Facebook"
                  className="w-full bg-[#060a10] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    {t.secretKey}
                  </label>
                  <button
                    type="button"
                    onClick={() => setSecret(generateRandomSecret())}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{t.generateSecret}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={secret}
                  onChange={(e) => {
                    setSecret(e.target.value);
                    setFormError('');
                  }}
                  placeholder="Base32 (e.g. JBSWY3DPEHPK3PXP)"
                  className="w-full bg-[#060a10] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-200 focus:outline-none focus:border-emerald-500"
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
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
