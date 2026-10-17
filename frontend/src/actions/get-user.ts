'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    console.log('No se encontró el token en las cookies.');
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.log('Error en la respuesta de Laravel:', res.status);
      return null;
    }

    const data = await res.json();
    console.log('Datos del usuario obtenidos de Laravel:', data);
    
    // Retornamos el objeto usuario ya sea que esté en data.data o directamente en data
    return data.data || data; 
  } catch (error) {
    console.error('Excepción al conectar con Laravel:', error);
    return null;
  }
}