export interface QuestionEntity {
  id: string;
  organizationId: string;
  difficulty: string;
  name: string;
  questionText: string;
  generalFeedback: string;
  defaultMark: number;
  createdAt: string;
  updatedAt: string;
  message: string;
  qtype: string;
}

export interface GetQuestionExam {
  id: string;
  difficulty: string;
  name: string;
  questionText: string;
  page: number;
  qtype: string;
}

export interface GetAllQuestionWithPaginationCommand {
  searchName?: string;
  pageNo?: number;
  pageSize?: number;
  qtype?: string;
}

interface GetAllQuestionResponseEntity {
  questionId: string;
  name: string;
  difficulty: string;
  questionText: string;
}

export interface GetAllQuestionWithPaginationResponse {
  questions: GetAllQuestionResponseEntity[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
