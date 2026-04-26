/**
 * Creates or updates the admin user without touching any other data.
 * Run: node seeds/create-admin.seed.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const existing = await User.findOne({ username: 'admin' });

        if (existing) {
            await User.findByIdAndUpdate(existing._id, { $set: { role: 'admin', isActive: true } });
            console.log('✅ Existing "admin" user promoted to role: admin');
        } else {
            await User.create({
                username: 'admin',
                email: 'admin@brainspark.com',
                password: 'Admin123',
                role: 'admin',
                stats: { totalQuizzes: 0, currentXP: 0, level: 1 }
            });
            console.log('✅ Admin user created');
            console.log('   username: admin');
            console.log('   password: Admin123');
            console.log('   email:    admin@brainspark.com');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

seedAdmin();
