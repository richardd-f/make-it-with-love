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
