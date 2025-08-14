import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

// Server-side Apollo client for use in server components and API routes
// No authentication required for public queries like GET_PUBLIC_RESULT

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/api/graphql',
  // For server-side use, we need the full URL in development
  // In production, this will resolve to the correct domain
})

const serverClient = new ApolloClient({
  link: httpLink,
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
    query: {
      errorPolicy: 'all', // Show partial data even if there are errors
      fetchPolicy: 'no-cache', // Don't cache server-side queries
    },
  },
})

export default serverClient