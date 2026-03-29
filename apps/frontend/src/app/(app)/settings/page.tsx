"use client";

import { AuthService } from "@/lib/services/index";
import { Card, Typography, Space, Select, Avatar } from "antd";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import useSWR from "swr";

const { Title, Text } = Typography;

export default function SettingsPage() {
  const { data: session } = useSession();
  const tNav = useTranslations("nav");
  const tProfile = useTranslations("profile");

  const { data: profile } = useSWR("auth/me", AuthService.getUser);

  const changeLocale = async (locale: string) => {
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });
    window.location.reload();
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        {tNav("settings")}
      </Title>

      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Card
          title={tProfile("title")}
          bordered={false}
          style={{ borderRadius: 12 }}
        >
          <Space size="large">
            <Avatar
              size={64}
              src={session?.user?.image}
              style={{ background: "#6366f1", fontSize: 24 }}
            >
              {session?.user?.name?.[0] ?? "U"}
            </Avatar>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {session?.user?.name}
              </Title>
              <Text type="secondary">{session?.user?.email}</Text>
              <br />
              {profile?.role && (
                <Text>
                  {tProfile("role")}:{" "}
                  <strong>{tProfile(`roles.${profile.role}`)}</strong>
                </Text>
              )}
            </div>
          </Space>
        </Card>

        <Card
          title="Language / Idioma"
          bordered={false}
          style={{ borderRadius: 12 }}
        >
          <Space>
            <Text>Interface language:</Text>
            <Select
              defaultValue="en"
              style={{ width: 160 }}
              onChange={changeLocale}
              options={[
                { value: "en", label: "English" },
                { value: "pt", label: "Português" },
              ]}
            />
          </Space>
        </Card>
      </Space>
    </div>
  );
}
