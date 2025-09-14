"use client";

import React, { useEffect, useState } from "react";
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
import { green, orange, grey } from "@mui/material/colors";
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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { fetchUsers, createUser, updateUser, deleteUser, resetPassword, RowType } from "@/lib/users";

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
        Registration Date - {" "}
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
  const aVal = a[orderBy];
  const bVal = b[orderBy];
  if (["dob", "registrationDate"].includes(orderBy)) {
    const aDate = aVal === "N/A" ? new Date(0) : parseISO(aVal as string);
    const bDate = bVal === "N/A" ? new Date(0) : parseISO(bVal as string);
    return bDate.getTime() - aDate.getTime();
  } else {
    if (typeof aVal === 'number' && typeof bVal === 'number') { 
      return bVal - aVal;
    } else {
      return String(bVal).localeCompare(String(aVal));
     }
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
  { id: "race", alignment: "left", label: "Race" },
  { id: "contactNo", alignment: "left", label: "Contact No" },
  { id: "email", alignment: "left", label: "Email" },
  // { id: "postCode", alignment: "left", label: "Postal Code" },
  { id: "registrationDate", alignment: "left", label: "Registration Date" },
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
  onClose,
}: {
  open: boolean;
  row: RowType | null;
  onClose: () => void;
}) => {
  if (!row) return null; 


  const statusColors: { [key: string]: string } = {
    ACTIVE: green[500],
    PENDING: orange[500],
    INACTIVE: grey[500],
  };


  const capitalizedRole = (role: string) =>
    role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* DialogTitle: Matches persons_page.tsx - background light grey, border bottom */}
      <DialogTitle
        sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}
      >
        User Details - {row.firstName} {row.lastName}
      </DialogTitle>
      {/* DialogContent: Padding 4, background light grey to make it feel bigger/spacier */}
      <DialogContent sx={{ p: 4, backgroundColor: "grey.50" }}>
        {/* Section 1: Account Information */}
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            backgroundColor: "white",
            boxShadow: 1,
            mb: 3,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 2 }}>
            Account Information
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  User ID:
                </Typography>
                <Typography>{row.userId}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Registration Date:
                </Typography>
                <Typography>
                  {row.registrationDate
                    ? format(parseISO(row.registrationDate), "dd/MM/yy")
                    : "-"}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Role:
                </Typography>
                <Typography>{capitalizedRole(row.role)}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Status:
                </Typography>
                <MuiChip
                  size="small"
                  // label={row.status === "PENDING" ? "Pending Approval" : row.status.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())}
                  label={row.status.toUpperCase()}
                  sx={{
                    backgroundColor: statusColors[row.status],
                    color: "#fff",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Section 2: Personal Information */}
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            backgroundColor: "white",
            boxShadow: 1,
            mb: 3,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 2 }}>
            Personal Information
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  First Name:
                </Typography>
                <Typography>{row.firstName}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Last Name:
                </Typography>
                <Typography>{row.lastName}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Sex:
                </Typography>
                <Typography>{row.sex || "-"}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Date of Birth:
                </Typography>
                <Typography>
                  {row.dob ? format(parseISO(row.dob), "dd/MM/yy") : "-"}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Nationality:
                </Typography>
                <Typography>{row.nationality || "-"}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Race:
                </Typography>
                <Typography>{row.race || "-"}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Section 3: Contact Information */}
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            backgroundColor: "white",
            boxShadow: 1,
            mb: 3,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 2 }}>
            Contact Information
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Contact No:
                </Typography>
                <Typography>{row.contactNo || "-"}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Email:
                </Typography>
                <Typography>{row.email || "-"}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Section 4: Address */}
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            backgroundColor: "white",
            boxShadow: 1,
            mb: 3,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 2 }}>
            Address
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Block:
                </Typography>
                <Typography>{row.blk || "-"}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Street:
                </Typography>
                <Typography>{row.street || "-"}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Unit No:
                </Typography>
                <Typography>{row.unitNo || "-"}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Postal Code:
                </Typography>
                <Typography>{row.postCode || "-"}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: "1px solid #ddd", px: 4 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const UserEditDialog = ({
  open,
  row,
  onClose,
  onSave,
  isCreate,
}: {
  open: boolean;
  row: Partial<RowType>;
  onClose: () => void;
  onSave: (updatedRow: Partial<RowType> & { password?: string }) => void;
  isCreate: boolean;
}) => {
  const schema = yup.object().shape({
    firstName: yup.string().required("First Name is required").min(2, "Minimum 2 characters"),
    lastName: yup.string().required("Last Name is required").min(2, "Minimum 2 characters"),
    sex: yup.string().oneOf(["MALE", "FEMALE", "OTHER"], "Invalid sex"),
    dob: yup.date().nullable().max(new Date(), "DOB cannot be in the future"),
    nationality: yup.string(),
    race: yup.string(),
    contactNo: yup.string().required("Contact No is required").matches(/^\d{8,15}$/, "8-15 digits only"),
    email: yup.string().required("Email is required").email("Invalid email"),
    blk: yup.string(),
    street: yup.string(),
    unitNo: yup.string(),
    postCode: yup.string(),
    role: yup.string().required("Role is required").oneOf(["ADMIN", "INVESTIGATION OFFICER", "ANALYST"], "Invalid role"),
    status: yup.string().required("Status is required").oneOf(["PENDING", "ACTIVE", "INACTIVE"], "Invalid status"),
    password: isCreate ? yup.string().required("Password is required").min(8, "Minimum 8 characters") : yup.string().notRequired(),
  });

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...row,
      dob: row.dob ? parseISO(row.dob as string) : null,
    },
  });

  useEffect(() => {
    reset({
      ...row,
      dob: row.dob ? parseISO(row.dob as string) : null,
    });
  }, [row, reset]);

  const onSubmit = (data: any) => {
    const uppercasedData = {
      ...data,
      firstName: data.firstName.toUpperCase(),
      lastName: data.lastName.toUpperCase(),
      sex: data.sex.toUpperCase(),
      nationality: data.nationality.toUpperCase(),
      race: data.race.toUpperCase(),
      blk: data.blk?.toUpperCase() || "",
      street: data.street?.toUpperCase() || "",
      unitNo: data.unitNo?.toUpperCase() || "",
      postCode: data.postCode?.toUpperCase() || "",
      // role: data.role.toUpperCase().replace(" ", "_"),
      role: data.role.toUpperCase(),
      status: data.status.toUpperCase(),
      dob: data.dob ? format(data.dob, "yyyy-MM-dd") : "",
    };
    onSave(uppercasedData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
        {isCreate ? "Add User" : "Edit User"}
      </DialogTitle>
      <DialogContent sx={{ p: 4, backgroundColor: "white" }}>
        <form>
          <Box
            sx={{
              border: 0,
              borderRadius: 1,
              p: 2,
              backgroundColor: "white",
              mb: 3,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 2 }}>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} 
                      label="First Name"
                      error={!!errors.firstName} 
                      required 
                      helperText={errors.firstName?.message} 
                      fullWidth margin="normal" 
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} 
                      label="Last Name" 
                      error={!!errors.lastName} 
                      required 
                      helperText={errors.lastName?.message} 
                      fullWidth margin="normal" 
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="sex"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal" error={!!errors.sex} sx={{ minWidth: 200 }}>
                      <InputLabel>Sex *</InputLabel>
                      <Select {...field} label="Sex">
                        <MenuItem value="MALE">Male</MenuItem>
                        <MenuItem value="FEMALE">Female</MenuItem>
                        <MenuItem value="OTHER">Other</MenuItem>
                      </Select>
                      {errors.sex && <Typography color="error">{errors.sex.message}</Typography>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        {...field}
                        label="DOB"
                        slotProps={{ textField: { fullWidth: true, margin: "normal", error: !!errors.dob, helperText: errors.dob?.message } }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="nationality"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Nationality" error={!!errors.nationality} helperText={errors.nationality?.message} fullWidth margin="normal" />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="race"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Race" error={!!errors.race} helperText={errors.race?.message} fullWidth margin="normal" />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              border: 0,
              borderRadius: 1,
              p: 2,
              backgroundColor: "white",
              mb: 3,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 2 }}>
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="contactNo"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} 
                      label="Contact No" 
                      error={!!errors.contactNo} 
                      required
                      helperText={errors.contactNo?.message} 
                      fullWidth margin="normal" />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} 
                      label="Email" 
                      error={!!errors.email} 
                      required
                      helperText={errors.email?.message} 
                      fullWidth margin="normal" 
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              border: 0,
              borderRadius: 1,
              p: 2,
              backgroundColor: "white",
              mb: 3,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 2 }}>
              Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="blk"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} 
                      label="Blk" 
                      error={!!errors.blk} 
                      helperText={errors.blk?.message} 
                      fullWidth margin="normal" 
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="street"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} 
                      label="Street" 
                      error={!!errors.street} 
                      helperText={errors.street?.message} 
                      fullWidth margin="normal" 
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="unitNo"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} 
                      label="Unit No" 
                      error={!!errors.unitNo} 
                      helperText={errors.unitNo?.message} 
                      fullWidth margin="normal" 
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="postCode"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} 
                      label="Postal Code" 
                      error={!!errors.postCode} 
                      helperText={errors.postCode?.message} 
                      fullWidth margin="normal" 
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              border: 0,
              borderRadius: 1,
              p: 2,
              backgroundColor: "white",
              mb: 3,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 2 }}>
              Account Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal" error={!!errors.role} sx={{ minWidth: 200 }}>
                      <InputLabel>Role *</InputLabel>
                      <Select {...field} label="Role *">
                        <MenuItem value="ADMIN">Admin</MenuItem>
                        <MenuItem value="INVESTIGATION OFFICER">Investigation Officer</MenuItem>
                        <MenuItem value="ANALYST">Analyst</MenuItem>
                      </Select>
                      {errors.role && <Typography color="error">{errors.role.message}</Typography>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal" error={!!errors.status} sx={{ minWidth: '100%' }}>
                      <InputLabel>Status *</InputLabel>
                      <Select {...field} label="Status *">
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="ACTIVE">Active</MenuItem>
                        <MenuItem value="INACTIVE">Inactive</MenuItem>
                      </Select>
                      {errors.status && <Typography color="error">{errors.status.message}</Typography>}
                    </FormControl>
                  )}
                />
              </Grid>
              {isCreate && (
                <Grid item xs={12}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} type="password" label="Password *" error={!!errors.password} helperText={errors.password?.message} fullWidth margin="normal" />
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </form>
      </DialogContent>
      <DialogActions sx={{ borderTop: "1px solid #ddd", px: 4 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ResetPasswordDialog = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}) => {
  const schema = yup.object().shape({
    password: yup.string().required("Password is required").min(8, "Minimum 8 characters"),
  });

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    onConfirm(data.password);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        <form>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField {...field} type="password" label="New Password *" error={!!errors.password} helperText={errors.password?.message} fullWidth margin="normal" />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ManageDialog = ({
  open,
  selectedUsers,
  users,
  onClose,
  onActivate,
  onDeactivate,
  onResetPassword,
  onBulkDelete,
}: {
  open: boolean;
  selectedUsers: string[];
  users: RowType[];
  onClose: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  onResetPassword: (password: string) => void;
  onBulkDelete: () => void;
}) => {
  const [resetOpen, setResetOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"activate" | "deactivate">("activate");

  const openConfirm = (action: "activate" | "deactivate") => {
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (confirmAction === "activate") onActivate();
    else if (confirmAction === "deactivate") onDeactivate();
    setConfirmDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    onBulkDelete();
    setDeleteConfirmOpen(false);
    onClose(); 
  };

  const areAllActive = selectedUsers.every(
    (id) => users.find((u) => u.userId.toString() === id)?.status === "ACTIVE"
  );
  const areAllInactive = selectedUsers.every(
    (id) => users.find((u) => u.userId.toString() === id)?.status === "INACTIVE"
  );
  const areAllPending = selectedUsers.every(
    (id) => users.find((u) => u.userId.toString() === id)?.status === "PENDING"
  );

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
                  onClick={() => openConfirm("activate")}
                  sx={{ mr: 1 }}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => openConfirm("deactivate")}
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
              onClick={() => setResetOpen(true)}
              disabled={selectedUsers.length === 0}
            >
              Reset Password
            </Button>
          </Box>
          <MuiDivider />
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              Delete Users
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={selectedUsers.length === 0}
            >
              Delete Selected
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
          Confirm {confirmAction === "activate" ? "Activation/Approval" : "Deactivation/Rejection"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmStatusChange}>Confirm</Button>
        </DialogActions>
      </Dialog>
  
      {/* Delete confirm dialog - now a sibling, not nested */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete these {selectedUsers.length} users? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
  
      <ResetPasswordDialog open={resetOpen} onClose={() => setResetOpen(false)} onConfirm={onResetPassword} />
    </Dialog>
  );
};


function EnhancedTable() {
  const [order, setOrder] = React.useState<"desc" | "asc">("asc");
  const [orderBy, setOrderBy] = React.useState<keyof RowType>("userId");
  const [selected, setSelected] = React.useState<Array<string>>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<RowType[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [selectedRange, setSelectedRange] = React.useState("all");
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<RowType | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState<Partial<RowType>>({});
  const [isCreate, setIsCreate] = React.useState(false);
  const [manageOpen, setManageOpen] = React.useState(false);
  const [singleDeleteConfirmOpen, setSingleDeleteConfirmOpen] = useState(false);
  const [singleDeleteId, setSingleDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: any;
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUsers();
        setRows(data);
      } catch (error) {
        showFeedback((error as Error).message, "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
      row.race.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.blk?.includes(searchTerm) ||
      row.street?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.unitNo?.includes(searchTerm) ||
      row.postCode?.includes(searchTerm);
    const matchesRole = roleFilter === "All" || row.role === roleFilter.toUpperCase();
    const matchesStatus = statusFilter === "All" || row.status === statusFilter.toUpperCase();
    const regDate = parseISO(row.registrationDate);
    const matchesDate =
      (!startDate || endOfDay(regDate) >= startOfDay(startDate)) &&
      (!endDate || startOfDay(regDate) <= endOfDay(endDate));
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
        (n: RowType) => n.userId.toString()
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
    setIsCreate(false);
    setEditOpen(true);
  };

  const handleAdd = () => {
    setEditRow({
      firstName: "",
      lastName: "",
      sex: "",
      dob: "",
      nationality: "",
      race: "",
      contactNo: "",
      email: "",
      blk: "",
      street: "",
      unitNo: "",
      postCode: "",
      role: "",
      status: "PENDING",
    });
    setIsCreate(true);
    setEditOpen(true);
  };

  const handleSaveEdit = async (updatedRow: Partial<RowType> & { password?: string }) => {
    try {
      let newUser;
      if (isCreate) {
        newUser = await createUser(updatedRow as any);
        setRows([...rows, newUser]);
      } else {
        newUser = await updateUser(updatedRow.userId as number, updatedRow);
        setRows(rows.map(r => r.userId === newUser.userId ? newUser : r));
      }
      showFeedback(isCreate ? "User created successfully." : "User details updated successfully.", "success");
    } catch (error) {
      showFeedback((error as Error).message, "error");
    }
    setEditOpen(false);
  };

  const handleManage = () => {
    if (selected.length > 0) setManageOpen(true);
  };

  const handleActivate = async () => {
    try {
      for (const id of selected) {
        await updateUser(parseInt(id), { status: "ACTIVE" });
      }
      setRows(rows.map(r => selected.includes(r.userId.toString()) ? { ...r, status: "ACTIVE" } : r));
      showFeedback("Activated/Approved", "success");
    } catch (error) {
      showFeedback((error as Error).message, "error");
    }
  };

  const handleDeactivate = async () => {
    try {
      for (const id of selected) {
        await updateUser(parseInt(id), { status: "INACTIVE" });
      }
      setRows(rows.map(r => selected.includes(r.userId.toString()) ? { ...r, status: "INACTIVE" } : r));
      showFeedback("Deactivated/Rejected", "success");
    } catch (error) {
      showFeedback((error as Error).message, "error");
    }
  };

  const handleResetPassword = async (password: string) => {
    try {
      for (const id of selected) {
        await resetPassword(parseInt(id), password);
      }
      showFeedback(`Password reset for ${selected.length} user(s)`, "success");
      setManageOpen(false);
    } catch (error) {
      showFeedback((error as Error).message, "error");
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selected) {
        await deleteUser(parseInt(id));
      }
      setRows(rows.filter(r => !selected.includes(r.userId.toString())));
      setSelected([]);
      showFeedback("Users deleted", "success");
    } catch (error) {
      showFeedback((error as Error).message, "error");
    }
  };

  const handleSingleDelete = (id: number) => {
    setSingleDeleteId(id);
    setSingleDeleteConfirmOpen(true);
  };
  
  const confirmSingleDelete = async () => {
    if (singleDeleteId !== null) {
      try {
        await deleteUser(singleDeleteId);
        setRows(rows.filter(r => r.userId !== singleDeleteId));
        showFeedback("User deleted", "success");
      } catch (error) {
        showFeedback((error as Error).message, "error");
      }
    }
    setSingleDeleteConfirmOpen(false);
    setSingleDeleteId(null);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filteredRows.length - page * rowsPerPage);

  const pendingCount = rows.filter((row) => row.status === "PENDING").length;

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

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
            placeholder="Search"
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
              <MenuItem value="ANALYST">Analyst</MenuItem>
              <MenuItem value="INVESTIGATION OFFICER">
                Investigation Officer
              </MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
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
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAdd}
            startIcon={<AddIcon />}
            sx={{ minWidth: "120px", minHeight: "35px" }}
          >
            Add User
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={selected.length === 0}
            onClick={handleManage}
            sx={{ minWidth: "120px", minHeight: "35px" }}
          >
            Manage Users
          </Button>
        </Box>
      </Box>
      <MuiPaper>
        <EnhancedTableToolbar numSelected={selected.length} onDelete={handleBulkDelete} />
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
                  const isItemSelected = isSelected(row.userId.toString());
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
                            handleClick(event, row.userId.toString());
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">{row.userId}</TableCell>
                      <TableCell align="left">{row.firstName}</TableCell>
                      <TableCell align="left">{row.lastName}</TableCell>
                     <TableCell align="left">{row.sex.toUpperCase()}</TableCell>
                      <TableCell align="left">
                        {row.dob ? format(parseISO(row.dob as string), "dd/MM/yy") : "N/A"}
                      </TableCell>
                      {/* <TableCell align="left">{row.nationality}</TableCell> */}
                      <TableCell align="left">{row.race}</TableCell>
                      <TableCell align="left">{row.contactNo}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      {/* <TableCell align="left">{row.postCode}</TableCell> */}
                      <TableCell align="left">
                        {format(parseISO(row.registrationDate), "dd/MM/yy")}
                      </TableCell>
                      <TableCell align="left">{row.role.replace("_", " ").toUpperCase()}</TableCell>
                      <TableCell align="left">
                        <MuiChip
                          size="small"
                          label={row.status.toUpperCase()}
                          sx={{
                            backgroundColor:
                              row.status === "ACTIVE"
                                ? green[500]
                                : row.status === "PENDING"
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
                          <IconButton
                            aria-label="delete"
                            size="large"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleSingleDelete(row.userId);
                            }}
                          >
                            <DeleteIcon />
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
        onClose={() => setDetailsOpen(false)}
      />
      <UserEditDialog
        open={editOpen}
        row={editRow}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEdit}
        isCreate={isCreate}
      />
      <ManageDialog
        open={manageOpen}
        selectedUsers={selected}
        users={rows}
        onClose={() => setManageOpen(false)}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onResetPassword={handleResetPassword}
        onBulkDelete={handleBulkDelete}
      />
      <Dialog
        open={singleDeleteConfirmOpen}
        onClose={() => setSingleDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to permanently delete this user? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSingleDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmSingleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
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