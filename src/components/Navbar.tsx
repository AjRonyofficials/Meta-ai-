import React from 'react';
import { 
  FolderGit2, 
  KeyRound, 
  ShieldCheck, 
  Mail, 
  Users, 
  Terminal, 
  ExternalLink, 
  Languages, 
  Menu, 
  X,
  Send,
  Circle
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { REPO_METADATA } from '../data/repoFiles';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = TRANSLATIONS[lang];

  const navItems = [
    { id: 'overview', label: t.navOverview, icon: FolderGit2 },
    { id: 'approval', label: t.navApproval, icon: KeyRound },
    { id: 'totp', label: t.navTotp, icon: ShieldCheck },
    { id: 'tempmail', label: t.navTempMail, icon: Mail },
    { id: 'profiles', label: t.navProfiles, icon: Users },
    { id: 'terminal', label: t.navTerminal, icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/60 bg-[#0b0f17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              SM
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-100 tracking-tight text-base sm:text-lg">
                  {t.appTitle}
                </span>
                <span className="hidden sm:inline-flex items-center text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Circle className="w-1.5 h-1.5 fill-emerald-400 mr-1.5 animate-pulse" />
                  {t.statusOnline}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.appSubtitle} · <span className="font-mono text-emerald-400/90">{REPO_METADATA.latestVersion}</span>
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Telegram, GitHub, Language */}
          <div className="flex items-center space-x-2">
            {/* Telegram Link */}
            <a
              href={REPO_METADATA.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-mono bg-sky-950/40 text-sky-400 border border-sky-500/30 hover:bg-sky-900/40 transition-colors"
              title="Official Siam Team Telegram"
            >
              <Send className="w-3.5 h-3.5" />
              <span>@SMSIAMSM</span>
            </a>

            {/* GitHub Original Link */}
            <a
              href={REPO_METADATA.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-mono bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:bg-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-600/30 hover:bg-emerald-900/40 transition-colors"
              title="Toggle Language / ভাষা পরিবর্তন"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0d131f] px-4 pt-2 pb-4 space-y-1">
          <div className="py-2 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 mb-2">
            <span className="flex items-center">
              <Circle className="w-2 h-2 fill-emerald-400 mr-1.5 animate-pulse" />
              {t.statusOnline}
            </span>
            <a
              href={REPO_METADATA.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 font-mono flex items-center space-x-1"
            >
              <Send className="w-3 h-3" />
              <span>Telegram Admin</span>
            </a>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
