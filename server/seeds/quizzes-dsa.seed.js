/**
 * DSA QUIZZES SEED DATA
 * Contains Data Structures and Algorithms quizzes
 * Run: node seeds/quizzes-dsa.seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Quiz = require('../models/Quiz');
const User = require('../models/User');

const dsaQuizzes = [
    // ===== DSA BASICS - EASY =====
    {
        id: 'dsa-basics',
        title: 'DSA Basics',
        description: 'Test your knowledge of fundamental data structures and algorithms',
        category: 'dsa',
        difficulty: 'easy',
        metadata: {
            estimatedTime: 20,
            totalQuestions: 15,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is the time complexity of accessing an element in an array by index?',
                options: [
                    { id: 'A', text: 'O(1)', isCorrect: true },
                    { id: 'B', text: 'O(n)', isCorrect: false },
                    { id: 'C', text: 'O(log n)', isCorrect: false },
                    { id: 'D', text: 'O(n²)', isCorrect: false }
                ],
                explanation: 'Array access by index is O(1) because arrays store elements in contiguous memory locations, allowing direct calculation of memory address.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which data structure uses LIFO (Last In First Out) principle?',
                options: [
                    { id: 'A', text: 'Queue', isCorrect: false },
                    { id: 'B', text: 'Stack', isCorrect: true },
                    { id: 'C', text: 'Tree', isCorrect: false },
                    { id: 'D', text: 'Graph', isCorrect: false }
                ],
                explanation: 'Stack follows LIFO principle - the last element added is the first one to be removed. Think of a stack of plates!',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the primary advantage of a linked list over an array?',
                options: [
                    { id: 'A', text: 'Faster access time', isCorrect: false },
                    { id: 'B', text: 'Dynamic size', isCorrect: true },
                    { id: 'C', text: 'Less memory usage', isCorrect: false },
                    { id: 'D', text: 'Better cache performance', isCorrect: false }
                ],
                explanation: 'Linked lists can grow or shrink dynamically without needing to declare size upfront, unlike arrays which have fixed sizes.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which data structure uses FIFO (First In First Out) principle?',
                options: [
                    { id: 'A', text: 'Stack', isCorrect: false },
                    { id: 'B', text: 'Queue', isCorrect: true },
                    { id: 'C', text: 'Heap', isCorrect: false },
                    { id: 'D', text: 'Hash Table', isCorrect: false }
                ],
                explanation: 'Queue follows FIFO principle - the first element added is the first one to be removed. Like a queue at a ticket counter!',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the time complexity of binary search?',
                options: [
                    { id: 'A', text: 'O(n)', isCorrect: false },
                    { id: 'B', text: 'O(n²)', isCorrect: false },
                    { id: 'C', text: 'O(log n)', isCorrect: true },
                    { id: 'D', text: 'O(1)', isCorrect: false }
                ],
                explanation: 'Binary search divides the search space in half each time, resulting in O(log n) complexity. Requires sorted array!',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the worst-case time complexity of Bubble Sort?',
                options: [
                    { id: 'A', text: 'O(n)', isCorrect: false },
                    { id: 'B', text: 'O(n log n)', isCorrect: false },
                    { id: 'C', text: 'O(n²)', isCorrect: true },
                    { id: 'D', text: 'O(log n)', isCorrect: false }
                ],
                explanation: 'Bubble Sort compares adjacent elements and swaps them repeatedly, resulting in O(n²) in the worst case.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which traversal visits the root node first?',
                options: [
                    { id: 'A', text: 'Inorder', isCorrect: false },
                    { id: 'B', text: 'Preorder', isCorrect: true },
                    { id: 'C', text: 'Postorder', isCorrect: false },
                    { id: 'D', text: 'Level order', isCorrect: false }
                ],
                explanation: 'Preorder traversal visits Root -> Left -> Right, so the root is always visited first.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the maximum number of children a binary tree node can have?',
                options: [
                    { id: 'A', text: '1', isCorrect: false },
                    { id: 'B', text: '2', isCorrect: true },
                    { id: 'C', text: '3', isCorrect: false },
                    { id: 'D', text: 'Unlimited', isCorrect: false }
                ],
                explanation: 'A binary tree node can have at most 2 children - left child and right child.',
                difficulty: 'easy'
            },
            {
                questionText: 'What data structure is used to implement recursion internally?',
                options: [
                    { id: 'A', text: 'Queue', isCorrect: false },
                    { id: 'B', text: 'Stack', isCorrect: true },
                    { id: 'C', text: 'Array', isCorrect: false },
                    { id: 'D', text: 'Linked List', isCorrect: false }
                ],
                explanation: 'The call stack is used to store function calls during recursion, pushing each call and popping when returning.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which sorting algorithm has the best average-case time complexity?',
                options: [
                    { id: 'A', text: 'Bubble Sort', isCorrect: false },
                    { id: 'B', text: 'Insertion Sort', isCorrect: false },
                    { id: 'C', text: 'Quick Sort', isCorrect: true },
                    { id: 'D', text: 'Selection Sort', isCorrect: false }
                ],
                explanation: 'Quick Sort has an average-case time complexity of O(n log n), making it one of the fastest sorting algorithms.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the space complexity of an array of n elements?',
                options: [
                    { id: 'A', text: 'O(1)', isCorrect: false },
                    { id: 'B', text: 'O(n)', isCorrect: true },
                    { id: 'C', text: 'O(log n)', isCorrect: false },
                    { id: 'D', text: 'O(n²)', isCorrect: false }
                ],
                explanation: 'An array of n elements requires O(n) space as it stores n elements in contiguous memory.',
                difficulty: 'easy'
            },
            {
                questionText: 'In a singly linked list, what does the last node point to?',
                options: [
                    { id: 'A', text: 'Head node', isCorrect: false },
                    { id: 'B', text: 'NULL/None', isCorrect: true },
                    { id: 'C', text: 'Itself', isCorrect: false },
                    { id: 'D', text: 'Previous node', isCorrect: false }
                ],
                explanation: 'In a singly linked list, the last node points to NULL/None indicating the end of the list.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the time complexity of inserting at the beginning of an array?',
                options: [
                    { id: 'A', text: 'O(1)', isCorrect: false },
                    { id: 'B', text: 'O(n)', isCorrect: true },
                    { id: 'C', text: 'O(log n)', isCorrect: false },
                    { id: 'D', text: 'O(n²)', isCorrect: false }
                ],
                explanation: 'Inserting at the beginning requires shifting all n elements to make room, resulting in O(n) time.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which data structure is best for implementing a browser\'s back button?',
                options: [
                    { id: 'A', text: 'Queue', isCorrect: false },
                    { id: 'B', text: 'Stack', isCorrect: true },
                    { id: 'C', text: 'Array', isCorrect: false },
                    { id: 'D', text: 'Tree', isCorrect: false }
                ],
                explanation: 'Stack is perfect for back button - each page visit is pushed, and clicking back pops the most recent page.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the height of a complete binary tree with 7 nodes?',
                options: [
                    { id: 'A', text: '2', isCorrect: true },
                    { id: 'B', text: '3', isCorrect: false },
                    { id: 'C', text: '4', isCorrect: false },
                    { id: 'D', text: '7', isCorrect: false }
                ],
                explanation: 'A complete binary tree with 7 nodes has height 2 (levels: root=0, 2 children=1, 4 children=2).',
                difficulty: 'easy'
            }
        ]
    },

    // ===== DSA INTERMEDIATE - MEDIUM =====
    {
        id: 'dsa-intermediate',
        title: 'DSA Intermediate',
        description: 'Test your understanding of intermediate data structures and algorithms',
        category: 'dsa',
        difficulty: 'medium',
        metadata: {
            estimatedTime: 25,
            totalQuestions: 15,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is the time complexity of inserting a node at the beginning of a doubly linked list?',
                options: [
                    { id: 'A', text: 'O(1)', isCorrect: true },
                    { id: 'B', text: 'O(n)', isCorrect: false },
                    { id: 'C', text: 'O(log n)', isCorrect: false },
                    { id: 'D', text: 'O(n²)', isCorrect: false }
                ],
                explanation: 'Inserting at the beginning of a doubly linked list is O(1) as we only need to update a few pointers.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which data structure is used to implement priority queue efficiently?',
                options: [
                    { id: 'A', text: 'Array', isCorrect: false },
                    { id: 'B', text: 'Linked List', isCorrect: false },
                    { id: 'C', text: 'Heap', isCorrect: true },
                    { id: 'D', text: 'Stack', isCorrect: false }
                ],
                explanation: 'Heap provides O(log n) insertion and extraction of min/max element, making it ideal for priority queues.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the average time complexity of hash table lookup?',
                options: [
                    { id: 'A', text: 'O(n)', isCorrect: false },
                    { id: 'B', text: 'O(1)', isCorrect: true },
                    { id: 'C', text: 'O(log n)', isCorrect: false },
                    { id: 'D', text: 'O(n log n)', isCorrect: false }
                ],
                explanation: 'Hash tables provide O(1) average case lookup by using a hash function to compute the index directly.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which traversal of BST gives elements in sorted order?',
                options: [
                    { id: 'A', text: 'Preorder', isCorrect: false },
                    { id: 'B', text: 'Postorder', isCorrect: false },
                    { id: 'C', text: 'Inorder', isCorrect: true },
                    { id: 'D', text: 'Level order', isCorrect: false }
                ],
                explanation: 'Inorder traversal (Left-Root-Right) of a BST visits nodes in ascending sorted order.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the worst-case time complexity of Quick Sort?',
                options: [
                    { id: 'A', text: 'O(n log n)', isCorrect: false },
                    { id: 'B', text: 'O(n)', isCorrect: false },
                    { id: 'C', text: 'O(n²)', isCorrect: true },
                    { id: 'D', text: 'O(log n)', isCorrect: false }
                ],
                explanation: 'Quick Sort has O(n²) worst case when the pivot is always the smallest or largest element.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the time complexity of Merge Sort in all cases?',
                options: [
                    { id: 'A', text: 'O(n)', isCorrect: false },
                    { id: 'B', text: 'O(n log n)', isCorrect: true },
                    { id: 'C', text: 'O(n²)', isCorrect: false },
                    { id: 'D', text: 'O(log n)', isCorrect: false }
                ],
                explanation: 'Merge Sort always divides array in half and merges, giving consistent O(n log n) time complexity.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which algorithm is used to find the shortest path in an unweighted graph?',
                options: [
                    { id: 'A', text: 'DFS', isCorrect: false },
                    { id: 'B', text: 'BFS', isCorrect: true },
                    { id: 'C', text: 'Dijkstra', isCorrect: false },
                    { id: 'D', text: 'Bellman-Ford', isCorrect: false }
                ],
                explanation: 'BFS explores nodes level by level, naturally finding shortest path in unweighted graphs.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the space complexity of Merge Sort?',
                options: [
                    { id: 'A', text: 'O(1)', isCorrect: false },
                    { id: 'B', text: 'O(log n)', isCorrect: false },
                    { id: 'C', text: 'O(n)', isCorrect: true },
                    { id: 'D', text: 'O(n log n)', isCorrect: false }
                ],
                explanation: 'Merge Sort requires O(n) auxiliary space for merging the sorted subarrays.',
                difficulty: 'medium'
            },
            {
                questionText: 'In a min-heap, what is the relationship between parent and child nodes?',
                options: [
                    { id: 'A', text: 'Parent > Children', isCorrect: false },
                    { id: 'B', text: 'Parent < Children', isCorrect: true },
                    { id: 'C', text: 'Parent = Children', isCorrect: false },
                    { id: 'D', text: 'No relationship', isCorrect: false }
                ],
                explanation: 'In a min-heap, every parent node is smaller than or equal to its children.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the time complexity of heapify operation?',
                options: [
                    { id: 'A', text: 'O(1)', isCorrect: false },
                    { id: 'B', text: 'O(log n)', isCorrect: true },
                    { id: 'C', text: 'O(n)', isCorrect: false },
                    { id: 'D', text: 'O(n log n)', isCorrect: false }
                ],
                explanation: 'Heapify operation traverses from a node to its leaf, which is at most O(log n) for a heap of n elements.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which data structure is used for detecting cycle in a graph?',
                options: [
                    { id: 'A', text: 'Queue', isCorrect: false },
                    { id: 'B', text: 'Stack', isCorrect: false },
                    { id: 'C', text: 'Union-Find', isCorrect: true },
                    { id: 'D', text: 'Hash Table', isCorrect: false }
                ],
                explanation: 'Union-Find (Disjoint Set) efficiently detects cycles by tracking connected components.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the time complexity of building a heap from n elements?',
                options: [
                    { id: 'A', text: 'O(n log n)', isCorrect: false },
                    { id: 'B', text: 'O(n)', isCorrect: true },
                    { id: 'C', text: 'O(log n)', isCorrect: false },
                    { id: 'D', text: 'O(n²)', isCorrect: false }
                ],
                explanation: 'Building a heap using bottom-up approach is O(n), not O(n log n) as one might expect.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a balanced BST?',
                options: [
                    { id: 'A', text: 'BST with equal left and right subtree sizes', isCorrect: false },
                    { id: 'B', text: 'BST where height difference between subtrees is at most 1', isCorrect: true },
                    { id: 'C', text: 'BST with no duplicate values', isCorrect: false },
                    { id: 'D', text: 'BST with all leaves at same level', isCorrect: false }
                ],
                explanation: 'A balanced BST (like AVL) maintains height difference of at most 1 between left and right subtrees.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the purpose of collision handling in hash tables?',
                options: [
                    { id: 'A', text: 'To speed up insertion', isCorrect: false },
                    { id: 'B', text: 'To handle multiple keys mapping to same index', isCorrect: true },
                    { id: 'C', text: 'To resize the table', isCorrect: false },
                    { id: 'D', text: 'To sort the keys', isCorrect: false }
                ],
                explanation: 'Collision handling (chaining or open addressing) resolves when multiple keys hash to the same index.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which sorting algorithm is stable?',
                options: [
                    { id: 'A', text: 'Quick Sort', isCorrect: false },
                    { id: 'B', text: 'Heap Sort', isCorrect: false },
                    { id: 'C', text: 'Merge Sort', isCorrect: true },
                    { id: 'D', text: 'Selection Sort', isCorrect: false }
                ],
                explanation: 'Merge Sort is stable - it preserves the relative order of equal elements after sorting.',
                difficulty: 'medium'
            }
        ]
    },

    // ===== ADVANCED DSA - HARD =====
    {
        id: 'advanced-dsa',
        title: 'Advanced DSA',
        description: 'Challenge yourself with advanced algorithms and data structures',
        category: 'dsa',
        difficulty: 'hard',
        metadata: {
            estimatedTime: 30,
            totalQuestions: 15,
            passingScore: 70
        },
        questions: [
            {
                questionText: "What is the time complexity of Dijkstra's shortest path algorithm using a binary heap?",
                options: [
                    { id: 'A', text: 'O(V²)', isCorrect: false },
                    { id: 'B', text: 'O((V + E) log V)', isCorrect: true },
                    { id: 'C', text: 'O(V * E)', isCorrect: false },
                    { id: 'D', text: 'O(E log E)', isCorrect: false }
                ],
                explanation: "Using a binary heap, Dijkstra's algorithm runs in O((V + E) log V) time for V vertices and E edges.",
                difficulty: 'hard'
            },
            {
                questionText: 'Which algorithm is used to find the Minimum Spanning Tree?',
                options: [
                    { id: 'A', text: "Dijkstra's Algorithm", isCorrect: false },
                    { id: 'B', text: 'Bellman-Ford Algorithm', isCorrect: false },
                    { id: 'C', text: "Prim's Algorithm", isCorrect: true },
                    { id: 'D', text: 'Floyd-Warshall Algorithm', isCorrect: false }
                ],
                explanation: "Prim's and Kruskal's algorithms are used to find the Minimum Spanning Tree of a graph.",
                difficulty: 'hard'
            },
            {
                questionText: 'What is the time complexity of the 0/1 Knapsack problem using dynamic programming?',
                options: [
                    { id: 'A', text: 'O(n)', isCorrect: false },
                    { id: 'B', text: 'O(nW)', isCorrect: true },
                    { id: 'C', text: 'O(2^n)', isCorrect: false },
                    { id: 'D', text: 'O(n log n)', isCorrect: false }
                ],
                explanation: 'The DP solution for 0/1 Knapsack runs in O(nW) where n is number of items and W is capacity.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the amortized time complexity of inserting into a dynamic array?',
                options: [
                    { id: 'A', text: 'O(1)', isCorrect: true },
                    { id: 'B', text: 'O(n)', isCorrect: false },
                    { id: 'C', text: 'O(log n)', isCorrect: false },
                    { id: 'D', text: 'O(n²)', isCorrect: false }
                ],
                explanation: 'While occasional resizing takes O(n), the amortized cost per insertion is O(1) when doubling capacity.',
                difficulty: 'hard'
            },
            {
                questionText: 'Which data structure is used in LRU Cache implementation?',
                options: [
                    { id: 'A', text: 'Stack and Array', isCorrect: false },
                    { id: 'B', text: 'HashMap and Doubly Linked List', isCorrect: true },
                    { id: 'C', text: 'Queue and Binary Tree', isCorrect: false },
                    { id: 'D', text: 'Heap and HashMap', isCorrect: false }
                ],
                explanation: 'LRU Cache uses HashMap for O(1) lookup and Doubly Linked List for O(1) removal/insertion.',
                difficulty: 'hard'
            },
            {
                questionText: "What is the time complexity of finding strongly connected components using Tarjan's algorithm?",
                options: [
                    { id: 'A', text: 'O(V + E)', isCorrect: true },
                    { id: 'B', text: 'O(V²)', isCorrect: false },
                    { id: 'C', text: 'O(V * E)', isCorrect: false },
                    { id: 'D', text: 'O(E²)', isCorrect: false }
                ],
                explanation: "Tarjan's algorithm visits each vertex and edge exactly once, resulting in O(V + E) complexity.",
                difficulty: 'hard'
            },
            {
                questionText: 'Which algorithm is used to detect negative weight cycles in a graph?',
                options: [
                    { id: 'A', text: 'BFS', isCorrect: false },
                    { id: 'B', text: "Dijkstra's Algorithm", isCorrect: false },
                    { id: 'C', text: 'Bellman-Ford Algorithm', isCorrect: true },
                    { id: 'D', text: 'DFS', isCorrect: false }
                ],
                explanation: 'Bellman-Ford can detect negative weight cycles by running one extra iteration after V-1 iterations.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the height of an AVL tree with n nodes?',
                options: [
                    { id: 'A', text: 'O(n)', isCorrect: false },
                    { id: 'B', text: 'O(log n)', isCorrect: true },
                    { id: 'C', text: 'O(n log n)', isCorrect: false },
                    { id: 'D', text: 'O(√n)', isCorrect: false }
                ],
                explanation: 'AVL trees are self-balancing BSTs, always maintaining a height of O(log n).',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the purpose of the KMP failure function (prefix function)?',
                options: [
                    { id: 'A', text: 'To sort the pattern', isCorrect: false },
                    { id: 'B', text: 'To find the longest proper prefix which is also a suffix', isCorrect: true },
                    { id: 'C', text: 'To reverse the pattern', isCorrect: false },
                    { id: 'D', text: 'To hash the pattern', isCorrect: false }
                ],
                explanation: 'The failure/prefix function computes longest proper prefix-suffix matches to avoid redundant comparisons.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the time complexity of Floyd-Warshall algorithm?',
                options: [
                    { id: 'A', text: 'O(V²)', isCorrect: false },
                    { id: 'B', text: 'O(V³)', isCorrect: true },
                    { id: 'C', text: 'O(V * E)', isCorrect: false },
                    { id: 'D', text: 'O(E²)', isCorrect: false }
                ],
                explanation: 'Floyd-Warshall uses three nested loops over all vertices, resulting in O(V³) time complexity.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a Segment Tree used for?',
                options: [
                    { id: 'A', text: 'Sorting elements', isCorrect: false },
                    { id: 'B', text: 'Range queries and updates', isCorrect: true },
                    { id: 'C', text: 'Finding shortest paths', isCorrect: false },
                    { id: 'D', text: 'Hashing', isCorrect: false }
                ],
                explanation: 'Segment Tree efficiently answers range queries (sum, min, max) and point updates in O(log n) time.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the time complexity of the Union-Find operation with path compression and union by rank?',
                options: [
                    { id: 'A', text: 'O(1)', isCorrect: false },
                    { id: 'B', text: 'O(log n)', isCorrect: false },
                    { id: 'C', text: 'O(α(n)) - nearly constant', isCorrect: true },
                    { id: 'D', text: 'O(n)', isCorrect: false }
                ],
                explanation: 'With both optimizations, Union-Find has O(α(n)) complexity where α is the inverse Ackermann function.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a Trie data structure primarily used for?',
                options: [
                    { id: 'A', text: 'Sorting numbers', isCorrect: false },
                    { id: 'B', text: 'String prefix matching and autocomplete', isCorrect: true },
                    { id: 'C', text: 'Graph traversal', isCorrect: false },
                    { id: 'D', text: 'Matrix operations', isCorrect: false }
                ],
                explanation: 'Trie (prefix tree) is excellent for string operations like prefix matching, autocomplete, and spell checking.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the time complexity of Longest Common Subsequence (LCS) using DP?',
                options: [
                    { id: 'A', text: 'O(n)', isCorrect: false },
                    { id: 'B', text: 'O(m * n)', isCorrect: true },
                    { id: 'C', text: 'O(m + n)', isCorrect: false },
                    { id: 'D', text: 'O(2^n)', isCorrect: false }
                ],
                explanation: 'LCS using DP fills an m×n table, where m and n are lengths of the two strings.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is topological sorting used for?',
                options: [
                    { id: 'A', text: 'Sorting numbers in ascending order', isCorrect: false },
                    { id: 'B', text: 'Ordering tasks with dependencies', isCorrect: true },
                    { id: 'C', text: 'Finding minimum spanning tree', isCorrect: false },
                    { id: 'D', text: 'Balancing trees', isCorrect: false }
                ],
                explanation: 'Topological sort orders vertices in a DAG such that for every edge u→v, u comes before v.',
                difficulty: 'hard'
            }
        ]
    },

    // ===== ARRAYS AND STRINGS - MEDIUM =====
    {
        id: 'arrays-strings',
        title: 'Arrays and Strings',
        description: 'Master array manipulation and string algorithms',
        category: 'dsa',
        difficulty: 'medium',
        metadata: {
            estimatedTime: 25,
            totalQuestions: 12,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is the time complexity of reversing an array in-place?',
                options: [
                    { id: 'A', text: 'O(1)', isCorrect: false },
                    { id: 'B', text: 'O(n)', isCorrect: true },
                    { id: 'C', text: 'O(n²)', isCorrect: false },
                    { id: 'D', text: 'O(log n)', isCorrect: false }
                ],
                explanation: 'Reversing an array requires visiting each element once to swap with its mirror, taking O(n) time.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the two-pointer technique commonly used for?',
                options: [
                    { id: 'A', text: 'Sorting', isCorrect: false },
                    { id: 'B', text: 'Finding pairs with given sum in sorted array', isCorrect: true },
                    { id: 'C', text: 'Building trees', isCorrect: false },
                    { id: 'D', text: 'Graph traversal', isCorrect: false }
                ],
                explanation: 'Two-pointer technique efficiently solves problems like finding pairs, removing duplicates, and more.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the sliding window technique used for?',
                options: [
                    { id: 'A', text: 'Sorting elements', isCorrect: false },
                    { id: 'B', text: 'Finding maximum sum subarray of fixed size', isCorrect: true },
                    { id: 'C', text: 'Building heaps', isCorrect: false },
                    { id: 'D', text: 'Tree traversal', isCorrect: false }
                ],
                explanation: 'Sliding window maintains a window of elements and slides it to solve subarray problems efficiently.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the Kadane\'s algorithm used for?',
                options: [
                    { id: 'A', text: 'Sorting arrays', isCorrect: false },
                    { id: 'B', text: 'Finding maximum subarray sum', isCorrect: true },
                    { id: 'C', text: 'String matching', isCorrect: false },
                    { id: 'D', text: 'Finding median', isCorrect: false }
                ],
                explanation: 'Kadane\'s algorithm finds the maximum contiguous subarray sum in O(n) time.',
                difficulty: 'medium'
            },
            {
                questionText: 'How many subarrays can be formed from an array of n elements?',
                options: [
                    { id: 'A', text: 'n', isCorrect: false },
                    { id: 'B', text: 'n²', isCorrect: false },
                    { id: 'C', text: 'n(n+1)/2', isCorrect: true },
                    { id: 'D', text: '2^n', isCorrect: false }
                ],
                explanation: 'There are n(n+1)/2 subarrays: 1 subarray of size n, 2 of size n-1, ..., n of size 1.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the time complexity of finding duplicates in an array using a hash set?',
                options: [
                    { id: 'A', text: 'O(n²)', isCorrect: false },
                    { id: 'B', text: 'O(n log n)', isCorrect: false },
                    { id: 'C', text: 'O(n)', isCorrect: true },
                    { id: 'D', text: 'O(1)', isCorrect: false }
                ],
                explanation: 'Using a hash set, we check each element in O(1) average time, giving O(n) overall.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is an anagram?',
                options: [
                    { id: 'A', text: 'Two strings with same length', isCorrect: false },
                    { id: 'B', text: 'Two strings that are rearrangements of each other', isCorrect: true },
                    { id: 'C', text: 'Two identical strings', isCorrect: false },
                    { id: 'D', text: 'Two strings with same first character', isCorrect: false }
                ],
                explanation: 'Anagrams are strings formed by rearranging letters of another, like "listen" and "silent".',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the time complexity of checking if two strings are anagrams using sorting?',
                options: [
                    { id: 'A', text: 'O(n)', isCorrect: false },
                    { id: 'B', text: 'O(n log n)', isCorrect: true },
                    { id: 'C', text: 'O(n²)', isCorrect: false },
                    { id: 'D', text: 'O(1)', isCorrect: false }
                ],
                explanation: 'Sorting both strings takes O(n log n), then comparison takes O(n). Overall O(n log n).',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the Dutch National Flag algorithm used for?',
                options: [
                    { id: 'A', text: 'Sorting arrays with 3 distinct values', isCorrect: true },
                    { id: 'B', text: 'Finding duplicates', isCorrect: false },
                    { id: 'C', text: 'Binary search', isCorrect: false },
                    { id: 'D', text: 'Graph coloring', isCorrect: false }
                ],
                explanation: 'Dutch National Flag sorts an array with 3 distinct values (like 0,1,2) in single pass O(n).',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a palindrome?',
                options: [
                    { id: 'A', text: 'A string that reads same forwards and backwards', isCorrect: true },
                    { id: 'B', text: 'A string with unique characters', isCorrect: false },
                    { id: 'C', text: 'A string with repeated characters', isCorrect: false },
                    { id: 'D', text: 'A sorted string', isCorrect: false }
                ],
                explanation: 'A palindrome reads the same forwards and backwards, like "madam" or "racecar".',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the time complexity of finding the longest palindromic substring using DP?',
                options: [
                    { id: 'A', text: 'O(n)', isCorrect: false },
                    { id: 'B', text: 'O(n²)', isCorrect: true },
                    { id: 'C', text: 'O(n³)', isCorrect: false },
                    { id: 'D', text: 'O(2^n)', isCorrect: false }
                ],
                explanation: 'DP approach uses O(n²) time and space to check all substrings for palindrome property.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the difference between subarray and subsequence?',
                options: [
                    { id: 'A', text: 'They are the same', isCorrect: false },
                    { id: 'B', text: 'Subarray is contiguous, subsequence may not be', isCorrect: true },
                    { id: 'C', text: 'Subsequence is contiguous, subarray may not be', isCorrect: false },
                    { id: 'D', text: 'Both must be sorted', isCorrect: false }
                ],
                explanation: 'Subarray elements are contiguous in original array; subsequence preserves order but can skip elements.',
                difficulty: 'easy'
            }
        ]
    },

    // ===== TREES AND GRAPHS - HARD =====
    {
        id: 'trees-graphs',
        title: 'Trees and Graphs',
        description: 'Deep dive into tree and graph algorithms',
        category: 'dsa',
        difficulty: 'hard',
        metadata: {
            estimatedTime: 30,
            totalQuestions: 12,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is the time complexity of BFS traversal?',
                options: [
                    { id: 'A', text: 'O(V)', isCorrect: false },
                    { id: 'B', text: 'O(E)', isCorrect: false },
                    { id: 'C', text: 'O(V + E)', isCorrect: true },
                    { id: 'D', text: 'O(V * E)', isCorrect: false }
                ],
                explanation: 'BFS visits each vertex once O(V) and explores each edge once O(E), giving O(V + E).',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the diameter of a binary tree?',
                options: [
                    { id: 'A', text: 'Number of nodes', isCorrect: false },
                    { id: 'B', text: 'Longest path between any two nodes', isCorrect: true },
                    { id: 'C', text: 'Height of the tree', isCorrect: false },
                    { id: 'D', text: 'Number of leaves', isCorrect: false }
                ],
                explanation: 'Diameter is the length of the longest path between any two nodes, may or may not pass through root.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a complete binary tree?',
                options: [
                    { id: 'A', text: 'All nodes have 2 children', isCorrect: false },
                    { id: 'B', text: 'All levels fully filled except possibly last, which is left-filled', isCorrect: true },
                    { id: 'C', text: 'All leaves at same level', isCorrect: false },
                    { id: 'D', text: 'Height equals number of nodes', isCorrect: false }
                ],
                explanation: 'Complete binary tree has all levels full except the last, which is filled from left to right.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the difference between DFS and BFS?',
                options: [
                    { id: 'A', text: 'DFS uses queue, BFS uses stack', isCorrect: false },
                    { id: 'B', text: 'DFS goes deep first, BFS explores level by level', isCorrect: true },
                    { id: 'C', text: 'They are identical', isCorrect: false },
                    { id: 'D', text: 'DFS only works on trees', isCorrect: false }
                ],
                explanation: 'DFS explores as deep as possible before backtracking; BFS explores all neighbors before going deeper.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a bipartite graph?',
                options: [
                    { id: 'A', text: 'A graph with exactly 2 nodes', isCorrect: false },
                    { id: 'B', text: 'A graph that can be 2-colored', isCorrect: true },
                    { id: 'C', text: 'A graph with 2 connected components', isCorrect: false },
                    { id: 'D', text: 'A complete graph', isCorrect: false }
                ],
                explanation: 'A bipartite graph can have its vertices divided into two disjoint sets with edges only between sets.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the Lowest Common Ancestor (LCA)?',
                options: [
                    { id: 'A', text: 'The root of the tree', isCorrect: false },
                    { id: 'B', text: 'Deepest node that is ancestor of both given nodes', isCorrect: true },
                    { id: 'C', text: 'Parent of both nodes', isCorrect: false },
                    { id: 'D', text: 'Leftmost node in tree', isCorrect: false }
                ],
                explanation: 'LCA is the deepest node that is an ancestor of both given nodes in the tree.',
                difficulty: 'hard'
            },
            {
                questionText: "What is Kruskal's algorithm used for?",
                options: [
                    { id: 'A', text: 'Shortest path', isCorrect: false },
                    { id: 'B', text: 'Minimum Spanning Tree', isCorrect: true },
                    { id: 'C', text: 'Topological sorting', isCorrect: false },
                    { id: 'D', text: 'Cycle detection', isCorrect: false }
                ],
                explanation: "Kruskal's algorithm finds MST by greedily adding edges in order of weight without creating cycles.",
                difficulty: 'hard'
            },
            {
                questionText: 'What is a DAG?',
                options: [
                    { id: 'A', text: 'Directed Acyclic Graph', isCorrect: true },
                    { id: 'B', text: 'Dynamic Allocation Graph', isCorrect: false },
                    { id: 'C', text: 'Distributed Algorithm Graph', isCorrect: false },
                    { id: 'D', text: 'Data Access Graph', isCorrect: false }
                ],
                explanation: 'DAG is a Directed Acyclic Graph - a directed graph with no cycles.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the time complexity of checking if a graph is connected using DFS?',
                options: [
                    { id: 'A', text: 'O(V)', isCorrect: false },
                    { id: 'B', text: 'O(V + E)', isCorrect: true },
                    { id: 'C', text: 'O(V²)', isCorrect: false },
                    { id: 'D', text: 'O(E²)', isCorrect: false }
                ],
                explanation: 'DFS traversal visits all vertices and edges once, checking if all vertices are reachable.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the space complexity of storing a graph using adjacency list?',
                options: [
                    { id: 'A', text: 'O(V)', isCorrect: false },
                    { id: 'B', text: 'O(V + E)', isCorrect: true },
                    { id: 'C', text: 'O(V²)', isCorrect: false },
                    { id: 'D', text: 'O(E²)', isCorrect: false }
                ],
                explanation: 'Adjacency list stores V vertices and E edges, requiring O(V + E) space.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the difference between adjacency matrix and adjacency list?',
                options: [
                    { id: 'A', text: 'Matrix is O(V²) space, list is O(V+E) space', isCorrect: true },
                    { id: 'B', text: 'They use same space', isCorrect: false },
                    { id: 'C', text: 'Matrix is only for directed graphs', isCorrect: false },
                    { id: 'D', text: 'List is only for undirected graphs', isCorrect: false }
                ],
                explanation: 'Adjacency matrix uses O(V²) space; adjacency list uses O(V+E), more efficient for sparse graphs.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a Red-Black Tree?',
                options: [
                    { id: 'A', text: 'A binary tree with colored nodes for balancing', isCorrect: true },
                    { id: 'B', text: 'A tree that stores colors', isCorrect: false },
                    { id: 'C', text: 'A graph visualization', isCorrect: false },
                    { id: 'D', text: 'A tree with only two types of values', isCorrect: false }
                ],
                explanation: 'Red-Black Tree is a self-balancing BST where nodes are colored red/black to maintain balance.',
                difficulty: 'hard'
            }
        ]
    }
];

const seedDSAQuizzes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find admin user for createdBy field
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('⚠️  No admin found, creating one...');
            admin = await User.create({
                username: 'admin',
                email: 'admin@brainspark.com',
                password: 'admin123',
                role: 'admin'
            });
        }

        // Delete existing DSA quizzes
        await Quiz.deleteMany({ category: 'dsa' });
        console.log('🗑️  Cleared existing DSA quizzes');

        // Insert quizzes with admin as creator
        const quizzesWithCreator = dsaQuizzes.map(quiz => ({
            ...quiz,
            createdBy: admin._id
        }));

        await Quiz.insertMany(quizzesWithCreator);

        // Count total questions
        const totalQuestions = dsaQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

        console.log(`✅ Seeded ${dsaQuizzes.length} DSA quizzes with ${totalQuestions} total questions!`);
        console.log('\n📊 DSA Quiz Summary:');
        dsaQuizzes.forEach(quiz => {
            console.log(`   - ${quiz.title}: ${quiz.questions.length} questions (${quiz.difficulty})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding DSA quizzes:', error);
        process.exit(1);
    }
};

seedDSAQuizzes();
