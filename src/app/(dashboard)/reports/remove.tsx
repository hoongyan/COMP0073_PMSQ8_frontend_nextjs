//working

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
// import { format, startOfDay, endOfDay, parseISO } from "date-fns";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import {
//   fetchScamReports,
//   deleteScamReport,
//   updateScamReport,
// } from "@/lib/reports"; // Adjust path

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
//         <TableCell padding="checkbox">
//           <Checkbox
//             indeterminate={numSelected > 0 && numSelected < rowCount}
//             checked={rowCount > 0 && numSelected === rowCount}
//             onChange={onSelectAllClick}
//           />
//         </TableCell>
//         {headCells.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             align={headCell.alignment}
//             sortDirection={orderBy === headCell.id ? order : false}
//           >
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={orderBy === headCell.id ? order : "asc"}
//               onClick={createSortHandler(headCell.id)}
//             >
//               {headCell.label}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//         <TableCell>Actions</TableCell>
//       </TableRow>
//     </TableHead>
//   );
// }

// function EnhancedTableToolbar({ numSelected }: { numSelected: number }) {
//   return (
//     <Toolbar>
//       {numSelected > 0 ? (
//         <Typography color="inherit" variant="subtitle1">
//           {numSelected} selected
//         </Typography>
//       ) : (
//         <Typography variant="h6" id="tableTitle">
//           Scam Reports
//         </Typography>
//       )}
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
// }: {
//   open: boolean;
//   row: RowType | null;
//   onClose: () => void;
//   onSave: (updated: RowType) => void;
// }) {
//   if (!row) return null;

//   const [edited, setEdited] = useState<RowType>({ ...row });

//   const handleChange = (field: keyof RowType, value: any) => {
//     setEdited((prev) => ({ ...prev, [field]: value }));
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle
//         sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}
//       >
//         Edit Report
//       </DialogTitle>
//       <DialogContent sx={{ p: 3 }}>
//         <Grid container spacing={2}>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="Report ID"
//               value={edited.report_id}
//               disabled
//             />{" "}
//             {/* Disable if ID shouldn't change */}
//           </Grid>
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
//           <Grid size={{ xs: 12 }}>
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

// function EnhancedTable() {
//   const [order, setOrder] = useState<"desc" | "asc">("asc");
//   const [orderBy, setOrderBy] = useState<keyof RowType>("report_id");
//   const [selected, setSelected] = useState<number[]>([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [searchQuery, setSearchQuery] = useState("");
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
//     const reportDate = parseISO(row.scam_report_date);
//     const matchesDate =
//       (!startDate || reportDate >= startDate) &&
//       (!endDate || reportDate <= endDate);
//     return matchesSearch && matchesDate;
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
//       const updated = await updateScamReport(updatedRow.report_id, updatedRow);
//       setRows((prev) =>
//         prev.map((row) => (row.report_id === updated.report_id ? updated : row))
//       );
//       setSnackbar({
//         open: true,
//         message: "Report updated successfully",
//         severity: "success",
//       });
//       setEditDialogOpen(false);
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: (err as Error).message,
//         severity: "error",
//       });
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
//       setSnackbar({
//         open: true,
//         message: "Report deleted successfully",
//         severity: "success",
//       });
//     } catch (err) {
//       loadReports(); // Rollback
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
//       setSnackbar({
//         open: true,
//         message: "Reports deleted successfully",
//         severity: "success",
//       });
//       setSelected([]);
//     } catch (err) {
//       loadReports(); // Rollback
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
//         <TextField
//           variant="outlined"
//           size="small"
//           placeholder="Search..."
//           value={searchQuery}
//           onChange={handleSearchChange}
//           InputProps={{
//             startAdornment: <SearchIcon />,
//           }}
//           sx={{ mr: 2 }}
//         />
//         <DateFilterMenu
//           startDate={startDate}
//           endDate={endDate}
//           setStartDate={setStartDate}
//           setEndDate={setEndDate}
//           selectedRange={selectedRange}
//           setSelectedRange={setSelectedRange}
//         />
//         <IconButton onClick={loadReports} sx={{ ml: 1 }}>
//           <RefreshIcon />
//         </IconButton>
//         <Box sx={{ flexGrow: 1 }} />
//         <Button
//           variant="contained"
//           color="primary"
//           startIcon={<AddIcon />}
//           disabled // No CREATE API
//           sx={{ mr: 2 }}
//         >
//           Add (Coming Soon)
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
//             {selected.length === 1 && (
//               <MenuItem onClick={handleBulkEdit}>
//                 <EditIcon fontSize="small" sx={{ mr: 1 }} />
//                 Edit
//               </MenuItem>
//             )}
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
//               size="medium"
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
//                             ? format(
//                                 parseISO(row.scam_report_date),
//                                 "dd/MM/yy HH:mm"
//                               )
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
//                                 handleEdit(row.report_id);
//                               }}
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
//         }}
//         onSave={handleSaveEdit}
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

// old, with ideal table design

// "use client";

// import React, { useEffect } from "react";
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
// import { format, startOfDay, endOfDay, parseISO } from "date-fns";
// import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// type LinkedPerson = {
//   id: string;
//   name: string;
//   role: "witness" | "suspect" | "reportee" | "victim";
// };

