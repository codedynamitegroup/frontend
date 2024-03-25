import { File, Pair } from "models/codePlagiarism";

const getUniqueFilesFromPairs = (pairs: Pair[]) => {
  const filesMap = new Map<number, File>();
  for (const pair of pairs || []) {
    filesMap.set(pair.leftFile.id, pair.leftFile);
    filesMap.set(pair.rightFile.id, pair.rightFile);
  }
  return Array.from(filesMap.values());
};

export default getUniqueFilesFromPairs;
