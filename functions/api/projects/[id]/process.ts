import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, and } from 'drizzle-orm';
import { projects, clips, contents } from '../../../../src/db/schema';

interface Env {
  DATABASE_URL: string;
}

// Helper to verify Clerk JWT
async function verifyClerkToken(token: string): Promise<{ userId: string } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.sub) return null;
    return { userId: payload.sub };
  } catch {
    return null;
  }
}

const jsonResponse = (data: object, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { id } = context.params;

  // Validate environment variables
  if (!context.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL environment variable');
    return jsonResponse({ error: 'Server configuration error' }, 500);
  }

  // Extract and validate Authorization header
  const authHeader = context.request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Missing or invalid Authorization header' }, 401);
  }

  const token = authHeader.slice(7);
  const auth = await verifyClerkToken(token);
  if (!auth) {
    return jsonResponse({ error: 'Invalid or expired token' }, 401);
  }

  const sql = neon(context.env.DATABASE_URL);
  const db = drizzle(sql);

  // Get project and verify ownership
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id as string), eq(projects.userId, auth.userId)));

  if (!project) {
    return jsonResponse({ error: 'Project not found or access denied' }, 404);
  }

  // Update status to processing
  await db
    .update(projects)
    .set({ status: 'processing', updatedAt: new Date() })
    .where(eq(projects.id, id as string));

  try {
    // Mock transcript
    const mockTranscript = {
      text: `Welcome to this video about content repurposing!

When you create a long-form video, you're sitting on a goldmine of potential content.

The key insight: one piece of content should never stay as just one piece. Aim for 5-10 different pieces from every video.

Practical tip: after recording, note down timestamps of your best moments.

Content repurposing is essential for modern content creators.`,
      segments: [
        { start: 0, end: 15, text: "Welcome to this video about content repurposing!" },
        { start: 15, end: 45, text: "When you create a long-form video, you're sitting on a goldmine." },
        { start: 45, end: 90, text: "The key insight: aim for 5-10 pieces from every video." },
        { start: 90, end: 150, text: "Practical tip: note timestamps of your best moments." },
        { start: 150, end: 180, text: "Content repurposing is essential for creators." },
      ],
    };

    // Mock highlights
    const mockHighlights = [
      { startTime: 45, endTime: 90, title: 'Key Insight: 5-10 Pieces Per Video', score: '0.95' },
      { startTime: 90, endTime: 150, title: 'Practical Tip: Timestamp Best Moments', score: '0.88' },
      { startTime: 15, endTime: 45, title: 'Content Goldmine Concept', score: '0.82' },
    ];

    // Update project
    await db
      .update(projects)
      .set({
        transcript: mockTranscript,
        highlights: mockHighlights,
        duration: 180,
        status: 'completed',
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id as string));

    // Create clips
    await db.insert(clips).values(
      mockHighlights.map((h) => ({
        projectId: id as string,
        title: h.title,
        startTime: h.startTime,
        endTime: h.endTime,
        score: h.score,
        status: 'completed',
      }))
    );

    // Create content
    await db.insert(contents).values([
      {
        projectId: id as string,
        type: 'blog',
        title: 'Content Repurposing Guide',
        content: `# Content Repurposing Guide\n\n## Why Repurpose?\n\nOne video = 5-10 pieces of content.\n\n## Tips\n\n- Note timestamps of best moments\n- Extract key quotes\n- Create short clips`,
      },
      {
        projectId: id as string,
        type: 'twitter',
        content: `One video = 10+ pieces of content\n\n1/ Long-form video = goldmine of content\n\n2/ The 5-10 Rule: Every video becomes 5-10 pieces\n\n3/ Pro tip: Note timestamps of best moments`,
      },
      {
        projectId: id as string,
        type: 'linkedin',
        content: `I discovered something that changed my content strategy.\n\nOne 1-hour video = 10 pieces of content:\n- 5 clips\n- 1 blog\n- 1 thread\n- 3 posts\n\nThe secret? Content repurposing.\n\n#ContentMarketing`,
      },
    ]);

    return jsonResponse({ message: 'Processing completed', job_id: id });
  } catch (error) {
    console.error('Processing error:', error);
    await db
      .update(projects)
      .set({ status: 'failed', updatedAt: new Date() })
      .where(eq(projects.id, id as string));

    return jsonResponse({ error: 'Processing failed' }, 500);
  }
};
