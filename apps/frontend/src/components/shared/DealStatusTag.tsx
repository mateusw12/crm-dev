'use client';

import { Tag } from 'antd';
import type { DealStatus } from '@/lib/dto';

const statusConfig: Record<DealStatus, { color: string; label: string }> = {
  LEAD: { color: 'purple', label: 'Lead' },
  CONTACTED: { color: 'blue', label: 'Contacted' },
  PROPOSAL: { color: 'cyan', label: 'Proposal' },
  NEGOTIATION: { color: 'gold', label: 'Negotiation' },
  WON: { color: 'green', label: 'Won' },
  LOST: { color: 'red', label: 'Lost' },
};

export function DealStatusTag({ status }: { status: DealStatus }) {
  const config = statusConfig[status] ?? { color: 'default', label: status };
  return <Tag color={config.color}>{config.label}</Tag>;
}
