/**
 * Unit tests for Navbar component
 * Verifies: Login/SignUp buttons on desktop, nav links, mobile menu
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock context providers
const mockUser = null; // logged-out state
const mockLogin = jest.fn();
const mockLogout = jest.fn();
const mockSignup = jest.fn();
const mockUpdateUser = jest.fn();

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    isLoggedIn: false,
    isLoading: false,
    login: mockLogin,
    logout: mockLogout,
    signup: mockSignup,
    updateUser: mockUpdateUser,
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

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Mock sub-components
jest.mock("@/components/SearchFilter", () => ({
  __esModule: true,
  default: () => <div data-testid="search-filter">SearchFilter</div>,
}));

jest.mock("@/components/ui/ComingSoonModal", () => ({
  __esModule: true,
  default: () => null,
}));

import Navbar from "@/components/Navbar";

describe("Navbar Component", () => {
  describe("When user is logged out (Landing Page)", () => {
    it("renders the HANDI logo", () => {
      render(<Navbar />);
      const logo = screen.getByAltText("HANDI");
      expect(logo).toBeInTheDocument();
    });

    it("renders Log In and Sign Up buttons instead of Account", () => {
      render(<Navbar />);
      expect(screen.getByText("Log In")).toBeInTheDocument();
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
      expect(screen.queryByText("Account")).not.toBeInTheDocument();
    });

    it("renders navigation links", () => {
      render(<Navbar />);
      expect(screen.getByText("SERVICES")).toBeInTheDocument();
      expect(screen.getByText("PRODUCTS")).toBeInTheDocument();
      expect(screen.getByText("HOW IT WORKS")).toBeInTheDocument();
    });

    it("Log In link points to /login", () => {
      render(<Navbar />);
      const loginLink = screen.getByText("Log In");
      expect(loginLink.closest("a")).toHaveAttribute("href", "/login");
    });

    it("Sign Up link points to /signup", () => {
      render(<Navbar />);
      const signupLink = screen.getByText("Sign Up");
      expect(signupLink.closest("a")).toHaveAttribute("href", "/signup");
    });
  });
});
