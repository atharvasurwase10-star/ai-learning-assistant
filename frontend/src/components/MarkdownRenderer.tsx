import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!content) return null;

  // Split content by code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed text-sm md:text-base text-slate-800 dark:text-slate-200">
      {parts.map((part, index) => {
        // If it's a code block
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const language = lines[0].trim() || 'text';
          const code = lines.slice(1).join('\n') || lines[0];

          return (
            <div
              key={index}
              className="my-3 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-md"
            >
              <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800/80 text-xs text-slate-400 font-mono border-b border-slate-700/50">
                <span>{language}</span>
                <button
                  onClick={() => copyToClipboard(code, index)}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs md:text-sm font-mono overflow-x-auto text-emerald-300">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Render standard markdown lines
        return (
          <div key={index} className="space-y-2">
            {part.split('\n\n').map((paragraph, pIdx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              // Check for Headings
              if (trimmed.startsWith('### ')) {
                return (
                  <h3
                    key={pIdx}
                    className="text-base md:text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2 flex items-center gap-2"
                  >
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h2
                    key={pIdx}
                    className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-5 mb-2"
                  >
                    {trimmed.replace('## ', '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('# ')) {
                return (
                  <h1
                    key={pIdx}
                    className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-6 mb-3"
                  >
                    {trimmed.replace('# ', '')}
                  </h1>
                );
              }

              // Check for Table
              if (trimmed.includes('|') && trimmed.split('\n').length > 1) {
                const rows = trimmed
                  .split('\n')
                  .filter((r) => r.includes('|') && !r.includes('---'));
                return (
                  <div key={pIdx} className="overflow-x-auto my-3">
                    <table className="w-full text-left text-xs md:text-sm border-collapse rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                      <tbody>
                        {rows.map((row, rIdx) => {
                          const cols = row
                            .split('|')
                            .filter((c, i, a) => i !== 0 && i !== a.length - 1)
                            .map((c) => c.trim());
                          const isHeader = rIdx === 0;
                          return (
                            <tr
                              key={rIdx}
                              className={
                                isHeader
                                  ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white'
                                  : 'border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                              }
                            >
                              {cols.map((col, cIdx) => (
                                <td key={cIdx} className="px-3 py-2">
                                  {formatInline(col)}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }

              // Check for Bullet or Numbered lists
              if (trimmed.split('\n').some((l) => l.trim().startsWith('* ') || l.trim().startsWith('- ') || /^\d+\./.test(l.trim()))) {
                const listItems = trimmed.split('\n');
                return (
                  <ul key={pIdx} className="space-y-1.5 my-2 pl-2">
                    {listItems.map((item, lIdx) => {
                      const cleanItem = item.replace(/^[\*\-]\s+/, '').replace(/^\d+\.\s+/, '');
                      return (
                        <li key={lIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                          <span>{formatInline(cleanItem)}</span>
                        </li>
                      );
                    })}
                  </ul>
                );
              }

              return (
                <p key={pIdx} className="leading-relaxed">
                  {formatInline(trimmed)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// Helper for inline bold, italic, code tags
function formatInline(text: string): React.ReactNode {
  // Split by bold (**text**)
  const parts = text.split(/(\*\*.*?\*\*|\`.*?\`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-mono text-xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
