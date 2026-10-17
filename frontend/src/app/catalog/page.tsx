import { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

async function getProducts() {
  const res = await fetch('http://127.0.0.1:8000/api/products', {
    cache: 'no-store', // 0 usa revalidate según prefieras
  });
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
}

async function ProductList() {
  const data = await getProducts();
  const products = data.data || data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {products.map((product: any) => (
        <div key={product.id} className="border border-gray-700 p-4 rounded-lg shadow-sm bg-gray-800 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2">{product.name}</h2>
            <p className="text-indigo-400 font-semibold mb-4">${product.price}</p>
          </div>
          <Link
            href={`/catalog/${product.id}`}
            className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700 transition-colors"
          >
            Ver Detalle
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Catálogo de Productos</h1>
        <Suspense fallback={<p className="text-center py-10 text-gray-400">Cargando productos de forma asíncrona...</p>}>
          <ProductList />
        </Suspense>
      </main>
    </div>
  );
}