'use client';

import { useState, useCallback } from 'react';
import {
  Modal,
  Upload,
  Select,
  Table,
  Alert,
  Button,
  Space,
  Tag,
  Typography,
  Steps,
  Statistic,
  Row,
  Col,
} from 'antd';
import { InboxOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import type { UploadFile } from 'antd';
import { ContactsService } from '@/lib/services/index';
import { showSuccess } from '@/components/shared/notification/notificationService';
import { handleApiError } from '@/lib/api';

const { Dragger } = Upload;
const { Title, Text } = Typography;

// ─── CSV parsing (no external dependency) ────────────────────────────────────
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map(parseCsvLine);
  return { headers, rows };
}

// ─── System fields ───────────────────────────────────────────────────────────
const SYSTEM_FIELDS = [
  { key: 'name', label: 'Name', required: true },
  { key: 'email', label: 'Email', required: false },
  { key: 'phone', label: 'Phone', required: false },
  { key: 'companyId', label: 'Company ID', required: false },
  { key: 'notes', label: 'Notes', required: false },
];

type ColumnMapping = Record<string, string>; // systemField → csvHeader

type ImportRow = {
  row: number;
  data: Record<string, string>;
  errors: { field: string; messages: string[] }[];
};

// ─── Props ───────────────────────────────────────────────────────────────────
interface ImportContactsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportContactsModal({ open, onClose, onSuccess }: ImportContactsModalProps) {
  const t = useTranslations('contacts');
  const tCommon = useTranslations('common');

