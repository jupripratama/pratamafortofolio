import { Project, Skill, Experience, Education, Certificate, Testimonial, ProfileSettings } from '../types';

export const INITIAL_PROFILE: ProfileSettings = {
  name: "Jupri Eka Pratama, S.Kom.",
  handle: "@jupriekapratama",
  tagline: "Full-Stack Developer & Backend Specialist | IT Infrastructure & Telecommunication",
  heroHeadline: "Building Resilient Backend Architectures, Modern Web Systems & Telecommunication Networks",
  bio: "Saya Jupri Eka Pratama, lulusan Sistem Informasi dengan pengalaman lebih dari empat tahun di bidang pemrograman. Saya mengembangkan aplikasi backend dan mobile, serta memiliki pengalaman dalam infrastruktur IT, jaringan, CCTV, dan radio komunikasi.",
  avatarUrl: "/assets/profile-avatar.jpg",
  location: "Sangatta, Kalimantan Timur, Indonesia",
  timezone: "Asia/Makassar (WITA / UTC+8)",
  statusText: "🟢 Open for Full-Stack, Backend & Enterprise Roles",
  isAvailableForHire: true,
  resumeUrl: "/assets/CV Jupri Eka Pratama.pdf",
  email: "jupriekapratama@gmail.com",
  githubUrl: "https://github.com/jupriekapratama",
  linkedinUrl: "https://linkedin.com/in/jupriekapratama",
  telegramUrl: "https://t.me/jupriekapratama",
  whatsappUrl: "https://wa.me/6281258661601",
  discordTag: "jupriekapratama",
  spotifyPlaylistUrl: "https://open.spotify.com",
  splineSceneUrl: "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode",
  customThemeAccent: "cyan",
  stats: {
    yearsExperience: "5+ Thn",
    completedProjects: "25+",
    satisfiedClients: "100%",
    githubContributions: "BNSP Cert"
  }
};

