// import { render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import ReportScam from "@/app/(landing)/report-scam/page";
// import * as publicReportsLib from "@/lib/public_reports";
// import { useRouter } from "next/navigation";
// import jsPDF from "jspdf";
// import "@testing-library/jest-dom";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// jest.mock("@/lib/public_reports");
// jest.mock("jspdf");

// // Mock next/navigation
// jest.mock("next/navigation", () => ({
//   useRouter: jest.fn(),
// }));

// jest.setTimeout(30000); // Global timeout for slow tests

// // Mock scrollIntoView to avoid JSDOM errors
// beforeAll(() => {
//   Element.prototype.scrollIntoView = jest.fn();
// });

// // Custom render wrapper with MUI providers (needed for theme and date picker)
// const theme = createTheme();
// const renderWithProviders = (ui: React.ReactElement) => {
//   return render(
//     <ThemeProvider theme={theme}>
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         {ui}
//       </LocalizationProvider>
//     </ThemeProvider>
//   );
// };

// // Mock router
// const mockPush = jest.fn();
// beforeEach(() => {
//   (useRouter as jest.Mock).mockReturnValue({
//     push: mockPush,
//   });
// });

// // Mock jsPDF instance
// const mockJsPDF = {
//   setFontSize: jest.fn(),
//   setFont: jest.fn(),
//   setTextColor: jest.fn(),
//   setLineWidth: jest.fn(),
//   text: jest.fn(),
//   line: jest.fn(),
//   addPage: jest.fn(),
//   save: jest.fn(),
//   splitTextToSize: jest.fn().mockImplementation((text) => [text]),
// };
// (jsPDF as jest.Mock).mockImplementation(() => mockJsPDF);

// // Sample mock data (minimal required fields for submission)
// const mockFormData = {
//   first_name: "John",
//   last_name: "Doe",
//   contact_no: "+123456789",
//   email: "john@example.com",
//   sex: "Male",
//   role: "victim",
//   scam_incident_date: "2023-01-01",
//   scam_incident_description: "Test description",
// };

// // Setup userEvent
// const user = userEvent.setup();

// describe("ReportScam Component", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     (publicReportsLib.submitPublicReport as jest.Mock).mockResolvedValue({
//       report_id: 123,
//     });
//     (publicReportsLib.sendChatMessage as jest.Mock).mockResolvedValue({
//       response: "AI response",
//       conversation_id: 1,
//       structured_data: { scam_type: "PHISHING" },
//     });
//     mockPush.mockClear();
//   });

//   it("renders without crashing and displays key form elements", async () => {
//     renderWithProviders(<ReportScam />);
//     await waitFor(() => {
//       expect(
//         screen.getByRole("heading", { name: /Report a Scam/i })
//       ).toBeInTheDocument();
//       expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
//       expect(screen.getByLabelText("Email *")).toBeInTheDocument();
//       expect(
//         screen.getByLabelText("Incident Description *")
//       ).toBeInTheDocument();
//       expect(
//         screen.getByRole("button", { name: /Ask AI Assistant Now/i })
//       ).toBeInTheDocument();
//     });
//   });

//   it("renders the testing guidance alert with examples", async () => {
//     renderWithProviders(<ReportScam />);
//     await waitFor(() => {
//       expect(
//         screen.getByText(
//           /Testing Guidance for Examiners: Recommended Test Examples/i
//         )
//       ).toBeInTheDocument();
//       expect(screen.getByText(/Ecommerce Scam/i)).toBeInTheDocument();
//       expect(screen.getByText(/Phishing Scam/i)).toBeInTheDocument();
//       expect(
//         screen.getByText(/Government Officials Impersonation Scam/i)
//       ).toBeInTheDocument();
//     });
//   });

//   it("validates required fields on submit and shows errors", async () => {
//     renderWithProviders(<ReportScam />);

//     // Submit empty form
//     const submitButton = screen.getByRole("button", { name: /Submit Report/i });
//     await user.click(submitButton);

