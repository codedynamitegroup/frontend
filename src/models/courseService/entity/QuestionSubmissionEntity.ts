export interface QuestionSubmission {
  userId: string;
  examSubmissionId: string;
  questionId: string;
  passStatus: number;
  grade: number;
  content: string;
  rightAnswer: string;
  numFile: number;
  flag: boolean;
  answerStatus: boolean;
}

export interface SubmitQuestionList {
  examId: string;
  userId: string;
  questionSubmissionCommands: SubmitQuestion[];
}

export interface SubmitQuestion {
  questionId: string;
  content: string;
  files: SubmitQuestionFile[];
  answerStatus: boolean;
  flag: boolean;
}

export interface SubmitQuestionFile {
  fileUrl: string;
  fileName: string;
}

export interface GetQuestionSubmissionCommand {
  examId: string;
  userId: string;
  questionSubmissionIds: string[];
}

export interface GetQuestionSubmissionEntity {
  questionId: string;
  passStatus: number;
  grade: number;
  content: string;
  rightAnswer: string;
  files: SubmitQuestionFile[];
  flag: boolean;
  answerStatus: boolean;
}

export interface GetQuestionSubmissionResponse {
  questionSubmissions: GetQuestionSubmissionEntity[];
}
