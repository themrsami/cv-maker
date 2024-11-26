export interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  responsibilities: string[];
  technologies: string[];
}

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
}

export interface Course {
  name: string;
  platform: string;
  completionDate: string;
}

export interface Education {
  institution: string;
  degree: string;
  major: string;
  graduationYear: string;
  gpa?: string;
  activities?: string[];
}

export interface CVData {
  contactInfo: ContactInfo;
  summary: string;
  skills: Skill[];
  experiences: Experience[];
  certificates: Certificate[];
  courses: Course[];
  education: Education[];
  headings?: {
    contactInfo?: string;
    summary?: string;
    experience?: string;
    education?: string;
    skills?: string;
    certificates?: string;
    courses?: string;
  };
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
