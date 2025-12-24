export type CourseLevel = 'bk_tk' | 'sd' | 'smp' | 'sma' | 'umum';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  level: CourseLevel;
  isFree: boolean;
  price: number;
  thumbnailUrl: string | null;
  registrationForm?: string | {
    id: string;
    slug: string;
    name: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}