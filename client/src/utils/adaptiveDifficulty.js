/**
 * Adaptive Difficulty Algorithm
 * Client-side algorithm for adjusting question difficulty based on performance
 */

/**
 * Calculate user's current skill level from recent performance
 */
export const calculateSkillLevel = (recentResults) => {
    if (!recentResults || recentResults.length === 0) {
        return { level: 'medium', confidence: 0 };
    }

    // Consider last 10 quiz results
    const results = recentResults.slice(-10);

    // Calculate average score
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

    // Calculate consistency (standard deviation)
    const variance = results.reduce((sum, r) => sum + Math.pow(r.score - avgScore, 2), 0) / results.length;
    const stdDev = Math.sqrt(variance);

    // Lower stdDev = more consistent = higher confidence
    const consistency = Math.max(0, 100 - stdDev);

    // Determine level
    let level;
    if (avgScore >= 85 && consistency >= 70) {
        level = 'hard';
    } else if (avgScore >= 70) {
        level = 'medium';
    } else {
        level = 'easy';
    }

    return {
        level,
        avgScore: Math.round(avgScore),
        consistency: Math.round(consistency),
        confidence: Math.round((avgScore + consistency) / 2),
        trend: calculateTrend(results),
    };
};

/**
 * Calculate performance trend
 */
const calculateTrend = (results) => {
    if (results.length < 3) return 'stable';

    const recent = results.slice(-3);
    const older = results.slice(-6, -3);

    if (older.length === 0) return 'stable';

    const recentAvg = recent.reduce((sum, r) => sum + r.score, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.score, 0) / older.length;

    const difference = recentAvg - olderAvg;

    if (difference > 10) return 'improving';
    if (difference < -10) return 'declining';
    return 'stable';
};

/**
 * Get next recommended difficulty
 */
export const getNextDifficulty = (currentDifficulty, recentResults) => {
    if (!recentResults || recentResults.length < 3) {
        return currentDifficulty || 'medium';
    }

    const skillLevel = calculateSkillLevel(recentResults);
    const { level, trend, confidence } = skillLevel;

    // If user is consistently doing well, increase difficulty
    if (trend === 'improving' && confidence >= 75) {
        if (currentDifficulty === 'easy') return 'medium';
        if (currentDifficulty === 'medium') return 'hard';
        return 'hard';
    }

    // If user is struggling, decrease difficulty
    if (trend === 'declining' && confidence < 50) {
        if (currentDifficulty === 'hard') return 'medium';
        if (currentDifficulty === 'medium') return 'easy';
        return 'easy';
    }

    // Otherwise, use calculated skill level
    return level;
};

/**
 * Get personalized question mix
 */
export const getQuestionMix = (skillLevel, totalQuestions = 10) => {
    const { level, confidence } = skillLevel;

    let easy, medium, hard;

    if (level === 'hard' && confidence >= 80) {
        // Expert: mostly hard questions
        easy = 1;
        medium = 3;
        hard = totalQuestions - 4;
    } else if (level === 'hard') {
        // Advanced: balanced with more hard
        easy = 2;
        medium = 4;
        hard = totalQuestions - 6;
    } else if (level === 'medium' && confidence >= 70) {
        // Upper-intermediate: balanced with some hard
        easy = 2;
        medium = totalQuestions - 4;
        hard = 2;
    } else if (level === 'medium') {
        // Intermediate: mostly medium
        easy = 3;
        medium = totalQuestions - 5;
        hard = 2;
    } else {
        // Beginner: mostly easy
        easy = totalQuestions - 4;
        medium = 3;
        hard = 1;
    }

    return { easy, medium, hard };
};

/**
 * Should recommend practice
 */
export const shouldRecommendPractice = (recentResults, category) => {
    const categoryResults = recentResults.filter(r => r.category === category);

    if (categoryResults.length < 3) return false;

    const avgScore = categoryResults.reduce((sum, r) => sum + r.score, 0) / categoryResults.length;

    // Recommend practice if average score below 70%
    return avgScore < 70;
};

/**
 * Get performance feedback
 */
export const getPerformanceFeedback = (skillLevel) => {
    const { level, avgScore, trend, confidence } = skillLevel;

    if (level === 'hard' && confidence >= 80) {
        return {
            message: '🏆 Excellent work! You\'re mastering this topic.',
            suggestion: 'Challenge yourself with even harder questions or explore new topics.',
            encouragement: 'Keep up the amazing work!',
        };
    }

    if (trend === 'improving') {
        return {
            message: '📈 Great progress! You\'re improving steadily.',
            suggestion: 'Continue practicing to build on this momentum.',
            encouragement: 'You\'re on the right track!',
        };
    }

    if (trend === 'declining') {
        return {
            message: '📚 Let\'s get back on track.',
            suggestion: 'Review topics you struggled with and try easier questions.',
            encouragement: 'Remember, every expert was once a beginner!',
        };
    }

    if (avgScore >= 70) {
        return {
            message: '✅ You\'re doing well!',
            suggestion: 'Try gradually increasing difficulty to challenge yourself more.',
            encouragement: 'Consistency is key to mastery!',
        };
    }

    return {
        message: '💪 Keep practicing!',
        suggestion: 'Focus on understanding concepts rather than rushing through questions.',
        encouragement: 'Every quiz makes you smarter!',
    };
};

export default {
    calculateSkillLevel,
    getNextDifficulty,
    getQuestionMix,
    shouldRecommendPractice,
    getPerformanceFeedback,
};
