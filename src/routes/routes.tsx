import qtype from "utils/constant/Qtype";
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
      qtype: Object.values(qtype).map((value) => value.code),
      create: {
        path: "create"
      }
    }
  }
};