//     // Check for error messages (from Yup via MUI helper text)
//     await waitFor(() => {
//       expect(screen.getByText("First name is required")).toBeInTheDocument();
//       expect(screen.getByText("Last name is required")).toBeInTheDocument();
//       expect(
//         screen.getByText("Contact number is required")
//       ).toBeInTheDocument();
//       expect(screen.getByText("Email is required")).toBeInTheDocument();
//       expect(screen.getByText("Sex is required")).toBeInTheDocument();
//       expect(screen.getByText("Incident date is required")).toBeInTheDocument();
//       expect(screen.getByText("Description is required")).toBeInTheDocument();
//     });
//   });

//   it("handles successful form submission, shows confirmation dialog, and downloads PDF", async () => {
//     renderWithProviders(<ReportScam />);

//     // Fill minimal required fields
//     await user.type(
//       screen.getByLabelText(/First Name/i),
//       mockFormData.first_name
//     );
//     await user.type(
//       screen.getByLabelText(/Last Name/i),
//       mockFormData.last_name
//     );
//     await user.type(
//       screen.getByLabelText("Contact Number (e.g., 12345678 or +6512345678) *"),
//       mockFormData.contact_no
//     );
//     await user.type(screen.getByLabelText("Email *"), mockFormData.email);

//     // Select sex (index 0: sex combobox)
//     const comboboxes = screen.getAllByRole("combobox");
//     const sexSelect = comboboxes[0];
//     await user.click(sexSelect);
//     await user.click(screen.getByRole("option", { name: "Male" }));

//     // Select role (index 2: role combobox)
//     const roleSelect = comboboxes[2];
//     await user.click(roleSelect);
//     await user.click(screen.getByRole("option", { name: "Victim" }));

//     // Date picker
//     const dateField = screen.getByLabelText("Scam Incident Date *");
//     await user.click(dateField);
//     await user.clear(dateField); // Clear any default
//     await user.type(dateField, mockFormData.scam_incident_date);
//     await user.keyboard("{Enter}"); // Confirm date

//     // Description
//     await user.type(
//       screen.getByLabelText("Incident Description *"),
//       mockFormData.scam_incident_description
//     );

//     // Submit
//     const submitButton = screen.getByRole("button", { name: /Submit Report/i });
//     await user.click(submitButton);

//     // Check API called and dialog opens
//     await waitFor(() => {
//       expect(publicReportsLib.submitPublicReport).toHaveBeenCalledWith(
//         expect.objectContaining(mockFormData)
//       );
//       expect(
//         screen.getByText("Report Submitted Successfully")
//       ).toBeInTheDocument();
//       expect(screen.getByText(/Report ID: 123/i)).toBeInTheDocument();
//     });

//     // Download PDF
//     const downloadButton = screen.getByRole("button", {
//       name: /Download Confirmation Report/i,
//     });
//     await user.click(downloadButton);
//     expect(mockJsPDF.save).toHaveBeenCalledWith("scam-report-123.pdf");

//     // Click OK to navigate
//     const okButton = screen.getByRole("button", { name: "OK" });
//     await user.click(okButton);
//     expect(mockPush).toHaveBeenCalledWith("/");
//   });

//   it("handles submission error and shows snackbar", async () => {
//     (publicReportsLib.submitPublicReport as jest.Mock).mockRejectedValue(
//       new Error("Submission failed")
//     );

//     renderWithProviders(<ReportScam />);

//     // Fill minimal required fields (reuse from success test for simplicity)
//     await user.type(
//       screen.getByLabelText(/First Name/i),
//       mockFormData.first_name
//     );
//     await user.type(
//       screen.getByLabelText(/Last Name/i),
//       mockFormData.last_name
//     );
//     await user.type(
//       screen.getByLabelText("Contact Number (e.g., 12345678 or +6512345678) *"),
//       mockFormData.contact_no
//     );
//     await user.type(screen.getByLabelText("Email *"), mockFormData.email);

//     // Select sex (index 0: sex combobox)
//     const comboboxes = screen.getAllByRole("combobox");
//     const sexSelect = comboboxes[0];
//     await user.click(sexSelect);
//     await user.click(screen.getByRole("option", { name: "Male" }));

