const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const quizzes = [
    // ===== DSA QUIZZES =====
    {
        id: 'dsa-basics',
        title: 'DSA Basics',
        description: 'Test your knowledge of fundamental data structures and algorithms',
        category: 'dsa',
        difficulty: 'easy',
        metadata: {
            estimatedTime: 15,
            totalQuestions: 10,
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
                explanation: 'Array access by index is O(1) because arrays store elements in contiguous memory locations.',
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
                explanation: 'Stack follows LIFO principle - the last element added is the first one to be removed.',
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
                explanation: 'Linked lists can grow or shrink dynamically, while arrays have fixed sizes.',
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
                explanation: 'Queue follows FIFO principle - the first element added is the first one to be removed.',
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
                explanation: 'Binary search divides the search space in half each time, resulting in O(log n) complexity.',
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
                explanation: 'Bubble Sort compares adjacent elements and swaps them, resulting in O(n²) in the worst case.',
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
                explanation: 'Preorder traversal visits Root -> Left -> Right, so the root is visited first.',
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
                explanation: 'A binary tree node can have at most 2 children - left and right.',
                difficulty: 'easy'
            },
            {
                questionText: 'What data structure is used to implement recursion?',
                options: [
                    { id: 'A', text: 'Queue', isCorrect: false },
                    { id: 'B', text: 'Stack', isCorrect: true },
                    { id: 'C', text: 'Array', isCorrect: false },
                    { id: 'D', text: 'Linked List', isCorrect: false }
                ],
                explanation: 'The call stack is used to store function calls during recursion.',
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
                explanation: 'Quick Sort has an average-case time complexity of O(n log n).',
                difficulty: 'easy'
            }
        ]
    },
    {
        id: 'advanced-dsa',
        title: 'Advanced DSA',
        description: 'Challenge yourself with advanced algorithms and data structures',
        category: 'dsa',
        difficulty: 'hard',
        metadata: {
            estimatedTime: 25,
            totalQuestions: 10,
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
                explanation: "Using a binary heap, Dijkstra's algorithm runs in O((V + E) log V) time.",
                difficulty: 'hard'
            },
            {
                questionText: 'What is the space complexity of Merge Sort?',
                options: [
                    { id: 'A', text: 'O(1)', isCorrect: false },
                    { id: 'B', text: 'O(log n)', isCorrect: false },
                    { id: 'C', text: 'O(n)', isCorrect: true },
                    { id: 'D', text: 'O(n²)', isCorrect: false }
                ],
                explanation: 'Merge Sort requires O(n) auxiliary space for merging.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which algorithm is used to find the Minimum Spanning Tree?',
                options: [
                    { id: 'A', text: "Dijkstra's Algorithm", isCorrect: false },
                    { id: 'B', text: 'Bellman-Ford Algorithm', isCorrect: false },
                    { id: 'C', text: "Prim's Algorithm", isCorrect: true },
                    { id: 'D', text: 'Floyd-Warshall Algorithm', isCorrect: false }
                ],
                explanation: "Prim's and Kruskal's algorithms are used to find the Minimum Spanning Tree.",
                difficulty: 'hard'
            },
            {
                questionText: 'What is the time complexity of the Knapsack problem using dynamic programming?',
                options: [
                    { id: 'A', text: 'O(n)', isCorrect: false },
                    { id: 'B', text: 'O(nW)', isCorrect: true },
                    { id: 'C', text: 'O(2^n)', isCorrect: false },
                    { id: 'D', text: 'O(n log n)', isCorrect: false }
                ],
                explanation: 'The DP solution for 0/1 Knapsack runs in O(nW) where n is items and W is capacity.',
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
                explanation: 'While occasional resizing takes O(n), the amortized cost per insertion is O(1).',
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
                explanation: 'LRU Cache uses HashMap for O(1) lookup and Doubly Linked List for O(1) removal.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the time complexity of finding strongly connected components using Tarjan\'s algorithm?',
                options: [
                    { id: 'A', text: 'O(V + E)', isCorrect: true },
                    { id: 'B', text: 'O(V²)', isCorrect: false },
                    { id: 'C', text: 'O(V * E)', isCorrect: false },
                    { id: 'D', text: 'O(E²)', isCorrect: false }
                ],
                explanation: 'Tarjan\'s algorithm visits each vertex and edge once, resulting in O(V + E).',
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
                explanation: 'Bellman-Ford can detect negative weight cycles by running one extra iteration.',
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
                explanation: 'AVL trees are self-balancing, maintaining a height of O(log n).',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the purpose of the KMP failure function?',
                options: [
                    { id: 'A', text: 'To sort the pattern', isCorrect: false },
                    { id: 'B', text: 'To find the longest proper prefix which is also a suffix', isCorrect: true },
                    { id: 'C', text: 'To reverse the pattern', isCorrect: false },
                    { id: 'D', text: 'To hash the pattern', isCorrect: false }
                ],
                explanation: 'The failure function helps skip unnecessary comparisons by using prefix-suffix information.',
                difficulty: 'hard'
            }
        ]
    },

    // ===== OPERATING SYSTEMS QUIZZES =====
    {
        id: 'operating-systems',
        title: 'Operating Systems Fundamentals',
        description: 'Master the fundamentals of operating systems',
        category: 'operating-systems',
        difficulty: 'medium',
        metadata: {
            estimatedTime: 20,
            totalQuestions: 10,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is a process in an operating system?',
                options: [
                    { id: 'A', text: 'A program in execution', isCorrect: true },
                    { id: 'B', text: 'A stored program', isCorrect: false },
                    { id: 'C', text: 'A system call', isCorrect: false },
                    { id: 'D', text: 'A hardware component', isCorrect: false }
                ],
                explanation: 'A process is an instance of a program that is being executed.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the difference between a process and a thread?',
                options: [
                    { id: 'A', text: 'Threads share the same memory space, processes do not', isCorrect: true },
                    { id: 'B', text: 'Processes are faster than threads', isCorrect: false },
                    { id: 'C', text: 'Threads cannot communicate with each other', isCorrect: false },
                    { id: 'D', text: 'There is no difference', isCorrect: false }
                ],
                explanation: 'Threads within the same process share memory, while processes have separate address spaces.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a deadlock in operating systems?',
                options: [
                    { id: 'A', text: 'When a process finishes execution', isCorrect: false },
                    { id: 'B', text: 'When processes wait indefinitely for resources held by each other', isCorrect: true },
                    { id: 'C', text: 'When CPU is idle', isCorrect: false },
                    { id: 'D', text: 'When memory is full', isCorrect: false }
                ],
                explanation: 'Deadlock occurs when two or more processes are waiting for each other to release resources.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which scheduling algorithm gives minimum average waiting time?',
                options: [
                    { id: 'A', text: 'FCFS', isCorrect: false },
                    { id: 'B', text: 'SJF (Shortest Job First)', isCorrect: true },
                    { id: 'C', text: 'Round Robin', isCorrect: false },
                    { id: 'D', text: 'Priority Scheduling', isCorrect: false }
                ],
                explanation: 'SJF is proven to give the minimum average waiting time for a given set of processes.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is virtual memory?',
                options: [
                    { id: 'A', text: 'Physical RAM only', isCorrect: false },
                    { id: 'B', text: 'A memory management technique using both RAM and disk', isCorrect: true },
                    { id: 'C', text: 'Cache memory', isCorrect: false },
                    { id: 'D', text: 'ROM memory', isCorrect: false }
                ],
                explanation: 'Virtual memory allows running programs larger than physical RAM by using disk space.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a page fault?',
                options: [
                    { id: 'A', text: 'When a page is corrupted', isCorrect: false },
                    { id: 'B', text: 'When a requested page is not in main memory', isCorrect: true },
                    { id: 'C', text: 'When memory is full', isCorrect: false },
                    { id: 'D', text: 'When a process terminates', isCorrect: false }
                ],
                explanation: 'A page fault occurs when a process accesses a page not currently in RAM.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which of the following is NOT a necessary condition for deadlock?',
                options: [
                    { id: 'A', text: 'Mutual Exclusion', isCorrect: false },
                    { id: 'B', text: 'Hold and Wait', isCorrect: false },
                    { id: 'C', text: 'Preemption', isCorrect: true },
                    { id: 'D', text: 'Circular Wait', isCorrect: false }
                ],
                explanation: 'The four conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is thrashing?',
                options: [
                    { id: 'A', text: 'High CPU utilization', isCorrect: false },
                    { id: 'B', text: 'Excessive paging causing low CPU utilization', isCorrect: true },
                    { id: 'C', text: 'Fast process execution', isCorrect: false },
                    { id: 'D', text: 'Memory leak', isCorrect: false }
                ],
                explanation: 'Thrashing occurs when the system spends more time paging than executing.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the purpose of a semaphore?',
                options: [
                    { id: 'A', text: 'To speed up processes', isCorrect: false },
                    { id: 'B', text: 'To synchronize concurrent processes', isCorrect: true },
                    { id: 'C', text: 'To allocate memory', isCorrect: false },
                    { id: 'D', text: 'To manage files', isCorrect: false }
                ],
                explanation: 'Semaphores are synchronization primitives used to control access to shared resources.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which page replacement algorithm suffers from Belady\'s Anomaly?',
                options: [
                    { id: 'A', text: 'LRU', isCorrect: false },
                    { id: 'B', text: 'Optimal', isCorrect: false },
                    { id: 'C', text: 'FIFO', isCorrect: true },
                    { id: 'D', text: 'LFU', isCorrect: false }
                ],
                explanation: 'FIFO can have more page faults with more frames, known as Belady\'s Anomaly.',
                difficulty: 'hard'
            }
        ]
    },

    // ===== DBMS QUIZZES =====
    {
        id: 'dbms-fundamentals',
        title: 'DBMS Fundamentals',
        description: 'Test your database management knowledge',
        category: 'dbms',
        difficulty: 'medium',
        metadata: {
            estimatedTime: 20,
            totalQuestions: 10,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What does ACID stand for in database transactions?',
                options: [
                    { id: 'A', text: 'Atomicity, Consistency, Isolation, Durability', isCorrect: true },
                    { id: 'B', text: 'Automatic, Complete, Independent, Dynamic', isCorrect: false },
                    { id: 'C', text: 'Active, Continuous, Immediate, Direct', isCorrect: false },
                    { id: 'D', text: 'Atomic, Complete, Immediate, Dynamic', isCorrect: false }
                ],
                explanation: 'ACID properties ensure reliable database transactions: Atomicity, Consistency, Isolation, and Durability.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is normalization in databases?',
                options: [
                    { id: 'A', text: 'Adding more data to tables', isCorrect: false },
                    { id: 'B', text: 'Organizing data to reduce redundancy', isCorrect: true },
                    { id: 'C', text: 'Deleting all tables', isCorrect: false },
                    { id: 'D', text: 'Making all columns nullable', isCorrect: false }
                ],
                explanation: 'Normalization is the process of organizing data to minimize redundancy and dependency.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a primary key?',
                options: [
                    { id: 'A', text: 'Any column in a table', isCorrect: false },
                    { id: 'B', text: 'A unique identifier for each row in a table', isCorrect: true },
                    { id: 'C', text: 'A foreign reference', isCorrect: false },
                    { id: 'D', text: 'An index on the table', isCorrect: false }
                ],
                explanation: 'A primary key uniquely identifies each record in a database table.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a foreign key?',
                options: [
                    { id: 'A', text: 'A key from another country', isCorrect: false },
                    { id: 'B', text: 'A key that references a primary key in another table', isCorrect: true },
                    { id: 'C', text: 'An encryption key', isCorrect: false },
                    { id: 'D', text: 'A composite key', isCorrect: false }
                ],
                explanation: 'A foreign key creates a link between two tables by referencing the primary key of another table.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is SQL injection?',
                options: [
                    { id: 'A', text: 'A way to speed up queries', isCorrect: false },
                    { id: 'B', text: 'A security vulnerability where malicious SQL is inserted', isCorrect: true },
                    { id: 'C', text: 'A database optimization technique', isCorrect: false },
                    { id: 'D', text: 'A type of index', isCorrect: false }
                ],
                explanation: 'SQL injection is a code injection technique that exploits security vulnerabilities.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the purpose of an index in a database?',
                options: [
                    { id: 'A', text: 'To delete data faster', isCorrect: false },
                    { id: 'B', text: 'To speed up data retrieval', isCorrect: true },
                    { id: 'C', text: 'To encrypt data', isCorrect: false },
                    { id: 'D', text: 'To compress data', isCorrect: false }
                ],
                explanation: 'Indexes improve the speed of data retrieval operations on a database table.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the difference between DELETE and TRUNCATE?',
                options: [
                    { id: 'A', text: 'There is no difference', isCorrect: false },
                    { id: 'B', text: 'DELETE can have WHERE clause, TRUNCATE removes all rows', isCorrect: true },
                    { id: 'C', text: 'TRUNCATE is slower', isCorrect: false },
                    { id: 'D', text: 'DELETE is DDL, TRUNCATE is DML', isCorrect: false }
                ],
                explanation: 'DELETE is DML and can be conditional, TRUNCATE is DDL and removes all rows quickly.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a stored procedure?',
                options: [
                    { id: 'A', text: 'A backup of the database', isCorrect: false },
                    { id: 'B', text: 'A precompiled collection of SQL statements', isCorrect: true },
                    { id: 'C', text: 'A type of table', isCorrect: false },
                    { id: 'D', text: 'A database user', isCorrect: false }
                ],
                explanation: 'A stored procedure is a prepared SQL code that you can save and reuse.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is 3NF (Third Normal Form)?',
                options: [
                    { id: 'A', text: 'Table has a primary key', isCorrect: false },
                    { id: 'B', text: 'No transitive dependency and is in 2NF', isCorrect: true },
                    { id: 'C', text: 'All columns are indexed', isCorrect: false },
                    { id: 'D', text: 'Table has exactly 3 columns', isCorrect: false }
                ],
                explanation: '3NF eliminates transitive dependencies and requires the table to be in 2NF.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a view in SQL?',
                options: [
                    { id: 'A', text: 'A physical table', isCorrect: false },
                    { id: 'B', text: 'A virtual table based on a SELECT query', isCorrect: true },
                    { id: 'C', text: 'A backup', isCorrect: false },
                    { id: 'D', text: 'An index', isCorrect: false }
                ],
                explanation: 'A view is a virtual table based on the result set of a SELECT statement.',
                difficulty: 'medium'
            }
        ]
    },

    // ===== NETWORKS QUIZZES =====
    {
        id: 'networks-basics',
        title: 'Computer Networks Basics',
        description: 'Learn networking fundamentals and protocols',
        category: 'networks',
        difficulty: 'medium',
        metadata: {
            estimatedTime: 20,
            totalQuestions: 10,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What does HTTP stand for?',
                options: [
                    { id: 'A', text: 'HyperText Transfer Protocol', isCorrect: true },
                    { id: 'B', text: 'High Transfer Text Protocol', isCorrect: false },
                    { id: 'C', text: 'Hyper Transfer Text Protocol', isCorrect: false },
                    { id: 'D', text: 'Home Tool Transfer Protocol', isCorrect: false }
                ],
                explanation: 'HTTP stands for HyperText Transfer Protocol, used for transmitting web pages.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which layer of the OSI model is responsible for routing?',
                options: [
                    { id: 'A', text: 'Data Link Layer', isCorrect: false },
                    { id: 'B', text: 'Network Layer', isCorrect: true },
                    { id: 'C', text: 'Transport Layer', isCorrect: false },
                    { id: 'D', text: 'Application Layer', isCorrect: false }
                ],
                explanation: 'The Network Layer (Layer 3) handles routing of data packets between networks.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the default port for HTTPS?',
                options: [
                    { id: 'A', text: '80', isCorrect: false },
                    { id: 'B', text: '443', isCorrect: true },
                    { id: 'C', text: '8080', isCorrect: false },
                    { id: 'D', text: '22', isCorrect: false }
                ],
                explanation: 'HTTPS uses port 443 by default, while HTTP uses port 80.',
                difficulty: 'easy'
            },
            {
                questionText: 'What does TCP stand for?',
                options: [
                    { id: 'A', text: 'Transfer Control Protocol', isCorrect: false },
                    { id: 'B', text: 'Transmission Control Protocol', isCorrect: true },
                    { id: 'C', text: 'Transport Control Protocol', isCorrect: false },
                    { id: 'D', text: 'Technical Control Protocol', isCorrect: false }
                ],
                explanation: 'TCP stands for Transmission Control Protocol, a connection-oriented protocol.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the purpose of DNS?',
                options: [
                    { id: 'A', text: 'To encrypt data', isCorrect: false },
                    { id: 'B', text: 'To translate domain names to IP addresses', isCorrect: true },
                    { id: 'C', text: 'To route packets', isCorrect: false },
                    { id: 'D', text: 'To compress data', isCorrect: false }
                ],
                explanation: 'DNS (Domain Name System) translates human-readable domain names to IP addresses.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the difference between TCP and UDP?',
                options: [
                    { id: 'A', text: 'TCP is connectionless, UDP is connection-oriented', isCorrect: false },
                    { id: 'B', text: 'TCP is connection-oriented and reliable, UDP is connectionless', isCorrect: true },
                    { id: 'C', text: 'They are the same', isCorrect: false },
                    { id: 'D', text: 'UDP is slower than TCP', isCorrect: false }
                ],
                explanation: 'TCP provides reliable, ordered delivery while UDP is faster but unreliable.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is an IP address?',
                options: [
                    { id: 'A', text: 'A physical address of a device', isCorrect: false },
                    { id: 'B', text: 'A logical address assigned to a device on a network', isCorrect: true },
                    { id: 'C', text: 'A domain name', isCorrect: false },
                    { id: 'D', text: 'A port number', isCorrect: false }
                ],
                explanation: 'An IP address is a unique logical identifier for a device on a network.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a subnet mask used for?',
                options: [
                    { id: 'A', text: 'To encrypt network traffic', isCorrect: false },
                    { id: 'B', text: 'To divide an IP address into network and host portions', isCorrect: true },
                    { id: 'C', text: 'To speed up connections', isCorrect: false },
                    { id: 'D', text: 'To block websites', isCorrect: false }
                ],
                explanation: 'A subnet mask determines which portion of an IP address is the network and which is the host.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is ARP used for?',
                options: [
                    { id: 'A', text: 'To resolve IP addresses to MAC addresses', isCorrect: true },
                    { id: 'B', text: 'To resolve domain names to IP addresses', isCorrect: false },
                    { id: 'C', text: 'To encrypt data', isCorrect: false },
                    { id: 'D', text: 'To compress packets', isCorrect: false }
                ],
                explanation: 'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses.',
                difficulty: 'medium'
            },
            {
                questionText: 'How many layers are in the OSI model?',
                options: [
                    { id: 'A', text: '4', isCorrect: false },
                    { id: 'B', text: '5', isCorrect: false },
                    { id: 'C', text: '7', isCorrect: true },
                    { id: 'D', text: '6', isCorrect: false }
                ],
                explanation: 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.',
                difficulty: 'easy'
            }
        ]
    }
];

