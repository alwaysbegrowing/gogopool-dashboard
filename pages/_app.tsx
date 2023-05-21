import "@/styles/globals.css";
import "@/styles/discordMessage.css";

import type { AppProps } from "next/app";
import { WagmiConfig, createClient } from "wagmi";
import { Analytics } from "@vercel/analytics/react";
import { avalanche } from "@wagmi/core/chains";
import { configureChains } from "@wagmi/core";

import Meta from "../components/Layout/Meta";
import { Button, ConfigProvider, theme } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { publicProvider } from "@wagmi/core/providers/public";

const { provider } = configureChains([avalanche], [publicProvider()]);

const client = createClient({
  provider,
});

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
        <Component {...pageProps} />
      </WagmiConfig>

      <Analytics />
    </ConfigProvider>
  );
}
