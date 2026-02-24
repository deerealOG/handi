import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] py-12 lg:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-heading text-3xl lg:text-4xl text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-white/80 text-sm">Last updated: February 1, 2026</p>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using HANDI&apos;s services, you agree to be bound
            by these Terms of Service and all applicable laws and regulations.
            If you do not agree with any of these terms, you are prohibited from
            using or accessing this site.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the
            materials on HANDI&apos;s platform for personal, non-commercial
            transitory viewing only. This is the grant of a license, not a
            transfer of title.
          </p>
          <p>Under this license you may not:</p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software</li>
            <li>Remove any copyright or other proprietary notations</li>
            <li>Transfer the materials to another person</li>
          </ul>

          <h2>3. Service Provider Terms</h2>
          <p>Service providers on our platform agree to:</p>
          <ul>
            <li>
              Provide accurate and truthful information about their services
            </li>
            <li>Maintain appropriate licenses and certifications</li>
            <li>Deliver services as described in their listings</li>
            <li>Honor bookings and cancellation policies</li>
            <li>Maintain professional conduct at all times</li>
          </ul>

          <h2>4. User Conduct</h2>
          <p>
            Users of the platform agree to use services responsibly and treat
            service providers with respect. Any form of harassment, abuse, or
            fraudulent activity will result in immediate account termination.
          </p>

          <h2>5. Payment Terms</h2>
          <p>
            All payments are processed securely through our platform. Service
            providers receive payment within 3-5 business days after service
            completion. Refunds are subject to our refund policy.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            HANDI shall not be liable for any damages that result from the use
            of, or the inability to use, the materials on HANDI&apos;s platform,
            even if HANDI has been notified orally or in writing of the
            possibility of such damage.
          </p>

          <h2>7. Modifications</h2>
          <p>
            HANDI may revise these terms of service at any time without notice.
            By using this platform you are agreeing to be bound by the then
            current version of these terms of service.
          </p>

          <h2>8. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
            <a href="mailto:legal@handiapp.com.ng" className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors">legal@handiapp.com.ng</a>.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
