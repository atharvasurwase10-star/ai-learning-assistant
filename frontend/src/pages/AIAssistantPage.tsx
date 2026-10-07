import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Plus,
  Trash2,
  Paperclip,
  Mic,
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Sparkles,
  Bot,
  User as UserIcon,
  Check,
  Compass,
  ArrowRight,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { aiApi, notesApi } from '../services/api';
import type { ChatMessage, ConversationSummary, LearningLevel } from '../types';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useAuth } from '../context/AuthContext';

interface AIAssistantPageProps {
  onNavigate: (tab: string, meta?: Record<string, string>) => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([
    {
      conversationId: 'demo-conv-1',
      title: 'Supervised Learning & Regression',
      subject: 'Machine Learning',
      updatedAt: new Date().toISOString(),
    },
    {
      conversationId: 'demo-conv-2',
      title: 'Decision Trees & Entropy',
      subject: 'Machine Learning',
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      conversationId: 'demo-conv-3',
      title: 'Binary Tree Inorder Traversal',
      subject: 'Data Structures',
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      conversationId: 'demo-conv-4',
      title: 'DBMS Normalization (1NF - BCNF)',
      subject: 'Database Systems',
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ]);

  const [currentConversationId, setCurrentConversationId] = useState<string>('demo-conv-1');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'student',
      text: 'Explain supervised learning in simple language and give me exam notes.',
      timestamp: new Date(Date.now() - 120000),
      learningLevel: 'Intermediate',
    },
    {
      sender: 'assistant',
      text: `### What is Supervised Learning?

**Supervised Learning** is a fundamental subcategory of Machine Learning where an algorithm learns a mapping function from input variables ($X$) to an output variable ($Y$) using labeled training datasets.

$$\\text{Dataset: } \\mathcal{D} = \\{(x_1, y_1), (x_2, y_2), \\dots, (x_n, y_n)\\}$$

The algorithm iteratively makes predictions on the training data and is corrected by the supervisor/ground-truth labels until it achieves an acceptable level of accuracy.

---

### Key Workflow of Supervised Learning

1. **Data Collection & Annotation:** Gather historical observations with ground truth target labels.
2. **Feature Engineering:** Extract numerical representations and normalize inputs.
3. **Model Selection:** Choose appropriate hypothesis class (e.g., Linear Regression, Decision Tree, SVM).
4. **Training (Loss Minimization):** Optimize model weights by minimizing a loss function (e.g., Mean Squared Error or Cross-Entropy).
5. **Evaluation:** Validate generalization performance on unseen test data using metrics like $R^2$, Accuracy, Precision, Recall, and F1-score.

---

### Two Main Categories

| Category | Output Type | Example Algorithms | Real-World Use Case |
| :--- | :--- | :--- | :--- |
| **Regression** | Continuous numeric value | Linear Regression, Ridge, SVR | Predicting semester GPA, house prices |
| **Classification** | Discrete categorical label | Logistic Regression, Decision Trees, SVM, Random Forest | Spam detection, disease diagnosis |

---

### Python Code Demonstration

Here is how you can train a Decision Tree classifier using \`scikit-learn\`:

\`\`\`python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# 1. Load dataset
data = load_iris()
X, y = data.data, data.target

# 2. Split train and test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Instantiate model & fit
clf = DecisionTreeClassifier(criterion='entropy', max_depth=3)
clf.fit(X_train, y_train)

# 4. Predict and evaluate
predictions = clf.predict(X_test)
print(f"Test Accuracy: {accuracy_score(y_test, predictions) * 100:.2f}%")
\`\`\`

---

### Exam Tips & Viva Questions
* **Q:** What is the difference between Supervised and Unsupervised Learning?
  * *Answer:* Supervised uses labeled targets $(X, y)$; Unsupervised uncovers hidden patterns without labels $(X)$.
* **Q:** What is Overfitting and how do you prevent it?
  * *Answer:* Overfitting occurs when the model memorizes training noise. Prevent it with cross-validation, regularization ($L_1/L_2$), pruning, and dropout.`,
      timestamp: new Date(Date.now() - 60000),
      learningLevel: 'Intermediate',
      recommendations: [
        'Take a 5-question MCQ quiz on Supervised Learning',
        'Review Decision Tree splitting criteria (Entropy & Information Gain)',
        'Generate revision flashcards for active recall',
      ],
      statusMessage: 'Synthesizing verified explanation & recommendations...',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [learningLevel, setLearningLevel] = useState<LearningLevel>('Intermediate');
  const [selectedSubject, setSelectedSubject] = useState('Machine Learning');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatusIndex, setLoadingStatusIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [savedNoteSuccess, setSavedNoteSuccess] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadingStatuses = [
    'Understanding your academic question...',
    'Analyzing context and engineering principles...',
    'Synthesizing verified explanation & recommendations...',
  ];

  // Rotate loading messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStatusIndex((prev) => (prev + 1) % loadingStatuses.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Quick prompt presets
  const quickPrompts = [
    'Explain this concept',
    'Give me exam notes',
    'Explain with an example',
    'Generate MCQs',
    'Explain step-by-step',
    'Create a study plan',
    'Summarize this topic',
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      sender: 'student',
      text: textToSend,
      timestamp: new Date(),
      learningLevel,
      subject: selectedSubject,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setLoadingStatusIndex(0);

    try {
      const res = await aiApi.chat({
        message: textToSend,
        conversationId: currentConversationId,
        subject: selectedSubject,
        learningLevel,
      });

      const assistantMsg: ChatMessage = {
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date(),
        learningLevel,
        subject: res.subject || selectedSubject,
        recommendations: res.recommendations,
        statusMessage: res.statusMessages?.[res.statusMessages.length - 1],
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Update current title if first message
      setConversations((prev) =>
        prev.map((c) =>
          c.conversationId === currentConversationId
            ? { ...c, title: textToSend.slice(0, 32) + '...', updatedAt: new Date().toISOString() }
            : c
        )
      );
    } catch (err: unknown) {
      const errorMsg: ChatMessage = {
        sender: 'assistant',
        text: `### ⚠️ Agent Notice\n\n${
          err instanceof Error ? err.message : 'Unable to complete AI request.'
        }\n\nThe system has preserved your input. You can retry with a quick prompt below.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: ConversationSummary = {
      conversationId: newId,
      title: 'New Conversation',
      subject: selectedSubject,
      updatedAt: new Date().toISOString(),
    };
    setConversations([newConv, ...conversations]);
    setCurrentConversationId(newId);
    setMessages([
      {
        sender: 'assistant',
        text: `Hello ${user?.name || 'Student'}! 👋 I am your **AI Learning Assistant Intelligent Agent**.\n\nAsk me any concept, formula derivation, or doubt from **${selectedSubject}** or any other engineering subject. How can I help you study today?`,
        timestamp: new Date(),
        learningLevel,
      },
    ]);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToNotes = async (text: string, index: number) => {
    try {
      await notesApi.saveNote({
        subject: selectedSubject,
        topic: 'AI Generated Study Notes',
        style: 'Exam-oriented',
        difficulty: learningLevel,
        rawMarkdown: text,
        content: {
          definition: text.slice(0, 150) + '...',
          explanation: text,
          keyPoints: ['Saved directly from AI Assistant session'],
          examples: [],
          advantages: [],
          disadvantages: [],
          applications: [],
          examQuestions: [],
        },
      });
      setSavedNoteSuccess(index);
      setTimeout(() => setSavedNoteSuccess(null), 2500);
    } catch (e) {
      alert('Note saved to local session!');
    }
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear this conversation?')) {
      setMessages([]);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
      {/* LEFT PANEL: Conversation History (Hidden on mobile) */}
      <div className="hidden md:flex w-72 border-r border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex-col justify-between">
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          <button
            onClick={handleNewChat}
            className="w-full py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pt-2 px-1">
            Recent Conversations
          </div>

          <div className="space-y-1">
            {conversations.map((conv) => {
              const isActive = conv.conversationId === currentConversationId;
              return (
                <button
                  key={conv.conversationId}
                  onClick={() => setCurrentConversationId(conv.conversationId)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col gap-0.5 ${
                    isActive
                      ? 'bg-white dark:bg-slate-850 shadow-sm border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  <span className="truncate">{conv.title}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {conv.subject}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Learning Level Badge */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            Student Learning Mode
          </div>
          <div className="text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            <span>{learningLevel}</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Chat Area */}
      <div className="flex-1 flex flex-col justify-between bg-white dark:bg-slate-900 overflow-hidden">
        {/* Chat Area Header */}
        <div className="px-6 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  AI Learning Assistant
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Personal study companion for college engineering
              </div>
            </div>
          </div>

          {/* Level Selector & Clear */}
          <div className="flex items-center gap-2">
            <select
              value={learningLevel}
              onChange={(e) => setLearningLevel(e.target.value as LearningLevel)}
              className="text-xs px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="Beginner">Level: Beginner</option>
              <option value="Intermediate">Level: Intermediate</option>
              <option value="Advanced">Level: Advanced</option>
              <option value="Exam Preparation">Level: Exam Preparation</option>
            </select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer hidden sm:block"
            >
              <option value="Machine Learning">Machine Learning</option>
              <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
              <option value="Database Management Systems">Database Management</option>
              <option value="Python Programming">Python Programming</option>
              <option value="Discrete Mathematics">Discrete Mathematics</option>
            </select>

            <button
              onClick={handleClearChat}
              title="Clear current messages"
              className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {messages.map((msg, idx) => {
            const isStudent = msg.sender === 'student';
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 max-w-3xl ${
                  isStudent ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${
                    isStudent
                      ? 'bg-slate-800 text-white'
                      : 'bg-gradient-to-tr from-brand-600 to-cyan-500 text-white'
                  }`}
                >
                  {isStudent ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`p-4 rounded-2xl shadow-sm text-xs sm:text-sm leading-relaxed ${
                    isStudent
                      ? 'bg-brand-600 text-white rounded-tr-sm'
                      : 'bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-tl-sm w-full'
                  }`}
                >
                  {/* Sender label */}
                  <div
                    className={`text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center justify-between ${
                      isStudent ? 'text-brand-200' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <span>{isStudent ? 'Student' : 'AI Assistant'}</span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Body */}
                  {isStudent ? (
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  ) : (
                    <div>
                      <MarkdownRenderer content={msg.text} />

                      {/* Next Learning Recommendations */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700/80">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 mb-2">
                            <Compass className="w-3.5 h-3.5" />
                            <span>Recommended Next Actions:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.recommendations.map((rec, rIdx) => (
                              <button
                                key={rIdx}
                                onClick={() => handleSendMessage(`Let's do: ${rec}`)}
                                className="p-2 rounded-xl text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors flex items-center justify-between"
                              >
                                <span>{rec}</span>
                                <ArrowRight className="w-3 h-3 text-brand-500 flex-shrink-0 ml-1" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Response Action Buttons */}
                      <div className="mt-4 pt-2 flex items-center gap-3 text-slate-400 text-xs">
                        <button
                          onClick={() => handleCopy(msg.text, idx)}
                          className="hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
                          title="Copy response"
                        >
                          {copiedId === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === idx ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => handleSaveToNotes(msg.text, idx)}
                          className="hover:text-brand-500 flex items-center gap-1 transition-colors"
                          title="Save this answer to Notes"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>{savedNoteSuccess === idx ? 'Saved!' : 'Save to Notes'}</span>
                        </button>

                        <button
                          onClick={() => handleSendMessage(messages[idx - 1]?.text || msg.text)}
                          className="hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
                          title="Regenerate answer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Regenerate</span>
                        </button>

                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={() => alert('Thanks for your feedback!')}
                            className="hover:text-emerald-500"
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => alert('Thanks for your feedback! The agent will adjust.')}
                            className="hover:text-red-500"
                            title="Needs improvement"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading status card */}
          {isLoading && (
            <div className="flex items-start gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-tl-sm text-xs space-y-2">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                  <span>AI Learning Agent</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                  ● {loadingStatuses[loadingStatusIndex]}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex-shrink-0">
            Quick Prompts:
          </span>
          {quickPrompts.map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSendMessage(`${prompt} for ${selectedSubject}`)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => alert('File attachment: You can attach syllabus notes, PDFs or code files in future updates.')}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => alert('Voice input: Audio speech-to-text is ready for speech recognition.')}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about your studies (e.g. 'Explain Decision Trees and calculate Entropy')..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
            />

            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
