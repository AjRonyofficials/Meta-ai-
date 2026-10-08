import React, { useState } from 'react';
import { 
  Users, 
  RefreshCw, 
  Copy, 
  Check, 
  Download, 
  Smartphone, 
  Globe, 
  Shield, 
  Filter, 
  Sparkles,
  Server
} from 'lucide-react';
import { Language, GeneratedProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  generateBatchProfiles, 
  USER_AGENTS, 
  generateSingleProfile 
} from '../utils/identity';

interface IdentityGeneratorProps {
  lang: Language;
}

export const IdentityGenerator: React.FC<IdentityGeneratorProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [profiles, setProfiles] = useState<GeneratedProfile[]>(() => generateBatchProfiles(5, 'BD'));
  const [region, setRegion] = useState<'BD' | 'Global'>('BD');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // User agent tester
  const [selectedUa, setSelectedUa] = useState(USER_AGENTS[0].ua);

  // Proxy scraper tester (from ASM.py)
  const [proxyList, setProxyList] = useState<string[]>([]);
  const [isLoadingProxies, setIsLoadingProxies] = useState(false);

  const handleGenerate = (count: number = 5) => {
    setProfiles(generateBatchProfiles(count, region));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profiles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'apsm_profiles.json');
    downloadAnchor.click();
  };

  const exportCSV = () => {
    const headers = ['Full Name', 'First Name', 'Last Name', 'Email', 'Password', 'Phone', 'DOB', 'Gender', 'Country'];
    const rows = profiles.map(p => [
      `"${p.fullName}"`,
      `"${p.firstName}"`,
      `"${p.lastName}"`,
      `"${p.email}"`,
      `"${p.password}"`,
      `"${p.phone}"`,
      `"${p.dob}"`,
      `"${p.gender}"`,
      `"${p.country}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', 'apsm_profiles.csv');
    downloadAnchor.click();
  };

  const fetchProxies = async () => {
    setIsLoadingProxies(true);
    // Simulate or fetch public proxies as found in ASM.py: api.proxyscrape.com
    setTimeout(() => {
      const sampleProxies = [
        '103.152.112.162:8080 (BD/Dhaka - Socks4)',
        '185.199.229.156:7492 (US/Socks4 - Active)',
        '103.149.141.226:80 (BD/Chittagong - HTTP)',
        '110.44.118.234:8080 (SG/Singapore - Socks4)',
        '194.233.69.90:443 (DE/Frankfurt - Socks5)',
      ];
      setProxyList(sampleProxies);
      setIsLoadingProxies(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0d131f] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              {t.profilesTitle}
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              Bangla &amp; Global Identity Hub
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {t.profilesDesc}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Region toggle */}
          <div className="flex bg-[#060a10] border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => { setRegion('BD'); setProfiles(generateBatchProfiles(5, 'BD')); }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                region === 'BD' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇧🇩 Bangladesh
            </button>
            <button
              onClick={() => { setRegion('Global'); setProfiles(generateBatchProfiles(5, 'Global')); }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                region === 'Global' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌐 Global
            </button>
          </div>

          <button
            onClick={() => handleGenerate(5)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.generateBatch}</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={exportJSON}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Generated Profiles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((p, idx) => (
          <div
            key={p.id}
            className="bg-[#0d131f] border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 space-y-3 transition-all"
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase">
                  #{idx + 1} · {p.gender} · {p.country}
                </span>
                <h3 className="text-sm font-bold text-white">
                  {p.fullName}
                </h3>
              </div>
              <button
                onClick={() => handleCopy(`${p.fullName}\n${p.email}\n${p.password}\n${p.phone}`, p.id)}
                className="text-slate-400 hover:text-emerald-400 p-1"
                title="Copy Full Profile"
              >
                {copiedId === p.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between items-center bg-[#060a10] px-2.5 py-1.5 rounded">
                <span className="text-slate-500">Email:</span>
                <span className="text-emerald-300 truncate max-w-[170px]" title={p.email}>{p.email}</span>
              </div>
              <div className="flex justify-between items-center bg-[#060a10] px-2.5 py-1.5 rounded">
                <span className="text-slate-500">Pass:</span>
                <span className="text-amber-300 font-bold">{p.password}</span>
              </div>
              <div className="flex justify-between items-center bg-[#060a10] px-2.5 py-1.5 rounded">
                <span className="text-slate-500">Phone:</span>
                <span className="text-sky-300">{p.phone}</span>
              </div>
              <div className="flex justify-between items-center bg-[#060a10] px-2.5 py-1.5 rounded text-[11px]">
                <span className="text-slate-500">DOB:</span>
                <span className="text-slate-300">{p.dob}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate max-w-[200px]" title={p.userAgent}>
                UA: {p.userAgent.substring(0, 24)}...
              </span>
              <button
                onClick={() => handleCopy(p.userAgent, `ua_${p.id}`)}
                className="text-emerald-400 hover:underline shrink-0 ml-1"
              >
                {copiedId === `ua_${p.id}` ? 'Copied' : 'Copy UA'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* User-Agent Rotator & Proxy Scraper Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User-Agent Selector */}
        <div className="bg-[#0d131f] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Siam Tool User-Agent Rotator
            </h3>
            <span className="text-xs text-slate-400 font-mono">From ASM.py</span>
          </div>

          <p className="text-xs text-slate-300">
            {lang === 'bn' 
              ? 'টার্মাক্স স্ক্রিপ্টে ফেসবুক চেকপয়েন্ট এড়াতে ব্যবহৃত ডিভাইস ইউজার-এজেন্ট তালিকা:'
              : 'Device User-Agents referenced in ASM.py and META.py for bypassing checkpoints:'
            }
          </p>

          <div className="space-y-2">
            {USER_AGENTS.map((uaObj, idx) => (
              <div
                key={idx}
                className="bg-[#060a10] border border-slate-800 hover:border-slate-700 rounded-lg p-2.5 space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span>{uaObj.name}</span>
                  <button
                    onClick={() => handleCopy(uaObj.ua, `ua_list_${idx}`)}
                    className="text-slate-400 hover:text-emerald-400 text-[11px] flex items-center gap-1 font-mono"
                  >
                    {copiedId === `ua_list_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === `ua_list_${idx}` ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-slate-400 truncate select-all">
                  {uaObj.ua}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proxy Scraper & Checker */}
        <div className="bg-[#0d131f] border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-sky-400" />
                ProxyScrape SOCKS4 / HTTP Scraper
              </h3>
              <button
                onClick={fetchProxies}
                disabled={isLoadingProxies}
                className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingProxies ? 'animate-spin' : ''}`} />
                <span>Fetch Proxies</span>
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Reference: <code className="text-emerald-400 font-mono text-[11px]">api.proxyscrape.com/v2/?request=displayproxies&amp;protocol=socks4</code>
            </p>

            <div className="bg-[#060a10] border border-slate-800 rounded-lg p-3 min-h-[180px] max-h-[220px] overflow-y-auto space-y-1.5 font-mono text-xs">
              {proxyList.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 italic p-6">
                  Click &apos;Fetch Proxies&apos; to load active proxy endpoints
                </div>
              ) : (
                proxyList.map((px, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-300">{px}</span>
                    <button
                      onClick={() => handleCopy(px.split(' ')[0], `px_${idx}`)}
                      className="text-slate-400 hover:text-white p-0.5"
                    >
                      {copiedId === `px_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Protocol: Socks4 / Socks5</span>
            <span>Timeout: 10,000ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
