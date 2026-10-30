import { QuestionItem } from '../repositories/types.ts';
import { logger } from '../utils/logger.ts';
import { GeminiService } from './geminiService.ts';

// Curated Enterprise Question Bank for Excelsoft Technologies Recruitment
const QUESTION_CATALOG: QuestionItem[] = [
  // DSA & Core Technical
  {
    id: 'q_dsa_01',
    topic: 'Data Structures & Algorithms',
    category: 'coding',
    difficulty: 'intermediate',
    question: 'How would you detect and remove a cycle in a singly linked list in O(n) time and O(1) auxiliary space?',
    expectedKeyPoints: [
      "Floyd's Cycle-Finding Algorithm (slow and fast pointers)",
      'Detection point proof and meeting condition',
      'Pointer reset to head and traversal at equal speeds to find loop start',
      'Breaking the link by tracking predecessor'
    ],
    codeSnippet: 'ListNode* detectAndRemoveLoop(ListNode* head) { ... }',
    relevantSkills: ['Data Structures & Algorithms', 'Java', 'C++', 'Python']
  },
  {
    id: 'q_dsa_02',
    topic: 'Binary Search & Monotonic Spaces',
    category: 'problem_solving',
    difficulty: 'entry',
    question: 'Given a sorted array that has been rotated at an unknown pivot, find a target element in O(log n) time.',
    expectedKeyPoints: [
      'Determining which half of the array is normally sorted',
      'Target range boundary condition comparison',
      'Handling duplicates edge case if present'
    ],
    codeSnippet: 'int searchRotated(vector<int>& nums, int target) { ... }',
    relevantSkills: ['Data Structures & Algorithms', 'Java', 'Python']
  },
  {
    id: 'q_dsa_03',
    topic: 'Dynamic Programming & Memoization',
    category: 'coding',
    difficulty: 'advanced',
    question: 'Explain the Longest Common Subsequence (LCS) recurrence. How do you optimize memory from O(m*n) to O(min(m,n))?',
    expectedKeyPoints: [
      'Optimal substructure and overlapping subproblems',
      'DP state definition: dp[i][j]',
      'Rolling array space optimization technique',
      'Path reconstruction for actual string output'
    ],
    relevantSkills: ['Data Structures & Algorithms', 'Java', 'Python']
  },

  // Java & Backend Architecture
  {
    id: 'q_java_01',
    topic: 'JVM & Concurrency',
    category: 'technical',
    difficulty: 'intermediate',
    question: 'What is the Java Memory Model (JMM)? How does the volatile keyword differ from synchronized in terms of atomicity and visibility?',
    expectedKeyPoints: [
      'CPU caches vs main memory barrier',
      'Volatile establishes a happens-before relationship for read/write visibility',
      'Volatile does NOT guarantee compound atomicity (e.g. count++)',
      'Synchronized acquires an intrinsic object monitor'
    ],
    relevantSkills: ['Java', 'Spring Boot', 'Backend Architecture']
  },
  {
    id: 'q_java_02',
    topic: 'Spring Framework & Microservices',
    category: 'technical',
    difficulty: 'intermediate',
    question: 'How does Spring manage Bean lifecycle and dependency injection? What issues arise with circular dependencies and prototype beans injected into singletons?',
    expectedKeyPoints: [
      'BeanFactory and ApplicationContext initialization phases',
      '@PostConstruct and InitializingBean',
      'Three-level cache in DefaultSingletonBeanRegistry for circular references',
      'Using @Lookup or ObjectFactory for prototype bean scope resolution'
    ],
    relevantSkills: ['Spring Boot', 'Java', 'Microservices']
  },

  // Frontend & React
  {
    id: 'q_react_01',
    topic: 'React 19 & Virtual DOM',
    category: 'technical',
    difficulty: 'intermediate',
    question: 'How does React 19 handle Concurrent Rendering and Server Actions? What is the purpose of the new useActionState hook?',
    expectedKeyPoints: [
      'Fibers and priority lanes for non-blocking UI interrupts',
      'Transition API (startTransition) separating urgent from non-urgent state',
      'useActionState for managing asynchronous action states with automatic pending state',
      'Automatic batching across microtasks'
    ],
    relevantSkills: ['React', 'TypeScript', 'Frontend']
  },
  {
    id: 'q_react_02',
    topic: 'State Management & Performance',
    category: 'problem_solving',
    difficulty: 'advanced',
    question: 'In a high-frequency real-time dashboard receiving 50 WebSocket messages per second, how do you prevent unnecessary React re-renders?',
    expectedKeyPoints: [
      'Throttling and debouncing state updates via RAF (requestAnimationFrame)',
      'Subscribing components using useSyncExternalStore or external listener store',
      'Canvas/WebGL offloading for dense charts',
      'Memoization via useMemo / React.memo with customized comparator'
    ],
    relevantSkills: ['React', 'TypeScript', 'Micro-frontends']
  },

  // Databases & Storage
  {
    id: 'q_db_01',
    topic: 'Relational Database Indexing',
    category: 'technical',
    difficulty: 'intermediate',
    question: 'How do B-Tree and Hash indexes differ in PostgreSQL? Why does a composite index (A, B) not accelerate queries filtering only on B?',
    expectedKeyPoints: [
      'B-Tree preserves order and supports range queries; Hash is O(1) equality only',
      'Leftmost prefix matching rule for composite indexes',
      'Covering indexes and index-only scans',
      'Cost-based query planner decision matrix'
    ],
    relevantSkills: ['SQL', 'PostgreSQL', 'Databases']
  },

  // AI & Machine Learning
  {
    id: 'q_ai_01',
    topic: 'Transformer Architecture & Embeddings',
    category: 'role_specific',
    difficulty: 'advanced',
    question: 'Explain the Self-Attention mechanism in Transformer models. Why is Scaled Dot-Product divided by sqrt(d_k)?',
    expectedKeyPoints: [
      'Query, Key, Value vector projections',
      'Dot products grow large in magnitude for high dimensions, pushing softmax into regions with tiny gradients',
      'Scaling stabilizes softmax temperature and backpropagation variance',
      'Multi-head attention providing representation subspaces'
    ],
    relevantSkills: ['Python', 'PyTorch', 'Machine Learning', 'NLP']
  },

  // System Design & Scalability
  {
    id: 'q_sys_01',
    topic: 'Distributed Systems & Consistency',
    category: 'problem_solving',
    difficulty: 'advanced',
    question: 'Design an automated high-throughput slot allocation engine for 50,000 concurrent students during a nationwide recruitment exam. How do you prevent double-allocation?',
    expectedKeyPoints: [
      'Distributed locks using Redis Redlock or database OCC with version/timestamp preconditions',
      'Idempotency keys on request submissions',
      'Queue-based buffering (Kafka / RabbitMQ / Cloud PubSub)',
      'Graceful degradation to ordinal waitlist queues'
    ],
    relevantSkills: ['System Design', 'Cloud Basics', 'Distributed Systems', 'Java']
  }
];

