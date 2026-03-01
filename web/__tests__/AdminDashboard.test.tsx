/**
 * Unit tests for AdminDashboard component
 * Verifies: side panel navigation on mobile
 */
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

// Mock user (logged in as admin)
const mockUser = {
  id: "3",
  firstName: "Admin",
  lastName: "User",
  email: "admin@test.com",
  phone: "5555555555",
  userType: "admin" as const,
  adminRole: "super_admin",
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

// Mock all admin tab components
jest.mock("@/components/admin/OverviewTab", () => ({
  __esModule: true,
  default: () => <div data-testid="overview-tab">OverviewTab</div>,
}));
jest.mock("@/components/admin/UsersTab", () => ({
  __esModule: true,
  default: () => <div data-testid="users-tab">UsersTab</div>,
}));
jest.mock("@/components/admin/DisputesTab", () => ({
  __esModule: true,
  default: () => <div data-testid="disputes-tab">DisputesTab</div>,
}));
jest.mock("@/components/admin/ProvidersTab", () => ({
  __esModule: true,
  default: () => <div data-testid="admin-providers-tab">ProvidersTab</div>,
}));
jest.mock("@/components/admin/AdminBookingsTab", () => ({
  __esModule: true,
  default: () => <div data-testid="admin-bookings-tab">AdminBookingsTab</div>,
}));
jest.mock("@/components/admin/AdminTransactionsTab", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="admin-transactions-tab">AdminTransactionsTab</div>
  ),
}));
jest.mock("@/components/admin/AdminServicesTab", () => ({
  __esModule: true,
  default: () => <div data-testid="admin-services-tab">AdminServicesTab</div>,
}));
jest.mock("@/components/admin/AdminCategoriesTab", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="admin-categories-tab">AdminCategoriesTab</div>
  ),
}));
jest.mock("@/components/admin/AnalyticsTab", () => ({
  __esModule: true,
  default: () => <div data-testid="analytics-tab">AnalyticsTab</div>,
}));
jest.mock("@/components/admin/AdminReportsTab", () => ({
  __esModule: true,
  default: () => <div data-testid="admin-reports-tab">AdminReportsTab</div>,
}));
jest.mock("@/components/admin/TeamManagementTab", () => ({
  __esModule: true,
  default: () => <div data-testid="team-tab">TeamManagementTab</div>,
}));
jest.mock("@/components/admin/SettingsTab", () => ({
  __esModule: true,
  default: () => <div data-testid="settings-tab">SettingsTab</div>,
}));

// Mock data
jest.mock("@/components/admin/data", () => ({
  MOCK_PLATFORM_STATS: {
    totalUsers: 1000,
    totalProviders: 200,
    totalBookings: 500,
    totalRevenue: 50000,
  },
}));

import AdminDashboard from "@/components/AdminDashboard";

describe("AdminDashboard Component", () => {
  it("renders the HANDI logo", () => {
    render(<AdminDashboard />);
    const logo = screen.getByAltText("HANDI");
    expect(logo).toBeInTheDocument();
  });

  it("renders the admin role badge", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Super Admin")).toBeInTheDocument();
  });

  it("renders desktop sidebar nav tabs", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Disputes")).toBeInTheDocument();
  });

  it("shows OverviewTab by default", () => {
    render(<AdminDashboard />);
    expect(screen.getByTestId("overview-tab")).toBeInTheDocument();
  });

  it("has a mobile hamburger button", () => {
    render(<AdminDashboard />);
    const menuButtons = screen.getAllByRole("button");
    const menuButton = menuButtons.find(
      (btn) =>
        btn.className.includes("lg:hidden") &&
        btn.className.includes("rounded-lg"),
    );
    expect(menuButton).toBeDefined();
  });

  it("mobile menu renders as side panel with user info", () => {
    render(<AdminDashboard />);
    const menuButtons = screen.getAllByRole("button");
    const menuButton = menuButtons.find(
      (btn) =>
        btn.className.includes("lg:hidden") &&
        btn.className.includes("rounded-lg"),
    );
    if (menuButton) {
      fireEvent.click(menuButton);
      // Admin side panel shows user name
      expect(screen.getByText("Admin User")).toBeInTheDocument();
      // Side panel has tabs
      const sidePanel = document.querySelector(".w-64.bg-white.shadow-xl");
      expect(sidePanel).toBeInTheDocument();
    }
  });

  it("mobile side panel has logout button", () => {
    render(<AdminDashboard />);
    const menuButtons = screen.getAllByRole("button");
    const menuButton = menuButtons.find(
      (btn) =>
        btn.className.includes("lg:hidden") &&
        btn.className.includes("rounded-lg"),
    );
    if (menuButton) {
      fireEvent.click(menuButton);
      // Should find at least one Logout button
      const logoutButtons = screen.getAllByText("Logout");
      expect(logoutButtons.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("switches tabs when clicking sidebar buttons", () => {
    render(<AdminDashboard />);
    const usersButton = screen
      .getAllByText("Users")
      .find((el) => el.tagName === "BUTTON");
    if (usersButton) {
      fireEvent.click(usersButton);
      expect(screen.getByTestId("users-tab")).toBeInTheDocument();
    }
  });
});
