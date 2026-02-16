import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Alert,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { Order, OrderStatus } from "../types/order";
import { getOrders, updateOrderStatus } from "../services/orderService";

type Toast = { open: boolean; message: string; severity: "success" | "error" | "info" };
type StatusFilter = "all" | OrderStatus;

function statusChip(status: OrderStatus) {
  const label = status.toUpperCase();
  return <Chip size="small" label={label} variant={status === "pending" ? "outlined" : "filled"} />;
}

export default function OrdersPage() {
  const navigate = useNavigate();

  const [rows, setRows] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");

  const [busyId, setBusyId] = React.useState<string | null>(null);

  const [toast, setToast] = React.useState<Toast>({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = (message: string, severity: Toast["severity"]) =>
    setToast({ open: true, message, severity });

  const loadOrders = React.useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getOrders();
      setRows(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error loading orders";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const filteredRows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((o) => {
      const matchesSearch =
        q === "" ||
        o.number.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const handleStatusChange = async (id: string, nextStatus: OrderStatus) => {
    try {
      setError(null);
      setBusyId(id);
      const updated = await updateOrderStatus(id, nextStatus);
      setRows((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      showToast("Order updated.", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error updating order";
      setError(message);
      showToast(message, "error");
    } finally {
      setBusyId(null);
    }
  };

  const columns: GridColDef<Order>[] = [
    { field: "number", headerName: "Order", width: 140 },
    { field: "customerName", headerName: "Customer", flex: 1, minWidth: 180 },
    {
      field: "total",
      headerName: "Total",
      width: 120,
      valueFormatter: (value) => `$${Number(value)}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          {statusChip(params.row.status)}
          <Select
            size="small"
            value={params.row.status}
            disabled={busyId === params.row.id}
            onChange={(e) =>
              handleStatusChange(params.row.id, e.target.value as OrderStatus)
            }
          >
            <MenuItem value="pending">pending</MenuItem>
            <MenuItem value="paid">paid</MenuItem>
            <MenuItem value="shipped">shipped</MenuItem>
          </Select>
        </Stack>
      ),
    },
    { field: "createdAt", headerName: "Created", width: 140 },
    {
      field: "actions",
      headerName: "",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button size="small" onClick={() => navigate(`/orders/${params.row.id}`)}>
          View
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress />
        Loading orders...
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Stack spacing={2} mb={2}>
          <Alert severity="error">{error}</Alert>
          <Button variant="outlined" onClick={loadOrders}>
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
            label="Search (order/customer)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">pending</MenuItem>
            <MenuItem value="paid">paid</MenuItem>
            <MenuItem value="shipped">shipped</MenuItem>
          </Select>
        </Stack>

        <Button variant="outlined" onClick={loadOrders}>
          Refresh
        </Button>
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
