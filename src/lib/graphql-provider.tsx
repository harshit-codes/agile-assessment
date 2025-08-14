"use client"

import { ApolloProvider } from '@apollo/client'
import { useAuth } from '@clerk/nextjs'
import { useMemo } from 'react'
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { ApolloLink } from '@apollo/client'

interface GraphQLProviderProps {
  children: React.ReactNode
}

export function GraphQLProvider({ children }: GraphQLProviderProps) {
  const { getToken, userId } = useAuth()

  const client = useMemo(() => {
    // HTTP link for GraphQL endpoint
    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/api/graphql',
    })

    // Auth link to add Clerk token to requests
    const authLink = setContext(async (_, { headers }) => {
      let token = null
      
      if (getToken) {
        try {
          token = await getToken()
        } catch (error) {
          console.log('Error getting Clerk token:', error)
        }
      }

      return {
        headers: {
          ...headers,
          ...(token && { authorization: `Bearer ${token}` }),
          ...(userId && { 'x-clerk-user-id': userId }),
        },
      }
    })

    // Production logging link for detailed operation tracking
    const loggingLink = new ApolloLink((operation, forward) => {
      const startTime = Date.now();
      const operationName = operation.operationName;
      const operationType = operation.query.definitions[0]?.kind === 'OperationDefinition' 
        ? operation.query.definitions[0].operation 
        : 'unknown';

      // Log operation start
      console.log(`🚀 [GraphQL] Starting ${operationType}: ${operationName}`, {
        variables: operation.variables,
        context: operation.getContext(),
        timestamp: new Date().toISOString()
      });

      return forward(operation).map((result) => {
        const duration = Date.now() - startTime;
        
        // Log successful completion
        console.log(`✅ [GraphQL] Completed ${operationType}: ${operationName} (${duration}ms)`, {
          dataSize: result.data ? JSON.stringify(result.data).length : 0,
          hasData: !!result.data,
          hasErrors: !!(result.errors && result.errors.length > 0),
          errorCount: result.errors?.length || 0,
          duration
        });

        // Log detailed errors if present
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach((error, index) => {
            console.error(`❌ [GraphQL] Error ${index + 1} in ${operationName}:`, {
              message: error.message,
              path: error.path,
              locations: error.locations,
              extensions: error.extensions
            });
          });
        }

        return result;
      });
    });

    // Error link for handling GraphQL errors
    const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
      const operationName = operation.operationName || 'Unknown';
      
      if (graphQLErrors) {
        console.error(`🔥 [GraphQL] ${graphQLErrors.length} GraphQL error(s) in ${operationName}:`);
        graphQLErrors.forEach(({ message, locations, path, extensions }, index) => {
          console.error(`   Error ${index + 1}:`, {
            message,
            locations,
            path,
            extensions,
            operationName,
            variables: operation.variables
          });
        });
      }

      if (networkError) {
        console.error(`🌐 [GraphQL] Network error in ${operationName}:`, {
          message: networkError.message,
          stack: networkError.stack,
          statusCode: 'statusCode' in networkError ? networkError.statusCode : undefined,
          operationName,
          variables: operation.variables
        });
        
        // Handle specific network errors with detailed logging
        if ('statusCode' in networkError) {
          switch (networkError.statusCode) {
            case 401:
              console.error('🔒 [AUTH] Unauthorized access - user may need to sign in');
              break;
            case 403:
              console.error('🚫 [AUTH] Forbidden - insufficient permissions');
              break;
            case 500:
              console.error('💥 [SERVER] Internal server error - check server logs');
              break;
            case 502:
            case 503:
            case 504:
              console.error('🔧 [SERVER] Server unavailable - possible deployment or maintenance');
              break;
            default:
              console.error(`⚠️ [NETWORK] HTTP ${networkError.statusCode} error`);
          }
        }
      }
    })

    return new ApolloClient({
      link: from([errorLink, loggingLink, authLink, httpLink]),
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
  }, [getToken, userId])

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}