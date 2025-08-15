/**
 * Script to test GraphQL locally to isolate database vs server issues
 * Run with: node scripts/test-graphql-locally.js
 */

import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

async function testGraphQLLocally() {
  let prisma
  
  try {
    console.log('🔍 Testing database connection...')
    
    // Create Prisma client (same as production)
    prisma = new PrismaClient({
      log: ['query', 'error'],
    }).$extends(withAccelerate())
    
    console.log('✅ Prisma client created')
    
    // Test basic database connection
    const userCount = await prisma.userProfile.count()
    console.log(`✅ Database connected - ${userCount} user profiles found`)
    
    // Test the exact query from sharing resolver
    console.log('\n🎯 Testing sharing resolver query...')
    const targetSlug = 'user-31h1lpjfwci1xcr'
    
    // Step 1: Find user profile
    let userProfile = await prisma.userProfile.findUnique({
      where: { slug: targetSlug }
    })
    
    if (!userProfile && targetSlug.startsWith('user-')) {
      console.log('🔄 Trying partial slug match...')
      userProfile = await prisma.userProfile.findFirst({
        where: {
          slug: {
            startsWith: targetSlug
          }
        }
      })
    }
    
    if (!userProfile) {
      console.log('❌ No user profile found')
      return
    }
    
    console.log(`✅ Found user profile: ${userProfile.slug}`)
    console.log(`   - Display Name: ${userProfile.displayName || 'None'}`)
    console.log(`   - Email: ${userProfile.email || 'None'}`)
    
    // Step 2: Find quiz result (exact same query as resolver)
    console.log('\n🎯 Testing quiz result query...')
    const result = await prisma.quizResult.findFirst({
      where: {
        userProfileId: userProfile.id,
        OR: [
          { isPublic: true },
          { hasPasscode: true }
        ]
      },
      include: {
        personalityType: true
      },
      orderBy: { calculatedAt: 'desc' }
    })
    
    if (!result) {
      console.log('❌ No quiz result found')
      return
    }
    
    console.log(`✅ Found quiz result: ${result.id}`)
    console.log(`   - Personality Code: ${result.personalityCode}`)
    console.log(`   - Personality Type: ${result.personalityType?.name || 'None'}`)
    console.log(`   - Is Public: ${result.isPublic}`)
    console.log(`   - Has Passcode: ${result.hasPasscode}`)
    
    // Step 3: Simulate the GraphQL response formation
    console.log('\n🎯 Simulating GraphQL response...')
    
    const displayName = userProfile.displayName || 
      userProfile.email?.split('@')[0]?.replace(/[._-]/g, ' ')?.split(' ')
        ?.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        ?.join(' ') || 
      userProfile.slug
        ?.replace(/[._-]/g, ' ')
        ?.split(' ')
        ?.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        ?.join(' ')
    
    const simulatedResponse = {
      userProfile: {
        slug: userProfile.slug,
        displayName: displayName,
        createdAt: userProfile.createdAt,
      },
      result: {
        ...result,
        personalityType: result.personalityType,
        traits: result.traitScores,
        overallFit: result.overallFitScore,
      },
      isViewerOwner: false,
    }
    
    console.log('✅ Simulated GraphQL response created successfully')
    console.log(`   - Display Name: ${simulatedResponse.userProfile.displayName}`)
    console.log(`   - Personality: ${simulatedResponse.result.personalityType?.name}`)
    
    console.log('\n🎉 All database operations completed successfully!')
    console.log('🔍 This suggests the issue is in GraphQL server configuration, not database')
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message)
    
    if (error.message.includes('Invalid `prisma')) {
      console.log('💡 This appears to be a Prisma configuration issue')
    } else if (error.message.includes('connect')) {
      console.log('💡 This appears to be a database connection issue')
    } else {
      console.log('💡 This appears to be a different type of error')
    }
    
    console.error('Full error:', error)
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}

// Run the test
testGraphQLLocally()