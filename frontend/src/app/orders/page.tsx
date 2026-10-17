import { Suspense } from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function getOrders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const res = await fetch('http://127.0.0.1:8000/api/orders', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Error al cargar el historial de órdenes');
  const data = await res.json();
  return data.data || data;
}

async function OrdersList() {
  const orders = await getOrders();

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-gray-600 mb-4">Aún no tienes compras registradas en tu historial.</p>
        <Link href="/" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition">
          Ir a Comprar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order: any) => (
        <div key={order.id} className="border border-gray-200 p-6 rounded-2xl bg-white shadow-sm">
          {/* Cabecera de la Orden */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 mb-4 border-b border-gray-100 gap-2">
            <div>
              <span className="font-bold text-gray-900 text-lg">Orden #{order.id}</span>
              <p className="text-gray-500 text-xs">
                Fecha: {new Date(order.created_at).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                order.status === 'completed' || order.status === 'paid' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {order.status}
              </span>
              <div className="text-right">
                <span className="text-xs text-gray-400 block">Total Pagado</span>
                <span className="text-xl font-extrabold text-blue-600">${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Detalle de Productos */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Productos adquiridos:</h4>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item: any) => {
                const unitPrice = Number(item.price);
                const quantity = item.quantity;
                const subtotal = unitPrice * quantity;

                return (
                  <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.product?.name || `Producto ID: ${item.product_id}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        Precio unitario: ${unitPrice.toFixed(2)} × {quantity} unidad{quantity > 1 ? 'es' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <main className="container mx-auto p-6 max-w-4xl min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Historial de Compras</h1>
        <Link href="/catalog" className="text-sm font-medium text-blue-600 hover:underline">
          &larr; Volver a la tienda
        </Link>
      </div>

      <Suspense fallback={<p className="text-center py-10 text-gray-500">Cargando tu historial de compras...</p>}>
        <OrdersList />
      </Suspense>
    </main>
  );
}