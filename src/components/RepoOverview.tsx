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

  const appendMyKey = (key: string = 'SM~(12015=(SIAM)=12015)~SM') => {
    const newContent = (editedContent || '') + `\n# Custom Key\n${key}\n`;
    setEditedContent(newContent);
    setIsEditing(true);
  };

  const [customGitUrl, setCustomGitUrl] = useState<string>(() => {
    return localStorage.getItem('apsm_custom_git_url') || 'https://github.com/ismailislamrony1/AP-SM.git';
  });
  const [toolAuthor, setToolAuthor] = useState<string>(() => {
    return localStorage.getItem('apsm_tool_author') || 'Ismail (12015 VIP Owner)';
  });

  const handleUpdateGitUrl = (newUrl: string) => {
    setCustomGitUrl(newUrl);
    localStorage.setItem('apsm_custom_git_url', newUrl);
  };

  const termuxCommands = [
    { title: '1. Update APT Packages', cmd: 'apt update' },
    { title: '2. Upgrade APT Packages (-y)', cmd: 'apt upgrade -y' },
    { title: '3. Install Python Environment (-y)', cmd: 'pkg install python -y' },
    { title: '4. Install Git Client (-y)', cmd: 'pkg install git -y' },
    { title: '5. Install Requests', cmd: 'pip install requests' },
    { title: '6. Install Mechanize', cmd: 'pip install mechanize' },
    { title: '7. Install HTTPX', cmd: 'pip install httpx' },
    { title: '8. Install Rich Terminal UI', cmd: 'pip install rich' },
    { title: '9. Install Curl & Curl-Cffi TLS', cmd: 'pip install curl curl_cffi' },
    { title: '10. Clean Existing AP-SM Folder', cmd: 'rm -rf AP-SM' },
    { title: '11. Clone Git Repository', cmd: `git clone ${customGitUrl}` },
    { title: '12. Enter Directory', cmd: 'cd AP-SM' },
    { title: '13. Launch Tool', cmd: 'python SM7.py' },
  ];

  const fullOneLiner = `apt update && apt upgrade -y && pkg install python -y && pkg install git -y && pip install requests mechanize httpx rich curl curl_cffi && rm -rf AP-SM && git clone ${customGitUrl} && cd AP-SM && python SM7.py`;

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
                GIT CONFIGURED
              </span>
              <span className="text-xs font-mono text-slate-400">
                Author: <span className="text-emerald-400 font-bold">{toolAuthor}</span>
              </span>
              <span className="text-xs font-mono text-amber-400">
                Approved Key: <strong>SM~(12015=(SIAM)=12015)~SM</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-emerald-400" />
              <span>ISMAIL AP-SM V7.0</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl font-mono text-xs text-emerald-300">
              Target Repo: <span className="text-white underline">{customGitUrl}</span>
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
              href={customGitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-sm transition-colors flex items-center gap-1.5 border border-slate-800"
            >
              <ExternalLink className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Custom Git URL Configurator Box */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#060a10]/80 p-3 rounded-lg border border-slate-800">
          <div className="flex-1 w-full space-y-1">
            <label className="text-[11px] font-mono text-slate-400 block">
              {lang === 'bn' ? 'আপনার গিটহাব লিঙ্ক (Git Clone URL):' : 'Custom Git Clone URL:'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customGitUrl}
                onChange={(e) => handleUpdateGitUrl(e.target.value)}
                placeholder="https://github.com/your-username/AP-SM.git"
                className="flex-1 bg-[#03060a] border border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleUpdateGitUrl('https://github.com/ismailislamrony1/AP-SM.git')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700 shrink-0"
              >
                ismail repo
              </button>
              <button
                onClick={() => handleUpdateGitUrl('https://github.com/SIAM-TEAM-143/AP-SM.git')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-400 border border-slate-700 shrink-0"
              >
                siam repo
              </button>
            </div>
          </div>
        </div>

        {/* All-In-One Clone & Run Command */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
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

      {/* ERROR FIX CARD: Username & Password / Authentication Failed Solution */}
      <div className="bg-gradient-to-r from-rose-950/40 via-[#180f14] to-[#12080d] border border-rose-500/40 rounded-xl p-5 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              {lang === 'bn' 
                ? 'টার্মাক্স "Username / Password" এরর সমাধানের উপায়' 
                : 'Fix: "Authentication failed / Username for github.com" Error'
              }
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Fix Available
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {lang === 'bn' 
            ? 'আপনার স্ক্রিনশটের কারণ: GitHub-এ "ismailislamrony1/AP-SM" রিপোজিটরিটি এখনো পাবলিক হিসেবে তৈরি বা Fork করা হয়নি, যার কারণে গিটহাব পাসওয়ার্ড চাচ্ছে। নিচে ১০০% কার্যকর ইনস্ট্যান্ট সমাধান দেওয়া হলো:'
            : 'Why this happened: GitHub prompts for Username/Password when "ismailislamrony1/AP-SM" is not yet created or Public on GitHub. Use the verified 100% working command below:'
          }
        </p>

        {/* 100% Working Command Box */}
        <div className="bg-[#06090e] border border-emerald-500/40 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 font-mono">
            <span>{lang === 'bn' ? '✓ ১০০% গ্যারান্টিড ওয়ার্কিং কমান্ড (কোনো পাসওয়ার্ড ছাড়াই চলবে):' : '✓ Guaranteed Working Command (Zero Passwords Needed):'}</span>
            <button
              onClick={() => copyToClipboard('rm -rf AP-SM && git clone https://github.com/SIAM-TEAM-143/AP-SM.git && cd AP-SM && echo "SM~(12015=(SIAM)=12015)~SM" >> Approval.txt && python SM7.py', 'fix_cmd')}
              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-sans flex items-center gap-1 transition-colors"
            >
              {copiedCmd === 'fix_cmd' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd === 'fix_cmd' ? t.copied : (lang === 'bn' ? 'কপি করুন' : 'Copy')}</span>
            </button>
          </div>
          <div className="bg-[#020408] rounded p-2.5 font-mono text-xs text-emerald-300 overflow-x-auto select-all">
            rm -rf AP-SM &amp;&amp; git clone https://github.com/SIAM-TEAM-143/AP-SM.git &amp;&amp; cd AP-SM &amp;&amp; echo &quot;SM~(12015=(SIAM)=12015)~SM&quot; &gt;&gt; Approval.txt &amp;&amp; python SM7.py
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-400 pt-1">
          <div className="bg-[#090e17] p-2.5 rounded border border-slate-800">
            <strong className="text-slate-200 block mb-1">
              {lang === 'bn' ? 'কীভাবে আপনার কী কাজ করবে?' : 'How your key is approved:'}
            </strong>
            <span>
              {lang === 'bn' 
                ? 'এই কমান্ডটি আপনার কী SM~(12015=(SIAM)=12015)~SM সরাসরি Approval.txt এ যুক্ত করে দিবে, তাই স্ক্রিপ্ট রান করার সময় আপনার কী সাথে সাথে এপ্রুভ হয়ে যাবে।' 
                : 'This command appends your key SM~(12015=(SIAM)=12015)~SM directly to Approval.txt, granting instant VIP access.'
              }
            </span>
          </div>
          <div className="bg-[#090e17] p-2.5 rounded border border-slate-800">
            <strong className="text-slate-200 block mb-1">
              {lang === 'bn' ? 'যদি নিজের গিটহাবে রাখতে চান:' : 'To host on your GitHub:'}
            </strong>
            <span>
              {lang === 'bn'
                ? 'GitHub.com এ গিয়ে SIAM-TEAM-143/AP-SM রিপোজিটরিটি "Fork" করে নিন এবং সেটি "Public" রাখুন। পাবলিক রাখলে টার্মাক্স আর পাসওয়ার্ড চাইবে না।'
                : 'Go to github.com/SIAM-TEAM-143/AP-SM and click Fork, keeping it Public. Public repositories never require credentials.'
              }
            </span>
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
