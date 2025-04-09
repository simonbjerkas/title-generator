import { v } from 'convex/values';
import { internalAction } from './_generated/server';

import { Innertube } from 'youtubei.js/web';
import { GoogleGenAI } from '@google/genai';

export const getYouTubeTranscript = internalAction({
  args: {
    url: v.string(),
  },
  handler: async (_, { url }) => {
    const videoId = url.split('v=')[1];
    const youtube = await Innertube.create({
      lang: 'en',
      location: 'US',
      retrieve_player: false,
    });
    const info = await youtube.getInfo(videoId);
    const { transcript } = await info.getTranscript();
    const transcriptText = transcript.content?.body?.initial_segments
      .map((segment) => segment.snippet.text ?? '')
      .join(' ');
    return transcriptText;
  },
});

export const summarizeTranscript = internalAction({
  args: {
    transcript: v.string(),
  },
  handler: async (_, { transcript }) => {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Summarize the following youtube transcript: ${transcript}`,
      config: {
        systemInstruction: [
          'You are a helpful assistant that summarizes youtube transcripts.',
          'Your summary should be a few paragraphs long that captures the main points of the video.',
          'Also provide alot of keywords that I can use to improve my search engine optimization.',
          'Do not include any other text than the summary.',
          'Please return your response in markdown format.',
        ],
      },
    });
    return response.text;
  },
});
