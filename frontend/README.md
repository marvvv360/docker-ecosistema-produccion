# Frontend E-commerce (Next.js & Laravel API)

Aplicación web de comercio electrónico desarrollada como cliente frontend utilizando Next.js (App Router) y TypeScript, diseñada para consumir de manera segura la API RESTful construida en Laravel.

---

## 🚀 Tecnologías Principales

| Componente / Tecnología | Descripción y Propósito |
| :--- | :--- |
| **Next.js 16+ (App Router)** | Framework de React optimizado para Server Components y Server Actions. |
| **TypeScript** | Tipado estricto para garantizar la integridad de los datos de la API. |
| **Tailwind CSS** | Framework de estilos utilitarios para un diseño moderno y responsivo. |
| **Gestión de Estado y Sesión** | Context API para el carrito local y cookies `httpOnly` para autenticación segura. |
| **Pasarela de Pago** | Integración con Stripe mediante redirección segura desde el servidor. |

---

## ⚙️ Requisitos Previos

Antes de ejecutar este proyecto en tu entorno local, asegúrate de tener instalado:
- Node.js (Versión 18 o superior recomendada).
- npm o yarn.
- El backend de Laravel en ejecución (disponible en [api-ecommerce-stripe](https://github.com/marvvv360/api-ecommerce-stripe.git), configurado por defecto en `http://127.0.0.1:8000`).

---

## 🔗 Integración con el Backend

Este proyecto frontend funciona en conjunto con la API RESTful desarrollada en Laravel, la cual gestiona la autenticación, el procesamiento de pagos con Stripe y la persistencia de las órdenes de compra. 

Para que la aplicación funcione correctamente, es indispensable tener activo y configurado el repositorio del backend:
- **Repositorio Backend:** [api-ecommerce-stripe](https://github.com/marvvv360/api-ecommerce-stripe.git)
- **Comunicación:** El cliente consume los endpoints protegidos mediante tokens JWT y Server Actions que envían carritos multi-producto y procesan pasarelas de pago sincronizadas.

---

## 🛠️ Instalación y Configuración

1. Clona este repositorio:
   git clone <https://github.com/marvvv360/frontend-ecommerce.git>
   cd frontend-ecommerce

2. Instala las dependencias:
   npm install

3. Configura las variables de entorno:
   Crea un archivo .env.local en la raíz del proyecto con la siguiente variable:
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

---

## 🏃‍♂️ Ejecución del Proyecto

- Modo Desarrollo:
  npm run dev
  (La aplicación estará disponible en http://localhost:3000)

- Modo Producción (Build y Start):
  npm run build
  npm run start

---

## 📂 Estructura del Proyecto

- `src/app/`: Rutas, páginas y layouts organizados con Next.js App Router (incluyendo grupos de rutas como `(auth)`, vistas dinámicas como `catalog/[id]`, y la sección de órdenes en `orders/`).
- `src/actions/`: Server Actions (`stripe-actions.ts`) para mutaciones asíncronas, procesamiento de carritos multi-producto y comunicación segura con el backend.
- `src/components/`: Componentes reutilizables de interfaz (botones interactivos, menús de usuario, elementos de cliente).
- `src/context/`: Contexto de React para la administración local del carrito de compras (`CartContext`).
- `src/middleware.ts`: Middleware de Next.js para la protección de rutas privadas (checkout e historial de compras).

---

## 📦 Características Principales

### 1. Catálogo y Detalle de Productos
- Visualización asíncrona consumiendo la API de Laravel.
- Manejo robusto de estados de carga (`loading.tsx`) y errores (`error.tsx`).

### 2. Autenticación Segura
- Registro e inicio de sesión mediante Server Actions.
- Almacenamiento seguro de tokens JWT en cookies de tipo `httpOnly`.

### 3. Carrito de Compras
- Gestión de productos mediante estado local en React.
- Sincronización automática con el almacenamiento del navegador (`localStorage`).

### 4. Checkout y Pagos Multi-Producto
- Procesamiento de órdenes mediante Server Actions (`stripe-actions.ts`) que envían arreglos estructurados de múltiples ítems (`id`, `quantity`, `price`, `name`) hacia la pasarela de pagos de Stripe y la API de Laravel.

### 5. Historial Permanente de Compras
- Vista protegida y estilizada en diseño oscuro (`/orders`) accesible desde el menú de usuario.
- Visualización detallada por orden que incluye el desglose de múltiples productos adquiridos (precio unitario, subtotal y total global) y el estado dinámico de la transacción (`pending`).
- Enlaces de navegación fluidos hacia el catálogo de la tienda.