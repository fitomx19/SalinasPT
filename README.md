# Sistema de Solicitud de Crédito
## Grupo Salinas - Evaluación Técnica



1. Instalar dependencias en frontend-credito-salinas y backend-credito-salinas:
```bash
npm install
```

En MySQL ejecutar el archivo script.sql para la generacion de la estructura y algunos datos.

2. Configurar variables de entorno:
   - Copiar `.env.example` a `.env`
   - Ajustar la URL de la API si es necesario

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

### Características

- Formulario de solicitud de crédito con validaciones
- Resultado inmediato de aprobación/rechazo
- Dashboard de estadísticas con gráficas
- Simulación de múltiples solicitudes
- Historial de cliente con búsqueda avanzada
- Diseño responsivo
- Navegación con React Router

### Páginas

1. **Home** - Página de inicio con información
2. **Nueva Solicitud** - Formulario de solicitud
3. **Simular** - Generación de solicitudes aleatorias
4. **Historial** - Búsqueda y visualización de historial de clientes
5. **Estadísticas** - Dashboard con métricas


# Historial de Cliente

**La nueva feature permite buscar clientes y ver su historial completo de solicitudes de crédito.**

## Funcionalidad:
1. **Buscador** - Encuentra clientes por email, nombre o teléfono (mínimo 3 caracteres)
2. **Estadísticas del cliente** - Muestra total de solicitudes, aprobadas, rechazadas, tasa de aprobación, monto total y score promedio
3. **Historial detallado** - Tabla con todas las solicitudes: fecha, sucursal, monto, plazo, score y motivo de rechazo

## Implementación:
- **Backend**: 3 nuevos endpoints (`/api/clientes/*`)
- **Frontend**: Página completa con búsqueda interactiva y dashboard
- Usa stored procedure existente (`sp_historial_cliente`)

**Beneficio**: Los ejecutivos pueden analizar el perfil crediticio completo del cliente antes de asesorar.


### 🔧 Scripts Disponibles

- `npm run dev` - Iniciar desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de producción
