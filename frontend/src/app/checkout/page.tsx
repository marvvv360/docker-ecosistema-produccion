'use client';

import { useCart } from '@/context/CartContext';
import { createOrderAction } from '@/actions/order-actions';
import { useState } from 'react';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setError('');

    try {
      const formattedItems = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      // Llamada a la Server Action que se comunica con Laravel y Stripe
      const data = await createOrderAction(formattedItems);

      if (data.checkout_url) {
        // Limpiar carrito y redirigir a la pasarela de pago de Stripe
        clearCart();
        window.location.href = data.checkout_url;
      } else {
        setError('No se pudo obtener la URL de pago de Stripe.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Finalizar Compra (Checkout)</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">{error}</div>}

      {cart.length === 0 ? (
        <p className="text-gray-600">Tu carrito está vacío.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Resumen de la Orden</h2>
          <ul className="divide-y">
            {cart.map((item) => (
              <li key={item.id} className="py-2 flex justify-between">
                <span>{item.name} (x{item.quantity})</span>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-xl font-bold pt-4 border-t">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Procesando pago con Stripe...' : 'Pagar con Stripe'}
          </button>
        </div>
      )}
    </main>
  );
}