import type { Challenge } from "@/types/challenges";

export const challenges: Challenge[] = [
  {
    slug: "reverse-string",
    title: "Reverse a String",
    difficulty: "easy",
    language: "javascript",
    tags: ["strings", "fundamentals"],
    description: `Write a function that takes a string and returns a new string with the same characters in reverse order.

Every character counts, including spaces, digits and punctuation. The input must not be modified, and an empty string stays empty.`,
    examples: [
      { input: "reverseString('hello')", output: "'olleh'" },
      { input: "reverseString('ab')", output: "'ba'" },
      { input: "reverseString('')", output: "''" },
    ],
    starterCode: `function reverseString(s) {
  // your code here
  return null;
}
`,
    hints: [
      "Walk the input from the last character to the first and append each character to the result.",
      "The built-in split(''), reverse() and join() chain solves it in one line.",
    ],
    tests: [
      { fn: "reverseString", args: ["hello"], expected: "olleh" },
      { fn: "reverseString", args: ["ab"], expected: "ba" },
      { fn: "reverseString", args: ["racecar"], expected: "racecar" },
      { fn: "reverseString", args: [""], expected: "" },
    ],
    entryFunction: "reverseString",
    solutionApproach: `Turn the string into an array of characters, reverse that array with the built-in reverse(), and join it back into a string. This is the idiomatic one-liner in JavaScript and handles the empty string naturally.

Time O(n), space O(n).`,
    solutionCode: `function reverseString(s) {
  return s.split("").reverse().join("");
}
`,
  },
  {
    slug: "sum-array",
    title: "Sum an Array",
    difficulty: "easy",
    language: "javascript",
    tags: ["arrays", "fundamentals"],
    description: `Return the sum of every number in an array of numbers.

Rules:
- An empty array sums to 0.
- Numbers may be negative, zero, or fractional; all of them count.
- The function must take any array of numbers, not a fixed size.`,
    examples: [
      { input: "sumArray([1, 2, 3])", output: "6" },
      { input: "sumArray([])", output: "0" },
      { input: "sumArray([5, -5, 10])", output: "10" },
    ],
    starterCode: `function sumArray(nums) {
  // your code here
  return null;
}
`,
    hints: [
      "Keep a running total, starting at 0, and add each element to it.",
      "reduce() with an initial value of 0 also handles the empty array for you.",
    ],
    tests: [
      { fn: "sumArray", args: [[1, 2, 3]], expected: 6 },
      { fn: "sumArray", args: [[]], expected: 0 },
      { fn: "sumArray", args: [[5, -5, 10]], expected: 10 },
      { fn: "sumArray", args: [[1.5, 2.5]], expected: 4 },
      { fn: "sumArray", args: [[7]], expected: 7 },
    ],
    entryFunction: "sumArray",
    solutionApproach: `Use reduce to accumulate a running total with an initial value of 0. The explicit initial value is what makes the empty array correctly return 0.

A single linear scan: time O(n), space O(1).`,
    solutionCode: `function sumArray(nums) {
  return nums.reduce((total, n) => total + n, 0);
}
`,
  },
  {
    slug: "count-vowels",
    title: "Count Vowels",
    difficulty: "easy",
    language: "javascript",
    tags: ["strings", "loops"],
    description: `Count how many vowels a string contains.

A vowel is one of a, e, i, o, u, in upper or lower case. The letter y is never a vowel here. Every other character, including spaces, digits and punctuation, is simply not counted.`,
    examples: [
      { input: "countVowels('hello')", output: "2  (e, o)" },
      { input: "countVowels('XYZ')", output: "0" },
      { input: "countVowels('Programming')", output: "3  (o, a, i)" },
    ],
    starterCode: `function countVowels(s) {
  // your code here
  return null;
}
`,
    hints: [
      "Lowercase the string first so that 'A' and 'a' are treated the same.",
      "Loop over the characters and check membership in a small Set of the five vowels.",
    ],
    tests: [
      { fn: "countVowels", args: ["hello"], expected: 2 },
      { fn: "countVowels", args: ["XYZ"], expected: 0 },
      { fn: "countVowels", args: ["AEIOUaeiou"], expected: 10 },
      { fn: "countVowels", args: ["rhythm"], expected: 0 },
      { fn: "countVowels", args: ["programming"], expected: 3 },
    ],
    entryFunction: "countVowels",
    solutionApproach: `Normalize the input to lowercase, then make a single pass counting characters found in a Set of the five vowels. A Set keeps membership checks constant time and the code intent clear.

Time O(n), space O(1) (the set is a fixed size).`,
    solutionCode: `function countVowels(s) {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  let count = 0;
  for (const ch of s.toLowerCase()) {
    if (vowels.has(ch)) count++;
  }
  return count;
}
`,
  },
  {
    slug: "is-palindrome",
    title: "Palindrome Check",
    difficulty: "easy",
    language: "javascript",
    tags: ["strings", "two-pointers"],
    description: `Decide whether a string reads the same forwards and backwards after normalizing it.

Normalization rules:
- Ignore case: compare everything as lowercase.
- Remove every character that is not a letter; spaces, digits and punctuation all vanish.
- A string with no letters left after cleaning (for example an empty string) counts as a palindrome.`,
    examples: [
      { input: "isPalindrome('racecar')", output: "true" },
      { input: "isPalindrome('A man, a plan, a canal: Panama!')", output: "true" },
      { input: "isPalindrome('hello')", output: "false" },
    ],
    starterCode: `function isPalindrome(s) {
  // your code here
  return null;
}
`,
    hints: [
      "First build a cleaned version of the string containing only lowercase letters.",
      "Then compare characters from both ends moving inward, and fail fast on the first mismatch.",
    ],
    tests: [
      { fn: "isPalindrome", args: ["racecar"], expected: true },
      { fn: "isPalindrome", args: ["A man, a plan, a canal: Panama!"], expected: true },
      { fn: "isPalindrome", args: ["hello"], expected: false },
      { fn: "isPalindrome", args: ["No 'x' in Nixon"], expected: true },
      { fn: "isPalindrome", args: ["123!"], expected: true },
    ],
    entryFunction: "isPalindrome",
    solutionApproach: `Strip every character that is not a letter and lowercase the result, then use two pointers moving from both ends toward the middle, returning false on the first mismatch. Strings that clean down to nothing fall through the loop correctly.

Cleaning is O(n) and the scan is O(n), so time O(n) overall, space O(n) for the cleaned copy.`,
    solutionCode: `function isPalindrome(s) {
  const cleaned = s.toLowerCase().replace(/[^a-z]/g, "");
  for (let left = 0, right = cleaned.length - 1; left < right; left++, right--) {
    if (cleaned[left] !== cleaned[right]) return false;
  }
  return true;
}
`,
  },
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "medium",
    language: "javascript",
    tags: ["arrays", "hash-maps"],
    description: `Given an array of numbers and a target number, return the zero-based indices of the two numbers that add up to the target.

Rules:
- Return the pair as an array [i, j] with i < j (the smaller index first).
- You may not reuse the same array element twice.
- Exactly one valid pair of indices exists for the given input, so there is a single correct answer.`,
    examples: [
      { input: "twoSum([2, 7, 11, 15], 9)", output: "[0, 1]  // 2 + 7 = 9" },
      { input: "twoSum([3, 2, 4], 6)", output: "[1, 2]  // 2 + 4 = 6" },
      { input: "twoSum([-3, 4, 1, 2], 3)", output: "[2, 3]  // 1 + 2 = 3" },
    ],
    starterCode: `function twoSum(nums, target) {
  // your code here
  return null;
}
`,
    hints: [
      "For each number, ask which earlier number would be needed to complete the target.",
      "A Map from value to index turns that question into an O(1) lookup.",
    ],
    tests: [
      { fn: "twoSum", args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { fn: "twoSum", args: [[3, 2, 4], 6], expected: [1, 2] },
      { fn: "twoSum", args: [[3, 3], 6], expected: [0, 1] },
      { fn: "twoSum", args: [[-3, 4, 1, 2], 3], expected: [2, 3] },
    ],
    entryFunction: "twoSum",
    solutionApproach: `Walk the array once, keeping a Map of each value to its index. For every number, check whether target minus it was seen earlier; the first hit returns the pair with the earlier index first, which satisfies i < j. Storing values before checking preserves correctness even when the two values are equal.

One pass: time O(n), space O(n).`,
    solutionCode: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}
`,
  },
  {
    slug: "flatten-array",
    title: "Flatten One Level",
    difficulty: "medium",
    language: "javascript",
    tags: ["arrays", "loops"],
    description: `Take an array whose items may themselves be arrays and return a new array with exactly one level of flattening.

Rules:
- A sub-array directly inside the input is spliced into the result, keeping element order.
- Anything nested deeper than one level stays nested as-is.
- The input array must not be mutated; always return a new array.`,
    examples: [
      { input: "flattenArray([1, [2, 3], 4])", output: "[1, 2, 3, 4]" },
      { input: "flattenArray([[1, 2], [3]])", output: "[1, 2, 3]" },
      { input: "flattenArray([1, [2, [3]]])", output: "[1, 2, [3]]  // one level only" },
    ],
    starterCode: `function flattenArray(nested) {
  // your code here
  return null;
}
`,
    hints: [
      "Loop over the top-level items and decide for each one whether to push it or to splice it in.",
      "Array.isArray(item) tells you whether to flatten; the spread operator pushes all elements of a sub-array at once.",
    ],
    tests: [
      { fn: "flattenArray", args: [[1, [2, 3], 4]], expected: [1, 2, 3, 4] },
      { fn: "flattenArray", args: [[1, 2, 3]], expected: [1, 2, 3] },
      { fn: "flattenArray", args: [[[1, 2], [3]], 4], expected: [[1, 2], [3], 4] },
      { fn: "flattenArray", args: [[1, [2, [3, [4]]]]], expected: [1, 2, [3, [4]]] },
      { fn: "flattenArray", args: [[]], expected: [] },
    ],
    entryFunction: "flattenArray",
    solutionApproach: `Iterate once over the input: when an item is an array, push all of its elements (without inspecting them further), otherwise push the item itself. Because sub-array elements are pushed as-is, deeper nesting is automatically preserved. Optionally note that arr.flat(1) does the same job.

Time O(m) where m is the size of the result, space O(m).`,
    solutionCode: `function flattenArray(nested) {
  const result = [];
  for (const item of nested) {
    if (Array.isArray(item)) {
      result.push(...item);
    } else {
      result.push(item);
    }
  }
  return result;
}
`,
  },
  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "hard",
    language: "javascript",
    tags: ["arrays", "sorting", "intervals"],
    description: `Given a list of closed intervals, each written [start, end] with start <= end, merge the ones that overlap and return the result.

Rules:
- Intervals are closed, so two intervals merge whenever the next one starts at or before the current end; [1, 4] and [4, 5] therefore merge into [1, 5].
- The result must be sorted ascending by start.
- The input order is arbitrary, and the merged end is the maximum end seen in a merged group.`,
    examples: [
      {
        input: "mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])",
        output: "[[1, 6], [8, 10], [15, 18]]",
      },
      { input: "mergeIntervals([[1, 4], [4, 5]])", output: "[[1, 5]]  // touching counts" },
      { input: "mergeIntervals([[5, 7]])", output: "[[5, 7]]" },
    ],
    starterCode: `function mergeIntervals(intervals) {
  // your code here
  return null;
}
`,
    hints: [
      "Sort a copy of the intervals by start; then all potentially overlapping intervals are adjacent.",
      "Keep the last merged interval and extend it whenever the next interval starts at or before its end.",
    ],
    tests: [
      {
        fn: "mergeIntervals",
        args: [[[1, 3], [2, 6], [8, 10], [15, 18]]],
        expected: [
          [1, 6],
          [8, 10],
          [15, 18],
        ],
      },
      {
        fn: "mergeIntervals",
        args: [[[1, 4], [4, 5]]],
        expected: [[1, 5]],
      },
      {
        fn: "mergeIntervals",
        args: [[[1, 2], [3, 4], [2, 5]]],
        expected: [[1, 5]],
      },
      {
        fn: "mergeIntervals",
        args: [[[5, 7]]],
        expected: [[5, 7]],
      },
      {
        fn: "mergeIntervals",
        args: [[]],
        expected: [],
      },
    ],
    entryFunction: "mergeIntervals",
    solutionApproach: `Sort a copy of the intervals by start, then sweep once: extend the last merged interval when the next start is at or before its end (taking the maximum of the two ends), otherwise start a new merged interval. Mutating the last popped interval in place keeps the sweep simple.

Sorting dominates: time O(n log n), space O(n) for the output.`,
    solutionCode: `function mergeIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [start, end] of sorted) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}
