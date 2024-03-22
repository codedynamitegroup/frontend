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
  improvementSuggestions: string;
  conclusion: string;
}

export interface IFeedbackCodeByAI {
  id: number;
  feedback: IFeedbackCode;
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
  feedback: {
    analysis: {
      correctness: {
        accuracy: `
				- Code sử dụng vòng lặp \`while\` để đảo ngược từng chữ số của \`số nguyên x\`.
				- Sau mỗi vòng lặp, kết quả \`result\` được cập nhật bằng cách nhân 10 và cộng thêm chữ số cuối cùng của x.
				- Quá trình này được lặp lại cho đến khi x bằng 0.
				- Do đó, kết quả cuối cùng result sẽ là số nguyên đảo ngược của x.				
				`,
        completeness:
          "Code xử lý được tất cả các trường hợp đầu vào hợp lệ, bao gồm số nguyên dương, số nguyên âm và số 0.",
        consistency: "Cho cùng một đầu vào x, code luôn cho ra kết quả result giống nhau."
      },
      efficiency: {
        executionTime: `
				- Code sử dụng vòng lặp while để đảo ngược từng chữ số của số nguyên x.
				- Do đó, thời gian thực thi của code sẽ phụ thuộc vào số lượng chữ số của x.
				- Ví dụ, với số nguyên có 10 chữ số, code sẽ thực hiện 10 vòng lặp.
				- Nhìn chung, thời gian thực thi của code được đánh giá là tương đối nhanh.
				`,
        memory: `
				- Code sử dụng biến result để lưu trữ kết quả đảo ngược.
				- Kích thước của biến result phụ thuộc vào số lượng chữ số của x.
				- Ví dụ, với số nguyên có 10 chữ số, biến result sẽ cần 4 byte (32 bit) để lưu trữ.
				- Nhìn chung, code sử dụng bộ nhớ hiệu quả.
				`,
        complexity: `
				- Độ phức tạp thời gian của code là O(n), với n là số lượng chữ số của x.
				- Độ phức tạp bộ nhớ của code là O(1).
				`
      },
      maintainability: {
        readability: `
				- Code được viết khá dễ đọc và dễ hiểu.
				- Các biến được đặt tên rõ ràng, dễ nhận biết.
				- Vòng lặp while được sử dụng để đảo ngược từng chữ số của số nguyên x được giải thích rõ ràng.				
				`,
        reuseability:
          "Code có thể được tái sử dụng cho các bài toán tương tự, chẳng hạn như đảo ngược chuỗi.",
        extensibility:
          "Code có thể được mở rộng để xử lý các trường hợp phức tạp hơn, chẳng hạn như đảo ngược số nguyên có dấu."
      },
      scalability: {
        dataScalability: `
				Code có thể xử lý được lượng dữ liệu lớn.
				Ví dụ, code có thể đảo ngược số nguyên có hàng tỷ chữ số.`,
        functionalScalability:
          "Code có thể được mở rộng để thêm các chức năng mới, chẳng hạn như kiểm tra số đối xứng."
      }
    },
    improvementSuggestions: `
		- Sử dụng mảng thay cho \`HashSet\` để tiết kiệm bộ nhớ.
		- Viết thêm bình luận để giải thích code và thuật toán.
		`,
    conclusion: `
		- Code \`lengthOfLongestSubstring\` được viết tốt, đáp ứng đầy đủ các yêu cầu về tính chính xác, hiệu quả, bảo trì, khả năng mở rộng và tuân thủ. Một số cải tiến nhỏ có thể được thực hiện để tối ưu hóa hiệu suất sử dụng bộ nhớ.
		- Đánh giá chung: Tốt
		`
  },
  suggestedCode:
    " class Solution { \n  public: \n    vector<vector<int>> divideArray(vector<int>& nums, int ki) { \n      vector<vector<int>> ans; \n      ... (rest of the code with line breaks) \n    } \n  }; \n",
  explainedCode: `1. Khai báo biến:
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

	B. Source Code user Submissions:
		- There are two attributes: language and source_code:
			+ language:
				* Data type: string
				* Description: The programming language of the source code user's submission.
			+ source_code:
				* Data type: string
				* Description: The source code of the user's submission.
		- Note: The structure of the source code of users' submissions is in JSON format!!!

		- This is the source code of the user's submission:
			${JSON.stringify(sourceCodeSubmission)}

	C. Expected Response Format:
		The feedback results is based on question details below and user's source code to provide feedback to the user:
		- Title of the code question: 
			${codeQuestion.title}

		- Description of the code question: 
			${codeQuestion.description}

		This is the list of users' submissions (ISourceCodeSubmission) that will be reviewed by you. You will provide feedback for the attribute source_code (The source code of the user's submission):
			${JSON.stringify(sourceCodeSubmission)} 

		From the user's submission source code above, please provide feedback and suggest a new users' source code. Then, give a new source code for users to refer to according to the following structure (IfeedbackCodeByAI) is JSON format!!!:
		{
			id: number,
			feedback: {
				analysis: {
					correctness: {
						accuracy: string (not be empty or null),
						completeness: string (not be empty or null),
						consistency: string (not be empty or null)
					},
					efficiency: {
						executionTime: string (not be empty or null),
						memory: string (not be empty or null),
						complexity: string (not be empty or null)
					},
					maintainability: {
						readability: string (not be empty or null),
						reuseability: string (not be empty or null),
						extensibility: string (not be empty or null)
					},
					scalability: {
						dataScalability: string (not be empty or null),
						functionalScalability: string (not be empty or null)
					}
				},
				improvementSuggestions: string (not be empty or null),
				conclusion: string (not be empty or null)
			}
		}

		- Description: There are 2 attributes: id, feedback (IFeedbackCodeByAI) is JSON format:
			+ id:
				* Data type: number
				* Description: Unique identifier code for feedback code.
			+ feedback:
				* Data type: object
				* Description: A object of actionable feedback messages and comments (IFeedback) about the user's source code, tailored to the user's writing. Avoid generic statements. You need to use markdown syntax.
					- IFeedback: The data structure for a feedback:
					{
						analysis: {
							correctness: {
								accuracy: A string (not be empty or null). The output of the algorithm must match the desired output. Feedback follow the markdown syntax. You should use \`\` to wrap the highlighted text. 
								completeness: A string (not be empty or null). The algorithm must handle all valid input cases. Feedback follow the markdown syntax. You should use \`\` to wrap the highlighted text. 
								consistency: A string (not be empty or null). The algorithm must produce the same output for the same input, regardless of the time or environment in which it is executed. Feedback follow the markdown syntax. You should use \`\` to wrap the highlighted text. 
							},
							efficiency: {
								executionTime: A string (not be empty or null). The algorithm must run quickly and optimize processing time. Feedback follow the markdown syntax. You should use \`\` to wrap the highlighted text. 
								memory: A string (not be empty or null). The algorithm must use memory efficiently and avoid waste. Feedback follow the markdown syntax. You should use \`\` to wrap the highlighted text. 
								complexity: A string (not be empty or null). The algorithm must have low complexity (time and memory) to be able to handle large data. Feedback follow the markdown syntax. You should use \`\` to wrap the highlighted text. 
							},
							maintainability: {
								readability: A string (not be empty or null). The algorithm code should be easy to read, understand, and maintain. Feedback follow the markdown syntax. You should use \`\` to wrap the highlighted text. 
								reuseability:  A string (not be empty or null). The algorithm can be reused for similar problems. Feedback follow the markdown syntax. You should use \`\` to wrap the highlighted text. 
								extensibility: A string (not be empty or null). The algorithm can be extended to handle more complex cases. Feedback follow the markdown syntax. You should use \`\` to wrap the highlighted text. 
							},
							scalability: {
								dataScalability: A string (not be empty or null). The algorithm can handle larger amounts of data. Feedback follow the markdown syntax. You should use \`\` to wrap the highlighted text. 
								functionalScalability: A string (not be empty or null). The algorithm can be extended to add new features. Feedback follow the markdown syntax. You should use \`\` to wrap the highlighted text. 
							}
						},
						improvementSuggestions: A string (not be empty or null). Propose some specific solutions to improve the quality of the given code. Feedback follow the markdown syntax. You should use \`\` to wrap the highlighted text. 
						conclusion: A string (not be empty or null). Summarize the feedback. Feedback follow the markdown syntax. You should use \`\` to wrap the highlighted text. 
					}
				* Note for feedback:
					** Feedback follow the markdown syntax. Do not use ** to highlight text, instead, you should use \`\` to wrap the highlighted text.
					** Instead of use \\t, you should use tab
					** Must be use "\\n" when using line breaks
					** You need to check whether the user's code runs correctly according to the question's requirements; if not, you must remind the user.

				* Here is example of feedback:
					${JSON.stringify(format_response.feedback)}

				* Note for example of feedback:
					** The example of feedback is just for reference. You can change the example to fit your needs.

	Note of example:
		1. Ensure the response is in valid JSON format !!!
		2. The example is just for reference. You can change the example to fit your needs.
			
	D. Feedback Language: Use **${language}** to write feedback messages for users.
	`;

