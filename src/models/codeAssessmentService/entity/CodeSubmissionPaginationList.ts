import { CodeSubmissionDetailEntity } from "./CodeSubmissionDetailEntity";

export interface CodeSubmissionPaginationList {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  codeSubmissions: CodeSubmissionDetailEntity[];
}