// PM Dashboard and Pinisidev: https://jupriekapratama.web.id/
// Additional projects and updated PM Dashboard image: owner-provided descriptions and screenshots.
export const INITIAL_PROJECTS: Project[] = [
  {
    "id": "pm-dashboard",
    "title": "PM Dashboard",
    "subtitle": "Web Application",
    "role": "Full-Stack Developer",
    "description": "Aplikasi dashboard profesional dengan backend C# .NET 8 serta frontend React dan TypeScript. Menggunakan Vite dan Tailwind CSS untuk antarmuka yang responsif dan pengembangan yang efisien.",
    "category": "fullstack",
    "image": "/assets/project-pm-dashboard-latest.png",
    "tags": [
      "C#",
      ".NET 8",
      "Vite",
      "React",
      "TypeScript",
      "Tailwind CSS"
    ],
    "featured": true,
    "year": ""
  },
  {
    "id": "pinisidev-team",
    "title": "Pinisidev Team",
    "subtitle": "Startup & Komunitas",
    "role": "Backend Developer",
    "description": "Komunitas IT Pemuda Pemudi Bulukumba — “From `null` to be `cool`”. Membangun karya digital untuk menolong banyak orang, termasuk aplikasi mobile, website, dan solusi manajemen aset.",
    "category": "backend",
    "image": "/assets/project-pinisidev.png",
    "tags": [
      "Startup",
      "Community",
      "Web",
      "Mobile",
      "Desktop",
      "Collaboration"
    ],
    "demoUrl": "https://pinisidev.web.id/",
    "featured": true,
    "year": ""
  },
  {
    id: "ksp-berkat",
    title: "KSP Berkat",
    subtitle: "Mobile & Desktop Application",
    description: "Aplikasi mobile untuk pengguna dan desktop admin Koperasi Simpan Pinjam Berkat, salah satu KSP terbesar di Sulawesi Selatan.",
    category: "mobile",
    image: "/assets/project-ksp-berkat.png",
    tags: ["Mobile", "Desktop", "Koperasi Simpan Pinjam"],
    featured: true,
    year: ""
  },
  {
    id: "asn-company-profile",
    title: "ASN",
    subtitle: "Company Profile",
    description: "Website company profile CV Agape Sinar Nirwana (ASN), penyedia solusi pengadaan kebutuhan pertambangan dan industri.",
    category: "frontend",
    image: "/assets/project-asn.png",
    tags: ["Company Profile", "Web", "Supplier & Mining Support"],
    featured: true,
    year: ""
  },
  {
    id: "mkn-site-online",
    title: "MKN Site Online",
    subtitle: "Aplikasi Operasional",
    description: "Aplikasi operasional PT Multi Kontrol Nusantara untuk mengelola pekerjaan HR, operasi telekomunikasi, workshop, dan proyek dalam satu ruang kerja.",
    category: "fullstack",
    image: "/assets/project-mkn-site.png",
    tags: ["Operasional", "HR", "Telekomunikasi", "Workshop"],
    featured: true,
    year: ""
  },
  {
    id: "mkn-web-portal",
    title: "Web Portal MKN",
    subtitle: "Portal Aplikasi & Layanan",
    description: "Portal terintegrasi PT Multi Kontrol Nusantara yang menyatukan akses ke berbagai aplikasi dan layanan operasional, dilengkapi pencarian untuk menemukan sistem yang dibutuhkan.",
    category: "frontend",
    image: "/assets/project-mkn-portal.png",
    tags: ["Web Portal", "Integrasi Layanan", "Operasional"],
    demoUrl: "https://portal.mknops.web.id/",
    featured: true,
    year: ""
  },
  {
    id: "crypto-wallet",
    title: "Crypto Wallet",
    subtitle: "Web 3.0 Wallet",
    description: "Wallet Web 3.0 untuk aset kripto, tersedia dalam versi mobile, web, dan browser extension.",
    category: "fullstack",
    image: "/assets/project-crypto-wallet.webp",
    tags: ["Web 3.0", "Mobile", "Web", "Browser Extension"],
    featured: true,
    year: ""
  }
];

