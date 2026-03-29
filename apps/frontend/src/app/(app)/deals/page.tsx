"use client";

import { useState } from "react";
import { Button, Typography, Spin, Space } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { DealResponse } from "@/lib/dto";
import { DealStatus } from "@/lib/dto";
import { KanbanColumn } from "@/components/deals/KanbanColumn";
import { KanbanCard } from "@/components/deals/KanbanCard";
import { DealModal } from "@/components/deals/DealModal";
import { DealsService } from "@/lib/services/index";
import { handleApiError } from "@/lib/api";

const { Title } = Typography;

const DEAL_STATUSES: DealStatus[] = [
  DealStatus.LEAD,
  DealStatus.CONTACTED,
  DealStatus.PROPOSAL,
  DealStatus.NEGOTIATION,
  DealStatus.WON,
  DealStatus.LOST,
];

const STATUS_COLORS: Record<DealStatus, string> = {
  LEAD: "#6366f1",
  CONTACTED: "#8b5cf6",
  PROPOSAL: "#0ea5e9",
  NEGOTIATION: "#f59e0b",
  WON: "#10b981",
  LOST: "#ef4444",
};

export default function DealsPage() {
  const t = useTranslations("deals");
  const tCommon = useTranslations("common");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<DealResponse | null>(null);
  const [activeDeal, setActiveDeal] = useState<DealResponse | null>(null);
  const [exporting, setExporting] = useState(false);

  const {
    data: deals = [],
    isLoading,
    mutate,
  } = useSWR<DealResponse[]>("deals", () => DealsService.getAll());

  const handleExport = async () => {
    setExporting(true);
    try {
      await DealsService.exportCsv();
    } catch (error) {
      handleApiError(error);
    } finally {
      setExporting(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const deal = deals.find((d) => d.id === event.active.id);
    setActiveDeal(deal ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over) return;

    const dealId = active.id as string;
    const newStatus = over.id as DealStatus;
    const deal = deals.find((d) => d.id === dealId);

    if (!deal || deal.status === newStatus) return;

    // Optimistic update
    const updated = deals.map((d) =>
      d.id === dealId ? { ...d, status: newStatus } : d,
    );
    mutate(updated, false);

    try {
      await DealsService.update(dealId, { status: newStatus });
      mutate();
    } catch (error) {
      handleApiError(error);
      mutate();
    }
  };

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const dealsByStatus = DEAL_STATUSES.reduce(
    (acc, status) => ({
      ...acc,
      [status]: deals.filter((d) => d.status === status),
    }),
    {} as Record<DealStatus, DealResponse[]>,
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          {t("title")}
        </Title>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            loading={exporting}
            onClick={handleExport}
          >
            {tCommon("export")} CSV
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingDeal(null);
              setModalOpen(true);
            }}
          >
            {t("new")}
          </Button>
        </Space>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            paddingBottom: 16,
            minHeight: "calc(100vh - 180px)",
          }}
        >
          {DEAL_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              color={STATUS_COLORS[status]}
              deals={dealsByStatus[status] ?? []}
              onEdit={(deal) => {
                setEditingDeal(deal);
                setModalOpen(true);
              }}
              onDelete={async (id) => {
                await DealsService.delete(id);
                mutate();
              }}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDeal && <KanbanCard deal={activeDeal} overlay />}
        </DragOverlay>
      </DndContext>

      <DealModal
        open={modalOpen}
        deal={editingDeal}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          mutate();
        }}
      />
    </div>
  );
}
