export interface ExportColumn {
  header: string;
  key: string;
}

function escapeCell(value: string): string {
  const str = String(value ?? '').replace(/\r?\n/g, ' ');
  if (str.includes(',') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Builds a UTF-8 CSV buffer with BOM for Excel compatibility.
 */
export function buildCsv(
  data: Record<string, any>[],
  columns: ExportColumn[],
): Buffer {
  const headerRow = columns.map((c) => escapeCell(c.header)).join(',');
  const rows = data.map((row) =>
    columns.map((c) => escapeCell(String(row[c.key] ?? ''))).join(','),
  );
  // BOM (\uFEFF) ensures Excel recognises the file as UTF-8
  return Buffer.from('\uFEFF' + [headerRow, ...rows].join('\r\n'), 'utf-8');
}
