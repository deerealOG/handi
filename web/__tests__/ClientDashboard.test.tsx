/**
 * Unit tests for ClientDashboard component
 * Verifies: hamburger dropdown menu on mobile (not side panel)
 */
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

// Mock user (logged in as client)
const mockUser = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john@test.com",
  phone: "1234567890",
  userType: "client" as const,
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

jest.mock("@/context/CartContext", () => ({
  useCart: () => ({
    cartCount: 0,
    wishlistCount: 0,
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    toggleWishlist: jest.fn(),
    isInWishlist: jest.fn(() => false),
  }),
}));

jest.mock("@/context/NotificationContext", () => ({
  useNotifications: () => ({
    unreadCount: 0,
    notifications: [],
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Mock child tab components to simplify rendering
jest.mock("@/components/client/HomeTab", () => ({
  __esModule: true,
  default: () => <div data-testid="home-tab">HomeTab</div>,
}));

jest.mock("@/components/client/FindProsTab", () => ({
  __esModule: true,
  default: () => <div data-testid="find-pros-tab">FindProsTab</div>,
}));

jest.mock("@/components/client/ProvidersTab", () => ({
  __esModule: true,
  default: () => <div data-testid="providers-tab">ProvidersTab</div>,
}));

jest.mock("@/components/client/ShopTab", () => ({
  __esModule: true,
  default: () => <div data-testid="shop-tab">ShopTab</div>,
}));

jest.mock("@/components/client/BookingsTab", () => ({
  __esModule: true,
  default: () => <div data-testid="bookings-tab">BookingsTab</div>,
}));

jest.mock("@/components/client/ClientProfileTab", () => ({
  __esModule: true,
  default: () => <div data-testid="profile-tab">ProfileTab</div>,
}));

jest.mock("@/components/Footer", () => ({
  __esModule: true,
  default: () => <div data-testid="footer">Footer</div>,
}));

import ClientDashboard from "@/components/ClientDashboard";

describe("ClientDashboard Component", () => {
  it("renders the HANDI logo", () => {
    render(<ClientDashboard />);
    const logo = screen.getByAltText("HANDI");
    expect(logo).toBeInTheDocument();
  });

  it("renders desktop quick nav tabs", () => {
    render(<ClientDashboard />);
    // Tabs may appear in both desktop nav and mobile menu, so use getAllByText
    expect(screen.getAllByText("Home").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Find Services").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getAllByText("Shop").length).toBeGreaterThanOrEqual(1);
  });

  it("shows HomeTab by default", () => {
    render(<ClientDashboard />);
    expect(screen.getByTestId("home-tab")).toBeInTheDocument();
  });

  it("has a hamburger menu button for mobile", () => {
    render(<ClientDashboard />);
    // The hamburger button should exist (only visible on mobile via CSS sm:hidden)
    const menuButtons = screen.getAllByRole("button");
    const menuButton = menuButtons.find(
      (btn) =>
        btn.className.includes("sm:hidden") &&
        btn.className.includes("rounded-lg"),
    );
    expect(menuButton).toBeDefined();
  });

  it("mobile menu renders as dropdown (not side panel)", () => {
    render(<ClientDashboard />);
    // Click the hamburger button to open menu
    const menuButtons = screen.getAllByRole("button");
    const menuButton = menuButtons.find(
      (btn) =>
        btn.className.includes("sm:hidden") &&
        btn.className.includes("rounded-lg"),
    );
    if (menuButton) {
      fireEvent.click(menuButton);
      // Verify it's a dropdown (has rounded-2xl class) not a side panel (inset-y-0)
      const menuOverlay = document.querySelector(".rounded-2xl.shadow-xl");
      expect(menuOverlay).toBeInTheDocument();
      // Verify it does NOT have side panel classes
      const sidePanel = document.querySelector(".inset-y-0");
      expect(sidePanel).not.toBeInTheDocument();
    }
  });

  it("switches tabs when clicking tab buttons", () => {
    render(<ClientDashboard />);
    const shopButton = screen
      .getAllByText("Shop")
      .find((el) => el.tagName === "BUTTON");
    if (shopButton) {
      fireEvent.click(shopButton);
      expect(screen.getByTestId("shop-tab")).toBeInTheDocument();
    }
  });
});
