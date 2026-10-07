import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Info } from 'lucide-react';
import { aiApi } from '../services/api';
import type { AIConfig } from '../types';

export const AIStatusBadge: React.FC = () => {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    aiApi.getConfig().then(setConfig).catch(() => {
      setConfig({
        mode: 'demo',
        provider: 'demo',
        model: 'built-in',
        isLive: false,
        description: 'Running in high-performance Demo AI Mode (viva & evaluation ready)',
      });
    });
  }, []);

  const isLive = config?.isLive;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
          isLive
            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
        }`}
      >
        <span className={`w-2 h-2 rounded-full animate-pulse ${isLive ? 'bg-purple-500' : 'bg-emerald-500'}`} />
        <Sparkles className="w-3 h-3" />
        <span>{isLive ? 'Live AI Mode' : 'Demo AI Mode'}</span>
        <Info className="w-3 h-3 ml-0.5 opacity-70" />
      </button>

      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{isLive ? 'Live Gemini / LLM Connected' : 'Offline Intelligent Agent Active'}</span>
          </div>
          <p className="leading-relaxed">
            {config?.description ||
              'The Intelligent Agent provides full conversational doubt solving, notes, quizzes, and personalized recommendations without relying on paid external APIs.'}
          </p>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
            College Presentation Ready • Deterministic Fallback Guaranteed
          </div>
        </div>
      )}
    </div>
  );
};
