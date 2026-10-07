import React, { useState } from 'react';
import {
  FileCode2,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { aiApi } from '../services/api';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

export const SummarizerPage: React.FC = () => {
  const [inputText, setInputText] = useState(
    `Supervised learning is a machine learning approach defined by its use of labeled datasets. These datasets are designed to train or "supervise" algorithms into classifying data or predicting outcomes accurately. As input data is fed into the model, the model adjusts its weights until it has been fitted appropriately. This occurs as part of the cross validation process to ensure that the model avoids overfitting or underfitting. Supervised learning helps organizations solve for a variety of real-world problems at scale, such as classifying spam in a separate folder from your inbox. Common mathematical algorithms include Linear Regression, Logistic Regression, Support Vector Machines (SVM), and Decision Trees.`
  );
  const [lengthOption, setLengthOption] = useState<
    'Very Short' | 'Short' | 'Detailed' | 'Exam Revision'
  >('Exam Revision');
  const [loading, setLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const res = await aiApi.summarize({
        text: inputText,
        lengthOption,
      });

      if (res.summary) {
        setSummaryResult(res.summary);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error generating summary');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summaryResult) return;
    navigator.clipboard.writeText(summaryResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <FileCode2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          <span>AI Academic Text Summarizer</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Paste textbook paragraphs, research papers, or syllabus units to extract high-yield revision summaries
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <form onSubmit={handleSummarize} className="space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Input Engineering Text
                </label>
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="text-[11px] text-slate-400 hover:text-red-500"
                >
                  Clear
                </button>
              </div>

              <textarea
                rows={12}
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste engineering articles, lecture notes, textbook chapters..."
                className="w-full p-4 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 leading-relaxed font-sans"
              />
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Summary Format:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {(['Very Short', 'Short', 'Detailed', 'Exam Revision'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setLengthOption(opt)}
                    className={`py-2 px-2.5 rounded-xl font-medium transition-all text-center border ${
                      lengthOption === opt
                        ? 'bg-brand-600 text-white border-brand-600 font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Synthesizing Summary...' : 'Summarize Content'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Output Column */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  AI Generated Summary ({lengthOption})
                </h3>
              </div>

              {summaryResult && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {summaryResult ? (
              <div className="space-y-4">
                <MarkdownRenderer content={summaryResult} />
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                <FileCode2 className="w-10 h-10 opacity-40" />
                <p className="text-xs">
                  Your AI synthesized summary will appear here. Choose a format and click Summarize Content.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Powered by Intelligent Learning Agent Summarization Engine
          </div>
        </div>
      </div>
    </div>
  );
};
