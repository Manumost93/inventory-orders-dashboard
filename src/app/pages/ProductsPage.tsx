import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Alert,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Snackbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { Product } from "../types/product";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../services/productService";
import { usePermissions } from "../hooks/usePermissions";

type StatusFilter = "all" | "active" | "inactive";
type Toast = { open: boolean; message: string; severity: "success" | "error" | "info" };

export default function ProductsPage() {
  const navigate = useNavigate();
  const { canWrite } = usePermissions();

  const [rows, setRows] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] =
    React.useState<StatusFilter>("all");

  // CREATE
  const [openCreate, setOpenCreate] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newPrice, setNewPrice] = React.useState("");

  // DELETE
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  // EDIT
  const [editOpen, setEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");
  const [editPrice, setEditPrice] = React.useState("");
  const [editStock, setEditStock] = React.useState("");
  const [editStatus, setEditStatus] =
    React.useState<"active" | "inactive">("active");

  // UX
  const [busy, setBusy] = React.useState<null | "create" | "edit" | "delete" | "refresh">(null);
  const [toast, setToast] = React.useState<Toast>({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = (message: string, severity: Toast["severity"]) => {
    setToast({ open: true, message, severity });
  };

  const loadProducts = React.useCallback(async () => {
    try {
      setError(null);
      setBusy("refresh");
      setLoading(true);
      const data = await getProducts();
      setRows(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error loading products";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
      setBusy(null);
    }
  }, []);

  React.useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const filteredRows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((p) => {
      const matchesSearch = q === "" || p.name.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  // -------- CREATE --------
  const handleCreate = async () => {
    if (!canWrite) {
      showToast("Viewer role: read-only.", "info");
      return;
    }

    const name = newName.trim();
    const price = Number(newPrice);

    if (!name || Number.isNaN(price) || price <= 0) {
      showToast("Please enter a valid name and price.", "info");
      return;
    }

    try {
      setError(null);
      setBusy("create");
      const created = await createProduct({ name, price });
      setRows((prev) => [...prev, created]);
      setOpenCreate(false);
      setNewName("");
      setNewPrice("");
      showToast("Product created.", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error creating product";
      setError(message);
      showToast(message, "error");
    } finally {
      setBusy(null);
    }
  };

  // -------- DELETE --------
  const handleDelete = async () => {
    if (!canWrite) {
      showToast("Viewer role: read-only.", "info");
      return;
    }
    if (!deleteId) return;

    try {
      setError(null);
      setBusy("delete");
      await deleteProduct(deleteId);
      setRows((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
      showToast("Product deleted.", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error deleting product";
      setError(message);
      showToast(message, "error");
    } finally {
      setBusy(null);
    }
  };

  // -------- EDIT --------
  const openEditForRow = (p: Product) => {
    if (!canWrite) {
      showToast("Viewer role: read-only.", "info");
      return;
    }
    setEditId(p.id);
    setEditName(p.name);
    setEditPrice(String(p.price));
    setEditStock(String(p.stock));
    setEditStatus(p.status);
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!canWrite) {
      showToast("Viewer role: read-only.", "info");
      return;
    }
    if (!editId) return;

    const name = editName.trim();
    const price = Number(editPrice);
    const stock = Number(editStock);

    if (
      !name ||
      Number.isNaN(price) ||
      price <= 0 ||
      Number.isNaN(stock) ||
      stock < 0
    ) {
      showToast("Please enter valid values.", "info");
      return;
    }

    try {
      setError(null);
      setBusy("edit");
      const updated = await updateProduct(editId, {
        name,
        price,
        stock,
        status: editStatus,
      });
      setRows((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditOpen(false);
      setEditId(null);
      showToast("Product updated.", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error updating product";
      setError(message);
      showToast(message, "error");
    } finally {
      setBusy(null);
    }
  };

  const columns: GridColDef<Product>[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "sku", headerName: "SKU", width: 130 },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      valueFormatter: (value) => `$${Number(value)}`,
    },
    { field: "stock", headerName: "Stock", width: 110 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "createdAt", headerName: "Created At", width: 140 },
    {
      field: "actions",
      headerName: "",
      width: 320,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => navigate(`/products/${params.row.id}`)}>
            View
          </Button>

          <Button size="small" disabled={!canWrite} onClick={() => openEditForRow(params.row)}>
            Edit
          </Button>

          <Button
            size="small"
            color="error"
            disabled={!canWrite}
            onClick={() => setDeleteId(params.row.id)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress />
        Loading products...
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Stack spacing={2} mb={2}>
          <Alert severity="error">{error}</Alert>
          <Button variant="outlined" onClick={loadProducts} disabled={busy === "refresh"}>
            Retry
          </Button>
        </Stack>
      )}

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        mb={2}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            size="small"
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={loadProducts} disabled={busy === "refresh"}>
            Refresh
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenCreate(true)}
            disabled={!canWrite || busy !== null}
          >
            Add Product
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ height: 520 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          disableRowSelectionOnClick
        />
      </Box>

      {/* CREATE dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1} sx={{ minWidth: { xs: 260, sm: 360 } }}>
            <TextField
              label="Product Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)} disabled={busy === "create"}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!canWrite || busy === "create"}
          >
            {busy === "create" ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1} sx={{ minWidth: { xs: 260, sm: 360 } }}>
            <TextField
              label="Product Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              fullWidth
            />
            <TextField
              label="Stock"
              type="number"
              value={editStock}
              onChange={(e) => setEditStock(e.target.value)}
              fullWidth
            />
            <Select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as "active" | "inactive")}
              fullWidth
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={busy === "edit"}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSave}
            disabled={!canWrite || busy === "edit"}
          >
            {busy === "edit" ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE confirm dialog */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this product?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} disabled={busy === "delete"}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={!canWrite || busy === "delete"}
          >
            {busy === "delete" ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
