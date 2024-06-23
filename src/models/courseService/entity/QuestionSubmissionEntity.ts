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
  numFile: number;
  answerStatus: boolean;
  flag: boolean;
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
  numFile: number;
  flag: boolean;
  answerStatus: boolean;
}

export interface GetQuestionSubmissionResponse {
  questionSubmissions: GetQuestionSubmissionEntity[];
}
