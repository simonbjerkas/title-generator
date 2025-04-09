import { v } from 'convex/values';
import { internalAction } from './_generated/server';
import { Type } from '@google/genai';

import { ai } from '.';

export const storyTellingAgent = internalAction({
  args: { summary: v.string() },
  handler: async (_, { summary }) => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Generate 10 different titles for a youtube video based on the following summary: ${summary}`,
      config: {
        systemInstruction: [
          'You are an expert YouTube title creator specializing in personal journey narratives.',
          'Your titles should be a few words long that captures the main points of the video.',
          'Use powerful transformational language to captivate the audience.',
          'Use emotional language to connect with the audience.',
          'Use the keywords provided in the summary to create titles that are SEO friendly.',
        ],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });
    if (!response.text) {
      throw new Error('No response from AI');
    }
    return JSON.parse(response.text) as string[];
  },
});

export const t3Agent = internalAction({
  args: { summary: v.string() },
  handler: async (_, { summary }) => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Generate 10 different titles for a youtube video based on the following summary: ${summary}`,
      config: {
        systemInstruction: [
          'You are an expert YouTube title creator, specializing in engaging titles for a tech audience, particularly web development (React, Next.js, TypeScript) and AI.',
          'Analyze the provided video summary to identify key technologies, concepts, and the core message.',
          'Generate titles that are typically between 30 and 80 characters long.',
          'Emulate the style of the provided examples: often opinionated, sometimes controversial, questioning, or presenting a strong take.',
          'Use impactful language and emotional hooks like "biggest", "craziest", "problem", "real cost", "game changer", "wrong", "hyped", "needs to stop".',
          'Incorporate relevant technical keywords from the summary for SEO (e.g., Next.js, React, AI, AWS, specific libraries).',
          'Use parentheses strategically for clarification, adding context, or listing technologies, like "(explanation)" or "(Next.js, TypeScript, etc)".',
          'Employ capitalization effectively: primarily Title Case or Sentence case, but use ALL CAPS sparingly for emphasis on key words (e.g., "FULL", "REAL").',
          'Structure titles in formats like: "Why is X so Y?", "The Problem With X", "X Tutorial (From A to B)", "My Thoughts On X", "Is X really Z?", "X vs Y".',
          'Focus on themes common in tech YouTube: tutorials, stack choices, performance issues, cost analyses, new technology hype/criticism, personal journeys/opinions, industry commentary.',
          'Ensure the titles accurately reflect the video summary while maximizing click-through potential.',
        ],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });
    if (!response.text) {
      throw new Error('No response from AI');
    }
    return JSON.parse(response.text) as string[];
  },
});
