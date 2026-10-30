export interface ArenaTestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface ArenaProblem {
  id: string;
  title: string;
  subject: 'DSA' | 'DBMS' | 'OS' | 'Computer Networks' | 'OOP';
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  acceptanceRate: number;
  description: string;
  constraints: string[];
  sampleTestCases: ArenaTestCase[];
  hiddenTestCases: ArenaTestCase[];
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
    typescript: string;
  };
  solved?: boolean;
}

export interface ArenaAssessment {
  id: string;
  title: string;
  description: string;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  questionsCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'available' | 'completed' | 'in_progress';
  score?: number;
  deadline?: string;
  skillsEvaluated: string[];
}

export interface ArenaBadge {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  xpValue: number;
}

export interface ArenaLeaderboardUser {
  rank: number;
  name: string;
  institution: string;
  xp: number;
  problemsSolved: number;
  streakDays: number;
  isCurrentUser?: boolean;
}

export interface ArenaLearningTopic {
  id: string;
  subject: string;
  title: string;
  description: string;
  modulesCount: number;
  completedModules: number;
  recommendedProblems: string[];
}

export const ARENA_PROBLEMS: ArenaProblem[] = [
  {
    id: 'prob_dsa_01',
    title: 'Two Sum Target Pairs',
    subject: 'DSA',
    topic: 'Arrays & Hash Maps',
    difficulty: 'Easy',
    points: 50,
    acceptanceRate: 84.5,
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    sampleTestCases: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        expectedOutput: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        expectedOutput: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    hiddenTestCases: [
      { input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', isHidden: true },
      { input: 'nums = [-1, -2, -3, -4, -5], target = -8', expectedOutput: '[2, 4]', isHidden: true }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i\n    return []`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[] { map.get(comp), i };\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_map>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        std::unordered_map<int, int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (map.count(comp)) return {map[comp], i};\n            map[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) {\n      return [map.get(comp)!, i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`
    },
    solved: true
  },
  {
    id: 'prob_dsa_02',
    title: 'Valid Parentheses & Bracket Matching',
    subject: 'DSA',
    topic: 'Stacks & Strings',
    difficulty: 'Easy',
    points: 50,
    acceptanceRate: 78.2,
    description:
      'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets and in the correct order, and every close bracket has a corresponding open bracket.',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only "()[]{}"'
    ],
    sampleTestCases: [
      { input: 's = "()"', expectedOutput: 'true' },
      { input: 's = "()[]{}"', expectedOutput: 'true' },
      { input: 's = "(]"', expectedOutput: 'false' }
    ],
    hiddenTestCases: [
      { input: 's = "([)]"', expectedOutput: 'false', isHidden: true },
      { input: 's = "{[]}"', expectedOutput: 'true', isHidden: true }
    ],
    starterCode: {
      javascript: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if (map[c]) {\n      if (stack.pop() !== map[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}`,
      python: `def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        java.util.Stack<Character> stack = new java.util.Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
      cpp: `#include <string>\n#include <stack>\n\nclass Solution {\npublic:\n    bool isValid(std::string s) {\n        std::stack<char> st;\n        for (char c : s) {\n            if (c == '(' || c == '{' || c == '[') st.push(c);\n            else {\n                if (st.empty()) return false;\n                if (c == ')' && st.top() != '(') return false;\n                if (c == '}' && st.top() != '{') return false;\n                if (c == ']' && st.top() != '[') return false;\n                st.pop();\n            }\n        }\n        return st.empty();\n    }\n};`,
      typescript: `function isValid(s: string): boolean {\n  const stack: string[] = [];\n  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if (map[c]) {\n      if (stack.pop() !== map[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}`
    },
    solved: true
  },
  {
    id: 'prob_dsa_03',
    title: 'Longest Substring Without Repeating Characters',
    subject: 'DSA',
    topic: 'Sliding Window',
    difficulty: 'Medium',
    points: 100,
    acceptanceRate: 52.4,
    description:
      'Given a string s, find the length of the longest substring without repeating characters.\n\nA substring is a contiguous non-empty sequence of characters within a string.',
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    sampleTestCases: [
      { input: 's = "abcabcbb"', expectedOutput: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', expectedOutput: '1', explanation: 'The answer is "b", with the length of 1.' }
    ],
    hiddenTestCases: [
      { input: 's = "pwwkew"', expectedOutput: '3', isHidden: true },
      { input: 's = ""', expectedOutput: '0', isHidden: true }
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  let maxLen = 0, start = 0;\n  const map = new Map();\n  for (let i = 0; i < s.length; i++) {\n    if (map.has(s[i])) {\n      start = Math.max(start, map.get(s[i]) + 1);\n    }\n    map.set(s[i], i);\n    maxLen = Math.max(maxLen, i - start + 1);\n  }\n  return maxLen;\n}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:\n    char_map = {}\n    max_len = start = 0\n    for i, c in enumerate(s):\n        if c in char_map and char_map[c] >= start:\n            start = char_map[c] + 1\n        char_map[c] = i\n        max_len = max(max_len, i - start + 1)\n    return max_len`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        int max = 0, left = 0;\n        java.util.Map<Character, Integer> map = new java.util.HashMap<>();\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            if (map.containsKey(c)) {\n                left = Math.max(left, map.get(c) + 1);\n            }\n            map.put(c, right);\n            max = Math.max(max, right - left + 1);\n        }\n        return max;\n    }\n}`,
      cpp: `#include <string>\n#include <unordered_map>\n#include <algorithm>\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(std::string s) {\n        std::unordered_map<char, int> map;\n        int maxLen = 0, left = 0;\n        for (int right = 0; right < s.size(); right++) {\n            if (map.count(s[right])) {\n                left = std::max(left, map[s[right]] + 1);\n            }\n            map[s[right]] = right;\n            maxLen = std::max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n};`,
      typescript: `function lengthOfLongestSubstring(s: string): number {\n  let maxLen = 0, start = 0;\n  const map = new Map<string, number>();\n  for (let i = 0; i < s.length; i++) {\n    if (map.has(s[i])) {\n      start = Math.max(start, map.get(s[i])! + 1);\n    }\n    map.set(s[i], i);\n    maxLen = Math.max(maxLen, i - start + 1);\n  }\n  return maxLen;\n}`
    },
    solved: false
  },
  {
    id: 'prob_dbms_01',
    title: 'Department Highest Salary (SQL)',
    subject: 'DBMS',
    topic: 'Joins & Subqueries',
    difficulty: 'Medium',
    points: 100,
    acceptanceRate: 61.2,
    description:
      'Write an SQL query to find employees who have the highest salary in each of the departments.\n\nTable: Employee (id, name, salary, departmentId)\nTable: Department (id, name)',
    constraints: [
      'Salary is a positive integer',
      'Return results ordered by department name'
    ],
    sampleTestCases: [
      {
        input: 'Employee: [1, Joe, 70000, 1], [2, Jim, 90000, 1]; Department: [1, IT]',
        expectedOutput: 'IT | Jim | 90000'
      }
    ],
    hiddenTestCases: [],
    starterCode: {
      javascript: `// SQL Query in String format\nconst query = \`\nSELECT d.name AS Department, e.name AS Employee, e.salary AS Salary\nFROM Employee e\nJOIN Department d ON e.departmentId = d.id\nWHERE (e.departmentId, e.salary) IN (\n    SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId\n);\n\`;`,
      python: `query = """\nSELECT d.name AS Department, e.name AS Employee, e.salary AS Salary\nFROM Employee e\nJOIN Department d ON e.departmentId = d.id\nWHERE (e.departmentId, e.salary) IN (\n    SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId\n);\n"""`,
      java: `String sql = "SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary " +\n             "FROM Employee e JOIN Department d ON e.departmentId = d.id " +\n             "WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);";`,
      cpp: `const char* sql = "SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);";`,
      typescript: `const query: string = \`\nSELECT d.name AS Department, e.name AS Employee, e.salary AS Salary\nFROM Employee e\nJOIN Department d ON e.departmentId = d.id\nWHERE (e.departmentId, e.salary) IN (\n    SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId\n);\n\`;`
    },
    solved: true
  },
  {
    id: 'prob_os_01',
    title: 'Round Robin Process Scheduler Simulation',
    subject: 'OS',
    topic: 'CPU Scheduling & Queues',
    difficulty: 'Medium',
    points: 100,
    acceptanceRate: 58.7,
    description:
      'Simulate a Round Robin CPU scheduling algorithm with a given time quantum. Return the average waiting time and turnaround time for the given processes with their arrival and burst times.',
    constraints: [
      '1 <= n <= 1000 processes',
      'Time quantum >= 1'
    ],
    sampleTestCases: [
      { input: 'processes = [[0, 5], [1, 4], [2, 2]], quantum = 2', expectedOutput: 'avgWaiting: 4.67' }
    ],
    hiddenTestCases: [],
    starterCode: {
      javascript: `function roundRobinScheduler(processes, quantum) {\n  // processes = [[arrival, burst], ...]\n  return { avgWaiting: 4.67, avgTurnaround: 8.33 };\n}`,
      python: `def roundRobinScheduler(processes, quantum):\n    return {"avgWaiting": 4.67, "avgTurnaround": 8.33}`,
      java: `class Solution {\n    public double calculateWaiting(int[][] processes, int quantum) {\n        return 4.67;\n    }\n}`,
      cpp: `struct Result { double avgWaiting; double avgTurnaround; };\nResult roundRobin(std::vector<std::pair<int, int>> processes, int quantum) {\n    return {4.67, 8.33};\n}`,
      typescript: `function roundRobinScheduler(processes: [number, number][], quantum: number): { avgWaiting: number; avgTurnaround: number } {\n  return { avgWaiting: 4.67, avgTurnaround: 8.33 };\n}`
    },
    solved: false
  },
  {
    id: 'prob_dsa_04',
    title: 'Trapping Rain Water',
    subject: 'DSA',
    topic: 'Two Pointers & Monotonic Stack',
    difficulty: 'Hard',
    points: 150,
    acceptanceRate: 41.8,
    description:
      'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    sampleTestCases: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' }
    ],
    hiddenTestCases: [
      { input: 'height = [4,2,0,3,2,5]', expectedOutput: '9', isHidden: true }
    ],
    starterCode: {
      javascript: `function trap(height) {\n  let left = 0, right = height.length - 1;\n  let maxLeft = 0, maxRight = 0, water = 0;\n  while (left < right) {\n    if (height[left] <= height[right]) {\n      if (height[left] >= maxLeft) maxLeft = height[left];\n      else water += maxLeft - height[left];\n      left++;\n    } else {\n      if (height[right] >= maxRight) maxRight = height[right];\n      else water += maxRight - height[right];\n      right--;\n    }\n  }\n  return water;\n}`,
      python: `def trap(height: list[int]) -> int:\n    left, right = 0, len(height) - 1\n    max_left = max_right = water = 0\n    while left < right:\n        if height[left] <= height[right]:\n            if height[left] >= max_left: max_left = height[left]\n            else: water += max_left - height[left]\n            left += 1\n        else:\n            if height[right] >= max_right: max_right = height[right]\n            else: water += max_right - height[right]\n            right -= 1\n    return water`,
      java: `class Solution {\n    public int trap(int[] height) {\n        int left = 0, right = height.length - 1, maxL = 0, maxR = 0, water = 0;\n        while (left < right) {\n            if (height[left] <= height[right]) {\n                if (height[left] >= maxL) maxL = height[left];\n                else water += maxL - height[left];\n                left++;\n            } else {\n                if (height[right] >= maxR) maxR = height[right];\n                else water += maxR - height[right];\n                right--;\n            }\n        }\n        return water;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\n\nclass Solution {\npublic:\n    int trap(std::vector<int>& height) {\n        int left = 0, right = height.size() - 1;\n        int maxL = 0, maxR = 0, water = 0;\n        while (left < right) {\n            if (height[left] <= height[right]) {\n                if (height[left] >= maxL) maxL = height[left];\n                else water += maxL - height[left];\n                left++;\n            } else {\n                if (height[right] >= maxR) maxR = height[right];\n                else water += maxR - height[right];\n                right--;\n            }\n        }\n        return water;\n    }\n};`,
      typescript: `function trap(height: number[]): number {\n  let left = 0, right = height.length - 1;\n  let maxLeft = 0, maxRight = 0, water = 0;\n  while (left < right) {\n    if (height[left] <= height[right]) {\n      if (height[left] >= maxLeft) maxLeft = height[left];\n      else water += maxLeft - height[left];\n      left++;\n    } else {\n      if (height[right] >= maxRight) maxRight = height[right];\n      else water += maxRight - height[right];\n      right--;\n    }\n  }\n  return water;\n}`
    },
    solved: false
  }
];

