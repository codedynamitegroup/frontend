import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonrepair } from "jsonrepair";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_AI_KEY || "");

export interface QuestionEssay {
  content: string;
  answer: string;
  rubics: string;
  maxScore: number;
}

interface FeedbackContent {
  accuracy: string;
  logic: string;
  creativity: string;
  sourceUsage: string;
}

interface FeedbackForm {
  grammar: string;
  vocabulary: string;
  spelling: string;
  layout: string;
}

interface FeedbackStyle {
  clarity: string;
  engagement: string;
  appropriateness: string;
}

export interface IFeedback {
  content: FeedbackContent;
  form: FeedbackForm;
  style: FeedbackStyle;
  overall: string;
  score: number;
}

export interface IFeedbackGradedAI {
  id: number;
  feedback: IFeedback;
}

export enum EFeedbackGradedCriteriaRate {
  CONTENT_FEEDBACK = 0.6,
  FORM_FEEDBACK = 0.2,
  STYLE_FEEDBACK = 0.2
}

const format_scoring: IFeedbackGradedAI[] = [
  {
    id: 1,
    feedback: {
      content: {
        accuracy:
          "Câu trả lời mô tả chính xác các bước liên quan đến việc tìm giá trị lớn nhất trong danh sách liên kết đơn.",
        logic:
          "Câu trả lời trình bày một chuỗi các bước hợp lý để lặp qua danh sách và cập nhật biến max.",
        creativity:
          "Mặc dù không hoàn toàn cần thiết cho câu hỏi này, nhưng không đề cập đến các phương pháp tiếp cận thay thế.",
        sourceUsage: "Không áp dụng cho dạng câu hỏi này."
      },
      form: {
        grammar: " Câu trả lời sử dụng ngữ pháp và cấu trúc câu thích hợp.",
        vocabulary: "Từ vựng được sử dụng rõ ràng, súc tích và phù hợp với giải thích kỹ thuật.",
        spelling: "Không có lỗi chính tả.",
        layout: "Câu trả lời được cấu trúc tốt với các bước được đánh số, giúp dễ hiểu."
      },
      style: {
        clarity: "Câu trả lời giải thích rõ ràng từng bước của thuật toán.",
        engagement:
          "Mặc dù câu trả lời mang tính thông tin, nhưng nó có thể không hấp dẫn đối với một đối tượng chung.",
        appropriateness:
          "Phong cách súc tích và đi vào trọng tâm, phù hợp với tính chất kỹ thuật của câu hỏi."
      },
      overall:
        "Câu trả lời này giải quyết hiệu quả lời nhắc bằng cách cung cấp một lời giải thích rõ ràng và chính xác về thuật toán để tìm giá trị lớn nhất trong danh sách liên kết đơn. Nó thể hiện sự hiểu biết tốt về các bước cần thiết và trình bày chúng theo cách có cấu trúc tốt.",
      score: 8
    }
  },
  {
    id: 2,
    feedback: {
      content: {
        accuracy: `Câu trả lời chỉ cung cấp một bước (\`3. Trả về giá trị của max\`) và thiếu thông tin quan trọng về toàn bộ thuật toán.`,
        logic: "Không có lời giải thích logic hoặc các bước để tìm phần tử lớn nhất.",
        creativity:
          "Không có cách tiếp cận sáng tạo nào được thể hiện trong việc giải quyết vấn đề.",
        sourceUsage: "Không áp dụng cho dạng câu hỏi này."
      },
      form: {
        grammar: "Câu trả lời đúng ngữ pháp như một câu đơn.",
        vocabulary: "Từ vựng được sử dụng đơn giản và phù hợp.",
        spelling: "Không có lỗi chính tả.",
        layout: "Câu trả lời chỉ bao gồm một câu, vì vậy bố cục không áp dụng."
      },
      style: {
        clarity: "Câu trả lời rõ ràng nhưng không đầy đủ.",
        engagement: "Câu trả lời không hấp dẫn vì thiếu lời giải thích hoặc ngữ cảnh.",
        appropriateness:
          "Phong cách câu trả lời phù hợp cho một tuyên bố ngắn gọn nhưng không đủ cho một giải pháp hoàn chỉnh."
      },
      overall:
        "Câu trả lời chỉ cung cấp một bước và không giải quyết được yêu cầu cốt lõi là giải thích thuật toán tìm phần tử lớn nhất trong danh sách liên kết đơn.",
      score: 2
    }
  }
];