  const SYSTEM_INSTRUCTIONS2 = `
  	Based on the analysis above, suggest specific improvements for the code
	A. Expected Response Format:
		Please give a new source code for users to refer to according to the following structure (IfeedbackCodeByAI) is JSON format!!!:
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
					** Instead of use \\t, you should use tab
					
				* Here is example of suggested code:
					${format_response.suggestedCode}

				* Note for example of suggested code:
					** The example of suggested code is just for reference. You can change the example to fit your needs.

			+ explainedCode:
				* Data type: string (not be "" or null)
				* Description: A detailed explanation of suggest code above. Ensure you explain code correctly and use markdown syntax. The content attribute of the answer should not be empty or null. It should be filled with complete information
				* Note: 
					** Explain code follow the markdown syntax. Do not use ** to highlight text, instead, you should use \`\` to wrap the highlighted text.
					** Instead of use \\t, you should use tab

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
    console.log(text);

    try {
      let cleanText = text?.replace(/```/g, "").replace(/json/g, "").replace(/\\t/g, " ");
      repaired = jsonrepair(cleanText);
      json = JSON.parse(repaired);
      console.log(json);
    } catch (error) {
      console.log(error);
    }

    result = await chat.sendMessage(SYSTEM_INSTRUCTIONS2);
    response = await result.response;
    text = response.text();
    console.log(text);

    chat.getHistory().then((history) => {
      console.log(history);
    });

    try {
      let cleanText = text?.replace(/```/g, "").replace(/json/g, "");
      let repaired = jsonrepair(cleanText);
      codeJson = JSON.parse(repaired);
    } catch (error) {
      console.log(error);
    }
    json = Object.assign(json, codeJson);

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

export { feedbackCodeByByAI };