//     // Select role (index 2: role combobox)
//     const roleSelect = comboboxes[2];
//     await user.click(roleSelect);
//     await user.click(screen.getByRole("option", { name: "Victim" }));

//     const dateField = screen.getByLabelText("Scam Incident Date *");
//     await user.click(dateField);
//     await user.clear(dateField);
//     await user.type(dateField, mockFormData.scam_incident_date);
//     await user.keyboard("{Enter}");
//     await user.type(
//       screen.getByLabelText("Incident Description *"),
//       mockFormData.scam_incident_description
//     );

//     // Submit
//     const submitButton = screen.getByRole("button", { name: /Submit Report/i });
//     await user.click(submitButton);

//     // Check snackbar error
//     await waitFor(() => {
//       expect(publicReportsLib.submitPublicReport).toHaveBeenCalledTimes(1);
//       expect(screen.getByText("Submission failed")).toBeInTheDocument();
//     });
//   });

//   it("opens AI chat after warning, sends message, applies suggestions, and shows snackbar", async () => {
//     renderWithProviders(<ReportScam />);

//     // Click AI button
//     const aiButton = screen.getByRole("button", {
//       name: /Ask AI Assistant Now/i,
//     });
//     await user.click(aiButton);

//     // Check and proceed through warning dialog
//     await waitFor(() => {
//       expect(screen.getByText("AI Assistant Warning")).toBeInTheDocument();
//     });
//     const proceedButton = screen.getByRole("button", { name: "Proceed" });
//     await user.click(proceedButton);

//     // Check chat opens with initial message
//     await waitFor(() => {
//       expect(screen.getByText("AI Assistant Chat")).toBeInTheDocument();
//       expect(
//         screen.getByText(/Hello, I’m here to assist you/i)
//       ).toBeInTheDocument();
//     });

//     // Type and send message
//     const chatInput = screen.getByPlaceholderText("Type a message...");
//     await user.type(chatInput, "Test query");
//     const sendButton = screen.getByRole("button", { name: /Send/i });
//     await user.click(sendButton);

//     // Check API called, response appears, and suggestions applied (check form field and snackbar)
//     await waitFor(() => {
//       expect(publicReportsLib.sendChatMessage).toHaveBeenCalledWith(
//         expect.stringContaining("Test query"),
//         null
//       );
//       expect(screen.getByText("Test query")).toBeInTheDocument(); // User message
//       expect(screen.getByText("AI response")).toBeInTheDocument(); // AI response
//       const comboboxes = screen.getAllByRole("combobox");
//       const scamTypeSelect = comboboxes[3]; // index 3: scam_type combobox
//       expect(scamTypeSelect).toHaveTextContent("Phishing Scam"); // Auto-filled display text
//       expect(
//         screen.getByText("AI suggestions applied automatically!")
//       ).toBeInTheDocument(); // Snackbar
//     });
//   });

//   it("triggers exit confirmation and navigates away", async () => {
//     renderWithProviders(<ReportScam />);

//     // Click exit button
//     const exitButton = screen.getByRole("button", { name: "Exit" });
//     await user.click(exitButton);

//     // Check confirmation dialog
//     await waitFor(() => {
//       expect(screen.getByText("Confirm Exit")).toBeInTheDocument();
//     });

//     // Confirm yes
//     const yesButton = screen.getByRole("button", { name: "Yes" });
//     await user.click(yesButton);

//     // Check navigation
//     expect(mockPush).toHaveBeenCalledWith("/");
//   });
// });






// import { render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import ReportScam from "@/app/(landing)/report-scam/page";
// import * as publicReportsLib from "@/lib/public_reports";
// import { useRouter } from "next/navigation";
// import jsPDF from "jspdf";
// import "@testing-library/jest-dom";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// jest.mock("@/lib/public_reports");
// jest.mock("jspdf");

// // Mock next/navigation
// jest.mock("next/navigation", () => ({
//   useRouter: jest.fn(),
// }));

// jest.setTimeout(30000); // Global timeout for slow tests

// // Mock scrollIntoView to avoid JSDOM errors
// beforeAll(() => {
//   Element.prototype.scrollIntoView = jest.fn();
// });

