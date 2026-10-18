import type { CodeLanguage } from "@/types";

/** Monaco language ids and display labels for the code editor. */
export const EDITOR_LANGUAGES: CodeLanguage[] = ["javascript", "typescript", "python", "html", "css"];

/** Starter templates for the code workspace. */
export const TEMPLATES: Record<CodeLanguage, Array<{ name: string; code: string }>> = {
  javascript: [
    {
      name: "Functions practice",
      code: `// Practice: small, focused functions
function greet(name) {
  return \`Hello, \${name}!\`;
}

function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(greet("Ada")); // Hello, Ada!
console.log(sum(1, 2, 3)); // 6
`,
    },
    {
      name: "Arrays and objects",
      code: `const students = [
  { name: "Ada", score: 92 },
  { name: "Lin", score: 78 },
  { name: "Mira", score: 88 },
];

const topStudents = students
  .filter((s) => s.score >= 85)
  .map((s) => s.name)
  .sort();

console.log(topStudents); // ["Ada", "Mira"]
`,
    },
    {
      name: "Async examples",
      code: `// Waiting on asynchronous work
async function loadName() {
  const promise = new Promise((resolve) =>
    setTimeout(() => resolve("Ada"), 300),
  );
  const name = await promise;
  console.log(name); // Ada (after ~300ms)
}

loadName();
`,
    },
  ],
  typescript: [
    {
      name: "Typed starter",
      code: `// Practice: types in action
interface Student {
  name: string;
  score: number;
}

function average(scores: number[]): number {
  const total = scores.reduce((sum, n) => sum + n, 0);
  return scores.length === 0 ? 0 : total / scores.length;
}

const students: Student[] = [
  { name: "Ada", score: 92 },
  { name: "Lin", score: 78 },
];

console.log(average(students.map((s) => s.score))); // 85
`,
    },
    {
      name: "Generics example",
      code: `// A minimal generic container
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const names = ["Ada", "Lin"];
const numbers = [1, 2, 3];

console.log(first(names)?.toUpperCase()); // ADA
console.log(first(numbers)); // 1
`,
    },
  ],
  python: [
    {
      name: "Functions practice",
      code: `# Practice: small, focused functions
def greet(name):
    return f"Hello, {name}!"


def total(*numbers):
    return sum(numbers)


print(greet("Ada"))      # Hello, Ada!
print(total(1, 2, 3))    # 6
`,
    },
    {
      name: "Lists and dicts",
      code: `students = [
    {"name": "Ada", "score": 92},
    {"name": "Lin", "score": 78},
    {"name": "Mira", "score": 88},
]

top = [s["name"] for s in students if s["score"] >= 85]
top.sort()
print(top)  # ['Ada', 'Mira']
`,
    },
  ],
  html: [
    {
      name: "Semantic page skeleton",
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Practice page</title>
  </head>
  <body>
    <header>
      <nav aria-label="Main">
        <a href="#home">Home</a>
        <a href="#courses">Courses</a>
      </nav>
    </header>

    <main id="home">
      <h1>My learning page</h1>
      <p>Semantic landmarks help screen readers jump around.</p>
    </main>

    <footer>© 2026 Practice</footer>
  </body>
</html>
`,
    },
  ],
  css: [
    {
      name: "Flexbox card",
      code: `.card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: 12px;
}

.card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Center anything, the modern way */
.wrapper {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
`,
    },
  ],
};

const DEFAULT_TEMPLATE_INDEX: Record<CodeLanguage, number> = {
  javascript: 0,
  typescript: 0,
  python: 0,
  html: 0,
  css: 0,
};

export function templateFor(language: CodeLanguage): string {
  const templates = TEMPLATES[language];
  const template = templates?.[DEFAULT_TEMPLATE_INDEX[language]];
  return template?.code ?? "";
}

export function templateByIndex(language: CodeLanguage, index: number): string {
  return TEMPLATES[language]?.[index]?.code ?? templateFor(language);
}
