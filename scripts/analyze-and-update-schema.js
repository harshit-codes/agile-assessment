#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Analyzing personality types data structure...');

// Read the personalities file and clean it up to make it valid JSON
const personalitiesPath = path.join(__dirname, '..', 'personalities');
let personalitiesContent = fs.readFileSync(personalitiesPath, 'utf8');

// Clean up the JavaScript object format to make it valid JSON
personalitiesContent = personalitiesContent
  .replace(/,\s*}$/, ']') // Fix the trailing comma and brace
  .replace(/(\w+):/g, '"$1":') // Quote property names
  .replace(/'/g, '"'); // Convert single quotes to double quotes

let personalitiesData;
try {
  personalitiesData = JSON.parse(personalitiesContent);
} catch (error) {
  console.error('❌ Error parsing personalities data:', error.message);
  console.log('Attempting alternative parsing...');
  
  // Alternative approach: use eval with proper cleanup
  const originalContent = fs.readFileSync(personalitiesPath, 'utf8');
  const cleanContent = originalContent.replace(/,\s*}\s*$/, '');
  personalitiesData = eval(`(${cleanContent})`);
}

console.log(`📊 Found ${personalitiesData.length} personality types`);

// Analyze the structure
const allFields = new Set();
const fieldTypes = {};
const sampleValues = {};

personalitiesData.forEach((personality, index) => {
  Object.keys(personality).forEach(key => {
    if (!key.startsWith('_')) { // Skip Convex internal fields
      allFields.add(key);
      
      const value = personality[key];
      const type = Array.isArray(value) ? 'array' : typeof value;
      
      if (!fieldTypes[key]) {
        fieldTypes[key] = new Set();
        sampleValues[key] = value;
      }
      fieldTypes[key].add(type);
    }
  });
});

console.log('\\n📋 Field Analysis:');
const sortedFields = Array.from(allFields).sort();
sortedFields.forEach(field => {
  const types = Array.from(fieldTypes[field]);
  const sample = Array.isArray(sampleValues[field]) 
    ? `[${sampleValues[field].slice(0, 2).map(v => `"${v}"`).join(', ')}...]`
    : `"${String(sampleValues[field]).substring(0, 50)}..."`;
  
  console.log(`  ${field}: ${types.join(' | ')} - ${sample}`);
});

// Generate Prisma schema fields
console.log('\\n🔧 Generating Prisma schema...');

const prismaFields = {
  id: 'String        @id @default(cuid())',
  name: 'String',
  shortName: 'String        @unique',
  description: 'String',
  motto: 'String?',
  tagline: 'String?', 
  punchline: 'String?',
  characterImage: 'String?',
  characterAttributes: 'String[]',
  careerPaths: 'String[]',
  challenges: 'String[]',
  strengths: 'String[]',
  // Traits will be flattened
  workStyle: 'String        // structured, dynamic',
  decisionProcess: 'String        // evidence-based, intuitive', 
  communicationStyle: 'String?       // direct, harmonizing',
  focusOrientation: 'String?       // visionary, people-centered',
  // Existing fields to preserve
  detailedDescription: 'String?',
  teamInteraction: 'String?       // legacy field',
  workStyleDetails: 'String[]',
  teamRole: 'String[]',
  idealEnvironment: 'String[]',
  scrumRolePrimary: 'String?',
  scrumRoleSecondary: 'String[]',
  scrumRoleFit: 'Float?',
  createdAt: 'DateTime      @default(now())',
  updatedAt: 'DateTime      @updatedAt'
};

const personalityTypeModel = `// Personality types (16 personality types - 4 dimension system)
model PersonalityType {
${Object.entries(prismaFields).map(([field, type]) => `  ${field.padEnd(19)} ${type}`).join('\\n')}
  
  // Relations
  results             QuizResult[]

  @@map("personality_types")
}`;

console.log('\\n📄 Generated PersonalityType model:');
console.log(personalityTypeModel);

// Update Prisma schema
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const currentSchema = fs.readFileSync(schemaPath, 'utf8');

const modelStart = currentSchema.indexOf('model PersonalityType {');
const modelEnd = currentSchema.indexOf('\\n}', modelStart);
let nextModelStart = currentSchema.indexOf('\\nmodel ', modelEnd + 1);
if (nextModelStart === -1) {
  nextModelStart = currentSchema.length;
}

if (modelStart === -1) {
  console.error('❌ Could not find PersonalityType model in schema');
  process.exit(1);
}

const updatedSchema = currentSchema.substring(0, modelStart) + 
                     personalityTypeModel + '\\n\\n' +
                     currentSchema.substring(nextModelStart);

fs.writeFileSync(schemaPath, updatedSchema);
console.log('\\n✅ Updated Prisma schema');

// Update GraphQL schema
const graphqlSchemaPath = path.join(__dirname, '..', 'src', 'lib', 'graphql', 'schema.graphql');
const currentGraphqlSchema = fs.readFileSync(graphqlSchemaPath, 'utf8');

const typeStart = currentGraphqlSchema.indexOf('type PersonalityType {');
const typeEnd = currentGraphqlSchema.indexOf('\\n}', typeStart) + 2;

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

// Generate seed script
const seedScript = `import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Original Convex personality types data
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
      
      // Flatten traits object
      workStyle: personality.traits?.workStyle || 'structured',
      decisionProcess: personality.traits?.decisionProcess || 'evidence-based',
      communicationStyle: personality.traits?.communicationStyle || null,
      focusOrientation: personality.traits?.focusOrientation || null,
      
      // Professional attributes from original data
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
    
    console.log(\`✅ Upserted: \${personality.shortName} - \${personality.name}\`)
  }
  
  console.log(\`🎉 Successfully seeded \${personalitiesData.length} personality types!\`)
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

const seedPath = path.join(__dirname, '..', 'prisma', 'seed-convex-personalities.ts');
fs.writeFileSync(seedPath, seedScript);
console.log('✅ Created comprehensive seed script');

console.log('\\n🚀 Schema update completed! Next steps:');
console.log('1. Run: npx prisma db push');
console.log('2. Run: npx tsx prisma/seed-convex-personalities.ts');
console.log('3. Restart your development server');
console.log('\\n📊 Summary:');
console.log(`- Added ${Object.keys(prismaFields).length} fields to PersonalityType model`);
console.log(`- Updated GraphQL schema with new fields`);
console.log(`- Created seed script with ${personalitiesData.length} personality types`);