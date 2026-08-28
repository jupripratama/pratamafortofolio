import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Project, 
  Skill, 
  Experience, 
  Education, 
  Certificate, 
  Testimonial, 
  ContactMessage, 
  ProfileSettings, 
  SupabaseConfig 
} from '../types';
import { 
  INITIAL_PROFILE, 
  INITIAL_PROJECTS, 
  INITIAL_SKILLS, 
  INITIAL_EXPERIENCES, 
  INITIAL_EDUCATIONS, 
  INITIAL_CERTIFICATES, 
  INITIAL_TESTIMONIALS 
} from './initialData';

const CONFIG_KEY = 'devcraft_supabase_config';
const LOCAL_STORAGE_PREFIX = 'devcraft_data_v2_';

export function getSupabaseConfig(): SupabaseConfig {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return {
    supabaseUrl: '',
    supabaseAnonKey: '',
    isConnected: false,
  };
}

export function saveSupabaseConfig(config: SupabaseConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (config.supabaseUrl && config.supabaseAnonKey) {
    if (!supabaseInstance) {
      try {
        supabaseInstance = createClient(config.supabaseUrl, config.supabaseAnonKey);
      } catch {
        supabaseInstance = null;
      }
    }
    return supabaseInstance;
  }
  return null;
}

export function resetSupabaseClient() {
  supabaseInstance = null;
}

// Local Storage Handlers
export function getLocalData<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return fallback;
}

export function setLocalData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(data));
  } catch {}
}

// SQL Schema for Supabase
export const SUPABASE_SQL_SCHEMA = `-- DevCraft Portfolio Supabase Database Setup
-- Paste this script into your Supabase SQL Editor and click RUN

-- 1. Profile Settings Table
CREATE TABLE IF NOT EXISTS profile_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  handle TEXT,
  tagline TEXT,
  hero_headline TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  timezone TEXT,
  status_text TEXT,
  is_available_for_hire BOOLEAN DEFAULT TRUE,
  resume_url TEXT,
  email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  telegram_url TEXT,
  whatsapp_url TEXT,
  discord_tag TEXT,
  spline_scene_url TEXT,
  custom_theme_accent TEXT DEFAULT 'cyan',
  stats JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  category TEXT NOT NULL,
  image TEXT,
  tags TEXT[],
  demo_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  year TEXT,
  stars INTEGER DEFAULT 0,
  role TEXT,
  features TEXT[],
  metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER NOT NULL,
  icon_name TEXT,
  experience_years TEXT,
  is_popular BOOLEAN DEFAULT FALSE
);

-- 4. Experiences Table
CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  type TEXT,
  location TEXT,
  description TEXT[],
  skills TEXT[],
  featured BOOLEAN DEFAULT FALSE
);

-- 5. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  credential_id TEXT,
  image TEXT,
  verify_url TEXT,
  skills TEXT[]
);

-- 6. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  avatar TEXT,
  content TEXT,
  rating INTEGER DEFAULT 5,
  project_relation TEXT
);

-- 7. Contact Messages Table (Inbox)
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  budget TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Public Row Level Security (RLS) or Open Read
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read on portfolio data
CREATE POLICY "Public Read Profile" ON profile_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public Read Experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public Read Certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);

-- Allow anonymous insert on contact messages
CREATE POLICY "Public Insert Messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Messages" ON contact_messages FOR SELECT USING (true);

-- Allow all modifications with anon key for admin dashboard
CREATE POLICY "Anon Full Access Profile" ON profile_settings FOR ALL USING (true);
CREATE POLICY "Anon Full Access Projects" ON projects FOR ALL USING (true);
CREATE POLICY "Anon Full Access Skills" ON skills FOR ALL USING (true);
CREATE POLICY "Anon Full Access Experiences" ON experiences FOR ALL USING (true);
CREATE POLICY "Anon Full Access Certificates" ON certificates FOR ALL USING (true);
CREATE POLICY "Anon Full Access Testimonials" ON testimonials FOR ALL USING (true);
CREATE POLICY "Anon Full Access Messages" ON contact_messages FOR ALL USING (true);
`;

