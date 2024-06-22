import { SubmissionStatusSubmitted } from "pages/client/lecturer/CourseManagement/Details/components/ExamSubmissions";

export interface ExamEntity {
  id: string;
  courseId: string;
  name: string;
  scores?: number;
  maxScores?: number;
  timeOpen: Date;
  timeClose: Date;
  timeLimit?: number;
  intro: string;
  overdueHanding?: string;
  canRedoQuestions?: boolean;
  maxAttempts?: number;
  shuffleAnswers?: boolean;
  gradeMethod: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReduxExamEntity {
  id: string;
  courseId: string;
  name: string;
  scores?: number;
  maxScores?: number;
  timeOpen: string;
  timeClose: string;
  timeLimit?: number;
  intro: string;
  overdueHanding?: string;
  canRedoQuestions?: boolean;
  maxAttempts?: number;
  shuffleAnswers?: boolean;
  gradeMethod: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamCreateRequest {
  courseId: string;
  name: string;
  intro: string;
  score: number;
  maxScore: number;
  timeOpen: Date;
  timeClose: Date;
  timeLimit: number;
  overdueHandling: string;
  canRedoQuestions: boolean;
  maxAttempts: number;
  shuffleQuestions: boolean;
  gradeMethod: string;
  questionIds: ExamQuestion[];
}

export interface ExamQuestion {
  questionId: string;
  page: number;
}

export interface ExamOverview {
  numberOfStudents: number;
  submitted: number;
}

export interface StartEndExamRequest {
  examId: string;
  userId: string;
}

export interface SubmitExamRequest {
  examId: string;
  userId: string;
  questions: ExamQuestionSubmission[];
  startTime: string;
  submitTime: string;
}

export interface ExamQuestionSubmission {
  questionId: string;
  content: string;
  numFile: number;
}

export interface ExamSubmissionDetail {
  examId: string;
  examSubmissionId: string;
  markTotal: number;
  startTime: Date;
  submitTime: Date;
  status: string;
  userId: string;
}

export interface GradeExamSubmission {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  lastSubmitAt: string;
  lastMarkAt: string;
  score: number;
  maxScore: number;
}
