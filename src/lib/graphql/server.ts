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
    // In production, sanitize error messages
    if (process.env.NODE_ENV === 'production') {
      // Don't expose internal error details
      if (error.message.includes('Prisma') || error.message.includes('Database')) {
        return new Error('An internal server error occurred');
      }
      // Keep validation and expected errors
      if (error.message.includes('not found') || error.message.includes('Invalid')) {
        return error;
      }
      // Generic error for unexpected issues
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