import re

with open("components/client/HomeTab.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# We want to replace the return statement with a new one that uses landing page components.
# First, add the necessary imports to the top of the file.

new_imports = """
import HeroSection from "@/components/landing-page/HeroSection";
import TrustSection from "@/components/landing-page/TrustSection";
import ProvidersAndStepsSection from "@/components/landing-page/ProvidersAndStepsSection";
import FeaturedSection from "@/components/landing-page/FeaturedSection";
import StepsSection from "@/components/landing-page/StepsSection";
import AboutSection from "@/components/landing-page/AboutSection";
import AppDownloadSection from "@/components/landing-page/AppDownloadSection";
import TestimonialsSection from "@/components/landing-page/TestimonialsSection";
"""

# Insert imports after `"use client";`
text = text.replace('"use client";', '"use client";' + new_imports)

# We need to extract the Recent Bookings section perfectly.
# It starts at `{/* Recent Bookings */}` and ends before the next section ` <section>` or similar.
# Let's extract everything between `{/* Recent Bookings */}` and the next `</section>`.
bookings_start = text.find("{/* Recent Bookings */}")
if bookings_start == -1:
    print("Could not find Recent Bookings")
    exit(1)

bookings_end = text.find("</section>", bookings_start) + len("</section>")
recent_bookings_jsx = text[bookings_start:bookings_end]

# Now, replace the entire return block.
# We need to find `  return (\n    <motion.div` or `  return (\n    <div`
return_start = text.find("  return (")

# Provide the new return block.
new_return = f"""  // Shared state for HeroSection to work properly
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }} 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12"
    >
      <HeroSection
        selectedCategory={{selectedCategory}}
        setSelectedCategory={{setSelectedCategory}}
        router={{router}}
      />
      <TrustSection />
      <ProvidersAndStepsSection router={{router}} />

      {recent_bookings_jsx}

      <FeaturedSection router={{router}} />
      <StepsSection />
      <AboutSection />
      <AppDownloadSection />
      <TestimonialsSection />

      {{/* ===== BOOKING DETAIL MODAL ===== */}}
      {{selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={{() => setSelectedBooking(null)}}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={{(e) => e.stopPropagation()}}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Booking Details
              </h3>
              <button
                onClick={{() => setSelectedBooking(null)}}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={{20}} className="text-gray-500" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl mx-auto mb-3">
                {{selectedBooking.icon}}
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                {{selectedBooking.service}}
              </h4>
              <p className="text-sm text-gray-500">
                {{selectedBooking.provider}}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar size={{18}} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Date & Time</p>
                  <p className="text-sm font-medium text-gray-900">
                    {{selectedBooking.date}}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <CheckCircle size={{18}} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <span
                    className={{`px-2.5 py-1 rounded-full text-xs font-semibold ${{selectedBooking.statusColor}}`}}
                  >
                    {{selectedBooking.status}}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={{() => {{
                  setSelectedBooking(null);
                  setActiveTab("bookings");
                }}}}
                className="px-4 py-2.5 bg-(--color-primary) text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                View in Bookings
              </button>
              <button
                onClick={{() => setSelectedBooking(null)}}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}}
    </motion.div>
  );
}}
"""

# Replace everything from `return (` down to the end of the file.
text = text[:return_start] + new_return

with open("components/client/HomeTab.tsx", "w", encoding="utf-8") as f:
    f.write(text)

