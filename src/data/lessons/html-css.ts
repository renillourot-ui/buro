import type { Lesson } from "@/types/course";

export const htmlCssLessons: Lesson[] = [
  {
    slug: "introduction-to-html-and-css",
    title: "How the Web Works",
    minutes: 10,
    objectives: [
      "Describe what happens when you open a web page",
      "Explain the separate jobs of HTML and CSS",
      "Write, save, and view your first web page",
    ],
    sections: [
      {
        heading: "From request to page",
        body: `When you type an address into the browser, it sends a **request** to a computer somewhere on the internet. That computer, the server, replies with files: an HTML document, a CSS stylesheet, and usually images too.

The browser reads the HTML to learn *what* is on the page, then applies the CSS to decide *how* everything looks. Writing those files is your job as a developer.`,
      },
      {
        heading: "HTML and CSS have different jobs",
        body: `- **HTML** describes structure and meaning: this line is a heading, this block is a paragraph, this word is a link.
- **CSS** describes presentation: colors, spacing, sizes, and layout.

Keeping the two separate makes pages easier to read and change. The exact same HTML can look completely different with a new stylesheet.`,
      },
      {
        heading: "Try it today",
        body: `You do not need fancy tools to begin. Any plain text editor works, and the browser is your preview. Save a file with the \`.html\` extension and open it — the browser renders it instantly, no server required.`,
      },
    ],
    examples: [
      {
        title: "Your first page",
        description: "A complete, valid HTML document you can save and open in any browser.",
        language: "html",
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, web!</h1>
    <p>This page is built with plain HTML.</p>
  </body>
</html>`,
        lineNotes: [
          { code: `<!DOCTYPE html>`, note: "Tells the browser to use modern rendering rules. Every page starts with it." },
          { code: `<html lang="en">`, note: "The root element. The lang attribute helps screen readers and translation tools." },
          { code: `<head>`, note: "Holds information *about* the page. Nothing in here is displayed on the page itself." },
          { code: `<title>My First Page</title>`, note: "Shown on the browser tab and in search results, not inside the page." },
          { code: `<h1>Hello, web!</h1>`, note: "A top-level heading. Use one h1 for the page's main topic." },
          { code: `<p>This page is built with plain HTML.</p>`, note: "A paragraph. The browser adds spacing around it automatically." },
        ],
      },
      {
        title: "A taste of CSS",
        description: "Three rules restyle the page above.",
        language: "css",
        code: `body {
  font-family: sans-serif;
  color: #222222;
}

h1 {
  color: teal;
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Writing `<p>Hello` and never closing the tag",
        why: "The browser has to guess where the paragraph ends, and its guess can swallow the elements that follow.",
        fix: "Always close what you open: `<p>Hello</p>`.",
      },
      {
        wrong: "Styling content with obsolete HTML like `<font color=\"red\">`",
        why: "Presentation belongs in CSS. Font tags are long-dead and make pages hard to maintain.",
        fix: "Write a CSS rule instead, for example `p { color: red; }`.",
      },
      {
        wrong: "Editing the file but seeing no change in the browser",
        why: "The tab may be showing a cached copy, or the saved file is not the file you opened.",
        fix: "Save first, then refresh the tab — a hard refresh (Ctrl+R or Cmd+Shift+R) clears the cache.",
      },
    ],
    quiz: [
      {
        question: "What does HTML mainly describe?",
        options: ["How the page looks", "The structure and meaning of the content", "How files travel across the internet"],
        answerIndex: 1,
        explanation: "HTML marks up content — headings, paragraphs, links, images. Appearance is CSS's job.",
      },
      {
        question: "Where does the browser look for the page title?",
        options: ["Inside the body", "Inside the head", "Directly after the doctype"],
        answerIndex: 1,
        explanation: "The head holds metadata such as the title, character set, and stylesheet links.",
      },
    ],
    exercises: [
      {
        title: "Build a mini profile page",
        prompt: "Create a page with an h1 holding your name and a paragraph describing one thing you are learning. Open it in a browser and confirm both lines show up.",
        language: "html",
        starterCode: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Profile</title>
  </head>
  <body>
    <!-- your name here -->
    <!-- one sentence about what you are learning -->
  </body>
</html>`,
        hint: "Replace each comment with a real element, for example <h1>Dana</h1>.",
      },
      {
        title: "Recolor it with CSS",
        prompt: "Add a <style> block inside the head of your profile page and write one rule that makes every paragraph dark blue.",
        language: "css",
        starterCode: `p {
  /* choose a dark blue here */
}`,
        hint: "Inside the rule write color: midnightblue; — each declaration ends with a semicolon.",
      },
    ],
  },
  {
    slug: "html-document-structure",
    title: "HTML Document Structure",
    minutes: 10,
    objectives: [
      "Write the standard skeleton of an HTML page from memory",
      "Know what belongs in the head versus the body",
      "Link an external CSS stylesheet correctly",
    ],
    sections: [
      {
        heading: "Three pieces on top",
        body: `Every page starts with the doctype, then a single \`<html>\` root element containing exactly two children: \`<head>\` and \`<body>\`. The doctype looks odd but is required — without it the browser switches to an old 'quirks mode' with subtly different spacing rules.

Indentation does not change how the page renders, but consistent two-space indents make nesting visible and mistakes obvious.`,
      },
      {
        heading: "The head holds metadata",
        body: `The head is invisible plumbing: \`<title>\`, \`<meta charset>\`, the viewport tag for phones, and \`<link>\` tags for stylesheets. Content the visitor reads always goes in the body.

The most common head member for styling is \`<link rel="stylesheet" href="styles.css">\`. One head may link several stylesheets; they apply in order.`,
      },
      {
        heading: "Nesting is a stack",
        body: `Tags nest like bowls: whatever opens last must close first. \`<p><strong>bold</strong></p>\` is valid, while \`<p><strong>bold</p></strong>\` crosses two bowls and relies on the browser to repair it. Repairing is guessing, and guessing occasionally guesses wrong — so keep the order straight.`,
      },
    ],
    examples: [
      {
        title: "The standard skeleton",
        description: "This shape appears at the top of essentially every page you will ever write.",
        language: "html",
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reading List</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <h1>Reading List</h1>
    <p>Books I want to finish this year.</p>
  </body>
</html>`,
        lineNotes: [
          { code: `<meta charset="utf-8">`, note: "Sets the character set so accented letters and symbols render correctly." },
          { code: `<meta name="viewport" ...>`, note: "Makes the page respect the device width — essential for mobile browsers." },
          { code: `<title>Reading List</title>`, note: "Tab text. Keep it short but descriptive of the page." },
          { code: `<link rel="stylesheet" href="styles.css">`, note: "Loads an external CSS file. The href is a path relative to this document." },
          { code: `<body>`, note: "Everything the visitor can see and interact with lives inside the body." },
        ],
      },
      {
        title: "Anatomy of an attribute",
        description: "Attributes give elements extra settings.",
        language: "html",
        code: `<a href="https://example.com" title="Example site">Visit the site</a>
<img src="photo.jpg" alt="My cat asleep on a keyboard">

<!-- attribute = value pairs, always inside the opening tag -->`,
      },
    ],
    mistakes: [
      {
        wrong: "Omitting `<!DOCTYPE html>` to save a line",
        why: "The browser falls back to quirks mode, where box sizes and fonts behave in surprising, inconsistent ways.",
        fix: "Start every file with the doctype line.",
      },
      {
        wrong: "Putting visible text directly in the head, or skipping the head entirely",
        why: "Head content is not rendered, so your text silently vanishes; a headless page still confuses styling and SEO tools.",
        fix: "Metadata in head, displayable content in body.",
      },
      {
        wrong: "Crossing tags like `<p><strong>text</p></strong>`",
        why: "Browsers must guess your intent when nesting overlaps, and the repaired DOM may differ from what you expected.",
        fix: "Close tags in reverse order of opening: outside bowl closes last.",
      },
    ],
    quiz: [
      {
        question: "Which element is the correct way to attach an external stylesheet?",
        options: ["<style href=\"styles.css\">", "<link rel=\"stylesheet\" href=\"styles.css\">", "<script src=\"styles.css\">"],
        answerIndex: 1,
        explanation: "`link rel=stylesheet` is the standard element for CSS files; `style` holds inline CSS and `script` loads JavaScript.",
      },
      {
        question: "What goes inside the <body> element?",
        options: ["Character encoding settings", "Everything the visitor can see", "The doctype declaration"],
        answerIndex: 1,
        explanation: "The body contains all rendered content; the head holds metadata like charset and title.",
      },
    ],
    exercises: [
      {
        title: "Skeleton from memory",
        prompt: "In a new file, write the full document skeleton — doctype, html with lang, head with charset and title, and a body with one heading — without looking at the example.",
        language: "html",
        starterCode: `<!DOCTYPE html>
<html lang="en">
  <!-- head and body here -->
</html>`,
        hint: "The two children of <html> are <head> and <body>, in that order.",
      },
      {
        title: "Wire it up",
        prompt: "Extend your skeleton so the head includes a UTF-8 charset, a viewport tag, and a link to a file named main.css.",
        language: "html",
        starterCode: `<head>
  <!-- three additions go here -->
</head>`,
        hint: "Copy the meta viewport line from the lesson example — it must be a <meta> element, not a link.",
      },
    ],
  },
  {
    slug: "semantic-html",
    title: "Semantic HTML",
    minutes: 12,
    objectives: [
      "Choose elements by meaning instead of appearance",
      "Use the main page landmark elements correctly",
      "Explain why semantics help accessibility and search engines",
    ],
    sections: [
      {
        heading: "Meaning over appearance",
        body: `A \`<div>\` with big text is just a box; an \`<h1>\` tells assistive technology 'this is the main heading of the page.' Semantic elements describe what content *is*, not what it looks like. You can always restyle them later, but a div that 'means' a heading can never be recovered.

Good semantics give you accessibility for free: screen readers can jump between landmarks, and search engines understand your page's outline.`,
      },
      {
        heading: "The page landmarks",
        body: `- \`<header>\` — intro content: logo, site title, usually at the top
- \`<nav>\` — a block of major navigation links
- \`<main>\` — the unique primary content of this page (one per page)
- \`<article>\` — a self-contained piece, like a blog post or review
- \`<section>\` — a thematic grouping, usually with its own heading
- \`<footer>\` — closing content: copyright, contact links

Reach for a semantic element first; take a \`<div>\` only when nothing matches.`,
      },
      {
        heading: "Interactive elements count too",
        body: `Anything clickable that acts like a button should be a \`<button>\`. Anything that navigates somewhere is an \`<a>\` with a real \`href\`. Browsers give these elements keyboard focus, forms submit them, and screen readers announce them correctly — none of that comes with a styled span.`,
      },
    ],
    examples: [
      {
        title: "A semantic page layout",
        description: "The skeleton of a typical blog page.",
        language: "html",
        code: `<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>

<main>
  <article>
    <h1>Why I Started Journaling</h1>
    <p>Ten minutes a day changed how I think.</p>
  </article>
  <section>
    <h2>Related posts</h2>
    <p>More stories from the archive.</p>
  </section>
</main>

<footer>
  <p>Copyright 2026</p>
</footer>`,
        lineNotes: [
          { code: `<header>`, note: "Intro content for the page — logo and site navigation usually live here." },
          { code: `<nav>`, note: "Marks a group of major navigation links; screen readers let users jump straight to it." },
          { code: `<main>`, note: "The unique main content of the page. Use it once per page." },
          { code: `<article>`, note: "A self-contained piece that would make sense in a feed or on its own." },
          { code: `<section>`, note: "A thematic grouping with its own heading, here 'Related posts'." },
          { code: `<footer>`, note: "Closing material such as copyright or contact information." },
        ],
      },
      {
        title: "Media that describes itself",
        description: "Images and text-level semantics.",
        language: "html",
        code: `<figure>
  <img src="harbor-sunset.jpg" alt="Orange sunset over a quiet harbor">
  <figcaption>The view from the ferry dock</figcaption>
</figure>

<p>Reading it felt like <em>a door opening</em> — see
<a href="/reviews/sea">my full review</a> for details.</p>`,
      },
    ],
    mistakes: [
      {
        wrong: "Building whole pages from nested divs ('div soup')",
        why: "Divs carry no meaning, so screen readers and search engines see an undifferentiated pile of boxes.",
        fix: "Use header, nav, main, article, section, and footer for structure; keep divs for genuinely anonymous grouping.",
      },
      {
        wrong: "Making a fake button: `<div class=\"button\" onclick=\"...\">`",
        why: "A div is not focusable with the Tab key and is not announced as interactive, so keyboard users miss it entirely.",
        fix: "Use a real `<button>` element and style it with CSS.",
      },
      {
        wrong: "Leaving out the alt attribute on images",
        why: "Screen readers then read the file name or skip the image, losing information the rest of the page depends on.",
        fix: "Every img needs an alt attribute — a short description, or an empty string if the image is purely decorative.",
      },
    ],
    quiz: [
      {
        question: "How many <main> elements should a page have?",
        options: ["One, wrapping the unique primary content", "One per section", "As many as you like"],
        answerIndex: 0,
        explanation: "`main` marks the single primary content region; repeatable groups like articles go inside it.",
      },
      {
        question: "Which element fits a standalone blog post best?",
        options: ["<div>", "<article>", "<footer>"],
        answerIndex: 1,
        explanation: "`article` means a self-contained composition — a post, a review, a comment.",
      },
    ],
    exercises: [
      {
        title: "De-soup a layout",
        prompt: "Rewrite the div-based layout below using four semantic elements so the meaning is clear.",
        language: "html",
        starterCode: `<div class="top">Welcome to my site</div>
<!-- nav links here -->
<div class="bottom">Copyright 2026</div>`,
        hint: "The top block is a <header> and the bottom one a <footer>; the links belong in a <nav>.",
      },
      {
        title: "Announce the navigation",
        prompt: "Add a nav element containing a short list of three links to your profile page from Lesson 1.",
        language: "html",
        starterCode: `<nav>
  <!-- three <a href=\"...\"> links -->
</nav>`,
        hint: "Each link needs a real href value, even \"#\" is acceptable while prototyping.",
      },
    ],
  },
  {
    slug: "css-selectors-and-cascade",
    title: "CSS Selectors and the Cascade",
    minutes: 12,
    objectives: [
      "Select elements with type, class, id, and descendant selectors",
      "Predict which rule wins when several target the same element",
      "Keep stylesheets maintainable by controlling specificity",
    ],
    sections: [
      {
        heading: "Picking elements",
        body: `A CSS rule is \`selector { declarations }\`. The everyday selectors you need first: \`p\` (every paragraph), \`.card\` (every element whose class is card), and \`#signup\` (the one element with that id). Classes are your main tool — name them for what they mean, like \`.warning\` or \`.toolbar\`, not what they look like.`,
      },
      {
        heading: "Combining selectors",
        body: `- \`section p\` — descendant: any p inside a section, at any depth
- \`.card.title\` — an element having both classes
- \`h1, h2\` — a group: same rules applied to both (the comma is essential)

The hover pseudo-class \`.link:hover\` applies only while the pointer is over the element.`,
      },
      {
        heading: "Who wins the cascade",
        body: `When two rules target the same property, the more **specific** one wins: id selectors beat classes, classes beat element types. Equal specificity is broken by source order — the rule written *later* in the file wins.

That is all there is to 'the cascade.' Specificity is best kept low and uniform: prefer classes everywhere, and you will rarely fight your own styles.`,
      },
    ],
    examples: [
      {
        title: "Four kinds of selectors",
        description: "One rule each, targeting the same shop page in different ways.",
        language: "css",
        code: `p {
  color: #333333;
}

.card {
  border: 1px solid #dddddd;
}

#signup {
  background: lavender;
}

.card p {
  font-size: 0.9rem;
}`,
        lineNotes: [
          { code: `p {`, note: "Type selector: matches every <p> on the page. Low specificity — good for defaults." },
          { code: `.card {`, note: "Class selector: matches every element with class=\"card\". Your workhorse selector." },
          { code: `#signup {`, note: "Id selector: matches the single element with id=\"signup\". Very specific — use sparingly." },
          { code: `.card p {`, note: "Descendant selector: any <p> anywhere inside a .card element." },
        ],
      },
      {
        title: "The cascade in action",
        description: "Both rules match the same element — the tie is broken by order.",
        language: "css",
        code: `.note {
  color: gray;
}

.note {
  color: darkgreen;
}

/* darkgreen wins: same specificity, later in the file */`,
      },
    ],
    mistakes: [
      {
        wrong: "Slapping inline style=\"...\" attributes on elements",
        why: "Inline styles beat every rule, so they cannot be overridden from the stylesheet and must be hunted down one tag at a time.",
        fix: "Give the element a class and put the declarations in the stylesheet.",
      },
      {
        wrong: "Reaching for !important the first time two rules disagree",
        why: "It hides the real problem — usually a specificity mismatch — and soon you need !important to fight your own !important.",
        fix: "Match the specificity of the rule that is winning, or write your rule later in the file.",
      },
      {
        wrong: "Styling everything through ids like `#header-h1`",
        why: "Id selectors are extremely specific, so overriding them later requires an even more specific (or later, or important) rule.",
        fix: "Style with classes; reserve ids for hooking single unique targets.",
      },
    ],
    quiz: [
      {
        question: "What does `.card p` select?",
        options: ["Only direct p children of a card", "Every p anywhere inside an element with class card", "A p with class card"],
        answerIndex: 1,
        explanation: "The space means descendant — it matches at any nesting depth. For direct children only you would write `.card > p`.",
      },
      {
        question: "Two rules with identical specificity both set the color of an element. Which applies?",
        options: ["The one earlier in the stylesheet", "The one later in the stylesheet", "They are merged, earlier wins"],
        answerIndex: 1,
        explanation: "With equal specificity, source order breaks the tie — later wins.",
      },
    ],
    exercises: [
      {
        title: "Target the teaser text",
        prompt: "Write a selector that colors only the paragraphs inside .post elements, leaving other paragraphs alone.",
        language: "css",
        starterCode: `/* selector + declaration block here */`,
        hint: "Start with .post, then a space, then p.",
      },
      {
        title: "Fix the specificity fight",
        prompt: "A `.intro { color: gray; }` rule is being beaten by an id rule. Rewrite your class rule so it wins *without* using !important.",
        language: "css",
        starterCode: `.intro {
  color: gray;
}
/* it loses to: #message { color: black; } */`,
        hint: "Move your rule below the id rule — with lower specificity, only source order can save you.",
      },
    ],
  },
  {
    slug: "box-model",
    title: "The Box Model",
    minutes: 12,
    objectives: [
      "Name the four layers of every element's box",
      "Be confident about width calculations using border-box",
      "Choose the right spacing property: padding or margin",
    ],
    sections: [
      {
        heading: "Four nested layers",
        body: `Every element renders as a rectangular box with four layers, painted from the inside out: **content** (your text or image), **padding** (breathing room inside, showing the background), **border** (the drawn edge), and **margin** (transparent space pushing neighbors away).

Padding is wallpapered; margin is never painted. That difference alone answers most 'why is my background off?' puzzles.`,
      },
      {
        heading: "Sizing with border-box",
        body: `By default \`width\` sizes the content only, so borders and padding are added on top — a 200px card with 2px borders is really 204px wide. Almost everyone fixes this once per project with \`box-sizing: border-box\`, after which \`width\` means the full box, padding and border included.

Set it globally on every element and stop doing arithmetic.`,
      },
      {
        heading: "Units you will actually use",
        body: `\`px\` is a fixed screen pixel — predictable, but blind to user font settings. \`rem\` is relative to the page's root font size (16px by default), so \`1.5rem\` scales for users who raise their font size. Percentages relate to the parent's size. For text spacing near text, rem is usually the best pick.`,
      },
    ],
    examples: [
      {
        title: "A card with border-box sizing",
        description: "One global rule plus a card that promises exactly 220px.",
        language: "css",
        code: `*, *::before, *::after {
  box-sizing: border-box;
}

.card {
  width: 220px;
  padding: 16px;
  border: 2px solid gray;
  margin: 24px auto;
}`,
        lineNotes: [
          { code: `*, *::before, *::after {`, note: "The universal selector plus pseudo-elements: the standard 'apply border-box everywhere' incantation." },
          { code: `box-sizing: border-box;`, note: "Width now includes padding and border, so the card is truly 220px wide." },
          { code: `padding: 16px;`, note: "Space inside the box, painted with the card's background." },
          { code: `border: 2px solid gray;`, note: "Shorthand: width, style, and color of the edge." },
          { code: `margin: 24px auto;`, note: "24px above and below, auto left and right centers the fixed-width card horizontally." },
        ],
      },
      {
        title: "Padding versus margin on the same box",
        description: "Padding shows the background; margin never does.",
        language: "css",
        code: `.pill {
  background: gold;
  padding: 8px 16px;   /* gold cushion, part of the pill */
  margin: 16px;        /* clear, unpainted space around it */
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Sizing without border-box and expecting width 200 to stay 200",
        why: "The content-box default adds padding and border on top of width, so elements overflow their planned space.",
        fix: "Turn on `box-sizing: border-box` globally at the start of every stylesheet.",
      },
      {
        wrong: "Using margin to add space *inside* a colored box",
        why: "Margin is outside the box and never painted, so the color appears to shrink away from your text.",
        fix: "That inward space is padding; keep margin for gaps between separate boxes.",
      },
      {
        wrong: "Setting widths on inline elements like `<span>`",
        why: "Inline elements ignore width and vertical padding — the rule silently does nothing.",
        fix: "Change the display type first, e.g. `display: inline-block`, or use an element that is already a block.",
      },
    ],
    quiz: [
      {
        question: "Which layer is painted with the element's background color?",
        options: ["Margin", "Padding", "Neither — only the border"],
        answerIndex: 1,
        explanation: "Padding sits inside the box and shows the background; margin is outside and always transparent.",
      },
      {
        question: "With box-sizing: border-box, width: 200px and padding: 20px give a total width of…",
        options: ["240px", "220px", "200px"],
        answerIndex: 2,
        explanation: "border-box means the declared width covers padding and border too, so the total stays exactly 200px.",
      },
    ],
    exercises: [
      {
        title: "Build a notification banner",
        prompt: "Style a fixed-width banner: 320px wide, 12px padding all around, a 1px navy border, and 16px of space separating it from elements above and below.",
        language: "css",
        starterCode: `.banner {
  /* four declarations here */
}`,
        hint: "You need width, padding, border, and margin declarations — write each on its own line.",
      },
      {
        title: "The whole-box reset",
        prompt: "Add the global border-box rule to a new stylesheet, then explain why the next width you write is a lie if you delete it.",
        language: "css",
        starterCode: `/* one rule that hits every element */`,
        hint: "The lesson's incantation starts with `*, *::before, *::after {`.",
      },
    ],
  },
  {
    slug: "flexbox-layout",
    title: "Flexbox Layout",
    minutes: 14,
    objectives: [
      "Turn a container into a flex row of items",
      "Position items with justify-content and align-items",
      "Use gap and flex to finish a real navigation bar",
    ],
    sections: [
      {
        heading: "One direction at a time",
        body: `Flexbox lays out the children of one container along a single line. Write \`display: flex\` on the **parent**; the children become flex items and sit in a row by default. \`flex-direction: column\` flips the line to vertical.

The line itself is the **main axis** (horizontal in a row); the perpendicular is the **cross axis**. Keep those two words handy — the two alignment properties map onto them exactly.`,
      },
      {
        heading: "Container properties",
        body: `- \`justify-content\` — spread items along the main axis: flex-start, space-between, center, space-evenly
- \`align-items\` — line items up on the cross axis: stretch (default), center, flex-start, flex-end
- \`gap\` — a clean, modern space between items

Vertical centering only works when the container actually has height, so give header bars a \`min-height\`.`,
      },
      {
        heading: "item properties",
        body: `Add \`flex: 1\` to a child to make it grow and fill leftover space — perfect for pushing a menu to the far end of a bar. \`align-self\` overrides the container's \`align-items\` for just that child, and order of children can be rearranged without touching the HTML (sparingly).`,
      },
    ],
    examples: [
      {
        title: "A navigation bar",
        description: "Brand on the left, links pushed to the right, everything vertically centered.",
        language: "css",
        code: `.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 56px;
}

.brand {
  flex: 0 0 auto;
}

.links {
  display: flex;
  gap: 16px;
}`,
        lineNotes: [
          { code: `display: flex;`, note: "Declares the container; the .navbar's children are now flex items in a row." },
          { code: `align-items: center;`, note: "Cross-axis alignment: centers the brand and links vertically in the bar." },
          { code: `justify-content: space-between;`, note: "Main-axis alignment: pushes brand to one end, links to the other." },
          { code: `gap: 12px;`, note: "Fixed spacing between flex items, replacing margin tricks." },
          { code: `min-height: 56px;`, note: "Without real height, vertical centering has nothing to center inside." },
          { code: `.links { display: flex; gap: 16px; }`, note: "Nested flex: the links are themselves a row with even spacing." },
        ],
      },
      {
        title: "Perfect centering in three lines",
        description: "The classic interview warm-up.",
        language: "css",
        code: `.stage {
  display: flex;
  justify-content: center;   /* horizontally */
  align-items: center;       /* vertically    */
  min-height: 100vh;
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Writing justify-content on the children instead of the container",
        why: "Alignment is a property of how the parent arranges its items; on a child it simply does nothing.",
        fix: "Put display and alignment on the parent, then flex and align-self on individual children.",
      },
      {
        wrong: "Adding align-items: center but no height on the container",
        why: "A block element's height hugs its content, so there is no extra vertical space to center within.",
        fix: "Give the container a min-height (or use 100vh) before centering.",
      },
      {
        wrong: "Reaching for floats to line items up inside a flex layout",
        why: "Floats pull content out of normal flow and fight flexbox's own placement model.",
        fix: "One system per box: use flex properties (and the gap property) for arrangement.",
      },
    ],
    quiz: [
      {
        question: "Which element should carry `display: flex`?",
        options: ["The parent that wraps the items", "Each item separately", "The body tag"],
        answerIndex: 0,
        explanation: "Flexbox is configured on the container; the children respond automatically.",
      },
      {
        question: "What does justify-content: space-between do in a row?",
        options: ["First item at the start, last at the end, evenly spread in between", "Squeezes all items to the center", "Adds equal gaps like a modern gap property"],
        answerIndex: 0,
        explanation: "It pins the ends and distributes remaining space evenly between items — like a lineup across a page.",
      },
    ],
    exercises: [
      {
        title: "Card row",
        prompt: "Make three cards sit in one row, 12px apart, each column stretching to fill equal width.",
        language: "css",
        starterCode: `.row {
  /* parent setup */

}

.card {
  /* child growth */

}`,
        hint: "Parent: display: flex and gap: 12px. Child: flex: 1.",
      },
      {
        title: "Center a dialog",
        prompt: "Center a login box perfectly in the middle of the viewport.",
        language: "css",
        starterCode: `.overlay {
  /* center both axes here */
}`,
        hint: "Use flexbox with justify-content and align-items both set to center, plus a viewport-tall min-height.",
      },
    ],
  },
  {
    slug: "grid-layout",
    title: "Grid Layout",
    minutes: 14,
    objectives: [
      "Define rows and columns with grid-template and fr units",
      "Build a responsive card grid with repeat and minmax",
      "Decide when grid is a better fit than flexbox",
    ],
    sections: [
      {
        heading: "Rows and columns together",
        body: `Grid is the two-dimensional layout tool: you define both rows and columns on the parent, and children fall into the cells. Write \`display: grid\` plus \`grid-template-columns\`; rows can be left to grow naturally with \`grid-auto-rows\` or sized explicitly.

Use grid when alignment matters in **both** directions — a page skeleton, a gallery, a form. For a single line of items, flexbox is simpler.`,
      },
      {
        heading: "Tracks in units",
        body: `\`grid-template-columns: 1fr 2fr\` splits width into three fraction units, with the second column twice as wide. \`repeat(3, 1fr)\` is shorthand for three equal columns, and \`gap\` spaces the cells without margin hacks.

The responsive workhorse is \`repeat(auto-fit, minmax(180px, 1fr))\`: as many columns as fit at 180px minimum, stretched to fill. The columns re-wrap when the window resizes — no media queries needed.`,
      },
      {
        heading: "Placing items deliberately",
        body: `Usually auto-placement is enough: items flow row by row. To span, \`grid-column: 1 / 3\` stretches an item across columns 1 and 2, and \`grid-row\` does the same vertically. Named template areas exist for big page skeletons — worth a look once the fundamentals click.`,
      },
    ],
    examples: [
      {
        title: "A responsive card grid",
        description: "Columns appear and disappear automatically as the window changes.",
        language: "css",
        code: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.feature {
  grid-column: 1 / -1;
}`,
        lineNotes: [
          { code: `display: grid;`, note: "Turns .gallery into a grid container; its children become grid items." },
          { code: `repeat(auto-fit, minmax(180px, 1fr))`, note: "As many columns as fit with a 180px minimum, each stretched to an equal share of leftover space." },
          { code: `gap: 16px;`, note: "One declaration spaces rows and columns alike." },
          { code: `grid-column: 1 / -1;`, note: "Makes the .feature item span from the first to the last line — a full-width row." },
        ],
      },
      {
        title: "A simple equal-column layout",
        description: "The column widths hold on any screen.",
        language: "css",
        code: `.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-auto-rows: min-content;
  gap: 24px;
}`,
      },
    ],
    mistakes: [
      {
        wrong: "Setting grid-template-columns but forgetting display: grid",
        why: "Template properties only apply to a grid container; without it they are ignored and the layout looks untouched.",
        fix: "Always pair `display: grid` with your template lines.",
      },
      {
        wrong: "Hard-coding pixel columns like `repeat(3, 300px)`",
        why: "Once the screen is narrower than 900px the overflow begins — the grid never adapts.",
        fix: "Use `repeat(auto-fit, minmax(min, 1fr))` so the browser calculates the column count.",
      },
      {
        wrong: "Adding margins to grid items instead of using gap",
        why: "Item margins leave stray space at the outer edges and uneven track alignment.",
        fix: "One `gap` on the container spaces every cell cleanly.",
      },
    ],
    quiz: [
      {
        question: "What does `grid-template-columns: repeat(3, 1fr)` create?",
        options: ["Three columns, each one third of the free space", "Rows of 3px height", "Three rows, one column wide"],
        answerIndex: 0,
        explanation: "repeat(3, 1fr) is shorthand for `1fr 1fr 1fr` — three equal fraction-sized columns.",
      },
      {
        question: "Grid versus flexbox: which fits laying out a full page skeleton?",
        options: ["Grid, because rows and columns are defined together", "Flexbox, because it wraps automatically", "They are identical"],
        answerIndex: 0,
        explanation: "Grid is the two-dimensional tool — header, sidebar, and content align on both axes at once.",
      },
    ],
    exercises: [
      {
        title: "Equal-thirds gallery",
        prompt: "Lay out photos in exactly three equal columns with 20px gutters and matching row spacing.",
        language: "css",
        starterCode: `.photos {
  /* grid container setup */

}`,
        hint: "Use repeat(3, 1fr) for the columns and set gap once.",
      },
      {
        title: "Self-adjusting columns",
        prompt: "Rewrite the gallery so the browser decides the column count: cards at least 220px wide, filling all leftover space.",
        language: "css",
        starterCode: `.shelf {
  display: grid;
  /* column template here */
}`,
        hint: "Combine repeat/auto-fit with minmax(220px, 1fr).",
      },
    ],
  },
  {
    slug: "responsive-design",
    title: "Responsive Design Basics",
    minutes: 12,
    objectives: [
      "Explain the viewport meta tag's role on phones",
      "Write mobile-first media queries with min-width",
      "Prefer relative units and wrapping so layout flexes by itself",
    ],
    sections: [
      {
        heading: "One page, many screens",
        body: `Responsive design means one HTML file that reflows gracefully from a phone to a desktop. Two ingredients do most of the work: the viewport \`<meta>\` tag so phones trust your widths, and CSS that avoids fixed pixel scaffolding.

The mindset is **mobile-first**: style the narrow case with plain CSS, then add enhancements as screens grow.`,
      },
      {
        heading: "The viewport tag",
        body: `Phone browsers default to pretending the page is 980px wide and zoomed out — that is how desktop sites are shown on a tiny screen. Reaching desktop users starts here:

Include \`<meta name="viewport" content="width=device-width, initial-scale=1">\` in the head and your layout maps onto the real device width.`,
      },
      {
        heading: "Media queries",
        body: `A media query wraps rules that apply only at certain screen sizes. Mobile-first queries use \`(min-width: ...)\` — 'at 700px or wider, apply this.' Nested inside, list only the deltas: widen the container into two columns, enlarge type.

Write base styles with relative units — rem for type and spacing, percentages or max-width for containers — plus \`flex-wrap: wrap\` on rows, and many pages barely need queries at all.`,
      },
    ],
    examples: [
      {
        title: "Mobile first, then wider",
        description: "Base styles serve phones; the query upgrades larger screens.",
        language: "css",
        code: `.post {
  font-size: 1rem;
  max-width: 100%;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 100%;
}

@media (min-width: 700px) {
  .card {
    flex: 1 1 calc(50% - 8px);
  }
}`,
        lineNotes: [
          { code: `.post { max-width: 100%; }`, note: "Fluid default: content can never be wider than its container." },
          { code: `flex-wrap: wrap;`, note: "Lets items flow onto new rows instead of squeezing or overflowing." },
          { code: `flex: 1 1 100%;`, note: "Base state: one card per row — the phone layout." },
          { code: `@media (min-width: 700px) {`, note: "Applies the nested rules only when the viewport is 700px or wider." },
          { code: `flex: 1 1 calc(50% - 8px);`, note: "Two cards per row, minus half the gap for each." },
        ],
      },
      {
        title: "The viewport meta tag",
        description: "Without it, phones scale the page down.",
        language: "html",
        code: `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Works on my phone</title>
</head>`,
      },
    ],
    mistakes: [
      {
        wrong: "Locking wrappers to a fixed width like width: 1200px",
        why: "On narrower screens the content overflows sideways and users scroll horizontally forever.",
        fix: "Use max-width with fluid width, e.g. `max-width: 1200px; width: 100%` plus margin auto.",
      },
      {
        wrong: "Shipping a stylesheet with no viewport meta tag",
        why: "Mobile browsers assume a 980px canvas, then scale it down — your carefully sized text is unreadable.",
        fix: "Add the viewport meta element to the head of every page.",
      },
      {
        wrong: "Confusing min-width and max-width in media queries",
        why: "\`(max-width: 700px)\` applies *below* 700px — a desktop-first habit that leads to stacked overrides.",
        fix: "In a mobile-first stylesheet reach for \`(min-width: ...)\` to layer styles as screens grow.",
      },
    ],
    quiz: [
      {
        question: "What does the viewport meta tag change?",
        options: ["The page's color scheme on phones", "That phone browsers use the real device width for layout", "How fast the page loads"],
        answerIndex: 1,
        explanation: "It opts out of the fake 980px view so your widths and media queries match the true screen.",
      },
      {
        question: "When does `@media (min-width: 600px)` apply?",
        options: ["Only on screens narrower than 600px", "Always", "On viewports 600px wide or larger"],
        answerIndex: 2,
        explanation: "min-width means 'this width or bigger' — the building block of mobile-first styles.",
      },
    ],
    exercises: [
      {
        title: "Two columns on desktop",
        prompt: "Extend the card list so phones get one column and screens 640px and wider get two, using the mobile-first pattern.",
        language: "css",
        starterCode: `.card {
  flex: 1 1 100%;
}

/* only wider screens below */
`,
        hint: "Open `@media (min-width: 640px) { ... }` and restate the flex basis for two columns.",
      },
      {
        title: "Audit a page",
        prompt: "Open one of your earlier exercise pages in the browser's device emulator. List every fixed width you find and convert each to a fluid or max-width equivalent.",
        language: "css",
        starterCode: `/* BEFORE: width: 480px;   AFTER: */
`,
        hint: "Keep the design's cap with max-width: 480px while letting width stay fluid.",
      },
    ],
  },
];
