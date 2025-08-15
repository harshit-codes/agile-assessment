/**
 * Application startup hooks
 * Runs initialization logic when the server starts
 */

import { autoSetupClerkWebhook } from './clerk-webhook-setup'

/**
 * Run all startup initialization tasks
 */
export async function runStartupHooks(): Promise<void> {
  console.log('🚀 Running application startup hooks...')
  
  try {
    // Setup Clerk webhook programmatically
    await autoSetupClerkWebhook()
    
    // Add other startup tasks here as needed
    // e.g., database migrations, cache warming, health checks
    
    console.log('✅ Startup hooks completed successfully')
  } catch (error) {
    console.error('❌ Startup hooks failed:', error)
    // Don't throw - allow app to start even if hooks fail
  }
}

// Auto-run on server initialization (not in browser)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
  // Add a small delay to ensure all modules are loaded
  setTimeout(() => {
    runStartupHooks().catch(console.error)
  }, 1000)
}