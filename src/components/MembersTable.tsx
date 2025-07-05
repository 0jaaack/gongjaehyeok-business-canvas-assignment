import { Checkbox, Layout, Table, Typography, type TableColumnType } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import { createStyles } from 'antd-style';

const { Header, Content } = Layout;
const { Title } = Typography;

type Member = {
  name: string;
  address: string;
  memo: string;
  joinDate: string;
  job: string;
  isEmailAgreed: boolean;
};

const columns: TableColumnType<Member>[] = [
  {
    title: '이름',
    dataIndex: 'name',
    key: 'name',
    width: 120,
  },
  {
    title: '주소',
    dataIndex: 'address',
    key: 'address',
    width: 249,
  },
  {
    title: '메모',
    dataIndex: 'memo',
    key: 'memo',
    width: 249,
  },
  {
    title: '가입일',
    dataIndex: 'joinDate',
    key: 'joinDate',
    width: 200,
  },
  {
    title: '직업',
    dataIndex: 'job',
    key: 'job',
    width: 249,
  },
  {
    title: '이메일 수신 동의',
    dataIndex: 'isEmailAgreed',
    key: 'isEmailAgreed',
    width: 150,
    render: (_, record) => <Checkbox checked={record.isEmailAgreed} />,
  },
];

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

const rowSelection: TableRowSelection<Member> = {};

function MembersTable() {
  const { styles } = useStyle();

  return (
    <Layout>
      <Header className={styles.header}>
        <Title level={5}>회원 목록</Title>
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
      height: fit-content;
      padding: 8px 14px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    `,
    table: css`
      .${prefixCls}-table-thead {
        .${prefixCls}-table-cell {
          padding: 8px;
        }
      }
      .${prefixCls}-table-tbody {
        .${prefixCls}-table-cell {
          padding: 13px 8px;
        }
        .${prefixCls}-table-selection-column {
          border-inline: 1px solid ${token.colorBorderSecondary};
        }
      }
    `,
  };
});

export default MembersTable;