`,
  },
  {
    slug: "typed-user-profile",
    title: "Type a User Profile",
    difficulty: "medium",
    language: "typescript",
    tags: ["typescript", "interfaces", "objects"],
    description: `Turn a plain JavaScript object into properly typed TypeScript.

You are given this object:

    const user = {
      name: "Ada Lovelace",
      age: 36,
      isVerified: true,
      roles: ["admin", "user"],
    };

Requirements:
- Define an interface UserProfile with name: string, age: number, isVerified: boolean and roles: string[]. An email may be missing on real users, so give email the type string but make the property optional.
- Annotate greet(user: UserProfile): string so it compiles with no any types and no type assertions.
- greet must return "Hello, <name>! Roles: <roles joined by ', '>", for example "Hello, Ada Lovelace! Roles: admin, user".`,
    examples: [
      {
        input: "greet({ name: 'Ada Lovelace', age: 36, isVerified: true, roles: ['admin', 'user'] })",
        output: "'Hello, Ada Lovelace! Roles: admin, user'",
      },
      {
        input: "const u: UserProfile = { name: 'Bob', age: 20, isVerified: false, roles: ['user'] }",
        output: "compiles: the optional email property may be omitted",
      },
    ],
    starterCode: `interface UserProfile {
  // define the shape here
}