// // Custom render wrapper with MUI providers (needed for theme and date picker)
// const theme = createTheme();
// const renderWithProviders = (ui: React.ReactElement) => {
//   return render(
//     <ThemeProvider theme={theme}>
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         {ui}
//       </LocalizationProvider>
//     </ThemeProvider>
//   );
// };

// // Mock router
// const mockPush = jest.fn();
// beforeEach(() => {
//   (useRouter as jest.Mock).mockReturnValue({
//     push: mockPush,
//   });
// });

// // Mock jsPDF instance
// const mockJsPDF = {
//   setFontSize: jest.fn(),
//   setFont: jest.fn(),
//   setTextColor: jest.fn(),
//   setLineWidth: jest.fn(),
//   text: jest.fn(),
//   line: jest.fn(),
//   addPage: jest.fn(),
//   save: jest.fn(),
//   splitTextToSize: jest.fn().mockImplementation((text) => [text]),
// };
// (jsPDF as jest.Mock).mockImplementation(() => mockJsPDF);

// // Sample mock data (minimal required fields for submission)
// const mockFormData = {
//   first_name: "John",
//   last_name: "Doe",
//   contact_no: "+123456789",
//   email: "john@example.com",
//   sex: "Male",
//   role: "victim",
//   scam_incident_date: "2023-01-01",
//   scam_incident_description: "Test description",
// };

// // Setup userEvent
// const user = userEvent.setup();

// describe("ReportScam Component", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     (publicReportsLib.submitPublicReport as jest.Mock).mockResolvedValue({
//       report_id: 123,
//     });
//     (publicReportsLib.sendChatMessage as jest.Mock).mockResolvedValue({
//       response: "AI response",
//       conversation_id: 1,
//       structured_data: { scam_type: "PHISHING" },
//     });
//     mockPush.mockClear();
//   });

//   it("renders without crashing and displays key form elements", async () => {
//     renderWithProviders(<ReportScam />);
//     await waitFor(() => {
//       expect(
//         screen.getByRole("heading", { name: /Report a Scam/i })
//       ).toBeInTheDocument();
//       expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
//       expect(screen.getByLabelText("Email *")).toBeInTheDocument();
//       expect(
//         screen.getByLabelText("Incident Description *")
//       ).toBeInTheDocument();
//       expect(
//         screen.getByRole("button", { name: /Ask AI Assistant Now/i })
//       ).toBeInTheDocument();
//     });
//   });

//   it("renders the testing guidance alert with examples", async () => {
//     renderWithProviders(<ReportScam />);
//     await waitFor(() => {
//       expect(
//         screen.getByText(
//           /Testing Guidance for Examiners: Recommended Test Examples/i
//         )
//       ).toBeInTheDocument();
//       expect(screen.getByText(/Ecommerce Scam/i)).toBeInTheDocument();
//       expect(screen.getByText(/Phishing Scam/i)).toBeInTheDocument();
//       expect(
//         screen.getByText(/Government Officials Impersonation Scam/i)
//       ).toBeInTheDocument();
//     });
//   });

//   it("validates required fields on submit and shows errors", async () => {
//     renderWithProviders(<ReportScam />);

//     // Submit empty form
//     const submitButton = screen.getByRole("button", { name: /Submit Report/i });
//     await user.click(submitButton);

//     // Check for error messages (from Yup via MUI helper text)
//     await waitFor(() => {
//       expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
//       expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
//       expect(
//         screen.getByText(/Contact number is required/i)
//       ).toBeInTheDocument();
//       expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
//       expect(screen.getByText(/Sex is required/i)).toBeInTheDocument();
//       expect(screen.getByText(/Incident date is required/i)).toBeInTheDocument();
//       expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
//     });
//   });

//   it("handles successful form submission, shows confirmation dialog, and downloads PDF", async () => {
//     renderWithProviders(<ReportScam />);

//     // Fill minimal required fields
//     await user.type(
//       screen.getByLabelText(/First Name/i),
//       mockFormData.first_name
//     );
//     await user.type(
//       screen.getByLabelText(/Last Name/i),
//       mockFormData.last_name
//     );
//     await user.type(
//       screen.getByLabelText("Contact Number (e.g., 12345678 or +6512345678) *"),
//       mockFormData.contact_no
//     );
//     await user.type(screen.getByLabelText("Email *"), mockFormData.email);

