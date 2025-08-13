export interface QuizStatement {
  id: string;
  statement: string;
  isReversed?: boolean; // For reverse-scored items
}

export interface QuizSection {
  id: string;
  title: string;
  description: string;
  polarTraits: {
    left: string;  // Strongly Disagree end
    right: string; // Strongly Agree end
  };
  statements: QuizStatement[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  sections: QuizSection[];
  timeLimit?: number;
}

export const pmCareerQuiz: Quiz = {
  id: "agile-assessment",
  title: "The Agile Assessment",
  description: "Evaluate your behavioral tendencies across 3 core dimensions to discover your ideal Agile team role.",
  timeLimit: 900, // 15 minutes
  sections: [
    {
      id: "work-style",
      title: "Work Style Preferences",
      description: "How do you prefer to organize and approach your work?",
      polarTraits: {
        left: "Adaptive & Flexible", // Low scores (-2 to 0) = Adaptive
        right: "Structured & Organized" // High scores (0 to +2) = Structured
      },
      statements: [
        {
          id: "ws1",
          statement: "I perform best when I have clear, detailed plans and structured timelines"
        },
        {
          id: "ws2",
          statement: "I prefer to adapt my approach as situations change rather than follow rigid procedures",
          isReversed: true
        },
        {
          id: "ws3",
          statement: "Having established routines and predictable workflows helps me be more productive"
        },
        {
          id: "ws4",
          statement: "I thrive in dynamic environments where priorities can shift quickly",
          isReversed: true
        },
        {
          id: "ws5",
          statement: "I prefer organized systems and standardized processes for completing tasks"
        },
        {
          id: "ws6",
          statement: "I work better when I can be spontaneous and flexible with my methods",
          isReversed: true
        }
      ]
    },
    {
      id: "decision-process",
      title: "Decision Making Process", 
      description: "How do you prefer to make decisions and process information?",
      polarTraits: {
        left: "Intuitive & Experience-Based", // Low scores (-2 to 0) = Intuitive
        right: "Analytical & Data-Driven" // High scores (0 to +2) = Analytical
      },
      statements: [
        {
          id: "dp1",
          statement: "I prefer to gather comprehensive data before making important decisions"
        },
        {
          id: "dp2",
          statement: "I often rely on my gut feelings and past experiences when making choices",
          isReversed: true
        },
        {
          id: "dp3",
          statement: "I like to analyze problems systematically using logical frameworks"
        },
        {
          id: "dp4",
          statement: "I tend to make decisions quickly based on pattern recognition and intuition",
          isReversed: true
        },
        {
          id: "dp5",
          statement: "I prefer evidence-based approaches and quantitative analysis for problem-solving"
        },
        {
          id: "dp6",
          statement: "I trust my instincts and learned experience over detailed analysis",
          isReversed: true
        }
      ]
    },
    {
      id: "team-interaction",
      title: "Team Interaction Style",
      description: "How do you prefer to work with others and contribute to teams?",
      polarTraits: {
        left: "Individual & Independent", // Low scores (-2 to 0) = Individual
        right: "Collaborative & Team-Focused" // High scores (0 to +2) = Collaborative
      },
      statements: [
        {
          id: "ti1",
          statement: "I prefer working collaboratively and sharing ideas with team members"
        },
        {
          id: "ti2",
          statement: "I do my best work when I can focus independently without interruptions",
          isReversed: true
        },
        {
          id: "ti3",
          statement: "I enjoy brainstorming and collective problem-solving with colleagues"
        },
        {
          id: "ti4",
          statement: "I prefer to work on individual tasks where I have full ownership and accountability",
          isReversed: true
        },
        {
          id: "ti5",
          statement: "I find team meetings and group discussions energizing and productive"
        },
        {
          id: "ti6",
          statement: "I prefer minimal meetings and value concentrated individual work time",
          isReversed: true
        }
      ]
    }
  ]
};