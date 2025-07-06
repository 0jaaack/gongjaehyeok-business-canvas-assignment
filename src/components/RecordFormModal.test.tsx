import { describe, it, expect, afterEach, vi } from 'vitest';
import { RecordFormModal, type RecordFormModalProps } from './RecordFormModal';
import { cleanup, render } from '@testing-library/react';
import { type RecordSchema } from '../records/types';
import { createModalWrapper } from '../fixtures/wrappers';
import userEvent from '@testing-library/user-event';

const defaultProps: RecordFormModalProps<RecordSchema> = {
  open: true,
  title: '레코드 추가',
  okText: '추가',
  onSubmit: vi.fn(),
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
    expect(screen.getByRole('heading', { name: '레코드 추가' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '추가' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'close' })).toBeInTheDocument();

    expect(screen.getByRole('textbox', { name: '이름' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '이름' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: '주소' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '주소' })).toBeRequired();
    expect(screen.getByRole('combobox', { name: '타입' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '타입' })).not.toBeRequired();

    await userEvent.click(screen.getByRole('combobox', { name: '타입' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '타입1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '타입2' })).toBeInTheDocument();
  });

  it('필수 필드가 비워져 있게 되면 에러 메시지가 표시된다.', async () => {
    const wrapper = createModalWrapper();
    const screen = render(<RecordFormModal {...defaultProps} />, { wrapper });

    await userEvent.type(screen.getByRole('textbox', { name: '이름' }), 'John Doe');
    await userEvent.clear(screen.getByRole('textbox', { name: '이름' }));

    expect(await screen.findByText('이름은 필수 입력 항목입니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '추가' })).toBeDisabled();
  });

  it('텍스트 타입 필드의 글자수를 초과하면 에러 메시지가 표시된다.', async () => {
    const wrapper = createModalWrapper();
    const screen = render(<RecordFormModal {...defaultProps} />, { wrapper });

    await userEvent.type(screen.getByRole('textbox', { name: '이름' }), 'T'.repeat(21));

    expect(await screen.findByText('글자수 20을 초과할 수 없습니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '추가' })).toBeDisabled();
  });

  it('텍스트 영역 타입 필드의 글자수를 초과하면 에러 메시지가 표시된다.', async () => {
    const wrapper = createModalWrapper();
    const record: RecordSchema = [
      { name: 'description', label: '설명', type: 'textarea', required: false },
    ];
    const screen = render(<RecordFormModal {...defaultProps} record={record} />, { wrapper });

    await userEvent.type(screen.getByRole('textbox', { name: '설명' }), 'T'.repeat(51));

    expect(await screen.findByText('글자수 50을 초과할 수 없습니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '추가' })).toBeDisabled();
  });

  it('추가 버튼을 클릭하면 onSubmit이 호출된다.', async () => {
    const wrapper = createModalWrapper();
    const screen = render(<RecordFormModal {...defaultProps} />, { wrapper });

    await userEvent.type(screen.getByRole('textbox', { name: '이름' }), 'John Doe');
    await userEvent.type(screen.getByRole('textbox', { name: '주소' }), '123 Main St');
    await userEvent.click(screen.getByRole('combobox', { name: '타입' }));
    await userEvent.click(await screen.findByText('타입1'));

    expect(screen.getByRole('button', { name: '추가' })).toBeEnabled();
    await userEvent.click(screen.getByRole('button', { name: '추가' }));
    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      address: '123 Main St',
      type: 'type1',
    });
  });
});
