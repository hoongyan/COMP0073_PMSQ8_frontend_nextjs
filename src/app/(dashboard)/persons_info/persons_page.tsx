"use client";

import React, { useEffect } from "react";
import NextLink from "next/link";
import {
  Alert,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider as MuiDivider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Link,
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
  Menu,
  MenuItem,
  TextField,
  Select,
  Snackbar,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format, startOfDay, endOfDay, parseISO } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  fetchPersons,
  createPerson,
  updatePerson,
  deletePerson,
  fetchLinkedReports,
} from "@/lib/persons"; 

export type RowType = {
  person_id: string; 
  first_name: string;
  last_name: string;
  sex: string;
  dob: string;
  nationality: string;
  race: string;
  occupation: string;
  contact_no: string;
  email: string;
  blk: string;
  street: string;
  unit_no: string;
  postcode: string;
};

export type LinkedReport = {
  report_id: string;
  role: string;
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
            Select DOB Range
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
  if (orderBy === "dob") {
    const aDate = a.dob ? new Date(a.dob) : new Date(0);
    const bDate = b.dob ? new Date(b.dob) : new Date(0);
    return bDate.getTime() - aDate.getTime();
  } else if (orderBy === "person_id") {
    return Number(b.person_id) - Number(a.person_id);
  } else {
    const aVal = a[orderBy] as string;
    const bVal = b[orderBy] as string;
    return bVal.localeCompare(aVal);
  }
}

function getComparator(
  order: "desc" | "asc",
  orderBy: keyof RowType | ''
): (a: RowType, b: RowType) => number {
  if (!orderBy) {
    return () => 0; // No sorting, preserve original order
  }
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

type HeadCell = {
  id: keyof RowType;
  alignment: "left" | "center" | "right" | "justify" | "inherit" | undefined;
  label: string;
  disablePadding?: boolean;
};
const headCells: Array<HeadCell> = [
  { id: "person_id", alignment: "left", label: "Person ID" },
  { id: "first_name", alignment: "left", label: "First Name" },
  { id: "last_name", alignment: "left", label: "Last Name" },
  { id: "sex", alignment: "left", label: "Sex" },
  { id: "dob", alignment: "left", label: "DOB" },
  { id: "nationality", alignment: "left", label: "Nationality" },
  { id: "race", alignment: "left", label: "Race" },
  { id: "occupation", alignment: "left", label: "Occupation" },
  { id: "contact_no", alignment: "left", label: "Contact No" },
  { id: "email", alignment: "left", label: "Email" },
  { id: "postcode", alignment: "left", label: "Postcode" },
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
            inputProps={{ "aria-label": "select all persons" }}
            sx={{
              color: "white",
              "& .MuiSvgIcon-root": { color: grey[500] }, 
            }}
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
          padding="none"
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
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => theme.palette.primary.main + "33", // Semi-transparent
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle">
          Persons of Interest
        </Typography>
      )}
    </Toolbar>
  );
};

type PersonDetailsPopupProps = {
  open: boolean;
  row: RowType | null;
  linkedReports: LinkedReport[];
  onClose: () => void;
};

