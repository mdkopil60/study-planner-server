"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecommendation = exports.generateStudyPlan = void 0;
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key_if_not_set' });
// Currently active, non-deprecated model
const MODEL_NAME = "gemini-2.5-flash";
const generateStudyPlan = async (subject, difficulty, hours, examDate, length) => {
    try {
        let lengthInstruction = "Provide a concise response.";
        if (length === "Medium Output")
            lengthInstruction = "Provide a moderately detailed response.";
        else if (length === "Long Output")
            lengthInstruction = "Provide a very detailed and comprehensive response.";
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
        const result = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
        if (!result.text) {
            throw new Error('Gemini API returned an empty response');
        }
        return result.text;
    }
    catch (error) {
        console.error("Gemini API Error (generateStudyPlan):", error?.message || error);
        throw new Error(error?.message || 'Failed to generate study plan');
    }
};
exports.generateStudyPlan = generateStudyPlan;
const generateRecommendation = async (userHistory) => {
    try {
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
        const result = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
        if (!result.text) {
            throw new Error('Gemini API returned an empty response');
        }
        return result.text;
    }
    catch (error) {
        console.error("Gemini API Error (generateRecommendation):", error?.message || error);
        throw new Error(error?.message || 'Failed to generate recommendation');
    }
};
exports.generateRecommendation = generateRecommendation;
