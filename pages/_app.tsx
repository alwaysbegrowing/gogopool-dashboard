import "@/styles/globals.css";
import "@/styles/discordMessage.css";

import type { AppProps } from "next/app";
import { WagmiConfig, createClient } from "wagmi";
import { Analytics } from "@vercel/analytics/react";
import { avalanche } from "@wagmi/core/chains";
import { configureChains } from "@wagmi/core";

import Meta from "../components/Layout/Meta";
import { ConfigProvider } from "antd";
import { publicProvider } from "@wagmi/core/providers/public";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const { provider } = configureChains([avalanche], [publicProvider()]);

const client = createClient({
  provider,
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#5D43EF",
        },
      }}
    >
      <Meta />
      <WagmiConfig client={client}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </WagmiConfig>

      <Analytics />
    </ConfigProvider>
  );
}
