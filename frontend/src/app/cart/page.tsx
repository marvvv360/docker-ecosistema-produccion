'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/actions/get-user';
import { createStripeCheckoutAction } from '@/actions/stripe-actions';

export default function CartPage() {
  const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const router = useRouter();

 const handleCheckout = async () => {
  // Verificamos si hay un usuario autenticado mediante la cookie del servidor
  const user = await getCurrentUser();
  
  if (!user) {
      // Damos una opción clara en lugar de forzar un salto inmediato
      const deseaIniciarSesion = window.confirm(
        'No has iniciado sesión. Para continuar con tu compra de forma segura, ¿deseas ir a la página de inicio de sesión?'
      );
      
      if (deseaIniciarSesion) {
        window.location.href = '/login';
      }
      return; // Detenemos el flujo aquí para que el usuario decida
    }
  
  try {
    // Mapeamos el carrito incluyendo los campos que necesita la acción
    const itemsForCheckout = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    }));

    const response = await createStripeCheckoutAction(itemsForCheckout);

    // Tu controlador de Laravel responde con 'session_url'
    if (response.session_url) {
      clearCart();
      window.location.href = response.session_url;
    } else {
      throw new Error('No se recibió una URL de redirección válida de Stripe.');
    }
  } catch (error: any) {
    console.error(error);
    alert(error.message || 'Hubo un error al procesar el pago.');
  }
};

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold mb-8">Tu Carrito de Compras</h1>

        {cart.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 text-center">
            <p className="text-gray-400 mb-6">Tu carrito está actualmente vacío.</p>
            <Link
              href="/catalog"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden mb-8">
              <div className="divide-y divide-gray-700">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">
                        Precio unitario: ${Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Control de cantidad */}
                      <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-500 font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-500 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-lg font-semibold text-white w-20 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors ml-4"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-850 flex justify-between items-center border-t border-gray-700">
                <button
                  onClick={clearCart}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Vaciar carrito
                </button>
                <div className="text-xl font-bold">
                  Subtotal: <span className="text-indigo-400">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link
                href="/catalog"
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
              >
                &larr; Continuar comprando
              </Link>
              <button
                onClick={handleCheckout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition-colors"
              >
                Proceder al Pago
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}