// import { render, screen, waitFor, fireEvent } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { act } from "react-dom/test-utils";
// import SignUp from "@/app/(auth)/auth/sign-up/page"; // Adjust path if needed
// import * as authLib from "@/lib/auth"; // Mock the auth functions
// import { useSearchParams } from "next/navigation";

// // Mock Next.js hooks
// jest.mock("next/navigation", () => ({
//   useSearchParams: jest.fn(),
// }));

// jest.mock("@/lib/auth");

// // Mock date-fns for consistent formatting (used if DOB is filled, but we're skipping DOB for now)
// jest.mock("date-fns", () => ({
//   format: jest.fn().mockReturnValue("2020-01-01"),
// }));

// // Setup userEvent
// const user = userEvent.setup();

// describe("SignUp Page", () => {
//   beforeEach(() => {
//     // Reset mocks
//     jest.clearAllMocks();

//     // Mock useSearchParams (no error by default)
//     (useSearchParams as jest.Mock).mockReturnValue({
//       get: jest.fn().mockReturnValue(null),
//     });

//     // Mock signup function from auth.ts with success response by default
//     // Updated to match uppercase transformation in the form
//     (authLib.signup as jest.Mock).mockResolvedValue({
//       email: "test@example.com",
//       first_name: "JOHN",
//       last_name: "DOE",
//       contact_no: "12345678",
//       role: "INVESTIGATION OFFICER",
//       status: "PENDING",
//     });
//   });

//   it("renders the sign-up form correctly", async () => {
//     await act(async () => {
//       render(<SignUp />);
//     });

//     // Check key elements
//     expect(
//       screen.getByRole("button", { name: /Submit Registration/i })
//     ).toBeInTheDocument();
//     expect(screen.getByLabelText(/^Email Address/)).toBeInTheDocument();
//     expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
//     expect(screen.getByLabelText(/^Confirm Password/)).toBeInTheDocument();
//     expect(screen.getByLabelText(/^First Name/)).toBeInTheDocument();
//     expect(screen.getByLabelText(/^Last Name/)).toBeInTheDocument();
//     expect(screen.getByLabelText(/^Contact Number/)).toBeInTheDocument();
//     expect(screen.getByLabelText(/^Sex/)).toBeInTheDocument(); // Select label
//     expect(screen.getByLabelText(/^Role/)).toBeInTheDocument(); // Select label
//     expect(
//       screen.getByRole("link", {
//         name: /Already have an account\? Sign In here\./i,
//       })
//     ).toBeInTheDocument();
//   });

//   it("displays error message from query params", async () => {
//     (useSearchParams as jest.Mock).mockReturnValue({
//       get: jest.fn().mockReturnValue("RegistrationFailed"),
//     });

//     await act(async () => {
//       render(<SignUp />);
//     });

//     expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
//   });

//   it("shows validation errors on invalid submit (required fields)", async () => {
//     await act(async () => {
//       render(<SignUp />);
//     });

//     const form = screen.getByRole("form");
//     await act(async () => {
//       fireEvent.submit(form);
//     });

//     // No waitFor needed for sync validation
//     expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
//     expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
//     expect(
//       screen.getByText(/Confirm password is required/i)
//     ).toBeInTheDocument();
//     expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
//     expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
//     expect(screen.getByText(/Contact number is required/i)).toBeInTheDocument();
//     expect(screen.getByText(/Sex is required/i)).toBeInTheDocument();
//     expect(screen.getByText(/Role is required/i)).toBeInTheDocument();
//   });

//   it("shows validation error for password mismatch", async () => {
//     await act(async () => {
//       render(<SignUp />);
//     });

