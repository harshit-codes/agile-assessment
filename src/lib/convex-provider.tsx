"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
console.log("Convex URL:", convexUrl);

if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not set");
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}