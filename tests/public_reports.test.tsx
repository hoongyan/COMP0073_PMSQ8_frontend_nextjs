// import { render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import ReportScam from '@/app/(landing)/report-scam/page'; // Adjust based on your structure; from code, it's likely 'report-scam/page.tsx'
// import * as publicReportsLib from "@/lib/public_reports"; // Mock the lib with submit/send functions
// import { useRouter } from "next/navigation"; // For mocking router
// import jsPDF from "jspdf"; // For mocking PDF
// import dayjs from "dayjs"; // For consistent dates if needed
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// jest.mock("@/lib/public_reports"); // Mock the entire module
// jest.mock("next/navigation", () => ({
//   useRouter: jest.fn(),
// }));
// jest.mock("jspdf"); // Mock PDF library

// // Increase timeout for async tests if needed
// jest.setTimeout(10000);

// // Mock scrollIntoView to prevent jsdom errors
// beforeAll(() => {
//   window.HTMLElement.prototype.scrollIntoView = jest.fn();
// });

// // Custom render with providers to fix rendering issues
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

// // Sample mock data (based on your validation schema and testExamples in page.tsx)
// const mockFormData = {
//   first_name: "John",
//   last_name: "Doe",
//   contact_no: "+12345678",
//   email: "john@example.com",
//   sex: "Male",
//   dob: "1990-01-01",
//   nationality: "Singaporean",
//   race: "Chinese",
//   occupation: "Engineer",
//   blk: "123",
//   street: "Main St",
//   unit_no: "#01-01",
//   postcode: "123456",
//   role: "victim",
//   scam_incident_date: "2025-01-01",
//   scam_type: "PHISHING",
//   scam_approach_platform: "SMS",
//   scam_communication_platform: "WHATSAPP",
//   scam_transaction_type: "BANK TRANSFER",
//   scam_beneficiary_platform: "DBS",
//   scam_beneficiary_identifier: "12345678",
//   scam_contact_no: "+6591234567",
//   scam_email: "scam@example.com",
//   scam_moniker: "Scammer",
//   scam_url_link: "https://scam.com",
//   scam_amount_lost: 1000,
//   scam_incident_description: "I was scammed via phishing link.",
// };

// const mockAiResponse = {
//   response: "Based on your description, I've filled in the form.",
//   conversation_id: 1,
//   structured_data: {
//     scam_type: "PHISHING",
//     scam_amount_lost: "1000",
//     // ... other fields
//   },
// };

// const user = userEvent.setup();

// describe("ReportScam Component", () => {
//   let mockPush: jest.Mock; // For router.push

//   beforeEach(() => {
//     jest.clearAllMocks(); // Reset mocks each test

//     // Mock useRouter
//     mockPush = jest.fn();
//     (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

//     // Mock submitPublicReport to return success
//     (publicReportsLib.submitPublicReport as jest.Mock).mockResolvedValue({
//       report_id: 123,
//       conversation_id: 1,
//     });

//     // Mock sendChatMessage to return AI response
//     (publicReportsLib.sendChatMessage as jest.Mock).mockResolvedValue(mockAiResponse);

//     // Mock jsPDF (fake save method)
//     (jsPDF as jest.Mock).mockImplementation(() => ({
//       setFontSize: jest.fn(),
//       text: jest.fn(),
//       save: jest.fn(),
//       setFont: jest.fn(),
//       setTextColor: jest.fn(),
//       setLineWidth: jest.fn(),
//       line: jest.fn(),
//       addPage: jest.fn(),
//       splitTextToSize: jest.fn().mockImplementation((text, width) => [text]),
//     }));

//     // Optionally mock dayjs for fixed dates (current date is 2025-09-13, so use past dates)
//     jest.spyOn(dayjs.prototype, 'isAfter').mockReturnValue(false); // Avoid future date errors
//   });

//   it("renders without crashing and displays the form title", async () => {
//     renderWithProviders(<ReportScam />);
//     expect(screen.getByRole("heading", { name: /Report a Scam/i })).toBeInTheDocument(); // Matches your Typography
//     expect(await screen.findByRole("textbox", { name: "First Name" })).toBeInTheDocument(); // Use findBy for potential async render
//   });

//   it("displays validation errors for required fields", async () => {
//     renderWithProviders(<ReportScam />);

//     // Submit empty form
//     const submitButton = screen.getByRole("button", { name: /Submit Report/i });
//     await user.click(submitButton);

