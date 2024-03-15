import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonrepair } from "jsonrepair";
import { IFeedbackGradedAI } from "pages/client/lecturer/CourseManagement/Details/components/ExamSubmissions/components/AIScoring";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_AI_KEY || "");

export interface QuestionEssay {
  content: string;
  answer: string;
  rubics: string;
  maxScore: number;
}

const format_scoring: IFeedbackGradedAI[] = [
  {
    id: 1,
    feedback: `
1. Nội dung:
	- Độ chính xác: Câu trả lời mô tả chính xác các bước liên quan đến việc tìm giá trị lớn nhất trong danh sách liên kết đơn.
	- Logic: Câu trả lời trình bày một chuỗi các bước hợp lý để lặp qua danh sách và cập nhật biến max.
	- Sáng tạo: Mặc dù không hoàn toàn cần thiết cho câu hỏi này, nhưng không đề cập đến các phương pháp tiếp cận thay thế.
	- Sử dụng nguồn: Không áp dụng cho dạng câu hỏi này.

2. Hình thức:
	- Ngữ pháp: Câu trả lời sử dụng ngữ pháp và cấu trúc câu thích hợp.
	- Từ vựng: Từ vựng được sử dụng rõ ràng, súc tích và phù hợp với giải thích kỹ thuật.
	- Chính tả: Không có lỗi chính tả.
	- Bố cục: Câu trả lời được cấu trúc tốt với các bước được đánh số, giúp dễ hiểu.

3. Phong cách:
	- Rõ ràng: Câu trả lời giải thích rõ ràng từng bước của thuật toán.
	- Hấp dẫn: Mặc dù câu trả lời mang tính thông tin, nhưng nó có thể không hấp dẫn đối với một đối tượng chung.
	- Phù hợp: Phong cách súc tích và đi vào trọng tâm, phù hợp với tính chất kỹ thuật của câu hỏi.

4. Điểm mạnh:
	- Câu trả lời mô tả chính xác một thuật toán hoạt động.
	- Sử dụng ngôn ngữ rõ ràng và súc tích.
	- Câu trả lời được cấu trúc tốt và dễ làm theo.

5. Điểm yếu:	
	- Không đề cập đến các trường hợp ngoại lệ tiềm ẩn (ví dụ: danh sách rỗng).

6. Phản hồi chung:
	- Câu trả lời này giải quyết hiệu quả lời nhắc bằng cách cung cấp một lời giải thích rõ ràng và chính xác về thuật toán để tìm giá trị lớn nhất trong danh sách liên kết đơn. Nó thể hiện sự hiểu biết tốt về các bước cần thiết và trình bày chúng theo cách có cấu trúc tốt.
`,
    score: 9
  },
  {
    id: 2,
    feedback: `
1. Nội dung:
	- Độ chính xác: Câu trả lời chỉ cung cấp một bước ("3. Trả về giá trị của max") và thiếu thông tin quan trọng về toàn bộ thuật toán.
	- Logic: Không có lời giải thích logic hoặc các bước để tìm phần tử lớn nhất.
	- Sáng tạo: Không có cách tiếp cận sáng tạo nào được thể hiện trong việc giải quyết vấn đề.
	- Sử dụng nguồn: Không áp dụng cho dạng câu hỏi này.

2. Hình thức:
	- Ngữ pháp: Câu trả lời đúng ngữ pháp như một câu đơn.
	- Từ vựng: Từ vựng được sử dụng đơn giản và phù hợp.
	- Chính tả: Không có lỗi chính tả.
	- Bố cục: Câu trả lời chỉ bao gồm một câu, vì vậy bố cục không áp dụng.

3. Phong cách:
	- Rõ ràng: Câu trả lời rõ ràng nhưng không đầy đủ.
	- Hấp dẫn: Câu trả lời không hấp dẫn vì thiếu lời giải thích hoặc ngữ cảnh.
	- Phù hợp: Phong cách câu trả lời phù hợp cho một tuyên bố ngắn gọn nhưng không đủ cho một giải pháp hoàn chỉnh.

4. Điểm mạnh:
	- Câu trả lời sử dụng ngôn ngữ đúng ngữ pháp.
	- Không có lỗi chính tả.

5. Điểm yếu:
	- Thiếu các bước và lời giải thích quan trọng của thuật toán.
	- Không thể hiện sự hiểu biết về việc tìm phần tử lớn nhất trong danh sách liên kết.
	- Cung cấp một giải pháp không đầy đủ.

6. Phản hồi chung:
	- Câu trả lời chỉ cung cấp một bước và không giải quyết được yêu cầu cốt lõi là giải thích thuật toán tìm phần tử lớn nhất trong danh sách liên kết đơn.
`,
    score: 2
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
	
	B. Question Details:
		- Based on questions: *${question.content}*
		- Provided Answer: *${question.answer}* (This information can be used for reference, but the AI should prioritize evaluating the student's essay without being biased towards the provided answer.)
		- Rubics: *${question.rubics}*
		- Maximum Score: *${question.maxScore}*

	C. Student Submissions:
		The list of student submissions is provided in JSON format:
			- Each submission has two attributes:
				+ id:
					* Data type: number
					* Description: A unique identifier for the student's essay.
				+ studentAnswer: 
					* Data type: string
					* Description: The content of the student's essay.

		This is the list of students' submissions: ${JSON.stringify(data)}.
		
	D. Expected Response Format:
		From the students' submission data above, please give me the grading and feedback suggestions for each student's submission according to the following structure:
			- There are three attributes id, feedback and score. 
				+ id:
					* Data type: number
					* Description: A unique identifier that will match the student's submission.
				+ feedback:
					* Data type: string
					* Description: A string of actionable feedback messages and comments about the essay. Avoid generic statements. 
					* It must follow the following structure:
						1. Content:
							- Accuracy: The extent to which the information in the essay is accurate, complete, and relevant to the topic assigned.
							- Logic: The extent to which the essay is logical, coherent, and consistent in its argument and presentation of ideas.
							- Creativity: The extent to which the essay is unique, original, and creative in its approach to and solution of the problem.
							- Source Usage: The extent to which sources are used appropriately, accurately, and with complete information.

						2. Form:
							- Grammar: The extent to which grammar, sentence structure, and punctuation are used accurately and effectively.
							- Vocabulary: The extent to which vocabulary is varied, rich, and appropriate for the essay.
							- Spelling: The extent to which spelling is accurate.
							- Layout: The extent to which the layout is clear, organized, and easy to understand.

						3. Style:
							- Clarity: The extent to which the essay is clear, concise, and direct in its presentation of information.
							- Engagement: The extent to which the essay is engaging, interesting, and creates a sense of excitement for the reader.
							- Appropriateness: The extent to which the style is appropriate for the topic, purpose, and audience.

						4. Strengths:
							- Highlight the positive aspects of the essay, such as:
								+	Strong arguments and evidence.
								+	Clear and concise writing.
								+	Effective organization and structure.
								+	Proper grammar and spelling.
								+	...

						5. Cons:
							- List the weaknesses and shortcomings of the essay, for example:
								+ Lack of logical arguments and specific evidence.
								+ Use of inaccurate words and phrases, loose grammar.
								+ Unscientific layout, unclear presentation.
								+ Spelling mistakes, formatting errors.
								+ ...

						6. Overall Feedback:
						- Summarize your overall assessment of the essay, including:
						- The student's strengths and weaknesses as a writer.
						- The overall quality of the essay.
						- Encouragement for the student to continue improving their writing skills.

					* Here is an example that follows the structure above: 
						1. Nội dung:
							- Độ chính xác: Câu trả lời mô tả chính xác các bước liên quan đến việc tìm giá trị lớn nhất trong danh sách liên kết đơn.
							- Logic: Câu trả lời trình bày một chuỗi các bước hợp lý để lặp qua danh sách và cập nhật biến max.
							- Sáng tạo: Mặc dù không hoàn toàn cần thiết cho câu hỏi này, nhưng không đề cập đến các phương pháp tiếp cận thay thế.
							- Sử dụng nguồn: Không áp dụng cho dạng câu hỏi này.
						
						2. Hình thức:
							- Ngữ pháp: Câu trả lời sử dụng ngữ pháp và cấu trúc câu thích hợp.
							- Từ vựng: Từ vựng được sử dụng rõ ràng, súc tích và phù hợp với giải thích kỹ thuật.
							- Chính tả: Không có lỗi chính tả.
							- Bố cục: Câu trả lời được cấu trúc tốt với các bước được đánh số, giúp dễ hiểu.
						
						3. Phong cách:
							- Rõ ràng: Câu trả lời giải thích rõ ràng từng bước của thuật toán.
							- Hấp dẫn: Mặc dù câu trả lời mang tính thông tin, nhưng nó có thể không hấp dẫn đối với một đối tượng chung.
							- Phù hợp: Phong cách súc tích và đi vào trọng tâm, phù hợp với tính chất kỹ thuật của câu hỏi.
						
						4. Điểm mạnh:
							- Câu trả lời mô tả chính xác một thuật toán hoạt động.
							- Sử dụng ngôn ngữ rõ ràng và súc tích.
							- Câu trả lời được cấu trúc tốt và dễ làm theo.
						
						5. Điểm yếu:	
							- Không đề cập đến các trường hợp ngoại lệ tiềm ẩn (ví dụ: danh sách rỗng).
						
						6. Phản hồi chung:
							- Câu trả lời này giải quyết hiệu quả lời nhắc bằng cách cung cấp một lời giải thích rõ ràng và chính xác về thuật toán để tìm giá trị lớn nhất trong danh sách liên kết đơn. Nó thể hiện sự hiểu biết tốt về các bước cần thiết và trình bày chúng theo cách có cấu trúc tốt.

					* Note:
						** Do not use "" (Quotation Marks) on any character in the string. Instead, if you want to highlight text,... For example, replace it with \`Personal Name\`
						** Feedback follow the markdown syntax. you should use (\`\`) to wrap the highlighted text. 
						** Instead of use \\t, you should use tab
						** Must be use "\\n" when using line breaks
						** The example above is just for "reference", do not use it to responsd to user !!
						** It will be use to feedback the question details:
							- Based on questions: *${question.content}*
							- Provided Answer: *${question.answer}* (This information can be used for reference, but the AI should prioritize evaluating the student's essay without being biased towards the provided answer.)
				+ score:
					* Data type: number
					* Description: Description: The score assigned to the essay is based on the rubrics, depending on the feedback. The score will be calculated by adding up the score of each rubric (content + form + style).
					* Here is a rubric description that helped you calculate an exact score:
						1. Content (number score of the user after feedback, which is calculated by rubics/${(0.4 * question.maxScore).toFixed(2)})
							- Score: ${(1 * 0.4 * question.maxScore).toFixed(2)}: The essay is complete, accurate, logical, creative, and uses sources appropriately.
							- Score: ${(0.75 * 0.4 * question.maxScore).toFixed(2)}: The essay is complete, accurate, and logical, and uses sources appropriately.
							- Score: ${(0.5 * 0.4 * question.maxScore).toFixed(2)}: The essay is complete, accurate, but lacks logic, and uses sources somewhat appropriately.
							- Score: ${(0.25 * 0.4 * question.maxScore).toFixed(2)}: The essay is incomplete, inaccurate, illogical, and uses sources inappropriately.
						2. Form (number score of the user after feedback, which is calculated by rubics/${(0.3 * question.maxScore).toFixed(2)})
						- Score: ${(1 * 0.3 * question.maxScore).toFixed(2)}: The essay has no errors in grammar, spelling, or punctuation, and uses varied, rich, and appropriate vocabulary with a clear layout.
						- Score: ${(0.75 * 0.3 * question.maxScore).toFixed(2)}: The essay has few errors in grammar, spelling, or punctuation, uses varied, rich, and appropriate vocabulary, and has a relatively clear layout.
						- Score: ${(0.5 * 0.3 * question.maxScore).toFixed(2)}: The essay has several errors in grammar, spelling, or punctuation, uses somewhat varied and rich vocabulary, and has a somewhat clear layout.
						- Score: ${(0.25 * 0.3 * question.maxScore).toFixed(2)}: The essay has many errors in grammar, spelling, or punctuation, uses limited vocabulary, and has an unclear layout.
						3. Style (number score of the user after feedback, which is calculated by rubics/${(0.3 * question.maxScore).toFixed(2)})
						- Score: ${(1 * 0.3 * question.maxScore).toFixed(2)}:	The essay is clear, engaging, and appropriate for the topic, purpose, and audience.
						- Score: ${(0.75 * 0.3 * question.maxScore).toFixed(2)}: The essay is relatively clear, engaging, and appropriate for the topic, purpose, and audience.
						- Score: ${(0.5 * 0.3 * question.maxScore).toFixed(2)}:	The essay is unclear, lacks engagement, and is somewhat appropriate for the topic, purpose, and audience.
						- Score: ${(0.25 * 0.3 * question.maxScore).toFixed(2)}: The essay is unclear, not engaging, and not appropriate for the topic, purpose, and audience.
					** Note:
						- You also need to use the rubics: ${question.rubics}
						- The score must be calculated by adding up the score of each rubric. For example the score of the content is 3, the score of the form is 2, and the score of the style is 1. The total score is 6.

		This is a example response format:
			${JSON.stringify(format_scoring)}

		Note:
			1. Ensure the response is in valid JSON format !!!
			2. The example is just for reference. You can change the example to fit your needs.
				
	E. Please use ${language} everywhere to write feedback messages for students.`;

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
