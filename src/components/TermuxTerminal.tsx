import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Play, 
  Trash2, 
  RefreshCw, 
  Copy, 
  Check, 
  HelpCircle,
  ShieldCheck,
  Key
} from 'lucide-react';
import { Language, TerminalLine } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { INITIAL_APPROVED_KEYS, REPO_METADATA } from '../data/repoFiles';
import { formatKey, extractKeyNumber, generateFullKey, checkKeyApproval } from '../utils/approval';

interface TermuxTerminalProps {
  lang: Language;
}

const SIAM_BANNER = `\x1b[32m
   ____ ___    _    __  __   ____  __  __ 
  / ___|_ _|  / \\  |  \\/  | / ___||  \\/  |
  \\___ \\| |  / _ \\ | |\\/| | \\___ \\| |\\/| |
   ___) | | / ___ \\| |  | |  ___) | |  | |
  |____/___/_/   \\_\\_|  |_| |____/|_|  |_|
\x1b[0m
\x1b[36m  +-------------------------------------------------+
  |  TOOL NAME : ISMAIL AP-SM V7.0 (ACTIVE)         |
  |  AUTHOR    : ISMAIL (12015 VIP OWNER)           |
  |  GITHUB    : https://github.com/ismailislamrony1|
  |  APPROVAL  : \x1b[33mSM~(12015=(SIAM)=12015)~SM\x1b[36m         |
  |  STATUS    : \x1b[32mTOOL IS ON (ONLINE & APPROVED)\x1b[36m     |
  +-------------------------------------------------+\x1b[0m`;

