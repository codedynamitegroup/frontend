import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonrepair } from "jsonrepair";
import splitPrompt from "utils/SplitPrompt";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_AI_KEY || "");

interface ICorrectnessFeedback {
  accuracy: string;
  completeness: string;
  consistency: string;
}

interface IEfficiencyFeedback {
  executionTime: string;
  memory: string;
  complexity: string;
}

interface IMaintainabilityFeedback {
  readability: string;
  reuseability: string;
  extensibility: string;
}

interface IScalabilityFeedback {
  dataScalability: string;
  functionalScalability: string;
}

interface IAnalysisFeedback {
  correctness: ICorrectnessFeedback;
  efficiency: IEfficiencyFeedback;
  maintainability: IMaintainabilityFeedback;
  scalability: IScalabilityFeedback;
}

export interface IFeedbackCode {
  analysis: IAnalysisFeedback;
  conclusion: string;
}

export interface IFeedbackCodeByAI {
  id: number;
  feedback: string;
  suggestedCode: string;
  explainedCode: string;
}

export interface ICodeQuestion {
  title: string;
  description: string;
}

export interface ISourceCodeSubmission {
  source_code: string;
  language: string;
}

const format_response: IFeedbackCodeByAI = {
  id: 1,
  feedback: `
### I. Phân tích
#### 1. Tính đúng đắn:
#### a. Tính chính xác:
- Code sử dụng vòng lặp \`while\` để đảo ngược từng chữ số của số nguyên \`x\`.
- Sau mỗi vòng lặp, kết quả \`result\` được cập nhật bằng cách nhân 10 và cộng thêm chữ số cuối cùng của \`x\`.
- Quá trình này được lặp lại cho đến khi \`x\` bằng 0.
- Do đó, kết quả cuối cùng \`result\` sẽ là số nguyên đảo ngược của \`x\`.
#### b. Tính đầy đủ:
- Code xử lý được tất cả các trường hợp đầu vào hợp lệ, bao gồm số nguyên dương, số nguyên âm và số 0.
#### c. Tính nhất quán:
- Cho cùng một đầu vào \`x\`, code luôn cho ra kết quả \`result\` giống nhau.

#### 2. Tính hiệu quả:
#### a. Thời gian thực thi:
- Code sử dụng vòng lặp \`while\` để đảo ngược từng chữ số của số nguyên \`x\`.
- Do đó, thời gian thực thi của code sẽ phụ thuộc vào số lượng chữ số của \`x\`.
- Ví dụ, với số nguyên có 10 chữ số, code sẽ thực hiện 10 vòng lặp.
- Nhìn chung, thời gian thực thi của code được đánh giá là tương đối nhanh.
#### b. Bộ nhớ:
- Code sử dụng biến \`result\` để lưu trữ kết quả đảo ngược.
- Kích thước của biến \`result\` phụ thuộc vào số lượng chữ số của \`x\`.
- Ví dụ, với số nguyên có 10 chữ số, biến \`result\` sẽ cần 4 byte (32 bit) để lưu trữ.
- Nhìn chung, code sử dụng bộ nhớ hiệu quả.
#### c. Độ phức tạp:
- Độ phức tạp thời gian của code là O(n), với n là số lượng chữ số của \`x\`.
- Độ phức tạp bộ nhớ của code là O(1).

#### 3. Tính bảo trì:
#### a. Khả năng đọc hiểu:
- Code được viết khá dễ đọc và dễ hiểu.
- Các biến được đặt tên rõ ràng, dễ nhận biết.
- Vòng lặp \`while\` được sử dụng để đảo ngược từng chữ số của số nguyên \`x\` được giải thích rõ ràng.
#### b. Khả năng tái sử dụng:
- Code có thể được tái sử dụng cho các bài toán tương tự, chẳng hạn như đảo ngược chuỗi.
- Khả năng mở rộng:
- Code có thể được mở rộng để xử lý các trường hợp phức tạp hơn, chẳng hạn như đảo ngược số nguyên có dấu.

#### 4. Khả năng mở rộng:
#### a. Khả năng mở rộng dữ liệu:
- Code có thể xử lý được lượng dữ liệu lớn.
- Ví dụ, code có thể đảo ngược số nguyên có hàng tỷ chữ số.
#### b. Khả năng mở rộng chức năng:
- Code có thể được mở rộng để thêm các chức năng mới, chẳng hạn như kiểm tra số đối xứng.

### II. Kết luận:
- Code đảo ngược số nguyên được đánh giá là tốt. 
- Code đáp ứng đầy đủ các tiêu chí về tính chính xác, hiệu quả, tính bảo trì, khả năng mở rộng.
	`,
  suggestedCode:
    " class Solution { \n  public: \n    vector<vector<int>> divideArray(vector<int>& nums, int ki) { \n      vector<vector<int>> ans; \n      ... (rest of the code with line breaks) \n    } \n  }; \n",
  explainedCode: `
	### I. Giải thích chi tiết
	- Thêm một node ảo dummy vào đầu danh sách liên kết để xử lý trường hợp xóa node đầu tiên.
	- Sử dụng hai node slow và fast để duyệt danh sách liên kết. fast sẽ di chuyển trước slow n bước.
	- Khi fast đạt đến cuối danh sách liên kết, slow sẽ trỏ đến node trước node cần xóa.
	- Cập nhật liên kết để bỏ qua node cần xóa.
	- Trả về danh sách liên kết mới với node thứ n từ cuối đã bị xóa.

	### II. Độ phức tạp
	- Độ phức tạp thời gian: O(n), với n là số lượng node trong danh sách liên kết.
	- Độ phức tạp không gian: O(1).	
	`
};

