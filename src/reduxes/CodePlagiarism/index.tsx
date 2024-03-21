import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { File, Pair } from "models/codePlagiarism";
import {
  FileInterestingnessCalculator,
  FileScoring,
  SimilarityScore
} from "utils/codePlagiarism/FileInterestingness";
import { getClusterElementsArray } from "utils/codePlagiarism/clusteringAlgorithms/ClusterFunctions";
import { singleLinkageCluster } from "utils/codePlagiarism/clusteringAlgorithms/SingleLinkageClustering";
import { guessSimilarityThreshold } from "utils/codePlagiarism/cutoff";
import getUniqueLabelsFromPairsAndFiles from "utils/codePlagiarism/getUniqueLabelsFromPairsAndFiles";

interface InitialState {
  report: {
    name: string;
    createdAt: string;
    files: File[];
    language: { name: string; extensions: string[] };
    pairs: Pair[];
    labels: { label: string; submissions: number; isActive: boolean }[];
  } | null;
  filteredPairs: Pair[];
  filterdFiles: File[];
  threshold: number;
  highestSimilarityPair: Pair | null;
  highestSimilarity: number;
  similaritiesList: number[];
  averageSimilarity: number;
  medianSimilarity: number;
  clusters: {
    id: number;
    submissions: File[];
    size: number;
    similarity: number;
    cluster: Pair[];
  }[];
}

export const getFileWithFileScoring = (file: File, filteredPairs: Pair[]): File => {
  const fileScoring = new FileInterestingnessCalculator(filteredPairs).calculateFileScoring(file);
  const newFile = {
    ...file,
    fileScoring: {
      file: fileScoring.file,
      similarityScore: {
        similarity: fileScoring.similarityScore?.similarity || 0,
        weightedScore: fileScoring.similarityScore?.weightedScore || 0,
        pair: fileScoring.similarityScore?.pair
      },
      totalOverlapScore: {
        totalOverlapTokens: fileScoring.totalOverlapScore?.totalOverlapTokens || 0,
        totalOverlapWrtSize: fileScoring.totalOverlapScore?.totalOverlapWrtSize || 0,
        weightedScore: fileScoring.totalOverlapScore?.weightedScore || 0,
        pair: fileScoring.totalOverlapScore?.pair
      },
      longestFragmentScore: {
        longestFragmentTokens: fileScoring.longestFragmentScore?.longestFragmentTokens || 0,
        longestFragmentWrtSize: fileScoring.longestFragmentScore?.longestFragmentWrtSize || 0,
        weightedScore: fileScoring.longestFragmentScore?.weightedScore || 0,
        pair: fileScoring.longestFragmentScore?.pair
      },
      finalScore: fileScoring.finalScore || 0
    } as FileScoring | null
  };

  return newFile as File;
};

const getFilteredPairsByLabel = (pairs: Pair[], labels: { label: string; isActive: boolean }[]) => {
  const inActiveLabels = labels.filter((label) => !label.isActive);
  return [...pairs].filter(
    (pair) =>
      labels.length === 0 ||
      !inActiveLabels.some(
        (label) =>
          pair.leftFile.extra?.labels === label.label ||
          pair.rightFile.extra?.labels === label.label
      )
  );
};

const getFilteredFilesByLabel = (
  files: File[],
  labels: { label: string; isActive: boolean }[],
  filteredPairs: Pair[]
) => {
  const inActiveLabels = labels.filter((label) => !label.isActive);
  const filteredFiles = [...files].filter(
    (file) =>
      labels.length === 0 || !inActiveLabels.some((label) => file.extra?.labels === label.label)
  );

  const result = filteredFiles.map((file) => {
    return getFileWithFileScoring(file, filteredPairs);
  });

  // sort by highest similarity
  result.sort(
    (a, b) =>
      (b.fileScoring?.similarityScore?.similarity || 0) -
      (a.fileScoring?.similarityScore?.similarity || 0)
  );

  return result as File[];
};

const generateAllNecessaryDataFromFilteredPairsAndFilteredFiles = (
  filteredPairs: Pair[],
  filterdFiles: File[],
  threshold: number
) => {
  const fileInterestingnessCalculator = new FileInterestingnessCalculator(filteredPairs);
  const highestSimilarityPair =
    filteredPairs.length > 0
      ? [...filteredPairs].reduce((prev, current) =>
          prev.similarity > current.similarity ? prev : current
        )
      : null;
  const highestSimilarity = highestSimilarityPair?.similarity || 0;
  const similarities = new Map(
    filterdFiles.map((file) => [
      file,
      fileInterestingnessCalculator.calculateSimilarityScore(file)
    ]) || []
  );
  const similaritiesScoreList = Array.from(similarities.values()).filter(
    (s) => s !== null
  ) as SimilarityScore[];
  const similaritiesList = similaritiesScoreList.map((s) => s?.similarity || 0);
  const mean = similaritiesList.reduce((a, b) => a + b, 0) / similaritiesList.length;
  const averageSimilarity = isNaN(mean) ? 0 : mean;
  const sorted = [...similaritiesList].sort();
  const middle = Math.floor(sorted.length / 2);
  const median = sorted[middle];
  const medianSimilarity = isNaN(median) ? 0 : median;
  const clustering = singleLinkageCluster(filteredPairs, filterdFiles, threshold / 100);
  const clusters = clustering.map((cluster) => {
    const findClusterIndex = clustering.findIndex((c) => c === cluster);
    const files = getClusterElementsArray(cluster);

    // Calculate similarity score for each file
    const newFiles = [...files].map((file) => {
      return getFileWithFileScoring(file, filteredPairs);
    });

    return {
      id: findClusterIndex,
      submissions: newFiles,
      size: newFiles.length,
      similarity: [...cluster].reduce((acc, pair) => acc + pair.similarity, 0) / cluster.size,
      cluster: Array.from(cluster)
    };
  });
  clusters.sort((a, b) => b.size - a.size);

  return {
    fileInterestingnessCalculator: fileInterestingnessCalculator,
    highestSimilarityPair: highestSimilarityPair,
    highestSimilarity: highestSimilarity,
    similarities: similarities,
    similaritiesList: similaritiesList,
    averageSimilarity: averageSimilarity,
    medianSimilarity: medianSimilarity,
    clustering: clustering,
    clusters: clusters
  };
};

