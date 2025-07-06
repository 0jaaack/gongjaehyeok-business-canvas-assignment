import { cleanup, render, within } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { TableFilterDropdownMenu } from './TableFilterDropdownMenu';
import userEvent from '@testing-library/user-event';

const defaultProps: FilterDropdownProps = {
  prefixCls: 'ant-dropdown',
  setSelectedKeys: vi.fn(),
  selectedKeys: [],
  confirm: vi.fn(),
  close: vi.fn(),
  visible: true,
  filters: [
    { text: 'John Doe', value: 'John Doe' },
    { text: 'Foo Bar', value: 'Foo Bar' },
  ],
};

describe('<TableFilterDropdownMenu />', () => {
  afterEach(() => {
    cleanup();
  });

  it('필터 드롭다운 메뉴가 렌더링된다.', () => {
    const screen = render(<TableFilterDropdownMenu {...defaultProps} />);

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'John Doe' })).toBeInTheDocument();
    expect(within(screen.getByRole('menuitem', { name: 'John Doe' })).getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Foo Bar' })).toBeInTheDocument();
    expect(within(screen.getByRole('menuitem', { name: 'Foo Bar' })).getByRole('checkbox')).toBeInTheDocument();
  });

  it('선택된 키가 있을 때 해당 체크박스가 체크된다.', () => {
    const screen = render(<TableFilterDropdownMenu {...defaultProps} selectedKeys={['John Doe']} />);

    expect(within(screen.getByRole('menuitem', { name: 'John Doe' })).getByRole('checkbox')).toBeChecked();
    expect(within(screen.getByRole('menuitem', { name: 'Foo Bar' })).getByRole('checkbox')).not.toBeChecked();

    screen.rerender(<TableFilterDropdownMenu {...defaultProps} selectedKeys={['John Doe', 'Foo Bar']} />);

    expect(within(screen.getByRole('menuitem', { name: 'John Doe' })).getByRole('checkbox')).toBeChecked();
    expect(within(screen.getByRole('menuitem', { name: 'Foo Bar' })).getByRole('checkbox')).toBeChecked();
  });

  it('메뉴 아이템을 클릭하면 setSelectedKeys가 호출된다.', async () => {
    const screen = render(<TableFilterDropdownMenu {...defaultProps} />);

    await userEvent.click(screen.getByRole('menuitem', { name: 'John Doe' }));
    expect(defaultProps.setSelectedKeys).toHaveBeenCalledWith(['John Doe']);

    await userEvent.click(screen.getByRole('menuitem', { name: 'Foo Bar' }));
    expect(defaultProps.setSelectedKeys).toHaveBeenLastCalledWith(['Foo Bar']);
  });
});