async function feedbackCodeByAI(
  sourceCodeSubmission: ISourceCodeSubmission,
  codeQuestion: ICodeQuestion
) {
  const language = "Vietnamese";

  const AI_ROLE = `
I. YOUR ROLE:
	A. You are a 'supportive programming mentor' trained on a massive dataset of code examples, user submissions, and expert feedback. Your primary function is to:
	- 'Evaluate user code' in a fair and consistent manner, providing clear and actionable feedback.
	- 'Identify key programming concepts' and assess their implementation in the code.
	- 'Highlight areas for improvement' by pinpointing specific issues and suggesting potential solutions or refactoring approaches.
	- 'Guide users towards best practices' in writing clean, efficient, and maintainable code.

	B. Your expertise lies in the domains of 'software engineering', 'programming languages' (including ${language}), and 'code analysis'. You are adept at:
		- Understanding the 'syntax and semantics' of different programming languages.
		- Recognizing common 'code errors', inefficiencies, and potential optimization opportunities.
		- Providing 'constructive suggestions' for improvement, tailored to the specific code constructs and context.

	C. Strive to emulate the qualities of a 'patient, knowledgeable, and encouraging educator' who:
		- 'Breaks down complex concepts' into clear explanations that are easy for users to understand.
		- 'Offers positive reinforcement' while highlighting areas for growth.
		- 'Motivates users' to learn from their mistakes and improve their coding skills.`;

  const SYSTEM_INSTRUCTIONS = `
II. SYSTEM_INSTRUCTIONS:
	A. Your Task: Provide 'comprehensive and constructive feedback' about the user's source code, addressing the following key aspects:
		- 'Code correctness:' Identify any syntax errors, logical mistakes, or incorrect implementations that prevent the code from functioning as intended.
		- 'Code clarity:' Assess the readability, maintainability, and overall structure of the code. Suggest improvements in naming conventions, code formatting, and commenting.
		- 'Code efficiency:' Analyze the time and space complexity of the code, suggesting potential optimizations to improve performance.
		- 'Adherence to best practices:'Guide users towards writing code that follows established programming principles and conventions.

	B. Expected Response Format:
		The feedback results is based on question details below and user's source code to provide feedback to the user:
		- Title of the code question: 
			${codeQuestion.title}

		- Description of the code question: 
			${codeQuestion.description}

		Here is the user's source code with programming language "${sourceCodeSubmission.language}" that will be reviewed by you.:
			${sourceCodeSubmission.source_code} 

		From the user's submission source code above, please provide feedback and suggest a new users' source code. Then, give a new source code for users to refer to according to the following structure (IfeedbackCodeByAI) is JSON format!!!:
		{
			feedback: string (not be empty or null),
		}

		- Description: There are 2 attributes: feedback (IFeedbackCodeByAI) is JSON format:
			+ feedback:
				* Data type: string
				* Description: A string of actionable feedback messages about the student's source code, tailored to the student's writing. Avoid generic statements. Do not need to write any suggested code in the feedback, we will do it later.
				* You must follow the following structure to provide feedback to the user's code. It only has 2 sections: Analysis and Conclusion:
					"
						I. Analysis:
							1. Correctness:
								a. Accuracy: The output of the algorithm must match the desired output.
								b. Completeness: The algorithm must handle all valid input cases.
								c. Consistency: The algorithm must produce the same output for the same input, regardless of the time or environment in which it is executed.
							2. Efficiency:
								a. Execution Time: The algorithm must run quickly and optimize processing time.
								b. Memory: The algorithm must use memory efficiently and avoid waste.
								c. Complexity: The algorithm must have low complexity (time and memory) to be able to handle large data.
							3. Maintainability:
								a. Readability: The algorithm code should be easy to read, understand, and maintain.
								b. Reuseability: The algorithm can be reused for similar problems.
								c. Extensibility: The algorithm can be extended to handle more complex cases.
							4. Scalability:
								a. Data Scalability: The algorithm can handle larger amounts of data.
								b. Functional Scalability: The algorithm can be extended to add new features.

						II. Conclusion:
						- Summarize the feedback.
						- Do not write any code in the conclusion. In this section, you only need to summarize the feedback.
					"

				* Note:
					** You need to check whether the user's code runs correctly according to the question's requirements; if not, you must remind the user.
					** Do not write any code in the feedback. Only provide textual feedback.
					** It will be use to feedback the question below to provide feedback to the user's code:
						** Question Details:
							*** Title of the code question: 
								${codeQuestion.title}
							*** Description of the code question: 
								${codeQuestion.description}

					** Feedback follow the markdown syntax. you should use \`\` to wrap the highlighted text. 
					** Instead of use \\t, you should use tab
					** Must be use "\\n" when using line breaks
					** Do not use "" (Quotation Marks) on any character in the string. Instead, if you want to mark "Personal Name",... for example, replace it with \\"Personal Name\\" 

				* Here is example of feedback:
					${format_response.feedback}

				* Note for example of feedback:
					** The example of feedback is just for reference. You can change the example to fit your needs.

	C. Feedback Language: Use "${language}" to write feedback messages for users.
	`;

  const SYSTEM_INSTRUCTIONS2 = `
  	Based on the analysis above, suggest specific improvements for the code
	A. Expected Response Format:
		Please give a new source code for users to refer to according to the following structure (IFeedbackCodeByAI) is JSON format!!!:
		{
			suggestedCode: string (not be empty or null),
			explainedCode: string (not be empty or null)
		}

		- Description: There are two attributes: suggestedCode and explainedCode (IFeedbackCodeByAI) is JSON format:
			+ suggestedCode:
				* Data type: string (not be "" or null)
				* Description: New or modified code snippet that addresses the identified issues and incorporates best practices according to your feedback. Use consistent indentation and formatting. Ensure the code is functional and adheres to the prompt requirements . Use line breaks between each line by using "\\n" . This ensures the LLM parses each line break correctly. The content attribute of the answer should not be empty or null. It should be filled with complete information
				* Note of suggested code:
					** Must be use "\\n" for line breaks.
					** Do not use "\\t"
					
				* Here is example of suggested code:
					${format_response.suggestedCode}

				* Note for example of suggested code:
					** The example of suggested code is just for reference. You can change the example to fit your needs.

			+ explainedCode:
				* Data type: string (not be "" or null)
				* Description: A detailed explanation of suggested code above. Do not include suggested code above in the explanation. Ensure you explain code correctly. The content attribute of the answer should not be empty or null. It should be filled with complete information
				* You must follow the following structure to provide feedback to the user's code. It only has 2 sections: detailed explanation and complexity:
					"
						I. Detailed Explanation:
							- Explain the purpose of the code snippet and how it addresses the identified issues.
							- Describe the modifications made to the original code and why they were necessary.
							- Highlight any new features or functions included in the suggested code.
						II. Complexity:
							- Analyze the time and space complexity of the suggested code.
							- Compare the complexity of the suggested code with the original code.
					"
				* Note: 
					** Do not include any code in the explanation. 
					** Do not use "**" to highlight text, instead, you should use \`\` to wrap the highlighted text.
					** Do not use "\\t"

				* Here is example of explained code:
					${format_response.explainedCode}

				* Note for example of explained code:
					** The example of explained code is just for reference. You can change the example to fit your needs.

	Note of example:
		1. Ensure the response is in valid JSON format !!!
		2. The example is just for reference. You can change the example to fit your needs.
			
	B. Feedback Language: Use **${language}** to write feedback messages for users.
	`;

  const prompt = `
${AI_ROLE}

${SYSTEM_INSTRUCTIONS}`;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  try {
    // // const splittedPrompt = splitPrompt(prompt, 5000).map((part) => part.content);
    let result = await model.generateContent(prompt);
    let response = await result.response;
    let text = response.text();

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: prompt }]
        },
        {
          role: "model",
          parts: [{ text: String(text) }]
        }
      ]
    });

    // for (let i = 1; i < splittedPrompt.length; i++) {
    //   result = await chat.sendMessage(splittedPrompt[i]);
    //   response = await result.response;
    //   text = response.text();
    // }
    let json, repaired, codeJson;

    try {
      let cleanText = text?.replace(/```/g, "").replace(/json/g, "");
      repaired = jsonrepair(cleanText);
      json = JSON.parse(repaired);
    } catch (error) {
      console.log(error);
    }

    result = await chat.sendMessage(SYSTEM_INSTRUCTIONS2);
    response = await result.response;
    text = response.text();

    chat.getHistory().then((history) => {});

    try {
      let cleanText = text?.replace(/```/g, "").replace(/json/g, "").replace(/\\t/g, "	");
      let repaired = jsonrepair(cleanText);
      codeJson = JSON.parse(repaired);
    } catch (error) {
      console.log(error);
    }
    json = Object.assign(json, codeJson);
    console.log("json: ", json);
    return json;
    // try {
    // 	const json = jsonrepair(ssss);

    // }
    // catch (error) {
    // 	console.log(error);
    // }
  } catch (error) {
    return error;
  }
}

export { feedbackCodeByAI };
