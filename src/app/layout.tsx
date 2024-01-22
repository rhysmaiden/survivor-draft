"use client";

import "./globals.css";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        >
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <div key="1" className="flex flex-col min-h-screen">
              <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
                <Link className="flex items-center gap-2" href="/">
                  <span className="text-lg font-semibold">Draft</span>
                </Link>
                <Button
                  className="rounded-full border border-gray-200 w-8 h-8"
                  size="icon"
                  variant="outline"
                >
                  <img
                    alt="Avatar"
                    className="rounded-full"
                    height="32"
                    src="/placeholder.svg"
                    style={{
                      aspectRatio: "32/32",
                      objectFit: "cover",
                    }}
                    width="32"
                  />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </div>
              <div className="flex flex-1 overflow-hidden ">
                <main className="w-full">{children}</main>
              </div>
            </div>
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </body>
    </html>
  );
}
