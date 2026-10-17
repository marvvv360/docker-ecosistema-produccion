import Link from 'next/link';

// Interfaz para tipar los productos que vienen de Laravel
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
}

// Función para obtener los productos desde la API de Laravel
async function getProducts(): Promise<Product[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    const res = await fetch(`${apiUrl}/products`, {
      cache: 'no-store', // Evita caché estática para ver los datos en tiempo real
    });

    if (!res.ok) {
      throw new Error('Error al obtener los productos del servidor.');
    }

    const data = await res.json();
    // Dependiendo de cómo devuelva Laravel la colección (ej. data.data o directamente data)
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Error de conexión con la API:', error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Cabecera de la tienda */}
      <header className="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Mi E-commerce 🛍️
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Encuentra los mejores productos directo desde nuestra API de Laravel.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-4">
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 border-indigo-600 shadow-sm"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/orders"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
          >
            Mis Órdenes
          </Link>
        </div>
      </header>

      {/* Contenido Principal: Listado de Productos */}
      <main className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Catálogo de Productos</h2>

        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">
              No hay productos disponibles en este momento o la API de Laravel no está encendida.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Asegúrate de ejecutar <code className="bg-gray-100 px-2 py-1 rounded">php artisan serve</code> en tu backend.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between transition hover:shadow-lg"
              >
                <div>
                  <div className="h-48 bg-gray-200 w-full flex items-center justify-center text-gray-400">
                    {/* Imagen de respaldo si no hay URL */}
                    <span>Sin imagen</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {product.description || 'Sin descripción disponible.'}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-indigo-600">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <Link
                    href={`/catalog/${product.id}`}
                    className="w-full block text-center bg-gray-900 text-white text-sm font-medium py-2 px-4 rounded hover:bg-gray-800 transition"
                  >
                    Ver Detalle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}