import { ReactNode } from "react";
import { Layout, Space, Grid } from "antd";
import Link from "next/link";
import CustomFooter from "./Footer";
import { CSSProperties } from "react";

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

interface LayoutProps {
  children: ReactNode;
  contentStyle?: CSSProperties;
  headerExtra?: any;
}

export default function CustomLayout({
  children,
  contentStyle,
  headerExtra,
}: LayoutProps) {
  const headerHeight = 48;
  const screens = useBreakpoint();

  return (
    <Layout
      style={{ minHeight: "100vh", backgroundColor: "#F7F9FF" }}
      className="blur"
    >
      <Header
        style={{
          textAlign: "right",
          height: headerHeight,
          backgroundColor: "#5D43EF",
          lineHeight: `${headerHeight}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link href="/">
          <img
            src="https://www.gitbook.com/cdn-cgi/image/width=256,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F4110555085-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FJnYoMAcIL3VICHojy1yR%252Flogo%252F0Ya4NXRPrRLznTAgzPL0%252Fggp-logo-white%25403x.png%3Falt%3Dmedia%26token%3Dd461fb79-9986-4177-8db4-c08184b0a1c5"
            alt="GoGoPool Logo"
            style={{
              marginTop: "18px",
              height: "36px",
            }}
          />
        </Link>
        <Space>{headerExtra}</Space>
      </Header>
      <Content
        style={{
          paddingTop: "24px",
          paddingRight: screens.lg ? 48 : 8,
          paddingLeft: screens.lg ? 48 : 8,
          height: `calc(100% - ${headerHeight}px)`,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          ...contentStyle,
        }}
      >
        <div>{children}</div>
        <CustomFooter />
      </Content>
    </Layout>
  );
}
