export const routes = {
  lecturer: {
    code_question: {
      management: "/lecturer/code-management",
      create: "/lecturer/code-management/create",
      details: "/lecturer/code-management/edit/:id/*",
      information: "/lecturer/code-management/edit/:id/information",
      test_cases: "/lecturer/code-management/edit/:id/test-cases",
      code_stubs: "/lecturer/code-management/edit/:id/code-stubs",
      languages: "/lecturer/code-management/edit/:id/languages"
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
    problem: {
      list: "/problem",
      detail: "/problem/:id"
    },
    assignment: {
      submission: "/assignments/:assignmentId/submission"
    }
  }
};
