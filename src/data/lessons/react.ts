import type { Lesson } from "@/types/course";

/**
 * Lesson content for the react-fundamentals path.
 * Slugs are stable keys used by routes and lookups — do not rename them.
 */
export const reactLessons: Lesson[] = [
  {
    slug: "introduction-to-react",
    title: "Introduction to React",
    minutes: 10,
    objectives: [
      "Explain what React is and which problem it solves",
      "Describe a component as a function that returns JSX",
      "Compose a page out of small components",
      "Mount an app with createRoot",
    ],
    sections: [
      {
        heading: "What React is",
        body: `React is a JavaScript library for building user interfaces. Instead of writing step-by-step commands that poke at the DOM, you describe **what** the screen should look like for the current data, and React works out **how** to update the browser efficiently.\n\nThink of the UI as a function of your data: given the same data, you always get the same screen. When the data changes, React re-runs the affected components and applies the smallest set of DOM updates needed. That declarative model is the core idea behind everything else in this course.`,
      },
      {
        heading: "Components compose",
        body: `A component is a JavaScript function that returns markup — written in JSX — describing one piece of the UI. Components can render other components, so complex pages grow from small, reusable, testable pieces.\n\nAn app is a tree of these components with a root component (conventionally named App) at the top. In JSX, components look like custom HTML tags: <Greeting />, <Badge />, <Sidebar />. Capitalizing their names is what distinguishes them from ordinary HTML tags.`,
      },
      {
        heading: "Mounting the app",
        body: `React does not own the whole page by magic: you hand it a DOM element and a root component. createRoot, imported from react-dom/client, attaches React to that element and renders your tree inside it.\n\nDevelopment builds also wrap your tree in StrictMode, which deliberately runs some of your code an extra time to surface impure side effects early. It is a development-only aid and does not change production behavior.`,
      },
    ],
    examples: [
      {
        title: "Your first component",
        description: "A root component rendering two instances of a child component.",
        language: "tsx",
        code: `function Greeting() {
  return <h1>Hello, React!</h1>;
}

export default function App() {
  return (
    <main>
      <Greeting />
      <Greeting />
    </main>
  );
}`,
        lineNotes: [
          {
            code: "function Greeting()",
            note: "A component is a plain function. Capitalizing its name is what lets JSX tell it apart from HTML tags.",
          },
          {
            code: "return <h1>Hello, React!</h1>;",
            note: "This JSX describes one piece of UI for the current data. No HTML string is involved.",
          },
          {
            code: "<Greeting />",
            note: "Using a component inside another component renders its output; the same component can be reused as often as you like.",
          },
          {
            code: "export default function App()",
            note: "By convention the root component is called App, and the entry file imports and renders it.",
          },
        ],
      },
      {
        title: "Mounting with createRoot",
        description: "The entry file connects React to a DOM element exactly once.",
        language: "tsx",
        code: `import { createRoot } from "react-dom/client";
import App from "./App";

const element = document.getElementById("root");
if (!element) throw new Error("Missing #root element");

createRoot(element).render(<App />);`,
      },
    ],
    mistakes: [
      {
        wrong: "Naming a component \"greeting\" and rendering <greeting />.",
        why: "JSX treats lowercase tags as plain HTML elements, so React renders an unknown tag instead of calling your function.",
        fix: "Start component names with a capital letter and use them as <Greeting />.",
      },
      {
        wrong: "Returning <h1>Hi</h1><p>There</p> — two siblings straight from a component.",
        why: "A component must return a single root element; two siblings are a JSX syntax error.",
        fix: "Wrap them in one parent element, or in an empty fragment <>...</>.",
      },
      {
        wrong: "Updating the screen manually with document.querySelector(\"#label\").textContent = \"New value\".",
        why: "React owns the DOM inside its root; manual edits are invisible to React and get overwritten at the next render.",
        fix: "Change state or props instead, and let React re-render the affected part of the tree.",
      },
    ],
    quiz: [
      {
        question: "What is a React component, in one sentence?",
        options: [
          "A class that extends the browser's HTMLElement",
          "A function that receives data and returns JSX describing UI",
          "A CSS rule that styles a section of the page",
        ],
        answerIndex: 1,
        explanation:
          "Components are functions that take props and return elements; React turns those elements into efficient DOM updates.",
      },
      {
        question: "When the data behind a screen changes, what is your job as the developer?",
        options: [
          "Call DOM APIs to update each affected element yourself",
          "Reload the page so the server sends fresh HTML",
          "Update the data and let React re-render the affected components",
        ],
        answerIndex: 2,
        explanation:
          "Declarative UI means you change the data; React re-runs the relevant component functions and patches the DOM.",
      },
    ],
    exercises: [
      {
        title: "Greeting twice",
        prompt: "Write a Greeting component that renders <h3>Hello, React!</h3>, then render it twice inside App.",
        language: "tsx",
        starterCode: `export default function App() {
  return (
    <main>

    </main>
  );
}`,
        hint: "Define Greeting above App, then use <Greeting /> twice in the JSX.",
      },
      {
        title: "Footer badge",
        prompt: "Create a Badge component that renders a span with the text \"Powered by React\", and render it inside a footer element in App.",
        language: "tsx",
        hint: "Return <span>Powered by React</span> from Badge, then place <Badge /> inside <footer>.",
      },
    ],
  },
  {
    slug: "jsx-and-components",
    title: "JSX and Components",
    minutes: 12,
    objectives: [
      "Read and write valid JSX confidently",
      "Apply the core syntax rules: one root, className, closed tags",
      "Inject dynamic values into markup with braces",
    ],
    sections: [
      {
        heading: "JSX is JavaScript, made readable",
        body: `JSX looks like HTML, but it is JavaScript. Your bundler compiles it into function calls that create plain objects called elements, which React reads to build the real DOM.\n\nBecause it is JavaScript, JSX follows JavaScript rules: the result can be stored in variables, passed to functions, returned in conditionals, and embedded anywhere an expression is allowed. That flexibility is what makes React components so compositional.`,
      },
      {
        heading: "The syntax rules",
        body: `A component returns **one parent element**. If you need several siblings, wrap them in a <div> or an empty fragment <>...</>. This keeps the output predictable: one element per return.\n\nTwo rules trip up beginners constantly. Use className instead of class — JSX matches the DOM property, and class is a reserved JavaScript word. And close every tag: void elements like <img />, <input /> and <br /> must be self-closed.`,
      },
      {
        heading: "Expressions, not statements",
        body: `Inside braces you can put any JavaScript **expression**: a variable, a function call, arithmetic, a ternary. Statements like if or for are not allowed inside braces — move the logic above the return, or express it as a ternary or with the && operator.\n\nBraces are also where TypeScript earns its keep: prop types, state types and member access are all checked while your code compiles, before anything reaches the browser.`,
      },
    ],
    examples: [
      {
        title: "Mixing markup and expressions",
        language: "tsx",
        code: `function Profile({ name, role }: { name: string; role: string }) {
  return (
    <div>
      <h2>{name}</h2>
      <p className="muted">{role}</p>
      <p>Total: \${25 + 10}</p>
    </div>
  );
}`,
        lineNotes: [
          {
            code: "return (",
            note: "The three siblings share one parent <div>, satisfying the single-root rule.",
          },
          {
            code: "<h2>{name}</h2>",
            note: "Braces inject the value of the props variable into the heading.",
          },
          {
            code: "className=\"muted\"",
            note: "CSS class names use className in JSX, matching the DOM property name.",
          },
          {
            code: "Total: ${25 + 10}",
            note: "Any expression works in braces — this renders as $35. Keep the dollar sign outside the braces for literal text.",
          },
        ],
      },
      {
        title: "Computed markup before return",
        description: "Build pieces of UI as variables, then place them in the tree.",
        language: "tsx",
        code: `function isEven(n: number) {
  return n % 2 === 0;
}

function NumberBadge({ value }: { value: number }) {
  const label = isEven(value) ? "even" : "odd";
  const badge = <span className="pill">{label}</span>;

  return (
    <p>
      The number {value} is {badge}
    </p>
  );
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Writing <div class=\"card\"> in JSX.",
        why: "class is a reserved JavaScript keyword; JSX uses the DOM property name instead.",
        fix: "Use className=\"card\".",
      },
      {
        wrong: "Putting an if statement directly inside JSX braces.",
        why: "Braces accept expressions, and if is a statement — the compiler rejects it.",
        fix: "Use a ternary (cond ? a : b), the && operator, or compute the value above the return.",
      },
      {
        wrong: "Leaving a void tag unclosed, like <img src=\"...\">.",
        why: "Every JSX element must be closed or self-closed, otherwise the compiler stops with an unterminated tag error.",
        fix: "Self-close void elements: <img src=\"...\" />.",
      },
    ],
    quiz: [
      {
        question: "Which of these is valid inside JSX braces?",
        options: [
          "user.name.toUpperCase()",
          "if (ready) return <p>Hi</p>",
          "let x = 42",
        ],
        answerIndex: 0,
        explanation:
          "Braces hold expressions. Declarations like let and control flow like if are statements and must live outside the JSX.",
      },
      {
        question: "How do you render three sibling tags from one component?",
        options: [
          "Return them directly — JSX allows any number of roots",
          "Wrap them in one parent element or a fragment",
          "Split them into three separate components that each render one tag",
        ],
        answerIndex: 1,
        explanation:
          "One parent per return — a real element or an empty fragment <>...</> both work.",
      },
    ],
    exercises: [
      {
        title: "Two-line footer",
        prompt: "Build a Footer component that renders a footer containing an h2 that says \"Thanks for visiting\" and a p showing a year stored in a const.",
        language: "tsx",
        starterCode: `function Footer() {
  return (
    <footer>
      {/* add the h2 and the p here */}
    </footer>
  );
}`,
        hint: "One root element: nest both tags inside <footer>.",
      },
      {
        title: "Computed price",
        prompt: "Render the text \"Total: $84\" using braces to compute the number as 70 + 14.",
        language: "tsx",
        hint: "Put only (70 + 14) inside the braces and keep the dollar sign before them as plain text.",
      },
    ],
  },
  {
    slug: "props",
    title: "Props",
    minutes: 12,
    objectives: [
      "Pass data into components with props",
      "Type and destructure props safely",
      "Use children for composition",
    ],
    sections: [
      {
        heading: "Props are the component's parameters",
        body: `Props let a parent pass data down into a child: <Greeting name="Ada" /> hands the string "Ada" to Greeting as props.name. A component without props is a function without parameters — legal, but far less reusable.\n\nProps flow **down** only, and a component must treat them as read-only. If a value has to change, the change belongs to the state of the component that owns the data — you will meet state in the next lessons.`,
      },
      {
        heading: "Typing props",
        body: `With TypeScript, describe a component's props with a type or interface and annotate the parameter. Optional props get a ? and usually a default value written with the = operator right in the destructuring.\n\nDestructuring in the parameter list keeps the body honest about what the component actually uses: ({ name, role }: Props). TypeScript flags unknown or missing props at every call site, so a renamed prop becomes a compile error instead of a silent undefined.`,
      },
      {
        heading: "children: the prop you get for free",
        body: `Whatever you nest between a component's opening and closing tags arrives as the children prop: <Card><p>Hi</p></Card> gives Card a children value of one paragraph. children can be elements, strings, arrays — even other components.\n\nThis is React's main composition tool. Layouts, panels, dialogs and lists all use it to accept arbitrary content while owning only the frame around it.`,
      },
    ],
    examples: [
      {
        title: "A typed Badge component",
        language: "tsx",
        code: `import type { ReactNode } from "react";

type BadgeProps = {
  label: string;
  tone?: "info" | "warn";
  children?: ReactNode;
};

export function Badge({ label, tone = "info", children }: BadgeProps) {
  return (
    <span className={\`badge badge-\${tone}\`}>
      {label}
      {children}
    </span>
  );
}`,
        lineNotes: [
          {
            code: "type BadgeProps = {",
            note: "One type describes everything the component accepts; tone uses the ? modifier because it is optional.",
          },
          {
            code: "tone = \"info\"",
            note: "A default value applies whenever the parent omits the prop.",
          },
          {
            code: "className={`badge badge-${tone}`}",
            note: "String interpolation builds the CSS class; the whole template sits inside braces because it is an expression.",
          },
          {
            code: "{children}",
            note: "Nested content arrives here — Badge renders its own label first, then whatever was passed inside its tags.",
          },
        ],
      },
      {
        title: "Props at the call site",
        description: "Two ways to call the same component.",
        language: "tsx",
        code: `import { Badge } from "./Badge";

export default function App() {
  return (
    <div>
      <Badge label="New" />
      <Badge label="Deprecated" tone="warn">
        <em>will be removed</em>
      </Badge>
    </div>
  );
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Mutating a prop, e.g. props.items.sort().",
        why: "Props are read-only. Sorting the original array edits the parent's data behind its back and can skip re-renders.",
        fix: "Copy first when you need a derived order: [...props.items].sort((a, b) => a - b).",
      },
      {
        wrong: "Reading props.user while the parent passed userName.",
        why: "The prop is undefined at runtime; TypeScript flags the unknown attribute, so take those red squiggles seriously.",
        fix: "Keep prop names identical at the definition and at every call site.",
      },
      {
        wrong: "Accepting children but never rendering {children}.",
        why: "The nested elements disappear silently — the component only renders the JSX it wrote itself.",
        fix: "Place {children} exactly where the nested content should appear.",
      },
    ],
    quiz: [
      {
        question: "Can a component change its own props?",
        options: [
          "Yes — props behave exactly like state",
          "No — props flow down from the parent and must be treated as read-only",
          "Only inside useEffect",
        ],
        answerIndex: 1,
        explanation:
          "Data that changes over time lives in state owned by a component; props are inputs that the parent controls.",
      },
      {
        question: "What is children?",
        options: [
          "A reserved CSS class name",
          "The special prop holding whatever is nested between a component's tags",
          "A built-in React component for nested layouts",
        ],
        answerIndex: 1,
        explanation:
          "children is an ordinary prop filled in automatically — the main tool for composing components.",
      },
    ],
    exercises: [
      {
        title: "Article tag",
        prompt: "Write an ArticleTag component that takes a tag prop (a string) and renders it in a span prefixed with a hash sign. Render <ArticleTag tag=\"react\" /> inside App.",
        language: "tsx",
        starterCode: `function ArticleTag({ tag }: { tag: string }) {
  return <span>TODO</span>;
}`,
        hint: "Inside the span, write #{tag} so the hash is plain text and the prop is injected in braces.",
      },
      {
        title: "Card with children",
        prompt: "Extend the Card component below so the nested content shows up under the title.",
        language: "tsx",
        starterCode: `import type { ReactNode } from "react";

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      {/* render children below the title */}
    </section>
  );
}`,
        hint: "Output {children} right after the h3.",
      },
    ],
  },
  {
    slug: "state-with-usestate",
    title: "State with useState",
    minutes: 14,
    objectives: [
      "Add state to a component with useState",
      "Update state through setters, including functional updates",
      "Replace arrays and objects instead of mutating them",
      "Recognize when a value should be computed rather than stored",
    ],
    sections: [
      {
        heading: "What state is",
        body: `State is data a component remembers between renders: the current input value, an open/closed flag, a loaded list. Calling useState returns a pair — the current value and a setter function — and the initial value you pass is used only on the first render.\n\nCalling the setter schedules a re-render with a new value. React state lives in the browser's memory for as long as the component is mounted; close the tab and it is gone, so long-term persistence is a separate problem with separate tools.`,
      },
      {
        heading: "Updating state correctly",
        body: `Never assign to the state variable directly — always go through the setter. If several setters fire inside one event handler, React batches them into a single re-render.\n\nWhen the next value depends on the previous one, prefer the functional updater form: setCount((current) => current + 1). It always receives the freshest queued value, which matters when updates stack up inside one render cycle.`,
      },
      {
        heading: "State you cannot edit in place",
        body: `Arrays and objects in state must be **replaced**, not mutated. React compares by reference: push a todo into the same array and setter will see the unchanged reference and may skip the update entirely.\n\nInstead, build a new array or object and pass that to the setter: setTodos([...todos, next]) or setUser({ ...user, name: nextName }). It feels wasteful at first; it is what makes React's diffing fast and reliable.`,
      },
    ],
    examples: [
      {
        title: "A minimal counter",
        language: "tsx",
        code: `import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`,
        lineNotes: [
          {
            code: "import { useState } from \"react\";",
            note: "useState is a hook — a function you call at the top level of a component.",
          },
          {
            code: "const [count, setCount] = useState(0);",
            note: "Returns exactly two values: the current state and its setter. The 0 is the initial value.",
          },
          {
            code: "setCount(count + 1)",
            note: "Schedules a re-render with the new value; never assign to count directly.",
          },
          {
            code: "<p>Count: {count}</p>",
            note: "React re-runs this function with fresh state after every update.",
          },
        ],
      },
      {
        title: "Adding to a list, immutably",
        language: "tsx",
        code: `import { useState } from "react";

type Todo = { id: number; text: string };

let nextId = 1;

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  function addTodo() {
    if (text.trim() === "") return;
    setTodos((current) => [...current, { id: nextId++, text }]);
    setText("");
  }

  return (
    <div>
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What needs doing?"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Doing todos.push(todo) and then setTodos(todos).",
        why: "You hand React the same array reference, so it may skip re-rendering; state must be replaced, not edited in place.",
        fix: "Create a new array: setTodos([...todos, todo]).",
      },
      {
        wrong: "Storing a value you can compute from existing state, like the number of completed todos.",
        why: "Derived state drifts out of sync with its source the moment one update is missed.",
        fix: "Compute it during render: const doneCount = todos.filter((t) => t.done).length;",
      },
      {
        wrong: "Calling setCount(count + 1) twice in one handler and expecting count to grow by two.",
        why: "Both updates close over the same count from this render, so they schedule the same value twice.",
        fix: "Use the functional updater setCount((c) => c + 1); it always builds on the freshest queued value.",
      },
    ],
    quiz: [
      {
        question: "What does setCount((c) => c + 1) do that setCount(count + 1) does not?",
        options: [
          "Runs noticeably faster",
          "Always builds on the latest queued value, even with batched updates",
          "Persists the count between page reloads",
        ],
        answerIndex: 1,
        explanation:
          "The updater receives the freshest state React has scheduled; a direct value can be stale inside the same render.",
      },
      {
        question: "When does useState's initial value actually apply?",
        options: [
          "On every render",
          "Only on the first render of that component instance",
          "Every time the setter runs",
        ],
        answerIndex: 1,
        explanation:
          "After the first render the initial value is ignored; the component keeps whatever state it already has.",
      },
    ],
    exercises: [
      {
        title: "Step tracker",
        prompt: "Build a component with two buttons — one adds a step, the other resets to zero — and show the current count.",
        language: "tsx",
        starterCode: `import { useState } from "react";

export function StepCounter() {
  const [steps, setSteps] = useState(0);

  // render the count and the two buttons here
  return null;
}`,
        hint: "Reset with setSteps(0); increment with setSteps((s) => s + 1).",
      },
      {
        title: "Colors list",
        prompt: "Keep a string-array state starting as [\"red\"]. Add a button that appends \"blue\" without mutating the array, and render each color as a list item with a stable key.",
        language: "tsx",
        starterCode: `import { useState } from "react";

export function Colors() {
  const [colors, setColors] = useState(["red"]);
  // render a button and a ul here
  return null;
}`,
        hint: "Spread the old array into a new one when adding: setColors([...colors, \"blue\"]).",
      },
    ],
  },
  {
    slug: "handling-events",
    title: "Handling Events",
    minutes: 10,
    objectives: [
      "Wire up onClick, onChange and onSubmit handlers",
      "Understand the event object and preventDefault",
      "Build controlled inputs backed by state",
    ],
    sections: [
      {
        heading: "React events in a nutshell",
        body: `React gives DOM events camelCase attribute names: onClick, onChange, onKeyDown, onSubmit. Their value is a function — the handler — which React calls with a synthetic event object containing the browser information you expect.\n\nA button click, a form submit, a key press: all follow the same shape. Visit the form and keyboard events once you are comfortable; click and change carry most real-world UIs.`,
      },
      {
        heading: "The event object",
        body: `Handlers receive an event you can inspect and act on. The method you will use most is e.preventDefault(), which stops the browser's default behavior for that event.\n\nThe classic case is forms: a submit would normally reload the page, wiping any state your app holds in memory. Calling preventDefault keeps the page alive so React can react to the submission instead of the browser.`,
      },
      {
        heading: "Controlled inputs",
        body: `An input is *controlled* when its value comes from state and every change writes back through onChange. The state is the single source of truth; the input is just its visible reflection.\n\nThis bidirectional wiring looks verbose at first, but it gives you full control: you can validate, transform, clear or initialize the input value from JavaScript at any moment.`,
      },
    ],
    examples: [
      {
        title: "A controlled form",
        language: "tsx",
        code: `import { useState } from "react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [signedUp, setSignedUp] = useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSignedUp(email);
        setEmail("");
      }}
    >
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      <button>Subscribe</button>
      {signedUp && <p>Signed up: {signedUp}</p>}
    </form>
  );
}`,
        lineNotes: [
          {
            code: "onSubmit={(e) => {",
            note: "React handlers get a synthetic event object with the browser APIs you already know.",
          },
          {
            code: "e.preventDefault();",
            note: "Without this, the browser reloads the page and all in-memory state disappears.",
          },
          {
            code: "onChange={(e) => setEmail(e.target.value)}",
            note: "Pairing value with onChange makes this a controlled input driven by React state.",
          },
          {
            code: "setEmail(\"\")",
            note: "Clearing the state re-renders the input with an empty value.",
          },
        ],
      },
      {
        title: "Typing a handler",
        description: "Extract handlers into named, explicitly typed functions.",
        language: "tsx",
        code: `import type { FormEvent } from "react";

function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log(Object.fromEntries(data));
}

export function CheckoutForm() {
  return (
    <form onSubmit={handleSubmit}>
      <input name="coupon" />
      <button>Apply</button>
    </form>
  );
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Calling the handler immediately: onClick={handleClick()}.",
        why: "The parentheses invoke the function during render instead of waiting for a click.",
        fix: "Pass the reference onClick={handleClick}, or an arrow when arguments are needed: onClick={() => handleClick(id)}.",
      },
      {
        wrong: "Submitting a form without e.preventDefault().",
        why: "The browser performs its default full-page navigation, losing every piece of state your app was holding in memory.",
        fix: "Call event.preventDefault() at the top of the submit handler.",
      },
      {
        wrong: "Reading an input's text with document.getElementById(\"email\").value.",
        why: "That bypasses React's data flow and breaks the link between your UI and your state.",
        fix: "Make the input controlled and read the state variable instead.",
      },
    ],
    quiz: [
      {
        question: "How do you pass an argument into an onClick handler?",
        options: [
          "onClick={handleClick(id)} — the call happens when the user clicks",
          "onClick={() => handleClick(id)}",
          "onClick={handleClick.call(id)}",
        ],
        answerIndex: 1,
        explanation:
          "The arrow defers the call until the click. Writing handleClick(id) would run during render.",
      },
      {
        question: "What makes an input 'controlled'?",
        options: [
          "It sets value from state and updates that state in onChange",
          "It uses the defaultValue attribute",
          "It is wrapped in a form element",
        ],
        answerIndex: 0,
        explanation:
          "A controlled input has React state as its source of truth, with onChange keeping that state current.",
      },
    ],
    exercises: [
      {
        title: "Live preview",
        prompt: "Build a form with a controlled name input, and show 'Hello, <name>!' underneath as the user types.",
        language: "tsx",
        starterCode: `import { useState } from "react";

export function HelloForm() {
  const [name, setName] = useState("");

  return null;
}`,
        hint: "Render {name} inside a paragraph to preview the value live.",
      },
      {
        title: "Stop the reset",
        prompt: "The form below reloads the page on submit. Fix it so submitting appends the item instead.",
        language: "tsx",
        starterCode: `import { useState } from "react";

export function ItemForm() {
  const [items, setItems] = useState<string[]>([]);

  return (
    <form
      onSubmit={() => setItems([...items, "New item"])}
    >
      <button>Add item</button>
      <p>{items.length} items so far</p>
    </form>
  );
}`,
        hint: "Give the handler an event parameter and call e.preventDefault() first.",
      },
    ],
  },
  {
    slug: "lists-and-keys",
    title: "Lists and Keys",
    minutes: 10,
    objectives: [
      "Render collections with map",
      "Choose stable keys and know why they matter",
      "Handle the empty-list case explicitly",
    ],
    sections: [
      {
        heading: "Rendering a collection",
        body: `To turn data into UI, call .map() over your array and return JSX for each item. The result is an array of elements that React renders inline — that is the whole trick.\n\nThe array you map is usually state or props. Filter and sort freely before mapping: expressions inside braces can chain any array methods you like.`,
      },
      {
        heading: "What keys are for",
        body: `Each item in a mapped array needs a **key** — a short string that tells React which item is which between renders. When the list changes, React matches old and new elements by key instead of by position, so it can move, add or remove just the right DOM nodes.\n\nKeys must be unique among siblings and *stable*: the same item must get the same key on every render. An id that comes with the data is ideal. Content that changes, like a name, fails when the user renames something; random values fail every render.`,
      },
      {
        heading: "The empty list",
        body: `An empty array maps to an empty array of elements — the page renders nothing, which is often poor UX. Treat "no items yet" as a real UI state with its own message, and consider a similar branch for loading or error data when the list comes from a fetch.\n\nDeciding where that check lives — a guard return before the JSX, or an inline count check — is exactly what the next lesson covers.`,
      },
    ],
    examples: [
      {
        title: "A scoreboard",
        language: "tsx",
        code: `type Player = { id: number; name: string; score: number };

export function Scoreboard({ players }: { players: Player[] }) {
  const ranked = [...players].sort((a, b) => b.score - a.score);

  return (
    <ul>
      {ranked.map((player) => (
        <li key={player.id}>
          {player.name}: {player.score}
        </li>
      ))}
    </ul>
  );
}`,
        lineNotes: [
          {
            code: "const ranked = [...players]",
            note: "Sorting a copy leaves the props array untouched — props must not be mutated.",
          },
          {
            code: "ranked.map((player) => (",
            note: "map returns one element per item; React renders them inside the ul in order.",
          },
          {
            code: "key={player.id}",
            note: "A stable id tells React which list entry is which between renders.",
          },
        ],
      },
      {
        title: "Filtering and the empty case",
        language: "tsx",
        code: `export function Winners({ players }: { players: Player[] }) {
  const winners = players.filter((player) => player.score > 100);

  if (winners.length === 0) {
    return <p>No one has scored over 100 yet.</p>;
  }

  return (
    <ul>
      {winners.map((player) => (
        <li key={player.id}>{player.name} — {player.score}</li>
      ))}
    </ul>
  );
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Using the array index as the key on a list that can be reordered or filtered.",
        why: "Once order changes, index keys no longer identify the same items, so React can move or reconcile the wrong element state.",
        fix: "Give each item a stable id that travels with the data and use it as the key.",
      },
      {
        wrong: "Generating keys on the fly with Math.random() during render.",
        why: "A new key every render makes React unmount and remount every item — focus, input state and animations reset.",
        fix: "Use an id stored alongside the item — generate once when the item is created, never again.",
      },
      {
        wrong: "Writing an arrow with a block body inside map and forgetting return.",
        why: "Without return, the arrow yields undefined and nothing renders — a silent blank list.",
        fix: "Either write the element as an implicit return, e.g. map(p => <li ...>), or add an explicit return in the block.",
      },
    ],
    quiz: [
      {
        question: "Why does React need keys on list items?",
        options: [
          "To sort the items automatically",
          "To identify which items changed, moved, or were added between renders",
          "To make the markup valid HTML",
        ],
        answerIndex: 1,
        explanation:
          "Keys are React's identity system for sibling elements; stable keys let it update the DOM surgically.",
      },
      {
        question: "Which choice is the safest key for a reorderable list?",
        options: [
          "The array index",
          "A stable id that comes with the data",
          "The item's name",
        ],
        answerIndex: 1,
        explanation:
          "Data-driven ids survive reordering, filtering and content edits; indexes and names do not.",
      },
    ],
    exercises: [
      {
        title: "Grocery list",
        prompt: "Render the products array below as a ul of li elements, each keyed by id.",
        language: "tsx",
        starterCode: `export function Groceries() {
  const products = [
    { id: "p1", name: "Coffee" },
    { id: "p2", name: "Oat milk" },
  ];

  // render the ul here
  return null;
}`,
        hint: "Map over products and put key={product.id} on the li.",
      },
      {
        title: "Empty state",
        prompt: "Extend your grocery list so that an empty array renders the message \"Nothing on the list yet.\" instead of an empty ul.",
        language: "tsx",
        hint: "Check products.length === 0 and return the message before the JSX.",
      },
    ],
  },
  {
    slug: "conditional-rendering",
    title: "Conditional Rendering",
    minutes: 10,
    objectives: [
      "Pick between guard clauses and inline conditionals",
      "Use && and ternaries safely inside JSX",
      "Render nothing with null when there is nothing to show",
    ],
    sections: [
      {
        heading: "The two shapes of conditional UI",
        body: `React renders plain JavaScript, so you have two idiomatic patterns. **Guard clauses** — early returns at the top of the component — handle distinct whole-banner states like loading, error or empty, and keep each state a simple return.\n\n**Inline conditionals** — a ternary or && inside the JSX — handle small fragments inside an otherwise stable layout, like a blinking dot on an avatar or an optional caption. Both are everyday React; choose by scale.`,
      },
      {
        heading: "&& and ternaries, used carefully",
        body: `cond && <Extra /> renders Extra only when cond is truthy. It works because a falsy left side short-circuits to the left value — which is brilliant with true/false and dangerous with numbers: 0 && <Extra /> renders the digit 0 onto the page.\n\nUse a ternary when both branches matter, and coerce numeric checks explicitly: {count > 0 && ...}. If neither branch renders anything, returning null from a component is perfectly valid React and keeps elements out of the DOM entirely.`,
      },
    ],
    examples: [
      {
        title: "Guarding each state",
        language: "tsx",
        code: `type Props = {
  isLoading: boolean;
  error?: string;
  items?: string[];
};

export function Results({ isLoading, error, items }: Props) {
  if (isLoading) return <p>Loading results…</p>;
  if (error) return <p role="alert">Something went wrong: {error}</p>;
  if (!items || items.length === 0) return <p>Nothing to show yet.</p>;

  return <p>{items.join(", ")}</p>;
}`,
        lineNotes: [
          {
            code: "if (isLoading) return <p>Loading results…</p>;",
            note: "One guard per UI state, ordered from cheapest to the happy path.",
          },
          {
            code: "if (error) return <p role=\"alert\">",
            note: "Failures are a state of the UI, not an exception thrown at the user.",
          },
          {
            code: "if (!items || items.length === 0)",
            note: "The empty case is explicit instead of rendering a blank page.",
          },
          {
            code: "return <p>{items.join(\", \")}</p>;",
            note: "By the time this runs, TypeScript knows items is defined.",
          },
        ],
      },
      {
        title: "Inline fragments",
        language: "tsx",
        code: `export function AuctionCard({ bids, closed }: { bids: number; closed: boolean }) {
  return (
    <div className="card">
      <span className="chip">{closed ? "Closed" : "Open"}</span>
      {bids > 0 && <small>{bids} bids so far</small>}
    </div>
  );
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Writing {count && <UnreadBadge count={count} />} when count starts at 0.",
        why: "0 is falsy, so the left side wins — but 0 is also renderable, and the digit appears in your UI.",
        fix: "Make the check boolean: {count > 0 && <UnreadBadge count={count} />}.",
      },
      {
        wrong: "Trying to fit an if statement inside braces: {if (done) <p>…</p>}.",
        why: "Braces accept expressions, and if is a statement — the compiler rejects it.",
        fix: "Return early above the JSX, or use a ternary done ? <p>Done</p> : <p>Working…</p>.",
      },
      {
        wrong: "Hiding big sections by always rendering them with a display:none style.",
        why: "The markup still renders and ships; every child component still runs, costing memory and work.",
        fix: "Return null — or skip rendering — when the content genuinely should not exist.",
      },
    ],
    quiz: [
      {
        question: "What does {zero && <Tag />} render when zero is the number 0?",
        options: [
          "Nothing at all",
          "The digit 0 as text",
          "The Tag component",
        ],
        answerIndex: 1,
        explanation:
          "0 && expr evaluates to 0, and React renders numbers. Guard with zero > 0 instead.",
      },
      {
        question: "Which construct cannot appear directly inside JSX braces?",
        options: [
          "A ternary expression",
          "An if statement",
          "A function call",
        ],
        answerIndex: 1,
        explanation:
          "if is a statement. Statements belong above the return; braces want expressions.",
      },
    ],
    exercises: [
      {
        title: "Three-state banner",
        prompt: "Use guard clauses in the component below: return different paragraphs for loading, error, and the happy path.",
        language: "tsx",
        starterCode: `export function Banner({
  isLoading,
  error,
}: {
  isLoading: boolean;
  error?: string;
}) {
  return null;
}`,
        hint: "Three early returns: isLoading first, then error, then the default content.",
      },
      {
        title: "Save the badge",
        prompt: "The component below shows a stray 0 when there are no notifications. Fix it so nothing renders in that case.",
        language: "tsx",
        starterCode: `export function Alerts({ count }: { count: number }) {
  return (
    <p>
      Inbox {count && <span className="badge">{count}</span>}
    </p>
  );
}`,
        hint: "Compare with zero explicitly: count > 0 &&.",
      },
    ],
  },
  {
    slug: "effects-with-useeffect",
    title: "Effects with useEffect",
    minutes: 14,
    objectives: [
      "Decide when an effect is the right tool",
      "Control effect timing with the dependency array",
      "Clean up subscriptions, timers and fetches",
    ],
    sections: [
      {
        heading: "What effects are for",
        body: `Rendering should be pure: same inputs, same JSX, no side effects. But real apps need side effects — starting timers, subscribing to sockets, syncing with browser APIs, fetching data that is not in state. useEffect is React's sanctioned place for that work.\n\nThe mental model: effects *synchronize your component with systems outside React*. After committing your UI, React runs the effect so the outside world agrees with what you just rendered.`,
      },
      {
        heading: "The dependency array",
        body: `The second argument decides when the effect re-runs. With an empty array [] it runs once after the mount render. With values listed, it re-runs whenever any of them changes between renders. With no array at all, it runs after every single render — rarely what you want.\n\nList every reactive value the effect reads (state, props). React compares the values you list, so primitives and references work naturally, while objects freshly created each render always look changed — restructure your state if you fight this.`,
      },
      {
        heading: "Cleaning up",
        body: `An effect can return a cleanup function. React calls it before the effect re-runs and when the component unmounts — the right place to clearInterval, unsubscribe, or ignore a pending fetch so stale responses cannot update an unmounted component.\n\nA useful rule: if you started something that keeps living on (timer, listener, request), return a cleanup that stops it. StrictMode's double-invocation in development makes missing cleanups obvious fast.`,
      },
    ],
    examples: [
      {
        title: "Fetching data in an effect",
        language: "tsx",
        code: `import { useEffect, useState } from "react";

type User = { id: number; name: string };

export function RandomUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;

    fetch("https://api.example.com/user")
      .then((res) => res.json())
      .then((data: User) => {
        if (active) setUser(data);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!user) return <p>Loading…</p>;
  return <p>{user.name}</p>;
}`,
        lineNotes: [
          {
            code: "const [user, setUser] = useState<User | null>(null);",
            note: "Start with null to represent 'not loaded yet', refined to a User after the fetch.",
          },
          {
            code: "useEffect(() => {",
            note: "The effect runs once after the first render because the dependency array is empty.",
          },
          {
            code: "let active = true;",
            note: "A local flag lets the cleanup cancel late responses.",
          },
          {
            code: "return () => { active = false; };",
            note: "Cleanup runs on unmount, so a slow response cannot update a gone component.",
          },
          {
            code: "if (!user) return <p>Loading…</p>;",
            note: "The render function handles the not-yet-loaded state explicitly.",
          },
        ],
      },
      {
        title: "A self-cleaning timer",
        language: "tsx",
        code: `import { useEffect, useState } from "react";

export function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return <time>{now.toLocaleTimeString()}</time>;
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Starting setInterval in an effect without clearing it.",
        why: "The timer keeps firing after unmount and keeps calling setState on a component that no longer exists.",
        fix: "Return () => clearInterval(id) from the effect.",
      },
      {
        wrong: "Omitting the dependency array on a data-fetching effect.",
        why: "Without an array the effect runs after every render — and setting state triggers another render, so requests pile up forever.",
        fix: "Pass the dependency array: [] to run once after mount, or list the values the fetch depends on.",
      },
      {
        wrong: "Using an effect to compute something from existing state, like filtering todos on every change.",
        why: "Effects are for synchronizing with the outside world, not for derivations — this adds a delayed duplicate of logic that belongs in render.",
        fix: "Compute derived values inline during render: const done = todos.filter((t) => t.done).length;",
      },
    ],
    quiz: [
      {
        question: "When does the cleanup function of an effect run?",
        options: [
          "Only when the tab is closed",
          "Before the effect re-runs and when the component unmounts",
          "Immediately after the first render",
        ],
        answerIndex: 1,
        explanation:
          "Cleanup is React's way of making each effect's footprint match its latest run.",
      },
      {
        question: "An effect with an empty dependency array ([]) runs…",
        options: [
          "once, after the component's first render",
          "after every render",
          "never",
        ],
        answerIndex: 0,
        explanation:
          "Empty deps mean 'synchronize once, then keep any subscription alive until cleanup'.",
      },
    ],
    exercises: [
      {
        title: "Cancel-safe loader",
        prompt: "Write a component that fetches a greeting from https://api.example.com/greeting on mount, shows 'Loading…' meanwhile, and ignores the response if the component has unmounted.",
        language: "tsx",
        hint: "Copy the active-flag pattern: set it false in the cleanup, check it before setState.",
      },
      {
        title: "Elapsed seconds",
        prompt: "Build a component that shows how many seconds have passed since it mounted, using an interval — and make sure the interval is cleared on unmount.",
        language: "tsx",
        starterCode: `import { useEffect, useState } from "react";

export function Elapsed() {
  const [seconds, setSeconds] = useState(0);

  // start a 1-second interval here

  return <p>{seconds}s</p>;
}`,
        hint: "setSeconds((s) => s + 1) inside the interval, with clearInterval returned as cleanup.",
      },
    ],
  },
  {
    slug: "lifting-state-up",
    title: "Lifting State Up",
    minutes: 12,
    objectives: [
      "Identify state shared by more than one component",
      "Move that state to the closest common parent",
      "Wire controlled components with props and callbacks",
    ],
    sections: [
      {
        heading: "One source of truth",
        body: `When two components need the same data, you have two options: duplicate it, or keep it in **one place**. Duplicated state drifts — one copy lags, another forgets. The React answer is lifting: move the state up to the closest common parent and pass it down as props.\n\nWith a single owner, every consumer derives its view from the same value, so they can never disagree. The parent sets state once and the whole branch re-renders in sync.`,
      },
      {
        heading: "Controls become controlled",
        body: `A child that receives its value via props and reports changes via a callback prop is a *controlled* component. The text in an input, the active tab, the currently open accordion panel — all become projections of the parent's state.\n\nCallbacks flow **up**, data flows **down**. The child never edits props directly; it calls something like onChange(nextValue), and the parent decides what the new state is.`,
      },
      {
        heading: "Don't lift everything",
        body: `State that only one component cares about should stay local — the hover state of a button does not belong in the top-level App. Lift when data is genuinely shared or two components must stay consistent; keep it local otherwise.\n\nIf you ever find one branch of the tree needing state that is set in a distant sibling, that is the signal to find their closest common ancestor and lift there — not to thread everything through the root.`,
      },
    ],
    examples: [
      {
        title: "An accordion owned by its parent",
        language: "tsx",
        code: `import { useState } from "react";

type Section = { id: string; title: string; body: string };

export function Accordion({ sections }: { sections: Section[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      {sections.map((section) => (
        <section key={section.id}>
          <button onClick={() => setOpenId(openId === section.id ? null : section.id)}>
            {section.title}
          </button>
          {openId === section.id && <p>{section.body}</p>}
        </section>
      ))}
    </div>
  );
}`,
        lineNotes: [
          {
            code: "const [openId, setOpenId] = useState<string | null>(null);",
            note: "The one piece of state — which panel is open — lives in the parent because several children depend on it.",
          },
          {
            code: "onClick={() => setOpenId(...)}",
            note: "Children do not set state directly; they invoke the callback the parent passed down.",
          },
          {
            code: "openId === section.id && <p>{section.body}</p>",
            note: "Every panel derives its visibility from the single shared value, so only one can be open.",
          },
        ],
      },
      {
        title: "Two fields, one state",
        description: "The classic temperature converter: store only celsius, derive the rest.",
        language: "tsx",
        code: `import { useState } from "react";

const toF = (c: number) => c * 1.8 + 32;
const toC = (f: number) => (f - 32) / 1.8;

export function TemperatureConverter() {
  const [celsius, setCelsius] = useState("20");
  const fahrenheit = toF(Number(celsius)).toFixed(1);

  return (
    <div>
      <label>
        Celsius
        <input value={celsius} onChange={(e) => setCelsius(e.target.value)} />
      </label>
      <label>
        Fahrenheit
        <input value={fahrenheit} readOnly />
      </label>
    </div>
  );
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Storing the same value in state in two sibling components and syncing them manually.",
        why: "Two separate sources of truth drift apart the first time one update is missed.",
        fix: "Move the state to the closest common parent and pass it down as a prop.",
      },
      {
        wrong: "Keeping celsius AND fahrenheit both in state and syncing them with an effect.",
        why: "Derived values stored as state create update loops and rounding drift.",
        fix: "Store only the value the user edits; compute the other during render.",
      },
      {
        wrong: "Lifting every piece of state all the way into the root component.",
        why: "The whole tree re-renders on every keystroke, and App becomes an unreadable state hub.",
        fix: "Lift only state that is genuinely shared; leave local UI state where it lives.",
      },
    ],
    quiz: [
      {
        question: "When should you lift state up?",
        options: [
          "Whenever any component uses state",
          "When two sibling components need to stay in sync on the same data",
          "Only when a parent component already has other state",
        ],
        answerIndex: 1,
        explanation:
          "Shared state belongs in the closest common parent; purely local state stays local.",
      },
      {
        question: "In a controlled input, where is the source of truth for the text?",
        options: [
          "Inside the input DOM element",
          "In the parent's state, passed down as a prop",
          "In a ref that reads the DOM on demand",
        ],
        answerIndex: 1,
        explanation:
          "The parent owns the value; the input displays it and reports changes through its callback prop.",
      },
    ],
    exercises: [
      {
        title: "Synced tabs",
        prompt: "Create a parent Tabs component holding an 'active' state (string), a row of tab buttons, and a panel showing the active tab's content.",
        language: "tsx",
        starterCode: `import { useState } from "react";

const TABS = [
  { id: "posts", label: "Posts" },
  { id: "friends", label: "Friends" },
];

export function Tabs() {
  const [active, setActive] = useState("posts");

  // render one button per tab and a panel for the active tab
  return null;
}`,
        hint: "Style the active button by comparing each tab's id with the state.",
      },
      {
        title: "Live form summary",
        prompt: "Keep an email value in a parent component; give a child FormInput the value plus an onChange callback, and a sibling Summary component the email so it can show it live.",
        language: "tsx",
        hint: "The parent owns the state; both children are pure projections of it.",
      },
    ],
  },
  {
    slug: "context-and-custom-hooks",
    title: "Context and Custom Hooks",
    minutes: 15,
    objectives: [
      "Provide shared data across a tree with context",
      "Consume context safely through a custom hook",
      "Extract reusable logic into your own hooks",
    ],
    sections: [
      {
        heading: "What context is",
        body: `Props drill. When a value — a theme, a signed-in user, a language — is needed several levels down, passing it through every layer clutters components that do not care. Context lets a component provide a value and **any** descendant read it directly.\n\nContext is a channel, not a state manager: it carries whatever you put in it and re-renders consumers when that value changes. Fill it with fairly stable things like configuration, not high-frequency data.`,
      },
      {
        heading: "Creating and providing",
        body: `Create a context once at module scope with createContext(defaultValue). The default goes to consumers rendered with **no provider** above them — often null, with a guard in your hook.\n\nPlace the provider high enough to cover every consumer. In React 19 you can render the context itself as the provider: <ThemeContext value={theme}>. The classic <ThemeContext.Provider value={theme}> still works and remains everywhere in older code; both are fine.`,
      },
      {
        heading: "Custom hooks",
        body: `A custom hook is a plain function named with a leading "use" that calls other hooks and returns what your components need: const useTheme = () => useContext(ThemeContext). It is the cleanest way to hide context plumbing — and to enforce rules like "throw if there is no provider".\n\nExtract any repeated hook pattern the same way: useToggle, useDebouncedValue, useMediaQuery. Custom hooks obey the same rules as built-ins — call at the top level, only from components or other hooks, unconditionally.`,
      },
    ],
    examples: [
      {
        title: "A theme context",
        language: "tsx",
        code: `import { createContext, useContext, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type ThemeContextValue = { theme: Theme; setTheme: (t: Theme) => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme requires a ThemeProvider above");
  return context;
}`,
        lineNotes: [
          {
            code: "const ThemeContext = createContext<ThemeContextValue | null>(null);",
            note: "Created once at module scope; the null default lets the hook detect a missing provider.",
          },
          {
            code: "<ThemeContext value={{ theme, setTheme }}>",
            note: "React 19 lets the context itself act as the provider; consumers re-render when the value changes.",
          },
          {
            code: "export function useTheme() {",
            note: "A custom hook wraps useContext and adds safety — components never import the raw context.",
          },
          {
            code: "if (!context) throw new Error(...)",
            note: "Fail loudly in development instead of rendering with undefined data.",
          },
        ],
      },
      {
        title: "Extracting a toggle",
        language: "tsx",
        code: `import { useState } from "react";

function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((value) => !value);
  return [on, toggle] as const;
}

export function CookieBanner() {
  const [accepted] = useToggle();

  if (accepted) return null;

  return <p>We use cookies to remember… nothing, in this app.</p>;
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Calling useState inside an if block, so it only runs for some renders.",
        why: "Hooks are matched to their state by call order across renders; conditional calls corrupt that order.",
        fix: "Call hooks at the top level of the component, unconditionally.",
      },
      {
        wrong: "Naming a hook-like function toggleDriverState() without the use prefix.",
        why: "The prefix is how React and its lint rules recognize hooks and check their dependencies.",
        fix: "Rename it useDriverState() and call it only from components or other hooks.",
      },
      {
        wrong: "Calling createContext inside a component body.",
        why: "A fresh context object is created every render, so providers and consumers stop matching up.",
        fix: "Create contexts once at module scope; render the provider inside the component.",
      },
    ],
    quiz: [
      {
        question: "What is createContext(someDefault)'s default value used for?",
        options: [
          "Consumers that render without a matching provider above them",
          "The provider itself, when nothing was passed",
          "It resets the value on every render",
        ],
        answerIndex: 0,
        explanation:
          "The default is what useContext supplies when no provider is found — often null, guarded in a custom hook.",
      },
      {
        question: "What do the rules of hooks require?",
        options: [
          "Call hooks anywhere, including inside loops and conditions",
          "Only class components may call hooks",
          "Call hooks at the top level of components or custom hooks, unconditionally",
        ],
        answerIndex: 2,
        explanation:
          "React matches hooks to state by call order, so conditions, loops and early returns around hook calls are off-limits.",
      },
    ],
    exercises: [
      {
        title: "Sidebar context",
        prompt: "Create a SidebarContext carrying an open boolean with false as default. Provide it from App with real state, then consume it in a Sidebar component that shows 'Open' or 'Closed'.",
        language: "tsx",
        starterCode: `import { createContext, useContext, useState, type ReactNode } from "react";

const SidebarContext = createContext<boolean>(false);

export function Sidebar() {
  // read the context here
  return null;
}`,
        hint: "Wrap the tree with <SidebarContext value={...}> in App, then read it in Sidebar with useContext.",
      },
      {
        title: "useCounter",
        prompt: "Extract a useCounter hook that returns a tuple of count and increment, then use it in two components that keep independent counts.",
        language: "tsx",
        starterCode: `import { useState } from "react";

function useCounter() {
  // your hooks here
  return null;
}`,
        hint: "useState(0) inside the hook; return [count, increment] as const so callers get a typed tuple.",
      },
    ],
  },
];
