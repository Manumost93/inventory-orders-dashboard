import * as React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  alpha,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
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
  lastOrders: Array<Pick<Order, "id" | "number" | "customerName" | "total" | "status" | "createdAt">>;
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
};

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "#f59e0b",
  paid: "#10b981",
  shipped: "#6366f1",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const theme = useTheme();

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
        if (alive) setKpis(computeKpis(orders, products));
      } catch (err: unknown) {
        if (alive) setError(err instanceof Error ? err.message : "Error loading dashboard");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2} height={200} justifyContent="center">
        <CircularProgress size={28} />
        <Typography color="text.secondary">Loading dashboard…</Typography>
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!kpis) return <Alert severity="warning">No data available</Alert>;

  const pieData = (["pending", "paid", "shipped"] as OrderStatus[])
    .map((s) => ({ name: STATUS_LABELS[s], value: kpis.ordersByStatus[s], color: STATUS_COLORS[s] }))
    .filter((d) => d.value > 0);

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Welcome back — here's what's happening today
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button component={RouterLink} to="/orders" variant="outlined" size="small" endIcon={<ArrowForwardIcon />}>
            Orders
          </Button>
          <Button component={RouterLink} to="/products" variant="contained" size="small" endIcon={<ArrowForwardIcon />}>
            Products
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2.5}>
        {/* ── KPI Cards ── */}
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Total Revenue"
            value={formatMoney(kpis.revenue)}
            sub="All orders combined"
            icon={<TrendingUpIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Total Orders"
            value={String(kpis.totalOrders)}
            sub="All statuses"
            icon={<ShoppingCartIcon />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Active Products"
            value={String(kpis.activeProducts)}
            sub="Status = active"
            icon={<Inventory2Icon />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Low Stock Alerts"
            value={String(kpis.lowStockProducts)}
            sub="Stock < 10 units"
            icon={<WarningAmberIcon />}
            color={theme.palette.warning.main}
            urgent={kpis.lowStockProducts > 0}
          />
        </Grid>

        {/* ── Revenue Chart ── */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="h6">Revenue Trend</Typography>
                  <Typography variant="caption" color="text.secondary">Monthly revenue over time</Typography>
                </Box>
              </Stack>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={kpis.monthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                    width={50}
                  />
                  <ReTooltip
                    formatter={(v: number) => [formatMoney(v), "Revenue"]}
                    contentStyle={{
                      background: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2.5}
                    fill="url(#colorRev)"
                    dot={false}
                    activeDot={{ r: 5, fill: theme.palette.primary.main }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Orders by Status Donut ── */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" mb={0.5}>Orders by Status</Typography>
              <Typography variant="caption" color="text.secondary">Distribution breakdown</Typography>
              <Box sx={{ mt: 1 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <Typography component="span" variant="caption" color="text.secondary">
                          {value}
                        </Typography>
                      )}
                    />
                    <ReTooltip
                      formatter={(v: number) => [v, "Orders"]}
                      contentStyle={{
                        background: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Last 5 Orders ── */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="h6">Recent Orders</Typography>
                  <Typography variant="caption" color="text.secondary">Last 5 orders placed</Typography>
                </Box>
                <Button component={RouterLink} to="/orders" size="small" endIcon={<ArrowForwardIcon />}>
                  View all
                </Button>
              </Stack>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Status</TableCell>
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
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                            {o.number}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{o.customerName}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {formatMoney(Number(o.total) || 0)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={o.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {kpis.lastOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography variant="body2" color="text.secondary">No orders yet</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Top Products ── */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="h6">Top Inventory</Typography>
                  <Typography variant="caption" color="text.secondary">Highest stock products</Typography>
                </Box>
                <Button component={RouterLink} to="/products" size="small" endIcon={<ArrowForwardIcon />}>
                  Manage
                </Button>
              </Stack>

              <Stack spacing={1.5}>
                {kpis.topProducts.map((p, i) => (
                  <TopProductRow key={p.name} rank={i + 1} name={p.name} stock={p.stock} />
                ))}
                {kpis.topProducts.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No products found</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Top Customer ── */}
        {kpis.topCustomer && (
          <Grid item xs={12}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${alpha("#6366f1", 0.08)} 0%, ${alpha("#10b981", 0.06)} 100%)`,
              }}
            >
              <CardContent>
                <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={2} justifyContent="space-between">
                  <Box>
                    <Typography variant="overline" color="primary">Top Customer</Typography>
                    <Typography variant="h5" fontWeight={700}>{kpis.topCustomer.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Highest total spend across all orders
                    </Typography>
                  </Box>
                  <Box textAlign={{ xs: "left", sm: "right" }}>
                    <Typography variant="h4" fontWeight={800} color="primary">
                      {formatMoney(kpis.topCustomer.total)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Total revenue</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

// ── Sub-components ──

function KpiCard({
  label,
  value,
  sub,
  icon,
  color,
  urgent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  urgent?: boolean;
}) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="overline" color="text.secondary" display="block" mb={0.5}>
              {label}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={800}
              color={urgent ? "warning.main" : "text.primary"}
            >
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {sub}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: alpha(color, 0.12),
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function StatusChip({ status }: { status: OrderStatus }) {
  const colorMap: Record<OrderStatus, "warning" | "success" | "primary"> = {
    pending: "warning",
    paid: "success",
    shipped: "primary",
  };
  return (
    <Chip
      label={STATUS_LABELS[status]}
      color={colorMap[status]}
      size="small"
      variant="outlined"
    />
  );
}

function TopProductRow({ rank, name, stock }: { rank: number; name: string; stock: number }) {
  const theme = useTheme();
  const max = 200;
  const pct = Math.min((stock / max) * 100, 100);
  const low = stock < 10;

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{ width: 16, textAlign: "center" }}
          >
            {rank}
          </Typography>
          <Typography variant="body2" fontWeight={500}>{name}</Typography>
        </Stack>
        <Typography
          variant="body2"
          fontWeight={600}
          color={low ? "warning.main" : "text.primary"}
        >
          {stock} units
        </Typography>
      </Stack>
      <Box
        sx={{
          height: 4,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.divider, 0.5),
          overflow: "hidden",
          ml: 3,
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 2,
            bgcolor: low ? "warning.main" : "primary.main",
            transition: "width 0.6s ease",
          }}
        />
      </Box>
    </Box>
  );
}

// ── Data computation ──

function computeKpis(orders: Order[], products: Product[]): Kpis {
  const revenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const ordersByStatus: Record<OrderStatus, number> = { pending: 0, paid: 0, shipped: 0 };
  for (const o of orders) ordersByStatus[o.status] += 1;

  const activeProducts = products.filter((p) => p.status === "active").length;
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  const totalsByCustomer = new Map<string, number>();
  for (const o of orders) {
    totalsByCustomer.set(o.customerName, (totalsByCustomer.get(o.customerName) ?? 0) + (Number(o.total) || 0));
  }
  let topCustomer: { name: string; total: number } | null = null;
  for (const [name, total] of totalsByCustomer.entries()) {
    if (!topCustomer || total > topCustomer.total) topCustomer = { name, total };
  }

  const topProducts = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5)
    .map((p) => ({ name: p.name, stock: p.stock }));

  const lastOrders = [...orders]
    .sort((a, b) => {
      const da = a.createdAt ?? "";
      const db = b.createdAt ?? "";
      if (da === db) return (b.number ?? "").localeCompare(a.number ?? "");
      return db.localeCompare(da);
    })
    .slice(0, 5)
    .map((o) => ({ id: o.id, number: o.number, customerName: o.customerName, total: o.total, status: o.status, createdAt: o.createdAt }));

  // Build monthly revenue from orders createdAt dates
  const monthMap = new Map<string, { revenue: number; orders: number }>();
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (const o of orders) {
    if (!o.createdAt) continue;
    const d = new Date(o.createdAt);
    if (isNaN(d.getTime())) continue;
    const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    const cur = monthMap.get(key) ?? { revenue: 0, orders: 0 };
    cur.revenue += Number(o.total) || 0;
    cur.orders += 1;
    monthMap.set(key, cur);
  }

  const monthlyRevenue = Array.from(monthMap.entries())
    .sort(([a], [b]) => {
      const [am, ay] = a.split(" ");
      const [bm, by] = b.split(" ");
      const dateA = new Date(`${am} 1, ${ay}`).getTime();
      const dateB = new Date(`${bm} 1, ${by}`).getTime();
      return dateA - dateB;
    })
    .map(([month, data]) => ({ month, ...data }));

  return { revenue, totalOrders: orders.length, ordersByStatus, activeProducts, lowStockProducts, topCustomer, topProducts, lastOrders, monthlyRevenue };
}
