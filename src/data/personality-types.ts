// 16 Agile Personality Types - Extracted from Convex seed data
// Based on 4 behavioral dimensions: Work Style, Decision Process, Communication Style, Focus Orientation

export interface PersonalityTraits {
  workStyle: 'structured' | 'dynamic';
  decisionProcess: 'evidence-based' | 'intuitive';
  communicationStyle: 'direct' | 'harmonizing';
  focusOrientation: 'visionary' | 'people-centered';
}

export interface PersonalityType {
  name: string;
  shortName: string;
  description: string;
  traits: PersonalityTraits;
  careerPaths: string[];
  strengths: string[];
  challenges: string[];
  gradient?: string;
  borderColor?: string;
  // Enhanced character data
  characterImage?: string;
  characterPersona?: string;
  characterTools?: string;
  characterExpression?: string;
  characterAttire?: string;
  characterAccessories?: string;
  characterEnergy?: string;
  minecraftBackground?: string;
  // Detailed traits from research
  detailedStrengths?: string[];
  detailedWeaknesses?: string[];
  careerTips?: string[];
}

export const personalityTypes: PersonalityType[] = [
  // Structured + Evidence-Based Types
  {
    name: "🏗️ The Systems Architect",
    shortName: "SEDV",
    description: "Strategic roadmapping specialist who builds data-informed product decisions with clear vision articulation",
    traits: {
      workStyle: "structured",
      decisionProcess: "evidence-based", 
      communicationStyle: "direct",
      focusOrientation: "visionary"
    },
    careerPaths: ["Lead Product Owner", "Solution Architect", "Strategic Product Manager"],
    strengths: ["Strategic thinking and execution", "Data-driven decision making", "Clear communication", "Vision articulation"],
    challenges: ["Balancing multiple priorities", "Adapting to rapid changes", "Stakeholder management", "Technical complexity"],
    gradient: "linear-gradient(145deg, #50C878, #000)",
    borderColor: "#50C878",
    characterImage: "/characters/SEDV.png",
    characterPersona: "Master builder with enchanted blueprint blocks and redstone compass, calculating blocky gaze",
    characterTools: "Diamond-enchanted compass with glowing redstone blueprints and building schematics",
    characterExpression: "Focused cubic eyes with confident Steve-like determination",
    characterAttire: "Engineer's leather armor with redstone circuitry, tool belt with pistons and repeaters",
    characterAccessories: "Enchanted hard hat, redstone dust particles, floating blueprint holograms",
    characterEnergy: "Systematic visionary who builds the future with redstone precision",
    minecraftBackground: "Floating redstone circuit patterns with blueprint blocks and command blocks",
    detailedStrengths: [
      "Exceptional at creating comprehensive product roadmaps with clear metrics",
      "Strong analytical skills for market research and competitive analysis",
      "Natural ability to communicate complex strategic concepts clearly",
      "Builds stakeholder confidence through data-backed decisions"
    ],
    detailedWeaknesses: [
      "May over-analyze situations leading to delayed decisions",
      "Can become rigid when market conditions require rapid pivots",
      "Risk of focusing too heavily on metrics at expense of team morale",
      "May struggle with ambiguous requirements or incomplete data"
    ],
    careerTips: [
      "Develop Agile mindset: Practice making decisions with 70% of needed information",
      "Build coaching skills: Complement analytical strength with people development abilities",
      "Pursue Product Leadership: Progress from Product Owner to Chief Product Officer",
      "Cross-functional experience: Gain exposure to engineering and design teams"
    ]
  },
  {
    name: "⚙️ The Process Guardian", 
    shortName: "SEDP",
    description: "Team performance optimizer who uses metrics-driven coaching and systematic capability development",
    traits: {
      workStyle: "structured",
      decisionProcess: "evidence-based",
      communicationStyle: "direct", 
      focusOrientation: "people-centered"
    },
    careerPaths: ["Senior Scrum Master", "Engineering Manager", "Team Development Coach"],
    strengths: ["Process optimization", "Team development", "Performance metrics", "Systematic coaching"],
    challenges: ["Individual coaching needs", "Process flexibility", "Team resistance", "Cultural adaptation"],
    gradient: "linear-gradient(210deg, #50C878, #000)",
    borderColor: "#50C878",
    characterImage: "/characters/SEDP.png",
    characterPersona: "Noble guardian with enchanted shield and book of rules, protective blocky stance",
    characterTools: "Enchanted shield with Protection IV and written book filled with team protocols",
    characterExpression: "Determined cubic gaze with protective furrowed block-brow",
    characterAttire: "Iron armor with golden trim, ceremonial banner cape, shoulder guard blocks",
    characterAccessories: "Floating shield icons, glowing rule book, protective ward particles",
    characterEnergy: "Systematic protector who guards team processes with unbreakable resolve",
    minecraftBackground: "Emerald-green fortress walls with shield patterns and protective barriers",
    detailedStrengths: [
      "Excellent at implementing systematic team development programs",
      "Strong facilitation skills for retrospectives and process improvement",
      "Data-driven approach to measuring and improving team performance",
      "Natural mentor who helps team members grow methodically"
    ],
    detailedWeaknesses: [
      "May focus too heavily on process compliance over outcomes",
      "Risk of micromanaging team members' development",
      "Can struggle when teams need emotional support over systematic solutions",
      "May resist innovative approaches that don't fit established frameworks"
    ],
    careerTips: [
      "Advance to Senior Scrum Master: Lead multiple teams and coach junior Scrum Masters",
      "Develop Agile Coaching skills: Move beyond process to organizational transformation",
      "Gain technical knowledge: Better understand development challenges",
      "Build network: Connect with Agile communities for continuous learning"
    ]
  },
  {
    name: "🤝 The Strategic Diplomat",
    shortName: "SEHV",
    description: "Multi-stakeholder alignment specialist with evidence-based consensus building and strategic partnership management",
    traits: {
      workStyle: "structured",
      decisionProcess: "evidence-based",
      communicationStyle: "harmonizing",
      focusOrientation: "visionary"
    },
    careerPaths: ["Product Strategy Lead", "Business Analyst", "Strategic Partnership Manager"],
    strengths: ["Stakeholder alignment", "Consensus building", "Strategic partnerships", "Evidence presentation"],
    challenges: ["Managing conflicting interests", "Diplomatic negotiations", "Complex decision processes", "Timeline pressures"],
    gradient: "linear-gradient(165deg, #FFD700, #000)",
    borderColor: "#FFD700",
    characterImage: "/characters/SEHV.png",
    characterPersona: "Royal ambassador with enchanted quill and treaty maps, commanding blocky presence",
    characterTools: "Feather with Unbreaking enchantment, ink sac, and golden seal stamp blocks",
    characterExpression: "Thoughtful diplomatic block-smile with calculating, intelligent cubic eyes",
    characterAttire: "Rich purple robes with gold block embroidery, chain mail of office, crown fragments",
    characterAccessories: "Floating scroll particles, diplomatic immunity totem, alliance flag banners",
    characterEnergy: "Systematic diplomat who builds strategic alliances through proven methods",
    minecraftBackground: "Golden palace walls with floating heraldic banners and diplomatic symbols",
    detailedStrengths: [
      "Exceptional at building consensus among diverse stakeholder groups",
      "Strong relationship management and diplomatic communication",
      "Ability to translate technical concepts into business language",
      "Creates alignment between competing priorities through collaboration"
    ],
    detailedWeaknesses: [
      "Decision-making may be slower due to extensive consensus-building",
      "Risk of avoiding difficult conversations to maintain harmony",
      "May struggle with urgent decisions requiring direct action",
      "Can become overwhelmed by conflicting stakeholder demands"
    ],
    careerTips: [
      "Progress to Product Strategy roles: Lead product portfolio management",
      "Develop negotiation skills: Balance relationship-building with firm decision-making",
      "Gain business acumen: Understand financial metrics and market dynamics",
      "Build executive presence: Practice communicating with C-level stakeholders"
    ]
  },
  {
    name: "🌱 The Team Organizer",
    shortName: "SEHP", 
    description: "Data-supported team development specialist with diplomatic conflict resolution and structured mentoring programs",
    traits: {
      workStyle: "structured",
      decisionProcess: "evidence-based",
      communicationStyle: "harmonizing",
      focusOrientation: "people-centered"
    },
    careerPaths: ["Team Development Coach", "HR Business Partner", "Learning & Development Manager"],
    strengths: ["Team development", "Conflict resolution", "Mentoring programs", "Data-driven coaching"],
    challenges: ["Individual needs assessment", "Resistance to change", "Measuring soft skills", "Scaling personal touch"],
    gradient: "linear-gradient(195deg, #6495ED, #000)",
    borderColor: "#6495ED",
    characterImage: "/characters/SEHP.png",
    characterPersona: "Wise coordinator with enchanted staff and team banners, nurturing blocky authority",
    characterTools: "Staff with multiple colored banner attachments and enchanted team roster book",
    characterExpression: "Warm, inclusive block-smile with attentive, caring cubic eyes",
    characterAttire: "Practical robes with colorful team badge blocks, coordination belt with organizing tools",
    characterAccessories: "Floating team hearts, coordination compass, unity beacon effects",
    characterEnergy: "Systematic nurturer who organizes teams through structured Minecraft community building",
    minecraftBackground: "Golden beacon light with interlocking team flags and collaboration symbols",
    detailedStrengths: [
      "Outstanding at creating psychologically safe learning environments",
      "Data-informed approach to individual development planning",
      "Strong empathy combined with systematic development methods",
      "Excellent at facilitating difficult team conversations diplomatically"
    ],
    detailedWeaknesses: [
      "May avoid giving direct feedback to preserve relationships",
      "Risk of over-investing in team members who aren't committed to growth",
      "Can struggle with performance management decisions",
      "May move too slowly when rapid team changes are needed"
    ],
    careerTips: [
      "Advance to Agile Transformation roles: Lead organizational change initiatives",
      "Develop business skills: Understand how team development impacts business outcomes",
      "Pursue coaching certifications: Formalize coaching and mentoring expertise",
      "Build change management expertise: Learn to navigate organizational resistance"
    ]
  },
  // Structured + Intuitive Types
  {
    name: "⚡ The Knowledge Keeper",
    shortName: "SIDV",
    description: "Rapid technical decision-maker with architectural vision and solution strategy leadership",
    traits: {
      workStyle: "structured",
      decisionProcess: "intuitive", 
      communicationStyle: "direct",
      focusOrientation: "visionary"
    },
    careerPaths: ["Solution Architect", "Technical Lead", "CTO"],
    strengths: ["Technical architecture", "Rapid decision making", "Strategic vision", "Innovation leadership"],
    challenges: ["Explaining intuitive decisions", "Technical debt management", "Team alignment", "Documentation"],
    gradient: "linear-gradient(225deg, #6495ED, #000)",
    borderColor: "#6495ED",
    characterImage: "/characters/SIDV.png",
    characterPersona: "Ancient scholar-warrior with enchanted books and crystal orbs, sage blocky presence",
    characterTools: "Glowing enchanted book with floating ender pearls and knowledge bottles",
    characterExpression: "Deep, penetrating cubic gaze with raised block-eyebrow of knowing wisdom",
    characterAttire: "Scholar's robes with enchantment glints, leather armor accents, wisdom pendant",
    characterAccessories: "Floating XP orbs, levitating books, End crystal fragments, wisdom bottle collection",
    characterEnergy: "Systematic mystic who structures knowledge through experienced Minecraft enchantment",
    minecraftBackground: "Deep blue End portal shimmer with floating enchanted books and experience orbs"
  },
  {
    name: "🎯 The Guardian Mentor",
    shortName: "SIDP",
    description: "Intuitive performance coach with direct feedback delivery and systematic team building",
    traits: {
      workStyle: "structured",
      decisionProcess: "intuitive",
      communicationStyle: "direct",
      focusOrientation: "people-centered"
    },
    careerPaths: ["Engineering Manager", "Team Lead", "Performance Coach"],
    strengths: ["Performance optimization", "Direct feedback", "Intuitive coaching", "Team building"],
    challenges: ["Sensitive feedback delivery", "Individual motivation", "Performance measurement", "Coaching scale"],
    gradient: "linear-gradient(135deg, #50C878, #000)",
    borderColor: "#50C878",
    characterImage: "/characters/SIDP.png",
    characterPersona: "Protective teacher-knight with training sword and mentorship tools, guiding blocky strength",
    characterTools: "Iron sword with Teaching enchantment and written mentorship guide book",
    characterExpression: "Stern but caring cubic expression with protective, watchful block-eyes",
    characterAttire: "Knight's tunic with mentor badge, chainmail armor, teaching tool belt with books",
    characterAccessories: "Floating training dummies, protective aura particles, wisdom scrolls, teaching torch",
    characterEnergy: "Systematic protector who guides others through structured Minecraft wisdom",
    minecraftBackground: "Emerald training ground with target blocks and protective barrier effects"
  },
  {
    name: "🚀 The Cultural Weaver",
    shortName: "SIHV", 
    description: "Collaborative innovation process leader with stakeholder-aligned experimentation and structured creativity",
    traits: {
      workStyle: "structured",
      decisionProcess: "intuitive",
      communicationStyle: "harmonizing",
      focusOrientation: "visionary"
    },
    careerPaths: ["Product Innovation Lead", "Design Strategy Lead", "Innovation Manager"],
    strengths: ["Innovation processes", "Creative collaboration", "Strategic experimentation", "Stakeholder alignment"],
    challenges: ["Balancing structure with creativity", "Innovation measurement", "Risk management", "Resource allocation"],
    gradient: "linear-gradient(155deg, #FFD700, #000)",
    borderColor: "#FFD700",
    characterImage: "/characters/SIHV.png",
    characterPersona: "Artistic bard-noble with cultural banners and harmony jukebox, creative blocky vision",
    characterTools: "Enchanted note block harp with cultural banner collection and painted maps",
    characterExpression: "Inspired, dreamy block-smile with visionary, creative cubic eyes",
    characterAttire: "Artistic robes with cultural wool embroidery, creative accessories, harmony music disc",
    characterAccessories: "Floating musical notes, cultural artifact frames, artistic palette blocks, harmony crystals",
    characterEnergy: "Systematic artist who weaves culture through structured Minecraft creativity",
    minecraftBackground: "Warm terracotta temple with musical note blocks and artistic wool patterns"
  },
  {
    name: "💫 The Team Harmonizer",
    shortName: "SIHP",
    description: "Intuitive culture sensing specialist with structured harmony initiatives and collaborative team dynamics",
    traits: {
      workStyle: "structured",
      decisionProcess: "intuitive",
      communicationStyle: "harmonizing", 
      focusOrientation: "people-centered"
    },
    careerPaths: ["Agile Transformation Coach", "Culture Lead", "Organizational Development"],
    strengths: ["Culture development", "Team harmony", "Organizational sensing", "Change facilitation"],
    challenges: ["Culture measurement", "Scaling personal connections", "Resistance to change", "Leadership alignment"],
    gradient: "linear-gradient(175deg, #6495ED, #000)",
    borderColor: "#6495ED",
    characterImage: "/characters/SIHP.png",
    characterPersona: "Peaceful facilitator with unity staff and harmony crystals, balancing blocky presence",
    characterTools: "Staff topped with balanced scales made of gold blocks and harmony bell block",
    characterExpression: "Serene, understanding block-smile with gentle, empathetic cubic eyes",
    characterAttire: "Flowing robes with harmony wool patterns, peace medallion, unity banner sash",
    characterAccessories: "Floating heart particles, harmony crystals, peace dove entities, unity totem effects",
    characterEnergy: "Systematic peacekeeper who creates harmony through structured Minecraft empathy",
    minecraftBackground: "Soft golden beacon glow with interlocking heart particles and harmony waves"
  },
  // Dynamic + Evidence-Based Types  
  {
    name: "🔥 The Rapid Analyzer",
    shortName: "DEDV",
    description: "Rapid market pivoting specialist with data-driven experimentation and aggressive opportunity pursuit",
    traits: {
      workStyle: "dynamic",
      decisionProcess: "evidence-based",
      communicationStyle: "direct",
      focusOrientation: "visionary"
    },
    careerPaths: ["Startup Product Owner", "Growth Product Manager", "Market Research Lead"],
    strengths: ["Market analysis", "Rapid pivoting", "Data experimentation", "Opportunity recognition"],
    challenges: ["Sustainable growth", "Team stability", "Process consistency", "Long-term planning"],
    gradient: "linear-gradient(145deg, #6495ED, #000)",
    borderColor: "#6495ED",
    characterImage: "/characters/DEDV.png",
    characterPersona: "Quick-thinking scout with spyglass and data maps, analytical blocky precision",
    characterTools: "Enchanted spyglass with Farsight and rolled map collection with redstone calculators",
    characterExpression: "Alert, sharp cubic focus with confident, decisive block-smirk",
    characterAttire: "Practical scout leather with data chest pouches, quick-access tool belt, analysis compass",
    characterAccessories: "Floating radar particles, data stream effects, calculation redstone dust, scout maps",
    characterEnergy: "Adaptive strategist who pivots quickly based on real-time Minecraft data analysis",
    minecraftBackground: "Blue radar-like redstone patterns with floating data visualization blocks"
  },
  {
    name: "🏃 The Agile Coach",
    shortName: "DEDP",
    description: "Real-time performance tuner with metrics-based team acceleration and delivery optimization",
    traits: {
      workStyle: "dynamic",
      decisionProcess: "evidence-based",
      communicationStyle: "direct",
      focusOrientation: "people-centered"
    },
    careerPaths: ["Delivery Excellence Coach", "Agile Coach", "DevOps Lead"],
    strengths: ["Delivery acceleration", "Performance metrics", "Team optimization", "Process improvement"],
    challenges: ["Burnout prevention", "Sustainable pace", "Quality vs speed", "Team well-being"],
    gradient: "linear-gradient(125deg, #50C878, #000)",
    borderColor: "#50C878",
    characterImage: "/characters/DEDP.png",
    characterPersona: "Dynamic trainer with motivation horn and performance maps, coaching blocky energy",
    characterTools: "Enchanted goat horn and written book clipboard with team performance tracking",
    characterExpression: "Energetic, motivating block-smile with encouraging, focused cubic eyes",
    characterAttire: "Athletic leather vest with team advancement badges, practical training gear, clock item",
    characterAccessories: "Floating speed boost particles, achievement popup effects, training whistle, performance charts",
    characterEnergy: "Adaptive motivator who coaches teams through data-driven Minecraft flexibility",
    minecraftBackground: "Emerald movement trails with achievement advancement icons and speed particles"
  },
  {
    name: "🌊 The Innovation Catalyst", 
    shortName: "DEHV",
    description: "Market-responsive strategy specialist with stakeholder-aligned pivots and evidence-based diplomacy",
    traits: {
      workStyle: "dynamic",
      decisionProcess: "evidence-based",
      communicationStyle: "harmonizing",
      focusOrientation: "visionary"
    },
    careerPaths: ["Business Development Lead", "Strategic Consultant", "Market Strategy Lead"],
    strengths: ["Adaptive strategy", "Market responsiveness", "Stakeholder diplomacy", "Evidence-based pivots"],
    challenges: ["Strategy consistency", "Stakeholder alignment", "Change communication", "Resource reallocation"],
    gradient: "linear-gradient(185deg, #FFD700, #000)",
    borderColor: "#FFD700",
    characterImage: "/characters/DEHV.png",
    characterPersona: "Inventive alchemist with brewing potions and innovation redstone, creative blocky spark",
    characterTools: "Multi-colored brewing potions and experimental redstone contraptions with schematics",
    characterExpression: "Excited, curious block-grin with bright, innovative cubic eyes",
    characterAttire: "Inventor's leather apron over colorful robes, tool bandolier, innovation spectacles",
    characterAccessories: "Floating potion bubbles, redstone spark effects, invention blueprints, gear particles",
    characterEnergy: "Adaptive creator who innovates through collaborative Minecraft experimentation",
    minecraftBackground: "Warm terracotta lab with floating gear mechanisms and invention blueprint blocks"
  },
  {
    name: "📊 The Team Optimizer",
    shortName: "DEHP",
    description: "Team intelligence optimization specialist with collaborative metrics implementation and adaptive team support",
    traits: {
      workStyle: "dynamic",
      decisionProcess: "evidence-based",
      communicationStyle: "harmonizing",
      focusOrientation: "people-centered"
    },
    careerPaths: ["Analytics-Driven Team Coach", "Data-Driven HR Lead", "People Analytics Manager"], 
    strengths: ["Team intelligence", "Collaborative analytics", "Adaptive support", "Performance insights"],
    challenges: ["Data interpretation", "Privacy concerns", "Metric gaming", "Human-centric analytics"],
    gradient: "linear-gradient(205deg, #6495ED, #000)",
    borderColor: "#6495ED",
    characterImage: "/characters/DEHP.png",
    characterPersona: "Supportive coordinator with efficiency redstone and optimization maps, caring blocky guidance",
    characterTools: "Multi-functional redstone coordination device and team optimization written book",
    characterExpression: "Supportive, encouraging block-smile with analytical, caring cubic eyes",
    characterAttire: "Practical coordinator robes with efficiency advancement badges, team-colored wool accessories",
    characterAccessories: "Floating efficiency particles, optimization charts, supportive aura effects, team coordination compass",
    characterEnergy: "Adaptive nurturer who optimizes teams through flexible Minecraft support systems",
    minecraftBackground: "Soft golden efficiency streams with performance graphs and supportive hand particles"
  },
  // Dynamic + Intuitive Types
  {
    name: "💥 The Creative Pioneer",
    shortName: "DIDV",
    description: "Disruptive opportunity recognition specialist with rapid strategic pivots and bold vision communication",
    traits: {
      workStyle: "dynamic",
      decisionProcess: "intuitive",
      communicationStyle: "direct", 
      focusOrientation: "visionary"
    },
    careerPaths: ["Innovation Executive", "Startup CEO", "Venture Capitalist"],
    strengths: ["Breakthrough innovation", "Opportunity recognition", "Bold leadership", "Strategic pivoting"],
    challenges: ["Execution consistency", "Team alignment", "Resource management", "Risk mitigation"],
    gradient: "linear-gradient(225deg, #6495ED, #000)",
    borderColor: "#6495ED",
    characterImage: "/characters/DIDV.png",
    characterPersona: "Bold explorer-artist with enchanted compass and creative blocks, pioneering blocky spirit",
    characterTools: "Enchanted recovery compass and artistic brush with dye palette blocks",
    characterExpression: "Adventurous, confident block-grin with visionary, determined cubic eyes",
    characterAttire: "Explorer's leather coat with artistic wool patches, adventure gear, creative tool belt",
    characterAccessories: "Floating compass particles, creative spark effects, artistic dye clouds, pioneer trail markers",
    characterEnergy: "Adaptive pioneer who blazes trails through creative Minecraft intuition",
    minecraftBackground: "Blue adventure shimmer with compass roses and creative spark block patterns"
  },
  {
    name: "⚔️ The Nurturing Guide",
    shortName: "DIDP",
    description: "Intuitive team needs assessment specialist with rapid organizational adaptation and direct leadership under pressure",
    traits: {
      workStyle: "dynamic",
      decisionProcess: "intuitive",
      communicationStyle: "direct",
      focusOrientation: "people-centered"
    },
    careerPaths: ["Crisis Response Lead", "Emergency Manager", "Rapid Response Team Lead"],
    strengths: ["Crisis leadership", "Rapid adaptation", "Team needs assessment", "Pressure performance"],
    challenges: ["Sustainable leadership", "Team burnout prevention", "Decision documentation", "Long-term planning"],
    gradient: "linear-gradient(165deg, #50C878, #000)",
    borderColor: "#50C878",
    characterImage: "/characters/DIDP.png",
    characterPersona: "Caring healer-shepherd with regeneration staff and protective totems, guiding blocky wisdom",
    characterTools: "Staff with regeneration crystals and protective totem of undying bundle",
    characterExpression: "Kind, protective block-smile with warm, nurturing cubic eyes",
    characterAttire: "Healer's robes with protective charm accessories, caring medallion, guide compass",
    characterAccessories: "Floating healing hearts, protective ward particles, regeneration effects, guidance beacon",
    characterEnergy: "Adaptive caregiver who guides others through intuitive Minecraft protection",
    minecraftBackground: "Emerald healing glow with healing symbols and protective embrace particle effects"
  },
  {
    name: "🎨 The Harmony Weaver",
    shortName: "DIHV",
    description: "Inclusive innovation process specialist with adaptive collaborative visioning and creative partnership facilitation",
    traits: {
      workStyle: "dynamic",
      decisionProcess: "intuitive",
      communicationStyle: "harmonizing",
      focusOrientation: "visionary"
    },
    careerPaths: ["Design Strategy Lead", "Creative Director", "Innovation Facilitator"],
    strengths: ["Collaborative innovation", "Creative visioning", "Inclusive processes", "Partnership facilitation"],
    challenges: ["Innovation focus", "Creative constraints", "Stakeholder alignment", "Delivery timelines"],
    gradient: "linear-gradient(145deg, #FFD700, #000)",
    borderColor: "#FFD700",
    characterImage: "/characters/DIHV.png",
    characterPersona: "Mystical performer-diplomat with harmony note blocks and unity banners, artistic blocky vision",
    characterTools: "Multi-note block harmony setup and ceremonial peace banner with music discs",
    characterExpression: "Peaceful, inspiring block-smile with dreamy, artistic cubic eyes",
    characterAttire: "Flowing artistic robes with harmony wool patterns, cultural accessories, peace music disc",
    characterAccessories: "Floating musical notes, harmony crystal effects, unity banner particles, artistic aura",
    characterEnergy: "Adaptive artist who creates unity through intuitive Minecraft harmony",
    minecraftBackground: "Warm terracotta radiance with musical harmony waves and unity symbol blocks"
  },
  {
    name: "💝 The Community Builder",
    shortName: "DIHP", 
    description: "Intuitive change sensing specialist with adaptive people development and empathetic transformation leadership",
    traits: {
      workStyle: "dynamic",
      decisionProcess: "intuitive",
      communicationStyle: "harmonizing",
      focusOrientation: "people-centered"
    },
    careerPaths: ["Organizational Change Agent", "People Development Lead", "Transformation Coach"],
    strengths: ["Empathetic leadership", "Change sensing", "People development", "Transformation facilitation"],
    challenges: ["Change pace management", "Resistance handling", "Emotional boundaries", "Transformation measurement"],
    gradient: "linear-gradient(185deg, #6495ED, #000)",
    borderColor: "#6495ED",
    characterImage: "/characters/DIHP.png",
    characterPersona: "Compassionate facilitator with community beacon and gathering blocks, inclusive blocky spirit",
    characterTools: "Community beacon torch and gathering campfire blocks with unity banner collection",
    characterExpression: "Warm, welcoming block-smile with inclusive, compassionate cubic eyes",
    characterAttire: "Community robes with inclusive wool symbols, gathering accessories, unity banner sash",
    characterAccessories: "Floating community hearts, beacon effects, inclusive aura particles, gathering circle blocks",
    characterEnergy: "Adaptive community builder who unites people through intuitive Minecraft inclusivity",
    minecraftBackground: "Soft golden beacon glow with community circles and inclusive embrace particle effects"
  }
];

// Helper functions for working with personality types
export const getPersonalityByCode = (code: string): PersonalityType | undefined => {
  return personalityTypes.find(type => type.shortName === code);
};

export const getPersonalityByTraits = (traits: PersonalityTraits): PersonalityType | undefined => {
  return personalityTypes.find(type => 
    type.traits.workStyle === traits.workStyle &&
    type.traits.decisionProcess === traits.decisionProcess &&
    type.traits.communicationStyle === traits.communicationStyle &&
    type.traits.focusOrientation === traits.focusOrientation
  );
};

export const getPersonalitiesByDimension = (dimension: keyof PersonalityTraits, value: string): PersonalityType[] => {
  return personalityTypes.filter(type => type.traits[dimension] === value);
};

// Get random personality for demo purposes
export const getRandomPersonality = (): PersonalityType => {
  return personalityTypes[Math.floor(Math.random() * personalityTypes.length)];
};