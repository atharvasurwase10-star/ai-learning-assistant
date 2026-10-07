export type LearningLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Exam Preparation';

export interface User {
  _id: string;
  name: string;
  email: string;
  college?: string;
  branch?: string;
  year?: string;
  interests?: string[];
  learningLevel?: LearningLevel;
  avatar?: string;
}

export interface Subject {
  _id: string;
  name: string;
  code?: string;
  category?: string;
  progress: number;
  topics: string[];
  completedTopics?: string[];
  quizScore: number;
  lastStudied?: string;
  color?: string;
  icon?: string;
}

export interface ChatMessage {
  id?: string;
  sender: 'student' | 'assistant';
  text: string;
  timestamp: string | Date;
  learningLevel?: string;
  intent?: string;
  subject?: string;
  recommendations?: string[];
  statusMessage?: string;
}

export interface ConversationSummary {
  _id?: string;
  conversationId: string;
  title: string;
  subject: string;
  updatedAt: string;
}

export interface NoteContent {
  definition: string;
  explanation: string;
  keyPoints: string[];
  examples: string[];
  advantages: string[];
  disadvantages: string[];
  applications: string[];
  examQuestions: string[];
}

export interface Note {
  _id: string;
  subject: string;
  topic: string;
  style: 'Simple' | 'Detailed' | 'Exam-oriented';
  difficulty: string;
  content: NoteContent;
  rawMarkdown?: string;
  createdAt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic?: string;
}

export interface QuizResult {
  _id?: string;
  score: number;
  total: number;
  percentage: number;
  timeTaken: number;
  weakTopics: string[];
  strongTopics: string[];
  recommendedTopics: string[];
  feedback: string;
  completedAt?: string;
}

export interface StudyTask {
  id: string;
  day: string;
  time: string;
  subject: string;
  topic: string;
  duration?: string;
  priority?: 'High' | 'Medium' | 'Low';
  completed: boolean;
  notes?: string;
}

export interface StudyPlan {
  _id?: string;
  title: string;
  examDate?: string;
  availableHours: number;
  preferredTime: string;
  difficulty: string;
  tasks: StudyTask[];
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  category?: string;
  status?: 'unreviewed' | 'known' | 'revise_later';
}

export interface FlashcardDeck {
  _id: string;
  subject: string;
  topic: string;
  cards: FlashcardItem[];
  createdAt: string;
}

export interface ProgressData {
  studyHours: number;
  topicsCompleted: number;
  streak: number;
  averageQuizScore: number;
  weeklyStudyHours: { day: string; hours: number }[];
  subjectProgress: {
    subject: string;
    progress: number;
    completedTopics: number;
    totalTopics: number;
    score: number;
    color?: string;
  }[];
  weakTopics: {
    topic: string;
    subject: string;
    status: string;
    score: number;
  }[];
  strongTopics: {
    topic: string;
    subject: string;
    score: number;
  }[];
  recommendations: {
    title: string;
    subject: string;
    description: string;
    action: string;
    itemType: string;
  }[];
  recentActivity: {
    title: string;
    subject: string;
    time: string;
    activityType: string;
  }[];
}

export interface AIConfig {
  mode: 'live' | 'demo';
  provider: string;
  model: string;
  isLive: boolean;
  description: string;
}
