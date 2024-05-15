export interface ExamEntity {
  id: string;
  courseId: {
    value: string;
  };
  name: string;
  scores: number;
  maxScores: number;
  timeOpen: Date;
  timeClose: Date;
  timeLimit: number;
  intro: string;
  overdueHanding: string;
  canRedoQuestions: boolean;
  maxAttempts: number;
  shuffleAnswers?: boolean;
  gradeMethod: string;
  createdAt: Date;
  updatedAt: Date;
}
