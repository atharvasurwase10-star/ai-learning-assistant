# AI Learning Assistant – Intelligent Agent

> **College Engineering Mini Project**  
> **Domain:** Artificial Intelligence • Education Technology • Intelligent Agents • Personalized Learning  
> **Target Audience:** College Engineering Students (AIML, CSE, IT, Data Science)  

---

## 1. Project Overview

The **AI Learning Assistant – Intelligent Agent** is a full-stack, responsive, and adaptive educational technology platform engineered to act as a 24/7 personal study companion for college engineering students.

Unlike conventional static chatbots, this application functions as an **Intelligent Agent**:
1. **Perceives** the student's question and intent.
2. **Analyzes** context (academic year, engineering branch, curriculum level, weak topics).
3. **Retrieves** verified theoretical definitions, algorithmic derivations, code implementations, and exam tips.
4. **Synthesizes** engineering-level structured responses with markdown, mathematical formulations, and visual tables.
5. **Recommends** the next best learning activity (targeted diagnostic quizzes, revision notes, or flashcard drills).
6. **Updates** persistent academic progress analytics.

---

## 2. Key Features

- **Adaptive AI Doubt Solver:** ChatGPT-style conversational assistant with intent detection, learning level calibration (Beginner, Intermediate, Advanced, Exam Preparation), quick prompts, code blocks with 1-click copy, and response saving.
- **Smart Notes Generator:** Automated synthesis of structured, high-yield exam notes featuring definitions, theoretical foundations, key formulas, advantages/disadvantages, real-world applications, and university exam/viva questions.
- **AI Quiz Generator & Performance Diagnostic:** Automatically generated topic-specific multiple-choice questions (MCQs) with an interactive timed test interface, real-time score calculation, and diagnostic analysis flagging strong vs. weak topics.
- **Personalized Study Planner:** Timetable generator synchronizing daily and weekly study slots with upcoming semester exam milestones and student time availability.
- **AI Active Recall Flashcards:** 3D flip-card interface for spaced repetition with "Known" and "Revise Later" tracking.
- **AI Academic Summarizer:** Multi-tier text reduction engine offering *Very Short*, *Short*, *Detailed*, and *Exam Revision* summaries.
- **Student Analytics Dashboard:** Visual progress charts tracking weekly study hours, subject syllabus completion rates, quiz scores, 7-day streaks, and actionable AI learning insights.
- **Engineering Resources Hub:** Curated directory of video lectures, official documentation, textbooks, and interactive coding labs filterable by subject and difficulty.
- **1-Click Atharva Demo Profile:** Pre-seeded demo account for **Atharva Deshmukh** (AIML, 2nd Year) loaded with realistic historical data, active subjects, weak topics, and study schedules—enabling instant college viva demonstrations without manual setup.
- **Dual AI Mode (Live LLM + Offline Intelligent Agent Fallback):** Seamlessly connects to Google Gemini or OpenAI when an API key is provided, and gracefully defaults to an offline intelligent agent knowledge base when no API key is present.
- **Full Dark & Light Mode:** Complete theme persistence across every page, component, card, and modal.

---

## 3. Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Tooling & Bundler:** Vite
- **Styling:** Tailwind CSS with custom brand palette & dark mode
- **Icons:** Lucide React
- **Typography:** Inter & JetBrains Mono

### Backend
- **Runtime:** Node.js (v18+)
- **Web Framework:** Express.js (REST API Architecture)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs password hashing
- **Security & Utilities:** CORS, dotenv, structured error handling middleware

### Database & Storage
- **Database:** MongoDB & MongoDB Atlas compatible
- **Object Modeling:** Mongoose
- **Reliability Fallback:** Embedded in-memory database engine for offline evaluation environments

### AI Layer
- **Live Provider:** Google Gemini API (`gemini-1.5-flash`) / OpenAI compatible REST endpoint
- **Offline Agent:** Multi-stage rule-and-knowledge inference agent with intent parsing, syllabus topic extraction, and adaptive recommendation heuristics

---

## 4. System Architecture

```text
React Frontend (Vite + TypeScript + Tailwind)
                     │
                     ▼  (HTTP / REST with JWT Bearer Tokens)
Express.js REST API Layer (Port 5000)
       ├── Authentication Middleware (protect)
       ├── Route Handlers (/api/auth, /api/ai, /api/subjects, /api/quiz, etc.)
       └── Controllers & Business Logic
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
AI Service Layer           MongoDB Database (Mongoose)
  ├── Intent Detection       ├── Users Collection
  ├── Context Reasoning      ├── Subjects Collection
  ├── Live Gemini / LLM      ├── Notes Collection
  └── Offline Demo Agent     ├── Quizzes & QuizResults
                             ├── StudyPlans Collection
                             ├── Flashcards Collection
                             └── Progress Analytics
```

