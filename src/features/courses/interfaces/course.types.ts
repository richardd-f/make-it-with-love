export interface ICourse {
  id: string;
  title: string;
  author: string;
  rating: number;
  totalReviews: number;
  price: number;
  category: string;
  ageRange: string;
  thumbnailUrl: string;
  tags?: string[]; // e.g. "Bestseller", "New"
}

export interface ICourseFilters {
  query: string;
  categories: string[];
  ageRanges: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ICourseContent {
  id: string;
  title: string;
  duration: string;
  isLocked: boolean;
}

export interface IStarterKit {
  tools: string[];
  weight: string;
  estimatedDelivery: string;
  inStock: boolean;
}

export interface IReview {
  id: string;
  userName: string;
  rating: number;
  text: string;
  resultImageUrl?: string;
  createdAt: string;
}

export interface ICourseDetail extends ICourse {
  description: string;
  videoPreviewUrl: string;
  totalStudents: number;
  starterKit: IStarterKit;
  contents: ICourseContent[];
  reviews: IReview[];
  isOwned?: boolean;
}
