import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyCzF7o3Z3RTO8Bqo6s18Yj18WyFeqZrvVM");

// ...
// Access your API key as an environment variable (see "Set up your API key" above)
const format_question = [
  {
    id: 10,
    format: `
        {
            "length": 2,
            "questions": [
              {
                "id": 0,
                "question": "Ai là người đặt câu hỏi này ?",
                "answers": [
                  { "id": 1, "content": "Dương Chí Thông" }
                ],
                "correctAnswer": 0
              },
              {
                "id": 1,
                "question": "Google là công ty nào ?",
                "answers": [
                  { "id": 1, "content": "Google là một công ty đa quốc gia của Mỹ chuyên về công nghệ, tập trung vào các dịch vụ và sản phẩm liên quan đến Internet, bao gồm:
                  Công cụ tìm kiếm:" }
                ],
                "correctAnswer": 0
              }
            ]
          }
        `,
    description: "Chỉ có 1 câu trả lời"
  },
  {
    id: 20,
    format: `
    {
        "length": 5,
        "questions": [
        {
            "id": 0,
            "question": "Ai là người đặt câu hỏi này ?",
            "answers": [
            { "id": 0, "content": "Dương Chí Thông" },
            { "id": 1, "content": "Nguyễn Quốc Tuấn" },
            { "id": 2, "content": "Trương Gia Tiến" }
            ],
            "correctAnswer": 1
        },
    }`,
    description: "Có nhiều sự lựa chọn nhưng chỉ có 1 đáp án đúng"
  },
  {
    id: 30,
    format: `
    {
        "length": 5,
        "questions": [
        {
            "id": 0,
            "question": "Elon Musk stated that Tesla will not accept payments in ________ because of environmental concerns.",
            "answers": [
            { "id": 0, "content": "Bitcoin" }
            ],
            "correctAnswer": 0
        },
    }`,
    description: "Chỉ có 1 câu trả lời"
  },
  {
    id: 40,
    format: `
    {
        "length": 5,
        "questions": [
        {
            "id": 0,
            "question": "Elon Musk stated that Tesla will not accept payments in Bitcoin because of environmental concerns.",
            "answers": [
            { "id": 0, "content": "True" },
            { "id": 1, "content": "False" }
            ],
            "correctAnswer": 0
        },
        {
            "id": 1,
            "question": "Con trai thường mạnh hơn con gái ?",
            "answers": [
            { "id": 0, "content": "True" },
            { "id": 1, "content": "False" }
            ],
            "correctAnswer": 0
        },
    }`,
    description: "Đây là loại câu hỏi đúng hoặc sai (True/False) nên chỉ có 2 câu trả lời"
  }
];
async function run(topic: string, qtype: number, number_question: number, level: number) {
  // For text-only input, use the gemini-pro model
  console.log(qtype, number_question, level, topic);
  const formatQuestion = format_question.find((item) => item.id === qtype);
  console.log(formatQuestion);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  let question_type = "";
  if (qtype === 10) {
    question_type = "essay";
  } else if (qtype === 20) {
    question_type = "multiple choice";
  } else if (qtype === 30) {
    question_type = "fill in the blank";
  } else {
    question_type = "true/false";
  }

  let levelQuestion = "";
  if (level === 10) {
    levelQuestion = "easy";
  } else if (level === 20) {
    levelQuestion = "medium";
  } else {
    levelQuestion = "hard";
  }

  const AI_ROLE =
    "You are Code Question Generator AI, a replacement for teachers in a High School, located in Viet Nam. Answer in Vietnamese. You are a trained expert on programming and coding analysis. Your job is to multiple choice generate code questions according to the assignment prompt.";

  const SYSTEM_INSTRUCTIONS = `
                Give me number questions ${question_type} questions about topic in the language programming language.. The questions should be at a ${levelQuestion} level.
                Response Format:
                ${formatQuestion?.format}
                Chỉ có 2 thuộc tính là length và questions trong đó length là tổng số lượng câu hỏi, questions là mảng chứa các câu hỏi, ${formatQuestion?.description}
            Hãy dùng tiếng Việt mọi chỗ để viết câu hỏi và đáp án cho sinh viên.
            `;

  const language = "Vietnamese";
  const prompt = `${AI_ROLE} ${SYSTEM_INSTRUCTIONS} Topic: ${topic} Number question: ${number_question} level: ${level} language: ${language}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text.replace(/`/g, "");
    console.log(cleanText);
    const json = JSON.parse(cleanText.replace(/json/g, ""));
    return json;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

export default run;
