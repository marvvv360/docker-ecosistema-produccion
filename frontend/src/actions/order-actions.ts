'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function createOrderAction(items: { product_id: number; quantity: number }[]) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('No estás autenticado.');
  }

  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Error al crear la orden en el servidor');
  }

  revalidatePath('/orders');
  return data;
}