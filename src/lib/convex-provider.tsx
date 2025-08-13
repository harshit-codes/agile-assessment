"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
console.log("🔍 Debug - Convex URL:", convexUrl);
console.log("🔍 Debug - Environment:", process.env.NODE_ENV);

if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not set");
}

const convex = new ConvexReactClient(convexUrl);

// Add connection event listeners for debugging
convex.connectionState().subscribe((state) => {
  console.log("🔍 Debug - Convex connection state:", state);
});

// Add a test to verify the client can connect
if (typeof window !== 'undefined') {
  convex.query("quiz:getQuiz" as any, {}).then((result) => {
    console.log("🔍 Debug - Test query result:", result);
  }).catch((error) => {
    console.error("🔍 Debug - Test query error:", error);
  });
}

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}