// export type RowType = {
//   report_id: string;
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
//   { id: "scam_report_no", alignment: "left", label: "Report No" },
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
//   {
//     id: "scam_beneficiary_platform",
//     alignment: "left",
//     label: "Beneficiary Platform",
//   },
//   {
//     id: "scam_beneficiary_identifier",
//     alignment: "left",
//     label: "Beneficiary ID",
//   },
//   { id: "scam_contact_no", alignment: "left", label: "Contact No" },
//   { id: "scam_email", alignment: "left", label: "Email" },
//   { id: "scam_moniker", alignment: "left", label: "Moniker" },
//   { id: "scam_url_link", alignment: "left", label: "URL Link" },
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
//   onSelectAllClick: (e: any) => void;
//   onRequestSort: (e: any, property: keyof RowType) => void;
// };

// const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = (props) => {
//   const {
//     onSelectAllClick,
//     order,
//     orderBy,
//     numSelected,
//     rowCount,
//     onRequestSort,
//   } = props;
//   const createSortHandler = (property: keyof RowType) => (event: any) => {
//     onRequestSort(event, property);
//   };

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
//             inputProps={{ "aria-label": "select all" }}
//             sx={{ color: "white" }}
//           />
//         </TableCell>
//         {headCells.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             align={headCell.alignment}
//             padding={headCell.disablePadding ? "none" : "normal"}
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
//         <TableCell
//           align="left"
//           sx={{ backgroundColor: "#001f3f", color: "white" }}
//         >
//           Actions
//         </TableCell>
//       </TableRow>
//     </TableHead>
//   );
// };

// type EnhancedTableToolbarProps = {
//   numSelected: number;
// };

// const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
//   const { numSelected } = props;

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
// };

// const ScamReportDetailsPopup = ({
//   open,
//   row,
//   onClose,
// }: {
//   open: boolean;
//   row: RowType | null;
//   onClose: () => void;
// }) => {
//   if (!row) return null;

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Scam Report Details</DialogTitle>
//       <DialogContent>
//         {Object.entries(row).map(([key, value]) => {
//           if (key === "linked_persons") return null;
//           return (
//             <Typography key={key} variant="body1" gutterBottom>
//               <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
//               {Array.isArray(value) ? value.join(", ") : value}
//             </Typography>
//           );
//         })}
//         <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
//           Linked Persons of Interest:
//         </Typography>
//         {row.linked_persons && row.linked_persons.length > 0 ? (
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//             {row.linked_persons.map((person, idx) => (
//               <MuiChip key={idx} label={`${person.name} (${person.role})`} />
//             ))}
//           </Box>
//         ) : (
//           <Typography>None</Typography>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Close</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// const EditScamReportDialog = ({
//   open,
//   row,
//   onClose,
//   onSave,
// }: {
//   open: boolean;
//   row: RowType | null;
//   onClose: () => void;
//   onSave: (updated: RowType) => void;
// }) => {
//   if (!row) return null;

//   const [edited, setEdited] = React.useState<RowType>({ ...row });

