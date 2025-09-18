import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import SignUp from "@/app/(auth)/auth/sign-up/page";
import * as authLib from "@/lib/auth";
import { useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@/lib/auth");

jest.mock("date-fns", () => ({
  format: jest.fn().mockReturnValue("2020-01-01"),
}));

const user = userEvent.setup();

describe("SignUp Page", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });

    (authLib.signup as jest.Mock).mockResolvedValue({
      email: "test@example.com",
      first_name: "JOHN",
      last_name: "DOE",
      contact_no: "12345678",
      role: "INVESTIGATION OFFICER",
      status: "PENDING",
    });
  });

  it("renders the sign-up form correctly", async () => {
    await act(async () => {
      render(<SignUp />);
    });

    expect(
      screen.getByRole("button", { name: /Submit Registration/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^First Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Last Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Contact Number/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Sex/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Role/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /Already have an account\? Sign In here\./i,
      })
    ).toBeInTheDocument();
  });

  it("displays error message from query params", async () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("RegistrationFailed"),
    });

    await act(async () => {
      render(<SignUp />);
    });

    expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
  });

  it("shows validation error for password mismatch", async () => {
    await act(async () => {
      render(<SignUp />);
    });

    await act(async () => {
      await user.type(
        screen.getByLabelText(/^Email Address/),
        "test@example.com"
      );
      await user.type(screen.getByLabelText(/^Password/), "password123");
      await user.type(
        screen.getByLabelText(/^Confirm Password/),
        "password456"
      ); // Mismatch
      await user.type(screen.getByLabelText(/^First Name/), "John");
      await user.type(screen.getByLabelText(/^Last Name/), "Doe");
      await user.type(screen.getByLabelText(/^Contact Number/), "12345678");
      await user.click(screen.getByLabelText(/^Sex/));
      await user.click(screen.getByRole("option", { name: "Male" }));
      await user.click(screen.getByLabelText(/^Role/));
      await user.click(
        screen.getByRole("option", { name: "Investigation Officer" })
      );
    });

    const submitButton = screen.getByRole("button", {
      name: /Submit Registration/i,
    });
    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Passwords must match/i)).toBeInTheDocument();
    });
  });

  it("submits form successfully and shows success message", async () => {
    await act(async () => {
      render(<SignUp />);
    });

    await act(async () => {
      await user.type(
        screen.getByLabelText(/^Email Address/),
        "test@example.com"
      );
      await user.type(screen.getByLabelText(/^Password/), "password123");
      await user.type(
        screen.getByLabelText(/^Confirm Password/),
        "password123"
      );
      await user.type(screen.getByLabelText(/^First Name/), "John");
      await user.type(screen.getByLabelText(/^Last Name/), "Doe");
      await user.type(screen.getByLabelText(/^Contact Number/), "12345678");
      await user.click(screen.getByLabelText(/^Sex/));
      await user.click(screen.getByRole("option", { name: "Male" }));
      await user.click(screen.getByLabelText(/^Role/));
      await user.click(
        screen.getByRole("option", { name: "Investigation Officer" })
      );
    });

    const submitButton = screen.getByRole("button", {
      name: /Submit Registration/i,
    });
    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(authLib.signup).toHaveBeenCalled();
      expect(
        screen.getByText(/Your registration has been submitted successfully/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/JOHN! Your status is PENDING/i)
      ).toBeInTheDocument();
    });
  });

  it("handles submission error (e.g., email already registered) and shows error message", async () => {
    (authLib.signup as jest.Mock).mockRejectedValue(
      new Error("Email already registered. Please use a different email.")
    );

    await act(async () => {
      render(<SignUp />);
    });

    await act(async () => {
      await user.type(
        screen.getByLabelText(/^Email Address/),
        "duplicate@example.com"
      );
      await user.type(screen.getByLabelText(/^Password/), "password123");
      await user.type(
        screen.getByLabelText(/^Confirm Password/),
        "password123"
      );
      await user.type(screen.getByLabelText(/^First Name/), "John");
      await user.type(screen.getByLabelText(/^Last Name/), "Doe");
      await user.type(screen.getByLabelText(/^Contact Number/), "12345678");
      await user.click(screen.getByLabelText(/^Sex/));
      await user.click(screen.getByRole("option", { name: "Male" }));
      await user.click(screen.getByLabelText(/^Role/));
      await user.click(
        screen.getByRole("option", { name: "Investigation Officer" })
      );
    });

    const submitButton = screen.getByRole("button", {
      name: /Submit Registration/i,
    });
    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Email already registered/i)).toBeInTheDocument();
    });
  });
});
