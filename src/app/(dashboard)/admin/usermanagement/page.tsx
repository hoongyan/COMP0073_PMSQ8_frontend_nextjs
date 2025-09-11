"use client";

import React, { useEffect } from "react";
import NextLink from "next/link";
import {
  Alert,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider as MuiDivider,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Popover,
  List,
  ListItem,
  ListItemText,
  Chip as MuiChip,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { green, orange, blue, grey } from "@mui/material/colors";
import {
  Add as AddIcon,
  Archive as ArchiveIcon,
  FilterList as FilterListIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { format, startOfDay, endOfDay, parseISO } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export type RowType = {
  userId: string;
  password: string;
  firstName: string;
  lastName: string;
  sex: string;
  dob: string;
  nationality: string;
  race: string;
  contactNo: string;
  email: string;
  blk: string;
  street: string;
  unitNo: string;
  postCode: string;
  registrationDate: string;
  lastLoginDate: string;
  role: "Analyst" | "Investigation Officer" | "Admin";
  status: "Pending" | "Active" | "Inactive";
};

const mockRows: RowType[] = [
  {
    userId: "U001",
    password: "hashedpass1",
    firstName: "John",
    lastName: "Doe",
    sex: "Male",
    dob: "1990-01-01",
    nationality: "Singaporean",
    race: "Chinese",
    contactNo: "91234567",
    email: "john.doe@example.com",
    blk: "123",
    street: "Main Street",
    unitNo: "#12-34",
    postCode: "123456",
    registrationDate: "2023-01-15",
    lastLoginDate: "2025-08-10",
    role: "Analyst",
    status: "Active",
  },
  {
    userId: "U002",
    password: "hashedpass2",
    firstName: "Jane",
    lastName: "Smith",
    sex: "Female",
    dob: "1985-05-15",
    nationality: "Singaporean",
    race: "Malay",
    contactNo: "98765432",
    email: "jane.smith@example.com",
    blk: "456",
    street: "Second Street",
    unitNo: "#05-67",
    postCode: "654321",
    registrationDate: "2023-02-20",
    lastLoginDate: "2025-08-09",
    role: "Investigation Officer",
    status: "Inactive",
  },
  {
    userId: "U003",
    password: "hashedpass3",
    firstName: "Alice",
    lastName: "Johnson",
    sex: "Female",
    dob: "1995-03-20",
    nationality: "Singaporean",
    race: "Indian",
    contactNo: "87654321",
    email: "alice.johnson@example.com",
    blk: "789",
    street: "Third Street",
    unitNo: "#03-45",
    postCode: "789012",
    registrationDate: "2025-08-12",
    lastLoginDate: "0000-00-00",
    role: "Analyst",
    status: "Pending",
  },
  {
    userId: "U004",
    password: "hashedpass4",
    firstName: "Bob",
    lastName: "Lee",
    sex: "Male",
    dob: "1988-07-10",
    nationality: "Singaporean",
    race: "Chinese",
    contactNo: "76543210",
    email: "bob.lee@example.com",
    blk: "101",
    street: "Fourth Street",
    unitNo: "#10-11",
    postCode: "101112",
    registrationDate: "2025-07-01",
    lastLoginDate: "0000-00-00",
    role: "Investigation Officer",
    status: "Pending",
  },
];

const mockResources = [
  { id: 1, name: "victim_info" },
  { id: 2, name: "reports" },
];

type LinkedAccess = { resourceName: string; permission: "View" | "Edit" };
const mockLinkedAccess: { [key: string]: LinkedAccess[] } = {
  U001: [{ resourceName: "victim_info", permission: "View" }],
  U002: [{ resourceName: "reports", permission: "Edit" }],
};

function DateFilterMenu({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  selectedRange,
  setSelectedRange,
}: {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  selectedRange: string;
  setSelectedRange: (range: string) => void;
}) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(
    null
  );
  const [popoverAnchorEl, setPopoverAnchorEl] =
    React.useState<HTMLElement | null>(null);

  const handleDateFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleRangeSelect = (
    range: string,
    event?: React.MouseEvent<HTMLElement>
  ) => {
    setSelectedRange(range);
    let newStartDate: Date | null = null;
    let newEndDate: Date | null = new Date();

    switch (range) {
      case "7days":
        newStartDate = new Date();
        newStartDate.setDate(newStartDate.getDate() - 7);
        newStartDate = startOfDay(newStartDate);
        newEndDate = endOfDay(newEndDate);
        break;
      case "30days":
        newStartDate = new Date();
        newStartDate.setDate(newStartDate.getDate() - 30);
        newStartDate = startOfDay(newStartDate);
        newEndDate = endOfDay(newEndDate);
        break;
      case "year":
        newStartDate = new Date();
        newStartDate.setFullYear(newStartDate.getFullYear() - 1);
        newStartDate = startOfDay(newStartDate);
        newEndDate = endOfDay(newEndDate);
        break;
      case "all":
        newStartDate = null;
        newEndDate = null;
        break;
      case "custom":
        if (event) {
          setPopoverAnchorEl(event.currentTarget);
        }
        return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setMenuAnchorEl(null);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handleApplyCustomRange = () => {
    setSelectedRange("custom");
    if (startDate) setStartDate(startOfDay(startDate));
    if (endDate) setEndDate(endOfDay(endDate));
    setPopoverAnchorEl(null);
  };

  const handleResetDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedRange("all");
    setPopoverAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleDateFilterClick}
        startIcon={<FilterListIcon />}
      >
        {selectedRange === "7days"
          ? "Last 7 Days"
          : selectedRange === "30days"
          ? "Last 30 Days"
          : selectedRange === "year"
          ? "Last Year"
          : selectedRange === "custom"
          ? "Custom Range"
          : "All Time"}
      </Button>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem onClick={() => handleRangeSelect("7days")}>
          Last 7 Days
        </MenuItem>
        <MenuItem onClick={() => handleRangeSelect("30days")}>
          Last 30 Days
        </MenuItem>
        <MenuItem onClick={() => handleRangeSelect("year")}>Last Year</MenuItem>
        <MenuItem onClick={() => handleRangeSelect("all")}>All Time</MenuItem>
        <MenuItem onClick={(event) => handleRangeSelect("custom", event)}>
          Custom Range
        </MenuItem>
        <MenuItem onClick={handleResetDateFilter}>Reset</MenuItem>
      </Menu>

      <Popover
        open={Boolean(popoverAnchorEl)}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ p: 2, minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>
            Select Registration/Last Login Date Range
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { size: "small" } }}
                format="dd/MM/yy"
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { size: "small" } }}
                format="dd/MM/yy"
              />
            </Box>
          </LocalizationProvider>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Button onClick={handleResetDateFilter} color="secondary">
              Reset
            </Button>
            <Button onClick={handlePopoverClose}>Cancel</Button>
            <Button onClick={handleApplyCustomRange} variant="contained">
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}

