'use client';

import { useActionState } from 'react';
import { loginAction } from '@/actions/auth-actions';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h1>
        
        {state?.error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isPending ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>
        <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}