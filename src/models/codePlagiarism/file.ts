import { FileScoring } from "./../../utils/codePlagiarism/FileInterestingness";

export interface DolosCustomFile {
  id: number;
  path: string;
  charCount: number;
  lines: string[];
  lineCount: number;
  amountOfKgrams: number;
  extra: {
    id: string;
    questionId: string;
    questionName: string;
    userId: string;
    orgUserId: string;
    userFullName: string;
    programmingLanguage: string;
    examId: string;
    examName: string;
    filename: string;
    fullName: string;
    status: string;
    submissionID: string;
    nameEN: string;
    nameNL: string;
    exerciseID: string;
    createdAt: string;
    labels: string;
  };
  fileScoring: FileScoring | null;
}

export type File = DolosCustomFile;
