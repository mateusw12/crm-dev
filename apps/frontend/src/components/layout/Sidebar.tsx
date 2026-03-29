"use client";

import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { MENU_ITEMS } from "@/lib/config/menuItems";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");

  const items = MENU_ITEMS.map((it) => ({
    key: it.key,
    icon: it.icon,
    label: t(it.label),
  }));

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      style={{ background: "transparent", border: "none", marginTop: 8 }}
      items={items.map((item) => ({
        ...item,
        style: {
          color: pathname === item?.key ? "#6366f1" : "#94a3b8",
          borderRadius: 8,
          marginInline: 8,
        },
        onClick: () => router.push(String(item?.key)),
      }))}
      theme="dark"
    />
  );
}