const PersonDetailsPopup: React.FC<PersonDetailsPopupProps> = ({
  open,
  row,
  linkedReports,
  onClose,
}) => {
  if (!row) return null;
  const capitalizedRole = (role: string) =>
    role.charAt(0).toUpperCase() + role.slice(1);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}
      >
        Person Details - {row.first_name} {row.last_name}
      </DialogTitle>
      <DialogContent sx={{ p: 4, backgroundColor: "grey.50" }}>
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
                  Person ID:
                </Typography>
                <Typography>{row.person_id}</Typography>
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
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Occupation:
                </Typography>
                <Typography>{row.occupation || "-"}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
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
                <Typography>{row.contact_no || "-"}</Typography>
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
                <Typography>{row.unit_no || "-"}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Post Code:
                </Typography>
                <Typography>{row.postcode || "-"}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            backgroundColor: "white",
            boxShadow: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
            Linked Reports
          </Typography>
          {linkedReports.length > 0 ? (
            <List disablePadding>
              {linkedReports.map((report, index) => (
                <ListItem
                  key={index}
                  divider={index < linkedReports.length - 1}
                >
                  <ListItemText
                    primary={`Report ID: ${report.report_id}`}
                    secondary={`Role: ${capitalizedRole(report.role)}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No linked reports available.
            </Typography>
          )}
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

const validationSchema = yup.object({
  first_name: yup.string().required("First name is required").trim(),
  last_name: yup.string().required("Last name is required").trim(),
  sex: yup
    .string()
    .oneOf(["MALE", "FEMALE", "OTHER"], "Invalid sex selection")
    .nullable(),
  dob: yup.string().nullable(),
  nationality: yup.string().trim().nullable(),
  race: yup.string().trim().nullable(),
  occupation: yup.string().trim().nullable(),
  contact_no: yup
    .string()
    .required("Contact number is required")
    .matches(/^\d{8,15}$/, "Must be 8-15 digits"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .trim(),
  blk: yup.string().trim().nullable(),
  street: yup.string().trim().nullable(),
  unit_no: yup.string().trim().nullable(),
  postcode: yup.string().trim().nullable(),
});

const PersonEditDialog: React.FC<PersonEditDialogProps> = ({
  open,
  row,
  onClose,
  onSave,
  isCreate,
}) => {
  // New: Form hook
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RowType>({
    resolver: yupResolver(validationSchema),
    defaultValues: isCreate ? {} as RowType : row || {} as RowType,
  });

  const [dobDate, setDobDate] = React.useState<Date | null>(
    row?.dob ? parseISO(row.dob) : null
  );


  // Handle DOB change
  const handleDobChange = (newDate: Date | null) => {
    setDobDate(newDate);
    setValue("dob", newDate ? format(newDate, "yyyy-MM-dd") : ""); // Sync to form
  };

  // Submit handler with extra validations and capitalization
  const onSubmit = (data: RowType) => {
    // DOB validation (age > 0 and <=120)
    if (data.dob) {
      const dobParsed = parseISO(data.dob);
      const age =
        (new Date().getTime() - dobParsed.getTime()) /
        (1000 * 3600 * 24 * 365.25);
      if (age <= 0 || age > 120) {
        alert(
          "Date of birth must be in the past and result in an age of 1-120 years"
        ); 
        return;
      }
    }

    // Auto-capitalize fields
    const capitalizedData: Partial<RowType> = {
      ...data,
      first_name: data.first_name?.toUpperCase(),
      last_name: data.last_name?.toUpperCase(),
      nationality: data.nationality?.toUpperCase(),
      race: data.race?.toUpperCase(),
      occupation: data.occupation?.toUpperCase(),
      blk: data.blk?.toUpperCase(),
      street: data.street?.toUpperCase(),
      unit_no: data.unit_no?.toUpperCase(),
      postcode: data.postcode?.toUpperCase(),
      sex: data.sex?.toUpperCase(), // Already upper from Select
    };

    onSave(capitalizedData as RowType);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}
      >
        {isCreate ? "Add Person" : "Edit Person"}
      </DialogTitle>
      <DialogContent sx={{ p: 4, backgroundColor: "grey.50" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {" "}
          {/* Wrap in form for submit */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                Personal Information
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    margin="dense"
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    margin="dense"
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="dense" error={!!errors.sex}>
                    <InputLabel id="sex-label">Sex</InputLabel>
                    <Select {...field} label="Sex">
                      <MenuItem value="MALE">MALE</MenuItem>
                      <MenuItem value="FEMALE">FEMALE</MenuItem>
                      <MenuItem value="OTHER">OTHER</MenuItem>
                    </Select>
                    {!!errors.sex && (
                      <Typography color="error" variant="caption">
                        {errors.sex.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="DOB"
                  value={dobDate}
                  onChange={handleDobChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "dense",
                      error: !!errors.dob,
                      helperText: errors.dob?.message,
                    },
                  }}
                  format="yyyy-MM-dd"
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nationality"
                    fullWidth
                    margin="dense"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="race"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Race" fullWidth margin="dense" />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="occupation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Occupation"
                    fullWidth
                    margin="dense"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <MuiDivider />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "medium", mt: 2 }}
              >
                Contact Information
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="contact_no"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contact No"
                    fullWidth
                    margin="dense"
                    error={!!errors.contact_no}
                    helperText={
                      errors.contact_no?.message ||
                      "e.g., 6512345678 (digits only)"
                    }
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    margin="dense"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <MuiDivider />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "medium", mt: 2 }}
              >
                Address
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="blk"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Block"
                    fullWidth
                    margin="dense"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="street"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Street"
                    fullWidth
                    margin="dense"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="unit_no"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Unit No"
                    fullWidth
                    margin="dense"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="postcode"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Postcode"
                    fullWidth
                    variant="outlined"
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error ? fieldState.error.message : null
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ borderTop: "1px solid #ddd", px: 4 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          Save
        </Button>{" "}
        {/* Use handleSubmit */}
      </DialogActions>
    </Dialog>
  );
};

function EnhancedTable() {
  const [order, setOrder] = React.useState<"desc" | "asc">("asc");
  // const [orderBy, setOrderBy] = React.useState<keyof RowType>("person_id");
  const [orderBy, setOrderBy] = React.useState<keyof RowType | ''>('');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState<RowType[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [selectedRange, setSelectedRange] = React.useState("all");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<RowType | null>(null);
  const [linkedReports, setLinkedReports] = React.useState<LinkedReport[]>([]);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState<RowType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [isCreate, setIsCreate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const loadPersons = async () => {
    try {
      setLoading(true);
      const persons = await fetchPersons();
      setRows(persons.map((p) => ({ ...p, person_id: String(p.person_id) })));
      setSelected(prev => prev.filter(id => persons.some(p => String(p.person_id) === id)));
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load persons",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersons();
  }, []);

  const handleRequestSort = (event: any, property: keyof RowType) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map((n) => n.person_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredRows = rows.filter((row) => {
    const searchLower = searchTerm.toLowerCase();
    const address =
      `${row.blk} ${row.street} ${row.unit_no} ${row.postcode}`.toLowerCase();
    const matchesSearch =
      row.first_name.toLowerCase().includes(searchLower) ||
      row.last_name.toLowerCase().includes(searchLower) ||
      row.person_id.includes(searchLower) ||
      row.contact_no.includes(searchLower) ||
      row.email.toLowerCase().includes(searchLower) ||
      row.occupation.toLowerCase().includes(searchLower) ||
      row.nationality.toLowerCase().includes(searchLower) ||
      row.race.toLowerCase().includes(searchLower) ||
      address.includes(searchLower);

    const rowDate = row.dob ? parseISO(row.dob) : null;
    const matchesDate =
      (!startDate || (rowDate && rowDate >= startDate)) &&
      (!endDate || (rowDate && rowDate <= endDate));

    return matchesSearch && matchesDate;
  });

  const handleManagePersonsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmBulkDelete = async () => {
    try {
      for (const id of selected) {
        await deletePerson(Number(id));
      }
      await loadPersons(); // Refresh
      setSelected([]);
      setSnackbar({
        open: true,
        message: "Persons deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete persons",
        severity: "error",
      });
    }
    setBulkDeleteDialogOpen(false);
  };

  const handleEditSelected = () => {
    if (selected.length !== 1) return;
    const selectedId = selected[0];
    const rowToEdit = rows.find((row) => row.person_id === selectedId);
    if (rowToEdit) {
      handleEdit(rowToEdit);
    }
    handleMenuClose();
  };

  const handleRowClick = async (row: RowType) => {
    setSelectedRow(row);
    try {
      const reports = await fetchLinkedReports(Number(row.person_id));
      setLinkedReports(reports);
    } catch (error) {
      setLinkedReports([]);
      setSnackbar({
        open: true,
        message: "Failed to load linked reports",
        severity: "error",
      });
    }
    setDetailsDialogOpen(true);
  };

  const handleDetailsDialogClose = () => {
    setDetailsDialogOpen(false);
    setSelectedRow(null);
    setLinkedReports([]);
  };

  const handleEdit = (row: RowType) => {
    setEditRow(row);
    setIsCreate(false);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (updates: Partial<RowType>) => {
    const payload = { ...updates, postcode: updates.postcode }; 

    delete payload.person_id; 

    try {
      if (isCreate) {
        await createPerson(payload);
      } else {
        await updatePerson(Number(editRow?.person_id), payload);
      }
      await loadPersons(); // Refresh
      setSnackbar({
        open: true,
        message: `Person ${isCreate ? "created" : "updated"} successfully`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to save person",
        severity: "error",
      });
    }
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditRow(null);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePerson(Number(deleteId));
      await loadPersons(); // Refresh
      setSelected(selected.filter(id => id !== deleteId));
      setSnackbar({
        open: true,
        message: "Person deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete person",
        severity: "error",
      });
    }
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleAddClick = () => {
    setEditRow(null);
    setIsCreate(true);
    setEditDialogOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            placeholder="Search Name/ID/Contact/Email/Occupation/Nationality/Race/Address"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon color="action" /> }}
            sx={{ minWidth: 300 }}
          />
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
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{ minWidth: "110px", minHeight: "35px" }}
          >
            Add Person
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={selected.length === 0}
            onClick={handleManagePersonsClick}
            aria-controls={
              Boolean(anchorEl) ? "manage-persons-menu" : undefined
            }
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? "true" : undefined}
            sx={{ minWidth: "110px", minHeight: "35px" }}
          >
            Manage Persons
          </Button>
          <Menu
            id="manage-persons-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={handleEditSelected}
              disabled={selected.length !== 1}
            >
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleBulkDelete}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
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
                  const isItemSelected = isSelected(row.person_id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={`${row.person_id}-${index}`}
                      selected={isItemSelected}
                      onClick={() => handleRowClick(row)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleClick(event, row.person_id);
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">{row.person_id}</TableCell>
                      <TableCell align="left">{row.first_name}</TableCell>
                      <TableCell align="left">{row.last_name}</TableCell>
                      <TableCell align="left">{row.sex}</TableCell>
                      <TableCell align="left">
                        {row.dob ? format(parseISO(row.dob), "dd/MM/yy") : "-"}
                      </TableCell>
                      <TableCell align="left">{row.nationality}</TableCell>
                      <TableCell align="left">{row.race}</TableCell>
                      <TableCell align="left">{row.occupation}</TableCell>
                      <TableCell align="left">{row.contact_no}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      {/* <TableCell align="left">{row.blk}</TableCell>
                      <TableCell align="left">{row.street}</TableCell>
                      <TableCell align="left">{row.unit_no}</TableCell> */}
                      <TableCell align="left">{row.postcode}</TableCell>
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
                              handleDelete(row.person_id);
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
      <PersonDetailsPopup
        open={detailsDialogOpen}
        row={selectedRow}
        linkedReports={linkedReports}
        onClose={handleDetailsDialogClose}
      />
      {/* <PersonEditDialog
        open={editDialogOpen}
        row={editRow}
        onClose={handleEditDialogClose}
        onSave={handleSaveEdit}
        isCreate={isCreate}
      /> */}
      {editDialogOpen && (
        <PersonEditDialog
          open={editDialogOpen}
          row={editRow}
          onClose={handleEditDialogClose}
          onSave={handleSaveEdit}
          isCreate={isCreate}
        />
      )}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this person?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the selected person(s)?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmBulkDelete} color="secondary">
            Confirm
          </Button>
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

function PersonsOfInterest() {
  return (
    <React.Fragment>
      <Grid container direction="column" spacing={6}>
        <Grid item>
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
            Persons of Interest
          </Typography>

          <MuiBreadcrumbs aria-label="Breadcrumb" sx={{ mt: 2 }}>
            <Link component={NextLink} href="/">
              Home
            </Link>
            <Typography>Persons of Interest</Typography>
          </MuiBreadcrumbs>
          <Box sx={{ height: "20px" }} />
        </Grid>
        <Grid item xs={12} spacing={6}>
          <EnhancedTable />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default PersonsOfInterest;
