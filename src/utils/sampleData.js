// Sample CV data for template previews
// Provides realistic sample data for each template to showcase how they look

const SAMPLE_EXPERIENCES = [
  {
    job_title: 'Senior Software Engineer',
    company: 'Tech Solutions Inc.',
    location: 'Berlin, Germany',
    start_date: '2020-01',
    end_date: 'Present',
    achievements: 'Led development of microservices architecture serving 1M+ users\nReduced system latency by 40% through optimization\nMentored team of 5 junior developers\nImplemented CI/CD pipelines reducing deployment time by 60%'
  },
  {
    job_title: 'Software Developer',
    company: 'Digital Innovations GmbH',
    location: 'Munich, Germany',
    start_date: '2018-06',
    end_date: '2019-12',
    achievements: 'Developed RESTful APIs using Node.js and Express\nCollaborated with cross-functional teams on agile projects\nImproved code quality by implementing unit testing\nParticipated in code reviews and technical discussions'
  }
];

const SAMPLE_EDUCATION = [
  {
    degree: 'Master of Science in Computer Science',
    university: 'Technical University of Munich',
    location: 'Munich, Germany',
    start_date: '2016-10',
    end_date: '2018-09'
  },
  {
    degree: 'Bachelor of Science in Software Engineering',
    university: 'University of Applied Sciences',
    location: 'Berlin, Germany',
    start_date: '2013-10',
    end_date: '2016-09'
  }
];

// Base sample data structure
const BASE_SAMPLE_DATA = {
  full_name: 'Sarah Johnson',
  target_position: 'Senior Software Engineer',
  location: 'Berlin, Germany',
  email: 'sarah.johnson@email.com',
  phone: '+49 30 1234 5678',
  linkedin_url: 'linkedin.com/in/sarah-johnson',
  summary: 'Experienced software engineer with 6+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable solutions for high-traffic applications. Passionate about clean code, agile methodologies, and mentoring junior developers.',
  skills: 'JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes, PostgreSQL, MongoDB, Git, CI/CD, Microservices, RESTful APIs',
  experiences: SAMPLE_EXPERIENCES,
  education: SAMPLE_EDUCATION,
  languages: 'English (Native), German (C1), French (B2)',
  target_country: 'Germany',
  seniority_level: 'Senior',
  job_description: '',
  style: 'professional'
};

// Template-specific sample data variations
const TEMPLATE_SAMPLE_DATA = {
  classic: {
    ...BASE_SAMPLE_DATA,
    template: 'classic'
  },
  modern: {
    ...BASE_SAMPLE_DATA,
    template: 'modern',
    full_name: 'Alexandra Martinez',
    target_position: 'Product Manager',
    summary: 'Strategic product manager with expertise in B2B SaaS platforms. Successfully launched 3 major products generating €5M+ in revenue. Strong background in user research, data analysis, and cross-functional collaboration.'
  },
  minimal: {
    ...BASE_SAMPLE_DATA,
    template: 'minimal',
    full_name: 'James Chen',
    target_position: 'UX Designer',
    summary: 'Creative UX designer specializing in digital products and user experience. 5+ years designing intuitive interfaces for web and mobile applications. Strong portfolio in fintech and e-commerce.'
  },
  executive: {
    ...BASE_SAMPLE_DATA,
    template: 'executive',
    full_name: 'Dr. Michael Anderson',
    target_position: 'Chief Technology Officer',
    summary: 'Technology executive with 15+ years of experience leading engineering teams and driving innovation. Expertise in scaling startups, building high-performance teams, and delivering enterprise-grade solutions. Track record of successful exits and IPO preparation.'
  },
  compact: {
    ...BASE_SAMPLE_DATA,
    template: 'compact',
    full_name: 'Emma Thompson',
    target_position: 'Data Scientist',
    summary: 'Data scientist specializing in machine learning and predictive analytics. Expert in Python, R, and cloud ML platforms. Published researcher with 10+ papers in top-tier conferences.'
  },
  sidebar: {
    ...BASE_SAMPLE_DATA,
    template: 'sidebar',
    full_name: 'David Rodriguez',
    target_position: 'Business Development Manager',
    summary: 'Results-driven business development professional with expertise in B2B sales and strategic partnerships. Successfully closed deals worth €10M+ and built relationships with Fortune 500 companies. Strong background in SaaS and enterprise software.'
  },
  // mercury: {
  //   ...BASE_SAMPLE_DATA,
  //   template: 'mercury',
  //   full_name: 'David Rodriguez',
  //   target_position: 'Business Development Manager',
  //   summary: 'Results-driven business development professional with expertise in B2B sales and strategic partnerships. Successfully closed deals worth €10M+ and built relationships with Fortune 500 companies. Strong background in SaaS and enterprise software.'
  // },
  finance: {
    ...BASE_SAMPLE_DATA,
    template: 'finance',
    full_name: 'Lisa Wang',
    target_position: 'Financial Analyst',
    summary: 'Analytical financial professional with expertise in financial modeling, risk analysis, and strategic planning. Strong background in investment banking and corporate finance. CFA Level II candidate with proven track record in portfolio management.'
  },
  steadyForm: {
    ...BASE_SAMPLE_DATA,
    template: 'steadyForm',
    full_name: 'Robert Schmidt',
    target_position: 'Project Manager',
    summary: 'Certified project manager (PMP) with 8+ years of experience managing complex IT projects. Expertise in agile methodologies, stakeholder management, and risk mitigation. Successfully delivered 20+ projects on time and within budget.'
  }
};

