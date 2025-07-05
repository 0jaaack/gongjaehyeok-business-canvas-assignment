import { useEffect, useState } from 'react';
import { Button, Modal, type ModalProps, Typography, Checkbox, DatePicker, Form, Input, Select } from 'antd';
import { createStyles } from 'antd-style';
import type { Rule } from 'antd/es/form';
import { CloseOutlined } from '@ant-design/icons';
import { type RecordSchema, type RecordSchemaToType } from '../records/types';
import { useModal } from '../hooks/useModal';
import dayjs from 'dayjs';

const textFieldDefaultRule: Rule = { max: 20, message: '글자수 20을 초과할 수 없습니다.' };
const textareaFieldDefaultRule: Rule = { max: 50, message: '글자수 50을 초과할 수 없습니다.' };

export type RecordFormModalProps<T extends RecordSchema> = ModalProps & {
  record: T;
  onSubmit: (record: RecordSchemaToType<T>) => void;
};

export function RecordFormModal<T extends RecordSchema>(props: RecordFormModalProps<T>) {
  const { record, onSubmit, ...restProps } = props;

  const { styles } = useStyle();
  const { closeModal } = useModal();

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [isSubmittable, setIsSubmittable] = useState(false);

  useEffect(() => {
    form.validateFields({ validateOnly: true })
      .then(() => setIsSubmittable(true))
      .catch(() => setIsSubmittable(false));
  }, [form, values]);

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
      okButtonProps={{ disabled: !isSubmittable }}
      onOk={() => {
        onSubmit(form.getFieldsValue());
        closeModal();
      }}
      cancelText="취소"
      closeIcon={null}
      {...restProps}
    >
      <Form layout="vertical" className={styles.form} form={form}>
        {record.map(field => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            required={field.required}
            rules={[
              ...(field.required ? [{ required: true, message: `${field.label}은 필수 입력 항목입니다.` }] : []),
              ...(field.type === 'text' ? [textFieldDefaultRule] : []),
              ...(field.type === 'textarea' ? [textareaFieldDefaultRule] : []),
            ]}
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
