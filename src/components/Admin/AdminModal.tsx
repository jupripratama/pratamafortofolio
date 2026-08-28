import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Database, 
  FolderGit2, 
  Zap, 
  Briefcase, 
  Award, 
  Mail, 
  Settings, 
  Check, 
  Copy, 
  Trash2, 
  Plus, 
  Edit3, 
  RefreshCw, 
  Save, 
  ExternalLink,
  ShieldCheck,
  Flame,
  AlertCircle,
  Eye
} from 'lucide-react';
import { 
  Project, 
  Skill, 
  Experience, 
  Certificate, 
  ContactMessage, 
  ProfileSettings, 
  SupabaseConfig 
} from '../../types';
import { 
  DataStore, 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  resetSupabaseClient,
  SUPABASE_SQL_SCHEMA 
} from '../../lib/supabase';
import { soundFx } from '../../lib/audio';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
  initialProfile: ProfileSettings;
  initialProjects: Project[];
  initialSkills: Skill[];
  initialExperiences: Experience[];
  initialCertificates: Certificate[];
}

type AdminTab = 'supabase' | 'projects' | 'skills' | 'experience' | 'certificates' | 'messages' | 'profile';

export function AdminModal({
  isOpen,
  onClose,
  onDataUpdated,
  initialProfile,
  initialProjects,
  initialSkills,
  initialExperiences,
  initialCertificates,
}: AdminModalProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('supabase');

  // Supabase state
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(getSupabaseConfig());
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Entities state
  const [profile, setProfile] = useState<ProfileSettings>(initialProfile);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Project Edit State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Skill Edit State
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (isOpen) {
      setSupabaseConfig(getSupabaseConfig());
      setProfile(initialProfile);
      setProjects(initialProjects);
      setSkills(initialSkills);
      setExperiences(initialExperiences);
      setCertificates(initialCertificates);
      loadMessages();
    }
  }, [isOpen, initialProfile, initialProjects, initialSkills, initialExperiences, initialCertificates]);

  const loadMessages = async () => {
    const msgs = await DataStore.getMessages();
    setMessages(msgs);
  };

  if (!isOpen) return null;

  // Supabase Handlers
  const handleSaveSupabaseConfig = async () => {
    soundFx.playClick();
    saveSupabaseConfig(supabaseConfig);
    resetSupabaseClient();
    showToast('Supabase configuration saved!');
    onDataUpdated();
  };

  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    setTestResult(null);
    soundFx.playClick();

    if (!supabaseConfig.supabaseUrl || !supabaseConfig.supabaseAnonKey) {
      setTestResult({
        success: false,
        message: 'Please provide both Supabase Project URL and Anon Public Key.'
      });
      setIsTestingSupabase(false);
      return;
    }

    try {
      saveSupabaseConfig(supabaseConfig);
      resetSupabaseClient();
      const testProjects = await DataStore.getProjects();
      setTestResult({
        success: true,
        message: `Successfully connected to Supabase! Loaded ${testProjects.length} projects.`
      });
      soundFx.playSuccess();
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Connection failed: ' + (err.message || 'Check URL and Anon Key')
      });
    } finally {
      setIsTestingSupabase(false);
    }
  };

  const handleCopySchema = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  // Profile Save
  const handleSaveProfile = async () => {
    soundFx.playClick();
    await DataStore.saveProfile(profile);
    soundFx.playSuccess();
    showToast('Profile and site settings saved!');
    onDataUpdated();
  };

  // Projects CRUD
  const handleSaveProject = async (proj: Project) => {
    soundFx.playClick();
    let updated: Project[];
    if (isCreatingProject) {
      updated = [proj, ...projects];
    } else {
      updated = projects.map(p => p.id === proj.id ? proj : p);
    }
    setProjects(updated);
    await DataStore.saveProjects(updated);
    setEditingProject(null);
    setIsCreatingProject(false);
    soundFx.playSuccess();
    showToast('Project saved successfully!');
    onDataUpdated();
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    soundFx.playClick();
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    await DataStore.saveProjects(updated);
    showToast('Project deleted.');
    onDataUpdated();
  };

  // Skills CRUD
  const handleSaveSkill = async (skill: Skill) => {
    soundFx.playClick();
    const exists = skills.some(s => s.id === skill.id);
    const updated = exists
      ? skills.map(s => s.id === skill.id ? skill : s)
      : [...skills, skill];
    setSkills(updated);
    await DataStore.saveSkills(updated);
    setEditingSkill(null);
    soundFx.playSuccess();
    showToast('Skill updated!');
    onDataUpdated();
  };

  const handleDeleteSkill = async (id: string) => {
    soundFx.playClick();
    const updated = skills.filter(s => s.id !== id);
    setSkills(updated);
    await DataStore.saveSkills(updated);
    showToast('Skill deleted.');
    onDataUpdated();
  };

  // Messages Actions
  const handleMarkMessageRead = async (id: string) => {
    soundFx.playClick();
    await DataStore.markMessageAsRead(id);
    loadMessages();
  };

  const handleDeleteMessage = async (id: string) => {
    soundFx.playClick();
    await DataStore.deleteMessage(id);
    loadMessages();
    showToast('Message deleted.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Admin Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-5xl rounded-3xl border border-cyan-500/30 bg-[#090d16] shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden z-10 my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>DevCraft Admin Studio</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  Supabase CMS
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Manage live portfolio database, Supabase sync, projects & inbox
              </p>
            </div>
          </div>

          <button
            id="close-admin-modal-btn"
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 text-xs font-mono px-6 py-2 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 bg-[#0c101c] border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {[
            { id: 'supabase', label: 'Supabase Engine', icon: Database },
            { id: 'projects', label: 'Projects', icon: FolderGit2, count: projects.length },
            { id: 'skills', label: 'Skills Stack', icon: Zap, count: skills.length },
            { id: 'experience', label: 'Experience', icon: Briefcase, count: experiences.length },
            { id: 'certificates', label: 'Certificates', icon: Award, count: certificates.length },
            { id: 'messages', label: 'Inbox', icon: Mail, count: messages.filter(m => !m.isRead).length },
            { id: 'profile', label: 'Site Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id as AdminTab);
                }}
                className={`py-3 px-3.5 text-xs font-mono font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-500/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-cyan-400 text-black font-bold' : 'bg-white/10 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: Supabase Engine Configuration */}
          {activeTab === 'supabase' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Supabase Cloud Database Integration</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Connect your real Supabase project to persist and synchronize projects, visitor inquiries, skills, and site settings directly to PostgreSQL. The app also works offline using built-in local persistence!
                  </p>
                </div>
              </div>

              {/* Supabase URL & Anon Key Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                    Supabase Project URL
                  </label>
                  <input
                    id="supabase-url-input"
                    type="text"
                    value={supabaseConfig.supabaseUrl}
                    onChange={(e) => setSupabaseConfig({ ...supabaseConfig, supabaseUrl: e.target.value })}
                    placeholder="https://your-project-id.supabase.co"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                    Supabase Anon (Public) Key
                  </label>
                  <input
                    id="supabase-anon-key-input"
                    type="password"
                    value={supabaseConfig.supabaseAnonKey}
                    onChange={(e) => setSupabaseConfig({ ...supabaseConfig, supabaseAnonKey: e.target.value })}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  id="save-supabase-config-btn"
                  onClick={handleSaveSupabaseConfig}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>

                <button
                  id="test-supabase-conn-btn"
                  onClick={handleTestSupabase}
                  disabled={isTestingSupabase}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs border border-white/10 transition-all flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isTestingSupabase ? 'animate-spin' : ''}`} />
                  <span>{isTestingSupabase ? 'Verifying...' : 'Test Connection'}</span>
                </button>

                <button
                  id="copy-sql-schema-btn"
                  onClick={handleCopySchema}
                  className="px-5 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-mono text-xs border border-purple-500/40 transition-all flex items-center gap-2"
                >
                  {copiedSchema ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSchema ? 'SQL Copied to Clipboard!' : 'Copy Supabase SQL Schema'}</span>
                </button>
              </div>

              {/* Test Result alert */}
              {testResult && (
                <div className={`p-4 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                  testResult.success 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  {testResult.success ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* SQL Schema Preview Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    Supabase PostgreSQL Table Schema (Ready to paste into Supabase SQL Editor):
                  </span>
                </div>
                <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 text-[11px] font-mono text-cyan-300/80 overflow-x-auto max-h-56">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: Projects Manager */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Project Showcase Manager</h4>
                  <p className="text-xs text-slate-400 font-mono">Create, edit, and curate featured portfolio works</p>
                </div>

                <button
                  id="add-new-project-btn"
                  onClick={() => {
                    soundFx.playClick();
                    setIsCreatingProject(true);
                    setEditingProject({
                      id: 'proj-' + Date.now(),
                      title: 'New Web Project',
                      subtitle: 'Modern Fullstack Solution',
                      description: 'Comprehensive description of the architecture and features.',
                      category: 'fullstack',
                      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
                      tags: ['React 19', 'TypeScript', 'TailwindCSS'],
                      demoUrl: 'https://example.com',
                      githubUrl: 'https://github.com',
                      featured: false,
                      year: '2025',
                      stars: 50,
                      role: 'Lead Architect',
                      features: ['High performance 60fps', 'Cloud database integration'],
                      metrics: [{ label: 'Performance', value: '99/100' }]
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Edit/Create Project Form */}
              {editingProject && (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-cyan-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h5 className="text-sm font-bold text-cyan-300 font-mono">
                      {isCreatingProject ? 'Create New Project' : `Edit Project: ${editingProject.title}`}
                    </h5>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={editingProject.subtitle}
                        onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Category</label>
                      <select
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0c101c] border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                      >
                        <option value="fullstack">Fullstack</option>
                        <option value="frontend">Frontend / 3D</option>
                        <option value="backend">Backend & Cloud</option>
                        <option value="mobile">Mobile App</option>
                        <option value="ai">AI / Multimodal</option>
                        <option value="tools">Tools & Bots</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Cover Image URL</label>
                      <input
                        type="text"
                        value={editingProject.image}
                        onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Year</label>
                      <input
                        type="text"
                        value={editingProject.year}
                        onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Demo URL</label>
                      <input
                        type="text"
                        value={editingProject.demoUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">GitHub Repo URL</label>
                      <input
                        type="text"
                        value={editingProject.githubUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={editingProject.tags.join(', ')}
                      onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                      <input
                        type="checkbox"
                        checked={editingProject.featured}
                        onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                        className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-white/20"
                      />
                      <span>Mark as Featured Flagship Project</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      onClick={() => handleSaveProject(editingProject)}
                      className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs"
                    >
                      Save Project
                    </button>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Projects List */}
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4 hover:border-cyan-500/20 transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover border border-white/10 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h5 className="text-sm font-bold text-white truncate flex items-center gap-2">
                          {proj.title}
                          {proj.featured && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                              Featured
                            </span>
                          )}
                        </h5>
                        <p className="text-xs text-cyan-400 font-mono truncate">{proj.subtitle}</p>
                        <p className="text-[11px] text-slate-400 font-mono uppercase">{proj.category} • {proj.year}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setIsCreatingProject(false);
                          setEditingProject(proj);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-all"
                        title="Edit Project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-all"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Skills Manager */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Skills Matrix Manager</h4>
                  <p className="text-xs text-slate-400 font-mono">Manage categories, experience years & mastery meters</p>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setEditingSkill({
                      id: 'sk-' + Date.now(),
                      name: 'New Technology',
                      category: 'frontend',
                      level: 85,
                      iconName: 'Code2',
                      experienceYears: '2 yrs',
                      isPopular: false
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>

              {editingSkill && (
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-cyan-500/30 space-y-4">
                  <h5 className="text-xs font-mono font-bold text-cyan-300">Edit Skill Item</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Name</label>
                      <input
                        type="text"
                        value={editingSkill.name}
                        onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Category</label>
                      <select
                        value={editingSkill.category}
                        onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0c101c] border border-white/10 text-xs text-white font-mono outline-none"
                      >
                        <option value="frontend">Frontend & 3D</option>
                        <option value="backend">Backend</option>
                        <option value="database">Database</option>
                        <option value="devops">DevOps</option>
                        <option value="ai">AI</option>
                        <option value="tools">Tools</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Mastery ({editingSkill.level}%)</label>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={editingSkill.level}
                        onChange={(e) => setEditingSkill({ ...editingSkill, level: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSaveSkill(editingSkill)}
                      className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-mono font-bold text-xs"
                    >
                      Save Skill
                    </button>
                    <button
                      onClick={() => setEditingSkill(null)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 font-mono text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{s.name}</p>
                      <p className="text-[10px] font-mono text-cyan-400 capitalize">{s.category} • {s.level}%</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingSkill(s)}
                        className="p-1.5 rounded bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        className="p-1.5 rounded bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Messages / Inbox */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Client Inquiry Transmission Inbox</h4>
                  <p className="text-xs text-slate-400 font-mono">Real submissions from contact forms and priority hire calls</p>
                </div>
                <button
                  onClick={loadMessages}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-12 bg-white/[0.02] rounded-2xl border border-white/5">
                  <Mail className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs font-mono text-slate-400">No client messages received yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        msg.isRead 
                          ? 'bg-white/[0.01] border-white/5' 
                          : 'bg-cyan-950/20 border-cyan-500/30'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-white">{msg.name}</h5>
                          <span className="text-xs font-mono text-cyan-400">&lt;{msg.email}&gt;</span>
                          {!msg.isRead && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-black text-[9px] font-bold font-mono">
                              NEW
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {msg.budget && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
                              {msg.budget}
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-slate-500">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs font-bold text-slate-200 mb-1">{msg.subject}</p>
                      <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5 font-mono mb-3">
                        {msg.message}
                      </p>

                      <div className="flex items-center justify-end gap-2">
                        {!msg.isRead && (
                          <button
                            onClick={() => handleMarkMessageRead(msg.id)}
                            className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark as Read</span>
                          </button>
                        )}
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-mono flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply via Email</span>
                        </a>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Profile & Site Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Site Profile & Branding Customizer</h4>
                  <p className="text-xs text-slate-400 font-mono">Change bio, 3D Spline scene, avatars, and social links</p>
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">Display Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">Handle (@)</label>
                  <input
                    type="text"
                    value={profile.handle}
                    onChange={(e) => setProfile({ ...profile, handle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">Bio</label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">Avatar Image URL</label>
                  <input
                    type="text"
                    value={profile.avatarUrl}
                    onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">Status Badge Text</label>
                  <input
                    type="text"
                    value={profile.statusText}
                    onChange={(e) => setProfile({ ...profile, statusText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">Email</label>
                  <input
                    type="text"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">Telegram URL</label>
                  <input
                    type="text"
                    value={profile.telegramUrl}
                    onChange={(e) => setProfile({ ...profile, telegramUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">WhatsApp URL</label>
                  <input
                    type="text"
                    value={profile.whatsappUrl}
                    onChange={(e) => setProfile({ ...profile, whatsappUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">
                  Spline 3D Embed Scene URL (from spline.design)
                </label>
                <input
                  type="text"
                  value={profile.splineSceneUrl || ''}
                  onChange={(e) => setProfile({ ...profile, splineSceneUrl: e.target.value })}
                  placeholder="https://my.spline.design/..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveProfile}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-black font-mono font-bold text-xs shadow-lg shadow-cyan-500/25"
                >
                  Save Profile Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: Experience & Certificates placeholder quick note */}
          {(activeTab === 'experience' || activeTab === 'certificates') && (
            <div className="space-y-4 text-center py-8">
              <p className="text-sm font-mono text-slate-300">
                Manage {activeTab} data via Supabase SQL sync or local storage.
              </p>
              <button
                onClick={handleCopySchema}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs"
              >
                Copy Supabase Schema
              </button>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
