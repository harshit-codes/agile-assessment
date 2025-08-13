import { PersonalityTraits, PersonalityType, getPersonalityByTraits } from '../../../data/personality-types';

// Likert scale: -2 (Strongly Disagree) to +2 (Strongly Agree)
export type LikertResponse = -2 | -1 | 0 | 1 | 2;

export interface SectionScores {
  workStyle: number;      // -2 to +2 (negative = adaptive, positive = structured)
  decisionProcess: number; // -2 to +2 (negative = intuitive, positive = analytical)
  teamInteraction: number; // -2 to +2 (negative = individual, positive = collaborative)
}

export interface TraitScore {
  score: number;
  trait: string;
  label: string;
}

export interface TraitResults {
  workStyle: TraitScore;
  decisionProcess: TraitScore;
  teamInteraction: TraitScore;
}

export interface AssessmentResult {
  scores: SectionScores;
  traits: TraitResults;
  personalityType: PersonalityType | null;
  personalityCode: string | null;
  confidence: number;
  overallFit: number;
}

// Question mapping for scoring calculations
export interface QuestionMapping {
  questionId: string;
  sectionId: string;
  valueLine: 'workStyle' | 'decisionProcess' | 'teamInteraction';
  isReversed: boolean;
}

// Static question mapping based on quiz structure
export const questionMapping: QuestionMapping[] = [
  // Work Style Questions
  { questionId: 'ws1', sectionId: 'work-style', valueLine: 'workStyle', isReversed: false },
  { questionId: 'ws2', sectionId: 'work-style', valueLine: 'workStyle', isReversed: true },
  { questionId: 'ws3', sectionId: 'work-style', valueLine: 'workStyle', isReversed: false },
  { questionId: 'ws4', sectionId: 'work-style', valueLine: 'workStyle', isReversed: true },
  { questionId: 'ws5', sectionId: 'work-style', valueLine: 'workStyle', isReversed: false },
  { questionId: 'ws6', sectionId: 'work-style', valueLine: 'workStyle', isReversed: true },
  
  // Decision Process Questions  
  { questionId: 'dp1', sectionId: 'decision-process', valueLine: 'decisionProcess', isReversed: false },
  { questionId: 'dp2', sectionId: 'decision-process', valueLine: 'decisionProcess', isReversed: true },
  { questionId: 'dp3', sectionId: 'decision-process', valueLine: 'decisionProcess', isReversed: false },
  { questionId: 'dp4', sectionId: 'decision-process', valueLine: 'decisionProcess', isReversed: true },
  { questionId: 'dp5', sectionId: 'decision-process', valueLine: 'decisionProcess', isReversed: false },
  { questionId: 'dp6', sectionId: 'decision-process', valueLine: 'decisionProcess', isReversed: true },
  
  // Team Interaction Questions
  { questionId: 'ti1', sectionId: 'team-interaction', valueLine: 'teamInteraction', isReversed: false },
  { questionId: 'ti2', sectionId: 'team-interaction', valueLine: 'teamInteraction', isReversed: true },
  { questionId: 'ti3', sectionId: 'team-interaction', valueLine: 'teamInteraction', isReversed: false },
  { questionId: 'ti4', sectionId: 'team-interaction', valueLine: 'teamInteraction', isReversed: true },
  { questionId: 'ti5', sectionId: 'team-interaction', valueLine: 'teamInteraction', isReversed: false },
  { questionId: 'ti6', sectionId: 'team-interaction', valueLine: 'teamInteraction', isReversed: true },
];

/**
 * Calculate section scores from quiz answers
 * Each section has 6 questions with Likert scale -2 to +2
 * Average score determines the trait preference
 */
export function calculateSectionScores(
  answers: Record<string, number>,
  sections: any[]
): SectionScores {
  const sectionTotals = { 
    workStyle: 0, 
    decisionProcess: 0, 
    teamInteraction: 0 
  };
  const sectionCounts = { 
    workStyle: 0, 
    decisionProcess: 0, 
    teamInteraction: 0 
  };
  
  sections.forEach(section => {
    let sectionTotal = 0;
    let answeredCount = 0;

    section.statements.forEach((statement: any) => {
      const answer = answers[statement.id];
      if (answer !== undefined) {
        // Apply reverse scoring if needed
        let adjustedScore = answer;
        if (statement.isReversed) {
          adjustedScore = -answer;
        }
        sectionTotal += adjustedScore;
        answeredCount++;
      }
    });

    const sectionAverage = answeredCount > 0 ? sectionTotal / answeredCount : 0;

    // Map section IDs to score properties
    switch (section.id) {
      case 'work-style':
        sectionTotals.workStyle = sectionAverage;
        sectionCounts.workStyle = answeredCount;
        break;
      case 'decision-process':
        sectionTotals.decisionProcess = sectionAverage;
        sectionCounts.decisionProcess = answeredCount;
        break;
      case 'team-interaction':
        sectionTotals.teamInteraction = sectionAverage;
        sectionCounts.teamInteraction = answeredCount;
        break;
    }
  });

  return {
    workStyle: sectionTotals.workStyle,
    decisionProcess: sectionTotals.decisionProcess,
    teamInteraction: sectionTotals.teamInteraction
  };
}

/**
 * Convert scores to trait preferences
 * Positive scores = right trait (structured, analytical, collaborative)
 * Negative scores = left trait (adaptive, intuitive, individual)
 */
