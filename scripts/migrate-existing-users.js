/**
 * Optional migration script to improve existing user profiles
 * Run with: node scripts/migrate-existing-users.js
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateExistingUsers() {
  try {
    console.log('🔄 Analyzing existing users for potential improvements...')
    
    // Find all profiles and filter in memory for simplicity
    const allProfiles = await prisma.userProfile.findMany({
      select: {
        id: true,
        clerkUserId: true,
        email: true,
        displayName: true,
        slug: true,
        onboardingComplete: true,
        whatsapp: true,
        linkedinUrl: true,
        currentRole: true,
        createdAt: true
      }
    })

    // Filter for profiles with empty email or displayName
    const emptyProfiles = allProfiles.filter(profile => 
      !profile.email || profile.email === "" ||
      !profile.displayName || profile.displayName === ""
    )

    console.log(`\n📊 Found ${emptyProfiles.length} profiles with missing data:`)
    
    if (emptyProfiles.length === 0) {
      console.log('✅ All profiles already have complete data!')
      return
    }

    let canImprove = 0
    let cannotImprove = 0

    emptyProfiles.forEach((profile, index) => {
      console.log(`\n${index + 1}. Profile: ${profile.slug}`)
      console.log(`   Clerk ID: ${profile.clerkUserId}`)
      console.log(`   Email: ${profile.email || 'EMPTY'}`)
      console.log(`   Display Name: ${profile.displayName || 'EMPTY'}`)
      console.log(`   Onboarding: ${profile.onboardingComplete ? 'Complete' : 'Incomplete'}`)
      
      // Check if we can improve this profile
      const hasOnboardingData = profile.whatsapp || profile.linkedinUrl || profile.currentRole
      const hasValidClerkId = profile.clerkUserId && profile.clerkUserId.startsWith('user_')
      
      if (hasOnboardingData && hasValidClerkId) {
        console.log(`   🔧 CAN IMPROVE: Has onboarding data, could fetch from Clerk`)
        canImprove++
      } else {
        console.log(`   ⚠️  CANNOT IMPROVE: Missing onboarding data or invalid Clerk ID`)
        cannotImprove++
      }
    })

    console.log(`\n📈 Migration Summary:`)
    console.log(`   Profiles that can be improved: ${canImprove}`)
    console.log(`   Profiles that cannot be improved: ${cannotImprove}`)
    console.log(`   Total profiles needing attention: ${emptyProfiles.length}`)

    console.log(`\n💡 Recommendations:`)
    if (canImprove > 0) {
      console.log(`   1. For ${canImprove} profiles: Fetch real user data from Clerk API`)
      console.log(`   2. Update their email/displayName with real values`)
      console.log(`   3. This will enable personalized titles for existing users`)
    }
    
    if (cannotImprove > 0) {
      console.log(`   4. For ${cannotImprove} profiles: Keep current fallback behavior`)
      console.log(`   5. They will continue showing "Agile Assessment Report"`)
    }

    console.log(`\n🎯 Next Steps:`)
    console.log(`   1. Set up Clerk webhook for new users (highest priority)`)
    console.log(`   2. Optionally run Clerk API migration for existing users`)
    console.log(`   3. Existing functionality continues working unchanged`)

  } catch (error) {
    console.error('❌ Error analyzing existing users:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the analysis
migrateExistingUsers()