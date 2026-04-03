/**
 * MASTER SEED RUNNER
 * Runs all seed files in sequence
 * Run: node seeds/index.seed.js
 * 
 * Options:
 * - node seeds/index.seed.js --all      : Run all seeders
 * - node seeds/index.seed.js --users    : Seed users only
 * - node seeds/index.seed.js --quizzes  : Seed all quizzes only
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { execSync } = require('child_process');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Quiz = require('../models/Quiz');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');

const SEED_FILES = {
    users: 'users.seed.js',
    dsa: 'quizzes-dsa.seed.js',
    os: 'quizzes-os.seed.js',
    dbms: 'quizzes-dbms.seed.js',
    networks: 'quizzes-networks.seed.js',
    oops: 'quizzes-oops.seed.js',
    web: 'quizzes-web.seed.js'
};

const printBanner = () => {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                   🧠 BRAINSPARK SEEDER                      ║');
    console.log('║                  Database Initialization                    ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
};

const clearDatabase = async () => {
    console.log('🗑️  Clearing existing data...');
    
    await User.deleteMany({});
    console.log('   ✓ Cleared users');
    
    await Quiz.deleteMany({});
    console.log('   ✓ Cleared quizzes');
    
    await QuizResult.deleteMany({});
    console.log('   ✓ Cleared quiz results');
    
    console.log('✅ Database cleared!\n');
};

const seedAllData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');
        
        // Clear existing data
        await clearDatabase();
        
        // ===== SEED USERS =====
        console.log('👤 Seeding users...');
        const users = await seedUsersData();
        console.log(`   ✓ Created ${users.length} users\n`);
        
        // Get admin for quiz creation
        const admin = users.find(u => u.role === 'admin') || users[0];
        
        // ===== SEED DSA QUIZZES =====
        console.log('📊 Seeding DSA quizzes...');
        const dsaQuizzes = await seedDSAQuizzes(admin._id);
        console.log(`   ✓ Created ${dsaQuizzes.length} DSA quizzes\n`);
        
        // ===== SEED OS QUIZZES =====
        console.log('💻 Seeding Operating Systems quizzes...');
        const osQuizzes = await seedOSQuizzes(admin._id);
        console.log(`   ✓ Created ${osQuizzes.length} OS quizzes\n`);
        
        // ===== SEED DBMS QUIZZES =====
        console.log('🗄️  Seeding DBMS quizzes...');
        const dbmsQuizzes = await seedDBMSQuizzes(admin._id);
        console.log(`   ✓ Created ${dbmsQuizzes.length} DBMS quizzes\n`);
        
        // ===== SEED NETWORKS QUIZZES =====
        console.log('🌐 Seeding Networking quizzes...');
        const networkQuizzes = await seedNetworkQuizzes(admin._id);
        console.log(`   ✓ Created ${networkQuizzes.length} Network quizzes\n`);
        
        // ===== SEED OOPS QUIZZES =====
        console.log('🎯 Seeding OOPs & System Design quizzes...');
        const oopsQuizzes = await seedOOPsQuizzes(admin._id);
        console.log(`   ✓ Created ${oopsQuizzes.length} OOPs quizzes\n`);
        
        // ===== SEED WEB QUIZZES =====
        console.log('🕸️  Seeding Web Development quizzes...');
        const webQuizzes = await seedWebQuizzes(admin._id);
        console.log(`   ✓ Created ${webQuizzes.length} Web Dev quizzes\n`);
        
        // ===== GENERATE QUIZ RESULTS =====
        console.log('📈 Generating sample quiz results...');
        const results = await generateQuizResults(users);
        console.log(`   ✓ Created ${results.length} quiz results\n`);
        
        // Print summary
        printSummary(users, [
            ...dsaQuizzes,
            ...osQuizzes,
            ...dbmsQuizzes,
            ...networkQuizzes,
            ...oopsQuizzes,
            ...webQuizzes
        ], results);
        
        console.log('\n🎉 Database seeding completed successfully!\n');
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ Seeding failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

// ===== USER SEEDING =====
const seedUsersData = async () => {
    const bcrypt = require('bcryptjs');
    
    // Helper to create achievement objects
    const createAchievements = (ids) => ids.map(id => ({ achievementId: id, unlockedAt: new Date() }));
    
    const users = [
        // Admin users
        {
            username: 'admin',
            email: 'admin@brainspark.com',
            password: await bcrypt.hash('admin123', 10),
            role: 'admin',
            stats: { totalQuizzes: 50, currentXP: 15000, level: 25, currentStreak: 30, longestStreak: 45 }
        },
        {
            username: 'moderator',
            email: 'mod@brainspark.com',
            password: await bcrypt.hash('mod123', 10),
            role: 'admin',
            stats: { totalQuizzes: 30, currentXP: 8000, level: 15, currentStreak: 15, longestStreak: 20 }
        },
        // Top performers
        {
            username: 'dhruv_goyal',
            email: 'dhruv@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'user',
            stats: { totalQuizzes: 120, currentXP: 25000, level: 35, currentStreak: 45, longestStreak: 60 },
            achievements: createAchievements(['quiz_master', 'streak_champion', 'xp_legend', 'perfectionist'])
        },
        {
            username: 'priya_sharma',
            email: 'priya@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'user',
            stats: { totalQuizzes: 95, currentXP: 18000, level: 28, currentStreak: 28, longestStreak: 35 },
            achievements: createAchievements(['quiz_master', 'streak_champion'])
        },
        {
            username: 'rahul_kumar',
            email: 'rahul@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'user',
            stats: { totalQuizzes: 85, currentXP: 15000, level: 22, currentStreak: 20, longestStreak: 25 },
            achievements: createAchievements(['quiz_master'])
        },
        {
            username: 'ananya_singh',
            email: 'ananya@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'user',
            stats: { totalQuizzes: 75, currentXP: 14000, level: 20, currentStreak: 18, longestStreak: 22 },
            achievements: createAchievements(['perfectionist', 'quick_learner'])
        },
        {
            username: 'arjun_patel',
            email: 'arjun@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'user',
            stats: { totalQuizzes: 70, currentXP: 12000, level: 18, currentStreak: 12, longestStreak: 18 },
            achievements: createAchievements(['first_steps'])
        },
        // Regular users
        {
            username: 'neha_gupta',
            email: 'neha@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'user',
            stats: { totalQuizzes: 45, currentXP: 8000, level: 12, currentStreak: 8, longestStreak: 12 }
        },
        {
            username: 'vikram_reddy',
            email: 'vikram@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'user',
            stats: { totalQuizzes: 40, currentXP: 7000, level: 10, currentStreak: 5, longestStreak: 10 }
        },
        {
            username: 'kavya_nair',
            email: 'kavya@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'user',
            stats: { totalQuizzes: 35, currentXP: 6500, level: 9, currentStreak: 10, longestStreak: 14 }
        },
        // New users
        {
            username: 'amit_verma',
            email: 'amit@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'user',
            stats: { totalQuizzes: 10, currentXP: 1500, level: 3, currentStreak: 3, longestStreak: 5 }
        },
        {
            username: 'pooja_mehta',
            email: 'pooja@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'user',
            stats: { totalQuizzes: 8, currentXP: 1200, level: 2, currentStreak: 2, longestStreak: 4 }
        },
        {
            username: 'test_user',
            email: 'test@test.com',
            password: await bcrypt.hash('test123', 10),
            role: 'user',
            stats: { totalQuizzes: 5, currentXP: 500, level: 1, currentStreak: 1, longestStreak: 2 }
        }
    ];
    
    return await User.insertMany(users);
};

// ===== DSA QUIZZES =====
const seedDSAQuizzes = async (adminId) => {
    const quizzes = [
        {
            id: 'dsa-arrays',
            title: 'Arrays & Strings',
            description: 'Master array operations and string manipulation',
            category: 'dsa',
            difficulty: 'easy',
            createdBy: adminId,
            metadata: { estimatedTime: 15, totalQuestions: 10, passingScore: 70 },
            questions: [
                { questionText: 'What is the time complexity of accessing an array element by index?', options: [{ id: 'A', text: 'O(1)', isCorrect: true }, { id: 'B', text: 'O(n)', isCorrect: false }, { id: 'C', text: 'O(log n)', isCorrect: false }, { id: 'D', text: 'O(n²)', isCorrect: false }], explanation: 'Array access by index is O(1) as it directly calculates memory address.', difficulty: 'easy' },
                { questionText: 'Which data structure uses LIFO principle?', options: [{ id: 'A', text: 'Queue', isCorrect: false }, { id: 'B', text: 'Stack', isCorrect: true }, { id: 'C', text: 'Array', isCorrect: false }, { id: 'D', text: 'LinkedList', isCorrect: false }], explanation: 'Stack follows Last In First Out (LIFO) principle.', difficulty: 'easy' },
                { questionText: 'What is the worst case time complexity of linear search?', options: [{ id: 'A', text: 'O(1)', isCorrect: false }, { id: 'B', text: 'O(n)', isCorrect: true }, { id: 'C', text: 'O(log n)', isCorrect: false }, { id: 'D', text: 'O(n log n)', isCorrect: false }], explanation: 'Linear search checks each element, so worst case is O(n).', difficulty: 'easy' }
            ]
        },
        {
            id: 'dsa-trees',
            title: 'Trees & Graphs',
            description: 'Binary trees, BST, and graph algorithms',
            category: 'dsa',
            difficulty: 'hard',
            createdBy: adminId,
            metadata: { estimatedTime: 30, totalQuestions: 10, passingScore: 70 },
            questions: [
                { questionText: 'What is the height of a balanced BST with n nodes?', options: [{ id: 'A', text: 'O(n)', isCorrect: false }, { id: 'B', text: 'O(log n)', isCorrect: true }, { id: 'C', text: 'O(1)', isCorrect: false }, { id: 'D', text: 'O(n²)', isCorrect: false }], explanation: 'A balanced BST has height of O(log n).', difficulty: 'medium' },
                { questionText: 'Which traversal gives sorted order in BST?', options: [{ id: 'A', text: 'Preorder', isCorrect: false }, { id: 'B', text: 'Inorder', isCorrect: true }, { id: 'C', text: 'Postorder', isCorrect: false }, { id: 'D', text: 'Level order', isCorrect: false }], explanation: 'Inorder traversal of BST gives elements in sorted order.', difficulty: 'medium' },
                { questionText: 'Time complexity of BFS on a graph?', options: [{ id: 'A', text: 'O(V)', isCorrect: false }, { id: 'B', text: 'O(E)', isCorrect: false }, { id: 'C', text: 'O(V + E)', isCorrect: true }, { id: 'D', text: 'O(V * E)', isCorrect: false }], explanation: 'BFS visits all vertices and edges once, so O(V + E).', difficulty: 'medium' }
            ]
        }
    ];
    
    return await Quiz.insertMany(quizzes);
};

// ===== OS QUIZZES =====
const seedOSQuizzes = async (adminId) => {
    const quizzes = [
        {
            id: 'os-process',
            title: 'Process Management',
            description: 'Processes, threads, and scheduling',
            category: 'operating-systems',
            difficulty: 'medium',
            createdBy: adminId,
            metadata: { estimatedTime: 20, totalQuestions: 10, passingScore: 70 },
            questions: [
                { questionText: 'What are the states in a process lifecycle?', options: [{ id: 'A', text: 'New, Ready, Running, Waiting, Terminated', isCorrect: true }, { id: 'B', text: 'Start, Run, Stop', isCorrect: false }, { id: 'C', text: 'Create, Execute, Delete', isCorrect: false }, { id: 'D', text: 'Begin, Process, End', isCorrect: false }], explanation: 'Process states: New → Ready → Running → Waiting → Terminated.', difficulty: 'medium' },
                { questionText: 'What is a context switch?', options: [{ id: 'A', text: 'Switching between windows', isCorrect: false }, { id: 'B', text: 'Saving and restoring process state', isCorrect: true }, { id: 'C', text: 'Changing user', isCorrect: false }, { id: 'D', text: 'Changing OS', isCorrect: false }], explanation: 'Context switch saves current process state and loads next process state.', difficulty: 'medium' }
            ]
        }
    ];
    
    return await Quiz.insertMany(quizzes);
};

// ===== DBMS QUIZZES =====
const seedDBMSQuizzes = async (adminId) => {
    const quizzes = [
        {
            id: 'dbms-sql',
            title: 'SQL Fundamentals',
            description: 'SQL queries and database concepts',
            category: 'dbms',
            difficulty: 'easy',
            createdBy: adminId,
            metadata: { estimatedTime: 20, totalQuestions: 10, passingScore: 70 },
            questions: [
                { questionText: 'Which SQL keyword is used to retrieve data?', options: [{ id: 'A', text: 'GET', isCorrect: false }, { id: 'B', text: 'SELECT', isCorrect: true }, { id: 'C', text: 'FETCH', isCorrect: false }, { id: 'D', text: 'RETRIEVE', isCorrect: false }], explanation: 'SELECT statement retrieves data from database.', difficulty: 'easy' },
                { questionText: 'What is a primary key?', options: [{ id: 'A', text: 'Any key', isCorrect: false }, { id: 'B', text: 'Unique identifier for each row', isCorrect: true }, { id: 'C', text: 'First column', isCorrect: false }, { id: 'D', text: 'Foreign key', isCorrect: false }], explanation: 'Primary key uniquely identifies each record in a table.', difficulty: 'easy' }
            ]
        }
    ];
    
    return await Quiz.insertMany(quizzes);
};

// ===== NETWORK QUIZZES =====
const seedNetworkQuizzes = async (adminId) => {
    const quizzes = [
        {
            id: 'cn-protocols',
            title: 'Network Protocols',
            description: 'TCP/IP, HTTP, and networking protocols',
            category: 'networks',
            difficulty: 'medium',
            createdBy: adminId,
            metadata: { estimatedTime: 20, totalQuestions: 10, passingScore: 70 },
            questions: [
                { questionText: 'Which protocol is connection-oriented?', options: [{ id: 'A', text: 'UDP', isCorrect: false }, { id: 'B', text: 'TCP', isCorrect: true }, { id: 'C', text: 'IP', isCorrect: false }, { id: 'D', text: 'ICMP', isCorrect: false }], explanation: 'TCP provides reliable, connection-oriented communication.', difficulty: 'easy' },
                { questionText: 'What port does HTTP use by default?', options: [{ id: 'A', text: '21', isCorrect: false }, { id: 'B', text: '80', isCorrect: true }, { id: 'C', text: '443', isCorrect: false }, { id: 'D', text: '22', isCorrect: false }], explanation: 'HTTP uses port 80; HTTPS uses port 443.', difficulty: 'easy' }
            ]
        }
    ];
    
    return await Quiz.insertMany(quizzes);
};

// ===== OOPS QUIZZES =====
const seedOOPsQuizzes = async (adminId) => {
    const quizzes = [
        {
            id: 'oops-concepts',
            title: 'OOP Concepts',
            description: 'Object-oriented programming fundamentals',
            category: 'other',
            difficulty: 'easy',
            createdBy: adminId,
            metadata: { estimatedTime: 15, totalQuestions: 10, passingScore: 70 },
            questions: [
                { questionText: 'What are the four pillars of OOP?', options: [{ id: 'A', text: 'Encapsulation, Abstraction, Inheritance, Polymorphism', isCorrect: true }, { id: 'B', text: 'Variables, Functions, Classes, Objects', isCorrect: false }, { id: 'C', text: 'Loops, Conditions, Functions, Arrays', isCorrect: false }, { id: 'D', text: 'Input, Output, Process, Storage', isCorrect: false }], explanation: 'Four pillars: Encapsulation, Abstraction, Inheritance, Polymorphism.', difficulty: 'easy' },
                { questionText: 'What is encapsulation?', options: [{ id: 'A', text: 'Hiding implementation details', isCorrect: true }, { id: 'B', text: 'Creating multiple objects', isCorrect: false }, { id: 'C', text: 'Inheriting from parent', isCorrect: false }, { id: 'D', text: 'Having multiple forms', isCorrect: false }], explanation: 'Encapsulation bundles data and methods, hiding internal details.', difficulty: 'easy' }
            ]
        }
    ];
    
    return await Quiz.insertMany(quizzes);
};

// ===== WEB DEV QUIZZES =====
const seedWebQuizzes = async (adminId) => {
    const quizzes = [
        {
            id: 'web-react',
            title: 'React Fundamentals',
            description: 'React hooks and component patterns',
            category: 'other',
            difficulty: 'medium',
            createdBy: adminId,
            metadata: { estimatedTime: 20, totalQuestions: 10, passingScore: 70 },
            questions: [
                { questionText: 'What is useState hook for?', options: [{ id: 'A', text: 'Handling side effects', isCorrect: false }, { id: 'B', text: 'Adding state to functional components', isCorrect: true }, { id: 'C', text: 'Routing', isCorrect: false }, { id: 'D', text: 'API calls', isCorrect: false }], explanation: 'useState adds state to functional components.', difficulty: 'easy' },
                { questionText: 'What does useMemo do?', options: [{ id: 'A', text: 'Creates memories', isCorrect: false }, { id: 'B', text: 'Memoizes expensive calculations', isCorrect: true }, { id: 'C', text: 'Manages state', isCorrect: false }, { id: 'D', text: 'Handles events', isCorrect: false }], explanation: 'useMemo memoizes expensive computations.', difficulty: 'medium' }
            ]
        }
    ];
    
    return await Quiz.insertMany(quizzes);
};

// ===== GENERATE QUIZ RESULTS =====
const generateQuizResults = async (users) => {
    const quizzes = await Quiz.find({});
    const results = [];
    
    for (const user of users.slice(2)) { // Skip admin users
        const numResults = Math.floor(Math.random() * 10) + 5;
        
        for (let i = 0; i < numResults; i++) {
            const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
            const totalQuestions = quiz.questions?.length || 10;
            const correctAnswers = Math.floor(Math.random() * totalQuestions);
            const percentage = Math.round((correctAnswers / totalQuestions) * 100);
            const xpEarned = Math.floor(percentage * 2 + Math.random() * 50);
            
            results.push({
                user: user._id,           // Changed from userId
                quiz: quiz._id,           // Changed from quizId (ObjectId)
                quizId: quiz.id,          // String ID field
                score: correctAnswers,
                totalQuestions,
                correctAnswers,
                percentage,               // Required field
                timeSpent: Math.floor(Math.random() * 600) + 120,
                xpEarned,
                answers: quiz.questions?.map((q, idx) => ({
                    questionId: idx,
                    selectedOption: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
                    isCorrect: Math.random() > 0.4
                })) || []
            });
        }
    }
    
    return await QuizResult.insertMany(results);
};

// ===== PRINT SUMMARY =====
const printSummary = (users, quizzes, results) => {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                      📊 SEED SUMMARY                        ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  👤 Users Created:          ${String(users.length).padEnd(28)}║`);
    console.log(`║  📝 Quizzes Created:        ${String(quizzes.length).padEnd(28)}║`);
    console.log(`║  📈 Quiz Results:           ${String(results.length).padEnd(28)}║`);
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  🔑 Admin Credentials:                                      ║');
    console.log('║     Email: admin@brainspark.com                             ║');
    console.log('║     Password: admin123                                      ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  👤 Test User Credentials:                                  ║');
    console.log('║     Email: test@test.com                                    ║');
    console.log('║     Password: test123                                       ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
};

// Run seeder
printBanner();
seedAllData();