  const [step, setStep] = useState(0);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [previewRows, setPreviewRows] = useState<ImportRow[]>([]);
  const [validCount, setValidCount] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const reset = () => {
    setStep(0);
    setCsvHeaders([]);
    setCsvRows([]);
    setMapping({});
    setPreviewRows([]);
    setValidCount(0);
    setInvalidCount(0);
    setFileList([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Step 0 → read file
  const handleFileRead = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, rows } = parseCsv(text);
      setCsvHeaders(headers);
      setCsvRows(rows);
      // Pre-map headers that exactly match a system field key/label
      const autoMap: ColumnMapping = {};
      SYSTEM_FIELDS.forEach((sf) => {
        const match = headers.find(
          (h) => h.toLowerCase() === sf.key.toLowerCase() || h.toLowerCase() === sf.label.toLowerCase(),
        );
        if (match) autoMap[sf.key] = match;
      });
      setMapping(autoMap);
      setStep(1);
    };
    reader.readAsText(file, 'utf-8');
    return false; // prevent default upload
  }, []);

  // Step 1 → validate against backend
  const handleValidate = async () => {
    const rows = csvRows.map((row) => {
      const obj: Record<string, string> = {};
      SYSTEM_FIELDS.forEach((sf) => {
        const csvHeader = mapping[sf.key];
        if (csvHeader) {
          const colIdx = csvHeaders.indexOf(csvHeader);
          obj[sf.key] = colIdx >= 0 ? (row[colIdx] ?? '') : '';
        }
      });
      return obj;
    });

    setLoading(true);
    try {
      const result = await ContactsService.importPreview(rows);
      setPreviewRows(result.rows);
      setValidCount(result.validCount);
      setInvalidCount(result.invalidCount);
      setStep(2);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → confirm
  const handleConfirm = async () => {
    const validRows = previewRows
      .filter((r) => r.errors.length === 0)
      .map((r) => r.data as any);

    setLoading(true);
    try {
      const result = await ContactsService.importConfirm(validRows);
      showSuccess();
      reset();
      onSuccess();
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Preview table columns ─────────────────────────────────────────────────
  const previewColumns = [
    { title: 'Row', dataIndex: 'row', key: 'row', width: 60 },
    {
      title: 'Name',
      key: 'name',
      render: (_: unknown, r: ImportRow) => r.data.name,
    },
    {
      title: 'Email',
      key: 'email',
      render: (_: unknown, r: ImportRow) => r.data.email,
    },
    {
      title: 'Phone',
      key: 'phone',
      render: (_: unknown, r: ImportRow) => r.data.phone,
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_: unknown, r: ImportRow) =>
        r.errors.length === 0 ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            OK
          </Tag>
        ) : (
          <Tag color="red" icon={<ExclamationCircleOutlined />}>
            Error
          </Tag>
        ),
    },
    {
      title: 'Errors',
      key: 'errors',
      render: (_: unknown, r: ImportRow) =>
        r.errors.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12 }}>
            {r.errors.map((e, i) => (
              <li key={i} style={{ color: '#ef4444' }}>
                <strong>{e.field}</strong>: {e.messages.join('; ')}
              </li>
            ))}
          </ul>
        ) : null,
    },
  ];

  // ── Modal footer ─────────────────────────────────────────────────────────
  const footer = (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button onClick={handleClose}>{tCommon('cancel')}</Button>
      {step === 1 && (
        <Button type="primary" loading={loading} onClick={handleValidate}>
          {t('importValidate')}
        </Button>
      )}
      {step === 2 && (
        <>
          <Button onClick={() => setStep(1)}>{tCommon('back')}</Button>
          <Button
            type="primary"
            loading={loading}
            disabled={validCount === 0}
            onClick={handleConfirm}
          >
            {t('importConfirm')} ({validCount})
          </Button>
        </>
      )}
    </div>
  );

  return (
    <Modal
      open={open}
      title={t('importTitle')}
      width={800}
      onCancel={handleClose}
      footer={footer}
      maskClosable={false}
    >
      <Steps
        current={step}
        size="small"
        style={{ marginBottom: 24 }}
        items={[
          { title: t('importStepUpload') },
          { title: t('importStepMap') },
          { title: t('importStepPreview') },
        ]}
      />

      {/* Step 0: Upload */}
      {step === 0 && (
        <Dragger
          accept=".csv,text/csv"
          maxCount={1}
          fileList={fileList}
          beforeUpload={(file) => {
            setFileList([file]);
            handleFileRead(file);
            return false;
          }}
          onRemove={() => setFileList([])}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{t('importDragText')}</p>
          <p className="ant-upload-hint">{t('importDragHint')}</p>
        </Dragger>
      )}

      {/* Step 1: Column mapping */}
      {step === 1 && (
        <div>
          <Alert
            type="info"
            message={`${csvRows.length} ${t('importRowsFound')}`}
            style={{ marginBottom: 16 }}
          />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 600 }}>
                  {t('importSystemField')}
                </th>
                <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 600 }}>
                  {t('importCsvColumn')}
                </th>
              </tr>
            </thead>
            <tbody>
              {SYSTEM_FIELDS.map((sf) => (
                <tr key={sf.key}>
                  <td style={{ padding: '6px 4px' }}>
                    {sf.label}
                    {sf.required && <span style={{ color: '#ef4444' }}> *</span>}
                  </td>
                  <td style={{ padding: '6px 4px' }}>
                    <Select
                      allowClear
                      placeholder={t('importSelectColumn')}
                      style={{ width: '100%' }}
                      value={mapping[sf.key]}
                      onChange={(val) =>
                        setMapping((prev) => ({ ...prev, [sf.key]: val ?? '' }))
                      }
                      options={csvHeaders.map((h) => ({ label: h, value: h }))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Step 2: Preview */}
      {step === 2 && (
        <div>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Statistic title={t('importTotal')} value={csvRows.length} />
            </Col>
            <Col span={8}>
              <Statistic
                title={t('importValid')}
                value={validCount}
                valueStyle={{ color: '#10b981' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title={t('importInvalid')}
                value={invalidCount}
                valueStyle={{ color: '#ef4444' }}
              />
            </Col>
          </Row>
          {invalidCount > 0 && (
            <Alert
              type="warning"
              message={t('importPartialWarning')}
              style={{ marginBottom: 12 }}
            />
          )}
          <Table
            dataSource={previewRows}
            columns={previewColumns}
            rowKey="row"
            size="small"
            scroll={{ y: 320 }}
            pagination={false}
            rowClassName={(r: ImportRow) => (r.errors.length > 0 ? 'row-error' : '')}
          />
        </div>
      )}
    </Modal>
  );
}