export const ARENA_ASSESSMENTS: ArenaAssessment[] = [
  {
    id: 'assess_excelsoft_gse_01',
    title: 'Excelsoft Technologies GSE 2026 Assessment',
    description: 'Official pre-screening assessment: 3 algorithmic coding challenges and 10 computer science core multiple-choice questions.',
    subject: 'Core Engineering & DSA',
    durationMinutes: 60,
    totalMarks: 100,
    questionsCount: 13,
    difficulty: 'Intermediate',
    status: 'available',
    deadline: '2026-11-15T23:59:59',
    skillsEvaluated: ['Data Structures', 'Algorithms', 'SQL', 'OS Basics']
  },
  {
    id: 'assess_dsa_speed_02',
    title: 'DSA Speed Challenge: Trees & Dynamic Programming',
    description: 'Time-pressured algorithmic contest. Solve 2 medium-to-hard coding problems under 45 minutes.',
    subject: 'Data Structures & Algorithms',
    durationMinutes: 45,
    totalMarks: 100,
    questionsCount: 2,
    difficulty: 'Advanced',
    status: 'completed',
    score: 88,
    skillsEvaluated: ['Binary Trees', 'Dynamic Programming', 'Complexity Optimization']
  },
  {
    id: 'assess_dbms_quiz_03',
    title: 'SQL Master & Transaction ACID Concurrency Quiz',
    description: 'Evaluate your understanding of database indexing, B-Trees, normalization, and SQLite WAL transactions.',
    subject: 'Database Systems',
    durationMinutes: 30,
    totalMarks: 50,
    questionsCount: 15,
    difficulty: 'Intermediate',
    status: 'available',
    skillsEvaluated: ['Indexing', 'Normalization', 'SQL Queries', 'ACID Properties']
  }
];

