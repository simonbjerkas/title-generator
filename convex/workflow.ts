import { v } from 'convex/values';
import { internal } from './_generated/api';
import { workflow } from '.';
import { mutation } from './_generated/server';

export const kickoffTitleGenerationWorkflow = mutation({
  args: { url: v.string() },
  handler: async (ctx, { url }) => {
    await workflow.start(ctx, internal.workflow.generateTitleWorkflow, { url });
  },
});

export const generateTitleWorkflow = workflow.define({
  args: { url: v.string() },
  handler: async (step, { url }): Promise<string> => {
    const transcript = await step.runAction(
      internal.transcripts.getYouTubeTranscript,
      { url },
      { retry: { maxAttempts: 3, initialBackoffMs: 100, base: 2 } }
    );
    const summary = await step.runAction(
      internal.transcripts.summarizeTranscript,
      { transcript }
    );

    return summary;
  },
});
