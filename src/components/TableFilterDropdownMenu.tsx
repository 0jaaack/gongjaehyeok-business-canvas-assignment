import type { Key } from 'react';
import { Checkbox, Menu, Typography } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { createStyles } from 'antd-style';

const { Text } = Typography;

export function TableFilterDropdownMenu(props: FilterDropdownProps) {
  const { filters, setSelectedKeys, selectedKeys, confirm } = props;
  const { styles } = useStyle();

  const handleClick = (value: Key | boolean) => {
    if (selectedKeys.includes(value.toString())) {
      setSelectedKeys(selectedKeys.filter(key => key !== value.toString()));
    }
    else {
      setSelectedKeys([...selectedKeys, value.toString()]);
    }
    confirm?.();
  };

  return (
    <Menu
      className={styles.menu}
      items={filters?.map(filter => ({
        key: filter.value.toString(),
        label: (
          <>
            <Checkbox checked={selectedKeys.includes(filter.value.toString())} />
            <Text>{filter.text}</Text>
          </>
        ),
        onClick: () => handleClick(filter.value),
      }))}
    />
  );
}

const useStyle = createStyles(({ css, prefixCls }) => {
  return {
    menu: css`
      width: 150px;
      padding: 8px;
      border-radius: 10px;
      .${prefixCls}-dropdown-menu-item:not(:first-child) {
        margin-top: 8px;
      }
    `,
  };
});
