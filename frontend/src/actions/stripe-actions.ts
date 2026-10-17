'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function createStripeCheckoutAction(items: { product_id: number; quantity: number; price: number; name: string }[]) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('No estás autenticado.');
  }

  try {
    // Calculamos el monto total sumando (precio * cantidad) de cada producto del carrito
    const amount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Creamos un nombre descriptivo o agrupado para el producto/orden en Stripe
    const product_name = items.length === 1 
      ? items[0].name 
      : `Compra de ${items.reduce((acc, item) => acc + item.quantity, 0)} productos en E-Commerce`;

    const res = await fetch(`${API_URL}/payment/create-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: items.map(item => ({
            id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
        })),
    amount,
    product_name
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Error al iniciar la sesión de pago con Stripe.');
    }

    // Nota: Tu controlador de Laravel devuelve 'session_url'
    return data;
  } catch (error: any) {
    console.error('Error en Stripe Checkout Action:', error);
    throw new Error(error.message || 'No se pudo conectar con la pasarela de pagos.');
  }
}