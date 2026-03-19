// services/index.ts
// Central export for all HANDI services

export { api, tokenManager } from "./api";
export type { ApiResponse, PaginatedResponse } from "./api";

// API Health & Diagnostics
export {
    checkApiHealth,
    logApiError,
    runApiDiagnostics
} from "./apiHealthCheck";
export type { HealthCheckResult } from "./apiHealthCheck";

export { authService } from "./authService";
export type {
    AuthTokens,
    LoginCredentials,
    RegisterData,
    User,
    UserType
} from "./authService";

export { bookingService } from "./bookingService";
export type {
    Booking,
    BookingFilters,
    BookingStatus,
    CreateBookingData,
    PaymentStatus
} from "./bookingService";

export { NIGERIAN_CITIES, locationService } from "./locationService";
export type { City, UserLocation } from "./locationService";

export { notificationService } from "./notificationService";
export type {
    Notification,
    NotificationPreferences,
    NotificationType
} from "./notificationService";

// Legal & Compliance Services
export { disputeService } from "./disputeService";
export { escrowService } from "./escrowService";
export type { EscrowTransaction } from "../types/legal";
export { legalService } from "./legalService";
export { verificationService } from "./verificationService";
export { walletService } from "./walletService";
export type {
    Wallet,
    WalletTransaction,
    WithdrawalRequest
} from "../types/wallet";

// Business Services (Provider Model)
export { businessService } from "./businessService";
export type {
    Availability,
    BusinessJob,
    BusinessProfile,
    BusinessStats,
    CreateProjectData,
    ProjectPriority,
    ServiceOffering,
    TeamMember
} from "./businessService";

// Marketplace Services
export { productService } from "./productService";
export type { Product, ProductFilters, ProductReview } from "./productService";

export { orderService } from "./orderService";
export type { Order, OrderItem, OrderStatus, CreateOrderData } from "./orderService";

export { vendorService } from "./vendorService";
export type { Vendor, VendorRegistration, VendorStats, AddProductData } from "./vendorService";

// Feature Services
export { matchingService } from "./matchingService";
export type { MatchResult, MatchPreference, FindMatchParams } from "./matchingService";

export { emergencyService as emergencyFeatureService } from "./emergencyService";
export type { EmergencyRequest, CreateEmergencyData } from "./emergencyService";

export { maintenanceService } from "./maintenanceService";
export type { MaintenancePlan, PlanSubscription } from "./maintenanceService";

export { featureService } from "./featureService";
export type {
    GuaranteeClaim,
    HomeProfile,
    LoyaltyAccount,
    Quote,
    QuoteRequest
} from "./featureService";

