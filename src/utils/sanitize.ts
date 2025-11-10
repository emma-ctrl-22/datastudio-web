import DOMPurify from 'dompurify';
import { z } from 'zod';

export function sanitizeString(input: string): string {
  const trimmed = input.trim();
  const safe = DOMPurify.sanitize(trimmed, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return safe;
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') out[k] = sanitizeString(v);
    else out[k] = v;
  }
  return out as T;
}

export function validateWithSchema<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data);
}


