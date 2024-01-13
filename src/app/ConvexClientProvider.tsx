"use client";
import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

console.log(process.env.NEXT_PUBLIC_CONVEX_URL);
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  console.log(children);
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
