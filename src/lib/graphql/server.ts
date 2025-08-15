import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { readFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '../prisma'
import { resolvers } from './resolvers'
import { Context } from './types'
import { auth } from '@clerk/nextjs/server'

// Read the GraphQL schema file
const typeDefs = readFileSync(
  join(process.cwd(), 'src/lib/graphql/schema.graphql'),
  'utf8'
)

// Create the executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

// Create Apollo Server
const server = new ApolloServer<Context>({
  schema,
  // Enable GraphQL Playground in development
  introspection: process.env.NODE_ENV !== 'production',
  // Disable playground in production for security
  plugins: [
    // Custom error formatting for production
    {
      requestDidStart() {
        return Promise.resolve({
          didEncounterErrors(requestContext: any) {
            // Log errors in production but don't expose sensitive info
            if (process.env.NODE_ENV === 'production') {
              requestContext.errors?.forEach((error: any) => {
                console.error('GraphQL Error:', {
                  message: error.message,
                  path: error.path,
                  timestamp: new Date().toISOString(),
                  // Don't log the full stack trace in production logs
                });
              });
            }
          },
        });
      },
    },
  ],
  // Format errors for client
  formatError: (error) => {
    // Enhanced error logging for production debugging
    console.error('GraphQL Error Details:', {
      message: error.message,
      path: error.path,
      locations: error.locations,
      extensions: error.extensions,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      originalError: error.originalError?.message,
      originalStack: error.originalError?.stack,
    });

    // In production, provide more helpful error messages while maintaining security
    if (process.env.NODE_ENV === 'production') {
      // For debugging: return detailed errors when flag is enabled
      if (process.env.ENABLE_DETAILED_ERRORS === 'true') {
        console.error('Returning detailed error for debugging:', error.message);
        return error;
      }
      
      // Handle specific error types with user-friendly messages
      if (error.message.includes('Prisma') || error.message.includes('Database')) {
        console.error('Database Error:', error.message);
        return new Error('Database connection issue - please try again');
      }
      if (error.message.includes('Clerk') || error.message.includes('Authentication')) {
        console.error('Auth Error:', error.message);
        return new Error('Authentication error - please sign in again');
      }
      if (error.message.includes('not found')) {
        return error; // These are safe to expose
      }
      if (error.message.includes('Invalid') || error.message.includes('required')) {
        return error; // Validation errors are safe
      }
      
      // Generic error for unexpected issues
      console.error('Unhandled GraphQL Error:', error.message);
      return new Error('An error occurred while processing your request');
    }
    // In development, show full errors
    return error;
  },
})

// Create the request handler
export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    // Get authentication from Clerk
    let clerkAuth = null
    try {
      clerkAuth = await auth()
    } catch (error) {
      // Auth not available, continue without auth (for public operations)
      console.log('No Clerk auth available for GraphQL request')
    }
    
    // Also check for custom headers passed from client
    const clerkUserId = req.headers['x-clerk-user-id'] as string || clerkAuth?.userId || null
    
    return {
      prisma,
      auth: clerkAuth,
      userId: clerkUserId,
      req,
      res,
    }
  },
})

export { server }