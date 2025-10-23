# Guía de Despliegue - Sistema de Crédito Salinas

Esta guía explica cómo levantar la aplicación completa usando Docker y Docker Compose.

## Arquitectura del Sistema

La aplicación consta de tres servicios:

- **MySQL Database** - Base de datos MySQL 8.0 (puerto 3306)
- **Backend API** - API REST en Node.js/Express (puerto 3000)
- **Frontend** - Aplicación React con Vite servida por Nginx (puerto 5173)

## Requisitos Previos

- Docker instalado
- Docker Compose instalado

## Inicio Rápido

### Levantar todos los servicios

```bash
docker-compose up --build
```

Este comando construye las imágenes e inicia todos los servicios. La aplicación estará lista cuando aparezca el mensaje `Server running on port 3000`.

### Levantar en modo detached (segundo plano)

```bash
docker-compose up -d --build
```

### Verificar estado de los servicios

```bash
docker-compose ps
```

### Ver logs

```bash
# Todos los servicios
docker-compose logs

# Servicio específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Ver logs en tiempo real
docker-compose logs -f
```

## Acceso a la Aplicación

Una vez levantados los servicios:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Base de datos**: localhost:3306

## Credenciales de Base de Datos

- **Usuario**: salinas_user
- **Contraseña**: salinas_pass
- **Base de datos**: salinas_credito

El script `script.sql` se ejecuta automáticamente al iniciar el contenedor de MySQL.

## Gestión de Servicios

### Detener servicios

```bash
docker-compose down
```

### Detener y eliminar volúmenes (elimina datos persistentes)

```bash
docker-compose down -v
```

### Reiniciar un servicio específico

```bash
docker-compose restart backend
```

### Reconstruir después de cambios en el código

```bash
docker-compose down
docker-compose up --build
```

## Endpoints Principales de la API

- `GET /health` - Estado del backend
- `GET /` - Información general de la API
- `GET /api/sucursales` - Gestión de sucursales
- `GET /api/solicitudes` - Solicitudes de crédito
- `GET /api/estadisticas` - Estadísticas del sistema
- `GET /api/clientes` - Gestión de clientes

## Solución de Problemas

### Puerto ocupado
Verifique que los puertos 3000, 3307 y 5173 estén disponibles.

### Error de conexión a base de datos
Espere 10-20 segundos después de iniciar los servicios para que MySQL complete su inicialización.

### Cambios no se reflejan
Reconstruya los contenedores con `docker-compose up --build`.

## Acceso a Contenedores

### Backend
```bash
docker-compose exec backend sh
```

### Base de datos
```bash
docker-compose exec mysql mysql -u salinas_user -p
# Contraseña: salinas_pass
```

## Notas Importantes

- La primera ejecución descargará todas las dependencias necesarias y puede tardar varios minutos.
- Los datos de la base de datos persisten entre reinicios a menos que se use el flag `-v`.
- El script SQL de inicialización solo se ejecuta si la base de datos está vacía.