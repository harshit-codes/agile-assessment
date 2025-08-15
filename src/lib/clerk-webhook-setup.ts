/**
 * Programmatic Clerk Webhook Configuration
 * Automatically sets up webhook endpoints without requiring manual dashboard configuration
 */

import { createClerkClient } from '@clerk/backend'

interface WebhookConfig {
  url: string
  events: string[]
  enabled: boolean
}

export class ClerkWebhookManager {
  private client: ReturnType<typeof createClerkClient>
  private webhookUrl: string

  constructor() {
    this.client = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!
    })
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    this.webhookUrl = `${baseUrl}/api/webhooks/clerk`
  }

  /**
   * Check if webhook endpoint already exists
   */
  async webhookExists(): Promise<boolean> {
    try {
      const webhooks = await this.client.webhooks.getWebhookList()
      return webhooks.some(webhook => webhook.url === this.webhookUrl)
    } catch (error) {
      console.error('❌ Error checking existing webhooks:', error)
      return false
    }
  }

  /**
   * Create webhook endpoint programmatically
   */
  async createWebhook(config: Partial<WebhookConfig> = {}): Promise<boolean> {
    const defaultConfig: WebhookConfig = {
      url: this.webhookUrl,
      events: [
        'user.created',
        'user.updated', 
        'user.deleted'
      ],
      enabled: true,
      ...config
    }

    try {
      console.log(`🔄 Creating webhook endpoint: ${defaultConfig.url}`)
      
      const webhook = await this.client.webhooks.createWebhook(defaultConfig)
      
      console.log('✅ Webhook created successfully:', {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        enabled: webhook.enabled
      })

      return true
    } catch (error) {
      console.error('❌ Error creating webhook:', error)
      return false
    }
  }

  /**
   * Update existing webhook configuration
   */
  async updateWebhook(webhookId: string, config: Partial<WebhookConfig>): Promise<boolean> {
    try {
      console.log(`🔄 Updating webhook ${webhookId}`)
      
      const webhook = await this.client.webhooks.updateWebhook(webhookId, config)
      
      console.log('✅ Webhook updated successfully:', {
        id: webhook.id,
        url: webhook.url,
        enabled: webhook.enabled
      })

      return true
    } catch (error) {
      console.error('❌ Error updating webhook:', error)
      return false
    }
  }

  /**
   * Get webhook signing secret for the configured endpoint
   */
  async getWebhookSecret(): Promise<string | null> {
    try {
      const webhooks = await this.client.webhooks.getWebhookList()
      const webhook = webhooks.find(w => w.url === this.webhookUrl)
      
      if (webhook) {
        // Note: The signing secret might not be directly accessible via the API
        // It's typically provided only when creating the webhook
        console.log(`ℹ️ Webhook found: ${webhook.id}`)
        return webhook.signingSecret || null
      }
      
      return null
    } catch (error) {
      console.error('❌ Error getting webhook secret:', error)
      return null
    }
  }

  /**
   * Main setup function - idempotent webhook configuration
   */
  async setupWebhook(): Promise<{
    success: boolean
    webhookId?: string
    message: string
  }> {
    try {
      console.log('🚀 Starting programmatic webhook setup...')
      console.log(`📍 Target URL: ${this.webhookUrl}`)

      // Check if webhook already exists
      const exists = await this.webhookExists()
      
      if (exists) {
        console.log('✅ Webhook already configured')
        return {
          success: true,
          message: 'Webhook endpoint already exists'
        }
      }

      // Create new webhook
      const created = await this.createWebhook()
      
      if (created) {
        return {
          success: true,
          message: 'Webhook endpoint created successfully'
        }
      } else {
        return {
          success: false,
          message: 'Failed to create webhook endpoint'
        }
      }

    } catch (error) {
      console.error('❌ Webhook setup failed:', error)
      return {
        success: false,
        message: `Webhook setup error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Remove webhook endpoint (useful for cleanup)
   */
  async removeWebhook(): Promise<boolean> {
    try {
      const webhooks = await this.client.webhooks.getWebhookList()
      const webhook = webhooks.find(w => w.url === this.webhookUrl)
      
      if (webhook) {
        await this.client.webhooks.deleteWebhook(webhook.id)
        console.log('✅ Webhook removed successfully')
        return true
      } else {
        console.log('ℹ️ No webhook found to remove')
        return true
      }
    } catch (error) {
      console.error('❌ Error removing webhook:', error)
      return false
    }
  }
}

/**
 * Convenience function for automatic webhook setup
 */
export async function autoSetupClerkWebhook(): Promise<void> {
  // Only run if explicitly enabled
  if (process.env.WEBHOOK_AUTO_SETUP !== 'true') {
    console.log('ℹ️ Webhook auto-setup disabled (set WEBHOOK_AUTO_SETUP=true to enable)')
    return
  }

  // Skip in development unless explicitly enabled
  if (process.env.NODE_ENV === 'development' && process.env.WEBHOOK_DEV_SETUP !== 'true') {
    console.log('ℹ️ Skipping webhook setup in development (set WEBHOOK_DEV_SETUP=true to enable)')
    return
  }

  // Ensure required environment variables exist
  if (!process.env.CLERK_SECRET_KEY) {
    console.error('❌ CLERK_SECRET_KEY not found - skipping webhook setup')
    return
  }

  const manager = new ClerkWebhookManager()
  const result = await manager.setupWebhook()
  
  if (!result.success) {
    console.warn(`⚠️ Webhook setup failed: ${result.message}`)
    // Don't throw error - allow app to continue running
  }
}

export { autoSetupClerkWebhook as default }