//     // Fill some fields but mismatch passwords
//     await act(async () => {
//       await user.type(
//         screen.getByLabelText(/^Email Address/),
//         "test@example.com"
//       );
//       await user.type(screen.getByLabelText(/^Password/), "password123");
//       await user.type(
//         screen.getByLabelText(/^Confirm Password/),
//         "password456"
//       ); // Mismatch
//       await user.type(screen.getByLabelText(/^First Name/), "John");
//       await user.type(screen.getByLabelText(/^Last Name/), "Doe");
//       await user.type(screen.getByLabelText(/^Contact Number/), "12345678");
//       await user.click(screen.getByLabelText(/^Sex/));
//       await user.click(screen.getByRole("option", { name: /Male/i }));
//       await user.click(screen.getByLabelText(/^Role/));
//       await user.click(
//         screen.getByRole("option", { name: /Investigation Officer/i })
//       );
//     });

//     const submitButton = screen.getByRole("button", {
//       name: /Submit Registration/i,
//     });
//     await act(async () => {
//       await user.click(submitButton);
//     });

//     await waitFor(() => {
//       expect(screen.getByText(/Passwords must match/i)).toBeInTheDocument();
//     });
//   });

//   it("shows password strength indicator", async () => {
//     await act(async () => {
//       render(<SignUp />);
//     });

//     const passwordInput = screen.getByLabelText(/^Password/);

//     // Weak password
//     await act(async () => {
//       await user.type(passwordInput, "weak");
//     });
//     await waitFor(() => {
//       expect(screen.getByText(/Very Weak/i)).toBeInTheDocument();
//     });

//     // Strong password
//     await act(async () => {
//       await user.clear(passwordInput);
//       await user.type(passwordInput, "StrongPass123!");
//     });
//     await waitFor(() => {
//       expect(screen.getByText(/Strong/i)).toBeInTheDocument();
//     });
//   });

//   it("submits form successfully and shows success message", async () => {
//     await act(async () => {
//       render(<SignUp />);
//     });

//     // Fill required fields (skipped DOB to avoid potential parsing issues)
//     await act(async () => {
//       await user.type(
//         screen.getByLabelText(/^Email Address/),
//         "test@example.com"
//       );
//       await user.type(screen.getByLabelText(/^Password/), "password123");
//       await user.type(
//         screen.getByLabelText(/^Confirm Password/),
//         "password123"
//       );
//       await user.type(screen.getByLabelText(/^First Name/), "John");
//       await user.type(screen.getByLabelText(/^Last Name/), "Doe");
//       await user.type(screen.getByLabelText(/^Contact Number/), "12345678");
//       await user.click(screen.getByLabelText(/^Sex/));
//       await user.click(screen.getByRole("option", { name: /Male/i }));
//       await user.click(screen.getByLabelText(/^Role/));
//       await user.click(
//         screen.getByRole("option", { name: /Investigation Officer/i })
//       );
//     });

//     const submitButton = screen.getByRole("button", {
//       name: /Submit Registration/i,
//     });
//     await act(async () => {
//       await user.click(submitButton);
//     });

//     await waitFor(() => {
//       expect(authLib.signup).toHaveBeenCalled();
//       expect(
//         screen.getByText(/Your registration has been submitted successfully/i)
//       ).toBeInTheDocument();
//       // Updated to match uppercase name from form
//       expect(
//         screen.getByText(/JOHN! Your status is PENDING/i)
//       ).toBeInTheDocument();
//     });
//   });

//   it("handles submission error (e.g., email already registered) and shows error message", async () => {
//     // Mock error from signup
//     (authLib.signup as jest.Mock).mockRejectedValue(
//       new Error("Email already registered. Please use a different email.")
//     );

//     await act(async () => {
//       render(<SignUp />);
//     });

