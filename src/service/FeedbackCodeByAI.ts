import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonrepair } from "jsonrepair";
import {
  ICodeQuestion,
  IFeedbackCodeByAI,
  ISourceCodeSubmission
} from "pages/client/user/DetailProblem/components/Submission/components/DetailSubmission";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_AI_KEY || "");

const format_response: IFeedbackCodeByAI = {
  id: 1,
  feedback: `
1. Phân tích:
a. Tính chính xác:
	- Code thực hiện đúng chức năng tìm độ dài chuỗi con dài nhất không có ký tự lặp lại.
	- Không có lỗi logic hay lỗi thời gian chạy được phát hiện.
	- Kết quả đầu ra chính xác và phù hợp với kỳ vọng.

b. Tính hiệu quả:
	- Mã nguồn chạy tương đối nhanh với độ phức tạp thời gian \`O(n)\` do chỉ duyệt qua chuỗi một lần.
	- Có thể tối ưu hóa sử dụng mảng thay cho HashSet để tiết kiệm bộ nhớ.
	- Sử dụng thuật toán và cấu trúc dữ liệu phù hợp \`(sliding window)\`.

c. Tính bảo trì:
	- Mã nguồn dễ đọc, dễ hiểu và dễ bảo trì.
	- Viết theo phong cách lập trình rõ ràng, nhất quán và dễ theo dõi.
	- Được tổ chức thành các module, lớp và hàm hợp lý.

d. Tính khả năng mở rộng:
	- Mã nguồn dễ dàng mở rộng để thêm tính năng mới như tìm chuỗi con dài nhất với các điều kiện bổ sung.
	- Được thiết kế theo mô hình linh hoạt và có thể tái sử dụng.

2. Gợi ý cải tiến:
- Sử dụng mảng thay cho \`HashSet\` để tiết kiệm bộ nhớ.
- Viết thêm bình luận để giải thích code và thuật toán.

3. Kết luận:
- Code \`lengthOfLongestSubstring\` được viết tốt, đáp ứng đầy đủ các yêu cầu về tính chính xác, hiệu quả, bảo trì, khả năng mở rộng và tuân thủ. Một số cải tiến nhỏ có thể được thực hiện để tối ưu hóa hiệu suất sử dụng bộ nhớ.
- Đánh giá chung: Tốt
	`,
  suggestCode:
    " class Solution { \n  public: \n    vector<vector<int>> divideArray(vector<int>& nums, int ki) { \n      vector<vector<int>> ans; \n      ... (rest of the code with line breaks) \n    } \n  }; \n",
  explainCode: `1. Khai báo biến:
		- \`left\`: Biến lưu trữ vị trí bắt đầu của chuỗi con hiện tại.
		- \`right\`: Biến lưu trữ vị trí kết thúc của chuỗi con hiện tại.
		- \`max\`: Biến lưu trữ độ dài chuỗi con dài nhất được tìm thấy.
		- \`set\`: Biến kiểu \`Set\` lưu trữ các ký tự đã xuất hiện trong chuỗi con hiện tại.
	 2. Vòng lặp while: 
		- Vòng lặp này sẽ chạy cho đến khi \`right\` bằng với độ dài của chuỗi \`s\`.
	 3. Kiểm tra ký tự:
		- Kiểm tra xem ký tự tại vị trí \`right\` có trong \`set\` hay không.
		- Nếu không có:
			- Thêm ký tự vào \`set\`.
			- Tăng \`right\` lên 1 để di chuyển đến ký tự tiếp theo.
			- Cập nhật \`max\` nếu độ dài của \`set\` lớn hơn \`max\`.
		- Nếu có:
			- Xóa ký tự tại vị trí \`left\` khỏi \`set\`.
			- Tăng \`left\` lên 1 để di chuyển đến ký tự tiếp theo.
	 4. Trả về kết quả:
		- Sau khi vòng lặp while kết thúc, \`max\` sẽ lưu trữ độ dài chuỗi con dài nhất không có ký tự lặp lại.
		- Trả về \`max\`.
	 
	 Cách thức hoạt động:
	 
	 - Thuật toán sử dụng một "cửa sổ trượt" để di chuyển qua chuỗi. Cửa sổ này bắt đầu từ vị trí 0 và mở rộng cho đến khi gặp một ký tự lặp lại.
	 - Khi gặp một ký tự lặp lại, cửa sổ sẽ thu hẹp lại từ đầu cho đến khi ký tự lặp lại bị loại bỏ.
	 - Độ dài của cửa sổ được cập nhật liên tục và giá trị lớn nhất sẽ được lưu trữ.
	 - Sau khi cửa sổ trượt đến cuối chuỗi, độ dài chuỗi con dài nhất không có ký tự lặp lại sẽ được trả về.
	 
	 Ví dụ:
	 
	 - Cho chuỗi \`s = "abcabcbb"\`.
	 - Ban đầu, \`left = 0\` và \`right = 0\`.
	 - Cửa sổ trượt qua chuỗi:
		 - \`right = 1\`: Ký tự \`a\` không có trong \`set\`, thêm vào \`set\` và tăng \`right\` lên 1.
		 - \`right = 2\`: Ký tự \`b\` không có trong \`set\`, thêm vào \`set\` và tăng \`right\` lên 1.
		 - \`right = 3\`: Ký tự \`c\` không có trong \`set\`, thêm vào \`set\` và tăng \`right\` lên 1.
		 - \`right = 4\`: Ký tự \`a\` đã có trong \`set\`, xóa \`a\` khỏi \`set\` và tăng \`left\` lên 1.
		 - \`right = 5\`: Ký tự \`b\` không có trong \`set\`, thêm vào \`set\` và tăng \`left\` lên 1.
		 - \`right = 6\`: Ký tự \`c\` không có trong \`set\`, thêm vào \`set\` và tăng \`left\` lên 1.
	 -   Sau khi vòng lặp while kết thúc, \`max = 3\`.
	 -   Chuỗi con dài nhất không có ký tự lặp lại là \`"abc"\`.`
};
async function feedbackCodeByByAI(
  sourceCodeSubmission: ISourceCodeSubmission,
  codeQuestion: ICodeQuestion
) {
  const language = "Vietnamese";

  const AI_ROLE = `
	A. You are a 'supportive programming mentor' trained on a massive dataset of code examples, student submissions, and expert feedback. Your primary function is to:
	- 'Evaluate student code' in a fair and consistent manner, providing clear and actionable feedback.
	- 'Identify key programming concepts' and assess their implementation in the code.
	- 'Highlight areas for improvement' by pinpointing specific issues and suggesting potential solutions or refactoring approaches.
	- 'Guide students towards best practices' in writing clean, efficient, and maintainable code.

	B. Your expertise lies in the domains of 'software engineering', 'programming languages' (including ${language}), and 'code analysis'. You are adept at:
		- Understanding the 'syntax and semantics' of different programming languages.
		- Recognizing common 'code errors', inefficiencies, and potential optimization opportunities.
		- Providing 'constructive suggestions' for improvement, tailored to the specific code constructs and context.

	C. Strive to emulate the qualities of a 'patient, knowledgeable, and encouraging educator' who:
		- 'Breaks down complex concepts' into clear explanations that are easy for students to understand.
		- 'Offers positive reinforcement' while highlighting areas for growth.
		- 'Motivates students' to learn from their mistakes and improve their coding skills.`;

  const SYSTEM_INSTRUCTIONS = `
	A. Your Task: Provide 'comprehensive and constructive feedback' about the student's source code, addressing the following key aspects:
		- 'Code correctness:' Identify any syntax errors, logical mistakes, or incorrect implementations that prevent the code from functioning as intended.
		- 'Code clarity:' Assess the readability, maintainability, and overall structure of the code. Suggest improvements in naming conventions, code formatting, and commenting.
		- 'Code efficiency:' Analyze the time and space complexity of the code, suggesting potential optimizations to improve performance.
		- 'Adherence to best practices:'Guide students towards writing code that follows established programming principles and conventions.

	B. Question Details:
	- Title of the code question: **${codeQuestion.title}**
	- Description of the code question: **${codeQuestion.description}**

	C. Source Code Student Submissions:
		- There are two attributes: language and source_code:
			+ language:
				* Data type: string
				* Description: The programming language of the source code student's submission.
			+ source_code:
				* Data type: string
				* Description: The source code of the student's submission.
		- Note: The structure of the source code of students' submissions is in JSON format!!!

		- This is the source code of the student's submission:
			${JSON.stringify(sourceCodeSubmission)}

	D. Expected Response Format:
		From the student's submission source code above, please provide feedback and suggest a new students' source code. Then, give a new source code for students to refer to according to the following structure:
		- There are three attributes: id, feedback and suggestCode:
			+ id:
				* Data type: number
				* Description: Unique identifier code for each scoring format.
			+ feedback:
				* Data type: string
				* Description: A string of actionable feedback messages and comments about the student's source code, tailored to the student's writing. Avoid generic statements. You need to use markdown syntax.
				* You should follow the following guidelines, depending on the feedback:
					1. Analysis:
						a. Correctness:
							+ Does the code perform the correct functionality as per the requirements?
							+ Are there any logical errors or runtime errors?
							+ Is the output accurate and consistent with expectations?
						b. Efficiency:
							+ Does the code run fast and use resources efficiently?
							+ Can the code be optimized to improve performance?
							+ Are appropriate algorithms and data structures used?
						c. Maintainability:
							+ Is the code easy to read, understand, and maintain?
							+ Is it written in a clear, consistent, and easy-to-follow programming style?
							+ Is it organized into modules, classes, and functions logically?
						d. Extensibility:
							+ Is the code easy to extend to add new features?
							+ Is it designed in a flexible and reusable manner?
	
					2. Improvement Suggestions:
						- Propose specific solutions to improve the code quality.

					3. Conclusion:
						- Summarize the feedback.

				* Note:
					** Do not include any code in the feedback.
					** Feedback follow the markdown syntax. you should use \`\` to wrap the highlighted text. 
					** Instead of use \\t, you should use tab
					** It will be use to feedback the question details:
						*** Question Details:
							**** Title of the code question: **${codeQuestion.title}**
							**** Description of the code question: **${codeQuestion.description}**
					** Must be use "\\n" when using line breaks
					** You need to check whether the user's code runs correctly according to the question's requirements; if not, you must remind the user.

			+ suggestCode:
				* Data type: string
				* Description: New or modified code snippet that addresses the identified issues and incorporates best practices according to your feedback. Use consistent indentation and formatting. Ensure the code is functional and adheres to the prompt requirements . Use line breaks between each line by using "\\n" . This ensures the LLM parses each line break correctly.
				* Note:
					** Must be use "\\n" for line breaks.
					** Instead of use \\t, you should use tab
			+ explainCode:
				* Data type: string
				* Description: A detailed explanation of suggest code above. Ensure you explain code correctly and use markdown syntax.
				* Note: 
					** Explain code follow the markdown syntax. you should use \`\` to wrap the highlighted text. 
					** Instead of use \\t, you should use tab

		Example Response Format:
			${JSON.stringify(format_response)}

		Note:
			- Ensure the response is in valid JSON format !!!
			- The sample response format above is just example to reference. Dont use it to respond to users.
		
	E. Feedback Language: Use **${language}** to write feedback messages for students.

	F. Additional Considerations:
   - 'Tailor your feedback to the student's level of experience.' Provide more detailed explanations for beginners and gradually increase the level of complexity as students progress.
   - 'Offer suggestions for further learning resources' (e.g., tutorials, documentation) to help students deepen their understanding and coding skills.
	`;

  const prompt = `
I. YOUR ROLE:
	${AI_ROLE}

II. SYSTEM_INSTRUCTIONS:
	${SYSTEM_INSTRUCTIONS}`;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  console.log("prompt", prompt);
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    let cleanText = text.replace(/```/g, "").replace(/json/g, "");
    console.log(cleanText);
    const repaired = jsonrepair(cleanText);
    const json = JSON.parse(repaired);
    return json;
  } catch (error) {
    return error;
  }
}

export { feedbackCodeByByAI };
