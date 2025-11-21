# 📝 Notion Clone - PWA

Una aplicación moderna de organización y notas estilo Notion, construida como Progressive Web App (PWA) con React, TypeScript y TailwindCSS.

## ✨ Características Actuales

### ✅ Implementado en v1.0

- **📄 Sistema de Páginas**: Crea páginas ilimitadas con títulos personalizables
- **🗂️ Jerarquías**: Organiza páginas con subpáginas anidadas
- **⭐ Favoritos**: Marca páginas importantes para acceso rápido
- **🎨 Personalización**: 
  - Iconos emoji personalizables
  - Colores de portada
  - Editor de bloques múltiples tipos
- **✍️ Editor de Bloques**:
  - Texto normal
  - Títulos (H1, H2, H3)
  - Listas con viñetas
  - Checklists interactivos
  - Bloques de código
  - Comando "/" para cambiar tipos
- **🔍 Búsqueda**: Busca en títulos y contenido de todas tus páginas
- **💾 Persistencia Local**: Todo se guarda en localStorage
- **📱 PWA**: 
  - Instalable en cualquier dispositivo
  - Funciona offline
  - Iconos personalizados
- **🎭 Animaciones**: Transiciones suaves con Framer Motion
- **🎯 UI/UX Moderna**: 
  - Diseño minimalista inspirado en Notion
  - Panel lateral colapsable
  - Hover effects y micro-interacciones

## 🚀 Próximas Funcionalidades

### Para v2.0 (Con Lovable Cloud)

- **👥 Colaboración en Tiempo Real**:
  - Múltiples usuarios editando simultáneamente
  - Presencia en tiempo real
  - Cursor de colaboradores
  - Sincronización automática

- **💾 Backend Persistente**:
  - Sincronización en la nube
  - Backup automático
  - Acceso desde cualquier dispositivo

- **🔐 Autenticación**:
  - Sistema de usuarios
  - Permisos y roles
  - Espacios de trabajo compartidos

### Para v3.0 (Funcionalidades Avanzadas)

- **📊 Bases de Datos**:
  - Vista de tabla
  - Vista Kanban
  - Vista calendario
  - Vista lista
  - Propiedades personalizadas
  - Filtros y ordenamiento

- **💬 Comunicación**:
  - Comentarios en bloques
  - Menciones @usuario
  - Chat por página

- **📜 Historial**:
  - Versiones de páginas
  - Restaurar cambios
  - Auditoría de cambios

- **🔗 Enlaces y Referencias**:
  - Enlaces entre páginas
  - Backlinks automáticos
  - Referencias bidireccionales

- **📤 Exportación**:
  - PDF
  - Markdown
  - JSON

## 🛠️ Tecnologías

- **React 18** + TypeScript
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **Shadcn/ui** - Componentes
- **Framer Motion** - Animaciones
- **Vite PWA Plugin** - Capacidades PWA
- **Nanoid** - IDs únicos
- **React Router** - Navegación

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## 🎨 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Sidebar.tsx     # Panel lateral
│   ├── PageItem.tsx    # Item de página
│   ├── Editor.tsx      # Editor principal
│   ├── BlockEditor.tsx # Editor de bloques
│   ├── EmojiPicker.tsx # Selector de emojis
│   └── ColorPicker.tsx # Selector de colores
├── hooks/              # Custom hooks
│   └── usePages.ts     # Hook de gestión de páginas
├── lib/                # Utilidades
│   ├── storage.ts      # Persistencia localStorage
│   └── utils.ts        # Helpers
├── types/              # TypeScript types
│   └── page.ts         # Tipos de Page y Block
└── pages/              # Páginas de la app
    └── Index.tsx       # Página principal
```

## 🎯 Cómo Usar

1. **Crear una página**: Click en "Nueva página" en el sidebar
2. **Editar título**: Click en el título de la página
3. **Cambiar icono**: Click en el emoji grande
4. **Añadir portada**: Click en "Añadir portada"
5. **Agregar contenido**: 
   - Escribe directamente
   - Presiona "/" para ver comandos
   - Enter para nuevo bloque
   - Backspace en bloque vacío para eliminar
6. **Organizar**: 
   - Arrastra páginas para reordenar
   - Click en el "+" para crear subpágina
   - Click en la estrella para favoritos
7. **Buscar**: Usa el buscador en el sidebar

## 💡 Comandos del Editor

Presiona "/" en un bloque para ver los comandos:

- **Texto** - Párrafo normal
- **Título 1** - Encabezado grande
- **Título 2** - Encabezado mediano
- **Título 3** - Encabezado pequeño
- **Lista** - Lista con viñetas
- **Checklist** - Lista de tareas
- **Código** - Bloque de código

## 🌐 PWA Features

La aplicación puede ser instalada en:

- 💻 Desktop (Chrome, Edge, Safari)
- 📱 Android (Chrome)
- 🍎 iOS (Safari)

### Instalar

1. Visita la app en tu navegador
2. Busca el botón "Instalar" o el icono de instalación
3. Sigue las instrucciones del navegador

## 📄 License

Este proyecto fue creado con [Lovable](https://lovable.dev)
