import * as React from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import type { Customer } from "../types/customer";
import { getCustomerById } from "../services/customerService";
import { getOrdersByCustomerId } from "../services/orderService";
import type { Order } from "../types/order";

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function CustomerDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setError(null);
        setLoading(true);

        const c = await getCustomerById(id ?? "");
        if (!alive) return;

        if (!c) {
          setCustomer(null);
          setOrders([]);
          setError("Customer not found");
          return;
        }

        setCustomer(c);

        const o = await getOrdersByCustomerId(c.id);
        if (!alive) return;
        setOrders(o);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error loading customer";
        if (alive) setError(message);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress />
        Loading customer...
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!customer) return <Alert severity="warning">No customer</Alert>;

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
        <Button component={RouterLink} to="/customers" variant="outlined">Customers</Button>
      </Stack>

      <Typography variant="h4" mb={2}>
        Customer Detail
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">{customer.name}</Typography>
          <Typography color="text.secondary">{customer.email}</Typography>
          <Divider sx={{ my: 1 }} />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Typography><b>Segment:</b> {customer.segment}</Typography>
            <Typography><b>Created:</b> {customer.createdAt}</Typography>
            <Typography><b>Revenue:</b> {money(totalRevenue)}</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Orders</Typography>
            <Button component={RouterLink} to="/orders" size="small">
              View all orders
            </Button>
          </Stack>

          <Divider sx={{ mb: 1 }} />

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((o) => (
                  <TableRow
                    key={o.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/orders/${o.id}`)}
                  >
                    <TableCell>{o.number}</TableCell>
                    <TableCell>{o.status}</TableCell>
                    <TableCell align="right">{money(Number(o.total) || 0)}</TableCell>
                    <TableCell>{o.createdAt}</TableCell>
                  </TableRow>
                ))}

                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography variant="body2" color="text.secondary">
                        No orders for this customer.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
