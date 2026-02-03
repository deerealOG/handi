import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] py-12 lg:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-heading text-3xl lg:text-4xl text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-white/80 text-sm">Last updated: February 1, 2026</p>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you
            create an account, make a booking, or contact us for support. This
            may include:
          </p>
          <ul>
            <li>Name and contact information</li>
            <li>Payment and billing information</li>
            <li>Location data for service delivery</li>
            <li>Communications with service providers</li>
            <li>Reviews and ratings you submit</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Connect you with service providers</li>
            <li>Send promotional communications (with your consent)</li>
            <li>Monitor and analyze trends and usage</li>
            <li>Detect, investigate, and prevent fraud</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We share your information with service providers only as necessary
            to complete your bookings. We do not sell your personal information
            to third parties. We may share information:
          </p>
          <ul>
            <li>With service providers to fulfill your bookings</li>
            <li>With payment processors to complete transactions</li>
            <li>When required by law or to protect rights</li>
            <li>With your consent or at your direction</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal
            information from unauthorized access, alteration, disclosure, or
            destruction. This includes encryption, secure servers, and regular
            security audits.
          </p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Export your data in a portable format</li>
          </ul>

          <h2>6. Cookies</h2>
          <p>
            We use cookies and similar technologies to collect information about
            your browsing activities. You can control cookies through your
            browser settings.
          </p>

          <h2>7. Children&apos;s Privacy</h2>
          <p>
            Our services are not directed to individuals under 18. We do not
            knowingly collect personal information from children.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us
            at <a href="mailto:privacy@handi.ng">privacy@handi.ng</a>.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
