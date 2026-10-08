import React, { useState } from 'react';
import { 
  FolderGit2, 
  KeyRound, 
  ShieldCheck, 
  Mail, 
  Users, 
  Terminal, 
  Send,
  GitFork,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Language } from './types';
import { TRANSLATIONS } from './data/translations';
import { REPO_METADATA } from './data/repoFiles';
import { Navbar } from './components/Navbar';
import { RepoOverview } from './components/RepoOverview';
import { ApprovalManager } from './components/ApprovalManager';
import { TotpAuthenticator } from './components/TotpAuthenticator';
import { TempMailOtp } from './components/TempMailOtp';
import { IdentityGenerator } from './components/IdentityGenerator';
import { TermuxTerminal } from './components/TermuxTerminal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [lang, setLang] = useState<Language>('bn'); // Default to Bangla since user prompted in Bangla/Banglish!
  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-slate-950 border-b border-emerald-500/20 px-4 py-2 text-xs text-emerald-300/90 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 max-w-2xl truncate">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white">
            {lang === 'bn' ? 'গিট ক্লোন সম্পন্ন:' : 'Cloned Successfully:'}
          </span>
          <span className="font-mono text-emerald-400 truncate">
            https://github.com/SIAM-TEAM-143/AP-SM.git
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs shrink-0 font-mono">
          <span className="text-slate-400">
            Status: <span className="text-emerald-400 font-bold">TOOL IS ON</span>
          </span>
          <a
            href={REPO_METADATA.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <Send className="w-3 h-3" />
            <span>@SMSIAMSM</span>
          </a>
        </div>
      </div>

      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {currentTab === 'overview' && (
          <RepoOverview lang={lang} onNavigateToTab={setCurrentTab} />
        )}
        {currentTab === 'approval' && (
          <ApprovalManager lang={lang} />
        )}
        {currentTab === 'totp' && (
          <TotpAuthenticator lang={lang} />
        )}
        {currentTab === 'tempmail' && (
          <TempMailOtp lang={lang} />
        )}
        {currentTab === 'profiles' && (
          <IdentityGenerator lang={lang} />
        )}
        {currentTab === 'terminal' && (
          <TermuxTerminal lang={lang} />
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0f19]/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {[
          { id: 'overview', label: 'Repo', icon: FolderGit2 },
          { id: 'approval', label: 'Keys', icon: KeyRound },
          { id: 'totp', label: '2FA', icon: ShieldCheck },
          { id: 'tempmail', label: 'Mail', icon: Mail },
          { id: 'profiles', label: 'Users', icon: Users },
          { id: 'terminal', label: 'Shell', icon: Terminal },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-all ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#05080e] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">SIAM TEAM AP-SM Tool Hub</span>
            <span>·</span>
            <span>Created by Siam Khan &amp; Rakib Vai</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <a
              href={REPO_METADATA.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>GitHub Repository</span>
            </a>
            <a
              href={REPO_METADATA.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Telegram Support</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
