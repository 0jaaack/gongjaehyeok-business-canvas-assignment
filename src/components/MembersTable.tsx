import { Button, Checkbox, Layout, Table, Typography, type TableColumnType } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import { createStyles } from 'antd-style';
import { TableFilterDropdownMenu } from './TableFilterDropdownMenu';
import { TableRecordDropdown } from './TableRecordDropdown';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { MemberRecord, type Member } from '../records/member';
import type { RecordSchema, RecordSchemaToType } from '../records/types';

const { Header, Content } = Layout;
const { Title } = Typography;

const dataSource: (Member & { key: string })[] = [
  {
    key: '1',
    name: 'John Doe',
    address: '서울 강남구',
    memo: '외국인',
    joinDate: '2024-10-02',
    job: 'developer',
    isEmailAgreed: true,
  },
  {
    key: '2',
    name: 'Foo Bar',
    address: '서울 서초구',
    memo: '한국인',
    joinDate: '2024-10-01',
    job: 'po',
    isEmailAgreed: false,
  },
];

const columns: TableColumnType<Member>[] = [
  convertRecordToColumn(MemberRecord, 'name', {
    width: 120,
    filters: Array.from(new Set(dataSource.map(member => member.name))).map(name => ({
      text: name,
      value: name,
    })),
    onFilter: (value, record) => record.name === value,
    filterDropdown: filterDropdownProps => <TableFilterDropdownMenu {...filterDropdownProps} />,
  }),
  convertRecordToColumn(MemberRecord, 'address', {
    width: 249,
    filters: Array.from(new Set(dataSource.map(member => member.address))).map(address => ({
      text: address,
      value: address,
    })),
    onFilter: (value, record) => record.address === value,
    filterDropdown: filterDropdownProps => <TableFilterDropdownMenu {...filterDropdownProps} />,
  }),
  convertRecordToColumn(MemberRecord, 'memo', {
    width: 249,
    filters: Array.from(new Set(dataSource.map(member => member.memo))).map(memo => ({
      text: memo,
      value: memo,
    })),
    onFilter: (value, record) => record.memo === value,
    filterDropdown: filterDropdownProps => <TableFilterDropdownMenu {...filterDropdownProps} />,
  }),
  convertRecordToColumn(MemberRecord, 'joinDate', {
    width: 200,
    filters: Array.from(new Set(dataSource.map(member => member.joinDate))).map(joinDate => ({
      text: joinDate,
      value: joinDate,
    })),
    onFilter: (value, record) => record.joinDate === value,
    filterDropdown: filterDropdownProps => <TableFilterDropdownMenu {...filterDropdownProps} />,
  }),
  convertRecordToColumn(MemberRecord, 'job', {
    width: 249,
    filters: Array.from(new Set(dataSource.map(member => member.job))).map(job => ({
      text: job,
      value: job,
    })),
    onFilter: (value, record) => record.job === value,
    filterDropdown: filterDropdownProps => <TableFilterDropdownMenu {...filterDropdownProps} />,
  }),
  convertRecordToColumn(MemberRecord, 'isEmailAgreed', {
    width: 150,
    filters: [
      {
        text: '선택됨',
        value: true,
      },
      {
        text: '선택 안함',
        value: false,
      },
    ],
    onFilter: (value, record) => record.isEmailAgreed === value,
    filterDropdown: filterDropdownProps => <TableFilterDropdownMenu {...filterDropdownProps} />,
  }),
  {
    title: '',
    width: 48,
    render: () => (
      <TableRecordDropdown>
        <Button aria-label="More Options" type="text" icon={<MoreOutlined />} />
      </TableRecordDropdown>
    ),
  },
];

const rowSelection: TableRowSelection<Member> = {};

function MembersTable() {
  const { styles } = useStyle();

  return (
    <Layout>
      <Header className={styles.header}>
        <Title level={5}>회원 목록</Title>
        <Button className={styles.addButton} type="primary" icon={<PlusOutlined />}>추가</Button>
      </Header>
      <Content>
        <Table dataSource={dataSource} columns={columns} pagination={false} rowSelection={rowSelection} className={styles.table} />
      </Content>
    </Layout>
  );
}

const useStyle = createStyles(({ css, prefixCls, token }) => {
  return {
    header: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: fit-content;
      padding: 8px 14px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    `,
    addButton: css`
      width: 73px;
      padding-inline: 12px;
      border-radius: 8px;
    `,
    table: css`
      .${prefixCls}-table-thead {
        .${prefixCls}-table-cell {
          padding: 8px;
          .${prefixCls}-table-filter-column {
            gap: 8px;
            .${prefixCls}-table-filter-trigger {
              margin: 0;
            }
          }
        }
      }
      .${prefixCls}-table-tbody {
        .${prefixCls}-table-cell {
          padding: 13px 8px;
        }
        .${prefixCls}-table-selection-column {
          border-inline: 1px solid ${token.colorBorderSecondary};
        }
        .${prefixCls}-table-cell:has(button[aria-label='More Options']) {
          padding: 0;
        }
      }
    `,
  };
});

function convertRecordToColumn<T extends RecordSchema>(
  record: T,
  name: T[number]['name'],
  column: Partial<TableColumnType<RecordSchemaToType<T>>>,
): TableColumnType<RecordSchemaToType<T>> {
  const field = record.find(f => f.name === name);
  if (field == null) {
    throw new Error(`Field ${name} not found in record`);
  }

  return {
    title: field.label,
    dataIndex: field.name,
    key: field.name,
    ...(field.type === 'checkbox' && {
      render: (_, record) => <Checkbox checked={!!record[field.name as keyof RecordSchemaToType<T>]} />,
    }),
    ...(field.type === 'select' && {
      render: (_, record) => field.options.find(option => option.value === record[field.name as keyof RecordSchemaToType<T>])?.label,
    }),
    ...column,
  };
}

export default MembersTable;
