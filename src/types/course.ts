export type CourseLevel = "bk_tk" | "sd" | "smp" | "sma" | "umum";

export interface CourseFormReference {
  id: string;
  name: string;
  slug: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  level: CourseLevel;
  isFree: boolean;
  
  // Harga
  price: number;
  monthlyPrice?: number;

  thumbnailUrl?: string;
  
  // Info Baru
  targetAudience?: string;
  benefits?: string[];
  syllabus?: string[];
  
  // Tutor
  tutor?: {
    name: string;
    title: string;
    biography: string;
    imageUrl?: string;
  };

  registrationForm?: string | { id: string; name: string; slug: string };
  createdAt: string;
  updatedAt: string;
}