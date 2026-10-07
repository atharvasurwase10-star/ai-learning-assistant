/**
 * AI Service Layer - Intelligent Learning Agent
 * Supports:
 * 1. Live LLM API (Google Gemini / OpenAI compatible)
 * 2. High-fidelity Demo/Mock Intelligent Agent with Intent Detection,
 *    Contextual Engineering Knowledge Base, and Next-Step Recommendations.
 */

const https = require('https');

// Check configured provider
const getAIConfig = () => {
  const provider = (process.env.AI_PROVIDER || 'demo').toLowerCase();
  const apiKey = process.env.AI_API_KEY || '';
  const isLive = Boolean(apiKey && apiKey.trim() !== '' && provider !== 'demo');
  return {
    provider: isLive ? provider : 'demo',
    apiKey,
    isLive,
    model: process.env.AI_MODEL || (provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-3.5-turbo'),
  };
};

// ==========================================
// 1. INTENT & CONTEXT ANALYZER (Agent Core)
// ==========================================

const detectIntent = (text = '') => {
  const lower = text.toLowerCase();
  if (lower.includes('quiz') || lower.includes('mcq') || lower.includes('test')) return 'quiz_request';
  if (lower.includes('note') || lower.includes('formula') || lower.includes('cheat sheet')) return 'generate_notes';
  if (lower.includes('plan') || lower.includes('schedule') || lower.includes('timetable')) return 'study_plan';
  if (lower.includes('flashcard') || lower.includes('card')) return 'flashcard_request';
  if (lower.includes('summar') || lower.includes('brief') || lower.includes('tl;dr')) return 'summarize';
  if (lower.includes('code') || lower.includes('program') || lower.includes('implement') || lower.includes('bug')) return 'coding_assistance';
  if (lower.includes('exam') || lower.includes('important question') || lower.includes('marks')) return 'exam_prep';
  if (lower.includes('step by step') || lower.includes('how does') || lower.includes('derive')) return 'step_by_step_explanation';
  return 'concept_explanation';
};

const extractTopicAndSubject = (text = '', fallbackSubject = 'General Engineering') => {
  const lower = text.toLowerCase();
  let subject = fallbackSubject;
  let topic = 'Concept';

  if (lower.includes('supervised') || lower.includes('decision tree') || lower.includes('svm') || lower.includes('machine learning') || lower.includes('regression') || lower.includes('gradient descent')) {
    subject = 'Machine Learning';
    if (lower.includes('decision tree')) topic = 'Decision Trees & Information Gain';
    else if (lower.includes('supervised')) topic = 'Supervised Learning';
    else if (lower.includes('regression')) topic = 'Linear & Logistic Regression';
    else topic = 'Machine Learning Foundations';
  } else if (lower.includes('binary tree') || lower.includes('tree') || lower.includes('graph') || lower.includes('recursion') || lower.includes('linked list') || lower.includes('stack') || lower.includes('queue') || lower.includes('dsa')) {
    subject = 'Data Structures & Algorithms';
    if (lower.includes('binary tree')) topic = 'Binary Trees & Traversals';
    else if (lower.includes('recursion')) topic = 'Recursion & Backtracking';
    else if (lower.includes('graph')) topic = 'Graph Algorithms (BFS/DFS)';
    else topic = 'Data Structures';
  } else if (lower.includes('sql') || lower.includes('normalization') || lower.includes('dbms') || lower.includes('acid') || lower.includes('join')) {
    subject = 'Database Management Systems';
    if (lower.includes('normalization')) topic = 'Database Normalization (1NF to BCNF)';
    else if (lower.includes('acid')) topic = 'ACID Properties & Transactions';
    else if (lower.includes('join')) topic = 'SQL Joins & Indexing';
    else topic = 'Relational Databases';
  } else if (lower.includes('python') || lower.includes('numpy') || lower.includes('pandas') || lower.includes('decorator')) {
    subject = 'Python Programming';
    topic = 'Python Core & Libraries';
  }

  return { subject, topic };
};

// ==========================================
// 2. DEMO KNOWLEDGE BASE & AGENT LOGIC
// ==========================================

const generateAgentRecommendations = (subject, topic, learningLevel) => {
  const recs = [
    `Take a quick 5-question MCQ quiz on ${topic}`,
    `Review key exam formulas & definitions for ${subject}`,
    `Generate revision flashcards for active recall`,
    `Apply this in code: write a practical implementation`,
  ];
  return recs;
};

const generateMockExplanation = (message, subject, topic, level) => {
  const cleanMessage = message.trim();

  // Special tailored rich responses for popular college engineering demo questions:
  if (cleanMessage.toLowerCase().includes('supervised learning')) {
    return `### What is Supervised Learning?

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
  * *Answer:* Overfitting occurs when the model memorizes training noise. Prevent it with cross-validation, regularization ($L_1/L_2$), pruning, and dropout.`;
  }

  if (cleanMessage.toLowerCase().includes('decision tree')) {
    return `### Understanding Decision Trees in Machine Learning

A **Decision Tree** is a non-parametric supervised learning algorithm used for both classification and regression tasks. It utilizes a hierarchical, tree-structured flowchart where each internal node denotes a test on an attribute, each branch represents an outcome of the test, and each leaf node holds a class label.

---

### Core Mathematical Concepts: Splitting Criteria

Decision Trees make splits by maximizing **Information Gain** (reduction in uncertainty).

#### 1. Shannon Entropy
Entropy measures the impurity or disorder of a collection of examples:

$$H(S) = -\\sum_{i=1}^{c} p_i \\log_2(p_i)$$

Where $p_i$ is the probability of class $i$ in dataset $S$. If all samples belong to one class, $H(S) = 0$ (pure node).

#### 2. Information Gain (ID3 Algorithm)
Information Gain is the expected reduction in entropy achieved by partitioning on attribute $A$:

$$IG(S, A) = H(S) - \\sum_{v \\in \\text{Values}(A)} \\frac{|S_v|}{|S|} H(S_v)$$

#### 3. Gini Impurity (CART Algorithm)
Used in Scikit-Learn's CART algorithm:

$$\\text{Gini}(S) = 1 - \\sum_{i=1}^{c} p_i^2$$

---

### Advantages vs. Disadvantages

* **Advantages:**
  - Highly interpretable ("white box" model).
  - Handles both numerical and categorical data with minimal data preprocessing.
  - Non-linear relationships are naturally modeled.

* **Disadvantages:**
  - High variance: small perturbations in training data produce radically different trees.
  - Prone to severe overfitting if depth is unconstrained (mitigated using tree pruning and Random Forests).

---

### Next Step Recommendation
To master Decision Trees for your upcoming university exam, practice calculating Information Gain on a sample table, and test your understanding with a 5-question quiz!`;
  }

  if (cleanMessage.toLowerCase().includes('recursion') || cleanMessage.toLowerCase().includes('binary tree')) {
    return `### Deep Dive: Recursion and Tree Traversals in DSA

A **recursive function** is a function that solves a computational problem by solving smaller instances of the exact same problem until reaching a terminating **base condition**.

---

### 3 Golden Rules of Recursion
1. **Base Case:** The condition where recursion stops without making further recursive calls.
2. **Recursive Hypothesis:** Assuming the function correctly solves smaller subproblems $(n-1)$ or left/right subtrees.
3. **Inductive Step:** Combining subproblem solutions with current work to produce final result.

---

### Binary Tree Traversal Example (Python)

\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root):
    """Left -> Root -> Right traversal"""
    if not root:
        return []
    return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right)

# Example Tree: [1, None, 2, 3]
root = TreeNode(1, None, TreeNode(2, TreeNode(3), None))
print("Inorder:", inorder_traversal(root))  # Output: [1, 3, 2]
\`\`\`

---

### Time & Space Complexity Analysis
* **Time Complexity:** $\\mathcal{O}(N)$ where $N$ is the total number of nodes, as each node is visited once.
* **Space Complexity:** $\\mathcal{O}(H)$ where $H$ is the tree height, corresponding to maximum recursion stack depth.
  - Best case (balanced tree): $\\mathcal{O}(\\log N)$
  - Worst case (skewed tree): $\\mathcal{O}(N)$ stack frames (can trigger StackOverflow error).`;
  }

  // Dynamic engineering response generator for any arbitrary question
  return `### Comprehensive Engineering Analysis: ${topic || 'Academic Concept'}

**Level:** ${level} | **Subject:** ${subject}

#### 1. Core Definition & Theoretical Foundation
The concept of **${cleanMessage.slice(0, 50)}...** is a critical component of modern ${subject}. In engineering problem-solving, this establishes the foundational principle for designing scalable, mathematically verifiable systems.

#### 2. Key Architectural & Operational Principles
- **Modularity & Abstraction:** Decouples implementation details from functional interfaces.
- **Predictable State Transitions:** Ensures deterministic runtime performance under specified boundary conditions.
- **Complexity Trade-Offs:** Balances computational resource allocation (time vs. memory footprint).

#### 3. Mathematical & Algorithmic Formulation
When modeling this behavior formally:
$$\\text{Efficiency}(\\mathcal{S}) = \\lim_{n \\to \\infty} \\frac{\\text{Performance}(n)}{\\text{ResourceCost}(n)}$$

Key parameters to inspect include input variance, invariant boundary conditions, and convergence rate.

#### 4. Real-World Engineering Applications
1. **High-Performance Distributed Systems:** Applied in fault-tolerant distributed pipelines.
2. **Embedded & Real-Time Computing:** Optimizes latency-critical workloads in constrained hardware.
3. **Automated Verification:** Standard benchmark topic in college engineering viva and semester exams.

#### 5. Recommended Next Action
Review the accompanying flashcards, save this summary to your personal study notes, or take an AI-generated quiz to solidify your understanding.`;
};

// ==========================================
// 3. EXPORTED SERVICE FUNCTIONS
// ==========================================

/**
 * Main chat assistant agent
 */
const askAssistant = async ({ message, conversationId, subject, learningLevel = 'Intermediate' }) => {
  const { isLive } = getAIConfig();
  const intent = detectIntent(message);
  const detected = extractTopicAndSubject(message, subject || 'General Engineering');

  // Realistic agent thinking statuses
  const statusMessages = [
    'Understanding your academic question...',
    'Analyzing context and engineering principles...',
    'Synthesizing verified explanation & recommendations...',
  ];

  let replyText = '';

  if (isLive) {
    try {
      // In a real environment with valid API key, we call Gemini or OpenAI
      replyText = await callLiveLLM({
        prompt: `You are an intelligent AI college engineering learning assistant.
Student Level: ${learningLevel}
Subject: ${detected.subject}
Question: ${message}

Provide a well-structured, authoritative, clear engineering answer with:
- Clear Headings (Markdown)
- Bullet points and numbered lists
- Practical code snippets or mathematical formulas if applicable
- Common exam viva questions and practical applications.`,
      });
    } catch (err) {
      console.warn('[AI Service] Live call failed, switching gracefully to Demo Agent fallback:', err.message);
      replyText = generateMockExplanation(message, detected.subject, detected.topic, learningLevel);
    }
  } else {
    // Intelligent Demo Mock Agent
    replyText = generateMockExplanation(message, detected.subject, detected.topic, learningLevel);
  }

  const recommendations = generateAgentRecommendations(detected.subject, detected.topic, learningLevel);

  return {
    reply: replyText,
    intent,
    subject: detected.subject,
    topic: detected.topic,
    recommendations,
    statusMessages,
    mode: isLive ? 'live' : 'demo',
  };
};

/**
 * Generate Structured Notes
 */
const generateNotes = async ({ subject, topic, style = 'Exam-oriented', difficulty = 'Intermediate' }) => {
  const { isLive } = getAIConfig();

  if (isLive) {
    try {
      const response = await callLiveLLM({
        prompt: `Generate comprehensive engineering study notes in JSON format for:
Subject: ${subject}
Topic: ${topic}
Style: ${style}
Difficulty: ${difficulty}

Return JSON with keys: definition, explanation, keyPoints (array), examples (array), advantages (array), disadvantages (array), applications (array), examQuestions (array).`,
      });
      const parsed = JSON.parse(response);
      return { notes: parsed, mode: 'live' };
    } catch (e) {
      console.warn('[AI Service] Notes LLM fallback to demo:', e.message);
    }
  }

  // Pre-crafted structured engineering notes
  const notesData = {
    definition: `${topic} is a core foundational concept in ${subject} that provides formalized methods to solve complex computational and architectural engineering problems.`,
    explanation: `In standard engineering curricula, studying ${topic} requires understanding both theoretical guarantees and practical constraints. It abstracts low-level operational semantics while maintaining deterministic performance, predictable memory layout, and clear algorithmic execution steps.`,
    keyPoints: [
      `Provides mathematically sound formulation for ${subject} systems`,
      'Optimizes time and space complexity trade-offs during execution',
      'Follows industry-standard engineering best practices and architectural patterns',
      'Extensively tested in university examinations and technical placement interviews',
      'Integrates seamlessly with modern computing toolchains and libraries',
    ],
    examples: [
      `Practical Implementation in Python/C++ illustrating core operations of ${topic}`,
      `Benchmark performance comparison under varied input distributions`,
    ],
    advantages: [
      'High modularity and maintainability',
      'Deterministic algorithmic behavior with verifiable boundary bounds',
      'Reduced cognitive overhead through elegant abstraction',
    ],
    disadvantages: [
      'Potential overhead in resource-constrained embedded systems',
      'Requires thorough understanding of mathematical prerequisites',
    ],
    applications: [
      'Production-grade cloud platforms and backend servers',
      'High-throughput data streaming and analytics engines',
      'Automated inference and decision-support systems',
    ],
    examQuestions: [
      `Define ${topic} and explain its core architecture with a neat diagram. (5 Marks)`,
      `Compare and contrast ${topic} with alternative paradigms in ${subject}. (7 Marks)`,
      `Derive the time and space complexity of ${topic}. (8 Marks)`,
      `Viva Question: What happens when edge case bounds are exceeded in ${topic}?`,
    ],
  };

  return {
    notes: notesData,
    mode: 'demo',
  };
};

/**
 * Generate AI Quiz
 */
const generateQuiz = async ({ subject, topic, numQuestions = 5, difficulty = 'Medium' }) => {
  const { isLive } = getAIConfig();

  if (isLive) {
    try {
      const prompt = `Generate an engineering MCQ quiz with ${numQuestions} questions on:
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Format as JSON array with items having: question, options (4 strings), correctAnswer (index 0-3), explanation.`;
      const res = await callLiveLLM({ prompt });
      const questions = JSON.parse(res);
      return { questions, mode: 'live' };
    } catch (e) {
      console.warn('[AI Service] Quiz LLM fallback to demo:', e.message);
    }
  }

  // Engineering Quiz Questions tailored to topic
  let questions = [];

  if (topic.toLowerCase().includes('decision tree') || topic.toLowerCase().includes('machine learning')) {
    questions = [
      {
        question: 'Which metric is primarily used by the ID3 algorithm to determine the optimal split in a Decision Tree?',
        options: ['Gini Impurity', 'Information Gain (Shannon Entropy)', 'Mean Squared Error', 'Euclidean Distance'],
        correctAnswer: 1,
        explanation: 'The ID3 algorithm chooses splits that maximize Information Gain based on Shannon Entropy.',
      },
      {
        question: 'What is the theoretical entropy value of a perfectly pure node containing instances of only one single class?',
        options: ['1.0', '0.5', '0.0', 'Infinity'],
        correctAnswer: 2,
        explanation: 'When all samples belong to a single class, probability p = 1.0, so -1 * log2(1) = 0.',
      },
      {
        question: 'Which technique is most effective to mitigate overfitting in complex Decision Trees?',
        options: ['Increasing maximum tree depth', 'Post-pruning and setting minimum samples per leaf', 'Disabling cross-validation', 'One-hot encoding labels'],
        correctAnswer: 1,
        explanation: 'Pruning reduces the tree size by removing subtrees that provide negligible predictive power, preventing overfitting.',
      },
      {
        question: 'CART algorithm in Scikit-Learn defaults to which splitting criterion for classification?',
        options: ['Gini Impurity', 'Chi-Square', 'Log-Loss', 'Variance Reduction'],
        correctAnswer: 0,
        explanation: 'CART (Classification and Regression Trees) uses Gini Impurity as its default classification criterion.',
      },
      {
        question: 'What is a primary disadvantage of single Decision Trees compared to Ensemble methods like Random Forest?',
        options: ['They are computationally impossible to train', 'High variance and susceptibility to small training data shifts', 'Inability to handle categorical features', 'Zero interpretability'],
        correctAnswer: 1,
        explanation: 'Individual decision trees suffer from high variance; ensemble methods like bagging reduce variance significantly.',
      },
    ];
  } else if (topic.toLowerCase().includes('recursion') || topic.toLowerCase().includes('tree') || topic.toLowerCase().includes('dsa')) {
    questions = [
      {
        question: 'What is the primary risk when a recursive function fails to hit its terminating base condition?',
        options: ['Memory fragmentation', 'Call Stack Overflow (Segmentation Fault)', 'Deadlock condition', 'Cache eviction'],
        correctAnswer: 1,
        explanation: 'Unbounded recursive invocations continuously push stack frames until available call stack memory is exhausted.',
      },
      {
        question: 'In which binary tree traversal are nodes visited in the order: Left Subtree -> Root -> Right Subtree?',
        options: ['Preorder', 'Inorder', 'Postorder', 'Level-order'],
        correctAnswer: 1,
        explanation: 'Inorder traversal visits Left, then Root, then Right. For a Binary Search Tree, this yields elements in sorted order.',
      },
      {
        question: 'What is the average time complexity of searching a node in a balanced Binary Search Tree with N nodes?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctAnswer: 1,
        explanation: 'Each step cuts the remaining search space by half in a balanced BST, resulting in logarithmic time complexity.',
      },
      {
        question: 'Which auxiliary data structure is internally maintained by the operating system / runtime to support recursion?',
        options: ['Queue', 'Call Stack', 'Hash Table', 'Max Heap'],
        correctAnswer: 1,
        explanation: 'The runtime system utilizes the activation call stack to preserve function local variables and return addresses.',
      },
      {
        question: 'What is Tail Call Optimization (TCO)?',
        options: ['Eliminating the base case', 'Reusing the current stack frame when the recursive call is the final operation', 'Converting trees to graphs', 'Sorting arrays recursively'],
        correctAnswer: 1,
        explanation: 'TCO enables compilers to execute tail-recursive routines in constant stack space by reusing the existing activation frame.',
      },
    ];
  } else {
    questions = [
      {
        question: `In modern engineering systems, what is the primary objective of analyzing ${topic}?`,
        options: [
          'Maximizing unconstrained memory consumption',
          'Establishing formal algorithmic guarantees and optimal efficiency',
          'Eliminating all software abstractions',
          'Avoiding test execution',
        ],
        correctAnswer: 1,
        explanation: `Engineering analysis ensures ${topic} delivers verified correctness and optimal time-space bounds.`,
      },
      {
        question: 'Which of the following metrics is most relevant for assessing system bottleneck performance?',
        options: ['Source code character count', 'Asymptotic Big-O time and space complexity', 'Font size of documentation', 'Operating system wallpaper'],
        correctAnswer: 1,
        explanation: 'Big-O notation formally characterizes how execution time or memory utilization scales relative to input size.',
      },
      {
        question: 'What is the principal benefit of modular engineering design?',
        options: ['Tight coupling of disparate modules', 'Independent testability, reusability, and maintainability', 'Slower compilation cycles', 'Elimination of documentation'],
        correctAnswer: 1,
        explanation: 'Modularity facilitates independent unit testing, maintenance, and concurrent team development.',
      },
      {
        question: 'When optimizing an algorithm for memory-constrained embedded environments, which factor takes highest priority?',
        options: ['Auxiliary Space Complexity', 'Network bandwidth usage', 'Display resolution', 'Keyboard layout'],
        correctAnswer: 0,
        explanation: 'Auxiliary space directly defines additional RAM demanded by the algorithm during runtime.',
      },
      {
        question: 'In engineering project presentations and vivas, how should you substantiate your design choices?',
        options: ['By relying solely on intuition', 'Using empirical benchmarks, complexity analysis, and mathematical proofs', 'By avoiding questions', 'By using unverified blogs'],
        correctAnswer: 1,
        explanation: 'College evaluators expect grounded empirical comparisons, trade-off analysis, and mathematical rigor.',
      },
    ];
  }

  return {
    questions: questions.slice(0, numQuestions),
    mode: 'demo',
  };
};

/**
 * Generate Personalized Study Plan
 */
const generateStudyPlan = async ({
  examDate,
  subjects = ['Machine Learning', 'Data Structures', 'Python'],
  availableHours = 4,
  preferredTime = 'Evening (6 PM - 10 PM)',
  difficulty = 'Intermediate',
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const sampleTasks = [
    {
      id: 'task-1',
      day: 'Monday',
      time: '06:00 PM - 07:15 PM',
      subject: subjects[0] || 'Machine Learning',
      topic: 'Decision Trees, Entropy & Pruning',
      duration: '75 mins',
      priority: 'High',
      completed: true,
      notes: 'Review ID3 vs CART splitting criteria and calculate sample Information Gain.',
    },
    {
      id: 'task-2',
      day: 'Monday',
      time: '07:30 PM - 08:45 PM',
      subject: subjects[1] || 'Data Structures',
      topic: 'Binary Tree Traversals (Inorder, Preorder)',
      duration: '75 mins',
      priority: 'High',
      completed: true,
      notes: 'Implement recursive and iterative traversals in Python.',
    },
    {
      id: 'task-3',
      day: 'Tuesday',
      time: '06:00 PM - 07:15 PM',
      subject: subjects[0] || 'Machine Learning',
      topic: 'Support Vector Machines & Kernel Trick',
      duration: '75 mins',
      priority: 'Medium',
      completed: false,
      notes: 'Understand maximum margin hyperplanes and RBF kernel projection.',
    },
    {
      id: 'task-4',
      day: 'Tuesday',
      time: '07:30 PM - 08:30 PM',
      subject: subjects[1] || 'Data Structures',
      topic: 'Recursion & Backtracking Problems',
      duration: '60 mins',
      priority: 'High',
      completed: false,
      notes: 'Solve N-Queens and Subset Sum recursion trees.',
    },
    {
      id: 'task-5',
      day: 'Wednesday',
      time: '06:00 PM - 07:30 PM',
      subject: subjects[2] || 'Python Programming',
      topic: 'Object-Oriented Programming & Decorators',
      duration: '90 mins',
      priority: 'Medium',
      completed: false,
      notes: 'Practice writing custom function decorators and magic methods.',
    },
    {
      id: 'task-6',
      day: 'Thursday',
      time: '06:00 PM - 07:30 PM',
      subject: 'Revision & Quizzes',
      topic: 'High-Yield MCQ Practice & Doubt Resolution',
      duration: '90 mins',
      priority: 'High',
      completed: false,
      notes: 'Take AI-generated quizzes to measure retention on weak topics.',
    },
    {
      id: 'task-7',
      day: 'Friday',
      time: '06:00 PM - 08:00 PM',
      subject: 'Mini Project & Lab Work',
      topic: 'AI Agent Architecture Implementation',
      duration: '120 mins',
      priority: 'High',
      completed: false,
      notes: 'Connect frontend React components to Express backend endpoints.',
    },
    {
      id: 'task-8',
      day: 'Saturday',
      time: '10:00 AM - 01:00 PM',
      subject: 'Mock Exam / Viva Simulation',
      topic: 'Comprehensive Technical Review',
      duration: '180 mins',
      priority: 'High',
      completed: false,
      notes: 'Simulate university viva questions with peer group.',
    },
  ];

  return {
    title: 'Adaptive Engineering Exam Mastery Schedule',
    examDate: examDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    availableHours,
    preferredTime,
    difficulty,
    tasks: sampleTasks,
    mode: 'demo',
  };
};

/**
 * Generate Flashcards
 */
const generateFlashcards = async ({ topic, subject = 'Engineering' }) => {
  let cards = [];

  if (topic.toLowerCase().includes('decision tree') || topic.toLowerCase().includes('machine learning')) {
    cards = [
      {
        id: 'fc-1',
        front: 'What is Entropy in Information Theory?',
        back: 'A mathematical measure of randomness, uncertainty, or impurity in a set of examples. Defined as: H(S) = -Σ p_i * log2(p_i).',
        category: 'Formula',
      },
      {
        id: 'fc-2',
        front: 'What is Information Gain?',
        back: 'The expected reduction in entropy caused by partitioning examples according to a given attribute: IG(S, A) = H(S) - Σ (|S_v|/|S|) * H(S_v).',
        category: 'Core Metric',
      },
      {
        id: 'fc-3',
        front: 'Explain Tree Pruning.',
        back: 'A technique that removes subtrees with low statistical significance to combat overfitting and improve generalization on unseen test data.',
        category: 'Optimization',
      },
      {
        id: 'fc-4',
        front: 'Difference between ID3 and C4.5 algorithms?',
        back: 'ID3 uses Information Gain on discrete features; C4.5 handles continuous attributes, missing values, and uses Gain Ratio to penalize multivalued splits.',
        category: 'Viva Question',
      },
      {
        id: 'fc-5',
        front: 'What is Gini Impurity?',
        back: 'Measures the probability of misclassifying a randomly chosen element: Gini = 1 - Σ (p_i)². Used as default metric in CART.',
        category: 'Formula',
      },
    ];
  } else if (topic.toLowerCase().includes('recursion') || topic.toLowerCase().includes('binary tree')) {
    cards = [
      {
        id: 'fc-1',
        front: 'What are the two mandatory components of every recursive algorithm?',
        back: '1. Base Case (terminates recursion)\n2. Recursive Call / Step (reduces problem toward base case).',
        category: 'Concept',
      },
      {
        id: 'fc-2',
        front: 'What is the order of Inorder Tree Traversal?',
        back: 'Left Child → Current Node (Root) → Right Child.\nProduces sorted keys in a Binary Search Tree (BST).',
        category: 'Traversal',
      },
      {
        id: 'fc-3',
        front: 'What causes a StackOverflowError during recursion?',
        back: 'Excessive recursive depth without hitting a base case, exhausting the runtime thread call stack memory buffer.',
        category: 'Debugging',
      },
      {
        id: 'fc-4',
        front: 'What is Auxiliary Space in Tree Traversal?',
        back: 'O(H) where H is the height of the tree, representing the maximum call frames stacked during traversal.',
        category: 'Complexity',
      },
    ];
  } else {
    cards = [
      {
        id: 'fc-1',
        front: `What is the core definition of ${topic}?`,
        back: `A foundational paradigm in ${subject} applied to design verifiable, performant software systems.`,
        category: 'Definition',
      },
      {
        id: 'fc-2',
        front: `What are the primary performance trade-offs in ${topic}?`,
        back: 'Time complexity vs Space complexity; runtime flexibility vs static compile-time optimization guarantees.',
        category: 'Analysis',
      },
      {
        id: 'fc-3',
        front: `Common exam question regarding ${topic}?`,
        back: 'Derive theoretical complexity, compare against alternative algorithms, and describe failure recovery modes.',
        category: 'Exam Tip',
      },
      {
        id: 'fc-4',
        front: `Best practice for implementing ${topic}?`,
        back: 'Maintain modular separation of concerns, enforce type safety, and validate input edge conditions.',
        category: 'Architecture',
      },
    ];
  }

  return {
    cards,
    topic,
    subject,
    mode: 'demo',
  };
};

/**
 * Summarize Text
 */
const summarizeText = async ({ text, lengthOption = 'Short' }) => {
  const { isLive } = getAIConfig();

  if (isLive) {
    try {
      const prompt = `Summarize the following engineering text. Format: ${lengthOption}.
Text:
${text}

Provide:
1. Executive Summary
2. Key Bullet Points
3. Exam Takeaway`;
      const res = await callLiveLLM({ prompt });
      return { summary: res, mode: 'live' };
    } catch (e) {
      console.warn('[AI Service] Summarize LLM fallback to demo:', e.message);
    }
  }

  let formatted = '';
  if (lengthOption === 'Very Short') {
    formatted = `**Quick TL;DR:**
This text focuses on fundamental engineering principles, emphasizing systematic problem reduction, architectural modularity, and algorithmic efficiency bounds.

**Key Takeaway:** Master the core definitions and boundary constraints for viva and semester assessments.`;
  } else if (lengthOption === 'Exam Revision') {
    formatted = `### Exam Revision Summary & High-Yield Points

1. **Core Concept:** Primary theoretical framework governing state transformations and computational complexity.
2. **Key Formulas & Proofs:** Note invariant conditions and asymptotic Big-O execution bounds (Time: $\\mathcal{O}(N)$, Space: $\\mathcal{O}(1)$ or $\\mathcal{O}(\\log N)$).
3. **Frequently Asked Questions:**
   - Define the main concept with diagrams.
   - Explain advantages and real-world industrial applications.
   - Contrast against older alternative techniques.`;
  } else {
    formatted = `### Detailed Engineering Summary

**1. Overview & Problem Scope:**
The provided content investigates structural mechanisms within the subject domain. It emphasizes how components interact under load, how state is preserved, and how errors are mitigated.

**2. Crucial Technical Highlights:**
- **Systematic Abstraction:** Encapsulates algorithmic complexity behind intuitive, standardized interfaces.
- **Predictable Guarantees:** Ensures reliable outputs across heterogeneous execution environments.
- **Optimization Opportunities:** Highlights bottlenecks where caching, indexing, or dynamic programming can yield $\\mathcal{O}(1)$ improvements.

**3. Practical Engineering Takeaway:**
Apply these principles when designing modular services, structuring databases, or reviewing architectural designs for academic evaluation.`;
  }

  return {
    summary: formatted,
    lengthOption,
    mode: 'demo',
  };
};

/**
 * Performance Analyzer after Quiz
 */
const analyzePerformance = ({ subject, topic, score, total, userAnswers = [], questions = [] }) => {
  const percentage = Math.round((score / total) * 100);

  let feedback = '';
  let weakTopics = [];
  let strongTopics = [];
  let recommendedTopics = [];

  if (percentage >= 80) {
    feedback = `Outstanding performance (${percentage}%)! You have demonstrated strong mastery over fundamental and intermediate concepts in ${topic}.`;
    strongTopics = [topic, 'Fundamental Principles', 'Standard Formulations'];
    weakTopics = [];
    recommendedTopics = [`Advanced Applications of ${topic}`, `System Design in ${subject}`, 'Competitive Programming'];
  } else if (percentage >= 60) {
    feedback = `Good effort (${percentage}%). You grasped foundational concepts well, but should revise nuanced mathematical formulations and edge conditions in ${topic}.`;
    strongTopics = ['Core Definitions', 'Basic Principles'];
    weakTopics = [`Detailed Math of ${topic}`, 'Edge Case Handling'];
    recommendedTopics = [`Revise ${topic} formulas`, `Practice additional MCQs on ${subject}`];
  } else {
    feedback = `Needs focused revision (${percentage}%). We detected gaps in basic definitions and analytical principles for ${topic}. Recommend generating structured notes and flashcards before re-attempting.`;
    weakTopics = [topic, 'Fundamental Definitions', 'Complexity Derivations'];
    strongTopics = [];
    recommendedTopics = [`Review Step-by-Step Notes on ${topic}`, `Flashcard Revision for ${subject}`, 'Re-take Diagnostic Quiz'];
  }

  return {
    percentage,
    feedback,
    weakTopics,
    strongTopics,
    recommendedTopics,
  };
};

/**
 * Generic caller for Live LLM (Gemini or OpenAI API)
 */
const callLiveLLM = async ({ prompt }) => {
  const config = getAIConfig();
  if (!config.isLive) {
    throw new Error('No valid AI API Key configured');
  }

  // Support for Google Gemini REST API
  if (config.provider === 'gemini') {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      });

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.candidates && parsed.candidates[0]?.content?.parts[0]?.text) {
              resolve(parsed.candidates[0].content.parts[0].text);
            } else if (parsed.error) {
              reject(new Error(parsed.error.message || 'Gemini API Error'));
            } else {
              reject(new Error('Unexpected Gemini API response structure'));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.write(postData);
      req.end();
    });
  }

  // Fallback to OpenAI compatible endpoint
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
    });

    const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
    const urlObj = new URL(apiUrl);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.choices && parsed.choices[0]?.message?.content) {
            resolve(parsed.choices[0].message.content);
          } else {
            reject(new Error(parsed.error?.message || 'OpenAI API Error'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
};

module.exports = {
  askAssistant,
  generateNotes,
  generateQuiz,
  generateStudyPlan,
  generateFlashcards,
  summarizeText,
  analyzePerformance,
  getAIConfig,
};
