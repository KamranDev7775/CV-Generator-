// Sample CV data for template previews
// Provides realistic sample data for each template to showcase how they look

const SAMPLE_EXPERIENCES = [
  {
    job_title: 'Senior Software Engineer',
    company: 'Tech Solutions Inc.',
    location: 'Berlin, Germany',
    start_date: '2020-01',
    end_date: 'Present',
    achievements: 'Led development of microservices architecture serving 1M+ users daily\nReduced system latency by 40% through database optimization and caching strategies\nMentored team of 5 junior developers, conducting weekly code reviews and training sessions\nImplemented CI/CD pipelines using Jenkins and Docker, reducing deployment time by 60%\nArchitected scalable cloud infrastructure on AWS, handling 10x traffic growth\nCollaborated with product managers to define technical requirements for new features'
  },
  {
    job_title: 'Software Developer',
    company: 'Digital Innovations GmbH',
    location: 'Munich, Germany',
    start_date: '2018-06',
    end_date: '2019-12',
    achievements: 'Developed RESTful APIs using Node.js and Express, serving 500K+ requests daily\nCollaborated with cross-functional teams on agile projects using Scrum methodology\nImproved code quality by implementing comprehensive unit testing with 90% coverage\nParticipated in code reviews and technical discussions to maintain high standards\nOptimized database queries resulting in 25% performance improvement\nIntegrated third-party payment systems including Stripe and PayPal'
  },
  {
    job_title: 'Junior Software Developer',
    company: 'StartupTech Berlin',
    location: 'Berlin, Germany',
    start_date: '2017-03',
    end_date: '2018-05',
    achievements: 'Built responsive web applications using React.js and modern JavaScript\nWorked closely with UX/UI designers to implement pixel-perfect interfaces\nParticipated in daily standups and sprint planning meetings\nFixed bugs and implemented new features based on user feedback\nLearned and applied best practices in software development and version control'
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
  },
  {
    degree: 'Certificate in Cloud Computing',
    university: 'AWS Training Center',
    location: 'Online',
    start_date: '2019-01',
    end_date: '2019-03'
  }
];

// Sample references data
const SAMPLE_REFERENCES = [
  {
    name: 'LeAnne Gaines',
    company: 'Dubone Partnership',
    email: 'lgaines@dbp.com',
    phone: '917-988-1212'
  },
  {
    name: 'Jeffrey Ringer',
    company: 'Huntington Associates',
    email: 'jringer@huntingpa.com',
    phone: '267-348-9533'
  },
  {
    name: 'Liam Olsen',
    company: 'Huntington Associates',
    email: 'lolsen@huntingpa.com',
    phone: '913-278-8787'
  }
];

// Simple placeholder photo (1x1 px gray) so previews show a picture even without uploads
const DEFAULT_SAMPLE_PHOTO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7oAT8AAAAASUVORK5CYII=';

// Additional sections for comprehensive CV
const SAMPLE_CERTIFICATIONS = [
  'AWS Certified Solutions Architect',
  'Google Cloud Professional Developer',
  'Certified Scrum Master (CSM)',
  'Docker Certified Associate'
];

const SAMPLE_PROJECTS = [
  {
    name: 'E-commerce Platform Redesign',
    description: 'Led complete redesign of legacy e-commerce platform serving 100K+ users',
    technologies: 'React, Node.js, PostgreSQL, AWS'
  },
  {
    name: 'Real-time Analytics Dashboard',
    description: 'Built real-time analytics dashboard for business intelligence team',
    technologies: 'Vue.js, Python, Redis, WebSocket'
  }
];

const SAMPLE_ACHIEVEMENTS = [
  'Employee of the Year 2022 - Tech Solutions Inc.',
  'Led team that won Best Innovation Award at TechConf 2021',
  'Published 3 technical articles on Medium with 10K+ views',
  'Speaker at Berlin Tech Meetup - "Microservices Best Practices"'
];

// Base sample data structure
const BASE_SAMPLE_DATA = {
  full_name: 'Sarah Johnson',
  target_position: 'Senior Software Engineer',
  location: 'Berlin, Germany',
  email: 'sarah.johnson@email.com',
  phone: '+49 30 1234 5678',
  linkedin_url: 'linkedin.com/in/sarah-johnson',
  photo: null,
  summary: 'Experienced software engineer with 6+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable solutions for high-traffic applications serving millions of users. Passionate about clean code, agile methodologies, and mentoring junior developers. Strong background in microservices architecture, DevOps practices, and modern web technologies. Committed to continuous learning and staying current with industry trends.',
  skills: 'JavaScript, TypeScript, React, Vue.js, Node.js, Python, Java, AWS, Docker, Kubernetes, PostgreSQL, MongoDB, Redis, Git, CI/CD, Microservices, RESTful APIs, GraphQL, Jest, Cypress, Agile/Scrum',
  experiences: SAMPLE_EXPERIENCES,
  education: SAMPLE_EDUCATION,
  languages: 'English (Native), German (C1), French (B2), Spanish (A2)',
  references: SAMPLE_REFERENCES,
  target_country: 'Germany',
  seniority_level: 'Senior',
  job_description: '',
  style: 'professional',
  certifications: SAMPLE_CERTIFICATIONS,
  projects: SAMPLE_PROJECTS,
  achievements: SAMPLE_ACHIEVEMENTS
};

