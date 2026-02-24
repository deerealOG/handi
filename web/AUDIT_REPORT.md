# HANDI Web App — Audit Report

> Items 13, 14, 15: App logic audit, native app consistency, and codebase cleanup recommendations.

## 1. File Size Analysis

| File                    | Size    | Lines  | Status                          |
| ----------------------- | ------- | ------ | ------------------------------- |
| `AuthenticatedHome.tsx` | 124 KB  | ~3,000 | ⚠️ Very large — should be split |
| `ProviderHome.tsx`      | 114 KB  | ~2,850 | ⚠️ Very large — should be split |
| `AdminDashboard.tsx`    | 47 KB   | ~1,200 | ⚠️ Large but manageable         |
| `BookingModal.tsx`      | 25 KB   | ~665   | ✅ OK                           |
| Other components        | < 16 KB | < 400  | ✅ OK                           |

### Recommended Extraction

From **AuthenticatedHome.tsx**, extract:

- `HomeTab` → `components/client/HomeTab.tsx`
- `BookingsTab` → `components/client/BookingsTab.tsx`
- `ShopTab` → `components/client/ShopTab.tsx`
- `FindProsTab` → `components/client/FindProsTab.tsx`
- `ProfileTab` → `components/client/ProfileTab.tsx`

From **ProviderHome.tsx**, extract:

- `DashboardTab` → `components/provider/DashboardTab.tsx`
- `ServicesTab` → `components/provider/ServicesTab.tsx`
- `BookingsTab` → `components/provider/BookingsTab.tsx`
- `EarningsTab` → `components/provider/EarningsTab.tsx`
- `ProfileTab` → `components/provider/ProfileTab.tsx`

## 2. Code Quality Findings

### alert() Usage (8 instances)

All `alert()` calls are used for mock feedback. In production, replace with toast notifications.

| File              | Line | Message                   |
| ----------------- | ---- | ------------------------- |
| ProviderHome      | 885  | Withdrawal successful     |
| ProviderHome      | 1876 | Location access denied    |
| ProviderHome      | 1881 | Geolocation not supported |
| ProviderHome      | 1913 | Account deactivated       |
| AuthenticatedHome | 844  | Receipt copied            |
| AuthenticatedHome | 2384 | Location denied           |
| AuthenticatedHome | 2389 | Geolocation not supported |
| AuthenticatedHome | 2435 | Account deactivated       |

### console.log/error (8 instances)

All in mock API handlers — acceptable for development. Remove before production.

### TypeScript `any` Usage

Used in mock data handlers and event callbacks. Acceptable at this stage, but should be typed when API integration happens.

## 3. Native App Consistency Check

### Structure Comparison

| Feature        | Web (Next.js)           | Native (Expo)         | Status            |
| -------------- | ----------------------- | --------------------- | ----------------- |
| Client Home    | `AuthenticatedHome.tsx` | `app/client/(tabs)/`  | ✅ Both have tabs |
| Bookings       | BookingsTab in shell    | `booking-details.tsx` | ✅ Consistent     |
| Booking Form   | `BookingModal.tsx`      | `book-artisan.tsx`    | ✅ Both exist     |
| Tracking       | In-modal timeline       | `track-artisan.tsx`   | ✅ Both exist     |
| Provider Shell | `ProviderHome.tsx`      | `app/artisan/`        | ✅ Both have tabs |
| Admin          | `AdminDashboard.tsx`    | `app/admin/`          | ✅ Both exist     |
| Chat           | In-shell panel          | `app/client/chat/`    | ✅ Both exist     |
| Profile        | In-shell ProfileTab     | `app/client/profile/` | ✅ Both exist     |
| Wallet         | In-shell panel          | `app/client/wallet/`  | ✅ Both exist     |

### Key Differences

- **Web** uses monolithic shell files with inline tabs; **Native** uses separate files per screen
- **Web** has a single `BookingModal` component; **Native** has `book-artisan.tsx` + `proceed-payment.tsx` + `booking-success.tsx` (3-step flow)
- **Native** has dedicated `chatbot.tsx`; **Web** has `ChatbotWidget.tsx` (floating)

## 4. Component Organization

Current web structure:

```
components/
├── AuthenticatedHome.tsx  (124 KB — client shell)
├── ProviderHome.tsx       (114 KB — provider shell)
├── AdminDashboard.tsx     (47 KB — admin shell)
├── BookingModal.tsx
├── ChatbotWidget.tsx
├── CookieConsent.tsx
├── CountdownTimer.tsx
├── Footer.tsx
├── LocationPrompt.tsx
├── Navbar.tsx
├── ScrollToTop.tsx
├── SearchFilter.tsx
├── features/providers/
├── layout/
├── sections/
└── ui/
```

### Recommended Restructure

```
components/
├── shells/
│   ├── ClientShell.tsx        (orchestrator only)
│   ├── ProviderShell.tsx      (orchestrator only)
│   └── AdminShell.tsx         (orchestrator only)
├── client/
│   ├── HomeTab.tsx
│   ├── BookingsTab.tsx
│   ├── ShopTab.tsx
│   ├── FindProsTab.tsx
│   └── ProfileTab.tsx
├── provider/
│   ├── DashboardTab.tsx
│   ├── ServicesTab.tsx
│   ├── BookingsTab.tsx
│   ├── EarningsTab.tsx
│   └── ProfileTab.tsx
├── shared/
│   ├── BookingModal.tsx
│   ├── ChatPanel.tsx
│   ├── HelpModal.tsx
│   ├── SecurityModal.tsx
│   └── TransactionHistory.tsx
├── layout/
├── sections/
└── ui/
```

## 5. Summary

| Priority | Item                                         | Effort |
| -------- | -------------------------------------------- | ------ |
| P1       | Split AuthenticatedHome.tsx into tabs        | Medium |
| P1       | Split ProviderHome.tsx into tabs             | Medium |
| P2       | Replace alert() with toast component         | Low    |
| P2       | Remove console.log before production         | Low    |
| P3       | Add TypeScript interfaces for mock data      | Medium |
| P3       | Extract shared modals (chat, help, security) | Medium |
