import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createClient } from '@supabase/supabase-js';

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS
app.use('/api/*', cors());

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }));

// Process project
app.post('/api/projects/:id/process', async (c) => {
  const id = c.req.param('id');

  // Validate environment variables
  if (!c.env.SUPABASE_URL || !c.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase environment variables');
    return c.json({ error: 'Server configuration error' }, 500);
  }

  // Extract and validate Authorization header
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid Authorization header' }, 401);
  }

  const token = authHeader.slice(7);

  // Create Supabase client for auth verification
  const supabaseAuth = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_ANON_KEY || c.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Verify user token
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

  if (authError || !user) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  // Create admin client for database operations
  const supabase = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Get project and verify ownership
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (projectError || !project) {
    return c.json({ error: 'Project not found' }, 404);
  }

  // Verify project ownership
  if (project.user_id !== user.id) {
    return c.json({ error: 'Access denied: You do not own this project' }, 403);
  }

  // Update status to processing
  await supabase
    .from('projects')
    .update({ status: 'processing', updated_at: new Date().toISOString() })
    .eq('id', id);

  try {
    // Mock transcript (in production, call Whisper API)
    const mockTranscript = {
      text: `Welcome to this amazing video! Today we're discussing content repurposing strategies.

First, let's talk about why repurposing matters. When you create a long-form video, you're sitting on a goldmine of potential content.

The key insight: one piece of content should never stay as just one piece. Aim for 5-10 different pieces from every video.

Practical tip: after recording, note down timestamps of your best moments - surprising statistics, personal stories, key takeaways.

In conclusion, content repurposing is essential for modern content creators.`,
      segments: [
        { start: 0, end: 15, text: "Welcome to this amazing video!" },
        { start: 15, end: 45, text: "First, let's talk about why repurposing matters." },
        { start: 45, end: 90, text: "The key insight: one piece of content should never stay as just one piece." },
        { start: 90, end: 150, text: "Practical tip: note down timestamps of your best moments." },
        { start: 150, end: 180, text: "Content repurposing is essential for modern content creators." },
      ],
    };

    // Mock highlights
    const mockHighlights = [
      { start_time: 45, end_time: 90, title: 'Key Insight: 5-10 Pieces Per Video', score: 0.95, reason: 'Strong actionable advice' },
      { start_time: 90, end_time: 150, title: 'Practical Tip: Timestamp Best Moments', score: 0.88, reason: 'Clear implementation steps' },
      { start_time: 15, end_time: 45, title: 'Why Repurposing Matters', score: 0.82, reason: 'Strong opening hook' },
    ];

    // Update project
    await supabase
      .from('projects')
      .update({
        transcript: mockTranscript,
        highlights: mockHighlights,
        duration: 180,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    // Create clips
    const clipsToInsert = mockHighlights.map((h) => ({
      project_id: id,
      title: h.title,
      start_time: h.start_time,
      end_time: h.end_time,
      score: h.score,
      status: 'completed',
    }));
    await supabase.from('clips').insert(clipsToInsert);

    // Create content
    const contentsToInsert = [
      {
        project_id: id,
        type: 'blog',
        title: 'The Ultimate Guide to Content Repurposing',
        content: `# The Ultimate Guide to Content Repurposing

## Why Repurpose Content?

When you create a long-form video, you're sitting on a goldmine of potential content.

## The 5-10 Rule

One piece of content should never stay as just one piece. Aim for 5-10 different pieces from every video.

## Practical Tips

After recording, note down timestamps of your best moments:
- Surprising statistics
- Personal stories
- Key takeaways

## Conclusion

Content repurposing is essential for modern content creators who want to maximize their reach.`,
      },
      {
        project_id: id,
        type: 'twitter',
        title: 'Content Repurposing Thread',
        content: `🧵 One video = 10+ pieces of content

1/ When you create a long-form video, you're sitting on a goldmine of potential content.

2/ The 5-10 Rule: Every piece should become at least 5-10 different pieces.

3/ Pro tip: After recording, note timestamps of your best moments.

4/ Content repurposing isn't optional anymore. It's essential.

🔁 RT to help other creators!`,
      },
      {
        project_id: id,
        type: 'linkedin',
        title: 'Content Strategy Post',
        content: `I discovered something that changed my content strategy forever.

When I create a 1-hour video, I'm actually creating:
• 5 short clips
• 1 blog post
• 1 Twitter thread
• 3 LinkedIn posts

That's 10 pieces of content from ONE recording session.

The secret? Intentional content repurposing.

What's your content repurposing strategy?

#ContentMarketing #CreatorEconomy`,
      },
    ];
    await supabase.from('contents').insert(contentsToInsert);

    return c.json({ message: 'Processing completed', job_id: id });
  } catch (error) {
    await supabase
      .from('projects')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', id);

    return c.json({ error: 'Processing failed' }, 500);
  }
});

export default app;
