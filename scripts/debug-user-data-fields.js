/**
 * Script to debug why displayName and email are null for user profiles
 * Run with: node scripts/debug-user-data-fields.js
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugUserDataFields() {
  try {
    console.log('🔍 Investigating user data fields...')
    
    // Check the specific user in question
    const targetSlug = 'user-31h1lpjfwci1xcr'
    
    console.log(`\n1️⃣ Raw database query for ${targetSlug}:`)
    const userProfile = await prisma.userProfile.findUnique({
      where: { slug: targetSlug },
      select: {
        id: true,
        clerkUserId: true,
        email: true,
        slug: true,
        displayName: true,
        name: true,
        onboardingComplete: true,
        whatsapp: true,
        linkedinUrl: true,
        currentRole: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    if (!userProfile) {
      console.log('❌ User profile not found')
      return
    }
    
    console.log('📊 Raw User Profile Data:')
    Object.entries(userProfile).forEach(([key, value]) => {
      const displayValue = value === null ? '❌ NULL' : 
                          value === '' ? '❌ EMPTY STRING' : 
                          value === undefined ? '❌ UNDEFINED' : value
      console.log(`   ${key}: ${displayValue}`)
    })
    
    // Check if this user has Clerk data
    console.log('\n2️⃣ Checking Clerk User ID pattern:')
    const clerkUserId = userProfile.clerkUserId
    console.log(`   Clerk User ID: ${clerkUserId}`)
    console.log(`   Pattern: ${clerkUserId.startsWith('user_') ? '✅ Valid Clerk format' : '❌ Invalid format'}`)
    console.log(`   Length: ${clerkUserId.length} chars`)
    
    // Check when this profile was created
    console.log('\n3️⃣ Profile creation timeline:')
    console.log(`   Created: ${userProfile.createdAt}`)
    console.log(`   Updated: ${userProfile.updatedAt}`)
    console.log(`   Onboarding Complete: ${userProfile.onboardingComplete}`)
    
    // Check all user profiles to see if this is a pattern
    console.log('\n4️⃣ Checking all user profiles for similar patterns:')
    const allProfiles = await prisma.userProfile.findMany({
      select: {
        slug: true,
        clerkUserId: true,
        email: true,
        displayName: true,
        name: true,
        onboardingComplete: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`\n📊 Found ${allProfiles.length} total user profiles:`)
    
    let emptyEmailCount = 0
    let emptyDisplayNameCount = 0
    let emptyNameCount = 0
    
    allProfiles.forEach((profile, index) => {
      const hasEmail = profile.email && profile.email.trim().length > 0
      const hasDisplayName = profile.displayName && profile.displayName.trim().length > 0
      const hasName = profile.name && profile.name.trim().length > 0
      
      if (!hasEmail) emptyEmailCount++
      if (!hasDisplayName) emptyDisplayNameCount++
      if (!hasName) emptyNameCount++
      
      console.log(`${index + 1}. ${profile.slug}`)
      console.log(`   Clerk: ${profile.clerkUserId}`)
      console.log(`   Email: ${hasEmail ? '✅ Has email' : '❌ No email'}`)
      console.log(`   Display Name: ${hasDisplayName ? '✅ Has display name' : '❌ No display name'}`)
      console.log(`   Name: ${hasName ? '✅ Has name' : '❌ No name'}`)
      console.log(`   Onboarding: ${profile.onboardingComplete ? '✅ Complete' : '❌ Incomplete'}`)
      console.log(`   Created: ${profile.createdAt}`)
      console.log('')
    })
    
    console.log('\n📈 Summary Statistics:')
    console.log(`   Profiles with empty email: ${emptyEmailCount}/${allProfiles.length}`)
    console.log(`   Profiles with empty displayName: ${emptyDisplayNameCount}/${allProfiles.length}`)
    console.log(`   Profiles with empty name: ${emptyNameCount}/${allProfiles.length}`)
    
    // Check how these profiles were created
    console.log('\n5️⃣ Checking profile creation methods:')
    
    // Look at scoring.ts creation logic
    console.log('   Checking scoring.ts creation pattern...')
    const scoringCreatedProfiles = allProfiles.filter(p => 
      (!p.email || p.email === '') && 
      (!p.displayName || p.displayName === '') &&
      p.clerkUserId.startsWith('user_')
    )
    
    console.log(`   Profiles matching scoring.ts pattern: ${scoringCreatedProfiles.length}`)
    scoringCreatedProfiles.forEach(p => {
      console.log(`     - ${p.slug} (${p.clerkUserId})`)
    })
    
    // Look at sharing.ts creation logic  
    console.log('\n   Checking sharing.ts creation pattern...')
    const sharingCreatedProfiles = allProfiles.filter(p => 
      p.email && p.email.length > 0 && 
      p.displayName && p.displayName.length > 0
    )
    
    console.log(`   Profiles matching sharing.ts pattern: ${sharingCreatedProfiles.length}`)
    sharingCreatedProfiles.forEach(p => {
      console.log(`     - ${p.slug} (display: ${p.displayName}, email: ${p.email})`)
    })
    
    // Check if the target user has any quiz sessions
    console.log('\n6️⃣ Checking quiz sessions for target user:')
    const sessions = await prisma.quizSession.findMany({
      where: { clerkUserId: userProfile.clerkUserId },
      include: {
        results: {
          select: {
            id: true,
            personalityCode: true,
            isPublic: true,
            calculatedAt: true
          }
        }
      },
      orderBy: { startedAt: 'desc' }
    })
    
    console.log(`   Found ${sessions.length} quiz sessions:`)
    sessions.forEach((session, index) => {
      console.log(`   ${index + 1}. Session ${session.id}`)
      console.log(`      Started: ${session.startedAt}`)
      console.log(`      Completed: ${session.completedAt || 'Not completed'}`)
      console.log(`      Results: ${session.results.length}`)
      session.results.forEach(result => {
        console.log(`        - ${result.personalityCode} (${result.isPublic ? 'Public' : 'Private'})`)
      })
    })
    
  } catch (error) {
    console.error('❌ Error debugging user data:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the debug
debugUserDataFields()