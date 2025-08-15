/**
 * Script to debug orphaned QuizResults without UserProfiles
 * Run with: node scripts/debug-orphaned-results.js
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugOrphanedResults() {
  try {
    console.log('🔍 Searching for orphaned QuizResults...')
    
    // Find QuizResults that are public/shared but have no UserProfile
    const orphanedResults = await prisma.quizResult.findMany({
      where: {
        OR: [
          { isPublic: true },
          { hasPasscode: true }
        ],
        userProfileId: null
      },
      include: {
        session: {
          select: {
            clerkUserId: true,
            id: true,
            startedAt: true
          }
        },
        personalityType: {
          select: {
            name: true,
            shortName: true
          }
        }
      },
      orderBy: { calculatedAt: 'desc' }
    })

    console.log(`📊 Found ${orphanedResults.length} orphaned shared results:`)
    
    if (orphanedResults.length === 0) {
      console.log('✅ No orphaned results found!')
      return
    }

    // Group by clerkUserId patterns
    const byClerkUser = {}
    const anonymous = []
    
    orphanedResults.forEach((result, index) => {
      const clerkUserId = result.session.clerkUserId
      const resultInfo = {
        id: result.id,
        sessionId: result.session.id,
        personalityType: result.personalityType?.name || 'Unknown',
        calculatedAt: result.calculatedAt,
        isPublic: result.isPublic,
        hasPasscode: result.hasPasscode
      }
      
      if (clerkUserId) {
        if (!byClerkUser[clerkUserId]) byClerkUser[clerkUserId] = []
        byClerkUser[clerkUserId].push(resultInfo)
      } else {
        anonymous.push(resultInfo)
      }
      
      console.log(`${index + 1}. Result ID: ${result.id}`)
      console.log(`   Session: ${result.session.id}`)
      console.log(`   Clerk User: ${clerkUserId || 'Anonymous'}`)
      console.log(`   Personality: ${result.personalityType?.name || 'Unknown'}`)
      console.log(`   Public: ${result.isPublic}, Passcode: ${result.hasPasscode}`)
      console.log(`   Created: ${result.calculatedAt}`)
      console.log('')
    })

    console.log('\n📈 Summary:')
    console.log(`Authenticated users with orphaned results: ${Object.keys(byClerkUser).length}`)
    console.log(`Anonymous orphaned results: ${anonymous.length}`)
    
    // Check specific case
    console.log('\n🎯 Checking specific patterns...')
    
    // Look for pattern matching user-31h1lpjfwci1xcr
    const targetPattern = 'user_31h1lpjfwci1xcr'
    const matchingResults = orphanedResults.filter(r => 
      r.session.clerkUserId && r.session.clerkUserId.includes('31h1lpjfwci1xcr')
    )
    
    if (matchingResults.length > 0) {
      console.log(`🎯 Found results matching pattern ${targetPattern}:`)
      matchingResults.forEach(result => {
        console.log(`   - Result ${result.id} for user ${result.session.clerkUserId}`)
      })
    } else {
      console.log(`❌ No results found matching ${targetPattern}`)
    }

    // Check if there are any UserProfiles that might match
    console.log('\n🔍 Checking existing UserProfiles...')
    const allProfiles = await prisma.userProfile.findMany({
      select: {
        clerkUserId: true,
        slug: true,
        displayName: true,
        email: true
      }
    })
    
    console.log(`📊 Found ${allProfiles.length} existing UserProfiles`)
    allProfiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.slug} - ${profile.displayName || 'No name'} (${profile.clerkUserId})`)
    })

    // Look for the specific slug in question
    const targetSlug = 'user-31h1lpjfwci1xcr'
    const matchingProfile = allProfiles.find(p => p.slug === targetSlug)
    
    if (matchingProfile) {
      console.log(`✅ Found profile for ${targetSlug}: ${matchingProfile.clerkUserId}`)
    } else {
      console.log(`❌ No profile found for slug: ${targetSlug}`)
      
      // Check if there's a similar pattern
      const similarProfiles = allProfiles.filter(p => 
        p.slug.includes('31h1lpjfwci1xcr') || p.clerkUserId.includes('31h1lpjfwci1xcr')
      )
      
      if (similarProfiles.length > 0) {
        console.log('🔍 Found similar patterns:')
        similarProfiles.forEach(p => {
          console.log(`   - ${p.slug} (${p.clerkUserId})`)
        })
      }
    }

  } catch (error) {
    console.error('❌ Error debugging orphaned results:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the debug
debugOrphanedResults()