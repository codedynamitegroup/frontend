import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonrepair } from "jsonrepair";
import {
  EQType,
  EQuestionLevel,
  EAmountAnswer,
  ELanguage
} from "../pages/client/lecturer/QuestionManagement/components/AICreateQuestion";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_AI_KEY || "");

export interface IFormatQuestion {
  qtypeId: EQType;
  questions: IQuestion[];
}

export interface IQuestion {
  id: number;
  question: string;
  answers: IAnswer[];
  correctAnswer?: number;
}

export interface IAnswer {
  id: number;
  content: string;
}

const format_question: IFormatQuestion[] = [
  {
    qtypeId: 1,
    questions: [
      {
        id: 0,
        question: "Ai là người đặt câu hỏi này ?",
        answers: [{ id: 1, content: "Không ai cả" }]
      },
      {
        id: 1,
        question: "Google là công ty nào ?",
        answers: [
          {
            id: 1,
            content: `Google là một công ty đa quốc gia của Mỹ chuyên về công nghệ, tập trung vào các dịch vụ và sản phẩm liên quan đến Internet, bao gồm:
					Công cụ tìm kiếm:`
          }
        ]
      }
    ]
  },
  {
    qtypeId: 2,
    questions: [
      {
        id: 0,
        question: "Ai là người đặt câu hỏi này ?",
        answers: [
          { id: 1, content: "Dương Chí Thông" },
          { id: 2, content: "Nguyễn Quốc Tuấn" },
          { id: 3, content: "Trương Gia Tiến" }
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    qtypeId: 3,
    questions: [
      {
        id: 0,
        question:
          "Elon Musk stated that Tesla will not accept payments in ________ because of environmental concerns.",
        answers: [{ id: 0, content: "Bitcoin" }]
      }
    ]
  },
  {
    qtypeId: 4,
    questions: [
      {
        id: 0,
        question:
          "Elon Musk stated that Tesla will not accept payments in Bitcoin because of environmental concerns.",
        answers: [
          { id: 1, content: "True" },
          { id: 2, content: "False" }
        ],
        correctAnswer: 1
      },
      {
        id: 1,
        question: "Con trai thường cá tính hơn con gái ?",
        answers: [
          { id: 1, content: "True" },
          { id: 2, content: "False" }
        ],
        correctAnswer: 1
      }
    ]
  }
];
async function createQuestionByAI(
  topic: string,
  description: string,
  qtype: EQType,
  qamount_answer: EAmountAnswer,
  number_question: number,
  level: EQuestionLevel,
  language: ELanguage
) {
  // For text-only input, use the gemini-pro model
  const formatQuestion = format_question.find((item) => item.qtypeId === qtype);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  let question_type = "";
  if (qtype === EQType.Essay) {
    question_type = "Essay";
  } else if (qtype === EQType.MultipleChoice) {
    question_type = "Multiple choice";
  } else if (qtype === EQType.ShortAnswer) {
    question_type = "Short answer";
  } else {
    question_type = "True/false";
  }

  let levelQuestion = "";
  if (level === EQuestionLevel.Easy) {
    levelQuestion = "Beginner";
  } else if (level === EQuestionLevel.Medium) {
    levelQuestion = "Intermediate";
  } else {
    levelQuestion = "Advanced";
  }

  const AI_ROLE = `
I. YOUR ROLE:
	A. You are Generator Question AI, a large language model trained on a massive dataset of text and code.
  B. Your expertise encompasses various domains, including software engineering and programming.
  C. You can generate code-related questions of diverse types (multiple choice, true/false, short answer, essay) to aid learning and assessment in Tertiary Education.`;

  const SYSTEM_INSTRUCTIONS = `
II. SYSTEM_INSTRUCTIONS:
	A. Goal: Generate a well-structured JSON response containing questions aligned with the specified criteria.

	B. Provided Information Details:
	- Topic: "${topic}"
	- Description: ${description || "No description provided."}
	- Question Type: "${question_type}"
  ${qtype === EQType.MultipleChoice ? `- The Amount of answer to each question: ${qamount_answer}` : ""}
  - Number of Questions: ${number_question}
	- Level: "${levelQuestion}"

	C. Expected Response Format:
		The structure of the response must be JSON which follows the following structure:
		- qtypeId: The type of question contains the following values.
			+ 1: Essay
			+ 2: Multiple choice
			+ 3: Short answer
			+ 4: True/False
		- questions: An array of questions (IQuestion).
			+ IQuestion: The data structure for a question:
				* id: A number, the unique identifier for the question.
				* question: A string, the content of the question. Do not use "" (Quotation Marks) on any character in the string. Instead, if you want to highlight text,... For example, replace it with \\"Personal Name\\" 
				* answers: An array of answer (IAnswer[]) representing the answer
					** Note:
						*** Answer should follow the markdown syntax. Must be use "\\n" for line breaks.
						*** For "Essay" and "Short Answer" questions, there should only be 1 answer element, and the content attribute of the answer should not be empty or null. It should be filled with complete information, which can be the detailed answer to the question, suggestions for answering the question, etc., to help the question creator know the appropriate answer.
						*** For "True/False" questions, there should be two answer elements, which are the correct answer and the incorrect answer. Sample: [{ id: 1, content: "True" }, { id: 2, content: "False" }]
					** IAnswer: The data structure for an answer:
						*** id: A number, the unique identifier for the answer.
						*** content: A string, the content of the answer. Do not use "" (Quotation Marks) on any character in the string. Instead, if you want to highlight text,... For example, replace it with \\"Personal Name\\" 
				* correctAnswer: The index of the correct answer (only applies to multiple choice and true/false questions).

		Example Response Format:
			${JSON.stringify(formatQuestion)}

		Note: Ensure the response is in valid JSON format !!!

	D. Additional Considerations:
		- Clarity: Questions should be clear, concise, and directly address the learning objectives.
		- Comprehensiveness: Cover various aspects of the topic, ensuring a balanced assessment of understanding.
		- Difficulty: Tailor the question difficulty level to the specified ${levelQuestion}.

	E. Please use ${language === ELanguage.Vietnamese ? "Vietnamese" : "English"} everywhere to write questions and answers for students.`;

  const prompt = `
${AI_ROLE}

${SYSTEM_INSTRUCTIONS}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```/g, "").replace(/json/g, "");
    console.log("cleanText", cleanText);
    const repaired = jsonrepair(cleanText);
    const json = JSON.parse(repaired);
    console.log(json);
    return json;
  } catch (error) {
    return error;
  }
}

export default createQuestionByAI;
