import type { APIRoute } from 'astro';
import { createClient } from '@sanity/client';

export const prerender = false;

const writeClient = createClient({
  projectId: 'dq09sslz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: import.meta.env.SANITY_WRITE_TOKEN,
});

type Payload = {
  name?: unknown;
  website?: unknown;
  services?: unknown;
  city?: unknown;
  email?: unknown;
  _gotcha?: unknown;
};

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export const POST: APIRoute = async ({ request }) => {
  let body: Payload;
  const contentType = request.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      body = (await request.json()) as Payload;
    } else {
      const fd = await request.formData();
      body = Object.fromEntries(fd.entries()) as Payload;
    }
  } catch {
    return json({ ok: false, error: 'Invalid request body' }, 400);
  }

  // Honeypot — silently succeed so bots don't learn anything.
  if (asString(body._gotcha)) {
    return json({ ok: true }, 200);
  }

  const name = asString(body.name);
  const website = asString(body.website);
  const services = asString(body.services);
  const city = asString(body.city);
  const email = asString(body.email);

  const errors: Record<string, string> = {};
  if (!name || name.length > 200) errors.name = 'Моля въведете валидно име.';
  if (!website || !isValidHttpUrl(website)) errors.website = 'Моля въведете валиден URL.';
  if (!services || services.length > 500) errors.services = 'Моля опишете услугите.';
  if (!city || city.length > 100) errors.city = 'Моля въведете град.';
  if (email && !looksLikeEmail(email)) errors.email = 'Моля въведете валиден имейл.';

  if (Object.keys(errors).length > 0) {
    return json({ ok: false, errors }, 400);
  }

  if (!import.meta.env.SANITY_WRITE_TOKEN) {
    console.error('[submit-agency] SANITY_WRITE_TOKEN is not set');
    return json({ ok: false, error: 'Server misconfigured' }, 500);
  }

  try {
    await writeClient.create({
      _type: 'submission',
      name,
      website,
      services,
      city,
      ...(email ? { email } : {}),
      submittedAt: new Date().toISOString(),
      status: 'pending',
    });
    return json({ ok: true }, 200);
  } catch (err) {
    console.error('[submit-agency] Sanity write failed', err);
    return json({ ok: false, error: 'Server error' }, 500);
  }
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
