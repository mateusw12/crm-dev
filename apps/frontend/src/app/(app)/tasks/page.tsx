"use client";

import { useState } from "react";
import { Tag, Checkbox, Select } from "antd";
import type { TableColumnsType } from "antd";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import type { TaskResponse } from "@/lib/dto";
import { TaskStatus } from "@/lib/dto";
import { TaskModal } from "@/components/tasks/TaskModal";
import { format } from "date-fns";
import { TasksService } from "@/lib/services/index";
import { FormGrid } from "@/components/shared/FormGrid";
import { showSuccess } from "@/components/shared/notification/notificationService";
import { handleApiError } from "@/lib/api";

export default function TasksPage() {
  const t = useTranslations("tasks");
  const tCommon = useTranslations("common");
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);

  const { data, isLoading, mutate } = useSWR(
    ['tasks', status, page],
    () => TasksService.getAll(status ? { status, page, limit: 20 } : { page, limit: 20 }),
    { keepPreviousData: true },
  );

  const handleRemove = async (record: TaskResponse) => {
    try {
      await TasksService.delete(record.id);
      showSuccess();
      mutate();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleToggleDone = async (task: TaskResponse) => {
    const newStatus: TaskStatus =
      task.status === TaskStatus.DONE ? TaskStatus.PENDING : TaskStatus.DONE;
    try {
      await TasksService.update(task.id, { status: newStatus });
      mutate();
    } catch (error) {
      handleApiError(error);
    }
  };

  const isOverdue = (task: TaskResponse) =>
    task.status === "PENDING" &&
    task.due_date &&
    new Date(task.due_date) < new Date();

  const columns: TableColumnsType<TaskResponse> = [
    {
      title: "",
      key: "checkbox",
      width: 40,
      render: (_: unknown, record: TaskResponse) => (
        <Checkbox
          checked={record.status === "DONE"}
          onChange={() => handleToggleDone(record)}
        />
      ),
    },
    {
      title: tCommon("title"),
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text: string, record: TaskResponse) => (
        <span
          style={{
            textDecoration: record.status === "DONE" ? "line-through" : "none",
            color: record.status === "DONE" ? "#94a3b8" : "inherit",
          }}
        >
          {isOverdue(record) && (
            <Tag color="red" style={{ marginRight: 6 }}>
              {t("overdue")}
            </Tag>
          )}
          {text}
        </span>
      ),
    },
    {
      title: t("dueDate"),
      dataIndex: "due_date",
      key: "due_date",
      render: (v: string) => (v ? format(new Date(v), "dd/MM/yyyy") : "—"),
    },
    {
      title: tCommon("status"),
      dataIndex: "status",
      key: "status",
      render: (v: TaskStatus) => (
        <Tag color={v === "DONE" ? "green" : "orange"}>{t(`status.${v}`)}</Tag>
      ),
    },
  ];

  return (
    <>
      <FormGrid<TaskResponse>
        dataSource={data?.data ?? []}
        columns={columns}
        loading={isLoading}
        addButtonLabel={t("new")}
        searchPlaceholder={tCommon("search")}
        pagination={{
          total: data?.total,
          current: page,
          pageSize: 20,
          onChange: setPage,
          showTotal: (total) => `${tCommon('total')}: ${total}`,
        }}
        onAdd={() => { setEditingTask(null); setModalOpen(true); }}
        onEdit={(record) => { setEditingTask(record); setModalOpen(true); }}
        onRemove={handleRemove}
        extraToolbar={
          <Select
            allowClear
            placeholder={tCommon("filter")}
            style={{ width: 160 }}
            onChange={(v) => { setStatus(v); setPage(1); }}
            options={[
              { value: "PENDING", label: t("status.PENDING") },
              { value: "DONE", label: t("status.DONE") },
            ]}
          />
        }
      />

      <TaskModal
        open={modalOpen}
        task={editingTask}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { setModalOpen(false); mutate(); }}
      />
    </>
  );
}