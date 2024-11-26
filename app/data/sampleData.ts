import { CVData } from '../types/cv';

export const sampleData: CVData = {
  contactInfo: {
    name: 'John Doe',
    title: 'Senior Software Engineer',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe'
  },
  summary: 'Experienced software engineer with a strong background in web development and distributed systems. Passionate about creating scalable solutions and mentoring junior developers.',
  skills: [
    { name: 'JavaScript/TypeScript', level: 'Expert' },
    { name: 'React', level: 'Expert' },
    { name: 'Node.js', level: 'Advanced' },
    { name: 'Python', level: 'Advanced' },
    { name: 'AWS', level: 'Intermediate' },
    { name: 'Docker', level: 'Advanced' }
  ],
  experiences: [
    {
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      startDate: '2020-01',
      endDate: 'Present',
      responsibilities: [
        'Led a team of 5 developers in building a microservices architecture',
        'Improved system performance by 40% through optimization',
        'Mentored junior developers and conducted code reviews'
      ],
      technologies: ['React', 'Node.js', 'TypeScript', 'AWS']
    }
  ],
  certificates: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023'
    }
  ],
  courses: [
    {
      name: 'Advanced TypeScript',
      platform: 'Frontend Masters',
      completionDate: '2023'
    }
  ],
  education: [
    {
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      major: 'Computer Science',
      graduationYear: '2018',
      gpa: '3.8',
      activities: [
        'President of Computer Science Club',
        'Undergraduate Research Assistant',
        'Dean\'s List (All Semesters)'
      ]
    }
  ]
};
