import { ReactNode, useState } from "react";
import { Layout, Space, Grid, Button, Menu } from "antd";
import Link from "next/link";
import CustomFooter from "./Footer";
import { CSSProperties } from "react";
import { GithubOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useRouter } from "next/router";
// import Image from "next/image";
// import {
//   AppstoreOutlined,
//   MailOutlined,
//   SettingOutlined,
// } from "@ant-design/icons";

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

interface LayoutProps {
  children: ReactNode;
  contentStyle?: CSSProperties;
  headerExtra?: any;
}
const items: MenuProps["items"] = [
  {
    label: "Home",
    key: "/",
    // icon: <MailOutlined />,
  },
  {
    label: "Contracts",
    key: "/contracts",
    // icon: <AppstoreOutlined />,
  },
  {
    label: "Events",
    key: "/events",
    // icon: <AppstoreOutlined />,
  },
  {
    label: "Calculator",
    key: "/calculator",
  },
];
export default function CustomLayout({
  children,
  contentStyle,
  headerExtra,
}: LayoutProps) {
  const headerHeight = 48;
  const screens = useBreakpoint();
  const [current, setCurrent] = useState("mail");
  const router = useRouter();
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    router.push(e.key);
  };
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#F7F9FF" }}>
      <Header
        style={{
          textAlign: "right",
          height: headerHeight,
          backgroundColor: "white",
          lineHeight: `${headerHeight}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space size="large">
          <Link href="/">
            <img
              src="https://miro.medium.com/v2/resize:fill:176:176/1*DkTmcsAk4ARPrWCrXZH20Q.png"
              alt="GoGoPool Logo"
              style={{
                color: "red",
                marginTop: "18px",
                height: "36px",
                borderRadius: "50%",
              }}
            />
          </Link>
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
          />
        </Space>
        <Space>
          {headerExtra}{" "}
          <Button
            size="large"
            type="ghost"
            href="https://github.com/alwaysbegrowing/gogopool-dashboard"
            icon={<GithubOutlined />}
          ></Button>
        </Space>
      </Header>
      <Content
        style={{
          paddingTop: "24px",
          paddingRight: screens.sm ? 48 : 16,
          paddingLeft: screens.sm ? 48 : 16,
          height: `calc(100% - ${headerHeight}px)`,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          ...contentStyle,
        }}
      >
        {children}
        <CustomFooter />
      </Content>
    </Layout>
  );
}
