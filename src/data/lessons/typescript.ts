import type { Lesson } from "@/types/course";

export const typescriptLessons: Lesson[] = [
  {
    slug: "introduction-to-typescript",
    title: "Introduction to TypeScript",
    minutes: 10,
    objectives: [
      "Describe what TypeScript adds to plain JavaScript",
      "Explain how the type checker finds bugs before running code",
      "Annotate variables and functions with basic types",
    ],
    sections: [
      {
        heading: "What TypeScript adds",
        body: `TypeScript is JavaScript with a type system bolted on at authoring time. You describe the shape of your data — "this parameter is a string", "this object always has an id" — and the compiler checks every use against those promises before your code ever runs.

The runtime behavior is plain JavaScript. Every type annotation is erased when the code is built; browsers and Node execute exactly what they would have without types. Types are a conversation with your future self and your teammates, not a runtime force field.`,
      },
      {
        heading: "What the checker buys you",
        body: `Most TypeScript value comes from boring places: a renamed property you forgot in one file, a function called with swapped arguments, a null that was possible all along. The editor underlines each of those as you type, with fixes attached.

You control strictness with compiler flags. Modern projects run strict mode, which enables the rules that actually protect you — treating missing values seriously, banning silent any. When a check flags code you believe is right, investigate first: the message usually teaches you something.`,
      },
      {
        heading: "The same language, plus types",
        body: `Everything from the JavaScript track works unchanged: let and const, functions, loops, objects. TypeScript is a superset — any valid JavaScript file is almost a valid TypeScript file, and you can add types gradually.

The habit to build now: read error messages. They are unusually good. TypeScript tells you which type it found, which type it wanted, and where — a compiler that also explains itself.`,
      },
    ],
    examples: [
      {
        title: "Annotated from line one",
        description: "Types on variables and a function, plus one intentional error.",
        language: "typescript",
        code: `const orderTotal: number = 42.5;
const couponCode: string = "SAVE10";

// No annotation needed: the value makes the type obvious
const taxRate = 0.19;

function finalPrice(total: number, code: string): string {
  return "Final: " + (total - total * 0.1) + " (" + code + ")";
}

console.log(finalPrice(orderTotal, couponCode));
// The next line fails type-check before the code ever runs:
// finalPrice(orderTotal, 5);`,
        lineNotes: [
          {
            code: "const orderTotal: number = 42.5;",
            note: "The annotation after the colon promises this name always holds a number.",
          },
          {
            code: "const taxRate = 0.19;",
            note: "Initializers give away the type, so inference saves you the annotation.",
          },
          {
            code: "function finalPrice(total: number, code: string): string {",
            note: "Parameters and return type form a checked contract at every call site.",
          },
          {
            code: "// finalPrice(orderTotal, 5);",
            note: "Passing a number where a string is declared fails type-check — the mistake surfaces in the editor, not in production.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "const count: number = \"10\";",
        why: "The annotation and the value disagree; the compiler rejects the line instead of guessing your intent.",
        fix: "Store a number: const count = 10, or convert with Number('10').",
      },
      {
        wrong: "Running .ts files straight in the browser",
        why: "Browsers execute JavaScript, not TypeScript — the types must be removed by a build step first.",
        fix: "Let the toolchain compile: tsc for scripts, or let Next.js and Vite handle it in projects.",
      },
      {
        wrong: "Slapping any on values that refuse to type-check",
        why: "any switches the checker off for that value — the errors come back later, in code you had not written yet.",
        fix: "Describe the real shape; when a type is genuinely unknown, use unknown and narrow it.",
      },
    ],
    quiz: [
      {
        question: "What does compiled TypeScript output contain?",
        options: [
          "Types, enforced again at runtime",
          "JavaScript with the annotations erased",
          "A mix of checks and casts",
        ],
        answerIndex: 1,
        explanation: "Types exist only while you author and check; the output is plain JavaScript.",
      },
      {
        question: "TypeScript is best described as:",
        options: [
          "a superset of JavaScript with static types",
          "a separate language unrelated to JavaScript",
          "a runtime that replaces the browser",
        ],
        answerIndex: 0,
        explanation: "It adds types to JavaScript; your existing JS knowledge transfers directly.",
      },
    ],
    exercises: [
      {
        title: "Annotate the shelf",
        prompt: "Declare a const for a book title (string), one for pages (number) and one for isRead (boolean), each with an explicit annotation, then print all three.",
        language: "typescript",
        starterCode: `const title: string = "";
`,
        hint: "The annotation sits between the name and the value: const pages: number = 350.",
      },
      {
        title: "Meet the checker",
        prompt: "The function below is fine — now call it correctly once with a string, then attempt a call with a number, read the error TypeScript reports, and comment the bad call out.",
        language: "typescript",
        starterCode: `function cheer(name: string): string {
  return "Hi " + name;
}
`,
        hint: "The error names the argument type it did not expect — reading it is the exercise.",
      },
    ],
  },
  {
    slug: "type-annotations",
    title: "Type Annotations",
    minutes: 10,
    objectives: [
      "Annotate variables, parameters and return types",
      "Decide when inference is enough and when to spell types out",
      "Read simple type errors and fix the mismatched side",
    ],
    sections: [
      {
        heading: "Annotating names",
        body: `After a name, a colon and a type form the rule: \`let balance: number;\`. Once annotated, assignments are checked forever: balance = "hundred" fails. For a const with an initializer, the annotation is usually noise — inference writes it for you.

Annotate when a value starts empty, when inference would be too wide, or when you want the type spelled out at a glance (exports, function boundaries). Otherwise let inference work: it never gets the initializer wrong.`,
      },
      {
        heading: "Function annotations",
        body: `Parameters take annotations because the compiler cannot read your mind: function deposit(amount: number) {...}. The return type goes after the parameter list: function deposit(amount: number, bonus: number): number {...}. A function that returns nothing usable is typed void.

Return annotations are optional when the body makes the type obvious, but writing them on public functions pays twice — the compiler verifies your promise, and the signature documents itself.`,
      },
      {
        heading: "When inference is not enough",
        body: `Declare a variable without a value and without a type, and TypeScript cannot help you: \`let guess;\` is an implicit-any error under strict mode. Annotate first: let guess: number;

Empty collections have the same trap. Decide what they will hold when you create them, and the checker guards every later push and read.`,
      },
    ],
    examples: [
      {
        title: "Typed balance",
        description: "Declarations, one annotated function, one commented-out error.",
        language: "typescript",
        code: `let balance: number;
balance = 100;
balance = balance + 40;

function deposit(current: number, amount: number): number {
  return current + amount;
}

const afterBonus = deposit(balance, 25);
console.log(afterBonus); // 165

// deposit("165", 5); // error: a string is not a number`,
        lineNotes: [
          {
            code: "let balance: number;",
            note: "Declared with a type and no value: assignments that follow must be numbers.",
          },
          {
            code: "function deposit(current: number, amount: number): number {",
            note: "Both parameters and the return type are annotated — every call is checked against them.",
          },
          {
            code: "const afterBonus = deposit(balance, 25);",
            note: "No annotation needed: inference already knows deposit returns a number.",
          },
          {
            code: "// deposit(\"165\", 5);",
            note: "A string in a number slot fails type-check: the signature, not luck, guards the call.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "let total: number; console.log(total);",
        why: "A declared-but-unset variable is not usable: TypeScript reports it may be undefined, and at runtime it is.",
        fix: "Initialize: let total: number = 0 — annotation plus a starting value.",
      },
      {
        wrong: "function sum(a, b): number { return a + b; }",
        why: "Unannotated parameters are an implicit-any error under strict mode — you told the compiler the return type but not the inputs.",
        fix: "Annotate both: function sum(a: number, b: number): number.",
      },
      {
        wrong: "let name: string = \"Ada\"; then name = 42;",
        why: "The annotation binds one type for good — the assignment fails because a number is not a string.",
        fix: "Keep the type stable, or widen it deliberately: name: string | number (unions come later).",
      },
    ],
    quiz: [
      {
        question: "Which line passes type-check?",
        options: [
          "let flag: string = true;",
          "let flag: boolean = false;",
          "let flag = false; flag = 'maybe';",
        ],
        answerIndex: 1,
        explanation: "The first mismatches types; the third infers boolean and then breaks it with a string — only the second is consistent.",
      },
      {
        question: "What does a void return type promise?",
        options: [
          "The function returns null",
          "The function takes no parameters",
          "The function returns nothing usable",
        ],
        answerIndex: 2,
        explanation: "void means no meaningful return value — calling code should not use the result.",
      },
    ],
    exercises: [
      {
        title: "Typed recipe",
        prompt: "Write gramsToOunces(grams: number): number that multiplies by 0.035274, and print two calls including one with 0.",
        language: "typescript",
        starterCode: `function gramsToOunces(grams: number): number {
  // convert and return
}
`,
        hint: "Return grams * 0.035274 — the annotation alone does not compute anything.",
      },
      {
        title: "Fix the drift",
        prompt: "These lines fail type-check for two different reasons. Fix the annotations so the file compiles, keeping the intent: a numeric count and a shout function that uppercases text.",
        language: "typescript",
        starterCode: `let count: number = "5";
function shout(text: string): number {
  return text.toUpperCase();
}
`,
        hint: "Ask of each annotation: does the value or the returned expression actually have that type?",
      },
    ],
  },
  {
    slug: "primitive-types",
    title: "Primitive Types",
    minutes: 12,
    objectives: [
      "Use the lowercase primitive names string, number and boolean",
      "Admit absent values with string | null style unions",
      "Know where bigint and symbol fit",
    ],
    sections: [
      {
        heading: "The everyday primitives",
        body: `TypeScript reuses JavaScript's primitive types with lowercase names: string, number, boolean. Lowercase matters — String with a capital is the wrapper-object type, and annotating with it quietly degrades your types.

number covers all numeric values: 7, 3.14, -2, Infinity, NaN. boolean is just true and false — no clever truthiness in the type system. Strings, as in JavaScript, treat text as text.`,
      },
      {
        heading: "null and undefined, taken seriously",
        body: `With strict mode's strictNullChecks, "missing" gets its own value space: a string is a string, and nothing else. To allow an absence, widen the type: string | null or string | undefined. That small ceremony is most of TypeScript's safety.

Once a value can be missing, the checker forces you to handle it — guard, default, or narrow — before it lets you use the value. Your null crashes move from runtime to compile time.`,
      },
      {
        heading: "bigint and symbol",
        body: `Two rarities complete the primitives. bigint holds integers beyond the number type's safe range — used with an n suffix: 123n. symbol creates unique keys for objects. You will meet both rarely; knowing they exist is enough for now.

The practical takeaway: check types with typeof at runtime, but describe variables with the lowercase names — string, number, boolean — and let the compiler carry the load.`,
      },
    ],
    examples: [
      {
        title: "Primitives with intent",
        description: "Strict types plus one honest union for a missing value.",
        language: "typescript",
        code: `const title: string = "Shapes";
const views: number = 1024;
const published: boolean = true;
const subtitle: string | null = null; // none yet

function describe(views: number, published: boolean): string {
  if (published) {
    return views + " views, published";
  }
  return views + " views, draft";
}

console.log(describe(views, published));
console.log(subtitle); // null — waiting for an editor`,
        lineNotes: [
          {
            code: "const title: string = \"Shapes\";",
            note: "Lowercase string — the type of any text value.",
          },
          {
            code: "const subtitle: string | null = null;",
            note: "Optional text: the union admits either a string or the absence null.",
          },
          {
            code: "if (published)",
            note: "Plain JavaScript logic — types change nothing at runtime, only what values may be held.",
          },
          {
            code: "console.log(subtitle);",
            note: "Printing shows null at runtime even though the type system already knew.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "const size: Number = 5;",
        why: "Capitalized Number is the wrapper-object type — number is the primitive you almost always want.",
        fix: "Use lowercase: const size: number = 5. Same rule for String and Boolean.",
      },
      {
        wrong: "const middle: string = user.middleName;",
        why: "middleName is string | undefined, and a plain string variable cannot hold undefined — the check catches a crash before it happens.",
        fix: "Widen: const middle: string | undefined, or supply a default: user.middleName ?? ''.",
      },
      {
        wrong: "let done: boolean = \"yes\";",
        why: "Types do not coerce: a truthy string is still not a boolean in the type system.",
        fix: "Keep it boolean: const done: boolean = true — or make the variable a string and compare later.",
      },
    ],
    quiz: [
      {
        question: "Which type name do you write for text?",
        options: ["String", "string", "text"],
        answerIndex: 1,
        explanation: "Lowercase string is the primitive type; capitalized String is the wrapper object type and rarely what you want.",
      },
      {
        question: "Under strictNullChecks, how do you say 'a number or nothing'?",
        options: ["number", "nullable number", "number | null"],
        answerIndex: 2,
        explanation: "Unions widen a type to admit null (or undefined) explicitly.",
      },
    ],
    exercises: [
      {
        title: "Four facts",
        prompt: "Declare customer (string), total (number), paid (boolean) and note (string | null) as separate annotated const values, with note set to null, and print each value.",
        language: "typescript",
        starterCode: `const customer: string = "Dana";
`,
        hint: "The union comes after the declared type: const note: string | null = null.",
      },
      {
        title: "Guest default",
        prompt: "Write displayName(name: string | null): string that returns the name, or 'Guest' when it is null. Call it both ways.",
        language: "typescript",
        starterCode: `function displayName(name: string | null): string {
  // handle null here
}
`,
        hint: "name ?? 'Guest' returns the right side whenever the left is null or undefined.",
      },
    ],
  },
  {
    slug: "union-types",
    title: "Union Types",
    minutes: 12,
    objectives: [
      "Declare values that may be one of several types with |",
      "Narrow a union with typeof checks before using it",
      "Restrict values to exact strings with literal unions",
    ],
    sections: [
      {
        heading: "One of several",
        body: `A union type is written with a vertical bar: string | number means "a string or a number, decided per value". Assign either, and the compiler enforces the promise at every use.

Unions are how real-world messiness gets typed: an id that may be a code or a number, a field that may be missing, a status that may be one of a few words. Precision in, precision out — the compiler holds you to your own definition.`,
      },
      {
        heading: "Narrowing down",
        body: `A union admits several types, but each use site usually accepts one. TypeScript tracks your checks: inside \`if (typeof id === "string")\`, id is a string; in the else branch, it is a number. This is called narrowing and it is central to everything.

Without narrowing, only operations valid for every member are allowed. With it, you get full access to the member you proved you have. You will practice narrowing properly in its own lesson.`,
      },
      {
        heading: "Literal unions",
        body: `Union members may be exact values, not just types: \`type Size = "small" | "medium" | "large";\`. Then Size accepts exactly those three strings and rejects "huge" at compile time.

Literal unions replace typo-prone status strings across a codebase: the compiler knows the full menu. Compare deliberately, and the checker verifies you handled every spelling you allowed.`,
      },
    ],
    examples: [
      {
        title: "Flexible ids",
        description: "A string-or-number union, narrowed by typeof, plus a literal union.",
        language: "typescript",
        code: `type Id = string | number;

function show(id: Id): string {
  if (typeof id === "string") {
    return "Code: " + id.toUpperCase();
  }
  return "Code: #" + id;
}

console.log(show("abc")); // Code: ABC
console.log(show(7)); // Code: #7

type Size = "small" | "medium" | "large";
const size: Size = "medium";
// const broken: Size = "huge"; // not a member of the union`,
        lineNotes: [
          {
            code: "type Id = string | number;",
            note: "A named union: values may be either member, decided per assignment.",
          },
          {
            code: "if (typeof id === \"string\")",
            note: "The check narrows the union inside the branch — here id is provably a string.",
          },
          {
            code: "return \"Code: #\" + id;",
            note: "After the if returned, the only remaining member is number, so id is treated as one.",
          },
          {
            code: "const size: Size = \"medium\";",
            note: "Literal unions accept only the listed exact strings — a typo like 'hugr' cannot sneak in.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "function area(r: number | string) { return r * r; }",
        why: "Not every member of the union supports * — a string would break, so the compiler refuses before runtime.",
        fix: "Narrow or convert: check typeof r === 'number' first, otherwise run Number(r) * Number(r).",
      },
      {
        wrong: "let size: \"small\" | \"large\" = \"medium\";",
        why: "The union is a closed set — the assignment must be one of the listed members, and medium is not.",
        fix: "Add the member you need ('small' | 'medium' | 'large') or pick a listed one.",
      },
      {
        wrong: "Calling toUpperCase directly on string | number",
        why: "The method belongs to string only; the compiler checks what every member can do, not what some might.",
        fix: "Guard first: if (typeof value === 'string'), then call it.",
      },
    ],
    quiz: [
      {
        question: "Inside if (typeof x === 'number'), what is x?",
        options: ["still string | number", "number", "never"],
        answerIndex: 1,
        explanation: "The check proves the member; the branch sees exactly number.",
      },
      {
        question: "Which assignment compiles for type Direction = 'up' | 'down'?",
        options: ["d = \"down\"", "d = \"Up\"", "d = \"UP\""],
        answerIndex: 0,
        explanation: "Literal unions are exact and case-sensitive: only the spelled-out members pass.",
      },
    ],
    exercises: [
      {
        title: "Two-sided formatter",
        prompt: "Write format(value: string | number): string: numbers get two decimals with toFixed(2), strings lose surrounding spaces with trim(). Call it with ' hi ' and with 3.1.",
        language: "typescript",
        starterCode: `function format(value: string | number): string {
  // narrow, then act
}
`,
        hint: "if (typeof value === 'number') { return value.toFixed(2); } — the remaining branch can trust the type system for the string half.",
      },
      {
        title: "Role descriptions",
        prompt: "Define type Role = 'admin' | 'member' | 'guest' and describe(role: Role): string returning a different sentence for each role.",
        language: "typescript",
        starterCode: `type Role = "admin" | "member" | "guest";
`,
        hint: "role === 'admin' branches on the accepted spellings — try switch for a cleaner chain.",
      },
    ],
  },
  {
    slug: "interfaces",
    title: "Interfaces",
    minutes: 14,
    objectives: [
      "Describe object shapes with interface declarations",
      "Mark fields optional and readonly where the data demands it",
      "Reuse shapes with extends",
    ],
    sections: [
      {
        heading: "Describing shapes",
        body: `An interface names an object shape: the fields it has and the type of each. Once User is described, any value annotated User must actually carry those fields — extra fields on object literals are flagged, and missing ones are errors.

Interfaces are erased at runtime like everything else; they exist so the compiler can check your data flow. Two differently-written values that satisfy the same interface are interchangeable.`,
      },
      {
        heading: "Optional and readonly fields",
        body: `A question mark marks a field as optional: \`email?: string\` means the field may be absent, and its type is really string | undefined. Optional fields demand the same handling any missing value does.

readonly locks a field after creation: \`readonly id: number\` can be read but not reassigned. Reach for it on things that identify or timestamp — ids, dates, urls.`,
      },
      {
        heading: "Extending",
        body: `Interfaces extend each other: \`interface Admin extends User\` starts with every User field and lets you add more. The result is checked as thoroughly as anything hand-written.

One interface can extend several others. Prefer extends when you are describing an is-a relationship; when you are combining shapes side by side, intersections (covered with type aliases) do that job.`,
      },
    ],
    examples: [
      {
        title: "User record",
        description: "One interface, one extension, and a guard for the optional field.",
        language: "typescript",
        code: `interface User {
  id: number;
  name: string;
  email?: string; // may be absent
  readonly joined: string;
}

interface Admin extends User {
  canReview: boolean;
}

const ada: Admin = {
  id: 1,
  name: "Ada",
  joined: "2024-01-15",
  canReview: true,
};

function label(user: User): string {
  if (user.email) {
    return user.name + " (" + user.email + ")";
  }
  return user.name;
}

console.log(label(ada)); // Ada
// ada.joined = "2025-01-01"; // error: readonly`,
        lineNotes: [
          {
            code: "email?: string;",
            note: "A question mark makes the field optional — the value may be missing, so reads must handle undefined.",
          },
          {
            code: "readonly joined: string;",
            note: "Readable forever, writable never: assignments to joined are compile errors.",
          },
          {
            code: "interface Admin extends User {",
            note: "Everything User requires is inherited; Admin adds its own field on top.",
          },
          {
            code: "if (user.email)",
            note: "The truthiness check doubles as narrowing: inside the branch, email is a real string.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "const u: User = { id: 1, name: \"Bo\", nickname: \"b\" };",
        why: "Object literals are checked exactly: nickname was never declared, and a typo pretending to be data is exactly what this check catches.",
        fix: "Add the field to the interface or delete it from the literal.",
      },
      {
        wrong: "Reading user.email.toUpperCase() with no guard",
        why: "email may be absent, so its type is string | undefined — toUpperCase is guaranteed for only half of that.",
        fix: "Check first: if (user.email) { ... } — or supply a default with user.email ?? ''.",
      },
      {
        wrong: "ada.joined = \"2025-01-01\";",
        why: "joined is readonly — reassigning it is a compile error, protecting values that identify or timestamp records.",
        fix: "Build a new object with the field you want: { ...ada, joined: '2025-01-01' }.",
      },
    ],
    quiz: [
      {
        question: "What does email?: string promise?",
        options: [
          "email is always a string",
          "email may be absent, and reads may see undefined",
          "email accepts any value",
        ],
        answerIndex: 1,
        explanation: "Optional fields are really string | undefined — the same story as the null handling from the primitives lesson.",
      },
      {
        question: "interface Admin extends User gives Admin:",
        options: [
          "only the fields you add",
          "runtime copies of User methods",
          "every User field plus your additions",
        ],
        answerIndex: 2,
        explanation: "Extending inherits the field requirements; the compiler checks the combined shape.",
      },
    ],
    exercises: [
      {
        title: "Book type",
        prompt: "Describe interface Book with title (string), author (string), pages (number) and optional read (boolean). Make two values: one complete, one without read.",
        language: "typescript",
        starterCode: `interface Book {
  // your fields here
}
`,
        hint: "Read is the only field that earns a question mark — the rest are required.",
      },
      {
        title: "Extend it",
        prompt: "Write Person (name, birthYear) and have Student extend it with a studyPlan: string field. Create one student and print a sentence using two fields.",
        language: "typescript",
        starterCode: `interface Person {
  name: string;
  birthYear: number;
}
`,
        hint: "extends copies every requirement — your Student literal must satisfy both interfaces.",
      },
    ],
  },
  {
    slug: "type-aliases",
    title: "Type Aliases",
    minutes: 12,
    objectives: [
      "Name any type with the type keyword",
      "Choose between type and interface sensibly",
      "Compose small named types with intersections",
    ],
    sections: [
      {
        heading: "Naming any type",
        body: `A type alias gives a type a name: \`type Point = { x: number; y: number };\`. From then on, Point is a first-class type usable anywhere — parameters, variables, returns.

Unlike an interface, an alias can name anything: primitives (type Id = string), unions, function types, tuples, and combinations of all of those. When a shape is awkward to spell twice, alias it once.`,
      },
      {
        heading: "type or interface?",
        body: `Both can describe object shapes, and many teams use either consistently. The practical split: interfaces extend and are natural for object contracts; type handles unions, primitives, intersections, and tricks interfaces cannot express.

Pick a default for your project and break it only when one syntax is genuinely better. Reading code is easier when object shapes, unions and function contracts each use the form they are best at.`,
      },
      {
        heading: "Composing pieces",
        body: `Aliases compose. Intersections with & merge requirements: \`type Admin = User & Permissions;\` must satisfy both. You can build small, named pieces — Address, Timestamps — and assemble larger records from them.

Composition scales. When one field's type changes, you edit one alias instead of hunting duplicates; when a rule is missing, the compiler shows you exactly where the assembled types disagree.`,
      },
    ],
    examples: [
      {
        title: "Aliases in action",
        description: "An object type, a union, and a function type — all named once.",
        language: "typescript",
        code: `type Point = { x: number; y: number };
type Label = string | number;
type Handler = (event: string) => void;

function move(point: Point, dx: number, dy: number): Point {
  return { x: point.x + dx, y: point.y + dy };
}

const start: Point = { x: 0, y: 0 };
console.log(move(start, 3, 4)); // { x: 3, y: 4 }

const id: Label = "A17";
const onClick: Handler = (event) => console.log(event);`,
        lineNotes: [
          {
            code: "type Point = { x: number; y: number };",
            note: "An object shape named once and reusable everywhere a type is expected.",
          },
          {
            code: "type Handler = (event: string) => void;",
            note: "Aliases can name function types too — perfect for callback contracts.",
          },
          {
            code: "function move(point: Point, dx: number, dy: number): Point",
            note: "The alias documents the parameter's meaning better than an inline shape would.",
          },
          {
            code: "const onClick: Handler = (event) => console.log(event);",
            note: "The alias types the callback, so event is inferred as string with no extra annotation.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "const Point = { x: number; y: number };",
        why: "That is runtime syntax — a const cannot hold a type, because types vanish before the code runs.",
        fix: "Use the type keyword: type Point = { x: number; y: number };",
      },
      {
        wrong: "type User = interface { name: string };",
        why: "interface is a declaration form of its own; it cannot appear inside a type alias.",
        fix: "Write the shape directly: type User = { name: string }; or declare interface User { name: string }.",
      },
      {
        wrong: "Repeating the same anonymous shape in five function signatures",
        why: "Each copy drifts over time — one gets a field, the others forget, and the compiler cannot relate them.",
        fix: "Alias it once (type Filters = { ... }) and use the alias in all five places.",
      },
    ],
    quiz: [
      {
        question: "What can a type alias name?",
        options: [
          "only object shapes",
          "any type: unions, functions, tuples, primitives",
          "only primitives",
        ],
        answerIndex: 1,
        explanation: "type covers everything interfaces do and more — unions and function types included.",
      },
      {
        question: "Which is true about interface versus type?",
        options: [
          "interface cannot describe objects",
          "type can build unions; interface cannot",
          "both are erased at compile time",
        ],
        answerIndex: 2,
        explanation: "Unions need type; object shapes can use either — and both are erased at runtime.",
      },
    ],
    exercises: [
      {
        title: "Settings alias",
        prompt: "Create type AppSettings = { name: string; maxUsers: number; theme: 'light' | 'dark' } and one value satisfying it. Print one field.",
        language: "typescript",
        starterCode: `type AppSettings = {
  name: string;
};
`,
        hint: "A literal union nests inside an object type: theme stays one of the two exact strings.",
      },
      {
        title: "Callback contract",
        prompt: "Alias type Check = (n: number) => boolean, then write two functions with that type: isEven and isBig (numbers over 99). Test each on 42.",
        language: "typescript",
        starterCode: `type Check = (n: number) => boolean;
`,
        hint: "The alias fixes the signature — implementations just fill in the body: const isEven: Check = (n) => n % 2 === 0.",
      },
    ],
  },
  {
    slug: "functions",
    title: "Functions",
    minutes: 14,
    objectives: [
      "Annotate parameters and return types on function declarations",
      "Use optional, default and rest parameters correctly",
      "Type callbacks with function type aliases",
    ],
    sections: [
      {
        heading: "Typed parameters, honest returns",
        body: `Annotate each parameter; annotate the return when it helps. \`function price(total: number, code?: string): string\` — every call site is now checked against what you actually declared, not against runtime luck.

Return types are verified even when inferred: if you promise string and return a number, the compiler stops you. For exported or public functions, write the return type — the signature becomes self-documenting.`,
      },
      {
        heading: "Optional, default, rest",
        body: `Optional parameters take a question mark — and required ones may not follow them. A default value types and de-optionalizes at once: \`function greet(name: string, tone = "warm")\`. Rest parameters collect extras into a typed array: \`...values: number[]\`.

Together these replace the arguments-object guessing of old JavaScript with signatures the compiler reads. Which parameters are optional becomes part of the type system, not folklore.`,
      },
      {
        heading: "Functions as values",
        body: `Functions are values, so they have types: \`type Mapper = (line: string) => string;\`. Alias the signature once and every callback of that shape is checked — no annotations needed on the arrow itself, since context supplies them.

This is how libraries stay pleasant: event handlers, array callbacks, timers. Each one is just a function type waiting for your implementation to match it or fail loudly.`,
      },
    ],
    examples: [
      {
        title: "Typed utilities",
        description: "A default parameter, a rest parameter, and an aliased callback.",
        language: "typescript",
        code: `function formatPrice(amount: number, currency = "USD"): string {
  return amount.toFixed(2) + " " + currency;
}

console.log(formatPrice(9.5)); // 9.50 USD
console.log(formatPrice(1200, "EUR")); // 1200.00 EUR

function sumAll(...values: number[]): number {
  return values.reduce((total, n) => total + n, 0);
}
console.log(sumAll(1, 2, 3)); // 6

type IsEven = (n: number) => boolean;
const check: IsEven = (n) => n % 2 === 0;
console.log(check(10)); // true`,
        lineNotes: [
          {
            code: "function formatPrice(amount: number, currency = \"USD\")",
            note: "A default value types the parameter and keeps the second argument optional at call sites.",
          },
          {
            code: "function sumAll(...values: number[]): number",
            note: "The rest parameter collects every extra argument into a typed array.",
          },
          {
            code: "values.reduce((total, n) => total + n, 0)",
            note: "The inner callback's parameters are inferred — the array type supplies them.",
          },
          {
            code: "const check: IsEven = (n) => n % 2 === 0;",
            note: "The alias declares the whole signature; n inherits number from it.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "function f(a?: number, b: string) {}",
        why: "A required parameter may not follow an optional one — every call would be forced to pass a's slot anyway.",
        fix: "Reorder: required first, optionals last: (b: string, a?: number).",
      },
      {
        wrong: "function log(): string { console.log(\"hi\"); }",
        why: "The declared return type is string, but the body returns nothing — the promise does not match the implementation.",
        fix: "Change the return type to void, or actually return the string.",
      },
      {
        wrong: "Calling sumAll(1, '2', 3)",
        why: "The rest parameter declared number[], so the string argument fails type-check before anything runs.",
        fix: "Convert at the boundary: sumAll(1, Number('2'), 3).",
      },
    ],
    quiz: [
      {
        question: "For function ping(): void, what may its body return?",
        options: [
          "a string",
          "a boolean",
          "nothing (a bare return is fine)",
        ],
        answerIndex: 2,
        explanation: "void functions return no usable value — though return; with nothing after it is allowed.",
      },
      {
        question: "Which parameter list is valid?",
        options: [
          "(a?: number, b: string)",
          "(a?: number, b?: string, c: boolean)",
          "(b: string, a?: number)",
        ],
        answerIndex: 2,
        explanation: "Required parameters must come before optional ones — only the third list keeps optionals at the end.",
      },
    ],
    exercises: [
      {
        title: "Safe division",
        prompt: "Write divide(a: number, b: number): number | null returning null when b is 0 and the quotient otherwise. Call it with a zero divisor and print the result.",
        language: "typescript",
        starterCode: `function divide(a: number, b: number): number | null {
  // guard, then divide
}
`,
        hint: "if (b === 0) { return null; } — after that line the remaining path returns a number.",
      },
      {
        title: "First match",
        prompt: "Use type Check = (n: number) => boolean. Write firstThat(values: number[], check: Check): number | undefined returning the first value that passes, or undefined when none do.",
        language: "typescript",
        starterCode: `type Check = (n: number) => boolean;
function firstThat(values: number[], check: Check): number | undefined {
  // search here
}
`,
        hint: "A for...of loop with an early return is the clearest search — and the function may just end with no return for undefined.",
      },
    ],
  },
  {
    slug: "generics",
    title: "Generics",
    minutes: 16,
    objectives: [
      "Write functions that stay type-safe for many types with <T>",
      "Create generic interfaces and fill in their type at use",
      "Constrain T with extends when you need known properties",
    ],
    sections: [
      {
        heading: "One function, many types",
        body: `Generics put a placeholder type on a function: \`function wrap<T>(value: T): T\`. T is chosen at each call — wrap("hi") is string, wrap(4) is number — and both the parameter and the return stay the same type.

Without generics you choose between any (no safety) and one concrete type (no reuse). With them you get reuse and safety in one. You will meet this pattern everywhere: arrays, promises, React state.`,
      },
      {
        heading: "Generic types",
        body: `Types can be generic too: \`interface Box<T> { value: T }\` — fill in the blank when you use it: Box<string>, Box<number[]>. The compiler tracks which fill-in belongs to which value, so reading a Box<string>'s value as text is provable.

One note for later: in .tsx files, generic arrow functions need a trailing comma (\`<T,>\`) so the angle bracket is not read as JSX. Function declarations never have that problem.`,
      },
      {
        heading: "Constraining T",
        body: `A bare T promises nothing about the value, so you cannot touch its properties. A constraint fixes that: \`function logId<T extends { id: number }>(item: T)\` — now item is known to have a numeric id, while T still adapts to whatever else the argument carries.

Constraints turn "any type at all" into "any type with the features I need". T extends keyof SomeType pushes the idea further, limiting T to the keys of that type — the everyday sweet spot for typed helpers.`,
      },
    ],
    examples: [
      {
        title: "Reusable and safe",
        description: "A generic function, a generic interface, and one constrained helper.",
        language: "typescript",
        code: `function firstOrDefault<T>(items: T[], fallback: T): T {
  return items[0] ?? fallback;
}

const word = firstOrDefault(["a", "b"], "none"); // string
const num = firstOrDefault([10, 20], 0); // number
console.log(word, num); // a 10

interface Box<T> {
  value: T;
}

const gift: Box<string> = { value: "tea" };
console.log(gift.value.toUpperCase()); // TEA

function logId<T extends { id: number }>(item: T): number {
  return item.id;
}
console.log(logId({ id: 9, name: "pan" })); // 9`,
        lineNotes: [
          {
            code: "function firstOrDefault<T>(items: T[], fallback: T): T {",
            note: "The placeholder T is chosen by the caller, tying the array's element type to the return type.",
          },
          {
            code: "return items[0] ?? fallback;",
            note: "The fallback fires when the array is empty — ?? covers null and undefined in one operator.",
          },
          {
            code: "interface Box<T> {",
            note: "A generic interface: Box<string> and Box<number> are different, checked types.",
          },
          {
            code: "T extends { id: number }",
            note: "The constraint promises a numeric id, so the body may read item.id while T stays flexible.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "function first(arr: any[]): any { return arr[0]; }",
        why: "any erases the types on both ends — callers lose all knowledge of the element type and the checker looks away.",
        fix: "Make it generic: function first<T>(arr: T[]): T.",
      },
      {
        wrong: "const first = <T>(x: T) => x written in a .tsx file",
        why: "In tsx, a leading <T> parses as a JSX element and the file stops compiling.",
        fix: "Use a function declaration, or add the trailing comma: <T,>(x: T) => x.",
      },
      {
        wrong: "gift.value.toUpperCase() when gift: Box<number>",
        why: "The fill-in type rules the contents — a number has no toUpperCase, so the compiler rejects the line.",
        fix: "Keep the fill-in type and the operations consistent: Box<number> contents are numbers.",
      },
    ],
    quiz: [
      {
        question: "In wrap<T>(value: T): T, when is T decided?",
        options: [
          "when you write the function",
          "never — T stays abstract at runtime",
          "at each call site, from the argument",
        ],
        answerIndex: 2,
        explanation: "Callers choose: wrap('x') fixes T to string for that call.",
      },
      {
        question: "Which function keeps parameter and return type locked together?",
        options: [
          "function wrap(x: any): any",
          "function wrap(x: number): any",
          "function wrap<T>(x: T): T",
        ],
        answerIndex: 2,
        explanation: "Only the generic version rules out wrap(4) returning 'four' — the others permit anything.",
      },
    ],
    exercises: [
      {
        title: "Boxes",
        prompt: "Write identity<T>(value: T): T and boxed<T>(value: T): Box<T> using interface Box<T> { value: T }. Call boxed with a string and with a number and read a field of each.",
        language: "typescript",
        starterCode: `interface Box<T> {
  value: T;
}
`,
        hint: "The one-line body covers it: return { value }; — T flows out of the object untouched.",
      },
      {
        title: "Constrained pluck",
        prompt: "Implement getKey<T, K extends keyof T>(obj: T, key: K): T[K] with a one-line body, then call it twice on { id: 1, name: 'Ada' } — once per key.",
        language: "typescript",
        starterCode: `function getKey<T, K extends keyof T>(obj: T, key: K): T[K] {
  // one line here
}
`,
        hint: "return obj[key]; — the constraint proves key belongs to obj, and T[K] names the value's type.",
      },
    ],
  },
  {
    slug: "type-narrowing",
    title: "Type Narrowing",
    minutes: 14,
    objectives: [
      "Narrow unions with typeof and comparisons before use",
      "Use tags (discriminated unions) to split object types apart",
      "Prefer real checks over casts like as",
    ],
    sections: [
      {
        heading: "Unions, proven apart",
        body: `A union like string | number is too wide for most operations, so TypeScript narrows it by following your checks. Inside \`if (typeof value === "number")\`, value is a number; in the else branch it is a string. The compiler reads control flow the way a careful human does.

Narrowing is deductive, not a cast: you are not asserting, you are proving with a real check. That is why it stays correct when the code around it changes.`,
      },
      {
        heading: "The everyday guards",
        body: `typeof handles primitives (with the else branch catching the rest). instanceof narrows class instances. The in operator tests for a property: \`if ("radius" in shape)\`. Comparing to an exact literal refines literal unions into one member.

One warning: narrowing is undone when the variable is mutated or reassigned. Narrow as close to the use as possible and keep values local where you can.`,
      },
      {
        heading: "Tagged unions",
        body: `Objects get their own idiom: give each member a constant tag property, then check it. \`{ kind: "circle", radius: number }\` versus \`{ kind: "square", side: number }\` — the kind comparison proves which member you hold, and each branch gets full access.

This discriminated-union pattern is the workhorse of app data: results with success and error states, events, editor states. Add a member later and the compiler points at every branch you have not covered.`,
      },
    ],
    examples: [
      {
        title: "Shapes by tag",
        description: "One union, one tag check, two fully-typed branches.",
        language: "typescript",
        code: `type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  if (shape.kind === "circle") {
    return 3.14159 * shape.radius * shape.radius;
  }
  return shape.side * shape.side;
}

console.log(area({ kind: "circle", radius: 2 })); // about 12.57
console.log(area({ kind: "square", side: 4 })); // 16`,
        lineNotes: [
          {
            code: "if (shape.kind === \"circle\")",
            note: "Comparing the tag narrows the union: inside the branch, shape is provably the circle member.",
          },
          {
            code: "3.14159 * shape.radius * shape.radius",
            note: "Only the circle member has radius — the narrowed type makes the read legal.",
          },
          {
            code: "return shape.side * shape.side;",
            note: "Reached only when the first branch returned, so the remaining possibility is the square — no annotation needed.",
          },
          {
            code: "area({ kind: \"circle\", radius: 2 })",
            note: "Object arguments carry the tag, so the compiler can tell which member is being built.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "if (value) { value.toFixed(1); } for string | number",
        why: "Truthiness narrows nothing useful here — both a string and a number can be truthy, so the union survives the check.",
        fix: "Test the type: if (typeof value === 'number'), then call toFixed.",
      },
      {
        wrong: "Reading shape.side outside of any branch",
        why: "side exists on only one member of the union — the compiler refuses reads it cannot prove.",
        fix: "Handle the tag first: if (shape.kind === 'square') or a case in switch (shape.kind).",
      },
      {
        wrong: "Fixing errors with casts: const items = data as string[]",
        why: "as overrides the compiler without proving anything; whether the value really is a string[] goes unchecked, and the runtime pays.",
        fix: "Narrow with a real check (typeof, Array.isArray), or change the source type so no assertion is needed.",
      },
    ],
    quiz: [
      {
        question: "Inside if (typeof x === 'number'), what does the compiler know about x?",
        options: [
          "x is still string | number",
          "x is a number",
          "x is never",
        ],
        answerIndex: 1,
        explanation: "typeof guards are real proof — the branch sees exactly number.",
      },
      {
        question: "What makes a union of object types easy to narrow?",
        options: [
          "a shared literal tag such as kind",
          "long property names",
          "making every field optional",
        ],
        answerIndex: 0,
        explanation: "The tag acts as a switch key: one comparison proves the whole member.",
      },
    ],
    exercises: [
      {
        title: "Numeric adder",
        prompt: "Write add(a: string | number, b: string | number): number that converts any string member with Number() and returns the sum. Try both-text, both-number and mixed calls.",
        language: "typescript",
        starterCode: `function add(a: string | number, b: string | number): number {
  // narrow each side, convert, return
}
`,
        hint: "Check typeof on each side; in the string branch, call Number(value) — then add the two converted values.",
      },
      {
        title: "Tagged messages",
        prompt: "Define Msg as a union of { kind: 'text'; body: string } and { kind: 'image'; src: string }. Write render(msg: Msg): string returning 'Text: BODY' for text and 'Image: SRC' for image.",
        language: "typescript",
        starterCode: `type Msg =
  | { kind: "text"; body: string }
  | { kind: "image"; src: string };
`,
        hint: "Two if branches on msg.kind are enough; each branch may freely read its own member's field.",
      },
    ],
  },
  {
    slug: "typescript-with-react",
    title: "TypeScript with React",
    minutes: 16,
    objectives: [
      "Type component props with an interface",
      "Let useState infer state types and work with typed setters",
      "Type event handlers with React's event types",
    ],
    sections: [
      {
        heading: "Props as a type",
        body: `Components are functions taking one argument: their props. Describe the shape once — \`interface CounterProps { start: number; label: string }\` — and every parent that renders \`<CounterBox start={0} label="Clicks" />\` is checked against it.

Forgetting a required prop, misspelling one, or passing the wrong type becomes a compile error pointing at the exact usage. That is the daily dividend of typed components: the component's contract travels with it.`,
      },
      {
        heading: "useState types itself",
        body: `useState(0) infers number, and the setter then accepts only numbers — setCount("3") is an error. When a state starts as an obvious type, let inference work; annotate when the initial value is narrower than the range you need: \`useState<string | null>(null)\`.

The same trick applies to useRef, useReducer and context values: give TypeScript one accurate initial value and the machinery types the rest of the hook.`,
      },
      {
        heading: "Events in tsx",
        body: `Handlers receive typed events: \`React.ChangeEvent<HTMLInputElement>\` for an input's change. Inline arrows usually need nothing — attach to onChange and the parameter type arrives from the element. Name the type explicitly when you extract a handler into its own function.

Prefer never any here: (e: any) compiles but untypes the one value events are about. If the exact React event type is unclear, hover the handler prop; the editor shows the full signature.`,
      },
    ],
    examples: [
      {
        title: "A counter, typed end to end",
        description: "Props interface, inferred state, and a JSX render with inline handler.",
        language: "tsx",
        code: `import { useState } from "react";

interface CounterProps {
  label: string;
  start: number;
}

function CounterBox({ label, start }: CounterProps) {
  const [count, setCount] = useState(start);

  return (
    <div>
      <p>{label + ": " + count}</p>
      <button onClick={() => setCount(count + 1)}>Add</button>
    </div>
  );
}

export default CounterBox;`,
        lineNotes: [
          {
            code: "interface CounterProps {",
            note: "Props are plain data: the interface becomes the contract every parent is checked against.",
          },
          {
            code: "const [count, setCount] = useState(start);",
            note: "useState infers number from start, so setCount accepts only numbers.",
          },
          {
            code: "{label + ': ' + count}",
            note: "Curly braces embed a JavaScript expression into JSX; the result is rendered as text.",
          },
          {
            code: "onClick={() => setCount(count + 1)}",
            note: "The arrow ignores the event and updates state; React re-renders with the new count.",
          },
        ],
      },
    ],
    mistakes: [
      {
        wrong: "Writing generic arrows directly in .tsx: const X = <T>(v: T) => v",
        why: "In tsx a leading <T> is parsed as JSX, breaking the file — a language quirk, not a bug in your logic.",
        fix: "Prefer function declarations in components; or write <T,> with a trailing comma.",
      },
      {
        wrong: "setCount(\"3\") when useState started at 0",
        why: "The state's type was inferred as number from the initial value, so a string update fails type-check.",
        fix: "Convert once: setCount(Number('3')) — or type the state as string | number if both are genuinely needed.",
      },
      {
        wrong: "onChange={(e: any) => ...}",
        why: "any untypes the event — the exact thing handlers exist to describe safely.",
        fix: "Let it infer inline, or name it: (e: React.ChangeEvent<HTMLInputElement>).",
      },
    ],
    quiz: [
      {
        question: "How do props get type-checked?",
        options: [
          "React validates them at runtime",
          "the component's props interface, checked where it is rendered",
          "CSS naming conventions",
        ],
        answerIndex: 1,
        explanation: "Parents are checked at each usage against the declared interface; nothing has to run for that.",
      },
      {
        question: "Which is the typed React event for an input?",
        options: [
          "React.ChangeEvent<HTMLInputElement>",
          "any",
          "Event<HTMLInput>",
        ],
        answerIndex: 0,
        explanation: "ChangeEvent carries the element type so e.target.value is checked, not guessed.",
      },
    ],
    exercises: [
      {
        title: "Echo field",
        prompt: "Build TextInput that holds a string in state, renders an input whose onChange stores e.target.value, and shows the current value in a paragraph.",
        language: "tsx",
        starterCode: `import { useState } from "react";

function TextInput() {
  // state + input + paragraph
}
`,
        hint: "onChange={(e) => setValue(e.target.value)} — the event type arrives from the input element itself.",
      },
      {
        title: "Typed list",
        prompt: "Give StringList props { items: string[] } and render them inside a ul with map, giving each li a key. Render it with two names to test.",
        language: "tsx",
        starterCode: `interface StringListProps {
  items: string[];
}
`,
        hint: "items.map((item) => <li key={item}>{item}</li>) — the map callback's parameter is typed by the items array.",
      },
    ],
  },
];
