import { sanitizeObject } from './sanitize';
import { useAuthStore } from '../store/auth';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_KEY = import.meta.env.API_KEY;

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const state = useAuthStore.getState();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  };
  if (state.user?.id) headers['x-user-id'] = state.user.id;

  const body = options.body ? JSON.stringify(sanitizeObject(JSON.parse(options.body as string))) : undefined;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers, body });

  if (!res.ok) {
    let errorText = await res.text();
    let errorObj: { error?: string } = {};
    try {
      errorObj = JSON.parse(errorText);
    } catch {
      errorObj.error = errorText;
    }

    // Handle invalid user: log out
    if (errorObj.error === 'Invalid user') {
      useAuthStore.getState().clear();
    }

    // Attach error type for illustration mapping
    throw { error: errorObj.error || 'Unknown error', status: res.status };
  }

  return res.json();
}