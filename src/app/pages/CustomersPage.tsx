import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { Customer } from "../types/customer";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/customerService";

type Toast = { open: boolean; message: string; severity: "success" | "error" | "info" };
type Segment = Customer["segment"];

export default function CustomersPage() {
  const navigate = useNavigate();

  const [rows, setRows] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [segmentFilter, setSegmentFilter] = React.useState<"all" | Segment>("all");

  const [busy, setBusy] = React.useState<null | "create" | "edit" | "delete" | "refresh">(null);
  const [toast, setToast] = React.useState<Toast>({ open: false, message: "", severity: "info" });
  const showToast = (message: string, severity: Toast["severity"]) => setToast({ open: true, message, severity });

  // Create
  const [openCreate, setOpenCreate] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newSegment, setNewSegment] = React.useState<Segment>("smb");

  // Edit
  const [openEdit, setOpenEdit] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");
  const [editEmail, setEditEmail] = React.useState("");
  const [editSegment, setEditSegment] = React.useState<Segment>("smb");

  // Delete
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      setError(null);
      setBusy("refresh");
      setLoading(true);
      const data = await getCustomers();
      setRows(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error loading customers";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
      setBusy(null);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const filteredRows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((c) => {
      const matchesSearch =
        q === "" ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);

      const matchesSegment = segmentFilter === "all" || c.segment === segmentFilter;
      return matchesSearch && matchesSegment;
    });
  }, [rows, search, segmentFilter]);

  const handleCreate = async () => {
    const name = newName.trim();
    const email = newEmail.trim();

    if (!name || !email.includes("@")) {
      showToast("Please enter a valid name and email.", "info");
      return;
    }

    try {
      setError(null);
      setBusy("create");
      const created = await createCustomer({ name, email, segment: newSegment });
      setRows((prev) => [...prev, created]);
      setOpenCreate(false);
      setNewName("");
      setNewEmail("");
      setNewSegment("smb");
      showToast("Customer created.", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error creating customer";
      setError(message);
      showToast(message, "error");
    } finally {
      setBusy(null);
    }
  };

  const openEditFor = (c: Customer) => {
    setEditId(c.id);
    setEditName(c.name);
    setEditEmail(c.email);
    setEditSegment(c.segment);
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    if (!editId) return;
    const name = editName.trim();
    const email = editEmail.trim();

    if (!name || !email.includes("@")) {
      showToast("Please enter a valid name and email.", "info");
      return;
    }

    try {
      setError(null);
      setBusy("edit");
      const updated = await updateCustomer(editId, { name, email, segment: editSegment });
      setRows((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setOpenEdit(false);
      setEditId(null);
      showToast("Customer updated.", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error updating customer";
      setError(message);
      showToast(message, "error");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setError(null);
      setBusy("delete");
      await deleteCustomer(deleteId);
      setRows((prev) => prev.filter((c) => c.id !== deleteId));
      setDeleteId(null);
      showToast("Customer deleted.", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error deleting customer";
      setError(message);
      showToast(message, "error");
    } finally {
      setBusy(null);
    }
  };

  const columns: GridColDef<Customer>[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
    { field: "segment", headerName: "Segment", width: 130 },
    { field: "createdAt", headerName: "Created", width: 140 },
    {
      field: "actions",
      headerName: "",
      width: 260,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => navigate(`/customers/${params.row.id}`)}>
            View
          </Button>
          <Button size="small" onClick={() => openEditFor(params.row)}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={() => setDeleteId(params.row.id)}>
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
        Loading customers...
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Stack spacing={2} mb={2}>
          <Alert severity="error">{error}</Alert>
          <Button variant="outlined" onClick={load} disabled={busy === "refresh"}>
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
            label="Search (name/email)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            size="small"
            value={segmentFilter}
            onChange={(e) =>
  setSegmentFilter(e.target.value as "all" | "smb" | "mid" | "enterprise")
}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="smb">smb</MenuItem>
            <MenuItem value="mid">mid</MenuItem>
            <MenuItem value="enterprise">enterprise</MenuItem>
          </Select>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={load} disabled={busy === "refresh"}>
            Refresh
          </Button>
          <Button variant="contained" onClick={() => setOpenCreate(true)} disabled={busy !== null}>
            Add Customer
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

      {/* CREATE */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Add Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1} sx={{ minWidth: { xs: 260, sm: 420 } }}>
            <TextField label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <TextField label="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <Select value={newSegment} onChange={(e) => setNewSegment(e.target.value as Segment)}>
              <MenuItem value="smb">smb</MenuItem>
              <MenuItem value="mid">mid</MenuItem>
              <MenuItem value="enterprise">enterprise</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)} disabled={busy === "create"}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={busy === "create"}>
            {busy === "create" ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1} sx={{ minWidth: { xs: 260, sm: 420 } }}>
            <TextField label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <TextField label="Email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            <Select value={editSegment} onChange={(e) => setEditSegment(e.target.value as Segment)}>
              <MenuItem value="smb">smb</MenuItem>
              <MenuItem value="mid">mid</MenuItem>
              <MenuItem value="enterprise">enterprise</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} disabled={busy === "edit"}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} disabled={busy === "edit"}>
            {busy === "edit" ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this customer?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} disabled={busy === "delete"}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={busy === "delete"}>
            {busy === "delete" ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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
