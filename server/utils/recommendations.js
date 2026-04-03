/**
 * Quiz Recommendation Engine
 * Analyzes user performance and suggests quizzes to improve
 */
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

/**
 * Get quiz recommendations for a user
 * Algorithm: Find weak categories, suggest harder quizzes
 * @param {ObjectId} userId - User ID
 */
const getRecommendations = async (userId) => {
    try {
        // Get all user quiz attempts
        const results = await QuizResult.find({ user: userId })
            .populate('quiz', 'category difficulty');

        if (results.length === 0) {
            // New user: recommend easy quizzes from all categories
            const easyQuizzes = await Quiz.find({
                isActive: true,
                difficulty: 'easy'
            })
                .select('-questions')
                .limit(5)
                .sort({ createdAt: -1 });

            return {
                reason: 'Getting started!',
                quizzes: easyQuizzes,
                type: 'beginner'
            };
        }

        // Analyze category performance
        const categoryStats = {};
        results.forEach(result => {
            const cat = result.quiz?.category || 'other';
            if (!categoryStats[cat]) {
                categoryStats[cat] = { scores: [], attempts: 0 };
            }
            categoryStats[cat].scores.push(result.percentage);
            categoryStats[cat].attempts += 1;
        });

        // Calculate averages per category
        const categoryPerformance = Object.entries(categoryStats).map(([cat, data]) => {
            const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
            return {
                category: cat,
                avgScore: Math.round(avg),
                attempts: data.attempts,
                improvement: avg < 70 ? 'needs improvement' : 'good'
            };
        });

        // Find weakest categories (lowest avg score)
        const weakCategories = categoryStats.entries
            .sort((a, b) => {
                const avgA = a[1].scores.reduce((x, y) => x + y) / a[1].scores.length;
                const avgB = b[1].scores.reduce((x, y) => x + y) / b[1].scores.length;
                return avgA - avgB;
            })
            .slice(0, 2)
            .map(([cat]) => cat);

        // Recommend harder quizzes in weak categories to increase XP gain
        const recommendations = await Promise.all(
            weakCategories.map(cat =>
                Quiz.findOne({
                    isActive: true,
                    category: cat,
                    difficulty: 'hard'
                })
                    .select('-questions')
            )
        );

        // If not enough hard quizzes, add medium difficulty
        const filteredRecs = recommendations.filter(q => q);
        if (filteredRecs.length < 2) {
            const mediumQuiz = await Quiz.findOne({
                isActive: true,
                category: weakCategories[0],
                difficulty: 'medium'
            })
                .select('-questions')
                .limit(1);

            if (mediumQuiz && !filteredRecs.find(q => q._id === mediumQuiz._id)) {
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
            type: 'error'
        };
    }
};

module.exports = {
    getRecommendations
};
