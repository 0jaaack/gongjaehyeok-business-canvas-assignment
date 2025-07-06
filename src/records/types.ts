type BaseField = {
  type: 'text' | 'textarea' | 'date' | 'select' | 'checkbox';
  name: string;
  label: string;
  required: boolean;
};

export type TextField = BaseField & {
  type: 'text';
};

export type TextareaField = BaseField & {
  type: 'textarea';
};

export type DateField = BaseField & {
  type: 'date';
};

export type SelectField = BaseField & {
  type: 'select';
  options: {
    label: string;
    value: string;
  }[];
};

export type CheckboxField = BaseField & {
  type: 'checkbox';
};

export type RecordField = TextField | TextareaField | DateField | SelectField | CheckboxField;
export type RecordSchema = RecordField[];

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type FieldToType<T extends RecordField>
  = T extends TextField ? string
    : T extends TextareaField ? string
      : T extends DateField ? string
        : T extends SelectField ? T['options'][number]['value']
          : T extends CheckboxField ? boolean
            : never;

export type RecordSchemaToType<T extends readonly RecordField[]> = Prettify<{
  [K in T[number]['name'] as Extract<T[number], { name: K }>['required'] extends true ? K : never]: FieldToType<Extract<T[number], { name: K }>>
} & {
  [K in T[number]['name'] as Extract<T[number], { name: K }>['required'] extends false ? K : never]?: FieldToType<Extract<T[number], { name: K }>>
}>;
