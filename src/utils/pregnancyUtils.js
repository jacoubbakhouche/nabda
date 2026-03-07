export const calculatePregnancyAge = (lmpDateString) => {
    if (!lmpDateString) return { completedWeeks: 0, remainingDays: 0, currentWeek: 1 };

    const lmp = new Date(lmpDateString);
    const now = new Date();

    // Difference in milliseconds
    const diffTime = now.getTime() - lmp.getTime();

    // Convert to days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If LMP is in the future
    if (diffDays < 0) return { completedWeeks: 0, remainingDays: 0, currentWeek: 1 };

    const completedWeeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;
    const currentWeek = completedWeeks + 1;

    return {
        completedWeeks: completedWeeks > 42 ? 42 : completedWeeks,
        remainingDays: completedWeeks >= 42 ? 0 : remainingDays,
        currentWeek: currentWeek > 42 ? 42 : currentWeek
    };
};

/**
 * Returns the index (1 - 16) for selecting the fetus image
 * based on the user's formula: Math.floor(currentWeek / 2.5).
 */
export const getFetusImageIndex = (currentWeek) => {
    // Current week starts from 1. 
    // week 1 -> 1 / 2.5 = 0.4 -> floor(0.4) = 0 -> maps to 1
    // week 2 -> 2 / 2.5 = 0.8 -> floor(0.8) = 0 -> maps to 1
    // week 3 -> 3 / 2.5 = 1.2 -> floor(1.2) = 1 -> maps to 2
    // ...
    // week 39 -> 39 / 2.5 = 15.6 -> floor(15.6) = 15 -> maps to 16
    const index = Math.floor(currentWeek / 2.5) + 1;
    return Math.min(Math.max(1, index), 16);
};

/**
 * Returns an index to select dynamic advice/tips based on the current week.
 * Changes roughly every 6 weeks.
 */
export const getAdviceIndex = (currentWeek) => {
    const index = Math.floor(currentWeek / 6);
    return Math.max(0, index);
};
