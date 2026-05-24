import * as React from "react";
import { Outlet, Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Tooltip,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { useAuth } from "../hooks/useAuth";
import { useColorMode } from "../theme/useColorMode";

const drawerWidth = 256;

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: <DashboardIcon fontSize="small" /> },
  { label: "Products", to: "/products", icon: <Inventory2Icon fontSize="small" /> },
  { label: "Orders", to: "/orders", icon: <ReceiptLongIcon fontSize="small" /> },
  { label: "Customers", to: "/customers", icon: <PeopleIcon fontSize="small" /> },
];

function getInitials(email: string) {
  return email.split("@")[0].slice(0, 2).toUpperCase();
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, toggle } = useColorMode();
  const theme = useTheme();

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Brand */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AutoGraphIcon sx={{ color: "#fff", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
            StockFlow
          </Typography>
          <Typography variant="caption" color="text.secondary" lineHeight={1}>
            Management Suite
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Nav */}
      <Box sx={{ flex: 1, py: 1 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ px: 2.5, mt: 1.5, mb: 0.5, display: "block" }}
        >
          Main menu
        </Typography>
        <List disablePadding>
          {navItems.map((item) => {
            const selected = location.pathname === item.to;
            return (
              <ListItemButton
                key={item.to}
                component={RouterLink}
                to={item.to}
                selected={selected}
                onClick={() => setMobileOpen(false)}
                sx={{ py: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: selected ? 600 : 400 }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider />

      {/* User info at bottom */}
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontSize: "0.8rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
            {user?.email ? getInitials(user.email) : "U"}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {user?.email?.split("@")[0] ?? "User"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{
                textTransform: "capitalize",
                background: user?.role === "admin"
                  ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                  : "none",
                WebkitBackgroundClip: user?.role === "admin" ? "text" : "unset",
                WebkitTextFillColor: user?.role === "admin" ? "transparent" : "inherit",
                fontWeight: 600,
              }}
            >
              {user?.role ?? "viewer"}
            </Typography>
          </Box>
          <Tooltip title="Log out">
            <IconButton size="small" onClick={handleLogout} color="inherit">
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* APPBAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: mode === "light" ? "background.paper" : "background.paper",
          color: "text.primary",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Current page title derived from nav */}
          <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ display: { xs: "none", md: "block" } }}>
            {navItems.find((n) => n.to === location.pathname)?.label ?? "Dashboard"}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
            <IconButton onClick={toggle} size="small">
              {mode === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: "0.75rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              cursor: "pointer",
            }}
            title={user?.email}
          >
            {user?.email ? getInitials(user.email) : "U"}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* DRAWER */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
