import { Layout } from "antd";

const { Footer } = Layout;

export default function CustomFooter() {
  return (
    <Footer
      style={{
        backgroundColor: "#F7F9FF",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        bottom: 0,
        width: "100%",
      }}
    >
      <span>GoGoPool ©{new Date().getFullYear()}</span>
    </Footer>
  );
}
