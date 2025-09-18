import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScamReportList, { RowType } from "@/app/(dashboard)/reports/page";
import * as reportsLib from "@/lib/reports";
import { format, parseISO } from "date-fns";

jest.mock("@/lib/reports");

jest.setTimeout(10000);

// mock data
const mockReports: RowType[] = [
  {
    report_id: 1,
    scam_incident_date: "2023-01-01",
    scam_report_date: "2023-01-02",
    scam_type: "PHISHING",
    scam_approach_platform: "EMAIL",
    scam_communication_platform: "PHONE",
    scam_transaction_type: "BANK_TRANSFER",
    scam_beneficiary_platform: "PAYPAL",
    scam_beneficiary_identifier: "scammer@paypal.com",
    scam_contact_no: "1234567890",
    scam_email: "scam@example.com",
    scam_moniker: "ScamKing",
    scam_url_link: "http://scam.com",
    scam_amount_lost: "1000",
    scam_incident_description:
      "This is a long description that should be truncated in the table.",
    status: "Assigned",
    io_in_charge: 1,
    assigned_IO: "Officer John",
    linked_persons: [],
  },
  {
    report_id: 2,
    scam_incident_date: "2023-02-01",
    scam_report_date: "2023-02-02",
    scam_type: "INVESTMENT",
    scam_approach_platform: "SOCIAL_MEDIA",
    scam_communication_platform: "WHATSAPP",
    scam_transaction_type: "CRYPTO",
    scam_beneficiary_platform: "BINANCE",
    scam_beneficiary_identifier: "scammer@binance.com",
    scam_contact_no: "0987654321",
    scam_email: "fraud@example.com",
    scam_moniker: "FraudQueen",
    scam_url_link: "http://fraud.com",
    scam_amount_lost: "5000",
    scam_incident_description: "Short desc.",
    status: "Unassigned",
    io_in_charge: null,
    assigned_IO: "",
    linked_persons: [],
  },
];

const user = userEvent.setup();

describe("ScamReportList Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (reportsLib.fetchScamReports as jest.Mock).mockResolvedValue(mockReports);
    (reportsLib.fetchIOs as jest.Mock).mockResolvedValue([]);
    (reportsLib.createScamReport as jest.Mock).mockResolvedValue({
      ...mockReports[0],
      report_id: 3,
    });
    (reportsLib.updateScamReport as jest.Mock).mockResolvedValue(
      mockReports[0]
    );
    (reportsLib.deleteScamReport as jest.Mock).mockResolvedValue(undefined);
    (reportsLib.fetchLinkedPersons as jest.Mock).mockResolvedValue([]);
  });

  it("renders without crashing and displays the title", () => {
    render(<ScamReportList />);
    expect(
      screen.getByRole("heading", { name: "Scam Reports", level: 3 })
    ).toBeInTheDocument();
  });

  it("fetches and displays reports data in the table", async () => {
    render(<ScamReportList />);

    await waitFor(
      () => {
        expect(reportsLib.fetchScamReports).toHaveBeenCalledTimes(1);
        expect(screen.getByText("Report No")).toBeInTheDocument();
        expect(screen.getByText("Incident Date")).toBeInTheDocument();
        expect(screen.getByText("Report Date")).toBeInTheDocument();
        expect(screen.getByText("Scam Type")).toBeInTheDocument();

        const formattedIncident1 = format(
          parseISO(mockReports[0].scam_incident_date),
          "dd/MM/yy"
        );
        const formattedReport1 = format(
          parseISO(mockReports[0].scam_report_date),
          "dd/MM/yy"
        );
        const formattedIncident2 = format(
          parseISO(mockReports[1].scam_incident_date),
          "dd/MM/yy"
        );
        const formattedReport2 = format(
          parseISO(mockReports[1].scam_report_date),
          "dd/MM/yy"
        );

        expect(
          screen.getByText(mockReports[0].report_id.toString())
        ).toBeInTheDocument();
        expect(screen.getByText(formattedIncident1)).toBeInTheDocument();
        expect(screen.getByText(formattedReport1)).toBeInTheDocument();
        expect(screen.getByText(mockReports[0].scam_type)).toBeInTheDocument();
        expect(
          screen.getByText(
            mockReports[0].scam_incident_description.substring(0, 50) + "..."
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(mockReports[1].report_id.toString())
        ).toBeInTheDocument();
        expect(screen.getByText(formattedIncident2)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it("handles empty data", async () => {
    (reportsLib.fetchScamReports as jest.Mock).mockResolvedValue([]); // Mock empty response

    render(<ScamReportList />);

    await waitFor(
      () => {
        expect(reportsLib.fetchScamReports).toHaveBeenCalledTimes(1);
        expect(screen.getByText("Report No")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(
      screen.queryByText(mockReports[0].scam_type)
    ).not.toBeInTheDocument();
  });

  it("opens edit dialog for a selected row", async () => {
    render(<ScamReportList />);

    await waitFor(
      () => {
        expect(screen.getByText(mockReports[0].scam_type)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    const editIcons = screen.getAllByLabelText("edit");
    await user.click(editIcons[0]);

    await waitFor(
      () => {
        expect(
          screen.getByRole("heading", { name: /Edit Report/i })
        ).toBeInTheDocument(); // Adjusted to match actual title
      },
      { timeout: 5000 }
    );
  });

  it("triggers delete confirmation for a row", async () => {
    render(<ScamReportList />);

    await waitFor(
      () => {
        expect(screen.getByText(mockReports[0].scam_type)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    const deleteIcons = screen.getAllByLabelText("delete");
    await user.click(deleteIcons[0]);

    await waitFor(
      () => {
        expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    await user.click(confirmButton);

    await waitFor(
      () => {
        expect(reportsLib.deleteScamReport).toHaveBeenCalledWith(
          mockReports[0].report_id
        );
      },
      { timeout: 5000 }
    );

    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
