import React, { useMemo } from 'react';
import { Progress } from "@/components/ui/progress";
import { calculateFormProgress } from '@/utils/progressCalculator';
import { CheckCircle2, Circle } from 'lucide-react';

export default function ProgressBar({ formData }) {
  const progress = useMemo(() => {
    return calculateFormProgress(formData);
  }, [formData]);

  const sections = [
    { id: 'Basic Information', label: 'Basic Info' },
    { id: 'Summary', label: 'Summary' },
    { id: 'Skills', label: 'Skills' },
    { id: 'Experience', label: 'Experience' },
    { id: 'Education', label: 'Education' },
    { id: 'Languages', label: 'Languages' },
    { id: 'Settings', label: 'Settings' }
  ];

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24 py-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Form Completion
            </span>
            <span className="text-sm font-semibold text-black">
              {progress.percentage}%
            </span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>

        {/* Section Indicators */}
        <div className="flex flex-wrap gap-4 text-xs">
          {sections.map((section) => {
            const isComplete = progress.completedSections.includes(section.id);
            return (
              <div
                key={section.id}
                className="flex items-center gap-1.5"
                title={section.id}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-300" />
                )}
                <span
                  className={
                    isComplete
                      ? 'text-green-700 font-medium'
                      : 'text-gray-500'
                  }
                >
                  {section.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

