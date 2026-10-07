const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Note = require('../models/Note');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const StudyPlan = require('../models/StudyPlan');
const Flashcard = require('../models/Flashcard');
const Progress = require('../models/Progress');

const DEMO_USER_EMAIL = 'atharva@college.edu';

const seedInitialData = async () => {
  try {
    console.log('[Seed] Checking if demo user data exists...');
    let user = await User.findOne({ email: DEMO_USER_EMAIL });

    const hashedPassword = await bcrypt.hash('password123', 10);

    if (!user) {
      console.log('[Seed] Creating demo student profile (Atharva)...');
      user = await User.create({
        name: 'Atharva Deshmukh',
        email: DEMO_USER_EMAIL,
        password: hashedPassword,
        college: 'MIT Academy of Engineering',
        branch: 'Artificial Intelligence & Machine Learning',
        year: '2nd Year',
        interests: ['Machine Learning', 'Data Structures', 'Python', 'Algorithms', 'Deep Learning'],
        learningLevel: 'Intermediate',
      });
    }

    const userId = user._id;

    // 1. Seed Subjects if empty
    const subjectCount = await Subject.countDocuments({ userId });
    if (subjectCount === 0) {
      console.log('[Seed] Seeding college subjects...');
      await Subject.insertMany([
        {
          userId,
          name: 'Machine Learning',
          code: 'CS-401',
          category: 'Artificial Intelligence',
          progress: 65,
          topics: ['Decision Trees', 'Linear Regression', 'Logistic Regression', 'Support Vector Machines', 'Neural Networks'],
          completedTopics: ['Linear Regression', 'Logistic Regression'],
          quizScore: 84,
          lastStudied: new Date(Date.now() - 2 * 60 * 60 * 1000),
          color: 'from-blue-600 to-indigo-600',
          icon: 'brain',
        },
        {
          userId,
          name: 'Data Structures & Algorithms',
          code: 'CS-302',
          category: 'Core Computer Science',
          progress: 40,
          topics: ['Arrays & Strings', 'Linked Lists', 'Binary Trees', 'Recursion & Backtracking', 'Graph Algorithms'],
          completedTopics: ['Arrays & Strings', 'Linked Lists'],
          quizScore: 78,
          lastStudied: new Date(Date.now() - 5 * 60 * 60 * 1000),
          color: 'from-purple-600 to-pink-600',
          icon: 'network',
        },
        {
          userId,
          name: 'Python Programming',
          code: 'CS-205',
          category: 'Programming Languages',
          progress: 85,
          topics: ['Data Types', 'OOPs in Python', 'Decorators & Generators', 'NumPy & Pandas', 'File Handling'],
          completedTopics: ['Data Types', 'OOPs in Python', 'NumPy & Pandas'],
          quizScore: 92,
          lastStudied: new Date(Date.now() - 24 * 60 * 60 * 1000),
          color: 'from-amber-500 to-orange-600',
          icon: 'code',
        },
        {
          userId,
          name: 'Database Management Systems',
          code: 'CS-304',
          category: 'Data Management',
          progress: 55,
          topics: ['ER Modeling', 'Relational Algebra', 'SQL Joins & Queries', 'Normalization (1NF-BCNF)', 'Transactions & ACID'],
          completedTopics: ['ER Modeling', 'Relational Algebra'],
          quizScore: 75,
          lastStudied: new Date(Date.now() - 48 * 60 * 60 * 1000),
          color: 'from-emerald-500 to-teal-600',
          icon: 'database',
        },
        {
          userId,
          name: 'Discrete Mathematics',
          code: 'MA-201',
          category: 'Applied Mathematics',
          progress: 70,
          topics: ['Set Theory', 'Propositional Logic', 'Graph Theory', 'Combinatorics', 'Recurrence Relations'],
          completedTopics: ['Set Theory', 'Propositional Logic', 'Graph Theory'],
          quizScore: 88,
          lastStudied: new Date(Date.now() - 72 * 60 * 60 * 1000),
          color: 'from-cyan-500 to-blue-600',
          icon: 'calculator',
        },
      ]);
    }

    // 2. Seed Progress Analytics
    let progress = await Progress.findOne({ userId });
    if (!progress) {
      console.log('[Seed] Seeding student progress analytics...');
      await Progress.create({
        userId,
        studyHours: 18.5,
        topicsCompleted: 24,
        streak: 7,
        averageQuizScore: 82,
        weeklyStudyHours: [
          { day: 'Mon', hours: 2.5 },
          { day: 'Tue', hours: 3.0 },
          { day: 'Wed', hours: 2.0 },
          { day: 'Thu', hours: 3.5 },
          { day: 'Fri', hours: 2.5 },
          { day: 'Sat', hours: 4.0 },
          { day: 'Sun', hours: 1.0 },
        ],
        subjectProgress: [
          { subject: 'Machine Learning', progress: 65, completedTopics: 6, totalTopics: 10, score: 84, color: '#3B82F6' },
          { subject: 'Data Structures', progress: 40, completedTopics: 4, totalTopics: 10, score: 78, color: '#8B5CF6' },
          { subject: 'Python Programming', progress: 85, completedTopics: 9, totalTopics: 11, score: 92, color: '#F59E0B' },
          { subject: 'Database Systems', progress: 55, completedTopics: 5, totalTopics: 9, score: 75, color: '#10B981' },
          { subject: 'Discrete Mathematics', progress: 70, completedTopics: 7, totalTopics: 10, score: 88, color: '#06B6D4' },
        ],
        weakTopics: [
          { topic: 'Recursion & Backtracking', subject: 'Data Structures', status: 'Needs Practice', score: 58 },
          { topic: 'Decision Trees & Entropy', subject: 'Machine Learning', status: 'Moderate', score: 68 },
          { topic: 'SQL Joins & Subqueries', subject: 'Database Systems', status: 'Needs Practice', score: 62 },
        ],
        strongTopics: [
          { topic: 'Python OOP & Lists', subject: 'Python Programming', score: 95 },
          { topic: 'Graph Theory & Paths', subject: 'Discrete Mathematics', score: 90 },
          { topic: 'Linear Regression Analysis', subject: 'Machine Learning', score: 88 },
        ],
        recommendations: [
          {
            title: 'Revise Decision Trees',
            subject: 'Machine Learning',
            description: 'Focus on Information Gain and Shannon Entropy mathematical formulas.',
            action: 'Start Notes →',
            itemType: 'notes',
          },
          {
            title: 'Practice Binary Tree Questions',
            subject: 'Data Structures',
            description: 'Solve Inorder, Preorder, and Postorder recursion questions.',
            action: 'Take Quiz →',
            itemType: 'quiz',
          },
          {
            title: 'Take a Machine Learning Quiz',
            subject: 'Machine Learning',
            description: 'Test your understanding of classification algorithms and evaluation metrics.',
            action: 'Start Quiz →',
            itemType: 'quiz',
          },
          {
            title: 'Review Python Recursion',
            subject: 'Python Programming',
            description: 'Strengthen base condition handling and avoid recursion depth errors.',
            action: 'Open Flashcards →',
            itemType: 'flashcards',
          },
        ],
        recentActivity: [
          { title: 'Completed Decision Trees MCQ Quiz (Score: 80%)', subject: 'Machine Learning', time: '2 hours ago', activityType: 'quiz' },
          { title: 'Generated Exam Notes for Supervised Learning', subject: 'Machine Learning', time: 'Yesterday', activityType: 'notes' },
          { title: 'Solved 5 Binary Tree Traversal Problems', subject: 'Data Structures', time: '2 days ago', activityType: 'practice' },
          { title: 'Updated Exam Study Timetable', subject: 'Study Planner', time: '3 days ago', activityType: 'planner' },
        ],
      });
    }

    // 3. Seed Study Plan
    const planCount = await StudyPlan.countDocuments({ userId });
    if (planCount === 0) {
      console.log('[Seed] Seeding personalized study plan...');
      const { generateStudyPlan } = require('../services/aiService');
      const planData = await generateStudyPlan({
        examDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        subjects: ['Machine Learning', 'Data Structures', 'Python'],
      });
      await StudyPlan.create({
        userId,
        ...planData,
      });
    }

    // 4. Seed Notes
    const noteCount = await Note.countDocuments({ userId });
    if (noteCount === 0) {
      console.log('[Seed] Seeding sample revision notes...');
      const { generateNotes } = require('../services/aiService');
      const sampleNote = await generateNotes({
        subject: 'Machine Learning',
        topic: 'Supervised Learning',
        style: 'Exam-oriented',
      });
      await Note.create({
        userId,
        subject: 'Machine Learning',
        topic: 'Supervised Learning',
        style: 'Exam-oriented',
        difficulty: 'Intermediate',
        content: sampleNote.notes,
      });
    }

    // 5. Seed Flashcards
    const flashCount = await Flashcard.countDocuments({ userId });
    if (flashCount === 0) {
      console.log('[Seed] Seeding sample flashcards...');
      const { generateFlashcards } = require('../services/aiService');
      const fc = await generateFlashcards({ topic: 'Decision Trees', subject: 'Machine Learning' });
      await Flashcard.create({
        userId,
        subject: 'Machine Learning',
        topic: 'Decision Trees',
        cards: fc.cards,
      });
    }

    console.log('[Seed] Demo student data successfully seeded!');
  } catch (err) {
    console.error('[Seed] Error during seeding:', err.message);
  }
};

module.exports = { seedInitialData, DEMO_USER_EMAIL };

// Allow standalone execution: node utils/seedData.js
if (require.main === module) {
  require('dotenv').config();
  const { connectDB, disconnectDB } = require('../config/db');
  (async () => {
    await connectDB();
    await seedInitialData();
    await disconnectDB();
    process.exit(0);
  })();
}
