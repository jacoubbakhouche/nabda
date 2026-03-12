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
 * Returns the index (1 - 40) for selecting the fetus image
 * directly based on the current week.
 */
export const getFetusImageIndex = (currentWeek) => {
    return Math.min(Math.max(1, currentWeek), 40);
};

/**
 * Returns an index to select dynamic advice/tips based on the current week.
 * Changes roughly every 6 weeks.
 */
export const getAdviceIndex = (currentWeek) => {
    const index = Math.floor(currentWeek / 6);
    return Math.max(0, index);
};