function descendingComparator(a: RowType, b: RowType, orderBy: keyof RowType) {
  if (["dob", "registrationDate", "lastLoginDate"].includes(orderBy)) {
    return new Date(b[orderBy]).getTime() - new Date(a[orderBy]).getTime();
  } else {
    return (b[orderBy] as string).localeCompare(a[orderBy] as string);
  }
}

function getComparator(
  order: "desc" | "asc",
  orderBy: keyof RowType
): (a: RowType, b: RowType) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(
  array: Array<RowType>,
  comparator: (a: RowType, b: RowType) => number
) {
  const stabilizedThis = array.map((el: RowType, index: number) => ({
    el,
    index,
  }));
  stabilizedThis.sort((a, b) => {
    const order = comparator(a.el, b.el);
    if (order !== 0) return order;
    return a.index - b.index;
  });
  return stabilizedThis.map((element) => element.el);
}

const headCells: Array<{
  id: keyof RowType;
  alignment: "left" | "center" | "right" | "justify" | "inherit" | undefined;
  label: string;
  disablePadding?: boolean;
}> = [
  { id: "userId", alignment: "left", label: "User ID" },
  { id: "firstName", alignment: "left", label: "First Name" },
  { id: "lastName", alignment: "left", label: "Last Name" },
  { id: "sex", alignment: "left", label: "Sex" },
  { id: "dob", alignment: "left", label: "DOB" },
  { id: "nationality", alignment: "left", label: "Nationality" },
  { id: "race", alignment: "left", label: "Race" },
  { id: "contactNo", alignment: "left", label: "Contact No" },
  { id: "email", alignment: "left", label: "Email" },
  { id: "blk", alignment: "left", label: "Block" },
  { id: "street", alignment: "left", label: "Street" },
  { id: "unitNo", alignment: "left", label: "Unit No" },
  { id: "postCode", alignment: "left", label: "Postal Code" },
  { id: "registrationDate", alignment: "left", label: "Registration Date" },
  { id: "lastLoginDate", alignment: "left", label: "Last Login Date" },
  { id: "role", alignment: "left", label: "Role" },
  { id: "status", alignment: "left", label: "Status" },
];

