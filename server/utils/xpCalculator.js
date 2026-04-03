/**
 * Unified XP and Level Calculation — Server-Side
 * Single source of truth for all XP logic.
 * Used in quiz submit route so the frontend always gets authoritative values.
 */

/**
 * Calculate XP earned from quiz result
 * @param {number} percentage - 0-100 score percentage
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @param {number} streak - current day streak
 * @param {boolean} isPerfect - scored 100%
 * @returns {{ baseXP, difficultyBonus, streakBonus, perfectBonus, totalXP }}
 */
const calculateXP = (percentage, difficulty = 'medium', streak = 0, isPerfect = false) => {
    // Base XP = percentage value
    const baseXP = percentage;

    // Difficulty multipliers
    const difficultyMultipliers = { easy: 1.0, medium: 1.5, hard: 2.0 };
    const multiplier = difficultyMultipliers[difficulty] || 1.5;
    const difficultyBonus = Math.floor(baseXP * (multiplier - 1));

    // Streak bonus (max 50 XP)
    const streakBonus = Math.min(streak * 2, 50);

    // Perfect score bonus
    const perfectBonus = isPerfect ? 25 : 0;

    const totalXP = Math.floor(baseXP + difficultyBonus + streakBonus + perfectBonus);

    return {
        baseXP: Math.floor(baseXP),
        difficultyBonus,
        streakBonus,
        perfectBonus,
        totalXP,
    };
};

/**
 * Required XP for a given level (exponential growth)
 * Formula: 100 * 1.5^(level-1)
 */
const getRequiredXP = (level) => Math.floor(100 * Math.pow(1.5, level - 1));

/**
 * Calculate level from total accumulated XP
 */
const getLevelFromXP = (totalXP) => {
    let level = 1;
    let xpNeeded = 0;
    while (xpNeeded <= totalXP) {
        xpNeeded += getRequiredXP(level);
        if (xpNeeded <= totalXP) level++;
    }
    return level;
};

/**
 * Achievement definitions — checked after every quiz submission
 */
const ACHIEVEMENTS = [
    { id: 'first_quiz',       title: 'First Steps',       description: 'Complete your first quiz',          icon: '🎯', criteria: { type: 'quiz_count',    threshold: 1   } },
    { id: 'five_quizzes',     title: 'Eager Learner',     description: 'Complete 5 quizzes',                 icon: '📚', criteria: { type: 'quiz_count',    threshold: 5   } },
    { id: 'quiz_master',      title: 'Quiz Master',       description: 'Complete 50 quizzes',               icon: '🏆', criteria: { type: 'quiz_count',    threshold: 50  } },
    { id: 'week_warrior',     title: 'Week Warrior',      description: 'Maintain a 7-day streak',           icon: '🔥', criteria: { type: 'streak',        threshold: 7   } },
    { id: 'streak_champion',  title: 'Streak Champion',   description: 'Maintain a 30-day streak',          icon: '⚡', criteria: { type: 'streak',        threshold: 30  } },
    { id: 'perfectionist',    title: 'Perfectionist',     description: 'Score 100% on a quiz',              icon: '⭐', criteria: { type: 'perfect_score', threshold: 1   } },
    { id: 'xp_1k',           title: 'First Thousand',    description: 'Earn 1,000 XP',                    icon: '🥉', criteria: { type: 'xp',           threshold: 1000 } },
    { id: 'xp_10k',          title: 'Ten Thousand Club', description: 'Earn 10,000 XP',                   icon: '🥇', criteria: { type: 'xp',           threshold: 10000} },
    { id: 'quick_learner',    title: 'Quick Learner',     description: 'Score 90%+ on a hard quiz',        icon: '🚀', criteria: { type: 'hard_ace',      threshold: 90  } },
];

/**
 * Check which achievements should be unlocked after a quiz
 * @param {Object} user - Mongoose user document
 * @param {Object} quizResult - result of the current quiz { percentage, difficulty }
 * @returns {Array} newly unlocked achievement IDs
 */
const checkAchievements = (user, quizResult) => {
    const alreadyUnlocked = new Set((user.achievements || []).map(a => a.achievementId));
    const newlyUnlocked = [];

    for (const achievement of ACHIEVEMENTS) {
        if (alreadyUnlocked.has(achievement.id)) continue;

        let unlocked = false;
        const { type, threshold } = achievement.criteria;

        switch (type) {
            case 'quiz_count':
                unlocked = user.stats.totalQuizzes >= threshold;
                break;
            case 'streak':
                unlocked = user.stats.currentStreak >= threshold;
                break;
            case 'perfect_score':
                unlocked = quizResult.percentage === 100;
                break;
            case 'xp':
                unlocked = user.stats.currentXP >= threshold;
                break;
            case 'hard_ace':
                unlocked = quizResult.difficulty === 'hard' && quizResult.percentage >= threshold;
                break;
        }

        if (unlocked) newlyUnlocked.push(achievement.id);
    }

    return newlyUnlocked;
};

module.exports = { calculateXP, getRequiredXP, getLevelFromXP, checkAchievements, ACHIEVEMENTS };
