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

jest.setTimeout(30000);

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

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

// mock data
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
        screen.getByRole("button", { name: /Ask Co-Pilot \(AI Assistant\)/i })
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

  it("handles successful form submission, shows confirmation dialog, and downloads PDF", async () => {
    renderWithProviders(<ReportScam />);

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

    const comboboxes = screen.getAllByRole("combobox");
    const sexSelect = comboboxes[0];
    await user.click(sexSelect);
    await user.click(screen.getByRole("option", { name: "Male" }));

    const roleSelect = comboboxes[2];
    await user.click(roleSelect);
    await user.click(screen.getByRole("option", { name: "Victim" }));

    const dateField = screen.getByRole("group", { name: /Scam Incident Date/ });
    await user.click(dateField);
    await user.keyboard("{selectall}{backspace}");
    await user.keyboard(mockFormData.scam_incident_date);
    await user.keyboard("{enter}"); // Confirm date

    await user.type(
      screen.getByLabelText("Incident Description *"),
      mockFormData.scam_incident_description
    );

    const submitButton = screen.getByRole("button", { name: /Submit Report/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(publicReportsLib.submitPublicReport).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: "JOHN",
          last_name: "DOE",
          sex: "MALE",
          contact_no: mockFormData.contact_no,
          email: mockFormData.email,
          role: mockFormData.role,
          scam_incident_date: "2023-01-01",
          scam_incident_description: mockFormData.scam_incident_description,
        })
      );
      expect(
        screen.getByText("Report Submitted Successfully")
      ).toBeInTheDocument();
      expect(screen.getByText(/Report ID: 123/i)).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole("button", {
      name: /Download Confirmation Report/i,
    });
    await user.click(downloadButton);
    expect(mockJsPDF.save).toHaveBeenCalledWith("scam-report-123.pdf");

    const okButton = screen.getByRole("button", { name: "OK" });
    await user.click(okButton);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("handles submission error and shows snackbar", async () => {
    (publicReportsLib.submitPublicReport as jest.Mock).mockRejectedValue(
      new Error("Submission failed")
    );

    renderWithProviders(<ReportScam />);

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

    const comboboxes = screen.getAllByRole("combobox");
    const sexSelect = comboboxes[0];
    await user.click(sexSelect);
    await user.click(screen.getByRole("option", { name: "Male" }));

    const roleSelect = comboboxes[2];
    await user.click(roleSelect);
    await user.click(screen.getByRole("option", { name: "Victim" }));

    const dateField = screen.getByRole("group", { name: /Scam Incident Date/ });
    await user.click(dateField);
    await user.keyboard("{selectall}{backspace}");
    await user.keyboard(mockFormData.scam_incident_date);
    await user.keyboard("{enter}");

    await user.type(
      screen.getByLabelText("Incident Description *"),
      mockFormData.scam_incident_description
    );

    const submitButton = screen.getByRole("button", { name: /Submit Report/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(publicReportsLib.submitPublicReport).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Submission failed")).toBeInTheDocument();
    });
  });

  it("opens AI chat after warning, sends message, applies suggestions, and shows snackbar", async () => {
    renderWithProviders(<ReportScam />);
    const aiButton = screen.getByRole("button", {
      name: /Ask Co-Pilot \(AI Assistant\)/i,
    });
    await user.click(aiButton);

    await waitFor(() => {
      expect(screen.getByText("AI Assistant Warning")).toBeInTheDocument();
    });
    const proceedButton = screen.getByRole("button", { name: "Proceed" });
    await user.click(proceedButton);

    await waitFor(() => {
      expect(screen.getByText("AI Assistant Chat")).toBeInTheDocument();
      expect(
        screen.getByText(/Hello, I’m here to assist you/i)
      ).toBeInTheDocument();
    });

    const chatInput = screen.getByPlaceholderText("Type a message...");
    await user.type(chatInput, "Test query");
    const sendButton = screen.getByRole("button", { name: /Send/i });
    await user.click(sendButton);

    await waitFor(() => {
      expect(publicReportsLib.sendChatMessage).toHaveBeenCalledWith(
        expect.stringContaining("Test query"),
        null
      );
      expect(screen.getByText("Test query")).toBeInTheDocument();
      expect(screen.getByText("AI response")).toBeInTheDocument();
      const comboboxes = screen.getAllByRole("combobox");
      const scamTypeSelect = comboboxes[3];
      expect(scamTypeSelect).toHaveTextContent("Phishing Scam");
      expect(
        screen.getByText("AI suggestions applied automatically!")
      ).toBeInTheDocument(); // Snackbar
    });
  });

  it("triggers exit confirmation and navigates away", async () => {
    renderWithProviders(<ReportScam />);

    const exitButton = screen.getByRole("button", { name: "Exit" });
    await user.click(exitButton);

    await waitFor(() => {
      expect(screen.getByText("Confirm Exit")).toBeInTheDocument();
    });

    const yesButton = screen.getByRole("button", { name: "Yes" });
    await user.click(yesButton);

    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