function greet(user: UserProfile): string {
  // your code here
  return "";
}

const user: UserProfile = {
  name: "Ada Lovelace",
  age: 36,
  isVerified: true,
  roles: ["admin", "user"],
};

greet(user);
`,
    hints: [
      "Optional properties are written with a question mark: email?: string.",
      "Join the roles with user.roles.join(', ') and concatenate the greeting around it.",
    ],
    solutionApproach: `Model the object with an interface, marking email optional because it can be absent, and give greet explicit parameter and return types so the compiler checks the shape at every call site. String concatenation (or a template literal) builds the greeting.

Time O(n) over the total length of the produced string — trivial.`,
    solutionCode: `interface UserProfile {
  name: string;
  age: number;
  email?: string;
  isVerified: boolean;
  roles: string[];
}

function greet(user: UserProfile): string {
  return "Hello, " + user.name + "! Roles: " + user.roles.join(", ");
}

const user: UserProfile = {
  name: "Ada Lovelace",
  age: 36,
  isVerified: true,
  roles: ["admin", "user"],
};

greet(user);
`,
  },
  {
    slug: "generic-container",
    title: "Generic Stack",
    difficulty: "hard",
    language: "typescript",
    tags: ["typescript", "generics", "data-structures"],
    description: `Implement a last-in, first-out stack as a generic class.