const initState: InitialState = {
  report: null,
  filteredPairs: [],
  filterdFiles: [],
  threshold: 70,
  highestSimilarityPair: null,
  highestSimilarity: 0,
  similaritiesList: [],
  averageSimilarity: 0,
  medianSimilarity: 0,
  clusters: []
};

const codePlagiarismSlice = createSlice({
  name: "codePlagiarism",
  initialState: initState,
  reducers: {
    setReport: (
      state,
      action: PayloadAction<{
        report: {
          name: string;
          createdAt: string;
          files: File[];
          language: { name: string; extensions: string[] };
          pairs: Pair[];
        };
      }>
    ) => {
      const { report } = action.payload;
      const labels = getUniqueLabelsFromPairsAndFiles(report.pairs, report.files);

      const filteredPairs = getFilteredPairsByLabel(report.pairs, labels);

      const filterdFiles = getFilteredFilesByLabel(report.files, labels, filteredPairs);

      const threshold =
        Number((guessSimilarityThreshold(filteredPairs || []) * 100).toFixed(0)) < 25
          ? 25
          : Number((guessSimilarityThreshold(filteredPairs || []) * 100).toFixed(0)) > 100
            ? 100
            : Number((guessSimilarityThreshold(filteredPairs || []) * 100).toFixed(0));

      const {
        highestSimilarityPair,
        highestSimilarity,
        similaritiesList,
        averageSimilarity,
        medianSimilarity,
        clusters
      } = generateAllNecessaryDataFromFilteredPairsAndFilteredFiles(
        filteredPairs,
        filterdFiles,
        threshold
      );

      state.report = {
        ...report,
        labels: labels
      };
      state.filteredPairs = filteredPairs;
      state.filterdFiles = filterdFiles;
      state.threshold = threshold;
      state.highestSimilarityPair = highestSimilarityPair;
      state.highestSimilarity = highestSimilarity;
      state.similaritiesList = similaritiesList;
      state.averageSimilarity = averageSimilarity;
      state.medianSimilarity = medianSimilarity;
      state.clusters = clusters;
    },
    setLabel: (state, action: PayloadAction<{ label: string; isActive: boolean }>) => {
      const { label, isActive } = action.payload;
      if (!state.report) return;
      const newLabels = state.report.labels.map((l) => {
        if (l.label === label) {
          return { ...l, isActive };
        }
        return l;
      });

      const filteredPairs = getFilteredPairsByLabel(state.report.pairs, newLabels);

      const filterdFiles = getFilteredFilesByLabel(state.report.files, newLabels, filteredPairs);

      const {
        highestSimilarityPair,
        highestSimilarity,
        similaritiesList,
        averageSimilarity,
        medianSimilarity,
        clusters
      } = generateAllNecessaryDataFromFilteredPairsAndFilteredFiles(
        filteredPairs,
        filterdFiles,
        state.threshold
      );

      state.report.labels = newLabels;
      state.filteredPairs = filteredPairs;
      state.filterdFiles = filterdFiles;
      state.highestSimilarityPair = highestSimilarityPair;
      state.highestSimilarity = highestSimilarity;
      state.similaritiesList = similaritiesList;
      state.averageSimilarity = averageSimilarity;
      state.medianSimilarity = medianSimilarity;
      state.clusters = clusters;
    },
    setThreshold: (state, action: PayloadAction<number>) => {
      const threshold = action.payload;
      if (!state.report) return;

      const clustering = singleLinkageCluster(
        state.report.pairs,
        state.report.files,
        threshold / 100
      );
      const clusters = clustering.map((cluster) => {
        const findIndex = clustering.findIndex((c) => c === cluster);
        const files = getClusterElementsArray(cluster);

        // Calculate similarity score for each file
        const newFiles = [...files].map((file) => {
          if (!state.report) {
            return file;
          }
          return getFileWithFileScoring(file, state.report.pairs);
        });

        return {
          id: findIndex,
          submissions: newFiles,
          size: newFiles.length,
          similarity: [...cluster].reduce((acc, pair) => acc + pair.similarity, 0) / cluster.size,
          cluster: Array.from(cluster)
        };
      });
      clusters.sort((a, b) => b.size - a.size);

      state.threshold = threshold;
      state.clusters = clusters;
    }
  }
});

export const { setReport, setLabel, setThreshold } = codePlagiarismSlice.actions;

export default codePlagiarismSlice.reducer;
