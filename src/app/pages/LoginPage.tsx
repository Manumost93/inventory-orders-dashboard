import * as React from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { useAuth } from "../hooks/useAuth";

type LocationState = { from?: string };

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state: LocationState | null };
  const theme = useTheme();

  const [email, setEmail] = React.useState("demo@company.com");
  const [password, setPassword] = React.useState("1234");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const from = location.state?.from ?? "/dashboard";

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch {
      setError("Invalid credentials. Use demo@company.com / 1234");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f0fdf4 100%)"
            : "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      }}
    >
      {/* Left panel – hidden on mobile */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          px: 8,
          background:
            theme.palette.mode === "light"
              ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #10b981 100%)"
              : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #059669 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            top: -100,
            right: -100,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            bottom: -80,
            left: -80,
          }}
        />

        <Stack spacing={3} sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AutoGraphIcon sx={{ fontSize: 28, color: "#fff" }} />
            </Box>
            <Typography variant="h5" fontWeight={800}>
              StockFlow
            </Typography>
          </Box>

          <Typography variant="h3" fontWeight={800} lineHeight={1.15}>
            Manage your inventory with confidence
          </Typography>

          <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 420, lineHeight: 1.7 }}>
            A complete dashboard for inventory, orders, and customer management.
            Built with React 19, TypeScript, and Material UI.
          </Typography>

          <Stack spacing={1.5} sx={{ mt: 2 }}>
            {["Real-time KPI metrics & charts", "Full CRUD with role-based access", "Dark / light mode"].map(
              (feat) => (
                <Box key={feat} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                    }}
                  >
                    ✓
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {feat}
                  </Typography>
                </Box>
              )
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Right panel – login form */}
      <Box
        sx={{
          flex: { xs: 1, md: "0 0 460px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 380 }}>
          {/* Mobile logo */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1,
              mb: 4,
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
              }}
            >
              <AutoGraphIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Typography variant="h6" fontWeight={800}>
              StockFlow
            </Typography>
          </Box>

          <Stack spacing={0.5} mb={4}>
            <Typography variant="h4" fontWeight={800}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account to continue
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
                size="large"
                sx={{ mt: 0.5, py: 1.4 }}
              >
                {loading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={18} color="inherit" />
                    <span>Signing in…</span>
                  </Stack>
                ) : (
                  "Sign in"
                )}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Demo credentials
            </Typography>
          </Divider>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.06),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                ADMIN ACCESS
              </Typography>
              <Typography variant="body2" fontFamily="monospace">
                demo@company.com / 1234
              </Typography>
            </Stack>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            textAlign="center"
            mt={4}
          >
            Built by{" "}
            <Box
              component="a"
              href="https://github.com/Manumost93"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "primary.main", textDecoration: "none", fontWeight: 600 }}
            >
              Manuel Honrado
            </Box>
            {" "}· React 19 + TypeScript + MUI
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
