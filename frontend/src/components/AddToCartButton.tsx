'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart(product);
    setAdded(true);

    // Regresa el texto original después de 2 segundos
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`w-full py-3 px-6 rounded-lg font-semibold transition duration-200 text-white ${
        added ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {added ? '¡Producto Agregado con Éxito!' : 'Añadir al Carrito'}
    </button>
  );
}