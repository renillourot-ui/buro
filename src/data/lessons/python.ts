import type { Lesson } from "@/types/course";

export const pythonLessons: Lesson[] = [
  {
    slug: "introduction-to-python",
    title: "Introduction to Python",
    minutes: 10,
    objectives: [
      "Explain what Python is and why it is beginner friendly",
      "Run your first program with print and comments",
      "Predict what a one-line Python expression will output",
    ],
    sections: [
      {
        heading: "Python in one minute",
        body: `Python is a general-purpose language known for readable code — no semicolons, no curly braces, no type declarations to start. Programs are stored in \`.py\` files and run line by line from top to bottom by the Python interpreter.

Because the standard library ships with Python, the examples in this course run anywhere Python 3 is installed, with just one command.`,
      },
      {
        heading: "Your first program",
        body: `The \`print()\` function displays a value in the terminal — it is how your program talks to the person running it. Lines starting with \`#\` are comments: Python ignores them, and they exist purely for human readers.

Every Python file you write in this course can be run with \`python3 filename.py\` in a terminal.`,
      },
      {
        heading: "Errors are feedback, not failure",
        body: `When Python finds a mistake it stops and prints a traceback: the file and line number, followed by the error type like \`SyntaxError\`. Beginners often feel alarmed, but tracebacks read like a map — check the line mentioned last, fix the issue, and run again. Reading errors calmly is a core skill.`,
      },
    ],
    examples: [
      {
        title: "Hello, Python",
        description: "The smallest useful program: output, a comment, and a little math.",
        language: "python",
        code: `# My first Python program
print("Hello, Python!")
print("Two plus three is", 2 + 3)`,
        lineNotes: [
          { code: `# My first Python program`, note: "A comment. Python skips this line entirely — it is for human readers." },
          { code: `print("Hello, Python!")`, note: "Calls the built-in print function with one argument: the text to display." },
          { code: `print("Two plus three is", 2 + 3)`, note: "Multiple arguments are printed with a space between them. The math is evaluated first, then printed." },
        ],
      },
      {
        title: "A tiny survey script",
        description: "input() pauses and waits for the user to type a line.",
        language: "python",
        code: `name = input("What is your name? ")
print("Nice to meet you", name)
print(name, "has", len(name), "letters")`,
      },
    ],
    mistakes: [
      {
        wrong: "Writing print \"Hello\" without parentheses",
        why: "That is outdated Python 2 syntax. In Python 3, print is a function and requires parentheses.",
        fix: "Always call print like a function: print(\"Hello\").",
      },
      {
        wrong: "Writing Print or PRINT instead of print",
        why: "Python is case sensitive, so Print and PRINT are unknown names and raise a NameError.",
        fix: "Use lowercase print when calling it.",
      },
      {
        wrong: "Indenting lines by hand 'to look nice'",
        why: "In Python, indentation is grammar — a randomly indented line triggers an IndentationError.",
        fix: "Indent only when you intend a block, using four spaces consistently.",
      },
    ],
    quiz: [
      {
        question: "What does print(\"7 + 3\", 7 + 3) display?",
        options: ["7 + 3", "10", "7 + 3 10"],
        answerIndex: 2,
        explanation: "The quoted part is printed literally, then the second argument 7 + 3 is evaluated to 10 and printed after a space.",
      },
      {
        question: "How do you write a note in the code that Python ignores?",
        options: ["// like this", "# like this", "<!-- like this -->"],
        answerIndex: 1,
        explanation: "Everything after a # on a line is a comment; // is from other languages and is a syntax error in Python.",
      },
    ],
    exercises: [
      {
        title: "Introduce yourself",
        prompt: "Write a program that prints three lines: your name, your favorite food, and one thing you want to build with Python.",
        language: "python",
        starterCode: `# three print calls here
`,
        hint: "Each line needs its own print() call — they run top to bottom.",
      },
      {
        title: "Machine math",
        prompt: "Print the results of 365 * 24 (hours in a year) and 60 * 60 * 24 (seconds in a day) with a short label before each number.",
        language: "python",
        starterCode: `print("Hours in a year:", ...)`,
        hint: "Keep the calculation as the second argument and let print do the work.",
      },
    ],
  },
  {
    slug: "variables-and-basic-types",
    title: "Variables and Basic Types",
    minutes: 12,
    objectives: [
      "Create variables with clear names",
      "Recognize the core types: int, float, str, and bool",
      "Convert between types with int(), float(), and str()",
    ],
    sections: [
      {
        heading: "Names for values",
        body: `A variable is a label attached to a value. The assignment operator \`=\` stores on the right into the name on the left: \`score = 12\`. No declaration needed — the type comes from the value itself, and you can reassign a variable (even to a different type) any time.

Names are snake_case in Python: lowercase words joined by underscores. Python is dynamically typed, which keeps quick scripts short while still requiring good names to stay readable.`,
      },
      {
        heading: "The core types",
        body: `- \`int\` — whole numbers: 42, -7, 0
- \`float\` — decimals: 3.14, -0.5 (note that 1.0 is a float, not an int)
- \`str\` — text in quotes: \"hello\" (uppercase, spaces, punctuation all preserved)
- \`bool\` — the two constants True and False

Calling \`type(x)\` tells you what you have, and comparing values with \`==\` is your everyday check.`,
      },
      {
        heading: "Converting on purpose",
        body: `Every value has a type, and mixing them can matter: \`\"3\" + 4\` is a TypeError, but \`int(\"3\") + 4\` is 7. Use \`int()\`, \`float()\`, and \`str()\` to convert deliberately — and \`round()\` to trim a messy float like 0.1 + 0.2 into 0.3. Conversions happen constantly when handling user input, since input text must become a number before math works.`,
      },
    ],
    examples: [
      {
        title: "Four core types",
        description: "Assign, inspect, and reassign.",
        language: "python",
        code: `name = "Ada"        # str
age = 36            # int
height = 1.68       # float
likes_python = True # bool

print(type(age))    # <class 'int'>
print(name, "is", age, "years old")

age = age + 1       # reassign: now 37
print("Next year:", age)`,
        lineNotes: [
          { code: `name = "Ada"`, note: "Assignment. The type is inferred from the value, here str." },
          { code: `age = 36`, note: "A plain integer. No quotes — with quotes it would be text." },
          { code: `height = 1.68`, note: "A decimal literal is always a float." },
          { code: `likes_python = True`, note: "Booleans are capitalized exactly this way: True, False." },
          { code: `print(type(age))`, note: "type() returns the value's type — a handy debugging tool." },
          { code: `age = age + 1`, note: "Reads the current value, adds one, then rebinds the name to the result." },
        ],
      },
      {
        title: "Converting between types",
        description: "String and number forms of the same digits are different values.",
        language: "python",
        code: `text = "25"
number = int(text)     # 25 as an int
price = float("9.99")  # 9.99 as a float
label = str(3 + 4)     # "7" as text

print(number + 5)      # 30  (numeric addition)
print(label + "!")     # 7!  (string joining)`,
      },
    ],
    mistakes: [
      {
        wrong: "Naming a variable 2nd_place or user-name",
        why: "Names cannot start with a digit and hyphens are read as subtraction.",
        fix: "Start with a letter and join words with underscores: second_place, user_name.",
      },
      {
        wrong: "Forgetting quotes around text: city = Paris",
        why: "Without quotes Python looks for a *variable* called Paris and raises a NameError.",
        fix: "Strings always need quotes: city = \"Paris\".",
      },
      {
        wrong: "Doing math on text from input(): age = input(); age + 1",
        why: "input() returns a str, and \"25\" + 1 mixes types — a TypeError.",
        fix: "Convert first: age = int(input()).",
      },
    ],
    quiz: [
      {
        question: "What is type(3.0)?",
        options: ["int", "float", "str"],
        answerIndex: 1,
        explanation: "A numeric literal with a decimal point is a float, even when the value is a whole number.",
      },
      {
        question: "Which line succeeds without an error?",
        options: ["\"5\" + 5", "int(\"5\") + 5", "\"5\" + int(5)"],
        answerIndex: 1,
        explanation: "int(\"5\") turns text into a number so both operands are ints; the others mix str and int and raise TypeError.",
      },
    ],
    exercises: [
      {
        title: "Label the zoo",
        prompt: "Create four variables — an animal name, its age in years, its weight in kilograms, and whether it is endangered — then print each with a matching type check.",
        language: "python",
        starterCode: `animal = ...
age = ...
weight = ...
endangered = ...
print(type(age))`,
        hint: "Match each value's kind of data to the four types from this lesson.",
      },
      {
        title: "Fix the TypeError",
        prompt: "This line crashes: print(\"Total: \" + 5 + 7). Change the smallest possible thing so it prints Total: 12.",
        language: "python",
        starterCode: `print("Total: " + 5 + 7)`,
        hint: "Convert the text to a number first with int().",
      },
    ],
  },
  {
    slug: "strings-and-formatting",
    title: "Strings and Formatting",
    minutes: 12,
    objectives: [
      "Build strings that mix text and values with f-strings",
      "Slice and index strings with square brackets",
      "Use the most common string methods",
    ],
    sections: [
      {
        heading: "f-strings are the modern way",
        body: `An f-string is a string literal prefixed with \`f\`; any expression inside \`{ }\` is evaluated and spliced in: \`f\"Score: {score}\"\`. It is shorter and more readable than stitching values together with commas or \`+\` — make it your default.

Inside the braces you may call methods too: \`f\"Hi {name.title()}\"\`. Just remember the braces belong to the f-string, so an unmatched one is a syntax error.`,
      },
      {
        heading: "Indexing and slicing",
        body: `Characters have positions starting at 0: \`word[0]\` is the first character, \`word[-1]\` the last. A slice \`word[1:4]\` takes positions 1 up to but not including 4 — the end index is always exclusive, matching \`range()\` behavior.

Strings are immutable: methods never change the original, they return a new string. That is why a bare \`name.replace(...)\` on its own line appears to do nothing.`,
      },
      {
        heading: "The everyday methods",
        body: `- \`.upper()\` / \`.lower()\` — change case
- \`.strip()\` — trim whitespace from both ends
- \`.replace(a, b)\` — substitute every occurrence
- \`.count(sub)\`, \`.startswith(sub)\` — ask questions about the text

The \`len()\` builtin returns the length of any string.`,
      },
    ],
    examples: [
      {
        title: "Formatting with f-strings",
        description: "Building a tidy sentence from separate values.",
        language: "python",
        code: `name = "Grace"
apples = 3
price_per_apple = 0.75

total = apples * price_per_apple
print(f"{name} buys {apples} apples for {total:.2f} dollars")`,
        lineNotes: [
          { code: `f"{name} buys {apples} apples", ...`, note: "Inside an f-string, each {expression} is replaced by its value at run time." },
          { code: `{total:.2f}`, note: "A format spec: rounds the float to exactly 2 decimal places." },
          { code: `apples * price_per_apple`, note: "int times float gives a float such as 2.25." },
        ],
      },
      {
        title: "Slicing and methods",
        description: "Remember: each call returns a new string.",
        language: "python",
        code: `word = "Lighthouse"
print(word[0])        # L
print(word[-1])       # e
print(word[1:5])      # ight
print(word.lower())   # lighthouse
print(word.replace("house", "keeper"))   # lightkeeper

user_input = "   hello   "
print(user_input.strip())                # hello`,
      },
    ],
    mistakes: [
      {
        wrong: "Mixing text and numbers with + : \"Age: \" + 12",
        why: "Python refuses to concatenate str and int — it does not guess what you meant.",
        fix: "Use an f-string: f\"Age: {12}\".",
      },
      {
        wrong: "Expecting name.upper() to change name itself",
        why: "Strings are immutable, so methods return new strings and leave the original alone.",
        fix: "Assign the result: name = name.upper().",
      },
      {
        wrong: "Reading past the end: word[99] on a short word",
        why: "Single-character indexing must be in range; slicing, in contrast, is forgiving and just stops at the end.",
        fix: "Check len(word) first, or prefer slices like word[:5] where safe.",
      },
    ],
    quiz: [
      {
        question: "What does f\"1 + 1 = {1 + 1}\" print?",
        options: ["1 + 1 = {1 + 1}", "1 + 1 = 2", "1 + 1 = 11"],
        answerIndex: 1,
        explanation: "The expression in braces is evaluated first, then inserted: 2.",
      },
      {
        question: "With word = \"python\", what is word[2:5]?",
        options: ["tho", "yth", "tho "],
        answerIndex: 0,
        explanation: "Slice runs from index 2 up to (not including) 5: t, h, o.",
      },
    ],
    exercises: [
      {
        title: "Nametag",
        prompt: "Ask the user for their name and their favorite number with input(), then print one f-string sentence containing both.",
        language: "python",
        starterCode: `name = input("Your name: ")
# favorite number next
print(...)`,
        hint: "Numbers from input() may stay as text — an f-string prints anything happily.",
      },
      {
        title: "Initials",
        prompt: "Given full_name = \"Ada Lovelace\", print her initials by slicing the first letter of each word.",
        language: "python",
        starterCode: `full_name = "Ada Lovelace"

# using [0] and slicing`,
        hint: "full_name[0] is the first initial; find the index just after the space for the second.",
      },
    ],
  },
  {
    slug: "conditional-statements",
    title: "Conditional Statements",
    minutes: 12,
    objectives: [
      "Branch your program with if, elif, and else",
      "Combine conditions with ==, and, or, and not",
      "Trace which branch runs for a given input",
    ],
    sections: [
      {
        heading: "The if statement",
        body: `\`if\` runs a block of code only when its condition is true. The pattern is: \`if condition:\` on its own line, then the indented block beneath it. The **colon** and the **indentation** are both part of the syntax — forgetting either is a SyntaxError.

If the condition is false, the block is skipped entirely and execution continues after it.`,
      },
      {
        heading: "elif and else",
        body: `\`elif\` ('else if') adds another test, checked only when all earlier conditions failed. \`else\` catches everything remaining and takes no condition. Python runs the *first* branch whose test is true and then skips the rest of the chain.

Order the tests from specific to general: most conditions depend on earlier ones being false.`,
      },
      {
        heading: "Building conditions",
        body: `- \`==\` tests equality (assign is \`=\`, compare is \`==\`)
- \`!=\`, \`<\`, \`<=\`, \`>\`, \`>=\` are the other comparisons
- \`and\` is true only if both sides are true; \`or\` if either is; \`not\` flips
- Values like 0 and \"\" count as false ('truthiness')

Parentheses group complex tests when needed: \`if (a == 1) and (b == 2):\``,
      },
    ],
    examples: [
      {
        title: "Grading scale",
        description: "One test runs — the first true branch wins.",
        language: "python",
        code: `score = 87

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: keep practicing")`,
        lineNotes: [
          { code: `if score >= 90:`, note: "First test. The colon ends the condition line." },
          { code: `    print("Grade: A")`, note: "The indented block only runs when the test above it is true." },
          { code: `elif score >= 80:`, note: "Checked only because 87 failed the first test. It passes, so later branches are skipped." },
          { code: `else:`, note: "No condition here — it runs only when every earlier test failed." },
        ],
      },
      {
        title: "Combining conditions",
        description: "and, or, and not in one check.",
        language: "python",
        code: `age = 20
has_ticket = True

if age >= 18 and has_ticket:
    print("Enjoy the show!")
else:
    print("Sorry, you cannot enter.")`,
      },
    ],
    mistakes: [
      {
        wrong: "if x = 5: (single equals in a condition)",
        why: "= assigns; it cannot be used as a test, so Python reports a syntax error.",
        fix: "Compare with == : if x == 5:.",
      },
      {
        wrong: "Leaving the colon off the if line",
        why: "The colon is required punctuation — without it Python cannot parse the block that follows.",
        fix: "End every if, elif, and else line with :.",
      },
      {
        wrong: "Forgetting that empty strings and 0 are falsy",
        why: "if name: runs its block whenever name is non-empty — including the string \" \" and the string \"0\".",
        fix: "Decide deliberately: if name != \"\": is clearer when you mean 'user typed something'.",
      },
    ],
    quiz: [
      {
        question: "With x = 0, what does the code print?",
        options: ["zero", "not zero", "nothing is printed"],
        answerIndex: 1,
        explanation: "The number 0 is falsy, so the if branch is skipped and else runs.",
      },
      {
        question: "In one if/elif/elif/else chain, how many branches run?",
        options: ["Exactly one", "All that are true", "At least two"],
        answerIndex: 0,
        explanation: "Python takes the first true condition and skips the rest; if none is true, else runs.",
      },
    ],
    exercises: [
      {
        title: "Pass or retry",
        prompt: "Given score = 55, print 'Pass' when it is 60 or more, otherwise 'Retry'.",
        language: "python",
        starterCode: `score = 55
if ...:
    print("Pass")
else:
    ...`,
        hint: "Passing means score >= 60.",
      },
      {
        title: "Leap-year checker",
        prompt: "Write a condition that prints 'Leap year' when year is divisible by 4 and not by 100 — or divisible by 400. Test it with 2000, 1900, and 2024.",
        language: "python",
        starterCode: `year = 2024
if ...:
    print("Leap year")`,
        hint: "Divisibility uses the % operator: year % 4 == 0.",
      },
    ],
  },
  {
    slug: "loops",
    title: "Loops",
    minutes: 14,
    objectives: [
      "Repeat work with a for loop over range()",
      "Keep running with while until a condition changes",
      "Control the flow with break and continue",
    ],
    sections: [
      {
        heading: "for over range()",
        body: `\`for\` walks through a sequence one item at a time. With \`range\` you get the integers you need: \`range(4)\` yields 0, 1, 2, 3 — the stop value is exclusive. Two arguments set the start: \`range(1, 5)\` is 1, 2, 3, 4, and a third sets the step, like \`range(0, 10, 2)\`.

\`range(0, 10, 2)\` steps by 2 — handy for evens.`,
      },
      {
        heading: "while",
        body: `\`while\` repeats as long as its condition stays true — perfect when you do not know the number of repetitions ahead of time, such as asking until the user types a valid answer. Something inside the loop **must** eventually make the condition false, or the loop never ends (an infinite loop — stop it with Ctrl+C).`,
      },
      {
        heading: "break and continue",
        body: `\`break\` exits the loop immediately; \`continue\` skips the rest of the current pass and jumps to the next one. Both keep loops readable when used sparingly — a \`while True:\` loop with a \`break\` on the exit condition is a common, honest pattern for menus and prompts.`,
      },
    ],
    examples: [
      {
        title: "Counting with for and range",
        description: "Sum the integers from 1 to 5.",
        language: "python",
        code: `total = 0
for n in range(1, 6):
    total = total + n
    print("Now at", n, "total is", total)

print("Final total:", total)`,
        lineNotes: [
          { code: `total = 0`, note: "A variable to accumulate results, set up before the loop starts." },
          { code: `for n in range(1, 6):`, note: "n takes the values 1, 2, 3, 4, 5 — the stop value 6 is excluded." },
          { code: `    total = total + n`, note: "Runs once per loop iteration, adding the current n to the running total." },
          { code: `print("Final total:", total)`, note: "Unindented, so it runs once after the loop has finished." },
        ],
      },
      {
        title: "while loop with break",
        description: "Ask until the answer is valid.",
        language: "python",
        code: `while True:
    answer = input("Type 'go' to continue: ")
    if answer == "go":
        break
    print("Try again")

print("You made it.")`,
      },
    ],
    mistakes: [
      {
        wrong: "for i in range(5) expecting i to reach 5",
        why: "range's stop value is exclusive: the loop yields 0 through 4.",
        fix: "Use range(1, 6) when you want the values 1 through 5.",
      },
      {
        wrong: "A while loop where the condition never changes",
        why: "while waiting != 'go': with no code that changes waiting runs forever.",
        fix: "Update the loop variable inside the block, or break when you are done.",
      },
      {
        wrong: "Trying for x in 5: (looping over a plain number)",
        why: "Integers are not sequences, so Python raises a TypeError — it has nothing to step through.",
        fix: "Wrap it in range: for x in range(5):.",
      },
    ],
    quiz: [
      {
        question: "Which numbers does range(3) produce?",
        options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3"],
        answerIndex: 1,
        explanation: "range starts at 0 by default and stops before the given value.",
      },
      {
        question: "When is a while loop usually the better choice?",
        options: ["When the number of repetitions is fixed", "When it should run until something becomes true or false", "Never — for is always better"],
        answerIndex: 1,
        explanation: "while is condition-driven: ideal when the loop count is unknown in advance.",
      },
    ],
    exercises: [
      {
        title: "Times table",
        prompt: "Print the 7 times table from 7 times 1 to 7 times 10, one line each.",
        language: "python",
        starterCode: `for n in range(1, 11):
    ...  # print one line per n
`,
        hint: "Use an f-string so you can show both n and 7 * n on one line.",
      },
      {
        title: "Countdown",
        prompt: "Use a while loop to count down from 5 to 1, printing each number, then print 'Launch!'.",
        language: "python",
        starterCode: `count = 5
while count > 0:
    ...`,
        hint: "Remember to decrease count inside the loop body, otherwise it never ends.",
      },
    ],
  },
  {
    slug: "functions",
    title: "Functions",
    minutes: 14,
    objectives: [
      "Define functions with def, parameters, and return",
      "Set sensible default values for optional parameters",
      "Predict what a function call evaluates to",
    ],
    sections: [
      {
        heading: "def and return",
        body: `A function packages lines of code under a name so you can reuse them. \`def name(parameters):\` starts the definition; the indented block is the body, and it does nothing until you call it.

Use \`return\` to hand a value back — the call site \`greet(\"Ada\")\` is then an *expression* you can print, store, or pass along. A function with no return gives back the special value \`None\`.`,
      },
      {
        heading: "Parameters and arguments",
        body: `Values you pass in are arguments; the names that receive them are parameters. Pass them positionally (\`greet(\"Ada\", 3)\`) or by name (\`greet(times=3, name=\"Ada\")\`) — kwargs read like documentation at the call site.

Calling with too few arguments for the required parameters is a TypeError; Python tells you exactly which names are missing.`,
      },
      {
        heading: "Defaults keep calls short",
        body: `A parameter with \`= value\` becomes optional: \`def order(size=\"medium\", express=False):\`. Give every function one clear job, trie to name them as verbs (\`print_report\`, \`format_price\`), and return early for edge cases instead of deep nesting.`,
      },
    ],
    examples: [
      {
        title: "Define once, call often",
        description: "Parameters, a return value, and a default argument.",
        language: "python",
        code: `def area(width, height):
    return width * height

def greet(name, punctuation="!"):
    return "Hello, " + name + punctuation

print(area(3, 4))          # 12
a = area(5, 2)
print("The area is", a)    # The area is 10
print(greet("Ada"))        # Hello, Ada!
print(greet("Bo", "?"))    # Hello, Bo?`,
        lineNotes: [
          { code: `def area(width, height):`, note: "Declares a function named area taking two parameters." },
          { code: `return width * height`, note: "Sends the product back to wherever area was called." },
          { code: `area(3, 4)`, note: "The call. Its value (12) goes straight into print." },
          { code: `def greet(name, punctuation="!")`, note: "punctuation has a default, so callers may omit it." },
          { code: `greet("Bo", "?")`, note: "Positional arguments fill parameters left to right: ? overrides the default." },
        ],
      },
      {
        title: "A return in the middle",
        description: "Returning early handles special cases first.",
        language: "python",
        code: `def is_even(n):
    if n % 2 == 0:
        return True
    return False

numbers = [3, 8, 5]
for n in numbers:
    print(n, "even?", is_even(n))`,
      },
    ],
    mistakes: [
      {
        wrong: "Calling the function before defining it",
        why: "Python runs top to bottom; a name lookup fails until its def line has executed.",
        fix: "Keep definitions above the calls that use them.",
      },
      {
        wrong: "Using print() inside the function instead of return",
        why: "Printing only shows text — the call evaluates to None, so results cannot be reused or combined.",
        fix: "return the value; call print() at the call site.",
      },
      {
        wrong: "Calling area(3) with a missing argument",
        why: "Every required parameter must receive a value, so area(3) raises a TypeError naming the missing argument.",
        fix: "Pass two arguments, or give height a default in the definition.",
      },
    ],
    quiz: [
      {
        question: "What does a function call evaluate to when the body has no return statement?",
        options: ["0", "An empty string", "None"],
        answerIndex: 2,
        explanation: "Python returns None by default — that is why print() inside a function does not hand anything back.",
      },
      {
        question: "With def f(a, b=2), which call is invalid?",
        options: ["f(1)", "f(1, 9)", "f()"],
        answerIndex: 2,
        explanation: "The parameter a is required, so f() raises a TypeError; b's default makes it optional.",
      },
    ],
    exercises: [
      {
        title: "Temperature converter",
        prompt: "Write celsius_to_fahrenheit(c) that returns c * 9 / 5 + 32, then call it on 0, 37, and 100 and print each result.",
        language: "python",
        starterCode: `def celsius_to_fahrenheit(c):
    ...

print(celsius_to_fahrenheit(0))`,
        hint: "The function body is a single return line.",
      },
      {
        title: "Loud greetings",
        prompt: "Write shout(text, times=2) that returns the uppercased text joined by spaces, repeated the given number of times.",
        language: "python",
        starterCode: `def shout(text, times=2):
    ...

print(shout("hi"))
print(shout("hi", 3))`,
        hint: "UpperCase with .upper(), then join copies with \" \".join(...).",
      },
    ],
  },
  {
    slug: "lists-and-dictionaries",
    title: "Lists and Dictionaries",
    minutes: 14,
    objectives: [
      "Store ordered values in lists and use their common operations",
      "Store labelled values in dictionaries and read them safely",
      "Loop over both structures cleanly",
    ],
    sections: [
      {
        heading: "Lists: ordered collections",
        body: `\`todos = [\"write\", \"test\", \"ship\"]\` — square brackets make a list. Index from 0 (\`todos[0]\`) or from the end (\`todos[-1]\`); slices work like strings. Lists are **mutable**: \`.append(item)\` adds, \`.pop()\` removes the last item, and plain assignment edits in place.

Handy builtins: \`len(todos)\`, \`sum(numbers)\`, and \`max(scores)\`. Test membership with \`\"write\" in todos\`.`,
      },
      {
        heading: "Dictionaries: labelled data",
        body: `\`book = {\"title\": \"Dune\", \"pages\": 412}\` maps keys to values. Read with \`book[\"title\"]\` — a missing key raises a KeyError, so \`book.get(\"year\")\` returning None (or a default) is the safe route. Add or update just by assigning: \`book[\"author\"] = \"F. Herbert\"\`.

\`in\` checks keys, and \`.keys()/.values()/.items()\` expose what is inside for looping.`,
      },
      {
        heading: "Lists share, strings do not",
        body: `Assigning a list to a second name does not copy it — both labels point at the same object, so a change through one shows up in the other. Use \`list(a)\` or slicing \`a[:]\` when you truly want an independent copy. Strings, being immutable, never have this surprise.`,
      },
    ],
    examples: [
      {
        title: "A list of scores",
        description: "Create, update, and summarize a list.",
        language: "python",
        code: `scores = [82, 90, 75]
scores.append(88)
scores[0] = 85

print(scores)          # [85, 90, 75, 88]
print(len(scores))     # 4
print(scores[-1])      # 88
print("Best:", max(scores))
print("Total:", sum(scores))`,
        lineNotes: [
          { code: `scores = [82, 90, 75]`, note: "Square brackets build a list; elements keep their order and are indexed from 0." },
          { code: `scores.append(88)`, note: "append adds one item to the end and changes the list in place (it returns None)." },
          { code: `scores[0] = 85`, note: "Lists are mutable: assignment replaces the element at index 0." },
          { code: `scores[-1]`, note: "Negative indexing counts from the end: -1 is the last element." },
          { code: `max(scores)`, note: "Builtins like len, max, and sum take the list as one argument." },
        ],
      },
      {
        title: "One dictionary per record",
        description: "Safely reading keys that may not exist.",
        language: "python",
        code: `book = {"title": "Dune", "pages": 412}

print(book["title"])
print(book.get("year"))            # None, no crash
print(book.get("year", "unknown")) # unknown

book["author"] = "Frank Herbert"   # add a new key
for key, value in book.items():
    print(key, ":", value)`,
      },
    ],
    mistakes: [
      {
        wrong: "scores.append(...) then scores = scores.append(90)",
        why: "append returns None, so you replace your list with None and lose it.",
        fix: "Call append and let it change the list in place; do not assign its result.",
      },
      {
        wrong: "b = a then editing b, expecting a to stay unchanged",
        why: "Both names point to the same list object, so the edit is visible through a too.",
        fix: "Copy when you need independence: b = list(a) or b = a[:].",
      },
      {
        wrong: 'Reading a possibly missing key with book["year"]',
        why: "A missing key raises a KeyError and crashes the run.",
        fix: "Use book.get(\"year\") — it gives back None (or a default) instead of raising.",
      },
    ],
    quiz: [
      {
        question: "After nums = [1, 2, 3] and nums.append(4), what does len(nums) return?",
        options: ["3", "4", "7"],
        answerIndex: 1,
        explanation: "append adds one element, growing the list from 3 items to 4.",
      },
      {
        question: "Which expression safely reads a dictionary key that may be absent?",
        options: ["book[\"year\"]", "book.get(\"year\", 0)", "book.year"],
        answerIndex: 1,
        explanation: "get returns a fallback (here 0) instead of raising a KeyError.",
      },
    ],
    exercises: [
      {
        title: "Shopping list math",
        prompt: "Five grocery prices are given. Print the count, the total, and the most expensive item using len, sum, and max.",
        language: "python",
        starterCode: `prices = [2.5, 1.8, 4.0, 0.75, 3.3]
print(len(prices))`,
        hint: "Use this list as given — pass it to sum() and max() for the other two lines.",
      },
      {
        title: "Profile card",
        prompt: "Build a dictionary with name, age, and city, then print each key and value using a for loop over items().",
        language: "python",
        starterCode: `profile = {
    # three keys here
}
`,
        hint: "Loop with `for key, value in profile.items():`.",
      },
    ],
  },
  {
    slug: "comprehensions",
    title: "Comprehensions",
    minutes: 12,
    objectives: [
      "Build new lists in one readable line",
      "Filter items with the trailing if clause",
      "Construct dictionary comprehensions from pairs",
    ],
    sections: [
      {
        heading: "A loop in one line",
        body: `A list comprehension both *transforms* and *collects*: \`[n * n for n in nums]\` squares every element. Read it aloud as 'the expression, for each item.' The whole loop-plus-append dance from last lesson becomes one line, and the intent sits right at the front.

The structure is fixed: expression **first**, then \`for\`, then the source list — the order never varies.`,
      },
      {
        heading: "Filtering with if",
        body: `A trailing \`if\` keeps only some items: \`[n for n in nums if n > 0]\`. Do not confuse that with a leading-if, which would be a *transforming* choice like \`\"even\" if n % 2 == 0 else \"odd\"\`. Filter conditions come **after** the for; conditional *expressions* come **before** it.`,
      },
      {
        heading: "The same idea for dictionaries",
        body: `\`{n: n * n for n in range(4)}\` builds a dict from a loop. A classic move is turning two parallel lists into a dict with \`zip\`: \`{name: score for name, score in zip(names, scores)}\`. One warning: if a comprehension grows hard to read, an ordinary loop is the better tool — clarity wins.`,
      },
    ],
    examples: [
      {
        title: "Squares, the comprehension way",
        description: "Compare the loop and the one-liner side by side.",
        language: "python",
        code: `squares = [n * n for n in range(5)]
print(squares)   # [0, 1, 4, 9, 16]

# same thing, the long way:
squares2 = []
for n in range(5):
    squares2.append(n * n)`,
        lineNotes: [
          { code: `squares = [n * n for n in range(5)]`, note: "The expression n * n is evaluated once per item, collecting results in a new list." },
          { code: `for n in range(5)`, note: "The loop source — n takes 0 through 4, exactly as in a normal for loop." },
          { code: `squares2.append(n * n)`, note: "What the comprehension does implicitly: build an empty list and append each result." },
        ],
      },
      {
        title: "Filter and transform together",
        description: "Keep the positives, then scale them — and zip two lists into a dict.",
        language: "python",
        code: `numbers = [-2, 5, -7, 8, 0]
print([n for n in numbers if n > 0])          # [5, 8]

names = ["ana", "bo", "cy"]
scores = [91, 84, 77]
print({n: s for n, s in zip(names, scores)})`,
      },
    ],
    mistakes: [
      {
        wrong: "Writing the source first: [for n in nums]",
        why: "Comprehension grammar is expression-then-for; an empty expression is a syntax error.",
        fix: "Start with the expression you want to keep: [n for n in nums].",
      },
      {
        wrong: "Using the loop variable after the comprehension: print(n)",
        why: "The variable lives inside the comprehension's own scope and is gone once it finishes.",
        fix: "Keep the resulting list, not the loop variable: keep_squares = [n * n for n in nums].",
      },
      {
        wrong: "Putting the filter before the for: [if n > 0 for n in nums]",
        why: "Filtering conditions must come after the loop clause; before it, Python cannot parse the line.",
        fix: "Order it as [n for n in nums if n > 0].",
      },
    ],
    quiz: [
      {
        question: "What is [n * 10 for n in range(3)]?",
        options: ["[0, 10, 20]", "[10, 20, 30]", "[0, 1, 2]"],
        answerIndex: 0,
        explanation: "range(3) yields 0, 1, 2; each is multiplied by 10 and collected.",
      },
      {
        question: "Which keeps only the even numbers of nums?",
        options: ["[n for n in nums if n % 2 == 0]", "[n if n % 2 == 0 for n in nums]", "[n for n in nums else n]"],
        answerIndex: 0,
        explanation: "The filter's if belongs after the for clause — the other two are syntax errors.",
      },
    ],
    exercises: [
      {
        title: "Loud names",
        prompt: "Given names = [\"ana\", \"bo\", \"cy\"], build a one-line list of the uppercased names.",
        language: "python",
        starterCode: `names = ["ana", "bo", "cy"]
loud = [...]  # one comprehension inside these brackets`,
        hint: "The expression is name.upper().",
      },
      {
        title: "Pass list",
        prompt: "From scores = [91, 55, 67, 84, 45], keep only the scores of 60 or more in a single comprehension.",
        language: "python",
        starterCode: `scores = [91, 55, 67, 84, 45]
passing = [...]  # keep scores of 60 or more`,
        hint: "Filtering goes after the for: for s in scores if s >= 60.",
      },
    ],
  },
  {
    slug: "exceptions-and-files",
    title: "Exceptions and Files",
    minutes: 14,
    objectives: [
      "Catch expected errors with try and except",
      "Read and write text files with the with statement",
      "Raise your own errors for impossible operations",
    ],
    sections: [
      {
        heading: "try and except",
        body: `Instead of crashing, wrap the risky lines in \`try:\` and handle failures in \`except SomeError:\`. Always catch a specific type — \`except ValueError:\` — because a bare \`except:\` also swallows bugs like typos, hiding them from you.

\`else\` runs when no exception occurred, and \`finally\` always runs — good for cleanup, whatever happened.`,
      },
      {
        heading: "Typical errors worth catching",
        body: `- \`ValueError\` — a conversion that cannot work, like \`int(\"abc\")\`
- \`KeyError\` / \`IndexError\` — a missing dict key or list position
- \`ZeroDivisionError\` — dividing by zero
- \`FileNotFoundError\` — opening a path that does not exist

\`raise ValueError(\"message\")\` declares your own failure points when input is impossible to honor.`,
      },
      {
        heading: "with open",
        body: `\`with open(path) as file:\` is the standard way to use files: the file is closed automatically when the block ends, even on error. Modes matter — \`\"r\"\` reads (the default), \`\"w\"\` creates or **truncates** an existing file, \`\"a\"\` appends. Then \`.read()\`, \`.write(text)\`, or loop over lines.`,
      },
    ],
    examples: [
      {
        title: "A safe conversion",
        description: "Handle bad input instead of crashing.",
        language: "python",
        code: `text = input("Enter a number: ")

try:
    number = int(text)
except ValueError:
    print(text, "is not a whole number")
else:
    print("Twice that is", number * 2)`,
        lineNotes: [
          { code: `try:`, note: "Python runs the indented block and watches for errors in it." },
          { code: `number = int(text)`, note: "The risky line: int raises ValueError if text is not a number." },
          { code: `except ValueError:`, note: "Runs only for that error type, so real bugs elsewhere are still loud." },
          { code: `else:`, note: "Runs only when the try block succeeded with no exception." },
        ],
      },
      {
        title: "Write a note, then read it back",
        description: "The with statement manages closing for you.",
        language: "python",
        code: `with open("note.txt", "w") as f:
    f.write("Buy milk\\n")
    f.write("Call Dana\\n")

with open("note.txt", "r") as f:
    for line in f:
        print("Line:", line.strip())`,
      },
    ],
    mistakes: [
      {
        wrong: "Using a bare except: with no error type",
        why: "It catches every exception — including typos and KeyboardInterrupt — and turns real bugs into silent misbehavior.",
        fix: "Name the errors you anticipate: except ValueError:.",
      },
      {
        wrong: "Opening files with f = open(...) and never closing them",
        why: "Without a close (or error trigger), contents may not be flushed to disk and file handles leak.",
        fix: "Always use with open(...) as f:, which closes automatically.",
      },
      {
        wrong: "Expecting to append with mode \"w\"",
        why: "\"w\" truncates the file to empty before writing; your previous contents are gone.",
        fix: "Use mode \"a\" to add to the end of an existing file.",
      },
    ],
    quiz: [
      {
        question: "Which exception does int(\"seven\") raise?",
        options: ["TypeError", "ValueError", "SyntaxError"],
        answerIndex: 1,
        explanation: "The value is a string of the right kind, but its content cannot convert — a ValueError.",
      },
      {
        question: "Why prefer `with open(path) as f:` over manual open and close?",
        options: ["It reads faster", "It closes the file even if an error happens mid-block", "It avoids OSError entirely"],
        answerIndex: 1,
        explanation: "The with block guarantees closing on success, on error, and on early return.",
      },
    ],
    exercises: [
      {
        title: "Ask until it is a number",
        prompt: "Loop forever asking for a number, converting with int() inside a try, and break only after a successful conversion.",
        language: "python",
        starterCode: `while True:
    text = input("Number: ")
    try:
        ...
    except ValueError:
        print("Not a number - try again")`,
        hint: "On success, print the doubled value and break out of the loop.",
      },
      {
        title: "Append to a journal",
        prompt: "Append one line to diary.txt with mode \"a\", then read the whole file back and print its contents.",
        language: "python",
        starterCode: `with open("diary.txt", "a") as f:
    ...

with open("diary.txt", "r") as f:
    ...`,
        hint: "Finish each appended line with a newline character so reads stay line by line.",
      },
    ],
  },
  {
    slug: "modules-and-standard-library",
    title: "Modules and the Standard Library",
    minutes: 12,
    objectives: [
      "Import modules and call their functions through a namespace",
      "Pick the right import style for tidy code",
      "Use math, random, and datetime from the standard library",
    ],
    sections: [
      {
        heading: "What a module is",
        body: `A module is just a \`.py\` file full of reusable names — functions, constants, classes. \`import math\` makes the whole file available as one namespace: you then write \`math.sqrt(2)\`, keeping it obvious where each name came from.

The **standard library** is the collection of modules that ships with Python — no installation, no downloads. It covers math, dates, files, JSON, random numbers, and much more.`,
      },
      {
        heading: "Two import styles",
        body: `\`import random\` then \`random.randint(1, 6)\` is the default: explicit and shock-proof. \`from random import randint\` pulls one name out for direct calling, and the alternatives — importing only what you need or importing with a shorter alias (\`import datetime as dt\`) — both beat the blanket \`from module import *\`, which floods your file with unknown names.`,
      },
    ],
    examples: [
      {
        title: "Three modules in one script",
        description: "math for constants, random for chance, datetime for the clock.",
        language: "python",
        code: `import math
import random
import datetime

radius = 2.0
area = math.pi * radius ** 2
print("Circle area:", area)

roll = random.randint(1, 6)          # inclusive both ends
print("Dice roll:", roll)

now = datetime.date.today()
print("Today is", now.isoformat())`,
        lineNotes: [
          { code: `import math`, note: "Loads the module under its own name; use math.something to reach its contents." },
          { code: `math.pi * radius ** 2`, note: "A library constant (pi) plus Python's exponent operator ** for squaring." },
          { code: `random.randint(1, 6)`, note: "A random integer including both endpoints — a real 6-sided die, not range-style exclusive." },
          { code: `datetime.date.today()`, note: "A date object for today; isoformat() renders it as YYYY-MM-DD text." },
        ],
      },
      {
        title: "from module import name",
        description: "Two import styles compared.",
        language: "python",
        code: `from random import randint   # pull one name out
print(randint(1, 10))        # call it directly, no prefix

import time                  # or keep the namespace
time.sleep(1)                # wait one second, spelled time.sleep`,
      },
    ],
    mistakes: [
      {
        wrong: "Calling randint(1, 6) after only `import random`",
        why: "The function lives in the module's namespace, so the bare name does not exist — a NameError.",
        fix: "Either call random.randint(1, 6) or from random import randint first.",
      },
      {
        wrong: "Naming your own file math.py or random.py",
        why: "It shadows the standard library module, then your (or a dependency's) `import math` quietly picks up yours.",
        fix: "Never name a file after a module you import — pick a distinct name like dice_sim.py.",
      },
      {
        wrong: "Reaching for math.sqrt(x) when you mean x ** 0.5",
        why: "It is not wrong, but it hides the plain-arithmetic identity and adds an import you may not need.",
        fix: "`x ** 0.5` is idiomatic for square roots; reserve the math module for pi, trig, and friends.",
      },
    ],
    quiz: [
      {
        question: "After `import random`, how do you roll a die?",
        options: ["randint(1, 6)", "random.randint(1, 6)", "random.dice(1, 6)"],
        answerIndex: 1,
        explanation: "Names live in the module's namespace until you pull them out with from...import.",
      },
      {
        question: "What is the standard library?",
        options: ["Modules that ship with Python, no install needed", "The internet package index", "Python's core syntax rules"],
        answerIndex: 0,
        explanation: "Modules like math, random, and datetime come with every Python 3 install.",
      },
    ],
    exercises: [
      {
        title: "Dice and odds",
        prompt: "Roll two dice 100 times and print how many rolls summed to 7.",
        language: "python",
        starterCode: `import random

count = 0
for _ in range(100):
    ...`,
        hint: "Each roll is random.randint(1, 6) + random.randint(1, 6); compare it to 7 inside the loop.",
      },
      {
        title: "Small circles",
        prompt: "Print the area of circles with radius 1 through 5 using math.pi and a comprehension.",
        language: "python",
        starterCode: `import math

areas = [ ... for r in range(1, 6) ]
print(areas)`,
        hint: "The expression is math.pi * r ** 2.",
      },
    ],
  },
];
