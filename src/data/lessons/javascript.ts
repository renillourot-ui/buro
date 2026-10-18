import type { Lesson } from "@/types/course";

export const javascriptLessons: Lesson[] = [
  {
    slug: "introduction-to-javascript",
    title: "Introduction to JavaScript",
    minutes: 10,
    objectives: [
      "Explain the role JavaScript plays on a web page",
      "Run your first statements and read their output",
      "Recognize values, operators and function calls in real code",
    ],
    sections: [
      {
        heading: "What is JavaScript?",
        body: `JavaScript is the language that makes pages interactive. HTML describes the structure of a page, CSS describes how it looks, and JavaScript supplies the **behavior**: updating text, checking a form, reacting to a click, or fetching fresh data without a full reload.

It was created in 1995 to add small effects to pages, and it now runs almost everywhere — in every browser, on servers through Node.js, and inside app frameworks like React and Next.js. Learning it well gives you one language for a huge range of work.

This track starts from zero. Each lesson builds on the previous one, so the small ideas early on really do matter.`,
      },
      {
        heading: "Where your code runs",
        body: `You can run JavaScript in two easy places. In a browser, press F12 (or right-click the page and choose Inspect) and open the **Console** tab — anything you type there executes immediately. On your machine, the node command in a terminal gives you the same kind of prompt.

The language core is identical in both: numbers, strings, loops, functions. The browser adds page-specific objects such as \`document\` and \`window\`, while Node.js adds server tools such as file and network access. Everything you practice here works in both worlds.`,
      },
      {
        heading: "Your first statements",
        body: `A program is a list of statements, usually one per line. Each statement does one job: create a value, store it, or show it. Use \`console.log(...)\` whenever you want to see a value — it prints to the developer console and gives you instant feedback.

You can also do math and build text in the same line. Combining a few small statements like that is already real programming: you describe the steps, and the engine runs them in order.`,
      },
    ],
    examples: [
      {
        title: "Hello, JavaScript",
        description: "Three tiny statements — run them and read the output.",
        language: "javascript",
        code: `// Print a greeting
console.log("Hello, JavaScript!");

// Do quick math and print the result
const weekHours = 24 * 7;
console.log("A week has " + weekHours + " hours.");

// Build text from pieces with a template literal
const reader = "Ada";
console.log(\`Welcome, \${reader}!\`);`,
        lineNotes: [
          {
            code: "console.log(\"Hello, JavaScript!\");",
            note: "A function call: run console.log with one string argument and it prints that string.",
          },
          {
            code: "const weekHours = 24 * 7;",
            note: "Creates a named value. The expression 24 * 7 is computed first, then stored.",
          },
          {
            code: "\"A week has \" + weekHours + \" hours.\"",
            note: "The + operator joins text and numbers into one new string.",
          },
          {
            code: "const reader = \"Ada\";",
            note: "A value with a name — reusable in any later statement.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "Console.log(\"hi\");",
        why: "JavaScript is case-sensitive: only the lowercase object console exists, so Console is an unknown name.",
        fix: "console.log(\"hi\");",
      },
      {
        wrong: "let name = \"Ada;",
        why: "The opening quote never closes, so the string swallows the rest of the line and the statement breaks.",
        fix: "let name = \"Ada\";",
      },
      {
        wrong: "print(\"hi\") or System.out.println(\"hi\")",
        why: "Those belong to Python and Java. JavaScript's printing function is console.log.",
        fix: "console.log(\"hi\");",
      },
    ],
    quiz: [
      {
        question: "Which call prints a value while you are learning?",
        options: ["print('hi')", "console.log('hi')", "echo 'hi'"],
        answerIndex: 1,
        explanation: "console.log is the built-in way to print in browsers and Node.js; print and echo come from other languages.",
      },
      {
        question: "Where can JavaScript run?",
        options: [
          "Only in the browser",
          "Only in Node.js on a server",
          "In browsers, in Node.js, and inside app frameworks",
        ],
        answerIndex: 2,
        explanation: "The same core language runs in every modern browser and on servers via Node.js — you will practice in both.",
      },
    ],
    exercises: [
      {
        title: "Say hello",
        prompt: "Print your name on one line, then print the number of letters in it on the next line. Two console.log calls are all you need.",
        language: "javascript",
        starterCode: `// Print your name below
// Then print its length
`,
        hint: "Try 'Ada'.length — it gives 3. Getting the length of any string works the same way.",
      },
      {
        title: "Tiny calculator",
        prompt: "Print the result of 15 * 4, then create a variable named price set to 19.99 and print 'Total: ' together with that price.",
        language: "javascript",
        starterCode: `const price = 19.99;
`,
        hint: "Adding a string and a number glues them together: 'Total: ' + price.",
      },
    ],
  },
  {
    slug: "variables-and-constants",
    title: "Variables and Constants",
    minutes: 12,
    objectives: [
      "Declare variables with let and constants with const",
      "Pick valid, readable names for your values",
      "Explain reassignment versus mutation for const values",
    ],
    sections: [
      {
        heading: "let and const",
        body: `A variable is a name that points to a value. Declare it with \`let\` when the value may change later, and with \`const\` when it never should:

- \`let score = 0\` — points will be added as the game runs.
- \`const birthYear = 1998\` — one meaning for the whole program.

One subtlety worth knowing early: \`const\` prevents **reassignment**, not mutation. Arrays and objects held in a const can still have their contents edited — only the binding itself is fixed.`,
      },
      {
        heading: "Naming things well",
        body: `Names may contain letters, digits, \`_\` and \`$\`, and cannot start with a digit. They are case-sensitive, and reserved words like \`let\` or \`class\` are off limits. By convention JavaScript names use lowerCamelCase: firstName, maxTemperature.

Choose names that say what the value means. A well-named \`customerCount\` saves you a comment; a cryptic \`x2\` makes every later line harder to read. Names are documentation you get for free.`,
      },
      {
        heading: "A note about var",
        body: `Older code declares variables with \`var\`. It still works, but its scope rules are surprising: a var is visible through its whole containing function and usable before its line, which hides bugs. Modern code uses \`let\` and \`const\`.

You do not need to write var — but you should be able to read it and mentally translate it to let. When you see var in an old example, assume it behaves like a looser let.`,
      },
    ],
    examples: [
      {
        title: "Score bookkeeping",
        description: "One mutable value, one fixed value, and a preview of objects.",
        language: "javascript",
        code: `let score = 0;
const maxScore = 100;

score = score + 10;
console.log(score); // 10

// Preview: objects arrive later — the binding rule is what matters here
const player = { name: "Ada", level: 1 };
player.level = 2; // allowed: the object contents change
console.log(player.level); // 2`,
        lineNotes: [
          {
            code: "let score = 0;",
            note: "let means the binding may be reassigned as the program runs.",
          },
          {
            code: "const maxScore = 100;",
            note: "const locks the name to this value for the rest of the program.",
          },
          {
            code: "score = score + 10;",
            note: "Reads the current score, adds 10, and writes the result back into the same name.",
          },
          {
            code: "player.level = 2;",
            note: "Changing a property is mutation, not reassignment — const objects still allow it.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "const total = 5; total = 10;",
        why: "Reassigning a const is an error at the moment it runs — 'Assignment to constant variable'. Use const only when the name must never change.",
        fix: "Declare with let instead: let total = 5; total = 10;",
      },
      {
        wrong: "console.log(count) on the line before let count = 3;",
        why: "let and const values are not reachable before their line runs — this window is called the temporal dead zone and throws a ReferenceError.",
        fix: "Declare first, use after: move let count = 3 above the log.",
      },
      {
        wrong: "let first name = \"Ada\";",
        why: "A space splits the statement into two words and fails with a syntax error — identifiers cannot contain spaces.",
        fix: "Use camelCase: let firstName = 'Ada';",
      },
    ],
    quiz: [
      {
        question: "Which declaration fits a value that will be reassigned later?",
        options: ["const", "let", "var"],
        answerIndex: 1,
        explanation: "let allows reassignment; a const would throw on the second assignment, and var is legacy syntax.",
      },
      {
        question: "What happens to const letters = ['a']; letters.push('b'); ?",
        options: [
          "The array grows — mutation is allowed",
          "A TypeError is thrown",
          "The array is replaced by 'b'",
        ],
        answerIndex: 0,
        explanation: "const forbids reassigning the name, not changing what it points to. push mutates the same array, which is fine.",
      },
    ],
    exercises: [
      {
        title: "Level up",
        prompt: "Create let level = 1, raise it three times (each time adding 1), then print a sentence like 'Level: 4' at the end.",
        language: "javascript",
        starterCode: `let level = 1;
`,
        hint: "Reuse the pattern level = level + 1 three times, then console.log('Level: ' + level).",
      },
      {
        title: "Fixed facts",
        prompt: "Store your name and birth year as two const values, then print one line introducing yourself with both.",
        language: "javascript",
        starterCode: `const myName = "";
const birthYear = 0;
`,
        hint: "Strings and values join the same way: 'I was born in ' + birthYear.",
      },
    ],
  },
  {
    slug: "data-types",
    title: "Data Types",
    minutes: 12,
    objectives: [
      "Name the primitive types you will use every day",
      "Check a value's type with typeof and know its quirks",
      "Distinguish undefined from null with confidence",
    ],
    sections: [
      {
        heading: "The primitive types",
        body: `JavaScript values fall into a few types. The ones you will use daily are **string** (text in quotes), **number** (integers and decimals share one type — 3, 3.5, even -0.5), and **boolean** (true or false). Two more mark emptiness: \`undefined\` (nothing was assigned yet) and \`null\` (deliberately no value).

Text can use single quotes, double quotes, or backticks. Backtick text is a template literal that can embed values: \`Hi \${name}\` inserts whatever name holds. Pick one quote style and stay consistent.`,
      },
      {
        heading: "Asking types with typeof",
        body: `The \`typeof\` operator returns the type of any value as a string: typeof "hi" is "string", typeof 4 is "number", typeof true is "boolean". It shines when you are debugging and wondering what a variable actually holds.

It has famous quirks worth memorizing: typeof null says "object" (a historical bug kept for compatibility) and typeof [1, 2] says "object" too — to tell arrays apart, use Array.isArray. And typeof NaN says "number", although NaN means not-a-number.`,
      },
      {
        heading: "Collections and nothing",
        body: `Objects and arrays bundle many values; they arrive in a later lesson, but you will see them immediately in real code — almost everything interesting is one of them. They are called reference types because a variable points to the data rather than holding a copy.

When a value is missing, JavaScript separates two flavors: undefined usually means "not set yet", while null means "we chose to have nothing here". Keeping that habit makes intent clear.`,
      },
    ],
    examples: [
      {
        title: "A type tour",
        description: "Six values, one console full of type names.",
        language: "javascript",
        code: `const town = "Milton";
const people = 90512;
const hasStation = true;
let nickname; // no value yet
const cave = null; // deliberately empty

console.log(typeof town); // "string"
console.log(typeof people); // "number"
console.log(typeof nickname); // "undefined"
console.log(typeof cave); // "object" — the historic quirk
console.log(typeof hasStation); // "boolean"`,
        lineNotes: [
          {
            code: "typeof town",
            note: "typeof answers with a string — here the word string.",
          },
          {
            code: "let nickname;",
            note: "Declared without a value: JavaScript fills it with undefined until you assign.",
          },
          {
            code: "typeof cave",
            note: "null would deserve its own answer, yet typeof reports object — remember this quirk instead of debugging it.",
          },
          {
            code: "typeof hasStation",
            note: "Booleans answer with the word boolean; no surprises here.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "typeof value === \"null\"",
        why: "typeof never returns the string 'null', so this comparison is always false and the branch never runs.",
        fix: "Compare the value directly: value === null.",
      },
      {
        wrong: "const ageInYears = \"25\"; then ageInYears + 1",
        why: "A text and a number cannot combine numerically — + prefers concatenation, so you get '251' instead of 26.",
        fix: "Store real numbers: const ageInYears = 25. If data arrives as text, convert with Number(text).",
      },
      {
        wrong: "if (result === NaN) { ... }",
        why: "NaN is not equal to anything, including itself, so this check can never succeed.",
        fix: "Use the dedicated helper: Number.isNaN(result).",
      },
    ],
    quiz: [
      {
        question: "What does typeof [] report?",
        options: ["'array'", "'object'", "'undefined'"],
        answerIndex: 1,
        explanation: "Arrays are objects to JavaScript. Use Array.isArray when you truly need to know.",
      },
      {
        question: "Which value means 'we intentionally have nothing here'?",
        options: ["undefined", "null", "NaN"],
        answerIndex: 1,
        explanation: "undefined is what an unset variable holds; null is the deliberate empty value you assign.",
      },
    ],
    exercises: [
      {
        title: "Type reporter",
        prompt: "Declare one value of each kind you have met (text, integer, decimal, boolean, null, an unset let) and print typeof for each.",
        language: "javascript",
        starterCode: `const text = "hello";
// add the other values and log their types
`,
        hint: "typeof returns a string you can print directly: console.log(typeof 3.14).",
      },
      {
        title: "Numeric fix",
        prompt: "These lines print '192' instead of 21. Change the declaration so the sum works, and add a comment saying why.",
        language: "javascript",
        starterCode: `const price = "19";
console.log(price + 2); // meant to show 21
`,
        hint: "Either store the number 19, or convert on the spot with Number(price).",
      },
    ],
  },
  {
    slug: "operators",
    title: "Operators",
    minutes: 10,
    objectives: [
      "Use arithmetic, compound assignment and the remainder operator",
      "Choose === and !== for every comparison",
      "Combine conditions with &&, || and !",
    ],
    sections: [
      {
        heading: "Arithmetic and assignment",
        body: `The usual suspects: + plus, - minus, * multiply, / divide, and % remainder (what is left after division: 17 % 5 is 2). Two asterisks raise a power: 2 ** 10 is 1024. Division never truncates — 17 / 5 simply is 3.4.

Shortcuts combine an operation with assignment: total += 5 means total = total + 5, and the same pattern exists for -=, *= and /=. They read well once you get used to them and save a little typing on every update.`,
      },
      {
        heading: "Comparison: strict beats loose",
        body: `=== asks "same value and same type?" — 5 === 5 is true, but 5 === "5" is false. Its partner !== checks inequality the same way. Use these by default.

The older == compares after silently converting types: 5 == "5" is true. That convenience hides bugs, because the conversion rules are hard to keep in your head. A rule you can follow without exceptions: always write === and !==, and convert types explicitly when you really need to.`,
      },
      {
        heading: "Logic: &&, || and !",
        body: `Combine conditions: && means both sides must be true, || means at least one, and ! flips a boolean. They short-circuit — if the left side of && is false, the right side is never even evaluated.

For our purposes they are whole-value questions inside if conditions: did the user qualify, and did the form submit? You will meet their operand-returning superpowers later; for now, keep conditions boolean and clear.`,
      },
    ],
    examples: [
      {
        title: "Checkout math",
        description: "Arithmetic, a compound update, and three honest comparisons.",
        language: "javascript",
        code: `const price = 4.5;
const quantity = 3;

let total = price * quantity; // 13.5
total += 2.5; // delivery fee
console.log(total); // 16

const needsDiscount = total > 15 && quantity >= 3;
console.log(needsDiscount); // true

console.log("5" === 5); // false: types differ
console.log(17 % 5); // 2: remainder`,
        lineNotes: [
          {
            code: "let total = price * quantity;",
            note: "Arithmetic runs first, then the result is stored under the name total.",
          },
          {
            code: "total += 2.5;",
            note: "The compound form adds to the existing value — exactly like total = total + 2.5.",
          },
          {
            code: "total > 15 && quantity >= 3",
            note: "Both comparisons must pass; when the left side already fails, && stops early and returns false.",
          },
          {
            code: "\"5\" === 5",
            note: "Strict equality compares types first, so text and number never match here.",
          },
          {
            code: "17 % 5",
            note: "The remainder operator answers what division leaves over: three 5s fit into 17, and 2 remains.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "if (name = \"Ada\") { greet(); }",
        why: "One = assigns, so the condition becomes the string 'Ada' (always truthy) and the branch runs every single time.",
        fix: "Compare with three equals: if (name === 'Ada').",
      },
      {
        wrong: "Trusting \"5\" == 5 in a form check",
        why: "Loose equality converts types silently — true today, a sneaky bug tomorrow when one side changes type.",
        fix: "Write '5' === 5 (false) and convert explicitly: Number('5').",
      },
      {
        wrong: "Reading 2 + 3 * 4 as (2 + 3) * 4",
        why: "Multiplication binds tighter, so the answer is 14, not 20 — operators follow math-style precedence.",
        fix: "Group with parentheses: (2 + 3) * 4 when that is what you mean.",
      },
    ],
    quiz: [
      {
        question: "What is 2 + '2'?",
        options: ["4 (numbers win)", "'22' (text wins for +)", "NaN (the types clash)"],
        answerIndex: 1,
        explanation: "When + sees a string, it switches to concatenation, so the number is glued on as text.",
      },
      {
        question: "Which operator checks value and type together?",
        options: ["=", "==", "==="],
        answerIndex: 2,
        explanation: "=== is strict equality. == converts types first, and = only assigns.",
      },
    ],
    exercises: [
      {
        title: "Even or odd",
        prompt: "For the number 28, print whether it is even using the remainder operator, then repeat for 7.",
        language: "javascript",
        starterCode: `const first = 28;
const second = 7;
`,
        hint: "n % 2 === 0 is true exactly for even numbers.",
      },
      {
        title: "Running total",
        prompt: "Start a let total at 0 and add 5.5, then 3, then 12 with the += shortcut. Print the total, and print whether it is at least 20.",
        language: "javascript",
        starterCode: `let total = 0;
`,
        hint: "total += 5.5, then compare with >= — the comparison itself returns a boolean you can print.",
      },
    ],
  },
  {
    slug: "conditional-statements",
    title: "Conditional Statements",
    minutes: 12,
    objectives: [
      "Write if / else if / else chains that sort values into bands",
      "Predict the six falsy values and avoid truthiness traps",
      "Use switch for fixed cases and break them correctly",
    ],
    sections: [
      {
        heading: "if, else if, else",
        body: `An if runs its block only when the condition is true. Chain extra cases with else if, and let a final else catch everything you did not name. Conditions are checked in order, and the **first** truthy one wins.

Keep each branch small and flat — nesting ifs inside ifs is where readability goes to die. When a chain sorts a value into bands (age groups, price tiers), order the comparisons from one end to the other so every body fits its gap.`,
      },
      {
        heading: "Truthiness",
        body: `Every value converts to true or false when a condition needs it. Falsy values are exactly six: false, 0, "" (an empty string), null, undefined, and NaN. Everything else — including "0", a space, even an empty-looking [] — is truthy.

That surprises everyone once. "0" is text, not the number zero, so it is truthy. Prefer explicit comparisons like count === 0 in your early code; lean on truthiness once you can predict it.`,
      },
      {
        heading: "switch",
        body: `switch compares one value against fixed cases using === and jumps to the matching case. Each case normally ends with break — without it, execution falls through into the next case, which is occasionally useful for grouping but usually an accident.

Use switch when one value has several specific answers (menu options, command names) and if/else chains when ranges or mixed conditions are involved.`,
      },
    ],
    examples: [
      {
        title: "Grade band and weekend check",
        description: "An if-chain for ranges, a switch for fixed cases.",
        language: "javascript",
        code: `const score = 84;

if (score >= 90) {
  console.log("Excellent");
} else if (score >= 80) {
  console.log("Strong");
} else if (score >= 70) {
  console.log("Passing");
} else {
  console.log("Keep practicing");
}

const day = "sat";
switch (day) {
  case "sat":
  case "sun":
    console.log("Weekend!");
    break;
  default:
    console.log("Weekday");
}`,
        lineNotes: [
          {
            code: "if (score >= 90)",
            note: "Conditions are tested top to bottom; the first true branch runs and the rest are skipped.",
          },
          {
            code: "else if (score >= 80)",
            note: "Reached only when every earlier test failed — that is what makes banded ranges safe.",
          },
          {
            code: "case \"sat\":",
            note: "Stacked cases share one block: either weekend day falls into the same code.",
          },
          {
            code: "break;",
            note: "Ends the switch. Removing it would let execution continue into 'sun' and beyond — the fall-through trap.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "Testing a number with if (count)",
        why: "The value 0 is falsy, so a perfectly valid count of zero silently skips the branch.",
        fix: "Say what you mean: if (count === 0) or if (count > 0).",
      },
      {
        wrong: "Missing break in a switch case",
        why: "Execution falls through into the next case and runs code you did not intend — the top source of switch bugs.",
        fix: "End each case with break (or deliberately stack cases that share one block).",
      },
      {
        wrong: "Math-style chaining: if (18 <= age <= 65)",
        why: "JavaScript compares left to right: (18 <= age) becomes a boolean, which is then compared to 65 — never what you wanted.",
        fix: "Combine two comparisons with &&: if (age >= 18 && age <= 65).",
      },
    ],
    quiz: [
      {
        question: "Which of these values is truthy?",
        options: ["0", "''", "'0'"],
        answerIndex: 2,
        explanation: "The text '0' is a non-empty string — only the six falsy values convert to false.",
      },
      {
        question: "You remove break from a switch case. What happens?",
        options: [
          "Execution continues into the next case",
          "A syntax error at compile time",
          "The switch is skipped entirely",
        ],
        answerIndex: 0,
        explanation: "Fall-through is legal — rarely intended, and a classic source of bugs.",
      },
    ],
    exercises: [
      {
        title: "Ticket tier",
        prompt: "For age 42 print 'Standard'; for anyone under 13 print 'Child'; for 65 and up print 'Senior'. Order your checks so reordering cannot break the result.",
        language: "javascript",
        starterCode: `const age = 42;
`,
        hint: "Check the low band first, then the high band, and leave the middle to a plain else.",
      },
      {
        title: "Empty input guard",
        prompt: "Given const guess = '', print 'Type something' when it is empty and print the guess itself otherwise.",
        language: "javascript",
        starterCode: `const guess = "";
`,
        hint: "An empty string is falsy, so if (!guess) catches it — but a comparison guess === '' states it even more plainly.",
      },
    ],
  },
  {
    slug: "loops",
    title: "Loops",
    minutes: 12,
    objectives: [
      "Write for loops with correct start, condition and step",
      "Choose while when the number of passes is unknown",
      "Keep every loop moving toward its end condition",
    ],
    sections: [
      {
        heading: "for counting",
        body: `A for loop bundles setup, condition and update on one line: \`for (let i = 1; i <= 5; i++)\` — start i at 1, keep going while i <= 5, then add 1 after every pass. The body runs once per pass.

Counting loops shine when you know how many passes you need: printing rows, stepping through positions, running a simulation round. The update line moves the loop toward its end — forget it and nothing will save you.`,
      },
      {
        heading: "while and do...while",
        body: `\`while (condition)\` repeats as long as the condition stays true, checking **before** each pass. Use it when the number of passes is not known in advance — draining a battery, waiting for input.

do...while checks after the body, so it always runs at least once. It fits "ask, then act" flows. Whatever you choose, the loop must make progress: something inside the body must eventually make the condition false, or the program hangs.`,
      },
      {
        heading: "for...of",
        body: `When you have a collection (arrays and strings arrive soon) and just want its values one by one, \`for (const item of list)\` handles the bookkeeping for you — no index, no off-by-one.

The classic for stays the tool when you need the position itself, or want to skip and step by 2. A sibling, for...in, walks object keys and is a common source of confusion on arrays; prefer for...of for values.`,
      },
    ],
    examples: [
      {
        title: "Laps and batteries",
        description: "An accumulator for a for loop, then a countdown with while.",
        language: "javascript",
        code: `let total = 0;
for (let i = 1; i <= 4; i++) {
  total += i;
}
console.log(total); // 10  (1 + 2 + 3 + 4)

for (let lap = 1; lap <= 3; lap++) {
  console.log("Lap " + lap);
}

let energy = 3;
while (energy > 0) {
  console.log("Zap! Energy: " + energy);
  energy = energy - 1;
}
console.log("Out of energy");`,
        lineNotes: [
          {
            code: "for (let i = 1; i <= 4; i++)",
            note: "Three parts on one line: a start value, a keep-going test, and the step run after each pass.",
          },
          {
            code: "total += i;",
            note: "Accumulates across passes — the variable is declared outside the loop so it survives.",
          },
          {
            code: "while (energy > 0)",
            note: "Checked before every pass; the loop runs only while this stays true.",
          },
          {
            code: "energy = energy - 1;",
            note: "Progress! Without shrinking the value the condition never turns false and the loop runs forever.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "let i = 0; while (i < 5) { console.log(i); }",
        why: "The condition never changes, so the loop never ends and the tab freezes — the classic infinite loop.",
        fix: "Move toward the end inside the body: add i = i + 1 (the for header does this for you).",
      },
      {
        wrong: "for (let i = 0; i <= 4; i++) when the task says 'four passes'",
        why: "With i starting at 0, i <= 4 runs five passes (0, 1, 2, 3, 4) — off-by-one errors come from mixing boundaries and start values.",
        fix: "Match them up: i < 4 for four passes from 0, or i <= 4 to count 1 through 4.",
      },
      {
        wrong: "let total = 0; inside the loop body",
        why: "Declared inside, it is recreated on every pass and wiped clean — your sum stays broken.",
        fix: "Declare the accumulator before the loop so the value survives between passes.",
      },
    ],
    quiz: [
      {
        question: "How many times does the body run: for (let i = 0; i < 3; i++)?",
        options: ["2", "3", "4"],
        answerIndex: 1,
        explanation: "i takes the values 0, 1 and 2; the loop stops when i reaches 3.",
      },
      {
        question: "Which loop always runs its body at least once?",
        options: ["for", "while", "do...while"],
        answerIndex: 2,
        explanation: "do...while checks the condition after the first pass, unlike for and while.",
      },
    ],
    exercises: [
      {
        title: "Odd counter",
        prompt: "Use a for loop to print every odd number from 1 to 9, then print their sum (it is 25).",
        language: "javascript",
        starterCode: `let sum = 0;
`,
        hint: "You can step by 2: for (let i = 1; i <= 9; i += 2) — add each i to sum inside the body.",
      },
      {
        title: "Countdown",
        prompt: "With a while loop, print 5, 4, 3, 2, 1 one per line, then print 'Liftoff!' after the loop ends.",
        language: "javascript",
        starterCode: `let count = 5;
`,
        hint: "Count down inside the body: count = count - 1 — and let the condition be count > 0.",
      },
    ],
  },
  {
    slug: "functions",
    title: "Functions",
    minutes: 14,
    objectives: [
      "Define named functions and call them with arguments",
      "Return values from functions and use the result",
      "Write compact arrow functions for short helpers",
    ],
    sections: [
      {
        heading: "Define once, call often",
        body: `A function packages steps under a name you invent. Define it once with function greet(name) { ... } — name is a **parameter**, a placeholder for whatever you pass later. Then call it as often as you like: greet("Ada"), greet("Bo").

Function names should read like verbs: calculateTotal, sendReminder. When a block of code explains itself with a good name, the calling lines tell the story of the program.`,
      },
      {
        heading: "Return values",
        body: `Use return to hand a result back to the caller. It also ends the function immediately — nothing after it in that pass runs. A function without return gives back the value undefined.

Calls are expressions: const area = rect(3, 4) stores what rect returned, and rect(3, 4) * 2 uses it directly. Passing values in and getting values out is the whole contract; functions do not magically see or change the caller's variables by name.`,
      },
      {
        heading: "Arrow functions",
        body: `Arrow functions are a compact way to write the same idea, popular for small helpers and callbacks: \`const square = (n) => n * n;\`. With braces, they behave like normal functions and need an explicit return.

Rule of thumb: one short expression — no braces, no return; anything longer — use braces and return, like a regular function. Arrows also handle \`this\` differently, which matters once objects join in; for now treat them as friendly syntax.`,
      },
    ],
    examples: [
      {
        title: "From cold to readable",
        description: "A classic function, a call with a result, and two arrows.",
        language: "javascript",
        code: `function celsiusToFahrenheit(celsius) {
  return celsius * 9 / 5 + 32;
}

const boiling = celsiusToFahrenheit(100);
console.log(boiling); // 212

const greet = (name) => {
  return "Hi, " + name + "!";
};
console.log(greet("Ada")); // Hi, Ada!

const square = (n) => n * n;
console.log(square(6)); // 36`,
        lineNotes: [
          {
            code: "function celsiusToFahrenheit(celsius)",
            note: "Declares a named function; celsius is a placeholder filled in by each call.",
          },
          {
            code: "return celsius * 9 / 5 + 32;",
            note: "Computes the answer and hands it back to whoever called the function.",
          },
          {
            code: "const boiling = celsiusToFahrenheit(100);",
            note: "A call is an expression — the returned 212 lands in boiling.",
          },
          {
            code: "const square = (n) => n * n;",
            note: "No braces means the expression is returned automatically — return is implied.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "function add(a, b) { a + b; }",
        why: "The sum is computed and then dropped — without return the caller receives undefined.",
        fix: "return a + b; — say what comes out.",
      },
      {
        wrong: "Defining greet() and waiting for it to run",
        why: "A definition is just a recipe; nothing executes until the function is called with parentheses.",
        fix: "Add the call line: greet();",
      },
      {
        wrong: "const double = (n) => return n * 2;",
        why: "Arrow bodies without braces are a single expression — return is not allowed there and the syntax fails.",
        fix: "Drop return: const double = (n) => n * 2; or add braces around the body.",
      },
    ],
    quiz: [
      {
        question: "What does a function return when its body has no return statement?",
        options: ["null", "undefined", "the last computed value"],
        answerIndex: 1,
        explanation: "Without return, JavaScript hands back undefined.",
      },
      {
        question: "return does which two things?",
        options: [
          "Stops the function and hands back a value",
          "Prints and stores a value",
          "Declares and exports a variable",
        ],
        answerIndex: 0,
        explanation: "return exits the current pass and delivers the result to the caller.",
      },
    ],
    exercises: [
      {
        title: "Area helper",
        prompt: "Write areaOfRectangle(width, height) that returns the area, call it for 3x5 and for 4x4, and print both results.",
        language: "javascript",
        starterCode: `function areaOfRectangle(width, height) {
  // your return here
}
`,
        hint: "return width * height; then log areaOfRectangle(3, 5).",
      },
      {
        title: "Arrow conversion",
        prompt: "Rewrite isLong(text) as a compact arrow function and use it twice: function isLong(text) { return text.length > 10; }",
        language: "javascript",
        starterCode: `function isLong(text) {
  return text.length > 10;
}
`,
        hint: "No braces and no return: const isLong = (text) => text.length > 10;",
      },
    ],
  },
  {
    slug: "arrays-and-objects",
    title: "Arrays and Objects",
    minutes: 14,
    objectives: [
      "Read and edit arrays with indexes, length and push",
      "Transform lists with map, filter and reduce",
      "Access object fields and copy them safely with spread",
    ],
    sections: [
      {
        heading: "Arrays: ordered lists",
        body: `An array stores values in order: const names = ["Ada", "Bo", "Cy"];. Positions start at zero — names[0] is "Ada", and names.length is 3. push adds to the end, and slice picks a copy of a range.

The built-in methods map, filter and reduce are workhorses: map produces a new array by transforming each item, filter keeps the items a test approves of, and reduce folds everything into a single value. None of those three change the original array.`,
      },
      {
        heading: "Objects: named fields",
        body: `An object pairs keys with values: const user = { name: "Ada", level: 2 };. Read with dot notation (user.name) or brackets (user["name"]) — brackets are required when the key comes from a variable.

Objects describe one thing with several qualities; arrays hold many things in order. They combine constantly — an array of objects is how most real data looks, from products to messages.`,
      },
      {
        heading: "References and copies",
        body: `Arrays and objects are passed by reference: const copy = list does not copy — both names point at the same array, and a push on one is "seen" by the other. That is a feature, but it surprises people daily.

Real copies use the spread operator: [...list] or { ...user }. One warning: spreads copy one level deep, so nested objects inside are still shared. For most everyday code, one level is exactly what you need.`,
      },
    ],
    examples: [
      {
        title: "Cart math",
        description: "Three list methods over an array of objects, plus a spread.",
        language: "javascript",
        code: `const cart = [
  { name: "Keyboard", price: 45 },
  { name: "Cable", price: 8 },
];

const names = cart.map((item) => item.name);
console.log(names); // ["Keyboard", "Cable"]

const cheap = cart.filter((item) => item.price < 20);
console.log(cheap.length); // 1

const total = cart.reduce((sum, item) => sum + item.price, 0);
console.log(total); // 53

const summary = { total: total, items: cart.length };
const labelled = { ...summary, currency: "USD" };
console.log(labelled.currency); // USD`,
        lineNotes: [
          {
            code: "cart.map((item) => item.name)",
            note: "Runs the little function on every element and gathers the results into a new array; the original cart is untouched.",
          },
          {
            code: "cart.filter((item) => item.price < 20)",
            note: "Keeps only the items for which the test returns true.",
          },
          {
            code: "cart.reduce((sum, item) => sum + item.price, 0)",
            note: "Folds the array into one number: start at 0 and add each price.",
          },
          {
            code: "{ ...summary, currency: \"USD\" }",
            note: "Spread copies the properties of summary and appends one more — a shallow, one-level copy.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "const backup = original; original.push(9);",
        why: "Both names point to the same array — backup now contains the 9 too, and no copy was ever made.",
        fix: "Spread it: const backup = [...original];",
      },
      {
        wrong: "[10, 9, 1].sort() expecting [1, 9, 10]",
        why: "The default sort compares values as text, so 10 lands between 1 and 9 alphabetically.",
        fix: "Sort numbers with a comparator: sort((a, b) => a - b).",
      },
      {
        wrong: "user[0] on an object expecting its first field",
        why: "Objects have named keys, not positions — brackets expect a key, so user[0] asks for a key named 0.",
        fix: "Read fields by name: user.name, or keep ordered data in an array.",
      },
    ],
    quiz: [
      {
        question: "What does map return?",
        options: [
          "The same array, edited in place",
          "A new array built from the callback's results",
          "One combined value",
        ],
        answerIndex: 1,
        explanation: "map always builds a new array; filter also builds one, and reduce folds into a single value.",
      },
      {
        question: "What is basket[0] when basket = ['pear', 'fig']?",
        options: [
          "'pear' — arrays start counting at zero",
          "'fig' — arrays start at one",
          "undefined — the index is out of range",
        ],
        answerIndex: 0,
        explanation: "Indexing starts at 0, so the first element is basket[0].",
      },
    ],
    exercises: [
      {
        title: "Presentable names",
        prompt: "Given const names = ['ada', 'alan', 'grace'], produce an array of names in UPPERCASE with map, then use filter to keep only names of 4 letters or fewer.",
        language: "javascript",
        starterCode: `const names = ["ada", "alan", "grace"];
`,
        hint: "Inside the callback: item.toUpperCase() — and item.length <= 4 for the filter test.",
      },
      {
        title: "Bookshelf entry",
        prompt: "Build a book object with title and pages, then create a second object that spreads the first and adds read: false. Print both to compare.",
        language: "javascript",
        starterCode: `const book = { title: "Dune", pages: 412 };
`,
        hint: "{ ...book, read: false } leaves book untouched — that is the point of spreading.",
      },
    ],
  },
  {
    slug: "dom-fundamentals",
    title: "DOM Fundamentals",
    minutes: 15,
    objectives: [
      "Select elements with querySelector and handle null results",
      "Change text and classes without unsafe innerHTML",
      "Respond to clicks and inputs with addEventListener",
    ],
    sections: [
      {
        heading: "The page as a tree",
        body: `The browser turns your HTML into the DOM — a tree of element objects — and hands you \`document\` as the entry point. \`document.querySelector("#signup")\` finds the first element matching a CSS selector; querySelectorAll returns all of them as a list.

If nothing matches, querySelector gives back null. Treat that null respectfully: most "cannot read properties of null" errors in beginner DOM code are a failed selection that nobody checked.`,
      },
      {
        heading: "Changing content and style",
        body: `textContent swaps an element's visible text safely — everything is treated as plain text. innerHTML interprets what you give it as HTML, powerful for trusted templates and dangerous with user input, because text like an image tag becomes live markup. Prefer textContent for anything a person can type.

Change looks by flipping classes with classList (add, remove, toggle) and keep the styling in CSS. Direct style edits such as el.style.color = "red" work, but scatter styling across your script.`,
      },
      {
        heading: "Listening to events",
        body: `Users act; your code answers. \`element.addEventListener("click", handler)\` registers a function to run on every click; input, submit and keydown are also common. The handler is a callback: registered immediately, executed later by the browser.

Scripts that touch the page must run after the HTML exists — put the script tag at the end of the body or use defer. Then selecting elements never races the page.`,
      },
    ],
    examples: [
      {
        title: "A click counter",
        description: "State lives in a variable; the DOM only shows it.",
        language: "javascript",
        code: `const button = document.querySelector("#count");
const label = document.querySelector("#count-label");

let clicks = 0;

button.addEventListener("click", () => {
  clicks += 1;
  label.textContent = \`Clicked \${clicks} times\`;
  button.textContent = "Click again";
});`,
        lineNotes: [
          {
            code: "document.querySelector(\"#count\")",
            note: "Selects by CSS id and returns the element — or null when nothing on the page matches.",
          },
          {
            code: "button.addEventListener(\"click\", () => { ... })",
            note: "Registers a callback: the arrow runs on every future click, not now.",
          },
          {
            code: "clicks += 1;",
            note: "State lives in plain variables; the DOM is only where you show it.",
          },
          {
            code: "label.textContent = ...",
            note: "Writing textContent replaces the visible text and treats it as plain text — safe with any input.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "Selecting at the top of a script loaded in <head>",
        why: "The body's elements do not exist yet, so querySelector finds nothing and later property access throws on null.",
        fix: "Load the script at the end of body or with defer, then select.",
      },
      {
        wrong: "greeting.innerHTML = userName;",
        why: "User text is interpreted as HTML — broken markup and a classic script-injection hole.",
        fix: "Use textContent for anything a person can type.",
      },
      {
        wrong: "btn.onclick = handleClick();",
        why: "The parentheses make the call happen immediately, and its return value (often undefined) is assigned instead of the function.",
        fix: "Pass the reference: btn.addEventListener('click', handleClick).",
      },
    ],
    quiz: [
      {
        question: "What does document.querySelector('#missing') return when no element matches?",
        options: ["null", "an empty array", "the document itself"],
        answerIndex: 0,
        explanation: "No match, no element: you get null, so check it before reading properties.",
      },
      {
        question: "Which property safely displays text a user typed?",
        options: ["innerHTML", "textContent", "outerHTML"],
        answerIndex: 1,
        explanation: "textContent never interprets markup, so user text stays inert text.",
      },
    ],
    exercises: [
      {
        title: "Greeter",
        prompt: "The page has <input id='name-input'>, <button id='greet-btn'> and <p id='greeting'>. On click, make the paragraph read 'Hello, NAME' using the input's current value.",
        language: "javascript",
        starterCode: `const input = document.querySelector("#name-input");
const button = document.querySelector("#greet-btn");
`,
        hint: "Read with input.value, then write the sentence into greeting.textContent.",
      },
      {
        title: "Class flipper",
        prompt: "Wire #toggle so each click switches the class 'active' on #box on and off.",
        language: "javascript",
        starterCode: `const toggle = document.querySelector("#toggle");
const box = document.querySelector("#box");
`,
        hint: "classList.toggle('active') does both directions in one call.",
      },
    ],
  },
  {
    slug: "asynchronous-javascript",
    title: "Asynchronous JavaScript",
    minutes: 18,
    objectives: [
      "Explain why slow work needs callbacks and promises",
      "Create and await promises inside async functions",
      "Catch async errors with try/catch and keep code sequential",
    ],
    sections: [
      {
        heading: "One thread, queued work",
        body: `JavaScript runs on a single thread, so two statements from your code cannot happen at the same instant. Browsers cope by queueing slow work — timers, network replies — and letting callbacks run when the result is ready, while the page stays responsive.

An async function's synchronous part runs immediately; everything after the first await is scheduled for later. That is why code after an await-using call can finish first, and why printouts can appear out of the order you wrote them.`,
      },
      {
        heading: "Promises: IOUs for values",
        body: `A promise represents a value that will arrive: pending now, then fulfilled with a value or rejected with an error. You attach reactions with .then(...) and .catch(...) — or, cleaner, await the promise inside an async function.

The pattern is everywhere: timers, fetch requests, file reads. Learning to read a promise chain is reading modern JavaScript, whether or not you write server code.`,
      },
      {
        heading: "async/await",
        body: `Mark a function async and you may use await inside it: \`const reply = await wait(1000);\` pauses just this function (not the page) until the promise settles, then continues with the value. Awaiting a rejected promise throws, so wrap risky awaits in try/catch.

One await per slow step, in order, keeps code readable. Independent steps can start together and be awaited together with Promise.all — your first look at real parallelism patterns.`,
      },
    ],
      examples: [
      {
        title: "Tea, asynchronously",
        description: "A tiny promise helper, then two awaits inside an async function.",
        language: "javascript",
        code: `function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function makeTea() {
  console.log("Boiling water...");
  await wait(1000);
  console.log("Steeping...");
  await wait(500);
  console.log("Tea is ready!");
}

makeTea();
console.log("(The page kept working meanwhile)");`,
        lineNotes: [
          {
            code: "return new Promise((resolve) => setTimeout(resolve, ms));",
            note: "Builds a promise and arms resolve: when the timeout fires, resolve runs and anyone awaiting continues.",
          },
          {
            code: "await wait(1000);",
            note: "Pauses only this async function for a second; the rest of the page keeps running.",
          },
          {
            code: "await wait(500);",
            note: "A second pause — awaits queue up inside the same function in the order written.",
          },
          {
            code: "makeTea();",
            note: "Calling an async function starts the work and returns a promise — the final console.log here runs before the timers finish.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "const data = load(); then reading data.text",
        why: "A promise is an IOU, not the value — the fields you want do not exist yet.",
        fix: "const data = await load(); inside an async function, or load().then((data) => ...)",
      },
      {
        wrong: "let result; getData().then((v) => { result = v; }); console.log(result);",
        why: "The log line runs before the callback fills the variable — async callbacks run later, not in line.",
        fix: "Put the work that needs the value inside the .then, or await it in an async function.",
      },
      {
        wrong: "items.forEach(async (item) => { await save(item); });",
        why: "forEach ignores the promises your async callbacks return, so nothing waits for the saves.",
        fix: "Loop with await: for (const item of items) { await save(item); } — or Promise.all(items.map(save)) to run them together.",
      },
    ],
    quiz: [
      {
        question: "What does await actually pause?",
        options: [
          "The whole page",
          "Only the current async function",
          "The browser's timers",
        ],
        answerIndex: 1,
        explanation: "Other code keeps running; the pause is local to the function that awaited.",
      },
      {
        question: "An await rejects. How do you respond?",
        options: [
          "try/catch around it",
          "console.error after the fact",
          "There is no mechanism — async calls never fail",
        ],
        answerIndex: 0,
        explanation: "A rejected promise becomes a thrown error at the await, and try/catch catches it like any other.",
      },
    ],
    exercises: [
      {
        title: "Timer promise",
        prompt: "Write wait(ms) that returns a promise resolving after ms (a one-liner with setTimeout), then an async function that prints 'A', waits 300ms and prints 'B'.",
        language: "javascript",
        starterCode: `function wait(ms) {
  // return a promise here
}
`,
        hint: "new Promise((resolve) => setTimeout(resolve, ms)) resolves after the timeout fires.",
      },
      {
        title: "Together, not in turn",
        prompt: "Make taskA wait 200ms and taskB wait 400ms (each logging when done). Run Promise.all([taskA(), taskB()]) and print 'both done' when it resolves — then compare with awaiting them one after the other.",
        language: "javascript",
        starterCode: `function taskA() {
  // wait 200ms, then log
}
function taskB() {
  // wait 400ms, then log
}
`,
        hint: "Promise.all takes an array of promises and settles when every one of them is done.",
      },
    ],
  },
];

