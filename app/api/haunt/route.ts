import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'No text provided' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'AI service not configured' },
        { status: 500 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenAI({ apiKey });
    
    const prompt = `${text}

Use proper markdown formatting with clear headings and structure. Make it comprehensive and educational.`;

    console.log('Generating content with Gemini...');
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    
    const lessonPlan = result.text;

    return NextResponse.json({
      success: true,
      hauntedText: lessonPlan, // Generated content (overview/in-depth/takeaways)
      processedChunks: 1,
    });
  } catch (error) {
    console.error('Lesson plan creation error:', error);

    if (error instanceof Error) {
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { success: false, error: 'AI service rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Content generation failed. Please try again later.' },
      { status: 500 }
    );
  }
}
