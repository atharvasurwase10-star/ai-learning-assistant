import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Sparkles,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { aiApi, quizApi } from '../services/api';
import type { QuizQuestion, QuizResult } from '../types';

interface QuizPageProps {
  onNavigate: (tab: string, meta?: Record<string, string>) => void;
  initialSubject?: string;
}

export const QuizPage: React.FC<QuizPageProps> = ({ onNavigate, initialSubject }) => {
  const [subject, setSubject] = useState(initialSubject || 'Machine Learning');
  const [topic, setTopic] = useState('Decision Trees');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');

  const [loading, setLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizId, setCurrentQuizId] = useState<string>('');

  // Runner state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 mins
  const [timerActive, setTimerActive] = useState(false);

  // Analysis state
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [history, setHistory] = useState<QuizResult[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await quizApi.getHistory();
      if (res.history) setHistory(res.history);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0 && !quizSubmitted) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerActive && !quizSubmitted) {
      handleSubmitQuiz();
    }
    return () => clearInterval(timer);
  }, [timerActive, timeRemaining, quizSubmitted]);

  const handleGenerateQuiz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setQuizSubmitted(false);
    setQuizResult(null);
    setCurrentQuestionIndex(0);

    try {
      const res = await aiApi.generateQuiz({
        subject,
        topic,
        numQuestions,
        difficulty,
      });

      if (res.questions && res.questions.length > 0) {
        setQuizQuestions(res.questions);
        setCurrentQuizId(res.quizId);
        setSelectedAnswers(new Array(res.questions.length).fill(-1));
        setTimeRemaining(res.questions.length * 60);
        setTimerActive(true);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error generating quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (quizSubmitted) return;
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleSubmitQuiz = async () => {
    setTimerActive(false);
    setLoading(true);

    try {
      const timeTaken = quizQuestions.length * 60 - timeRemaining;
      const res = await quizApi.submitQuiz({
        quizId: currentQuizId,
        subject,
        topic,
        answers: selectedAnswers,
        questions: quizQuestions,
        timeTaken: timeTaken > 0 ? timeTaken : 45,
      });

      setQuizResult(res);
      setQuizSubmitted(true);
      fetchHistory();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error evaluating quiz');
    } finally {
      setLoading(false);
    }
  };

  const currentQ = quizQuestions[currentQuestionIndex];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <CheckSquare className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          <span>AI Quiz Generator & Diagnostic Analysis</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate topic-specific MCQ exams, test under timer, and obtain AI performance analytics
        </p>
      </div>

      {/* Quiz Generator Input Card (only when no quiz active or after review) */}
      {!timerActive && !quizSubmitted && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <form onSubmit={handleGenerateQuiz} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
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
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Sub-Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Decision Trees, Recursion, SQL Joins"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Number of Questions
                </label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-brand-500"
                >
                  <option value={3}>3 Questions (Quick Sprint)</option>
                  <option value={5}>5 Questions (Standard Test)</option>
                  <option value={10}>10 Questions (Comprehensive)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-brand-500"
                >
                  <option value="Easy">Easy (Conceptual)</option>
                  <option value="Medium">Medium (Engineering Level)</option>
                  <option value="Hard">Hard (GATE / Viva Tricky)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Generating Exam MCQs...' : 'Generate AI Quiz'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ACTIVE QUIZ RUNNER INTERFACE */}
      {timerActive && !quizSubmitted && currentQ && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          {/* Top Bar: Progress and Timer */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-brand-600 dark:text-brand-400">
                {subject} • {topic}
              </span>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-brand-500" />
              <span>
                {Math.floor(timeRemaining / 60)}:
                {(timeRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {currentQ.question}
          </div>

          {/* 4 Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-900 dark:text-brand-200 ring-2 ring-brand-500/20'
                      : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center font-mono ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40"
            >
              Previous
            </button>

            <div className="flex items-center gap-1.5">
              {quizQuestions.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    dotIdx === currentQuestionIndex
                      ? 'bg-brand-600 scale-125'
                      : selectedAnswers[dotIdx] !== -1
                      ? 'bg-emerald-500'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {currentQuestionIndex < quizQuestions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={loading}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Submit Quiz</span>
                <CheckSquare className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUIZ COMPLETION & AI PERFORMANCE ANALYSIS */}
      {quizSubmitted && quizResult && (
        <div className="space-y-6">
          {/* Score Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                  Quiz Completed • Assessment Review
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Your Score: {quizResult.score} / {quizResult.total}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                  {quizResult.feedback}
                </p>
              </div>

              <div className="flex items-center gap-4 self-start md:self-center">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[100px]">
                  <div className="text-3xl font-extrabold font-mono text-emerald-400">
                    {quizResult.percentage}%
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Accuracy
                  </div>
                </div>

                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setTimerActive(false);
                    setQuizResult(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Take Another Quiz</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Diagnostic Analysis Breakdown (Section 25) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Performance Analysis
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Strong Topics */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Strong Topics</span>
                </div>
                <div className="space-y-1">
                  {quizResult.strongTopics && quizResult.strongTopics.length > 0 ? (
                    quizResult.strongTopics.map((st, i) => (
                      <div key={i} className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        • {st}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500">Mastery in progress</div>
                  )}
                </div>
              </div>

              {/* Weak Topics */}
              <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 dark:text-red-300">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>Weak Topics to Revise</span>
                </div>
                <div className="space-y-1">
                  {quizResult.weakTopics && quizResult.weakTopics.length > 0 ? (
                    quizResult.weakTopics.map((wt, i) => (
                      <div key={i} className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        • {wt}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      No significant weaknesses detected!
                    </div>
                  )}
                </div>
              </div>

              {/* Recommended Topics */}
              <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/80 dark:border-brand-900/40 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-800 dark:text-brand-300">
                  <TrendingUp className="w-4 h-4 text-brand-500" />
                  <span>Recommended Next Topics</span>
                </div>
                <div className="space-y-1">
                  {quizResult.recommendedTopics && quizResult.recommendedTopics.length > 0 ? (
                    quizResult.recommendedTopics.map((rt, i) => (
                      <div key={i} className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        • {rt}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500">Continue syllabus modules</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Question-by-Question Review with Explanations */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Detailed Question Review
            </h3>

            <div className="space-y-4">
              {quizQuestions.map((q, idx) => {
                const userChoice = selectedAnswers[idx];
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs ${
                      isCorrect
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                        : 'bg-red-50/30 dark:bg-red-950/20 border-red-200 dark:border-red-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2 font-bold text-slate-900 dark:text-white">
                      <span>
                        Q{idx + 1}: {q.question}
                      </span>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold flex-shrink-0">
                          <XCircle className="w-4 h-4" />
                          <span>Incorrect</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = userChoice === oIdx;
                        const isAnswer = q.correctAnswer === oIdx;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-xl border ${
                              isAnswer
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-semibold'
                                : isChosen && !isCorrect
                                ? 'bg-red-100 dark:bg-red-900/40 border-red-400 text-red-900 dark:text-red-200 font-semibold'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="mt-3 p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[11px] border border-slate-200/60 dark:border-slate-700">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quiz History Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Past Quiz Performance History ({history.length})
        </h3>

        {history.length === 0 ? (
          <p className="text-xs text-slate-500">No quizzes taken yet. Generate a quiz above to start your record.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-2">Topic</th>
                  <th className="pb-2">Subject</th>
                  <th className="pb-2">Score</th>
                  <th className="pb-2">Percentage</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {history.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">
                      {h.topic}
                    </td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-400">
                      {h.subject}
                    </td>
                    <td className="py-2.5 font-mono">
                      {h.score} / {h.total}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          h.percentage >= 80
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : h.percentage >= 60
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {h.percentage}%
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400">
                      {h.completedAt ? new Date(h.completedAt).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
