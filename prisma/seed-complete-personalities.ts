import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Original Convex personality types data with all attributes
const personalitiesData = [
  {
    "_creationTime": 1755082648738.4324,
    "_id": "k175p03937qdx18dvvyrgqnxss7nj590",
    "careerPaths": [
      "Lead Product Owner",
      "Solution Architect",
      "Strategic Product Manager",
      "Chief Product Officer"
    ],
    "challenges": [
      "May over-analyze situations leading to delayed decisions",
      "Can become rigid when market conditions require rapid pivots",
      "Risk of focusing too heavily on metrics at expense of team morale",
      "May struggle with ambiguous requirements or incomplete data"
    ],
    "characterAttributes": [
      "Analytical",
      "Visionary",
      "Methodical",
      "Reliable",
      "Data-driven",
      "Communicator"
    ],
    "characterImage": "/characters/SEDV.png",
    "description": "Strategic roadmapping specialist who builds data-informed product decisions with clear vision articulation",
    "motto": "Plan with precision, execute with confidence.",
    "name": "🏗️ The Systems Architect",
    "punchline": "Building the future, one data point at a time.",
    "shortName": "SEDV",
    "strengths": [
      "Exceptional at creating comprehensive product roadmaps with clear metrics",
      "Strong analytical skills for market research and competitive analysis",
      "Natural ability to communicate complex strategic concepts clearly",
      "Builds stakeholder confidence through data-backed decisions"
    ],
    "tagline": "Blueprints for Tomorrow",
    "traits": {
      "communicationStyle": "direct",
      "decisionProcess": "evidence-based",
      "focusOrientation": "visionary",
      "workStyle": "structured"
    }
  },
  {
    "_creationTime": 1755082648738.4326,
    "_id": "k176a5avfjppm6cs8n9fv9hv4n7njgmr",
    "careerPaths": [
      "Senior Scrum Master",
      "Engineering Manager",
      "Team Development Coach",
      "Agile Transformation Lead"
    ],
    "challenges": [
      "May focus too heavily on process compliance over outcomes",
      "Risk of micromanaging team members' development",
      "Can struggle when teams need emotional support over systematic solutions",
      "May resist innovative approaches that don't fit established frameworks"
    ],
    "characterAttributes": [
      "Structured",
      "Mentorly",
      "Observant",
      "Facilitative",
      "Detail-oriented",
      "Improvement-focused"
    ],
    "characterImage": "/characters/SEDP.png",
    "description": "Team performance optimizer who uses metrics-driven coaching and systematic capability development",
    "motto": "Optimize the process, elevate the team.",
    "name": "⚙️ The Process Engineer",
    "punchline": "When in doubt, refine the route.",
    "shortName": "SEDP",
    "strengths": [
      "Excellent at implementing systematic team development programs",
      "Strong facilitation skills for retrospectives and process improvement",
      "Data-driven approach to measuring and improving team performance",
      "Natural mentor who helps team members grow methodically"
    ],
    "tagline": "Master of the Machine",
    "traits": {
      "communicationStyle": "direct",
      "decisionProcess": "evidence-based",
      "focusOrientation": "people-centered",
      "workStyle": "structured"
    }
  },
  {
    "_creationTime": 1755082648738.4329,
    "_id": "k1787p3aajefygzs04gbk9ybv97nk94w",
    "careerPaths": [
      "Product Strategy Lead",
      "Business Analyst",
      "Strategic Partnership Manager",
      "Chief Strategy Officer"
    ],
    "challenges": [
      "Decision-making may be slower due to extensive consensus-building",
      "Risk of avoiding difficult conversations to maintain harmony",
      "May struggle with urgent decisions requiring direct action",
      "Can become overwhelmed by conflicting stakeholder demands"
    ],
    "characterAttributes": [
      "Empathetic",
      "Diplomatic",
      "Persuasive",
      "Connector",
      "Patient",
      "Consensus-builder"
    ],
    "characterImage": "/characters/SEHV.png",
    "description": "Multi-stakeholder alignment specialist with evidence-based consensus building and strategic partnership management",
    "motto": "Align interests, amplify impact.",
    "name": "🤝 The Stakeholder Orchestrator",
    "punchline": "Turning discord into consensus.",
    "shortName": "SEHV",
    "strengths": [
      "Exceptional at building consensus among diverse stakeholder groups",
      "Strong relationship management and diplomatic communication",
      "Ability to translate technical concepts into business language",
      "Creates alignment between competing priorities through collaboration"
    ],
    "tagline": "Harmony in Motion",
    "traits": {
      "communicationStyle": "harmonizing",
      "decisionProcess": "evidence-based",
      "focusOrientation": "visionary",
      "workStyle": "structured"
    }
  },
  {
    "_creationTime": 1755082648738.433,
    "_id": "k174ykfx422272jesd9f6kya7x7njbj9",
    "careerPaths": [
      "Team Development Coach",
      "HR Business Partner",
      "Learning & Development Manager",
      "Agile Transformation Specialist"
    ],
    "challenges": [
      "May avoid giving direct feedback to preserve relationships",
      "Risk of over-investing in team members who aren't committed to growth",
      "Can struggle with performance management decisions",
      "May move too slowly when rapid team changes are needed"
    ],
    "characterAttributes": [
      "Empathetic",
      "Supportive",
      "Observant",
      "Patient",
      "Nurturing",
      "Development-oriented"
    ],
    "characterImage": "/characters/SEHP.png",
    "description": "Data-supported team development specialist with diplomatic conflict resolution and structured mentoring programs",
    "motto": "Nurture people, harvest progress.",
    "name": "🌱 The Growth Facilitator",
    "punchline": "Growth is a garden—tend it daily.",
    "shortName": "SEHP",
    "strengths": [
      "Outstanding at creating psychologically safe learning environments",
      "Data-informed approach to individual development planning",
      "Strong empathy combined with systematic development methods",
      "Excellent at facilitating difficult team conversations diplomatically"
    ],
    "tagline": "Cultivating Potential",
    "traits": {
      "communicationStyle": "harmonizing",
      "decisionProcess": "evidence-based",
      "focusOrientation": "people-centered",
      "workStyle": "structured"
    }
  },
  {
    "_creationTime": 1755082648738.4333,
    "_id": "k175n8rab2z0sz1nt2yc2dbhgx7njrnk",
    "careerPaths": [
      "CTO/VP Engineering",
      "Principal Architect",
      "Technical Strategy Lead",
      "Startup CTO"
    ],
    "challenges": [
      "May make decisions too quickly without sufficient stakeholder input",
      "Risk of technical solutions being too complex for business needs",
      "Can struggle with non-technical team members' perspectives",
      "May underestimate implementation challenges when moving fast"
    ],
    "characterAttributes": [
      "Innovative",
      "Decisive",
      "Technical",
      "Inspirational",
      "Forward-thinking",
      "Detail-minded"
    ],
    "characterImage": "/characters/SIDV.png",
    "description": "Rapid technical decision-maker with architectural vision and solution strategy leadership",
    "motto": "Architect ideas into reality.",
    "name": "⚡ The Technical Strategist",
    "punchline": "Blueprints meet bytes.",
    "shortName": "SIDV",
    "strengths": [
      "Rapid technical decision-making with strong architectural vision",
      "Ability to balance technical excellence with business needs",
      "Natural leader who inspires teams through technical expertise",
      "Strong pattern recognition for system design and optimization"
    ],
    "tagline": "Code the Vision",
    "traits": {
      "communicationStyle": "direct",
      "decisionProcess": "intuitive",
      "focusOrientation": "visionary",
      "workStyle": "structured"
    }
  },
  {
    "_creationTime": 1755082648738.4336,
    "_id": "k178jxen7cjk4rb28zx9f4r7q17nkr5y",
    "careerPaths": [
      "Engineering Manager",
      "Performance Coach",
      "Technical Team Lead",
      "Director of Engineering"
    ],
    "challenges": [
      "Direct feedback style may intimidate less confident team members",
      "Risk of pushing team members beyond sustainable performance levels",
      "May struggle with team members who need emotional support",
      "Can become impatient with slower learners or adapters"
    ],
    "characterAttributes": [
      "Energetic",
      "Honest",
      "Motivational",
      "Strategic",
      "Goal-oriented",
      "Resilient"
    ],
    "characterImage": "/characters/SIDP.png",
    "description": "Intuitive performance coach with direct feedback delivery and systematic team building",
    "motto": "Push boundaries, exceed expectations.",
    "name": "🎯 The Performance Catalyst",
    "punchline": "Fueling peak performance.",
    "shortName": "SIDP",
    "strengths": [
      "Excellent intuition for identifying performance bottlenecks in teams",
      "Strong coaching abilities combined with clear performance expectations",
      "Natural ability to motivate individuals through direct, honest feedback",
      "Systematic approach to building high-performing teams"
    ],
    "tagline": "Igniting Excellence",
    "traits": {
      "communicationStyle": "direct",
      "decisionProcess": "intuitive",
      "focusOrientation": "people-centered",
      "workStyle": "structured"
    }
  },
  {
    "_creationTime": 1755082648738.4338,
    "_id": "k17d9bmvfb8yn0s2w8m1wbfejx7njqtq",
    "careerPaths": [
      "Chief Innovation Officer",
      "Innovation Strategy Lead",
      "Design Thinking Facilitator",
      "Venture Capital Partner"
    ],
    "challenges": [
      "Innovation initiatives may lack clear success metrics or timelines",
      "Risk of pursuing too many innovative ideas without proper focus",
      "May struggle with the discipline required for execution",
      "Can become paralyzed when stakeholders have conflicting innovation visions"
    ],
    "characterAttributes": [
      "Creative",
      "Inclusive",
      "Visionary",
      "Facilitative",
      "Adaptable",
      "Big-picture"
    ],
    "characterImage": "/characters/SIHV.png",
    "description": "Collaborative innovation process leader with stakeholder-aligned experimentation and structured creativity",
    "motto": "Compose creativity, conduct change.",
    "name": "🚀 The Innovation Orchestrator",
    "punchline": "Where imagination meets execution.",
    "shortName": "SIHV",
    "strengths": [
      "Outstanding at facilitating collaborative innovation processes",
      "Strong strategic vision combined with inclusive decision-making",
      "Ability to build consensus around ambitious innovation goals",
      "Natural talent for creating environments where creativity thrives"
    ],
    "tagline": "Symphony of Ideas",
    "traits": {
      "communicationStyle": "harmonizing",
      "decisionProcess": "intuitive",
      "focusOrientation": "visionary",
      "workStyle": "structured"
    }
  },
  {
    "_creationTime": 1755082648738.434,
    "_id": "k178fc1qbnqyqddz2sxwnwmmq97nkgk7",
    "careerPaths": [
      "Culture Transformation Lead",
      "Organizational Development Manager",
      "Chief People Officer",
      "Executive Coach"
    ],
    "challenges": [
      "May prioritize team harmony over necessary difficult decisions",
      "Risk of moving too slowly when rapid cultural changes are needed",
      "Can struggle with performance management in low-trust situations",
      "May avoid addressing technical or business issues to focus on people"
    ],
    "characterAttributes": [
      "Empathetic",
      "Inclusive",
      "Perceptive",
      "Supportive",
      "Trust-builder",
      "Communicative"
    ],
    "characterImage": "/characters/SIHP.png",
    "description": "Intuitive culture sensing specialist with structured harmony initiatives and collaborative team dynamics",
    "motto": "Design culture, inspire excellence.",
    "name": "💫 The Culture Architect",
    "punchline": "Crafting spaces where ideas belong.",
    "shortName": "SIHP",
    "strengths": [
      "Exceptional ability to sense and shape team culture",
      "Strong facilitation skills for building collaborative environments",
      "Natural talent for helping team members find their strengths",
      "Systematic approach to creating inclusive, high-trust teams"
    ],
    "tagline": "Blueprint for Belonging",
    "traits": {
      "communicationStyle": "harmonizing",
      "decisionProcess": "intuitive",
      "focusOrientation": "people-centered",
      "workStyle": "structured"
    }
  },
  {
    "_creationTime": 1755082648738.4343,
    "_id": "k17bv1bwb5xk1hfh3sh8gryq157njmfg",
    "careerPaths": [
      "Startup Founder/CEO",
      "New Business Ventures Lead",
      "Venture Capitalist",
      "Chief Strategy Officer"
    ],
    "challenges": [
      "May change direction too frequently, causing team confusion",
      "Risk of making decisions without sufficient stakeholder consultation",
      "Can struggle with long-term planning and sustained execution",
      "May underestimate resource requirements for rapid market moves"
    ],
    "characterAttributes": [
      "Ambitious",
      "Analytical",
      "Risk-taker",
      "Opportunistic",
      "Energetic",
      "Visionary"
    ],
    "characterImage": "/characters/DEDV.png",
    "description": "Rapid market pivoting specialist with data-driven experimentation and aggressive opportunity pursuit",
    "motto": "Challenge norms, seize opportunity.",
    "name": "🔥 The Market Disruptor",
    "punchline": "Disruption powered by data.",
    "shortName": "DEDV",
    "strengths": [
      "Exceptional at identifying and acting on market opportunities quickly",
      "Strong analytical skills for rapid market validation and pivoting",
      "Natural entrepreneurial mindset with data-driven decision making",
      "Ability to inspire teams around ambitious market disruption goals"
    ],
    "tagline": "Break the Status Quo",
    "traits": {
      "communicationStyle": "direct",
      "decisionProcess": "evidence-based",
      "focusOrientation": "visionary",
      "workStyle": "dynamic"
    }
  },
  {
    "_creationTime": 1755082648738.4346,
    "_id": "k177pke6vvqjbyqj68mew10erx7nj6rg",
    "careerPaths": [
      "Delivery Excellence Manager",
      "DevOps Transformation Lead",
      "Performance Optimization Coach",
      "Chief Operating Officer"
    ],
    "challenges": [
      "May push teams too hard, risking burnout or quality issues",
      "Risk of optimizing for speed over sustainable practices",
      "Can struggle when team members need stability and predictability",
      "May neglect long-term skill development for short-term gains"
    ],
    "characterAttributes": [
      "Agile",
      "Persistent",
      "Focused",
      "Practical",
      "Motivating",
      "Performance-driven"
    ],
    "characterImage": "/characters/DEDP.png",
    "description": "Real-time performance tuner with metrics-based team acceleration and delivery optimization",
    "motto": "Accelerate thoughtfully.",
    "name": "🏃 The Velocity Optimizer",
    "punchline": "Fast lanes, clear goals.",
    "shortName": "DEDP",
    "strengths": [
      "Outstanding at identifying and removing team performance bottlenecks",
      "Strong coaching ability focused on continuous performance improvement",
      "Data-driven approach to optimizing team velocity and delivery",
      "Natural ability to help teams adapt quickly to changing requirements"
    ],
    "tagline": "Speed Meets Precision",
    "traits": {
      "communicationStyle": "direct",
      "decisionProcess": "evidence-based",
      "focusOrientation": "people-centered",
      "workStyle": "dynamic"
    }
  },
  {
    "_creationTime": 1755082648738.4348,
    "_id": "k176e19j8w0kh9yjdz47b47wth7njc9d",
    "careerPaths": [
      "Chief Strategy Officer",
      "Strategic Consulting Lead",
      "Market Strategy Manager",
      "Business Development Director"
    ],
    "challenges": [
      "Strategy may lack consistency, making execution challenging",
      "Risk of over-consulting stakeholders, slowing decision-making",
      "May struggle with long-term strategic commitments",
      "Can become overwhelmed when multiple stakeholders want different directions"
    ],
    "characterAttributes": [
      "Flexible",
      "Diplomatic",
      "Analytical",
      "Perceptive",
      "Collaborative",
      "Strategic"
    ],
    "characterImage": "/characters/DEHV.png",
    "description": "Market-responsive strategy specialist with stakeholder-aligned pivots and evidence-based diplomacy",
    "motto": "Evolve strategy, empower change.",
    "name": "🌊 The Adaptive Strategist",
    "punchline": "Adaptation is the new advantage.",
    "shortName": "DEHV",
    "strengths": [
      "Excellent at pivoting strategy based on market feedback and data",
      "Strong relationship management during times of strategic change",
      "Natural ability to build consensus around new strategic directions",
      "Data-informed approach to stakeholder-aligned decision making"
    ],
    "tagline": "Flow with Purpose",
    "traits": {
      "communicationStyle": "harmonizing",
      "decisionProcess": "evidence-based",
      "focusOrientation": "visionary",
      "workStyle": "dynamic"
    }
  },
  {
    "_creationTime": 1755082648738.435,
    "_id": "k178d2gkwmfvstk5hv0qcm9v4s7njdwx",
    "careerPaths": [
      "Head of People Analytics",
      "Team Performance Coach",
      "Business Intelligence Manager",
      "Chief Data Officer"
    ],
    "challenges": [
      "May focus too heavily on metrics without understanding underlying issues",
      "Risk of creating analysis paralysis in decision-making processes",
      "Can struggle when teams resist data-driven approaches",
      "May neglect emotional and cultural factors in favor of quantifiable metrics"
    ],
    "characterAttributes": [
      "Analytical",
      "Collaborative",
      "Supportive",
      "Detail-oriented",
      "Communicative",
      "Data-focused"
    ],
    "characterImage": "/characters/DEHP.png",
    "description": "Team intelligence optimization specialist with collaborative metrics implementation and adaptive team support",
    "motto": "Measure to master.",
    "name": "📊 The Intelligence Coordinator",
    "punchline": "Turning metrics into momentum.",
    "shortName": "DEHP",
    "strengths": [
      "Outstanding at using data to understand and improve team dynamics",
      "Strong collaborative approach to implementing team analytics",
      "Natural ability to help teams understand their own performance patterns",
      "Excellent at adapting measurement approaches based on team feedback"
    ],
    "tagline": "Insights in Action",
    "traits": {
      "communicationStyle": "harmonizing",
      "decisionProcess": "evidence-based",
      "focusOrientation": "people-centered",
      "workStyle": "dynamic"
    }
  },
  {
    "_creationTime": 1755082648738.4353,
    "_id": "k175fxp7djh1ts7jf9vjkxs6rh7nj7gc",
    "careerPaths": [
      "CEO/Founder",
      "Chief Innovation Officer",
      "Venture Capital Partner",
      "Transformation Executive"
    ],
    "challenges": [
      "May change direction too frequently, causing team exhaustion",
      "Risk of making decisions without sufficient analysis or consultation",
      "Can struggle with detailed planning and systematic execution",
      "May underestimate organizational change management requirements"
    ],
    "characterAttributes": [
      "Charismatic",
      "Bold",
      "Intuitive",
      "Decisive",
      "Entrepreneurial",
      "Inspiring"
    ],
    "characterImage": "/characters/DIDV.png",
    "description": "Disruptive opportunity recognition specialist with rapid strategic pivots and bold vision communication",
    "motto": "Disrupt boldly, lead swiftly.",
    "name": "💥 The Breakthrough Leader",
    "punchline": "Where breakthroughs begin.",
    "shortName": "DIDV",
    "strengths": [
      "Exceptional at recognizing and acting on breakthrough opportunities",
      "Strong leadership presence that inspires teams during rapid change",
      "Natural entrepreneurial instincts combined with bold vision communication",
      "Outstanding ability to make quick decisions in ambiguous situations"
    ],
    "tagline": "Pioneer the Next",
    "traits": {
      "communicationStyle": "direct",
      "decisionProcess": "intuitive",
      "focusOrientation": "visionary",
      "workStyle": "dynamic"
    }
  },
  {
    "_creationTime": 1755082648738.4355,
    "_id": "k17a3d9me87bv5nxfmphgfrdmd7njpbn",
    "careerPaths": [
      "Crisis Management Lead",
      "Turnaround Executive",
      "Emergency Response Manager",
      "Chief Operating Officer"
    ],
    "challenges": [
      "Leadership style may be too intense for normal operating conditions",
      "Risk of burning out team members during extended high-pressure periods",
      "May struggle with long-term planning and relationship building",
      "Can make decisions too quickly without considering all stakeholder impacts"
    ],
    "characterAttributes": [
      "Courageous",
      "Decisive",
      "Empathetic",
      "Resilient",
      "Clear-headed",
      "Tactical"
    ],
    "characterImage": "/characters/DIDP.png",
    "description": "Intuitive team needs assessment specialist with rapid organizational adaptation and direct leadership under pressure",
    "motto": "Steady hand under pressure.",
    "name": "⚔️ The Adaptive Commander",
    "punchline": "Command change with clarity.",
    "shortName": "DIDP",
    "strengths": [
      "Outstanding crisis leadership with strong intuitive decision-making",
      "Natural ability to assess and respond to team needs under pressure",
      "Strong direct communication that provides clarity during uncertainty",
      "Excellent at rapidly reorganizing teams to meet changing challenges"
    ],
    "tagline": "Lead Through the Storm",
    "traits": {
      "communicationStyle": "direct",
      "decisionProcess": "intuitive",
      "focusOrientation": "people-centered",
      "workStyle": "dynamic"
    }
  },
  {
    "_creationTime": 1755082648738.4358,
    "_id": "k172130jzpmf67qxf32z1mq3jx7njy3e",
    "careerPaths": [
      "Chief Design Officer",
      "Innovation Facilitator",
      "Creative Strategy Lead",
      "User Experience Director"
    ],
    "challenges": [
      "Innovation processes may lack urgency or clear success criteria",
      "Risk of endless collaboration without reaching concrete decisions",
      "May struggle with the discipline required for systematic execution",
      "Can become overwhelmed when stakeholders have conflicting creative visions"
    ],
    "characterAttributes": [
      "Creative",
      "Collaborative",
      "Empathetic",
      "Open-minded",
      "Flexible",
      "Visionary"
    ],
    "characterImage": "/characters/DIHV.png",
    "description": "Inclusive innovation process specialist with adaptive collaborative visioning and creative partnership facilitation",
    "motto": "Design together, deliver brilliance.",
    "name": "🎨 The Collaborative Innovator",
    "punchline": "Innovation thrives in unity.",
    "shortName": "DIHV",
    "strengths": [
      "Exceptional at facilitating inclusive innovation processes",
      "Strong ability to adapt innovation approaches based on team dynamics",
      "Natural talent for building consensus around creative solutions",
      "Outstanding at integrating diverse perspectives into cohesive visions"
    ],
    "tagline": "Creativity in Concert",
    "traits": {
      "communicationStyle": "harmonizing",
      "decisionProcess": "intuitive",
      "focusOrientation": "visionary",
      "workStyle": "dynamic"
    }
  },
  {
    "_creationTime": 1755082648738.436,
    "_id": "k179asyyya260zzw406awsrbfs7nk0yf",
    "careerPaths": [
      "Chief People Officer",
      "Transformation Coach",
      "Change Management Lead",
      "Executive Leadership Coach"
    ],
    "challenges": [
      "May move too slowly when rapid organizational changes are required",
      "Risk of avoiding difficult decisions to preserve relationships",
      "Can struggle with performance management during transformations",
      "May focus too heavily on emotional well-being at expense of business results"
    ],
    "characterAttributes": [
      "Empathetic",
      "Adaptable",
      "Supportive",
      "Perceptive",
      "Trustworthy",
      "Transformational"
    ],
    "characterImage": "/characters/DIHP.png",
    "description": "Intuitive change sensing specialist with adaptive people development and empathetic transformation leadership",
    "motto": "Lead with empathy, transform with purpose.",
    "name": "💝 The Empathetic Transformer",
    "punchline": "Change that cares.",
    "shortName": "DIHP",
    "strengths": [
      "Outstanding ability to sense and respond to individual and team emotional needs",
      "Strong collaborative approach to organizational change management",
      "Natural talent for creating inclusive environments during transformation",
      "Excellent at adapting change approaches based on human impact"
    ],
    "tagline": "Heart of Change",
    "traits": {
      "communicationStyle": "harmonizing",
      "decisionProcess": "intuitive",
      "focusOrientation": "people-centered",
      "workStyle": "dynamic"
    }
  }
]