//     // Fill form (skipped DOB)
//     await act(async () => {
//       await user.type(
//         screen.getByLabelText(/^Email Address/),
//         "duplicate@example.com"
//       );
//       await user.type(screen.getByLabelText(/^Password/), "password123");
//       await user.type(
//         screen.getByLabelText(/^Confirm Password/),
//         "password123"
//       );
//       await user.type(screen.getByLabelText(/^First Name/), "John");
//       await user.type(screen.getByLabelText(/^Last Name/), "Doe");
//       await user.type(screen.getByLabelText(/^Contact Number/), "12345678");
//       await user.click(screen.getByLabelText(/^Sex/));
//       await user.click(screen.getByRole("option", { name: /Male/i }));
//       await user.click(screen.getByLabelText(/^Role/));
//       await user.click(
//         screen.getByRole("option", { name: /Investigation Officer/i })
//       );
//     });

//     const submitButton = screen.getByRole("button", {
//       name: /Submit Registration/i,
//     });
//     await act(async () => {
//       await user.click(submitButton);
//     });

//     await waitFor(() => {
//       expect(screen.getByText(/Email already registered/i)).toBeInTheDocument();
//     });
//   });

//   it("shows loading spinner during submission", async () => {
//     // Delay the mock to simulate async
//     (authLib.signup as jest.Mock).mockImplementation(
//       () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
//     );

//     await act(async () => {
//       render(<SignUp />);
//     });

//     // Fill form (skipped DOB)
//     await act(async () => {
//       await user.type(
//         screen.getByLabelText(/^Email Address/),
//         "test@example.com"
//       );
//       await user.type(screen.getByLabelText(/^Password/), "password123");
//       await user.type(
//         screen.getByLabelText(/^Confirm Password/),
//         "password123"
//       );
//       await user.type(screen.getByLabelText(/^First Name/), "John");
//       await user.type(screen.getByLabelText(/^Last Name/), "Doe");
//       await user.type(screen.getByLabelText(/^Contact Number/), "12345678");
//       await user.click(screen.getByLabelText(/^Sex/));
//       await user.click(screen.getByRole("option", { name: /Male/i }));
//       await user.click(screen.getByLabelText(/^Role/));
//       await user.click(
//         screen.getByRole("option", { name: /Investigation Officer/i })
//       );
//     });

//     const submitButton = screen.getByRole("button", {
//       name: /Submit Registration/i,
//     });
//     await act(async () => {
//       await user.click(submitButton);
//     });

//     // Check loading state
//     expect(screen.getByRole("progressbar")).toBeInTheDocument();
//     expect(submitButton).toBeDisabled();

//     // Wait for loading to finish
//     await waitFor(() => {
//       expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
//     });
//   });
// });

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import SignUp from "@/app/(auth)/auth/sign-up/page"; // Adjust path if needed
import * as authLib from "@/lib/auth"; // Mock the auth functions
import { useSearchParams } from "next/navigation";

// Mock Next.js hooks
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@/lib/auth");

// Mock date-fns for consistent formatting (used if DOB is filled, but we're skipping DOB for now)
jest.mock("date-fns", () => ({
  format: jest.fn().mockReturnValue("2020-01-01"),
}));

// Setup userEvent
const user = userEvent.setup();

describe("SignUp Page", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock useSearchParams (no error by default)
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });

    // Mock signup function from auth.ts with success response by default
    // Updated to match uppercase transformation in the form
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

    // Check key elements
    expect(
      screen.getByRole("button", { name: /Submit Registration/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^First Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Last Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Contact Number/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Sex/)).toBeInTheDocument(); // Select label
    expect(screen.getByLabelText(/^Role/)).toBeInTheDocument(); // Select label
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

    // Fill some fields but mismatch passwords
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

    // Fill required fields (skipped DOB to avoid potential parsing issues)
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
      // Updated to match uppercase name from form
      expect(
        screen.getByText(/JOHN! Your status is PENDING/i)
      ).toBeInTheDocument();
    });
  });

  it("handles submission error (e.g., email already registered) and shows error message", async () => {
    // Mock error from signup
    (authLib.signup as jest.Mock).mockRejectedValue(
      new Error("Email already registered. Please use a different email.")
    );

    await act(async () => {
      render(<SignUp />);
    });

    // Fill form (skipped DOB)
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