Requirements:
- class Stack<T> must store items of whatever type T the caller chooses; it must not fall back to any.
- push(item: T): void adds an item to the top.
- pop(): T | undefined removes the top item and returns it, or undefined when the stack is empty.
- peek(): T | undefined returns the top item without removing it, or undefined when the stack is empty.
- isEmpty(): boolean is true only when the stack has no items.
- Keep the internal storage private so callers can only reach it through these methods.

For a Stack<number>, pushing 1 then 2 means peek() is 2, pop() returns 2, pop() returns 1, and isEmpty() is then true.`,
    examples: [
      {
        input: "const s = new Stack<number>(); s.push(1); s.push(2); s.peek()",
        output: "2",
      },
      {
        input: "s.pop(), s.pop() after pushing 1 and 2",
        output: "returns 2 then 1, and s.isEmpty() is true afterwards",
      },
    ],
    starterCode: `class Stack<T> {
  // your code here
}

const numbers = new Stack<number>();
numbers.push(1);
numbers.push(2);
// peek() -> 2, pop() -> 2, pop() -> 1, isEmpty() -> true
`,
    hints: [
      "An array is the simplest internal storage: push() and pop() already behave like stack operations.",
      "Declare the field as private items: T[] = [] and read the last element with items[items.length - 1].",
    ],
    solutionApproach: `Wrap a private array whose element type is the class parameter T; push and pop delegate to the array methods while peek reads the last slot without mutating. The undefined unions on pop and peek make empty-stack behavior explicit to callers.

Each operation is O(1) (amortized for push), space O(n).`,
    solutionCode: `class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
`,
  },
  {
    slug: "python-fizzbuzz",
    title: "Python FizzBuzz",
    difficulty: "easy",
    language: "python",
    tags: ["python", "loops", "fundamentals"],
    description: `Write fizzbuzz(n) that returns the classic FizzBuzz sequence for the numbers 1 through n inclusive, as a list of strings.

Replacement rules, checked in this order:
- Divisible by both 3 and 5: "FizzBuzz".
- Divisible by 3: "Fizz".
- Divisible by 5: "Buzz".
- Otherwise: the number itself as a string, so 7 becomes "7".`,
    examples: [
      { input: "fizzbuzz(3)", output: '["1", "2", "Fizz"]' },
      { input: "fizzbuzz(5)", output: '["1", "2", "Fizz", "4", "Buzz"]' },
      { input: "fizzbuzz(15)", output: "the 15-item list whose last element is \"FizzBuzz\"" },
    ],
    starterCode: `def fizzbuzz(n: int) -> list[str]:
    # your code here
    return []
