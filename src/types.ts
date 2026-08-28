export type ProjectCategory = 'all' | 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'ai' | 'tools';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'ai' | 'tools';
  image: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  year: string;
  stars?: number;
  role?: string;
  features?: string[];
  metrics?: { label: string; value: string }[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'ai';
  level: number; // 0 - 100
  iconName: string;
  experienceYears: string;
  isPopular?: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  type: 'Full-time' | 'Contract' | 'Freelance' | 'Internship';
  location: string;
  description: string[];
  skills: string[];
  featured?: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  gpa?: string;
  description: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  image: string;
  verifyUrl?: string;
  skills: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  projectRelation?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  budget?: string;
}

export interface ProfileSettings {
  name: string;
  handle: string;
  tagline: string;
  heroHeadline: string;
  bio: string;
  avatarUrl: string;
  location: string;
  timezone: string;
  statusText: string;
  isAvailableForHire: boolean;
  resumeUrl: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  telegramUrl: string;
  whatsappUrl: string;
  discordTag: string;
  spotifyPlaylistUrl?: string;
  splineSceneUrl?: string;
  customThemeAccent?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
  stats: {
    yearsExperience: string;
    completedProjects: string;
    satisfiedClients: string;
    githubContributions: string;
  };
}

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}
