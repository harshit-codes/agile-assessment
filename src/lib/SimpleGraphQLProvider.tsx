"use client"

interface SimpleGraphQLProviderProps {
  children: React.ReactNode
}

// Minimal provider that bypasses Apollo Client for testing
export function SimpleGraphQLProvider({ children }: SimpleGraphQLProviderProps) {
  console.log("🟡 SimpleGraphQLProvider: Rendering without Apollo Client");
  
  return (
    <div data-testid="simple-graphql-provider">
      {children}
    </div>
  )
}

export default SimpleGraphQLProvider;