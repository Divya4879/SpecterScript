import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

const syllabusSchema = {
    type: Type.OBJECT,
    properties: {
        units: {
            type: Type.ARRAY,
            description: "An array of unit objects extracted from the syllabus.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: 'Unique identifier for the unit (e.g., "unit1").' },
                    title: { type: Type.STRING, description: 'The main title of the unit, including the unit number (e.g., "Unit 1: Introduction"). Must be clear, concise, and grammatically correct.' },
                    topics: {
                        type: Type.ARRAY,
                        description: 'A list of key concepts, keywords, or sub-topics listed under the main unit title.',
                        items: { type: Type.STRING }
                    }
                },
                required: ["id", "title", "topics"]
            }
        }
    },
    required: ["units"]
};

async function generateContentWithRetry(requestPayload: any, ai: any) {
    const MAX_RETRIES = 3;
    const INITIAL_DELAY_MS = 1000;
    
    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            const response = await ai.models.generateContent(requestPayload);
            return response;
        } catch (error: any) {
            if (error.message && error.message.includes('429')) {
                retries++;
                if (retries >= MAX_RETRIES) {
                    throw new Error("API rate limit exceeded. Please wait a minute and try again.");
                }
                const delayTime = INITIAL_DELAY_MS * Math.pow(2, retries - 1);
                await new Promise(resolve => setTimeout(resolve, delayTime));
            } else {
                throw error;
            }
        }
    }
    throw new Error("Failed to get a response from the AI after multiple retries.");
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Upload API is working! Use POST to upload files.',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== UPLOAD API CALLED ===');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files are supported (JPG, PNG, etc.)' },
        { status: 400 }
      );
    }

    console.log('Processing syllabus image:', file.name, file.size, 'bytes');

    // Convert image to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const mimeType = file.type;
    const imageBase64Url = `data:${mimeType};base64,${base64Data}`;

    // Check for Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to environment variables.'
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const match = imageBase64Url.match(/^data:(.*);base64,(.*)$/);
      if (!match) {
          throw new Error(`Invalid data URL format for syllabus image.`);
      }
      const extractedMimeType = match[1];
      const data = match[2];

      const prompt = `You are an expert academic assistant. Analyze the provided syllabus image. Your task is to meticulously identify and extract all distinct units or sections. For each unit, you must extract: 1. The full title, including the unit number (e.g., "Unit 1: Introduction"). Correct any spelling mistakes you find. 2. A list of all the sub-topics, keywords, or concepts listed under that main title. Return the data as a clean JSON object that adheres to the provided schema. Ignore page numbers or any other metadata not related to topics or sub-topics.`;
      
      const imagePart = { inlineData: { mimeType: extractedMimeType, data } };
      const textPart = { text: prompt };

      const response = await generateContentWithRetry({
          model: "gemini-2.5-flash",
          contents: { parts: [textPart, imagePart] },
          config: {
              responseMimeType: "application/json",
              responseSchema: syllabusSchema
          }
      }, ai);

      const result = JSON.parse(response.text);
      
      if (!result || !result.units || !Array.isArray(result.units) || result.units.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Could not identify course units in the syllabus. Please ensure the image contains a clear syllabus structure.'
        });
      }

      return NextResponse.json({
        success: true,
        type: 'syllabus',
        syllabusData: result,
        extractionStatus: 'success',
        extractionMessage: `✅ Successfully analyzed syllabus and extracted ${result.units.length} units`
      });

    } catch (geminiError) {
      console.error('Gemini processing error:', geminiError);
      return NextResponse.json({
        success: false,
        error: `Gemini processing failed: ${(geminiError as Error).message}`
      });
    }

  } catch (error) {
    console.error('=== UPLOAD API ERROR ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Upload failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
