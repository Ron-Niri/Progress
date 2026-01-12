import User from '../models/User.js';

export const XP_VALUES = {
    HABIT_COMPLETE: 10,
    STREAK_7: 50,
    STREAK_30: 200,
    GOAL_CREATE: 20,
    GOAL_COMPLETE: 100,
    JOURNAL_ENTRY: 30
};

export const awardXP = async (userId, amount) => {
    try {
        const user = await User.findById(userId);
        if (!user || user.preferences?.gamificationEnabled === false) return null;

        if (user.xp === undefined) user.xp = 0;
        if (user.level === undefined) user.level = 1;

        user.xp += amount;

        // Level up logic: Level 2 at 100 XP, Level 3 at 300 XP, etc. 
        // Formula: XP for level L = 100 * (L-1)^1.5 (rounded)
        let nextLevelXP = Math.floor(100 * Math.pow(user.level, 1.5));
        
        let leveledUp = false;
        while (user.xp >= nextLevelXP) {
            user.level += 1;
            leveledUp = true;
            nextLevelXP = Math.floor(100 * Math.pow(user.level, 1.5));
        }

        await user.save();
        return { 
            xp: user.xp, 
            level: user.level, 
            leveledUp,
            xpGained: amount
        };
    } catch (err) {
        console.error('Error awarding XP:', err);
        return null;
    }
};
