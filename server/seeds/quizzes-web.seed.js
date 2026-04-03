/**
 * WEB DEVELOPMENT QUIZZES SEED DATA
 * Contains HTML, CSS, JavaScript, and React quizzes
 * Run: node seeds/quizzes-web.seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Quiz = require('../models/Quiz');
const User = require('../models/User');

const webQuizzes = [
    // ===== HTML FUNDAMENTALS =====
    {
        id: 'html-basics',
        title: 'HTML Fundamentals',
        description: 'Test your HTML knowledge',
        category: 'other',
        difficulty: 'easy',
        metadata: {
            estimatedTime: 15,
            totalQuestions: 10,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What does HTML stand for?',
                options: [
                    { id: 'A', text: 'HyperText Markup Language', isCorrect: true },
                    { id: 'B', text: 'High Tech Modern Language', isCorrect: false },
                    { id: 'C', text: 'HyperText Modern Language', isCorrect: false },
                    { id: 'D', text: 'Home Tool Markup Language', isCorrect: false }
                ],
                explanation: 'HTML stands for HyperText Markup Language.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which tag is used to create a hyperlink?',
                options: [
                    { id: 'A', text: '<link>', isCorrect: false },
                    { id: 'B', text: '<a>', isCorrect: true },
                    { id: 'C', text: '<href>', isCorrect: false },
                    { id: 'D', text: '<url>', isCorrect: false }
                ],
                explanation: 'The <a> (anchor) tag is used to create hyperlinks.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the correct HTML for inserting an image?',
                options: [
                    { id: 'A', text: '<image src="pic.jpg" alt="My Image">', isCorrect: false },
                    { id: 'B', text: '<img src="pic.jpg" alt="My Image">', isCorrect: true },
                    { id: 'C', text: '<picture src="pic.jpg" alt="My Image">', isCorrect: false },
                    { id: 'D', text: '<img href="pic.jpg" alt="My Image">', isCorrect: false }
                ],
                explanation: '<img> tag with src and alt attributes is the correct way.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which HTML element defines the title of a document?',
                options: [
                    { id: 'A', text: '<meta>', isCorrect: false },
                    { id: 'B', text: '<title>', isCorrect: true },
                    { id: 'C', text: '<head>', isCorrect: false },
                    { id: 'D', text: '<header>', isCorrect: false }
                ],
                explanation: '<title> tag defines the document title shown in browser tab.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the difference between <div> and <span>?',
                options: [
                    { id: 'A', text: 'No difference', isCorrect: false },
                    { id: 'B', text: '<div> is block-level, <span> is inline', isCorrect: true },
                    { id: 'C', text: '<span> is block-level, <div> is inline', isCorrect: false },
                    { id: 'D', text: 'Both are inline', isCorrect: false }
                ],
                explanation: '<div> is a block-level container, <span> is an inline container.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which tag is used for creating a table row?',
                options: [
                    { id: 'A', text: '<td>', isCorrect: false },
                    { id: 'B', text: '<tr>', isCorrect: true },
                    { id: 'C', text: '<th>', isCorrect: false },
                    { id: 'D', text: '<table>', isCorrect: false }
                ],
                explanation: '<tr> defines a table row.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the purpose of the <form> element?',
                options: [
                    { id: 'A', text: 'Display formatted text', isCorrect: false },
                    { id: 'B', text: 'Collect user input', isCorrect: true },
                    { id: 'C', text: 'Create a footer', isCorrect: false },
                    { id: 'D', text: 'Define a formula', isCorrect: false }
                ],
                explanation: '<form> element is used to collect and submit user input.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which input type creates a checkbox?',
                options: [
                    { id: 'A', text: '<input type="box">', isCorrect: false },
                    { id: 'B', text: '<input type="checkbox">', isCorrect: true },
                    { id: 'C', text: '<input type="check">', isCorrect: false },
                    { id: 'D', text: '<checkbox>', isCorrect: false }
                ],
                explanation: '<input type="checkbox"> creates a checkbox input.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is semantic HTML?',
                options: [
                    { id: 'A', text: 'HTML with CSS', isCorrect: false },
                    { id: 'B', text: 'HTML tags that convey meaning about content', isCorrect: true },
                    { id: 'C', text: 'HTML5 only features', isCorrect: false },
                    { id: 'D', text: 'HTML with JavaScript', isCorrect: false }
                ],
                explanation: 'Semantic HTML uses tags like <article>, <nav>, <header> that describe content meaning.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which HTML5 element is used for navigation links?',
                options: [
                    { id: 'A', text: '<navigation>', isCorrect: false },
                    { id: 'B', text: '<nav>', isCorrect: true },
                    { id: 'C', text: '<menu>', isCorrect: false },
                    { id: 'D', text: '<links>', isCorrect: false }
                ],
                explanation: '<nav> is the semantic element for navigation links.',
                difficulty: 'easy'
            }
        ]
    },

    // ===== CSS FUNDAMENTALS =====
    {
        id: 'css-basics',
        title: 'CSS Fundamentals',
        description: 'Test your CSS styling knowledge',
        category: 'other',
        difficulty: 'easy',
        metadata: {
            estimatedTime: 15,
            totalQuestions: 12,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What does CSS stand for?',
                options: [
                    { id: 'A', text: 'Creative Style Sheets', isCorrect: false },
                    { id: 'B', text: 'Cascading Style Sheets', isCorrect: true },
                    { id: 'C', text: 'Computer Style Sheets', isCorrect: false },
                    { id: 'D', text: 'Colorful Style Sheets', isCorrect: false }
                ],
                explanation: 'CSS stands for Cascading Style Sheets.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which property changes the text color?',
                options: [
                    { id: 'A', text: 'text-color', isCorrect: false },
                    { id: 'B', text: 'color', isCorrect: true },
                    { id: 'C', text: 'font-color', isCorrect: false },
                    { id: 'D', text: 'text-style', isCorrect: false }
                ],
                explanation: 'The color property sets the text color.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the CSS box model?',
                options: [
                    { id: 'A', text: 'A 3D box', isCorrect: false },
                    { id: 'B', text: 'Content, padding, border, margin', isCorrect: true },
                    { id: 'C', text: 'Only margin and padding', isCorrect: false },
                    { id: 'D', text: 'A container element', isCorrect: false }
                ],
                explanation: 'Box model consists of content, padding, border, and margin.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which CSS property controls the layout method?',
                options: [
                    { id: 'A', text: 'position', isCorrect: false },
                    { id: 'B', text: 'display', isCorrect: true },
                    { id: 'C', text: 'layout', isCorrect: false },
                    { id: 'D', text: 'float', isCorrect: false }
                ],
                explanation: 'display property defines how an element is rendered (block, inline, flex, grid).',
                difficulty: 'medium'
            },
            {
                questionText: 'What is Flexbox used for?',
                options: [
                    { id: 'A', text: 'Animation', isCorrect: false },
                    { id: 'B', text: 'One-dimensional layout', isCorrect: true },
                    { id: 'C', text: 'Adding colors', isCorrect: false },
                    { id: 'D', text: 'Typography', isCorrect: false }
                ],
                explanation: 'Flexbox is a one-dimensional layout method for arranging items in rows or columns.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is CSS Grid used for?',
                options: [
                    { id: 'A', text: 'Animation', isCorrect: false },
                    { id: 'B', text: 'Two-dimensional layout', isCorrect: true },
                    { id: 'C', text: 'Typography', isCorrect: false },
                    { id: 'D', text: 'Colors only', isCorrect: false }
                ],
                explanation: 'CSS Grid is a two-dimensional layout system for complex layouts.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is CSS specificity?',
                options: [
                    { id: 'A', text: 'How fast CSS loads', isCorrect: false },
                    { id: 'B', text: 'How browsers determine which styles to apply', isCorrect: true },
                    { id: 'C', text: 'Number of CSS rules', isCorrect: false },
                    { id: 'D', text: 'CSS file size', isCorrect: false }
                ],
                explanation: 'Specificity determines which CSS rule is applied when multiple rules target same element.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which selector has highest specificity?',
                options: [
                    { id: 'A', text: 'Element selector', isCorrect: false },
                    { id: 'B', text: 'ID selector', isCorrect: true },
                    { id: 'C', text: 'Class selector', isCorrect: false },
                    { id: 'D', text: 'Universal selector', isCorrect: false }
                ],
                explanation: 'ID selector (#id) has highest specificity, followed by class, then element.',
                difficulty: 'medium'
            },
            {
                questionText: 'What does position: absolute do?',
                options: [
                    { id: 'A', text: 'Positions relative to viewport', isCorrect: false },
                    { id: 'B', text: 'Positions relative to nearest positioned ancestor', isCorrect: true },
                    { id: 'C', text: 'Removes from document flow only', isCorrect: false },
                    { id: 'D', text: 'Makes element fixed', isCorrect: false }
                ],
                explanation: 'position: absolute positions element relative to nearest positioned ancestor.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a CSS media query?',
                options: [
                    { id: 'A', text: 'Database query in CSS', isCorrect: false },
                    { id: 'B', text: 'Applies styles based on device/screen conditions', isCorrect: true },
                    { id: 'C', text: 'Finds elements', isCorrect: false },
                    { id: 'D', text: 'Animation trigger', isCorrect: false }
                ],
                explanation: 'Media queries apply styles based on device characteristics like screen width.',
                difficulty: 'medium'
            },
            {
                questionText: 'What does z-index control?',
                options: [
                    { id: 'A', text: 'Zoom level', isCorrect: false },
                    { id: 'B', text: 'Stack order of positioned elements', isCorrect: true },
                    { id: 'C', text: 'Zero margin', isCorrect: false },
                    { id: 'D', text: 'Z-axis rotation', isCorrect: false }
                ],
                explanation: 'z-index controls the stacking order of positioned elements.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the purpose of CSS variables (custom properties)?',
                options: [
                    { id: 'A', text: 'Store JavaScript variables', isCorrect: false },
                    { id: 'B', text: 'Store reusable values in CSS', isCorrect: true },
                    { id: 'C', text: 'Create animations', isCorrect: false },
                    { id: 'D', text: 'Define breakpoints', isCorrect: false }
                ],
                explanation: 'CSS variables (--var-name) store reusable values that can be referenced throughout CSS.',
                difficulty: 'medium'
            }
        ]
    },

    // ===== JAVASCRIPT FUNDAMENTALS =====
    {
        id: 'js-basics',
        title: 'JavaScript Fundamentals',
        description: 'Core JavaScript concepts and syntax',
        category: 'other',
        difficulty: 'medium',
        metadata: {
            estimatedTime: 25,
            totalQuestions: 15,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is the difference between let, const, and var?',
                options: [
                    { id: 'A', text: 'No difference', isCorrect: false },
                    { id: 'B', text: 'let/const are block-scoped, var is function-scoped', isCorrect: true },
                    { id: 'C', text: 'var is block-scoped, let/const are function-scoped', isCorrect: false },
                    { id: 'D', text: 'They only differ in syntax', isCorrect: false }
                ],
                explanation: 'let and const are block-scoped, var is function-scoped. const cannot be reassigned.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a closure in JavaScript?',
                options: [
                    { id: 'A', text: 'A way to close browser windows', isCorrect: false },
                    { id: 'B', text: 'Function that remembers its lexical scope', isCorrect: true },
                    { id: 'C', text: 'A syntax error', isCorrect: false },
                    { id: 'D', text: 'A way to close loops', isCorrect: false }
                ],
                explanation: 'Closure is a function that has access to variables from its outer scope even after outer function returns.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the event loop in JavaScript?',
                options: [
                    { id: 'A', text: 'A for loop for events', isCorrect: false },
                    { id: 'B', text: 'Mechanism that handles async operations', isCorrect: true },
                    { id: 'C', text: 'HTML event handler', isCorrect: false },
                    { id: 'D', text: 'CSS animation loop', isCorrect: false }
                ],
                explanation: 'Event loop handles asynchronous operations by processing the callback queue.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the difference between == and ===?',
                options: [
                    { id: 'A', text: 'No difference', isCorrect: false },
                    { id: 'B', text: '=== checks type and value, == only value with coercion', isCorrect: true },
                    { id: 'C', text: '== is stricter', isCorrect: false },
                    { id: 'D', text: '=== is deprecated', isCorrect: false }
                ],
                explanation: '=== (strict equality) checks both type and value; == performs type coercion.',
                difficulty: 'easy'
            },
            {
                questionText: 'What does Array.prototype.map() do?',
                options: [
                    { id: 'A', text: 'Creates a map data structure', isCorrect: false },
                    { id: 'B', text: 'Creates new array with transformed elements', isCorrect: true },
                    { id: 'C', text: 'Modifies original array', isCorrect: false },
                    { id: 'D', text: 'Filters array elements', isCorrect: false }
                ],
                explanation: 'map() creates a new array by applying a function to each element.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a Promise in JavaScript?',
                options: [
                    { id: 'A', text: 'A guarantee of no errors', isCorrect: false },
                    { id: 'B', text: 'Object representing eventual completion of async operation', isCorrect: true },
                    { id: 'C', text: 'A type of loop', isCorrect: false },
                    { id: 'D', text: 'A variable declaration', isCorrect: false }
                ],
                explanation: 'Promise represents the eventual completion or failure of an asynchronous operation.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is async/await?',
                options: [
                    { id: 'A', text: 'A way to make code run faster', isCorrect: false },
                    { id: 'B', text: 'Syntactic sugar for working with Promises', isCorrect: true },
                    { id: 'C', text: 'A new variable type', isCorrect: false },
                    { id: 'D', text: 'A loop construct', isCorrect: false }
                ],
                explanation: 'async/await provides cleaner syntax for handling Promises.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the spread operator (...)?',
                options: [
                    { id: 'A', text: 'Multiplies numbers', isCorrect: false },
                    { id: 'B', text: 'Expands iterable elements', isCorrect: true },
                    { id: 'C', text: 'Creates ranges', isCorrect: false },
                    { id: 'D', text: 'Concatenates strings', isCorrect: false }
                ],
                explanation: 'Spread operator expands iterables into individual elements.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is destructuring in JavaScript?',
                options: [
                    { id: 'A', text: 'Destroying objects', isCorrect: false },
                    { id: 'B', text: 'Extracting values from arrays/objects into variables', isCorrect: true },
                    { id: 'C', text: 'Deleting properties', isCorrect: false },
                    { id: 'D', text: 'Breaking loops', isCorrect: false }
                ],
                explanation: 'Destructuring extracts values from arrays or properties from objects into distinct variables.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is hoisting?',
                options: [
                    { id: 'A', text: 'Moving code to server', isCorrect: false },
                    { id: 'B', text: 'Variable/function declarations moved to top of scope', isCorrect: true },
                    { id: 'C', text: 'Lifting elements in DOM', isCorrect: false },
                    { id: 'D', text: 'Uploading files', isCorrect: false }
                ],
                explanation: 'Hoisting moves declarations to the top of their scope during compilation.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the this keyword in JavaScript?',
                options: [
                    { id: 'A', text: 'Always refers to window', isCorrect: false },
                    { id: 'B', text: 'Refers to the object that owns the executing code', isCorrect: true },
                    { id: 'C', text: 'Always refers to global object', isCorrect: false },
                    { id: 'D', text: 'A reserved word with no use', isCorrect: false }
                ],
                explanation: 'this refers to the object that is executing the current function.',
                difficulty: 'hard'
            },
            {
                questionText: 'What are arrow functions?',
                options: [
                    { id: 'A', text: 'Functions that return arrows', isCorrect: false },
                    { id: 'B', text: 'Shorter function syntax with lexical this binding', isCorrect: true },
                    { id: 'C', text: 'Functions for navigation', isCorrect: false },
                    { id: 'D', text: 'Deprecated functions', isCorrect: false }
                ],
                explanation: 'Arrow functions provide shorter syntax and do not have their own this binding.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the difference between null and undefined?',
                options: [
                    { id: 'A', text: 'They are the same', isCorrect: false },
                    { id: 'B', text: 'undefined is unassigned, null is intentional absence', isCorrect: true },
                    { id: 'C', text: 'null is error, undefined is not', isCorrect: false },
                    { id: 'D', text: 'undefined is newer', isCorrect: false }
                ],
                explanation: 'undefined means variable declared but not assigned; null is intentional absence of value.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the DOM?',
                options: [
                    { id: 'A', text: 'Data Object Model', isCorrect: false },
                    { id: 'B', text: 'Document Object Model', isCorrect: true },
                    { id: 'C', text: 'Display Object Mode', isCorrect: false },
                    { id: 'D', text: 'Document Order Method', isCorrect: false }
                ],
                explanation: 'DOM (Document Object Model) is the programming interface for HTML documents.',
                difficulty: 'easy'
            },
            {
                questionText: 'What does JSON.parse() do?',
                options: [
                    { id: 'A', text: 'Converts object to string', isCorrect: false },
                    { id: 'B', text: 'Converts JSON string to JavaScript object', isCorrect: true },
                    { id: 'C', text: 'Parses HTML', isCorrect: false },
                    { id: 'D', text: 'Validates JSON', isCorrect: false }
                ],
                explanation: 'JSON.parse() parses a JSON string and returns a JavaScript object.',
                difficulty: 'easy'
            }
        ]
    },

    // ===== REACT FUNDAMENTALS =====
    {
        id: 'react-basics',
        title: 'React Fundamentals',
        description: 'Test your React.js knowledge',
        category: 'other',
        difficulty: 'medium',
        metadata: {
            estimatedTime: 25,
            totalQuestions: 15,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is React?',
                options: [
                    { id: 'A', text: 'A full-stack framework', isCorrect: false },
                    { id: 'B', text: 'A JavaScript library for building user interfaces', isCorrect: true },
                    { id: 'C', text: 'A database', isCorrect: false },
                    { id: 'D', text: 'A CSS framework', isCorrect: false }
                ],
                explanation: 'React is a JavaScript library for building user interfaces, maintained by Meta.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is JSX?',
                options: [
                    { id: 'A', text: 'A new programming language', isCorrect: false },
                    { id: 'B', text: 'JavaScript syntax extension for describing UI', isCorrect: true },
                    { id: 'C', text: 'A CSS preprocessor', isCorrect: false },
                    { id: 'D', text: 'A database query language', isCorrect: false }
                ],
                explanation: 'JSX is a syntax extension that allows writing HTML-like code in JavaScript.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the Virtual DOM?',
                options: [
                    { id: 'A', text: 'A real DOM copy', isCorrect: false },
                    { id: 'B', text: 'Lightweight copy of DOM for efficient updates', isCorrect: true },
                    { id: 'C', text: 'A browser feature', isCorrect: false },
                    { id: 'D', text: 'A CSS concept', isCorrect: false }
                ],
                explanation: 'Virtual DOM is a lightweight JavaScript representation of the actual DOM.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is useState hook?',
                options: [
                    { id: 'A', text: 'Creates side effects', isCorrect: false },
                    { id: 'B', text: 'Adds state to functional components', isCorrect: true },
                    { id: 'C', text: 'Handles routing', isCorrect: false },
                    { id: 'D', text: 'Fetches data', isCorrect: false }
                ],
                explanation: 'useState is a Hook that lets you add state to functional components.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is useEffect hook?',
                options: [
                    { id: 'A', text: 'Manages state', isCorrect: false },
                    { id: 'B', text: 'Handles side effects in functional components', isCorrect: true },
                    { id: 'C', text: 'Creates components', isCorrect: false },
                    { id: 'D', text: 'Defines styles', isCorrect: false }
                ],
                explanation: 'useEffect performs side effects like data fetching, subscriptions, DOM manipulation.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is useMemo used for?',
                options: [
                    { id: 'A', text: 'Creating memories', isCorrect: false },
                    { id: 'B', text: 'Memoizing expensive calculations', isCorrect: true },
                    { id: 'C', text: 'Managing state', isCorrect: false },
                    { id: 'D', text: 'Handling events', isCorrect: false }
                ],
                explanation: 'useMemo memoizes expensive calculations, recomputing only when dependencies change.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is useCallback used for?',
                options: [
                    { id: 'A', text: 'Calling APIs', isCorrect: false },
                    { id: 'B', text: 'Memoizing callback functions', isCorrect: true },
                    { id: 'C', text: 'Creating callbacks', isCorrect: false },
                    { id: 'D', text: 'Handling errors', isCorrect: false }
                ],
                explanation: 'useCallback returns a memoized callback that only changes when dependencies change.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is useContext used for?',
                options: [
                    { id: 'A', text: 'Creating contexts', isCorrect: false },
                    { id: 'B', text: 'Consuming context values in components', isCorrect: true },
                    { id: 'C', text: 'Managing routes', isCorrect: false },
                    { id: 'D', text: 'Handling forms', isCorrect: false }
                ],
                explanation: 'useContext subscribes to React context and returns the current context value.',
                difficulty: 'medium'
            },
            {
                questionText: 'What are React props?',
                options: [
                    { id: 'A', text: 'Component state', isCorrect: false },
                    { id: 'B', text: 'Data passed from parent to child components', isCorrect: true },
                    { id: 'C', text: 'CSS properties', isCorrect: false },
                    { id: 'D', text: 'Event handlers only', isCorrect: false }
                ],
                explanation: 'Props are inputs to components, passed from parent to child.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the difference between state and props?',
                options: [
                    { id: 'A', text: 'No difference', isCorrect: false },
                    { id: 'B', text: 'State is internal, props are passed from parent', isCorrect: true },
                    { id: 'C', text: 'Props are internal, state is external', isCorrect: false },
                    { id: 'D', text: 'Both are immutable', isCorrect: false }
                ],
                explanation: 'State is managed within component; props are passed from parent and are read-only.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is conditional rendering in React?',
                options: [
                    { id: 'A', text: 'Rendering based on screen size', isCorrect: false },
                    { id: 'B', text: 'Rendering different UI based on conditions', isCorrect: true },
                    { id: 'C', text: 'Rendering CSS conditionally', isCorrect: false },
                    { id: 'D', text: 'Rendering only on mobile', isCorrect: false }
                ],
                explanation: 'Conditional rendering shows different UI elements based on state or props.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the purpose of keys in React lists?',
                options: [
                    { id: 'A', text: 'Styling purposes', isCorrect: false },
                    { id: 'B', text: 'Help React identify which items changed', isCorrect: true },
                    { id: 'C', text: 'Access control', isCorrect: false },
                    { id: 'D', text: 'Keyboard shortcuts', isCorrect: false }
                ],
                explanation: 'Keys help React identify which items have changed, added, or removed.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is React Router used for?',
                options: [
                    { id: 'A', text: 'Making API calls', isCorrect: false },
                    { id: 'B', text: 'Client-side navigation between pages', isCorrect: true },
                    { id: 'C', text: 'State management', isCorrect: false },
                    { id: 'D', text: 'Styling components', isCorrect: false }
                ],
                explanation: 'React Router enables navigation among views in a React application.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is useReducer hook?',
                options: [
                    { id: 'A', text: 'Reduces component size', isCorrect: false },
                    { id: 'B', text: 'Alternative to useState for complex state logic', isCorrect: true },
                    { id: 'C', text: 'Reduces re-renders', isCorrect: false },
                    { id: 'D', text: 'Reduces API calls', isCorrect: false }
                ],
                explanation: 'useReducer manages complex state logic with actions and reducers.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a React Fragment?',
                options: [
                    { id: 'A', text: 'A broken component', isCorrect: false },
                    { id: 'B', text: 'Groups children without adding extra DOM nodes', isCorrect: true },
                    { id: 'C', text: 'A piece of JSX', isCorrect: false },
                    { id: 'D', text: 'A type of component', isCorrect: false }
                ],
                explanation: 'Fragment groups children without adding extra nodes to the DOM (<></>).',
                difficulty: 'easy'
            }
        ]
    }
];

const seedWebQuizzes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            admin = await User.create({
                username: 'admin',
                email: 'admin@brainspark.com',
                password: 'admin123',
                role: 'admin'
            });
        }

        const quizzesWithCreator = webQuizzes.map(quiz => ({
            ...quiz,
            createdBy: admin._id
        }));

        await Quiz.insertMany(quizzesWithCreator);

        const totalQuestions = webQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

        console.log(`✅ Seeded ${webQuizzes.length} Web Development quizzes with ${totalQuestions} total questions!`);
        console.log('\n📊 Web Dev Quiz Summary:');
        webQuizzes.forEach(quiz => {
            console.log(`   - ${quiz.title}: ${quiz.questions.length} questions (${quiz.difficulty})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding web quizzes:', error);
        process.exit(1);
    }
};

seedWebQuizzes();
