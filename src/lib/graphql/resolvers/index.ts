import { GraphQLScalarType } from 'graphql'
import { GraphQLJSON } from 'graphql-type-json'
import { quizResolvers } from './quiz'
import { userResolvers } from './user'
import { sharingResolvers } from './sharing'
import { scoringResolvers } from './scoring'

// Custom DateTime scalar
const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'A date-time string at UTC, such as 2007-12-03T10:15:30Z',
  serialize(value: any) {
    if (value instanceof Date) {
      return value.toISOString()
    }
    if (typeof value === 'string') {
      return new Date(value).toISOString()
    }
    throw new Error('Value must be a Date or date string')
  },
  parseValue(value: any) {
    if (typeof value === 'string') {
      return new Date(value)
    }
    throw new Error('Value must be a string')
  },
  parseLiteral(ast: any) {
    if (ast.kind === 'StringValue') {
      return new Date(ast.value)
    }
    throw new Error('Value must be a string')
  },
})

export const resolvers = {
  // Custom scalars
  DateTime: DateTimeScalar,
  JSON: GraphQLJSON,
  
  Query: {
    ...quizResolvers.Query,
    ...userResolvers.Query,
    ...sharingResolvers.Query,
    ...scoringResolvers.Query,
  },
  
  Mutation: {
    ...quizResolvers.Mutation,
    ...userResolvers.Mutation,
    ...sharingResolvers.Mutation,
    ...scoringResolvers.Mutation,
  },
  
  Subscription: {
    ...quizResolvers.Subscription,
  },
  
  // Type resolvers
  PersonalityType: {
    traits: (parent: any) => {
      // Map database fields to GraphQL traits structure
      // Convert hyphenated values to underscore format for GraphQL enums
      return {
        workStyle: parent.workStyle,
        decisionProcess: parent.decisionProcess?.replace('-', '_'),
        communicationStyle: parent.communicationStyle,
        focusOrientation: parent.focusOrientation?.replace('-', '_'),
        teamInteraction: parent.teamInteraction
      }
    }
  },
}