//     // Select sex (index 0: sex combobox)
//     const comboboxes = screen.getAllByRole("combobox");
//     const sexSelect = comboboxes[0];
//     await user.click(sexSelect);
//     await user.click(screen.getByRole("option", { name: "Male" }));

//     // Select role (index 2: role combobox)
//     const roleSelect = comboboxes[2];
//     await user.click(roleSelect);
//     await user.click(screen.getByRole("option", { name: "Victim" }));

//     // Date picker
//     const dateField = screen.getByLabelText(/Scam Incident Date/i);
//     await user.click(dateField);
//     await user.clear(dateField); // Clear any default
//     await user.type(dateField, mockFormData.scam_incident_date);
//     await user.keyboard("{Enter}"); // Confirm date

//     // Description
//     await user.type(
//       screen.getByLabelText("Incident Description *"),
//       mockFormData.scam_incident_description
//     );

//     // Submit
//     const submitButton = screen.getByRole("button", { name: /Submit Report/i });
//     await user.click(submitButton);

//     // Check API called and dialog opens
//     await waitFor(() => {
//       expect(publicReportsLib.submitPublicReport).toHaveBeenCalledWith(
//         expect.objectContaining(mockFormData)
//       );
//       expect(
//         screen.getByText("Report Submitted Successfully")
//       ).toBeInTheDocument();
//       expect(screen.getByText(/Report ID: 123/i)).toBeInTheDocument();
//     });

//     // Download PDF
//     const downloadButton = screen.getByRole("button", {
//       name: /Download Confirmation Report/i,
//     });
//     await user.click(downloadButton);
//     expect(mockJsPDF.save).toHaveBeenCalledWith("scam-report-123.pdf");

//     // Click OK to navigate
//     const okButton = screen.getByRole("button", { name: "OK" });
//     await user.click(okButton);
//     expect(mockPush).toHaveBeenCalledWith("/");
//   });

//   it("handles submission error and shows snackbar", async () => {
//     (publicReportsLib.submitPublicReport as jest.Mock).mockRejectedValue(
//       new Error("Submission failed")
//     );

//     renderWithProviders(<ReportScam />);

//     // Fill minimal required fields (reuse from success test for simplicity)
//     await user.type(
//       screen.getByLabelText(/First Name/i),
//       mockFormData.first_name
//     );
//     await user.type(
//       screen.getByLabelText(/Last Name/i),
//       mockFormData.last_name
//     );
//     await user.type(
//       screen.getByLabelText("Contact Number (e.g., 12345678 or +6512345678) *"),
//       mockFormData.contact_no
//     );
//     await user.type(screen.getByLabelText("Email *"), mockFormData.email);

//     // Select sex (index 0: sex combobox)
//     const comboboxes = screen.getAllByRole("combobox");
//     const sexSelect = comboboxes[0];
//     await user.click(sexSelect);
//     await user.click(screen.getByRole("option", { name: "Male" }));

//     // Select role (index 2: role combobox)
//     const roleSelect = comboboxes[2];
//     await user.click(roleSelect);
//     await user.click(screen.getByRole("option", { name: "Victim" }));

//     const dateField = screen.getByLabelText(/Scam Incident Date/i);
//     await user.click(dateField);
//     await user.clear(dateField);
//     await user.type(dateField, mockFormData.scam_incident_date);
//     await user.keyboard("{Enter}");
//     await user.type(
//       screen.getByLabelText("Incident Description *"),
//       mockFormData.scam_incident_description
//     );

//     // Submit
//     const submitButton = screen.getByRole("button", { name: /Submit Report/i });
//     await user.click(submitButton);

//     // Check snackbar error
//     await waitFor(() => {
//       expect(publicReportsLib.submitPublicReport).toHaveBeenCalledTimes(1);
//       expect(screen.getByText("Submission failed")).toBeInTheDocument();
//     });
//   });

