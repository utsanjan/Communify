export interface IPost {
  id: string,
  title: string;
  description: string;
  createdOn: Date;
  likes: number;
  dislikes: number;
  imgName?: string;
  imageLink?: string;
  createdByName: string;
  createdById: string;
  avatar: string;
}
