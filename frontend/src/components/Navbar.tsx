'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/actions/get-user';
import { logoutAction } from '@/actions/auth-actions';

export default function Navbar() {
  const { totalItems } = useCart();
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    }
    fetchUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    setUser(null);
    setDropdownOpen(false);
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50 px-6 py-4 flex justify-between items-center text-white">
      <div className="flex items-center gap-6">
        <Link href="/catalog" className="text-xl font-bold tracking-wider text-indigo-400">
          E-Commerce Store
        </Link>
        <Link href="/catalog" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
          Catálogo
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {/* Carrito */}
        <Link href="/cart" className="relative flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
          <span>🛒 Carrito</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Menú de Usuario */}
        <div className="relative border-l border-gray-700 pl-6" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-600 group-hover:bg-indigo-500 flex items-center justify-center font-bold text-sm text-white transition-colors shadow">
              {user ? user.name?.charAt(0).toUpperCase() || '👤' : '👤'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-medium text-gray-200">
                {user?.name || user?.user?.name || 'Mi Cuenta'}
              </span>
              <span className="text-xs text-gray-400">
                {user?.name || user?.user?.name ? 'Sesión activa' : 'Acceder / Registrarse'}
              </span>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-2 z-50 text-gray-200">
              {user ? (
                <>
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-xs text-gray-400">Conectado como</p>
                    <p className="text-sm font-bold text-white truncate">
                      {user?.email || user?.user?.email || 'Correo no disponible'}
                    </p>
                  </div>
                  {/* Ejemplo dentro de tu menú desplegable */}
                  <div className="py-1">
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                      >
                      Historial de Compras
                      </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors mt-1"
                  >
                    🚪 Cerrar sesión
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-white transition-colors"
                >
                  🔑 Iniciar Sesión
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}