async function main() {
  console.log('🌱 Seeding personality types with complete Convex data...')
  
  for (const personality of personalitiesData) {
    const data = {
      name: personality.name,
      shortName: personality.shortName,
      description: personality.description,
      motto: personality.motto || null,
      tagline: personality.tagline || null,
      punchline: personality.punchline || null,
      characterImage: personality.characterImage || null,
      characterAttributes: personality.characterAttributes || [],
      
      // Flatten traits object to individual fields
      workStyle: personality.traits?.workStyle || 'structured',
      decisionProcess: personality.traits?.decisionProcess || 'evidence-based',
      communicationStyle: personality.traits?.communicationStyle || null,
      focusOrientation: personality.traits?.focusOrientation || null,
      
      // Original Convex professional attributes  
      strengths: personality.strengths || [],
      challenges: personality.challenges || [],
      careerPaths: personality.careerPaths || [],
      
      // Default values for additional Prisma fields
      workStyleDetails: [],
      teamRole: [],
      idealEnvironment: [],
      scrumRoleSecondary: [],
    }
    
    await prisma.personalityType.upsert({
      where: { shortName: personality.shortName },
      update: data,
      create: data,
    })
    
    console.log(`✅ ${personality.shortName} - ${personality.name}`)
  }
  
  console.log(`🎉 Successfully seeded ${personalitiesData.length} personality types with all original attributes!`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
