"use client";

import React, { useState, useRef } from "react";
import {
  Alert,
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
  Snackbar,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  Popover,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Header from "@/components/landing/Header";
import dayjs, { Dayjs } from "dayjs";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";

import {
  submitPublicReport,
  sendChatMessage,
  PublicReportSubmission,
  Message,
} from "@/lib/public_reports";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface Message {
  role: "user" | "ai";
  content: string;
}

function ReportScam() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const testExamples = [
    {
      type: "Ecommerce Scam",
      query:
        "I came across a listing for a Taylor Swift concert ticket on Lazada, posted by someone using the moniker 'jonesstephanie'. I contacted the individual through WhatsApp to inquire about the item. \nThe seller requested full payment upfront and I transfered $552.84 to HSBC account 18196001 on 2025-02-08. \nAfter the payment was made, the item was not delivered. The seller became unresponsive and uncontactable.\n", // From profile_id 1
    },
    {
      type: "Phishing Scam",
      query:
        "I received an SMS from +6591322047 claiming to be from DBS, stating that there was outstanding bills that needed to be paid. \nIt requested that I verify my identity via a provided link[](https://secure-dbs-login.com/verify) to prevent unauthorized transactions. \nAfter clicking the link, I was directed to a website resembling DBS's official website, where I provided my my card credentials. \nSubsequently, my credentials were used to increase my account transfer limit, resulting in an unauthorized transaction of $225.90 to CITIBANK account 15594078 on 2025-04-07.\n", // From profile_id 16
    },
    {
      type: "Government Officials Impersonation Scam",
      query:
        "I received a call from an individual named James Wong, who claimed to be from the Ministry of Manpower. He had contacted me using +6599515702. \nHe claimed that workers employed under my details were overstaying in Singapore. \nWhen I denied knowledge of these workers, the call was transferred via WhatsApp to a second individual named Inspector William Wong, claiming to be from the Immigration and Checkpoints Authority. \nHe instructed me to transfer money to a bank account to support the investigations. As I was scared, I complied with his requests. As a result, I made a transaction of $77283.93 was made to BOC account 37672423 on 2025-03-11. \nI realized I had been scammed when the individuals became uncontactable. I also verified the situation with the Ministry of Manpower and Immigration and Checkpoints Authority, \nwhere there were no records of James Wong and Inspector William Wong.\n", // From profile_id 17
    },
  ];

  // Yup validation schema based on PublicReport and public_reports.py validators
  const validationSchema = yup.object({
    first_name: yup
      .string()
      .trim()
      .required("First name is required")
      .min(2, "Name must be at least 2 characters"),
    last_name: yup
      .string()
      .trim()
      .required("Last name is required")
      .min(2, "Name must be at least 2 characters"),
    contact_no: yup
      .string()
      .required("Contact number is required")
      .matches(/^\+?\d{8,}$/, {
        message:
          "Contact number must have at least 8 digits (optional + prefix)",
      }),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    sex: yup.string().required("Sex is required"),
    dob: yup
      .string()
      .nullable()
      .matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Invalid date format (YYYY-MM-DD)",
        excludeEmptyString: true,
      })
      .test(
        "is-valid-date",
        "Invalid date",
        (value) => !value || dayjs(value, "YYYY-MM-DD", true).isValid()
      )
      .test(
        "not-future",
        "Date of birth cannot be in the future",
        (value) => !value || !dayjs(value).isAfter(dayjs(), "day")
      ),
    nationality: yup.string().nullable(),
    race: yup.string().nullable(),
    occupation: yup.string().nullable(),
    blk: yup.string().nullable(),
    street: yup.string().nullable(),
    unit_no: yup.string().nullable(),
    postcode: yup.string().nullable(),
    role: yup
      .string()
      .oneOf(["reportee", "victim", "witness"], "Invalid role")
      .required("Role is required"),
    scam_incident_date: yup
      .string()
      .required("Incident date is required")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
      .test("is-valid-date", "Invalid date", (value) =>
        dayjs(value, "YYYY-MM-DD", true).isValid()
      )
      .test(
        "not-future",
        "Incident date cannot be in the future",
        (value) => !dayjs(value).isAfter(dayjs(), "day")
      ),
    scam_type: yup.string().nullable(),
    scam_approach_platform: yup.string().nullable(),
    scam_communication_platform: yup.string().nullable(),
    scam_transaction_type: yup.string().nullable(),
    scam_beneficiary_platform: yup.string().nullable(),
    scam_beneficiary_identifier: yup.string().nullable(),
    scam_contact_no: yup.string().nullable(),
    scam_email: yup.string().email("Invalid email address").nullable(),
    scam_moniker: yup.string().nullable(),
    scam_url_link: yup.string().nullable(),
    scam_amount_lost: yup
      .number()
      .nullable()
      .min(0, "Amount lost cannot be negative"),
    scam_incident_description: yup
      .string()
      .trim()
      .required("Description is required")
      .min(1, "Description cannot be empty"),
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue: setFormField,
  } = useForm<PublicReportSubmission>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      contact_no: "",
      email: "",
      sex: "",
      dob: null,
      nationality: "",
      race: "",
      occupation: "",
      blk: "",
      street: "",
      unit_no: "",
      postcode: "",
      role: "reportee", // Default as per model
      scam_incident_date: "",
      scam_type: "",
      scam_approach_platform: "",
      scam_communication_platform: "",
      scam_transaction_type: "",
      scam_beneficiary_platform: "",
      scam_beneficiary_identifier: "",
      scam_contact_no: "",
      scam_email: "",
      scam_moniker: "",
      scam_url_link: "",
      scam_amount_lost: null,
      scam_incident_description: "",
    },
  });

  const [otherSex, setOtherSex] = useState("");
  const [otherRace, setOtherRace] = useState("");
  const [otherScamType, setOtherScamType] = useState("");
  const [otherApproachPlatform, setOtherApproachPlatform] = useState("");
  const [otherCommunicationPlatform, setOtherCommunicationPlatform] =
    useState("");
  const [otherTransactionType, setOtherTransactionType] = useState("");

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [reportId, setReportId] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hello, I’m here to assist you. Could you please describe your experience with the scam? (It may take a short while for me to process the details, but I’ll guide you through and fill the form based on your inputs.)",
    },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasWarned, setHasWarned] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [submittedData, setSubmittedData] =
    useState<PublicReportSubmission | null>(null);

  const handleInfoClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);

  const fuzzyMatch = (input: string, options: string[]): string | null => {
    const normalizedInput = input.toUpperCase().trim();
    let bestMatch = null;
    let bestScore = 0;
    options.forEach((option) => {
      const normOption = option.toUpperCase();
      const score = Math.max(
        normalizedInput.includes(normOption) ? 100 : 0,
        normOption.includes(normalizedInput) ? 100 : 0,
        (normalizedInput.split("").filter((char) => normOption.includes(char))
          .length /
          Math.max(normalizedInput.length, normOption.length)) *
          100
      );
      if (score > bestScore && score > 80) {
        bestScore = score;
        bestMatch = option;
      }
    });
    return bestMatch;
  };

  const applyAiOverrides = (suggestions: Record<string, any>) => {
    const fieldsNotToUpper = [
      "scam_email",
      "scam_url_link",
      "scam_moniker",
      "scam_incident_description",
    ];
    Object.entries(suggestions).forEach(([key, value]) => {
      if (value && key.startsWith("scam_")) {
        let finalValue: any = value; // Start with raw value (could be string/number)
        if (finalValue === "") return; // Skip empty strings
        console.log(`Attempting to set ${key} to ${finalValue}`); // Debug log

        // Special handling for numeric fields: Parse to number
        if (key === "scam_amount_lost") {
          finalValue = parseFloat(finalValue.toString()) || null; // Parse to number; fallback to null if invalid
        } else if (!fieldsNotToUpper.includes(key)) {
          finalValue = finalValue.toString().toUpperCase(); // Uppercase only non-exempt text fields
        }

        // Handle dropdown fields with fuzzy or "Others"
        if (
          [
            "scam_type",
            "scam_approach_platform",
            "scam_communication_platform",
            "scam_transaction_type",
          ].includes(key)
        ) {
          const options =
            {
              scam_type: [
                "ECOMMERCE",
                "PHISHING",
                "GOVERNMENT OFFICIALS IMPERSONATION",
              ],
              scam_approach_platform: [
                "CALL",
                "SMS",
                "EMAIL",
                "WHATSAPP",
                "TELEGRAM",
                "FACEBOOK",
                "INSTAGRAM",
                "OTHERS",
                "WEBSITE",
              ],
              scam_communication_platform: [
                "CALL",
                "SMS",
                "EMAIL",
                "WHATSAPP",
                "TELEGRAM",
                "FACEBOOK",
                "INSTAGRAM",
                "OTHERS",
                "WEBSITE",
              ],
              scam_transaction_type: [
                "BANK TRANSFER",
                "CREDIT CARD",
                "CRYPTOCURRENCY",
                "CASH",
                "E-WALLET",
                "OTHERS",
              ],
            }[key] || [];
          const match = fuzzyMatch(finalValue.toString(), options); // Use toString() for fuzzy
          if (match) {
            console.log(`Matched ${key} to ${match}`); // Log match
            setFormField(key as keyof PublicReportSubmission, match);
          } else {
            console.log(
              `No match for ${key}, setting to 'OTHERS' with other: ${finalValue}`
            ); // Log fallback
            setFormField(key as keyof PublicReportSubmission, "OTHERS");
            const otherSetters = {
              scam_type: setOtherScamType,
              scam_approach_platform: setOtherApproachPlatform,
              scam_communication_platform: setOtherCommunicationPlatform,
              scam_transaction_type: setOtherTransactionType,
            }[key];
            if (otherSetters) otherSetters(finalValue.toString()); // Use string for "other" text fields
          }
        } else {
          setFormField(key as keyof PublicReportSubmission, finalValue);
        }
      }
    });
    setSnackbarMessage("AI suggestions applied automatically!");
    setSnackbarOpen(true);
  };

  const onSubmit = async (data: PublicReportSubmission) => {
    setError("");

    // Handle "Other" fields validation
    const othersChecks = [
      { field: data.race, other: otherRace, name: "race" },
      { field: data.scam_type, other: otherScamType, name: "scam type" },
      {
        field: data.scam_approach_platform,
        other: otherApproachPlatform,
        name: "approach platform",
      },
      {
        field: data.scam_communication_platform,
        other: otherCommunicationPlatform,
        name: "communication platform",
      },
      {
        field: data.scam_transaction_type,
        other: otherTransactionType,
        name: "transaction type",
      },
    ];

    for (const check of othersChecks) {
      if (check.field === "Others" && !check.other.trim()) {
        setError(`Please specify other ${check.name}.`);
        return;
      }
    }

    // Handle "Other" fields
    data.race = data.race === "Others" ? otherRace : data.race;
    data.scam_type =
      data.scam_type === "OTHERS" ? otherScamType : data.scam_type;
    data.scam_approach_platform =
      data.scam_approach_platform === "OTHERS"
        ? otherApproachPlatform
        : data.scam_approach_platform;
    data.scam_communication_platform =
      data.scam_communication_platform === "OTHERS"
        ? otherCommunicationPlatform
        : data.scam_communication_platform;
    data.scam_transaction_type =
      data.scam_transaction_type === "OTHERS"
        ? otherTransactionType
        : data.scam_transaction_type;

    // Uppercase fields as per public_reports.py
    const personFieldsToUpper = [
      "first_name",
      "last_name",
      "sex",
      "nationality",
      "race",
      "occupation",
      "blk",
      "street",
      "unit_no",
      "postcode",
    ];
    personFieldsToUpper.forEach((field) => {
      if (data[field]) data[field] = data[field].toUpperCase();
    });
    const reportFieldsToUpper = [
      "scam_type",
      "scam_approach_platform",
      "scam_communication_platform",
      "scam_transaction_type",
      "scam_beneficiary_platform",
      "scam_beneficiary_identifier",
    ];
    reportFieldsToUpper.forEach((field) => {
      if (data[field]) data[field] = data[field].toUpperCase();
    });

    // Link conversation if exists
    data.conversation_id = conversationId ?? undefined;

    // Force dates to strings if needed
    if (data.dob && typeof data.dob !== "string") {
      data.dob = dayjs(data.dob).format("YYYY-MM-DD");
    }
    if (
      data.scam_incident_date &&
      typeof data.scam_incident_date !== "string"
    ) {
      data.scam_incident_date = dayjs(data.scam_incident_date).format(
        "YYYY-MM-DD"
      );
    }

    try {
      const result = await submitPublicReport(data);
      setReportId(result.report_id.toString());
      setReportDate(dayjs().format("YYYY-MM-DD"));
      setSubmittedData(data);
      setConfirmationOpen(true);
      reset();
    } catch (err: any) {
      setSnackbarMessage(
        err.message || "An error occurred while submitting the report."
      );
      setSnackbarOpen(true);
      setError(err.message || "An error occurred while submitting the report.");
    }
  };

  const handleDownloadReport = () => {
    if (!submittedData) return;

    const doc = new jsPDF();
    const pageHeight = 280;
    let yPos = 20;

    // Helper function to add text with auto-pagination
    const addText = (
      text: string | string[],
      fontSize: number,
      isBold: boolean = false,
      x: number = 20
    ) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");

      const lineHeight = fontSize * 0.5; // Approx line height (adjust if needed; ~7 for size 11-14)
      const lines = Array.isArray(text) ? text : doc.splitTextToSize(text, 170); // Wrap single strings
      const requiredHeight = lines.length * lineHeight;

      if (yPos + requiredHeight > pageHeight) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(lines, x, yPos);
      yPos += requiredHeight + (isBold ? 5 : 2);
    };

    const addDivider = () => {
      if (yPos + 5 > pageHeight) {
        doc.addPage();
        yPos = 20;
      }
      doc.setLineWidth(0.5);
      doc.line(20, yPos, 190, yPos);
      yPos += 10;
    };

    doc.setTextColor(0, 0, 128);
    addText("Scam Report Confirmation", 18, true, 105);
    doc.setTextColor(0, 0, 0);

    addText(`Report ID: ${reportId}`, 12);
    addText(`Report Date: ${reportDate}`, 12);

    addDivider();

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Personal Details", 20, yPos);
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Name: ${submittedData.first_name} ${submittedData.last_name}`,
      20,
      yPos
    );
    yPos += 7;
    doc.text(
      `Sex: ${submittedData.sex}${
        submittedData.sex === "Others" ? ` (${otherSex})` : ""
      }`,
      20,
      yPos
    );
    yPos += 7;
    doc.text(`Date of Birth: ${submittedData.dob || "N/A"}`, 20, yPos);
    yPos += 7;
    doc.text(`Nationality: ${submittedData.nationality || "N/A"}`, 20, yPos);
    yPos += 7;
    doc.text(
      `Race: ${
        submittedData.race
          ? submittedData.race +
            (submittedData.race === "Others" ? ` (${otherRace})` : "")
          : "N/A"
      }`,
      20,
      yPos
    );
    yPos += 7;
    doc.text(`Occupation: ${submittedData.occupation || "N/A"}`, 20, yPos);
    yPos += 7;
    doc.text(`Role: ${submittedData.role}`, 20, yPos);
    yPos += 7;
    doc.text(`Contact Number: ${submittedData.contact_no}`, 20, yPos);
    yPos += 7;
    doc.text(`Email: ${submittedData.email}`, 20, yPos);
    yPos += 7;
    doc.text(
      `Address: ${submittedData.blk ? `Blk ${submittedData.blk}, ` : ""}${
        submittedData.street ? `${submittedData.street}, ` : ""
      }${submittedData.unit_no ? `Unit ${submittedData.unit_no}, ` : ""}${
        submittedData.postcode || "N/A"
      }`,
      20,
      yPos
    );
    yPos += 10;

    addDivider();

    // Section 2: Scam Details
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Scam Details", 20, yPos);
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Incident Date: ${submittedData.scam_incident_date}`, 20, yPos);
    yPos += 7;
    doc.text(
      `Scam Type: ${
        submittedData.scam_type
          ? submittedData.scam_type +
            (submittedData.scam_type === "OTHERS" ? ` (${otherScamType})` : "")
          : "N/A"
      }`,
      20,
      yPos
    );
    yPos += 7;
    doc.text(
      `Amount Lost (SGD): ${submittedData.scam_amount_lost || "N/A"}`,
      20,
      yPos
    );
    yPos += 7;
    doc.text(
      `Approach Platform: ${
        submittedData.scam_approach_platform
          ? submittedData.scam_approach_platform +
            (submittedData.scam_approach_platform === "OTHERS"
              ? ` (${otherApproachPlatform})`
              : "")
          : "N/A"
      }`,
      20,
      yPos
    );
    yPos += 7;
    doc.text(
      `Communication Platform: ${
        submittedData.scam_communication_platform
          ? submittedData.scam_communication_platform +
            (submittedData.scam_communication_platform === "OTHERS"
              ? ` (${otherCommunicationPlatform})`
              : "")
          : "N/A"
      }`,
      20,
      yPos
    );
    yPos += 7;
    doc.text(
      `Transaction Type: ${
        submittedData.scam_transaction_type
          ? submittedData.scam_transaction_type +
            (submittedData.scam_transaction_type === "OTHERS"
              ? ` (${otherTransactionType})`
              : "")
          : "N/A"
      }`,
      20,
      yPos
    );
    yPos += 7;
    doc.text(
      `Beneficiary Platform: ${
        submittedData.scam_beneficiary_platform || "N/A"
      }`,
      20,
      yPos
    );
    yPos += 7;
    doc.text(
      `Beneficiary Identifier: ${
        submittedData.scam_beneficiary_identifier || "N/A"
      }`,
      20,
      yPos
    );
    yPos += 7;
    doc.text(
      `Scammer Contact No: ${submittedData.scam_contact_no || "N/A"}`,
      20,
      yPos
    );
    yPos += 7;
    doc.text(`Scammer Email: ${submittedData.scam_email || "N/A"}`, 20, yPos);
    yPos += 7;
    doc.text(
      `Scammer Moniker: ${submittedData.scam_moniker || "N/A"}`,
      20,
      yPos
    );
    yPos += 7;
    doc.text(
      `Scam URL/Link: ${submittedData.scam_url_link || "N/A"}`,
      20,
      yPos
    );
    yPos += 10;

    addDivider();

    // Section 3: Incident Description (already split, now with pagination)
    addText("Incident Description", 14, true);
    const descriptionLines = doc.splitTextToSize(
      submittedData.scam_incident_description || "N/A",
      170
    );
    addText(descriptionLines, 11); // Handles multi-line and pagination

    doc.save(`scam-report-${reportId}.pdf`);
  };

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const formDataSummary = Object.entries(watch())
      .filter(([key, val]) => val && key.startsWith("scam_")) // Only scam fields
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");
    const enhancedQuery = formDataSummary
      ? `Current form data: ${formDataSummary}. User query: ${aiInput}`
      : aiInput;
    const userMessage: Message = { role: "user", content: aiInput };
    setAiMessages((prev) => [...prev, userMessage]);
    setAiInput("");
    setAiLoading(true);

    try {
      const { response, conversation_id, structured_data } =
        await sendChatMessage(enhancedQuery, conversationId);
      setConversationId(conversation_id ?? conversationId);
      const aiMessage: Message = {
        role: "ai",
        content: response || "Sorry, I couldn't process that.",
      };
      setAiMessages((prev) => [...prev, aiMessage]);
      // Auto-apply overrides if structured_data present
      if (Object.keys(structured_data || {}).length > 0) {
        applyAiOverrides(structured_data);
      }
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

  // Watch for conditional fields
  const sex = watch("sex");
  const race = watch("race");
  const scam_type = watch("scam_type");
  const scam_approach_platform = watch("scam_approach_platform");
  const scam_communication_platform = watch("scam_communication_platform");
  const scam_transaction_type = watch("scam_transaction_type");
  const scam_beneficiary_platform = watch("scam_beneficiary_platform");

  return (
    <React.Fragment>
      <CssBaseline />
      <Header />

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
            onClick={() => {
              if (!hasWarned) {
                setWarningOpen(true);
              } else {
                setAiDrawerOpen(true);
              }
            }}
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

      <Container maxWidth="lg" sx={{ py: 8, px: 2 }}>
        <Box
          sx={{
            display: { xs: "block", sm: "flex" },
            gap: 2,
            minHeight: "calc(100vh - 80px)",
            position: "relative",
          }}
        >
          {/* Form (left side) */}
          <Box
            sx={{
              flex: { sm: "0 0 70%" },
              width: { xs: "100%", sm: "auto" },
            }}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Alert
              severity="info"
              icon={<InfoOutlinedIcon />}
              sx={{ mb: 4, p: 2, borderRadius: 2, backgroundColor: "#e3f2fd" }} // Light blue for visibility
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                Testing Guidance for Examiners: Recommended Test Examples
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Use these narratives to test the chatbot (copy-paste directly
                into the AI chat). They align with trained scam types
                (Ecommerce, Phishing, Government Impersonation). Other inputs
                may produce suboptimal results.
              </Typography>
              <Box sx={{ maxHeight: "150px", overflowY: "auto", pl: 2 }}>
                <ul>
                  {testExamples.map((ex, idx) => (
                    <li key={idx}>
                      <strong>{ex.type}:</strong>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          mt: 0.5,
                        }}
                      >
                        {ex.query}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            </Alert>

            {/* Victim Details Section */}
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#001f3f", mb: 4 }}
            >
              Personal Details
            </Typography>
            <Grid container spacing={3}>
              {/* Row 1: first name, last name, sex, date of birth */}
              <Grid size={{ xs: 12, sm: 3 }}>
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      fullWidth
                      required
                      error={!!errors.first_name}
                      helperText={errors.first_name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      fullWidth
                      required
                      error={!!errors.last_name}
                      helperText={errors.last_name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                  <InputLabel>Sex *</InputLabel>
                  <Controller
                    name="sex"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} value={field.value || ""}>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.sex}>
                    {errors.sex?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        {...field}
                        label="Date of Birth"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date: Dayjs | null) =>
                          field.onChange(
                            date ? date.format("YYYY-MM-DD") : null
                          )
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.dob,
                            helperText: errors.dob?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>

              {/* Row 2: nationality, race, occupation, role */}
              <Grid size={{ xs: 12, sm: 3 }}>
                <Controller
                  name="nationality"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nationality"
                      fullWidth
                      error={!!errors.nationality}
                      helperText={errors.nationality?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                  <InputLabel>Race</InputLabel>
                  <Controller
                    name="race"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} value={field.value || ""}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Chinese">Chinese</MenuItem>
                        <MenuItem value="Malay">Malay</MenuItem>
                        <MenuItem value="Indian">Indian</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </Select>
                    )}
                  />
                  {race === "Others" && (
                    <TextField
                      label="Specify Other Race"
                      value={otherRace}
                      onChange={(e) => setOtherRace(e.target.value)}
                      fullWidth
                      sx={{ mt: 1 }}
                      required
                    />
                  )}
                  <FormHelperText error={!!errors.race}>
                    {errors.race?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <Controller
                  name="occupation"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Occupation"
                      fullWidth
                      error={!!errors.occupation}
                      helperText={errors.occupation?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                  <InputLabel>Role *</InputLabel>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} value={field.value || ""}>
                        <MenuItem value="reportee">Reportee</MenuItem>
                        <MenuItem value="victim">Victim</MenuItem>
                        <MenuItem value="witness">Witness</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.role}>
                    {errors.role?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Row 3: contact number, email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="contact_no"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contact Number (e.g., 12345678 or +6512345678)"
                      fullWidth
                      required
                      error={!!errors.contact_no}
                      helperText={errors.contact_no?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      fullWidth
                      required
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>

              {/* Row 4: blk, street, unit number, postal code */}
              <Grid size={{ xs: 12, sm: 3 }}>
                <Controller
                  name="blk"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Block"
                      fullWidth
                      error={!!errors.blk}
                      helperText={errors.blk?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <Controller
                  name="street"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Street"
                      fullWidth
                      error={!!errors.street}
                      helperText={errors.street?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <Controller
                  name="unit_no"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Unit Number"
                      fullWidth
                      error={!!errors.unit_no}
                      helperText={errors.unit_no?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <Controller
                  name="postcode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Postal Code"
                      fullWidth
                      error={!!errors.postcode}
                      helperText={errors.postcode?.message}
                    />
                  )}
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
                <Controller
                  name="scam_incident_date"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        {...field}
                        label="Scam Incident Date"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date: Dayjs | null) =>
                          field.onChange(
                            date ? date.format("YYYY-MM-DD") : null
                          )
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!errors.scam_incident_date,
                            helperText: errors.scam_incident_date?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                  <InputLabel>Scam Type</InputLabel>
                  <Controller
                    name="scam_type"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} value={field.value || ""}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="ECOMMERCE">Ecommerce Scam</MenuItem>
                        <MenuItem value="PHISHING">Phishing Scam</MenuItem>
                        <MenuItem value="GOVERNMENT OFFICIALS IMPERSONATION">
                          Government Officials Impersonation Scam
                        </MenuItem>
                        <MenuItem value="OTHERS">Others</MenuItem>
                      </Select>
                    )}
                  />
                  {scam_type === "OTHERS" && (
                    <TextField
                      label="Specify Other Scam Type"
                      value={otherScamType}
                      onChange={(e) => setOtherScamType(e.target.value)}
                      fullWidth
                      sx={{ mt: 1 }}
                      required
                    />
                  )}
                  <FormHelperText error={!!errors.scam_type}>
                    {errors.scam_type?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                  name="scam_amount_lost"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Amount Lost (SGD)"
                      type="number"
                      fullWidth
                      error={!!errors.scam_amount_lost}
                      helperText={errors.scam_amount_lost?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                  <InputLabel>Approach Platform</InputLabel>
                  <Controller
                    name="scam_approach_platform"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} value={field.value || ""}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="CALL">Call</MenuItem>
                        <MenuItem value="SMS">SMS</MenuItem>
                        <MenuItem value="EMAIL">Email</MenuItem>
                        <MenuItem value="WHATSAPP">WhatsApp</MenuItem>
                        <MenuItem value="TELEGRAM">Telegram</MenuItem>
                        <MenuItem value="FACEBOOK">Facebook</MenuItem>
                        <MenuItem value="INSTAGRAM">Instagram</MenuItem>
                        <MenuItem value="WEBSITE">Website</MenuItem>
                        <MenuItem value="OTHERS">Others</MenuItem>
                      </Select>
                    )}
                  />
                  {scam_approach_platform === "OTHERS" && (
                    <TextField
                      label="Specify Other Approach Platform"
                      value={otherApproachPlatform}
                      onChange={(e) => setOtherApproachPlatform(e.target.value)}
                      fullWidth
                      sx={{ mt: 1 }}
                      required
                    />
                  )}
                  <FormHelperText error={!!errors.scam_approach_platform}>
                    {errors.scam_approach_platform?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                  <InputLabel>Communication Platform</InputLabel>
                  <Controller
                    name="scam_communication_platform"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} value={field.value || ""}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="CALL">Call</MenuItem>
                        <MenuItem value="SMS">SMS</MenuItem>
                        <MenuItem value="EMAIL">Email</MenuItem>
                        <MenuItem value="WHATSAPP">WhatsApp</MenuItem>
                        <MenuItem value="TELEGRAM">Telegram</MenuItem>
                        <MenuItem value="FACEBOOK">Facebook</MenuItem>
                        <MenuItem value="INSTAGRAM">Instagram</MenuItem>
                        <MenuItem value="WEBSITE">Website</MenuItem>
                        <MenuItem value="OTHERS">Others</MenuItem>
                      </Select>
                    )}
                  />
                  {scam_communication_platform === "OTHERS" && (
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
                  <FormHelperText error={!!errors.scam_communication_platform}>
                    {errors.scam_communication_platform?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Row 3: transaction type, beneficiary platform, beneficiary identifier */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                  <InputLabel>Transaction Type</InputLabel>
                  <Controller
                    name="scam_transaction_type"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} value={field.value || ""}>
                        <MenuItem value="">Select...</MenuItem>{" "}
                        {/* Added for reset */}
                        <MenuItem value="BANK TRANSFER">Bank Transfer</MenuItem>
                        <MenuItem value="CREDIT CARD">Credit Card</MenuItem>
                        <MenuItem value="CRYPTOCURRENCY">
                          Cryptocurrency
                        </MenuItem>
                        <MenuItem value="CASH">Cash</MenuItem>
                        <MenuItem value="E-WALLET">E-Wallet</MenuItem>
                        <MenuItem value="OTHERS">Others</MenuItem>
                      </Select>
                    )}
                  />
                  {scam_transaction_type === "OTHERS" && (
                    <TextField
                      label="Specify Other Transaction Type"
                      value={otherTransactionType}
                      onChange={(e) => setOtherTransactionType(e.target.value)}
                      fullWidth
                      sx={{ mt: 1 }}
                      required
                    />
                  )}
                  <FormHelperText error={!!errors.scam_transaction_type}>
                    {errors.scam_transaction_type?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                  name="scam_beneficiary_platform"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Beneficiary Platform (e.g. bank name)"
                      fullWidth
                      error={!!errors.scam_beneficiary_platform}
                      helperText={errors.scam_beneficiary_platform?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                  name="scam_beneficiary_identifier"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Beneficiary Identifier (e.g., Account Number)"
                      fullWidth
                      error={!!errors.scam_beneficiary_identifier}
                      helperText={errors.scam_beneficiary_identifier?.message}
                    />
                  )}
                />
              </Grid>

              {/* Row 4: scammer phone number, scammer email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="scam_contact_no"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Scammer Contact Number (e.g., 12345678 or +6512345678)"
                      fullWidth
                      error={!!errors.scam_contact_no}
                      helperText={errors.scam_contact_no?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="scam_email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Scammer Email"
                      fullWidth
                      error={!!errors.scam_email}
                      helperText={errors.scam_email?.message}
                    />
                  )}
                />
              </Grid>

              {/* Row 5: scammer moniker/username, scam url/link */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="scam_moniker"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Scammer Moniker/Username"
                      fullWidth
                      error={!!errors.scam_moniker}
                      helperText={errors.scam_moniker?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="scam_url_link"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Scam URL/Link"
                      fullWidth
                      error={!!errors.scam_url_link}
                      helperText={errors.scam_url_link?.message}
                    />
                  )}
                />
              </Grid>

              {/* Row 6: scam incident description */}
              <Grid size={12}>
                <Controller
                  name="scam_incident_description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Incident Description"
                      multiline
                      rows={10}
                      fullWidth
                      required
                      error={!!errors.scam_incident_description}
                      helperText={
                        errors.scam_incident_description?.message ||
                        "Please describe the incident in detail, including: how you were first contacted, the sequence of events, any communications or promises made, details of transactions, timestamps, and any other relevant information that could help the investigation."
                      }
                    />
                  )}
                />
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
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={() => setSnackbarOpen(false)}
                severity="error"
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Box>
          <Box
            sx={{
              flex: { sm: "0 0 25%" },
              width: { xs: "100%", sm: "auto" },
              alignSelf: { xs: "auto", sm: "start" },
            }}
          >
            {aiDrawerOpen && (
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "700px",
                  border: "1px solid #ddd",
                  position: { xs: "static", sm: "fixed" },
                  bottom: { sm: 16 },
                  right: { sm: 16 },
                  zIndex: { sm: 10 },
                  borderRadius: "8px",
                  width: { xs: "100%", sm: "30%" },
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
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        mb: 2,
                      }}
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
                  <Box
                    sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}
                  >
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Type a message..."
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyPress={handleAiKeyPress}
                      disabled={aiLoading}
                    />
                    <IconButton onClick={handleInfoClick} sx={{ ml: 1 }}>
                      <InfoOutlinedIcon />
                    </IconButton>
                  </Box>
                  <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleAiSend}
                    disabled={aiLoading || !aiInput.trim()}
                  >
                    Send
                  </Button>
                  <Popover
                    open={popoverOpen}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    transformOrigin={{ vertical: "bottom", horizontal: "left" }}
                  >
                    <Box sx={{ p: 2, maxWidth: "800px" }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Recommended Test Examples (Copy-Paste directly or use
                        these narratives):
                      </Typography>
                      <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
                        <ul>
                          {testExamples.map((ex, idx) => (
                            <li key={idx}>
                              <strong>{ex.type}:</strong>
                              <Typography
                                variant="body2"
                                sx={{
                                  whiteSpace: "pre-wrap",
                                  wordBreak: "break-word",
                                }}
                              >
                                {ex.query}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, color: "warning.main" }}
                      >
                        These align with the AI's trained scam types (Ecommerce,
                        Phishing, Government Impersonation). Other inputs may
                        produce suboptimal results.
                      </Typography>
                    </Box>
                  </Popover>
                  {/* <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleAiSend}
                    disabled={aiLoading || !aiInput.trim()}
                  >
                    Send
                  </Button> */}
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>

      <Dialog
        open={confirmationOpen}
        onClose={() => {
          setConfirmationOpen(false);
        }}
      >
        <DialogTitle>Report Submitted Successfully</DialogTitle>
        <DialogContent>
          <Typography>
            Your scam report has been submitted.
            <br />
            Report ID: {reportId}.
            <br />
            Report Date: {reportDate}.
            <br />
            Download the confirmation below for your records.
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Next steps: Our team will review the report and contact you if
            needed. For updates, contact us at general_enquiries@spf_team.com.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownloadReport}>
            Download Confirmation Report
          </Button>
          <Button
            onClick={() => {
              setConfirmationOpen(false);
              router.push("/");
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* One-Time AI Warning Dialog */}
      <Dialog open={warningOpen} onClose={() => setWarningOpen(false)}>
        <DialogTitle>AI Assistant Warning</DialogTitle>
        <DialogContent>
          <Typography>
            Using the AI assistant may automatically override your form entries
            based on chat suggestions. This helps create a more comprehensive
            report but will change what you've entered.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWarningOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setHasWarned(true);
              setWarningOpen(false);
              setAiDrawerOpen(true);
            }}
            color="primary"
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ReportScam;