export interface AssignmentStudent {
  id: number;
  studentAnswer: string;
}
async function scoringByAI(data: AssignmentStudent[], question: QuestionEssay) {
  const language = "Vietnamese";

  const AI_ROLE = `
I. YOUR ROLE:
	A. You are an Automated Essay Grading AI, trained on a massive dataset of essays and feedback from human experts. Your primary function is to evaluate student essays in a fair and consistent manner, providing comprehensive feedback and assigning scores based on the provided criteria.

	B. Your expertise lies in the domains of software engineering and programming. You are adept at identifying key concepts, assessing the clarity and structure of arguments, and pinpointing areas for improvement.
	- Identifying key concepts
	- Assessing the clarity, coherence, and structure of arguments
	- Highlighting areas for improvement, focusing on areas directly related to the grading criteria

	C. Strive to emulate the qualities of a patient, knowledgeable, and supportive educator who guides students towards academic excellence.`;

  const SYSTEM_INSTRUCTIONS = `
II. SYSTEM_INSTRUCTIONS:
	A. Your Task: Provide comprehensive feedback and assign scores to student essays based on the following information:
	
	B. Student Submissions follow the following structure:
		The list of student submissions is provided in JSON format (SubmissionStudent[]). There are two attributes id and studentAnswer for each student submission:
			- SubmissionStudent[]: The data structure for a list of student submissions.
				[
					{
						id: A unique identifier for the student's essay (number).
						studentAnswer: The content of the student's essay (string).
					},
					...
				] 

		This is the list of students' submissions (SubmissionStudent[]) that will be reviewed by you. You will provide feedback for the attribute studentAnswer (The content of the student's essay) for each student's submission (indentified by "ID").:
			${JSON.stringify(data)} 
			
	C. Feedback Results (${data.length} elements):
		The feedback results will have ${data.length} elements. Each element is based on question details below and studenAnswer to grade and provide feedback to user:
			- question content:
				${question.content}
		
		This is the list of students' submissions (SubmissionStudent[]) that will be reviewed by you. You will provide feedback for the attribute studentAnswer (The content of the student's essay) for each student's submission (indentified by "ID").:
			${JSON.stringify(data)} 

		From the students' submission data above, please give me the grading and feedback suggestions for each student's submission. The feedback suggestion ID should match the student's submission ID above. It must be follow JSON format !!!. According to the following structure:
			- IFeedbackGradingAI[]: The feedback results will have ${data.length} elements. The data structure for a list of feedback.
			[
				{
					id: number,
					feedback: {
						content: {
							accuracy: string (not be empty or null)
							logic: string (not be empty or null)
							creativity: string (not be empty or null)
							sourceUsage: string (not be empty or null)
						},
						form: {
							grammar: string (not be empty or null)
							vocabulary: string (not be empty or null)
							spelling: string (not be empty or null)
							layout: string (not be empty or null)
						},
						style: {
							clarity: string (not be empty or null)
							engagement: string (not be empty or null)
							appropriateness: string (not be empty or null)
						},
						overall: string (not be empty or null),
						score: number
					}
				},
				...
			]
			- Description: Each feedback has two attributes id and feedback for each feedback (IFeedbackGradingAI): 
				+ id:
					* Data type: number
					* Description: A unique identifier that will match the student's submission ID in the list of student submissions above.
				+ feedback:
					* Data type: object
					* Description: An object that contains the feedback for the student's submission (IFeedback). The feedback depends on the attribute studentAnswer, which matches the feedback ID and the student's submission ID.
						- IFeedback: The data structure for a feedback, has five attributes: content, form, style, overall, and score are same at level:
						{
							content (an object that contains the content of the feedback (IFeedbackContent)): {
								accuracy: A string (not be empty or null), indicating the extent to which the information in the essay is accurate, complete, and relevant to the topic assigned to the question. Feedback follow the markdown syntax. you should use \`\` to wrap the highlighted text. Do not write the title "accuracy" in the feedback. the content attribute of the answer should not be empty or null. It should be filled with complete information 
								logic: A string (not be empty or null), indicating the extent to which the essay is logical, coherent, and consistent in its argument and presentation of ideas. Feedback follow the markdown syntax. you should use \`\` to wrap the highlighted text. Do not write the title "logic" in the feedback. the content attribute of the answer should not be empty or null. It should be filled with complete information
								creativity: A string (not be empty or null), indicating the extent to which the essay is unique, original, and creative in its approach to and solution of the problem. Feedback follow the markdown syntax. you should use \`\` to wrap the highlighted text. Do not write the title "creativity" in the feedback. the content attribute of the answer should not be empty or null. It should be filled with complete information
								sourceUsage: A string (not be empty or null), indicating the extent to which sources are used appropriately, accurately, and with complete information. Feedback follow the markdown syntax. you should use \`\` to wrap the highlighted text. Do not write the title "sourceUsage" in the feedback. the content attribute of the answer should not be empty or null. It should be filled with complete information
							},
							form (an object that contains the form of the feedback (IFeedbackForm)): {
								grammar: A string (not be empty or null), indicating the extent to which grammar, sentence structure, and punctuation are used accurately and effectively. Feedback follow the markdown syntax. you should use \`\` to wrap the highlighted text. Do not write the title "grammar" in the feedback. the content attribute of the answer should not be empty or null. It should be filled with complete information
								vocabulary: A string (not be empty or null), indicating the extent to which vocabulary is varied, rich, and appropriate for the essay. Feedback follow the markdown syntax. you should use \`\` to wrap the highlighted text. Do not write the title "vocabulary" in the feedback. the content attribute of the answer should not be empty or null. It should be filled with complete information
								spelling: A string (not be empty or null), indicating the extent to which spelling is accurate. Feedback follow the markdown syntax. you should use \`\` to wrap the highlighted text. Do not write the title "spelling" in the feedback. the content attribute of the answer should not be empty or null. It should be filled with complete information
								layout: A string (not be empty or null), indicating the extent to which the layout is clear, organized, and easy to understand. Feedback follow the markdown syntax. you should use \`\` to wrap the highlighted text. Do not write the title "layout" in the feedback. the content attribute of the answer should not be empty or null. It should be filled with complete information
							},
							style (an object that contains the style of the feedback (IFeedbackStyle)): {
								clarity: A string (not be empty or null), indicating the extent to which the essay is clear, concise, and direct in its presentation of information. Feedback follow the markdown syntax. you should use \`\` to wrap the highlighted text. Do not write the title "clarity" in the feedback. the content attribute of the answer should not be empty or null. It should be filled with complete information
								engagement: A string (not be empty or null), indicating the extent to which the essay is engaging, interesting, and creates a sense of excitement for the reader. Feedback follow the markdown syntax. you should use \`\` to wrap the highlighted text. Do not write the title "engagement" in the feedback. the content attribute of the answer should not be empty or null. It should be filled with complete information
								appropriateness: A string (not be empty or null), indicating the extent to which the style is appropriate for the topic, purpose, and audience. Feedback follow the markdown syntax. you should use \`\` to wrap the highlighted text. Do not write the title "appropriateness" in the feedback. the content attribute of the answer should not be empty or null. It should be filled with complete information
							},
							overall: A string (not be empty or null), indicating the overall feedback of the student within the content, form, and style. Do not write the title "overall" in the feedback. the content attribute of the answer should not be empty or null. It should be filled with complete information
							score: number, between 0 and ${question.maxScore}, The score assigned to the essay is based on the rubrics below and depending on the feedback above.
								* Here is a rubric description that helped you calculate an exact score:
									1. Content (number score of the user after feedback, which is calculated by rubics/${(EFeedbackGradedCriteriaRate.CONTENT_FEEDBACK * question.maxScore).toFixed(2)})
										- Score: ${(1 * EFeedbackGradedCriteriaRate.CONTENT_FEEDBACK * question.maxScore).toFixed(2)}: The essay is complete, accurate, logical, creative, and uses sources appropriately.
										- Score: ${(0.75 * EFeedbackGradedCriteriaRate.CONTENT_FEEDBACK * question.maxScore).toFixed(2)}: The essay is complete, accurate, and logical, and uses sources appropriately.
										- Score: ${(0.5 * EFeedbackGradedCriteriaRate.CONTENT_FEEDBACK * question.maxScore).toFixed(2)}: The essay is complete, accurate, but lacks logic, and uses sources somewhat appropriately.
										- Score: ${(0.25 * EFeedbackGradedCriteriaRate.CONTENT_FEEDBACK * question.maxScore).toFixed(2)}: The essay is incomplete, inaccurate, illogical, and uses sources inappropriately.
									2. Form (number score of the user after feedback, which is calculated by rubics/${(0.3 * question.maxScore).toFixed(2)})
										- Score: ${(1 * EFeedbackGradedCriteriaRate.FORM_FEEDBACK * question.maxScore).toFixed(2)}: The essay has no errors in grammar, spelling, or punctuation, and uses varied, rich, and appropriate vocabulary with a clear layout.
										- Score: ${(0.75 * EFeedbackGradedCriteriaRate.FORM_FEEDBACK * question.maxScore).toFixed(2)}: The essay has few errors in grammar, spelling, or punctuation, uses varied, rich, and appropriate vocabulary, and has a relatively clear layout.
										- Score: ${(0.5 * EFeedbackGradedCriteriaRate.FORM_FEEDBACK * question.maxScore).toFixed(2)}: The essay has several errors in grammar, spelling, or punctuation, uses somewhat varied and rich vocabulary, and has a somewhat clear layout.
										- Score: ${(0.25 * EFeedbackGradedCriteriaRate.FORM_FEEDBACK * question.maxScore).toFixed(2)}: The essay has many errors in grammar, spelling, or punctuation, uses limited vocabulary, and has an unclear layout.
									3. Style (number score of the user after feedback, which is calculated by rubics/${(0.3 * question.maxScore).toFixed(2)})
										- Score: ${(1 * EFeedbackGradedCriteriaRate.STYLE_FEEDBACK * question.maxScore).toFixed(2)}:	The essay is clear, engaging, and appropriate for the topic, purpose, and audience.
										- Score: ${(0.75 * EFeedbackGradedCriteriaRate.STYLE_FEEDBACK * question.maxScore).toFixed(2)}: The essay is relatively clear, engaging, and appropriate for the topic, purpose, and audience.
										- Score: ${(0.5 * EFeedbackGradedCriteriaRate.STYLE_FEEDBACK * question.maxScore).toFixed(2)}:	The essay is unclear, lacks engagement, and is somewhat appropriate for the topic, purpose, and audience.
										- Score: ${(0.25 * EFeedbackGradedCriteriaRate.STYLE_FEEDBACK * question.maxScore).toFixed(2)}: The essay is unclear, not engaging, and not appropriate for the topic, purpose, and audience.
			
								* Note of score:
									** You also need to use the rubics: ${question.rubics}	
						}

					* Note of feedback: 
						** You need to check accuracy, logic, creativity, and source usage of the student's submission meet the question details and respond to user. 
						** If the student answer is incorrect, please give accuracy, logic, creativity, and source usage feedback to the student.
						** Feedback follow the markdown syntax. you should use \`\` to wrap the highlighted text. 
						** Instead of use \\t, you should use tab

					* Here is example of feedback:
					${JSON.stringify(format_scoring[0].feedback)}

	D. Please use ${language} everywhere to write feedback messages for students.
	
	E. For example:
		This is a student submission:
			[
				{
					id: 1,
					studentAnswer:
          	"1. Khởi tạo một biến max để lưu giá trị lớn nhất ban đầu là giá trị của phần tử đầu tiên trong danh sách liên kết. 2. Duyệt qua danh sách liên kết, so sánh từng phần tử với max. Nếu phần tử hiện tại lớn hơn max thì gán max bằng giá trị của phần tử hiện tại. 3. Trả về giá trị của max."
				},
				{
					id: 2,
					studentAnswer:
						"3. Trả về giá trị của max."
				}
			],
			
		This is a response from the AI:
			${JSON.stringify(format_scoring)}
				
		Note of example:
			1. Ensure the response is in valid JSON format !!!
			2. The example is just for reference. You can change the example to fit your needs.
	`;

  const prompt = `
${AI_ROLE}

${SYSTEM_INSTRUCTIONS}`;

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  console.log("prompt", prompt);
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
