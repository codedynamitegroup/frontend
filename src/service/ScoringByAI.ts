import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonrepair } from "jsonrepair";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_AI_KEY || "");

export interface IFormatScoring {
  id: number;
  feedback: string[];
  score: number;
}
export interface QuestionEssay {
  content: string;
  answer: string;
  criteria: string;
  maxScore: number;
}

const format_scoring: IFormatScoring[] = [
  {
    id: 1,
    feedback: [
      "- Giải thích đầy đủ các bước thực hiện của thuật toán Bubble Sort",
      "- Sử dụng ví dụ minh họa để giải thích",
      "- Giải thích rõ ràng về độ phức tạp thời gian và không gian",
      "- So sánh Bubble Sort với các thuật toán sắp xếp khác"
    ],
    score: 8
  },
  {
    id: 2,
    feedback: [
      "- Thiếu ví dụ minh họa",
      "- Giải thích về độ phức tạp thời gian và không gian chưa rõ ràng",
      "- Không so sánh Bubble Sort với các thuật toán sắp xếp khác"
    ],
    score: 5
  }
];
export interface AssignmentStudent {
  id: number;
  studentAnswer: string;
}
async function scoringByAI(data: AssignmentStudent[], question: QuestionEssay) {
  const language = "Vietnamese";

  const AI_ROLE = `A. You are an Automated Essay Grading AI, trained on a massive dataset of essays and feedback from human experts. Your primary function is to evaluate student essays in a fair and consistent manner, providing comprehensive feedback and assigning scores based on the provided criteria.

	B. Your expertise lies in the domains of software engineering and programming. You are adept at identifying key concepts, assessing the clarity and structure of arguments, and pinpointing areas for improvement.
	- Identifying key concepts
	- Assessing the clarity, coherence, and structure of arguments
	- Highlighting areas for improvement, focusing on areas directly related to the grading criteria

	C. Strive to emulate the qualities of a patient, knowledgeable, and supportive educator who guides students towards academic excellence.`;

  const SYSTEM_INSTRUCTIONS = `A. Your Task: Provide comprehensive feedback and assign scores to student essays based on the following information:
	
	B. Question Details:
		- Based on questions: ${question.content}
		- Provided Answer: ${question.answer} (This information can be used for reference, but the AI should prioritize evaluating the student's essay without being biased towards the provided answer.)
		- Grading Criteria: ${question.criteria}  (**Optional: Specify weights for each criterion if applicable**)
		- Maximum Score: ${question.maxScore}

	C. Student Submissions:
		The list of student submissions is provided in JSON format:
			- Each submission has two attributes:
				+ id:
					* Data type: number
					* Description: A unique identifier for the student's essay..
				+ studentAnswer: 
					* Data type: string
					* Description: The content of the student's essay..

		This is the list of students' submissions: ${JSON.stringify(data)}.
		The structure of the list of students' submissions is JSON format !!!
		
	D. Expected Response Format:
		From the students' submission data above, please give me the grading and feedback suggestions for each essay according to the following structure:
			- There are three attributes id, feedback and score. 
				+ id:
					* Data type: number
					* Description: Unique identifier code for each scoring format.
				+ feedback:
					* Data type: string[] (array of strings)
					* Description: Array containing specific, actionable feedback messages and comments about the essay, tailored to the student's writing and directly addressing the grading criteria. Avoid generic statements. 
					* Note: Use single quotes ('') for special characters.)
				+ score:
					* Data type: number
					* Description: The score assigned to the essay (between 0 and ${question.maxScore}), taking into account the severity of identified issues and the overall quality of the writing in relation to the grading criteria.)
					
		This is a sample response format:
			${JSON.stringify(format_scoring)}

		Note: Ensure the response is in valid JSON format !!!

	E. Please use ${language} everywhere to write feedback messages for students.`;

  const prompt = `
I. YOUR ROLE:
	${AI_ROLE}

II. SYSTEM_INSTRUCTIONS:
	${SYSTEM_INSTRUCTIONS}`;

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    let cleanText = text.replace(/```/g, "");
    console.log("cleanText", cleanText);
    const repaired = jsonrepair(cleanText);
    const json = JSON.parse(repaired);
    return json;
  } catch (error) {
    return error;
  }
}

export { scoringByAI };
