import { Table } from 'antd';
import type { TableProps } from 'antd';

type GridViewProps<T extends object> = {
  dataSource: T[];
  columns: TableProps<T>['columns'];
  loading?: boolean;
  rowKey?: keyof T & string;
  pagination?: TableProps<T>['pagination'];
  onChange?: TableProps<T>['onChange'];
};

export function GridView<T extends { id?: string }>({
  dataSource,
  columns,
  loading = false,
  rowKey = 'id',
  pagination,
  onChange,
}: GridViewProps<T>) {
  return (
    <Table<T>
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      rowKey={rowKey}
      pagination={
        pagination !== undefined
          ? pagination
          : { pageSize: 20, showSizeChanger: true, showTotal: (total) => `${total} items` }
      }
      onChange={onChange}
      style={{ background: '#ffffff', borderRadius: 12 }}
      scroll={{ x: 'max-content' }}
    />
  );
}
