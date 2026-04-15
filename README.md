# 📊 Inventory & Orders Dashboard

**Dashboard de Inventario y Órdenes** - Una aplicación web moderna para la gestión empresarial de productos, órdenes y clientes.

---

## 👨‍💻 Autor

**Manuel Honrado** - Desarrollador Full Stack  
📧 [manuel.honrado@example.com](mailto:manuel.honrado@example.com)  
🔗 [LinkedIn](https://linkedin.com/in/manuelhonrado) | [GitHub](https://github.com/Manumost93)

---

## 📷 Capturas de pantalla

### Dashboard Principal
![Dashboard Principal](./docs/images/dashboard-overview.png)
*Vista general del dashboard con métricas de negocio, gráficos de órdenes y snapshot del inventario*

### Gestión de Productos
![Gestión de Productos](./docs/images/products-management.png)
*Módulo de gestión de productos con tabla filtrable y funcionalidades CRUD*

### Módulo de Creación
![Añadir Producto](./docs/images/add-product-modal.png)
*Modal para añadir nuevos productos al inventario*

---

## 🎯 ¿Qué es este proyecto?

Esta aplicación es un **Dashboard completo de gestión empresarial** diseñado para pequeñas y medianas empresas que necesitan:

- 📈 **Monitorear métricas de negocio** en tiempo real
- 🛍️ **Gestionar inventario de productos** 
- 📦 **Seguimiento de órdenes y pedidos**
- 👥 **Administrar base de clientes**
- 💰 **Control de ingresos y ventas**

## 🚀 Funcionalidades Principales

### 📊 Dashboard de Métricas
- **Ingresos totales** con suma automática de órdenes
- **Contador de órdenes** por estado (pendiente, pagado, enviado)  
- **Productos activos** en inventario
- **Alertas de stock bajo** (productos con stock < 10)
- **Top customers** por valor de compras
- **Últimas 5 órdenes** con detalles

### 🛍️ Gestión de Productos
- **CRUD completo**: Crear, leer, actualizar y eliminar productos
- **Búsqueda y filtros** avanzados
- **Gestión de stock** en tiempo real
- **Estados de productos** (activo/inactivo)
- **Códigos SKU** únicos por producto

### 📦 Sistema de Órdenes  
- **Seguimiento de pedidos** por estado
- **Historial completo** de transacciones
- **Vinculación con clientes** y productos
- **Cálculos automáticos** de totales

### 👥 Gestión de Clientes
- **Base de datos de clientes** completa
- **Historial de compras** por cliente
- **Métricas de cliente** (valor total, órdenes)

## 🔧 Funcionalidad de la API/Sistema

El proyecto implementa un **sistema de gestión de datos robusto** con:

### 📡 API Simulada (LocalStorage)
```typescript
// Servicios principales
- ProductService: Gestión completa de productos
- OrderService: Manejo de órdenes y estados  
- CustomerService: Administración de clientes
- Storage: Capa de persistencia local
```

### 🔄 Arquitectura de Datos
```typescript
// Modelos de datos tipados
interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface Order {
  id: string;
  customerId: string;
  products: OrderProduct[];
  total: number;
  status: 'pending' | 'paid' | 'shipped';
  createdAt: Date;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
}
```

### 🛡️ Sistema de Autenticación
- **Login seguro** con validación de credenciales
- **Rutas protegidas** con React Router
- **Gestión de estado** con Context API
- **Persistencia de sesión** automática

## 🛠️ Stack Tecnológico

| Categoría | Tecnologías |
|-----------|-------------|
| **Frontend** | React 19.2, TypeScript 5.9 |
| **UI Framework** | Material-UI v7 (MUI) |
| **Routing** | React Router v7 |
| **Estado Global** | Context API + useReducer |
| **Build Tool** | Vite 6.0 |
| **Linting** | ESLint + TypeScript ESLint |
| **Styling** | Emotion + MUI System |
| **Icons** | MUI Icons + Material Icons |

## 🚀 Instalación y Uso

### Prerrequisitos
- ✅ Node.js 18+ 
- ✅ npm o yarn instalado

### 1️⃣ Clonación del repositorio
```bash
git clone https://github.com/Manumost93/inventory-orders-dashboard.git
cd inventory-orders-dashboard
```

### 2️⃣ Instalación de dependencias
```bash
npm install
```

### 3️⃣ Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 4️⃣ Credenciales de acceso
```
Usuario: demo@company.com
Contraseña: admin123
```

## 📝 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Compilar para producción  
npm run preview    # Vista previa de la build
npm run lint       # Linter de código
npm run typecheck  # Verificación de tipos TS
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/
│   ├── components/     # Componentes reutilizables
│   ├── context/        # Context API (Auth, Theme)
│   ├── hooks/          # Custom hooks  
│   ├── layouts/        # Layouts principales
│   ├── pages/          # Páginas de la aplicación
│   ├── routes/         # Configuración de rutas
│   ├── services/       # Servicios de API
│   ├── theme/          # Configuración de Material-UI
│   ├── types/          # Definiciones TypeScript
│   └── ui/             # Componentes de UI base
├── assets/             # Recursos estáticos
├── index.css          # Estilos globales
└── main.tsx           # Punto de entrada
```

## ✨ Características Avanzadas

- 🌙 **Modo oscuro/claro** con detección automática del sistema
- 📱 **Diseño responsive** para móvil y desktop
- ⚡ **Carga optimizada** con Vite y code splitting
- 🔍 **Búsqueda y filtros** en tiempo real  
- 📊 **Gráficos y tablas** interactivas con MUI DataGrid
- 🎨 **Sistema de diseño** consistente con Material Design
- 🚀 **Rendimiento optimizado** con React 19 y TypeScript

## 🚀 Deploy y Producción

El proyecto está optimizado para deployment en:
- ✅ **Vercel** (recomendado)
- ✅ **Netlify** 
- ✅ **AWS S3 + CloudFront**
- ✅ **GitHub Pages**

```bash
# Build para producción
npm run build

# Archivos generados en ./dist
```

---

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`) 
5. Abrir un Pull Request

---

**Desarrollado con ❤️ por Manuel Honrado**

This project was built as a portfolio project to demonstrate frontend architecture skills, state management, and real-world UI patterns.

## 👨‍💻 Author

**Manuel Honrado**  
Frontend Developer  

LinkedIn: www.linkedin.com/in/manuel-honrado-desarrollador
GitHub: https://github.com/Manumost93/inventory-orders-dashboard.git
Live demo: https://inventory-orders-dashboard.vercel.app

## 📅 Year

2026

## 📄 License

This project is for educational and portfolio purposes.


```