//   const handleChange = (field: keyof RowType, value: any) => {
//     setEdited((prev) => ({ ...prev, [field]: value }));
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
//       <DialogTitle>Edit Scam Report</DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2}>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Report No"
//               value={edited.scam_report_no}
//               onChange={(e) => handleChange("scam_report_no", e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label="Incident Date"
//                 value={parseISO(edited.scam_incident_date)}
//                 onChange={(newValue) => {
//                   if (newValue) {
//                     handleChange(
//                       "scam_incident_date",
//                       format(newValue, "yyyy-MM-dd")
//                     );
//                   }
//                 }}
//                 slotProps={{ textField: { fullWidth: true } }}
//               />
//             </LocalizationProvider>
//           </Grid>
//           <Grid item xs={6}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DateTimePicker
//                 label="Report Date"
//                 value={parseISO(edited.scam_report_date)}
//                 onChange={(newValue) => {
//                   if (newValue) {
//                     handleChange(
//                       "scam_report_date",
//                       format(newValue, "yyyy-MM-dd HH:mm")
//                     );
//                   }
//                 }}
//                 slotProps={{ textField: { fullWidth: true } }}
//               />
//             </LocalizationProvider>
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Type"
//               value={edited.scam_type}
//               onChange={(e) => handleChange("scam_type", e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Approach Platform"
//               value={edited.scam_approach_platform}
//               onChange={(e) =>
//                 handleChange("scam_approach_platform", e.target.value)
//               }
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Communication Platform"
//               value={edited.scam_communication_platform}
//               onChange={(e) =>
//                 handleChange("scam_communication_platform", e.target.value)
//               }
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Transaction Type"
//               value={edited.scam_transaction_type}
//               onChange={(e) =>
//                 handleChange("scam_transaction_type", e.target.value)
//               }
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Beneficiary Platform"
//               value={edited.scam_beneficiary_platform}
//               onChange={(e) =>
//                 handleChange("scam_beneficiary_platform", e.target.value)
//               }
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Beneficiary ID"
//               value={edited.scam_beneficiary_identifier}
//               onChange={(e) =>
//                 handleChange("scam_beneficiary_identifier", e.target.value)
//               }
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Contact No"
//               value={edited.scam_contact_no}
//               onChange={(e) => handleChange("scam_contact_no", e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Email"
//               value={edited.scam_email}
//               onChange={(e) => handleChange("scam_email", e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Moniker"
//               value={edited.scam_moniker}
//               onChange={(e) => handleChange("scam_moniker", e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="URL Link"
//               value={edited.scam_url_link}
//               onChange={(e) => handleChange("scam_url_link", e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Amount Lost"
//               value={edited.scam_amount_lost}
//               onChange={(e) => handleChange("scam_amount_lost", e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={6}>
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
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Assigned IO"
//               value={edited.assigned_IO}
//               onChange={(e) => handleChange("assigned_IO", e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               multiline
//               rows={4}
//               label="Incident Description"
//               value={edited.scam_incident_description}
//               onChange={(e) =>
//                 handleChange("scam_incident_description", e.target.value)
//               }
//             />
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={() => onSave(edited)} variant="contained">
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// function EnhancedTable() {
//   const [order, setOrder] = React.useState<"desc" | "asc">("desc");
//   const [orderBy, setOrderBy] =
//     React.useState<keyof RowType>("scam_report_date");
//   const [selected, setSelected] = React.useState<Array<string>>([]);
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);
//   const [rows, setRows] = React.useState<RowType[]>([]);
//   const [loading, setLoading] = React.useState(true);
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
//   const [deleteId, setDeleteId] = React.useState<string | null>(null);
//   const [editDialogOpen, setEditDialogOpen] = React.useState(false);
//   const [editRow, setEditRow] = React.useState<RowType | null>(null);
//   const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);
//   const [searchTerm, setSearchTerm] = React.useState("");
//   const [statusFilter, setStatusFilter] = React.useState("All");
//   const [startDate, setStartDate] = React.useState<Date | null>(null);
//   const [endDate, setEndDate] = React.useState<Date | null>(null);
//   const [selectedRange, setSelectedRange] = React.useState("all");
//   const [descriptionDialogOpen, setDescriptionDialogOpen] =
//     React.useState(false);
//   const [selectedRow, setSelectedRow] = React.useState<RowType | null>(null);
//   const [snackbar, setSnackbar] = React.useState<{
//     open: boolean;
//     message: string;
//     severity: "success" | "error" | "info" | "warning";
//   }>({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const showFeedback = (
//     message: string,
//     severity: "success" | "error" | "info" | "warning"
//   ) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = (
//     event?: React.SyntheticEvent | Event,
//     reason?: string
//   ) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   // Mock data for testing frontend
//   // Note: In production, linked_persons would be fetched from API, joining scam_table and persons_of_interest table
//   // For scalability, the API would retrieve person IDs and roles from scam_table.linked_persons (array of {id, role}),
//   // then fetch names from persons_of_interest table using those IDs.
//   const mockRows: RowType[] = [
//     {
//       scam_report_no: "SR001",
//       scam_incident_date: "2025-07-01",
//       scam_report_date: "2025-08-01 10:00",
//       scam_type: "Phishing",
//       scam_approach_platform: "Email",
//       scam_communication_platform: "Phone",
//       scam_transaction_type: "Bank Transfer",
//       scam_beneficiary_platform: "Bank",
//       scam_beneficiary_identifier: "Acc123",
//       scam_contact_no: "123456789",
//       scam_email: "scam1@example.com",
//       scam_moniker: "Scammer1",
//       scam_url_link: "http://scam1.com",
//       scam_amount_lost: "1000",
//       scam_incident_description:
//         "Victim received a phishing email and transferred money.",
//       status: "Unassigned",
//       assigned_IO: "Officer A",
//       linked_persons: [
//         { id: "POI001", name: "John Doe", role: "victim" },
//         { id: "POI002", name: "Jane Smith", role: "witness" },
//       ],
//     },
//     {
//       scam_report_no: "SR002",
//       scam_incident_date: "2025-06-15",
//       scam_report_date: "2025-07-20 14:30",
//       scam_type: "Investment Scam",
//       scam_approach_platform: "Social Media",
//       scam_communication_platform: "Messaging App",
//       scam_transaction_type: "Cryptocurrency",
//       scam_beneficiary_platform: "Wallet",
//       scam_beneficiary_identifier: "WalletXYZ",
//       scam_contact_no: "987654321",
//       scam_email: "scam2@example.com",
//       scam_moniker: "InvestorPro",
//       scam_url_link: "http://fakeinvest.com",
//       scam_amount_lost: "5000",
//       scam_incident_description: "Promised high returns on fake investment.",
//       status: "Resolved",
//       assigned_IO: "Officer B",
//       linked_persons: [
//         { id: "POI003", name: "Alice Johnson", role: "suspect" },
//       ],
//     },
//     {
//       scam_report_no: "SR003",
//       scam_incident_date: "2025-08-05",
//       scam_report_date: "2025-08-09 09:45",
//       scam_type: "Romance Scam",
//       scam_approach_platform: "Dating App",
//       scam_communication_platform: "Email",
//       scam_transaction_type: "Wire Transfer",
//       scam_beneficiary_platform: "Bank",
//       scam_beneficiary_identifier: "Acc456",
//       scam_contact_no: "555123456",
//       scam_email: "love@scam.com",
//       scam_moniker: "Sweetheart",
//       scam_url_link: "",
//       scam_amount_lost: "2000",
//       scam_incident_description:
//         "Built a fake relationship and asked for money.",
//       status: "Assigned",
//       assigned_IO: "Officer C",
//       linked_persons: [
//         { id: "POI004", name: "Bob Brown", role: "reportee" },
//         { id: "POI005", name: "Carol White", role: "witness" },
//       ],
//     },
//     {
//       scam_report_no: "SR004",
//       scam_incident_date: "2025-05-10",
//       scam_report_date: "2025-06-01 16:20",
//       scam_type: "Tech Support Scam",
//       scam_approach_platform: "Phone",
//       scam_communication_platform: "Remote Access",
//       scam_transaction_type: "Credit Card",
//       scam_beneficiary_platform: "Payment Gateway",
//       scam_beneficiary_identifier: "PG789",
//       scam_contact_no: "444567890",
//       scam_email: "support@fake.com",
//       scam_moniker: "TechHelper",
//       scam_url_link: "http://fakesupport.com",
//       scam_amount_lost: "300",
//       scam_incident_description:
//         "Claimed computer issues and charged for fake fix.",
//       status: "Resolved",
//       assigned_IO: "Officer A",
//       linked_persons: [],
//     },
//     {
//       scam_report_no: "SR005",
//       scam_incident_date: "2025-07-20",
//       scam_report_date: "2025-08-05 11:15",
//       scam_type: "Lottery Scam",
//       scam_approach_platform: "Mail",
//       scam_communication_platform: "Phone",
//       scam_transaction_type: "Money Order",
//       scam_beneficiary_platform: "Post Office",
//       scam_beneficiary_identifier: "PO123",
//       scam_contact_no: "666789012",
//       scam_email: "win@lottofake.com",
//       scam_moniker: "LottoWinner",
//       scam_url_link: "",
//       scam_amount_lost: "1500",
//       scam_incident_description:
//         "Notified of fake win and asked for processing fee.",
//       status: "Assigned",
//       assigned_IO: "Officer B",
//       linked_persons: [{ id: "POI006", name: "David Green", role: "victim" }],
//     },
//   ];

