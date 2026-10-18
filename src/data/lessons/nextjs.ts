import type { Lesson } from "@/types/course";

/**
 * Lesson content for the nextjs-fundamentals path (App Router, Next.js 15 era).
 * Slugs are stable keys used by routes and lookups — do not rename them.
 */
export const nextJsLessons: Lesson[] = [
  {
    slug: "introduction-to-nextjs",
    title: "Introduction to Next.js",
    minutes: 10,
    objectives: [
      "Explain what Next.js adds on top of plain React",
      "Map the app directory to URLs",
      "Start a project and run the dev server",
    ],
    sections: [
      {
        heading: "React is the engine, Next.js is the workshop",
        body: `A plain React app is one HTML page plus a bundle: you build every route by hand, fetch data from the browser, and ship all your JavaScript to the client. Next.js is a framework around React that solves those problems for you — file-based routing, server rendering, data handling and production optimization, all wired together.\n\nYou still write React components and JSX exactly as you have learned. What changes is where they run and how they are organized.`,
      },
      {
        heading: "The app directory",
        body: `In the modern App Router, routes live in a folder called app. Each folder inside it maps to a URL segment: app/page.tsx handles "/", app/about/page.tsx handles "/about", and app/blog/[slug]/page.tsx handles "/blog/hello-world".\n\nA segment only becomes a URL when it contains a page.tsx (for pages) or route.ts (for API endpoints). Other special files — layout.tsx, loading.tsx, error.tsx, not-found.tsx — add shared UI and behavior around those pages.`,
      },
      {
        heading: "Why 'server by default' matters",
        body: `Components in the app directory render on the **server** unless you explicitly opt into the browser with "use client". That default keeps client bundles small and lets components await data, read files and use secrets that never reach the browser.\n\nIt also frames where data lives. The CodeMentor app you are using right now keeps all of its state in React memory in the browser and persists nothing — perfect for interactive lessons. Next.js "server by default" is what you reach for when an app moves beyond in-memory state and needs real data on the server.`,
      },
    ],
    examples: [
      {
        title: "The smallest Next.js app",
        description: "app/page.tsx — a default export is all a route needs.",
        language: "tsx",
        code: `export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Next.js</h1>
      <p>This file lives at app/page.tsx and is served at "/".</p>
    </main>
  );
}`,
        lineNotes: [
          {
            code: "export default function HomePage()",
            note: "A page file must have a default export — it is the component rendered for that URL.",
          },
          {
            code: "app/page.tsx",
            note: "The folder path defines the URL: the page file inside app is served at \"/\".",
          },
          {
            code: "<h1>Welcome to Next.js</h1>",
            note: "Ordinary React JSX — no template, no special syntax. It renders on the server by default.",
          },
        ],
      },
      {
        title: "Booting a project",
        language: "javascript",
        code: `npx create-next-app@latest my-app
cd my-app
npm run dev`,
      },
    ],
    mistakes: [
      {
        wrong: "Creating a pages/ folder with page files in a fresh App Router project.",
        why: "pages/ is the legacy routing system; mixing both systems makes two routers compete for the same URLs.",
        fix: "Use the app directory: folders plus page.tsx files define your routes.",
      },
      {
        wrong: "Adding \"use client\" to every component out of habit.",
        why: "It opts components into the browser bundle you did not need, losing server rendering benefits for no reason.",
        fix: "Leave components on the server by default; add \"use client\" only where hooks or event handlers demand it.",
      },
      {
        wrong: "Naming a route file Page.tsx or pages.tsx and expecting it to work.",
        why: "Route files are matched by their exact lowercase names — page.tsx, layout.tsx, route.ts.",
        fix: "Rename to exactly page.tsx.",
      },
    ],
    quiz: [
      {
        question: "Which file makes a folder a routable page in the App Router?",
        options: [
          "page.tsx",
          "index.js",
          "main.component.ts",
        ],
        answerIndex: 0,
        explanation:
          "app/<folder>/page.tsx is what turns a folder into a URL; nothing else grants routing.",
      },
      {
        question: "By default, components in the app directory render…",
        options: [
          "in the browser, after hydration",
          "on the server",
          "nowhere until you export 'use client'",
        ],
        answerIndex: 1,
        explanation:
          "Server components are the default; the client boundary is the opt-in, not the baseline.",
      },
    ],
    exercises: [
      {
        title: "About page",
        prompt: "Create app/about/page.tsx that renders a heading and one sentence about what you are learning.",
        language: "tsx",
        starterCode: `export default function AboutPage() {
  return (
    <main>

    </main>
  );
}`,
        hint: "The file path app/about/page.tsx already makes the URL /about — the component only supplies the content.",
      },
      {
        title: "Course index",
        prompt: "Create app/courses/page.tsx listing three course names in a ul.",
        language: "tsx",
        hint: "For a fixed list in JSX you can hard-code the three li elements without keys.",
      },
    ],
  },
  {
    slug: "file-based-routing",
    title: "File-Based Routing",
    minutes: 12,
    objectives: [
      "Turn folder structure into URL structure",
      "Handle dynamic segments with [param] folders",
      "Read route params, including the Next.js 15 Promise change",
    ],
    sections: [
      {
        heading: "Folders are URL segments",
        body: `Routing in the App Router is defined by the file tree. app/page.tsx is "/", app/blog/page.tsx is "/blog", and nesting folders nests the URL: app/docs/intro/page.tsx is served at /docs/intro. No route config file, no manual registration.\n\nDetail worth remembering: only specially named files (page, layout, route, loading, error, not-found, template, default) affect routing — a components.tsx in a route folder is just a component you import, invisible to URLs.`,
      },
      {
        heading: "Dynamic segments",
        body: `Wrap a folder name in square brackets and it matches any value at that position: app/blog/[slug]/page.tsx matches /blog/hello-world and /blog/anything-else. The matched value arrives to the page as params.slug.\n\nThe segment name inside the brackets is the key into params — [slug] gives you params.slug, [id] gives params.id. Since Next.js 15, params is a **Promise**, so pages await it.`,
      },
      {
        heading: "Catch-all segments",
        body: `[...slug] (catch-all) matches one or more segments — /docs/a/b/c arrives as params.slug === ["a", "b", "c"]. [[...slug]] (optional catch-all) additionally matches the base path itself.\n\nUse catch-alls sparingly: they are great for documentation trees and file-browser-like routes, but plain static and [param] segments express most apps more clearly.`,
      },
    ],
    examples: [
      {
        title: "A dynamic blog post page",
        language: "tsx",
        code: `type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  return (
    <article>
      <h1>Post: {slug}</h1>
    </article>
  );
}`,
        lineNotes: [
          {
            code: "type Props = { params: Promise<{ slug: string }> };",
            note: "Since Next.js 15, route params arrive as a Promise that must be awaited.",
          },
          {
            code: "const { slug } = await params;",
            note: "This unwraps the value matched by the [slug] folder — /blog/hello-world gives slug = \"hello-world\".",
          },
          {
            code: "export default async function BlogPostPage",
            note: "Server components may be async, so awaiting during render is unremarkable.",
          },
        ],
      },
      {
        title: "Tree to URL",
        language: "javascript",
        code: `app/
  page.tsx               -> /
  about/page.tsx         -> /about
  blog/page.tsx          -> /blog
  blog/[slug]/page.tsx   -> /blog/hello-world, /blog/anything`,
      },
    ],
    mistakes: [
      {
        wrong: "Reading params.slug directly in a Next.js 15 page without awaiting.",
        why: "params is a Promise in the App Router now; the property is undefined until you await it.",
        fix: "Type params as a Promise and await it: const { slug } = await params.",
      },
      {
        wrong: "Putting a component in app/blog/post.tsx and expecting /blog/post to work.",
        why: "Only page.tsx (or route.ts) creates a route; component files are just imports.",
        fix: "Either create app/blog/[slug]/page.tsx or use the file as a component imported elsewhere.",
      },
      {
        wrong: "Forgetting the default export in a page file.",
        why: "Next.js fails the build with a 'default export is not a React Component' error — the router has nothing to render.",
        fix: "Always export default the page's component.",
      },
    ],
    quiz: [
      {
        question: "In Next.js 15, what is the shape of the params prop passed to a dynamic page?",
        options: [
          "A plain object: { slug: string }",
          "A Promise resolving to the params object",
          "A string of the whole path",
        ],
        answerIndex: 1,
        explanation:
          "Next.js 15 made params (and searchParams) async — await them in server components.",
      },
      {
        question: "Which file provides the UI for the URL /products/42?",
        options: [
          "app/products/page.tsx with a query check",
          "app/products/[id]/page.tsx",
          "app/products/route.tsx",
        ],
        answerIndex: 1,
        explanation:
          "The [id] folder matches any value in that position, and its name becomes the params key.",
      },
    ],
    exercises: [
      {
        title: "Product page",
        prompt: "Create app/products/[id]/page.tsx that awaits params and renders 'Product: <id>'.",
        language: "tsx",
        starterCode: `type Props = { params: Promise<{ id: string }> };

export default async function ProductPage({ params }: Props) {
  // unwrap params here
  return null;
}`,
        hint: "const { id } = await params; then render it in the JSX.",
      },
      {
        title: "Read the catch-all",
        prompt: "For app/docs/[...parts]/page.tsx, await params and render the parts joined with ' / '.",
        language: "tsx",
        hint: "params.parts is a string array — parts.join(' / ') does the formatting.",
      },
    ],
  },
  {
    slug: "layouts-and-navigation",
    title: "Layouts and Navigation",
    minutes: 12,
    objectives: [
      "Share UI across routes with layout.tsx",
      "Navigate without full reloads using next/link",
      "Highlight the active route with usePathname",
    ],
    sections: [
      {
        heading: "layout.tsx: the persistent frame",
        body: `A layout wraps a route segment and keeps its children swapped out as you navigate. The root layout (app/layout.tsx) must render the html and body tags and is required. Layouts in nested folders wrap just that segment — app/blog/layout.tsx frames every blog page.\n\nBecause layouts persist across navigations, anything inside them — headers, sidebars, inputs — keeps its state and scroll position while only the page re-renders.`,
      },
      {
        heading: "Navigating with Link",
        body: `next/link is the right tool for internal navigation. It renders an anchor — so right-click, open-in-new-tab and loading semantics still work — but intercepts the click to do client-side navigation: no full document reload, and prefetched routes arrive instantly.\n\nReserve plain <a href> for external sites. Using it for internal links throws away prefetching and forces a full page load every time.`,
      },
      {
        heading: "Active routes and programmatic navigation",
        body: `To style the current route, you need to know it in the browser — that is a client concern. The usePathname hook from next/navigation gives you the pathname, and hooks only run in client components, so active-link wrappers carry the "use client" directive.\n\nFor navigation triggered by code (after a form succeeds, say), the useRouter hook from next/navigation offers router.push, replace, back and forward.`,
      },
    ],
    examples: [
      {
        title: "A root layout with navigation",
        language: "tsx",
        code: `import type { ReactNode } from "react";
import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </header>
        {children}
      </body>
    </html>
  );
}`,
        lineNotes: [
          {
            code: "export default function RootLayout",
            note: "The root layout wraps every route in the app and is the only place html/body come from.",
          },
          {
            code: "<html lang=\"en\">",
            note: "Required by the root layout — omitting html and body causes a hydration mismatch error.",
          },
          {
            code: "<Link key={item.href} href={item.href}>",
            note: "Link does client-side navigation: no document reload, and route prefetching happens in the background.",
          },
          {
            code: "{children}",
            note: "The matched page is swapped in here; the surrounding header survives navigations.",
          },
        ],
      },
      {
        title: "An active link",
        language: "tsx",
        code: `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function ActiveLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link className={isActive ? "active" : undefined} href={href}>
      {children}
    </Link>
  );
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Importing usePathname or routers from \"next/router\".",
        why: "next/router belongs to the legacy Pages Router; the App Router's hooks live in next/navigation.",
        fix: "Import usePathname and useRouter from \"next/navigation\".",
      },
      {
        wrong: "Writing a root layout without <html> and <body>.",
        why: "Next.js requires the root layout to provide the document frame; missing tags break hydration.",
        fix: "Return <html><body>...{children}...</body></html> from app/layout.tsx.",
      },
      {
        wrong: "Marking the whole root layout \"use client\" just to make one link active.",
        why: "It drags the entire app into the client bundle and disables server-only features of the layout.",
        fix: "Keep the layout a server component and extract a small \"use client\" ActiveLink.",
      },
    ],
    quiz: [
      {
        question: "What does layout.tsx give you in the App Router?",
        options: [
          "Shared UI that persists across navigations of its segment",
          "A CSS file applied to the segment",
          "A second, parallel page for the same URL",
        ],
        answerIndex: 0,
        explanation:
          "Layouts wrap pages and survive navigation, so nav elements do not re-render or lose state.",
      },
      {
        question: "Where do usePathname and useRouter come from in the App Router?",
        options: [
          "\"next/router\"",
          "\"react\"",
          "\"next/navigation\"",
        ],
        answerIndex: 2,
        explanation:
          "The App Router's navigation hooks ship under next/navigation.",
      },
    ],
    exercises: [
      {
        title: "Docs layout",
        prompt: "Create app/docs/layout.tsx that renders a heading 'Docs' plus {children}, so every docs page gets the frame.",
        language: "tsx",
        starterCode: `export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return null;
}`,
        hint: "Return a section containing the h2 and {children}.",
      },
      {
        title: "Active nav item",
        prompt: "Build a client component NavItem that renders a Link and adds an className \"active\" when the current pathname matches its href.",
        language: "tsx",
        starterCode: `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavItem({ href, label }: { href: string; label: string }) {
  // compute active, then render the Link
  return null;
}`,
        hint: "const isActive = usePathname() === href; pass className={isActive ? \"active\" : undefined}.",
      },
    ],
  },
  {
    slug: "server-components",
    title: "Server Components",
    minutes: 14,
    objectives: [
      "Explain what runs where in the App Router",
      "Use async components to await data on the server",
      "Place the 'use client' boundary as low as possible",
    ],
    sections: [
      {
        heading: "Components that never ship to the browser",
        body: `In the app directory, every component is a **server component** unless marked otherwise: its code runs on the server, and only its rendered output reaches the browser. That means you can await data, read the filesystem or a database, and use API keys — none of it appears in the client bundle.\n\nThe browser receives finished UI plus tiny "client island" markers. Server components cannot use state, effects or event handlers — there is no browser to click in — but you also get to skip most of the hydration overhead.`,
      },
      {
        heading: "The boundary rules",
        body: `"use client" marks a **boundary**, not a component type: everything imported by that module becomes client code, including its children rendered through the bundle. Client components can use useState, useEffect, browser APIs and event handlers, but they cannot be async and cannot run on the server's terms at all.\n\nData crossing the boundary must be **serializable** — strings, numbers, plain objects, arrays. Functions, class instances or unlabeled Promises cannot travel from a server parent into a client child.`,
      },
      {
        heading: "Pushing the boundary down",
        body: `The best-practice flow is: fetch data and build markup in server components, then leave interactivity to small client leaves. A page might be 95% server code with one "use client" LikeButton at the corner.\n\nA useful pattern for mixing them: a client component that accepts server-rendered children — its children prop can carry entire server component outputs that were already rendered before leaving the server.`,
      },
    ],
    examples: [
      {
        title: "Awaiting data in a page",
        language: "tsx",
        code: `async function getUser(id: string) {
  const res = await fetch(\`https://api.example.com/users/\${id}\`);
  if (!res.ok) throw new Error("User not found");
  return (await res.json()) as { id: string; name: string; bio: string };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id);

  return (
    <section>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </section>
  );
}`,
        lineNotes: [
          {
            code: "export default async function ProfilePage",
            note: "Pages are server components by default, so async/await needs no ceremony.",
          },
          {
            code: "const { id } = await params;",
            note: "Route params are a Promise since Next.js 15 — await them at the top of the render.",
          },
          {
            code: "await fetch(...)",
            note: "This runs on the server: it can reach internal APIs, files or databases that the browser cannot.",
          },
          {
            code: "{user.name}",
            note: "The browser receives the finished markup — no loading spinner visible unless you stream one.",
          },
        ],
      },
      {
        title: "A client island in a server page",
        language: "tsx",
        code: `import { LikeButton } from "./like-button";

export default async function PhotoPage() {
  const likes = 42; // imagine a database read here

  return (
    <main>
      <LikeButton initial={likes} />
    </main>
  );
}`,
        description:
          "like-button.tsx is a tiny \"use client\" island; the page stays on the server and passes a plain number in.",
      },
    ],
    mistakes: [
      {
        wrong: "Calling useState, useEffect or window in a server component file.",
        why: "There is no browser where server components run; hooks and browser APIs simply do not exist there.",
        fix: "Extract that part into a separate client component with \"use client\" at the top.",
      },
      {
        wrong: "Spraying \"use client\" over whole subtrees so all pages and layouts become client components.",
        why: "The directive is file-wide and inherited by imports — you lose server rendering, data fetching and bundle size everywhere you spread it.",
        fix: "Mark only the interactive leaves: the LikeButton, the form, the chart.",
      },
      {
        wrong: "Passing a function or class instance from a server component into a client component's props.",
        why: "The boundary serializes props; non-serializable values throw at build time or turn into errors in the browser.",
        fix: "Pass plain data, or pass already-rendered JSX through children.",
      },
    ],
    quiz: [
      {
        question: "Which is legal inside a server component?",
        options: [
          "const [x, setX] = useState(0)",
          "awaiting a database query during render",
          "window.addEventListener(\"resize\", ...)",
        ],
        answerIndex: 1,
        explanation:
          "Server components run where the database is; state and browser APIs belong to client components.",
      },
      {
        question: "What does \"use client\" actually mark?",
        options: [
          "The one component you cannot import elsewhere",
          "A boundary: that file and its imports ship to the browser",
          "That the component must be async",
        ],
        answerIndex: 1,
        explanation:
          "The directive is per-file and spreads through imports — which is why you place it as low in the tree as possible.",
      },
    ],
    exercises: [
      {
        title: "Stats page",
        prompt: "Write a server page that awaits a local async function getStats() (return a hard-coded object) and renders the numbers.",
        language: "tsx",
        starterCode: `async function getStats() {
  return { lessons: 18, minutes: 240 };
}

export default async function StatsPage() {
  // await and render here
  return null;
}`,
        hint: "const stats = await getStats(); then use stats.lessons in the JSX.",
      },
      {
        title: "Client leaf",
        prompt: "Create like-button.tsx with \"use client\" that uses useState to track a count and increments on click; import it into a server page.",
        language: "tsx",
        starterCode: `"use client";

import { useState } from "react";

export function LikeButton() {
  // count state + button here
  return null;
}`,
        hint: "The directive must be the first line of the file, before any imports.",
      },
    ],
  },
  {
    slug: "client-components",
    title: "Client Components",
    minutes: 12,
    objectives: [
      "Use the \"use client\" directive correctly",
      "Take advantage of hooks, events and browser APIs",
      "Know what can cross into a client component",
    ],
    sections: [
      {
        heading: "The directive",
        body: `"use client" is a file-level declaration placed at the very top — before imports, before anything else. It tells the compiler: every component exported from this file runs in the browser, and everything these files import joins them there.\n\nIt is an **opt-in**, so the mental checklist for adding it is short: does this component use state or effects, event handlers, or browser APIs like localStorage? Any yes means "use client". A component that only displays components and strings does not.`,
      },
      {
        heading: "What you gain",
        body: `Client components are ordinary React running in the browser: useState, useEffect, useContext, onClick handlers, focus management, animations. They hydrate — the framework attaches your exported components to the server-rendered markup and wires the interactivity up.\n\nThey can still fetch their own data with fetch in an effect when needed. The difference is cost: every bit of code and data a client component needs crosses the network, so keep the client area small and push data-heavy work back to the server.`,
      },
      {
        heading: "What can cross the boundary",
        body: `Props passed from a server parent into a client child must be **serializable**: strings, numbers, booleans, plain objects and arrays thereof. Functions and class instances are not invited — the client component cannot receive your callback definitions from the server.\n\nThe elegant escape hatch is **children**: a client component can accept server-rendered elements through its children (or any ReactNode prop) and place them in its tree. The server renders what it knows, the client handles interactivity around it — no serialization problem at all.`,
      },
    ],
    examples: [
      {
        title: "The LikeButton island",
        language: "tsx",
        code: `"use client";

import { useState } from "react";

export function LikeButton({ initial }: { initial: number }) {
  const [likes, setLikes] = useState(initial);

  return (
    <button onClick={() => setLikes(likes + 1)}>
      ♥ {likes}
    </button>
  );
}`,
        lineNotes: [
          {
            code: "\"use client\";",
            note: "First line of the file: everything exported here becomes client-side code.",
          },
          {
            code: "const [likes, setLikes] = useState(initial);",
            note: "Hooks only run in client components — this is exactly why the directive exists.",
          },
          {
            code: "onClick={() => setLikes(likes + 1)}",
            note: "Event handlers need a browser, so they mark the fence where 'use client' is required.",
          },
          {
            code: "♥ {likes}",
            note: "This button ships as JS to the browser and hydrates onto the server-rendered HTML.",
          },
        ],
      },
      {
        title: "Client frame, server content",
        language: "tsx",
        code: `"use client";

import { useState, type ReactNode } from "react";

export function Collapse({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"} details
      </button>
      {open && children}
    </section>
  );
}`,
        description: "children can be a full server-rendered subtree — the server did the work, the client just toggles visibility.",
      },
    ],
    mistakes: [
      {
        wrong: "Placing \"use client\" anywhere except the top of the file.",
        why: "After an import it is just a string literal, not a directive — the file stays a server component and your hooks explode.",
        fix: "Keep \"use client\" as the very first statement, before imports (comments above it are fine).",
      },
      {
        wrong: "Importing a data function that hits a database directly into a client component.",
        why: "The module becomes client code: the call runs in the browser without database access, credentials or file paths.",
        fix: "Fetch in the server parent and pass plain data down as props.",
      },
      {
        wrong: "Passing a callback or a class instance as a prop from server to client.",
        why: "The boundary serializes props; functions and class instances cannot be flattened into network-friendly values.",
        fix: "Pass plain values, or move the callback's work into the client component that needs it.",
      },
    ],
    quiz: [
      {
        question: "Where must the \"use client\" directive appear?",
        options: [
          "Right after the imports",
          "Above any component that uses a hook",
          "At the very top of the file, before imports",
        ],
        answerIndex: 2,
        explanation:
          "It is a file-level flag; placed anywhere else it is inert string and the file remains a server component.",
      },
      {
        question: "Which prop can legitimately cross from a server component to a client component?",
        options: [
          "A class instance",
          "A callback function",
          "A plain object of strings and numbers",
        ],
        answerIndex: 2,
        explanation:
          "Only serializable values survive the boundary. Rendered JSX can pass, too — via the children prop.",
      },
    ],
    exercises: [
      {
        title: "Controlled input island",
        prompt: "Create a \"use client\" component SearchField that keeps the typed value in state and shows it live under the field.",
        language: "tsx",
        hint: "The classic controlled input — value from state, onChange writing back.",
      },
      {
        title: "Client wrapper",
        prompt: "Write a client component Panel with a toggle button that shows or hides its children prop.",
        language: "tsx",
        starterCode: `"use client";

import { useState, type ReactNode } from "react";

export function Panel({ children }: { children: ReactNode }) {
  // visible state + toggle button
  return null;
}`,
        hint: "Render {visible && children} after the button.",
      },
    ],
  },
  {
    slug: "fetching-data",
    title: "Fetching Data",
    minutes: 12,
    objectives: [
      "Load data directly in server components",
      "Control caching and revalidation of fetches",
      "Give routes a loading state with loading.tsx",
    ],
    sections: [
      {
        heading: "Await data where you render it",
        body: `In the App Router you rarely need a data-fetching layer: a server component can await its data right in the render body, then map the result into JSX. Without a client roundtrip, without spinners, without useEffect plumbing.\n\nWhen a page needs several independent requests, kick them off together and await with Promise.all — the requests overlap instead of queueing into a waterfall you caused by nesting awaits.`,
      },
      {
        heading: "Caching and revalidation",
        body: `Since Next.js 15, fetch calls in server components are **not cached by default** — every request to the page hits your data source. Opt into caching selectively with fetch options: { cache: "force-cache" } for shared cache, or { next: { revalidate: 60 } } to cache and refetch at most once a minute.\n\nThink about cost and freshness per endpoint: a list of lesson titles can cache for an hour, while user-specific data often skips the cache entirely.`,
      },
      {
        heading: "Loading is a UI state, not a spinner in a div",
        body: `Instead of fetching in a client component to show a spinner, give a route segment a loading.tsx: Next.js wraps that segment in Suspense and streams the fallback while server data resolves, then swaps in the real page.\n\nHandle failure the same way — error.tsx is a client component that receives the thrown error and a reset callback, so a failed fetch shows real recovery UI rather than a blank screen.`,
      },
    ],
    examples: [
      {
        title: "Server fetch with revalidation",
        language: "tsx",
        code: `type Course = { id: number; title: string };

async function getCourses(): Promise<Course[]> {
  const res = await fetch("https://api.example.com/courses", {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to load courses");
  return (await res.json()) as Course[];
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <ul>
      {courses.map((course) => (
        <li key={course.id}>{course.title}</li>
      ))}
    </ul>
  );
}`,
        lineNotes: [
          {
            code: "const res = await fetch(...)",
            note: "Runs on the server during render — no client fetch, no waterfall through useEffect.",
          },
          {
            code: "next: { revalidate: 60 }",
            note: "Opts into caching with refetch at most once per minute; Next.js 15 default is no caching.",
          },
          {
            code: "if (!res.ok) throw new Error(...)",
            note: "Throwing during render hands off to the nearest error.tsx file.",
          },
          {
            code: "(await res.json()) as Course[]",
            note: "Type the response where you receive it — fetch cannot infer shape on its own.",
          },
        ],
      },
      {
        title: "A route-level loading state",
        language: "tsx",
        code: `// app/courses/loading.tsx
export default function Loading() {
  return <p aria-busy="true">Fetching course list…</p>;
}`,
        description:
          "While the page's data resolves, this fallback streams in — no manual spinner state anywhere.",
      },
    ],
    mistakes: [
      {
        wrong: "Fetching inside useEffect in a client component when the data is not user-specific.",
        why: "You trade a server read for a browser roundtrip, a loading state, and a bigger bundle — the classic waterfall.",
        fix: "Await the data in a server component and pass it down; keep client fetches for live-private or real-time data.",
      },
      {
        wrong: "Assuming fetch results are cached by default in Next.js 15.",
        why: "The default flipped to no caching; every render re-hits the API and costs latency and quota.",
        fix: "Add next: { revalidate: n } or cache: \"force-cache\" deliberately per endpoint.",
      },
      {
        wrong: "Reading res.json() without checking res.ok first.",
        why: "A 500 with an HTML body becomes a confusing JSON parse error instead of a clear failure.",
        fix: "Throw early when !res.ok and let error.tsx present it.",
      },
    ],
    quiz: [
      {
        question: "Where should most read-time data fetching happen in the App Router?",
        options: [
          "In server components, awaited during render",
          "In useEffect inside client components",
          "In layout.tsx on every navigation",
        ],
        answerIndex: 0,
        explanation:
          "Server components await data directly — it is the App Router's headline data story.",
      },
      {
        question: "What does a loading.tsx file in a route folder do?",
        options: [
          "Delays the build until data arrives",
          "Provides a Suspense fallback streamed while the segment's data resolves",
          "Prevents the route from being cached",
        ],
        answerIndex: 1,
        explanation:
          "The segment streams its fallback first and swaps in the finished page when awaits complete.",
      },
    ],
    exercises: [
      {
        title: "Revalidated endpoint",
        prompt: "Task getCourses with a 60-second revalidate option, then render the list.",
        language: "tsx",
        starterCode: `const res = await fetch("https://api.example.com/courses", {
  // add the caching option here
});`,
        hint: "next: { revalidate: 60 } inside the second argument.",
      },
      {
        title: "Fallback file",
        prompt: "Create app/courses/loading.tsx that renders a paragraph saying the list is loading.",
        language: "tsx",
        hint: "Export default a component from loading.tsx — it is the segment's Suspense fallback.",
      },
    ],
  },
  {
    slug: "route-handlers",
    title: "Route Handlers",
    minutes: 12,
    objectives: [
      "Build API endpoints with route.ts",
      "Read requests and send typed JSON responses",
      "Choose between handlers and server-side rendering",
    ],
    sections: [
      {
        heading: "Endpoints as files",
        body: `A route.ts file in the app directory turns that URL into an HTTP endpoint. Export async functions named after HTTP methods — GET, POST, PATCH, DELETE, HEAD, OPTIONS — and each becomes a handler for that method.\n\nHandlers receive a NextRequest and can return NextResponse helpers (NextResponse.json) or plain Response objects. They are the App Router's replacement for the old pages/api folder.`,
      },
      {
        heading: "Reading requests",
        body: `Request bodies arrive as streams: await request.json() for JSON payloads, request.formData() for forms, and text() for plain bodies. Query strings are easy to reach through request.nextUrl.searchParams, and dynamic segments work like pages — [id] arrives inside a Promise you await in the handler's second argument.\n\nA note on caching: since Next.js 15, GET handlers are dynamic by default, so every call re-runs unless you opt into caching on the segment.`,
      },
      {
        heading: "When to reach for one",
        body: `Route handlers shine for third-party consumers, webhooks, and as secret proxies — hiding an API key behind your own server where env vars live. Inside your own app, server components usually read data directly, skipping your own HTTP layer, which keeps renders fast and typed.\n\nAlso a reminder about server memory: values kept in module-level arrays reset whenever the server restarts, which is exactly why the CodeMentor app keeps its state in React memory and still never claims file persistence. Anything a user expects to survive needs a real database behind your POST handlers.`,
      },
    ],
    examples: [
      {
        title: "A POST endpoint with validation",
        language: "tsx",
        code: `import { NextRequest, NextResponse } from "next/server";

type Feedback = { message: string };

const submissions: Feedback[] = [];

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { message?: string };

  if (!body.message) {
    return NextResponse.json(
      { error: "message is required" },
      { status: 400 },
    );
  }

  submissions.push({ message: body.message });
  return NextResponse.json({ received: 1 }, { status: 201 });
}`,
        lineNotes: [
          {
            code: "export async function POST(request: NextRequest)",
            note: "Method-shaped names are the contract: this file answers POST at its route.",
          },
          {
            code: "(await request.json()) as { message?: string }",
            note: "Bodies arrive as a stream; you as-cast the shape the caller promised.",
          },
          {
            code: "{ status: 400 }",
            note: "Client errors get 4xx with a JSON explanation, not a thrown exception.",
          },
          {
            code: "const submissions: Feedback[] = [];",
            note: "Lives in server memory only — it resets on restart. Real persistence needs a database here.",
          },
        ],
      },
      {
        title: "Reading params and queries",
        language: "tsx",
        code: `import { NextRequest, NextResponse } from "next/server";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  const { id } = await params;
  const tag = request.nextUrl.searchParams.get("tag");

  return NextResponse.json({ id, tag });
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Naming the file route.tsx or handler.ts and expecting an endpoint.",
        why: "Only route.ts (JavaScript: route.js) defines route handlers in the app directory.",
        fix: "Rename the file to route.ts and export method functions from it.",
      },
      {
        wrong: "Storing POST submissions in a module-level array and calling it persistence.",
        why: "That memory dies with the server process; restarts and deploys quietly delete your data.",
        fix: "Write to a real database in the handler; your CodeMentor-style apps need it the moment users expect their work to survive.",
      },
      {
        wrong: "Calling your own app's API from a server component to read data.",
        why: "An extra HTTP hop: absolute URLs to yourself are awkward, caching doubles, and none of the types flow through.",
        fix: "Read the data source directly in the server component; keep handlers for outside callers and secrets.",
      },
    ],
    quiz: [
      {
        question: "What makes an HTTP endpoint available at app/api/feedback?",
        options: [
          "app/api/feedback/endpoint.ts exporting handlers",
          "app/api/feedback/route.ts exporting GET or POST functions",
          "app/api/feedback/page.tsx exporting a form",
        ],
        answerIndex: 1,
        explanation:
          "route.ts is the endpoint-defining file; its method-named exports become the handlers.",
      },
      {
        question: "How do you read the JSON body of a POST request in a route handler?",
        options: [
          "const body = request.body as Shape",
          "const body = (await request.json()) as Shape",
          "const body = NextResponse.from(request)",
        ],
        answerIndex: 1,
        explanation:
          "Bodies stream in asynchronously — await request.json(), then narrow the type yourself.",
      },
    ],
    exercises: [
      {
        title: "Query echo",
        prompt: "Build app/api/echo/route.ts with a GET that returns the q query parameter (or a 400 with { error: \"q is required\" } when missing).",
        language: "tsx",
        starterCode: `import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // read request.nextUrl.searchParams and respond here
  return NextResponse.json({});
}`,
        hint: "searchParams.get(\"q\") gives null when missing — branch on that before responding.",
      },
      {
        title: "Feedback archive",
        prompt: "Extend the feedback route so POST returns 400 for an empty message, and GET returns the messages stored so far.",
        language: "tsx",
        hint: "Guard the message field first with an early return, then push into the in-memory array.",
      },
    ],
  },
  {
    slug: "optimization-and-deployment",
    title: "Optimization and Deployment",
    minutes: 12,
    objectives: [
      "Use next/image, next/font and built-in metadata",
      "Keep secrets out of client bundles",
      "Build a production bundle and deploy it",
    ],
    sections: [
      {
        heading: "Out of the box: images and fonts",
        body: `next/image wraps the browser's img with real optimization: it resizes and serves modern formats on demand, enforces width/height to kill layout shift, and lazy-loads by default. Give hero images the priority prop so they load eagerly instead.\n\nnext/font works the same way for typography: it downloads and self-hosts your fonts at build time, eliminating the external font request that used to cause invisible-text flashes.`,
      },
      {
        heading: "Metadata and secrets",
        body: `Export a Metadata object from any layout or page (server components only) and Next.js fills in the head tags — title, description, social previews. Titles compose from parent layouts down to child pages.\n\nEnv variables follow one rule you must internalize: anything prefixed NEXT_PUBLIC_ is **bundled into the browser** and effectively public. Real secrets — database URLs, API keys — live only in server-only code and are read without the prefix.`,
      },
      {
        heading: "Build and ship",
        body: `npm run build compiles and analyzes the whole route tree: every page is marked static, dynamic or streaming, and any unhandled mistakes surface here. On a Node host, npm run start serves that build; server features require a Node-capable host rather than a purely static file host.\n\nDeployment platforms (Next.js hosting, containers, or your own server) all work from the same build. Your homework after every real deploy: check the build output, exercise a few routes, and look at the network tab to confirm what actually shipped to clients.`,
      },
    ],
    examples: [
      {
        title: "Metadata, fonts and Image together",
        language: "tsx",
        code: `import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Hub",
  description: "Guided lessons, challenges and an AI tutor.",
};

export default function Hero() {
  return (
    <section>
      <Image
        src="/hero.jpg"
        alt="Students learning to code"
        width={1200}
        height={600}
        priority
      />
    </section>
  );
}`,
        lineNotes: [
          {
            code: "export const metadata: Metadata = {",
            note: "Static SEO tags for this page — must be exported from a server component.",
          },
          {
            code: "<Image",
            note: "next/image optimizes, lazy-loads and prevents layout shift automatically.",
          },
          {
            code: "width={1200}",
            note: "Dimensions reserve space in the layout — the CLS killer. Omit only when you use fill.",
          },
          {
            code: "priority",
            note: "For above-the-fold heroes: skip the lazy queue and load eagerly.",
          },
        ],
      },
      {
        title: "Production commands",
        language: "javascript",
        code: `npm run build
npm run start

# production env values go in .env.production or your host dashboard,
# and only NEXT_PUBLIC_-prefixed vars reach the browser bundle`,
      },
    ],
    mistakes: [
      {
        wrong: "Reading process.env.SERVICE_TOKEN inside a \"use client\" component.",
        why: "The variable is baked into the shipped bundle — every visitor can read your secrets from DevTools.",
        fix: "Do the sensitive work in a route handler or server component, then send only results to the client.",
      },
      {
        wrong: "Exporting metadata from a client component file.",
        why: "Metadata is a server-rendering feature; on a client component it throws a build error.",
        fix: "Keep metadata exports in server files — layout.tsx or page.tsx.",
      },
      {
        wrong: "Using next/image without width and height (and without fill).",
        why: "The layout reserves no space, so images pop in late and the page jumps — exactly what the API prevents.",
        fix: "Give intrinsic dimensions or fill a positioned parent.",
      },
    ],
    quiz: [
      {
        question: "Which environment variable name is safe for client-side code?",
        options: [
          "SERVICE_TOKEN",
          "NEXT_PUBLIC_API_BASE",
          "DATABASE_URL",
        ],
        answerIndex: 1,
        explanation:
          "Only the NEXT_PUBLIC_ prefix inlines a variable into the client bundle — and it is then public, so keep real secrets unprefixed and server-only.",
      },
      {
        question: "Why prefer next/image over a plain img tag?",
        options: [
          "It bypasses the browser cache",
          "It optimizes formats and sizes, lazy-loads, and prevents layout shift",
          "It downloads the image at build time only",
        ],
        answerIndex: 1,
        explanation:
          "The component and its attributes combine on-demand optimization with reserved space.",
      },
    ],
    exercises: [
      {
        title: "Page metadata",
        prompt: "Add export const metadata to app/courses/page.tsx giving it a title and one-sentence description.",
        language: "tsx",
        hint: "Import type { Metadata } from \"next\" and annotate the exported const.",
      },
      {
        title: "Optimized hero",
        prompt: "Replace an <img src=\"/hero.png\"> in a page with next/image, reserving space with width and height.",
        language: "tsx",
        hint: "Import Image from \"next/image\"; supply numeric width and height matching the real file.",
      },
    ],
  },
];
