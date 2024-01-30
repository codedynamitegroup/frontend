export const routes = {
  lecturer: {
    code_question: {
      management: "/lecturer/code-management",
      create: "/lecturer/code-management/create"
    },
    assignment: {
      create: "/lecturer/assignment-management/create",
      grading: "/lecturer/assignment-management/:submissionId/grading"
    },
    question: {
      essay: {
        create: "/lecturer/question-management/essay/create"
      }
    }
  },
  user: {
    problem: "/problem"
  }
};
