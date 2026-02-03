// components/index.ts
// Central export for all reusable components

// ================================
// Common UI Components
// ================================
export { default as ErrorBoundary } from "./common/ErrorBoundary";
export { default as LoadingSpinner } from "./common/LoadingSpinner";

// ================================
// Verification & Trust
// ================================
export {
    VERIFICATION_DATA,
    VerificationBadge,
    VerificationCard,
    VerificationCheckmark,
    VerificationRequirements
} from "./VerificationBadge";
export type { VerificationLevel } from "./VerificationBadge";

// ================================
// Emergency Services
// ================================
export {
    Available24_7Badge,
    EmergencyBadge,
    PriorityBadge
} from "./EmergencyBadge";

// ================================
// Rating & Reviews
// ================================
export {
    HeroRatingCard,
    RatingBadge,
    RatingBreakdown,
    RatingDisplay,
    StarRating
} from "./RatingDisplay";

// ================================
// Artisan Cards
// ================================
export { EnhancedArtisanCard } from "./EnhancedArtisanCard";
export type { ArtisanData } from "./EnhancedArtisanCard";

// ================================
// Location
// ================================
export { LocationFilterBar, NearbyIndicator } from "./LocationFilterBar";

// ================================
// User Engagement
// ================================
export { ReferralCard } from "./ReferralCard";
export { WaitlistCard } from "./WaitlistCard";

// ================================
// Settings
// ================================
export { LanguageSettingsItem } from "./LanguageSettingsItem";
export { ThemeSettingsItem } from "./ThemeSettingsItem";
export { ThemeToggle } from "./ThemeToggle";

// ================================
// Filter
// ================================
export { default as FilterModal } from "./FilterModal";
export type { FilterOptions } from "./FilterModal";

// ================================
// Legal & Compliance
// ================================
export {
    BookingDisclaimer,
    BookingTermsCheckbox,
    DisclaimerBanner,
    FooterDisclaimer,
    QuickTermsCheckbox,
    TermsModal
} from "./legal";

// ================================
// Dispute
// ================================
export { DisputeReportForm } from "./dispute";
