import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import SignIn from "@/app/(auth)/auth/sign-in/page";
import * as authLib from "@/lib/auth";
import { useSearchParams, useRouter } from "next/navigation";

jest.mock("@/lib/auth");

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe("SignIn Page", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });

    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (authLib.signin as jest.Mock).mockResolvedValue({
      token: "fake-token",
      token_type: "bearer",
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the sign-in form correctly", async () => {
    await act(async () => {
      render(<SignIn />);
    });

    expect(
      screen.getByRole("heading", { name: /Staff Sign-In/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Remember me/i)).toBeInTheDocument();
  });

  it("displays error message from query params", async () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("InvalidCredentials"),
    });

    await act(async () => {
      render(<SignIn />);
    });

    expect(screen.getByText(/Invalid login details/i)).toBeInTheDocument();
  });

  it("submits form successfully, shows success message, and redirects", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    jest.useFakeTimers({ legacyFakeTimers: true });

    await act(async () => {
      render(<SignIn />);
    });

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const rememberMe = screen.getByLabelText(/Remember me/i);
    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    await act(async () => {
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(rememberMe);
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(authLib.signin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        rememberMe: true,
      });
      expect(
        screen.getByText(/Login successful! Redirecting.../i)
      ).toBeInTheDocument();
    });
  });

  it("handles submission error and shows error message", async () => {
    (authLib.signin as jest.Mock).mockRejectedValue(
      new Error("Incorrect email or password.")
    );

    await act(async () => {
      render(<SignIn />);
    });

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    await act(async () => {
      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "wrongpass");
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Incorrect email or password./i)
      ).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("shows loading spinner during submission", async () => {
    (authLib.signin as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ token: "fake" }), 100)
        )
    );

    await act(async () => {
      render(<SignIn />);
    });

    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    await act(async () => {
      await userEvent.type(
        screen.getByLabelText(/Email Address/i),
        "test@example.com"
      );
      await userEvent.type(screen.getByLabelText(/Password/i), "password123");
      await userEvent.click(submitButton);
    });

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });
});
