"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
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
  FilterList as FilterListIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { format, startOfDay, endOfDay, parseISO, isValid } from "date-fns";
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

import { fetchIOs } from '@/lib/reports';

type LinkedPerson = {
  id: string;
  name: string;
  role: "witness" | "suspect" | "reportee" | "victim";
};

export type RowType = {
  report_id: number;
  scam_incident_date: string | null; 
  scam_report_date: string | null; 
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
  io_in_charge: number | null;
  assigned_IO: string;
  linked_persons: LinkedPerson[];
};

const validationSchema = yup.object().shape({
  scam_incident_date: yup
    .string()
    .required("Incident Date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format (expected YYYY-MM-DD)", excludeEmptyString: true })
    .test("is-valid-date", "Invalid date", (value) => {
      if (!value) return true;
      return isValid(parseISO(value));
    })
    .test("max-date", "Incident Date cannot be in the future", (value) => {
      if (!value) return true;
      return parseISO(value) <= new Date();
    }),
  scam_report_date: yup
    .string()
    .required("Report Date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format (expected YYYY-MM-DD)", excludeEmptyString: true })
    .test("is-valid-date", "Invalid date", (value) => {
      if (!value) return true;
      return isValid(parseISO(value));
    })
    .test("max-date", "Report Date cannot be in the future", (value) => {
      if (!value) return true;
      return parseISO(value) <= new Date();
    }),
  scam_incident_description: yup
    .string()
    .required("Description is required")
    .min(1, "Description cannot be empty")
    .nullable(),
  scam_type: yup
    .string()
    .nullable()
    .transform((val) => (val ? val.toUpperCase() : val)),  
  scam_approach_platform: yup
    .string()
    .nullable()
    .transform((val) => (val ? val.toUpperCase() : val)),  
  scam_communication_platform: yup
    .string()
    .nullable()
    .transform((val) => (val ? val.toUpperCase() : val)),  
  scam_transaction_type: yup
    .string()
    .nullable()
    .transform((val) => (val ? val.toUpperCase() : val)),  
  scam_beneficiary_platform: yup
    .string()
    .nullable()
    .transform((val) => (val ? val.toUpperCase() : val)),  
  scam_amount_lost: yup
    .number()
    .nullable()
    .transform((val, originalVal) => (originalVal === '' ? null : val)),  
  scam_beneficiary_identifier: yup.string().nullable(),
  scam_contact_no: yup.string().nullable(),
  scam_email: yup.string().nullable(),
  scam_moniker: yup.string().nullable(),
  scam_url_link: yup.string().nullable(),
  status: yup.string().nullable(),
  assigned_IO: yup.string().nullable(),
  io_in_charge: yup.number().nullable().transform((val, originalVal) => (originalVal === '' ? null : val)), // Allows null for unassigned
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
            Report Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Report ID:
                </Typography>
                <Typography>{row.report_id}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Incident Date:
                </Typography>
                <Typography>
                  {row.scam_incident_date
                    ? format(parseISO(row.scam_incident_date), "dd/MM/yy")
                    : "N/A"}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Report Date:
                </Typography>
                <Typography>
                  {row.scam_report_date
                    ? format(parseISO(row.scam_report_date), "dd/MM/yy HH:mm")
                    : "N/A"}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Scam Type:
                </Typography>
                <Typography>{row.scam_type}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Status:
                </Typography>
                <MuiChip
                  label={row.status.toUpperCase()}
                  sx={{
                    backgroundColor:
                      row.status === "Resolved"
                        ? green[500]
                        : row.status === "Assigned"
                        ? orange[500]
                        : grey[500],
                    color: "#fff",
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Assigned IO:
                </Typography>
                <Typography>{row.assigned_IO}</Typography>
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
            Platforms
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Approach Platform:
                </Typography>
                <Typography>{row.scam_approach_platform}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Communication Platform:
                </Typography>
                <Typography>{row.scam_communication_platform}</Typography>
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
            Transaction Details
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Transaction Type: 
                </Typography>
                <Typography>{row.scam_transaction_type}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Beneficiary Platform:
                </Typography>
                <Typography>{row.scam_beneficiary_platform}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Beneficiary ID: 
                </Typography>
                <Typography>{row.scam_beneficiary_identifier}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Amount Lost:
                </Typography>
                <Typography>{row.scam_amount_lost}</Typography>
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
            Contact Details
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Contact No:
                </Typography>
                <Typography>{row.scam_contact_no}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Email:
                </Typography>
                <Typography>{row.scam_email}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  Moniker:
                </Typography>
                <Typography>{row.scam_moniker}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ minWidth: "140px", fontWeight: "bold" }}>
                  URL Link:
                </Typography>
                <Typography>{row.scam_url_link}</Typography>
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
            Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={row.scam_incident_description}
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ backgroundColor: "#fafafa" }}
          />
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
          <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 2 }}>
            Linked Persons
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
        </Box>
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
  ios,
}: {
  open: boolean;
  row: RowType | null;
  onClose: () => void;
  onSave: (updated: RowType) => void;
  isCreate?: boolean;
  ios: { user_id: number; full_name: string }[];
}) {
  if (!row) return null;
  type Role = "witness" | "suspect" | "reportee" | "victim";
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<RowType>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...row,
      io_in_charge: row.io_in_charge ?? null, 
    },
    mode: "onChange",
  });

  

  const linkedPersons = watch("linked_persons", []);
  const [incidentDate, setIncidentDate] = React.useState<Date | null>(
    row.scam_incident_date ? parseISO(row.scam_incident_date) : null
  );
  const [reportDate, setReportDate] = React.useState<Date | null>(
    row.scam_report_date ? parseISO(row.scam_report_date) : null
  );

  // Auto-update status based on IO selection
  const ioInCharge = watch("io_in_charge");
  React.useEffect(() => {
    const currentStatus = watch("status");
    if (ioInCharge !== null && currentStatus !== "Resolved") {
      setValue("status", "Assigned");  
    } else if (ioInCharge === null && currentStatus !== "Resolved") {
      setValue("status", "Unassigned");  
    }

  }, [ioInCharge, setValue, watch]);

  const watchedStatus = watch("status");

  React.useEffect(() => {
    if (watchedStatus === "Unassigned" && ioInCharge !== null) {
      setValue("io_in_charge", null);  
    } else if (watchedStatus === "Assigned" && ioInCharge === null) {
      setValue("io_in_charge", null); 
    }
    // For "Resolved", allow IO or no IO 
  }, [watchedStatus, ioInCharge, setValue]);
  
  const handleIncidentDateChange = (newValue: Date | null) => {
    setIncidentDate(newValue);
    setValue("scam_incident_date", newValue ? format(newValue, "yyyy-MM-dd") : '');
  };


    const handleReportDateChange = (newValue: Date | null) => {
    setReportDate(newValue);
    setValue("scam_report_date", newValue ? format(newValue, "yyyy-MM-dd") : '');
  };
  // Handle form submission
  const onSubmit = (data: RowType) => {
    onSave(data);
    onClose();
    reset();
  };
  const [newPersonId, setNewPersonId] = React.useState('');
  const [newRole, setNewRole] = React.useState<Role>('victim');
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
                name="io_in_charge"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal" error={!!errors.io_in_charge}>
                    <InputLabel id="io-select-label">Assigned Investigation Officer</InputLabel>
                    <Select
                      labelId="io-select-label"
                      label="Assigned Investigation Officer"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                    >
                      <MenuItem value="">None (Unassigned)</MenuItem>
                      {ios.map((io) => (
                        <MenuItem key={io.user_id} value={io.user_id}>
                          {io.full_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.io_in_charge && <Typography color="error">{errors.io_in_charge.message}</Typography>}
                  </FormControl>
                )}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Note: Set status to Assigned before choosing an IO, or it may be auto-adjusted.
              </Typography>
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
  const [ios, setIOs] = useState<{ user_id: number; full_name: string }[]>([]); 

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

  useEffect(() => {
    const loadIOs = async () => {
      try {
        const data = await fetchIOs();
        setIOs(data);
      } catch (error) {
        console.error('Failed to load IOs:', error);
        setSnackbar({ open: true, message: 'Failed to load Investigation Officers', severity: 'error' });
      }
    };
    loadIOs();
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
        updated = await createScamReport(updatedRow); 
      } else {
        updated = await updateScamReport(updatedRow.report_id, updatedRow); 
      }
      // Handle linked persons
      const originalLinks = await fetchLinkedPersons(updated.report_id || updatedRow.report_id);  
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

      loadReports(); 
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
            placeholder="Search"
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
              io_in_charge: null,
              assigned_IO: '',
              linked_persons: [],
            });
            setIsCreate(true);  
            setEditDialogOpen(true);  
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
                            label={row.status.toUpperCase()}
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
        ios={ios}
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
