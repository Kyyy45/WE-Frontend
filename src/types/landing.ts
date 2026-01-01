export interface CourseBenefit {
  value: string;
}

export interface CourseTutor {
  name: string;
  title: string;
  biography?: string;
  imageUrl?: string;
  imagePublicId?: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  level: string;
  price: number;
  monthlyPrice?: number;
  isFree: boolean;
  benefits?: CourseBenefit[] | string[];
  tutor?: CourseTutor;
  thumbnailUrl?: string;
}

export interface LandingSectionProps {
  isLoading?: boolean;
  className?: string;
}
