// Progress calculator for CV form completion
// Calculates completion percentage and identifies completed/incomplete sections

const SECTION_WEIGHTS = {
  basicInfo: 18,      // name, email, phone, location
  summary: 12,        // summary
  skills: 10,         // skills
  experience: 15,    // per experience entry (max 2 entries = 30%)
  education: 10,      // per education entry (max 2 entries = 20%)
  languages: 10,      // languages
  settings: 0         // template, style, country, seniority (not counted in progress)
};

/**
 * Check if a field has a value
 */
function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Check if basic info section is complete
 */
function isBasicInfoComplete(formData) {
  const hasName = hasValue(formData.full_name);
  const hasEmail = hasValue(formData.email);
  const hasPhone = hasValue(formData.phone);
  const hasLocation = hasValue(formData.location);
  
  // At least name and email are required
  return hasName && hasEmail;
}

/**
 * Check if summary is complete
 */
function isSummaryComplete(formData) {
  return hasValue(formData.summary);
}

/**
 * Check if skills are complete
 */
function isSkillsComplete(formData) {
  return hasValue(formData.skills);
}

/**
 * Check if experiences are complete
 */
function getExperienceCompletion(formData) {
  if (!formData.experiences || formData.experiences.length === 0) {
    return { count: 0, total: 0 };
  }
  
  const validExperiences = formData.experiences.filter(exp => {
    return hasValue(exp.job_title) || hasValue(exp.company);
  });
  
  // Cap both count and total at 2 (max 2 entries count toward progress)
  const cappedCount = Math.min(validExperiences.length, 2);
  const cappedTotal = Math.min(formData.experiences.length, 2);
  
  return {
    count: cappedCount,
    total: cappedTotal
  };
}

/**
 * Check if education is complete
 */
function getEducationCompletion(formData) {
  if (!formData.education || formData.education.length === 0) {
    return { count: 0, total: 0 };
  }
  
  const validEducation = formData.education.filter(edu => {
    return hasValue(edu.degree) || hasValue(edu.university);
  });
  
  // Cap both count and total at 2 (max 2 entries count toward progress)
  const cappedCount = Math.min(validEducation.length, 2);
  const cappedTotal = Math.min(formData.education.length, 2);
  
  return {
    count: cappedCount,
    total: cappedTotal
  };
}

/**
 * Check if languages are complete
 */
function isLanguagesComplete(formData) {
  return hasValue(formData.languages);
}

/**
 * Check if settings are complete
 */
function isSettingsComplete(formData) {
  return hasValue(formData.template) && 
         hasValue(formData.style) && 
         hasValue(formData.target_country) && 
         hasValue(formData.seniority_level);
}

/**
 * Calculate form completion progress
 * @param {Object} formData - Current form data
 * @returns {Object} Progress information
 */
export function calculateFormProgress(formData) {
  if (!formData) {
    return {
      percentage: 0,
      completedSections: [],
      incompleteSections: [
        'Basic Information',
        'Summary',
        'Skills',
        'Experience',
        'Education',
        'Languages',
        'Settings'
      ]
    };
  }

  const completedSections = [];
  const incompleteSections = [];
  let totalPercentage = 0;

  // Basic Info (20%)
  if (isBasicInfoComplete(formData)) {
    completedSections.push('Basic Information');
    totalPercentage += SECTION_WEIGHTS.basicInfo;
  } else {
    incompleteSections.push('Basic Information');
  }

  // Summary (15%)
  if (isSummaryComplete(formData)) {
    completedSections.push('Summary');
    totalPercentage += SECTION_WEIGHTS.summary;
  } else {
    incompleteSections.push('Summary');
  }

  // Skills (10%)
  if (isSkillsComplete(formData)) {
    completedSections.push('Skills');
    totalPercentage += SECTION_WEIGHTS.skills;
  } else {
    incompleteSections.push('Skills');
  }

  // Experience (15% per entry, max 30%)
  const expCompletion = getExperienceCompletion(formData);
  if (expCompletion.total > 0) {
    const expPercentage = (expCompletion.count / expCompletion.total) * SECTION_WEIGHTS.experience * 2; // *2 because max is 30% (2 entries)
    totalPercentage += expPercentage;
    if (expCompletion.count > 0) {
      completedSections.push('Experience');
    } else {
      incompleteSections.push('Experience');
    }
  } else {
    incompleteSections.push('Experience');
  }

  // Education (10% per entry, max 20%)
  const eduCompletion = getEducationCompletion(formData);
  if (eduCompletion.total > 0) {
    const eduPercentage = (eduCompletion.count / eduCompletion.total) * SECTION_WEIGHTS.education * 2; // *2 because max is 20% (2 entries)
    totalPercentage += eduPercentage;
    if (eduCompletion.count > 0) {
      completedSections.push('Education');
    } else {
      incompleteSections.push('Education');
    }
  } else {
    incompleteSections.push('Education');
  }

  // Languages (10%)
  if (isLanguagesComplete(formData)) {
    completedSections.push('Languages');
    totalPercentage += SECTION_WEIGHTS.languages;
  } else {
    incompleteSections.push('Languages');
  }

  // Settings (10%)
  if (isSettingsComplete(formData)) {
    completedSections.push('Settings');
    totalPercentage += SECTION_WEIGHTS.settings;
  } else {
    incompleteSections.push('Settings');
  }

  // Cap percentage at 100% to prevent overflow
  const cappedPercentage = Math.min(Math.round(totalPercentage), 100);
  
  return {
    percentage: cappedPercentage,
    completedSections,
    incompleteSections
  };
}

export default {
  calculateFormProgress
};

