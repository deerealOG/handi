interface Stat {
  number: string;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
  dark?: boolean;
}

const DEFAULT_STATS: Stat[] = [
  { number: "50,000+", label: "Active Users" },
  { number: "5,000+", label: "Verified Providers" },
  { number: "15+", label: "States Covered" },
  { number: "100,000+", label: "Jobs Completed" },
];

export default function StatsSection({
  stats = DEFAULT_STATS,
  dark = false,
}: StatsSectionProps) {
  return (
    <section
      className={`py-10 px-4 sm:px-6 lg:px-8 ${dark ? "bg-[var(--color-primary)]" : "bg-white"}`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <p
                className={`text-3xl lg:text-4xl font-bold ${dark ? "text-white" : "text-[var(--color-primary)]"}`}
              >
                {stat.number}
              </p>
              <p
                className={`text-sm mt-1 ${dark ? "text-white/80" : "text-gray-600"}`}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
