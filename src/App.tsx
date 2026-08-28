import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LinuxBootLoader } from './components/LinuxBootLoader';
import { LandingRevealEffect } from './components/LandingRevealEffect';
import { AboutOpsSection } from './components/AboutOpsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { PricingSection } from './components/PricingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminModal } from './components/Admin/AdminModal';
import { CustomCursor } from './components/CustomCursor';
import { 
  ProfileSettings, 
  Project, 
  Skill, 
  Experience, 
  Education, 
  Certificate, 
  Testimonial 
} from './types';
import { 
  DataStore 
} from './lib/supabase';
import { 
  INITIAL_PROFILE, 
  INITIAL_PROJECTS, 
  INITIAL_SKILLS, 
  INITIAL_EXPERIENCES, 
  INITIAL_EDUCATIONS, 
  INITIAL_CERTIFICATES, 
  INITIAL_TESTIMONIALS 
} from './lib/initialData';
import { soundFx } from './lib/audio';

export default function App() {
  const [profile, setProfile] = useState<ProfileSettings>(INITIAL_PROFILE);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [experiences, setExperiences] = useState<Experience[]>(INITIAL_EXPERIENCES);
  const [educations, setEducations] = useState<Education[]>(INITIAL_EDUCATIONS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);

  const [activeSection, setActiveSection] = useState<string>('about');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [showEntranceFX, setShowEntranceFX] = useState<boolean>(false);

  const handleBootComplete = () => {
    setIsBooting(false);
    setShowEntranceFX(true);
  };

  const loadAllData = async () => {
    try {
      const [
        loadedProfile,
        loadedProjects,
        loadedSkills,
        loadedExperiences,
        loadedEducations,
        loadedCertificates,
        loadedTestimonials,
      ] = await Promise.all([
        DataStore.getProfile(),
        DataStore.getProjects(),
        DataStore.getSkills(),
        DataStore.getExperiences(),
        DataStore.getEducations(),
        DataStore.getCertificates(),
        DataStore.getTestimonials(),
      ]);

      setProfile(loadedProfile);
      setProjects(loadedProjects);
      setSkills(loadedSkills);
      setExperiences(loadedExperiences);
      setEducations(loadedEducations);
      setCertificates(loadedCertificates);
      setTestimonials(loadedTestimonials);
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Global Admin Hotkey: Ctrl+Shift+A or Cmd+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        soundFx.playClick();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenHireModal = (planName?: string) => {
    handleSelectSection('contact');
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Global Continuous Cyber Blueprint Grid (Seamless across all sections) */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      {/* Linux Terminal Boot Sequence on Initial Load */}
      <AnimatePresence>
        {isBooting && (
          <LinuxBootLoader onComplete={handleBootComplete} />
        )}
      </AnimatePresence>

      {/* Cinematic Laser Sweep & Aperture Presentation Reveal */}
      {showEntranceFX && (
        <LandingRevealEffect onFinish={() => setShowEntranceFX(false)} />
      )}

      {/* Custom Cyber Cursor */}
      <CustomCursor />

      {/* Global Navbar */}
      <Navbar
        profile={profile}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onOpenAdmin={() => {
          soundFx.playClick();
          setIsAdminOpen(true);
        }}
        onOpenHireModal={() => handleOpenHireModal()}
        onReboot={() => {
          setIsBooting(true);
          setShowEntranceFX(false);
        }}
        isReady={!isBooting}
      />

      {/* Main Content Sections with Presentation Entrance Motion */}
      <motion.main
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* 1. Hero: Brand Title, Scramble Subtitle, Action Buttons, and Hanging Tag */}
        <Hero
          profile={profile}
          onOpenHireModal={() => handleOpenHireModal()}
          onSelectSection={handleSelectSection}
          isReady={!isBooting}
        />

        {/* 2. Operasional Tanpa Hambatan & SYSTEM_INFO v2.0 Terminal */}
        <AboutOpsSection
          profile={profile}
          onOpenHireModal={() => handleOpenHireModal()}
        />

        {/* 3. Teknologi (Tech Stack Grid with High-Contrast Category Badges) */}
        <SkillsSection />

        {/* 4. Rekam Jejak Operasional (+ LOG_SYSTEM: Pendidikan & Pengalaman) */}
        <ExperienceSection
          experiences={experiences}
          educations={educations}
        />

        {/* 5. Proyek Utama (+ PORTFOLIO: 2x2 Deployed/Beta System Grid) */}
        <ProjectsSection projects={projects} />

        {/* 6. Harga Jasa (+ INVESTASI TERBAIK: Starter, Professional, Enterprise) */}
        <PricingSection onOpenHireModal={handleOpenHireModal} />

        {/* 7. Mari Terhubung (+ CONNECT: Kontak Saya & Formulir Email) */}
        <ContactSection profile={profile} />
      </motion.main>

      {/* Footer: JUPRI_OPS. */}
      <Footer profile={profile} />

      {/* Supabase Admin CMS Studio Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataUpdated={loadAllData}
        initialProfile={profile}
        initialProjects={projects}
        initialSkills={skills}
        initialExperiences={experiences}
        initialCertificates={certificates}
      />
    </div>
  );
}
