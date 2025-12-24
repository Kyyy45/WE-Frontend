export type FormStatus = 'active' | 'inactive';
export type FormVisibility = 'public' | 'authenticated';

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'email'
  | 'phone'
  | 'header';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  key: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: FormFieldOption[];
  order?: number;
}

export interface Form {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: FormStatus;
  visibility: FormVisibility;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}