type EnhancedTableHeadProps = {
  numSelected: number;
  order: "desc" | "asc";
  orderBy: keyof RowType;
  rowCount: number;
  onSelectAllClick: (e: any) => void;
  onRequestSort: (e: any, property: keyof RowType) => void;
};

const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = (props) => {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property: keyof RowType) => (event: any) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell
          padding="checkbox"
          sx={{ backgroundColor: "#001f3f", color: "white" }}
        >
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all" }}
            sx={{ color: "white" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignment}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ backgroundColor: "#001f3f", color: "white" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{
                color: "white",
                "&:hover": { color: grey[300] },
                "&.Mui-active": { color: grey[300] },
                "& .MuiTableSortLabel-icon": { color: "white !important" },
              }}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          align="left"
          sx={{ backgroundColor: "#001f3f", color: "white" }}
        >
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

type EnhancedTableToolbarProps = {
  numSelected: number;
};

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected } = props;

  return (
    <Toolbar>
      <Box sx={{ minWidth: 150 }}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : null}
      </Box>
      <Box sx={{ flex: "1 1 100%" }} />
    </Toolbar>
  );
};

const UserDetailsPopup = ({
  open,
  row,
  linkedAccess,
  onClose,
}: {
  open: boolean;
  row: RowType | null;
  linkedAccess: LinkedAccess[];
  onClose: () => void;
}) => {
  if (!row) return null;

  const statusColors: { [key: string]: string } = {
    Active: green[500],
    Pending: orange[500],
    Inactive: grey[500],
  };

  const dateFields = ["dob", "registrationDate", "lastLoginDate"];

  const personalFields = [
    "firstName",
    "lastName",
    "sex",
    "dob",
    "nationality",
    "race",
  ];
  const contactFields = ["contactNo", "email"];
  const addressFields = ["blk", "street", "unitNo", "postCode"];
  const accountFields = [
    "userId",
    "registrationDate",
    "lastLoginDate",
    "role",
    "status",
  ];

  const renderField = (key: keyof RowType, value: string) => {
    let displayValue: string | JSX.Element = value;
    if (dateFields.includes(key)) {
      displayValue =
        value === "0000-00-00" ? "N/A" : format(parseISO(value), "dd/MM/yy");
    }
    if (key === "status") {
      const label = value === "Pending" ? "Pending Approval" : value;
      displayValue = (
        <MuiChip
          size="small"
          label={label}
          sx={{
            backgroundColor: statusColors[value],
            color: "#fff",
          }}
        />
      );
    }
    return displayValue;
  };

  const renderSection = (title: string, fields: (keyof RowType)[]) => (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ fontWeight: "bold", color: grey[800] }}
      >
        {title}
      </Typography>
      <Grid container spacing={2}>
        {fields.map((key) => {
          const value = row[key] as string;
          return (
            <Grid item xs={12} sm={6} key={key}>
              <Typography variant="body2" sx={{ color: grey[600] }}>
                <strong>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .replace(/^./, (str) => str.toUpperCase())}
                  :
                </strong>{" "}
                {renderField(key, value)}
              </Typography>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ bgcolor: "#f5f5f5", borderBottom: `1px solid ${grey[300]}` }}
      >
        User Details
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {renderSection("Personal Information", personalFields)}
        {renderSection("Contact Information", contactFields)}
        {renderSection("Address", addressFields)}
        {renderSection("Account Information", accountFields)}
        <MuiPaper variant="outlined" sx={{ p: 2, mt: 2 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold", color: grey[800] }}
          >
            Linked Access
          </Typography>
          {linkedAccess.length > 0 ? (
            <List disablePadding>
              {linkedAccess.map((access, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemText
                    primary={`Resource: ${
                      access.resourceName === "victim_info"
                        ? "Victim Information"
                        : "Reports"
                    }`}
                    secondary={`Permission: ${access.permission}`}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: "medium",
                    }}
                    secondaryTypographyProps={{
                      variant: "body2",
                      color: grey[600],
                    }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{ color: grey[600] }}>
              No linked access.
            </Typography>
          )}
        </MuiPaper>
      </DialogContent>
      <DialogActions sx={{ borderTop: `1px solid ${grey[300]}` }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const UserEditDialog = ({
  open,
  row,
  onClose,
  onSave,
}: {
  open: boolean;
  row: RowType | null;
  onClose: () => void;
  onSave: (updatedRow: RowType) => void;
}) => {
  const [editedRow, setEditedRow] = React.useState<RowType | null>(row);

  useEffect(() => {
    setEditedRow(row);
  }, [row]);

  const handleChange =
    (field: keyof RowType) =>
    (event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
      setEditedRow((prev) =>
        prev ? { ...prev, [field]: event.target.value as string } : null
      );
    };

  const handleSave = () => {
    if (editedRow) onSave(editedRow);
    onClose();
  };

  if (!editedRow) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit User Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {Object.entries(editedRow).map(([key, value]) => {
            if (
              [
                "userId",
                "registrationDate",
                "lastLoginDate",
                "password",
              ].includes(key)
            )
              return null;
            if (key === "role" || key === "status") return null;
            return (
              <Grid item xs={6} key={key}>
                <TextField
                  label={key.replace(/([A-Z])/g, " $1").toUpperCase()}
                  value={value}
                  onChange={handleChange(key as keyof RowType)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ManageDialog = ({
  open,
  selectedUsers,
  users,
  resources,
  linkedAccessMap,
  onClose,
  onActivate,
  onDeactivate,
  onResetPassword,
  onApplyAccess,
}: {
  open: boolean;
  selectedUsers: string[];
  users: RowType[];
  resources: { id: number; name: string }[];
  linkedAccessMap: { [key: string]: LinkedAccess[] };
  onClose: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  onResetPassword: () => void;
  onApplyAccess: (changes: Record<string, string>) => void;
}) => {
  const [accessForm, setAccessForm] = React.useState<
    Record<string, "None" | "View" | "Edit" | "Mixed">
  >({});
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState<
    "activate" | "deactivate" | "approve" | "reject"
  >("activate");

  useEffect(() => {
    if (open) {
      const newForm: Record<string, "None" | "View" | "Edit" | "Mixed"> = {};
      resources.forEach((res) => {
        const perms = selectedUsers.map((userId) => {
          return (
            linkedAccessMap[userId]?.find((a) => a.resourceName === res.name)
              ?.permission || "None"
          );
        });
        const uniquePerms = new Set(perms);
        newForm[res.name] =
          uniquePerms.size === 1
            ? ([...uniquePerms][0] as "None" | "View" | "Edit")
            : "Mixed";
      });
      setAccessForm(newForm);
    }
  }, [open, selectedUsers, resources, linkedAccessMap]);

  const areAllActive = selectedUsers.every(
    (id) => users.find((u) => u.userId === id)?.status === "Active"
  );
  const areAllInactive = selectedUsers.every(
    (id) => users.find((u) => u.userId === id)?.status === "Inactive"
  );
  const areAllPending = selectedUsers.every(
    (id) => users.find((u) => u.userId === id)?.status === "Pending"
  );

  const openConfirm = (
    action: "activate" | "deactivate" | "approve" | "reject"
  ) => {
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (confirmAction === "activate" || confirmAction === "approve")
      onActivate();
    else if (confirmAction === "deactivate" || confirmAction === "reject")
      onDeactivate();
    setConfirmDialogOpen(false);
  };

  const handleApply = () => {
    onApplyAccess(accessForm);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Manage ({selectedUsers.length} users)</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Status
            </Typography>
            {areAllActive && (
              <Button
                variant="contained"
                color="warning"
                onClick={() => openConfirm("deactivate")}
              >
                Deactivate
              </Button>
            )}
            {areAllInactive && (
              <Button
                variant="contained"
                color="success"
                onClick={() => openConfirm("activate")}
              >
                Activate
              </Button>
            )}
            {areAllPending && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => openConfirm("approve")}
                  sx={{ mr: 1 }}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => openConfirm("reject")}
                >
                  Reject
                </Button>
              </>
            )}
            {!areAllActive && !areAllInactive && !areAllPending && (
              <Typography color="error">
                Statuses are mixed. Select users with the same status to change.
              </Typography>
            )}
          </Box>
          <MuiDivider />
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reset Password
            </Typography>
            <Button
              variant="contained"
              onClick={onResetPassword}
              disabled={selectedUsers.length === 0}
            >
              Reset Password
            </Button>
          </Box>
          <MuiDivider />
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resource Access
            </Typography>
            {resources.map((res) => {
              const niceName =
                res.name === "victim_info" ? "Victim Information" : "Reports";
              return (
                <Box
                  key={res.id}
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Typography sx={{ minWidth: 150 }}>{niceName}</Typography>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Permission</InputLabel>
                    <Select
                      value={accessForm[res.name] || "None"}
                      label="Permission"
                      onChange={(e) =>
                        setAccessForm((prev) => ({
                          ...prev,
                          [res.name]: e.target.value as
                            | "None"
                            | "View"
                            | "Edit",
                        }))
                      }
                    >
                      {accessForm[res.name] === "Mixed" && (
                        <MenuItem value="Mixed" disabled>
                          Mixed
                        </MenuItem>
                      )}
                      <MenuItem value="None">None</MenuItem>
                      <MenuItem value="View">View</MenuItem>
                      <MenuItem value="Edit">Edit</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              );
            })}
            <Button variant="contained" onClick={handleApply}>
              Apply Access
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>
          Confirm{" "}
          {confirmAction === "approve"
            ? "Approval"
            : confirmAction === "reject"
            ? "Rejection"
            : confirmAction === "activate"
            ? "Activation"
            : "Deactivation"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure?{" "}
            {confirmAction === "approve" &&
              "This will activate the user account."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmStatusChange}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

function EnhancedTable() {
  const [order, setOrder] = React.useState<"desc" | "asc">("asc");
  const [orderBy, setOrderBy] = React.useState<keyof RowType>("lastName");
  const [selected, setSelected] = React.useState<Array<string>>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<RowType[]>(mockRows);
  const [linkedAccessMap, setLinkedAccessMap] = React.useState<{
    [key: string]: LinkedAccess[];
  }>(mockLinkedAccess);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [selectedRange, setSelectedRange] = React.useState("all");
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<RowType | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState<RowType | null>(null);
  const [manageOpen, setManageOpen] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: any;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showFeedback = (message: string, severity: any) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      searchTerm === "" ||
      row.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.contactNo.includes(searchTerm) ||
      row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.race.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.blk.includes(searchTerm) ||
      row.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.unitNo.includes(searchTerm) ||
      row.postCode.includes(searchTerm);
    const matchesRole = roleFilter === "All" || row.role === roleFilter;
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    const regDate = parseISO(row.registrationDate);
    const loginDate = parseISO(row.lastLoginDate);
    const matchesDate =
      (!startDate ||
        endOfDay(regDate) >= startOfDay(startDate) ||
        endOfDay(loginDate) >= startOfDay(startDate)) &&
      (!endDate ||
        startOfDay(regDate) <= endOfDay(endDate) ||
        startOfDay(loginDate) <= endOfDay(endDate));
    return matchesSearch && matchesRole && matchesStatus && matchesDate;
  });

  const handleRequestSort = (event: any, property: keyof RowType) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds: Array<string> = filteredRows.map(
        (n: RowType) => n.userId
      );
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: Array<string> = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (row: RowType) => {
    setSelectedRow(row);
    setDetailsOpen(true);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const handleEdit = (row: RowType) => {
    setEditRow(row);
    setEditOpen(true);
  };

  const handleSaveEdit = (updatedRow: RowType) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.userId === updatedRow.userId ? updatedRow : row
      )
    );
    showFeedback("User details updated successfully.", "success");
  };

  const handleManage = () => {
    if (selected.length > 0) setManageOpen(true);
  };

  const handleActivate = () => {
    setRows(
      rows.map((r) =>
        selected.includes(r.userId) ? { ...r, status: "Active" } : r
      )
    );
    showFeedback("Activated/Approved", "success");
  };

  const handleDeactivate = () => {
    setRows(
      rows.map((r) =>
        selected.includes(r.userId) ? { ...r, status: "Inactive" } : r
      )
    );
    showFeedback("Deactivated/Rejected", "success");
  };

  const handleResetPassword = () => {
    showFeedback(
      `Password reset initiated for ${selected.length} user(s)`,
      "success"
    );
  };

  const handleApplyAccess = (changes: Record<string, string>) => {
    Object.entries(changes).forEach(([resName, perm]) => {
      if (perm !== "Mixed") {
        selected.forEach((userId) => {
          setLinkedAccessMap((prev) => {
            const userAccess = [...(prev[userId] || [])];
            const index = userAccess.findIndex(
              (a) => a.resourceName === resName
            );
            if (perm === "None") {
              if (index > -1) {
                userAccess.splice(index, 1);
              }
            } else {
              if (index > -1) {
                userAccess[index].permission = perm as "View" | "Edit";
              } else {
                userAccess.push({
                  resourceName: resName,
                  permission: perm as "View" | "Edit",
                });
              }
            }
            return { ...prev, [userId]: userAccess };
          });
        });
      }
    });
    showFeedback("Access permissions updated successfully.", "success");
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filteredRows.length - page * rowsPerPage);

  const pendingCount = rows.filter((row) => row.status === "Pending").length;

  return (
    <div>
      {pendingCount > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {pendingCount} user(s) pending approval for registration.
        </Alert>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 2,
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            placeholder="Search Name/Contact/Email/Nationality/Race/Address"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon color="action" /> }}
            sx={{ minWidth: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              label="Role"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Analyst">Analyst</MenuItem>
              <MenuItem value="Investigation Officer">
                Investigation Officer
              </MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <DateFilterMenu
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={selected.length === 0}
            onClick={handleManage}
            sx={{ minWidth: "120px", minHeight: "35px" }}
          >
            Manage
          </Button>
        </Box>
      </Box>
      <MuiPaper>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {stableSort(filteredRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.userId);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={`${row.userId}-${index}`}
                      selected={isItemSelected}
                      onClick={() => handleRowClick(row)}
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleClick(event, row.userId);
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">{row.userId}</TableCell>
                      <TableCell align="left">{row.firstName}</TableCell>
                      <TableCell align="left">{row.lastName}</TableCell>
                      <TableCell align="left">{row.sex}</TableCell>
                      <TableCell align="left">
                        {format(parseISO(row.dob), "dd/MM/yy")}
                      </TableCell>
                      <TableCell align="left">{row.nationality}</TableCell>
                      <TableCell align="left">{row.race}</TableCell>
                      <TableCell align="left">{row.contactNo}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.blk}</TableCell>
                      <TableCell align="left">{row.street}</TableCell>
                      <TableCell align="left">{row.unitNo}</TableCell>
                      <TableCell align="left">{row.postCode}</TableCell>
                      <TableCell align="left">
                        {format(parseISO(row.registrationDate), "dd/MM/yy")}
                      </TableCell>
                      <TableCell align="left">
                        {row.lastLoginDate === "0000-00-00"
                          ? "N/A"
                          : format(parseISO(row.lastLoginDate), "dd/MM/yy")}
                      </TableCell>
                      <TableCell align="left">{row.role}</TableCell>
                      <TableCell align="left">
                        <MuiChip
                          size="small"
                          label={row.status}
                          sx={{
                            backgroundColor:
                              row.status === "Active"
                                ? green[500]
                                : row.status === "Pending"
                                ? orange[500]
                                : grey[500],
                            color: "#fff",
                          }}
                        />
                      </TableCell>
                      <TableCell padding="none" align="left">
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "nowrap",
                            mr: 2,
                          }}
                        >
                          <IconButton
                            aria-label="edit"
                            size="large"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleEdit(row);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={headCells.length + 2} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </MuiPaper>
      <UserDetailsPopup
        open={detailsOpen}
        row={selectedRow}
        linkedAccess={linkedAccessMap[selectedRow?.userId || ""] || []}
        onClose={() => setDetailsOpen(false)}
      />
      <UserEditDialog
        open={editOpen}
        row={editRow}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEdit}
      />
      <ManageDialog
        open={manageOpen}
        selectedUsers={selected}
        users={rows}
        resources={mockResources}
        linkedAccessMap={linkedAccessMap}
        onClose={() => setManageOpen(false)}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onResetPassword={handleResetPassword}
        onApplyAccess={handleApplyAccess}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

function UserManagement() {
  return (
    <React.Fragment>
      <Grid container direction="column" spacing={6}>
        <Grid item xs={12}>
          <Typography
            variant="h3"
            gutterBottom
            display="inline"
            sx={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 600,
              letterSpacing: 0.6,
              color: "#001f3f",
            }}
          >
            User Management
          </Typography>

          <MuiBreadcrumbs aria-label="Breadcrumb" sx={{ mt: 2 }}>
            <Link component={NextLink} href="/">
              Home
            </Link>
            <Typography>User Management</Typography>
          </MuiBreadcrumbs>
          <Box sx={{ height: "20px" }} />
        </Grid>
        <Grid item xs={12}>
          <EnhancedTable />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default UserManagement;