// Repository API
export const DataStore = {
  // Profile
  async getProfile(): Promise<ProfileSettings> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('profile_settings').select('*').limit(1).single();
        if (!error && data) {
          return {
            name: data.name,
            handle: data.handle || '@dev',
            tagline: data.tagline || '',
            heroHeadline: data.hero_headline || '',
            bio: data.bio || '',
            avatarUrl: data.avatar_url || '',
            location: data.location || 'Indonesia',
            timezone: data.timezone || 'Asia/Jakarta',
            statusText: data.status_text || 'Available for projects',
            isAvailableForHire: data.is_available_for_hire ?? true,
            resumeUrl: data.resume_url || '',
            email: data.email || '',
            githubUrl: data.github_url || '',
            linkedinUrl: data.linkedin_url || '',
            telegramUrl: data.telegram_url || '',
            whatsappUrl: data.whatsapp_url || '',
            discordTag: data.discord_tag || '',
            splineSceneUrl: data.spline_scene_url || '',
            customThemeAccent: data.custom_theme_accent || 'cyan',
            stats: data.stats || INITIAL_PROFILE.stats,
          };
        }
      } catch {}
    }
    return getLocalData<ProfileSettings>('profile', INITIAL_PROFILE);
  },

  async saveProfile(profile: ProfileSettings): Promise<void> {
    setLocalData('profile', profile);
    const client = getSupabaseClient();
    if (client) {
      try {
        const payload = {
          name: profile.name,
          handle: profile.handle,
          tagline: profile.tagline,
          hero_headline: profile.heroHeadline,
          bio: profile.bio,
          avatar_url: profile.avatarUrl,
          location: profile.location,
          timezone: profile.timezone,
          status_text: profile.statusText,
          is_available_for_hire: profile.isAvailableForHire,
          resume_url: profile.resumeUrl,
          email: profile.email,
          github_url: profile.githubUrl,
          linkedin_url: profile.linkedinUrl,
          telegram_url: profile.telegramUrl,
          whatsapp_url: profile.whatsappUrl,
          discord_tag: profile.discordTag,
          spline_scene_url: profile.splineSceneUrl,
          custom_theme_accent: profile.customThemeAccent,
          stats: profile.stats,
        };
        // Upsert
        const { data: existing } = await client.from('profile_settings').select('id').limit(1);
        if (existing && existing.length > 0) {
          await client.from('profile_settings').update(payload).eq('id', existing[0].id);
        } else {
          await client.from('profile_settings').insert([payload]);
        }
      } catch {}
    }
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('projects').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(d => ({
            id: d.id,
            title: d.title,
            subtitle: d.subtitle,
            description: d.description,
            category: d.category,
            image: d.image,
            tags: d.tags || [],
            demoUrl: d.demo_url,
            githubUrl: d.github_url,
            featured: d.featured ?? false,
            year: d.year || '2025',
            stars: d.stars || 0,
            role: d.role,
            features: d.features || [],
            metrics: d.metrics || [],
          }));
        }
      } catch {}
    }
    return getLocalData<Project[]>('projects', INITIAL_PROJECTS);
  },

  async saveProjects(projects: Project[]): Promise<void> {
    setLocalData('projects', projects);
  },

  // Skills
  async getSkills(): Promise<Skill[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('skills').select('*');
        if (!error && data && data.length > 0) {
          return data.map(d => ({
            id: d.id,
            name: d.name,
            category: d.category,
            level: d.level,
            iconName: d.icon_name,
            experienceYears: d.experience_years,
            isPopular: d.is_popular,
          }));
        }
      } catch {}
    }
    return getLocalData<Skill[]>('skills', INITIAL_SKILLS);
  },

  async saveSkills(skills: Skill[]): Promise<void> {
    setLocalData('skills', skills);
  },

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('experiences').select('*');
        if (!error && data && data.length > 0) {
          return data.map(d => ({
            id: d.id,
            role: d.role,
            company: d.company,
            period: d.period,
            type: d.type,
            location: d.location,
            description: d.description || [],
            skills: d.skills || [],
            featured: d.featured,
          }));
        }
      } catch {}
    }
    return getLocalData<Experience[]>('experiences', INITIAL_EXPERIENCES);
  },

  async saveExperiences(experiences: Experience[]): Promise<void> {
    setLocalData('experiences', experiences);
  },

  // Educations
  async getEducations(): Promise<Education[]> {
    return getLocalData<Education[]>('educations', INITIAL_EDUCATIONS);
  },

  // Certificates
  async getCertificates(): Promise<Certificate[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('certificates').select('*');
        if (!error && data && data.length > 0) {
          return data.map(d => ({
            id: d.id,
            title: d.title,
            issuer: d.issuer,
            date: d.date,
            credentialId: d.credential_id,
            image: d.image,
            verifyUrl: d.verify_url,
            skills: d.skills || [],
          }));
        }
      } catch {}
    }
    return getLocalData<Certificate[]>('certificates', INITIAL_CERTIFICATES);
  },

  async saveCertificates(certificates: Certificate[]): Promise<void> {
    setLocalData('certificates', certificates);
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('testimonials').select('*');
        if (!error && data && data.length > 0) {
          return data.map(d => ({
            id: d.id,
            name: d.name,
            role: d.role,
            company: d.company,
            avatar: d.avatar,
            content: d.content,
            rating: d.rating,
            projectRelation: d.project_relation,
          }));
        }
      } catch {}
    }
    return getLocalData<Testimonial[]>('testimonials', INITIAL_TESTIMONIALS);
  },

  async saveTestimonials(testimonials: Testimonial[]): Promise<void> {
    setLocalData('testimonials', testimonials);
  },

  // Messages (Inbox)
  async getMessages(): Promise<ContactMessage[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          return data.map(d => ({
            id: d.id,
            name: d.name,
            email: d.email,
            subject: d.subject,
            message: d.message,
            budget: d.budget,
            isRead: d.is_read,
            createdAt: d.created_at,
          }));
        }
      } catch {}
    }
    return getLocalData<ContactMessage[]>('messages', []);
  },

  async addMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    const current = getLocalData<ContactMessage[]>('messages', []);
    setLocalData('messages', [newMessage, ...current]);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('contact_messages').insert([{
          id: newMessage.id,
          name: newMessage.name,
          email: newMessage.email,
          subject: newMessage.subject,
          message: newMessage.message,
          budget: newMessage.budget,
          is_read: false,
          created_at: newMessage.createdAt,
        }]);
      } catch {}
    }

    return newMessage;
  },

  async markMessageAsRead(id: string): Promise<void> {
    const current = getLocalData<ContactMessage[]>('messages', []);
    const updated = current.map(m => m.id === id ? { ...m, isRead: true } : m);
    setLocalData('messages', updated);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('contact_messages').update({ is_read: true }).eq('id', id);
      } catch {}
    }
  },

  async deleteMessage(id: string): Promise<void> {
    const current = getLocalData<ContactMessage[]>('messages', []);
    const updated = current.filter(m => m.id !== id);
    setLocalData('messages', updated);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('contact_messages').delete().eq('id', id);
      } catch {}
    }
  }
};