`,
    hints: [
      "Check divisibility by 15 (or by 3 and 5 together) first, before the single-divisor cases.",
      "Build the list with result.append(...) inside a range(1, n + 1) loop.",
    ],
    solutionApproach: `Loop from 1 to n and pick the first matching divisibility rule; checking the both-3-and-5 case first prevents numbers like 15 from matching the 3 rule too early and appending only "Fizz".

One pass over the range: time O(n), space O(n) for the output list.`,
    solutionCode: `def fizzbuzz(n: int) -> list[str]:
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result
`,
  },
  {
    slug: "python-word-frequency",
    title: "Word Frequency",
    difficulty: "medium",
    language: "python",
    tags: ["python", "strings", "dictionaries"],
    description: `Write top_words(text, k) that reports the most frequent words in a text.

Rules:
- Lowercase the text first. A word is any maximal run of the characters a-z and 0-9; punctuation, underscores and whitespace only separate words.
- Every occurrence counts, including repeats.
- Return at most k (word, count) tuples as a list, in the order produced by sorting.
- Order: higher counts first; when counts are equal, words sort alphabetically ascending.
- If there are fewer distinct words than k, return all of them.`,
    examples: [
      {
        input: "top_words('the cat and the hat and the bat', 2)",
        output: "[('the', 3), ('and', 2)]",
      },
      {
        input: "top_words('a b a c', 2)",
        output: "[('a', 2), ('b', 1)]  // b beats the also-count-1 c alphabetically",
      },
    ],
    starterCode: `import re
from collections import Counter


def top_words(text: str, k: int) -> list[tuple[str, int]]:
    # your code here
    return []
`,
    hints: [
      "re.findall(r\"[a-z0-9]+\", text.lower()) extracts the words in one call.",
      "Counter counts in one step; sort with a sort key of (-count, word) to handle the tie-breaker.",
    ],
    solutionApproach: `Extract words with a regular expression so punctuation vanishes, count them with Counter, then sort by count descending with the word itself as a deterministic ascending tie-breaker before slicing to k items.

Extracting words is O(m) in the text length m; sorting is O(d log d) in the number of distinct words d.`,
    solutionCode: `import re
from collections import Counter


def top_words(text: str, k: int) -> list[tuple[str, int]]:
    words = re.findall(r"[a-z0-9]+", text.lower())
    counts = Counter(words)
    ranked = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
    return ranked[:k]
`,
  },
  {
    slug: "python-prime-checker",
    title: "Prime Checker",
    difficulty: "medium",
    language: "python",
    tags: ["python", "math", "loops"],
    description: `Write is_prime(n) that returns True when n is prime and False otherwise.

Rules:
- n is an integer; anything below 2 is never prime (this includes 0, 1 and negative numbers).
- Use trial division, but stop once the candidate divisor would exceed sqrt(n).
- Checking 2 and 3, then stepping candidates 5, 7, 11, 13, ... (the 6k plus/minus 1 pattern) keeps it efficient.
- The function should stay fast for values in the millions.`,
    examples: [
      { input: "is_prime(97)", output: "True" },
      { input: "is_prime(1)", output: "False" },
      { input: "is_prime(100)", output: "False" },
    ],
    starterCode: `def is_prime(n: int) -> bool:
    # your code here
    return False
`,
    hints: [
      "Handle n < 2 first, then accept 2 and 3, then reject multiples of 2 and 3 up front.",
      "While i * i <= n, test i and i + 2, then advance i by 6.",
    ],
    solutionApproach: `Reject anything below 2, accept 2 and 3 immediately, eliminate multiples of 2 and 3, then test only candidates of the form 6k ± 1 up to sqrt(n); every other candidate is guaranteed to divide by 2 or 3. Comparing i * i <= n avoids floating point sqrt entirely.

O(sqrt(n)) time, O(1) space.`,
    solutionCode: `def is_prime(n: int) -> bool:
    if n < 2:
        return False
    if n < 4:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True
