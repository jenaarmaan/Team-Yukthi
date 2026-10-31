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
  },
  {
    id: 'prob_cn_01',
    title: 'Defang IPv4 Address & Checksum Validation',
    subject: 'Computer Networks',
    topic: 'IP Protocols & Parsing',
    difficulty: 'Easy',
    points: 50,
    acceptanceRate: 89.2,
    description:
      'In network security and threat intelligence log analysis, an IPv4 address must be defanged before display to prevent automated web crawlers and security scrapers from misinterpreting the IP as an active hyperlink.\n\nGiven a valid IPv4 address string `address`, return a defanged version of that IP address where each period `"."` is replaced with `"[.]"`.',
    constraints: [
      'address is a valid IPv4 address consisting of 4 decimal octets separated by single dots.',
      '7 <= address.length <= 15'
    ],
    sampleTestCases: [
      { input: 'address = "192.168.1.1"', expectedOutput: '"192[.]168[.]1[.]1"' },
      { input: 'address = "10.0.0.255"', expectedOutput: '"10[.]0[.]0[.]255"' }
    ],
    hiddenTestCases: [
      { input: 'address = "127.0.0.1"', expectedOutput: '"127[.]0[.]0[.]1"', isHidden: true },
      { input: 'address = "172.16.254.1"', expectedOutput: '"172[.]16[.]254[.]1"', isHidden: true }
    ],
    starterCode: {
      javascript: `function defangIPaddr(address) {\n  return address.split('.').join('[.]');\n}`,
      python: `def defangIPaddr(address: str) -> str:\n    return address.replace(".", "[.]")`,
      java: `class Solution {\n    public String defangIPaddr(String address) {\n        return address.replace(".", "[.]");\n    }\n}`,
      cpp: `#include <string>\n\nclass Solution {\npublic:\n    std::string defangIPaddr(std::string address) {\n        std::string res = "";\n        for (char c : address) {\n            if (c == '.') res += "[.]";\n            else res += c;\n        }\n        return res;\n    }\n};`,
      typescript: `function defangIPaddr(address: string): string {\n  return address.split('.').join('[.]');\n}`
    },
    solved: false
  },
  {
    id: 'prob_cn_02',
    title: 'TCP Sliding Window Flow Control',
    subject: 'Computer Networks',
    topic: 'Transport Layer & Flow Control',
    difficulty: 'Medium',
    points: 100,
    acceptanceRate: 64.8,
    description:
      'In the Transmission Control Protocol (TCP), the sliding window protocol provides end-to-end flow control to ensure the sender does not overwhelm the receiver buffer.\n\nGiven the total number of packets `n`, the advertised receiver window size `winSize`, and an array of acknowledged packet sequence numbers `acks`, determine:\n1. The sequence number of the next expected unacknowledged packet at the left edge of the window.\n2. The number of new packets the sender is currently permitted to transmit into the channel without exceeding window capacity.\n\nReturn the answer as an array of two integers: `[nextExpectedPacket, availableWindowSlots]`.',
    constraints: [
      '1 <= n <= 10000',
      '1 <= winSize <= 1000',
      'acks contains strictly increasing acknowledged sequence numbers in the range [0, n-1].'
    ],
    sampleTestCases: [
      {
        input: 'n = 10, winSize = 4, acks = [0, 1, 2]',
        expectedOutput: '[3, 4]',
        explanation: 'Packets 0, 1, and 2 are acknowledged. The window advances to packet 3, and sender can send 4 packets (3, 4, 5, 6).'
      },
      {
        input: 'n = 8, winSize = 3, acks = [0]',
        expectedOutput: '[1, 3]',
        explanation: 'Packet 0 is acknowledged. Next unacknowledged packet is 1 with 3 available window slots.'
      }
    ],
    hiddenTestCases: [
      { input: 'n = 5, winSize = 3, acks = [0, 1, 2, 3]', expectedOutput: '[4, 1]', isHidden: true },
      { input: 'n = 6, winSize = 4, acks = []', expectedOutput: '[0, 4]', isHidden: true }
    ],
    starterCode: {
      javascript: `function tcpFlowControl(n, winSize, acks) {\n  const ackSet = new Set(acks);\n  let nextExpected = 0;\n  while (ackSet.has(nextExpected) && nextExpected < n) {\n    nextExpected++;\n  }\n  const available = Math.min(winSize, Math.max(0, n - nextExpected));\n  return [nextExpected, available];\n}`,
      python: `def tcpFlowControl(n: int, winSize: int, acks: list[int]) -> list[int]:\n    ack_set = set(acks)\n    next_exp = 0\n    while next_exp in ack_set and next_exp < n:\n        next_exp += 1\n    available = min(winSize, max(0, n - next_exp))\n    return [next_exp, available]`,
      java: `class Solution {\n    public int[] tcpFlowControl(int n, int winSize, int[] acks) {\n        java.util.Set<Integer> set = new java.util.HashSet<>();\n        for (int a : acks) set.add(a);\n        int nextExp = 0;\n        while (set.contains(nextExp) && nextExp < n) nextExp++;\n        int avail = Math.min(winSize, Math.max(0, n - nextExp));\n        return new int[]{nextExp, avail};\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_set>\n#include <algorithm>\n\nclass Solution {\npublic:\n    std::vector<int> tcpFlowControl(int n, int winSize, std::vector<int>& acks) {\n        std::unordered_set<int> set(acks.begin(), acks.end());\n        int nextExp = 0;\n        while (set.count(nextExp) && nextExp < n) nextExp++;\n        int avail = std::min(winSize, std::max(0, n - nextExp));\n        return {nextExp, avail};\n    }\n};`,
      typescript: `function tcpFlowControl(n: number, winSize: number, acks: number[]): [number, number] {\n  const ackSet = new Set(acks);\n  let nextExpected = 0;\n  while (ackSet.has(nextExpected) && nextExpected < n) {\n    nextExpected++;\n  }\n  const available = Math.min(winSize, Math.max(0, n - nextExpected));\n  return [nextExpected, available];\n}`
    },
    solved: false
  },
  {
    id: 'prob_cn_03',
    title: 'IPv4 CIDR Subnet & Broadcast Resolver',
    subject: 'Computer Networks',
    topic: 'IP Addressing & Subnetting',
    difficulty: 'Medium',
    points: 100,
    acceptanceRate: 57.3,
    description:
      'Given an IPv4 address with CIDR prefix notation string `cidr` (such as `"192.168.10.75/24"`), calculate the Network Address (the first address in the block with host bits set to 0) and the Broadcast Address (the last address in the block with host bits set to 1).\n\nReturn the result as a two-element array: `[networkAddress, broadcastAddress]`.',
    constraints: [
      'cidr is formatted as "A.B.C.D/M" where 0 <= A, B, C, D <= 255 and 1 <= M <= 30.'
    ],
    sampleTestCases: [
      { input: 'cidr = "192.168.10.75/24"', expectedOutput: '["192.168.10.0", "192.168.10.255"]' },
      { input: 'cidr = "10.0.8.1/16"', expectedOutput: '["10.0.0.0", "10.0.255.255"]' }
    ],
    hiddenTestCases: [
      { input: 'cidr = "172.16.5.14/28"', expectedOutput: '["172.16.5.0", "172.16.5.15"]', isHidden: true },
      { input: 'cidr = "192.168.1.130/26"', expectedOutput: '["192.168.1.128", "192.168.1.191"]', isHidden: true }
    ],
    starterCode: {
      javascript: `function calculateSubnet(cidr) {\n  const [ipStr, maskStr] = cidr.split('/');\n  const maskBits = parseInt(maskStr, 10);\n  const octets = ipStr.split('.').map(Number);\n  const ipNum = ((octets[0] << 24) >>> 0) + ((octets[1] << 16) >>> 0) + ((octets[2] << 8) >>> 0) + (octets[3] >>> 0);\n  const netmask = maskBits === 0 ? 0 : (((0xFFFFFFFF << (32 - maskBits))) >>> 0);\n  const netNum = (ipNum & netmask) >>> 0;\n  const bcastNum = (netNum | (~netmask >>> 0)) >>> 0;\n  const toIp = (num) => [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');\n  return [toIp(netNum), toIp(bcastNum)];\n}`,
      python: `def calculateSubnet(cidr: str) -> list[str]:\n    ip_str, mask_str = cidr.split("/")\n    mask_bits = int(mask_str)\n    octets = list(map(int, ip_str.split(".")))\n    ip_num = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]\n    netmask = ((1 << 32) - 1) ^ ((1 << (32 - mask_bits)) - 1)\n    net_num = ip_num & netmask\n    bcast_num = net_num | ((1 << (32 - mask_bits)) - 1)\n    to_ip = lambda n: f"{(n >> 24) & 255}.{(n >> 16) & 255}.{(n >> 8) & 255}.{n & 255}"\n    return [to_ip(net_num), to_ip(bcast_num)]`,
      java: `class Solution {\n    public String[] calculateSubnet(String cidr) {\n        String[] parts = cidr.split("/");\n        int mask = Integer.parseInt(parts[1]);\n        String[] oct = parts[0].split("\\\\.");\n        long ip = (Long.parseLong(oct[0]) << 24) | (Long.parseLong(oct[1]) << 16) | (Long.parseLong(oct[2]) << 8) | Long.parseLong(oct[3]);\n        long netmask = mask == 0 ? 0 : ((0xFFFFFFFFL << (32 - mask)) & 0xFFFFFFFFL);\n        long net = ip & netmask;\n        long bcast = net | (~netmask & 0xFFFFFFFFL);\n        return new String[]{ toIp(net), toIp(bcast) };\n    }\n    private String toIp(long n) {\n        return ((n >> 24) & 255) + "." + ((n >> 16) & 255) + "." + ((n >> 8) & 255) + "." + (n & 255);\n    }\n}`,
      cpp: `#include <string>\n#include <vector>\n#include <sstream>\n\nclass Solution {\npublic:\n    std::vector<std::string> calculateSubnet(std::string cidr) {\n        size_t slash = cidr.find('/');\n        std::string ipStr = cidr.substr(0, slash);\n        int mask = std::stoi(cidr.substr(slash + 1));\n        std::stringstream ss(ipStr);\n        std::string item;\n        unsigned int ip = 0;\n        while (std::getline(ss, item, '.')) {\n            ip = (ip << 8) | std::stoi(item);\n        }\n        unsigned int netmask = mask == 0 ? 0 : (0xFFFFFFFF << (32 - mask));\n        unsigned int net = ip & netmask;\n        unsigned int bcast = net | (~netmask);\n        auto toIp = [](unsigned int n) {\n            return std::to_string((n >> 24) & 255) + "." + std::to_string((n >> 16) & 255) + "." + std::to_string((n >> 8) & 255) + "." + std::to_string(n & 255);\n        };\n        return {toIp(net), toIp(bcast)};\n    }\n};`,
      typescript: `function calculateSubnet(cidr: string): [string, string] {\n  const [ipStr, maskStr] = cidr.split('/');\n  const maskBits = parseInt(maskStr, 10);\n  const octets = ipStr.split('.').map(Number);\n  const ipNum = ((octets[0] << 24) >>> 0) + ((octets[1] << 16) >>> 0) + ((octets[2] << 8) >>> 0) + (octets[3] >>> 0);\n  const netmask = maskBits === 0 ? 0 : (((0xFFFFFFFF << (32 - maskBits))) >>> 0);\n  const netNum = (ipNum & netmask) >>> 0;\n  const bcastNum = (netNum | (~netmask >>> 0)) >>> 0;\n  const toIp = (num: number) => [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');\n  return [toIp(netNum), toIp(bcastNum)];\n}`
    },
    solved: false
  },
  {
    id: 'prob_oop_01',
    title: 'Design a Thread-Safe LRU Cache',
    subject: 'OOP',
    topic: 'Encapsulation & Design Patterns',
    difficulty: 'Medium',
    points: 100,
    acceptanceRate: 62.1,
    description:
      'Design an Object-Oriented Least Recently Used (LRU) Cache adhering to clean class encapsulation principles.\n\nThe class must support:\n- `get(key)`: Returns the value of the key if it exists in the cache, otherwise returns `-1`.\n- `put(key, value)`: Updates the value if the key exists, or inserts the key-value pair. When cache capacity is exceeded, evict the least recently used key before inserting.\n\nThe simulation function `runLRUCache(capacity, operations, args)` receives a sequence of operations and arguments, and returns the output array.',
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5'
    ],
    sampleTestCases: [
      {
        input: 'capacity = 2, operations = ["put","put","get","put","get","get"], args = [[1,1],[2,2],[1],[3,3],[2],[3]]',
        expectedOutput: '[null, null, 1, null, -1, 3]',
        explanation: 'LRU evicts key 2 when inserting key 3 because key 1 was recently accessed.'
      },
      {
        input: 'capacity = 1, operations = ["put","get","put","get"], args = [[2,1],[2],[3,2],[2]]',
        expectedOutput: '[null, 1, null, -1]'
      }
    ],
    hiddenTestCases: [
      {
        input: 'capacity = 2, operations = ["get","put","get"], args = [[2],[2,6],[2]]',
        expectedOutput: '[-1, null, 6]',
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.cache.has(key)) this.cache.delete(key);\n    this.cache.set(key, value);\n    if (this.cache.size > this.capacity) {\n      const oldestKey = this.cache.keys().next().value;\n      this.cache.delete(oldestKey);\n    }\n  }\n}\n\nfunction runLRUCache(capacity, operations, args) {\n  const cache = new LRUCache(capacity);\n  const results = [];\n  for (let i = 0; i < operations.length; i++) {\n    const op = operations[i];\n    if (op === 'get') results.push(cache.get(args[i][0]));\n    else if (op === 'put') {\n      cache.put(args[i][0], args[i][1]);\n      results.push(null);\n    }\n  }\n  return results;\n}`,
      python: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)\n\ndef runLRUCache(capacity: int, operations: list[str], args: list[list[int]]) -> list:\n    cache = LRUCache(capacity)\n    results = []\n    for op, arg in zip(operations, args):\n        if op == "get": results.append(cache.get(arg[0]))\n        elif op == "put":\n            cache.put(arg[0], arg[1])\n            results.append(None)\n    return results`,
      java: `class LRUCache {\n    private final int capacity;\n    private final java.util.LinkedHashMap<Integer, Integer> map;\n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        this.map = new java.util.LinkedHashMap<>(capacity, 0.75f, true);\n    }\n    public int get(int key) { return map.getOrDefault(key, -1); }\n    public void put(int key, int value) {\n        map.put(key, value);\n        if (map.size() > capacity) {\n            int oldest = map.keySet().iterator().next();\n            map.remove(oldest);\n        }\n    }\n}`,
      cpp: `#include <unordered_map>\n#include <list>\n#include <vector>\n\nclass LRUCache {\n    int cap;\n    std::list<std::pair<int, int>> items;\n    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> map;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        if (!map.count(key)) return -1;\n        items.splice(items.begin(), items, map[key]);\n        return map[key]->second;\n    }\n    void put(int key, int value) {\n        if (map.count(key)) {\n            items.splice(items.begin(), items, map[key]);\n            map[key]->second = value;\n            return;\n        }\n        if (items.size() == cap) {\n            int delKey = items.back().first;\n            items.pop_back();\n            map.erase(delKey);\n        }\n        items.push_front({key, value});\n        map[key] = items.begin();\n    }\n};`,
      typescript: `class LRUCache {\n  private capacity: number;\n  private cache: Map<number, number>;\n  constructor(capacity: number) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key: number): number {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key)!;\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key: number, value: number): void {\n    if (this.cache.has(key)) this.cache.delete(key);\n    this.cache.set(key, value);\n    if (this.cache.size > this.capacity) {\n      const oldestKey = this.cache.keys().next().value;\n      if (oldestKey !== undefined) this.cache.delete(oldestKey);\n    }\n  }\n}\n\nfunction runLRUCache(capacity: number, operations: string[], args: number[][]): (number | null)[] {\n  const cache = new LRUCache(capacity);\n  const results: (number | null)[] = [];\n  for (let i = 0; i < operations.length; i++) {\n    const op = operations[i];\n    if (op === 'get') results.push(cache.get(args[i][0]));\n    else if (op === 'put') {\n      cache.put(args[i][0], args[i][1]);\n      results.push(null);\n    }\n  }\n  return results;\n}`
    },
    solved: false
  },
  {
    id: 'prob_oop_02',
    title: 'Notification Dispatcher (Factory & Strategy Pattern)',
    subject: 'OOP',
    topic: 'Polymorphism & Factory Pattern',
    difficulty: 'Easy',
    points: 50,
    acceptanceRate: 81.5,
    description:
      'In recruitment systems like NIYOJAN, hiring event updates must be dispatched to candidates via multiple communication channels (EMAIL, SMS, IN_APP).\n\nImplement an Object-Oriented Notification Dispatcher using Factory and Strategy patterns.\n\nGiven a communication channel string `channel` and message `msg`, dispatch the formatted message:\n- `"EMAIL"`: returns `"EMAIL:[<sanitized_msg>]"`\n- `"SMS"`: returns `"SMS:[<sanitized_msg>]"`\n- `"IN_APP"`: returns `"IN_APP:[<sanitized_msg>]"`\n- Any unsupported channel returns `"UNSUPPORTED"`.' ,
    constraints: [
      'channel is an uppercase string.',
      '1 <= msg.length <= 500'
    ],
    sampleTestCases: [
      { input: 'channel = "EMAIL", msg = "Interview Confirmed"', expectedOutput: '"EMAIL:[Interview Confirmed]"' },
      { input: 'channel = "SMS", msg = "OTP: 839201"', expectedOutput: '"SMS:[OTP: 839201]"' },
      { input: 'channel = "WHATSAPP", msg = "Hello"', expectedOutput: '"UNSUPPORTED"' }
    ],
    hiddenTestCases: [
      { input: 'channel = "IN_APP", msg = "Slot #4 Allocated"', expectedOutput: '"IN_APP:[Slot #4 Allocated]"', isHidden: true }
    ],
    starterCode: {
      javascript: `class ChannelFactory {\n  static dispatch(channel, msg) {\n    if (channel === 'EMAIL' || channel === 'SMS' || channel === 'IN_APP') {\n      return \`\${channel}:[\${msg}]\`;\n    }\n    return 'UNSUPPORTED';\n  }\n}\n\nfunction dispatchNotification(channel, msg) {\n  return ChannelFactory.dispatch(channel, msg);\n}`,
      python: `class ChannelFactory:\n    @staticmethod\n    def dispatch(channel: str, msg: str) -> str:\n        if channel in ["EMAIL", "SMS", "IN_APP"]:\n            return f"{channel}:[{msg}]"\n        return "UNSUPPORTED"\n\ndef dispatchNotification(channel: str, msg: str) -> str:\n    return ChannelFactory.dispatch(channel, msg)`,
      java: `class Solution {\n    public String dispatchNotification(String channel, String msg) {\n        if ("EMAIL".equals(channel) || "SMS".equals(channel) || "IN_APP".equals(channel)) {\n            return channel + ":[" + msg + "]";\n        }\n        return "UNSUPPORTED";\n    }\n}`,
      cpp: `#include <string>\n\nclass Solution {\npublic:\n    std::string dispatchNotification(std::string channel, std::string msg) {\n        if (channel == "EMAIL" || channel == "SMS" || channel == "IN_APP") {\n            return channel + ":[" + msg + "]";\n        }\n        return "UNSUPPORTED";\n    }\n};`,
      typescript: `class ChannelFactory {\n  static dispatch(channel: string, msg: string): string {\n    if (['EMAIL', 'SMS', 'IN_APP'].includes(channel)) {\n      return \`\${channel}:[\${msg}]\`;\n    }\n    return 'UNSUPPORTED';\n  }\n}\n\nfunction dispatchNotification(channel: string, msg: string): string {\n  return ChannelFactory.dispatch(channel, msg);\n}`
    },
    solved: false
  },
  {
    id: 'prob_oop_03',
    title: 'Banking Transaction Ledger & State Machine',
    subject: 'OOP',
    topic: 'Encapsulation & State Invariants',
    difficulty: 'Medium',
    points: 100,
    acceptanceRate: 67.4,
    description:
      'Implement an Object-Oriented Account ledger that enforces data encapsulation and state invariants.\n\nGiven an `initialBalance` and a list of transactions `transactions` where each transaction is `["DEPOSIT", amount]` or `["WITHDRAW", amount]`:\n- A `"DEPOSIT"` increases the account balance by `amount`.\n- A `"WITHDRAW"` decreases the account balance by `amount` if `balance >= amount`.\n- If a `"WITHDRAW"` exceeds the current balance, the transaction is rejected and an insufficient funds penalty fee of 5 is deducted if `balance >= 5` (otherwise balance remains unchanged).\n\nReturn the final balance after processing all transactions in sequence.',
    constraints: [
      '0 <= initialBalance <= 10^6',
      '1 <= transactions.length <= 1000',
      'amount > 0'
    ],
    sampleTestCases: [
      {
        input: 'initialBalance = 100, transactions = [["DEPOSIT", 50], ["WITHDRAW", 30]]',
        expectedOutput: '120'
      },
      {
        input: 'initialBalance = 50, transactions = [["WITHDRAW", 80]]',
        expectedOutput: '45',
        explanation: 'Withdrawal of 80 rejected (balance 50 < 80); penalty fee of 5 deducted.'
      }
    ],
    hiddenTestCases: [
      {
        input: 'initialBalance = 200, transactions = [["DEPOSIT", 100], ["WITHDRAW", 150], ["WITHDRAW", 50]]',
        expectedOutput: '100',
        isHidden: true
      },
      {
        input: 'initialBalance = 4, transactions = [["WITHDRAW", 10]]',
        expectedOutput: '4',
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `class BankAccount {\n  constructor(initialBalance) {\n    this._balance = initialBalance;\n  }\n  deposit(amount) {\n    this._balance += amount;\n  }\n  withdraw(amount) {\n    if (this._balance >= amount) {\n      this._balance -= amount;\n    } else if (this._balance >= 5) {\n      this._balance -= 5;\n    }\n  }\n  getBalance() {\n    return this._balance;\n  }\n}\n\nfunction processAccountLedger(initialBalance, transactions) {\n  const account = new BankAccount(initialBalance);\n  for (const [type, amount] of transactions) {\n    if (type === 'DEPOSIT') account.deposit(amount);\n    else if (type === 'WITHDRAW') account.withdraw(amount);\n  }\n  return account.getBalance();\n}`,
      python: `class BankAccount:\n    def __init__(self, initial_balance: int):\n        self._balance = initial_balance\n    def deposit(self, amount: int):\n        self._balance += amount\n    def withdraw(self, amount: int):\n        if self._balance >= amount:\n            self._balance -= amount\n        elif self._balance >= 5:\n            self._balance -= 5\n    def get_balance(self) -> int:\n        return self._balance\n\ndef processAccountLedger(initialBalance: int, transactions: list[list]) -> int:\n    account = BankAccount(initialBalance)\n    for t_type, amount in transactions:\n        if t_type == "DEPOSIT": account.deposit(amount)\n        elif t_type == "WITHDRAW": account.withdraw(amount)\n    return account.get_balance()`,
      java: `class BankAccount {\n    private int balance;\n    public BankAccount(int initialBalance) { this.balance = initialBalance; }\n    public void deposit(int amount) { this.balance += amount; }\n    public void withdraw(int amount) {\n        if (this.balance >= amount) this.balance -= amount;\n        else if (this.balance >= 5) this.balance -= 5;\n    }\n    public int getBalance() { return this.balance; }\n}`,
      cpp: `#include <vector>\n#include <string>\n\nclass BankAccount {\n    int balance;\npublic:\n    BankAccount(int b) : balance(b) {}\n    void deposit(int amt) { balance += amt; }\n    void withdraw(int amt) {\n        if (balance >= amt) balance -= amt;\n        else if (balance >= 5) balance -= 5;\n    }\n    int getBalance() const { return balance; }\n};`,
      typescript: `class BankAccount {\n  private _balance: number;\n  constructor(initialBalance: number) {\n    this._balance = initialBalance;\n  }\n  deposit(amount: number): void {\n    this._balance += amount;\n  }\n  withdraw(amount: number): void {\n    if (this._balance >= amount) {\n      this._balance -= amount;\n    } else if (this._balance >= 5) {\n      this._balance -= 5;\n    }\n  }\n  getBalance(): number {\n    return this._balance;\n  }\n}\n\nfunction processAccountLedger(initialBalance: number, transactions: [string, number][]): number {\n  const account = new BankAccount(initialBalance);\n  for (const [type, amount] of transactions) {\n    if (type === 'DEPOSIT') account.deposit(amount);\n    else if (type === 'WITHDRAW') account.withdraw(amount);\n  }\n  return account.getBalance();\n}`
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
    recommendedProblems: [
      'Defang IPv4 Address & Checksum Validation',
      'TCP Sliding Window Flow Control',
      'IPv4 CIDR Subnet & Broadcast Resolver'
    ]
  },
  {
    id: 'topic_oop',
    subject: 'Object-Oriented Programming',
    title: 'SOLID Principles, Design Patterns & Clean Code',
    description: 'Write robust modular code applying Factory, Singleton, Observer patterns, and encapsulation.',
    modulesCount: 8,
    completedModules: 7,
    recommendedProblems: [
      'Design a Thread-Safe LRU Cache',
      'Notification Dispatcher (Factory & Strategy Pattern)',
      'Banking Transaction Ledger & State Machine'
    ]
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

