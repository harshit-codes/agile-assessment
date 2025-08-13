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

// Simple debug to check if client initializes
console.log("🔍 Debug - ConvexReactClient created successfully");

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}