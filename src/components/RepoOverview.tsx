import React, { useState } from 'react';
import { 
  GitBranch, 
  Terminal, 
  Copy, 
  Check, 
  FileCode2, 
  FileText, 
  Cpu, 
  Shield, 
  Eye, 
  Download, 
  ExternalLink,
  Code2,
  FolderOpen,
  Edit3,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { Language, RepoFile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { REPO_FILES, REPO_METADATA } from '../data/repoFiles';

interface RepoOverviewProps {
  lang: Language;
  onNavigateToTab: (tab: string) => void;
}

export const RepoOverview: React.FC<RepoOverviewProps> = ({ lang, onNavigateToTab }) => {
  const t = TRANSLATIONS[lang];
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [fileList, setFileList] = useState<RepoFile[]>(() => {
    const saved = localStorage.getItem('apsm_edited_files');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return REPO_FILES;
      }
    }
    return REPO_FILES;
  });
  const [selectedFile, setSelectedFile] = useState<RepoFile>(fileList[0]);
  const [fileCopied, setFileCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(fileList[0].content || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // When selectedFile changes, update editor content
  const handleSelectFile = (file: RepoFile) => {
    setSelectedFile(file);
    setEditedContent(file.content || '');
    setIsEditing(false);
  };

  const handleSaveFile = () => {
    const updated = fileList.map((f) => 
      f.name === selectedFile.name ? { ...f, content: editedContent } : f
    );
    setFileList(updated);
    setSelectedFile({ ...selectedFile, content: editedContent });
    localStorage.setItem('apsm_edited_files', JSON.stringify(updated));
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetFile = () => {
    const original = REPO_FILES.find((f) => f.name === selectedFile.name);
    if (original) {
      const updated = fileList.map((f) => 
        f.name === selectedFile.name ? { ...f, content: original.content } : f
      );
      setFileList(updated);
      setSelectedFile(original);
      setEditedContent(original.content || '');
      localStorage.setItem('apsm_edited_files', JSON.stringify(updated));
      setIsEditing(false);
    }
  };

  const appendMyKey = (key: string = 'SM~(10999=(SIAM)=10999)~SM') => {
    const newContent = (editedContent || '') + `\n# Custom Key\n${key}\n`;
    setEditedContent(newContent);
    setIsEditing(true);
  };

  const termuxCommands = [
    { title: '1. Update Termux Packages', cmd: 'pkg update && pkg upgrade -y' },
    { title: '2. Install Python & Git', cmd: 'pkg install python git -y' },
    { title: '3. Install Required Dependencies', cmd: 'pip install pyotp requests pycryptodome' },
    { title: '4. Clone Siam AP-SM Repository', cmd: 'git clone https://github.com/SIAM-TEAM-143/AP-SM.git' },
    { title: '5. Navigate & Launch V7 Tool', cmd: 'cd AP-SM && python SM7.py' },
  ];

  const fullOneLiner = 'pkg update -y && pkg install python git -y && pip install pyotp requests && git clone https://github.com/SIAM-TEAM-143/AP-SM.git && cd AP-SM && python SM7.py';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const copyFileText = (content?: string) => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setFileCopied(true);
    setTimeout(() => setFileCopied(false), 2000);
  };

  const downloadFile = (file: RepoFile) => {
    const textToDownload = file.name === selectedFile.name ? (editedContent || file.content || '') : (file.content || '');
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Hero Clone Card */}
      <div className="bg-gradient-to-r from-[#0d1624] via-[#0f1b2b] to-[#0a1420] border border-emerald-500/30 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                GIT CLONED
              </span>
              <span className="text-xs font-mono text-slate-400">
                Branch: <span className="text-slate-200">main</span>
              </span>
              <span className="text-xs font-mono text-slate-400">
                Architecture: <span className="text-emerald-400">ARM64 (aarch64)</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-emerald-400" />
              {REPO_METADATA.fullName}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              {lang === 'bn' 
                ? 'সিয়াম টিম ১৪৩ এর অফিসিয়াল AP-SM টুল রিপোজিটরি। টার্মাক্স অটোমেশন, ২এফএ টিওটিপি কোড জেনারেশন, এবং মেটা এপ্রুভাল লাইসেন্স ভেরিফায়ার ইঞ্জিন।'
                : 'Official SIAM-TEAM-143 AP-SM tool repository. Built for Termux Android automation, 2FA/TOTP authenticator, and Meta approval license key validation.'
              }
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
            <button
              onClick={() => onNavigateToTab('terminal')}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors flex items-center gap-2 shadow-lg shadow-emerald-950"
            >
              <Terminal className="w-4 h-4" />
              <span>{lang === 'bn' ? 'টার্মিনালে টেস্ট করুন' : 'Test in Terminal'}</span>
            </button>
            <button
              onClick={() => onNavigateToTab('approval')}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors flex items-center gap-2 border border-slate-700"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? 'কী ভ্যালিডেটর' : 'Key Validator'}</span>
            </button>
            <a
              href={REPO_METADATA.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-sm transition-colors flex items-center gap-1.5 border border-slate-800"
            >
              <ExternalLink className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* All-In-One Clone & Run Command */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
            <span>{lang === 'bn' ? '১-ক্লিকে টার্মাক্স ফুল কমান্ড কপি করুন:' : '1-Click All-in-One Termux Command:'}</span>
            <button
              onClick={() => copyToClipboard(fullOneLiner, 'full')}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              {copiedCmd === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd === 'full' ? t.copied : t.copyCmd}</span>
            </button>
          </div>
          <div className="bg-[#060a10] border border-slate-800 rounded-lg p-3 font-mono text-xs text-emerald-400 overflow-x-auto flex items-center justify-between">
            <code>{fullOneLiner}</code>
          </div>
        </div>
      </div>

      {/* Grid: Termux Step-by-Step Instructions & Architecture Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Step-by-Step Commands */}
        <div className="lg:col-span-2 bg-[#0d131f] border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              {t.cloneCmdTitle}
            </h2>
            <span className="text-xs text-slate-400 font-mono">Termux / Kali / Ubuntu</span>
          </div>

          <div className="space-y-2.5">
            {termuxCommands.map((step, idx) => (
              <div 
                key={idx}
                className="bg-[#080d15] border border-slate-800/90 rounded-lg p-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>{step.title}</span>
                  <button
                    onClick={() => copyToClipboard(step.cmd, `step-${idx}`)}
                    className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 font-mono text-[11px]"
                  >
                    {copiedCmd === `step-${idx}` ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-[#03060a] rounded px-2.5 py-1.5 font-mono text-xs text-emerald-300 select-all overflow-x-auto">
                  $ {step.cmd}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Architecture & Module Specifications */}
        <div className="space-y-4">
          <div className="bg-[#0d131f] border border-slate-800/80 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              {lang === 'bn' ? 'আর্কিটেকচার ও সিস্টেম বিবরণ' : 'Architecture & Runtime Specs'}
            </h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Target OS</span>
                <span className="text-slate-200 font-mono">Android (Termux)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">CPU Architecture</span>
                <span className="text-emerald-400 font-mono font-semibold">ARM64 / aarch64</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Python Version</span>
                <span className="text-slate-200 font-mono">3.13 (CPython)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Approval System</span>
                <span className="text-sky-400 font-mono">SM~(ID=(SIAM)=ID)~SM</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Binary Modules</span>
                <span className="text-amber-400 font-mono">Cython .so Shared Libs</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300/90 leading-relaxed">
              {lang === 'bn'
                ? 'লক্ষ্য করুন: স্ক্রিপ্টটিতে platform.architecture() চেকার রয়েছে যা শুধুমাত্র 64-বিট ফোনে রান হয়। ৩২-বিট ফোনে "32bit Not Supported!" প্রদর্শন করে।'
                : 'Notice: As coded in META.py and SM7.py, 64-bit architecture is required. 32-bit devices will report "32bit Not Supported!".'
              }
            </div>
          </div>

          <div className="bg-[#0d131f] border border-slate-800/80 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-400" />
              {lang === 'bn' ? 'অ্যাডমিন ও সহায়তা' : 'Support & Admin Telegram'}
            </h3>
            <p className="text-xs text-slate-300">
              {lang === 'bn'
                ? 'টুলটি ব্যবহারের জন্য হার্ডওয়্যার টোকেন অনুমোদন প্রয়োজন। অনুমোদনের জন্য টেলিগ্রামে সিয়াম ভাইয়ের সাথে যোগাযোগ করুন।'
                : 'The tool uses hardware tokens for activation. Contact Admin Siam Khan on Telegram for key approval.'
              }
            </p>
            <a
              href={REPO_METADATA.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Telegram: @SMSIAMSM</span>
            </a>
          </div>
        </div>
      </div>

      {/* Cloned Repository File Explorer */}
      <div className="bg-[#0d131f] border border-slate-800/80 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-emerald-400" />
              {lang === 'bn' ? 'রিপোজিটরি ফাইল এক্সপ্লোরার' : 'Repository File Explorer'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn' 
                ? 'ক্লোন করা রিপোজিটরির ফাইলসমূহ ব্রাউজ ও ডাউনলোড করুন' 
                : 'Browse and inspect files cloned from SIAM-TEAM-143/AP-SM'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'ফাইল সংরক্ষিত হয়েছে!' : 'File Saved!'}
              </span>
            )}
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/20">
              {fileList.length} Files Cloned
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* File List Navigation (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {fileList.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => handleSelectFile(file)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : 'bg-[#080d15] border-slate-800/80 text-slate-300 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    {file.type === 'code' && <Code2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                    {file.type === 'config' && <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                    {file.type === 'binary' && <Cpu className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />}
                    {file.type === 'doc' && <FileCode2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
                    
                    <div className="truncate">
                      <div className="font-mono text-xs font-semibold truncate">{file.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {lang === 'bn' ? file.descriptionBn : file.description}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 mt-0.5">{file.size}</span>
                </button>
              );
            })}
          </div>

          {/* File Content Preview & Live Editor (Right 8 cols) */}
          <div className="lg:col-span-8 bg-[#060a10] border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white">{selectedFile.name}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedFile.size}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    {selectedFile.type.toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedFile.type !== 'binary' && (
                    <>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 border transition-colors ${
                          isEditing
                            ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isEditing ? (lang === 'bn' ? 'প্রিভিউ দেখুন' : 'View Mode') : (lang === 'bn' ? 'এডিট করুন' : 'Edit File')}</span>
                      </button>

                      {isEditing && (
                        <>
                          <button
                            onClick={handleSaveFile}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono flex items-center gap-1 border border-emerald-500 transition-colors"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{lang === 'bn' ? 'সেভ করুন' : 'Save'}</span>
                          </button>
                          <button
                            onClick={handleResetFile}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1 border border-slate-700 transition-colors"
                            title="Reset to Original"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </>
                  )}

                  <button
                    onClick={() => copyFileText(isEditing ? editedContent : selectedFile.content)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 border border-slate-700 transition-colors"
                  >
                    {fileCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{fileCopied ? t.copied : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile(selectedFile)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 border border-slate-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.download}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  {lang === 'bn' ? selectedFile.descriptionBn : selectedFile.description}
                </p>
                {selectedFile.name.includes('.txt') && (
                  <button
                    onClick={() => appendMyKey()}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>+ {lang === 'bn' ? 'আমার কী যুক্ত করুন' : 'Append Custom Key'}</span>
                  </button>
                )}
              </div>

              {/* Code Pre Container or Textarea Editor */}
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    rows={13}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full bg-[#03060a] border border-amber-500/50 rounded p-3 font-mono text-xs text-amber-200 focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                    <span>{lang === 'bn' ? 'এডিটিং মোড সক্রিয়: সেভ করলে অ্যাপে আপডেট হবে।' : 'Editing Mode Active. Save to update in-app.'}</span>
                    <button
                      onClick={handleSaveFile}
                      className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'পরিবর্তন সেভ করুন' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <pre className="font-mono text-xs text-emerald-400/90 bg-[#020408] border border-slate-800/80 rounded p-3.5 overflow-x-auto max-h-[340px] leading-relaxed">
                    <code>{selectedFile.content || 'Binary data compiled for aarch64 Android'}</code>
                  </pre>
                </div>
              )}
            </div>

            {selectedFile.name.includes('.txt') && !isEditing && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  {lang === 'bn' ? 'অনুমোদন তালিকা পরীক্ষা করতে চান?' : 'Want to inspect and validate these approved keys?'}
                </span>
                <button
                  onClick={() => onNavigateToTab('approval')}
                  className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                >
                  <span>{lang === 'bn' ? 'কী ম্যানেজারে যান' : 'Go to Key Manager'}</span>
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compatibility & File Analysis Section (Detailed Answers to User Query) */}
      <div className="bg-[#0d131f] border border-slate-800/80 rounded-xl p-5 space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            {lang === 'bn' ? 'টুল ও ফাইল রান করার নির্দেশিকা এবং প্রায়শই জিজ্ঞাসিত প্রশ্ন (FAQ)' : 'Tool Compatibility & Execution Analysis'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'bn' 
              ? 'টার্মাক্সে টুলটি চালানো, এডিট করা এবং এর সীমাবদ্ধতা সম্পর্কে বিস্তারিত তথ্য'
              : 'Detailed breakdown of file availability, custom editability, and Termux execution reliability'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Question 1: Are all files present to run? */}
          <div className="bg-[#080d15] border border-slate-800 rounded-lg p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <h3 className="text-xs font-bold text-white">
                {lang === 'bn' ? '১. ফাইল রান করার জন্য কি সব কিছু আছে?' : '1. Does it have all files to run?'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'bn'
                ? 'হ্যাঁ, রিপোজিটরিতে মূল রানার ফাইলগুলো (SM7.py, META.py, SM-OTP.py) এবং কম্পাইল্ড বাইনারি (.so) ফাইলগুলো বিদ্যমান রয়েছে। তবে মনে রাখবেন—প্রধান লজিকটি সরাসরি ওপেন পাইথন কোড নয়, বরং Cython দ্বারা cpython-313 আর্কিটেকচারে কম্পাইল করা।'
                : 'Yes, the repository contains the launcher scripts (SM7.py, META.py, SM-OTP.py) and compiled .so binaries (v7, metasmct, xotp). However, the core logic is compiled Cython bytecode for Python 3.13.'
              }
            </p>
          </div>

          {/* Question 2: Can I edit the file? */}
          <div className="bg-[#080d15] border border-slate-800 rounded-lg p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-400 shrink-0" />
              <h3 className="text-xs font-bold text-white">
                {lang === 'bn' ? '২. নিজের মতো এডিট করা যাবে কি?' : '2. Can I edit and customize the files?'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'bn'
                ? 'Approval.txt এবং apvl.txt ফাইলগুলো সাধারণ টেক্সট হওয়ায় আপনি নিজের মতো আপনার টোকেন কী অ্যাড/এডিট করতে পারবেন। কিন্তু .so ফাইলগুলো মেশিন কোড হওয়ায় এডিট করা যায় না। আমাদের এই ওয়েব অ্যাপে আপনি যেকোনো ফাইল লাইভ এডিট ও ডাউনলোড করতে পারবেন।'
                : 'Approval.txt and apvl.txt are plain text and fully editable with your own hardware keys. The .so binary files cannot be text-edited. In this web app, you can edit and download modified files anytime.'
              }
            </p>
          </div>

          {/* Question 3: Will it run properly on Termux? */}
          <div className="bg-[#080d15] border border-slate-800 rounded-lg p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-sky-400 shrink-0" />
              <h3 className="text-xs font-bold text-white">
                {lang === 'bn' ? '৩. টার্মাক্সে ভালো মতো চলবে কি?' : '3. Will it run smoothly in Termux?'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'bn'
                ? 'টার্মাক্সে চলার জন্য আপনার ফোন অবশ্যই ARM64 (64-bit) হতে হবে এবং Python ভার্সন ঠিক ৩.১৩ হতে হবে। অন্যথায় ABI mismatch হতে পারে। ব্রাউজারে ঝামেলাহীন ব্যবহারের জন্য আমরা এই ওয়েব ড্যাশবোর্ড ও টার্মিনাল তৈরি করেছি।'
                : 'To run smoothly in Termux, your phone MUST be ARM64 (64-bit) and running Python 3.13. Otherwise binary mismatch occurs. Our web dashboard provides zero-error execution directly in browser.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
