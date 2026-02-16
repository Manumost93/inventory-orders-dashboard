import * as React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { getOrders } from "../services/orderService";
import { getProducts } from "../services/productService";
import type { Order, OrderStatus } from "../types/order";
import type { Product } from "../types/product";

type Kpis = {
  revenue: number;
  totalOrders: number;
  ordersByStatus: Record<OrderStatus, number>;
  activeProducts: number;
  lowStockProducts: number;
  topCustomer: { name: string; total: number } | null;
  topProducts: Array<{ name: string; stock: number }>;
  lastOrders: Array<
    Pick<Order, "id" | "number" | "customerName" | "total" | "status" | "createdAt">
  >;
};

function formatMoney(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [kpis, setKpis] = React.useState<Kpis | null>(null);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setError(null);
        setLoading(true);

        const [orders, products] = await Promise.all([getOrders(), getProducts()]);
        const computed = computeKpis(orders, products);

        if (alive) setKpis(computed);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error loading dashboard";
        if (alive) setError(message);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress />
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!kpis) return <Alert severity="warning">No data</Alert>;

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Dashboard</Typography>
        <Stack direction="row" spacing={1}>
          <Button component={RouterLink} to="/orders" variant="outlined">
            Orders
          </Button>
          <Button component={RouterLink} to="/products" variant="outlined">
            Products
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {/* Revenue */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Revenue
              </Typography>
              <Typography variant="h5">{formatMoney(kpis.revenue)}</Typography>
              <Typography variant="body2" color="text.secondary">
                Sum of all orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Orders */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Total Orders
              </Typography>
              <Typography variant="h5">{kpis.totalOrders}</Typography>
              <Typography variant="body2" color="text.secondary">
                All statuses
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Products */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Active Products
              </Typography>
              <Typography variant="h5">{kpis.activeProducts}</Typography>
              <Typography variant="body2" color="text.secondary">
                status = active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Low Stock
              </Typography>
              <Typography variant="h5">{kpis.lowStockProducts}</Typography>
              <Typography variant="body2" color="text.secondary">
                stock &lt; 10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Orders by status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={1}>
                Orders by Status
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Stack spacing={1}>
                <RowStat label="Pending" value={kpis.ordersByStatus.pending} />
                <RowStat label="Paid" value={kpis.ordersByStatus.paid} />
                <RowStat label="Shipped" value={kpis.ordersByStatus.shipped} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Top customer */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={1}>
                Top Customer
              </Typography>
              <Divider sx={{ mb: 1 }} />

              {kpis.topCustomer ? (
                <Stack spacing={1}>
                  <Typography variant="body1">{kpis.topCustomer.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: {formatMoney(kpis.topCustomer.total)}
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No orders yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Last 5 orders */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="h6">Last 5 Orders</Typography>
                <Button component={RouterLink} to="/orders" size="small">
                  View all
                </Button>
              </Stack>

              <Divider sx={{ mb: 1 }} />

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {kpis.lastOrders.map((o) => (
                      <TableRow
                        key={o.id}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/orders/${o.id}`)}
                      >
                        <TableCell>{o.number}</TableCell>
                        <TableCell>{o.customerName}</TableCell>
                        <TableCell align="right">
                          {formatMoney(Number(o.total) || 0)}
                        </TableCell>
                        <TableCell>{o.status}</TableCell>
                        <TableCell>{o.createdAt}</TableCell>
                      </TableRow>
                    ))}

                    {kpis.lastOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Typography variant="body2" color="text.secondary">
                            No orders available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory snapshot */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="h6">Inventory Snapshot</Typography>
                <Button component={RouterLink} to="/products" size="small">
                  Manage
                </Button>
              </Stack>

              <Typography variant="body2" color="text.secondary" mb={1}>
                Top products by stock
              </Typography>

              <Divider />

              <List>
                {kpis.topProducts.map((p) => (
                  <ListItem key={p.name} disableGutters>
                    <ListItemText primary={p.name} secondary={`Stock: ${p.stock}`} />
                  </ListItem>
                ))}
                {kpis.topProducts.length === 0 && (
                  <ListItem disableGutters>
                    <ListItemText primary="No products" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function RowStat({ label, value }: { label: string; value: number }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}

function computeKpis(orders: Order[], products: Product[]): Kpis {
  const revenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const ordersByStatus: Record<OrderStatus, number> = {
    pending: 0,
    paid: 0,
    shipped: 0,
  };
  for (const o of orders) ordersByStatus[o.status] += 1;

  const activeProducts = products.filter((p) => p.status === "active").length;
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  // Top customer by total
  const totalsByCustomer = new Map<string, number>();
  for (const o of orders) {
    totalsByCustomer.set(
      o.customerName,
      (totalsByCustomer.get(o.customerName) ?? 0) + (Number(o.total) || 0)
    );
  }
  let topCustomer: { name: string; total: number } | null = null;
  for (const [name, total] of totalsByCustomer.entries()) {
    if (!topCustomer || total > topCustomer.total) topCustomer = { name, total };
  }

  // Top products by stock
  const topProducts = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5)
    .map((p) => ({ name: p.name, stock: p.stock }));

  // Last 5 orders by createdAt desc (yyyy-mm-dd sorts lexicographically)
  const lastOrders = [...orders]
    .sort((a, b) => {
      const da = a.createdAt ?? "";
      const db = b.createdAt ?? "";
      if (da === db) return (b.number ?? "").localeCompare(a.number ?? "");
      return db.localeCompare(da);
    })
    .slice(0, 5)
    .map((o) => ({
      id: o.id,
      number: o.number,
      customerName: o.customerName,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
    }));

  return {
    revenue,
    totalOrders: orders.length,
    ordersByStatus,
    activeProducts,
    lowStockProducts,
    topCustomer,
    topProducts,
    lastOrders,
  };
}