export const INITIAL_SKILLS: Skill[] = [
  // Backend
  { id: "s1", name: "C# / .NET 8", category: "backend", level: 95, iconName: "Server", experienceYears: "4 yrs", isPopular: true },
  { id: "s2", name: "Golang", category: "backend", level: 90, iconName: "Cpu", experienceYears: "3 yrs", isPopular: true },
  { id: "s3", name: "NestJS & Node.js", category: "backend", level: 92, iconName: "Terminal", experienceYears: "4 yrs", isPopular: true },
  { id: "s4", name: "Laravel / PHP", category: "backend", level: 90, iconName: "Code2", experienceYears: "5 yrs", isPopular: true },
  { id: "s5", name: "RESTful API & Microservices", category: "backend", level: 94, iconName: "Globe", experienceYears: "5 yrs", isPopular: true },

  // Frontend
  { id: "s6", name: "React 19 / Vite", category: "frontend", level: 92, iconName: "Layers", experienceYears: "4 yrs", isPopular: true },
  { id: "s7", name: "TypeScript", category: "frontend", level: 90, iconName: "FileCode", experienceYears: "4 yrs", isPopular: true },
  { id: "s8", name: "Tailwind CSS", category: "frontend", level: 95, iconName: "Palette", experienceYears: "4 yrs", isPopular: true },
  { id: "s9", name: "React Native", category: "frontend", level: 85, iconName: "Sparkles", experienceYears: "2 yrs" },

  // Database
  { id: "s10", name: "PostgreSQL & Supabase", category: "database", level: 92, iconName: "Database", experienceYears: "4 yrs", isPopular: true },
  { id: "s11", name: "Microsoft SQL Server", category: "database", level: 90, iconName: "Database", experienceYears: "4 yrs" },
  { id: "s12", name: "MySQL / MariaDB", category: "database", level: 92, iconName: "FolderGit2", experienceYears: "5 yrs" },
  { id: "s13", name: "Redis Caching", category: "database", level: 85, iconName: "Zap", experienceYears: "2 yrs" },

  // DevOps & Infrastructure / Hardware
  { id: "s14", name: "CCTV & Surveillance Network", category: "devops", level: 96, iconName: "Wifi", experienceYears: "4 yrs", isPopular: true },
  { id: "s15", name: "Radio Komunikasi (VHF/UHF)", category: "devops", level: 94, iconName: "Wifi", experienceYears: "4 yrs", isPopular: true },
  { id: "s16", name: "Docker & Containerization", category: "devops", level: 88, iconName: "Box", experienceYears: "3 yrs" },
  { id: "s17", name: "Git & GitHub Actions", category: "devops", level: 90, iconName: "GitBranch", experienceYears: "5 yrs" },

  // Tools
  { id: "s18", name: "Microsoft Office Suite", category: "tools", level: 98, iconName: "LayoutTemplate", experienceYears: "8 yrs", isPopular: true },
  { id: "s19", name: "VS Code & Visual Studio", category: "tools", level: 95, iconName: "Terminal", experienceYears: "6 yrs" },
  { id: "s20", name: "Postman API Suite", category: "tools", level: 92, iconName: "Search", experienceYears: "4 yrs" }
];

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    role: "PM & Documentation",
    company: "PT. Multi Kontrol Nusantara",
    period: "2026 - Present",
    type: "Full-time",
    location: "Sangatta, Kalimantan Timur",
    description: [
      "Memimpin dokumentasi teknis, pengawasan milestone proyek, dan koordinasi alur kerja sistem infrastruktur telekomunikasi & IT.",
      "Mengelola jadwal pemeliharaan hardware, jaringan CCTV, serta perangkat radio komunikasi dengan standar kepatuhan operasional tinggi.",
      "Menyusun laporan performa sistem dan dokumentasi serah terima proyek secara terstruktur."
    ],
    skills: ["Project Management", "Technical Documentation", "IT Infrastructure", "CCTV & Radio"],
    featured: true
  },
  {
    id: "exp-2",
    role: "Backend Developer",
    company: "Pinisidev Bulukumba Tech",
    period: "2024 - Present",
    type: "Freelance",
    location: "Remote / Bulukumba",
    description: [
      "Mengembangkan arsitektur backend, API service, dan sistem database menggunakan Golang, NestJS, dan .NET.",
      "Berkolaborasi bersama tim developer dalam menciptakan solusi digital, aplikasi mobile, website, dan sistem asset management.",
      "Mengimplementasikan autentikasi terenkripsi dan optimasi query database untuk performa maksimal."
    ],
    skills: ["Golang", "NestJS", ".NET", "PostgreSQL", "Docker", "REST API"],
    featured: true
  },
  {
    id: "exp-3",
    role: "Jr. Teknisi CCTV & Radio Komunikasi",
    company: "PT. Multi Kontrol Nusantara",
    period: "Apr 2023 - 2026",
    type: "Full-time",
    location: "Sangatta, Kalimantan Timur",
    description: [
      "Melakukan instalasi, konfigurasi jaringan, serta preventive maintenance untuk sistem CCTV surveillance dan perangkat Radio Komunikasi (Motorola / Hytera).",
      "Menangani troubleshooting kabel fiber optik, kabel UTP, instalasi antena repeater, dan pengujian frekuensi radio.",
      "Memastikan kontinuitas sistem keamanan dan komunikasi lapangan beroperasi dengan keandalan 99.9%."
    ],
    skills: ["CCTV Surveillance", "Radio Komunikasi", "Fiber Optic", "Networking", "Hardware Maintenance"],
    featured: true
  },
  {
    id: "exp-4",
    role: "IT Operator",
    company: "PT. Jasamedika Saranatama",
    period: "Aug 2015 - Feb 2016",
    type: "Full-time",
    location: "Balikpapan, Kalimantan Timur",
    description: [
      "Mengoperasikan dan mengelola input transaksi pada Sistem Informasi Manajemen Rumah Sakit (SIMRS).",
      "Melakukan validasi data rekam medis, billing operasional, dan troubleshooting teknis pada workstation pengguna.",
      "Melakukan backup berkala dan pemeliharaan integritas database rumah sakit."
    ],
    skills: ["SIMRS", "SQL Server", "IT Operations", "Data Validation", "Troubleshooting"]
  }
];

