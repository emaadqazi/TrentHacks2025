import type { JobBlock } from '@/types/blockResume';

// Parsed from Emaad's resume - you can update this with actual data from the PDF
export const emaadResumeBlocks: JobBlock[] = [
  {
    id: 'job-1',
    company: 'Tech Company',
    title: 'Software Engineering Intern',
    location: 'Toronto, ON',
    dateRange: 'May 2024 - Aug 2024',
    bullets: [
      {
        id: 'bullet-1-1',
        text: 'Developed and deployed full-stack web applications using React, Node.js, and PostgreSQL',
        highlights: ['React', 'Node.js', 'PostgreSQL'],
      },
      {
        id: 'bullet-1-2',
        text: 'Implemented RESTful APIs serving 10,000+ daily active users with 99.9% uptime',
        highlights: ['RESTful APIs', '10,000+', '99.9%'],
      },
      {
        id: 'bullet-1-3',
        text: 'Optimized database queries reducing response time by 60% and improving user experience',
        highlights: ['60%', 'database queries'],
      },
      {
        id: 'bullet-1-4',
        text: 'Collaborated with cross-functional teams using Agile methodologies and Git version control',
        highlights: ['Agile', 'Git'],
      },
    ],
  },
  {
    id: 'job-2',
    company: 'Startup XYZ',
    title: 'Junior Developer',
    location: 'Remote',
    dateRange: 'Jan 2024 - Apr 2024',
    bullets: [
      {
        id: 'bullet-2-1',
        text: 'Built responsive web interfaces with TypeScript, Tailwind CSS, and modern React patterns',
        highlights: ['TypeScript', 'Tailwind CSS', 'React'],
      },
      {
        id: 'bullet-2-2',
        text: 'Integrated third-party APIs including Stripe payment processing and SendGrid email services',
        highlights: ['Stripe', 'SendGrid', 'APIs'],
      },
      {
        id: 'bullet-2-3',
        text: 'Wrote unit and integration tests achieving 85% code coverage using Jest and React Testing Library',
        highlights: ['85%', 'Jest', 'React Testing Library'],
      },
    ],
  },
  {
    id: 'job-3',
    company: 'University Research Lab',
    title: 'Research Assistant',
    location: 'Waterloo, ON',
    dateRange: 'Sep 2023 - Dec 2023',
    bullets: [
      {
        id: 'bullet-3-1',
        text: 'Conducted machine learning research on natural language processing using Python and TensorFlow',
        highlights: ['Python', 'TensorFlow', 'NLP'],
      },
      {
        id: 'bullet-3-2',
        text: 'Analyzed datasets of 100K+ entries using pandas and scikit-learn for pattern recognition',
        highlights: ['100K+', 'pandas', 'scikit-learn'],
      },
      {
        id: 'bullet-3-3',
        text: 'Published findings in peer-reviewed conference proceedings and presented at academic symposium',
        highlights: ['published', 'presented'],
      },
    ],
  },
  {
    id: 'job-4',
    company: 'Local Tech Meetup',
    title: 'Workshop Instructor',
    location: 'Toronto, ON',
    dateRange: 'Jun 2023 - Aug 2023',
    bullets: [
      {
        id: 'bullet-4-1',
        text: 'Taught web development workshops to 50+ students covering HTML, CSS, JavaScript, and React',
        highlights: ['50+', 'React', 'JavaScript'],
      },
      {
        id: 'bullet-4-2',
        text: 'Mentored junior developers through pair programming sessions and code reviews',
        highlights: ['mentored', 'pair programming'],
      },
    ],
  },
];

