/**
 * XP and Level Calculation Algorithms
 */

/**
 * Calculate XP earned from quiz score
 */
export const calculateXP = (score, difficulty = 'medium', streak = 0, isPerfect = false) => {
    // Base XP equals score percentage
    let baseXP = score;

    // Difficulty multipliers
    const difficultyMultipliers = {
        easy: 1.0,
        medium: 1.5,
        hard: 2.0,
    };

    const difficultyBonus = baseXP * (difficultyMultipliers[difficulty] - 1);

    // Streak bonus (max 50 XP)
    const streakBonus = Math.min(streak * 2, 50);

    // Perfect score bonus
    const perfectBonus = isPerfect ? 25 : 0;

    // Total XP
    const totalXP = Math.floor(baseXP + difficultyBonus + streakBonus + perfectBonus);

    return {
        baseXP: Math.floor(baseXP),
        difficultyBonus: Math.floor(difficultyBonus),
        streakBonus,
        perfectBonus,
        totalXP,
    };
};

/**
 * Calculate required XP for a given level (exponential growth)
 */
export const getRequiredXP = (level) => {
    // Formula: 100 * 1.5^(level - 1)
    return Math.floor(100 * Math.pow(1.5, level - 1));
};

/**
 * Calculate level from total XP
 */
export const getLevelFromXP = (totalXP) => {
    let level = 1;
    let xpNeeded = 0;

    while (xpNeeded <= totalXP) {
        xpNeeded += getRequiredXP(level);
        if (xpNeeded <= totalXP) {
            level++;
        }
    }

    return level;
};

/**
 * Get XP progress for current level
 */
export const getLevelProgress = (currentXP) => {
    const level = getLevelFromXP(currentXP);

    // Calculate XP needed for current level
    let xpForPreviousLevels = 0;
    for (let i = 1; i < level; i++) {
        xpForPreviousLevels += getRequiredXP(i);
    }

    const xpIntoCurrentLevel = currentXP - xpForPreviousLevels;
    const xpRequiredForCurrentLevel = getRequiredXP(level);
    const progressPercentage = (xpIntoCurrentLevel / xpRequiredForCurrentLevel) * 100;

    return {
        level,
        currentLevelXP: xpIntoCurrentLevel,
        requiredXP: xpRequiredForCurrentLevel,
        progressPercentage: Math.min(progressPercentage, 100),
        xpToNextLevel: xpRequiredForCurrentLevel - xpIntoCurrentLevel,
    };
};

/**
 * Get level tier (for badges/titles)
 */
export const getLevelTier = (level) => {
    if (level >= 50) return { tier: 'Legend', color: 'gold', icon: '👑' };
    if (level >= 30) return { tier: 'Master', color: 'purple', icon: '🏆' };
    if (level >= 20) return { tier: 'Expert', color: 'blue', icon: '⭐' };
    if (level >= 10) return { tier: 'Advanced', color: 'green', icon: '📈' };
    if (level >= 5) return { tier: 'Intermediate', color: 'orange', icon: '🎯' };
    return { tier: 'Beginner', color: 'gray', icon: '🌱' };
};

/**
 * Calculate streak multiplier
 */
export const getStreakMultiplier = (currentStreak) => {
    if (currentStreak >= 30) return 2.0; // 30+ days: 2x
    if (currentStreak >= 14) return 1.75; // 2 weeks: 1.75x
    if (currentStreak >= 7) return 1.5; // 1 week: 1.5x
    if (currentStreak >= 3) return 1.25; // 3 days: 1.25x
    return 1.0; // No multiplier
};

/**
 * Get next milestone
 */
export const getNextMilestone = (currentXP) => {
    const milestones = [
        { xp: 1000, title: 'First Thousand', reward: 'Bronze Badge' },
        { xp: 5000, title: 'Knowledge Seeker', reward: 'Silver Badge' },
        { xp: 10000, title: 'Ten Thousand Club', reward: 'Gold Badge' },
        { xp: 25000, title: 'Expert Learner', reward: 'Platinum Badge' },
        { xp: 50000, title: 'Elite Scholar', reward: 'Diamond Badge' },
        { xp: 100000, title: 'Legendary Mind', reward: 'Legendary Badge' },
    ];

    for (const milestone of milestones) {
        if (currentXP < milestone.xp) {
            return {
                ...milestone,
                remaining: milestone.xp - currentXP,
                progress: (currentXP / milestone.xp) * 100,
            };
        }
    }

    return null; // All milestones achieved
};

export default {
    calculateXP,
    getRequiredXP,
    getLevelFromXP,
    getLevelProgress,
    getLevelTier,
    getStreakMultiplier,
    getNextMilestone,
};
