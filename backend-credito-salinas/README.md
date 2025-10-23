# Backend - Sistema de Solicitud de Crédito
## Grupo Salinas - Evaluación Técnica

### Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
   - Copiar `.env.example` a `.env`
   - Ajustar las credenciales de MySQL

3. Crear la base de datos (ejecutar script SQL)

4. Iniciar el servidor:
```bash
npm run dev
```

### Endpoints Disponibles

#### Sucursales
- GET /api/sucursales - Listar sucursales
- GET /api/sucursales/:id - Obtener sucursal

#### Solicitudes
- POST /api/solicitudes - Crear solicitud
- POST /api/solicitudes/simular - Simular solicitudes
- GET /api/solicitudes - Listar solicitudes
- GET /api/solicitudes/:id - Obtener solicitud

#### Estadísticas
- GET /api/estadisticas - Estadísticas generales
- GET /api/estadisticas/sucursales - Estadísticas por sucursal

### Pruebas
```bash
npm test
```

### Estructura del Proyecto
Ver arquitectura en la documentación.
