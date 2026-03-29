'use client';

import { useState, useMemo } from 'react';
import { Input, Space } from 'antd';
import type { TableProps, TableColumnsType } from 'antd';
import { GridView } from './GridView';
import { AddButton, EditButton, RemoveButton } from './buttons';

type FormGridProps<T extends object> = {
  dataSource: T[];
  columns: TableColumnsType<T>;
  loading?: boolean;
  rowKey?: keyof T & string;
  pagination?: TableProps<T>['pagination'];
  onChange?: TableProps<T>['onChange'];

  // visibility toggles
  showAddButton?: boolean;
  showActionColumn?: boolean;
  showEditButton?: boolean;
  showRemoveButton?: boolean;

  // labels / text
  addButtonLabel?: string;
  deleteConfirmTitle?: string;
  searchPlaceholder?: string;

  // callbacks
  onAdd?: () => void;
  onEdit?: (record: T) => void;
  onRemove?: (record: T) => void;
  onSearch?: (value: string) => void;
};

export function FormGrid<T extends { id?: string }>({
  dataSource,
  columns,
  loading = false,
  rowKey = 'id',
  pagination,
  onChange,
  showAddButton = true,
  showActionColumn = true,
  showEditButton = true,
  showRemoveButton = true,
  addButtonLabel = 'Add',
  deleteConfirmTitle = 'Are you sure?',
  searchPlaceholder = 'Search...',
  onAdd,
  onEdit,
  onRemove,
  onSearch,
}: FormGridProps<T>) {
  const [searchValue, setSearchValue] = useState('');

  const filteredData = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return dataSource;
    return dataSource.filter((record) =>
      Object.values(record as Record<string, unknown>).some(
        (v) => typeof v === 'string' && v.toLowerCase().includes(term),
      ),
    );
  }, [dataSource, searchValue]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };
  const actionColumn: TableColumnsType<T>[number] = {
    title: '',
    key: '__actions',
    width: showEditButton && showRemoveButton ? 88 : 44,
    fixed: 'right',
    render: (_: unknown, record: T) => (
      <div style={{display: "flex", gap: 10}} >
        {showEditButton && (
          <EditButton showLabel={false} onClick={() => onEdit?.(record)} />
        )}
        {showRemoveButton && (
          <RemoveButton
            showLabel={false}
            confirmTitle={deleteConfirmTitle}
            onClick={() => onRemove?.(record)}
          />
        )}
      </div>
    ),
  };

  const mergedColumns: TableColumnsType<T> = [
    ...columns,
    ...(showActionColumn ? [actionColumn] : []),
  ];

  const showToolbar = showAddButton || true;

  return (
    <div>
      {showToolbar && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            gap: 8,
          }}
        >
          <div>
            {showAddButton && (
              <AddButton label={addButtonLabel} onClick={onAdd} />
            )}
          </div>
          <div>
            <Input.Search
              placeholder={searchPlaceholder}
              allowClear
              style={{ width: 280 }}
              onSearch={handleSearch}
              onChange={(e) => !e.target.value && handleSearch('')}
            />
          </div>
        </div>
      )}

      <GridView<T>
        dataSource={filteredData}
        columns={mergedColumns}
        loading={loading}
        rowKey={rowKey}
        pagination={pagination}
        onChange={onChange}
      />
    </div>
  );
}