//   it("opens AI chat after warning, sends message, applies suggestions, and shows snackbar", async () => {
//     renderWithProviders(<ReportScam />);

//     // Click AI button
//     const aiButton = screen.getByRole("button", {
//       name: /Ask AI Assistant Now/i,
//     });
//     await user.click(aiButton);

//     // Check and proceed through warning dialog
//     await waitFor(() => {
//       expect(screen.getByText("AI Assistant Warning")).toBeInTheDocument();
//     });
//     const proceedButton = screen.getByRole("button", { name: "Proceed" });
//     await user.click(proceedButton);

//     // Check chat opens with initial message
//     await waitFor(() => {
//       expect(screen.getByText("AI Assistant Chat")).toBeInTheDocument();
//       expect(
//         screen.getByText(/Hello, I’m here to assist you/i)
//       ).toBeInTheDocument();
//     });

//     // Type and send message
//     const chatInput = screen.getByPlaceholderText("Type a message...");
//     await user.type(chatInput, "Test query");
//     const sendButton = screen.getByRole("button", { name: /Send/i });
//     await user.click(sendButton);

//     // Check API called, response appears, and suggestions applied (check form field and snackbar)
//     await waitFor(() => {
//       expect(publicReportsLib.sendChatMessage).toHaveBeenCalledWith(
//         expect.stringContaining("Test query"),
//         null
//       );
//       expect(screen.getByText("Test query")).toBeInTheDocument(); // User message
//       expect(screen.getByText("AI response")).toBeInTheDocument(); // AI response
//       const comboboxes = screen.getAllByRole("combobox");
//       const scamTypeSelect = comboboxes[3]; // index 3: scam_type combobox
//       expect(scamTypeSelect).toHaveTextContent("Phishing Scam"); // Auto-filled display text
//       expect(
//         screen.getByText("AI suggestions applied automatically!")
//       ).toBeInTheDocument(); // Snackbar
//     });
//   });

//   it("triggers exit confirmation and navigates away", async () => {
//     renderWithProviders(<ReportScam />);

//     // Click exit button
//     const exitButton = screen.getByRole("button", { name: "Exit" });
//     await user.click(exitButton);

//     // Check confirmation dialog
//     await waitFor(() => {
//       expect(screen.getByText("Confirm Exit")).toBeInTheDocument();
//     });

//     // Confirm yes
//     const yesButton = screen.getByRole("button", { name: "Yes" });
//     await user.click(yesButton);

//     // Check navigation
//     expect(mockPush).toHaveBeenCalledWith("/");
//   });
// });


import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReportScam from "@/app/(landing)/report-scam/page";
import * as publicReportsLib from "@/lib/public_reports";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import "@testing-library/jest-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

jest.mock("@/lib/public_reports");
jest.mock("jspdf");

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.setTimeout(30000); // Global timeout for slow tests

// Mock scrollIntoView to avoid JSDOM errors
beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

// Custom render wrapper with MUI providers (needed for theme and date picker)
const theme = createTheme();
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {ui}
      </LocalizationProvider>
    </ThemeProvider>
  );
};

// Mock router
const mockPush = jest.fn();
beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });
});

// Mock jsPDF instance
const mockJsPDF = {
  setFontSize: jest.fn(),
  setFont: jest.fn(),
  setTextColor: jest.fn(),
  setLineWidth: jest.fn(),
  text: jest.fn(),
  line: jest.fn(),
  addPage: jest.fn(),
  save: jest.fn(),
  splitTextToSize: jest.fn().mockImplementation((text) => [text]),
};
(jsPDF as jest.Mock).mockImplementation(() => mockJsPDF);

// Sample mock data (minimal required fields for submission)
const mockFormData = {
  first_name: "John",
  last_name: "Doe",
  contact_no: "+123456789",
  email: "john@example.com",
  sex: "Male",
  role: "victim",
  scam_incident_date: "01/01/2023",
  scam_incident_description: "Test description",
};

// Setup userEvent
const user = userEvent.setup();

