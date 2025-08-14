import { PrismaClient } from '@prisma/client'
import { personalityTypes } from '../src/data/personality-types'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create the main quiz
  let quiz = await prisma.quiz.findFirst({
    where: { title: "The Agile Assessment" }
  })
  
  if (!quiz) {
    quiz = await prisma.quiz.create({
      data: {
        title: "The Agile Assessment",
        description: "Discover your ideal Scrum team role through comprehensive personality assessment",
        version: 1,
      },
    })
  }
  console.log('✅ Created quiz:', quiz.title)

  // Create quiz sections
  const sections = [
    {
      title: "Work Style Preferences",
      description: "How do you prefer to organize and approach your work?",
      leftTrait: "Dynamic & Adaptable",
      rightTrait: "Structured & Organized",
      displayOrder: 1,
      valueLine: "workStyle"
    },
    {
      title: "Decision Making Process",
      description: "How do you typically make decisions and process information?",
      leftTrait: "Intuitive & Experience-Based",
      rightTrait: "Evidence-Based & Analytical",
      displayOrder: 2,
      valueLine: "decisionProcess"
    },
    {
      title: "Communication Style",
      description: "How do you prefer to communicate and interact with others?",
      leftTrait: "Harmonizing & Diplomatic",
      rightTrait: "Direct & Straightforward",
      displayOrder: 3,
      valueLine: "communicationStyle"
    },
    {
      title: "Focus Orientation",
      description: "Where do you naturally direct your attention and energy?",
      leftTrait: "People-Centered & Supportive",
      rightTrait: "Visionary & Strategic",
      displayOrder: 4,
      valueLine: "focusOrientation"
    }
  ]

  const createdSections = []
  for (const sectionData of sections) {
    // Check if section already exists
    let section = await prisma.quizSection.findFirst({
      where: {
        quizId: quiz.id,
        title: sectionData.title
      }
    })
    
    if (!section) {
      section = await prisma.quizSection.create({
        data: {
          ...sectionData,
          quizId: quiz.id,
        },
      })
    }
    
    createdSections.push(section)
    console.log('✅ Created/found section:', section.title)
  }

  // Create sample questions for each section (8 questions per section)
  const sampleQuestions = [
    // Work Style section questions
    {
      sectionIndex: 0,
      questions: [
        "I prefer to plan my work activities in advance",
        "I work best when I have a clear schedule to follow",
        "I am comfortable adapting to sudden changes in priorities",
        "I like to maintain organized systems for my tasks",
        "I thrive in environments with flexible deadlines",
        "I prefer structured meetings with clear agendas",
        "I enjoy spontaneous brainstorming sessions",
        "I like to establish routines for recurring activities"
      ]
    },
    // Decision Process section questions
    {
      sectionIndex: 1,
      questions: [
        "I prefer to analyze data before making important decisions",
        "I trust my gut feelings when choosing between options",
        "I like to gather multiple perspectives before deciding",
        "I make quick decisions based on past experience",
        "I prefer to have concrete evidence to support my choices",
        "I rely on intuition when facing complex problems",
        "I like to research thoroughly before committing",
        "I make decisions based on how they feel rather than logic"
      ]
    },
    // Communication Style section questions
    {
      sectionIndex: 2,
      questions: [
        "I prefer to give direct feedback even if it might be uncomfortable",
        "I try to find diplomatic ways to express disagreement",
        "I value harmony in team discussions over being right",
        "I speak up immediately when I disagree with something",
        "I prefer to address conflicts head-on rather than avoid them",
        "I try to consider everyone's feelings when communicating",
        "I believe honest feedback is more important than tact",
        "I work to maintain positive relationships even during disagreements"
      ]
    },
    // Focus Orientation section questions
    {
      sectionIndex: 3,
      questions: [
        "I focus primarily on long-term strategic goals",
        "I pay close attention to team dynamics and relationships",
        "I prioritize future vision over current team needs",
        "I invest significant time in supporting team members",
        "I am energized by planning for the future",
        "I am motivated by helping others grow and develop",
        "I prefer discussing big picture concepts and possibilities",
        "I focus on creating a positive team environment"
      ]
    }
  ]

  // Create questions for each section
  for (let sectionIndex = 0; sectionIndex < sampleQuestions.length; sectionIndex++) {
    const sectionQuestions = sampleQuestions[sectionIndex]
    const section = createdSections[sectionIndex]
    
    for (let questionIndex = 0; questionIndex < sectionQuestions.questions.length; questionIndex++) {
      const questionText = sectionQuestions.questions[questionIndex]
      
      // Check if question already exists
      const existingQuestion = await prisma.question.findFirst({
        where: {
          sectionId: section.id,
          statement: questionText
        }
      })
      
      if (!existingQuestion) {
        const question = await prisma.question.create({
          data: {
            quizId: quiz.id,
            sectionId: section.id,
            statement: questionText,
            displayOrder: questionIndex + 1,
            isReversed: questionIndex % 2 === 1, // Alternate reverse scoring
            valueLine: section.valueLine,
          },
        })
        console.log(`✅ Created question ${questionIndex + 1} for ${section.title}`)
      } else {
        console.log(`⏭️ Skipped existing question ${questionIndex + 1} for ${section.title}`)
      }
    }
  }

  // Create all 16 personality types from the data file
  console.log(`📊 Creating ${personalityTypes.length} personality types...`)
  console.log('First few types:', personalityTypes.slice(0, 3).map(t => t.shortName))
  
  for (const typeData of personalityTypes) {
    // Convert the data structure to match Prisma schema
    const prismaTypeData = {
      name: typeData.name.replace(/^[^\s]*\s/, ''), // Remove emoji prefix for clean name
      shortName: typeData.shortName,
      description: typeData.description,
      workStyle: typeData.traits.workStyle,
      decisionProcess: typeData.traits.decisionProcess,
      communicationStyle: typeData.traits.communicationStyle,
      focusOrientation: typeData.traits.focusOrientation,
      strengths: typeData.strengths,
      challenges: typeData.challenges,
      careerPaths: typeData.careerPaths,
      characterImage: typeData.characterImage || `/characters/${typeData.shortName}.png`,
      characterAttributes: typeData.characterPersona ? [typeData.characterPersona] : [],
    }
    try {
      const personalityType = await prisma.personalityType.upsert({
        where: { shortName: prismaTypeData.shortName },
        update: prismaTypeData,
        create: prismaTypeData,
      })
      console.log('✅ Created/Updated personality type:', personalityType.name, personalityType.shortName)
    } catch (error) {
      console.error('❌ Failed to create personality type:', prismaTypeData.shortName, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })