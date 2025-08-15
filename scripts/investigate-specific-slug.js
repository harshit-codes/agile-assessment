/**
 * Script to investigate the specific slug user-31h1lpjfwci1xcr
 * Run with: node scripts/investigate-specific-slug.js
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function investigateSpecificSlug() {
  try {
    const targetSlug = 'user-31h1lpjfwci1xcr'
    const clerkPattern = '31h1lpjfwci1xcr'
    
    console.log(`🔍 Investigating slug: ${targetSlug}`)
    console.log(`🔍 Looking for Clerk pattern: ${clerkPattern}`)
    
    // 1. Check if UserProfile exists with this exact slug
    console.log('\n1️⃣ Checking UserProfile with exact slug...')
    const exactProfile = await prisma.userProfile.findUnique({
      where: { slug: targetSlug },
      include: {
        results: {
          select: {
            id: true,
            isPublic: true,
            hasPasscode: true,
            personalityCode: true,
            calculatedAt: true
          }
        }
      }
    })
    
    if (exactProfile) {
      console.log(`✅ Found exact profile:`)
      console.log(`   - Clerk ID: ${exactProfile.clerkUserId}`)
      console.log(`   - Display Name: ${exactProfile.displayName || 'None'}`)
      console.log(`   - Email: ${exactProfile.email}`)
      console.log(`   - Results: ${exactProfile.results.length}`)
    } else {
      console.log(`❌ No exact profile found for slug: ${targetSlug}`)
    }

    // 2. Check for partial slug matches
    console.log('\n2️⃣ Checking for partial slug matches...')
    const partialProfiles = await prisma.userProfile.findMany({
      where: {
        slug: {
          startsWith: targetSlug
        }
      }
    })
    
    if (partialProfiles.length > 0) {
      console.log(`✅ Found ${partialProfiles.length} partial matches:`)
      partialProfiles.forEach(p => {
        console.log(`   - ${p.slug} (${p.clerkUserId}) - ${p.displayName || 'No name'}`)
      })
    } else {
      console.log(`❌ No partial matches found`)
    }

    // 3. Search by Clerk User ID pattern
    console.log('\n3️⃣ Searching by Clerk User ID pattern...')
    const clerkProfiles = await prisma.userProfile.findMany({
      where: {
        clerkUserId: {
          contains: clerkPattern
        }
      }
    })
    
    if (clerkProfiles.length > 0) {
      console.log(`✅ Found ${clerkProfiles.length} profiles with Clerk pattern:`)
      clerkProfiles.forEach(p => {
        console.log(`   - ${p.slug} (${p.clerkUserId}) - ${p.displayName || 'No name'}`)
      })
    } else {
      console.log(`❌ No profiles found with Clerk pattern: ${clerkPattern}`)
    }

    // 4. Check for QuizSessions with this Clerk pattern
    console.log('\n4️⃣ Checking QuizSessions with Clerk pattern...')
    const sessions = await prisma.quizSession.findMany({
      where: {
        clerkUserId: {
          contains: clerkPattern
        }
      },
      include: {
        results: {
          select: {
            id: true,
            isPublic: true,
            hasPasscode: true,
            userProfileId: true,
            personalityCode: true,
            calculatedAt: true
          }
        }
      }
    })
    
    if (sessions.length > 0) {
      console.log(`✅ Found ${sessions.length} sessions with Clerk pattern:`)
      sessions.forEach(s => {
        console.log(`   - Session ${s.id} (${s.clerkUserId})`)
        console.log(`     Started: ${s.startedAt}`)
        console.log(`     Results: ${s.results.length}`)
        s.results.forEach(r => {
          console.log(`       * Result ${r.id}: ${r.personalityCode} (Profile: ${r.userProfileId || 'None'})`)
        })
      })
    } else {
      console.log(`❌ No sessions found with Clerk pattern: ${clerkPattern}`)
    }

    // 5. Show all public/shared results for context
    console.log('\n5️⃣ Showing all public/shared results...')
    const allSharedResults = await prisma.quizResult.findMany({
      where: {
        OR: [
          { isPublic: true },
          { hasPasscode: true }
        ]
      },
      include: {
        session: {
          select: {
            clerkUserId: true
          }
        },
        userProfile: {
          select: {
            slug: true,
            displayName: true
          }
        }
      },
      orderBy: { calculatedAt: 'desc' },
      take: 10
    })
    
    console.log(`📊 Found ${allSharedResults.length} shared results (showing recent 10):`)
    allSharedResults.forEach((r, index) => {
      console.log(`${index + 1}. Result ${r.id}`)
      console.log(`   Slug: ${r.userProfile?.slug || 'No profile'}`)
      console.log(`   Display: ${r.userProfile?.displayName || 'No name'}`)
      console.log(`   Clerk: ${r.session.clerkUserId || 'Anonymous'}`)
      console.log(`   Public: ${r.isPublic}, Passcode: ${r.hasPasscode}`)
      console.log('')
    })

    // 6. Test the GraphQL logic manually
    console.log('\n6️⃣ Testing GraphQL lookup logic...')
    
    // Simulate the exact GraphQL query logic
    let userProfile = await prisma.userProfile.findUnique({
      where: { slug: targetSlug }
    })

    if (!userProfile && targetSlug.startsWith('user-')) {
      userProfile = await prisma.userProfile.findFirst({
        where: {
          slug: {
            startsWith: targetSlug
          }
        }
      })
    }

    if (userProfile) {
      console.log(`✅ GraphQL logic would find profile: ${userProfile.slug}`)
      
      // Check for results
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
      
      if (result) {
        console.log(`✅ Would return result: ${result.personalityCode}`)
      } else {
        console.log(`❌ No shareable results found for this profile`)
      }
    } else {
      console.log(`❌ GraphQL logic would return null (no profile found)`)
    }

  } catch (error) {
    console.error('❌ Error investigating slug:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the investigation
investigateSpecificSlug()