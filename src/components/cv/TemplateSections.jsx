import React from "react";

const formatDate = (start, end) =>
  start ? `${start} — ${end || "Present"}` : end || "";

// Helper to safely get config values
const getConfig = (config, key, defaultValue) => {
  return config?.[key] ?? defaultValue;
};

// Helper to safely get styles values
const getStyle = (styles, key, defaultValue) => {
  return styles?.[key] ?? defaultValue;
};

export function PhotoSection({ data, config, styles }) {
  const { photo, full_name, target_position } = data;
  const circular = getConfig(config, "circular", false);
  const size = getConfig(config, "size", "large");
  const showName = getConfig(config, "showName", true);
  const showTitle = getConfig(config, "showTitle", true);
  const preview = getStyle(styles, "preview", false);

  const sizeClasses = {
    large: circular ? "w-32 h-32" : "w-24 h-32",
    medium: circular ? "w-24 h-24" : "w-20 h-24",
    small: circular ? "w-16 h-16" : "w-14 h-18",
  };

  // Adjust sizes for preview mode
  const previewSizeClasses = {
    large: circular ? "w-16 h-16" : "w-12 h-16",
    medium: circular ? "w-12 h-12" : "w-10 h-12",
    small: circular ? "w-8 h-8" : "w-14 h-16",
  };

  const actualSizeClasses = preview ? previewSizeClasses : sizeClasses;
  const shapeClass = circular ? "rounded-full" : "rounded-lg";

  return (
    <div className="flex flex-col items-center">
      {photo ? (
        <div
          className={`${actualSizeClasses[size]} ${shapeClass} overflow-hidden bg-blue-500`}
        >
          <img
            src={photo}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className={`${actualSizeClasses[size]} ${shapeClass} bg-gray-300 flex items-center justify-center overflow-hidden`}
        >
          <svg
            className="w-1/2 h-1/2 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      {showName && full_name && (
        <h2 className={`mt-3 font-bold ${preview ? "text-sm" : "text-xl"}`}>
          {full_name}
        </h2>
      )}
      {showTitle && target_position && (
        <p className={`text-gray-600 ${preview ? "text-xs" : "text-sm"}`}>
          {target_position}
        </p>
      )}
    </div>
  );
}

