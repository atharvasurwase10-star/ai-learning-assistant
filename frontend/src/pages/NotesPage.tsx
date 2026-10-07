import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Bookmark,
  BookOpen,
  HelpCircle,
  Code,
  Layers,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { aiApi, notesApi } from '../services/api';
import type { Note, NoteContent } from '../types';

interface NotesPageProps {
  onNavigate: (tab: string) => void;
  initialSubject?: string;
}

export const NotesPage: React.FC<NotesPageProps> = ({ initialSubject }) => {
  const [subject, setSubject] = useState(initialSubject || 'Machine Learning');
  const [topic, setTopic] = useState('Supervised Learning');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [style, setStyle] = useState<'Simple' | 'Detailed' | 'Exam-oriented'>('Exam-oriented');

  const [loading, setLoading] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<NoteContent | null>(null);
  const [savedNotesList, setSavedNotesList] = useState<Note[]>([]);
  const [copied, setCopied] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const fetchSavedNotes = async () => {
    try {
      const res = await notesApi.getNotes();
      if (res.notes) setSavedNotesList(res.notes);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSavedNotes();
  }, []);

  const handleGenerateNotes = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setSavedStatus(null);
    try {
      const res = await aiApi.generateNotes({
        subject,
        topic,
        difficulty,
        style,
        saveToDb: true,
      });

      if (res.notes) {
        setGeneratedNotes(res.notes);
        fetchSavedNotes();
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error generating notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyNotes = () => {
    if (!generatedNotes) return;
    const text = `# ${topic} (${subject}) - ${style} Notes
    
## 1. Definition
${generatedNotes.definition}

## 2. Theoretical Explanation
${generatedNotes.explanation}

## 3. Key Concepts & Formulas
${generatedNotes.keyPoints.map((k) => `* ${k}`).join('\n')}

## 4. Examples & Code
${generatedNotes.examples.map((ex) => `* ${ex}`).join('\n')}

## 5. Advantages & Disadvantages
Advantages:
${generatedNotes.advantages.map((a) => `+ ${a}`).join('\n')}
Disadvantages:
${generatedNotes.disadvantages.map((d) => `- ${d}`).join('\n')}

## 6. Industrial Applications
${generatedNotes.applications.map((app) => `* ${app}`).join('\n')}

## 7. Important Exam / Viva Questions
${generatedNotes.examQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedNotes) return;
    const markdownContent = `# ${topic} Notes\n\n**Subject:** ${subject} | **Style:** ${style}\n\n### Definition\n${generatedNotes.definition}\n\n### Explanation\n${generatedNotes.explanation}\n\n### Key Points\n${generatedNotes.keyPoints.join('\n* ')}\n\n### Exam Questions\n${generatedNotes.examQuestions.join('\n* ')}`;
    const element = document.createElement('a');
    const file = new Blob([markdownContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${topic.replace(/\s+/g, '_')}_Notes.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteSavedNote = async (id: string) => {
    if (confirm('Delete this saved note?')) {
      await notesApi.deleteNote(id);
      fetchSavedNotes();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          <span>Smart Notes Generator</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate structured, exam-oriented engineering notes with derivations, advantages, and viva questions
        </p>
      </div>

      {/* Input Configuration Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleGenerateNotes} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Subject */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-brand-500"
              >
                <option value="Machine Learning">Machine Learning</option>
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="Database Management Systems">Database Management (DBMS)</option>
                <option value="Python Programming">Python Programming</option>
                <option value="Discrete Mathematics">Discrete Mathematics</option>
                <option value="Computer Organization">Computer Organization</option>
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Topic / Unit
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Decision Trees, Recursion, Normalization"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Notes Style */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notes Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as 'Simple' | 'Detailed' | 'Exam-oriented')}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-brand-500"
              >
                <option value="Exam-oriented">Exam-Oriented (High Yield)</option>
                <option value="Detailed">Detailed & Technical</option>
                <option value="Simple">Simple & Intuitive</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-brand-500"
              >
                <option value="Beginner">Beginner (Foundations)</option>
                <option value="Intermediate">Intermediate (Degree Standard)</option>
                <option value="Advanced">Advanced (Gate / Placement)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Synthesizing Notes...' : 'Generate Exam Notes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Notes Display */}
      {generatedNotes && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold uppercase">
                {subject} • {style}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {topic}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyNotes}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .MD</span>
              </button>
            </div>
          </div>

          {/* Section 1: Definition */}
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40">
            <h3 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>1. Standard Definition</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {generatedNotes.definition}
            </p>
          </div>

          {/* Section 2: Theoretical Explanation */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              2. Theoretical Explanation & Core Architecture
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {generatedNotes.explanation}
            </p>
          </div>

          {/* Section 3: Key Points */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              3. Key Points & Mathematical Foundations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {generatedNotes.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Advantages & Disadvantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                Advantages
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {generatedNotes.advantages.map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">+</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                Disadvantages & Limitations
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {generatedNotes.disadvantages.map((dis, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">-</span>
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 5: Real-World Applications */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              5. Industrial & Real-World Applications
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pl-2">
              {generatedNotes.applications.map((app, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 6: Exam / Viva Questions */}
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-2">
            <h3 className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>6. High-Yield Exam Questions & Viva Preparation</span>
            </h3>
            <div className="space-y-2 pt-1">
              {generatedNotes.examQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                >
                  <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                    Q{idx + 1}:
                  </span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Saved Notes Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-brand-500" />
          <span>My Saved Notes Collection ({savedNotesList.length})</span>
        </h3>

        {savedNotesList.length === 0 ? (
          <p className="text-xs text-slate-500">No notes saved yet. Generate notes above to start your library.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedNotesList.map((note) => (
              <div
                key={note._id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-semibold">
                      {note.subject}
                    </span>
                    <button
                      onClick={() => handleDeleteSavedNote(note._id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {note.topic}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {note.content?.definition || 'Engineering revision summary'}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => {
                      setSubject(note.subject);
                      setTopic(note.topic);
                      setGeneratedNotes(note.content);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    View Notes →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
