import type { ResumeComponent } from '@/types/resume';

export const sampleResume: ResumeComponent = {
  id: 'resume-1',
  type: 'resume',
  title: 'John Doe - Software Engineer',
  content: 'Full resume content',
  children: [
    {
      id: 'section-1',
      type: 'section',
      title: 'Work Experience',
      content: 'Professional experience section',
      children: [
        {
          id: 'job-1',
          type: 'job',
          title: 'Senior Software Engineer',
          content: 'Tech Corp, San Francisco, CA',
          metadata: {
            company: 'Tech Corp',
            position: 'Senior Software Engineer',
            dates: 'Jan 2021 - Present',
            location: 'San Francisco, CA',
          },
          children: [
            {
              id: 'bullet-1',
              type: 'bullet',
              title: 'Led development of microservices architecture',
              content: 'Led development of microservices architecture serving 10M+ users, reducing latency by 40%',
            },
            {
              id: 'bullet-2',
              type: 'bullet',
              title: 'Implemented CI/CD pipeline',
              content: 'Implemented CI/CD pipeline using Jenkins and Docker, cutting deployment time from 2 hours to 15 minutes',
            },
            {
              id: 'bullet-3',
              type: 'bullet',
              title: 'Mentored junior developers',
              content: 'Mentored 5 junior developers through code reviews and pair programming sessions',
            },
          ],
        },
        {
          id: 'job-2',
          type: 'job',
          title: 'Software Engineer',
          content: 'StartupXYZ, Austin, TX',
          metadata: {
            company: 'StartupXYZ',
            position: 'Software Engineer',
            dates: 'Jun 2019 - Dec 2020',
            location: 'Austin, TX',
          },
          children: [
            {
              id: 'bullet-4',
              type: 'bullet',
              title: 'Built RESTful APIs',
              content: 'Built RESTful APIs with Node.js and Express, handling 1M+ requests per day',
            },
            {
              id: 'bullet-5',
              type: 'bullet',
              title: 'Optimized database queries',
              content: 'Optimized database queries reducing response time by 60%',
            },
          ],
        },
      ],
    },
    {
      id: 'section-2',
      type: 'section',
      title: 'Education',
      content: 'Educational background',
      children: [
        {
          id: 'job-3',
          type: 'job',
          title: 'B.S. Computer Science',
          content: 'University of California, Berkeley',
          metadata: {
            company: 'University of California, Berkeley',
            position: 'B.S. Computer Science',
            dates: '2015 - 2019',
            location: 'Berkeley, CA',
          },
          children: [
            {
              id: 'bullet-6',
              type: 'bullet',
              title: 'GPA: 3.8/4.0',
              content: 'GPA: 3.8/4.0, Dean\'s List all semesters',
            },
            {
              id: 'bullet-7',
              type: 'bullet',
              title: 'Relevant coursework',
              content: 'Relevant coursework: Data Structures, Algorithms, Machine Learning, Distributed Systems',
            },
          ],
        },
      ],
    },
    {
      id: 'section-3',
      type: 'section',
      title: 'Skills',
      content: 'Technical skills',
      children: [
        {
          id: 'bullet-8',
          type: 'bullet',
          title: 'Programming Languages',
          content: 'JavaScript, TypeScript, Python, Java, Go',
        },
        {
          id: 'bullet-9',
          type: 'bullet',
          title: 'Frameworks & Tools',
          content: 'React, Node.js, Express, Docker, Kubernetes, AWS, PostgreSQL, MongoDB',
        },
      ],
    },
  ],
};