---

## 5. Folder Structure

```text
AI Learning Assistant/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & memory fallback
│   ├── controllers/
│   │   ├── aiController.js       # AI chat, notes, quiz, study plan controllers
│   │   ├── authController.js     # Register, login, profile management
│   │   ├── flashcardsController.js
│   │   ├── notesController.js
│   │   ├── progressController.js
│   │   ├── quizController.js
│   │   ├── studyPlanController.js
│   │   └── subjectController.js
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── models/
│   │   ├── ChatHistory.js
│   │   ├── Flashcard.js
│   │   ├── Note.js
│   │   ├── Progress.js
│   │   ├── Quiz.js
│   │   ├── QuizResult.js
│   │   ├── StudyPlan.js
│   │   ├── Subject.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── flashcardRoutes.js
│   │   ├── notesRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── studyPlanRoutes.js
│   │   └── subjectRoutes.js
│   ├── services/
│   │   └── aiService.js          # Intelligent agent logic & live LLM integration
│   ├── utils/
│   │   └── seedData.js           # Atharva demo student pre-seeding
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgentWorkflowVisualizer.tsx
│   │   │   ├── AIStatusBadge.tsx
│   │   │   ├── MarkdownRenderer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── pages/
│   │   │   ├── AboutPage.tsx
│   │   │   ├── AIAssistantPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── FlashcardsPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── NotesPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── ProgressPage.tsx
│   │   │   ├── QuizPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ResourcesPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   ├── StudyPlannerPage.tsx
│   │   │   ├── SubjectsPage.tsx
│   │   │   └── SummarizerPage.tsx
│   │   ├── services/
│   │   │   └── api.ts            # Client API client methods
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript type definitions
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── README.md
└── package.json                  # Root runner scripts
```

---

## 6. Installation & Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- *(Optional)* **MongoDB Community Server** or a free **MongoDB Atlas URI** (if not present, the system automatically uses its embedded memory database).

### 1. Clone or Open the Repository
```bash
cd "AI Learning Assistant"
```

### 2. Install All Dependencies
Run from the project root:
```bash
npm run install-all
```
*(Or install manually in both folders)*:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Environment Variables Configuration
In the `backend/` directory, copy `.env.example` to `.env`:
```bash
cp backend/.env.example backend/.env
```

Contents of `backend/.env`:
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection (Local or Atlas)
# If left as-is and mongod is not running, the app automatically runs in high-reliability in-memory mode
MONGODB_URI=mongodb://127.0.0.1:27017/ai_learning_assistant

# JWT Authentication Secret
JWT_SECRET=super_secret_ai_learning_assistant_jwt_key_2026

# AI Engine Mode
# 'demo' = Intelligent offline college agent (Default, zero API key needed)
# 'gemini' = Live Google Gemini API
AI_PROVIDER=demo
AI_API_KEY=
AI_MODEL=gemini-1.5-flash
```

---

## 7. Running the Project

### Option A: Run Both Frontend and Backend Concurrently (Recommended)
From the project root directory:
```bash
npm run dev
```
This automatically starts:
- **Backend API:** `http://localhost:5000`
- **Frontend App:** `http://localhost:5173`

### Option B: Run Individually in Separate Terminals

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 8. College Viva & Demonstration Guide

To present this project in a college viva or evaluation session:

### Step 1: Open the Application
Navigate to `http://localhost:5173`. Point out the modern, responsive AI + EdTech SaaS landing page, feature cards, and the 7-stage **Intelligent Agent Architecture** diagram.

### Step 2: 1-Click Login as Demo Student
Click the **"1-Click Atharva Demo"** or click **Login** and press **"1-Click Login as Atharva"**.
- Pre-filled credentials: `atharva@college.edu` / `password123`
- Student profile: Atharva Deshmukh, 2nd Year, AI & Machine Learning.

### Step 3: Explain the Dashboard Analytics
Show the 4 core KPI metrics:
- **18.5 hrs** study time
- **24** topics completed
- **82%** average quiz score
- **7-day** learning streak
Show **Continue Learning** cards and **Topics You Should Revise** (e.g., Recursion & Backtracking at 58% score).

