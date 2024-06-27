const qtype = {
  essay: { code: "ESSAY", vi_name: "Câu hỏi tự luận", en_name: "Essay question" },
  short_answer: {
    code: "SHORT_ANSWER",
    vi_name: "Câu hỏi trả lời ngắn",
    en_name: "Short answer question"
  },
  multiple_choice: {
    code: "MULTIPLE_CHOICE",
    vi_name: "Câu hỏi nhiều lựa chọn",
    en_name: "Multiple choice question"
  },
  true_false: {
    code: "TRUE_FALSE",
    vi_name: "Câu hỏi đúng sai",
    en_name: "Yes / No question"
  },
  source_code: {
    code: "CODE",
    vi_name: "Câu hỏi lập trình",
    en_name: "Programming question"
  },
  ai: { code: "ai", vi_name: "AI", en_name: "AI" }
};

export default qtype;
