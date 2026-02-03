import { Headphones, ShieldCheck, Tag } from "lucide-react";

const BENEFITS = [
  {
    icon: Tag,
    title: "Some Providers offer 20% Off First Booking",
    description: "Most of our providers give new customers instant discount",
    bgColor: "bg-green-50",
  },
  {
    icon: ShieldCheck,
    title: "100% Satisfaction Guarantee",
    description: "Your happiness is our priority",
    bgColor: "bg-green-50",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    description: "We're here whenever you need us",
    bgColor: "bg-green-50",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-16 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="card flex flex-col items-center text-center p-6"
            >
              <div
                className={`w-14 h-14 rounded-xl ${benefit.bgColor} flex items-center justify-center mb-4`}
              >
                <benefit.icon
                  size={24}
                  className="text-[var(--color-primary)]"
                />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                {benefit.title}
              </h3>
              <p className="text-[var(--color-muted)] text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