// Template-specific sample data variations
const TEMPLATE_SAMPLE_DATA = {
  classic: {
    ...BASE_SAMPLE_DATA,
    template: 'classic',
    full_name: 'Alexandra Martinez',
    target_position: 'Senior Product Manager',
    location: 'Munich, Germany',
    email: 'alexandra.martinez@email.com',
    phone: '+49 89 1234 5678',
    linkedin_url: 'linkedin.com/in/alexandra-martinez',
    summary: 'Strategic product manager with 8+ years of expertise in B2B SaaS platforms and enterprise software solutions. Successfully launched 5 major products generating €12M+ in annual revenue. Strong background in user research, data analysis, market validation, and cross-functional team leadership. Proven ability to translate complex business requirements into actionable product roadmaps. Expert in agile methodologies, A/B testing, and customer-centric product development.',
    skills: 'Product Strategy, Roadmap Planning, User Research, Data Analysis, A/B Testing, Agile/Scrum, Jira, Confluence, SQL, Tableau, Figma, Wireframing, Market Research, Competitive Analysis, Stakeholder Management',
    experiences: [
      {
        job_title: 'Senior Product Manager',
        company: 'Enterprise Solutions GmbH',
        location: 'Munich, Germany',
        start_date: '2020-03',
        end_date: 'Present',
        achievements: 'Led product strategy for B2B platform serving 50K+ enterprise users\nIncreased user engagement by 45% through data-driven feature optimization\nManaged cross-functional team of 12 including engineers, designers, and analysts\nLaunched 3 major product features resulting in 30% revenue increase\nConducted extensive user research and usability testing with 200+ participants\nDeveloped comprehensive product roadmaps aligned with business objectives'
      },
      {
        job_title: 'Product Manager',
        company: 'TechStart Munich',
        location: 'Munich, Germany',
        start_date: '2018-01',
        end_date: '2020-02',
        achievements: 'Managed product lifecycle from conception to launch for SaaS platform\nCollaborated with engineering team to deliver features on time and within budget\nAnalyzed user behavior data to identify optimization opportunities\nIncreased customer retention rate by 25% through improved onboarding flow\nWorked closely with sales and marketing teams to align product messaging'
      }
    ],
    photo: null
  },
  modern: {
    ...BASE_SAMPLE_DATA,
    template: 'modern',
    full_name: 'Sarah Johnson',
    target_position: 'Senior Full-Stack Developer',
    summary: 'Innovative full-stack developer with 7+ years of experience building scalable web applications and cloud-native solutions. Expert in modern JavaScript frameworks, microservices architecture, and DevOps practices. Passionate about creating efficient, maintainable code and mentoring development teams. Strong track record of delivering high-quality software solutions that drive business growth and enhance user experience.',
    experiences: [
      ...SAMPLE_EXPERIENCES,
      {
        job_title: 'Full-Stack Developer Intern',
        company: 'Innovation Labs',
        location: 'Berlin, Germany',
        start_date: '2016-06',
        end_date: '2017-02',
        achievements: 'Developed web applications using HTML5, CSS3, and JavaScript\nLearned modern development practices and version control with Git\nContributed to open-source projects and gained experience in collaborative development\nAssisted senior developers with debugging and testing procedures'
      }
    ]
  },
  minimal: {
    ...BASE_SAMPLE_DATA,
    template: 'minimal',
    full_name: 'James Chen',
    target_position: 'Senior UX/UI Designer',
    location: 'Hamburg, Germany',
    email: 'james.chen@email.com',
    phone: '+49 40 1234 5678',
    linkedin_url: 'linkedin.com/in/james-chen-design',
    summary: 'Creative UX/UI designer with 6+ years of experience specializing in digital products and user-centered design. Expert in creating intuitive interfaces for web and mobile applications across fintech, e-commerce, and healthcare sectors. Strong portfolio demonstrating proficiency in design thinking, user research, prototyping, and design systems. Passionate about accessibility and inclusive design practices.',
    skills: 'User Experience Design, User Interface Design, Figma, Sketch, Adobe Creative Suite, Prototyping, Wireframing, User Research, Usability Testing, Design Systems, HTML/CSS, JavaScript, Responsive Design, Accessibility',
    experiences: [
      {
        job_title: 'Senior UX/UI Designer',
        company: 'Digital Design Studio',
        location: 'Hamburg, Germany',
        start_date: '2021-02',
        end_date: 'Present',
        achievements: 'Lead designer for 5+ major client projects with budgets exceeding €500K\nDesigned user interfaces for mobile apps with 1M+ downloads\nConducted user research sessions with 100+ participants across different demographics\nCreated comprehensive design systems used by 3 development teams\nImproved user conversion rates by 35% through iterative design optimization\nMentored 2 junior designers and established design review processes'
      },
      {
        job_title: 'UX/UI Designer',
        company: 'FinTech Solutions',
        location: 'Hamburg, Germany',
        start_date: '2019-06',
        end_date: '2021-01',
        achievements: 'Designed user-friendly interfaces for financial applications\nCollaborated with product managers to define user requirements\nCreated interactive prototypes for user testing and stakeholder presentations\nImproved app usability scores by 40% through design iterations\nWorked closely with developers to ensure design implementation accuracy'
      }
    ]
  },
  executive: {
    ...BASE_SAMPLE_DATA,
    template: 'executive',
    full_name: 'Dr. Michael Anderson',
    target_position: 'Chief Technology Officer',
    location: 'Frankfurt, Germany',
    email: 'michael.anderson@email.com',
    phone: '+49 69 1234 5678',
    linkedin_url: 'linkedin.com/in/dr-michael-anderson',
    photo: null,
    summary: 'Visionary technology executive with 18+ years of experience leading engineering organizations and driving digital transformation initiatives. Proven track record of scaling technology teams from 10 to 200+ engineers while maintaining high performance standards. Expert in enterprise architecture, cloud migration strategies, and emerging technologies. Successfully led 3 companies through IPO preparation and 2 successful exits totaling €500M+. Strong background in building innovative products that disrupt traditional industries.',
    experiences: [
      {
        job_title: 'Chief Technology Officer',
        company: 'Enterprise Tech Corp',
        location: 'Frankfurt, Germany',
        start_date: '2019-01',
        end_date: 'Present',
        achievements: 'Led technology strategy for €2B+ enterprise software company\nScaled engineering organization from 50 to 200+ engineers across 4 countries\nDrove cloud migration initiative saving €5M+ annually in infrastructure costs\nImplemented DevOps practices reducing deployment time from weeks to hours\nEstablished innovation labs resulting in 3 patent applications\nLed technical due diligence for 2 major acquisitions worth €100M+'
      },
      {
        job_title: 'VP of Engineering',
        company: 'Growth Ventures',
        location: 'Berlin, Germany',
        start_date: '2015-03',
        end_date: '2018-12',
        achievements: 'Built and managed engineering teams for 3 portfolio companies\nLed technical architecture decisions for scalable SaaS platforms\nImplemented agile development processes across all engineering teams\nMentored 15+ senior engineers who later became technical leaders\nDrove successful exit of 2 companies with combined valuation of €200M+'
      }
    ]
  },
  creative: {
    ...BASE_SAMPLE_DATA,
    template: 'creative',
    full_name: 'RICHARD SANCHEZ',
    target_position: 'CREATIVE MARKETING DIRECTOR',
    location: 'COLOGNE, GERMANY',
    email: 'richard.sanchez@email.com',
    phone: '+49 221 1234 5678',
    linkedin_url: 'linkedin.com/in/richard-sanchez-creative',
    summary: 'DYNAMIC MARKETING PROFESSIONAL WITH 10+ YEARS OF EXPERIENCE IN DIGITAL MARKETING, BRAND STRATEGY, AND CREATIVE CAMPAIGN MANAGEMENT. PROVEN TRACK RECORD OF INCREASING BRAND AWARENESS BY 200% AND DRIVING REVENUE GROWTH THROUGH INNOVATIVE MARKETING INITIATIVES. EXPERT IN MULTI-CHANNEL MARKETING, CONTENT CREATION, AND PERFORMANCE ANALYTICS. PASSIONATE ABOUT CREATING COMPELLING BRAND STORIES THAT RESONATE WITH TARGET AUDIENCES.',
    skills: 'DIGITAL MARKETING, BRAND STRATEGY, CONTENT MARKETING, SOCIAL MEDIA MARKETING, SEO/SEM, GOOGLE ADS, FACEBOOK ADS, EMAIL MARKETING, MARKETING AUTOMATION, ANALYTICS, PHOTOSHOP, ILLUSTRATOR, VIDEO EDITING, COPYWRITING',
    experiences: [
      {
        job_title: 'CREATIVE MARKETING DIRECTOR',
        company: 'BRAND INNOVATIONS AGENCY',
        location: 'COLOGNE, GERMANY',
        start_date: '2020-06',
        end_date: 'PRESENT',
        achievements: 'LED CREATIVE STRATEGY FOR 20+ MAJOR BRAND CAMPAIGNS WITH BUDGETS EXCEEDING €2M\nINCREASED CLIENT BRAND AWARENESS BY AVERAGE OF 150% ACROSS ALL CAMPAIGNS\nMANAGED CREATIVE TEAM OF 12 INCLUDING DESIGNERS, COPYWRITERS, AND VIDEO PRODUCERS\nDEVELOPED AWARD-WINNING CAMPAIGNS THAT WON 3 INDUSTRY RECOGNITION AWARDS\nIMPLEMENTED DATA-DRIVEN MARKETING STRATEGIES RESULTING IN 40% ROI IMPROVEMENT\nESTABLISHED CREATIVE PROCESSES THAT REDUCED CAMPAIGN DEVELOPMENT TIME BY 30%'
      },
      {
        job_title: 'SENIOR MARKETING MANAGER',
        company: 'DIGITAL GROWTH COMPANY',
        location: 'DÜSSELDORF, GERMANY',
        start_date: '2017-09',
        end_date: '2020-05',
        achievements: 'MANAGED MULTI-CHANNEL MARKETING CAMPAIGNS FOR B2B AND B2C CLIENTS\nINCREASED LEAD GENERATION BY 180% THROUGH OPTIMIZED DIGITAL STRATEGIES\nDEVELOPED CONTENT MARKETING PROGRAMS THAT GENERATED 500K+ ORGANIC VIEWS\nCOLLABORATED WITH SALES TEAMS TO ALIGN MARKETING EFFORTS WITH REVENUE GOALS\nIMPLEMENTED MARKETING AUTOMATION SYSTEMS IMPROVING EFFICIENCY BY 50%'
      }
    ]
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
 * Always shows template structure even with minimal data
 * @param {Object} formData - User's form data
 * @param {string} templateId - Current template ID
 * @returns {Object} Merged data for preview
 */
export function mergeDataForPreview(formData, templateId) {
  const sampleData = getSampleDataForTemplate(templateId);
  
  if (!formData || Object.keys(formData).length === 0) {
    return sampleData;
  }
  
  // Helper to check if a string field has user content
  const hasContent = (value) => value && value.trim() !== '';
  
  // Helper to check if array has meaningful content
  const hasArrayContent = (arr, checkFields) => {
    return arr && arr.length > 0 && arr.some(item => 
      checkFields.some(field => hasContent(item[field]))
    );
  };
  
  // Merge: use user data if exists and has content, otherwise use sample data
  // This ensures the preview always shows the template structure
  return {
    full_name: hasContent(formData.full_name) ? formData.full_name : sampleData.full_name,
    target_position: hasContent(formData.target_position) ? formData.target_position : sampleData.target_position,
    location: hasContent(formData.location) ? formData.location : sampleData.location,
    email: hasContent(formData.email) ? formData.email : sampleData.email,
    phone: hasContent(formData.phone) ? formData.phone : sampleData.phone,
    linkedin_url: hasContent(formData.linkedin_url) ? formData.linkedin_url : sampleData.linkedin_url,
    summary: hasContent(formData.summary) ? formData.summary : sampleData.summary,
    skills: hasContent(formData.skills) ? formData.skills : sampleData.skills,
    // For arrays, show sample data if user's array is empty or has no valid entries
    experiences: hasArrayContent(formData.experiences, ['job_title', 'company'])
      ? formData.experiences
      : sampleData.experiences,
    education: hasArrayContent(formData.education, ['degree', 'university'])
      ? formData.education
      : sampleData.education,
    languages: hasContent(formData.languages) ? formData.languages : sampleData.languages,
    target_country: formData.target_country || sampleData.target_country,
    seniority_level: formData.seniority_level || sampleData.seniority_level,
    job_description: formData.job_description || '',
    template: formData.template || templateId,
    style: formData.style || sampleData.style,
    cover_letter: formData.cover_letter || null,
    references: hasArrayContent(formData.references, ['name', 'company']) 
      ? formData.references 
      : sampleData.references || [],
    // Additional fields for comprehensive CV
    certifications: formData.certifications && formData.certifications.length > 0 
      ? formData.certifications 
      : sampleData.certifications || [],
    projects: hasArrayContent(formData.projects, ['name', 'description'])
      ? formData.projects
      : sampleData.projects || [],
    achievements: formData.achievements && formData.achievements.length > 0
      ? formData.achievements
      : sampleData.achievements || [],
    photo: formData.photo || sampleData.photo
  };
}

export default {
  getSampleDataForTemplate,
  hasUserData,
  mergeDataForPreview
};

