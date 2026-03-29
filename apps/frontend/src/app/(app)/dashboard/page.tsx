'use client';

import { Card, Col, Row, Statistic, Typography, Spin } from 'antd';
import {
  TeamOutlined,
  FundOutlined,
  DollarOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import { DealStatusTag } from '@/components/shared/DealStatusTag';
import { DashboardService } from '@/lib/services/index';
import { DashboardKpisResponse } from '@/lib/dto/dashboard.dto';

const { Title } = Typography;

const DEAL_COLORS: Record<string, string> = {
  LEAD: '#6366f1',
  CONTACTED: '#8b5cf6',
  PROPOSAL: '#0ea5e9',
  NEGOTIATION: '#f59e0b',
  WON: '#10b981',
  LOST: '#ef4444',
};

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { data, isLoading } = useSWR<DashboardKpisResponse>('dashboard/kpis', DashboardService.kpis);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  const kpis = data ?? ({} as DashboardKpisResponse);

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        {t('title')}
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card" bordered={false} style={{ borderRadius: 12 }}>
            <Statistic
              title={t('totalContacts')}
              value={kpis.totalContacts ?? 0}
              prefix={<TeamOutlined style={{ color: '#6366f1' }} />}
              valueStyle={{ color: '#6366f1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card" bordered={false} style={{ borderRadius: 12 }}>
            <Statistic
              title={t('openDeals')}
              value={kpis.openDeals ?? 0}
              prefix={<FundOutlined style={{ color: '#0ea5e9' }} />}
              valueStyle={{ color: '#0ea5e9' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card" bordered={false} style={{ borderRadius: 12 }}>
            <Statistic
              title={t('pipelineValue')}
              value={kpis.totalPipelineValue ?? 0}
              prefix={<DollarOutlined style={{ color: '#f59e0b' }} />}
              valueStyle={{ color: '#f59e0b' }}
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card" bordered={false} style={{ borderRadius: 12 }}>
            <Statistic
              title={t('wonValue')}
              value={kpis.wonValue ?? 0}
              prefix={<TrophyOutlined style={{ color: '#10b981' }} />}
              valueStyle={{ color: '#10b981' }}
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card" bordered={false} style={{ borderRadius: 12 }}>
            <Statistic
              title={t('conversionRate')}
              value={kpis.conversionRate ?? 0}
              suffix="%"
              prefix={<RiseOutlined style={{ color: '#8b5cf6' }} />}
              valueStyle={{ color: '#8b5cf6' }}
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card" bordered={false} style={{ borderRadius: 12 }}>
            <Statistic
              title={t('overdueTasks')}
              value={kpis.overdueTasks ?? 0}
              prefix={<ClockCircleOutlined style={{ color: '#ef4444' }} />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title={t('dealsByStatus')} bordered={false} style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(kpis.dealsByStatus ?? []).map(({ status, count, value }) => (
                <div
                  key={status}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <DealStatusTag status={status} />
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ color: '#64748b', fontSize: 13 }}>{count} deals</span>
                    <span style={{ fontWeight: 600, color: DEAL_COLORS[status] }}>
                      ${value.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Pipeline Distribution" bordered={false} style={{ borderRadius: 12 }}>
            {(kpis.dealsByStatus ?? []).map(({ status, count }) => {
              const total = kpis.totalDeals || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={status} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: '#475569' }}>{status}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{pct}%</span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: 8,
                      background: '#f1f5f9',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: DEAL_COLORS[status],
                        borderRadius: 4,
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
