import { Fragment, File } from "./index";

export interface Pair {
  id: number;
  leftFile: File;
  rightFile: File;
  similarity: number;
  longestFragment: number;
  totalOverlap: number;
  leftCovered: number;
  rightCovered: number;
  fragments: Fragment[] | null;
}
