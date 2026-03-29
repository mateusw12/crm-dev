"use client";

import { Button, Dropdown, Space, Badge, Avatar, Typography } from "antd";
import {
  GlobalOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { changeLocale } from "@/lib/locale/changeLocale";
import { NotificationsService } from "@/lib/services/index";

const { Text } = Typography;

export default function HeaderBar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");

  const { data: notifications } = useSWR(
    "notifications",
    NotificationsService.getAll,
    {
      refreshInterval: 30000,
    },
  );
  const unreadCount = (notifications ?? []).filter((item) => !item.read).length;

  const userMenuItems = [
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: t("settings"),
      onClick: () => router.push("/settings"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: tAuth("signOut"),
      onClick: () => signOut({ callbackUrl: "/auth/signin" }),
      danger: true,
    },
  ];

  return (
    <>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
      />
      <Space>
        <Dropdown
          menu={{
            items: [
              {
                key: "en",
                label: "English",
                onClick: () => changeLocale("en"),
              },
              {
                key: "pt",
                label: "Português",
                onClick: () => changeLocale("pt"),
              },
            ],
          }}
        >
          <Button type="text" icon={<GlobalOutlined />} />
        </Dropdown>

        <Badge count={unreadCount} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            onClick={() => router.push("/notifications")}
          />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }}>
          <Space style={{ cursor: "pointer" }}>
            <Avatar
              src={session?.user?.image}
              style={{ background: "#6366f1" }}
            >
              {session?.user?.name?.[0] ?? "U"}
            </Avatar>
            <Text style={{ display: "none" }}>{session?.user?.name}</Text>
          </Space>
        </Dropdown>
      </Space>
    </>
  );
}