export const INITIAL_EDUCATIONS: Education[] = [
  {
    id: "edu-1",
    degree: "Sistem Informasi",
    institution: "STMIK Borneo Internasional",
    period: "2019",
    gpa: "3,46",
    description: ""
  },
  {
    id: "edu-2",
    degree: "Informatika Komputer",
    institution: "LP3I Balikpapan",
    period: "2015",
    description: ""
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    title: "BNSP Programmer",
    issuer: "Badan Nasional Sertifikasi Profesi (BNSP)",
    date: "2019",
    credentialId: "BNSP-PRG-2019",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    verifyUrl: "https://jupriekapratama.web.id",
    skills: ["Software Programming", "Algorithm", "Database Design", "Clean Code"]
  },
  {
    id: "cert-2",
    title: "BNSP Jr. Web Programmer",
    issuer: "Badan Nasional Sertifikasi Profesi (BNSP)",
    date: "2015",
    credentialId: "BNSP-JWP-2015",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80",
    verifyUrl: "https://jupriekapratama.web.id",
    skills: ["Web Development", "HTML/CSS", "JavaScript", "PHP / MySQL"]
  },
  {
    id: "cert-3",
    title: "C# .NET 8 Full-Stack Web Development",
    issuer: "Microsoft Tech Community",
    date: "2024",
    credentialId: "MSFT-NET8-9921",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    verifyUrl: "https://jupriekapratama.web.id",
    skills: ["C#", ".NET 8", "Web API", "Entity Framework", "TypeScript"]
  },
  {
    id: "cert-4",
    title: "CCTV & RF Radio Communication Specialist",
    issuer: "PT. Multi Kontrol Nusantara",
    date: "2023",
    credentialId: "MKN-TEL-0842",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    verifyUrl: "https://jupriekapratama.web.id",
    skills: ["CCTV Surveillance", "Motorola/Hytera RF", "Fiber Optic", "Network Telemetry"]
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Pinisidev Tech Lead",
    role: "Lead Developer",
    company: "Pinisidev Bulukumba Tech",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
    content: "Jupri memiliki dedikasi dan pemahaman arsitektur backend yang sangat solid. Kontribusinya dalam membangun API service dengan Golang & NestJS untuk komunitas Pinisidev sangat terstruktur, andal, dan mudah di-maintain.",
    rating: 5,
    projectRelation: "Pinisidev Community Web & Asset Hub"
  },
  {
    id: "test-2",
    name: "Engineering Supervisor",
    role: "Telecom & IT Supervisor",
    company: "PT. Multi Kontrol Nusantara",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
    content: "Kemampuan teknis Jupri dalam mengelola infrastruktur CCTV dan radio komunikasi lapangan sangat memuaskan. Tanggap dalam troubleshooting, rapi dalam pembuatan laporan teknis, dan selalu memastikan sistem beroperasi optimal.",
    rating: 5,
    projectRelation: "PM & Documentation & Infrastructure"
  },
  {
    id: "test-3",
    name: "Hospital Project Coordinator",
    role: "Head of Operations",
    company: "PT. Jasamedika Saranatama",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    content: "Jupri selalu teliti dan disiplin dalam operasional SIMRS dan pengelolaan database rumah sakit. Sangat bisa diandalkan dalam memecahkan kendala teknis harian secara cepat.",
    rating: 5,
    projectRelation: "SIMRS Data Validator"
  }
];