//   useEffect(() => {
//     // For now, use mock data. In the future, replace with API fetch.
//     // Example: Fetch scam reports from /api/scam-reports, then for each report, fetch linked persons details from persons_of_interest using the IDs in linked_persons.
//     // const fetchReports = async () => {
//     //   try {
//     //     const response = await fetch('/api/scam-reports');
//     //     const data = await response.json();
//     //     // For each data item, fetch names for linked_persons IDs
//     //     const enrichedData = await Promise.all(data.map(async (report) => {
//     //       const linked = await Promise.all(report.linked_persons.map(async ({id, role}) => {
//     //         const personRes = await fetch(`/api/persons-of-interest/${id}`);
//     //         const person = await personRes.json();
//     //         return {id, role, name: person.name};
//     //       }));
//     //       return {...report, linked_persons: linked};
//     //     }));
//     //     setRows(enrichedData);
//     //   } catch (error) {
//     //     showFeedback("Failed to fetch scam reports.", "error");
//     //   }
//     // };
//     // fetchReports();
//     setRows(mockRows);
//     setLoading(false);
//   }, []);

//   const handleRequestSort = (event: any, property: keyof RowType) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.checked) {
//       const newSelecteds: Array<string> = filteredRows.map(
//         (n: RowType) => n.scam_report_no
//       );
//       setSelected(newSelecteds);
//       return;
//     }
//     setSelected([]);
//   };

//   const handleClick = (
//     event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
//     id: string
//   ) => {
//     const selectedIndex = selected.indexOf(id);
//     let newSelected: Array<string> = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, id);
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

//   const handleChangePage = (
//     event: React.MouseEvent<HTMLButtonElement> | null,
//     newPage: number
//   ) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleRowClick = (row: RowType) => {
//     setSelectedRow(row);
//     setDescriptionDialogOpen(true);
//   };

//   const handleDescriptionDialogClose = () => {
//     setDescriptionDialogOpen(false);
//     setSelectedRow(null);
//   };

//   const isSelected = (id: string) => selected.indexOf(id) !== -1;

//   const filteredRows = rows.filter((row) => {
//     const matchesSearch =
//       searchTerm === "" ||
//       row.scam_incident_description
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       row.scam_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       row.scam_moniker.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       row.scam_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       row.scam_contact_no.includes(searchTerm) ||
//       row.scam_url_link.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       row.scam_report_no.includes(searchTerm);
//     const matchesStatus = statusFilter === "All" || row.status === statusFilter;
//     const rowDate = parseISO(row.scam_report_date);
//     const rowDateStart = startOfDay(rowDate);
//     const rowDateEnd = endOfDay(rowDate);
//     const matchesDate =
//       (!startDate || rowDateEnd >= startOfDay(startDate)) &&
//       (!endDate || rowDateStart <= endOfDay(endDate));
//     return matchesSearch && matchesStatus && matchesDate;
//   });

//   const emptyRows =
//     rowsPerPage -
//     Math.min(rowsPerPage, filteredRows.length - page * rowsPerPage);

//   const handleDelete = async (id: string) => {
//     setDeleteId(id);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (deleteId === null) return;
//     try {
//       // In future, call API: await fetch(`/api/scam-reports/${deleteId}/delete`, { method: "DELETE" });
//       setRows((prevRows) =>
//         prevRows.filter((row) => row.scam_report_no !== deleteId)
//       );
//       setSelected(selected.filter((selectedId) => selectedId !== deleteId));
//       showFeedback("Scam report deleted successfully.", "success");
//     } catch (error) {
//       showFeedback("Something went wrong. Please try again.", "error");
//     } finally {
//       setDeleteDialogOpen(false);
//       setDeleteId(null);
//     }
//   };

//   const handleEdit = async (id: string) => {
//     const row = rows.find((r) => r.scam_report_no === id);
//     if (row) {
//       setEditRow(row);
//       setEditDialogOpen(true);
//     }
//   };

