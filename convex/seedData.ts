import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data first
    const existingQuiz = await ctx.db
      .query("quizzes")
      .filter(q => q.eq(q.field("title"), "The Agile Assessment"))
      .first();

    if (existingQuiz) {
      return { message: "Database already seeded" };
    }

    // Insert main quiz
    const quizId = await ctx.db.insert("quizzes", {
      title: "The Agile Assessment",
      description: "Discover your personality traits through behavioral preferences",
      timeLimit: 900, // 15 minutes for 32 questions
      version: 3 // Updated to version 3 for 4-trait system
    });

    // Insert 4 sections for new trait system
    const workStyleId = await ctx.db.insert("quizSections", {
      quizId,
      title: "Work Style Preferences",
      description: "How you prefer to organize and approach your work",
      leftTrait: "Dynamic & Adaptable",
      rightTrait: "Structured & Organized",
      valueLine: "workStyle",
      displayOrder: 1
    });

    const decisionProcessId = await ctx.db.insert("quizSections", {
      quizId,
      title: "Decision Making Process", 
      description: "How you prefer to make decisions and process information",
      leftTrait: "Intuitive & Experience-Based",
      rightTrait: "Evidence-Based & Analytical",
      valueLine: "decisionProcess",
      displayOrder: 2
    });

    const communicationStyleId = await ctx.db.insert("quizSections", {
      quizId,
      title: "Communication Style",
      description: "How you prefer to interact and communicate with others",
      leftTrait: "Harmonizing & Diplomatic",
      rightTrait: "Direct & Straightforward",
      valueLine: "communicationStyle",
      displayOrder: 3
    });

    const focusOrientationId = await ctx.db.insert("quizSections", {
      quizId,
      title: "Focus Orientation",
      description: "Where you naturally direct your attention and energy",
      leftTrait: "People-Centered & Supportive",
      rightTrait: "Visionary & Strategic",
      valueLine: "focusOrientation",
      displayOrder: 4
    });

    // Insert questions for Work Style - Adaptability Preference (8 questions, alternating reverse scoring)
    const workStyleQuestions = [
      { statement: "I perform best when I have clearly defined processes and procedures to follow", isReversed: false },
      { statement: "I thrive in environments where requirements change frequently", isReversed: true },
      { statement: "I prefer to establish detailed project timelines before beginning any work", isReversed: false },
      { statement: "I can quickly adjust my approach when new information becomes available", isReversed: true },
      { statement: "Having documented workflows helps me deliver higher quality results", isReversed: false },
      { statement: "I prefer to figure out solutions as challenges arise rather than over-planning", isReversed: true },
      { statement: "I feel more confident when working within established frameworks and methodologies", isReversed: false },
      { statement: "I enjoy working on projects where the path forward isn't completely clear", isReversed: true }
    ];

    for (let i = 0; i < workStyleQuestions.length; i++) {
      await ctx.db.insert("questions", {
        quizId,
        sectionId: workStyleId,
        statement: workStyleQuestions[i].statement,
        displayOrder: i + 1,
        valueLine: "workStyle",
        isReversed: workStyleQuestions[i].isReversed
      });
    }

    // Insert questions for Decision Process - Decision Processing Style (8 questions, alternating reverse scoring)
    const decisionProcessQuestions = [
      { statement: "I need to see concrete data before making important decisions", isReversed: false },
      { statement: "I often know the right decision quickly, even with incomplete information", isReversed: true },
      { statement: "I prefer to research multiple options thoroughly before choosing a direction", isReversed: false },
      { statement: "I trust my experience and instincts when evaluating complex situations", isReversed: true },
      { statement: "Metrics and performance indicators are essential for evaluating success", isReversed: false },
      { statement: "I can synthesize multiple viewpoints rapidly to reach conclusions", isReversed: true },
      { statement: "I feel uncomfortable making decisions without sufficient supporting evidence", isReversed: false },
      { statement: "I'm comfortable making decisions when time pressure doesn't allow extensive analysis", isReversed: true }
    ];

    for (let i = 0; i < decisionProcessQuestions.length; i++) {
      await ctx.db.insert("questions", {
        quizId,
        sectionId: decisionProcessId,
        statement: decisionProcessQuestions[i].statement,
        displayOrder: i + 1,
        valueLine: "decisionProcess",
        isReversed: decisionProcessQuestions[i].isReversed
      });
    }

    // Insert questions for Communication Style - Team Interaction Mode (8 questions, alternating reverse scoring)
    const communicationStyleQuestions = [
      { statement: "I believe in giving honest feedback even when it might be uncomfortable to hear", isReversed: false },
      { statement: "I prioritize maintaining positive relationships when discussing difficult topics", isReversed: true },
      { statement: "I prefer straightforward communication without unnecessary diplomatic language", isReversed: false },
      { statement: "I prefer to build consensus before moving forward with controversial decisions", isReversed: true },
      { statement: "I appreciate when others are direct with me about problems or concerns", isReversed: false },
      { statement: "I invest significant time in understanding different stakeholder perspectives", isReversed: true },
      { statement: "I think it's more efficient to address issues head-on rather than working around them", isReversed: false },
      { statement: "I believe taking time to address everyone's concerns leads to better outcomes", isReversed: true }
    ];

    for (let i = 0; i < communicationStyleQuestions.length; i++) {
      await ctx.db.insert("questions", {
        quizId,
        sectionId: communicationStyleId,
        statement: communicationStyleQuestions[i].statement,
        displayOrder: i + 1,
        valueLine: "communicationStyle",
        isReversed: communicationStyleQuestions[i].isReversed
      });
    }

    // Insert questions for Focus Orientation - Value Creation Focus (8 questions, alternating reverse scoring)
    const focusOrientationQuestions = [
      { statement: "I get energized by discussions about long-term goals and future possibilities", isReversed: false },
      { statement: "I'm most satisfied when I can help team members develop new capabilities", isReversed: true },
      { statement: "I prefer working on initiatives that will have significant impact over time", isReversed: false },
      { statement: "I believe investing in people development creates the best long-term results", isReversed: true },
      { statement: "I naturally think about how current decisions will affect future outcomes", isReversed: false },
      { statement: "I get energy from coaching others and seeing them succeed", isReversed: true },
      { statement: "I'm most motivated by projects that involve innovation or transformation", isReversed: false },
      { statement: "I'm motivated by creating collaborative environments where everyone can contribute", isReversed: true }
    ];

    for (let i = 0; i < focusOrientationQuestions.length; i++) {
      await ctx.db.insert("questions", {
        quizId,
        sectionId: focusOrientationId,
        statement: focusOrientationQuestions[i].statement,
        displayOrder: i + 1,
        valueLine: "focusOrientation",
        isReversed: focusOrientationQuestions[i].isReversed
      });
    }

    // Insert 16 personality types with enhanced names and descriptions
    const personalityTypes = [
      // Structured + Evidence-Based Types
      {
        name: "🏗️ The Systems Architect",
        shortName: "SEDV",
        description: "Strategic roadmapping specialist who builds data-informed product decisions with clear vision articulation",
        traits: {
          workStyle: "structured" as const,
          decisionProcess: "evidence-based" as const,
          communicationStyle: "direct" as const,
          focusOrientation: "visionary" as const
        },
        careerPaths: ["Lead Product Owner", "Solution Architect", "Strategic Product Manager"]
      },
      {
        name: "⚙️ The Process Engineer",
        shortName: "SEDP", 
        description: "Team performance optimizer who uses metrics-driven coaching and systematic capability development",
        traits: {
          workStyle: "structured" as const,
          decisionProcess: "evidence-based" as const,
          communicationStyle: "direct" as const,
          focusOrientation: "people-centered" as const
        },
        careerPaths: ["Senior Scrum Master", "Engineering Manager", "Team Development Coach"]
      },
      {
        name: "🤝 The Stakeholder Orchestrator",
        shortName: "SEHV",
        description: "Multi-stakeholder alignment specialist with evidence-based consensus building and strategic partnership management",
        traits: {
          workStyle: "structured" as const,
          decisionProcess: "evidence-based" as const,
          communicationStyle: "harmonizing" as const,
          focusOrientation: "visionary" as const
        },
        careerPaths: ["Product Strategy Lead", "Business Analyst", "Strategic Partnership Manager"]
      },
      {
        name: "🌱 The Growth Facilitator",
        shortName: "SEHP",
        description: "Data-supported team development specialist with diplomatic conflict resolution and structured mentoring programs",
        traits: {
          workStyle: "structured" as const,
          decisionProcess: "evidence-based" as const,
          communicationStyle: "harmonizing" as const,
          focusOrientation: "people-centered" as const
        },
        careerPaths: ["Team Development Coach", "HR Business Partner", "Learning & Development Manager"]
      },
      // Structured + Intuitive Types  
      {
        name: "⚡ The Technical Strategist",
        shortName: "SIDV",
        description: "Rapid technical decision-maker with architectural vision and solution strategy leadership",
        traits: {
          workStyle: "structured" as const,
          decisionProcess: "intuitive" as const,
          communicationStyle: "direct" as const,
          focusOrientation: "visionary" as const
        },
        careerPaths: ["Solution Architect", "Technical Lead", "CTO"]
      },
      {
        name: "🎯 The Performance Catalyst",
        shortName: "SIDP",
        description: "Intuitive performance coach with direct feedback delivery and systematic team building",
        traits: {
          workStyle: "structured" as const,
          decisionProcess: "intuitive" as const,
          communicationStyle: "direct" as const,
          focusOrientation: "people-centered" as const
        },
        careerPaths: ["Engineering Manager", "Team Lead", "Performance Coach"]
      },
      {
        name: "🚀 The Innovation Orchestrator", 
        shortName: "SIHV",
        description: "Collaborative innovation process leader with stakeholder-aligned experimentation and structured creativity",
        traits: {
          workStyle: "structured" as const,
          decisionProcess: "intuitive" as const,
          communicationStyle: "harmonizing" as const,
          focusOrientation: "visionary" as const
        },
        careerPaths: ["Product Innovation Lead", "Design Strategy Lead", "Innovation Manager"]
      },
      {
        name: "💫 The Culture Architect",
        shortName: "SIHP",
        description: "Intuitive culture sensing specialist with structured harmony initiatives and collaborative team dynamics",
        traits: {
          workStyle: "structured" as const,
          decisionProcess: "intuitive" as const,
          communicationStyle: "harmonizing" as const,
          focusOrientation: "people-centered" as const
        },
        careerPaths: ["Agile Transformation Coach", "Culture Lead", "Organizational Development"]
      },
      // Dynamic + Evidence-Based Types
      {
        name: "🔥 The Market Disruptor",
        shortName: "DEDV",
        description: "Rapid market pivoting specialist with data-driven experimentation and aggressive opportunity pursuit",
        traits: {
          workStyle: "dynamic" as const,
          decisionProcess: "evidence-based" as const,
          communicationStyle: "direct" as const,
          focusOrientation: "visionary" as const
        },
        careerPaths: ["Startup Product Owner", "Growth Product Manager", "Market Research Lead"]
      },
      {
        name: "🏃 The Velocity Optimizer",
        shortName: "DEDP",
        description: "Real-time performance tuner with metrics-based team acceleration and delivery optimization",
        traits: {
          workStyle: "dynamic" as const,
          decisionProcess: "evidence-based" as const,
          communicationStyle: "direct" as const,
          focusOrientation: "people-centered" as const
        },
        careerPaths: ["Delivery Excellence Coach", "Agile Coach", "DevOps Lead"]
      },
      {
        name: "🌊 The Adaptive Strategist",
        shortName: "DEHV",
        description: "Market-responsive strategy specialist with stakeholder-aligned pivots and evidence-based diplomacy",
        traits: {
          workStyle: "dynamic" as const,
          decisionProcess: "evidence-based" as const,
          communicationStyle: "harmonizing" as const,
          focusOrientation: "visionary" as const
        },
        careerPaths: ["Business Development Lead", "Strategic Consultant", "Market Strategy Lead"]
      },
      {
        name: "📊 The Intelligence Coordinator",
        shortName: "DEHP",
        description: "Team intelligence optimization specialist with collaborative metrics implementation and adaptive team support",
        traits: {
          workStyle: "dynamic" as const,
          decisionProcess: "evidence-based" as const,
          communicationStyle: "harmonizing" as const,
          focusOrientation: "people-centered" as const
        },
        careerPaths: ["Analytics-Driven Team Coach", "Data-Driven HR Lead", "People Analytics Manager"]
      },
      // Dynamic + Intuitive Types
      {
        name: "💥 The Breakthrough Leader",
        shortName: "DIDV",
        description: "Disruptive opportunity recognition specialist with rapid strategic pivots and bold vision communication",
        traits: {
          workStyle: "dynamic" as const,
          decisionProcess: "intuitive" as const,
          communicationStyle: "direct" as const,
          focusOrientation: "visionary" as const
        },
        careerPaths: ["Innovation Executive", "Startup CEO", "Venture Capitalist"]
      },
      {
        name: "⚔️ The Adaptive Commander",
        shortName: "DIDP",
        description: "Intuitive team needs assessment specialist with rapid organizational adaptation and direct leadership under pressure",
        traits: {
          workStyle: "dynamic" as const,
          decisionProcess: "intuitive" as const,
          communicationStyle: "direct" as const,
          focusOrientation: "people-centered" as const
        },
        careerPaths: ["Crisis Response Lead", "Emergency Manager", "Rapid Response Team Lead"]
      },
      {
        name: "🎨 The Collaborative Innovator",
        shortName: "DIHV", 
        description: "Inclusive innovation process specialist with adaptive collaborative visioning and creative partnership facilitation",
        traits: {
          workStyle: "dynamic" as const,
          decisionProcess: "intuitive" as const,
          communicationStyle: "harmonizing" as const,
          focusOrientation: "visionary" as const
        },
        careerPaths: ["Design Strategy Lead", "Creative Director", "Innovation Facilitator"]
      },
      {
        name: "💝 The Empathetic Transformer",
        shortName: "DIHP",
        description: "Intuitive change sensing specialist with adaptive people development and empathetic transformation leadership",
        traits: {
          workStyle: "dynamic" as const,
          decisionProcess: "intuitive" as const,
          communicationStyle: "harmonizing" as const,
          focusOrientation: "people-centered" as const
        },
        careerPaths: ["Organizational Change Agent", "People Development Lead", "Transformation Coach"]
      }
    ];

    // Unique strengths, challenges, and enhanced career paths for each personality type
    const personalityData = {
      "SEDV": {
        tagline: "Blueprints for Tomorrow",
        motto: "Plan with precision, execute with confidence.",
        punchline: "Building the future, one data point at a time.",
        characterAttributes: ["Analytical", "Visionary", "Methodical", "Reliable", "Data-driven", "Communicator"],
        strengths: [
          "Exceptional at creating comprehensive product roadmaps with clear metrics",
          "Strong analytical skills for market research and competitive analysis",
          "Natural ability to communicate complex strategic concepts clearly",
          "Builds stakeholder confidence through data-backed decisions"
        ],
        challenges: [
          "May over-analyze situations leading to delayed decisions",
          "Can become rigid when market conditions require rapid pivots",
          "Risk of focusing too heavily on metrics at expense of team morale",
          "May struggle with ambiguous requirements or incomplete data"
        ],
        careerPaths: [
          "Lead Product Owner",
          "Solution Architect", 
          "Strategic Product Manager",
          "Chief Product Officer"
        ]
      },
      "SEDP": {
        tagline: "Master of the Machine",
        motto: "Optimize the process, elevate the team.",
        punchline: "When in doubt, refine the route.",
        characterAttributes: ["Structured", "Mentorly", "Observant", "Facilitative", "Detail-oriented", "Improvement-focused"],
        strengths: [
          "Excellent at implementing systematic team development programs",
          "Strong facilitation skills for retrospectives and process improvement",
          "Data-driven approach to measuring and improving team performance",
          "Natural mentor who helps team members grow methodically"
        ],
        challenges: [
          "May focus too heavily on process compliance over outcomes",
          "Risk of micromanaging team members' development",
          "Can struggle when teams need emotional support over systematic solutions",
          "May resist innovative approaches that don't fit established frameworks"
        ],
        careerPaths: [
          "Senior Scrum Master",
          "Engineering Manager",
          "Team Development Coach",
          "Agile Transformation Lead"
        ]
      },
      "SEHV": {
        tagline: "Harmony in Motion",
        motto: "Align interests, amplify impact.",
        punchline: "Turning discord into consensus.",
        characterAttributes: ["Empathetic", "Diplomatic", "Persuasive", "Connector", "Patient", "Consensus-builder"],
        strengths: [
          "Exceptional at building consensus among diverse stakeholder groups",
          "Strong relationship management and diplomatic communication",
          "Ability to translate technical concepts into business language",
          "Creates alignment between competing priorities through collaboration"
        ],
        challenges: [
          "Decision-making may be slower due to extensive consensus-building",
          "Risk of avoiding difficult conversations to maintain harmony",
          "May struggle with urgent decisions requiring direct action",
          "Can become overwhelmed by conflicting stakeholder demands"
        ],
        careerPaths: [
          "Product Strategy Lead",
          "Business Analyst",
          "Strategic Partnership Manager",
          "Chief Strategy Officer"
        ]
      },
      "SEHP": {
        tagline: "Cultivating Potential",
        motto: "Nurture people, harvest progress.",
        punchline: "Growth is a garden—tend it daily.",
        characterAttributes: ["Empathetic", "Supportive", "Observant", "Patient", "Nurturing", "Development-oriented"],
        strengths: [
          "Outstanding at creating psychologically safe learning environments",
          "Data-informed approach to individual development planning",
          "Strong empathy combined with systematic development methods",
          "Excellent at facilitating difficult team conversations diplomatically"
        ],
        challenges: [
          "May avoid giving direct feedback to preserve relationships",
          "Risk of over-investing in team members who aren't committed to growth",
          "Can struggle with performance management decisions",
          "May move too slowly when rapid team changes are needed"
        ],
        careerPaths: [
          "Team Development Coach",
          "HR Business Partner",
          "Learning & Development Manager",
          "Agile Transformation Specialist"
        ]
      },
      "SIDV": {
        tagline: "Code the Vision",
        motto: "Architect ideas into reality.",
        punchline: "Blueprints meet bytes.",
        characterAttributes: ["Innovative", "Decisive", "Technical", "Inspirational", "Forward-thinking", "Detail-minded"],
        strengths: [
          "Rapid technical decision-making with strong architectural vision",
          "Ability to balance technical excellence with business needs",
          "Natural leader who inspires teams through technical expertise",
          "Strong pattern recognition for system design and optimization"
        ],
        challenges: [
          "May make decisions too quickly without sufficient stakeholder input",
          "Risk of technical solutions being too complex for business needs",
          "Can struggle with non-technical team members' perspectives",
          "May underestimate implementation challenges when moving fast"
        ],
        careerPaths: [
          "CTO/VP Engineering",
          "Principal Architect",
          "Technical Strategy Lead",
          "Startup CTO"
        ]
      },
      "SIDP": {
        tagline: "Igniting Excellence",
        motto: "Push boundaries, exceed expectations.",
        punchline: "Fueling peak performance.",
        characterAttributes: ["Energetic", "Honest", "Motivational", "Strategic", "Goal-oriented", "Resilient"],
        strengths: [
          "Excellent intuition for identifying performance bottlenecks in teams",
          "Strong coaching abilities combined with clear performance expectations",
          "Natural ability to motivate individuals through direct, honest feedback",
          "Systematic approach to building high-performing teams"
        ],
        challenges: [
          "Direct feedback style may intimidate less confident team members",
          "Risk of pushing team members beyond sustainable performance levels",
          "May struggle with team members who need emotional support",
          "Can become impatient with slower learners or adapters"
        ],
        careerPaths: [
          "Engineering Manager",
          "Performance Coach",
          "Technical Team Lead",
          "Director of Engineering"
        ]
      },
      "SIHV": {
        tagline: "Symphony of Ideas",
        motto: "Compose creativity, conduct change.",
        punchline: "Where imagination meets execution.",
        characterAttributes: ["Creative", "Inclusive", "Visionary", "Facilitative", "Adaptable", "Big-picture"],
        strengths: [
          "Outstanding at facilitating collaborative innovation processes",
          "Strong strategic vision combined with inclusive decision-making",
          "Ability to build consensus around ambitious innovation goals",
          "Natural talent for creating environments where creativity thrives"
        ],
        challenges: [
          "Innovation initiatives may lack clear success metrics or timelines",
          "Risk of pursuing too many innovative ideas without proper focus",
          "May struggle with the discipline required for execution",
          "Can become paralyzed when stakeholders have conflicting innovation visions"
        ],
        careerPaths: [
          "Chief Innovation Officer",
          "Innovation Strategy Lead",
          "Design Thinking Facilitator",
          "Venture Capital Partner"
        ]
      },
      "SIHP": {
        tagline: "Blueprint for Belonging",
        motto: "Design culture, inspire excellence.",
        punchline: "Crafting spaces where ideas belong.",
        characterAttributes: ["Empathetic", "Inclusive", "Perceptive", "Supportive", "Trust-builder", "Communicative"],
        strengths: [
          "Exceptional ability to sense and shape team culture",
          "Strong facilitation skills for building collaborative environments",
          "Natural talent for helping team members find their strengths",
          "Systematic approach to creating inclusive, high-trust teams"
        ],
        challenges: [
          "May prioritize team harmony over necessary difficult decisions",
          "Risk of moving too slowly when rapid cultural changes are needed",
          "Can struggle with performance management in low-trust situations",
          "May avoid addressing technical or business issues to focus on people"
        ],
        careerPaths: [
          "Culture Transformation Lead",
          "Organizational Development Manager",
          "Chief People Officer",
          "Executive Coach"
        ]
      },
      "DEDV": {
        tagline: "Break the Status Quo",
        motto: "Challenge norms, seize opportunity.",
        punchline: "Disruption powered by data.",
        characterAttributes: ["Ambitious", "Analytical", "Risk-taker", "Opportunistic", "Energetic", "Visionary"],
        strengths: [
          "Exceptional at identifying and acting on market opportunities quickly",
          "Strong analytical skills for rapid market validation and pivoting",
          "Natural entrepreneurial mindset with data-driven decision making",
          "Ability to inspire teams around ambitious market disruption goals"
        ],
        challenges: [
          "May change direction too frequently, causing team confusion",
          "Risk of making decisions without sufficient stakeholder consultation",
          "Can struggle with long-term planning and sustained execution",
          "May underestimate resource requirements for rapid market moves"
        ],
        careerPaths: [
          "Startup Founder/CEO",
          "New Business Ventures Lead",
          "Venture Capitalist",
          "Chief Strategy Officer"
        ]
      },
      "DEDP": {
        tagline: "Speed Meets Precision",
        motto: "Accelerate thoughtfully.",
        punchline: "Fast lanes, clear goals.",
        characterAttributes: ["Agile", "Persistent", "Focused", "Practical", "Motivating", "Performance-driven"],
        strengths: [
          "Outstanding at identifying and removing team performance bottlenecks",
          "Strong coaching ability focused on continuous performance improvement",
          "Data-driven approach to optimizing team velocity and delivery",
          "Natural ability to help teams adapt quickly to changing requirements"
        ],
        challenges: [
          "May push teams too hard, risking burnout or quality issues",
          "Risk of optimizing for speed over sustainable practices",
          "Can struggle when team members need stability and predictability",
          "May neglect long-term skill development for short-term gains"
        ],
        careerPaths: [
          "Delivery Excellence Manager",
          "DevOps Transformation Lead",
          "Performance Optimization Coach",
          "Chief Operating Officer"
        ]
      },
      "DEHV": {
        tagline: "Flow with Purpose",
        motto: "Evolve strategy, empower change.",
        punchline: "Adaptation is the new advantage.",
        characterAttributes: ["Flexible", "Diplomatic", "Analytical", "Perceptive", "Collaborative", "Strategic"],
        strengths: [
          "Excellent at pivoting strategy based on market feedback and data",
          "Strong relationship management during times of strategic change",
          "Natural ability to build consensus around new strategic directions",
          "Data-informed approach to stakeholder-aligned decision making"
        ],
        challenges: [
          "Strategy may lack consistency, making execution challenging",
          "Risk of over-consulting stakeholders, slowing decision-making",
          "May struggle with long-term strategic commitments",
          "Can become overwhelmed when multiple stakeholders want different directions"
        ],
        careerPaths: [
          "Chief Strategy Officer",
          "Strategic Consulting Lead",
          "Market Strategy Manager",
          "Business Development Director"
        ]
      },
      "DEHP": {
        tagline: "Insights in Action",
        motto: "Measure to master.",
        punchline: "Turning metrics into momentum.",
        characterAttributes: ["Analytical", "Collaborative", "Supportive", "Detail-oriented", "Communicative", "Data-focused"],
        strengths: [
          "Outstanding at using data to understand and improve team dynamics",
          "Strong collaborative approach to implementing team analytics",
          "Natural ability to help teams understand their own performance patterns",
          "Excellent at adapting measurement approaches based on team feedback"
        ],
        challenges: [
          "May focus too heavily on metrics without understanding underlying issues",
          "Risk of creating analysis paralysis in decision-making processes",
          "Can struggle when teams resist data-driven approaches",
          "May neglect emotional and cultural factors in favor of quantifiable metrics"
        ],
        careerPaths: [
          "Head of People Analytics",
          "Team Performance Coach",
          "Business Intelligence Manager",
          "Chief Data Officer"
        ]
      },
      "DIDV": {
        tagline: "Pioneer the Next",
        motto: "Disrupt boldly, lead swiftly.",
        punchline: "Where breakthroughs begin.",
        characterAttributes: ["Charismatic", "Bold", "Intuitive", "Decisive", "Entrepreneurial", "Inspiring"],
        strengths: [
          "Exceptional at recognizing and acting on breakthrough opportunities",
          "Strong leadership presence that inspires teams during rapid change",
          "Natural entrepreneurial instincts combined with bold vision communication",
          "Outstanding ability to make quick decisions in ambiguous situations"
        ],
        challenges: [
          "May change direction too frequently, causing team exhaustion",
          "Risk of making decisions without sufficient analysis or consultation",
          "Can struggle with detailed planning and systematic execution",
          "May underestimate organizational change management requirements"
        ],
        careerPaths: [
          "CEO/Founder",
          "Chief Innovation Officer",
          "Venture Capital Partner",
          "Transformation Executive"
        ]
      },
      "DIDP": {
        tagline: "Lead Through the Storm",
        motto: "Steady hand under pressure.",
        punchline: "Command change with clarity.",
        characterAttributes: ["Courageous", "Decisive", "Empathetic", "Resilient", "Clear-headed", "Tactical"],
        strengths: [
          "Outstanding crisis leadership with strong intuitive decision-making",
          "Natural ability to assess and respond to team needs under pressure",
          "Strong direct communication that provides clarity during uncertainty",
          "Excellent at rapidly reorganizing teams to meet changing challenges"
        ],
        challenges: [
          "Leadership style may be too intense for normal operating conditions",
          "Risk of burning out team members during extended high-pressure periods",
          "May struggle with long-term planning and relationship building",
          "Can make decisions too quickly without considering all stakeholder impacts"
        ],
        careerPaths: [
          "Crisis Management Lead",
          "Turnaround Executive",
          "Emergency Response Manager",
          "Chief Operating Officer"
        ]
      },
      "DIHV": {
        tagline: "Creativity in Concert",
        motto: "Design together, deliver brilliance.",
        punchline: "Innovation thrives in unity.",
        characterAttributes: ["Creative", "Collaborative", "Empathetic", "Open-minded", "Flexible", "Visionary"],
        strengths: [
          "Exceptional at facilitating inclusive innovation processes",
          "Strong ability to adapt innovation approaches based on team dynamics",
          "Natural talent for building consensus around creative solutions",
          "Outstanding at integrating diverse perspectives into cohesive visions"
        ],
        challenges: [
          "Innovation processes may lack urgency or clear success criteria",
          "Risk of endless collaboration without reaching concrete decisions",
          "May struggle with the discipline required for systematic execution",
          "Can become overwhelmed when stakeholders have conflicting creative visions"
        ],
        careerPaths: [
          "Chief Design Officer",
          "Innovation Facilitator",
          "Creative Strategy Lead",
          "User Experience Director"
        ]
      },
      "DIHP": {
        tagline: "Heart of Change",
        motto: "Lead with empathy, transform with purpose.",
        punchline: "Change that cares.",
        characterAttributes: ["Empathetic", "Adaptable", "Supportive", "Perceptive", "Trustworthy", "Transformational"],
        strengths: [
          "Outstanding ability to sense and respond to individual and team emotional needs",
          "Strong collaborative approach to organizational change management",
          "Natural talent for creating inclusive environments during transformation",
          "Excellent at adapting change approaches based on human impact"
        ],
        challenges: [
          "May move too slowly when rapid organizational changes are required",
          "Risk of avoiding difficult decisions to preserve relationships",
          "Can struggle with performance management during transformations",
          "May focus too heavily on emotional well-being at expense of business results"
        ],
        careerPaths: [
          "Chief People Officer",
          "Transformation Coach",
          "Change Management Lead",
          "Executive Leadership Coach"
        ]
      }
    };

    for (const personalityType of personalityTypes) {
      const data = personalityData[personalityType.shortName as keyof typeof personalityData];
      await ctx.db.insert("personalityTypes", {
        ...personalityType,
        tagline: data.tagline,
        motto: data.motto,
        punchline: data.punchline,
        characterAttributes: data.characterAttributes,
        strengths: data.strengths,
        challenges: data.challenges,
        careerPaths: data.careerPaths
      });
    }

    return { 
      message: "Database seeded successfully with 4-trait, 16-personality system",
      quiz: quizId,
      sections: 4,
      questions: 32,
      personalityTypes: 16,
      updated: "2025-01-12"
    };
  }
});

export const clearDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all existing data
    const quizzes = await ctx.db.query("quizzes").collect();
    for (const quiz of quizzes) {
      await ctx.db.delete(quiz._id);
    }
    
    const sections = await ctx.db.query("quizSections").collect();
    for (const section of sections) {
      await ctx.db.delete(section._id);
    }
    
    const questions = await ctx.db.query("questions").collect();
    for (const question of questions) {
      await ctx.db.delete(question._id);
    }
    
    const personalityTypes = await ctx.db.query("personalityTypes").collect();
    for (const type of personalityTypes) {
      await ctx.db.delete(type._id);
    }

    const sessions = await ctx.db.query("quizSessions").collect();
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    const responses = await ctx.db.query("quizResponses").collect();
    for (const response of responses) {
      await ctx.db.delete(response._id);
    }

    const results = await ctx.db.query("quizResults").collect();
    for (const result of results) {
      await ctx.db.delete(result._id);
    }

    return { message: "Database cleared completely" };
  }
});