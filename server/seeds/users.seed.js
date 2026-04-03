/**
 * USERS SEED DATA
 * Contains sample users for BrainSpark platform
 * Run: node seeds/users.seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const users = [
    // ===== ADMIN USERS =====
    {
        username: 'admin',
        email: 'admin@brainspark.com',
        password: 'admin123',
        role: 'admin',
        stats: {
            totalQuizzes: 50,
            currentXP: 8500,
            level: 9,
            currentStreak: 30,
            longestStreak: 45
        }
    },
    {
        username: 'superadmin',
        email: 'superadmin@brainspark.com',
        password: 'superadmin123',
        role: 'admin',
        stats: {
            totalQuizzes: 100,
            currentXP: 15000,
            level: 16,
            currentStreak: 60,
            longestStreak: 90
        }
    },

    // ===== TOP PERFORMERS =====
    {
        username: 'CodeMaster_Raj',
        email: 'raj.codemaster@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 85,
            currentXP: 12500,
            level: 13,
            currentStreak: 45,
            longestStreak: 60
        }
    },
    {
        username: 'DSA_Queen_Priya',
        email: 'priya.dsa@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 92,
            currentXP: 14200,
            level: 15,
            currentStreak: 52,
            longestStreak: 70
        }
    },
    {
        username: 'AlgoNinja_Arjun',
        email: 'arjun.algo@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 78,
            currentXP: 11800,
            level: 12,
            currentStreak: 38,
            longestStreak: 55
        }
    },
    {
        username: 'ByteWizard_Ananya',
        email: 'ananya.byte@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 70,
            currentXP: 10500,
            level: 11,
            currentStreak: 28,
            longestStreak: 42
        }
    },
    {
        username: 'LogicLord_Vikram',
        email: 'vikram.logic@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 65,
            currentXP: 9800,
            level: 10,
            currentStreak: 22,
            longestStreak: 35
        }
    },

    // ===== INTERMEDIATE USERS =====
    {
        username: 'TechExplorer_Neha',
        email: 'neha.tech@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 45,
            currentXP: 6800,
            level: 7,
            currentStreak: 15,
            longestStreak: 25
        }
    },
    {
        username: 'DataDriven_Sahil',
        email: 'sahil.data@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 52,
            currentXP: 7500,
            level: 8,
            currentStreak: 18,
            longestStreak: 30
        }
    },
    {
        username: 'NetworkNinja_Meera',
        email: 'meera.network@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 38,
            currentXP: 5600,
            level: 6,
            currentStreak: 12,
            longestStreak: 20
        }
    },
    {
        username: 'DBMaster_Karan',
        email: 'karan.db@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 42,
            currentXP: 6200,
            level: 7,
            currentStreak: 14,
            longestStreak: 22
        }
    },
    {
        username: 'OSGuru_Divya',
        email: 'divya.os@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 35,
            currentXP: 5200,
            level: 6,
            currentStreak: 10,
            longestStreak: 18
        }
    },
    {
        username: 'CloudChamp_Rohan',
        email: 'rohan.cloud@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 48,
            currentXP: 7100,
            level: 8,
            currentStreak: 16,
            longestStreak: 28
        }
    },
    {
        username: 'SystemStar_Ishita',
        email: 'ishita.system@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 40,
            currentXP: 5900,
            level: 6,
            currentStreak: 11,
            longestStreak: 19
        }
    },

    // ===== BEGINNERS =====
    {
        username: 'NewCoder_Aakash',
        email: 'aakash.new@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 8,
            currentXP: 1200,
            level: 2,
            currentStreak: 4,
            longestStreak: 7
        }
    },
    {
        username: 'LearningPath_Sneha',
        email: 'sneha.learn@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 12,
            currentXP: 1800,
            level: 2,
            currentStreak: 6,
            longestStreak: 10
        }
    },
    {
        username: 'FreshStart_Amit',
        email: 'amit.fresh@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 5,
            currentXP: 750,
            level: 1,
            currentStreak: 2,
            longestStreak: 5
        }
    },
    {
        username: 'BabySteps_Pooja',
        email: 'pooja.baby@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 3,
            currentXP: 450,
            level: 1,
            currentStreak: 1,
            longestStreak: 3
        }
    },
    {
        username: 'JustStarted_Ravi',
        email: 'ravi.just@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 6,
            currentXP: 900,
            level: 1,
            currentStreak: 3,
            longestStreak: 6
        }
    },
    {
        username: 'Curious_Kavya',
        email: 'kavya.curious@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 10,
            currentXP: 1500,
            level: 2,
            currentStreak: 5,
            longestStreak: 8
        }
    },

    // ===== TEST USERS (Your personal accounts) =====
    {
        username: 'demouser',
        email: 'demo@example.com',
        password: 'demo123',
        role: 'user',
        stats: {
            totalQuizzes: 15,
            currentXP: 2250,
            level: 3,
            currentStreak: 7,
            longestStreak: 15
        }
    },
    {
        username: 'agent_dg',
        email: 'dhruv621999goyal@gmail.com',
        password: 'dhruv621999goyal@gmail.com',
        role: 'user',
        stats: {
            totalQuizzes: 25,
            currentXP: 3800,
            level: 4,
            currentStreak: 12,
            longestStreak: 25
        }
    },
    {
        username: 'TEST',
        email: 'dgoyal_be23@thapar.edu',
        password: 'dgoyal_be23@thapar.edu',
        role: 'user',
        stats: {
            totalQuizzes: 8,
            currentXP: 1200,
            level: 2,
            currentStreak: 4,
            longestStreak: 8
        }
    },

    // ===== MORE ACTIVE USERS =====
    {
        username: 'QuizQueen_Tanya',
        email: 'tanya.quiz@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 55,
            currentXP: 8200,
            level: 9,
            currentStreak: 20,
            longestStreak: 32
        }
    },
    {
        username: 'BinaryBoss_Harsh',
        email: 'harsh.binary@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 60,
            currentXP: 8800,
            level: 9,
            currentStreak: 25,
            longestStreak: 38
        }
    },
    {
        username: 'RecursionKing_Dev',
        email: 'dev.recursion@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 48,
            currentXP: 7200,
            level: 8,
            currentStreak: 17,
            longestStreak: 28
        }
    },
    {
        username: 'StackOverflow_Nidhi',
        email: 'nidhi.stack@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 42,
            currentXP: 6300,
            level: 7,
            currentStreak: 14,
            longestStreak: 24
        }
    },
    {
        username: 'HeapHero_Varun',
        email: 'varun.heap@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 38,
            currentXP: 5700,
            level: 6,
            currentStreak: 11,
            longestStreak: 20
        }
    },
    {
        username: 'GraphGuru_Shruti',
        email: 'shruti.graph@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 52,
            currentXP: 7800,
            level: 8,
            currentStreak: 19,
            longestStreak: 30
        }
    },
    {
        username: 'TreeTraverser_Aman',
        email: 'aman.tree@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 35,
            currentXP: 5250,
            level: 6,
            currentStreak: 9,
            longestStreak: 18
        }
    },
    {
        username: 'SortingMaster_Sanya',
        email: 'sanya.sort@gmail.com',
        password: 'test123',
        role: 'user',
        stats: {
            totalQuizzes: 45,
            currentXP: 6750,
            level: 7,
            currentStreak: 15,
            longestStreak: 26
        }
    }
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing users
        await User.deleteMany({});
        console.log('🗑️  Cleared existing users');

        // Insert all users
        for (const userData of users) {
            await User.create(userData);
        }

        console.log(`✅ Seeded ${users.length} users successfully!`);
        console.log('\n📊 User Summary:');
        console.log(`   - Admins: ${users.filter(u => u.role === 'admin').length}`);
        console.log(`   - Regular Users: ${users.filter(u => u.role === 'user').length}`);
        console.log(`   - Top Performers (Level 10+): ${users.filter(u => u.stats.level >= 10).length}`);
        console.log(`   - Beginners (Level 1-2): ${users.filter(u => u.stats.level <= 2).length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
