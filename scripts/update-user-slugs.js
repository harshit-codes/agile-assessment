/**
 * Script to manually update existing user slugs to use name-based format
 * Run with: node scripts/update-user-slugs.js
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Utility function to generate slug from display name (preferred) or email (fallback)
function generateSlugFromName(displayName, fallbackEmail) {
  if (displayName && displayName.trim()) {
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters, keep spaces
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .replace(/-+/g, '-')         // Replace multiple hyphens with single
      .replace(/^-|-$/g, '')       // Remove leading/trailing hyphens
      .trim()
  }
  
  // Fallback to email-based slug if no display name
  if (fallbackEmail) {
    return fallbackEmail
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
  
  // Ultimate fallback
  return 'user'
}

async function updateUserSlugs() {
  try {
    console.log('🔍 Fetching existing users...')
    
    // Get all existing users
    const users = await prisma.userProfile.findMany({
      select: {
        id: true,
        clerkUserId: true,
        email: true,
        displayName: true,
        slug: true,
        name: true
      }
    })
    
    console.log(`📊 Found ${users.length} users:`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.slug} - ${user.displayName || 'No display name'} (${user.email})`)
    })
    
    if (users.length === 0) {
      console.log('✅ No users found to update')
      return
    }
    
    console.log('\n🔄 Updating slugs...')
    
    for (const user of users) {
      // Generate new slug from display name or name field
      let fullName = user.displayName || user.name
      
      const newSlug = generateSlugFromName(fullName, user.email)
      
      // Skip if slug is already good (not a user-id format)
      if (!user.slug.startsWith('user-') && user.slug !== newSlug) {
        console.log(`⏭️  Skipping ${user.slug} - already has custom slug`)
        continue
      }
      
      if (user.slug === newSlug) {
        console.log(`⏭️  Skipping ${user.slug} - already correct`)
        continue
      }
      
      // Check if new slug is available
      const existingUser = await prisma.userProfile.findUnique({
        where: { slug: newSlug }
      })
      
      let finalSlug = newSlug
      let counter = 1
      
      // Handle slug conflicts
      while (existingUser && existingUser.id !== user.id) {
        finalSlug = `${newSlug}-${counter}`
        const conflictCheck = await prisma.userProfile.findUnique({
          where: { slug: finalSlug }
        })
        if (!conflictCheck) break
        counter++
      }
      
      // Update the user
      await prisma.userProfile.update({
        where: { id: user.id },
        data: { slug: finalSlug }
      })
      
      console.log(`✅ Updated: ${user.slug} → ${finalSlug}`)
    }
    
    console.log('\n🎉 All user slugs updated successfully!')
    
    // Show final results
    console.log('\n📊 Final user list:')
    const updatedUsers = await prisma.userProfile.findMany({
      select: {
        slug: true,
        displayName: true,
        email: true
      }
    })
    
    updatedUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.slug} - ${user.displayName || 'No display name'} (${user.email})`)
    })
    
  } catch (error) {
    console.error('❌ Error updating user slugs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the update
updateUserSlugs()