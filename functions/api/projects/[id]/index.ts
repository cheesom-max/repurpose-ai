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

// GET /api/projects/:id - Get project with clips and contents
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { id } = context.params;

  if (!context.env.DATABASE_URL) {
    return jsonResponse({ error: 'Server configuration error' }, 500);
  }

  const authHeader = context.request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);
  const auth = await verifyClerkToken(token);
  if (!auth) {
    return jsonResponse({ error: 'Invalid token' }, 401);
  }

  const sql = neon(context.env.DATABASE_URL);
  const db = drizzle(sql);

  // Get project
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id as string), eq(projects.userId, auth.userId)));

  if (!project) {
    return jsonResponse({ error: 'Project not found' }, 404);
  }

  // Get clips and contents if completed
  let projectClips: typeof clips.$inferSelect[] = [];
  let projectContents: typeof contents.$inferSelect[] = [];

  if (project.status === 'completed') {
    projectClips = await db.select().from(clips).where(eq(clips.projectId, id as string));
    projectContents = await db.select().from(contents).where(eq(contents.projectId, id as string));
  }

  return jsonResponse({
    ...project,
    clips: projectClips,
    contents: projectContents,
  });
};
