#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the original Convex data
const personalitiesPath = path.join(__dirname, '..', 'personalities');
const personalitiesContent = fs.readFileSync(personalitiesPath, 'utf8');
// The file contains a JavaScript array with trailing comma/brace, clean it up
const cleanContent = personalitiesContent.replace(/,\s*}$/, '');
const personalitiesData = eval(`(${cleanContent})`);

// Analyze the structure to find all unique attributes
const allAttributes = new Set();
const samplePersonality = personalitiesData[0];

console.log('🔍 Analyzing personality data structure...');
console.log('Sample personality keys:', Object.keys(samplePersonality));

// Extract all possible attributes from the data
personalitiesData.forEach(personality => {
  Object.keys(personality).forEach(key => {
    if (!key.startsWith('_')) { // Skip Convex internal fields
      allAttributes.add(key);
    }
  });
});

console.log('📊 Found attributes:', Array.from(allAttributes).sort());

// Define the Prisma field mappings
const fieldMappings = {
  name: 'String',
  shortName: 'String        @unique',
  description: 'String',
  motto: 'String?',
  tagline: 'String?',
  punchline: 'String?',
  characterImage: 'String?',
  characterAttributes: 'String[]',
  careerPaths: 'String[]',
  strengths: 'String[]',
  challenges: 'String[]',
  // Trait fields will be handled separately
  workStyle: 'String        // structured, dynamic',
  decisionProcess: 'String        // evidence-based, intuitive',
  communicationStyle: 'String?       // direct, harmonizing',
  focusOrientation: 'String?       // visionary, people-centered',
  teamInteraction: 'String?       // collaborative, individual (legacy)',
  // Additional existing fields
  detailedDescription: 'String?',
  workStyleDetails: 'String[]',
  teamRole: 'String[]',
  idealEnvironment: 'String[]',
  scrumRolePrimary: 'String?',
  scrumRoleSecondary: 'String[]',
  scrumRoleFit: 'Float?',
  createdAt: 'DateTime      @default(now())',
  updatedAt: 'DateTime      @updatedAt'
};

// Read current Prisma schema
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const currentSchema = fs.readFileSync(schemaPath, 'utf8');

// Find the PersonalityType model and extract its current structure
const modelStart = currentSchema.indexOf('model PersonalityType {');
const modelEnd = currentSchema.indexOf('\n}', modelStart) + 2;

if (modelStart === -1) {
  console.error('❌ Could not find PersonalityType model in schema');
  process.exit(1);
}

console.log('🔧 Updating PersonalityType model...');

// Build the new PersonalityType model
const newModel = `// Personality types (16 personality types - 4 dimension system)
model PersonalityType {
  id                  String        @id @default(cuid())
  name                String
  shortName           String        @unique
  description         String
  motto               String?
  tagline             String?
  punchline           String?
  characterImage      String?
  characterAttributes String[]
  
  // Core traits from original Convex schema
  workStyle           String        // structured, dynamic
  decisionProcess     String        // evidence-based, intuitive
  communicationStyle  String?       // direct, harmonizing
  focusOrientation    String?       // visionary, people-centered
  teamInteraction     String?       // collaborative, individual (legacy)
  
  // Professional attributes
  strengths           String[]
  challenges          String[]
  careerPaths         String[]
  
  // Additional attributes (preserved from current schema)
  detailedDescription String?
  workStyleDetails    String[]
  teamRole            String[]
  idealEnvironment    String[]
  
  // Scrum role matching
  scrumRolePrimary    String?
  scrumRoleSecondary  String[]
  scrumRoleFit        Float?
  
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt
  
  // Relations
  results             QuizResult[]

  @@map("personality_types")
}`;

// Replace the PersonalityType model in the schema
const updatedSchema = currentSchema.substring(0, modelStart) + 
                     newModel + 
                     currentSchema.substring(modelEnd);

// Write the updated schema
fs.writeFileSync(schemaPath, updatedSchema);
console.log('✅ Updated Prisma schema');

// Now update the GraphQL schema
const graphqlSchemaPath = path.join(__dirname, '..', 'src', 'lib', 'graphql', 'schema.graphql');
const currentGraphqlSchema = fs.readFileSync(graphqlSchemaPath, 'utf8');

// Find the PersonalityType type definition
const typeStart = currentGraphqlSchema.indexOf('type PersonalityType {');
const typeEnd = currentGraphqlSchema.indexOf('\n}', typeStart) + 2;

if (typeStart === -1) {
  console.error('❌ Could not find PersonalityType type in GraphQL schema');
  process.exit(1);
}

console.log('🔧 Updating GraphQL PersonalityType type...');

const newGraphqlType = `type PersonalityType {
  id: ID!
  name: String!
  shortName: String!
  description: String!
  motto: String
  tagline: String
  punchline: String
  characterImage: String
  characterAttributes: [String!]!
  detailedDescription: String
  traits: PersonalityTraits!
  strengths: [String!]!
  challenges: [String!]!
  careerPaths: [String!]!
}`;

// Replace the PersonalityType type in the GraphQL schema
const updatedGraphqlSchema = currentGraphqlSchema.substring(0, typeStart) + 
                            newGraphqlType + 
                            currentGraphqlSchema.substring(typeEnd);

fs.writeFileSync(graphqlSchemaPath, updatedGraphqlSchema);
console.log('✅ Updated GraphQL schema');

// Create a new seed script that imports from the original Convex data
const seedScript = `import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Import original Convex data
const personalitiesData = ${JSON.stringify(personalitiesData, null, 2)}

async function main() {
  console.log('🌱 Seeding personality types from original Convex data...')
  
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
      
      // Map traits
      workStyle: personality.traits.workStyle,
      decisionProcess: personality.traits.decisionProcess,
      communicationStyle: personality.traits.communicationStyle || null,
      focusOrientation: personality.traits.focusOrientation || null,
      
      // Professional attributes
      strengths: personality.strengths || [],
      challenges: personality.challenges || [],
      careerPaths: personality.careerPaths || [],
      
      // Default values for additional fields
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
    
    console.log(\`✅ Upserted personality type: \${personality.shortName} - \${personality.name}\`)
  }
  
  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
`;

const newSeedPath = path.join(__dirname, '..', 'prisma', 'seed-personalities.ts');
fs.writeFileSync(newSeedPath, seedScript);
console.log('✅ Created new seed script with original Convex data');

console.log('\n🚀 Schema update completed! Next steps:');
console.log('1. Run: npx prisma db push');
console.log('2. Run: npx tsx prisma/seed-personalities.ts');
console.log('3. Restart your development server');