describe("ReportScam Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (publicReportsLib.submitPublicReport as jest.Mock).mockResolvedValue({
      report_id: 123,
    });
    (publicReportsLib.sendChatMessage as jest.Mock).mockResolvedValue({
      response: "AI response",
      conversation_id: 1,
      structured_data: { scam_type: "PHISHING" },
    });
    mockPush.mockClear();
  });

  it("renders without crashing and displays key form elements", async () => {
    renderWithProviders(<ReportScam />);
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Report a Scam/i })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText("Email *")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Incident Description *")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Ask AI Assistant Now/i })
      ).toBeInTheDocument();
    });
  });

  it("renders the testing guidance alert with examples", async () => {
    renderWithProviders(<ReportScam />);
    await waitFor(() => {
      expect(
        screen.getByText(
          /Testing Guidance for Examiners: Recommended Test Examples/i
        )
      ).toBeInTheDocument();
      expect(screen.getByText(/Ecommerce Scam/i)).toBeInTheDocument();
      expect(screen.getByText(/Phishing Scam/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Government Officials Impersonation Scam/i)
      ).toBeInTheDocument();
    });
  });

  it("validates required fields on submit and shows errors", async () => {
    renderWithProviders(<ReportScam />);

    // Submit empty form
    const submitButton = screen.getByRole("button", { name: /Submit Report/i });
    await user.click(submitButton);

    // Check for error messages (from Yup via MUI helper text)
    await waitFor(() => {
      expect(screen.getByText("First name is required")).toBeInTheDocument();
      expect(screen.getByText("Last name is required")).toBeInTheDocument();
      expect(
        screen.getByText("Contact number is required")
      ).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Sex is required")).toBeInTheDocument();
      expect(screen.getByText("Incident date is required")).toBeInTheDocument();
      expect(screen.getByText("Description is required")).toBeInTheDocument();
    });
  });

  it("handles successful form submission, shows confirmation dialog, and downloads PDF", async () => {
    renderWithProviders(<ReportScam />);

    // Fill minimal required fields
    await user.type(
      screen.getByLabelText(/First Name/i),
      mockFormData.first_name
    );
    await user.type(
      screen.getByLabelText(/Last Name/i),
      mockFormData.last_name
    );
    await user.type(
      screen.getByLabelText("Contact Number (e.g., 12345678 or +6512345678) *"),
      mockFormData.contact_no
    );
    await user.type(screen.getByLabelText("Email *"), mockFormData.email);

    // Select sex (index 0: sex combobox)
    const comboboxes = screen.getAllByRole("combobox");
    const sexSelect = comboboxes[0];
    await user.click(sexSelect);
    await user.click(screen.getByRole("option", { name: "Male" }));

    // Select role (index 2: role combobox)
    const roleSelect = comboboxes[2];
    await user.click(roleSelect);
    await user.click(screen.getByRole("option", { name: "Victim" }));

    // Date picker
    const dateField = screen.getByLabelText("Scam Incident Date *");
    await user.click(dateField);
    await user.keyboard("{selectall}{backspace}");
    await user.type(dateField, mockFormData.scam_incident_date);
    await user.keyboard("{Enter}"); // Confirm date

    // Description
    await user.type(
      screen.getByLabelText("Incident Description *"),
      mockFormData.scam_incident_description
    );

    // Submit
    const submitButton = screen.getByRole("button", { name: /Submit Report/i });
    await user.click(submitButton);

    // Check API called and dialog opens
    await waitFor(() => {
      expect(publicReportsLib.submitPublicReport).toHaveBeenCalledWith(
        expect.objectContaining({...mockFormData, scam_incident_date: "2023-01-01"})
      );
      expect(
        screen.getByText("Report Submitted Successfully")
      ).toBeInTheDocument();
      expect(screen.getByText(/Report ID: 123/i)).toBeInTheDocument();
    });

    // Download PDF
    const downloadButton = screen.getByRole("button", {
      name: /Download Confirmation Report/i,
    });
    await user.click(downloadButton);
    expect(mockJsPDF.save).toHaveBeenCalledWith("scam-report-123.pdf");

    // Click OK to navigate
    const okButton = screen.getByRole("button", { name: "OK" });
    await user.click(okButton);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("handles submission error and shows snackbar", async () => {
    (publicReportsLib.submitPublicReport as jest.Mock).mockRejectedValue(
      new Error("Submission failed")
    );

    renderWithProviders(<ReportScam />);

    // Fill minimal required fields (reuse from success test for simplicity)
    await user.type(
      screen.getByLabelText(/First Name/i),
      mockFormData.first_name
    );
    await user.type(
      screen.getByLabelText(/Last Name/i),
      mockFormData.last_name
    );
    await user.type(
      screen.getByLabelText("Contact Number (e.g., 12345678 or +6512345678) *"),
      mockFormData.contact_no
    );
    await user.type(screen.getByLabelText("Email *"), mockFormData.email);

    // Select sex (index 0: sex combobox)
    const comboboxes = screen.getAllByRole("combobox");
    const sexSelect = comboboxes[0];
    await user.click(sexSelect);
    await user.click(screen.getByRole("option", { name: "Male" }));

    // Select role (index 2: role combobox)
    const roleSelect = comboboxes[2];
    await user.click(roleSelect);
    await user.click(screen.getByRole("option", { name: "Victim" }));

    const dateField = screen.getByLabelText("Scam Incident Date *");
    await user.click(dateField);
    await user.keyboard("{selectall}{backspace}");
    await user.type(dateField, mockFormData.scam_incident_date);
    await user.keyboard("{Enter}");
    await user.type(
      screen.getByLabelText("Incident Description *"),
      mockFormData.scam_incident_description
    );

    // Submit
    const submitButton = screen.getByRole("button", { name: /Submit Report/i });
    await user.click(submitButton);

    // Check snackbar error
    await waitFor(() => {
      expect(publicReportsLib.submitPublicReport).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Submission failed")).toBeInTheDocument();
    });
  });

  it("opens AI chat after warning, sends message, applies suggestions, and shows snackbar", async () => {
    renderWithProviders(<ReportScam />);

    // Click AI button
    const aiButton = screen.getByRole("button", {
      name: /Ask AI Assistant Now/i,
    });
    await user.click(aiButton);

    // Check and proceed through warning dialog
    await waitFor(() => {
      expect(screen.getByText("AI Assistant Warning")).toBeInTheDocument();
    });
    const proceedButton = screen.getByRole("button", { name: "Proceed" });
    await user.click(proceedButton);

    // Check chat opens with initial message
    await waitFor(() => {
      expect(screen.getByText("AI Assistant Chat")).toBeInTheDocument();
      expect(
        screen.getByText(/Hello, I’m here to assist you/i)
      ).toBeInTheDocument();
    });

    // Type and send message
    const chatInput = screen.getByPlaceholderText("Type a message...");
    await user.type(chatInput, "Test query");
    const sendButton = screen.getByRole("button", { name: /Send/i });
    await user.click(sendButton);

    // Check API called, response appears, and suggestions applied (check form field and snackbar)
    await waitFor(() => {
      expect(publicReportsLib.sendChatMessage).toHaveBeenCalledWith(
        expect.stringContaining("Test query"),
        null
      );
      expect(screen.getByText("Test query")).toBeInTheDocument(); // User message
      expect(screen.getByText("AI response")).toBeInTheDocument(); // AI response
      const comboboxes = screen.getAllByRole("combobox");
      const scamTypeSelect = comboboxes[3]; // index 3: scam_type combobox
      expect(scamTypeSelect).toHaveTextContent("Phishing Scam"); // Auto-filled display text
      expect(
        screen.getByText("AI suggestions applied automatically!")
      ).toBeInTheDocument(); // Snackbar
    });
  });

  it("triggers exit confirmation and navigates away", async () => {
    renderWithProviders(<ReportScam />);

    // Click exit button
    const exitButton = screen.getByRole("button", { name: "Exit" });
    await user.click(exitButton);

    // Check confirmation dialog
    await waitFor(() => {
      expect(screen.getByText("Confirm Exit")).toBeInTheDocument();
    });

    // Confirm yes
    const yesButton = screen.getByRole("button", { name: "Yes" });
    await user.click(yesButton);

    // Check navigation
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});

