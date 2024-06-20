export enum EOrder {
  asc = 1,
  desc = 2
}

export enum EHtmlStatusCode {
  success = 200,
  serverError = 500,
  notFound = 404,
  badRequest = 400
}

export interface IOptionItem {
  id: string;
  name: string;
}

export interface PaginationList<T> {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}
