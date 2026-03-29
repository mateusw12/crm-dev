"use client";

import { useDroppable } from "@dnd-kit/core";
import { Badge, Space, Typography } from "antd";
import { useTranslations } from "next-intl";
import type { DealResponse, DealStatus } from "@/lib/dto";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  status: DealStatus;
  color: string;
  deals: DealResponse[];
  onEdit: (deal: DealResponse) => void;
  onDelete: (id: string) => void;
}

export function KanbanColumn({
  status,
  color,
  deals,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const t = useTranslations("deals");
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const totalValue = deals.reduce((sum, d) => sum + (d.value ?? 0), 0);

  return (
    <div
      ref={setNodeRef}
      className="kanban-column"
      style={{
        flexShrink: 0,
        width: 280,
        background: isOver ? "#f0f4ff" : "#f8fafc",
        borderRadius: 12,
        border: `2px solid ${isOver ? color : "#e2e8f0"}`,
        padding: 12,
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      {/* Column header */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Space>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: color,
              }}
            />
            <Typography.Text strong style={{ fontSize: 13, color: "#334155" }}>
              {t(`status.${status}`)}
            </Typography.Text>
            <Badge
              count={deals.length}
              style={{ background: color }}
              showZero
            />
          </Space>
        </div>
        <Typography.Text
          style={{
            fontSize: 12,
            color: "#64748b",
            marginTop: 4,
            display: "block",
          }}
        >
          ${totalValue.toLocaleString()}
        </Typography.Text>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {deals.map((deal) => (
          <KanbanCard
            key={deal.id}
            deal={deal}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
