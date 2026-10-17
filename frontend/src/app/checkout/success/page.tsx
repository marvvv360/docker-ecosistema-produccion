'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // Limpiamos el carrito local tras completar la compra con éxito
    localStorage.removeItem('cart'); 
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50 text-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h1>
        <p className="text-gray-600 mb-6">
          Tu orden ha sido procesada correctamente a través de Stripe. Gracias por tu compra.
        </p>
        <Link
          href="/products" // Reemplaza '/products' por la ruta exacta de tu catálogo si es distinta (ej. /shop o /catalogo)
          className="inline-block w-full bg-blue-600 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          Volver al Catálogo
        </Link>
      </div>
    </div>
  );
}