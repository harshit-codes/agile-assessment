import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { DELETE_USER_ACCOUNT, CREATE_USER_PROFILE } from '@/lib/graphql/operations';
import { getClient } from '@/lib/apollo-client';

// Clerk webhook event types
interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{
      email_address: string;
      verification: { status: string };
    }>;
    first_name?: string;
    last_name?: string;
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

    // Handle user creation event
    if (event.type === 'user.created') {
      const clerkUserId = event.data.id;
      const emailAddresses = event.data.email_addresses || [];
      const firstName = event.data.first_name;
      const lastName = event.data.last_name;

      // Get primary email address
      const primaryEmail = emailAddresses.find(email => 
        email.verification?.status === 'verified'
      )?.email_address || emailAddresses[0]?.email_address;

      if (!clerkUserId || !primaryEmail) {
        console.error('❌ Missing required user data in creation event:', {
          clerkUserId,
          primaryEmail,
          emailAddresses
        });
        return NextResponse.json(
          { error: 'Missing required user data' },
          { status: 400 }
        );
      }

      console.log(`👤 Creating user profile for Clerk ID: ${clerkUserId}, Email: ${primaryEmail}`);

      try {
        // Call GraphQL mutation to create user profile
        const client = getClient();
        const result = await client.mutate({
          mutation: CREATE_USER_PROFILE,
          variables: {
            input: {
              clerkUserId,
              email: primaryEmail,
              firstName: firstName || undefined,
              lastName: lastName || undefined,
            }
          }
        });

        console.log('✅ User profile creation completed:', result.data);

        return NextResponse.json({
          success: true,
          message: 'User profile created successfully',
          result: result.data
        });

      } catch (graphqlError) {
        console.error('❌ Error creating user profile via GraphQL:', graphqlError);
        
        // Return 200 to prevent Clerk from retrying if it's a data issue
        return NextResponse.json({
          success: false,
          message: 'Error creating user profile',
          error: graphqlError instanceof Error ? graphqlError.message : 'Unknown GraphQL error'
        }, { status: 500 });
      }
    }

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
        // Call GraphQL mutation to delete user data
        const client = getClient();
        const result = await client.mutate({
          mutation: DELETE_USER_ACCOUNT,
          variables: { clerkUserId }
        });

        console.log('✅ User account deletion completed:', result.data);

        return NextResponse.json({
          success: true,
          message: 'User account deleted successfully',
          result: result.data
        });

      } catch (graphqlError) {
        console.error('❌ Error deleting user data from GraphQL:', graphqlError);
        
        // Return 200 to prevent Clerk from retrying if it's a data issue
        // But log the error for investigation
        return NextResponse.json({
          success: false,
          message: 'Error processing deletion',
          error: graphqlError instanceof Error ? graphqlError.message : 'Unknown GraphQL error'
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