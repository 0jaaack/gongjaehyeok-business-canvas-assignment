import { cleanup, render } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { TableRecordDropdown, type TableRecordDropdownProps } from './TableRecordDropdown';
import userEvent from '@testing-library/user-event';

const defaultProps: Omit<TableRecordDropdownProps, 'children'> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe('<TableRecordDropdown />', () => {
  afterEach(() => {
    cleanup();
  });

  it('레코드 드롭다운 메뉴가 렌더링된다.', async () => {
    const screen = render(
      <TableRecordDropdown {...defaultProps}>
        <button>More Options</button>
      </TableRecordDropdown>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'More Options' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '수정' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '삭제' })).toBeInTheDocument();
  });

  it('삭제 버튼을 클릭하면 onDelete가 호출된다.', async () => {
    const screen = render(
      <TableRecordDropdown {...defaultProps}>
        <button>More Options</button>
      </TableRecordDropdown>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'More Options' }));
    await userEvent.click(screen.getByRole('menuitem', { name: '삭제' }));
    expect(defaultProps.onDelete).toHaveBeenCalled();
  });

  it('수정 버튼을 클릭하면 onEdit가 호출된다.', async () => {
    const screen = render(
      <TableRecordDropdown {...defaultProps}>
        <button>More Options</button>
      </TableRecordDropdown>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'More Options' }));
    await userEvent.click(screen.getByRole('menuitem', { name: '수정' }));
    expect(defaultProps.onEdit).toHaveBeenCalled();
  });
});
