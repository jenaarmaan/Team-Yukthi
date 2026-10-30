import { describe, it, expect } from 'vitest';
import { compileAndRunArenaCode } from '../../src/components/candidate/arenaCodeRunner.ts';
import { ARENA_PROBLEMS } from '../../src/components/candidate/arenaData.ts';

describe('Arena Code Compilation & Evaluation Engine', () => {
  const twoSumProblem = ARENA_PROBLEMS.find((p) => p.id === 'prob_dsa_01')!;

  it('should reject invalid syntax code with COMPILATION_ERROR (user screenshot scenario)', async () => {
    // The exact broken code from the user's uploaded screenshot
    const brokenCode = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

  }
  map.set(nums[i], i);
}
return [];
}`;

    const result = await compileAndRunArenaCode(twoSumProblem, brokenCode, 'javascript', false);

    expect(result.success).toBe(false);
    expect(result.status).toBe('COMPILATION_ERROR');
    expect(result.compilationError).toBeDefined();
    expect(result.totalPassed).toBe(0);
    expect(result.results.every((r) => !r.passed)).toBe(true);
  });

  it('should reject incorrect solution returning empty array with WRONG_ANSWER', async () => {
    const wrongSolution = `function twoSum(nums, target) {
      return [];
    }`;

    const result = await compileAndRunArenaCode(twoSumProblem, wrongSolution, 'javascript', false);

    expect(result.success).toBe(false);
    expect(result.status).toBe('WRONG_ANSWER');
    expect(result.totalPassed).toBe(0);
    expect(result.results[0].actual).toBe('[]');
    expect(result.results[0].expected).toBe('[0, 1]');
  });

  it('should accept mathematically correct Two Sum solution', async () => {
    const correctSolution = `function twoSum(nums, target) {
      const map = new Map();
      for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) {
          return [map.get(comp), i];
        }
        map.set(nums[i], i);
      }
      return [];
    }`;

    const result = await compileAndRunArenaCode(twoSumProblem, correctSolution, 'javascript', false);

    expect(result.success).toBe(true);
    expect(result.status).toBe('ACCEPTED');
    expect(result.totalPassed).toBe(twoSumProblem.sampleTestCases.length);
    expect(result.results.every((r) => r.passed)).toBe(true);
  });

  it('should evaluate hidden test cases during full submission', async () => {
    const correctSolution = `function twoSum(nums, target) {
      const map = new Map();
      for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) {
          return [map.get(comp), i];
        }
        map.set(nums[i], i);
      }
      return [];
    }`;

    const result = await compileAndRunArenaCode(twoSumProblem, correctSolution, 'javascript', true);

    expect(result.success).toBe(true);
    expect(result.status).toBe('ACCEPTED');
    const totalCases = twoSumProblem.sampleTestCases.length + twoSumProblem.hiddenTestCases.length;
    expect(result.totalCases).toBe(totalCases);
    expect(result.totalPassed).toBe(totalCases);
  });
});

