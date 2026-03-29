"use client";

import { useParams } from "next/navigation";
import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Space,
  Spin,
  Tag,
  Timeline,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import type { InteractionResponse } from "@/lib/dto";
import { InteractionModal } from "@/components/interactions/InteractionModal";
import { useState } from "react";
import { DealStatusTag } from "@/components/shared/DealStatusTag";
import { ContactsService } from "@/lib/services/index";

const { Title, Text } = Typography;

const INTERACTION_ICONS: Record<string, string> = {
  CALL: "📞",
  EMAIL: "✉️",
  MEETING: "🤝",
};

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslations("contacts");
  const tCommon = useTranslations("common");
  const tInteractions = useTranslations("interactions");
  const [interactionModalOpen, setInteractionModalOpen] = useState(false);

  const {
    data: contact,
    isLoading,
    mutate,
  } = useSWR(id ? ["contact", id] : null, () => ContactsService.getById(id));

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!contact) return null;

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        type="text"
        onClick={() => router.back()}
        style={{ marginBottom: 16 }}
      >
        {tCommon("back")}
      </Button>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{ borderRadius: 12, textAlign: "center" }}
          >
            <Avatar
              size={80}
              style={{ background: "#6366f1", fontSize: 32, marginBottom: 12 }}
            >
              {contact.name[0]}
            </Avatar>
            <Title level={4} style={{ marginBottom: 4 }}>
              {contact.name}
            </Title>
            {contact.email && (
              <Space>
                <MailOutlined style={{ color: "#64748b" }} />
                <Text type="secondary">{contact.email}</Text>
              </Space>
            )}
            <br />
            {contact.phone && (
              <Space>
                <PhoneOutlined style={{ color: "#64748b" }} />
                <Text type="secondary">{contact.phone}</Text>
              </Space>
            )}
            {contact.companies && (
              <>
                <br />
                <Space>
                  <BankOutlined style={{ color: "#64748b" }} />
                  <Tag color="blue">
                    {Array.isArray(contact.companies)
                      ? (contact.companies[0]?.name ??
                        contact.companies[0]?.company_name ??
                        tCommon("noData"))
                      : ((contact.companies as any).name ??
                        (contact.companies as any).company_name ??
                        tCommon("noData"))}
                  </Tag>
                </Space>
              </>
            )}
          </Card>

          {contact.notes && (
            <Card
              title={tCommon("notes")}
              bordered={false}
              style={{ borderRadius: 12, marginTop: 16 }}
            >
              <Text type="secondary">{contact.notes}</Text>
            </Card>
          )}
        </Col>

        <Col xs={24} lg={16}>
          {/* Deals */}
          {(contact.deals?.length ?? 0) > 0 && (
            <Card
              title={t("deals")}
              bordered={false}
              style={{ borderRadius: 12, marginBottom: 16 }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {contact.deals?.map((deal: any) => (
                  <div
                    key={deal.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <Text>{deal.title}</Text>
                    <Space>
                      <Text strong>${deal.value?.toLocaleString()}</Text>
                      <DealStatusTag status={deal.status} />
                    </Space>
                  </div>
                ))}
              </Space>
            </Card>
          )}

          {/* Interactions */}
          <Card
            title={t("interactions")}
            bordered={false}
            style={{ borderRadius: 12 }}
            extra={
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => setInteractionModalOpen(true)}
              >
                {tInteractions("new")}
              </Button>
            }
          >
            {(contact.interactions?.length ?? 0) > 0 ? (
              <Timeline
                items={contact.interactions?.map((i: InteractionResponse) => ({
                  dot: (
                    <span style={{ fontSize: 16 }}>
                      {INTERACTION_ICONS[i.type] ?? "💬"}
                    </span>
                  ),
                  children: (
                    <div>
                      <Text strong>{i.type}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(i.date).toLocaleString()}
                      </Text>
                      <br />
                      <Text>{i.description}</Text>
                    </div>
                  ),
                }))}
              />
            ) : (
              <Text type="secondary">{tCommon("noData")}</Text>
            )}
          </Card>
        </Col>
      </Row>

      <InteractionModal
        open={interactionModalOpen}
        contactId={id}
        onClose={() => setInteractionModalOpen(false)}
        onSuccess={() => {
          setInteractionModalOpen(false);
          mutate();
        }}
      />
    </div>
  );
}
