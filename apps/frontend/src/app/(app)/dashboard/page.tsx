'use client';

import { useState } from 'react';
import { Card, Col, Row, Statistic, Typography, Spin, DatePicker, Empty } from 'antd';
import {
  TeamOutlined,
  FundOutlined,
  DollarOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HourglassOutlined,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import dayjs, { type Dayjs } from 'dayjs';
import { DealStatusTag } from '@/components/shared/DealStatusTag';
import { DashboardService } from '@/lib/services/index';
import type { DashboardKpisResponse, DashboardReportsResponse } from '@/lib/dto/dashboard.dto';

const { Title } = Typography;
const { RangePicker } = DatePicker;

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

  // Reports state
  const defaultFrom = dayjs().startOf('month').format('YYYY-MM-DD');
  const defaultTo = dayjs().endOf('month').format('YYYY-MM-DD');
  const [reportRange, setReportRange] = useState<[string, string]>([defaultFrom, defaultTo]);
  const { data: reports, isLoading: reportsLoading } = useSWR<DashboardReportsResponse>(
    ['dashboard/reports', reportRange[0], reportRange[1]],
    () => DashboardService.reports(reportRange[0], reportRange[1]),
  );

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates?.[0] && dates?.[1]) {
      setReportRange([
        dates[0].format('YYYY-MM-DD'),
        dates[1].endOf('day').format('YYYY-MM-DD'),
      ]);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  const kpis = data ?? ({} as DashboardKpisResponse);

  // Build funnel data — pipeline stages ordered by expected volume
  const funnelOrder = ['LEAD', 'CONTACTED', 'PROPOSAL', 'NEGOTIATION', 'WON'];
  const funnelData = funnelOrder.map((status) => {
    const item = kpis.dealsByStatus?.find((d) => d.status === status);
    return { stage: status, count: item?.count ?? 0 };
  });

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

      {/* ── Sales Funnel ──────────────────────────────────────── */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title={t('salesFunnel')} bordered={false} style={{ borderRadius: 12 }}>
            {funnelData.every((d) => d.count === 0) ? (
              <Empty description={t('noData')} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 0' }}>
                {funnelData.map((item, idx) => {
                  const maxCount = funnelData[0]?.count || 1;
                  const pct = maxCount > 0 ? Math.round((item.count / maxCount) * 100) : 0;
                  const indent = idx * 16;
                  return (
                    <div key={item.stage} style={{ paddingLeft: indent }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <DealStatusTag status={item.stage} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: DEAL_COLORS[item.stage] }}>
                          {item.count}
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: 10,
                          background: '#f1f5f9',
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: DEAL_COLORS[item.stage],
                            borderRadius: 4,
                            transition: 'width 0.6s ease',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </Col>

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
      </Row>

      {/* ── Period Reports ────────────────────────────────────── */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card
            title={t('reports')}
            bordered={false}
            style={{ borderRadius: 12 }}
            extra={
              <RangePicker
                defaultValue={[dayjs().startOf('month'), dayjs().endOf('month')]}
                onChange={(dates) =>
                  handleRangeChange(dates as [Dayjs | null, Dayjs | null] | null)
                }
                allowClear={false}
              />
            }
          >
            {reportsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
                <Spin />
              </div>
            ) : (
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={8}>
                  <Statistic
                    title={t('reportWon')}
                    value={reports?.won.count ?? 0}
                    suffix={`/ $${(reports?.won.value ?? 0).toLocaleString()}`}
                    prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
                    valueStyle={{ color: '#10b981' }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title={t('reportLost')}
                    value={reports?.lost.count ?? 0}
                    suffix={`/ $${(reports?.lost.value ?? 0).toLocaleString()}`}
                    prefix={<CloseCircleOutlined style={{ color: '#ef4444' }} />}
                    valueStyle={{ color: '#ef4444' }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title={t('reportOpen')}
                    value={reports?.open.count ?? 0}
                    suffix={`/ $${(reports?.open.value ?? 0).toLocaleString()}`}
                    prefix={<HourglassOutlined style={{ color: '#f59e0b' }} />}
                    valueStyle={{ color: '#f59e0b' }}
                  />
                </Col>

                {/* per-status breakdown bars */}
                <Col xs={24} style={{ marginTop: 8 }}>
                  {(reports?.dealsByStatus ?? []).map(({ status, count, value }) => {
                    const total = reports?.total.count || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={status} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <DealStatusTag status={status} />
                          <span style={{ fontSize: 13 }}>
                            {count} &middot; ${value.toLocaleString()} ({pct}%)
                          </span>
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
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
