export interface FormFieldBase {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}

export interface SelectField extends FormFieldBase {
  type: 'select';
  options: Array<{value: string, label: string}>;
}

export interface RadioField extends FormFieldBase {
  type: 'radio';
  options: Array<{value: string, label: string}>;
}

export interface TextField extends FormFieldBase {
  type: 'text' | 'email' | 'textarea';
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export type FormField = SelectField | RadioField | TextField;

export interface FormSchema {
  formTitle: string;
  formDescription: string;
  fields: FormField[];
}