import { PersonalityType, PersonalityTraits } from '../data/personality-types';
import { TraitResults } from './scoring';

/**
 * Calculate compatibility score between user traits and a personality type
 * Returns a percentage indicating how well the traits match
 */
export function calculatePersonalityMatch(
  userTraits: TraitResults,
  personalityType: PersonalityType
): number {
  let matches = 0;
  const totalTraits = 3;

  // Check each trait for exact match
  if (userTraits.workStyle.trait === personalityType.traits.workStyle) {
    matches++;
  }
  if (userTraits.decisionProcess.trait === personalityType.traits.decisionProcess) {
    matches++;
  }
  if (userTraits.teamInteraction.trait === personalityType.traits.teamInteraction) {
    matches++;
  }

  return Math.round((matches / totalTraits) * 100);
}

/**
 * Get all personality types ranked by compatibility with user traits
 * Returns array sorted by match percentage (highest first)
 */
export function getRankedPersonalityTypes(
  userTraits: TraitResults,
  allPersonalityTypes: PersonalityType[]
): Array<PersonalityType & { matchPercentage: number }> {
  return allPersonalityTypes
    .map(type => ({
      ...type,
      matchPercentage: calculatePersonalityMatch(userTraits, type)
    }))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}

/**
 * Get the best matching personality type
 * Returns the personality type with highest compatibility
 */
export function getBestPersonalityMatch(
  userTraits: TraitResults,
  allPersonalityTypes: PersonalityType[]
): (PersonalityType & { matchPercentage: number }) | null {
  const rankedTypes = getRankedPersonalityTypes(userTraits, allPersonalityTypes);
  return rankedTypes.length > 0 ? rankedTypes[0] : null;
}

/**
 * Generate trait comparison insights
 * Returns array of insights comparing user traits to personality type
 */
export function generateTraitInsights(
  userTraits: TraitResults,
  personalityType: PersonalityType
): Array<{
  trait: string;
  userPreference: string;
  typePreference: string;
  matches: boolean;
  insight: string;
}> {
  const insights = [];

  // Work Style
  const wsMatches = userTraits.workStyle.trait === personalityType.traits.workStyle;
  insights.push({
    trait: 'Work Style',
    userPreference: userTraits.workStyle.label,
    typePreference: personalityType.traits.workStyle === 'structured' ? 'Structured & Organized' : 'Adaptive & Flexible',
    matches: wsMatches,
    insight: wsMatches 
      ? 'Your work style preference aligns perfectly with this personality type.'
      : 'There may be some tension between your work organization style and this type\'s preferences.'
  });

  // Decision Process
  const dpMatches = userTraits.decisionProcess.trait === personalityType.traits.decisionProcess;
  insights.push({
    trait: 'Decision Process',
    userPreference: userTraits.decisionProcess.label,
    typePreference: personalityType.traits.decisionProcess === 'analytical' ? 'Analytical & Data-Driven' : 'Intuitive & Experience-Based',
    matches: dpMatches,
    insight: dpMatches
      ? 'Your decision-making approach is well-suited to this personality type.'
      : 'You might need to adapt your decision-making style when working with similar types.'
  });

  // Team Interaction
  const tiMatches = userTraits.teamInteraction.trait === personalityType.traits.teamInteraction;
  insights.push({
    trait: 'Team Interaction',
    userPreference: userTraits.teamInteraction.label,
    typePreference: personalityType.traits.teamInteraction === 'collaborative' ? 'Collaborative & Team-Focused' : 'Individual & Independent',
    matches: tiMatches,
    insight: tiMatches
      ? 'Your team interaction style perfectly matches this personality type.'
      : 'You may need to adjust your collaboration approach when working with this type.'
  });

  return insights;
}

/**
 * Generate team collaboration recommendations based on personality type
 */
export function generateTeamRecommendations(personalityType: PersonalityType): {
  workingWith: string[];
  potentialChallenges: string[];
  teamRoles: string[];
} {
  const { traits } = personalityType;

  const workingWith = [];
  const potentialChallenges = [];
  const teamRoles = [];

  // Generate recommendations based on trait combinations
  if (traits.workStyle === 'structured' && traits.decisionProcess === 'analytical') {
    workingWith.push('Team members who value planning and evidence-based decisions');
    potentialChallenges.push('May struggle with highly flexible or intuition-driven teammates');
    teamRoles.push('Process owner', 'Quality assurance', 'Documentation lead');
  }

  if (traits.decisionProcess === 'analytical' && traits.teamInteraction === 'collaborative') {
    workingWith.push('Data-driven team members who appreciate collaborative analysis');
    potentialChallenges.push('May need to balance thoroughness with team pace');
    teamRoles.push('Team lead', 'Analysis coordinator', 'Data interpreter');
  }

  if (traits.workStyle === 'adaptive' && traits.teamInteraction === 'collaborative') {
    workingWith.push('Flexible team members who value collaborative innovation');
    potentialChallenges.push('May find highly structured or independent teammates challenging');
    teamRoles.push('Team facilitator', 'Change catalyst', 'Relationship builder');
  }

  if (traits.decisionProcess === 'intuitive' && traits.teamInteraction === 'individual') {
    workingWith.push('Independent team members who trust experience and expertise');
    potentialChallenges.push('May struggle with highly collaborative or data-heavy processes');
    teamRoles.push('Subject matter expert', 'Strategic advisor', 'Independent contributor');
  }

  if (traits.workStyle === 'structured' && traits.teamInteraction === 'individual') {
    workingWith.push('Organized team members who value clear processes and independent accountability');
    potentialChallenges.push('May need to engage more in collaborative activities');
    teamRoles.push('Technical specialist', 'Quality controller', 'Standards maintainer');
  }

  if (traits.workStyle === 'adaptive' && traits.decisionProcess === 'intuitive') {
    workingWith.push('Creative team members who embrace change and trust insights');
    potentialChallenges.push('May struggle with rigid processes or extensive data requirements');
    teamRoles.push('Innovation catalyst', 'Creative problem solver', 'Change navigator');
  }

  return {
    workingWith,
    potentialChallenges,
    teamRoles
  };
}