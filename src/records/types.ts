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
