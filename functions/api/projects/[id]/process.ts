import { createClient } from '@supabase/supabase-js';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { id } = context.params;

  const supabase = createClient(
    context.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    context.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
  );

  // Get project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (projectError || !project) {
    return new Response(JSON.stringify({ error: 'Project not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Update status to processing
  await supabase
    .from('projects')
    .update({ status: 'processing', updated_at: new Date().toISOString() })
    .eq('id', id);

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
      { start_time: 45, end_time: 90, title: 'Key Insight: 5-10 Pieces Per Video', score: 0.95 },
      { start_time: 90, end_time: 150, title: 'Practical Tip: Timestamp Best Moments', score: 0.88 },
      { start_time: 15, end_time: 45, title: 'Content Goldmine Concept', score: 0.82 },
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
        title: 'Content Repurposing Guide',
        content: `# Content Repurposing Guide\n\n## Why Repurpose?\n\nOne video = 5-10 pieces of content.\n\n## Tips\n\n- Note timestamps of best moments\n- Extract key quotes\n- Create short clips`,
      },
      {
        project_id: id,
        type: 'twitter',
        content: `🧵 One video = 10+ pieces of content\n\n1/ Long-form video = goldmine of content\n\n2/ The 5-10 Rule: Every video becomes 5-10 pieces\n\n3/ Pro tip: Note timestamps of best moments\n\n🔁 RT to help creators!`,
      },
      {
        project_id: id,
        type: 'linkedin',
        content: `I discovered something that changed my content strategy.\n\nOne 1-hour video = 10 pieces of content:\n• 5 clips\n• 1 blog\n• 1 thread\n• 3 posts\n\nThe secret? Content repurposing.\n\n#ContentMarketing`,
      },
    ];
    await supabase.from('contents').insert(contentsToInsert);

    return new Response(JSON.stringify({ message: 'Processing completed', job_id: id }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    await supabase
      .from('projects')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', id);

    return new Response(JSON.stringify({ error: 'Processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