//     // Wait for errors
//     await waitFor(() => {
//       expect(screen.getByText("First name is required")).toBeInTheDocument();
//       expect(screen.getByText("Last name is required")).toBeInTheDocument();
//       expect(screen.getByText("Contact number is required")).toBeInTheDocument();
//       expect(screen.getByText("Email is required")).toBeInTheDocument();
//       expect(screen.getByText("Sex is required")).toBeInTheDocument();
//       expect(screen.getByText("Incident date is required")).toBeInTheDocument();
//       expect(screen.getByText("Description is required")).toBeInTheDocument();
//     });
//   });

//   it("allows filling and submitting the form successfully", async () => {
//     renderWithProviders(<ReportScam />);

//     // Fill required fields
//     const firstNameInput = await screen.findByRole("textbox", { name: "First Name" });
//     await user.type(firstNameInput, mockFormData.first_name);
//     const lastNameInput = await screen.findByRole("textbox", { name: "Last Name" });
//     await user.type(lastNameInput, mockFormData.last_name);
//     const contactInput = await screen.findByRole("textbox", { name: "Contact Number (e.g., 12345678 or +6512345678)" });
//     await user.type(contactInput, mockFormData.contact_no);
//     const emailInput = await screen.findByRole("textbox", { name: "Email" });
//     await user.type(emailInput, mockFormData.email);

//     // Select sex
//     const sexField = screen.getByLabelText("Sex"); // Changed to getByLabelText for MUI Select
//     await user.click(sexField);
//     await user.click(screen.getByRole("option", { name: "Male" }));

//     // Incident date picker
//     const incidentDateField = screen.getByRole("textbox", { name: "Incident Date" });
//     await user.click(incidentDateField);
//     await user.type(incidentDateField, "01/01/2025"); // Type in MM/DD/YYYY format
//     await user.keyboard("{Enter}"); // Confirm selection

//     // Description
//     const descriptionInput = screen.getByRole("textbox", { name: "Incident Description" });
//     await user.type(descriptionInput, mockFormData.scam_incident_description);

//     // Submit
//     const submitButton = screen.getByRole("button", { name: /Submit Report/i });
//     await user.click(submitButton);

//     // Check API called with data (uppercase applied in onSubmit)
//     await waitFor(() => {
//       expect(publicReportsLib.submitPublicReport).toHaveBeenCalledWith(expect.objectContaining({
//         first_name: mockFormData.first_name.toUpperCase(),
//         last_name: mockFormData.last_name.toUpperCase(),
//         contact_no: mockFormData.contact_no.toUpperCase(), // If uppercased
//         email: mockFormData.email,
//         sex: mockFormData.sex.toUpperCase(),
//         scam_incident_date: mockFormData.scam_incident_date,
//         scam_incident_description: mockFormData.scam_incident_description,
//         // ... others default or null
//       }));
//     });

//     // Check confirmation dialog opens
//     expect(screen.getByText("Report Submitted Successfully")).toBeInTheDocument();
//     expect(screen.getByText(/Report ID: 123/i)).toBeInTheDocument();

//     // Click OK and check navigation
//     const okButton = screen.getByRole("button", { name: "OK" });
//     await user.click(okButton);
//     expect(mockPush).toHaveBeenCalledWith('/home');
//   });

//   it("opens and interacts with AI chat drawer", async () => {
//     renderWithProviders(<ReportScam />);

//     // Open AI drawer
//     const aiButton = screen.getByRole("button", { name: /Ask AI Assistant Now/i });
//     await user.click(aiButton);

//     // Check warning dialog first (since hasWarned is false)
//     await waitFor(() => {
//       expect(screen.getByText("AI Assistant Warning")).toBeInTheDocument();
//     });
//     const proceedButton = screen.getByRole("button", { name: "Proceed" });
//     await user.click(proceedButton);

//     // Now drawer opens
//     await waitFor(() => {
//       expect(screen.getByText("AI Assistant Chat")).toBeInTheDocument();
//       expect(screen.getByText(/Hello, I’m here to assist you/i)).toBeInTheDocument(); // Initial AI message
//     });

//     // Type and send message
//     const aiInput = screen.getByPlaceholderText("Type a message...");
//     await user.type(aiInput, "I was scammed via phishing.");
//     const sendButton = screen.getByRole("button", { name: /Send/i });
//     await user.click(sendButton);

//     // Check API called and response added
//     await waitFor(() => {
//       expect(publicReportsLib.sendChatMessage).toHaveBeenCalledWith("I was scammed via phishing.", null); // Initial conversation_id null
//       expect(screen.getByText("I was scammed via phishing.")).toBeInTheDocument(); // User message
//       expect(screen.getByText(mockAiResponse.response)).toBeInTheDocument(); // AI response
//     });

