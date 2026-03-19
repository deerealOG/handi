import re

with open("components/client/HomeTab.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Imports
new_imports = """
import HeroSection from "@/components/landing-page/HeroSection";
import TrustSection from "@/components/landing-page/TrustSection";
import ProvidersAndStepsSection from "@/components/landing-page/ProvidersAndStepsSection";
import FeaturedSection from "@/components/landing-page/FeaturedSection";
import StepsSection from "@/components/landing-page/StepsSection";
import AboutSection from "@/components/landing-page/AboutSection";
import AppDownloadSection from "@/components/landing-page/AppDownloadSection";
import TestimonialsSection from "@/components/landing-page/TestimonialsSection";
import { motion } from "framer-motion";
"""
text = text.replace('"use client";', '"use client";\n' + new_imports)

# 2. Extract Recent Bookings
bookings_start = text.find("{/* Recent Bookings */}")
if bookings_start == -1:
    print("Could not find Recent Bookings")
    exit(1)

bookings_end = text.find("</section>", bookings_start) + len("</section>")
recent_bookings_jsx = text[bookings_start:bookings_end]

# 3. Find HomeTab return start
# We know HomeTab function has `  return (` right before `    <div className="max-w-7xl`
return_start_pattern = r'  return \(\s*<div className="max-w-7xl'
match = re.search(return_start_pattern, text)
if not match:
    print("Could not find HomeTab return statement")
    exit(1)

return_start_idx = match.start()

# 4. Inject new return and shared state
new_return = f"""  // Shared state for HeroSection to work properly
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <motion.div 
      initial={{{{ opacity: 0, y: 10 }}}} 
      animate={{{{ opacity: 1, y: 0 }}}} 
      transition={{{{ duration: 0.4 }}}} 
      className="bg-gray-50 flex flex-col pt-6"
    >
      <HeroSection
        selectedCategory={{selectedCategory}}
        setSelectedCategory={{setSelectedCategory}}
        router={{router}}
      />
      <TrustSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10 space-y-8">
        {{/* Inserted ProvidersAndStepsSection inside wrapper if needed, landing page does not wrap */}}
      </div>
      
      <ProvidersAndStepsSection router={{router}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
{recent_bookings_jsx}
      </div>

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
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto relative"
            onClick={{(e) => e.stopPropagation()}}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Booking Details
              </h3>
              <button
                onClick={{() => setSelectedBooking(null)}}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
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

text = text[:return_start_idx] + new_return

with open("components/client/HomeTab.tsx", "w", encoding="utf-8") as f:
    f.write(text)

