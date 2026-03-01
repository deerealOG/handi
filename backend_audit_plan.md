# Backend Audit & Implementation Plan

This document outlines the specific, actionable tasks for the backend engineering team to transition the HANDI platform from its current prototype state (using mock data and duplicated logic) to a production-ready Supabase backend.

The work is divided between two branches: `backend-audit-1` and `backend-audit-2`.

---

## Branch 1: `backend-audit-1` (Focus: Database Migration & RLS Security)

_Engineer Focus: Core data modeling, Supabase migrations, and Row Level Security._

### 1. Database Schema & Migrations

- [ ] **Schema Definition:** Define the exact SQL schema for `Users`, `Providers` (Artisans/Businesses), `Services`, `Products`, `Bookings`, `Transactions`, `Disputes`, and `Deals`/`Promotions`.
- [ ] **Seed Data:** Create a Supabase seed script (`supabase/seed.sql`) to insert realistic test data currently housed in `web/data/mockApi.ts`.
- [ ] **Data Consistency:** Include `originalPrice` and `sale` fields for Deals, and standard structures for `rating`, `reviews`, and `isOnline` statuses so public and private displays match perfectly.
- [ ] **Foreign Key Constraints:** Ensure cascading deletes and precise foreign key relationships (e.g., a Booking must link to a valid User and Provider; a Deal must link to a Service/Product or Provider).

### 2. Security: Row Level Security (RLS)

- [ ] **User Policies:** Users can only read/update their own profile data.
- [ ] **Provider Policies:** Providers can only read/update their own services, bookings, and earnings.
- [ ] **Admin Policies:** Super Admins have bypass-RLS or unrestricted access to all tables for the Admin Dashboard.
- [ ] **Public Policies:** Services and active Provider profiles must be readable by unauthenticated users (for the landing/search pages).

### 3. File Storage (Cloudinary / Supabase Storage)

- [ ] **Avatar Uploads:** Implement secure upload endpoints for user/provider avatars, ensuring files are compressed and old files are deleted when updated.
- [ ] **Portfolio/Product Images:** Create endpoints for providers to upload images for their services/products.

---

## Branch 2: `backend-audit-2` (Focus: API Wiring & Monorepo Architecture)

_Engineer Focus: Stripping out mock data, wiring the frontend (Web & Native) to real APIs, and authentication._

### 1. Authentication Migration

- [ ] **Supabase Auth Integration:** Replace the mocked `login`, `signup`, and `logout` functions in `AuthContext.tsx` with real Supabase Auth calls (Email/Password & OAuth if applicable).
- [ ] **Role Mapping:** Ensure that when a user signs up, their `userType` (Client, Artisan, Business, Admin) is correctly stored in the `Users` table and attached to their JWT metadata for RLS checks.
- [ ] **Session Handling:** Implement secure session persistence across both the Next.js Web app and the Expo Native app.

### 2. Stripping Mock Data (`mockApi.ts`)

- [ ] **Web App:** Systematically delete imports from `web/data/mockApi.ts` in components (e.g., `ClientDashboard.tsx`, `ProviderDashboard.tsx`, `AdminDashboard.tsx`) and replace them with `fetch` calls or Supabase client queries.
- [ ] **Public vs Private Routes:** Ensure the APIs feed the exact same data structures to both public landing pages (`/services`, `/products`, `/providers`, `/deals`) and internal Dashboard tabs (`FindProsTab`, `ShopTab`, `ProvidersTab`, `DealsTab`).
- [ ] **Native App:** Systematically delete imports from `services/mockApi.ts` in the Expo app and replace them with real API calls.
- [ ] **Delete Mock Files:** Once fully wired, permanently delete `web/data/mockApi.ts` and `services/mockApi.ts`.

### 3. Monorepo Context Deduplication

- [ ] **Shared Types/Interfaces:** Move duplicate TypeScript interfaces (e.g., `User`, `Booking`, `Service`) out of the web/native folders into a shared `packages/shared/types` directory.
- [ ] **API Services:** Centralize the API calling logic (Supabase clients, fetch wrappers) so both the Next.js web app and Expo native app use the exact same data-fetching functions.

---

## Frontend-Backend Integration Notes

> [!IMPORTANT]
> These items were identified during frontend audit and must be coordinated with backend work.

### Asset Management

- [x] **Image Path Audit:** Fixed 9 broken image paths in `mockApi.ts` and `page.tsx` where category images referenced wrong extensions (`beauty.jpg` → `beauty.png`, `cleaning.jpg` → `cleaning.png`, `technology.jpg` → `technology.svg`, `paint.svg` → `interior-decor.jpeg`, `electrical.jpg` → `electrician.png`).
- [ ] **CDN Migration:** When moving to production, all static images should be served from Cloudinary/CDN instead of the `/public/images/` directory. Update `next.config.ts` `images.domains` accordingly.

### SPA Navigation (Client Dashboard)

- [x] **Footer Link Routing:** Footer links now route to Quick Nav tabs for logged-in clients via `onTabChange` callback, preventing navigation away from the dashboard.
- [x] **Category Sidebar:** Top Categories sidebar added to HomeTab alongside the hero slider, matching the landing page layout.
- [ ] **Tab Lazy Loading Performance:** First-time tab loads (FindPros, Providers, Shop, etc.) take 15-20+ seconds to compile in dev. Consider code-splitting and preloading strategies for production.

### Card Design System

- [x] **CSS Utility Classes:** 19 card design classes added to `globals.css` (`.card`, `.card-img`, `.card-body`, `.card-badge`, `.promo-card`, `.list-card`, etc.) with dark mode support.
- [ ] **Backend Card Data:** When APIs are ready, ensure response shapes match the card component props (image, title, price, rating, badge, etc.).

---

## Shared Responsibilities

- **Integration Testing:** Write automated tests for critical flows (e.g., "A client can book a provider", "A provider can mark a booking complete").
- **Code Review:** `backend-audit-1` code must be reviewed by `backend-audit-2`, and vice-versa, before merging into `develop` or `master`.
- **Error Handling:** Standardize API error responses so the frontend can display user-friendly toast notifications for failed requests.
