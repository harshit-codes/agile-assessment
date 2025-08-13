export interface PersonalityTraits {
  workStyle: 'structured' | 'adaptive';
  decisionProcess: 'analytical' | 'intuitive';
  teamInteraction: 'collaborative' | 'individual';
}

export interface PersonalityType {
  id: string;
  name: string;
  shortName: string;
  description: string;
  traits: PersonalityTraits;
  scrumRoles: {
    primary: string;
    secondary: string[];
    fitPercentage: number;
  };
  strengths: string[];
  challenges: string[];
  teamCollaboration: string[];
  careerPath: string[];
}

export const personalityTypes: PersonalityType[] = [
  {
    id: 'ssa',
    name: 'The Systems Analyst',
    shortName: 'SSA',
    description: 'A methodical individual contributor with analytical focus who excels at creating systematic solutions through independent data-driven analysis.',
    traits: {
      workStyle: 'structured',
      decisionProcess: 'analytical',
      teamInteraction: 'individual'
    },
    scrumRoles: {
      primary: 'Technical Specialist',
      secondary: ['Data Analyst', 'Quality Assurance Lead'],
      fitPercentage: 95
    },
    strengths: [
      'Excels at creating systematic solutions to complex problems',
      'Provides thorough analysis and data-driven recommendations',
      'Maintains high standards and attention to detail',
      'Delivers consistent, reliable individual contributions',
      'Develops deep expertise in specialized areas'
    ],
    challenges: [
      'May struggle with ambiguous or rapidly changing requirements',
      'Could become overwhelmed in highly collaborative environments',
      'Might resist approaches that lack clear structure or data backing'
    ],
    teamCollaboration: [
      'Provide clear, well-researched technical insights',
      'Share expertise through documentation and structured reviews',
      'Focus on quality standards and systematic approaches',
      'Contribute specialized knowledge to complex problems'
    ],
    careerPath: [
      'Data Analyst',
      'Research Scientist', 
      'Quality Assurance Specialist',
      'Systems Analyst',
      'Technical Writer',
      'Compliance Officer'
    ]
  },
  {
    id: 'ssc',
    name: 'The Process Leader',
    shortName: 'SSC',
    description: 'A team-oriented process builder with data-driven methodology who builds systematic collaborative workflows and team processes.',
    traits: {
      workStyle: 'structured',
      decisionProcess: 'analytical',
      teamInteraction: 'collaborative'
    },
    scrumRoles: {
      primary: 'Scrum Master',
      secondary: ['Process Improvement Manager', 'Team Lead'],
      fitPercentage: 92
    },
    strengths: [
      'Builds robust, data-driven team processes and workflows',
      'Facilitates evidence-based group decision making',
      'Creates structured environments that help teams excel',
      'Balances analytical rigor with collaborative engagement',
      'Develops comprehensive team standards and best practices'
    ],
    challenges: [
      'May over-engineer processes for simple team tasks',
      'Could slow down team momentum with extensive analysis',
      'Might struggle when team dynamics conflict with systematic approaches'
    ],
    teamCollaboration: [
      'Lead structured collaboration and process improvement',
      'Use data to support team advocacy and decision making',
      'Create frameworks that enhance team effectiveness',
      'Facilitate systematic problem-solving sessions'
    ],
    careerPath: [
      'Project Manager',
      'Business Analyst',
      'Process Improvement Manager',
      'Team Lead',
      'Operations Manager',
      'Scrum Master'
    ]
  },
  {
    id: 'sia',
    name: 'The Strategic Specialist',
    shortName: 'SIA',
    description: 'An independent strategic expert with experiential wisdom who combines systematic methods with intuitive decision-making.',
    traits: {
      workStyle: 'structured',
      decisionProcess: 'intuitive',
      teamInteraction: 'individual'
    },
    scrumRoles: {
      primary: 'Senior Technical Lead',
      secondary: ['Solution Architect', 'Strategic Advisor'],
      fitPercentage: 88
    },
    strengths: [
      'Combines systematic approach with experiential decision-making',
      'Applies learned patterns efficiently to structured work',
      'Maintains consistency while adapting to situational needs',
      'Develops practical expertise through structured practice',
      'Provides reliable individual contributions with intuitive insights'
    ],
    challenges: [
      'May struggle to articulate intuitive decisions to data-focused colleagues',
      'Could miss opportunities for collaboration due to independent work preference',
      'Might be seen as inflexible when structure conflicts with intuitive insights'
    ],
    teamCollaboration: [
      'Share strategic insights and experience-based recommendations',
      'Provide specialized expertise with practical application',
      'Mentor others through structured knowledge transfer',
      'Contribute long-term perspective to team decisions'
    ],
    careerPath: [
      'Strategic Consultant',
      'Senior Specialist',
      'Subject Matter Expert',
      'Technical Architect',
      'Policy Advisor',
      'Independent Consultant'
    ]
  },
  {
    id: 'sic',
    name: 'The Team Organizer',
    shortName: 'SIC',
    description: 'A collaborative structure creator with intuitive team insight who builds organized environments leveraging collective wisdom.',
    traits: {
      workStyle: 'structured',
      decisionProcess: 'intuitive',
      teamInteraction: 'collaborative'
    },
    scrumRoles: {
      primary: 'Team Lead',
      secondary: ['Agile Coach', 'People Manager'],
      fitPercentage: 89
    },
    strengths: [
      'Creates organized team environments that leverage collective intuition',
      'Builds structured processes that accommodate diverse working styles',
      'Facilitates teams through experience-based decision making',
      'Balances systematic planning with adaptive team dynamics',
      'Develops team expertise through structured experiential learning'
    ],
    challenges: [
      'May struggle when team intuition conflicts with established processes',
      'Could have difficulty explaining intuitive team decisions to stakeholders',
      'Might over-structure collaborative activities'
    ],
    teamCollaboration: [
      'Create frameworks that enhance team collaboration and collective wisdom',
      'Lead through structured collaboration and shared experience',
      'Facilitate inclusive decision-making processes',
      'Build trust through consistent structure and intuitive leadership'
    ],
    careerPath: [
      'Team Manager',
      'Organizational Development Specialist',
      'Training Manager',
      'Department Head',
      'Change Management Lead',
      'Team Coach'
    ]
  },
  {
    id: 'asa',
    name: 'The Agile Researcher',
    shortName: 'ASA',
    description: 'A flexible independent analyst with adaptive methodology who provides data-driven solutions in dynamic environments.',
    traits: {
      workStyle: 'adaptive',
      decisionProcess: 'analytical',
      teamInteraction: 'individual'
    },
    scrumRoles: {
      primary: 'Business Intelligence Analyst',
      secondary: ['Market Researcher', 'Performance Analyst'],
      fitPercentage: 85
    },
    strengths: [
      'Adapts analytical approaches to changing requirements quickly',
      'Provides flexible, data-driven solutions to dynamic problems',
      'Works independently while staying responsive to new information',
      'Combines analytical rigor with adaptive execution',
      'Delivers evidence-based results in fast-paced environments'
    ],
    challenges: [
      'May struggle with rigid processes or inflexible data requirements',
      'Could become overwhelmed when collaboration is required for analysis',
      'Might sacrifice thoroughness for speed in dynamic situations'
    ],
    teamCollaboration: [
      'Provide flexible, data-driven insights for changing priorities',
      'Share analytical findings with adaptive timing and formats',
      'Contribute independent research that supports team decisions',
      'Adapt analytical methods based on team feedback and needs'
    ],
    careerPath: [
      'Business Intelligence Analyst',
      'Market Research Specialist',
      'Data Scientist',
      'Performance Analyst',
      'Independent Researcher',
      'Quantitative Analyst'
    ]
  },
  {
    id: 'asc',
    name: 'The Dynamic Facilitator',
    shortName: 'ASC',
    description: 'A team catalyst with adaptive analytics who combines flexible collaboration methods with data-driven decision making.',
    traits: {
      workStyle: 'adaptive',
      decisionProcess: 'analytical',
      teamInteraction: 'collaborative'
    },
    scrumRoles: {
      primary: 'Product Owner',
      secondary: ['Agile Coach', 'Innovation Manager'],
      fitPercentage: 88
    },
    strengths: [
      'Facilitates data-driven teams in dynamic environments',
      'Adapts analytical approaches based on team needs and changing contexts',
      'Builds flexible team processes that maintain analytical rigor',
      'Helps teams make evidence-based decisions quickly',
      'Creates collaborative environments for adaptive problem-solving'
    ],
    challenges: [
      'May struggle with teams that prefer rigid analytical processes',
      'Could find it difficult to maintain standards in highly dynamic situations',
      'Might compromise analytical depth for team harmony and speed'
    ],
    teamCollaboration: [
      'Lead adaptive teams with flexible analytical frameworks',
      'Facilitate collaborative data analysis and decision making',
      'Create dynamic processes that balance rigor with adaptability',
      'Help teams pivot based on analytical insights and feedback'
    ],
    careerPath: [
      'Agile Coach',
      'Product Manager',
      'Strategy Consultant',
      'Team Facilitator',
      'Innovation Manager',
      'Cross-functional Lead'
    ]
  },
  {
    id: 'aia',
    name: 'The Creative Explorer',
    shortName: 'AIA',
    description: 'An independent innovator with intuitive adaptability who navigates uncertainty through creative exploration and pattern recognition.',
    traits: {
      workStyle: 'adaptive',
      decisionProcess: 'intuitive',
      teamInteraction: 'individual'
    },
    scrumRoles: {
      primary: 'Innovation Specialist',
      secondary: ['Design Thinker', 'Freelance Consultant'],
      fitPercentage: 82
    },
    strengths: [
      'Navigates uncertainty and change with intuitive adaptability',
      'Provides creative solutions through independent exploration',
      'Adapts quickly to new situations based on pattern recognition',
      'Combines flexibility with experiential decision-making',
      'Thrives in ambiguous environments requiring innovative approaches'
    ],
    challenges: [
      'May struggle in highly structured or process-heavy environments',
      'Could find it difficult to explain intuitive decisions to analytical colleagues',
      'Might avoid collaboration that slows down adaptive responses'
    ],
    teamCollaboration: [
      'Contribute creative solutions and innovative approaches',
      'Share insights from independent exploration and experimentation',
      'Provide fresh perspectives on complex problems',
      'Help teams think outside traditional frameworks'
    ],
    careerPath: [
      'Creative Director',
      'Innovation Specialist',
      'Entrepreneur',
      'Design Thinker',
      'Strategic Planner',
      'Freelance Consultant'
    ]
  },
  {
    id: 'aic',
    name: 'The Harmony Catalyst',
    shortName: 'AIC',
    description: 'A collaborative innovator with adaptive team intuition who fosters collective creativity and flexible team dynamics.',
    traits: {
      workStyle: 'adaptive',
      decisionProcess: 'intuitive',
      teamInteraction: 'collaborative'
    },
    scrumRoles: {
      primary: 'Culture Champion',
      secondary: ['Team Development Facilitator', 'Community Builder'],
      fitPercentage: 78
    },
    strengths: [
      'Fosters collaborative innovation and creative team dynamics',
      'Adapts team approaches based on collective intuition and emerging needs',
      'Facilitates flexible teamwork that leverages diverse perspectives',
      'Creates adaptive team environments that encourage creative solutions',
      'Helps teams navigate change and uncertainty collaboratively'
    ],
    challenges: [
      'May struggle with teams that need structure or process consistency',
      'Could find it challenging to maintain focus when team dynamics are chaotic',
      'Might avoid necessary individual work in favor of team activities'
    ],
    teamCollaboration: [
      'Create adaptive team environments that encourage innovation',
      'Facilitate flexible teamwork based on collective intuition',
      'Help teams navigate change through collaborative creativity',
      'Build inclusive cultures that leverage diverse perspectives'
    ],
    careerPath: [
      'Culture Change Agent',
      'Team Development Facilitator', 
      'Innovation Team Lead',
      'Organizational Catalyst',
      'Collaborative Innovation Manager',
      'Community Builder'
    ]
  }
];

export function getPersonalityType(
  workStyle: 'structured' | 'adaptive',
  decisionProcess: 'analytical' | 'intuitive', 
  teamInteraction: 'collaborative' | 'individual'
): PersonalityType | null {
  return personalityTypes.find(type => 
    type.traits.workStyle === workStyle &&
    type.traits.decisionProcess === decisionProcess &&
    type.traits.teamInteraction === teamInteraction
  ) || null;
}