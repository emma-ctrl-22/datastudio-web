import { Table } from 'antd';
import type { TableProps } from 'antd';

/**
 * A shared, generic, and strongly-typed table component that wraps Ant Design's Table.
 *
 * @param T The type of the data records in the table. It must be an object with an 'id' property.
 *
 * @example
 * // To use this component, the parent page will define the columns,
 * // including the "Actions" column with permission-based logic.
 *
 * const columns: TableProps<MyDataType>['columns'] = [
 *   { title: 'Name', dataIndex: 'name', key: 'name' },
 *   {
 *     title: 'Actions',
 *     key: 'actions',
 *     render: (_, record) => (
 *       <Space>
 *         {can('my_resource', 'update') && <Button>Edit</Button>}
 *         {can('my_resource', 'delete') && <Button danger>Delete</Button>}
 *       </Space>
 *     ),
 *   },
 * ];
 *
 * <SharedTable<MyDataType>
 *   columns={columns}
 *   data={data}
 *   loading={isLoading}
 * />
 */
export function SharedTable<T extends { id: string | number }>({
  columns,
  dataSource,
  loading,
  ...rest
}: TableProps<T>) {
  return (
    <Table<T>
      rowKey="id"
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={{
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
      {...rest}
    />
  );
}
