import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import type { Product } from "../types/product";
import { getProductById } from "../services/productService";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [product, setProduct] = React.useState<Product | null>(null);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setError(null);
        setLoading(true);

        const found = await getProductById(id ?? "");

        if (!alive) return;

        if (!found) {
          setError("Product not found");
          setProduct(null);
        } else {
          setProduct(found);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error loading product";
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
        <Typography>Loading product...</Typography>
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!product) return <Alert severity="warning">No product</Alert>;

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography variant="h4">Product Detail</Typography>
      </Stack>

      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">{product.name}</Typography>
            <Typography color="text.secondary">ID: {product.id}</Typography>
            <Typography>SKU: {product.sku}</Typography>
            <Typography>Price: ${product.price}</Typography>
            <Typography>Stock: {product.stock}</Typography>
            <Typography>Status: {product.status}</Typography>
            <Typography>Created At: {product.createdAt}</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
