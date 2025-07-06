import { render, within, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import MembersTable from './MembersTable';
import { createModalWrapper } from '../fixtures/wrappers';
import userEvent from '@testing-library/user-event';

describe('<MembersTable />', () => {
  afterEach(() => {
    cleanup();
  });

  it('회원 정보 테이블이 렌더링된다.', () => {
    const screen = render(<MembersTable />);

    expect(screen.getByText('회원 목록')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'plus 추가' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '이름 filter' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '주소 filter' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '메모 filter' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '가입일 filter' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '직업 filter' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '이메일 수신 동의 filter' })).toBeInTheDocument();

    const rows = screen.getAllByRole('row');

    expect(within(rows[1]).getByRole('cell', { name: 'John Doe' })).toBeInTheDocument();
    expect(within(rows[1]).getByRole('cell', { name: '서울 강남구' })).toBeInTheDocument();
    expect(within(rows[1]).getByRole('cell', { name: '외국인' })).toBeInTheDocument();
    expect(within(rows[1]).getByRole('cell', { name: '2024-10-02' })).toBeInTheDocument();
    expect(within(rows[1]).getByRole('cell', { name: '개발자' })).toBeInTheDocument();
    expect(within(rows[1]).getAllByRole('checkbox').length).toBe(2);
    expect(within(rows[1]).getByRole('button', { name: 'More Options' })).toBeInTheDocument();

    expect(within(rows[2]).getByRole('cell', { name: 'Foo Bar' })).toBeInTheDocument();
    expect(within(rows[2]).getByRole('cell', { name: '서울 서초구' })).toBeInTheDocument();
    expect(within(rows[2]).getByRole('cell', { name: '한국인' })).toBeInTheDocument();
    expect(within(rows[2]).getByRole('cell', { name: '2024-10-01' })).toBeInTheDocument();
    expect(within(rows[2]).getByRole('cell', { name: 'PO' })).toBeInTheDocument();
    expect(within(rows[2]).getAllByRole('checkbox').length).toBe(2);
    expect(within(rows[2]).getByRole('button', { name: 'More Options' })).toBeInTheDocument();
  });

  it('필터 아이콘을 클릭하면 드롭다운 메뉴가 나타난다.', async () => {
    const screen = render(<MembersTable />);

    const nameFilterTrigger = screen.getAllByRole('button', { name: 'filter' })[0];
    await userEvent.click(nameFilterTrigger);

    expect(screen.getByRole('menuitem', { name: 'John Doe' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Foo Bar' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('menuitem', { name: 'John Doe' }));
    expect(screen.getByRole('cell', { name: 'John Doe' })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Foo Bar' })).not.toBeInTheDocument();
  });

  it('각 행에 있는 더보기 버튼을 클릭하면 드롭다운 메뉴가 나타난다.', async () => {
    const screen = render(<MembersTable />);

    const moreOptionsButton = screen.getAllByRole('button', { name: 'More Options' })[0];
    await userEvent.click(moreOptionsButton);

    expect(screen.getByRole('menuitem', { name: '수정' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '삭제' })).toBeInTheDocument();
  });

  it('추가 버튼을 클릭하면 회원 추가 모달이 나타난다.', async () => {
    const wrapper = createModalWrapper();
    const screen = render(<MembersTable />, { wrapper });

    await userEvent.click(screen.getByRole('button', { name: 'plus 추가' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('회원 추가')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '이름' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '주소' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '메모' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '가입일' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '직업' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '이메일 수신 동의' })).toBeInTheDocument();
  });
});
