import Link from "next/link";

export default function ReadySection() {
  const handleDownloadApp = () => {
    window.open(
      "https://expo.dev/accounts/goldendove/projects/HANDI/builds",
      "_blank",
    );
  };

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-surface)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-2xl lg:text-3xl mb-3">
          Ready to Get Started?
        </h2>
        <p className="text-[var(--color-secondary)] font-semibold text-lg mb-4">
          Transform Your Service Experience Today
        </p>
        <p className="text-[var(--color-muted)] mb-8 max-w-2xl mx-auto">
          Join the growing list of satisfied customers who have discovered the
          easiest way to book professional services. Your perfect service
          provider is just a click away.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <Link href="/services" className="btn-primary cursor-pointer px-5 py-3 rounded-full">
            Book Your First Service
          </Link>
          <Link href="/features" className="btn-outline cursor-pointer px-5 py-3 rounded-full">
            Explore Features
          </Link>
        </div>

        <p className="text-[var(--color-muted)] text-sm">
          No setup fees • Cancel anytime • 100% satisfaction guaranteed
        </p>
      </div>
    </section>
  );
}
