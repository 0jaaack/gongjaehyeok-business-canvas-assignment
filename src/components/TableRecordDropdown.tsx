import { Dropdown, type MenuProps, Typography } from 'antd';
import { createStyles } from 'antd-style';
import type { ReactNode } from 'react';

const { Text } = Typography;

export type TableRecordDropdownProps = {
  children: ReactNode;
  onDelete: () => void;
};

export function TableRecordDropdown(props: TableRecordDropdownProps) {
  const { children, onDelete } = props;
  const { styles } = useStyle();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Text>수정</Text>,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: <Text type="danger">삭제</Text>,
      onClick: onDelete,
    },
  ];

  return (
    <Dropdown
      menu={{ items, className: styles.menu }}
      placement="bottomLeft"
      trigger={['click']}
    >
      {children}
    </Dropdown>
  );
}

const useStyle = createStyles(({ css }) => {
  return {
    menu: css`
      width: 181px;
      padding: 4px;
      border-radius: 10px;
    `,
  };
});
