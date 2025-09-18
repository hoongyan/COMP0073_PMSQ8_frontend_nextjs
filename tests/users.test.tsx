import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import UserManagement from "@/app/(dashboard)/admin/usermanagement/page";
import * as usersLib from "@/lib/users";

jest.mock("@/lib/users");

// mock data
const mockUsers: usersLib.RowType[] = [
  {
    userId: 1,
    firstName: "JOHN",
    lastName: "DOE",
    sex: "MALE",
    dob: "1990-01-01",
    nationality: "SINGAPOREAN",
    race: "CHINESE",
    contactNo: "12345678",
    email: "john@example.com",
    blk: "123",
    street: "MAIN ST",
    unitNo: "#01-01",
    postCode: "123456",
    registrationDate: "2025-09-01",
    lastLoginDate: "2025-09-10",
    role: "ADMIN",
    status: "ACTIVE",
  },
  {
    userId: 2,
    firstName: "JANE",
    lastName: "SMITH",
    sex: "FEMALE",
    dob: "",
    nationality: "",
    race: "",
    contactNo: "87654321",
    email: "jane@example.com",
    blk: "",
    street: "",
    unitNo: "",
    postCode: "",
    registrationDate: "2025-09-05",
    lastLoginDate: "N/A",
    role: "INVESTIGATION OFFICER",
    status: "PENDING",
  },
];

const user = userEvent.setup();

describe("UserManagement Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (usersLib.fetchUsers as jest.Mock).mockResolvedValue(mockUsers);
    (usersLib.deleteUser as jest.Mock).mockResolvedValue(undefined);
  });

  it("renders without crashing and displays the title and breadcrumbs", async () => {
    await act(async () => {
      render(<UserManagement />);
    });
    expect(
      screen.getByRole("heading", { name: "User Management", level: 3 })
    ).toBeInTheDocument();
  });

  it("fetches and displays users data in the table", async () => {
    await act(async () => {
      render(<UserManagement />);
    });

    await waitFor(() => expect(usersLib.fetchUsers).toHaveBeenCalledTimes(1), {
      timeout: 10000,
    });

    await screen.findByText("JOHN", { timeout: 10000 });
    await screen.findByText("DOE", { timeout: 10000 });

    const table = screen.getByRole("table");

    expect(within(table).getByText("User ID")).toBeInTheDocument();
    expect(within(table).getByText("First Name")).toBeInTheDocument();
    expect(within(table).getByText("Last Name")).toBeInTheDocument();
    expect(within(table).getByText("Sex")).toBeInTheDocument();
    expect(within(table).getByText("DOB")).toBeInTheDocument();
    expect(within(table).getByText("Race")).toBeInTheDocument();
    expect(within(table).getByText("Contact No")).toBeInTheDocument();
    expect(within(table).getByText("Email")).toBeInTheDocument();
    expect(within(table).getByText("Registration Date")).toBeInTheDocument();
    expect(within(table).getByText("Role")).toBeInTheDocument();
    expect(within(table).getByText("Status")).toBeInTheDocument();

    expect(await screen.findByText("MALE")).toBeInTheDocument();
    expect(await screen.findByText("01/01/90")).toBeInTheDocument();
    expect(await screen.findByText("CHINESE")).toBeInTheDocument();
    expect(await screen.findByText("12345678")).toBeInTheDocument();
    expect(await screen.findByText("john@example.com")).toBeInTheDocument();
    expect(await screen.findByText("01/09/25")).toBeInTheDocument();
    expect(await screen.findByText("ADMIN")).toBeInTheDocument();
    expect(await screen.findByText("ACTIVE")).toBeInTheDocument();

    await screen.findByText("JANE", { timeout: 10000 });
    await screen.findByText("SMITH", { timeout: 10000 });
    expect(await screen.findByText("FEMALE")).toBeInTheDocument();
    expect(await screen.findByText("N/A")).toBeInTheDocument();
    expect(await screen.findByText("05/09/25")).toBeInTheDocument();
    expect(
      await screen.findByText("INVESTIGATION OFFICER")
    ).toBeInTheDocument();
    expect(await screen.findByText("PENDING")).toBeInTheDocument();
  }, 30000);

  it("handles empty data and shows empty table", async () => {
    (usersLib.fetchUsers as jest.Mock).mockResolvedValue([]);

    await act(async () => {
      render(<UserManagement />);
    });

    await waitFor(() => expect(usersLib.fetchUsers).toHaveBeenCalledTimes(1), {
      timeout: 10000,
    });

    await waitFor(
      () => expect(screen.queryByText("JOHN")).not.toBeInTheDocument(),
      { timeout: 10000 }
    );

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    expect(rows.length).toBe(2);
  }, 30000);

  it("handles fetch error and shows snackbar", async () => {
    (usersLib.fetchUsers as jest.Mock).mockRejectedValue(
      new Error("Fetch failed")
    );

    await act(async () => {
      render(<UserManagement />);
    });

    const errorAlert = await screen.findByRole("alert", { timeout: 10000 });
    expect(within(errorAlert).getByText("Fetch failed")).toBeInTheDocument();
  }, 30000);

  it("opens edit dialog on edit icon click", async () => {
    await act(async () => {
      render(<UserManagement />);
    });

    await waitFor(() => expect(usersLib.fetchUsers).toHaveBeenCalledTimes(1), {
      timeout: 10000,
    });

    await waitFor(() => expect(screen.getByText("JOHN")).toBeInTheDocument(), {
      timeout: 10000,
    });
    await waitFor(() => expect(screen.getByText("DOE")).toBeInTheDocument(), {
      timeout: 10000,
    });

    const editIcons = screen.getAllByLabelText("edit");
    await act(async () => {
      await user.click(editIcons[0]);
    });

    await waitFor(
      () => expect(screen.getByText("Edit User")).toBeInTheDocument(),
      { timeout: 10000 }
    );
    expect(screen.getByDisplayValue("JOHN")).toBeInTheDocument();
  }, 30000);

  it("triggers delete confirmation for a row and handles success", async () => {
    await act(async () => {
      render(<UserManagement />);
    });

    await waitFor(() => expect(usersLib.fetchUsers).toHaveBeenCalledTimes(1), {
      timeout: 10000,
    });

    await waitFor(() => expect(screen.getByText("JOHN")).toBeInTheDocument(), {
      timeout: 10000,
    });
    await waitFor(() => expect(screen.getByText("DOE")).toBeInTheDocument(), {
      timeout: 10000,
    });

    const deleteIcons = screen.getAllByLabelText("delete");
    await act(async () => {
      await user.click(deleteIcons[0]);
    });

    await screen.findByText("Confirm Deletion", { timeout: 10000 });

    const confirmButton = screen.getByRole("button", { name: "Delete" });
    await act(async () => {
      await user.click(confirmButton);
    });

    await waitFor(() => expect(usersLib.deleteUser).toHaveBeenCalledWith(1), {
      timeout: 10000,
    });

    await waitFor(
      () => expect(screen.getByText("User deleted")).toBeInTheDocument(),
      { timeout: 10000 }
    );
  }, 30000);
});
