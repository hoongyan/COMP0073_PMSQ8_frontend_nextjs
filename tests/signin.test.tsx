import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import SignIn from "@/app/(auth)/auth/sign-in/page";
import * as authLib from "@/lib/auth";
import { useSearchParams, useRouter } from "next/navigation";

// Add this line to mock the module
jest.mock("@/lib/auth");

// Mock Next.js hooks
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe("SignIn Page", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock useSearchParams (no error by default)
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });

    // Mock useRouter
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock signin function from auth.ts
    (authLib.signin as jest.Mock).mockResolvedValue({
      token: "fake-token",
      token_type: "bearer",
    });
  });

  afterEach(() => {
    jest.useRealTimers(); // Reset timers after each test to avoid affecting others
  });

  it("renders the sign-in form correctly", async () => {
    await act(async () => {
      render(<SignIn />);
    });

    // Check key elements
    expect(
      screen.getByRole("heading", { name: /Staff Sign-In/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Remember me/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /Don't have an account\? Sign Up here\./i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Forgot password\?/i })
    ).toBeInTheDocument();
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
    // Setup userEvent with advanceTimers to fix fakeTimers + waitFor conflict
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    jest.useFakeTimers({ legacyFakeTimers: true }); // Legacy mode for better polling compatibility

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

    // Advance the fake clock by 1500ms to trigger the setTimeout redirect
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(mockPush).toHaveBeenCalledWith("/reports");
  });

  it("handles submission error and shows error message", async () => {
    // Mock error from signin
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
      // Button should not be disabled after error (re-enable for retry)
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("shows loading spinner during submission", async () => {
    // Delay the mock to simulate async
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

    // Spinner appears (CircularProgress)
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });
});