`,
  },
  {
    slug: "accessible-form",
    title: "Accessible Signup Form",
    difficulty: "medium",
    language: "html",
    tags: ["html", "accessibility", "forms"],
    description: `Rewrite this signup form so it works for keyboard and screen reader users:

    <form>
      <input type="text" name="name" placeholder="Your name">
      <input type="email" name="email" placeholder="Email">
      <input type="radio" name="plan" value="basic"> Basic
      <input type="radio" name="plan" value="pro"> Pro
      <input type="checkbox" name="terms">
      <button type="submit"><span class="icon"></span></button>
    </form>

Fix at least these problems:
- Every input and the checkbox has a real label tied with the for/id pair (a wrapping label also works). Placeholder text is not a label.
- The radio group is wrapped in a fieldset with a legend naming the choice, for example "Choose a plan".
- The text inputs expose autocomplete values (name and email) so browsers can autofill.
- The submit button has discernible text — an empty icon-only button announces nothing.
- Mark required fields with the required attribute and link each text input to an element that displays its error message via aria-describedby.`,
    examples: [
      {
        input: '<label for="email">Email</label><input id="email" type="email">',
        output: "the field announces \"Email\" when focused",
      },
      {
        input: '<fieldset><legend>Choose a plan</legend>...radios...</fieldset>',
        output: "screen readers announce the group name with the radio choices",
      },
    ],
    starterCode: `<form>
  <input type="text" name="name" placeholder="Your name">
  <input type="email" name="email" placeholder="Email">
  <input type="radio" name="plan" value="basic"> Basic
  <input type="radio" name="plan" value="pro"> Pro
  <input type="checkbox" name="terms">
  <button type="submit"><span class="icon"></span></button>
</form>
`,
    hints: [
      "Pair <label for=\"x\"> with id=\"x\" on each control; same-name placeholders do not help screen readers.",
      "fieldset and legend give the radio group one collective name for free.",
      "aria-describedby connects supporting text, such as an error paragraph, to a specific input.",
    ],
    solutionApproach: `Reach for native elements first: label with for/id for every control, fieldset/legend for the radio group, autocomplete tokens for the text fields, and a real button label. Then attach aria-describedby for the per-field error text. Native semantics carry almost all of the accessibility, so the only ARIA needed is the described-by linkage.`,
    solutionCode: `<form>
  <div>
    <label for="name">Full name</label>
    <input type="text" id="name" name="name" autocomplete="name" required aria-describedby="name-error">
    <p id="name-error"></p>
  </div>
  <div>
    <label for="email">Email address</label>
    <input type="email" id="email" name="email" autocomplete="email" required>
  </div>
  <fieldset>
    <legend>Choose a plan</legend>
    <label><input type="radio" name="plan" value="basic" checked> Basic</label>
    <label><input type="radio" name="plan" value="pro"> Pro</label>
  </fieldset>
  <div>
    <input type="checkbox" id="terms" name="terms" required aria-describedby="terms-error">
    <label for="terms">I agree to the terms</label>
    <p id="terms-error">You must accept the terms to continue.</p>
  </div>
  <button type="submit">Create account</button>
</form>
`,
  },
  {
    slug: "center-card-css",
    title: "Center a Card",
    difficulty: "easy",
    language: "css",
    tags: ["css", "layout", "flexbox"],
    description: `Center a fixed-width card in the middle of the viewport, both horizontally and vertically:

    .container {
      height: 100vh;
      /* center the card here */
    }

    .card {
      width: 320px;
      padding: 24px;
    }

Requirements:
- Use modern layout (flexbox or grid) — no floats, table tricks, or absolute positioning hacks.
- The card must remain centered when the viewport is resized.
- Do not change the card's width or the container's height.`,
    examples: [
      {
        input: "display: flex; align-items: center; justify-content: center;",
        output: "the card sits exactly in the middle of the viewport",
      },
      {
        input: "display: grid; place-items: center;",
        output: "the same result with a single pair of declarations",
      },
    ],
    starterCode: `.container {
  height: 100vh;
  /* your code here */
}

.card {
  width: 320px;
  padding: 24px;
  background: #fff;
}
`,
    hints: [
      "Alignment properties are set on the container, not the card.",
      "With flexbox, align-items controls the vertical axis and justify-content the horizontal one.",
      "In grid, place-items: center centers on both axes in one declaration.",
    ],
    solutionApproach: `Turn the container into a flex formatting context and center both axes with align-items: center and justify-content: center. On modern browsers the grid equivalent, display: grid with place-items: center, is an equally valid one-liner. Layout stays constant-time and needs no JavaScript measuring.`,
    solutionCode: `.container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  width: 320px;
  padding: 24px;
  background: #fff;
}
`,
  },
];
