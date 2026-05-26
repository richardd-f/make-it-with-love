export interface ICartItem {
  cartId: string;
  courseId: string;
  title: string;
  thumbnailUrl: string | null;
  price: number;
  amountOfMeeting: number;
  createdAt: Date;
}
