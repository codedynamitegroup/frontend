import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonrepair } from "jsonrepair";
import { EQType, EQuestionLevel } from ".";

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
          { id: 1, content: "Đúng" },
          { id: 2, content: "Sai" }
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
  number_question: number,
  level: EQuestionLevel
) {
  // For text-only input, use the gemini-pro model
  const formatQuestion = format_question.find((item) => item.qtypeId === qtype);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  let question_type = "";
  if (qtype === EQType.Essay) {
    question_type = "essay";
  } else if (qtype === EQType.MultipleChoice) {
    question_type = "multiple choice";
  } else if (qtype === EQType.ShortAnswer) {
    question_type = "short answer";
  } else {
    question_type = "true/false";
  }

  let levelQuestion = "";
  if (level === EQuestionLevel.Easy) {
    levelQuestion = "easy";
  } else if (level === EQuestionLevel.Medium) {
    levelQuestion = "medium";
  } else {
    levelQuestion = "hard";
  }

  const AI_ROLE = `You are Code Question Generator AI, a replacement for teachers in a High School, located in Viet Nam. 
		Answer in Vietnamese. You are a trained expert on domain related to software engineering and programming. 
		Your job are required to generate code questions which has types such as multiple choice, true/false, short answer, essay according to the assignment prompt.`;

  const SYSTEM_INSTRUCTIONS = `
                Give me ${number_question} questions which are ${question_type} questions about topic named ${topic}.
								${description && `The detailed description of this topic is: " + ${description}.`}
								The questions should be at a ${levelQuestion} level.

								The structure of the response must be JSON which follows the following structure:
								- qtypeId: The type of question contains the following values.
									+ 1: Essay
									+ 2: Multiple choice
									+ 3: Short answer
									+ 4: True/False
								- questions: An array of questions (IQuestion).
									+ IQuestion: The data structure for a question:
										* id: A number, the unique identifier for the question.
										* question: A string, the content of the question. Do not use "" (Quotation Marks) on any character in the string. Instead, if you want to mark "Personal Name",... for example, replace it with 'Personal Name'
										* answers: An array of answers (IAnswer[]) representing the answer
											** Note:
												*** For essay and short answer questions, there should only be 1 answer element, and the content attribute of the answer should not be empty. It should be filled with complete information, which can be the detailed answer to the question, suggestions for answering the question, etc., to help the question creator know the appropriate answer.
											** IAnswer: The data structure for an answer:
												*** id: A number, the unique identifier for the answer.
												*** content: A string, the content of the answer. Do not use "" (Quotation Marks) on any character in the string. Instead, if you want to mark "Personal Name",... for example, replace it with 'Personal Name'
										* correctAnswer: The index of the correct answer (only applies to multiple choice and true/false questions).
										
                This is a sample response format:
                ${JSON.stringify(formatQuestion)}
								Please use Vietnamese everywhere to write questions and answers for students.
            `;

  const prompt = `${AI_ROLE} ${SYSTEM_INSTRUCTIONS}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text.replace(/```/g, "").replace(/json/g, "");
    console.log("cleanText", cleanText);
    const repaired = jsonrepair(cleanText);
    const json = JSON.parse(repaired);
    return json;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return error;
  }
}

async function scoringByAI(data: any) {
  const AI_ROLE =
    "You are Code Question Generator AI, a replacement for teachers in a High School, located in Viet Nam. Answer in Vietnamese. You are a trained expert on evaluate and analysis essay. Your job is to evaluate essays and provide feedback to students.";

  const SYSTEM_INSTRUCTIONS = `Please give me feedback and suggestions about essay's student. There will be three attributes "id","feedback" and "score". "Id" is used to distinguish essays between students,"feedback" is an array containing a string of characters, which will describe the feedback and comments about the essay. And "score" will be the score of the essay evaluated out of 10
  This is the format of the response:
  [
    {
      "id": 1,
      "feedback": ["- Cần chú ý hơn đến lỗi chính tả và ngữ pháp.\n",
      "- Có thể bổ sung thêm những ví dụ về những thách thức trong việc phát huy sức mạnh của tình yêu thương, như sự ích kỷ, lòng đố kỵ.\n",
      "- Cần đưa ra những giải pháp cụ thể hơn để xây dựng một xã hội tràn ngập tình yêu thương, như giáo dục, truyền thông, chính sách.\n"]
      "score": 8.5
    },
    {
      "id": 2,
      "feedback": ["- Cần chú ý hơn đến lỗi chính tả và ngữ pháp.\n",
      "- Có thể bổ sung thêm những ví dụ về những thách thức trong việc phát huy sức mạnh của tình yêu thương, như sự ích kỷ, lòng đố kỵ.\n",
      "- Cần đưa ra những giải pháp cụ thể hơn để xây dựng một xã hội tràn ngập tình yêu thương, như giáo dục, truyền thông, chính sách.\n"]
      "score": 5.2
    }
  ]
  **Note:
  must be in the correct JSON format!!!
 
  `;
  const language = "Vietnamese";
  const prompt = `${AI_ROLE} Question: "Con trỏ là gì" Essay's students: ${data} ${SYSTEM_INSTRUCTIONS}  language: ${language}`;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    let cleanText = text.replace(/```/g, "");
    const json = JSON.parse(cleanText);
    return json;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

export { createQuestionByAI, scoringByAI };
