import type { RecordSchema, RecordField, TextField, TextareaField, SelectField, CheckboxField, DateField } from './types';
import { z } from 'zod';

type ApplyRequired<T extends z.ZodType, R extends boolean> = R extends true
  ? T
  : z.ZodOptional<T>;

type FieldTypeToZodSchema<T extends RecordField> = T extends TextField | TextareaField
  ? z.ZodString
  : T extends CheckboxField
    ? z.ZodBoolean
    : T extends DateField
      ? z.ZodString
      : T extends SelectField
        ? T['options'] extends readonly { value: infer V }[]
          ? V extends string
            ? z.ZodEnum<[V, ...V[]]>
            : z.ZodString
          : z.ZodString
        : never;

type FieldToZodSchema<T extends RecordField> = ApplyRequired<
  FieldTypeToZodSchema<T>,
  T['required']
>;

type RecordToZodSchema<T extends RecordSchema> = z.ZodObject<{
  [K in T[number]['name']]: FieldToZodSchema<Extract<T[number], { name: K }>>
}>;

function convertFieldToZodSchema(field: RecordField): z.ZodType {
  let schema: z.ZodType;

  switch (field.type) {
    case 'text':
    case 'textarea':
      schema = z.string();
      break;
    case 'select':
      schema = field.options.length > 0
        ? z.enum([field.options[0].value, ...field.options.slice(1).map(option => option.value)])
        : z.string();
      break;
    case 'checkbox': {
      schema = z.boolean();
      break;
    }
    case 'date': {
      schema = z.string().refine(
        (value: string) => !Number.isNaN(new Date(value).getTime()) && value.match(/^\d{4}-\d{2}-\d{2}$/),
        { message: '유효한 날짜 형식이 아닙니다 (YYYY-MM-DD)' },
      );
      break;
    }
    default:
      throw field satisfies never;
  }

  return field.required ? schema : schema.optional();
}

export function createRecordSchema<T extends RecordSchema>(record: T): RecordToZodSchema<T> {
  const schemaFields = record.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: convertFieldToZodSchema(field),
    }),
    {} satisfies Record<string, z.ZodType>,
  );

  return z.object(schemaFields) as RecordToZodSchema<T>;
}
