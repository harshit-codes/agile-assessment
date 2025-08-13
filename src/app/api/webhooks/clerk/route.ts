import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { api } from '../../../../../convex/_generated/api';
import { fetchMutation } from 'convex/nextjs';

// Clerk webhook event types
interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    [key: string]: any;
  };
}

export async function POST(request: NextRequest) {
  console.log('🔔 Clerk webhook received');

  try {
    // Get webhook secret from environment
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('❌ CLERK_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Get headers for verification
    const headerPayload = await headers();
    const svixId = headerPayload.get('svix-id');
    const svixTimestamp = headerPayload.get('svix-timestamp');
    const svixSignature = headerPayload.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('❌ Missing required svix headers');
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    // Get request body
    const body = await request.text();

    // Verify webhook signature
    const webhook = new Webhook(webhookSecret);
    let event: ClerkWebhookEvent;

    try {
      event = webhook.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkWebhookEvent;
    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`✅ Webhook verified. Event type: ${event.type}`);

    // Handle user deletion event
    if (event.type === 'user.deleted') {
      const clerkUserId = event.data.id;
      
      if (!clerkUserId) {
        console.error('❌ No user ID found in deletion event');
        return NextResponse.json(
          { error: 'No user ID in event data' },
          { status: 400 }
        );
      }

      console.log(`🗑️ Processing user deletion for Clerk ID: ${clerkUserId}`);

      try {
        // Call Convex mutation to delete user data
        const result = await fetchMutation(api.userProfiles.deleteUserAccount, {
          clerkUserId
        });

        console.log('✅ User account deletion completed:', result);

        return NextResponse.json({
          success: true,
          message: 'User account deleted successfully',
          result
        });

      } catch (convexError) {
        console.error('❌ Error deleting user data from Convex:', convexError);
        
        // Return 200 to prevent Clerk from retrying if it's a data issue
        // But log the error for investigation
        return NextResponse.json({
          success: false,
          message: 'Error processing deletion',
          error: convexError instanceof Error ? convexError.message : 'Unknown Convex error'
        }, { status: 500 });
      }
    }

    // Handle other webhook events (log and acknowledge)
    console.log(`ℹ️ Received webhook event: ${event.type} (not handled)`);
    
    return NextResponse.json({
      success: true,
      message: `Event ${event.type} received but not processed`
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}