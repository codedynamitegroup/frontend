import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_AI_KEY || "");

// ...
// Access your API key as an environment variable (see "Set up your API key" above)
const format_question = [
  {
    qtypeId: 10,
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
    qtypeId: 20,
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
    qtypeId: 30,
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
    qtypeId: 40,
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
async function run(
  topic: string,
  description: string,
  qtype: number,
  number_question: number,
  level: number
) {
  // For text-only input, use the gemini-pro model
  const formatQuestion = format_question.find((item) => item.qtypeId === qtype);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  let question_type = "";
  if (qtype === 10) {
    question_type = "constructed-response";
  } else if (qtype === 20) {
    question_type = "multiple choice";
  } else if (qtype === 30) {
    question_type = "short answer";
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

  const AI_ROLE = `You are Code Question Generator AI, a replacement for teachers in a High School, located in Viet Nam. 
		Answer in Vietnamese. You are a trained expert on domain related to software engineering and programming. 
		Your job are required to generate code questions which has types such as multiple choice, true/false, short answer, constructed-response according to the assignment prompt.`;

  const SYSTEM_INSTRUCTIONS = `
                Give me ${number_question} questions which are ${question_type} questions about topic named ${topic}.
								The detailed description of this topic is: ${description}.
								The questions should be at a ${levelQuestion} level.
                Response Format should be JSON:
                ${formatQuestion?.format}
								This response format has only 3 attributes: qtypeId, format and description.
								- format: The format of the question have 2 attributes: length and questions, and this follows the structure below:
									+ length: The total number of questions.
									+ questions: An array containing the questions.
								- description: The description of the question (optional, which has value ${formatQuestion?.description}}.
								- qtypeId: The type of the question which can be 10(constructed-response), 20(multiple choice), 30(short answer), 40(true/false).
								Please use Vietnamese everywhere to write questions and answers for students.
            `;

  const prompt = `${AI_ROLE} ${SYSTEM_INSTRUCTIONS}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text.replace(/```/g, "");
    const json = JSON.parse(cleanText.replace(/json/g, ""));
    return json;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

export default run;
