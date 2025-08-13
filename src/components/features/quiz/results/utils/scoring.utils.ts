/**
 * Converts a score from -2 to +2 range to percentage (0-100%)
 */
export const scoreToPercentage = (score: number): number => {
  return Math.round(((score + 2) / 4) * 100);
};

/**
 * Determines the strength label based on absolute score value
 */
export const getTraitStrength = (score: number): string => {
  const absScore = Math.abs(score);
  if (absScore >= 1.5) return 'Strong';
  if (absScore >= 1.0) return 'Moderate';  
  if (absScore >= 0.5) return 'Mild';
  return 'Neutral';
};

/**
 * Gets overall fit assessment label based on score
 */
export const getOverallFitLabel = (overallFit: number): string => {
  if (overallFit >= 75) return 'Excellent Match';
  if (overallFit >= 60) return 'Strong Match';
  if (overallFit >= 45) return 'Good Match';
  return 'Developing Profile';
};

/**
 * Gets overall fit description based on score
 */
export const getOverallFitDescription = (overallFit: number): string => {
  const strength = overallFit >= 75 ? 'very strong' : 
                  overallFit >= 60 ? 'clear' : 
                  overallFit >= 45 ? 'moderate' : 'emerging';
  return `Your responses show ${strength} trait preferences across all behavioral dimensions`;
};