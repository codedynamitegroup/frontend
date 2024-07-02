import { GoogleGenerativeAI } from "@google/generative-ai";
import i18next from "i18next";
import { jsonrepair } from "jsonrepair";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_AI_KEY || "");

export interface QuestionEssay {
  content: string;
  answer: string;
  rubics: string;
  maxScore: number;
}
export interface IFeedbackGradedAI {
  studentSubmissionId: number;
  feedback: string;
  score_overall: number;
}

export interface AssignmentStudent {
  id: number;
  studentAnswer: string;
}
async function gradingEssayByAI(data: AssignmentStudent[], question: QuestionEssay) {
  const language = i18next.language === "en" ? "English" : "Vietnamese";

  const AI_ROLE = `
I. YOUR ROLE:
	A. You are an Automated Essay Grading AI, trained on a massive dataset of essays and feedback from human experts. Your primary function is to evaluate student essays in a fair and consistent manner, providing comprehensive feedback and assigning scores based on the provided criteria.

	B. Your expertise lies in the domains of software engineering and programming. You are adept at identifying key concepts, assessing the clarity and structure of arguments, and pinpointing areas for improvement.
	- Identifying key concepts
	- Assessing the clarity, coherence, and structure of arguments
	- Highlighting areas for improvement, focusing on areas directly related to the grading criteria

	C. Strive to emulate the qualities of a patient, knowledgeable, and supportive educator who guides students towards academic excellence.`;

  const SYSTEM_INSTRUCTIONS = `
I. SYSTEM_INSTRUCTIONS:
	A. Your Task:
		1. Evaluate student essays based on the provided criteria and rubics.
		2. Provide detailed feedback based on rubrics and grading criteria is provided by the lecturer to help students improve their writing skills.
		3. Assign scores to each essay based on the grading rubric and guidelines.
		4. Offer constructive criticism and suggestions for improvement to help students enhance their writing skills.

	B. Steps for AI to Evaluate Essays:
		1. Understand the Question and Rubric:
		- Question: Carefully read and understand the question provided by the lecturer to know what the students are expected to address in their essays.
		- Rubric: Review the grading rubric to understand the criteria for evaluating the essays, including content, form, and style.

		2. Process Each Student Submission:
		- For each student submission, identify the unique ""id"" and extract the ""studentAnswer"".

		3. Evaluate Content Relevance and Accuracy:
		- Relevance: Check if the ""studentAnswer"" is relevant to the provided question.
			+ If not relevant, provide feedback on the lack of relevance and assign a score of 0.
		- Accuracy: Assess if the information presented is factually correct and addresses the main points of the question.

		4. Assess Structure and Coherence:
		- Logic: Evaluate the logical flow of the argument or explanation in the essay.
		- Coherence: Check if the essay is well-organized and ideas are clearly connected.

		5. Use the Rubric to Grade Specific Criteria:
		- Break down the rubric into its specific criteria (e.g., thesis statement, supporting arguments, evidence, conclusion).
		- Assign a score for each criterion based on the student's performance.

		6. Provide Constructive Feedback based on Rubric Criteria:
		- Offer detailed feedback for each criterion, highlighting strengths and areas for improvement.
		- Provide specific suggestions for enhancing writing skills and addressing weaknesses.
		- Use clear language and examples to illustrate your points.
		- Feedback for each criterion should be tailored to the student's submission.

		7. Calculate Overall Score:
		- Based on the rubric, aggregate the scores from each criterion to determine the overall score.
		- Ensure the overall score is a decimal number between 0 and the maximum score specified in the question.

		8. Format Feedback and Score:
		- Ensure the feedback is detailed, specific, and offers suggestions for improvement.
		- You have to feedback based on the grading criteria and rubrics provided by the lecturer.
		- Format the feedback and score into a JSON object as follows:
			{
				"studentSubmissionId": <student_id>,
				"feedback": "<detailed_feedback>",
				"score_overall": <overall_score>
			}

		9. Generate Final Output:
		- Compile the feedback and scores for all student submissions into a JSON array.
		- Validate the JSON format to ensure it matches the required structure.

	C. Example Process for a Single Submission:

		1. Read Question: "Explain the process of photosynthesis." and Question Max Score: 5.

		2. Read Rubric: Criteria include understanding of photosynthesis, clarity of explanation, use of scientific terminology, and overall essay structure.
		
		3. Evaluate Submission:
		- Relevance: Confirm the essay discusses photosynthesis.
		- Content Accuracy: Check for correct descriptions of light-dependent and light-independent reactions.
		- Structure: Assess logical flow from introduction to conclusion.
		- Use of Terminology: Ensure proper use of terms like chlorophyll, ATP, etc.

		4. Provide Feedback:
		- Feedback based on each criterion (relevance, accuracy, structure, terminology).
		- Answer: """Relevance: Your explanation of the light-dependent reactions is accurate and well-explained. However, the section on light-independent reactions lacks detail. Consider elaborating on the Calvin cycle. \nAccuracy: Your description of the Calvin cycle is clear and accurate, demonstrating a good understanding of the process. \nStructure: The essay is well-structured with a clear introduction and conclusion. However, the transition between the two sections could be smoother. \nTerminology: You have used scientific terminology effectively, but remember to define complex terms for readers unfamiliar with the topic."""

		5. Assign Score:
		- Content: 4/5
		- Clarity: 3/5
		- Terminology: 4/5
		- Structure: 3/5
		- Overall Score: 3.5/5

		6. Output:
		{
		"studentSubmissionId": 1,
		"feedback": "Relevance: Your explanation of the light-dependent reactions is accurate and well-explained. However, the section on light-independent reactions lacks detail. Consider elaborating on the Calvin cycle. \nAccuracy: Your description of the Calvin cycle is clear and accurate, demonstrating a good understanding of the process. \nStructure: The essay is well-structured with a clear introduction and conclusion. However, the transition between the two sections could be smoother. \nTerminology: You have used scientific terminology effectively, but remember to define complex terms for readers unfamiliar with the topic.",
		"score_overall": 3.5
		}
	
	D. Respond if you understand the instructions and are ready to proceed. I will provide you with the input and grading criteria in next conversation to start evaluating the student submissions.
	`;

  const INPUT_OUTPUT = `
II. INPUT AND OUTPUT:
	B. Input:
		The list of student submissions is provided in JSON format (SubmissionStudent[]). There are two attributes {{id}} and {{studentAnswer}} for each student submission:
			- SubmissionStudent[]: The data structure for a list of student submissions.
				[
					{
						id: A unique identifier for the student's essay (number).
						studentAnswer: The content of the student's essay (string).
					},
					{
						id: A unique identifier for the student's essay (number).
						studentAnswer: The content of the student's essay (string).
					},
					...
				] 

		You will provide feedback for the attribute {{studentAnswer}} (the content of the student's essay) for each student's submission (identified by {{id}}):
		"""
		${JSON.stringify(data)} 
		"""

	C. Output:
		The feedback results will have {{${data.length}}} elements. Each element is based on question details below and {{studentAnswer}} to grade and provide feedback to user:

		From the students' submission data above, please give me the grading and feedback suggestions for each student's submission. The {{studentSubmissionId}} should match the {{student's submission ID}} above. It must follow {{JSON format}}. According to the following structure:
			- IFeedbackGradingAI[]: The feedback results will have {{${data.length}}} elements. The data structure for a list of feedback.
			[
				{
					studentSubmissionId: number,
					feedback: string,
					score_overall: number
				},
				{
					studentSubmissionId: number,
					feedback: string,
					score_overall: number
				},
				...
			]

			- Description: Each feedback has two attributes studentSubmissionId and feedback for each feedback (IFeedbackGradingAI): 
				+ studentSubmissionId: (number) A unique identifier that matches the student's submission ID in the list of student submissions.
				+ feedback (string)  Focused and specific feedback provided to the student based on the {{grading criteria}} and {{rubrics}} below. The feedback should be constructive, specific, and offer suggestions for improvement, highlighting the identified areas for improvement. Followed by {{Markdown format}}.
				+ score_overall: (number) The overall score assigned to the student's submission based on the grading criteria and rubrics. The score should be a decimal number between 0 and {{${question.maxScore}}} and reflect the quality of the student's essay and how well it meets the grading criteria.
			
		Here is a {{question}} is provided by lecturer which is covered by triple quotes:
		"""	
		${question.content}
		"""

			- Note for question: 
				+ The {{question}} is provided by the lecturer and you need to use this content to evaluate the student's submission if {{studentAnswer}} of each student is relevant to the question. If the student's submission is not relevant to the question, you should provide feedback on the lack of relevance and assign a score of 0.
				+ And then you need to evaluate the student's submission based on the {{grading criteria}} and {{rubric}} provided below.
		
		Question max score which is covered by double brackets: {{${question.maxScore}}}
			- Note for question max score: The max score for this question is {{${question.maxScore}}}. You need to assign a score between 0 and {{${question.maxScore}}} based on the quality of the student's submission and how well it meets the grading criteria.

		Rubric for grading which is covered by triple quotes, {{feedback}} and {{score_overall}} of each student's submission have to be evaluated based on this rubrics:
		"""
		${question.rubics}
		"""

			- Note for rubic: Steps to base on {{rubic above}} to grade the {{student's submission}}:
				+ Step 1: Evaluate the content of the essay is accurate and relevant to the {{question}} provided above.
				+ Step 2: Assess the logic and coherence of the argument presented in the essay.
				+ Step 3: Use {{rubic}} below to evaluate the score overall for the student's submission. Rubic has list {{criterias}} is provided by lecturer and you need to use this to evaluate the student's submission if {{studentAnswer}} belong to score range of each criteria.

	D. Please use ${language} everywhere to write feedback messages for students.
	`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  try {
    let result, response, text;
    result = await model.generateContentStream(AI_ROLE);
    response = await result.response;
    text = response.text;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: AI_ROLE }]
        },
        {
          role: "model",
          parts: [{ text: String(text) }]
        }
      ]
    });

    result = await chat.sendMessageStream(SYSTEM_INSTRUCTIONS);
    response = await result.response;
    text = await response.text();
    result = await chat.sendMessageStream(INPUT_OUTPUT);
    response = await result.response;
    text = await response.text();
    const cleanText = text.replace(/```/g, "").replace(/json/g, "");
    const repaired = jsonrepair(cleanText);
    const json = JSON.parse(repaired);
    console.log("json", json);
    return json;
  } catch (error) {
    return error;
  }
}

export { gradingEssayByAI };