export function scoresToTraits(scores: SectionScores): TraitResults {
  return {
    workStyle: {
      score: scores.workStyle,
      trait: scores.workStyle >= 0 ? 'structured' : 'adaptive',
      label: scores.workStyle >= 0 ? 'Structured & Organized' : 'Adaptive & Flexible'
    },
    decisionProcess: {
      score: scores.decisionProcess,
      trait: scores.decisionProcess >= 0 ? 'analytical' : 'intuitive',
      label: scores.decisionProcess >= 0 ? 'Analytical & Data-Driven' : 'Intuitive & Experience-Based'
    },
    teamInteraction: {
      score: scores.teamInteraction,
      trait: scores.teamInteraction >= 0 ? 'collaborative' : 'individual',
      label: scores.teamInteraction >= 0 ? 'Collaborative & Team-Focused' : 'Individual & Independent'
    }
  };
}

/**
 * Generate personality code from traits (e.g., "SSA", "AIC")
 */
export function getPersonalityCode(traits: TraitResults): string {
  const codes = {
    workStyle: traits.workStyle.trait === 'structured' ? 'S' : 'A',
    decisionProcess: traits.decisionProcess.trait === 'analytical' ? 'S' : 'I', 
    teamInteraction: traits.teamInteraction.trait === 'collaborative' ? 'C' : 'A'
  };
  
  return codes.workStyle + codes.decisionProcess + codes.teamInteraction;
}

/**
 * Calculate confidence score based on section score magnitudes
 * More lenient scoring - easier to get high confidence
 */
export function calculateConfidence(scores: SectionScores): number {
  const avgMagnitude = (
    Math.abs(scores.workStyle) + 
    Math.abs(scores.decisionProcess) + 
    Math.abs(scores.teamInteraction)
  ) / 3;
  
  // Much more lenient confidence calculation
  // Even small scores get good confidence
  const leniency = 1.5; // Boost confidence by 50%
  const adjustedMagnitude = Math.min(2.0, avgMagnitude * leniency);
  
  const baseConfidence = Math.round((adjustedMagnitude / 2.0) * 100);
  // Apply floor protection - minimum 65% confidence
  return Math.max(65, Math.min(100, baseConfidence));
}

/**
 * Calculate overall fit percentage based on trait strength
 * More lenient - easier to get high fit scores
 */
export function calculateOverallFit(scores: SectionScores): number {
  const traitStrengths = [
    Math.abs(scores.workStyle),
    Math.abs(scores.decisionProcess),
    Math.abs(scores.teamInteraction)
  ];

  const averageStrength = traitStrengths.reduce((sum, strength) => sum + strength, 0) / 3;
  
  // Much more lenient fit calculation - boost by 60%
  const leniency = 1.6;
  const adjustedStrength = Math.min(2.0, averageStrength * leniency);
  
  const baseFit = Math.round((adjustedStrength / 2.0) * 100);
  // Apply floor protection - minimum 70% overall fit
  return Math.max(70, Math.min(100, baseFit));
}

/**
 * Complete assessment calculation
 * Returns all results including personality type match
 */
export function calculateAssessmentResult(
  answers: Record<string, number>,
  sections: any[]
): AssessmentResult {
  const scores = calculateSectionScores(answers, sections);
  const traits = scoresToTraits(scores);
  const overallFit = calculateOverallFit(scores);
  const confidence = calculateConfidence(scores);

  // Get personality type from trait combination
  // Note: This is using the legacy 3-trait system, mapping to 4-trait
  const traitMapping: PersonalityTraits = {
    workStyle: traits.workStyle.trait === 'structured' ? 'structured' : 'dynamic',
    decisionProcess: traits.decisionProcess.trait === 'analytical' ? 'evidence-based' : 'intuitive',
    communicationStyle: traits.teamInteraction.trait === 'collaborative' ? 'harmonizing' : 'direct',
    focusOrientation: 'visionary' // Default fallback for legacy system
  };
  const personalityType = getPersonalityByTraits(traitMapping) || null;

  const personalityCode = getPersonalityCode(traits);

  return {
    scores,
    traits,
    personalityType,
    personalityCode,
    confidence,
    overallFit
  };
}

/**
 * Convert score to percentage for display (normalized to 0-100)
 * -2 to +2 scale becomes 0% to 100%
 */
export function scoreToPercentage(score: number): number {
  return Math.round(((score + 2) / 4) * 100);
}


/**
 * Get trait preference strength description
 */
export function getTraitStrength(score: number): string {
  const absScore = Math.abs(score);
  if (absScore >= 1.5) return 'Strong';
  if (absScore >= 1.0) return 'Moderate';
  if (absScore >= 0.5) return 'Mild';
  return 'Neutral';
}

/**
 * Validate that all questions are answered
 */
export function validateAnswers(answers: Record<string, number>): {
  isValid: boolean;
  missingQuestions: string[];
  totalQuestions: number;
  answeredQuestions: number;
} {
  const allQuestionIds = questionMapping.map(q => q.questionId);
  const answeredQuestionIds = Object.keys(answers).filter(id => 
    answers[id] !== undefined && answers[id] !== null
  );
  const missingQuestions = allQuestionIds.filter(id => 
    !answeredQuestionIds.includes(id)
  );
  
  return {
    isValid: missingQuestions.length === 0,
    missingQuestions,
    totalQuestions: allQuestionIds.length,
    answeredQuestions: answeredQuestionIds.length
  };
}