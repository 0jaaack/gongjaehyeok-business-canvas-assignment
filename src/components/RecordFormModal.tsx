import { Button, Modal, type ModalProps, Typography, Checkbox, DatePicker, Form, Input, Select } from 'antd';
import { createStyles } from 'antd-style';
import { CloseOutlined } from '@ant-design/icons';
import { type RecordSchema } from '../records/types';
import { useModal } from '../hooks/useModal';
import dayjs from 'dayjs';

export type RecordFormModalProps<T extends RecordSchema> = ModalProps & {
  record: T;
};

export function RecordFormModal<T extends RecordSchema>(props: RecordFormModalProps<T>) {
  const { record, ...restProps } = props;

  const { styles } = useStyle();
  const { closeModal } = useModal();

  return (
    <Modal
      className={styles.modal}
      onCancel={closeModal}
      title={(
        <>
          <Typography.Title level={5}>회원 추가</Typography.Title>
          <Button type="text" icon={<CloseOutlined />} size="small" className={styles.closeButton} onClick={closeModal} />
        </>
      )}
      okText="추가"
      cancelText="취소"
      closeIcon={null}
      {...restProps}
    >
      <Form layout="vertical" className={styles.form}>
        {record.map(field => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            required={field.required}
            {...(field.type === 'checkbox' ? { valuePropName: 'checked' } : {})}
            {...(field.type === 'date'
              ? {
                  getValueProps: value => ({ value: value != null ? dayjs(value) : '' }),
                  normalize: value => value != null && `${dayjs(value).format('YYYY-MM-DD')}`,
                }
              : {})}
          >
            {(() => {
              switch (field.type) {
                case 'text':
                  return <Input />;
                case 'textarea':
                  return <Input.TextArea />;
                case 'date':
                  return <DatePicker className={styles.datePicker} />;
                case 'select':
                  return <Select options={field.options} />;
                case 'checkbox':
                  return <Checkbox />;
                default:
                  return field satisfies never;
              }
            })()}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}

const useStyle = createStyles(({ css, prefixCls }) => {
  return {
    modal: css`
      .${prefixCls}-modal-content {
        padding: 0;
        .${prefixCls}-modal-header {
          margin-bottom: 0;
          .${prefixCls}-modal-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
          }
        }
        .${prefixCls}-modal-body {
          padding: 10px 24px 20px;
        }
        .${prefixCls}-modal-footer {
          padding: 12px 16px;
          margin-top: 0;
        }
      }
    `,
    form: css`
      .${prefixCls}-form-item {
        .${prefixCls}-form-item-label {
          font-weight: 600;
          label {
            flex-direction: row-reverse;
            gap: 4px;
          }
          label::after {
            display: none;
          }
        }
        .${prefixCls}-form-item-margin-offset {
          display: none;
        }
      }
    `,
    datePicker: css`
      width: 160px;
    `,
    closeButton: css`
      width: 22px;
      height: 22px;
      color: #00000072;
    `,
  };
});
