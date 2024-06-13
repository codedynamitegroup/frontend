import { CommentEntity } from "./CommentEntity";

export interface CommentPaginationList {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  comments: CommentEntity[];
}