//     // Check form auto-filled (from structured_data)
//     await waitFor(() => {
//       const scamTypeField = screen.getByLabelText("Scam Type"); // Changed to getByLabelText
//       expect(scamTypeField).toHaveTextContent("PHISHING"); // Changed to toHaveTextContent for MUI Select
//     });
//   });

//   it("handles exit confirmation dialog", async () => {
//     renderWithProviders(<ReportScam />);

//     const exitButton = screen.getByRole("button", { name: "Exit" });
//     await user.click(exitButton);

//     expect(screen.getByText("Confirm Exit")).toBeInTheDocument();

//     const yesButton = screen.getByRole("button", { name: "Yes" });
//     await user.click(yesButton);

//     expect(mockPush).toHaveBeenCalledWith('/home'); // From your handleExit
//   });

//   it("displays error snackbar on submission failure", async () => {
//     // Mock failure
//     (publicReportsLib.submitPublicReport as jest.Mock).mockRejectedValue(new Error("Submission failed"));

//     renderWithProviders(<ReportScam />);

//     // Fill required fields (full fill to pass validation)
//     const firstNameInput = await screen.findByRole("textbox", { name: "First Name" });
//     await user.type(firstNameInput, mockFormData.first_name);
//     const lastNameInput = await screen.findByRole("textbox", { name: "Last Name" });
//     await user.type(lastNameInput, mockFormData.last_name);
//     const contactInput = await screen.findByRole("textbox", { name: "Contact Number (e.g., 12345678 or +6512345678)" });
//     await user.type(contactInput, mockFormData.contact_no);
//     const emailInput = await screen.findByRole("textbox", { name: "Email" });
//     await user.type(emailInput, mockFormData.email);

//     // Select sex
//     const sexField = screen.getByLabelText("Sex"); // Changed to getByLabelText
//     await user.click(sexField);
//     await user.click(screen.getByRole("option", { name: "Male" }));

//     // Incident date picker
//     const incidentDateField = screen.getByRole("textbox", { name: "Incident Date" });
//     await user.click(incidentDateField);
//     await user.type(incidentDateField, "01/01/2025"); // Type in MM/DD/YYYY format
//     await user.keyboard("{Enter}");

//     // Description
//     const descriptionInput = screen.getByRole("textbox", { name: "Incident Description" });
//     await user.type(descriptionInput, mockFormData.scam_incident_description);

//     // Submit
//     const submitButton = screen.getByRole("button", { name: /Submit Report/i });
//     await user.click(submitButton);

//     await waitFor(() => {
//       expect(screen.getByText("Submission failed")).toBeInTheDocument(); // Snackbar message from mock error
//     });
//   });

//   it("downloads PDF confirmation", async () => {
//     renderWithProviders(<ReportScam />);

//     // Fill required fields (full fill to trigger submission)
//     const firstNameInput = await screen.findByRole("textbox", { name: "First Name" });
//     await user.type(firstNameInput, mockFormData.first_name);
//     const lastNameInput = await screen.findByRole("textbox", { name: "Last Name" });
//     await user.type(lastNameInput, mockFormData.last_name);
//     const contactInput = await screen.findByRole("textbox", { name: "Contact Number (e.g., 12345678 or +6512345678)" });
//     await user.type(contactInput, mockFormData.contact_no);
//     const emailInput = await screen.findByRole("textbox", { name: "Email" });
//     await user.type(emailInput, mockFormData.email);

//     // Select sex
//     const sexField = screen.getByLabelText("Sex"); // Changed to getByLabelText
//     await user.click(sexField);
//     await user.click(screen.getByRole("option", { name: "Male" }));

//     // Incident date picker
//     const incidentDateField = screen.getByRole("textbox", { name: "Incident Date" });
//     await user.click(incidentDateField);
//     await user.type(incidentDateField, "01/01/2025"); // Type in MM/DD/YYYY format
//     await user.keyboard("{Enter}");

//     // Description
//     const descriptionInput = screen.getByRole("textbox", { name: "Incident Description" });
//     await user.type(descriptionInput, mockFormData.scam_incident_description);

//     // Submit to open confirmation
//     const submitButton = screen.getByRole("button", { name: /Submit Report/i });
//     await user.click(submitButton);

//     await waitFor(() => {
//       expect(screen.getByText("Report Submitted Successfully")).toBeInTheDocument();
//     });

//     // Click download
//     const downloadButton = screen.getByRole("button", { name: "Download Confirmation Report" });
//     await user.click(downloadButton);

