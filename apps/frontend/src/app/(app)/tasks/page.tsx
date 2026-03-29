"use client";

import { useState } from "react";
import {
  Button,
  Table,
  Space,
  Popconfirm,
  Tag,
  Typography,
  App,
  Select,
  Checkbox,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import type { TaskResponse } from "@/lib/dto";
import { TaskStatus } from "@/lib/dto";
import { TaskModal } from "@/components/tasks/TaskModal";
import { format } from "date-fns";
import { TasksService } from "@/lib/services/index";

const { Title } = Typography;

export default function TasksPage() {
  const t = useTranslations("tasks");
  const tCommon = useTranslations("common");
  const { message } = App.useApp();
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);

  const {
    data: tasks = [],
    isLoading,
    mutate,
  } = useSWR(["tasks", status], () =>
    TasksService.getAll(status ? { status } : {}),
  );

  const handleDelete = async (id: string) => {
    try {
      await TasksService.delete(id);
      message.success(tCommon("success"));
      mutate();
    } catch {
      message.error(tCommon("error"));
    }
  };

  const handleToggleDone = async (task: TaskResponse) => {
    const newStatus: TaskStatus =
      task.status === TaskStatus.DONE ? TaskStatus.PENDING : TaskStatus.DONE;
    try {
      await TasksService.update(task.id, { status: newStatus });
      mutate();
    } catch {
      message.error(tCommon("error"));
    }
  };

  const isOverdue = (task: TaskResponse) =>
    task.status === "PENDING" &&
    task.due_date &&
    new Date(task.due_date) < new Date();

  const columns = [
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
      dataIndex: "dueDate",
      key: "dueDate",
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
    {
      title: tCommon("actions"),
      key: "actions",
      render: (_: unknown, record: TaskResponse) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingTask(record);
              setModalOpen(true);
            }}
          />
          <Popconfirm
            title={t("deleteConfirm")}
            onConfirm={() => handleDelete(record.id)}
            okText={tCommon("yes")}
            cancelText={tCommon("no")}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
        >
          {t("new")}
        </Button>
      </div>

      <Select
        allowClear
        placeholder={tCommon("filter")}
        style={{ marginBottom: 16, width: 160 }}
        onChange={setStatus}
        options={[
          { value: "PENDING", label: t("status.PENDING") },
          { value: "DONE", label: t("status.DONE") },
        ]}
      />

      <Table
        dataSource={tasks}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        style={{ background: "#fff", borderRadius: 12 }}
      />

      <TaskModal
        open={modalOpen}
        task={editingTask}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          mutate();
        }}
      />
    </div>
  );
}
