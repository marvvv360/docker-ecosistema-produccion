# ==========================================
# ETAPA 1: Construcción de Dependencias (composer)
# ==========================================
FROM composer:2 AS composer-stage
WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

COPY . .
RUN composer dump-autoload --optimize --no-scripts

# ==========================================
# ETAPA 2: Imagen Final para Producción
# ==========================================
FROM php:8.2-fpm-alpine AS production

# Instalar dependencias del sistema y supervisor/nginx
RUN apk add --no-cache \
    nginx \
    supervisor \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    oniguruma-dev \
    icu-dev \
    libxml2-dev

# Instalar extensiones PHP requeridas (pdo_mysql, mbstring, xml, ctype, json, etc.)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        xml

WORKDIR /var/www

# Copiar el código del backend e instalar dependencias desde la etapa anterior
COPY --from=composer-stage /app /var/www

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/http.d/default.conf

# Crear directorios de logs, storage y bootstrap/cache si no existen y asignar permisos
RUN mkdir -p /var/log/nginx /var/log/supervisor \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/views \
    /var/www/storage/framework/cache \
    /var/www/storage/logs \
    /var/www/bootstrap/cache && \
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Configuración básica de Supervisor para ejecutar Nginx y PHP-FPM simultáneamente
RUN echo '[supervisord]' > /etc/supervisord.conf && \
    echo 'nodaemon=true' >> /etc/supervisord.conf && \
    echo '[program:php-fpm]' >> /etc/supervisord.conf && \
    echo 'command=php-fpm' >> /etc/supervisord.conf && \
    echo '[program:nginx]' >> /etc/supervisord.conf && \
    echo 'command=nginx -g "daemon off;"' >> /etc/supervisord.conf

EXPOSE 8000 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]