export const ARENA_BADGES: ArenaBadge[] = [
  {
    id: 'badge_01',
    name: 'Algorithm Ace',
    category: 'Problem Solving',
    description: 'Solved over 25 algorithmic problems across arrays, strings, and hash maps.',
    icon: '⚡',
    unlockedAt: '2026-10-24',
    xpValue: 250
  },
  {
    id: 'badge_02',
    name: 'SQL Specialist',
    category: 'Database Systems',
    description: 'Mastered complex joins, aggregate subqueries, and database transaction queries.',
    icon: '💾',
    unlockedAt: '2026-10-27',
    xpValue: 200
  },
  {
    id: 'badge_03',
    name: '5-Day Streak Master',
    category: 'Consistency',
    description: 'Maintained a consecutive 5-day daily coding challenge streak.',
    icon: '🔥',
    unlockedAt: '2026-10-30',
    xpValue: 150
  },
  {
    id: 'badge_04',
    name: 'Interview Ready',
    category: 'Career Readiness',
    description: 'Passed all proctored technical screening tests with a score above 85%.',
    icon: '🎯',
    unlockedAt: '2026-10-29',
    xpValue: 300
  },
  {
    id: 'badge_05',
    name: 'Bug Hunter',
    category: 'Code Quality',
    description: 'Achieved 100% test case pass rate on first submission for 10 problems.',
    icon: '🛡️',
    xpValue: 200
  },
  {
    id: 'badge_06',
    name: 'Dynamic Programmer',
    category: 'Algorithms',
    description: 'Solve 15 dynamic programming and memoization challenges.',
    icon: '🧠',
    xpValue: 350
  }
];

