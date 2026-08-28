import { Project, Skill, Experience, Education, Certificate, Testimonial, ProfileSettings } from '../types';

export const INITIAL_PROFILE: ProfileSettings = {
  name: "Jupri Eka Pratama, S.Kom.",
  handle: "@jupriekapratama",
  tagline: "Full-Stack Developer & Backend Specialist | IT Infrastructure & Telecommunication",
  heroHeadline: "Building Resilient Backend Architectures, Modern Web Systems & Telecommunication Networks",
  bio: "Halo! Saya Jupri Eka Pratama, seorang Full-Stack Developer & Backend Specialist lulusan Sarjana Sistem Informasi (S.Kom) dari STMIK Borneo Internasional Balikpapan. Berpengalaman di bidang software engineering (C# .NET 8, Golang, NestJS, React, TypeScript), database management, serta pengelolaan infrastruktur teknis CCTV & Radio Komunikasi di PT. Multi Kontrol Nusantara dan Pinisidev Bulukumba Tech.",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
  location: "Sangatta, Kalimantan Timur, Indonesia",
  timezone: "Asia/Makassar (WITA / UTC+8)",
  statusText: "🟢 Open for Full-Stack, Backend & Enterprise Roles",
  isAvailableForHire: true,
  resumeUrl: "https://jupriekapratama.web.id",
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

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "LamzDev AI Private Workspace",
    subtitle: "Workspace AI privat dengan akses berbasis undangan & multi-provider",
    description: "Workspace AI privat dengan akses berbasis undangan, pilihan provider dan model, riwayat percakapan, unggah dokumen, serta pemantauan terpusat melalui halaman admin.",
    category: "fullstack",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    tags: ["React", "Node.js", "MySQL", "Multi-provider AI"],
    demoUrl: "https://jupriekapratama.web.id",
    githubUrl: "https://github.com/jupriekapratama/lamzdev-ai-workspace",
    featured: true,
    year: "2026",
    stars: 142,
    role: "Fullstack Architect",
    features: [
      "Multi-provider LLM routing (Gemini, Claude, OpenAI) dengan token optimizer",
      "Sistem undangan privat terenkripsi & RBAC role permission",
      "RAG document search & intelligent context retrieval",
      "Admin monitoring dashboard untuk log konsumsi API & audit trail"
    ],
    metrics: [
      { label: "Providers", value: "Multi-LLM" },
      { label: "Security", value: "End-to-End" },
      { label: "DB", value: "MySQL" }
    ]
  },
  {
    id: "proj-2",
    title: "CampusFlow — Academic Dashboard",
    subtitle: "Aplikasi akademik jadwal, tugas, dan perkembangan IPK mahasiswa",
    description: "Aplikasi akademik untuk menyatukan jadwal kuliah, tugas, tenggat, perkembangan IPK, dan rencana belajar mahasiswa dalam satu dashboard responsif.",
    category: "fullstack",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    tags: ["React", "Node.js", "MySQL", "Chart.js"],
    demoUrl: "https://jupriekapratama.web.id",
    githubUrl: "https://github.com/jupriekapratama/campusflow-dashboard",
    featured: true,
    year: "2025 - 2026",
    stars: 185,
    role: "Fullstack Engineer",
    features: [
      "Visualisasi tren IPK per semester & target kelulusan interaktif",
      "Sinkronisasi jadwal kuliah otomatis dengan kalender digital",
      "Kanban board manajemen tugas & notifikasi deadline otomatis",
      "UI responsif mobile-first untuk akses praktis di smartphone"
    ],
    metrics: [
      { label: "Analytics", value: "Chart.js" },
      { label: "Status", value: "Active" },
      { label: "Database", value: "MySQL" }
    ]
  },
  {
    id: "proj-3",
    title: "CommerceOps — Operations Dashboard",
    subtitle: "Dashboard operasional e-commerce, fulfillment, & stok menipis",
    description: "Dashboard operasional e-commerce yang merangkum pendapatan, pesanan lintas kanal, status fulfillment, stok menipis, dan produk terlaris.",
    category: "backend",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    tags: ["React", "Express.js", "MySQL", "Chart.js"],
    demoUrl: "https://jupriekapratama.web.id",
    githubUrl: "https://github.com/jupriekapratama/commerce-ops",
    featured: true,
    year: "2025",
    stars: 120,
    role: "Backend Specialist",
    features: [
      "Aggregator omset harian lintas kanal e-commerce & rekonsiliasi pembayaran",
      "Pelacakan fulfillment order real-time dengan status workflow otomatis",
      "Early warning system untuk stok menipis & buffer alert",
      "Export laporan analitik finansial & performa SKU produk"
    ],
    metrics: [
      { label: "Throughput", value: "High-load" },
      { label: "Backend", value: "Express.js" },
      { label: "Database", value: "MySQL" }
    ]
  },
  {
    id: "proj-4",
    title: "SotoKU — Aplikasi Kasir Warung Soto",
    subtitle: "Aplikasi kasir offline, printer Bluetooth, & laporan penjualan",
    description: "Aplikasi kasir offline untuk mengelola penjualan, produk, inventori, transaksi, dashboard pendapatan, cetak struk, dan printer Bluetooth.",
    category: "frontend",
    image: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80",
    tags: ["Flutter", "Dart", "SQLite", "Riverpod"],
    demoUrl: "https://jupriekapratama.web.id",
    githubUrl: "https://github.com/jupriekapratama/sotoku-pos",
    featured: true,
    year: "2024",
    stars: 156,
    role: "Mobile & POS Developer",
    features: [
      "Offline-first POS engine didukung database lokal SQLite tanpa latency",
      "Integrasi cetak struk via thermal printer Bluetooth ESC/POS",
      "Katalog variasi menu cepat & penghitungan diskon/pajak instan",
      "Rekap penjualan harian, shift kasir, dan ringkasan laba kotor"
    ],
    metrics: [
      { label: "Architecture", value: "Riverpod" },
      { label: "Storage", value: "SQLite Offline" },
      { label: "Platform", value: "Flutter" }
    ]
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
    degree: "Sarjana Komputer (S.Kom) - Sistem Informasi",
    institution: "STMIK Borneo Internasional Balikpapan",
    period: "2015 - 2019",
    gpa: "Lulusan Sarjana",
    description: "Fokus studi pada Rekayasa Perangkat Lunak, Arsitektur Sistem Informasi Perusahaan, Manajemen Basis Data, dan Infrastruktur Jaringan. Penulis publikasi ilmiah 'Analisis Kepuasan Pengguna Game Multiplayer Online Battle Arena Mobile Legends dan Arena of Valor' pada J-SIM (Jurnal Sistem Informasi, Okt 2019)."
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
