import React, { useState } from 'react';
import {
  BookmarkCheck,
  Video,
  FileText,
  Book,
  Code2,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const resources = [
    {
      id: 1,
      title: 'StatQuest: Decision Trees and Entropy Clearly Explained',
      category: 'Videos',
      subject: 'Machine Learning',
      difficulty: 'Beginner',
      description: 'Step-by-step mathematical walkthrough of Shannon Entropy, Gini Impurity, and tree pruning.',
      url: 'https://youtube.com',
      duration: '18 mins',
    },
    {
      id: 2,
      title: 'Scikit-Learn Official Decision Tree Classifier Documentation',
      category: 'Documentation',
      subject: 'Machine Learning',
      difficulty: 'Intermediate',
      description: 'API reference for parameters like criterion, max_depth, min_samples_split, and cost-complexity pruning.',
      url: 'https://scikit-learn.org',
      duration: 'Reference Doc',
    },
    {
      id: 3,
      title: 'Binary Tree Inorder, Preorder, Postorder Traversals (Interactive Visualizer)',
      category: 'Coding Practice',
      subject: 'Data Structures',
      difficulty: 'Intermediate',
      description: 'Visual animation demonstrating the call stack state transitions for recursive tree walks.',
      url: 'https://leetcode.com',
      duration: 'Interactive Lab',
    },
    {
      id: 4,
      title: 'Database System Concepts (Silberschatz, Korth, Sudarshan)',
      category: 'Books',
      subject: 'DBMS',
      difficulty: 'Intermediate',
      description: 'Definitive reference text covering Relational Algebra, BCNF Normalization, and ACID Transaction Serializability.',
      url: 'https://db-book.com',
      duration: 'Textbook Chapters 6-14',
    },
    {
      id: 5,
      title: 'CS229 Stanford Lecture Notes: Supervised Learning & Loss Minimization',
      category: 'Articles',
      subject: 'Machine Learning',
      difficulty: 'Advanced',
      description: 'Rigorous mathematical derivation of convex cost functions and gradient descent convergence proofs.',
      url: 'https://cs229.stanford.edu',
      duration: 'Academic PDF',
    },
    {
      id: 6,
      title: 'High-Yield GATE & University Exam Viva Questions on Recursion',
      category: 'Practice Questions',
      subject: 'Data Structures',
      difficulty: 'Exam Revision',
      description: 'Compilation of 30 common semester exam questions on recurrence relations and stack memory limits.',
      url: '#',
      duration: '30 Questions',
    },
  ];

  const filtered = resources.filter((res) => {
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSubject = selectedSubject === 'All' || res.subject === selectedSubject;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubject && matchesSearch;
  });

  const categories = ['All', 'Videos', 'Articles', 'Documentation', 'Coding Practice', 'Books', 'Practice Questions'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <BookmarkCheck className="w-7 h-7 text-brand-600 dark:text-brand-400" />
          <span>Curated Engineering Learning Resources</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Hand-picked textbook chapters, verified technical documentation, videos, and practice labs
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search resources, topics, textbooks, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Engineering Subjects</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Data Structures">Data Structures</option>
            <option value="DBMS">Database Systems (DBMS)</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-semibold">
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.duration}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {item.title}
              </h3>

              <div className="flex items-center gap-2 mt-1 mb-2">
                <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold">
                  {item.subject}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-[10px] text-slate-500">{item.difficulty}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                <span>Access Engineering Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
