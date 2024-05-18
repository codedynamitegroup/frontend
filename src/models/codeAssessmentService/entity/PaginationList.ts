export interface PaginationList<Entity> {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  codeQuestions: Entity[];
}