//   const handleSaveEdit = (updated: RowType) => {
//     try {
//       // In future, call API to update
//       setRows((prevRows) =>
//         prevRows.map((row) =>
//           row.scam_report_no === updated.scam_report_no ? updated : row
//         )
//       );
//       showFeedback("Scam report updated successfully.", "success");
//     } catch (error) {
//       showFeedback("Something went wrong. Please try again.", "error");
//     } finally {
//       setEditDialogOpen(false);
//       setEditRow(null);
//     }
//   };

//   const handleManageReportsClick = (
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleBulkDelete = async () => {
//     if (selected.length === 0) return;
//     setBulkDeleteDialogOpen(true);
//   };

//   const confirmBulkDelete = async () => {
//     try {
//       // In future, bulk delete via API
//       setRows((prevRows) =>
//         prevRows.filter((row) => !selected.includes(row.scam_report_no))
//       );
//       setSelected([]);
//       showFeedback(
//         `Successfully deleted ${selected.length} report(s).`,
//         "success"
//       );
//     } catch (error) {
//       showFeedback(
//         "An error occurred while deleting reports. Please try again.",
//         "error"
//       );
//     } finally {
//       setBulkDeleteDialogOpen(false);
//       handleMenuClose();
//     }
//   };

//   const handleBulkEdit = () => {
//     if (selected.length === 1) {
//       handleEdit(selected[0]);
//       handleMenuClose();
//     }
//   };

//   if (loading) return <Typography>Loading scam reports...</Typography>;
//   if (!loading && rows.length === 0)
//     return <Typography>No scam reports found.</Typography>;

//   return (
//     <div>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           gap: 2,
//           mb: 2,
//           width: "100%",
//         }}
//       >
//         <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//           <TextField
//             placeholder="Search Description/Type/Moniker/Email/Contact/URL/Report No"
//             variant="outlined"
//             size="small"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{ startAdornment: <SearchIcon color="action" /> }}
//             sx={{ minWidth: 300 }}
//           />
//           <FormControl size="small" sx={{ minWidth: 150 }}>
//             <InputLabel>Status</InputLabel>
//             <Select
//               value={statusFilter}
//               label="Status"
//               onChange={(e) => setStatusFilter(e.target.value)}
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
//         <Box>
//           <Button
//             variant="contained"
//             color="primary"
//             size="small"
//             disabled={selected.length === 0}
//             onClick={handleManageReportsClick}
//             aria-controls={
//               Boolean(anchorEl) ? "manage-reports-menu" : undefined
//             }
//             aria-haspopup="true"
//             aria-expanded={Boolean(anchorEl) ? "true" : undefined}
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
//             {selected.length === 1 && (
//               <MenuItem onClick={handleBulkEdit}>
//                 <EditIcon fontSize="small" sx={{ mr: 1 }} />
//                 Edit
//               </MenuItem>
//             )}
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
//           <Table
//             aria-labelledby="tableTitle"
//             size={"medium"}
//             aria-label="enhanced table"
//           >
//             <EnhancedTableHead
//               numSelected={selected.length}
//               order={order}
//               orderBy={orderBy}
//               onSelectAllClick={handleSelectAllClick}
//               onRequestSort={handleRequestSort}
//               rowCount={filteredRows.length}
//             />
//             <TableBody>
//               {stableSort(filteredRows, getComparator(order, orderBy))
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((row, index) => {
//                   const isItemSelected = isSelected(row.scam_report_no);
//                   const labelId = `enhanced-table-checkbox-${index}`;

//                   return (
//                     <TableRow
//                       hover
//                       role="checkbox"
//                       aria-checked={isItemSelected}
//                       tabIndex={-1}
//                       key={`${row.scam_report_no}-${index}`}
//                       selected={isItemSelected}
//                       onClick={() => handleRowClick(row)}
//                       sx={{ cursor: "pointer" }}
//                     >
//                       <TableCell padding="checkbox">
//                         <Checkbox
//                           checked={isItemSelected}
//                           inputProps={{ "aria-labelledby": labelId }}
//                           onClick={(event) => {
//                             event.stopPropagation();
//                             handleClick(event, row.scam_report_no);
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell align="left">{row.scam_report_no}</TableCell>
//                       <TableCell align="left">
//                         {format(parseISO(row.scam_incident_date), "dd/MM/yy")}
//                       </TableCell>
//                       <TableCell align="left">
//                         {format(
//                           parseISO(row.scam_report_date),
//                           "dd/MM/yy HH:mm"
//                         )}
//                       </TableCell>
//                       <TableCell align="left">{row.scam_type}</TableCell>
//                       <TableCell align="left">
//                         {row.scam_approach_platform}
//                       </TableCell>
//                       <TableCell align="left">
//                         {row.scam_communication_platform}
//                       </TableCell>
//                       <TableCell align="left">
//                         {row.scam_transaction_type}
//                       </TableCell>
//                       <TableCell align="left">
//                         {row.scam_beneficiary_platform}
//                       </TableCell>
//                       <TableCell align="left">
//                         {row.scam_beneficiary_identifier}
//                       </TableCell>
//                       <TableCell align="left">{row.scam_contact_no}</TableCell>
//                       <TableCell align="left">{row.scam_email}</TableCell>
//                       <TableCell align="left">{row.scam_moniker}</TableCell>
//                       <TableCell align="left">{row.scam_url_link}</TableCell>
//                       <TableCell align="left">{row.scam_amount_lost}</TableCell>
//                       <TableCell align="left">
//                         {row.scam_incident_description}
//                       </TableCell>
//                       <TableCell align="left">
//                         <MuiChip
//                           size="small"
//                           label={row.status}
//                           sx={{
//                             mr: 1,
//                             mb: 1,
//                             backgroundColor:
//                               row.status === "Resolved"
//                                 ? green[500]
//                                 : row.status === "Assigned"
//                                 ? orange[500]
//                                 : grey[500],
//                             color: "#fff",
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell align="left">{row.assigned_IO}</TableCell>
//                       <TableCell padding="none" align="left">
//                         <Box
//                           sx={{
//                             display: "flex",
//                             flexDirection: "row",
//                             flexWrap: "nowrap",
//                             mr: 2,
//                           }}
//                         >
//                           <IconButton
//                             aria-label="delete"
//                             size="large"
//                             onClick={(event) => {
//                               event.stopPropagation();
//                               handleDelete(row.scam_report_no);
//                             }}
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                           <IconButton
//                             aria-label="edit"
//                             size="large"
//                             onClick={(event) => {
//                               event.stopPropagation();
//                               handleEdit(row.scam_report_no);
//                             }}
//                           >
//                             <EditIcon />
//                           </IconButton>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               {emptyRows > 0 && (
//                 <TableRow style={{ height: 53 * emptyRows }}>
//                   <TableCell colSpan={headCells.length + 2} />
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
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
//         }}
//         onSave={handleSaveEdit}
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
//       <Grid container="" direction="column" spacing={6}>
//         <Grid item>
//           <Typography
//             variant="h3"
//             gutterBottom
//             display="inline"
//             sx={{
//               fontFamily: "Helvetica, sans-serif", // Use Helvetica, fall back to sans-serif
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
// import { format, startOfDay, endOfDay, parseISO } from "date-fns";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import {
//   fetchScamReports,
//   deleteScamReport,
//   updateScamReport,
//   createScamReport,
//   fetchLinkedPersons,
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

// const validationSchema = yup.object().shape({
//   scam_incident_date: yup.date().required("Incident Date is required").nullable(),
//   scam_report_date: yup.date().required("Report Date is required").nullable(),
//   scam_incident_description: yup
//     .string()
//     .required("Description is required")
//     .min(1, "Description cannot be empty"),
//   // Other fields optional
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

// // function EditScamReportDialog({
// //   open,
// //   row,
// //   onClose,
// //   onSave,
// // }: {
// //   open: boolean;
// //   row: RowType | null;
// //   onClose: () => void;
// //   onSave: (updated: RowType) => void;
// // }) {
// //   if (!row) return null;

// //   const [edited, setEdited] = useState<RowType>({ ...row });

// //   const handleChange = (field: keyof RowType, value: any) => {
// //     setEdited((prev) => ({ ...prev, [field]: value }));
// //   };

// //   return (
// //     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
// //       <DialogTitle
// //         sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}
// //       >
// //         Edit Report
// //       </DialogTitle>
// //       <DialogContent sx={{ p: 3 }}>
// //         <Grid container spacing={2}>
// //           <Grid size={{ xs: 6 }}>
// //             <TextField
// //               fullWidth
// //               label="Report ID"
// //               value={edited.report_id}
// //               disabled
// //             />{" "}
// //             {/* Disable if ID shouldn't change */}
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <LocalizationProvider dateAdapter={AdapterDateFns}>
// //               <DatePicker
// //                 label="Incident Date"
// //                 value={
// //                   edited.scam_incident_date
// //                     ? parseISO(edited.scam_incident_date)
// //                     : null
// //                 }
// //                 onChange={(newValue) =>
// //                   handleChange(
// //                     "scam_incident_date",
// //                     newValue ? format(newValue, "yyyy-MM-dd") : ""
// //                   )
// //                 }
// //                 slotProps={{ textField: { fullWidth: true } }}
// //               />
// //             </LocalizationProvider>
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <LocalizationProvider dateAdapter={AdapterDateFns}>
// //               <DatePicker
// //                 label="Report Date"
// //                 value={
// //                   edited.scam_report_date
// //                     ? parseISO(edited.scam_report_date)
// //                     : null
// //                 }
// //                 onChange={(newValue) =>
// //                   handleChange(
// //                     "scam_report_date",
// //                     newValue ? format(newValue, "yyyy-MM-dd") : ""
// //                   )
// //                 }
// //                 slotProps={{ textField: { fullWidth: true } }}
// //               />
// //             </LocalizationProvider>
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <TextField
// //               fullWidth
// //               label="Type"
// //               value={edited.scam_type}
// //               onChange={(e) => handleChange("scam_type", e.target.value)}
// //             />
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <TextField
// //               fullWidth
// //               label="Approach Platform"
// //               value={edited.scam_approach_platform}
// //               onChange={(e) =>
// //                 handleChange("scam_approach_platform", e.target.value)
// //               }
// //             />
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <TextField
// //               fullWidth
// //               label="Communication Platform"
// //               value={edited.scam_communication_platform}
// //               onChange={(e) =>
// //                 handleChange("scam_communication_platform", e.target.value)
// //               }
// //             />
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <TextField
// //               fullWidth
// //               label="Transaction Type"
// //               value={edited.scam_transaction_type}
// //               onChange={(e) =>
// //                 handleChange("scam_transaction_type", e.target.value)
// //               }
// //             />
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <TextField
// //               fullWidth
// //               label="Beneficiary Platform"
// //               value={edited.scam_beneficiary_platform}
// //               onChange={(e) =>
// //                 handleChange("scam_beneficiary_platform", e.target.value)
// //               }
// //             />
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <TextField
// //               fullWidth
// //               label="Beneficiary ID"
// //               value={edited.scam_beneficiary_identifier}
// //               onChange={(e) =>
// //                 handleChange("scam_beneficiary_identifier", e.target.value)
// //               }
// //             />
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <TextField
// //               fullWidth
// //               label="Contact No"
// //               value={edited.scam_contact_no}
// //               onChange={(e) => handleChange("scam_contact_no", e.target.value)}
// //             />
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <TextField
// //               fullWidth
// //               label="Email"
// //               value={edited.scam_email}
// //               onChange={(e) => handleChange("scam_email", e.target.value)}
// //             />
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <TextField
// //               fullWidth
// //               label="Moniker"
// //               value={edited.scam_moniker}
// //               onChange={(e) => handleChange("scam_moniker", e.target.value)}
// //             />
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <TextField
// //               fullWidth
// //               label="URL Link"
// //               value={edited.scam_url_link}
// //               onChange={(e) => handleChange("scam_url_link", e.target.value)}
// //             />
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <TextField
// //               fullWidth
// //               label="Amount Lost"
// //               value={edited.scam_amount_lost}
// //               onChange={(e) => handleChange("scam_amount_lost", e.target.value)}
// //             />
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <FormControl fullWidth>
// //               <InputLabel>Status</InputLabel>
// //               <Select
// //                 value={edited.status}
// //                 label="Status"
// //                 onChange={(e) => handleChange("status", e.target.value)}
// //               >
// //                 <MenuItem value="Unassigned">Unassigned</MenuItem>
// //                 <MenuItem value="Assigned">Assigned</MenuItem>
// //                 <MenuItem value="Resolved">Resolved</MenuItem>
// //               </Select>
// //             </FormControl>
// //           </Grid>
// //           <Grid size={{ xs: 6 }}>
// //             <TextField
// //               fullWidth
// //               label="Assigned IO"
// //               value={edited.assigned_IO}
// //               onChange={(e) => handleChange("assigned_IO", e.target.value)}
// //             />
// //           </Grid>
// //           <Grid size={{ xs: 12 }}>
// //             <TextField
// //               fullWidth
// //               multiline
// //               rows={4}
// //               label="Description"
// //               value={edited.scam_incident_description}
// //               onChange={(e) =>
// //                 handleChange("scam_incident_description", e.target.value)
// //               }
// //             />
// //           </Grid>
// //           <Grid size={{ xs: 12 }}>
// //             <Typography sx={{ mb: 1 }}>
// //               <strong>Linked Persons (Display Only):</strong>
// //             </Typography>
// //             {edited.linked_persons.length > 0 ? (
// //               <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
// //                 {edited.linked_persons.map((p) => (
// //                   <MuiChip
// //                     key={p.id}
// //                     label={`${p.name} (${p.role})`}
// //                     color="primary"
// //                     variant="outlined"
// //                   />
// //                 ))}
// //               </Box>
// //             ) : (
// //               <Typography>None</Typography>
// //             )}
// //           </Grid>
// //         </Grid>
// //       </DialogContent>
// //       <DialogActions sx={{ borderTop: "1px solid #ddd" }}>
// //         <Button onClick={onClose}>Cancel</Button>
// //         <Button onClick={() => onSave(edited)} variant="contained">
// //           Save
// //         </Button>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // }
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
//   const { control, handleSubmit, formState: { errors } } = useForm<RowType>({
//     defaultValues: row || {},  // CHANGE 1: Fallback to {} if row is null to prevent crash
//     resolver: yupResolver(validationSchema),
//   });

//   const onSubmit = (data: RowType) => onSave(data);

//   if (!open || !row) return null;  // CHANGE 2: Moved this AFTER hooks to comply with Rules of Hooks (fixes "static flag" error)

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>{isCreate ? 'Create Report' : 'Edit Report'}</DialogTitle>
//       <DialogContent sx={{ p: 3 }}>
//         <LocalizationProvider dateAdapter={AdapterDateFns}>  {/* CHANGE 3: Added this wrapper (required for DatePicker to work without errors) */}
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <Grid container spacing={2}>
//               {!isCreate && (
//                 <Grid item xs={6}>  {/* CHANGE 4: Changed size={{ xs: 6 }} to item xs={6} for MUI Grid compatibility */}
//                   <Controller
//                     name="report_id"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField {...field} label="Report ID" fullWidth disabled />
//                     )}
//                   />
//                 </Grid>
//               )}
//               <Grid item xs={6}>
//                 <Controller
//                   name="scam_incident_date"
//                   control={control}
//                   render={({ field }) => (
//                     <DatePicker
//                       label={<>Incident Date <span style={{ color: 'red' }}>*</span></>}
//                       value={field.value ? parseISO(field.value) : null}
//                       onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
//                       slotProps={{
//                         textField: {
//                           fullWidth: true,
//                           error: !!errors.scam_incident_date,
//                           helperText: errors.scam_incident_date?.message,
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Controller
//                   name="scam_report_date"
//                   control={control}
//                   render={({ field }) => (
//                     <DatePicker
//                       label={<>Report Date <span style={{ color: 'red' }}>*</span></>}
//                       value={field.value ? parseISO(field.value) : null}
//                       onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
//                       slotProps={{
//                         textField: {
//                           fullWidth: true,
//                           error: !!errors.scam_report_date,
//                           helperText: errors.scam_report_date?.message,
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Controller
//                   name="scam_type"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField {...field} label="Type" fullWidth />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Controller
//                   name="scam_approach_platform"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField {...field} label="Approach Platform" fullWidth />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Controller
//                   name="scam_communication_platform"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField {...field} label="Communication Platform" fullWidth />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Controller
//                   name="scam_transaction_type"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField {...field} label="Transaction Type" fullWidth />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Controller
//                   name="scam_beneficiary_platform"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField {...field} label="Beneficiary Platform" fullWidth />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Controller
//                   name="scam_beneficiary_identifier"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField {...field} label="Beneficiary ID" fullWidth />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Controller
//                   name="scam_contact_no"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField {...field} label="Contact No" fullWidth />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Controller
//                   name="scam_email"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField {...field} label="Email" fullWidth />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Controller
//                   name="scam_moniker"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField {...field} label="Moniker" fullWidth />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Controller
//                   name="scam_url_link"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField {...field} label="URL Link" fullWidth />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Controller
//                   name="scam_amount_lost"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField {...field} label="Amount Lost" fullWidth />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Controller
//                   name="status"
//                   control={control}
//                   render={({ field }) => (
//                     <FormControl fullWidth>
//                       <InputLabel>Status</InputLabel>
//                       <Select {...field} label="Status">
//                         <MenuItem value="Unassigned">Unassigned</MenuItem>
//                         <MenuItem value="Assigned">Assigned</MenuItem>
//                         <MenuItem value="Resolved">Resolved</MenuItem>
//                       </Select>
//                     </FormControl>
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Controller
//                   name="assigned_IO"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField {...field} label="Assigned IO" fullWidth />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <Controller
//                   name="scam_incident_description"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       label={<>Description <span style={{ color: 'red' }}>*</span></>}
//                       multiline
//                       rows={4}
//                       fullWidth
//                       error={!!errors.scam_incident_description}
//                       helperText={errors.scam_incident_description?.message}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography sx={{ mb: 1 }}><strong>Linked Persons (Display Only):</strong></Typography>
//                 {row.linked_persons.length > 0 ? (  // CHANGE 5: Replaced (...) placeholder with your original Chip code to fix syntax error
//                   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                     {row.linked_persons.map((p) => (
//                       <MuiChip
//                         key={p.id}
//                         label={`${p.name} (${p.role})`}
//                         color="primary"
//                         variant="outlined"
//                       />
//                     ))}
//                   </Box>
//                 ) : (
//                   <Typography>None</Typography>
//                 )}
//               </Grid>
//             </Grid>
//           </form>
//         </LocalizationProvider>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleSubmit(onSubmit)} variant="contained">Save</Button>
//       </DialogActions>
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

//   // const handleSaveEdit = async (updatedRow: RowType) => {
//   //   try {
//   //     const updated = await updateScamReport(updatedRow.report_id, updatedRow);
//   //     setRows((prev) =>
//   //       prev.map((row) => (row.report_id === updated.report_id ? updated : row))
//   //     );
//   //     setSnackbar({
//   //       open: true,
//   //       message: "Report updated successfully",
//   //       severity: "success",
//   //     });
//   //     setEditDialogOpen(false);
//   //   } catch (err) {
//   //     setSnackbar({
//   //       open: true,
//   //       message: (err as Error).message,
//   //       severity: "error",
//   //     });
//   //   }
//   // };

//   const handleSaveEdit = async (updatedRow: RowType) => {
//     try {
//       let updated;
//       if (isCreate) {
//         updated = await createScamReport(updatedRow);  // NEW: Create if in create mode
//       } else {
//         updated = await updateScamReport(updatedRow.report_id, updatedRow);  // Existing update
//       }
//       loadReports();  // NEW: Refresh full list (instead of manual setRows)
//       setSnackbar({
//         open: true,
//         message: isCreate ? "Report created successfully" : "Report updated successfully",
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
//               report_id: 0,  // Temp ID, backend assigns real
//               scam_incident_date: '',
//               scam_report_date: '',
//               scam_type: '',
//               scam_approach_platform: '',
//               scam_communication_platform: '',
//               scam_transaction_type: '',
//               scam_beneficiary_platform: '',
//               scam_beneficiary_identifier: '',
//               scam_contact_no: '',
//               scam_email: '',
//               scam_moniker: '',
//               scam_url_link: '',
//               scam_amount_lost: '',
//               scam_incident_description: '',
//               status: 'Unassigned',
//               assigned_IO: '',
//               linked_persons: [],
//             });
//             setIsCreate(true);  // Set create mode
//             setEditDialogOpen(true);  // Open dialog
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
//           {/* <Menu
//             id="manage-reports-menu"
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//             transformOrigin={{ vertical: "top", horizontal: "right" }}
//           >
//             {selected.length === 1 && (
//               <MenuItem onClick={handleBulkEdit}>
//                 <EditIcon fontSize="small" sx={{ mr: 1 }} />
//                 Edit
//               </MenuItem>
//             )}
//             <MenuItem onClick={handleBulkDelete}>
//               <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
//               Delete
//             </MenuItem>
//           </Menu> */}
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
//               disabled={selected.length !== 1}  // Disable unless exactly 1 selected
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
//                                   handleEdit(row);
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
