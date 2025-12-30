export type FormStatus = "active" | "inactive";
export type FormVisibility = "public" | "authenticated";

export type FormFieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "email"
  | "phone"
  | "header";

export interface FormOption {
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
  options?: FormOption[];
  order?: number;
}

export interface Form {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: FormStatus;
  visibility: FormVisibility;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export type FormSubmissionValue =
  | string
  | number
  | boolean
  | string[]
  | null
  | undefined;

// Untuk Submission (Jawaban Form)
export interface FormSubmission {
  id: string;
  formId: string;
  userId?: string | null;
  data: Record<string, FormSubmissionValue>;
  createdAt: string;
}
