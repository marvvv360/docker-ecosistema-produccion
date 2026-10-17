'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

const data = await res.json();
console.log('Respuesta del login de Laravel:', data);

// Agregamos data.authorisation?.token que es como lo envía Laravel
const token = data.authorisation?.token || data.access_token || data.token || data.data?.token || data.data?.access_token;

if (!res.ok || !token) {
  return { error: data.message || 'Credenciales inválidas o token no encontrado' };
}

// Guardar el token en cookie httpOnly
const cookieStore = await cookies();
cookieStore.set({
  name: 'token',
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
});

  } catch (err) {
    return { error: 'No se pudo conectar con el servidor de autenticación.' };
  }

  redirect('/catalog');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  // Borramos la cookie del token
  cookieStore.delete('token');
}