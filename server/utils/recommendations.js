/**
 * Quiz Recommendation Engine
 * Uses MongoDB aggregation pipelines to analyse user performance and suggest quizzes.
 */
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

/**
 * Get quiz recommendations for a user.
 * Algorithm: aggregate per-category performance, identify weak categories,
 * then surface harder quizzes in those categories to maximise XP gain.
 *
 * @param {string | ObjectId} userId
 */
const getRecommendations = async (userId) => {
    try {
        // ── Aggregation pipeline: per-category performance ─────────────────
        // Uses $lookup to join quiz category, $group to aggregate scores,
        // and $sort to put the weakest categories first (avg score ascending).
        const categoryAgg = await QuizResult.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: 'quiz',
                    foreignField: '_id',
                    as: 'quizData'
                }
            },
            { $unwind: { path: '$quizData', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: { $ifNull: ['$quizData.category', 'other'] },
                    avgScore:  { $avg: '$percentage' },
                    attempts:  { $sum: 1 },
                    totalXP:   { $sum: '$xpEarned' },
                    scores:    { $push: '$percentage' }
                }
            },
            // Weakest categories first — the sort happens inside MongoDB
            { $sort: { avgScore: 1 } }
        ]);

        if (categoryAgg.length === 0) {
            // New user: recommend easy quizzes, sorted by newest
            const easyQuizzes = await Quiz.find({ isActive: true, difficulty: 'easy' })
                .select('-questions')
                .sort({ createdAt: -1 })
                .limit(5);

            return {
                reason: 'Getting started!',
                quizzes: easyQuizzes,
                categoryPerformance: [],
                type: 'beginner'
            };
        }

        // Build the category performance array for the frontend
        const categoryPerformance = categoryAgg.map(cat => ({
            category: cat._id,
            avgScore: Math.round(cat.avgScore),
            attempts: cat.attempts,
            totalXP: cat.totalXP,
            improvement: cat.avgScore < 70 ? 'needs improvement' : 'good'
        }));

        // Top-2 weakest categories (already sorted by avgScore asc in the pipeline)
        const weakCategories = categoryAgg.slice(0, 2).map(c => c._id);

        // Recommend a hard quiz for each weak category (to maximise XP)
        const recommendations = await Promise.all(
            weakCategories.map(cat =>
                Quiz.findOne({ isActive: true, category: cat, difficulty: 'hard' })
                    .select('-questions')
            )
        );

        const filteredRecs = recommendations.filter(Boolean);

        // Fallback: if no hard quiz exists for a weak category, try medium
        if (filteredRecs.length < 2 && weakCategories[0]) {
            const mediumQuiz = await Quiz.findOne({
                isActive: true,
                category: weakCategories[0],
                difficulty: 'medium'
            }).select('-questions');

            if (mediumQuiz && !filteredRecs.find(q => q._id.equals(mediumQuiz._id))) {
                filteredRecs.push(mediumQuiz);
            }
        }

        return {
            reason: `Improve your ${weakCategories.join(' & ')} skills!`,
            quizzes: filteredRecs,
            categoryPerformance,
            type: 'personalized'
        };
    } catch (error) {
        console.error('Recommendation error:', error);
        return {
            reason: 'Explore more quizzes',
            quizzes: [],
            categoryPerformance: [],
            type: 'error'
        };
    }
};

module.exports = { getRecommendations };
