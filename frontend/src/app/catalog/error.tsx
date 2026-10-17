'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-xl font-bold text-red-600 mb-2">¡Ha ocurrido un error en el catálogo!</h2>
      <p className="text-gray-600 mb-4">{error.message || 'No pudimos conectar con la API.'}</p>
      <button
        onClick={() => reset()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}