export const ARENA_LEADERBOARD: ArenaLeaderboardUser[] = [
  { rank: 1, name: 'Aditya Hegde', institution: 'NIE Mysuru', xp: 4820, problemsSolved: 62, streakDays: 24 },
  { rank: 2, name: 'Sneha Kulkarni', institution: 'SJCE / JSS STU Mysuru', xp: 4510, problemsSolved: 58, streakDays: 19 },
  { rank: 3, name: 'Rohan Sharma', institution: 'VTU Campus Center', xp: 3850, problemsSolved: 44, streakDays: 5, isCurrentUser: true },
  { rank: 4, name: 'Gaurav Rao', institution: 'BMS College of Engineering', xp: 3620, problemsSolved: 41, streakDays: 12 },
  { rank: 5, name: 'Pooja Iyer', institution: 'PES University Bengaluru', xp: 3490, problemsSolved: 39, streakDays: 8 },
  { rank: 6, name: 'Karthik Nair', institution: 'MSRIT Bengaluru', xp: 3120, problemsSolved: 35, streakDays: 4 },
  { rank: 7, name: 'Megha Varma', institution: 'CBIT Hyderabad', xp: 2980, problemsSolved: 32, streakDays: 6 }
];

export const ARENA_LEARNING_TOPICS: ArenaLearningTopic[] = [
  {
    id: 'topic_dsa',
    subject: 'Data Structures & Algorithms',
    title: 'Arrays, Trees, Graphs & Dynamic Programming',
    description: 'Master core algorithmic structures, asymptotic time/space complexities, sliding windows, and recursion.',
    modulesCount: 14,
    completedModules: 11,
    recommendedProblems: ['Two Sum Target Pairs', 'Longest Substring Without Repeating Characters', 'Trapping Rain Water']
  },
  {
    id: 'topic_dbms',
    subject: 'Database Management Systems',
    title: 'Relational Schemas, Indexing & ACID Transactions',
    description: 'Understand relational algebra, B+ Tree index structures, 3NF normalization, and SQLite WAL concurrency.',
    modulesCount: 10,
    completedModules: 8,
    recommendedProblems: ['Department Highest Salary (SQL)']
  },
  {
    id: 'topic_os',
    subject: 'Operating Systems',
    title: 'Process Management, Scheduling & Virtual Memory',
    description: 'Deep dive into Round Robin, Mutex locks, deadlock avoidance (Banker’s Algorithm), and paging mechanisms.',
    modulesCount: 9,
    completedModules: 6,
    recommendedProblems: ['Round Robin Process Scheduler Simulation']
  },
  {
    id: 'topic_networks',
    subject: 'Computer Networks',
    title: 'OSI 7 Layers, TCP/IP, Sockets & Cryptographic Security',
    description: 'Explore reliable stream transport, DNS resolution, HMAC-SHA256 nonces, and TLS 1.3 handshakes.',
    modulesCount: 8,
    completedModules: 5,
    recommendedProblems: []
  },
  {
    id: 'topic_oop',
    subject: 'Object-Oriented Programming',
    title: 'SOLID Principles, Design Patterns & Clean Code',
    description: 'Write robust modular code applying Factory, Singleton, Observer patterns, and encapsulation.',
    modulesCount: 8,
    completedModules: 7,
    recommendedProblems: []
  },
  {
    id: 'topic_interview_prep',
    subject: 'Technical Interview Prep',
    title: 'Top 50 Campus Technical Questions & Live Whiteboarding',
    description: 'Simulate live coding interviews with automated difficulty banks and rubric evaluation insights.',
    modulesCount: 12,
    completedModules: 9,
    recommendedProblems: ['Trapping Rain Water']
  }
];

