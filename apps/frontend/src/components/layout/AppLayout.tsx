"use client";

import { useState, useEffect } from "react";
import { Layout } from "antd";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/layout/Sidebar";
import HeaderBar from "@/components/layout/HeaderBar";

const { Header, Sider, Content } = Layout;

const SIDER_BG = "#0f172a";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if ((session as any)?.error === "TokenExpired") {
      (async () => {
        const { signOut } = await import("next-auth/react");
        signOut({ callbackUrl: "/auth/signin" });
      })();
    }
  }, [session]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={240}
        style={{
          background: SIDER_BG,
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            paddingInline: collapsed ? 0 : 20,
            borderBottom: "1px solid #1e293b",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 24 }}>📊</span>
          {!collapsed && (
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>
              CRM
            </div>
          )}
        </div>

        <Sidebar />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 240,
          transition: "margin-left 0.2s",
        }}
      >
        <Header
          style={{
            background: "#fff",
            paddingInline: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            position: "sticky",
            top: 0,
            zIndex: 99,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <HeaderBar collapsed={collapsed} setCollapsed={setCollapsed} />
          </div>
        </Header>

        <Content style={{ padding: 24, minHeight: "calc(100vh - 64px)" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
