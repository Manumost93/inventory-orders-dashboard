import * as React from "react";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  Chip,
  Select,
  MenuItem,
  Snackbar,
} from "@mui/material";
import type { Order, OrderStatus } from "../types/order";
import { getOrderById, updateOrderStatus } from "../services/orderService";

type Toast = { open: boolean; message: string; severity: "success" | "error" | "info" };

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [order, setOrder] = React.useState<Order | null>(null);

  const [busy, setBusy] = React.useState(false);
  const [toast, setToast] = React.useState<Toast>({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = (message: string, severity: Toast["severity"]) =>
    setToast({ open: true, message, severity });

  const load = React.useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const found = await getOrderById(id ?? "");
      if (!found) {
        setError("Order not found");
        setOrder(null);
      } else {
        setOrder(found);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error loading order";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const onStatusChange = async (nextStatus: OrderStatus) => {
    if (!order) return;

    try {
      setError(null);
      setBusy(true);

      const updated = await updateOrderStatus(order.id, nextStatus);
      setOrder(updated);

      showToast("Order status updated.", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error updating status";
      setError(message);
      showToast(message, "error");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress />
        Loading order...
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!order) return <Alert severity="warning">No order</Alert>;

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button component={RouterLink} to="/orders" variant="outlined">
          Orders
        </Button>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Order Detail</Typography>
        <Button variant="outlined" onClick={load} disabled={busy}>
          Refresh
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">{order.number}</Typography>
              <Chip size="small" label={order.status.toUpperCase()} />
            </Stack>

            <Typography color="text.secondary">ID: {order.id}</Typography>

            <Divider />

            <Stack spacing={0.5}>
              <Typography>
                <b>Customer:</b> {order.customerName}
              </Typography>
              <Typography>
                <b>Total:</b> {money(Number(order.total) || 0)}
              </Typography>
              <Typography>
                <b>Created:</b> {order.createdAt}
              </Typography>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>

              <Select
                size="small"
                value={order.status}
                disabled={busy}
                onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
                sx={{ maxWidth: 220 }}
              >
                <MenuItem value="pending">pending</MenuItem>
                <MenuItem value="paid">paid</MenuItem>
                <MenuItem value="shipped">shipped</MenuItem>
              </Select>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

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
