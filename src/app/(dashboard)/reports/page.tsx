"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Alert,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Checkbox,
  Chip as MuiChip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider as MuiDivider,
  Grid,
  IconButton,
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
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Stack,
  Popover,
} from "@mui/material";
import { green, orange, blue, grey } from "@mui/material/colors";
import {
  Add as AddIcon,
  Archive as ArchiveIcon,
  FilterList as FilterListIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { format, startOfDay, endOfDay, parseISO } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import {
  fetchScamReports,
  deleteScamReport,
  updateScamReport,
  createScamReport,
  fetchLinkedPersons,
  addLinkedPerson,
  deleteLinkedPerson
} from "@/lib/reports";

type LinkedPerson = {
  id: string;
  name: string;
  role: "witness" | "suspect" | "reportee" | "victim";
};

export type RowType = {
  report_id: number;
  scam_incident_date: string;
  scam_report_date: string;
  scam_type: string;
  scam_approach_platform: string;
  scam_communication_platform: string;
  scam_transaction_type: string;
  scam_beneficiary_platform: string;
  scam_beneficiary_identifier: string;
  scam_contact_no: string;
  scam_email: string;
  scam_moniker: string;
  scam_url_link: string;
  scam_amount_lost: string;
  scam_incident_description: string;
  status: "Unassigned" | "Assigned" | "Resolved";
  assigned_IO: string;
  linked_persons: LinkedPerson[];
};

// const validationSchema = yup.object().shape({
//   scam_incident_date: yup.date().required("Incident Date is required").nullable(),
//   scam_report_date: yup.date().required("Report Date is required").nullable(),
//   scam_incident_description: yup
//     .string()
//     .required("Description is required")
//     .min(1, "Description cannot be empty"),
//   // Other fields optional
// });

const validationSchema = yup.object().shape({
  scam_incident_date: yup
    .date()
    .required("Incident Date is required")
    .max(new Date(), "Incident Date cannot be in the future")  // Prevent future dates
    .nullable(),
  scam_report_date: yup
    .date()
    .required("Report Date is required")
    .max(new Date(), "Report Date cannot be in the future")  // Prevent future dates
    .nullable(),
  scam_incident_description: yup
    .string()
    .required("Description is required")
    .min(1, "Description cannot be empty")
    .nullable(),
  scam_type: yup
    .string()
    .nullable()
    .transform((val) => (val ? val.toUpperCase() : val)),  // Uppercase if provided
  scam_approach_platform: yup
    .string()
    .nullable()
    .transform((val) => (val ? val.toUpperCase() : val)),  // Uppercase if provided
  scam_communication_platform: yup
    .string()
    .nullable()
    .transform((val) => (val ? val.toUpperCase() : val)),  // Uppercase if provided
  scam_transaction_type: yup
    .string()
    .nullable()
    .transform((val) => (val ? val.toUpperCase() : val)),  // Uppercase if provided
  scam_beneficiary_platform: yup
    .string()
    .nullable()
    .transform((val) => (val ? val.toUpperCase() : val)),  // Uppercase if provided
  scam_amount_lost: yup
    .number()
    .nullable()
    .transform((val, originalVal) => (originalVal === '' ? null : val)),  // Treat empty string as null
  // Add other optional fields if needed, e.g.:
  scam_beneficiary_identifier: yup.string().nullable(),
  scam_contact_no: yup.string().nullable(),
  scam_email: yup.string().nullable(),
  scam_moniker: yup.string().nullable(),
  scam_url_link: yup.string().nullable(),
  status: yup.string().nullable(),
  assigned_IO: yup.string().nullable(),
});

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
            Select Date Range
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
  if (orderBy === "scam_report_date" || orderBy === "scam_incident_date") {
    return new Date(b[orderBy]).getTime() - new Date(a[orderBy]).getTime();
  } else if (orderBy === "scam_amount_lost") {
    return parseFloat(b[orderBy]) - parseFloat(a[orderBy]);
  } else if (orderBy === "status") {
    const statusOrder = { Resolved: 2, Assigned: 1, Unassigned: 0 };
    return (
      (statusOrder[b.status as keyof typeof statusOrder] || 0) -
      (statusOrder[a.status as keyof typeof statusOrder] || 0)
    );
  } else if (typeof a[orderBy] === "number" && typeof b[orderBy] === "number") {
    // Add this for numeric fields like report_id (descending: b - a)
    return b[orderBy] - a[orderBy];
  } else {
    // Default to string comparison for other fields
    if (typeof a[orderBy] === "string" && typeof b[orderBy] === "string") {
      return b[orderBy].localeCompare(a[orderBy]);
    }
    return 0;
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

type HeadCell = {
  id: keyof RowType;
  alignment: "left" | "center" | "right" | "justify" | "inherit" | undefined;
  label: string;
  disablePadding?: boolean;
};
const headCells: Array<HeadCell> = [
  { id: "report_id", alignment: "left", label: "Report No" },
  { id: "scam_incident_date", alignment: "left", label: "Incident Date" },
  { id: "scam_report_date", alignment: "left", label: "Report Date" },
  { id: "scam_type", alignment: "left", label: "Scam Type" },
  {
    id: "scam_approach_platform",
    alignment: "left",
    label: "Approach Platform",
  },
  {
    id: "scam_communication_platform",
    alignment: "left",
    label: "Communication Platform",
  },
  { id: "scam_transaction_type", alignment: "left", label: "Transaction Type" },
  // {
  //   id: "scam_beneficiary_platform",
  //   alignment: "left",
  //   label: "Beneficiary Platform",
  // },
  // {
  //   id: "scam_beneficiary_identifier",
  //   alignment: "left",
  //   label: "Beneficiary ID",
  // },
  // { id: "scam_contact_no", alignment: "left", label: "Contact No" },
  // { id: "scam_email", alignment: "left", label: "Email" },
  // { id: "scam_moniker", alignment: "left", label: "Moniker" },
  // { id: "scam_url_link", alignment: "left", label: "URL Link" },
  { id: "scam_amount_lost", alignment: "left", label: "Amount Lost" },
  { id: "scam_incident_description", alignment: "left", label: "Description" },
  { id: "status", alignment: "left", label: "Status" },
  { id: "assigned_IO", alignment: "left", label: "Assigned IO" },
];

type EnhancedTableHeadProps = {
  numSelected: number;
  order: "desc" | "asc";
  orderBy: keyof RowType;
  rowCount: number;
  onSelectAllClick: (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof RowType
  ) => void;
};

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof RowType) => (event: React.MouseEvent<unknown>) => {
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
            sx={{ color: "white" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignment}
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
        <TableCell sx={{ backgroundColor: "#001f3f", color: "white" }}>
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({ numSelected }: { numSelected: number }) {
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
}

function ScamReportDetailsPopup({
  open,
  row,
  onClose,
}: {
  open: boolean;
  row: RowType | null;
  onClose: () => void;
}) {
  if (!row) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}
      >
        Report Details
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Report ID:</strong> {row.report_id}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Incident Date:</strong>{" "}
              {row.scam_incident_date
                ? format(parseISO(row.scam_incident_date), "dd/MM/yy")
                : "N/A"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Report Date:</strong>{" "}
              {row.scam_report_date
                ? format(parseISO(row.scam_report_date), "dd/MM/yy HH:mm")
                : "N/A"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Scam Type:</strong> {row.scam_type}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Approach Platform:</strong> {row.scam_approach_platform}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Communication Platform:</strong>{" "}
              {row.scam_communication_platform}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Transaction Type:</strong> {row.scam_transaction_type}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Beneficiary Platform:</strong>{" "}
              {row.scam_beneficiary_platform}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Beneficiary ID:</strong> {row.scam_beneficiary_identifier}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Contact No:</strong> {row.scam_contact_no}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Email:</strong> {row.scam_email}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Moniker:</strong> {row.scam_moniker}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>URL Link:</strong> {row.scam_url_link}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Amount Lost:</strong> {row.scam_amount_lost}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Status:</strong>
            </Typography>
            <MuiChip
              label={row.status}
              sx={{
                backgroundColor:
                  row.status === "Resolved"
                    ? green[500]
                    : row.status === "Assigned"
                    ? orange[500]
                    : grey[500],
                color: "#fff",
                mt: 0.5,
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Assigned IO:</strong> {row.assigned_IO}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1 }}>
              <strong>Description:</strong>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={row.scam_incident_description}
              variant="outlined"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: "#fafafa" }} // Light box effect
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1 }}>
              <strong>Linked Persons:</strong>
            </Typography>
            {row.linked_persons.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {row.linked_persons.map((p) => (
                  <MuiChip
                    key={p.id}
                    label={`${p.name} (${p.role})`}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            ) : (
              <Typography>None</Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ borderTop: "1px solid #ddd" }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
function EditScamReportDialog({
  open,
  row,
  onClose,
  onSave,
  isCreate = false,
}: {
  open: boolean;
  row: RowType | null;
  onClose: () => void;
  onSave: (updated: RowType) => void;
  isCreate?: boolean;
}) {
  if (!row) return null;

  // Define Role type
  type Role = "witness" | "suspect" | "reportee" | "victim";

  // Set up the form with validation
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<RowType>({
    resolver: yupResolver(validationSchema),
    defaultValues: row,
    mode: "onChange",
  });

  // Watch current linked_persons value
  const linkedPersons = watch("linked_persons", []);

  // Separate states for DatePickers
  const [incidentDate, setIncidentDate] = React.useState<Date | null>(
    row.scam_incident_date ? parseISO(row.scam_incident_date) : null
  );
  const [reportDate, setReportDate] = React.useState<Date | null>(
    row.scam_report_date ? parseISO(row.scam_report_date) : null
  );

  // Sync DatePicker changes to the form
  const handleIncidentDateChange = (newValue: Date | null) => {
    setIncidentDate(newValue);
    setValue("scam_incident_date", newValue ? newValue : null);
  };

  const handleReportDateChange = (newValue: Date | null) => {
    setReportDate(newValue);
    setValue("scam_report_date", newValue ? newValue : null);
  };

  // Handle form submission
  const onSubmit = (data: RowType) => {
    onSave(data);
    onClose();
    reset();
  };

  // States for linked persons
  const [newPersonId, setNewPersonId] = React.useState('');
  const [newRole, setNewRole] = React.useState<Role>('victim');

  // Sync linked_persons to form (initial only)
  React.useEffect(() => {
    setValue("linked_persons", row.linked_persons);
  }, [row.linked_persons, setValue]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}
      >
        {isCreate ? 'Create Report' : 'Edit Report'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 6, pb: 6, minHeight: '60vh' }}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {!isCreate && (
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Report ID"
                  value={row.report_id}
                  disabled
                />
              </Grid>
            )}
            <Grid size={{ xs: 6 }}>
              <Controller
                name="scam_incident_date"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      {...field}
                      label="Incident Date"
                      value={incidentDate}
                      onChange={handleIncidentDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!errors.scam_incident_date,
                          helperText: errors.scam_incident_date?.message || "Required field",
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="scam_report_date"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      {...field}
                      label="Report Date"
                      value={reportDate}
                      onChange={handleReportDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!errors.scam_report_date,
                          helperText: errors.scam_report_date?.message || "Required field",
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="scam_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Type"
                    error={!!errors.scam_type}
                    helperText={errors.scam_type?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="scam_approach_platform"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Approach Platform"
                    error={!!errors.scam_approach_platform}
                    helperText={errors.scam_approach_platform?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="scam_communication_platform"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Communication Platform"
                    error={!!errors.scam_communication_platform}
                    helperText={errors.scam_communication_platform?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="scam_transaction_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Transaction Type"
                    error={!!errors.scam_transaction_type}
                    helperText={errors.scam_transaction_type?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="scam_beneficiary_platform"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Beneficiary Platform"
                    error={!!errors.scam_beneficiary_platform}
                    helperText={errors.scam_beneficiary_platform?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="scam_beneficiary_identifier"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Beneficiary ID"
                    error={!!errors.scam_beneficiary_identifier}
                    helperText={errors.scam_beneficiary_identifier?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="scam_contact_no"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Contact No"
                    error={!!errors.scam_contact_no}
                    helperText={errors.scam_contact_no?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="scam_email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    error={!!errors.scam_email}
                    helperText={errors.scam_email?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="scam_moniker"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Moniker"
                    error={!!errors.scam_moniker}
                    helperText={errors.scam_moniker?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="scam_url_link"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="URL Link"
                    error={!!errors.scam_url_link}
                    helperText={errors.scam_url_link?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="scam_amount_lost"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Amount Lost"
                    type="number"
                    error={!!errors.scam_amount_lost}
                    helperText={errors.scam_amount_lost?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value="Unassigned">Unassigned</MenuItem>
                      <MenuItem value="Assigned">Assigned</MenuItem>
                      <MenuItem value="Resolved">Resolved</MenuItem>
                    </Select>
                    {!!errors.status && <Typography color="error" variant="caption">{errors.status.message}</Typography>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="assigned_IO"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Assigned IO"
                    error={!!errors.assigned_IO}
                    helperText={errors.assigned_IO?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="scam_incident_description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    required
                    error={!!errors.scam_incident_description}
                    helperText={errors.scam_incident_description?.message || "Required field"}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ mb: 1 }}>
                <strong>Linked Persons:</strong>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {linkedPersons.map((p) => (
                  <MuiChip
                    key={p.id}
                    label={`${p.name} (${p.role})`}
                    color="primary"
                    variant="outlined"
                    onDelete={() => {
                      setValue("linked_persons", linkedPersons.filter((person) => person.id !== p.id));
                    }}
                  />
                ))}
              </Box>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Person ID"
                  value={newPersonId}
                  onChange={(e) => setNewPersonId(e.target.value)}
                  type="number"
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Role</InputLabel>
                  <Select value={newRole} onChange={(e) => setNewRole(e.target.value as Role)}>
                    <MenuItem value="victim">Victim</MenuItem>
                    <MenuItem value="suspect">Suspect</MenuItem>
                    <MenuItem value="witness">Witness</MenuItem>
                    <MenuItem value="reportee">Reportee</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" onClick={() => {
                  const newP: LinkedPerson = { id: newPersonId, name: `Person ${newPersonId}`, role: newRole };
                  setValue("linked_persons", [...linkedPersons, newP]);
                  setNewPersonId('');
                  setNewRole('victim');
                }}>
                  Add
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #ddd" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
// function EditScamReportDialog({
//   open,
//   row,
//   onClose,
//   onSave,
//   isCreate = false, // ADDED: Prop for create mode
// }: {
//   open: boolean;
//   row: RowType | null;
//   onClose: () => void;
//   onSave: (updated: RowType) => void;
//   isCreate?: boolean;
// }) {
//   if (!row) return null;

//   const [edited, setEdited] = useState<RowType>({ ...row });
//   const [newPersonId, setNewPersonId] = useState('');
//   const [newRole, setNewRole] = useState('victim');

//   const handleChange = (field: keyof RowType, value: any) => {
//     setEdited((prev) => ({ ...prev, [field]: value }));
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle
//         sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}
//       >
//         {isCreate ? 'Create Report' : 'Edit Report'} {/* ADDED: Dynamic title */}
//       </DialogTitle>
//       <DialogContent sx={{ p: 6, pb: 6, minHeight: '60vh' }}>
//         <Grid container spacing={2} sx={{ mt: 2 }}>
//           {!isCreate && (
//             <Grid size={{ xs: 6 }}>
//               <TextField
//                 fullWidth
//                 label="Report ID"
//                 value={edited.report_id}
//                 disabled
//               />{" "}
//               {/* Disable if ID shouldn't change */}
//             </Grid>
//           )}
//           <Grid size={{ xs: 6 }}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label="Incident Date"
//                 value={
//                   edited.scam_incident_date
//                     ? parseISO(edited.scam_incident_date)
//                     : null
//                 }
//                 onChange={(newValue) =>
//                   handleChange(
//                     "scam_incident_date",
//                     newValue ? format(newValue, "yyyy-MM-dd") : ""
//                   )
//                 }
//                 slotProps={{ textField: { fullWidth: true } }}
//               />
//             </LocalizationProvider>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label="Report Date"
//                 value={
//                   edited.scam_report_date
//                     ? parseISO(edited.scam_report_date)
//                     : null
//                 }
//                 onChange={(newValue) =>
//                   handleChange(
//                     "scam_report_date",
//                     newValue ? format(newValue, "yyyy-MM-dd") : ""
//                   )
//                 }
//                 slotProps={{ textField: { fullWidth: true } }}
//               />
//             </LocalizationProvider>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="Type"
//               value={edited.scam_type}
//               onChange={(e) => handleChange("scam_type", e.target.value)}
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="Approach Platform"
//               value={edited.scam_approach_platform}
//               onChange={(e) =>
//                 handleChange("scam_approach_platform", e.target.value)
//               }
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="Communication Platform"
//               value={edited.scam_communication_platform}
//               onChange={(e) =>
//                 handleChange("scam_communication_platform", e.target.value)
//               }
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="Transaction Type"
//               value={edited.scam_transaction_type}
//               onChange={(e) =>
//                 handleChange("scam_transaction_type", e.target.value)
//               }
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="Beneficiary Platform"
//               value={edited.scam_beneficiary_platform}
//               onChange={(e) =>
//                 handleChange("scam_beneficiary_platform", e.target.value)
//               }
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="Beneficiary ID"
//               value={edited.scam_beneficiary_identifier}
//               onChange={(e) =>
//                 handleChange("scam_beneficiary_identifier", e.target.value)
//               }
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="Contact No"
//               value={edited.scam_contact_no}
//               onChange={(e) => handleChange("scam_contact_no", e.target.value)}
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="Email"
//               value={edited.scam_email}
//               onChange={(e) => handleChange("scam_email", e.target.value)}
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="Moniker"
//               value={edited.scam_moniker}
//               onChange={(e) => handleChange("scam_moniker", e.target.value)}
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="URL Link"
//               value={edited.scam_url_link}
//               onChange={(e) => handleChange("scam_url_link", e.target.value)}
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="Amount Lost"
//               value={edited.scam_amount_lost}
//               onChange={(e) => handleChange("scam_amount_lost", e.target.value)}
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <FormControl fullWidth>
//               <InputLabel>Status</InputLabel>
//               <Select
//                 value={edited.status}
//                 label="Status"
//                 onChange={(e) => handleChange("status", e.target.value)}
//               >
//                 <MenuItem value="Unassigned">Unassigned</MenuItem>
//                 <MenuItem value="Assigned">Assigned</MenuItem>
//                 <MenuItem value="Resolved">Resolved</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="Assigned IO"
//               value={edited.assigned_IO}
//               onChange={(e) => handleChange("assigned_IO", e.target.value)}
//             />
//           </Grid>
//           <Grid size={{ xs: 12 }}>
//             <TextField
//               fullWidth
//               multiline
//               rows={4}
//               label="Description"
//               value={edited.scam_incident_description}
//               onChange={(e) =>
//                 handleChange("scam_incident_description", e.target.value)
//               }
//             />
//           </Grid>
//           {/* <Grid size={{ xs: 12 }}>
//             <Typography sx={{ mb: 1 }}>
//               <strong>Linked Persons (Display Only):</strong>
//             </Typography>
//             {edited.linked_persons.length > 0 ? (
//               <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                 {edited.linked_persons.map((p) => (
//                   <MuiChip
//                     key={p.id}
//                     label={`${p.name} (${p.role})`}
//                     color="primary"
//                     variant="outlined"
//                   />
//                 ))}
//               </Box>
//             ) : (
//               <Typography>None</Typography>
//             )}
//           </Grid> */}
//           <Grid size={{ xs: 12 }}>
//             <Typography sx={{ mb: 1 }}>
//               <strong>Linked Persons:</strong>
//             </Typography>
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
//               {edited.linked_persons.map((p) => (
//                 <MuiChip
//                   key={p.id}
//                   label={`${p.name} (${p.role})`}
//                   color="primary"
//                   variant="outlined"
//                   onDelete={() => {
//                     // Update local state
//                     setEdited((prev) => ({
//                       ...prev,
//                       linked_persons: prev.linked_persons.filter((person) => person.id !== p.id),
//                     }));
//                   }}
//                 />
//               ))}
//             </Box>
//             <Stack direction="row" spacing={2}>
//               <TextField
//                 label="Person ID"
//                 value={newPersonId}
//                 onChange={(e) => setNewPersonId(e.target.value)}
//                 type="number"
//               />
//               <FormControl sx={{ minWidth: 120 }}>
//                 <InputLabel>Role</InputLabel>
//                 <Select value={newRole} onChange={(e) => setNewRole(e.target.value as string)}>
//                   <MenuItem value="victim">Victim</MenuItem>
//                   <MenuItem value="suspect">Suspect</MenuItem>
//                   <MenuItem value="witness">Witness</MenuItem>
//                   <MenuItem value="reportee">Reportee</MenuItem>
//                 </Select>
//               </FormControl>
//               <Button variant="contained" onClick={() => {
//                 const newP = { id: newPersonId, name: `Person ${newPersonId}`, role: newRole };
//                 setEdited((prev) => ({
//                   ...prev,
//                   linked_persons: [...prev.linked_persons, newP],
//                 }));
//                 setNewPersonId('');
//                 setNewRole('victim');
//               }}>
//                 Add
//               </Button>
//             </Stack>
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions sx={{ borderTop: "1px solid #ddd" }}>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={() => onSave(edited)} variant="contained">
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

function EnhancedTable() {
  const [order, setOrder] = useState<"desc" | "asc">("asc");
  const [orderBy, setOrderBy] = useState<keyof RowType>("report_id");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedRange, setSelectedRange] = useState("all");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowType | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRow, setEditRow] = useState<RowType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreate, setIsCreate] = useState(false);

  const [rows, setRows] = useState<RowType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await fetchScamReports();
      setRows(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setSnackbar({
        open: true,
        message: (err as Error).message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof RowType
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    if (checked) {
      setSelected(filteredRows.map((n) => n.report_id));
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, report_id: number) => {
    const selectedIndex = selected.indexOf(report_id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, report_id);
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

  const isSelected = (report_id: number) => selected.indexOf(report_id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredRows = rows.filter((row) => {
    const matchesSearch = Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    const reportDate = parseISO(row.scam_report_date);
    const matchesDate =
      (!startDate || reportDate >= startDate) &&
      (!endDate || reportDate <= endDate);
    return matchesSearch && matchesDate && matchesStatus;
  });

  const handleRowClick = (row: RowType) => {
    setSelectedRow(row);
    setDescriptionDialogOpen(true);
  };

  const handleDescriptionDialogClose = () => {
    setDescriptionDialogOpen(false);
    setSelectedRow(null);
  };

  const handleEdit = (report_id: number) => {
    const rowToEdit = rows.find((row) => row.report_id === report_id);
    if (rowToEdit) {
      setEditRow(rowToEdit);
      setEditDialogOpen(true);
    }
  };

  const handleSaveEdit = async (updatedRow: RowType) => {
    try {
      let updated;
      if (isCreate) {
        updated = await createScamReport(updatedRow); // ADDED: Create if in create mode
      } else {
        updated = await updateScamReport(updatedRow.report_id, updatedRow); // Existing update
      }
      // Handle linked persons (compare original vs updated)
      const originalLinks = await fetchLinkedPersons(updated.report_id || updatedRow.report_id);  // Fetch original
      const newLinks = updatedRow.linked_persons;

      // Deletes
      for (const orig of originalLinks) {
        if (!newLinks.find((n) => n.id === orig.id.toString())) {
          await deleteLinkedPerson(updated.report_id, parseInt(orig.id));
        }
      }
      // Adds
      for (const nw of newLinks) {
        if (!originalLinks.find((o) => o.id === nw.id)) {
          await addLinkedPerson(updated.report_id, { person_id: parseInt(nw.id), role: nw.role });
        }
      }

      loadReports(); // ADDED: Refresh full list (instead of manual setRows)
      setSnackbar({
        open: true,
        message: isCreate ? "Report created successfully" : "Report updated successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: (err as Error).message,
        severity: "error",
      });
    } finally {
      setEditDialogOpen(false);
      setEditRow(null);
      setIsCreate(false);
    }
  };

  const handleDelete = (report_id: number) => {
    setDeleteId(report_id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setRows((prev) => prev.filter((row) => row.report_id !== deleteId));
      await deleteScamReport(deleteId);
      setSelected([]);
      setSnackbar({
        open: true,
        message: "Report deleted successfully",
        severity: "success",
      });
    } catch (err) {
      loadReports();
      setSelected([]);
      setSnackbar({
        open: true,
        message: (err as Error).message,
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const currentSelected = [...selected];
      setRows((prev) =>
        prev.filter((row) => !currentSelected.includes(row.report_id))
      );
      for (const id of currentSelected) {
        await deleteScamReport(id);
      }
      setSelected([]);
      setSnackbar({
        open: true,
        message: "Reports deleted successfully",
        severity: "success",
      });
    } catch (err) {
      loadReports();
      setSelected([]);
      setSnackbar({
        open: true,
        message: "Failed to delete some reports",
        severity: "error",
      });
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  const handleBulkEdit = () => {
    if (selected.length === 1) {
      handleEdit(selected[0]);
    }
  };

  const handleManageReportsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search Description/Type/Moniker/Email/Contact/URL/Report No"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            sx={{ minWidth: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value as string)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Unassigned">Unassigned</MenuItem>
              <MenuItem value="Assigned">Assigned</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
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
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="primary"
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          sx={{ mr: 2, minWidth: "110px", minHeight: "35px" }}
          onClick={() => {
            setEditRow({
              report_id: 0,  // Temp ID, backend assigns real
              scam_incident_date: '',
              scam_report_date: '',
              scam_type: '',
              scam_approach_platform: '',
              scam_communication_platform: '',
              scam_transaction_type: '',
              scam_beneficiary_platform: '',
              scam_beneficiary_identifier: '',
              scam_contact_no: '',
              scam_email: '',
              scam_moniker: '',
              scam_url_link: '',
              scam_amount_lost: '',
              scam_incident_description: '',
              status: 'Unassigned',
              assigned_IO: '',
              linked_persons: [],
            });
            setIsCreate(true);  // Set create mode
            setEditDialogOpen(true);  // Open dialog
          }}
        >
          Add Report
        </Button>
        <Box>
          <Button
            variant="contained"
            disabled={selected.length === 0}
            onClick={handleManageReportsClick}
            sx={{ minWidth: "110px", minHeight: "35px" }}
          >
            Manage Reports
          </Button>
          <Menu
            id="manage-reports-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={handleBulkEdit}
              disabled={selected.length !== 1}  // Disable unless exactly 1 selected
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
          {loading ? (
            <Typography sx={{ p: 2 }}>Loading reports...</Typography>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          ) : (
            <Table
              aria-labelledby="tableTitle"
              size="small"
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
                    const isItemSelected = isSelected(row.report_id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={`${row.report_id}-${index}`}
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
                              handleClick(event, row.report_id);
                            }}
                          />
                        </TableCell>
                        <TableCell align="left">{row.report_id}</TableCell>
                        <TableCell align="left">
                          {row.scam_incident_date
                            ? format(
                                parseISO(row.scam_incident_date),
                                "dd/MM/yy"
                              )
                            : ""}
                        </TableCell>
                        <TableCell align="left">
                          {row.scam_report_date
                            ? format(parseISO(row.scam_report_date), "dd/MM/yy")
                            : ""}
                        </TableCell>
                        <TableCell align="left">{row.scam_type}</TableCell>
                        <TableCell align="left">
                          {row.scam_approach_platform}
                        </TableCell>
                        <TableCell align="left">
                          {row.scam_communication_platform}
                        </TableCell>
                        <TableCell align="left">
                          {row.scam_transaction_type}
                        </TableCell>
                        {/* <TableCell align="left">
                          {row.scam_beneficiary_platform}
                        </TableCell>
                        <TableCell align="left">
                          {row.scam_beneficiary_identifier}
                        </TableCell>
                        <TableCell align="left">{row.scam_contact_no}</TableCell>
                        <TableCell align="left">{row.scam_email}</TableCell>
                        <TableCell align="left">{row.scam_moniker}</TableCell>
                        <TableCell align="left">{row.scam_url_link}</TableCell> */}
                        <TableCell align="left">
                          {row.scam_amount_lost}
                        </TableCell>
                        <TableCell align="left">
                          {row.scam_incident_description?.substring(0, 50) +
                            (row.scam_incident_description?.length > 50
                              ? "..."
                              : "")}
                        </TableCell>
                        <TableCell align="left">
                          <MuiChip
                            size="small"
                            label={row.status}
                            sx={{
                              mr: 1,
                              mb: 1,
                              backgroundColor:
                                row.status === "Resolved"
                                  ? green[500]
                                  : row.status === "Assigned"
                                  ? orange[500]
                                  : grey[500],
                              color: "#fff",
                            }}
                          />
                        </TableCell>
                        <TableCell align="left">{row.assigned_IO}</TableCell>
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
                                if (selected.length <= 1) {
                                  handleEdit(row.report_id); // FIXED: Pass report_id, not row
                                }
                              }}
                              disabled={selected.length > 1}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              size="large"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDelete(row.report_id);
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
          )}
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
      <ScamReportDetailsPopup
        open={descriptionDialogOpen}
        row={selectedRow}
        onClose={handleDescriptionDialogClose}
      />
      <EditScamReportDialog
        open={editDialogOpen}
        row={editRow}
        onClose={() => {
          setEditDialogOpen(false);
          setEditRow(null);
          setIsCreate(false);
        }}
        onSave={handleSaveEdit}
        isCreate={isCreate}
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this scam report?
          </Typography>
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
            Are you sure you want to delete the selected scam report(s)?
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

function ScamReportList() {
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
            Scam Reports
          </Typography>

          <MuiBreadcrumbs aria-label="Breadcrumb" sx={{ mt: 2 }}>
            <Link component={NextLink} href="/">
              Home
            </Link>
            <Typography>Scam Reports</Typography>
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

export default ScamReportList;


// "use client";

// import React, { useEffect, useState } from "react";
// import NextLink from "next/link";
// import {
//   Alert,
//   Box,
//   Breadcrumbs as MuiBreadcrumbs,
//   Button,
//   Checkbox,
//   Chip as MuiChip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Divider as MuiDivider,
//   Grid,
//   IconButton,
//   Link,
//   Paper as MuiPaper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TableSortLabel,
//   Toolbar,
//   Typography,
//   Menu,
//   MenuItem,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   Snackbar,
//   Stack,
//   Popover,
// } from "@mui/material";
// import { green, orange, blue, grey } from "@mui/material/colors";
// import {
//   Add as AddIcon,
//   Archive as ArchiveIcon,
//   FilterList as FilterListIcon,
//   RemoveRedEye as RemoveRedEyeIcon,
//   Delete as DeleteIcon,
//   CheckCircle as CheckCircleIcon,
//   Search as SearchIcon,
//   Refresh as RefreshIcon,
//   Edit as EditIcon,
// } from "@mui/icons-material";
// import * as yup from "yup";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import {
//   format,
//   startOfDay,
//   endOfDay,
//   parseISO,
//   isAfter,
//   isBefore,
// } from "date-fns";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import {
//   fetchScamReports,
//   deleteScamReport,
//   updateScamReport,
//   createScamReport,
//   fetchLinkedPersons,
//   addLinkedPerson,
//   deleteLinkedPerson,
// } from "@/lib/reports";

// type LinkedPerson = {
//   id: string;
//   name: string;
//   role: "witness" | "suspect" | "reportee" | "victim";
// };

// export type RowType = {
//   report_id: number;
//   scam_incident_date: string;
//   scam_report_date: string;
//   scam_type: string;
//   scam_approach_platform: string;
//   scam_communication_platform: string;
//   scam_transaction_type: string;
//   scam_beneficiary_platform: string;
//   scam_beneficiary_identifier: string;
//   scam_contact_no: string;
//   scam_email: string;
//   scam_moniker: string;
//   scam_url_link: string;
//   scam_amount_lost: string;
//   scam_incident_description: string;
//   status: "Unassigned" | "Assigned" | "Resolved";
//   assigned_IO: string;
//   linked_persons: LinkedPerson[];
// };

// // ADDED: Expanded Yup schema for full validation (mirroring persons_page.tsx style)
// const validationSchema = yup.object().shape({
//   scam_incident_date: yup
//     .date()
//     .required("Incident Date is required")
//     .nullable()
//     .max(new Date(), "Incident Date cannot be in the future")
//     .test(
//       "incident-before-report",
//       "Incident Date must be before or on Report Date",
//       function (value) {
//         const reportDate = this.parent.scam_report_date;
//         return !reportDate || !value || !isAfter(value, reportDate);
//       }
//     ),
//   scam_report_date: yup
//     .date()
//     .required("Report Date is required")
//     .nullable()
//     .max(new Date(), "Report Date cannot be in the future")
//     .test(
//       "report-after-incident",
//       "Report Date must be after or on Incident Date",
//       function (value) {
//         const incidentDate = this.parent.scam_incident_date;
//         return !incidentDate || !value || !isBefore(value, incidentDate);
//       }
//     ),
//   scam_type: yup.string().optional(),
//   scam_approach_platform: yup.string().optional(),
//   scam_communication_platform: yup.string().optional(),
//   scam_transaction_type: yup.string().optional(),
//   scam_beneficiary_platform: yup.string().optional(),
//   scam_beneficiary_identifier: yup.string().optional(),
//   scam_contact_no: yup.string().optional(),
//   scam_email: yup.string().optional(),
//   scam_moniker: yup.string().optional(),
//   scam_url_link: yup.string().optional(),
//   scam_amount_lost: yup
//     .number()
//     .min(0, "Amount Lost must be >= 0")
//     .optional()
//     .nullable()
//     .transform((val, orig) => (orig === "" ? null : val)), // Allow empty as null
//   scam_incident_description: yup
//     .string()
//     .required("Description is required")
//     .min(1, "Description cannot be empty"),
//   status: yup.string().optional(),
//   assigned_IO: yup.string().optional(),
// });

// function DateFilterMenu({
//   startDate,
//   endDate,
//   setStartDate,
//   setEndDate,
//   selectedRange,
//   setSelectedRange,
// }: {
//   startDate: Date | null;
//   endDate: Date | null;
//   setStartDate: (date: Date | null) => void;
//   setEndDate: (date: Date | null) => void;
//   selectedRange: string;
//   setSelectedRange: (range: string) => void;
// }) {
//   const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(
//     null
//   );
//   const [popoverAnchorEl, setPopoverAnchorEl] =
//     React.useState<HTMLElement | null>(null);

//   const handleDateFilterClick = (event: React.MouseEvent<HTMLElement>) => {
//     setMenuAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchorEl(null);
//   };

//   const handleRangeSelect = (
//     range: string,
//     event?: React.MouseEvent<HTMLElement>
//   ) => {
//     setSelectedRange(range);
//     let newStartDate: Date | null = null;
//     let newEndDate: Date | null = new Date();

//     switch (range) {
//       case "7days":
//         newStartDate = new Date();
//         newStartDate.setDate(newStartDate.getDate() - 7);
//         newStartDate = startOfDay(newStartDate);
//         newEndDate = endOfDay(newEndDate);
//         break;
//       case "30days":
//         newStartDate = new Date();
//         newStartDate.setDate(newStartDate.getDate() - 30);
//         newStartDate = startOfDay(newStartDate);
//         newEndDate = endOfDay(newEndDate);
//         break;
//       case "year":
//         newStartDate = new Date();
//         newStartDate.setFullYear(newStartDate.getFullYear() - 1);
//         newStartDate = startOfDay(newStartDate);
//         newEndDate = endOfDay(newEndDate);
//         break;
//       case "all":
//         newStartDate = null;
//         newEndDate = null;
//         break;
//       case "custom":
//         if (event) {
//           setPopoverAnchorEl(event.currentTarget);
//         }
//         return;
//     }

//     setStartDate(newStartDate);
//     setEndDate(newEndDate);
//     setMenuAnchorEl(null);
//   };

//   const handlePopoverClose = () => {
//     setPopoverAnchorEl(null);
//   };

//   const handleApplyCustomRange = () => {
//     setSelectedRange("custom");
//     if (startDate) setStartDate(startOfDay(startDate));
//     if (endDate) setEndDate(endOfDay(endDate));
//     setPopoverAnchorEl(null);
//   };

//   const handleResetDateFilter = () => {
//     setStartDate(null);
//     setEndDate(null);
//     setSelectedRange("all");
//     setPopoverAnchorEl(null);
//   };

//   return (
//     <>
//       <Button
//         variant="outlined"
//         onClick={handleDateFilterClick}
//         startIcon={<FilterListIcon />}
//       >
//         {selectedRange === "7days"
//           ? "Last 7 Days"
//           : selectedRange === "30days"
//           ? "Last 30 Days"
//           : selectedRange === "year"
//           ? "Last Year"
//           : selectedRange === "custom"
//           ? "Custom Range"
//           : "All Time"}
//       </Button>

//       <Menu
//         anchorEl={menuAnchorEl}
//         open={Boolean(menuAnchorEl)}
//         onClose={handleMenuClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//         transformOrigin={{ vertical: "top", horizontal: "left" }}
//       >
//         <MenuItem onClick={() => handleRangeSelect("7days")}>
//           Last 7 Days
//         </MenuItem>
//         <MenuItem onClick={() => handleRangeSelect("30days")}>
//           Last 30 Days
//         </MenuItem>
//         <MenuItem onClick={() => handleRangeSelect("year")}>Last Year</MenuItem>
//         <MenuItem onClick={() => handleRangeSelect("all")}>All Time</MenuItem>
//         <MenuItem onClick={(event) => handleRangeSelect("custom", event)}>
//           Custom Range
//         </MenuItem>
//         <MenuItem onClick={handleResetDateFilter}>Reset</MenuItem>
//       </Menu>

//       <Popover
//         open={Boolean(popoverAnchorEl)}
//         anchorEl={popoverAnchorEl}
//         onClose={handlePopoverClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//         transformOrigin={{ vertical: "top", horizontal: "left" }}
//       >
//         <Box sx={{ p: 2, minWidth: 300 }}>
//           <Typography variant="h6" gutterBottom>
//             Select Date Range
//           </Typography>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <DatePicker
//                 label="Start Date"
//                 value={startDate}
//                 onChange={(newValue) => setStartDate(newValue)}
//                 slotProps={{ textField: { size: "small" } }}
//                 format="dd/MM/yy"
//               />
//               <DatePicker
//                 label="End Date"
//                 value={endDate}
//                 onChange={(newValue) => setEndDate(newValue)}
//                 slotProps={{ textField: { size: "small" } }}
//                 format="dd/MM/yy"
//               />
//             </Box>
//           </LocalizationProvider>
//           <Box
//             sx={{
//               mt: 2,
//               display: "flex",
//               justifyContent: "flex-end",
//               gap: 1,
//             }}
//           >
//             <Button onClick={handleResetDateFilter} color="secondary">
//               Reset
//             </Button>
//             <Button onClick={handlePopoverClose}>Cancel</Button>
//             <Button onClick={handleApplyCustomRange} variant="contained">
//               Apply
//             </Button>
//           </Box>
//         </Box>
//       </Popover>
//     </>
//   );
// }

// function descendingComparator(a: RowType, b: RowType, orderBy: keyof RowType) {
//   if (orderBy === "scam_report_date" || orderBy === "scam_incident_date") {
//     return new Date(b[orderBy]).getTime() - new Date(a[orderBy]).getTime();
//   } else if (orderBy === "scam_amount_lost") {
//     return parseFloat(b[orderBy]) - parseFloat(a[orderBy]);
//   } else if (orderBy === "status") {
//     const statusOrder = { Resolved: 2, Assigned: 1, Unassigned: 0 };
//     return (
//       (statusOrder[b.status as keyof typeof statusOrder] || 0) -
//       (statusOrder[a.status as keyof typeof statusOrder] || 0)
//     );
//   } else if (typeof a[orderBy] === "number" && typeof b[orderBy] === "number") {
//     // Add this for numeric fields like report_id (descending: b - a)
//     return b[orderBy] - a[orderBy];
//   } else {
//     // Default to string comparison for other fields
//     if (typeof a[orderBy] === "string" && typeof b[orderBy] === "string") {
//       return b[orderBy].localeCompare(a[orderBy]);
//     }
//     return 0;
//   }
// }

// function getComparator(
//   order: "desc" | "asc",
//   orderBy: keyof RowType
// ): (a: RowType, b: RowType) => number {
//   return order === "desc"
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(
//   array: Array<RowType>,
//   comparator: (a: RowType, b: RowType) => number
// ) {
//   const stabilizedThis = array.map((el: RowType, index: number) => ({
//     el,
//     index,
//   }));
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a.el, b.el);
//     if (order !== 0) return order;
//     return a.index - b.index;
//   });
//   return stabilizedThis.map((element) => element.el);
// }

// type HeadCell = {
//   id: keyof RowType;
//   alignment: "left" | "center" | "right" | "justify" | "inherit" | undefined;
//   label: string;
//   disablePadding?: boolean;
// };
// const headCells: Array<HeadCell> = [
//   { id: "report_id", alignment: "left", label: "Report No" },
//   { id: "scam_incident_date", alignment: "left", label: "Incident Date" },
//   { id: "scam_report_date", alignment: "left", label: "Report Date" },
//   { id: "scam_type", alignment: "left", label: "Type" },
//   {
//     id: "scam_approach_platform",
//     alignment: "left",
//     label: "Approach Platform",
//   },
//   {
//     id: "scam_communication_platform",
//     alignment: "left",
//     label: "Communication Platform",
//   },
//   { id: "scam_transaction_type", alignment: "left", label: "Transaction Type" },
//   // {
//   //   id: "scam_beneficiary_platform",
//   //   alignment: "left",
//   //   label: "Beneficiary Platform",
//   // },
//   // {
//   //   id: "scam_beneficiary_identifier",
//   //   alignment: "left",
//   //   label: "Beneficiary ID",
//   // },
//   // { id: "scam_contact_no", alignment: "left", label: "Contact No" },
//   // { id: "scam_email", alignment: "left", label: "Email" },
//   // { id: "scam_moniker", alignment: "left", label: "Moniker" },
//   // { id: "scam_url_link", alignment: "left", label: "URL Link" },
//   { id: "scam_amount_lost", alignment: "left", label: "Amount Lost" },
//   { id: "scam_incident_description", alignment: "left", label: "Description" },
//   { id: "status", alignment: "left", label: "Status" },
//   { id: "assigned_IO", alignment: "left", label: "Assigned IO" },
// ];

// type EnhancedTableHeadProps = {
//   numSelected: number;
//   order: "desc" | "asc";
//   orderBy: keyof RowType;
//   rowCount: number;
//   onSelectAllClick: (
//     e: React.ChangeEvent<HTMLInputElement>,
//     checked: boolean
//   ) => void;
//   onRequestSort: (
//     event: React.MouseEvent<unknown>,
//     property: keyof RowType
//   ) => void;
// };

// function EnhancedTableHead(props: EnhancedTableHeadProps) {
//   const {
//     onSelectAllClick,
//     order,
//     orderBy,
//     numSelected,
//     rowCount,
//     onRequestSort,
//   } = props;
//   const createSortHandler =
//     (property: keyof RowType) => (event: React.MouseEvent<unknown>) => {
//       onRequestSort(event, property);
//     };

//   return (
//     <TableHead>
//       <TableRow>
//         <TableCell
//           padding="checkbox"
//           sx={{ backgroundColor: "#001f3f", color: "white" }}
//         >
//           <Checkbox
//             indeterminate={numSelected > 0 && numSelected < rowCount}
//             checked={rowCount > 0 && numSelected === rowCount}
//             onChange={onSelectAllClick}
//             sx={{ color: "white" }}
//           />
//         </TableCell>
//         {headCells.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             align={headCell.alignment}
//             sortDirection={orderBy === headCell.id ? order : false}
//             sx={{ backgroundColor: "#001f3f", color: "white" }}
//           >
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={orderBy === headCell.id ? order : "asc"}
//               onClick={createSortHandler(headCell.id)}
//               sx={{
//                 color: "white",
//                 "&:hover": { color: grey[300] },
//                 "&.Mui-active": { color: grey[300] },
//                 "& .MuiTableSortLabel-icon": { color: "white !important" },
//               }}
//             >
//               {headCell.label}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//         <TableCell sx={{ backgroundColor: "#001f3f", color: "white" }}>
//           Actions
//         </TableCell>
//       </TableRow>
//     </TableHead>
//   );
// }

// function EnhancedTableToolbar({ numSelected }: { numSelected: number }) {
//   return (
//     <Toolbar>
//       <Box sx={{ minWidth: 150 }}>
//         {numSelected > 0 ? (
//           <Typography color="inherit" variant="subtitle1">
//             {numSelected} selected
//           </Typography>
//         ) : null}
//       </Box>
//       <Box sx={{ flex: "1 1 100%" }} />
//     </Toolbar>
//   );
// }

// function ScamReportDetailsPopup({
//   open,
//   row,
//   onClose,
// }: {
//   open: boolean;
//   row: RowType | null;
//   onClose: () => void;
// }) {
//   if (!row) return null;

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle
//         sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}
//       >
//         Report Details
//       </DialogTitle>
//       <DialogContent sx={{ p: 3 }}>
//         <Grid container spacing={2}>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Report ID:</strong> {row.report_id}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Incident Date:</strong>{" "}
//               {row.scam_incident_date
//                 ? format(parseISO(row.scam_incident_date), "dd/MM/yy")
//                 : "N/A"}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Report Date:</strong>{" "}
//               {row.scam_report_date
//                 ? format(parseISO(row.scam_report_date), "dd/MM/yy HH:mm")
//                 : "N/A"}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Type:</strong> {row.scam_type}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Approach Platform:</strong> {row.scam_approach_platform}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Communication Platform:</strong>{" "}
//               {row.scam_communication_platform}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Transaction Type:</strong> {row.scam_transaction_type}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Beneficiary Platform:</strong>{" "}
//               {row.scam_beneficiary_platform}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Beneficiary ID:</strong> {row.scam_beneficiary_identifier}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Contact No:</strong> {row.scam_contact_no}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Email:</strong> {row.scam_email}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Moniker:</strong> {row.scam_moniker}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>URL Link:</strong> {row.scam_url_link}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Amount Lost:</strong> {row.scam_amount_lost}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Status:</strong>
//             </Typography>
//             <MuiChip
//               label={row.status}
//               sx={{
//                 backgroundColor:
//                   row.status === "Resolved"
//                     ? green[500]
//                     : row.status === "Assigned"
//                     ? orange[500]
//                     : grey[500],
//                 color: "#fff",
//                 mt: 0.5,
//               }}
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <Typography>
//               <strong>Assigned IO:</strong> {row.assigned_IO}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: 12 }}>
//             <Typography sx={{ mb: 1 }}>
//               <strong>Description:</strong>
//             </Typography>
//             <TextField
//               fullWidth
//               multiline
//               rows={4}
//               value={row.scam_incident_description}
//               variant="outlined"
//               InputProps={{ readOnly: true }}
//               sx={{ backgroundColor: "#fafafa" }} // Light box effect
//             />
//           </Grid>
//           <Grid size={{ xs: 12 }}>
//             <Typography sx={{ mb: 1 }}>
//               <strong>Linked Persons:</strong>
//             </Typography>
//             {row.linked_persons.length > 0 ? (
//               <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                 {row.linked_persons.map((p) => (
//                   <MuiChip
//                     key={p.id}
//                     label={`${p.name} (${p.role})`}
//                     color="primary"
//                     variant="outlined"
//                   />
//                 ))}
//               </Box>
//             ) : (
//               <Typography>None</Typography>
//             )}
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions sx={{ borderTop: "1px solid #ddd" }}>
//         <Button onClick={onClose} variant="contained">
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// function EditScamReportDialog({
//   open,
//   row,
//   onClose,
//   onSave,
//   isCreate = false,
// }: {
//   open: boolean;
//   row: RowType | null;
//   onClose: () => void;
//   onSave: (updated: RowType) => void;
//   isCreate?: boolean;
// }) {
//   if (!row) return null;

//   // ADDED: States for custom "OTHERS" fields
//   const [customScamType, setCustomScamType] = useState("");
//   const [customTransactionType, setCustomTransactionType] = useState("");

//   // ADDED: React-Hook-Form setup (like persons_page.tsx)
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<RowType>({
//     resolver: yupResolver(validationSchema),
//     defaultValues: row,
//   });

//   // ADDED: Reset form when row changes (for edit/create)
//   useEffect(() => {
//     reset(row);
//     // Extract custom if "OTHERS" is in the value (e.g., "OTHERS: MyCustom")
//     if (row.scam_type.startsWith("OTHERS:")) {
//       setCustomScamType(row.scam_type.split(":")[1].trim());
//     }
//     if (row.scam_transaction_type.startsWith("OTHERS:")) {
//       setCustomTransactionType(row.scam_transaction_type.split(":")[1].trim());
//     }
//   }, [row, reset]);

//   // ADDED: Form submit handler - uppercase fields, combine "OTHERS" customs, then save
//   const onSubmit = (data: RowType) => {
//     const uppercasedData = {
//       ...data,
//       scam_type: data.scam_type ? data.scam_type.toUpperCase() : "",
//       scam_approach_platform: data.scam_approach_platform
//         ? data.scam_approach_platform.toUpperCase()
//         : "",
//       scam_communication_platform: data.scam_communication_platform
//         ? data.scam_communication_platform.toUpperCase()
//         : "",
//       scam_transaction_type: data.scam_transaction_type
//         ? data.scam_transaction_type.toUpperCase()
//         : "",
//       scam_beneficiary_platform: data.scam_beneficiary_platform
//         ? data.scam_beneficiary_platform.toUpperCase()
//         : "",
//     };

//     // Combine custom if "OTHERS"
//     if (uppercasedData.scam_type === "OTHERS" && customScamType) {
//       uppercasedData.scam_type = `OTHERS: ${customScamType.toUpperCase()}`;
//     }
//     if (
//       uppercasedData.scam_transaction_type === "OTHERS" &&
//       customTransactionType
//     ) {
//       uppercasedData.scam_transaction_type = `OTHERS: ${customTransactionType.toUpperCase()}`;
//     }

//     onSave(uppercasedData);
//   };

//   // Keep linked persons and add new as before (not part of form validation)
//   const [editedLinkedPersons, setEditedLinkedPersons] = useState<
//     LinkedPerson[]
//   >(row.linked_persons);
//   const [newPersonId, setNewPersonId] = useState("");
//   const [newRole, setNewRole] = useState("victim");

//   useEffect(() => {
//     setEditedLinkedPersons(row.linked_persons);
//   }, [row]);

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle
//         sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}
//       >
//         {isCreate ? "Create Report" : "Edit Report"}
//       </DialogTitle>
//       <DialogContent sx={{ p: 6, pb: 6, minHeight: "60vh" }}>
//         {/* CHANGED: Wrap in form with handleSubmit */}
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Grid container spacing={2} sx={{ mt: 2 }}>
//             {!isCreate && (
//               <Grid size={{ xs: 6 }}>
//                 <Controller
//                   name="report_id"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       fullWidth
//                       label="Report ID"
//                       disabled
//                     />
//                   )}
//                 />
//               </Grid>
//             )}
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="scam_incident_date"
//                 control={control}
//                 render={({ field }) => (
//                   <LocalizationProvider dateAdapter={AdapterDateFns}>
//                     <DatePicker
//                       {...field}
//                       label="Incident Date*" // ADDED: * for required
//                       value={field.value ? parseISO(field.value) : null}
//                       onChange={(newValue) =>
//                         field.onChange(
//                           newValue ? format(newValue, "yyyy-MM-dd") : null
//                         )
//                       }
//                       slotProps={{
//                         textField: {
//                           fullWidth: true,
//                           error: !!errors.scam_incident_date,
//                           helperText: errors.scam_incident_date?.message,
//                         },
//                       }}
//                       maxDate={new Date()} // ADDED: No future dates
//                     />
//                   </LocalizationProvider>
//                 )}
//               />
//             </Grid>
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="scam_report_date"
//                 control={control}
//                 render={({ field }) => (
//                   <LocalizationProvider dateAdapter={AdapterDateFns}>
//                     <DatePicker
//                       {...field}
//                       label="Report Date*" // ADDED: * for required
//                       value={field.value ? parseISO(field.value) : null}
//                       onChange={(newValue) =>
//                         field.onChange(
//                           newValue ? format(newValue, "yyyy-MM-dd") : null
//                         )
//                       }
//                       slotProps={{
//                         textField: {
//                           fullWidth: true,
//                           error: !!errors.scam_report_date,
//                           helperText: errors.scam_report_date?.message,
//                         },
//                       }}
//                       maxDate={new Date()} // ADDED: No future dates
//                     />
//                   </LocalizationProvider>
//                 )}
//               />
//             </Grid>
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="scam_type"
//                 control={control}
//                 render={({ field }) => (
//                   <FormControl fullWidth error={!!errors.scam_type}>
//                     <InputLabel>Scam Type</InputLabel>{" "}
//                     {/* CHANGED: Renamed label to "Scam Type" */}
//                     <Select {...field} label="Scam Type">
//                       <MenuItem value="E-COMMERCE">E-commerce</MenuItem>
//                       <MenuItem value="GOVERNMENT OFFICIALS IMPERSONATION">
//                         Government Officials Impersonation
//                       </MenuItem>
//                       <MenuItem value="PHISHING">Phishing</MenuItem>
//                       <MenuItem value="OTHERS">Others</MenuItem>
//                     </Select>
//                     {errors.scam_type && (
//                       <Typography color="error">
//                         {errors.scam_type.message}
//                       </Typography>
//                     )}
//                   </FormControl>
//                 )}
//               />
//               {/* ADDED: Conditional custom field for "OTHERS" */}
//               {control._getWatch("scam_type") === "OTHERS" && (
//                 <TextField
//                   fullWidth
//                   label="Custom Scam Type"
//                   value={customScamType}
//                   onChange={(e) => setCustomScamType(e.target.value)}
//                   sx={{ mt: 1 }}
//                 />
//               )}
//             </Grid>
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="scam_approach_platform"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     label="Approach Platform"
//                     error={!!errors.scam_approach_platform}
//                     helperText={errors.scam_approach_platform?.message}
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="scam_communication_platform"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     label="Communication Platform"
//                     error={!!errors.scam_communication_platform}
//                     helperText={errors.scam_communication_platform?.message}
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="scam_transaction_type"
//                 control={control}
//                 render={({ field }) => (
//                   <FormControl fullWidth error={!!errors.scam_transaction_type}>
//                     <InputLabel>Transaction Type</InputLabel>
//                     <Select {...field} label="Transaction Type">
//                       <MenuItem value="E-WALLET">E-wallet</MenuItem>
//                       <MenuItem value="CRYPTO">Crypto</MenuItem>
//                       <MenuItem value="BANK TRANSFER">Bank Transfer</MenuItem>
//                       <MenuItem value="OTHERS">Others</MenuItem>
//                     </Select>
//                     {errors.scam_transaction_type && (
//                       <Typography color="error">
//                         {errors.scam_transaction_type.message}
//                       </Typography>
//                     )}
//                   </FormControl>
//                 )}
//               />
//               {/* ADDED: Conditional custom field for "OTHERS" */}
//               {control._getWatch("scam_transaction_type") === "OTHERS" && (
//                 <TextField
//                   fullWidth
//                   label="Custom Transaction Type"
//                   value={customTransactionType}
//                   onChange={(e) => setCustomTransactionType(e.target.value)}
//                   sx={{ mt: 1 }}
//                 />
//               )}
//             </Grid>
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="scam_beneficiary_platform"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     label="Beneficiary Platform"
//                     error={!!errors.scam_beneficiary_platform}
//                     helperText={errors.scam_beneficiary_platform?.message}
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="scam_beneficiary_identifier"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     label="Beneficiary ID"
//                     error={!!errors.scam_beneficiary_identifier}
//                     helperText={errors.scam_beneficiary_identifier?.message}
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="scam_contact_no"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     label="Contact No"
//                     error={!!errors.scam_contact_no}
//                     helperText={errors.scam_contact_no?.message}
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="scam_email"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     label="Email"
//                     error={!!errors.scam_email}
//                     helperText={errors.scam_email?.message}
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="scam_moniker"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     label="Moniker"
//                     error={!!errors.scam_moniker}
//                     helperText={errors.scam_moniker?.message}
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="scam_url_link"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     label="URL Link"
//                     error={!!errors.scam_url_link}
//                     helperText={errors.scam_url_link?.message}
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="scam_amount_lost"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     label="Amount Lost"
//                     type="number" // ADDED: For integer input
//                     inputProps={{ step: "1" }} // ADDED: Step 1 for integers
//                     error={!!errors.scam_amount_lost}
//                     helperText={errors.scam_amount_lost?.message}
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="status"
//                 control={control}
//                 render={({ field }) => (
//                   <FormControl fullWidth error={!!errors.status}>
//                     <InputLabel>Status</InputLabel>
//                     <Select {...field} label="Status">
//                       <MenuItem value="Unassigned">Unassigned</MenuItem>
//                       <MenuItem value="Assigned">Assigned</MenuItem>
//                       <MenuItem value="Resolved">Resolved</MenuItem>
//                     </Select>
//                     {errors.status && (
//                       <Typography color="error">
//                         {errors.status.message}
//                       </Typography>
//                     )}
//                   </FormControl>
//                 )}
//               />
//             </Grid>
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="assigned_IO"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     label="Assigned IO"
//                     error={!!errors.assigned_IO}
//                     helperText={errors.assigned_IO?.message}
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid size={{ xs: 12 }}>
//               <Controller
//                 name="scam_incident_description"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     multiline
//                     rows={4}
//                     label="Description*" // ADDED: * for required
//                     error={!!errors.scam_incident_description}
//                     helperText={errors.scam_incident_description?.message}
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid size={{ xs: 12 }}>
//               <Typography sx={{ mb: 1 }}>
//                 <strong>Linked Persons:</strong>
//               </Typography>
//               <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
//                 {editedLinkedPersons.map((p) => (
//                   <MuiChip
//                     key={p.id}
//                     label={`${p.name} (${p.role})`}
//                     color="primary"
//                     variant="outlined"
//                     onDelete={() => {
//                       setEditedLinkedPersons((prev) =>
//                         prev.filter((person) => person.id !== p.id)
//                       );
//                     }}
//                   />
//                 ))}
//               </Box>
//               <Stack direction="row" spacing={2}>
//                 <TextField
//                   label="Person ID"
//                   value={newPersonId}
//                   onChange={(e) => setNewPersonId(e.target.value)}
//                   type="number"
//                 />
//                 <FormControl sx={{ minWidth: 120 }}>
//                   <InputLabel>Role</InputLabel>
//                   <Select
//                     value={newRole}
//                     onChange={(e) => setNewRole(e.target.value as string)}
//                   >
//                     <MenuItem value="victim">Victim</MenuItem>
//                     <MenuItem value="suspect">Suspect</MenuItem>
//                     <MenuItem value="witness">Witness</MenuItem>
//                     <MenuItem value="reportee">Reportee</MenuItem>
//                   </Select>
//                 </FormControl>
//                 <Button
//                   variant="contained"
//                   onClick={() => {
//                     const newP = {
//                       id: newPersonId,
//                       name: `Person ${newPersonId}`,
//                       role: newRole as LinkedPerson["role"],
//                     };
//                     setEditedLinkedPersons((prev) => [...prev, newP]);
//                     setNewPersonId("");
//                     setNewRole("victim");
//                   }}
//                 >
//                   Add
//                 </Button>
//               </Stack>
//             </Grid>
//           </Grid>
//           {/* CHANGED: Save button now submits the form */}
//           <DialogActions sx={{ borderTop: "1px solid #ddd" }}>
//             <Button onClick={onClose}>Cancel</Button>
//             <Button type="submit" variant="contained">
//               Save
//             </Button>
//           </DialogActions>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// function EnhancedTable() {
//   const [order, setOrder] = useState<"desc" | "asc">("asc");
//   const [orderBy, setOrderBy] = useState<keyof RowType>("report_id");
//   const [selected, setSelected] = useState<number[]>([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
//   const [selectedRange, setSelectedRange] = useState("all");
//   const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success" as "success" | "error",
//   });
//   const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);
//   const [selectedRow, setSelectedRow] = useState<RowType | null>(null);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editRow, setEditRow] = useState<RowType | null>(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState<number | null>(null);
//   const [isCreate, setIsCreate] = useState(false);

//   const [rows, setRows] = useState<RowType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const loadReports = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchScamReports();
//       setRows(data);
//       setError(null);
//     } catch (err) {
//       setError((err as Error).message);
//       setSnackbar({
//         open: true,
//         message: (err as Error).message,
//         severity: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadReports();
//   }, []);

//   const handleRequestSort = (
//     event: React.MouseEvent<unknown>,
//     property: keyof RowType
//   ) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const handleSelectAllClick = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     checked: boolean
//   ) => {
//     if (checked) {
//       setSelected(filteredRows.map((n) => n.report_id));
//       return;
//     }
//     setSelected([]);
//   };

//   const handleClick = (event: React.MouseEvent<unknown>, report_id: number) => {
//     const selectedIndex = selected.indexOf(report_id);
//     let newSelected: number[] = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, report_id);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selected.slice(0, selectedIndex),
//         selected.slice(selectedIndex + 1)
//       );
//     }

//     setSelected(newSelected);
//   };

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const isSelected = (report_id: number) => selected.indexOf(report_id) !== -1;

//   const emptyRows =
//     rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(event.target.value);
//   };

//   const filteredRows = rows.filter((row) => {
//     const matchesSearch = Object.values(row).some((value) =>
//       value.toString().toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     const matchesStatus = statusFilter === "All" || row.status === statusFilter;
//     const reportDate = parseISO(row.scam_report_date);
//     const matchesDate =
//       (!startDate || reportDate >= startDate) &&
//       (!endDate || reportDate <= endDate);
//     return matchesSearch && matchesDate && matchesStatus;
//   });

//   const handleRowClick = (row: RowType) => {
//     setSelectedRow(row);
//     setDescriptionDialogOpen(true);
//   };

//   const handleDescriptionDialogClose = () => {
//     setDescriptionDialogOpen(false);
//     setSelectedRow(null);
//   };

//   const handleEdit = (report_id: number) => {
//     const rowToEdit = rows.find((row) => row.report_id === report_id);
//     if (rowToEdit) {
//       setEditRow(rowToEdit);
//       setEditDialogOpen(true);
//     }
//   };

//   const handleSaveEdit = async (updatedRow: RowType) => {
//     try {
//       let updated;
//       if (isCreate) {
//         updated = await createScamReport(updatedRow); // ADDED: Create if in create mode
//       } else {
//         updated = await updateScamReport(updatedRow.report_id, updatedRow); // Existing update
//       }
//       // Handle linked persons (compare original vs updated)
//       const originalLinks = await fetchLinkedPersons(
//         updated.report_id || updatedRow.report_id
//       ); // Fetch original
//       const newLinks = updatedRow.linked_persons;

//       // Deletes
//       for (const orig of originalLinks) {
//         if (!newLinks.find((n) => n.id === orig.id.toString())) {
//           await deleteLinkedPerson(updated.report_id, parseInt(orig.id));
//         }
//       }
//       // Adds
//       for (const nw of newLinks) {
//         if (!originalLinks.find((o) => o.id === nw.id)) {
//           await addLinkedPerson(updated.report_id, {
//             person_id: parseInt(nw.id),
//             role: nw.role,
//           });
//         }
//       }

//       loadReports(); // ADDED: Refresh full list (instead of manual setRows)
//       setSnackbar({
//         open: true,
//         message: isCreate
//           ? "Report created successfully"
//           : "Report updated successfully",
//         severity: "success",
//       });
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: (err as Error).message,
//         severity: "error",
//       });
//     } finally {
//       setEditDialogOpen(false);
//       setEditRow(null);
//       setIsCreate(false);
//     }
//   };

//   const handleDelete = (report_id: number) => {
//     setDeleteId(report_id);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!deleteId) return;
//     try {
//       setRows((prev) => prev.filter((row) => row.report_id !== deleteId));
//       await deleteScamReport(deleteId);
//       setSelected([]);
//       setSnackbar({
//         open: true,
//         message: "Report deleted successfully",
//         severity: "success",
//       });
//     } catch (err) {
//       loadReports();
//       setSelected([]);
//       setSnackbar({
//         open: true,
//         message: (err as Error).message,
//         severity: "error",
//       });
//     } finally {
//       setDeleteDialogOpen(false);
//       setDeleteId(null);
//     }
//   };

//   const handleBulkDelete = () => {
//     setBulkDeleteDialogOpen(true);
//   };

//   const confirmBulkDelete = async () => {
//     try {
//       const currentSelected = [...selected];
//       setRows((prev) =>
//         prev.filter((row) => !currentSelected.includes(row.report_id))
//       );
//       for (const id of currentSelected) {
//         await deleteScamReport(id);
//       }
//       setSelected([]);
//       setSnackbar({
//         open: true,
//         message: "Reports deleted successfully",
//         severity: "success",
//       });
//     } catch (err) {
//       loadReports();
//       setSelected([]);
//       setSnackbar({
//         open: true,
//         message: "Failed to delete some reports",
//         severity: "error",
//       });
//     } finally {
//       setBulkDeleteDialogOpen(false);
//     }
//   };

//   const handleBulkEdit = () => {
//     if (selected.length === 1) {
//       handleEdit(selected[0]);
//     }
//   };

//   const handleManageReportsClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   return (
//     <div>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//         <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//           <TextField
//             variant="outlined"
//             size="small"
//             placeholder="Search Description/Type/Moniker/Email/Contact/URL/Report No"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             InputProps={{
//               startAdornment: <SearchIcon />,
//             }}
//             sx={{ minWidth: 300 }}
//           />
//           <FormControl size="small" sx={{ minWidth: 150 }}>
//             <InputLabel>Status</InputLabel>
//             <Select
//               value={statusFilter}
//               label="Status"
//               onChange={(e) => setStatusFilter(e.target.value as string)}
//             >
//               <MenuItem value="All">All</MenuItem>
//               <MenuItem value="Unassigned">Unassigned</MenuItem>
//               <MenuItem value="Assigned">Assigned</MenuItem>
//               <MenuItem value="Resolved">Resolved</MenuItem>
//             </Select>
//           </FormControl>
//           <DateFilterMenu
//             startDate={startDate}
//             endDate={endDate}
//             setStartDate={setStartDate}
//             setEndDate={setEndDate}
//             selectedRange={selectedRange}
//             setSelectedRange={setSelectedRange}
//           />
//         </Box>
//         <Box sx={{ flexGrow: 1 }} />
//         <Button
//           color="primary"
//           variant="contained"
//           size="small"
//           startIcon={<AddIcon />}
//           sx={{ mr: 2, minWidth: "110px", minHeight: "35px" }}
//           onClick={() => {
//             setEditRow({
//               report_id: 0, // Temp ID, backend assigns real
//               scam_incident_date: "",
//               scam_report_date: "",
//               scam_type: "",
//               scam_approach_platform: "",
//               scam_communication_platform: "",
//               scam_transaction_type: "",
//               scam_beneficiary_platform: "",
//               scam_beneficiary_identifier: "",
//               scam_contact_no: "",
//               scam_email: "",
//               scam_moniker: "",
//               scam_url_link: "",
//               scam_amount_lost: "",
//               scam_incident_description: "",
//               status: "Unassigned",
//               assigned_IO: "",
//               linked_persons: [],
//             });
//             setIsCreate(true); // Set create mode
//             setEditDialogOpen(true); // Open dialog
//           }}
//         >
//           Add Report
//         </Button>
//         <Box>
//           <Button
//             variant="contained"
//             disabled={selected.length === 0}
//             onClick={handleManageReportsClick}
//             sx={{ minWidth: "110px", minHeight: "35px" }}
//           >
//             Manage Reports
//           </Button>
//           <Menu
//             id="manage-reports-menu"
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//             transformOrigin={{ vertical: "top", horizontal: "right" }}
//           >
//             <MenuItem
//               onClick={handleBulkEdit}
//               disabled={selected.length !== 1} // Disable unless exactly 1 selected
//             >
//               <EditIcon fontSize="small" sx={{ mr: 1 }} />
//               Edit
//             </MenuItem>
//             <MenuItem onClick={handleBulkDelete}>
//               <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
//               Delete
//             </MenuItem>
//           </Menu>
//         </Box>
//       </Box>
//       <MuiPaper>
//         <EnhancedTableToolbar numSelected={selected.length} />
//         <TableContainer sx={{ overflowX: "auto" }}>
//           {loading ? (
//             <Typography sx={{ p: 2 }}>Loading reports...</Typography>
//           ) : error ? (
//             <Alert severity="error" sx={{ m: 2 }}>
//               {error}
//             </Alert>
//           ) : (
//             <Table
//               aria-labelledby="tableTitle"
//               size="small"
//               aria-label="enhanced table"
//             >
//               <EnhancedTableHead
//                 numSelected={selected.length}
//                 order={order}
//                 orderBy={orderBy}
//                 onSelectAllClick={handleSelectAllClick}
//                 onRequestSort={handleRequestSort}
//                 rowCount={filteredRows.length}
//               />
//               <TableBody>
//                 {stableSort(filteredRows, getComparator(order, orderBy))
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((row, index) => {
//                     const isItemSelected = isSelected(row.report_id);
//                     const labelId = `enhanced-table-checkbox-${index}`;

//                     return (
//                       <TableRow
//                         hover
//                         role="checkbox"
//                         aria-checked={isItemSelected}
//                         tabIndex={-1}
//                         key={`${row.report_id}-${index}`}
//                         selected={isItemSelected}
//                         onClick={() => handleRowClick(row)}
//                         sx={{ cursor: "pointer" }}
//                       >
//                         <TableCell padding="checkbox">
//                           <Checkbox
//                             checked={isItemSelected}
//                             inputProps={{ "aria-labelledby": labelId }}
//                             onClick={(event) => {
//                               event.stopPropagation();
//                               handleClick(event, row.report_id);
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell align="left">{row.report_id}</TableCell>
//                         <TableCell align="left">
//                           {row.scam_incident_date
//                             ? format(
//                                 parseISO(row.scam_incident_date),
//                                 "dd/MM/yy"
//                               )
//                             : ""}
//                         </TableCell>
//                         <TableCell align="left">
//                           {row.scam_report_date
//                             ? format(parseISO(row.scam_report_date), "dd/MM/yy")
//                             : ""}
//                         </TableCell>
//                         <TableCell align="left">{row.scam_type}</TableCell>
//                         <TableCell align="left">
//                           {row.scam_approach_platform}
//                         </TableCell>
//                         <TableCell align="left">
//                           {row.scam_communication_platform}
//                         </TableCell>
//                         <TableCell align="left">
//                           {row.scam_transaction_type}
//                         </TableCell>
//                         {/* <TableCell align="left">
//                           {row.scam_beneficiary_platform}
//                         </TableCell>
//                         <TableCell align="left">
//                           {row.scam_beneficiary_identifier}
//                         </TableCell>
//                         <TableCell align="left">{row.scam_contact_no}</TableCell>
//                         <TableCell align="left">{row.scam_email}</TableCell>
//                         <TableCell align="left">{row.scam_moniker}</TableCell>
//                         <TableCell align="left">{row.scam_url_link}</TableCell> */}
//                         <TableCell align="left">
//                           {row.scam_amount_lost}
//                         </TableCell>
//                         <TableCell align="left">
//                           {row.scam_incident_description?.substring(0, 50) +
//                             (row.scam_incident_description?.length > 50
//                               ? "..."
//                               : "")}
//                         </TableCell>
//                         <TableCell align="left">
//                           <MuiChip
//                             size="small"
//                             label={row.status}
//                             sx={{
//                               mr: 1,
//                               mb: 1,
//                               backgroundColor:
//                                 row.status === "Resolved"
//                                   ? green[500]
//                                   : row.status === "Assigned"
//                                   ? orange[500]
//                                   : grey[500],
//                               color: "#fff",
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell align="left">{row.assigned_IO}</TableCell>
//                         <TableCell padding="none" align="left">
//                           <Box
//                             sx={{
//                               display: "flex",
//                               flexDirection: "row",
//                               flexWrap: "nowrap",
//                               mr: 2,
//                             }}
//                           >
//                             <IconButton
//                               aria-label="delete"
//                               size="large"
//                               onClick={(event) => {
//                                 event.stopPropagation();
//                                 handleDelete(row.report_id);
//                               }}
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                             <IconButton
//                               aria-label="edit"
//                               size="large"
//                               onClick={(event) => {
//                                 event.stopPropagation();
//                                 if (selected.length <= 1) {
//                                   handleEdit(row.report_id); // FIXED: Pass report_id, not row
//                                 }
//                               }}
//                               disabled={selected.length > 1}
//                             >
//                               <EditIcon />
//                             </IconButton>
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 {emptyRows > 0 && (
//                   <TableRow style={{ height: 53 * emptyRows }}>
//                     <TableCell colSpan={headCells.length + 2} />
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           )}
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={filteredRows.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </MuiPaper>
//       <ScamReportDetailsPopup
//         open={descriptionDialogOpen}
//         row={selectedRow}
//         onClose={handleDescriptionDialogClose}
//       />
//       <EditScamReportDialog
//         open={editDialogOpen}
//         row={editRow}
//         onClose={() => {
//           setEditDialogOpen(false);
//           setEditRow(null);
//           setIsCreate(false);
//         }}
//         onSave={handleSaveEdit}
//         isCreate={isCreate}
//       />
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//       >
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to delete this scam report?
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//           <Button onClick={confirmDelete} color="secondary">
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Dialog
//         open={bulkDeleteDialogOpen}
//         onClose={() => setBulkDeleteDialogOpen(false)}
//       >
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to delete the selected scam report(s)?
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setBulkDeleteDialogOpen(false)}>Cancel</Button>
//           <Button onClick={confirmBulkDelete} color="secondary">
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// }

// function ScamReportList() {
//   return (
//     <React.Fragment>
//       <Grid container direction="column" spacing={6}>
//         <Grid item>
//           <Typography
//             variant="h3"
//             gutterBottom
//             display="inline"
//             sx={{
//               fontFamily: "Helvetica, sans-serif",
//               fontWeight: 600,
//               letterSpacing: 0.6,
//               color: "#001f3f",
//             }}
//           >
//             Scam Reports
//           </Typography>

//           <MuiBreadcrumbs aria-label="Breadcrumb" sx={{ mt: 2 }}>
//             <Link component={NextLink} href="/">
//               Home
//             </Link>
//             <Typography>Scam Reports</Typography>
//           </MuiBreadcrumbs>
//           <Box sx={{ height: "20px" }} />
//         </Grid>
//         <Grid item xs={12} spacing={6}>
//           <EnhancedTable />
//         </Grid>
//       </Grid>
//     </React.Fragment>
//   );
// }

// export default ScamReportList;
