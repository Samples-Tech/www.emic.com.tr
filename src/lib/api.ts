export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function api(path: string, init?: RequestInit) {
  const res = await fetch(API_BASE + path, { 
    credentials: 'include', 
    headers: { 'Content-Type': 'application/json' }, 
    ...init 
  });
  
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// 2FA API functions
export async function setup2FA() {
  return api('/auth/2fa/setup', { method: 'POST' });
}

export async function enable2FA(token: string) {
  return api('/auth/2fa/enable', { 
    method: 'POST', 
    body: JSON.stringify({ token }) 
  });
}

export async function disable2FA() {
  return api('/auth/2fa/disable', { method: 'POST' });
}