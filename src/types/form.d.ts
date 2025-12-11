import { PaginatedResult, PaginationParams } from "./api";

// Enums (Sesuai form.model.ts)
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
  | 'phone';

// Definisi Satu Field
export interface FormField {
  key: string; // key untuk payload submission (misal: "fullName")
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { label: string; value: string }[]; // Opsional (untuk select/radio)
  order?: number;
}

// Definisi Form Lengkap
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

// Definisi Submission (Jawaban User)
export interface FormSubmission {
  id: string;
  formId: string;
  userId?: string | null; // null jika user tidak login (guest)
  data: Record<string, unknown>; // Payload dinamis { "fullName": "Budi", "age": 20 }
  createdAt: string;
}

// REQUEST PAYLOADS

export interface CreateFormRequest {
  name: string;
  description?: string;
  status?: FormStatus;
  visibility?: FormVisibility;
  fields: FormField[];
}

export interface UpdateFormRequest {
  name?: string;
  description?: string;
  status?: FormStatus;
  visibility?: FormVisibility;
  fields?: FormField[];
}

// Payload submit jawaban (Public)
export interface SubmitFormRequest {
  [key: string]: unknown; // Dinamis sesuai field key
}

// PARAMS & RESPONSE (Admin)

export interface FormListParams extends PaginationParams {
  status?: FormStatus;
  // search sudah ada di PaginationParams
}

export interface SubmissionListParams extends PaginationParams {
  formId?: string; // Filter submission berdasarkan form tertentu
}

export type FormListResponse = PaginatedResult<Form>;
export type SubmissionListResponse = PaginatedResult<FormSubmission>;