export function HeaderSection({ data, config, styles }) {
  const { full_name, target_position, email, phone, location, linkedin_url } =
    data;
  const layout = getConfig(config, "layout", "centered");
  const showPhoto = getConfig(config, "showPhoto", false);
  const border = getConfig(config, "border", true);
  const preview = getStyle(styles, "preview", false);

  const contactInfo = [email, phone, location, linkedin_url].filter(Boolean);

  if (layout === "centered") {
    return (
      <div
        className={`text-center ${border ? "border-b-2 border-gray-800 pb-4 mb-6" : "mb-6"}`}
      >
        {full_name && (
          <h1 className={`font-bold ${preview ? "text-lg" : "text-3xl"} mb-2`}>
            {full_name}
          </h1>
        )}
        {target_position && (
          <p
            className={`text-gray-600 mb-2 ${preview ? "text-xs" : "text-base"}`}
          >
            {target_position}
          </p>
        )}
        <div className={`text-gray-600 ${preview ? "text-[10px]" : "text-sm"}`}>
          {contactInfo.join(" | ")}
        </div>
      </div>
    );
  }

  if (layout === "horizontal") {
    return (
      <div
        className={`flex gap-4 ${border ? "border-b-2 border-gray-800 pb-4 mb-6" : "mb-6"}`}
      >
        {showPhoto && (
          <PhotoSection
            data={data}
            config={{ size: "small", showName: false, showTitle: false }}
            styles={styles}
          />
        )}
        <div className="flex-1">
          {full_name && (
            <h1
              className={`font-bold ${preview ? "text-base" : "text-2xl"} mb-1`}
            >
              {full_name}
            </h1>
          )}
          {target_position && (
            <p
              className={`text-gray-600 mb-1 ${preview ? "text-xs" : "text-sm"}`}
            >
              {target_position}
            </p>
          )}
          <p
            className={`text-gray-600 mb-2 ${preview ? "text-xs" : "text-sm"}`}
          >
            {contactInfo.join(" | ")}
          </p>
        </div>
      </div>
    );
  }

  if (layout === "vertical") {
    return (
      <div
        className={`${border ? "border-b border-gray-300 pb-4 mb-4" : "mb-4"}`}
      >
        {full_name && (
          <h1 className={`font-bold ${preview ? "text-base" : "text-xl"} mb-1`}>
            {full_name}
          </h1>
        )}
        {target_position && (
          <p className={`text-gray-600 ${preview ? "text-xs" : "text-sm"}`}>
            {target_position}
          </p>
        )}
      </div>
    );
  }

 if (layout === "dark") {
  return (
    <div className="relative bg-slate-700 pt-16 text-white p-6 flex items-center gap-6">
      
      {showPhoto && (
        <div className="absolute mt-6 left-6 top-10">
          {/* top-10 change karo: top-6 / top-14 */}
          <div className="w-20 h-20 m-10 rounded-full overflow-hidden border-2 border-white">
            {data.photo ? (
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-gray-400"></div>
                <img
                  src={data.photo}
                  alt="Profile"
                  className="relative w-full h-full object-cover mix-blend-overlay"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-blue-500 to-gray-400 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      )}

      {/* text center */}
      <div className="text-center flex-1">
        {full_name && (
          <h1 className={`font-bold uppercase tracking-wide ${preview ? "text-lg" : "text-3xl"}`}>
            {full_name}
          </h1>
        )}
        <p className={`mt-1 ${preview ? "text-xs" : "text-base"}`}>
          {target_position || ""}
        </p>
      </div>
    </div>
  );
}


  if (layout === "dark-split") {
    return (
      <div className="relative bg-gradient-to-r from-blue-900 to-gray-600 text-white p-8 flex items-center gap-6 mb-0">
        {showPhoto && (
          <div className="relative">
            <div className={`w-20 h-20 Absolute rounded-full border-4 border-white overflow-hidden bg-gray-300`}>
              {data.photo ? (
                <img
                  src={data.photo}
                  alt="Profile"
                  className="w-full h-full mt-6 object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex-1 text-center">
          {full_name && (
            <h1 className="font-bold uppercase tracking-wider text-2xl text-white">
              {full_name}
            </h1>
          )}
          {target_position && (
            <p className="mt-2 text-gray-200 text-sm uppercase tracking-wide">
              {target_position}
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export function ContactSection({ data, config, styles }) {
  const { email, phone, location, linkedin_url } = data;
  const layout = getConfig(config, "layout", "list");
  const showLabels = getConfig(config, "showLabels", true);
  const preview = getStyle(styles, "preview", false);

  const items = [
    { label: "Phone", value: phone, icon: "📞" },
    { label: "Email", value: email, icon: "✉" },
    { label: "Address", value: location, icon: "📍" },
    { label: "LinkedIn", value: linkedin_url, icon: "🌐" },
  ].filter((item) => item.value);

  if (items.length === 0) return null;

  if (layout === "compact") {
    return (
      <div className={`text-gray-600 ${preview ? "text-[10px]" : "text-sm"}`}>
        {items.map((item, idx) => (
          <span key={item.label}>
            {item.value}
            {idx < items.length - 1 ? " | " : ""}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className={`${preview ? "text-xs" : "text-sm"}`}>
          {showLabels && (
            <span className="font-semibold block">{item.label}</span>
          )}
          <span className="break-all">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function SummarySection({ data, config, styles }) {
  const { summary } = data;
  const title = getConfig(config, "title", "Professional Summary");
  const border = getConfig(config, "border", true);
  const sectionHeaderStyle = getConfig(config, "sectionHeaderStyle", null);
  const preview = getStyle(styles, "preview", false);

  if (!summary) return null;

  // Use custom section header style if provided, otherwise use default
  const headerClass = sectionHeaderStyle || 
    `font-bold ${border ? "border-b border-gray-800 pb-2 mb-3" : "mb-3"} ${preview ? "text-xs" : "text-base"}`;

  return (
    <section className="mb-6">
      <h2 className={headerClass}>
        {title}
      </h2>
      <p
        className={`text-gray-700 leading-relaxed text-justify ${preview ? "text-[10px]" : "text-sm"}`}
      >
        {summary}
      </p>
    </section>
  );
}

export function ExperienceSection({ data, config, styles }) {
  const { experiences = [] } = data;
  const title = getConfig(config, "title", "Professional Experience");
  const layout = getConfig(config, "layout", "standard");
  const maxItems = getConfig(config, "maxItems", 10);
  const showLocation = getConfig(config, "showLocation", true);
  const showCompany = getConfig(config, "showCompany", true);
  const preview = getStyle(styles, "preview", false);

  const validExperiences = experiences
    .filter((e) => e.job_title || e.company)
    .slice(0, maxItems);
  if (validExperiences.length === 0) return null;

  return (
    <section className="mb-6">
      <h2
        className={`font-bold border-b border-gray-800 pb-2 mb-4 ${preview ? "text-xs" : "text-base"}`}
      >
        {title}
      </h2>
      <div className="space-y-4">
        {validExperiences.map((exp, idx) => (
          <div key={idx}>
            {layout === "timeline" ? (
              <div className="relative pl-4 border-l-2 border-gray-300 pb-4">
                <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-gray-700 -ml-1"></div>
                <div className={`font-bold ${preview ? "text-xs" : "text-sm"}`}>
                  {exp.job_title}
                </div>
                {showCompany && (
                  <div
                    className={`text-gray-600 ${preview ? "text-[10px]" : "text-xs"}`}
                  >
                    {exp.company}
                  </div>
                )}
                <div
                  className={`text-gray-500 ${preview ? "text-[10px]" : "text-xs"}`}
                >
                  {formatDate(exp.start_date, exp.end_date)}
                </div>
                {exp.achievements && (
                  <ul
                    className={`list-disc list-outside ml-4 mt-1 text-gray-700 text-justify ${preview ? "text-[10px]" : "text-xs"}`}
                  >
                    {exp.achievements
                      .split("\n")
                      .filter((a) => a.trim())
                      .map((a, i) => (
                        <li key={i} className="mb-1 leading-relaxed">
                          {a.trim()}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-1">
                  <div
                    className={`font-bold ${preview ? "text-xs" : "text-sm"}`}
                  >
                    {exp.job_title}
                  </div>
                  <div
                    className={`text-gray-500 ${preview ? "text-[10px]" : "text-xs"}`}
                  >
                    {formatDate(exp.start_date, exp.end_date)}
                  </div>
                </div>
                {(showCompany || showLocation) && (
                  <div
                    className={`text-gray-600 mb-1 ${preview ? "text-[10px]" : "text-xs"}`}
                  >
                    {[exp.company, exp.location].filter(Boolean).join(", ")}
                  </div>
                )}
                {exp.achievements && (
                  <ul
                    className={`list-disc list-outside ml-5 space-y-1 text-gray-700 text-justify ${preview ? "text-[10px]" : "text-xs"}`}
                  >
                    {exp.achievements
                      .split("\n")
                      .filter((a) => a.trim())
                      .map((a, i) => (
                        <li key={i} className="leading-relaxed">
                          {a.trim()}
                        </li>
                      ))}
                  </ul>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function EducationSection({ data, config, styles }) {
  const { education = [] } = data;
  const title = getConfig(config, "title", "Education");
  const layout = getConfig(config, "layout", "standard");
  const maxItems = getConfig(config, "maxItems", 5);
  const showLocation = getConfig(config, "showLocation", true);
  const preview = getStyle(styles, "preview", false);

  const validEducation = education
    .filter((e) => e.degree || e.university)
    .slice(0, maxItems);
  if (validEducation.length === 0) return null;

  return (
    <section className="mb-6">
      <h2
        className={`font-bold border-b border-gray-800 pb-2 mb-4 ${preview ? "text-xs" : "text-base"}`}
      >
        {title}
      </h2>
      <div className="space-y-3">
        {validEducation.map((edu, idx) => (
          <div
            key={idx}
            className={
              layout === "compact" ? "flex justify-between items-center" : ""
            }
          >
            <div>
              <div className={`font-bold ${preview ? "text-xs" : "text-sm"}`}>
                {edu.degree}
              </div>
              <div
                className={`text-gray-600 ${preview ? "text-[10px]" : "text-xs"}`}
              >
                {edu.university}
                {showLocation && edu.location && `, ${edu.location}`}
              </div>
            </div>
            <div
              className={`text-gray-500 ${preview ? "text-[10px]" : "text-xs"}`}
            >
              {formatDate(edu.start_date, edu.end_date)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SkillsSection({ data, config, styles }) {
  const { skills } = data;
  const title = getConfig(config, "title", "Skills");
  const layout = getConfig(config, "layout", "list");
  const maxItems = getConfig(config, "maxItems", 20);
  const showLevel = getConfig(config, "showLevel", false);
  const preview = getStyle(styles, "preview", false);

  if (!skills) return null;

  const skillList = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, maxItems);
  if (skillList.length === 0) return null;

  return (
    <section className="mb-6">
      <h2
        className={`font-bold border-b border-gray-800 pb-2 mb-3 ${preview ? "text-xs" : "text-base"}`}
      >
        {title}
      </h2>
      {layout === "table" ? (
        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
          {skillList.map((skill, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-2">
              <span
                className={`text-gray-900 ${preview ? "text-[10px]" : "text-xs"}`}
              >
                {skill}
              </span>
              {showLevel && (
                <span
                  className={`text-gray-700 ${preview ? "text-[10px]" : "text-xs"}`}
                >
                  Expert
                </span>
              )}
            </div>
          ))}
        </div>
      ) : layout === "tags" ? (
        <div className="flex flex-wrap gap-2">
          {skillList.map((skill, idx) => (
            <span
              key={idx}
              className={`bg-gray-100 px-2 py-1 rounded text-gray-800 ${preview ? "text-[10px]" : "text-xs"}`}
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className={`text-gray-700 ${preview ? "text-[10px]" : "text-sm"}`}>
          {skillList.join(", ")}
        </p>
      )}
    </section>
  );
}

export function LanguagesSection({ data, config, styles }) {
  const { languages } = data;
  const title = getConfig(config, "title", "Languages");
  const preview = getStyle(styles, "preview", false);

  if (!languages) return null;

  const langList = languages
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);
  if (langList.length === 0) return null;

  return (
    <section className="mb-6">
      <h2
        className={`font-bold border-b border-gray-800 pb-2 mb-3 ${preview ? "text-xs" : "text-base"}`}
      >
        {title}
      </h2>
      <div className="space-y-1">
        {langList.map((lang, idx) => (
          <div
            key={idx}
            className={`text-gray-700 ${preview ? "text-[10px]" : "text-sm"}`}
          >
            • {lang}
          </div>
        ))}
      </div>
    </section>
  );
}

const sectionComponents = {
  photo: PhotoSection,
  header: HeaderSection,
  contact: ContactSection,
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  languages: LanguagesSection,
};

export function renderSection(sectionType, data, config, styles) {
  const Component = sectionComponents[sectionType];
  if (!Component) return null;
  return <Component data={data} config={config} styles={styles} />;
}

export { sectionComponents };
