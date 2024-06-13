import { SharedSolutionEntity } from "./SharedSolutionEntity";

export interface SharedSolutionPaginationList {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  sharedSolution: SharedSolutionEntity[];
}