const seedDB = async () => {
    try {
        // Clear existing data
        await Quiz.deleteMany({});
        await User.deleteMany({});

        console.log('🗑️  Cleared existing data');

        // Create admin user
        const admin = await User.create({
            username: 'admin',
            email: 'admin@brainspark.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('👤 Created admin user');

        // Create demo user
        await User.create({
            username: 'demouser',
            email: 'demo@example.com',
            password: 'demo123',
            stats: {
                totalQuizzes: 8,
                currentXP: 1250,
                level: 2,
                currentStreak: 5,
                longestStreak: 12
            }
        });

        console.log('👤 Created demo user');

        // Create additional test users
        await User.create({
            username: 'agent_dg',
            email: 'dhruv621999goyal@gmail.com',
            password: 'test123',
            stats: {
                totalQuizzes: 15,
                currentXP: 2500,
                level: 4,
                currentStreak: 10,
                longestStreak: 20
            }
        });

        await User.create({
            username: 'TEST',
            email: 'dgoyal_be23@thapar.edu',
            password: 'test123',
            stats: {
                totalQuizzes: 3,
                currentXP: 450,
                level: 1,
                currentStreak: 2,
                longestStreak: 5
            }
        });

        console.log('👤 Created additional test users');

        // Insert quizzes with admin as creator
        const quizzesWithCreator = quizzes.map(quiz => ({
            ...quiz,
            createdBy: admin._id
        }));

        await Quiz.insertMany(quizzesWithCreator);

        // Count total questions
        const totalQuestions = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

        console.log('✅ Seeded', quizzes.length, 'quizzes with', totalQuestions, 'total questions');
        console.log('🎉 Database seeded successfully!');
        console.log('\n📝 Quiz Summary:');
        quizzes.forEach(quiz => {
            console.log(`   - ${quiz.title}: ${quiz.questions.length} questions (${quiz.difficulty})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
