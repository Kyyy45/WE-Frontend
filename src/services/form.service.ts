import { fetcher } from "./api";
import {
  Form,
  FormListParams,
  FormListResponse,
  CreateFormRequest,
  UpdateFormRequest,
  SubmitFormRequest,
  FormSubmission,
  SubmissionListParams,
  SubmissionListResponse,
} from "@/types/form";

export const formService = {
  // ===== PUBLIC ACCESS =====

  /**
   * Get Form Definition by Slug
   * Digunakan untuk merender form di halaman public
   */
  getFormBySlug: async (slug: string) => {
    return fetcher<Form>(`/forms/public/${slug}`);
  },

  /**
   * Submit Form Data
   * Payload dinamis { [key]: value }
   */
  submitForm: async (slug: string, data: SubmitFormRequest) => {
    return fetcher<{ message: string; data: FormSubmission }>(`/forms/public/${slug}/submissions`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // ===== ADMIN ACCESS: FORM DEFINITIONS =====

  /**
   * [ADMIN] List All Forms
   */
  adminListForms: async (params?: FormListParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    if (params?.status) query.append("status", params.status);

    return fetcher<FormListResponse>(`/forms?${query.toString()}`);
  },

  /**
   * [ADMIN] Get Form Detail
   */
  adminGetFormById: async (id: string) => {
    return fetcher<Form>(`/forms/${id}`);
  },

  /**
   * [ADMIN] Create New Form
   */
  adminCreateForm: async (data: CreateFormRequest) => {
    return fetcher<{ message: string; data: Form }>("/forms", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * [ADMIN] Update Form
   */
  adminUpdateForm: async (id: string, data: UpdateFormRequest) => {
    return fetcher<{ message: string; data: Form }>(`/forms/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * [ADMIN] Delete Form
   * Hati-hati: ini juga menghapus semua submission terkait
   */
  adminDeleteForm: async (id: string) => {
    return fetcher<{ message: string }>(`/forms/${id}`, {
      method: "DELETE",
    });
  },

  // ===== ADMIN ACCESS: SUBMISSIONS =====

  /**
   * [ADMIN] List Submissions
   * Bisa filter by formId untuk melihat jawaban form tertentu
   */
  adminListSubmissions: async (params?: SubmissionListParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.formId) query.append("formId", params.formId);

    return fetcher<SubmissionListResponse>(`/forms/submissions/list?${query.toString()}`);
  },

  /**
   * [ADMIN] Get Submission Detail
   */
  adminGetSubmissionById: async (id: string) => {
    return fetcher<FormSubmission>(`/forms/submissions/${id}`);
  },

  /**
   * [ADMIN] Delete Submission
   */
  adminDeleteSubmission: async (id: string) => {
    return fetcher<{ message: string }>(`/forms/submissions/${id}`, {
      method: "DELETE",
    });
  },
};