//     // Check jsPDF called
//     expect(jsPDF).toHaveBeenCalled();
//     const pdfInstance = (jsPDF as jest.Mock).mock.results[0].value;
//     expect(pdfInstance.save).toHaveBeenCalledWith(expect.stringContaining("scam-report-"));
//   });
// });
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReportScam from '@/app/(landing)/report-scam/page'; // Adjust if needed
import * as publicReportsLib from "@/lib/public_reports"; // Mock the lib
import { useRouter } from "next/navigation"; // For mocking router
import jsPDF from "jspdf"; // For mocking PDF
import dayjs from "dayjs"; // For dates
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

jest.mock("@/lib/public_reports"); // Mock the module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("jspdf"); // Mock PDF

// Increase timeout
jest.setTimeout(10000);

// Mock scrollIntoView
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

// Custom render with providers
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

// Sample mock data (minimal for required fields; expand as needed)
const mockFormData = {
  first_name: "John",
  last_name: "Doe",
  contact_no: "+12345678",
  email: "john@example.com",
  sex: "Male",
  scam_incident_date: "2025-01-01",
  scam_incident_description: "I was scammed.",
};

const mockAiResponse = {
  response: "Based on your description, I've filled in the form.",
  conversation_id: 1,
  structured_data: {
    scam_type: "PHISHING",
    scam_amount_lost: 1000,
    // Add more to test auto-fill
  },
};

const user = userEvent.setup();

