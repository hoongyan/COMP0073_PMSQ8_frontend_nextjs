import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import ConversationsPage from "@/app/(dashboard)/admin/conversations/page"; 
import * as conversationsLib from "@/lib/conversations";


jest.mock("@/lib/conversations");

// Sample mock data
const mockConversations: conversationsLib.RowType[] = [
  {
    conversationId: "1",
    reportId: "report-123",
    creationDate: "12/09/25 14:30",
    messages: [
      {
        messageId: "msg1",
        conversationId: "1",
        senderRole: "HUMAN",
        content: "Hello, this is a test message.",
        sentDate: "12/09/25 14:31",
      },
      {
        messageId: "msg2",
        conversationId: "1",
        senderRole: "AI",
        content: "Response from AI.",
        sentDate: "12/09/25 14:32",
      },
    ],
    summary: "Hello, this is a test message...",
  },
  {
    conversationId: "2",
    reportId: null,
    creationDate: "11/09/25 10:00",
    messages: [],
    summary: "No messages",
  },
];

const user = userEvent.setup();

describe("ConversationsPage Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (conversationsLib.fetchConversations as jest.Mock).mockResolvedValue(
      mockConversations
    );
    (conversationsLib.deleteConversation as jest.Mock).mockResolvedValue(
      undefined
    );
    (conversationsLib.bulkDeleteConversations as jest.Mock).mockResolvedValue(
      undefined
    );
  });

  it("renders without crashing and displays the title", async () => {
    await act(async () => {
      render(<ConversationsPage />);
    });
    expect(
      screen.getByRole("heading", { name: "Conversations", level: 3 })
    ).toBeInTheDocument();
  });

  it("fetches and displays conversations data in the table", async () => {
    await act(async () => {
      render(<ConversationsPage />);
      await Promise.resolve();
    });

    await waitFor(
      () =>
        expect(conversationsLib.fetchConversations).toHaveBeenCalledTimes(1),
      { timeout: 5000 }
    );

    expect(screen.getByText("Conversation ID")).toBeInTheDocument();
    expect(screen.getByText("Report ID")).toBeInTheDocument();
    expect(screen.getByText("Creation Date")).toBeInTheDocument();
    expect(screen.getByText("Summary")).toBeInTheDocument();

    expect(
      screen.getByText(mockConversations[0].conversationId)
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockConversations[0].reportId!)
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockConversations[0].creationDate)
    ).toBeInTheDocument();
    expect(screen.getByText(mockConversations[0].summary)).toBeInTheDocument();

    expect(
      screen.getByText(mockConversations[1].conversationId)
    ).toBeInTheDocument();
    expect(screen.getByText("N/A")).toBeInTheDocument(); // For null reportId
    expect(
      screen.getByText(mockConversations[1].creationDate)
    ).toBeInTheDocument();
    expect(screen.getByText(mockConversations[1].summary)).toBeInTheDocument();
  });

  it("handles empty data", async () => {
    (conversationsLib.fetchConversations as jest.Mock).mockResolvedValue([]);

    await act(async () => {
      render(<ConversationsPage />);
      await Promise.resolve();
    });

    await waitFor(
      () =>
        expect(conversationsLib.fetchConversations).toHaveBeenCalledTimes(1),
      { timeout: 5000 }
    );

    expect(screen.getByText("No conversations found.")).toBeInTheDocument();
  });

  it("opens conversation history dialog on row click", async () => {
    await act(async () => {
      render(<ConversationsPage />);
      await Promise.resolve();
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(mockConversations[0].conversationId)
        ).toBeInTheDocument(),
      { timeout: 10000 }
    );

    // Click on a specific cell to avoid interceptors
    const idCell = screen.getByText(mockConversations[0].conversationId);
    await act(async () => {
      await user.click(idCell);
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(
            `Conversation ${mockConversations[0].conversationId}`
          )
        ).toBeInTheDocument(),
      { timeout: 10000 }
    );

    // Check if messages are displayed in the dialog
    expect(
      screen.getByText("Hello, this is a test message.")
    ).toBeInTheDocument();
    expect(screen.getByText("Response from AI.")).toBeInTheDocument();
  }, 20000);

  it("triggers delete confirmation for a row and handles success", async () => {
    await act(async () => {
      render(<ConversationsPage />);
      await Promise.resolve();
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(mockConversations[0].conversationId)
        ).toBeInTheDocument(),
      { timeout: 10000 }
    );

    const deleteIcons = screen.getAllByLabelText("delete");
    await act(async () => {
      await user.click(deleteIcons[0]);
    });

    await waitFor(
      () => expect(screen.getByText("Confirm Deletion")).toBeInTheDocument(),
      { timeout: 10000 }
    );

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    await act(async () => {
      await user.click(confirmButton);
    });

    await waitFor(
      () =>
        expect(conversationsLib.deleteConversation).toHaveBeenCalledWith(
          mockConversations[0].conversationId
        ),
      { timeout: 10000 }
    );

    // Check for success snackbar
    await waitFor(
      () =>
        expect(
          screen.getByText("Conversation deleted successfully.")
        ).toBeInTheDocument(),
      { timeout: 10000 }
    );
  }, 20000);
});
