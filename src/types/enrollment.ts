import { Course } from "./course";

export type EnrollmentStatus = "pending" | "active" | "cancelled" | "expired" | "completed";
export type EnrollmentSource = "manual" | "payment" | "free";

export interface Enrollment {
  id: string;
  userId: string;
  
  // Bisa berisi string ID atau Object Course lengkap (jika dipopulate)
  courseId: string | Course; 
  
  // Field "course" khusus yang dibuat manual di service (toResponse)
  // Backend Service: enrollment.course = course data...
  course?: Course; 

  status: EnrollmentStatus;
  source: EnrollmentSource;
  createdAt: string;
  updatedAt: string;
}