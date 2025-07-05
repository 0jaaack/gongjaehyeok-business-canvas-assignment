import type { Key } from 'react';
import { Checkbox, Menu, Typography } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { createStyles } from 'antd-style';

const { Item } = Menu;
const { Text } = Typography;

export function TableFilterDropdownMenu(props: FilterDropdownProps) {
  const { filters, setSelectedKeys, selectedKeys } = props;
  const { styles } = useStyle();

  const handleClick = (value: Key | boolean) => {
    if (selectedKeys.includes(value.toString())) {
      setSelectedKeys(selectedKeys.filter(key => key !== value.toString()));
    }
    else {
      setSelectedKeys([...selectedKeys, value.toString()]);
    }
  };

  return (
    <Menu className={styles.menu}>
      {filters?.map(filter => (
        <Item
          key={filter.value.toString()}
          className={styles.item}
          onClick={() => handleClick(filter.value)}
        >
          <Checkbox checked={selectedKeys.includes(filter.value.toString())} />
          <Text>{filter.text}</Text>
        </Item>
      ))}
    </Menu>
  );
}

const useStyle = createStyles(({ css, prefixCls }) => {
  return {
    menu: css`
      width: 150px;
      padding: 8px;
      border-radius: 9px;
      .${prefixCls}-dropdown-menu-item:not(:first-child) {
        margin-top: 8px;
      }
    `,
    item: css`
      padding: 5px 12px;
    `,
  };
});
