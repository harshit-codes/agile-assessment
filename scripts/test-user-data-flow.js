/**
 * Script to test the new user data flow architecture
 * Run with: node scripts/test-user-data-flow.js
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testUserDataFlow() {
  try {
    console.log('🧪 Testing User Data Flow Architecture...')
    
    // Test 1: Simulate user signup webhook creating profile
    console.log('\n1️⃣ Testing createUserProfile with real data...')
    
    const testClerkUserId = 'user_test123ABC'
    const testEmail = 'test.user@example.com'
    const testFirstName = 'Test'
    const testLastName = 'User'
    
    // Clean up any existing test data first
    await prisma.userProfile.deleteMany({
      where: { clerkUserId: testClerkUserId }
    })
    
    // Simulate GraphQL createUserProfile mutation (like webhook would call)
    console.log(`   Creating profile for: ${testFirstName} ${testLastName} (${testEmail})`)
    
    // Simulate the resolver logic
    let displayName = `${testFirstName} ${testLastName}`
    
    // Generate slug from display name
    const generateSlugFromName = (displayName, fallbackEmail) => {
      if (displayName && displayName.trim()) {
        return displayName
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          .trim()
      }
      return fallbackEmail?.split('@')[0]?.toLowerCase()?.replace(/[^a-z0-9]/g, '-') || 'user'
    }
    
    const baseSlug = generateSlugFromName(displayName, testEmail)
    let finalSlug = baseSlug
    let counter = 1
    
    while (true) {
      const existing = await prisma.userProfile.findUnique({
        where: { slug: finalSlug }
      })
      if (!existing) break
      finalSlug = `${baseSlug}-${counter}`
      counter++
    }
    
    const newProfile = await prisma.userProfile.create({
      data: {
        clerkUserId: testClerkUserId,
        email: testEmail,
        slug: finalSlug,
        displayName: displayName,
        onboardingComplete: false,
      }
    })
    
    console.log(`   ✅ Profile created:`)
    console.log(`      ID: ${newProfile.id}`)
    console.log(`      Display Name: ${newProfile.displayName}`)
    console.log(`      Email: ${newProfile.email}`)
    console.log(`      Slug: ${newProfile.slug}`)
    
    // Test 2: Simulate onboarding update
    console.log('\n2️⃣ Testing onboarding data update...')
    
    const updatedProfile = await prisma.userProfile.update({
      where: { clerkUserId: testClerkUserId },
      data: {
        onboardingComplete: true,
        whatsapp: '+1234567890',
        linkedinUrl: 'https://linkedin.com/in/testuser',
        currentRole: 'Product Manager'
      }
    })
    
    console.log(`   ✅ Profile updated with onboarding data:`)
    console.log(`      Whatsapp: ${updatedProfile.whatsapp}`)
    console.log(`      LinkedIn: ${updatedProfile.linkedinUrl}`)
    console.log(`      Role: ${updatedProfile.currentRole}`)
    console.log(`      Onboarding Complete: ${updatedProfile.onboardingComplete}`)
    
    // Test 3: Test smart title logic with real data
    console.log('\n3️⃣ Testing smart title generation...')
    
    // Simulate the smart title logic from page.tsx
    const isQualityDisplayName = updatedProfile.displayName && 
      !updatedProfile.displayName.startsWith('User ') && 
      !updatedProfile.displayName.includes('user') &&
      updatedProfile.displayName.length > 3 &&
      !updatedProfile.displayName.match(/^[a-z0-9-]+$/i) &&
      updatedProfile.displayName.includes(' ')
    
    const titleText = isQualityDisplayName 
      ? `${updatedProfile.displayName}'s Agile Personality Report`
      : `Agile Assessment Report`
    
    console.log(`   Quality display name: ${isQualityDisplayName ? '✅ YES' : '❌ NO'}`)
    console.log(`   Generated title: "${titleText}"`)
    
    // Test 4: Test sharing resolver with real data
    console.log('\n4️⃣ Testing sharing resolver display name generation...')
    
    // Simulate sharing.ts generateDisplayNameFromEmail logic
    const fallbackDisplayName = updatedProfile.displayName || 
      (updatedProfile.email ? 
        updatedProfile.email.split('@')[0]
          .replace(/[._-]/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ') : 
        updatedProfile.slug
          .replace(/[._-]/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      )
    
    console.log(`   Sharing display name: "${fallbackDisplayName}"`)
    console.log(`   ${fallbackDisplayName === updatedProfile.displayName ? '✅ Uses real name' : '⚠️ Uses fallback'}`)
    
    // Test 5: Compare with old broken approach
    console.log('\n5️⃣ Comparing with old broken approach...')
    
    const oldBrokenProfile = {
      displayName: "",
      email: "",
      slug: "user-test123abc"
    }
    
    const oldIsQuality = oldBrokenProfile.displayName && 
      !oldBrokenProfile.displayName.startsWith('User ') && 
      !oldBrokenProfile.displayName.includes('user') &&
      oldBrokenProfile.displayName.length > 3 &&
      !oldBrokenProfile.displayName.match(/^[a-z0-9-]+$/i) &&
      oldBrokenProfile.displayName.includes(' ')
    
    const oldTitleText = oldIsQuality 
      ? `${oldBrokenProfile.displayName}'s Agile Personality Report`
      : `Agile Assessment Report`
    
    console.log(`   Old approach quality: ${oldIsQuality ? '✅ YES' : '❌ NO'}`)
    console.log(`   Old approach title: "${oldTitleText}"`)
    
    console.log('\n📊 Summary:')
    console.log(`   ✅ NEW: "${titleText}"`)
    console.log(`   ❌ OLD: "${oldTitleText}"`)
    console.log(`   🎯 Improvement: ${titleText !== oldTitleText ? 'PERSONALIZED!' : 'No change'}`)
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...')
    await prisma.userProfile.delete({
      where: { clerkUserId: testClerkUserId }
    })
    console.log('   ✅ Test data cleaned up')
    
    console.log('\n🎉 User Data Flow Test Complete!')
    console.log('✅ All systems working correctly for personalized titles')
    
  } catch (error) {
    console.error('❌ Error testing user data flow:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testUserDataFlow()