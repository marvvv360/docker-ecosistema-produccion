import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton'; // Componente de cliente para el carrito
import Navbar from '@/components/Navbar';

async function getProduct(id: string) {
  const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || data;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);
  if (!product) {
    notFound();
  }

return (
    <>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main className="container mx-auto p-6 max-w-4xl mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-sm border">
            <div>
              <div className="h-80 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                {/* Imagen del producto o placeholder */}
                <span>Imagen del Producto</span>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-gray-900">{product.name}</h1>
                <p className="text-2xl text-blue-600 font-semibold mb-4">${product.price}</p>
                <p className="text-gray-600 mb-6">{product.description || 'Sin descripción disponible.'}</p>
              </div>
              
              {/* Componente interactivo para manejar el carrito local */}
              <AddToCartButton product={product} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}