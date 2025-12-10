import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, Subject, Difficulty } from "../types";
import { SYSTEM_INSTRUCTION_QUIZ, SYSTEM_INSTRUCTION_TUTOR } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

// Schema for structured Quiz generation
const quizSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      questionText: { type: Type.STRING },
      options: { 
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      correctOptionIndex: { type: Type.INTEGER, description: "0-based index of the correct option" },
      explanation: { type: Type.STRING, description: "Detailed explanation of why the answer is correct" },
      topic: { type: Type.STRING }
    },
    required: ["questionText", "options", "correctOptionIndex", "explanation", "topic"]
  }
};

// Schema for Daily Questions (includes subject field)
const dailyQuestionSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      subject: { type: Type.STRING },
      questionText: { type: Type.STRING },
      options: { 
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      correctOptionIndex: { type: Type.INTEGER },
      explanation: { type: Type.STRING },
      topic: { type: Type.STRING }
    },
    required: ["subject", "questionText", "options", "correctOptionIndex", "explanation", "topic"]
  }
};

export const generateQuizQuestions = async (
  subject: Subject,
  topic: string,
  difficulty: Difficulty,
  count: number = 5
): Promise<Question[]> => {
  try {
    const ai = getClient();
    
    // We use gemini-2.5-flash for speed and structured output capabilities
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate ${count} unique NEET-level multiple choice questions for Subject: ${subject}, Topic: ${topic}. Difficulty: ${difficulty}. 
      Ensure options are tricky and relevant. Focus on NCERT based concepts.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_QUIZ,
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.4, // Lower temperature for more factual accuracy
      }
    });

    if (!response.text) {
      throw new Error("No data returned from AI");
    }

    const rawData = JSON.parse(response.text);
    
    // Map to our internal Question interface, adding IDs
    return rawData.map((q: any, index: number) => ({
      ...q,
      id: Date.now() + index,
    }));

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

export const generateDailyQuestions = async (): Promise<(Question & { subject: string })[]> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate exactly 3 NEET multiple choice questions: 
      1. Physics (Conceptual or Numerical)
      2. Chemistry (Organic or Physical)
      3. Biology (Botany or Zoology)
      Difficulty: Medium to Hard. Focus on high-yield topics.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_QUIZ,
        responseMimeType: "application/json",
        responseSchema: dailyQuestionSchema,
        temperature: 0.5,
      }
    });

    if (!response.text) {
      throw new Error("No data returned from AI");
    }

    const rawData = JSON.parse(response.text);
    return rawData.map((q: any, index: number) => ({
      ...q,
      id: Date.now() + index,
    }));
  } catch (error) {
    console.error("Error generating daily questions:", error);
    throw error;
  }
};

export const getChatResponseStream = async (
  history: { role: string; parts: { text: string }[] }[],
  currentMessage: string,
  imagePart?: { inlineData: { data: string; mimeType: string } }
) => {
  const ai = getClient();
  
  // Switched to gemini-2.5-flash for better stability and speed
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_TUTOR,
    },
    history: history as any
  });

  // For message, we can pass a string or an array of parts
  const message = imagePart 
    ? [imagePart, { text: currentMessage }]
    : currentMessage;

  return await chat.sendMessageStream({ 
    message: message as any
  });
};