"use client";

import React, { useState, useRef } from "react";
import {
  Typography,
  Button,
  Box,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  Paper,
  IconButton,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import Header from "@/components/landing/Header"; 
import dayjs, { Dayjs } from "dayjs";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "ai";
  content: string;
}

function ReportScam() {
  const router = useRouter();
  const [victim, setVictim] = useState({
    firstName: "",
    lastName: "",
    sex: "",
    dob: null as Dayjs | null,
    nationality: "",
    race: "",
    occupation: "",
    email: "",
    blk: "",
    street: "",
    unitNo: "",
    postCode: "",
  });

  const [victimCountryCode, setVictimCountryCode] = useState("+65");
  const [victimLocalNo, setVictimLocalNo] = useState("");

  const [scam, setScam] = useState({
    scam_incident_date: null as Dayjs | null,
    scam_type: "",
    scam_approach_platform: "",
    scam_communication_platform: "",
    scam_transaction_type: "",
    scam_beneficiary_platform: "",
    scam_beneficiary_identifier: "",
    scam_email: "",
    scam_moniker: "",
    scam_url_link: "",
    scam_amount_lost: 0,
    scam_incident_description: "",
  });

  const [scamCountryCode, setScamCountryCode] = useState("+65");
  const [scamLocalNo, setScamLocalNo] = useState("");

  const [otherSex, setOtherSex] = useState("");
  const [otherRace, setOtherRace] = useState("");
  const [otherScamType, setOtherScamType] = useState("");
  const [otherApproachPlatform, setOtherApproachPlatform] = useState("");
  const [otherCommunicationPlatform, setOtherCommunicationPlatform] =
    useState("");
  const [otherTransactionType, setOtherTransactionType] = useState("");
  const [otherBeneficiaryPlatform, setOtherBeneficiaryPlatform] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [reportId, setReportId] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [error, setError] = useState("");
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<Message[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const countryCodes = [
    { code: "+1", label: "United States (+1)" },
    { code: "+44", label: "United Kingdom (+44)" },
    { code: "+65", label: "Singapore (+65)" },
    { code: "+86", label: "China (+86)" },
    { code: "+91", label: "India (+91)" },
    { code: "+60", label: "Malaysia (+60)" },
    { code: "+81", label: "Japan (+81)" },
    { code: "+82", label: "South Korea (+82)" },
    { code: "+61", label: "Australia (+61)" },
    { code: "+49", label: "Germany (+49)" },
    // Add more as needed
  ];

  const handleVictimChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setVictim({ ...victim, [e.target.name]: e.target.value });
  };

  const handleScamChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setScam({ ...scam, [e.target.name]: e.target.value });
  };

  const handleVictimLocalNoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVictimLocalNo(e.target.value.replace(/\D/g, ""));
  };

  const handleScamLocalNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScamLocalNo(e.target.value.replace(/\D/g, ""));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const validateForm = () => {
    if (
      !victim.firstName ||
      !victim.lastName ||
      !victimLocalNo ||
      !victim.email ||
      !scam.scam_incident_description
    ) {
      setError("Please fill in all mandatory fields.");
      return false;
    }
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(victim.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    // Phone validation for victim
    const victimContactNo = victimCountryCode + victimLocalNo;
    const phoneRegex = /^\+?\d{8,}$/;
    if (!phoneRegex.test(victimContactNo)) {
      setError(
        "Please enter a valid contact number (at least 8 digits after country code)."
      );
      return false;
    }
    // Optional scammer contact, but if provided, validate
    if (scamLocalNo) {
      const scamContactNo = scamCountryCode + scamLocalNo;
      if (!phoneRegex.test(scamContactNo)) {
        setError(
          "Please enter a valid scammer contact number (at least 8 digits after country code)."
        );
        return false;
      }
    }
    // Amount lost should be non-negative
    if (scam.scam_amount_lost < 0) {
      setError("Amount lost cannot be negative.");
      return false;
    }
    // Check if "Others" fields are filled if selected
    if (victim.sex === "Others" && !otherSex.trim()) {
      setError("Please specify the custom sex.");
      return false;
    }
    if (victim.race === "Others" && !otherRace.trim()) {
      setError("Please specify the custom race.");
      return false;
    }
    if (scam.scam_type === "Others" && !otherScamType.trim()) {
      setError("Please specify the custom scam type.");
      return false;
    }
    if (
      scam.scam_approach_platform === "Others" &&
      !otherApproachPlatform.trim()
    ) {
      setError("Please specify the custom approach platform.");
      return false;
    }
    if (
      scam.scam_communication_platform === "Others" &&
      !otherCommunicationPlatform.trim()
    ) {
      setError("Please specify the custom communication platform.");
      return false;
    }
    if (
      scam.scam_transaction_type === "Others" &&
      !otherTransactionType.trim()
    ) {
      setError("Please specify the custom transaction type.");
      return false;
    }
    if (
      scam.scam_beneficiary_platform === "Others" &&
      !otherBeneficiaryPlatform.trim()
    ) {
      setError("Please specify the custom beneficiary platform.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const victimData = {
      ...victim,
      contactNo: victimCountryCode + victimLocalNo,
      sex: victim.sex === "Others" ? otherSex : victim.sex,
      race: victim.race === "Others" ? otherRace : victim.race,
      dob: victim.dob ? victim.dob.format("YYYY-MM-DD") : null,
    };

    const scamData = {
      ...scam,
      scam_contact_no: scamLocalNo ? scamCountryCode + scamLocalNo : "",
      scam_type: scam.scam_type === "Others" ? otherScamType : scam.scam_type,
      scam_approach_platform:
        scam.scam_approach_platform === "Others"
          ? otherApproachPlatform
          : scam.scam_approach_platform,
      scam_communication_platform:
        scam.scam_communication_platform === "Others"
          ? otherCommunicationPlatform
          : scam.scam_communication_platform,
      scam_transaction_type:
        scam.scam_transaction_type === "Others"
          ? otherTransactionType
          : scam.scam_transaction_type,
      scam_beneficiary_platform:
        scam.scam_beneficiary_platform === "Others"
          ? otherBeneficiaryPlatform
          : scam.scam_beneficiary_platform,
      scam_incident_date: scam.scam_incident_date
        ? scam.scam_incident_date.format("YYYY-MM-DD")
        : null,
      scam_amount_lost: parseFloat(scam.scam_amount_lost.toString()) || 0,
    };

    const formData = new FormData();
    formData.append("victim", JSON.stringify(victimData));
    formData.append("scam", JSON.stringify(scamData));
    files.forEach((file) => formData.append("attachments", file));

    try {
      const res = await fetch("/api/report-scam", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setReportId(data.report_id || "SIMULATED-ID-123");
      setReportDate(
        data.scam_report_date || new Date().toISOString().split("T")[0]
      );
      setConfirmationOpen(true);
    } catch (err) {
      setError("An error occurred while submitting the report.");
    }
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.text("Scam Report Confirmation", 10, 10);
    doc.text(`Report ID: ${reportId}`, 10, 20);
    doc.text(`Report Date: ${reportDate}`, 10, 30);
    doc.text(`Victim Name: ${victim.firstName} ${victim.lastName}`, 10, 40);
    doc.text(`Email: ${victim.email}`, 10, 50);
    doc.text(
      `Scam Type: ${
        scam.scam_type === "Others" ? otherScamType : scam.scam_type
      }`,
      10,
      60
    );
    // Add more details as needed
    doc.save(`scam-report-${reportId}.pdf`);
  };

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const userMessage: Message = { role: "user", content: aiInput };
    setAiMessages((prev) => [...prev, userMessage]);
    setAiInput("");
    setAiLoading(true);

    try {
      const res = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: aiInput, history: aiMessages }),
      });
      const data = await res.json();
      const aiMessage: Message = {
        role: "ai",
        content: data.response || "Sorry, I couldn't process that.",
      };
      setAiMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        role: "ai",
        content: "An error occurred.",
      };
      setAiMessages((prev) => [...prev, errorMessage]);
    } finally {
      setAiLoading(false);
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAiKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAiSend();
    }
  };

  const handleExit = () => {
    setExitOpen(true);
  };

  const confirmExit = () => {
    router.push("/");
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Header />

      {/* Hero-like Section for Reporting */}
      <Box
        sx={{
          position: "relative",
          minHeight: "40vh",
          background: "linear-gradient(135deg, #001f3f 0%, #004080 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <ReportProblemIcon sx={{ fontSize: 80, mb: 2 }} />
          <Typography
            variant="h3"
            sx={{ fontFamily: "Inter", fontWeight: 700, mb: 2 }}
          >
            Report a Scam
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Provide details about the incident to help us investigate and
            prevent future scams.
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "#ffeb3b", fontWeight: 600, mb: 2 }}
          >
            Need Help? Our AI Assistant Can Guide You and Help Fill the Form for
            a More Comprehensive Report!
          </Typography>
          <Button
            variant="contained"
            onClick={() => setAiDrawerOpen(true)}
            sx={{
              backgroundColor: "#ff4d4f",
              "&:hover": { backgroundColor: "#d9363e" },
              px: 4,
              py: 1.5,
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          >
            Ask AI Assistant Now
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Typography variant="body1" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {/* Victim Details Section */}
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#001f3f", mb: 4 }}
          >
            Victim Details
          </Typography>
          <Grid container spacing={3}>
            {/* Row 1: first name, last name, sex, date of birth */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="First Name"
                name="firstName"
                value={victim.firstName}
                onChange={handleVictimChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Last Name"
                name="lastName"
                value={victim.lastName}
                onChange={handleVictimChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Sex</InputLabel>
                <Select
                  name="sex"
                  value={victim.sex}
                  onChange={handleVictimChange as any}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
              {victim.sex === "Others" && (
                <TextField
                  label="Specify Other Sex"
                  value={otherSex}
                  onChange={(e) => setOtherSex(e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                  required
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={victim.dob}
                  onChange={(date) => setVictim({ ...victim, dob: date })}
                  sx={{ width: "100%" }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Row 2: nationality, race, occupation */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Nationality"
                name="nationality"
                value={victim.nationality}
                onChange={handleVictimChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Race</InputLabel>
                <Select
                  name="race"
                  value={victim.race}
                  onChange={handleVictimChange as any}
                >
                  <MenuItem value="Chinese">Chinese</MenuItem>
                  <MenuItem value="Malay">Malay</MenuItem>
                  <MenuItem value="Indian">Indian</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
              {victim.race === "Others" && (
                <TextField
                  label="Specify Other Race"
                  value={otherRace}
                  onChange={(e) => setOtherRace(e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                  required
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Occupation"
                name="occupation"
                value={victim.occupation}
                onChange={handleVictimChange}
                fullWidth
              />
            </Grid>

            {/* Row 3: country code, contact number, email */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Grid container spacing={1}>
                <Grid size={5}>
                  <FormControl fullWidth>
                    <InputLabel>Country Code</InputLabel>
                    <Select
                      value={victimCountryCode}
                      onChange={(e) =>
                        setVictimCountryCode(e.target.value as string)
                      }
                    >
                      {countryCodes.map((cc) => (
                        <MenuItem key={cc.code} value={cc.code}>
                          {cc.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={7}>
                  <TextField
                    label="Contact Number"
                    value={victimLocalNo}
                    onChange={handleVictimLocalNoChange}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Email"
                name="email"
                value={victim.email}
                onChange={handleVictimChange}
                fullWidth
                required
              />
            </Grid>

            {/* Row 4: blk, street, unit number, postal code */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Block"
                name="blk"
                value={victim.blk}
                onChange={handleVictimChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Street"
                name="street"
                value={victim.street}
                onChange={handleVictimChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Unit Number"
                name="unitNo"
                value={victim.unitNo}
                onChange={handleVictimChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Postal Code"
                name="postCode"
                value={victim.postCode}
                onChange={handleVictimChange}
                fullWidth
              />
            </Grid>
          </Grid>

          {/* Scam Details Section */}
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#001f3f", mt: 6, mb: 4 }}
          >
            Scam Details
          </Typography>
          <Grid container spacing={3}>
            {/* Row 1: scam incident date, scam type, amount lost */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Scam Incident Date"
                  value={scam.scam_incident_date}
                  onChange={(date) =>
                    setScam({ ...scam, scam_incident_date: date })
                  }
                  sx={{ width: "100%" }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Scam Type</InputLabel>
                <Select
                  name="scam_type"
                  value={scam.scam_type}
                  onChange={handleScamChange as any}
                >
                  <MenuItem value="Phishing">Phishing Scams</MenuItem>
                  <MenuItem value="Investment">Investment Scams</MenuItem>
                  <MenuItem value="Romance">Romance Scams</MenuItem>
                  <MenuItem value="Job">Job Scams</MenuItem>
                  <MenuItem value="Government Impersonation">
                    Government Official Impersonation Scams
                  </MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
              {scam.scam_type === "Others" && (
                <TextField
                  label="Specify Other Scam Type"
                  value={otherScamType}
                  onChange={(e) => setOtherScamType(e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                  required
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Amount Lost (SGD)"
                name="scam_amount_lost"
                type="number"
                value={scam.scam_amount_lost}
                onChange={handleScamChange}
                fullWidth
              />
            </Grid>

            {/* Row 2: approach platform, communication platform */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Approach Platform</InputLabel>
                <Select
                  name="scam_approach_platform"
                  value={scam.scam_approach_platform}
                  onChange={handleScamChange as any}
                >
                  <MenuItem value="Phone Call">Phone Call</MenuItem>
                  <MenuItem value="SMS">SMS</MenuItem>
                  <MenuItem value="Email">Email</MenuItem>
                  <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                  <MenuItem value="Telegram">Telegram</MenuItem>
                  <MenuItem value="Facebook">Facebook</MenuItem>
                  <MenuItem value="Instagram">Instagram</MenuItem>
                  <MenuItem value="Other Social Media">
                    Other Social Media
                  </MenuItem>
                  <MenuItem value="Website">Website</MenuItem>
                  <MenuItem value="In Person">In Person</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
              {scam.scam_approach_platform === "Others" && (
                <TextField
                  label="Specify Other Approach Platform"
                  value={otherApproachPlatform}
                  onChange={(e) => setOtherApproachPlatform(e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                  required
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Communication Platform</InputLabel>
                <Select
                  name="scam_communication_platform"
                  value={scam.scam_communication_platform}
                  onChange={handleScamChange as any}
                >
                  <MenuItem value="Phone Call">Phone Call</MenuItem>
                  <MenuItem value="SMS">SMS</MenuItem>
                  <MenuItem value="Email">Email</MenuItem>
                  <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                  <MenuItem value="Telegram">Telegram</MenuItem>
                  <MenuItem value="Facebook">Facebook</MenuItem>
                  <MenuItem value="Instagram">Instagram</MenuItem>
                  <MenuItem value="Other Social Media">
                    Other Social Media
                  </MenuItem>
                  <MenuItem value="Website">Website</MenuItem>
                  <MenuItem value="In Person">In Person</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
              {scam.scam_communication_platform === "Others" && (
                <TextField
                  label="Specify Other Communication Platform"
                  value={otherCommunicationPlatform}
                  onChange={(e) =>
                    setOtherCommunicationPlatform(e.target.value)
                  }
                  fullWidth
                  sx={{ mt: 1 }}
                  required
                />
              )}
            </Grid>

            {/* Row 3: transaction type, beneficiary platform, beneficiary identifier */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  name="scam_transaction_type"
                  value={scam.scam_transaction_type}
                  onChange={handleScamChange as any}
                >
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Cryptocurrency">Cryptocurrency</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="E-Wallet">E-Wallet</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
              {scam.scam_transaction_type === "Others" && (
                <TextField
                  label="Specify Other Transaction Type"
                  value={otherTransactionType}
                  onChange={(e) => setOtherTransactionType(e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                  required
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Beneficiary Platform</InputLabel>
                <Select
                  name="scam_beneficiary_platform"
                  value={scam.scam_beneficiary_platform}
                  onChange={handleScamChange as any}
                >
                  <MenuItem value="Bank Account">Bank Account</MenuItem>
                  <MenuItem value="E-Wallet">E-Wallet</MenuItem>
                  <MenuItem value="Crypto Wallet">Crypto Wallet</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
              {scam.scam_beneficiary_platform === "Others" && (
                <TextField
                  label="Specify Other Beneficiary Platform"
                  value={otherBeneficiaryPlatform}
                  onChange={(e) => setOtherBeneficiaryPlatform(e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                  required
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Beneficiary Identifier (e.g., Account Number)"
                name="scam_beneficiary_identifier"
                value={scam.scam_beneficiary_identifier}
                onChange={handleScamChange}
                fullWidth
              />
            </Grid>

            {/* Row 4: country code, scammer phone number, scammer email */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Grid container spacing={1}>
                <Grid size={5}>
                  <FormControl fullWidth>
                    <InputLabel>Country Code</InputLabel>
                    <Select
                      value={scamCountryCode}
                      onChange={(e) =>
                        setScamCountryCode(e.target.value as string)
                      }
                    >
                      {countryCodes.map((cc) => (
                        <MenuItem key={cc.code} value={cc.code}>
                          {cc.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={7}>
                  <TextField
                    label="Scammer Phone Number"
                    value={scamLocalNo}
                    onChange={handleScamLocalNoChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Scammer Email"
                name="scam_email"
                value={scam.scam_email}
                onChange={handleScamChange}
                fullWidth
              />
            </Grid>

            {/* Row 5: scammer moniker/username, scam url/link */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Scammer Moniker/Username"
                name="scam_moniker"
                value={scam.scam_moniker}
                onChange={handleScamChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Scam URL/Link"
                name="scam_url_link"
                value={scam.scam_url_link}
                onChange={handleScamChange}
                fullWidth
              />
            </Grid>

            {/* Row 6: scam incident description */}
            <Grid size={12}>
              <TextField
                label="Incident Description"
                name="scam_incident_description"
                value={scam.scam_incident_description}
                onChange={handleScamChange}
                multiline
                rows={10}
                fullWidth
                required
                helperText="Please describe the incident in detail, including: how you were first contacted, the sequence of events, any communications or promises made, details of transactions, timestamps, and any other relevant information that could help the investigation. If you have screenshots or other evidence, upload them below."
              />
            </Grid>
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Attachments (Optional: screenshots, emails, transaction proofs,
                etc.)
              </Typography>
              <Box
                sx={{
                  border: "2px dashed #001f3f",
                  borderRadius: "4px",
                  p: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outlined" component="span" sx={{ mb: 1 }}>
                    Choose Files
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    or drag and drop files here
                  </Typography>
                </label>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Supported formats: PDF, JPG, JPEG, PNG
                </Typography>
              </Box>
              {files.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected files: {files.map((f) => f.name).join(", ")}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 4,
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="error"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
              }}
              onClick={handleExit}
            >
              Exit
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#ff4d4f",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                "&:hover": { backgroundColor: "#d9363e" },
              }}
            >
              Submit Report
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
      >
        <DialogTitle>Report Submitted Successfully</DialogTitle>
        <DialogContent>
          <Typography>
            Your scam report has been submitted. Report ID: {reportId}. Report
            Date: {reportDate}.
          </Typography>
          <Typography sx={{ mt: 2 }}>
            A confirmation email has been sent to {victim.email} with further
            details. Next steps: Our team will review the report and contact you
            if needed. For updates, contact us at [police contact info].
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownloadReport}>
            Download Confirmation Report
          </Button>
          <Button onClick={() => setConfirmationOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog open={exitOpen} onClose={() => setExitOpen(false)}>
        <DialogTitle>Confirm Exit</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to leave this page? Your progress will be
            lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExitOpen(false)}>No</Button>
          <Button onClick={confirmExit} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Assistant Drawer (Sidebar Chat) */}
      <Drawer
        anchor="right"
        open={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        sx={{ "& .MuiDrawer-paper": { width: { xs: "80%", sm: "400px" } } }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">AI Assistant Chat</Typography>
            <IconButton onClick={() => setAiDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Paper
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: "auto",
              mb: 2,
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            {aiMessages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: "70%",
                    bgcolor: msg.role === "user" ? "#d81b60" : "#1976d2",
                    color: "#fff",
                    borderRadius:
                      msg.role === "user"
                        ? "20px 20px 0 20px"
                        : "20px 20px 20px 0",
                  }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {msg.role === "user" ? "You" : "AI"}
                  </Typography>
                  <Typography variant="body1">{msg.content}</Typography>
                </Paper>
              </Box>
            ))}
            {aiLoading && (
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}
              >
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: "20px 20px 20px 0",
                  }}
                >
                  <Typography variant="body1">Thinking...</Typography>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Paper>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={handleAiKeyPress}
              disabled={aiLoading}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleAiSend}
              disabled={aiLoading || !aiInput.trim()}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}

export default ReportScam;
