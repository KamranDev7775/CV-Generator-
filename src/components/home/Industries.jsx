const roles = [
  "Consulting", "Finance", "Banking", "Technology", "Engineering",
  "Public sector", "Aviation", "Automotive", "Pharma", "Retail", "Energy", "Startups"
];

export default function Industries() {
  return (
    <section className="text-center py-16 sm:py-20 md:py-24 px-4">
      <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">INDUSTRIES</span>
      <h2 className="text-3xl sm:text-4xl font-semibold mt-4">
        Suitable for <span className="text-primary">roles</span>
      </h2>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-8 sm:mt-10 max-w-3xl mx-auto">
        {roles.map(r => (
          <span key={r} className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-full text-xs sm:text-sm">
            {r}
          </span>
        ))}
      </div>
    </section>
  );
}
