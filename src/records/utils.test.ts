import { describe, it, expect } from 'vitest';
import { createRecordSchema } from './utils';
import type { RecordField } from './types';

describe('createRecordSchema', () => {
  describe('기본 필드 타입 스키마 생성', () => {
    it.each([
      {
        type: 'text' as const,
        name: 'name',
        label: '이름',
        required: true,
        validValue: 'John Doe',
        invalidValue: 123,
      },
      {
        type: 'textarea' as const,
        name: 'memo',
        label: '메모',
        required: true,
        validValue: 'Long text content',
        invalidValue: 123,
      },
      {
        type: 'select' as const,
        name: 'job',
        label: '직업',
        required: true,
        options: [
          { label: '개발자', value: 'developer' },
          { label: '디자이너', value: 'designer' },
        ],
        validValue: 'developer',
        invalidValue: 123,
      },
      {
        type: 'checkbox' as const,
        name: 'agree',
        label: '동의',
        required: true,
        validValue: true,
        invalidValue: 'yes',
      },
      {
        type: 'date' as const,
        name: 'joinDate',
        label: '가입일',
        required: true,
        validValue: '2024-01-01',
        invalidValue: 'invalid-date',
      },
    ])('$type 필드에 대한 스키마를 생성한다', ({ type, name, label, required, validValue, invalidValue, ...extraProps }) => {
      const field: RecordField = { type, name, label, required, ...extraProps } as RecordField;
      const record: RecordField[] = [field];
      const schema = createRecordSchema(record);

      expect(schema.safeParse({ [name]: validValue }).success).toBe(true);
      expect(schema.safeParse({ [name]: invalidValue }).success).toBe(false);
    });

    it('checkbox 필드는 true/false 모두 허용한다', () => {
      const record: RecordField[] = [
        { type: 'checkbox', name: 'agree', label: '동의', required: true },
      ];
      const schema = createRecordSchema(record);

      expect(schema.safeParse({ agree: true }).success).toBe(true);
      expect(schema.safeParse({ agree: false }).success).toBe(true);
      expect(schema.safeParse({ agree: 'yes' }).success).toBe(false);
    });
  });

  describe('required/optional 필드 처리', () => {
    it.each([
      {
        description: 'required 필드가 누락되면 파싱이 실패한다',
        field: { type: 'text' as const, name: 'name', label: '이름', required: true },
        data: {},
        shouldPass: false,
      },
      {
        description: 'optional 필드가 누락되어도 파싱이 성공한다',
        field: { type: 'text' as const, name: 'name', label: '이름', required: false },
        data: {},
        shouldPass: true,
      },
      {
        description: 'optional 필드에 값이 있어도 파싱이 성공한다',
        field: { type: 'text' as const, name: 'name', label: '이름', required: false },
        data: { name: 'John' },
        shouldPass: true,
      },
    ])('$description', ({ field, data, shouldPass }) => {
      const record: RecordField[] = [field];
      const schema = createRecordSchema(record);

      const result = schema.safeParse(data);
      expect(result.success).toBe(shouldPass);

      if (!shouldPass && !result.success) {
        expect(result.error.issues[0].code).toBe('invalid_type');
        expect(result.error.issues[0].path).toEqual([field.name]);
      }
    });

    it('required와 optional 필드가 섞여있을 때 올바르게 처리한다', () => {
      const record: RecordField[] = [
        { type: 'text', name: 'name', label: '이름', required: true },
        { type: 'text', name: 'address', label: '주소', required: false },
      ];
      const schema = createRecordSchema(record);

      expect(schema.safeParse({ name: 'John' }).success).toBe(true);
      expect(schema.safeParse({ name: 'John', address: '서울' }).success).toBe(true);
      expect(schema.safeParse({ address: '서울' }).success).toBe(false);
    });
  });

  describe('날짜 필드 유효성 검증', () => {
    const dateRecord: RecordField[] = [
      { type: 'date', name: 'date', label: '날짜', required: true },
    ];

    it.each([
      '2024-01-01',
      '2024-12-31',
      '2000-02-29',
      '2024-02-28',
      '1900-01-01',
      '2099-12-31',
    ])('유효한 날짜 형식 "%s"을 허용한다', (date) => {
      const schema = createRecordSchema(dateRecord);
      expect(schema.safeParse({ date }).success).toBe(true);
    });

    it.each([
      { date: '2024/01/01', reason: '잘못된 구분자' },
      { date: '24-01-01', reason: '2자리 년도' },
      { date: '2024-1-1', reason: '0이 없는 월/일' },
      { date: '2024-13-01', reason: '잘못된 월' },
      { date: '2024-01-32', reason: '잘못된 일' },
      { date: 'invalid-date', reason: '완전히 잘못된 형식' },
      { date: '2024-01-01T00:00:00', reason: '시간 포함' },
      { date: '', reason: '빈 문자열' },
      { date: '2024-01-01 10:30', reason: '공백과 시간 포함' },
    ])('잘못된 날짜 형식 "$date" ($reason)를 거부한다', ({ date }) => {
      const schema = createRecordSchema(dateRecord);

      const result = schema.safeParse({ date });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('유효한 날짜 형식이 아닙니다 (YYYY-MM-DD)');
      }
    });

    it.each([
      { value: 20240101, type: '숫자' },
      { value: new Date(), type: 'Date 객체' },
      { value: null, type: 'null' },
      { value: undefined, type: 'undefined' },
      { value: [], type: '배열' },
      { value: {}, type: '객체' },
    ])('$type 타입은 거부한다', ({ value }) => {
      const schema = createRecordSchema(dateRecord);
      expect(schema.safeParse({ date: value }).success).toBe(false);
    });
  });

  describe('복합 스키마 테스트', () => {
    const complexRecord: RecordField[] = [
      { type: 'text', name: 'name', label: '이름', required: true },
      { type: 'text', name: 'address', label: '주소', required: false },
      { type: 'textarea', name: 'memo', label: '메모', required: false },
      { type: 'date', name: 'joinDate', label: '가입일', required: true },
      {
        type: 'select',
        name: 'job',
        label: '직업',
        required: true,
        options: [
          { label: '개발자', value: 'developer' },
          { label: '디자이너', value: 'designer' },
        ],
      },
      { type: 'checkbox', name: 'emailConsent', label: '이메일 수신 동의', required: false },
    ];

    it.each([
      {
        description: '모든 필드가 올바를 때',
        data: {
          name: 'John Doe',
          address: '서울 강남구',
          memo: '테스트 메모',
          joinDate: '2024-01-01',
          job: 'developer',
          emailConsent: true,
        },
        shouldPass: true,
      },
      {
        description: 'optional 필드가 누락되어도',
        data: {
          name: 'John Doe',
          joinDate: '2024-01-01',
          job: 'developer',
        },
        shouldPass: true,
      },
      {
        description: 'required 필드가 누락되면',
        data: {
          name: 'John Doe',
          address: '서울 강남구',
        },
        shouldPass: false,
      },
    ])('복합 스키마 - $description 파싱 결과를 확인한다', ({ data, shouldPass }) => {
      const schema = createRecordSchema(complexRecord);

      const result = schema.safeParse(data);
      expect(result.success).toBe(shouldPass);

      if (!shouldPass && !result.success) {
        const missingFields = result.error.issues.map(issue => issue.path[0]);
        expect(missingFields).toContain('joinDate');
        expect(missingFields).toContain('job');
      }
    });

    it('잘못된 타입의 데이터는 파싱이 실패한다', () => {
      const schema = createRecordSchema(complexRecord);

      const invalidData = {
        name: 123,
        joinDate: '2024-01-01',
        job: 'developer',
        emailConsent: 'yes',
      };

      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);
        expect(result.error.issues.map(issue => issue.path[0])).toContain('name');
        expect(result.error.issues.map(issue => issue.path[0])).toContain('emailConsent');
      }
    });
  });

  describe('에러 메시지 테스트', () => {
    it('날짜 필드 에러 메시지가 올바르게 표시된다', () => {
      const record: RecordField[] = [
        { type: 'date', name: 'date', label: '날짜', required: true },
      ];
      const schema = createRecordSchema(record);

      const result = schema.safeParse({ date: 'invalid-date' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('유효한 날짜 형식이 아닙니다 (YYYY-MM-DD)');
      }
    });

    it('여러 필드 에러가 동시에 발생할 때 모든 에러가 반환된다', () => {
      const record: RecordField[] = [
        { type: 'text', name: 'name', label: '이름', required: true },
        { type: 'date', name: 'date', label: '날짜', required: true },
      ];
      const schema = createRecordSchema(record);

      const result = schema.safeParse({ date: 'invalid-date' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);

        const missingNameError = result.error.issues.find(issue => issue.path[0] === 'name');
        const invalidDateError = result.error.issues.find(issue => issue.path[0] === 'date');

        expect(missingNameError?.code).toBe('invalid_type');
        expect(invalidDateError?.message).toBe('유효한 날짜 형식이 아닙니다 (YYYY-MM-DD)');
      }
    });
  });
});
