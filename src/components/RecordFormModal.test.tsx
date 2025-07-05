import { describe, it, expect, afterEach } from 'vitest';
import { RecordFormModal, type RecordFormModalProps } from './RecordFormModal';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { type RecordSchema } from '../records/types';
import { createModalWrapper } from '../fixtures/wrappers';

const defaultProps: RecordFormModalProps<RecordSchema> = {
  open: true,
  record: [
    { name: 'name', label: '이름', type: 'text', required: true },
    { name: 'address', label: '주소', type: 'text', required: true },
    { name: 'type', label: '타입', type: 'select', required: false, options: [{ label: '타입1', value: 'type1' }, { label: '타입2', value: 'type2' }] },
  ],
};

describe('<RecordFormModal />', () => {
  afterEach(() => {
    cleanup();
  });

  it('주어진 레코드에 따라 모달이 렌더링된다.', async () => {
    const wrapper = createModalWrapper();
    const screen = render(<RecordFormModal {...defaultProps} />, { wrapper });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '회원 추가' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '추가' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'close' })).toBeInTheDocument();

    expect(screen.getByRole('textbox', { name: '이름' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '이름' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: '주소' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '주소' })).toBeRequired();
    expect(screen.getByRole('combobox', { name: '타입' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '타입' })).not.toBeRequired();

    fireEvent.mouseDown(screen.getByRole('combobox', { name: '타입' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '타입1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '타입2' })).toBeInTheDocument();
  });
});