export class QuestionSuggestionService {
  /**
   * Suggests questions tailored to candidate skills, role, and round.
   * If Gemini API is available, generates tailored dynamic assessment questions.
   * Otherwise falls back to the curated rule-based catalog.
   */
  public static async suggestQuestions(params: {
    skills: string[];
    role: string;
    interviewRound?: string;
    targetCount?: number;
  }): Promise<{
    source: 'rule_based_catalog' | 'gemini_generative_ai';
    totalMatched: number;
    questions: QuestionItem[];
  }> {
    const { skills, role, interviewRound = 'Technical Round 1', targetCount = 6 } = params;

    // Real-Time Gemini AI Generation
    if (GeminiService.isAvailable()) {
      try {
        const geminiQuestions = await GeminiService.generateQuestionSuggestions({
          skills,
          role,
          interviewRound,
          targetCount
        });

        if (geminiQuestions && geminiQuestions.length > 0) {
          return {
            source: 'gemini_generative_ai',
            totalMatched: geminiQuestions.length,
            questions: geminiQuestions
          };
        }
      } catch (err: any) {
        logger.warn(`[QuestionSuggestionService] Gemini generation fallback to catalog: ${err.message}`);
      }
    }

    const lowerSkills = skills.map((s) => s.toLowerCase());
    const lowerRole = role.toLowerCase();

    // Catalog Scoring Fallback
    const scored = QUESTION_CATALOG.map((item) => {
      let score = 0;
      for (const skill of item.relevantSkills) {
        if (lowerSkills.some((cs) => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs))) {
          score += 2;
        }
      }
      if (lowerRole.includes('software') && item.topic.includes('DSA')) score += 1;
      if (lowerRole.includes('ai') && item.topic.includes('AI')) score += 3;
      if (lowerRole.includes('frontend') && item.relevantSkills.includes('React')) score += 3;
      if (lowerRole.includes('full stack') && (item.relevantSkills.includes('React') || item.relevantSkills.includes('Java') || item.relevantSkills.includes('SQL'))) score += 2;

      return { item, score };
    });

    // Sort by relevance score descending
    scored.sort((a, b) => b.score - a.score);

    const selected = scored.slice(0, targetCount).map((s) => s.item);

    return {
      source: 'rule_based_catalog',
      totalMatched: selected.length,
      questions: selected.length > 0 ? selected : QUESTION_CATALOG.slice(0, targetCount)
    };
  }

  /**
   * Returns all available questions by topic and category.
   */
  public static getAllCatalogQuestions(): QuestionItem[] {
    return QUESTION_CATALOG;
  }
}

