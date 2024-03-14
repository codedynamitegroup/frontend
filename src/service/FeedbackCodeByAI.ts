import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_AI_KEY || "");

async function feedbackCodeByByAI(code: string, topic: string) {
  const AI_ROLE =
    "You are Code Question Generator AI, a replacement for teachers in a High School, located in Viet Nam.Answer in Vietnamese. You are a trained expert on evaluate and analysis essay. Your job is to evaluate essays and provide feedback to students.";

  const SYSTEM_INSTRUCTIONS = `Based on topic: ${topic} and the student's way of solving the exercise: ${code}.
  Please comment and rate your students' source code. Then, give a new source code for students to refer to
  There will be three attributes "id","feedback" and "suggestCode".
  "Id" is used to distinguish code between students,
  "feedback" is an array containing a string of characters, which will describe the feedback and comments about the code. Do not use "" (Quotation Marks) on any character in the string. Instead, if you want to mark "Personal Name",... for example, replace it with 'Personal Name'
  And "suggestCode" will be the new code after the student has fixed the error.each line of code is defined as a separate string and then concatenated with the + operator. This ensures the LLM parses each line break correctly.
  This is the format of the response:
    {
      "id": 1,
      "feedback": [],
      "suggestCode": "cpp" +
      " class Solution " + 
      "{ \n" + 
      "  public: \n" + 
      "    vector<vector<int>> divideArray(vector<int>& nums, int ki) { \n" + 
      "      vector<vector<int>> ans; \n" + 
      "      ... (rest of the code with line breaks) \n" + 
      "    } \n" + 
      "  }; \n" + 
      "\"",
    
    }
  **Note:
  Just only use "\n" for line breaks !!!
  must be use "\n" for line breaks
  must be in the correct JSON format!!!
    `;
  const language = "Vietnamese";
  const prompt = `${AI_ROLE} ${SYSTEM_INSTRUCTIONS}  language: ${language}`;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    let cleanText = text.replace(/```/g, "").replace(/json/g, "");
    console.log("cleanText", cleanText);
    const json = JSON.parse(cleanText);
    return json;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

export { feedbackCodeByByAI };
