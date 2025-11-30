const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const quizzes = [
    {
        id: 'dsa-basics',
        title: 'DSA Basics',
        description: 'Test your knowledge of fundamental data structures and algorithms',
        category: 'dsa',
        difficulty: 'easy',
        metadata: {
            estimatedTime: 10,
            totalQuestions: 3,
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
            }
        ]
    },
    {
        id: 'operating-systems',
        title: 'Operating Systems',
        description: 'Master the fundamentals of operating systems',
        category: 'operating-systems',
        difficulty: 'medium',
        metadata: {
            estimatedTime: 5,
            totalQuestions: 1,
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
                difficulty: 'medium'
            }
        ]
    },
    {
        id: 'dbms-fundamentals',
        title: 'DBMS Fundamentals',
        description: 'Test your database management knowledge',
        category: 'dbms',
        difficulty: 'medium',
        metadata: {
            estimatedTime: 5,
            totalQuestions: 1,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What does ACID stand for in database transactions?',
                options: [
                    { id: 'A', text: 'Atomic, Consistent, Isolated, Durable', isCorrect: true },
                    { id: 'B', text: 'Automatic, Complete, Independent, Dynamic', isCorrect: false },
                    { id: 'C', text: 'Active, Continuous, Immediate, Direct', isCorrect: false },
                    { id: 'D', text: 'Atomic, Complete, Immediate, Dynamic', isCorrect: false }
                ],
                explanation: 'ACID properties ensure reliable database transactions: Atomicity, Consistency, Isolation, and Durability.',
                difficulty: 'medium'
            }
        ]
    },
    {
        id: 'advanced-dsa',
        title: 'Advanced DSA',
        description: 'Challenge yourself with advanced algorithms',
        category: 'dsa',
        difficulty: 'hard',
        metadata: {
            estimatedTime: 5,
            totalQuestions: 1,
            passingScore: 70
        },
        questions: [
            {
                questionText: "What is the time complexity of Dijkstra's shortest path algorithm?",
                options: [
                    { id: 'A', text: 'O(V²)', isCorrect: false },
                    { id: 'B', text: 'O((V + E) log V)', isCorrect: true },
                    { id: 'C', text: 'O(V * E)', isCorrect: false },
                    { id: 'D', text: 'O(E log E)', isCorrect: false }
                ],
                explanation: "Using a binary heap, Dijkstra's algorithm runs in O((V + E) log V) time.",
                difficulty: 'hard'
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

        // Insert quizzes with admin as creator
        const quizzesWithCreator = quizzes.map(quiz => ({
            ...quiz,
            createdBy: admin._id
        }));

        await Quiz.insertMany(quizzesWithCreator);

        console.log('✅ Seeded', quizzes.length, 'quizzes');
        console.log('🎉 Database seeded successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
