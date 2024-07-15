import { User } from "models/authService/entity/user";

export interface PostEntity {
  postId: string;
  title: string;
  content: string;
  summary: string;
  isPublished: boolean;
  createdBy: User;
  createdAt: string;
}
