import { Hash, File } from "./index";

export interface Kgram {
  id: number;
  hash: Hash;
  data: string;
  files: File[];
}
