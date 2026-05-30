export interface IGalleryPost {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  authorName: string;
  authorProfilePic: string;
  courseId: string;
  createdAt: Date;
}
