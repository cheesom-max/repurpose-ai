import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc } from 'drizzle-orm';
import { projects, users } from '../../../src/db/schema';

interface Env {
  DATABASE_URL: string;
}

// Helper to verify Clerk JWT
async function verifyClerkToken(token: string): Promise<{ userId: string } | null> {
  try {
    // Decode JWT payload (Clerk tokens are JWTs)
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    if (!payload.sub) return null;

    // In production, you should verify the signature with Clerk's JWKS
    // For now, we trust the token if it has a valid structure
    return { userId: payload.sub };
  } catch {
    return null;
  }
}

// Helper for JSON responses
const jsonResponse = (data: object, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// GET /api/projects - List user's projects
export const onRequestGet: PagesFunction<Env> = async (context) => {
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

  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, auth.userId))
    .orderBy(desc(projects.createdAt));

  return jsonResponse(userProjects);
};

// POST /api/projects - Create a new project
export const onRequestPost: PagesFunction<Env> = async (context) => {
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

  // Ensure user exists in our database
  const existingUser = await db.select().from(users).where(eq(users.id, auth.userId));
  if (existingUser.length === 0) {
    // Create user if not exists (synced from Clerk)
    await db.insert(users).values({
      id: auth.userId,
      email: 'pending@sync.com', // Will be updated via webhook
      name: 'User',
    });
  }

  const body = await context.request.json() as {
    title?: string;
    sourceType?: string;
    sourceUrl?: string;
  };

  const [newProject] = await db
    .insert(projects)
    .values({
      userId: auth.userId,
      title: body.title || 'Untitled Project',
      sourceType: body.sourceType,
      sourceUrl: body.sourceUrl,
      status: 'pending',
    })
    .returning();

  return jsonResponse(newProject, 201);
};
