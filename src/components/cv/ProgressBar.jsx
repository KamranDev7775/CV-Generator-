import React, { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { calculateFormProgress } from "@/utils/progressCalculator";
import { CheckCircle2 } from "lucide-react";

export default function ProgressBar({ formData }) {
  const progress = useMemo(
    () => calculateFormProgress(formData),
    [formData]
  );

  const sections = [
    { id: "Basic Information", label: "Basic" },
    { id: "Summary", label: "Summary" },
    { id: "Skills", label: "Skills" },
    { id: "Experience", label: "Experience" },
    { id: "Education", label: "Education" },
    { id: "Languages", label: "Languages" },
    { id: "Settings", label: "Settings" }
  ];

  return (
    <div className="sticky top-0 z-30 backdrop-blur-2xl bg-white/80 border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold tracking-wide text-gray-700">
            CV Completion
          </h3>

          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {progress.percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-6">
          <Progress
            value={progress.percentage}
            className="h-3 bg-gray-200 overflow-hidden"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

        {/* Sections */}
        <div className="flex flex-wrap gap-3">
          {sections.map((section) => {
            const done = progress.completedSections.includes(section.id);

            return (
              <div
                key={section.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all
                  ${
                    done
                      ? "bg-emerald-100 text-emerald-700 shadow-sm hover:shadow-md"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
              >
                {done && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 animate-pulse" />
                )}
                {section.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
