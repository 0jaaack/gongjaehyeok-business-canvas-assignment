import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MembersTable from './MembersTable';

describe('<MembersTable />', () => {
  it('회원 정보 테이블이 렌더링된다.', () => {
    render(<MembersTable />);

    expect(screen.getByText('회원 목록')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '이름' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '주소' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '메모' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '가입일' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '직업' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '이메일 수신 동의' })).toBeInTheDocument();

    const rows = screen.getAllByRole('row');

    expect(within(rows[1]).getByRole('cell', { name: 'John Doe' })).toBeInTheDocument();
    expect(within(rows[1]).getByRole('cell', { name: '서울 강남구' })).toBeInTheDocument();
    expect(within(rows[1]).getByRole('cell', { name: '외국인' })).toBeInTheDocument();
    expect(within(rows[1]).getByRole('cell', { name: '2024-10-02' })).toBeInTheDocument();
    expect(within(rows[1]).getByRole('cell', { name: 'developer' })).toBeInTheDocument();
    expect(within(rows[1]).getAllByRole('checkbox').length).toBe(2);

    expect(within(rows[2]).getByRole('cell', { name: 'Foo Bar' })).toBeInTheDocument();
    expect(within(rows[2]).getByRole('cell', { name: '서울 서초구' })).toBeInTheDocument();
    expect(within(rows[2]).getByRole('cell', { name: '한국인' })).toBeInTheDocument();
    expect(within(rows[2]).getByRole('cell', { name: '2024-10-01' })).toBeInTheDocument();
    expect(within(rows[2]).getByRole('cell', { name: 'po' })).toBeInTheDocument();
    expect(within(rows[2]).getAllByRole('checkbox').length).toBe(2);
  });
});
