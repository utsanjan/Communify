export interface IComment {
  id: string;
  content: string;
  avatar: string;
  createdOn: Date;
  createdBy: string;
  likes: number;
  dislikes: number;
}
