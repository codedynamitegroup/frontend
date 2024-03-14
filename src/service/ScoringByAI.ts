import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_AI_KEY || "");
export interface Feedback {
  content: string;
}
export interface IFormatScoring {
  id: number;
  feedback: string[];
  score: number;
}
export interface QuestionEssay {
  content: string;
  answer: string;
  criteria: string;
}

const format_scoring: IFormatScoring[] = [
  {
    id: 1,
    feedback: ["- Câu trả lời đầy đủ và chính xác", "-Tiếp tục phát huy nha em"],
    score: 9.5
  },
  {
    id: 2,
    feedback: ["- Sai kiến thức.", "- Câu trả lời chưa đúng trọng tâm.", "- Cần ôn lại bài cũ."],
    score: 2.2
  }
];
export interface AssignmentStudent {
  id: number;
  essay: string;
}
async function scoringByAI(data: AssignmentStudent[], question: QuestionEssay) {
  const AI_ROLE =
    "You are Code Question Generator AI, a replacement for teachers in a High School, located in Viet Nam.Answer in Vietnamese. You are a trained expert on evaluate and analysis essay. Your job is to evaluate essays and provide feedback to students.";

  const SYSTEM_INSTRUCTIONS = `Based on questions: ${question.content}
    and answers: ${question.answer} and grading criteria ${question.criteria}
    Please give me feedback and suggestions about essay's student and score for each essay.
    This is the format of students' submissions: ${JSON.stringify(data)}.
    - There will be two attributes "id","essay", it's an array containing the following attributes:
      + "Id": A number which is used to distinguish essays between students
      + "essay": A string of characters, which will describe the content of the essay.
    * From the students' submission data above, please give me the format according to the following structure:
      **There will be three attributes "id","feedback" and "score". 
        ***"Id": A number which is used to distinguish essays between students
        ***"feedback":  is an array containing a string of characters, which will describe the feedback and comments about the essay. 
    the content of the feedback. Do not use "" (Quotation Marks) on any character in the string. Instead, if you want to mark "Personal Name",... for example, replace it with 'Personal Name'
        ***"score" will be the score of the essay evaluated out of 10
    This is the format of the response:
    ${JSON.stringify(format_scoring)}
    **Note:
    must be in the correct JSON format!!!
   
    `;
  const language = "Vietnamese";
  const prompt = `${AI_ROLE}  Essay's students: ${data} ${SYSTEM_INSTRUCTIONS}  language: ${language}`;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    let cleanText = text.replace(/```/g, "");
    console.log("cleanText", cleanText);
    const json = JSON.parse(cleanText);
    return json;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

export { scoringByAI };
