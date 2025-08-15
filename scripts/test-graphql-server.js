/**
 * Script to test GraphQL server locally to identify compilation issues
 * Run with: node scripts/test-graphql-server.js
 */

// Import the GraphQL server components
async function testGraphQLServer() {
  try {
    console.log('🔍 Testing GraphQL server components...')
    
    // Test 1: Can we import and create the schema?
    console.log('\n1️⃣ Testing schema import...')
    try {
      const { readFileSync } = await import('fs')
      const { join } = await import('path')
      
      const typeDefs = readFileSync(
        join(process.cwd(), 'src/lib/graphql/schema.graphql'),
        'utf8'
      )
      console.log(`✅ Schema file loaded (${typeDefs.length} chars)`)
      
      const firstLines = typeDefs.split('\n').slice(0, 5).join('\n')
      console.log(`   Preview: ${firstLines}...`)
      
    } catch (error) {
      console.error('❌ Schema loading failed:', error.message)
      return
    }
    
    // Test 2: Can we import resolvers?
    console.log('\n2️⃣ Testing resolver imports...')
    try {
      const resolversModule = await import('../src/lib/graphql/resolvers/index.js')
      console.log('✅ Resolvers imported successfully')
      
      const resolvers = resolversModule.resolvers
      console.log(`   Query resolvers: ${Object.keys(resolvers.Query || {}).length}`)
      console.log(`   Mutation resolvers: ${Object.keys(resolvers.Mutation || {}).length}`)
      
      // Check if specific resolver exists
      if (resolvers.Query?.getPublicResult) {
        console.log('✅ getPublicResult resolver found')
      } else {
        console.log('❌ getPublicResult resolver missing')
      }
      
    } catch (error) {
      console.error('❌ Resolver import failed:', error.message)
      console.error('Full error:', error)
      return
    }
    
    // Test 3: Can we create executable schema?
    console.log('\n3️⃣ Testing schema compilation...')
    try {
      const { makeExecutableSchema } = await import('@graphql-tools/schema')
      const { readFileSync } = await import('fs')
      const { join } = await import('path')
      const resolversModule = await import('../src/lib/graphql/resolvers/index.js')
      
      const typeDefs = readFileSync(
        join(process.cwd(), 'src/lib/graphql/schema.graphql'),
        'utf8'
      )
      
      const schema = makeExecutableSchema({
        typeDefs,
        resolvers: resolversModule.resolvers,
      })
      
      console.log('✅ Executable schema created successfully')
      
    } catch (error) {
      console.error('❌ Schema compilation failed:', error.message)
      console.error('Full error:', error)
      return
    }
    
    // Test 4: Can we create Apollo Server?
    console.log('\n4️⃣ Testing Apollo Server creation...')
    try {
      const { ApolloServer } = await import('@apollo/server')
      const { makeExecutableSchema } = await import('@graphql-tools/schema')
      const { readFileSync } = await import('fs')
      const { join } = await import('path')
      const resolversModule = await import('../src/lib/graphql/resolvers/index.js')
      
      const typeDefs = readFileSync(
        join(process.cwd(), 'src/lib/graphql/schema.graphql'),
        'utf8'
      )
      
      const schema = makeExecutableSchema({
        typeDefs,
        resolvers: resolversModule.resolvers,
      })
      
      const server = new ApolloServer({
        schema,
        introspection: true,
      })
      
      console.log('✅ Apollo Server created successfully')
      
    } catch (error) {
      console.error('❌ Apollo Server creation failed:', error.message)
      console.error('Full error:', error)
      return
    }
    
    // Test 5: Try to execute a simple query
    console.log('\n5️⃣ Testing query execution...')
    try {
      const { ApolloServer } = await import('@apollo/server')
      const { makeExecutableSchema } = await import('@graphql-tools/schema')
      const { readFileSync } = await import('fs')
      const { join } = await import('path')
      const resolversModule = await import('../src/lib/graphql/resolvers/index.js')
      
      const typeDefs = readFileSync(
        join(process.cwd(), 'src/lib/graphql/schema.graphql'),
        'utf8'
      )
      
      const schema = makeExecutableSchema({
        typeDefs,
        resolvers: resolversModule.resolvers,
      })
      
      const server = new ApolloServer({
        schema,
        introspection: true,
      })
      
      await server.start()
      
      // Try introspection query
      const result = await server.executeOperation({
        query: `{ __schema { types { name } } }`,
      })
      
      if (result.body.kind === 'single') {
        if (result.body.singleResult.errors) {
          console.log('❌ Query execution had errors:')
          result.body.singleResult.errors.forEach(error => {
            console.log(`   - ${error.message}`)
          })
        } else {
          console.log('✅ Introspection query executed successfully')
          const typeCount = result.body.singleResult.data?.__schema?.types?.length || 0
          console.log(`   Found ${typeCount} GraphQL types`)
        }
      }
      
      await server.stop()
      
    } catch (error) {
      console.error('❌ Query execution failed:', error.message)
      console.error('Full error:', error)
      return
    }
    
    console.log('\n🎉 All GraphQL server tests completed!')
    
  } catch (error) {
    console.error('❌ Overall test failed:', error.message)
    console.error('Full error:', error)
  }
}

// Run the test
testGraphQLServer()