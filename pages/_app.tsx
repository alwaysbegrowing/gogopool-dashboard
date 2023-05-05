import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Analytics } from "@vercel/analytics/react";

import Meta from "../components/Layout/Meta";
import { Button, ConfigProvider, theme } from "antd";
import { green } from "@ant-design/colors";
import Layout from "../components/Layout/Layout";
import { GithubOutlined } from "@ant-design/icons";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: green.primary,
        },
      }}
    >
      <Meta />
      <Layout
        headerExtra={
          <Button
            size="large"
            type="ghost"
            href="https://github.com/alwaysbegrowing/gogopool-dashboard"
            icon={<GithubOutlined style={{ color: "white" }} />}
          ></Button>
        }
      >
        <Component {...pageProps} />
      </Layout>

      <Analytics />
    </ConfigProvider>
  );
}
