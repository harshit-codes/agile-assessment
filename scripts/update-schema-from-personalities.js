#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Analyzing personalities file structure...');

// Read the personalities file - it's a JavaScript array
const personalitiesPath = path.join(__dirname, '..', 'personalities');
let personalitiesContent = fs.readFileSync(personalitiesPath, 'utf8');

// Convert the JavaScript array to valid JSON by cleaning it up
personalitiesContent = personalitiesContent
  .replace(/,\s*}\s*$/, '') // Remove trailing comma and brace
  .replace(/(\w+):/g, '"$1":') // Quote all property names
  .replace(/'/g, '"') // Convert single quotes to double quotes
  .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas

let personalitiesData;
try {
  personalitiesData = JSON.parse(personalitiesContent);
  console.log(`✅ Successfully parsed ${personalitiesData.length} personality types`);
} catch (error) {
  console.error('❌ JSON parsing failed, trying alternative method...');
  
  // Fallback: manually clean up the JavaScript object format
  const originalContent = fs.readFileSync(personalitiesPath, 'utf8');
  // Remove the trailing comma and closing brace that breaks the array
  let cleanContent = originalContent.trim();
  if (cleanContent.endsWith(',\n}')) {
    cleanContent = cleanContent.slice(0, -3) + '\n]';
  } else if (cleanContent.endsWith('},')) {
    cleanContent = cleanContent.slice(0, -1);
  }
  
  // Use Function constructor for safer evaluation
  const func = new Function('return ' + cleanContent);
  personalitiesData = func();
  console.log(`✅ Successfully parsed ${personalitiesData.length} personality types using eval`);
}

// Analyze the data structure
const allFields = new Set();
const fieldTypes = {};
const fieldExamples = {};

personalitiesData.forEach((personality) => {
  Object.keys(personality).forEach(field => {
    if (!field.startsWith('_')) { // Skip Convex internal fields
      allFields.add(field);
      
      const value = personality[field];
      const type = Array.isArray(value) ? 'string[]' : typeof value === 'object' ? 'object' : typeof value;
      
      if (!fieldTypes[field]) {
        fieldTypes[field] = new Set();
        fieldExamples[field] = value;
      }
      fieldTypes[field].add(type);
    }
  });
});

console.log('\n📊 Field Analysis:');
const sortedFields = Array.from(allFields).sort();
sortedFields.forEach(field => {
  const types = Array.from(fieldTypes[field]);
  const example = fieldExamples[field];
  let exampleStr;
  
  if (Array.isArray(example)) {
    exampleStr = `[${example.slice(0, 2).map(v => `"${v}"`).join(', ')}${example.length > 2 ? '...' : ''}]`;
  } else if (typeof example === 'object') {
    exampleStr = `{${Object.keys(example).slice(0, 2).join(', ')}...}`;
  } else {
    exampleStr = `"${String(example).substring(0, 40)}${String(example).length > 40 ? '...' : ''}"`;
  }
  
  console.log(`  ${field.padEnd(20)}: ${types.join(' | ').padEnd(12)} - ${exampleStr}`);
});

// Create the updated Prisma model
const prismaModel = `// Personality types (16 personality types - 4 dimension system)
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
  
  // Trait combinations (flattened from traits object)
  workStyle           String        // structured, dynamic
  decisionProcess     String        // evidence-based, intuitive
  communicationStyle  String?       // direct, harmonizing
  focusOrientation    String?       // visionary, people-centered
  teamInteraction     String?       // legacy field
  
  // Professional attributes
  strengths           String[]
  challenges          String[]
  careerPaths         String[]
  
  // Additional fields (preserved from current schema)
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

// Update Prisma schema
console.log('\n🔧 Updating Prisma schema...');
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const currentSchema = fs.readFileSync(schemaPath, 'utf8');

const modelStart = currentSchema.indexOf('model PersonalityType {');
const modelEnd = currentSchema.indexOf('\n}', modelStart);
let nextModelStart = currentSchema.indexOf('\nmodel ', modelEnd + 1);
if (nextModelStart === -1) {
  nextModelStart = currentSchema.length;
}

if (modelStart === -1) {
  console.error('❌ Could not find PersonalityType model in schema');
  process.exit(1);
}

const updatedSchema = currentSchema.substring(0, modelStart) + 
                     prismaModel + '\n\n' +
                     currentSchema.substring(nextModelStart);

fs.writeFileSync(schemaPath, updatedSchema);
console.log('✅ Updated Prisma schema');

// Update GraphQL schema
console.log('🔧 Updating GraphQL schema...');
const graphqlSchemaPath = path.join(__dirname, '..', 'src', 'lib', 'graphql', 'schema.graphql');
const currentGraphqlSchema = fs.readFileSync(graphqlSchemaPath, 'utf8');

const typeStart = currentGraphqlSchema.indexOf('type PersonalityType {');
const typeEnd = currentGraphqlSchema.indexOf('\n}', typeStart) + 2;

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

const updatedGraphqlSchema = currentGraphqlSchema.substring(0, typeStart) + 
                            newGraphqlType + 
                            currentGraphqlSchema.substring(typeEnd);

fs.writeFileSync(graphqlSchemaPath, updatedGraphqlSchema);
console.log('✅ Updated GraphQL schema');

// Create comprehensive seed script
console.log('🌱 Creating seed script...');
const seedScript = `import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Original Convex personality types data with all attributes
const personalitiesData = ${JSON.stringify(personalitiesData, null, 2)}

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
    
    console.log(\`✅ \${personality.shortName} - \${personality.name}\`)
  }
  
  console.log(\`🎉 Successfully seeded \${personalitiesData.length} personality types with all original attributes!\`)
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

const seedPath = path.join(__dirname, '..', 'prisma', 'seed-complete-personalities.ts');
fs.writeFileSync(seedPath, seedScript);
console.log('✅ Created comprehensive seed script');

console.log('\n🚀 Schema update completed successfully!');
console.log('\n📋 Summary:');
console.log(`- Analyzed ${sortedFields.length} fields from ${personalitiesData.length} personality types`);
console.log('- Updated Prisma schema with all original Convex attributes');
console.log('- Updated GraphQL schema to match');
console.log('- Created seed script with complete original data');

console.log('\n⚡ Next steps:');
console.log('1. npx prisma db push');
console.log('2. npx tsx prisma/seed-complete-personalities.ts');
console.log('3. Restart development server');

// Show the key attributes that are now preserved
console.log('\n🔑 Key attributes preserved from original Convex data:');
console.log('- motto, tagline, punchline (branding)');
console.log('- characterAttributes (professional traits)'); 
console.log('- Complete strengths, challenges, careerPaths');
console.log('- All 4-trait combinations (workStyle, decisionProcess, communicationStyle, focusOrientation)');