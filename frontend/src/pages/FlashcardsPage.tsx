import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  RotateCw,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { aiApi, flashcardsApi } from '../services/api';
import type { FlashcardDeck, FlashcardItem } from '../types';

interface FlashcardsPageProps {
  onNavigate: (tab: string) => void;
  initialTopic?: string;
}

export const FlashcardsPage: React.FC<FlashcardsPageProps> = ({ initialTopic }) => {
  const [topic, setTopic] = useState(initialTopic || 'Decision Trees');
  const [subject, setSubject] = useState('Machine Learning');
  const [loading, setLoading] = useState(false);

  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [currentDeck, setCurrentDeck] = useState<FlashcardDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const fetchDecks = async () => {
    try {
      const res = await flashcardsApi.getFlashcards();
      if (res.flashcards && res.flashcards.length > 0) {
        setDecks(res.flashcards);
        if (!currentDeck) {
          setCurrentDeck(res.flashcards[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleGenerateFlashcards = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setIsFlipped(false);
    setCurrentCardIndex(0);

    try {
      const res = await aiApi.generateFlashcards({
        topic,
        subject,
      });

      if (res.cards && res.cards.length > 0) {
        const newDeck: FlashcardDeck = {
          _id: res.flashcardSetId || `fc-${Date.now()}`,
          subject: res.subject || subject,
          topic: res.topic || topic,
          cards: res.cards,
          createdAt: new Date().toISOString(),
        };

        setCurrentDeck(newDeck);
        setDecks((prev) => [newDeck, ...prev]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error generating flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (!currentDeck) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % currentDeck.cards.length);
  };

  const handlePrev = () => {
    if (!currentDeck) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + currentDeck.cards.length) % currentDeck.cards.length);
  };

  const handleMarkStatus = async (status: 'known' | 'revise_later') => {
    if (!currentDeck) return;
    const currentCard = currentDeck.cards[currentCardIndex];
    if (!currentCard) return;

    try {
      if (currentDeck._id && !currentDeck._id.startsWith('fc-')) {
        await flashcardsApi.updateCardStatus(currentDeck._id, currentCard.id, status);
      }
      // Update local state
      const updatedCards = [...currentDeck.cards];
      updatedCards[currentCardIndex] = { ...currentCard, status };
      setCurrentDeck({ ...currentDeck, cards: updatedCards });

      // Auto advance to next card
      handleNext();
    } catch (e) {
      console.error(e);
    }
  };

  const currentCard = currentDeck?.cards[currentCardIndex];
  const knownCount = currentDeck?.cards.filter((c) => c.status === 'known').length || 0;
  const reviseCount = currentDeck?.cards.filter((c) => c.status === 'revise_later').length || 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-pink-600 dark:text-pink-400" />
          <span>AI Active Recall Flashcards</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Master formulas, core definitions, and viva questions through spaced repetition
        </p>
      </div>

      {/* Input Generator */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleGenerateFlashcards} className="flex flex-col sm:flex-row items-center gap-4 text-xs">
          <div className="w-full sm:w-1/3">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Engineering Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-brand-500"
            >
              <option value="Machine Learning">Machine Learning</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Python Programming">Python Programming</option>
              <option value="DBMS">Database Systems (DBMS)</option>
            </select>
          </div>

          <div className="w-full sm:flex-1">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Topic for Flashcards *
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

          <div className="w-full sm:w-auto self-end">
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full py-2.5 px-6 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Synthesizing Cards...' : 'Generate Flashcards'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* FLASHCARD INTERACTIVE DISPLAY */}
      {currentDeck && currentCard && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Deck info bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">
                {currentDeck.topic}
              </span>{' '}
              ({currentDeck.subject})
            </div>
            <div className="font-mono font-semibold">
              Card {currentCardIndex + 1} of {currentDeck.cards.length}
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={handleFlip}
            className="w-full min-h-[320px] rounded-3xl p-8 cursor-pointer select-none relative transition-all duration-300 transform perspective-1000 shadow-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
            style={{
              background: isFlipped
                ? 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            }}
          >
            {/* Top pill */}
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isFlipped
                    ? 'bg-purple-900/60 text-purple-300 border border-purple-700/60'
                    : 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300'
                }`}
              >
                {isFlipped ? 'Answer / Explanation' : currentCard.category || 'Question / Concept'}
              </span>

              <button
                type="button"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                title="Click anywhere to flip"
              >
                <RotateCw className="w-4 h-4 animate-spin-slow" />
              </button>
            </div>

            {/* Middle Content */}
            <div className="my-auto py-6 text-center">
              <div
                className={`text-lg sm:text-xl font-bold leading-relaxed ${
                  isFlipped ? 'text-white' : 'text-slate-900'
                }`}
              >
                {isFlipped ? currentCard.back : currentCard.front}
              </div>
            </div>

            {/* Bottom Flip Indicator */}
            <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <span>(Click card to flip)</span>
            </div>
          </div>

          {/* Action Buttons: Prev, Known, Revise Later, Next */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
              title="Previous card"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <button
                onClick={() => handleMarkStatus('revise_later')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Revise Later</span>
              </button>

              <button
                onClick={() => handleMarkStatus('known')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Known</span>
              </button>
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
              title="Next card"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Deck Stats Counter */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-around text-xs">
            <div className="text-center">
              <div className="font-bold text-slate-900 dark:text-white">
                {currentDeck.cards.length}
              </div>
              <div className="text-slate-500 text-[10px]">Total Cards</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-emerald-600 dark:text-emerald-400">
                {knownCount}
              </div>
              <div className="text-slate-500 text-[10px]">Known</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-amber-600 dark:text-amber-400">
                {reviseCount}
              </div>
              <div className="text-slate-500 text-[10px]">Revise Later</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
