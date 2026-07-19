import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key_if_not_set');

// ⚠️ gemini-1.5-flash is shut down (all Gemini 1.0 and 1.5 models are retired).
// Using a currently supported model instead.
const MODEL_NAME = "gemini-2.5-flash";

export const generateStudyPlan = async (subject: string, difficulty: string, hours: string, examDate: string, length: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    let lengthInstruction = "Provide a concise response.";
    if (length === "Medium Output") lengthInstruction = "Provide a moderately detailed response.";
    else if (length === "Long Output") lengthInstruction = "Provide a very detailed and comprehensive response.";

    const prompt = `
      Act as an expert AI Study Planner.
      Create a study plan for a student with the following details:
      Subject: ${subject}
      Difficulty: ${difficulty}
      Daily Study Hours: ${hours}
      Exam Date: ${examDate}
      
      ${lengthInstruction}
      
      Please structure your response with the following headers:
      - Daily Routine
      - Weekly Plan
      - Study Strategy
      - Important Topics
      - Exam Tips
      
      Format the output in clean Markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    // Log the REAL underlying error so it shows up in Render logs
    console.error("Gemini API Error (generateStudyPlan):", error?.message || error);
    throw new Error(error?.message || 'Failed to generate study plan');
  }
};

export const generateRecommendation = async (userHistory: any) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      Act as an AI Smart Recommendation Engine for a student.
      Here is the student's past task history:
      ${JSON.stringify(userHistory)}
      
      Based on their history, subjects, and difficulty levels, suggest the following:
      - Next Study Topic
      - Weak Subjects
      - Daily Goal
      - Best Study Time
      - Learning Tips
      
      Provide the response in clean Markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error (generateRecommendation):", error?.message || error);
    throw new Error(error?.message || 'Failed to generate recommendation');
  }
};