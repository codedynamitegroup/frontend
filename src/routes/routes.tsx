export const routes = {
  lecturer: {
    code_question: {
      management: "/lecturer/code-management",
      create: "/lecturer/code-management/create"
    },
    assignment: {
      create: "/lecturer/assignment-management/create"
    },
    question: {
      path: "lecturer/question-management",
      qtype: ["essay", "multiple-choice", "true-false"],
      create: {
        path: "create"
      }
    }
  }
};
