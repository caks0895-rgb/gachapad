"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base, baseSepolia } from "wagmi/chains";
import type { ReactNode } from "react";
import { useState } from "react";
import "@coinbase/onchainkit/styles.css";

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "84532");
const chain = chainId === 8453 ? base : baseSepolia;

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={chain}
        config={{
          appearance: {
            mode: "light",
            theme: "default",
          },
          wallet: {
            display: "modal",
            preference: "all",
          },
        }}
      >
        {children}
      </OnchainKitProvider>
    </QueryClientProvider>
  );
}