/**
 * Get sample data for a specific template
 * @param {string} templateId - The template ID
 * @returns {Object} Sample CV data for the template
 */
export function getSampleDataForTemplate(templateId) {
  return TEMPLATE_SAMPLE_DATA[templateId] || TEMPLATE_SAMPLE_DATA.classic;
}

/**
 * Check if form data has user input (not just sample data)
 * @param {Object} formData - Current form data
 * @param {string} templateId - Current template ID
 * @returns {boolean} True if form has user data
 */
export function hasUserData(formData, templateId) {
  if (!formData) return false;
  
  const sampleData = getSampleDataForTemplate(templateId);
  
  // Check if key fields differ from sample data
  if (formData.full_name && formData.full_name !== sampleData.full_name) {
    return true;
  }
  if (formData.email && formData.email !== sampleData.email) {
    return true;
  }
  if (formData.phone && formData.phone !== sampleData.phone) {
    return true;
  }
  
  return false;
}

/**
 * Merge user data with sample data for preview
 * Shows sample data for empty fields, user data for filled fields
 * @param {Object} formData - User's form data
 * @param {string} templateId - Current template ID
 * @returns {Object} Merged data for preview
 */
export function mergeDataForPreview(formData, templateId) {
  const sampleData = getSampleDataForTemplate(templateId);
  
  if (!formData || Object.keys(formData).length === 0) {
    return sampleData;
  }
  
  // Merge: use user data if exists, otherwise use sample data
  return {
    full_name: formData.full_name || sampleData.full_name,
    target_position: formData.target_position || sampleData.target_position,
    location: formData.location || sampleData.location,
    email: formData.email || sampleData.email,
    phone: formData.phone || sampleData.phone,
    linkedin_url: formData.linkedin_url || sampleData.linkedin_url,
    summary: formData.summary || sampleData.summary,
    skills: formData.skills || sampleData.skills,
    experiences: formData.experiences && formData.experiences.length > 0 && formData.experiences.some(exp => exp.job_title || exp.company)
      ? formData.experiences
      : sampleData.experiences,
    education: formData.education && formData.education.length > 0 && formData.education.some(edu => edu.degree || edu.university)
      ? formData.education
      : sampleData.education,
    languages: formData.languages || sampleData.languages,
    target_country: formData.target_country || sampleData.target_country,
    seniority_level: formData.seniority_level || sampleData.seniority_level,
    job_description: formData.job_description || sampleData.job_description,
    template: formData.template || templateId,
    style: formData.style || sampleData.style,
    cover_letter: formData.cover_letter || null
  };
}

export default {
  getSampleDataForTemplate,
  hasUserData,
  mergeDataForPreview
};

