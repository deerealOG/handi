Native Tabs, Hero Slider, and Web Performance
Mirror the web homepage into the native client, fix bottom tabs, and speed up web loading.

Proposed Changes
Client Tab Bar
[MODIFY] 
_layout.tsx
Replace Wallet tab with Shop tab (icon: shopping-outline → shopping)
Rename "Find Pros" → "Explore" to match web
[NEW] 
shop.tsx
Products listing screen (mirrors web /products tab)
Grid of product cards with prices, tags, and "Add to Cart" CTAs
Reuses 
useCart
 from 
CartContext
Client Home — Hero Slider + Promo Banners
[MODIFY] 
index.tsx
Hero Slider: 3 auto-advancing slides matching web HERO_SLIDES data
Gradient backgrounds, title, subtitle, CTA button
Dot indicator, 5s auto-advance with useEffect interval
Promo Product Cards: 3 gradient cards below categories (matching web featured products row)
Trust Badges Row: 4 icons (Secure Payments, 24/7 Support, Verified Providers, Discounted Rates)
Web Performance
[MODIFY] 
page.tsx
Add loading="lazy" to below-fold <Image> components
Keep 
priority
 only on first hero slide image
Wrap heavy sections (AvailableNow, TopCategories) in React.lazy / Suspense
Provider & Admin — Audit Only
Artisan tabs (Home, Jobs, Wallet, Profile) already match web ProviderHome sidebar
Admin tabs (Dashboard, Users, Disputes, Payouts, Withdrawals, Jobs, Wallets) already match web AdminDashboard — no changes needed
Verification Plan
Manual Verification
Open Expo Go → confirm 5 tabs (Home, Explore, Shop, Bookings, Profile)
Swipe hero slider, tap CTA → should navigate
Web: http://localhost:3001 → measure initial load time improvement

Comment
Ctrl+Alt+M