export const TermuxTerminal: React.FC<TermuxTerminalProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'l_banner',
      type: 'banner',
      text: SIAM_BANNER,
    },
    {
      id: 'l_welcome',
      type: 'system',
      text: 'Termux Android ARM64 Python 3.13 Runtime Initialized.\nType "help" or select a script above to execute.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [waitingForKey, setWaitingForKey] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addLine = (type: TerminalLine['type'], text: string) => {
    setLines((prev) => [...prev, { id: 'l_' + Date.now() + Math.random(), type, text }]);
  };

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    addLine('input', `$ ${cmd}`);
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputVal('');

    if (waitingForKey) {
      handleKeySubmission(cmd);
      return;
    }

    const lower = cmd.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      setLines([]);
      return;
    }

    if (lower === 'help' || lower === 'menu') {
      addLine('output', `Available AP-SM Commands:
  python SM7.py       - Launch main V7.0 automation menu with license check
  python META.py      - Launch Meta/Facebook tools module
  python SM-OTP.py    - Launch 2FA TOTP and OTP receiver module
  approval            - List all approved Admin and Paid user keys
  generate-key        - Generate a new device hardware token
  status              - Check SIAM-TEAM server connectivity
  whoami              - Show current Termux session user
  uname -m            - Check device CPU architecture (ARM64 requirement)
  cat Approval.txt    - Print Approval.txt file contents
  cat apvl.txt        - Print apvl.txt file contents
  git pull            - Update repository to latest main branch
  clear               - Clear terminal screen`);
      return;
    }

    if (lower === 'python sm7.py' || lower === 'python sm7' || lower === 'sm7') {
      addLine('system', '[*] Checking device architecture: aarch64 64-bit... [OK]');
      addLine('system', '[*] Loading compiled binary: v7.cpython-313-aarch64-linux-android.so');
      addLine('output', '\n[?] Please enter your AP-SM Approval Token (e.g. SM~(10453=(SIAM)=10453)~SM or 10453):');
      setWaitingForKey(true);
      return;
    }

    if (lower === 'python meta.py' || lower === 'python meta') {
      addLine('system', '[*] Checking device architecture: 64-bit... [OK]');
      addLine('system', '[*] Loading metasmct module...');
      addLine('success', `
[+] META AUTOMATION MODULE V7.0
[1] Auto Create FB Account (Method 1)
[2] Auto Create FB Account (Method 2 - Temp Mail)
[3] Auto Create FB Account (Method 3 - Temp Mix Number)
[4] Check Facebook Checkpoint / 2FA
[0] Exit to Main Menu
`);
      return;
    }

    if (lower === 'python sm-otp.py' || lower === 'python sm-otp' || lower === 'otp') {
      addLine('system', '[*] Initializing pyotp & xotp engine...');
      addLine('success', `
[+] AP-SM 2FA / TOTP AUTHENTICATOR & OTP LISTENER
[1] Generate 6-Digit TOTP from Secret Key
[2] Listen to DongvanFB incoming verification OTP
[3] Temp Mail Auto OTP fetcher
[4] Back to main menu
`);
      return;
    }

    if (lower === 'approval' || lower === 'cat approval.txt' || lower === 'cat apvl.txt') {
      addLine('output', `#_________/Admin\\________
SM~(12015=(SIAM)=12015)~SM (Owner Ismail VIP - Lifetime Approved)
SM~(10453=(SIAM)=10453)~SM (Siam Super Admin)
SM~(10462=(SIAM)=10462)~SM (Rakib vai admin 1)

#_________/paid user\\________
SM~(12015=(SIAM)=12015)~SM (Ismail VIP Active)
SM~(10452=(SIAM)=10452)~SM (Roki - 1day meta tols)
SM~(10350=(SIAM)=10350)~SM (3 days $2.50)
SM~(10352=(SIAM)=10352)~SM (3 days $2.50)
SM~(10361=(SIAM)=10361)~SM (30 days 600 BDT)
SM~(10481=(SIAM)=10481)~SM (20 sep last)
SM~(10689=(SIAM)=10689)~SM (Evann 5$)
SM~(10375=(SIAM)=10375)~SM (1 day free)`);
      return;
    }

    if (lower === 'generate-key' || lower === 'key') {
      const token = generateFullKey();
      addLine('success', `[+] NEW HARDWARE TOKEN GENERATED:
    ${token.rawKey}
[*] Key ID : ${token.keyNumber}
[*] To approve, send this token to @SMSIAMSM on Telegram.`);
      return;
    }

    if (lower === 'status') {
      addLine('output', `[*] Connecting to https://raw.githubusercontent.com/SIAM-TEAM-143/Server/...
[+] SERVER RESPONSE: TOOL IS ON
[+] ALL AP-SM CLOUD ENGINES ONLINE.`);
      return;
    }

    if (lower === 'whoami') {
      addLine('output', 'u0_a234 (termux-user)');
      return;
    }

    if (lower === 'uname -m' || lower === 'uname -a') {
      addLine('output', 'Linux localhost 5.15.78-android14-arm64 #1 SMP PREEMPT aarch64 Android');
      return;
    }

    if (lower === 'git pull') {
      addLine('system', 'Updating SIAM-TEAM-143/AP-SM...');
      addLine('success', 'Already up to date on branch main.');
      return;
    }

    if (lower === 'ls' || lower === 'dir') {
      addLine('output', 'Approval.txt  apvl.txt  ASM.py  META.py  metasmct.so  README.md  SM7.py  SM-OTP.py  smup6.so  v5.py  v7.so  xotp.so  XXSM.py');
      return;
    }

    addLine('error', `bash: ${cmd}: command not found. Type "help" for a list of valid commands.`);
  };

  const handleKeySubmission = (key: string) => {
    setWaitingForKey(false);
    addLine('system', `[*] Validating token with master database...`);
    const result = checkKeyApproval(key, INITIAL_APPROVED_KEYS);

    if (result.approved && result.entry) {
      addLine('success', `[+] APPROVAL SUCCESS!
========================================
[+] User    : ${result.entry.name}
[+] Status  : AUTHORIZED (${result.entry.type.toUpperCase()})
[+] Duration: ${result.entry.duration}
[+] Token   : ${result.formattedKey}
========================================
[+] WELCOME TO AP-SM V7.0 MASTER DASHBOARD!
[1] FB Auto Creation Engine (Multi-Thread)
[2] Meta 2FA TOTP Auto Generator
[3] Temp Mail & SMS OTP Fetcher
[4] Proxy Scraper & Checker
[5] Device Token Settings
`);
    } else {
      addLine('error', `[-] ERROR: YOUR TOKEN IS NOT APPROVED!
[*] Your Token : ${result.formattedKey}
[*] Contact Admin SIAM KHAN to approve your key:
    Telegram: https://t.me/SMSIAMSM?text=Hello%20Sir%20!%20Please%20Approve%20My%20Token%20The%20Token%20Is%20:%20${encodeURIComponent(result.formattedKey)}
[!] Execution halted. Type "python SM7.py" to try again.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Terminal Header & Quick Commands */}
      <div className="bg-[#0d131f] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-emerald-400" />
            {t.terminalTitle}
          </h2>
          <p className="text-xs text-slate-400">
            {t.terminalDesc}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleCommand('python SM7.py')}
            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs flex items-center gap-1 transition-colors"
          >
            <Play className="w-3 h-3" />
            <span>python SM7.py</span>
          </button>
          <button
            onClick={() => handleCommand('python META.py')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1 border border-slate-700 transition-colors"
          >
            <span>python META.py</span>
          </button>
          <button
            onClick={() => handleCommand('python SM-OTP.py')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1 border border-slate-700 transition-colors"
          >
            <span>python SM-OTP.py</span>
          </button>
          <button
            onClick={() => handleCommand('approval')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1 border border-slate-700 transition-colors"
          >
            <span>approval</span>
          </button>
          <button
            onClick={() => handleCommand('clear')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
            title="Clear Terminal"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Screen */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="bg-[#03060a] border border-emerald-950/80 rounded-xl p-4 sm:p-5 font-mono text-xs shadow-2xl min-h-[460px] max-h-[580px] overflow-y-auto cursor-text flex flex-col justify-between"
      >
        <div className="space-y-2">
          {lines.map((line) => {
            if (line.type === 'banner') {
              return (
                <pre key={line.id} className="text-emerald-400 leading-none whitespace-pre overflow-x-auto py-1">
                  {line.text}
                </pre>
              );
            }
            if (line.type === 'input') {
              return (
                <div key={line.id} className="text-slate-200 font-semibold">
                  <span className="text-emerald-400">siam@termux:~$ </span>
                  {line.text.replace('$ ', '')}
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={line.id} className="text-rose-400 whitespace-pre-wrap leading-relaxed">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'success') {
              return (
                <div key={line.id} className="text-emerald-400 whitespace-pre-wrap leading-relaxed font-semibold">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'system') {
              return (
                <div key={line.id} className="text-sky-400 whitespace-pre-wrap leading-relaxed">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={line.id} className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {line.text}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input prompt line */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-900 mt-3">
          <span className="text-emerald-400 font-bold shrink-0">
            {waitingForKey ? 'key>' : 'siam@termux:~$'}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent text-slate-100 outline-none font-mono text-xs"
            placeholder={waitingForKey ? 'Paste approval key here and press Enter...' : 'Type a command (try "help", "python SM7.py", "approval")...'}
          />
        </div>
      </div>
    </div>
  );
};
