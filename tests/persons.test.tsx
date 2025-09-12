import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import PersonsOfInterest, {
  RowType,
  LinkedReport,
} from "@/app/(dashboard)/persons_info/page";
import * as personsLib from "@/lib/persons";
import { format, parseISO } from "date-fns";

jest.mock("@/lib/persons");

// Sample mock data
const mockPersons: RowType[] = [
  {
    person_id: "1",
    first_name: "John",
    last_name: "Doe",
    sex: "MALE",
    dob: "1990-01-01",
    nationality: "USA",
    race: "Caucasian",
    occupation: "Engineer",
    contact_no: "1234567890",
    email: "john@example.com",
    blk: "123",
    street: "Main St",
    unit_no: "Apt 4",
    postcode: "12345",
  },
  {
    person_id: "2",
    first_name: "Jane",
    last_name: "Smith",
    sex: "FEMALE",
    dob: "1985-05-15",
    nationality: "Canada",
    race: "Asian",
    occupation: "Doctor",
    contact_no: "0987654321",
    email: "jane@example.com",
    blk: "456",
    street: "Elm St",
    unit_no: "Unit 5",
    postcode: "54321",
  },
];

const mockLinkedReports: LinkedReport[] = [];

// Setup userEvent
const user = userEvent.setup();

describe("PersonsOfInterest Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (personsLib.fetchPersons as jest.Mock).mockResolvedValue(mockPersons);
    (personsLib.createPerson as jest.Mock).mockResolvedValue({
      ...mockPersons[0],
      person_id: "3",
    });
    (personsLib.updatePerson as jest.Mock).mockResolvedValue(mockPersons[0]);
    (personsLib.deletePerson as jest.Mock).mockResolvedValue(undefined);
    (personsLib.fetchLinkedReports as jest.Mock).mockResolvedValue(
      mockLinkedReports
    );
  });

  it("renders without crashing and displays the title", async () => {
    await act(async () => {
      render(<PersonsOfInterest />);
    });
    expect(
      screen.getByRole("heading", { name: "Persons of Interest", level: 3 })
    ).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("fetches and displays persons data in the table", async () => {
    await act(async () => {
      render(<PersonsOfInterest />);
      await Promise.resolve(); // Flush initial effects
    });

    await waitFor(
      () => expect(personsLib.fetchPersons).toHaveBeenCalledTimes(1),
      { timeout: 5000 }
    );

    expect(screen.getByText("Person ID")).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();

    const formattedDob1 = format(parseISO(mockPersons[0].dob), "dd/MM/yy");
    const formattedDob2 = format(parseISO(mockPersons[1].dob), "dd/MM/yy");

    expect(screen.getByText(mockPersons[0].person_id)).toBeInTheDocument();
    expect(screen.getByText(mockPersons[0].first_name)).toBeInTheDocument();
    expect(screen.getByText(formattedDob1)).toBeInTheDocument();

    expect(screen.getByText(mockPersons[1].person_id)).toBeInTheDocument();
    expect(screen.getByText(mockPersons[1].first_name)).toBeInTheDocument();
    expect(screen.getByText(formattedDob2)).toBeInTheDocument();
  });

  it("handles empty data", async () => {
    (personsLib.fetchPersons as jest.Mock).mockResolvedValue([]);

    await act(async () => {
      render(<PersonsOfInterest />);
      await Promise.resolve();
    });

    await waitFor(
      () => expect(personsLib.fetchPersons).toHaveBeenCalledTimes(1),
      { timeout: 5000 }
    );

    expect(screen.getByText("Person ID")).toBeInTheDocument();
    expect(screen.queryByText("John")).not.toBeInTheDocument();
  });

  it("opens edit dialog for a selected row", async () => {
    await act(async () => {
      render(<PersonsOfInterest />);
      await Promise.resolve();
    });

    await waitFor(
      () =>
        expect(screen.getByText(mockPersons[0].first_name)).toBeInTheDocument(),
      { timeout: 5000 }
    );

    const editIcons = screen.getAllByLabelText("edit");
    await act(async () => {
      await user.click(editIcons[0]);
    });

    await waitFor(
      () => {
        expect(
          screen.getByRole("heading", { name: /Edit Person/i })
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it("triggers delete confirmation for a row", async () => {
    await act(async () => {
      render(<PersonsOfInterest />);
      await Promise.resolve();
    });

    await waitFor(
      () =>
        expect(screen.getByText(mockPersons[0].first_name)).toBeInTheDocument(),
      { timeout: 5000 }
    );

    const deleteIcons = screen.getAllByLabelText("delete");
    await act(async () => {
      await user.click(deleteIcons[0]);
    });

    await waitFor(
      () => {
        expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    await act(async () => {
      await user.click(confirmButton);
    });

    await waitFor(
      () => {
        expect(personsLib.deletePerson).toHaveBeenCalledWith(
          Number(mockPersons[0].person_id)
        );
      },
      { timeout: 5000 }
    );

    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
