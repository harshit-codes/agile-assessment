import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

// Type definition for Clerk window object
declare global {
  interface Window {
    Clerk?: {
      user?: {
        id: string
      }
      session?: {
        getToken: () => Promise<string>
      }
    }
  }
}

// HTTP link for GraphQL endpoint - use relative URL for production
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql',
})

// Auth link to add Clerk token to requests
const authLink = setContext(async (_, { headers }) => {
  let token = null
  let clerkUserId = null
  
  if (typeof window !== 'undefined') {
    // Client-side: Get token from Clerk using the window.Clerk object
    try {
      if (window.Clerk && window.Clerk.user) {
        token = await window.Clerk.session?.getToken()
        clerkUserId = window.Clerk.user.id
      }
    } catch (error) {
      console.log('Client-side Clerk auth error:', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  return {
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
      ...(clerkUserId && { 'x-clerk-user-id': clerkUserId }),
    },
  }
})

// Error link for handling GraphQL errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    })
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`)
    
    // Handle specific network errors
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      // Handle unauthorized errors
      console.error('Unauthorized access - redirecting to login')
    }
  }
})

// Create Apollo Client
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Quiz: {
        fields: {
          sections: {
            merge: false, // Replace array instead of merging
          },
        },
      },
      QuizResult: {
        fields: {
          traitScores: {
            merge: true, // Merge JSON objects
          },
          sectionScores: {
            merge: true, // Merge JSON objects
          },
        },
      },
      UserProfile: {
        keyFields: ['clerkUserId'], // Use clerkUserId as unique identifier
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all', // Show partial data even if there are errors
    },
    query: {
      errorPolicy: 'all',
    },
  },
})

// Named export for backward compatibility
export const getClient = () => client

export default client