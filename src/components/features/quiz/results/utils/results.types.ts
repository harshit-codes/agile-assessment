export interface QuizResultsProps {
  // For direct results (own results after completing quiz)
  assessmentResult?: {
    personalityType?: any;
    traits?: {
      workStyle: { score: number; label: string };
      decisionProcess: { score: number; label: string };
      communicationStyle?: { score: number; label: string };
      focusOrientation?: { score: number; label: string };
      // Legacy support
      teamInteraction?: { score: number; label: string };
    };
    overallFit?: number;
    sessionId?: string; // Original session ID for prefilling responses
  };
  quizState?: any;
  
  // For shared results (viewing someone else's results)
  slug?: string;
  mode?: 'direct' | 'shared';
}

export interface ResultsData {
  personalityType?: any;
  traits?: {
    workStyle: { score: number; label: string };
    decisionProcess: { score: number; label: string };
    communicationStyle?: { score: number; label: string };
    focusOrientation?: { score: number; label: string };
    teamInteraction?: { score: number; label: string };
  };
  overallFit: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  isOwnResult: boolean;
  displayName: string;
}

export interface LoadingStateProps {
  title?: string;
  subtitle?: string;
}

export interface ErrorStateProps {
  title: string;
  subtitle: string;
  actionText?: string;
  onAction?: () => void;
}

export interface SectionProps {
  resultsData: ResultsData;
  authState: AuthState;
  quizState?: any;
  mode?: 'direct' | 'shared';
  onShareModalOpen?: () => void;
}