describe("ReportScam Component", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (publicReportsLib.submitPublicReport as jest.Mock).mockResolvedValue({
      report_id: 123,
      conversation_id: 1,
    });

    (publicReportsLib.sendChatMessage as jest.Mock).mockResolvedValue(mockAiResponse);

    (jsPDF as jest.Mock).mockImplementation(() => ({
      setFontSize: jest.fn(),
      setFont: jest.fn(),
      setTextColor: jest.fn(),
      setLineWidth: jest.fn(),
      line: jest.fn(),
      addPage: jest.fn(),
      text: jest.fn(),
      save: jest.fn(),
      splitTextToSize: jest.fn().mockImplementation((text) => [text]),
    }));

    jest.spyOn(dayjs.prototype, 'isAfter').mockReturnValue(false);
  });

  it("renders without crashing and displays the form title", async () => {
    renderWithProviders(<ReportScam />);
    expect(screen.getByRole("heading", { name: /Report a Scam/i })).toBeInTheDocument();
    expect(await screen.findByLabelText(/First Name/i)).toBeInTheDocument(); // Use label for reliability
  });

  it("displays validation errors for required fields", async () => {
    renderWithProviders(<ReportScam />);

    const submitButton = screen.getByRole("button", { name: /Submit Report/i });
    await user.click(submitButton);

    // Use findByText to wait for each error
    expect(await screen.findByText(/First name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Contact number is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Sex is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Incident date is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Description is required/i)).toBeInTheDocument();
  });

  it("allows filling and submitting the form successfully", async () => {
    renderWithProviders(<ReportScam />);

    await user.type(screen.getByLabelText(/First Name/i), mockFormData.first_name);
    await user.type(screen.getByLabelText(/Last Name/i), mockFormData.last_name);
    await user.type(screen.getByLabelText('Contact Number (e.g., 12345678 or +6512345678)'), mockFormData.contact_no);
    await user.type(screen.getByLabelText(/Email/i), mockFormData.email);

    // Select sex
    const sexCombobox = screen.getByRole('combobox', { name: /Sex/i });
    await user.click(sexCombobox);
    await user.click(screen.getByRole("option", { name: /Male/i }));

    // Incident date
    const dateField = screen.getByLabelText(/Scam Incident Date/i);
    await user.click(dateField);
    await user.clear(dateField);
    await user.type(dateField, "2025-01-01");
    await user.keyboard("{Enter}");

    await user.type(screen.getByLabelText(/Incident Description/i), mockFormData.scam_incident_description);

    const submitButton = screen.getByRole("button", { name: /Submit Report/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(publicReportsLib.submitPublicReport).toHaveBeenCalledWith(expect.objectContaining({
        first_name: mockFormData.first_name.toUpperCase(),
        last_name: mockFormData.last_name.toUpperCase(),
        contact_no: mockFormData.contact_no,
        email: mockFormData.email,
        sex: mockFormData.sex.toUpperCase(),
        scam_incident_date: "2025-01-01",
        scam_incident_description: mockFormData.scam_incident_description,
      }));
    });

    expect(screen.getByText(/Report Submitted Successfully/i)).toBeInTheDocument();
    expect(screen.getByText(/Report ID: 123/i)).toBeInTheDocument();

    const okButton = screen.getByRole("button", { name: "OK" });
    await user.click(okButton);
    expect(mockPush).toHaveBeenCalledWith('/home');
  });

  it("opens and interacts with AI chat drawer", async () => {
    renderWithProviders(<ReportScam />);

    const aiButton = screen.getByRole("button", { name: /Ask AI Assistant Now/i });
    await user.click(aiButton);

    await waitFor(() => {
      expect(screen.getByText(/AI Assistant Warning/i)).toBeInTheDocument();
    });
    const proceedButton = screen.getByRole("button", { name: "Proceed" });
    await user.click(proceedButton);

    await waitFor(() => {
      expect(screen.getByText(/AI Assistant Chat/i)).toBeInTheDocument();
      expect(screen.getByText(/Hello, I’m here to assist you/i)).toBeInTheDocument();
    });

    const aiInput = screen.getByPlaceholderText(/Type a message/i);
    await user.type(aiInput, "I was scammed via phishing.");
    const sendButton = screen.getByRole("button", { name: /Send/i });
    await user.click(sendButton);

    await waitFor(() => {
      expect(publicReportsLib.sendChatMessage).toHaveBeenCalledWith(expect.stringContaining("I was scammed via phishing."), null);
      expect(screen.getByText(/I was scammed via phishing./i)).toBeInTheDocument();
      expect(screen.getByText(mockAiResponse.response)).toBeInTheDocument();
    });

    // Check form auto-filled (use value for select)
    await waitFor(() => {
      const scamTypeCombobox = screen.getByRole('combobox', { name: /Scam Type/i });
      expect(scamTypeCombobox).toHaveValue('PHISHING');
    });
  });

  it("handles exit confirmation dialog", async () => {
    renderWithProviders(<ReportScam />);

    const exitButton = screen.getByRole("button", { name: "Exit" });
    await user.click(exitButton);

    expect(screen.getByText(/Confirm Exit/i)).toBeInTheDocument();

    const yesButton = screen.getByRole("button", { name: "Yes" });
    await user.click(yesButton);

    expect(mockPush).toHaveBeenCalledWith('/home');
  });

  it("displays error snackbar on submission failure", async () => {
    (publicReportsLib.submitPublicReport as jest.Mock).mockRejectedValue(new Error("Submission failed"));

    renderWithProviders(<ReportScam />);

    await user.type(screen.getByLabelText(/First Name/i), mockFormData.first_name);
    await user.type(screen.getByLabelText(/Last Name/i), mockFormData.last_name);
    await user.type(screen.getByLabelText('Contact Number (e.g., 12345678 or +6512345678)'), mockFormData.contact_no);
    await user.type(screen.getByLabelText(/Email/i), mockFormData.email);

    const sexCombobox = screen.getByRole('combobox', { name: /Sex/i });
    await user.click(sexCombobox);
    await user.click(screen.getByRole("option", { name: /Male/i }));

    const dateField = screen.getByLabelText(/Scam Incident Date/i);
    await user.click(dateField);
    await user.clear(dateField);
    await user.type(dateField, "2025-01-01");
    await user.keyboard("{Enter}");

    await user.type(screen.getByLabelText(/Incident Description/i), mockFormData.scam_incident_description);

    const submitButton = screen.getByRole("button", { name: /Submit Report/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Submission failed/i)).toBeInTheDocument();
    });
  });

  it("downloads PDF confirmation", async () => {
    renderWithProviders(<ReportScam />);

    await user.type(screen.getByLabelText(/First Name/i), mockFormData.first_name);
    await user.type(screen.getByLabelText(/Last Name/i), mockFormData.last_name);
    await user.type(screen.getByLabelText('Contact Number (e.g., 12345678 or +6512345678)'), mockFormData.contact_no);
    await user.type(screen.getByLabelText(/Email/i), mockFormData.email);

    const sexCombobox = screen.getByRole('combobox', { name: /Sex/i });
    await user.click(sexCombobox);
    await user.click(screen.getByRole("option", { name: /Male/i }));

    const dateField = screen.getByLabelText(/Scam Incident Date/i);
    await user.click(dateField);
    await user.clear(dateField);
    await user.type(dateField, "2025-01-01");
    await user.keyboard("{Enter}");

    await user.type(screen.getByLabelText(/Incident Description/i), mockFormData.scam_incident_description);

    const submitButton = screen.getByRole("button", { name: /Submit Report/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Report Submitted Successfully/i)).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole("button", { name: /Download Confirmation Report/i });
    await user.click(downloadButton);

    expect(jsPDF).toHaveBeenCalled();
    const pdfInstance = (jsPDF as jest.Mock).mock.results[0].value;
    expect(pdfInstance.save).toHaveBeenCalledWith(expect.stringContaining("scam-report-"));
  });
});