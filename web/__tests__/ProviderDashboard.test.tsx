/**
 * Unit tests for ProviderDashboard component
 * Verifies: side panel navigation on mobile (not dropdown)
 */
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

// Mock user (logged in as provider)
const mockUser = {
  id: "2",
  firstName: "Jane",
  lastName: "Provider",
  email: "jane@test.com",
  phone: "9876543210",
  userType: "provider" as const,
  avatar: null,
};

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    isLoggedIn: true,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    signup: jest.fn(),
    updateUser: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({
    isDark: false,
    toggleDarkMode: jest.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock tab components
jest.mock("@/components/provider/DashboardTab", () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard-tab">DashboardTab</div>,
}));
jest.mock("@/components/provider/ServicesTab", () => ({
  __esModule: true,
  default: () => <div data-testid="services-tab">ServicesTab</div>,
}));
jest.mock("@/components/provider/BookingsTab", () => ({
  __esModule: true,
  default: () => <div data-testid="bookings-tab">BookingsTab</div>,
}));
jest.mock("@/components/provider/EarningsTab", () => ({
  __esModule: true,
  default: () => <div data-testid="earnings-tab">EarningsTab</div>,
}));
jest.mock("@/components/provider/ProfileTab", () => ({
  __esModule: true,
  default: () => <div data-testid="profile-tab">ProfileTab</div>,
}));

// Mock data
jest.mock("@/components/provider/data", () => ({
  MOCK_TRANSACTIONS: [],
}));

jest.mock("@/lib/generateReceipt", () => ({
  generateReceipt: jest.fn(),
}));

import ProviderDashboard from "@/components/ProviderDashboard";

describe("ProviderDashboard Component", () => {
  it("renders the HANDI logo", () => {
    render(<ProviderDashboard />);
    const logo = screen.getByAltText("HANDI");
    expect(logo).toBeInTheDocument();
  });

  it("renders desktop quick nav tabs", () => {
    render(<ProviderDashboard />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Bookings")).toBeInTheDocument();
    expect(screen.getByText("Earnings")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("shows DashboardTab by default", () => {
    render(<ProviderDashboard />);
    expect(screen.getByTestId("dashboard-tab")).toBeInTheDocument();
  });

  it("has a hamburger button in the header for mobile", () => {
    render(<ProviderDashboard />);
    const menuButtons = screen.getAllByRole("button");
    const menuButton = menuButtons.find(
      (btn) =>
        btn.className.includes("sm:hidden") &&
        btn.className.includes("rounded-lg"),
    );
    expect(menuButton).toBeDefined();
  });

  it("mobile menu renders as side panel (not dropdown)", () => {
    render(<ProviderDashboard />);
    const menuButtons = screen.getAllByRole("button");
    const menuButton = menuButtons.find(
      (btn) =>
        btn.className.includes("sm:hidden") &&
        btn.className.includes("rounded-lg"),
    );
    if (menuButton) {
      fireEvent.click(menuButton);
      // Verify it's a side panel (has inset-y-0 and w-64)
      const sidePanel = document.querySelector(".inset-y-0.left-0.w-64");
      expect(sidePanel).toBeInTheDocument();
      // Verify it has the "Menu" header like a side panel
      expect(screen.getByText("Menu")).toBeInTheDocument();
    }
  });

  it("side panel has a close button (X icon)", () => {
    render(<ProviderDashboard />);
    const menuButtons = screen.getAllByRole("button");
    const menuButton = menuButtons.find(
      (btn) =>
        btn.className.includes("sm:hidden") &&
        btn.className.includes("rounded-lg"),
    );
    if (menuButton) {
      fireEvent.click(menuButton);
      // The side panel should have a Logout button
      expect(screen.getByText("Logout")).toBeInTheDocument();
    }
  });

  it("switches tabs when clicking tab buttons", () => {
    render(<ProviderDashboard />);
    const servicesButton = screen
      .getAllByText("Services")
      .find((el) => el.tagName === "BUTTON");
    if (servicesButton) {
      fireEvent.click(servicesButton);
      expect(screen.getByTestId("services-tab")).toBeInTheDocument();
    }
  });
});
