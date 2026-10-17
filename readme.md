# Ingeniería de Imágenes Eficientes: Refactorización Multi-stage y Optimización de Capas en Docker

## 1. Descripción General del Proyecto
Este repositorio contiene la arquitectura de contenerización para producción de un ecosistema de microservicios compuesto por tres componentes principales:
- **Frontend**: Aplicación en Next.js 16+ con App Router y soporte para TypeScript.
- **Backend**: API REST en Laravel (PHP 8.2+) orquestada junto con Nginx como proxy inverso a través de Supervisor.
- **Base de Datos**: Instancia oficial de MySQL 8.0 con almacenamiento persistente.

El objetivo principal es aplicar técnicas avanzadas de **builds multi-stage** y optimización de capas de Docker para lograr imágenes ligeras, seguras, reproducibles y de rápido despliegue.

---

## 2. Diagrama y Explicación de la Arquitectura de Contenedores

### Diagrama de Arquitectura
```text
  [ Cliente / Navegador Web ]
               |
               +-----------------------+
               |                       |
               v                       v
    +--------------------+   +--------------------+
    |  Frontend Service  |   |   Backend Service  |
    |   (Next.js 16+)    |   |  (Laravel + Nginx) |
    |   Puerto: 3000     |   |    Puerto: 8000    |
    +--------------------+   +---------+----------+
                                       |
                                       v (Red Interna: app_network)
                             +--------------------+
                             |  Database Service  |
                             |   (MySQL 8.0)      |
                             |   Puerto: 3306     |
                             +--------------------+
```

### Explicación de Componentes
1. **Frontend (`app_nextjs_frontend`)**: Expuesto en el puerto `3000`. Ejecuta la versión optimizada en modo *standalone* de Next.js mediante un usuario de sistema no privilegiado (`nextjs`).
2. **Backend (`app_laravel_backend`)**: Expuesto en el puerto `8000`. Integra Nginx y PHP-FPM bajo un mismo contenedor gestionado por Supervisor para procesar las peticiones HTTP y comunicarse con Laravel.
3. **Database (`app_mysql_db`)**: Servicio interno aislado en el puerto `3306`. Mantiene persistencia de datos montada en un volumen de Docker (`db_data`) y no expone su puerto directamente al host exterior por motivos de seguridad.

---

## 3. Decisiones Técnicas y Optimización en Dockerfiles

### Frontend (`frontend/Dockerfile`)
- **Estrategia Multi-stage (3 Etapas)**:
  1. `deps`: Instala únicamente las dependencias necesarias leyendo `package.json` y `package-lock.json`.
  2. `builder`: Compila el proyecto Next.js deshabilitando la telemetría y utilizando los módulos previamente cacheados.
  3. `runner`: Copia exclusivamente los archivos generados en la carpeta `.next/standalone` y `.next/static`.
- **Seguridad**: Se crea un usuario sin privilegios `nextjs:nodejs` (UID/GID 1001) para evitar la ejecución del proceso Node.js como `root`.
- **Resultado**: Reducción del tamaño de la imagen final a una fracción comparada con la imagen estándar de Node.js.

### Backend (`backend/Dockerfile`)
- **Estrategia Multi-stage (2 Etapas)**:
  1. `composer-stage`: Descarga las dependencias PHP en entorno estricto de producción con los flags `--no-dev`, `--optimize-autoloader` y `--no-scripts`.
  2. `production`: Basada en `php:8.2-fpm-alpine`, instala las extensiones del sistema requeridas (`pdo_mysql`, `gd`, `zip`, etc.) y copia únicamente la carpeta empaquetada.
- **Orquestación Interna**: Uso de **Supervisor** para mantener activos simultáneamente los procesos de `php-fpm` y `nginx`.
- **Permisos de Almacenamiento**: Configuración explícita de permisos sobre `storage/` y `bootstrap/cache/` asignando la propiedad al usuario web de Linux (`www-data`).

---

## 4. Instrucciones para Ejecutar el Ecosistema

### Prerrequisitos
- Docker Engine v20.10+ instalado.
- Docker Compose v2.0+ disponible.

### Paso 1: Configurar Variables de Entorno
Copia el archivo de plantilla `.env.example` para crear la configuración local del orquestador:
```bash
cp .env.example .env
```

### Paso 2: Desplegar los Contenedores
Ejecuta el siguiente comando en la raíz del proyecto para construir las imágenes y levantar el ecosistema en segundo plano:
```bash
docker compose up --build -d
```

### Paso 3: Inicializar la Base de Datos (Laravel)
Genera la clave de aplicación y ejecuta las migraciones de base de datos dentro del contenedor en ejecución:
```bash
# Generar clave de encriptación de Laravel
docker compose exec backend php artisan key:generate

# Ejecutar las migraciones
docker compose exec backend php artisan migrate --force
```

### Paso 4: Verificación de Servicios
- **Frontend (Next.js)**: Acceder a `http://localhost:3000`
- **Backend API (Laravel)**: Acceder a `http://localhost:8000/api`

---

## 5. Comandos Útiles para Mantenimiento

- **Ver logs en tiempo real**:
  ```bash
  docker compose logs -f
  ```
- **Detener y remover contenedores**:
  ```bash
  docker compose down
  ```
- **Detener el entorno eliminando volúmenes de datos**:
  ```bash
  docker compose down -v
  ```