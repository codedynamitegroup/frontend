import { Pair, File } from "models/codePlagiarism";

const getUniqueLabelsFromPairsAndFiles = (pairs: Pair[], files: File[]) => {
  const labels = new Set<string>();
  for (const pair of pairs || []) {
    if (pair.leftFile.extra) {
      labels.add(pair.leftFile.extra.labels);
    }
    if (pair.rightFile.extra) {
      labels.add(pair.rightFile.extra.labels);
    }
  }
  const resultArray = Array.from(labels).map((label) => ({
    label,
    submissions: files?.filter((file) => file.extra?.labels === label).length || 0,
    isActive: true
  }));

  const filterEmptyLabelArray = resultArray.filter(
    (item) => typeof item.label === "string" && item.label.length > 0
  );

  return filterEmptyLabelArray;
};

export default getUniqueLabelsFromPairsAndFiles;
