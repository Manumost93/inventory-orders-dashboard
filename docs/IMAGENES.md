# � Cómo añadir las imágenes reales al README

## ✅ Problema solucionado
- ❌ Eliminé los archivos placeholder que causaban enlaces rotos
- ✅ README actualizado con descripciones textuales
- ✅ Instrucciones claras para añadir las imágenes

## 📝 Pasos para añadir tus capturas de pantalla:

### 1. Preparar las imágenes
Guarda tus 3 capturas con estos nombres **exactos**:
- `dashboard-overview.png` 
- `products-management.png`
- `add-product-modal.png`

### 2. Copiar al repositorio
Coloca los archivos en: `docs/images/`

### 3. Estructura final
```
docs/
└── images/
    ├── dashboard-overview.png (TU CAPTURA AQUÍ)
    ├── products-management.png (TU CAPTURA AQUÍ)
    └── add-product-modal.png (TU CAPTURA AQUÍ)
```

### 4. Activar las imágenes en el README
Una vez que hayas colocado las imágenes, reemplaza esta sección del README:

```markdown
## 📷 Capturas de pantalla

> 📝 **Instrucciones para añadir imágenes**...
```

**Por esta:**

```markdown
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
```

## 🚀 Hacer commit de los cambios
```bash
git add docs/images/
git commit -m "feat: Añadir capturas de pantalla del proyecto"
git push origin main
```

**¡Y listo! Las imágenes aparecerán perfectamente en GitHub** ✨