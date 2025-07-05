import { cleanup, fireEvent, render } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { TableRecordDropdown } from './TableRecordDropdown';

describe('<TableRecordDropdown />', () => {
  afterEach(() => {
    cleanup();
  });

  it('레코드 드롭다운 메뉴가 렌더링된다.', () => {
    const screen = render(
      <TableRecordDropdown>
        <button>More Options</button>
      </TableRecordDropdown>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'More Options' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '수정' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '삭제' })).toBeInTheDocument();
  });
});