### Step 4: Live AI Assistant Interaction
Open **AI Assistant** from the sidebar or click **Ask AI Doubt**.
- Ask: `"Explain supervised learning in simple language."`
- Highlight the agent status indicator: *"Understanding your academic question..."*
- Show the generated response: clean definitions, difference tables, Python `scikit-learn` code snippet with 1-click copy, and viva exam tips.
- Demonstrate the **Recommended Next Actions** generated by the agent.
- Click **"Save to Notes"** to demonstrate persistence.

### Step 5: Notes Generator Demonstration
Navigate to **Smart Notes**.
- Select Subject: `Machine Learning`, Topic: `Decision Trees`, Style: `Exam-oriented`.
- Click **Generate Exam Notes**.
- Show the 6-part structured output: Definition, Theory, Key Points, Advantages/Disadvantages, Real-world Applications, and 4 University Exam Questions with mark weightages.
- Click **Download .MD** to show downloadable study notes.

### Step 6: Interactive MCQ Quiz & AI Diagnostic Evaluation
Navigate to **AI Quiz**.
- Topic: `Decision Trees`, 5 questions, Medium difficulty.
- Click **Generate AI Quiz**.
- Show the interactive quiz runner with timer, option selection, and submit.
- Show the **AI Performance Analysis**:
  - Exact percentage score.
  - Detected **Strong Topics**.
  - Detected **Weak Topics**.
  - Tailored revision recommendations.
- Show the question-by-question review with explanations.

### Step 7: Personalized Study Planner
Navigate to **Study Planner**.
- Show the daily & weekly timetable generated according to exam targets.
- Check off completed tasks to show interactive progress bar updating.
- Demonstrate adding a custom task to the schedule.

### Step 8: Active Recall Flashcards & Summarizer
- Show **Flashcards**: click the 3D card to flip between Question and Answer, mark "Known" or "Revise Later".
- Show **Summarizer**: paste any textbook paragraph and select *Exam Revision* to obtain concise bullet takeaways.

---

## 9. REST API Documentation

### Authentication Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new student profile |
| `POST` | `/api/auth/login` | Authenticate student & receive JWT |
| `GET` | `/api/auth/me` | Retrieve active student profile |
| `PUT` | `/api/auth/profile` | Update profile details and learning level |

### AI Intelligent Agent Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/ai/config` | Get AI provider mode (`live` vs `demo`) |
| `POST` | `/api/ai/chat` | Submit student doubt to AI agent |
| `GET` | `/api/ai/conversations` | List previous chat sessions |
| `GET` | `/api/ai/conversations/:id` | Fetch message history for a session |
| `POST` | `/api/ai/notes` | Generate structured engineering notes |
| `POST` | `/api/ai/quiz` | Generate topic-specific MCQ quiz |
| `POST` | `/api/ai/study-plan` | Generate personalized study schedule |
| `POST` | `/api/ai/flashcards` | Generate revision flashcard deck |
| `POST` | `/api/ai/summarize` | Generate multi-format text summary |

### Core Learning Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/subjects` | List student enrolled subjects & syllabus progress |
| `POST` | `/api/subjects` | Add a new subject with unit topics |
| `POST` | `/api/quiz/submit` | Submit quiz answers and obtain AI analysis |
| `GET` | `/api/quiz/history` | Retrieve historical quiz records |
| `GET` | `/api/study-plan` | Retrieve current personalized timetable |
| `PUT` | `/api/study-plan/tasks/:id` | Toggle task completion / edit notes |
| `GET` | `/api/progress` | Fetch comprehensive analytics & insights |
| `GET` | `/api/notes` | Fetch student saved notes collection |
| `GET` | `/api/flashcards` | Fetch saved flashcard decks |

---

## 10. Future Scope

1. **Voice-Based Conversational AI:** Real-time speech input and spoken answers for auditory learning.
2. **Multilingual Regional Support:** Academic explanations translated into Hindi, Marathi, and other regional languages.
3. **Document / PDF RAG Engine:** Retrieval-Augmented Generation indexing university-specific PDF textbooks and professor lecture slides.
4. **LMS & Classroom Integration:** Bi-directional sync with college LMS platforms (Moodle, Canvas, Google Classroom).
5. **Mobile Application:** React Native / Flutter cross-platform companion app for offline flashcard review.

---

## 11. License

This project was built for academic evaluation as a **College Engineering Mini Project**. Free to use and extend for educational purposes.
