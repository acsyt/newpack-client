# NEWPACK-CLIENT

## 🚀 Primeros pasos

1. **Instalar dependencias** (usar bun latest):
   ```bash
   bun install
   ```

2. **Configurar variables de entorno**:
   ```bash
   VITE_API_URL=http://localhost:8000
   ```

3. **Levantar entorno de desarrollo**:
   ```bash
   bun run dev
   ```

4. **Usuario de prueba**:
   - Email: admin@acsyt.com
   - Password: 123456

## 🏗️ Arquitectura de carpetas

- `components/` - Componentes React reutilizables
- `config/` - Configuración de librerías externas (Axios, TanStack, etc.)
- `constants/` - Constantes globales de la aplicación
- `context/` - Contextos de React
- `features/` - Módulos de funcionalidades específicas
- `hooks/` - Custom hooks
- `interfaces/` - Tipos TypeScript e interfaces
- `mappers/` - Transformadores de datos entre formatos
- `routes/` - Definición de rutas y páginas (TanStack Router)
- `scripts/` - Scripts de utilidad
- `store/` - Estado global (Zustand)
- `styles/` - Estilos globales y configuración de Tailwind
- `utils/` - Funciones auxiliares y helpers reutilizables

### Estructura de Features

Cada feature debe contener:
- `components/` - Componentes específicos del feature
  - `user-form.tsx`
- `hooks/` - Hooks específicos del feature
  - `mutations.ts`
  - `queries.ts`
- `user-form.schema.ts` - Esquemas de validación (Zod)
- `user.interface.ts` - Tipos TypeScript del feature
- `user.service.ts` - Servicios/peticiones API del feature
- `user.store.ts`- Store específico del feature

## 📋 Consideraciones técnicas

- Components: CamelCase UserForm.tsx
- Funciones, utils, types: (user.services.tsx, date.helper.ts) (Con punto usa para indicar un propósito específico o tipo de archivo)
- Routes: camelCase, pero la action separado por un punto. (user.show.tsx userTournaments.create.tsx)
- No crear folders si solo engloban un solo archivo. Considerar el uso de folders para agrugar multimples archivos similares. 
-  **Sin barrel exports**: No usar index.ts, importar directamente desde cada archivo

## 📚 Librerías principales

- **Peticiones API**: Axios
- **Validación de esquemas**: Zod
- **Peticiones asíncronas**: TanStack Query
- **Formularios**: React Hook Form
- **Enrutador**: TanStack Router
- **Componentes UI**: Material UI y Tailwind CSS
- **Estado global**: Zustand
- **Iconos**: Material UI Icons
- **Tablas**: Material-react-table

> **Nota**: Cualquier cambio en la estructura del proyecto o en las librerías mencionadas debe reflejarse en esta documentación.

Happy Coding! 🎉