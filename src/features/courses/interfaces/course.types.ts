export interface ICourse {
  id: string;
  title: string;
  author: string;
  rating: number;
  totalReviews: number;
  totalStudents?: number;
  price: number;
  category: string;
  ageRange: string;
  thumbnailUrl: string;
  tags?: string[];
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
  description: string;
  duration: string;
  isLocked: boolean;
  videoUrl?: string;
  isDone?: boolean;
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
  isSubscribed?: boolean;
  meetingsAmountLeft?: number;
  subscriptionMeetingsLeft?: number;
  amountOfMeeting?: number;
  isWishlisted?: boolean;
}

export interface IEnrolledCourse extends ICourse {
  description: string;
  totalVideos: number;
  watchedVideos: number;
}
