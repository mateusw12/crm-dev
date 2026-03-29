'use client';

import { Calendar, Badge, Card, Typography, Spin, Tag } from 'antd';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import type { Dayjs } from 'dayjs';
import type { TaskResponse } from '@/lib/dto';
import { format } from 'date-fns';
import { TasksService } from '@/lib/services/index';

const { Title } = Typography;

export default function CalendarPage() {
  const t = useTranslations('tasks');
  const tNav = useTranslations('nav');

  const { data: tasks = [], isLoading } = useSWR<TaskResponse[]>('tasks-calendar', () =>
    TasksService.getAll({}),
  );

  const getTasksForDate = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    return tasks.filter((task) => {
      if (!task.due_date) return false;
      return format(new Date(task.due_date), 'yyyy-MM-dd') === dateStr;
    });
  };

  const dateCellRender = (date: Dayjs) => {
    const dayTasks = getTasksForDate(date);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dayTasks.slice(0, 3).map((task) => (
          <li key={task.id}>
            <Badge
              status={
                task.status === 'DONE'
                  ? 'success'
                  : new Date(task.due_date!) < new Date()
                  ? 'error'
                  : 'processing'
              }
              text={
                <span style={{ fontSize: 11 }}>
                  {task.title.length > 20 ? task.title.slice(0, 20) + '…' : task.title}
                </span>
              }
            />
          </li>
        ))}
        {dayTasks.length > 3 && (
          <li>
            <Tag style={{ fontSize: 10 }}>+{dayTasks.length - 3} more</Tag>
          </li>
        )}
      </ul>
    );
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        {tNav('calendar')}
      </Title>
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Calendar cellRender={dateCellRender} />
      </Card>
    </div>
  );
}
