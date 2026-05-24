# 📊 Inventory & Orders Dashboard

**Dashboard de Inventario y Órdenes** - Una aplicación web moderna para la gestión empresarial de productos, órdenes y clientes.

---

## 👨‍💻 Autor

**Manuel Honrado** - Desarrollador Full Stack  
📧 [manuel.honrado@example.com](mailto:manuel.honrado@example.com)  
🔗 [LinkedIn](https://linkedin.com/in/manuelhonrado) | [GitHub](https://github.com/Manumost93)

---

## 📷 Capturas de pantalla

> 📝 **Instrucciones para añadir imágenes**: Guarda tus 3 capturas de pantalla en `docs/images/` con estos nombres exactos:
> - `dashboard-overview.png` - Captura del dashboard principal
> - `products-management.png` - Vista de la página de productos  
> - `add-product-modal.png` - Modal para añadir producto

### Dashboard Principal
**Vista general del dashboard con métricas de negocio, gráficos de órdenes y snapshot del inventario**
- Métricas de ingresos totales ($459.40)
- Contador de órdenes por estado (3 órdenes)
- Productos activos en inventario (2 productos)
- Alertas de stock bajo (5 productos)
- Top customer (Initech - $360.00)
- Últimas 5 órdenes con detalles

### Gestión de Productos
**Módulo de gestión de productos con tabla filtrable y funcionalidades CRUD**
- Tabla con productos: Classic Burger, Cheese Burger, Vegan Burger
- Filtros por estado y búsqueda por nombre
- Botón "ADD PRODUCT" para crear nuevos productos
- Columnas: Name, SKU, Price, Stock, Status, Created At, Actions

### Módulo de Creación  
**Modal para añadir nuevos productos al inventario**
- Formulario con campos "Product Name" y "Price"
- Botones "CANCEL" y "CREATE"
- Validación de datos de entrada

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
// === PRODUCT SERVICE ===
export async function getProducts(): Promise<Product[]>
export async function getProductById(id: string): Promise<Product | null>
export async function createProduct(data: CreateProduct): Promise<Product>
export async function updateProduct(id: string, data: Partial<Product>): Promise<Product>
export async function deleteProduct(id: string): Promise<void>

// === ORDER SERVICE ===
export async function getOrders(): Promise<Order[]>
export async function getOrderById(id: string): Promise<Order | null>
export async function getOrdersByCustomerId(customerId: string): Promise<Order[]>
export async function createOrder(data: CreateOrder): Promise<Order>
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order>

// === CUSTOMER SERVICE ===
export async function getCustomers(): Promise<Customer[]>
export async function getCustomerById(id: string): Promise<Customer | null>
export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer>

// === STORAGE SERVICE ===
const STORAGE_KEYS = {
  auth: "auth_v1",
  products: "products_v1",
  orders: "orders_v1",
  customers: "customers_v1"
} as const;

export function readJson<T>(key: string, fallback: T): T
export function writeJson<T>(key: string, value: T): void
export function readAuth(): StoredAuth
export function writeAuth(auth: StoredAuth): void
export function clearAuth(): void
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

## 🛠️ Stack Tecnológico Completo

### 🚀 Core Technologies
| Categoría | Tecnología | Versión | Propósito |
|-----------|------------|---------|----------|
| **Frontend** | React | 19.2.0 | Biblioteca principal UI |
| **Language** | TypeScript | 5.9.3 | Tipado estático y desarrollo |
| **Build Tool** | Vite | 6.0.0 | Bundler y development server |
| **Module System** | ES Modules | - | Sistema de módulos moderno |

### 🎨 UI & Styling Framework
| Librería | Versión | Uso Específico |
|----------|---------|---------------|
| **@mui/material** | 7.3.7 | Componentes UI principales |
| **@mui/icons-material** | 7.3.7 | Iconografía Material Design |
| **@mui/x-data-grid** | 8.27.0 | Tablas avanzadas con filtros |
| **@emotion/react** | 11.14.0 | CSS-in-JS engine |
| **@emotion/styled** | 11.14.1 | Styled components |

### 🔄 State Management & Routing
| Tecnología | Implementación | Archivos Clave |
|------------|----------------|----------------|
| **React Router** | 7.13.0 | `BrowserRouter`, `Routes`, `Navigate` |
| **Context API** | Nativo React | `AuthProvider`, `ColorModeProvider` |
| **Custom Hooks** | Patrón personalizado | `useAuth`, `usePermissions`, `useColorMode` |
| **LocalStorage** | API nativa | Persistencia de sesión y preferencias |

### 🔧 Development Tools
| Herramienta | Versión | Configuración |
|-------------|---------|---------------|
| **ESLint** | 9.39.1 | Linting con reglas TypeScript |
| **TypeScript ESLint** | 8.48.0 | Reglas específicas TS |
| **React Hooks ESLint** | 7.0.1 | Validación hooks |
| **React Refresh** | 0.4.24 | Hot Module Replacement |

### 🏗️ Patrones de Arquitectura Implementados

#### 🎯 **Custom Hooks Pattern**
```typescript
// useAuth.ts - Gestión de autenticación
export function useAuth(): AuthContextValue

// usePermissions.ts - Control de permisos por rol
export function usePermissions() {
  const canWrite = role === "admin";
}

// useColorMode.ts - Gestión tema claro/oscuro
export function useColorMode(): ColorModeContextValue
```

#### 📡 **Service Layer Pattern**
```typescript
// productService.ts
export async function getProducts(): Promise<Product[]>
export async function createProduct(data: CreateProduct): Promise<Product>
export async function updateProduct(id: string, data: Partial<Product>): Promise<Product>
export async function deleteProduct(id: string): Promise<void>

// orderService.ts
export async function getOrders(): Promise<Order[]>
export async function getOrdersByCustomerId(customerId: string): Promise<Order[]>

// customerService.ts  
export async function getCustomers(): Promise<Customer[]>
export async function getCustomerById(id: string): Promise<Customer | null>
```

#### 🔐 **Authentication & Authorization**
```typescript
// Roles de usuario
type Role = "admin" | "viewer";

// Context de autenticación
interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Rutas protegidas
<Route element={<ProtectedRoute />}>
  <Route element={<DashboardLayout />}>
    // Rutas privadas...
  </Route>
</Route>
```

#### 🎨 **Theming System**
```typescript
// Sistema de temas dinámico
type ColorMode = "light" | "dark";

// Detección automática de preferencias del sistema
function getSystemMode(): ColorMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches 
    ? "dark" : "light";
}

// Persistencia en localStorage
const STORAGE_KEY = "ui_color_mode_v1";
```

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

### 🌙 **Sistema de Temas Inteligente**
- **Detección automática** del modo preferido del sistema
- **Persistencia** de preferencias del usuario
- **Transiciones fluidas** entre modo claro y oscuro
- **Adaptación de componentes** MUI automática

### 📱 **Diseño Responsive Avanzado**
- **Breakpoints MUI**: xs, sm, md, lg, xl
- **Drawer responsive**: sidebar colapsa en móvil
- **Hamburger menu** en dispositivos pequeños
- **Grid adaptativo** para métricas y cards

### ⚡ **Optimización de Rendimiento**
- **Vite HMR**: Hot Module Replacement ultrarrápido
- **Tree shaking**: Eliminación de código no usado
- **Code splitting**: Carga bajo demanda
- **React.memo**: Prevención de re-renders innecesarios
- **useMemo/useCallback**: Optimización de cálculos

### 🔍 **Sistema de Búsqueda y Filtros**
```typescript
// Filtros en tiempo real
const filteredProducts = products.filter(product => {
  const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
  const matchesStatus = statusFilter === "all" || product.status === statusFilter;
  return matchesSearch && matchesStatus;
});
```

### 📊 **DataGrid Avanzado (MUI X)**
- **Paginación**: Configuración de filas por página
- **Ordenamiento**: Por cualquier columna
- **Acciones**: Ver, Editar, Eliminar por fila
- **Responsive columns**: Adaptación automática
- **Loading states**: Skeleton loading

### 🔐 **Seguridad y Autenticación**
- **Role-Based Access Control (RBAC)**
- **Protected Routes**: Redirect automático si no authenticated
- **Session persistence**: Mantiene sesión tras reload
- **Logout automático**: Limpieza de estado

### 🎨 **Sistema de Diseño Consistente**
```typescript
// Tema personalizado MUI
const theme = createTheme({
  palette: { mode },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ["Inter", "system-ui", "Segoe UI", "Roboto", "Arial"].join(",")
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: mode === "light" 
            ? "1px solid rgba(0,0,0,0.08)" 
            : "1px solid rgba(255,255,255,0.10)"
        }
      }
    }
  }
});
```

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

## 🌟 Demo en Vivo

**🔗 [Ver Demo en Vivo](https://inventory-orders-dashboard.vercel.app)**

### Credenciales de prueba:
- **Email**: `demo@company.com`  
- **Password**: `admin123`

---

**💻 Desarrollado con ❤️ por Manuel Honrado**  
*Este proyecto demuestra habilidades de arquitectura frontend, gestión de estado y patrones UI del mundo real.*


```
