import type { RecordSchema, RecordSchemaToType } from './types';

export const MemberRecord = [
  {
    type: 'text',
    name: 'name',
    label: '이름',
    required: true,
  },
  {
    type: 'text',
    name: 'address',
    label: '주소',
    required: false,
  },
  {
    type: 'textarea',
    name: 'memo',
    label: '메모',
    required: false,
  },
  {
    type: 'date',
    name: 'joinDate',
    label: '가입일',
    required: false,
  },
  {
    type: 'select',
    name: 'job',
    label: '직업',
    options: [
      { label: '개발자', value: 'developer' },
      { label: '디자이너', value: 'designer' },
      { label: 'PO', value: 'po' },
    ],
    required: true,
  },
  {
    type: 'checkbox',
    name: 'isEmailAgreed',
    label: '이메일 수신 동의',
    required: false,
  },
] as const satisfies RecordSchema;

export type Member = RecordSchemaToType<typeof MemberRecord>;
