/**
 * Format a date in European format (DD/MM/YYYY)
 * @param date - Date object, string, or timestamp
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatDate(date: Date | string | number): string {
    if (!date) return 'N/A';

    const dateObj = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    if (isNaN(dateObj.getTime())) return 'Invalid Date';

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
}

/**
 * Format a grade in the French/Tunisian system (out of 20)
 * Assumes input score is out of 100 or specified maxScore
 * @param score - The score value
 * @param maxScore - The maximum possible score (default: 100)
 * @returns Formatted grade string (e.g., "15.5/20")
 */
export function formatGrade(score: number | string | null | undefined, maxScore: number = 100): string {
    if (score === null || score === undefined || score === '') return 'N/A';

    const numericScore = typeof score === 'string' ? parseFloat(score) : score;

    if (isNaN(numericScore)) return 'N/A';

    // Convert to /20 scale
    const gradeOutOf20 = (numericScore / maxScore) * 20;

    // Round to 2 decimal places
    const rounded = Math.round(gradeOutOf20 * 100) / 100;

    return `${rounded}/20`;
}

/**
 * Format GPA in the French/Tunisian system (out of 20)
 * @param gpa - GPA value (assumed to be out of 4.0 or 100)
 * @param maxGPA - The maximum GPA value (default: 4.0 for US system)
 * @returns Formatted GPA string (e.g., "16.75/20")
 */
export function formatGPA(gpa: number | string | null | undefined, maxGPA: number = 4.0): string {
    if (gpa === null || gpa === undefined || gpa === '') return 'N/A';

    const numericGPA = typeof gpa === 'string' ? parseFloat(gpa) : gpa;

    if (isNaN(numericGPA)) return 'N/A';

    // If GPA seems to be out of 100, convert differently
    if (numericGPA > 20) {
        return formatGrade(numericGPA, 100);
    }

    // Convert from 4.0 scale to 20 scale
    const gpaOutOf20 = (numericGPA / maxGPA) * 20;

    // Round to 2 decimal places
    const rounded = Math.round(gpaOutOf20 * 100) / 100;

    return `${rounded}/20`;
}

/**
 * Convert a grade from /20 scale to /100 scale (for backend storage)
 * @param gradeOutOf20 - Grade value out of 20
 * @returns Grade value out of 100
 */
export function convertGradeToHundred(gradeOutOf20: number): number {
    return (gradeOutOf20 / 20) * 100;
}

/**
 * Convert a grade from /100 scale to /20 scale
 * @param gradeOutOf100 - Grade value out of 100
 * @returns Grade value out of 20
 */
export function convertGradeToTwenty(gradeOutOf100: number): number {
    return (gradeOutOf100 / 100) * 20;
}
