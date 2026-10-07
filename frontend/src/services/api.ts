import type {
  User,
  Subject,
  ChatMessage,
  ConversationSummary,
  Note,
  QuizQuestion,
  QuizResult,
  StudyPlan,
  FlashcardDeck,
  ProgressData,
  AIConfig,
} from '../types';

const API_BASE = '/api';

// Helper for authorized requests
const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

// ==========================================
// AUTH API
// ==========================================
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    return request<{ success: boolean; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: Partial<User> & { password: string }) => {
    return request<{ success: boolean; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getMe: async () => {
    return request<{ success: boolean; user: User }>('/auth/me');
  },

  updateProfile: async (updates: Partial<User>) => {
    return request<{ success: boolean; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// ==========================================
// AI AGENT API
// ==========================================
export const aiApi = {
  getConfig: async () => {
    return request<AIConfig>('/ai/config');
  },

  chat: async (params: {
    message: string;
    conversationId?: string;
    subject?: string;
    learningLevel?: string;
  }) => {
    return request<{
      success: boolean;
      conversationId: string;
      reply: string;
      intent: string;
      subject: string;
      topic: string;
      recommendations: string[];
      statusMessages: string[];
      mode: 'live' | 'demo';
    }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  getConversations: async () => {
    return request<{ success: boolean; conversations: ConversationSummary[] }>('/ai/conversations');
  },

  getConversation: async (id: string) => {
    return request<{
      success: boolean;
      conversation: {
        conversationId: string;
        title: string;
        subject: string;
        messages: ChatMessage[];
      };
    }>(`/ai/conversations/${id}`);
  },

  generateNotes: async (params: {
    subject: string;
    topic: string;
    style?: string;
    difficulty?: string;
    saveToDb?: boolean;
  }) => {
    return request<{
      success: boolean;
      notes: Note['content'];
      noteId?: string;
      mode: 'live' | 'demo';
    }>('/ai/notes', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  generateQuiz: async (params: {
    subject: string;
    topic: string;
    numQuestions?: number;
    difficulty?: string;
  }) => {
    return request<{
      success: boolean;
      quizId: string;
      questions: QuizQuestion[];
      subject: string;
      topic: string;
      difficulty: string;
      mode: 'live' | 'demo';
    }>('/ai/quiz', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  generateStudyPlan: async (params: {
    examDate?: string;
    subjects?: string[];
    availableHours?: number;
    preferredTime?: string;
    difficulty?: string;
  }) => {
    return request<{
      success: boolean;
      studyPlan: StudyPlan;
      mode: 'live' | 'demo';
    }>('/ai/study-plan', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  generateFlashcards: async (params: { topic: string; subject?: string }) => {
    return request<{
      success: boolean;
      flashcardSetId: string;
      cards: FlashcardDeck['cards'];
      topic: string;
      subject: string;
      mode: 'live' | 'demo';
    }>('/ai/flashcards', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  summarize: async (params: { text: string; lengthOption?: string }) => {
    return request<{
      success: boolean;
      summary: string;
      lengthOption: string;
      mode: 'live' | 'demo';
    }>('/ai/summarize', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
};

// ==========================================
// SUBJECTS API
// ==========================================
export const subjectApi = {
  getSubjects: async () => {
    return request<{ success: boolean; subjects: Subject[] }>('/subjects');
  },

  addSubject: async (subjectData: Partial<Subject>) => {
    return request<{ success: boolean; subject: Subject }>('/subjects', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  },

  updateSubject: async (id: string, updates: Partial<Subject>) => {
    return request<{ success: boolean; subject: Subject }>(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteSubject: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/subjects/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// QUIZ API
// ==========================================
export const quizApi = {
  submitQuiz: async (params: {
    quizId?: string;
    subject: string;
    topic: string;
    answers: number[];
    questions: QuizQuestion[];
    timeTaken: number;
  }) => {
    return request<QuizResult & { success: boolean; resultId: string }>('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  getHistory: async () => {
    return request<{ success: boolean; history: QuizResult[] }>('/quiz/history');
  },
};

// ==========================================
// STUDY PLAN API
// ==========================================
export const studyPlanApi = {
  getStudyPlan: async () => {
    return request<{ success: boolean; studyPlan: StudyPlan }>('/study-plan');
  },

  createStudyPlan: async (plan: Partial<StudyPlan>) => {
    return request<{ success: boolean; studyPlan: StudyPlan }>('/study-plan', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  },

  updateTask: async (taskId: string, updates: Record<string, unknown>) => {
    return request<{ success: boolean; studyPlan: StudyPlan }>(`/study-plan/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  addTask: async (task: Record<string, unknown>) => {
    return request<{ success: boolean; studyPlan: StudyPlan; newTask: unknown }>('/study-plan/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  deleteTask: async (taskId: string) => {
    return request<{ success: boolean; studyPlan: StudyPlan }>(`/study-plan/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// PROGRESS API
// ==========================================
export const progressApi = {
  getProgress: async () => {
    return request<{ success: boolean; progress: ProgressData }>('/progress');
  },

  updateProgress: async (updates: Partial<ProgressData>) => {
    return request<{ success: boolean; progress: ProgressData }>('/progress', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// ==========================================
// NOTES API
// ==========================================
export const notesApi = {
  getNotes: async () => {
    return request<{ success: boolean; notes: Note[] }>('/notes');
  },

  getNoteById: async (id: string) => {
    return request<{ success: boolean; note: Note }>(`/notes/${id}`);
  },

  saveNote: async (note: Partial<Note>) => {
    return request<{ success: boolean; note: Note }>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  },

  updateNote: async (id: string, updates: Partial<Note>) => {
    return request<{ success: boolean; note: Note }>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteNote: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/notes/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// FLASHCARDS API
// ==========================================
export const flashcardsApi = {
  getFlashcards: async () => {
    return request<{ success: boolean; flashcards: FlashcardDeck[] }>('/flashcards');
  },

  saveFlashcards: async (deck: Partial<FlashcardDeck>) => {
    return request<{ success: boolean; flashcards: FlashcardDeck }>('/flashcards', {
      method: 'POST',
      body: JSON.stringify(deck),
    });
  },

  updateCardStatus: async (setId: string, cardId: string, status: string) => {
    return request<{ success: boolean; deck: FlashcardDeck }>(
      `/flashcards/${setId}/card/${cardId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }
    );
  },

  deleteFlashcards: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/flashcards/${id}`, {
      method: 'DELETE',
    });
  },
};
