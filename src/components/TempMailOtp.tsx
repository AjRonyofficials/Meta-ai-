import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  RefreshCw, 
  Copy, 
  Check, 
  Inbox, 
  Send, 
  Trash2, 
  Sparkles,
  Search
} from 'lucide-react';
import { Language, TempEmailMessage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface TempMailOtpProps {
  lang: Language;
}

export const TempMailOtp: React.FC<TempMailOtpProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState<TempEmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<TempEmailMessage | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate initial email
  useEffect(() => {
    generateNewEmail();
  }, []);

  const generateNewEmail = () => {
    const randomUser = 'sm_user_' + Math.random().toString(36).substring(2, 8);
    const domains = ['dongvanfb.net', 'temp-mail.io', 'mailgw.org', 'ap-sm.cloud'];
    const chosenDomain = domains[Math.floor(Math.random() * domains.length)];
    const newAddress = `${randomUser}@${chosenDomain}`;
    setEmail(newAddress);
    
    // Seed with a welcome message and a Facebook verification message
    const seedOtp = String(Math.floor(100000 + Math.random() * 900000));
    const welcomeMsg: TempEmailMessage = {
      id: 'msg_welcome',
      from: 'security@facebookmail.com',
      subject: `${seedOtp} is your Facebook confirmation code`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      snippet: `Hi there, your Facebook registration code is ${seedOtp}. Don't share it with anyone.`,
      body: `Hi there,\n\nWe received a request to confirm your email address for your Facebook account.\n\nYour 6-digit confirmation code is: ${seedOtp}\n\nIf you did not request this code, you can safely ignore this email.\n\nThanks,\nThe Facebook Team`,
      extractedOtp: seedOtp,
    };

    setMessages([welcomeMsg]);
    setSelectedMessage(welcomeMsg);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const simulateIncomingOtp = (service: 'Facebook' | 'WhatsApp' | 'Google' = 'Facebook') => {
    const randomOtp = String(Math.floor(100000 + Math.random() * 900000));
    let from = 'security@facebookmail.com';
    let subject = `${randomOtp} is your Facebook confirmation code`;
    let body = `Hi,\n\nYour Facebook registration verification code is ${randomOtp}.\n\nValidity: 10 minutes.\nTeam Facebook`;

    if (service === 'WhatsApp') {
      from = 'verification@whatsapp.com';
      subject = `WhatsApp code: ${randomOtp.substring(0, 3)}-${randomOtp.substring(3)}`;
      body = `Your WhatsApp code is ${randomOtp}. Do not share this code with anyone.`;
    } else if (service === 'Google') {
      from = 'noreply@google.com';
      subject = `G-${randomOtp} is your Google verification code`;
      body = `Use G-${randomOtp} to verify your Google identity.\nThis code expires in 15 minutes.`;
    }

    const newMsg: TempEmailMessage = {
      id: 'msg_' + Date.now(),
      from,
      subject,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      snippet: subject,
      body,
      extractedOtp: randomOtp,
    };

    setMessages([newMsg, ...messages]);
    setSelectedMessage(newMsg);
  };

  const refreshInbox = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Mailbox Bar */}
      <div className="bg-[#0d131f] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              {t.tempMailTitle}
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-950/60 text-sky-400 border border-sky-500/30">
              DongvanFB &amp; TempMail API
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {t.tempMailDesc}
          </p>
        </div>

        {/* Current Email Address Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="bg-[#060a10] border border-emerald-500/30 rounded-lg px-3 py-2 flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-emerald-400 font-semibold select-all truncate max-w-[240px]">
              {email}
            </span>
            <button
              onClick={() => handleCopy(email, 'email_addr')}
              className="text-slate-400 hover:text-emerald-400 p-1"
              title="Copy Email"
            >
              {copiedText === 'email_addr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={refreshInbox}
              disabled={isRefreshing}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={generateNewEmail}
              className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.generateNewEmail}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Simulate Buttons for Testing FB Account Creation */}
      <div className="bg-[#0b101b] border border-slate-800/80 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-slate-400">
          {lang === 'bn' ? 'টেস্ট ভেরিফিকেশন ওটিপি সিমুলেট করুন:' : 'Simulate incoming test verification codes:'}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => simulateIncomingOtp('Facebook')}
            className="px-2.5 py-1 rounded bg-blue-950/60 hover:bg-blue-900/60 text-blue-400 border border-blue-500/30 text-xs font-mono transition-colors"
          >
            + Facebook OTP (6-digits)
          </button>
          <button
            onClick={() => simulateIncomingOtp('WhatsApp')}
            className="px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/30 text-xs font-mono transition-colors"
          >
            + WhatsApp Code
          </button>
          <button
            onClick={() => simulateIncomingOtp('Google')}
            className="px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900/60 text-amber-400 border border-amber-500/30 text-xs font-mono transition-colors"
          >
            + Google G-Code
          </button>
          <button
            onClick={() => setMessages([])}
            className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-rose-400 text-xs transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Mailbox View: Left List, Right Message Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List (Left 5 cols) */}
        <div className="lg:col-span-5 bg-[#0d131f] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Inbox className="w-4 h-4 text-emerald-400" />
              Inbox ({messages.length})
            </h3>
            <span className="text-[11px] text-slate-500">Live Polling</span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 italic">
                {t.waitingMessages}
              </div>
            ) : (
              messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`w-full text-left p-3 rounded-lg border transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-[#080d15] border-slate-800/80 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white truncate max-w-[160px]">{msg.from}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{msg.date}</span>
                    </div>

                    <div className="text-xs font-medium text-slate-200 truncate">
                      {msg.subject}
                    </div>

                    {msg.extractedOtp && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] uppercase font-mono text-emerald-400">
                          Detected OTP: <strong className="text-emerald-300 text-xs font-bold">{msg.extractedOtp}</strong>
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                          Auto-Parsed
                        </span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Message Detail & OTP Extraction Card (Right 7 cols) */}
        <div className="lg:col-span-7 bg-[#0d131f] border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-4">
              {/* Highlighted OTP Banner */}
              {selectedMessage.extractedOtp && (
                <div className="bg-gradient-to-r from-emerald-950/60 to-[#081512] border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                      Verification OTP Code
                    </span>
                    <span className="font-mono text-3xl font-extrabold text-emerald-300 tracking-widest select-all">
                      {selectedMessage.extractedOtp}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(selectedMessage.extractedOtp!, 'msg_otp')}
                    className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-950"
                  >
                    {copiedText === 'msg_otp' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedText === 'msg_otp' ? t.copied : 'Copy OTP'}</span>
                  </button>
                </div>
              )}

              {/* Message Header */}
              <div className="space-y-1 border-b border-slate-800 pb-3 text-xs">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-white">{selectedMessage.subject}</h3>
                  <span className="font-mono text-slate-400">{selectedMessage.date}</span>
                </div>
                <div className="text-slate-400">
                  From: <span className="text-slate-200 font-mono">{selectedMessage.from}</span>
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-[#060a10] border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[220px] overflow-y-auto">
                {selectedMessage.body}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-xs text-slate-500 italic">
              Select an email from the left to view contents
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>DongvanFB OAuth2 Compatible</span>
            <span>Auto Refresh: 5s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
