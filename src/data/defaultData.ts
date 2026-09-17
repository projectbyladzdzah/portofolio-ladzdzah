import { PortfolioData } from '../types/portfolio';

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  hero: {
    number: "24",
    country: "Indonesia",
    countryCode: "ID",
    flagEmoji: "🇮🇩",
    firstName: "LADZDZAH HANAN",
    lastName: "NAAFI MUFIDZ",
    team: "TELKOM UNIVERSITY // SOFTWARE ENGINEERING",
    role: "ENGINEER ON SITE",
    photo: "assets/driver-portrait.png",
    banner: "assets/driver-f1-banner.png",
    eyebrow: "PROFESSIONAL ENGINEERING & IT PORTFOLIO",
    quote: "Driven by problem solving for a better tomorrow.",
    bioSummary: "Software Engineering graduate specialized in high-performance web systems, IT infrastructure maintenance, database design, and visual media production.",
    stats: [
      { label: "CURRENT WORKPLACE", value: "TMC Surakarta" },
      { label: "EXPERIENCE", value: "3+ Years" },
      { label: "PROJECTS DELIVERED", value: "15+ Deployed" },
      { label: "AWARDS & CERTIFICATE", value: "3 Gold Titles" },
      { label: "AGE", value: "24 Years Old" },
      { label: "INSTITUTION", value: "Telkom University" },
      { label: "LOCATION", value: "Indonesia" },
      { label: "BASE / DOMICILE", value: "Pekalongan, Central Java" }
    ],
    telemetryBars: [
      { label: "FULL-STACK WEB", percent: 92 },
      { label: "IT INFRASTRUCTURE", percent: 95 },
      { label: "DATABASE & SQL", percent: 86 },
      { label: "TROUBLESHOOTING", percent: 96 }
    ]
  },
  ticker: [
    "SOFTWARE ENGINEERING",
    "ON-SITE IT SUPPORT & MAINTENANCE",
    "FULL-STACK WEB DEVELOPMENT",
    "SQL DATABASE ARCHITECTURE",
    "NETWORK INFRASTRUCTURE & TOPOLOGY",
    "SYSTEM TROUBLESHOOTING & RELIABILITY",
    "HIGH-PERFORMANCE DIGITAL WORKFLOWS"
  ],
  biography: {
    heading: "BIOGRAPHY",
    kicker: "PROFESSIONAL BACKGROUND // 01",
    quote: "Every line of code and every deployed infrastructure must solve real-world problems: analyze deeply, troubleshoot relentlessly, and deliver maximum reliability.",
    quoteAuthor: "Ladzdzah — Software Engineer & On-Site Specialist",
    paragraphs: [
      "A disciplined Software Engineering graduate possessing sharp analytical thinking and troubleshooting expertise across hardware, software, and networking topologies. Experienced in designing institutional web platforms, managing relational SQL databases, configuring Microsoft 365 and Google Workspace environments, and translating technical solutions into intuitive experiences for users.",
      "Beyond code, brings a track record of leadership in student organizations, handling institutional correspondence, video production, visual branding, and athletic championship honors in international martial arts tournaments.",
      "Currently based in Pekalongan, Central Java, and ready for high-velocity software engineering, full-stack web applications, and mission-critical IT roles."
    ],
    skills: [
      "TypeScript & JavaScript",
      "React & Next.js",
      "Node.js & Express",
      "Tailwind CSS",
      "SQL & Relational DBs",
      "Linux & Windows Systems",
      "Computer Networking",
      "Hardware Troubleshooting",
      "Microsoft 365 & Google Workspace",
      "Adobe Premiere & Photoshop",
      "Figma UI/UX",
      "Git & GitHub"
    ]
  },
  projects: [
    {
      id: "proj_1",
      title: "School Employee Attendance Web Platform",
      category: "web",
      year: "2025",
      description: "A comprehensive internal attendance management system designed for educators and staff at Lembaga Pendidikan SPS TPQ Al Ikhlas Lebakbarang. Features role-based access control, automated time logging, monthly reporting, and instant printable administrative summaries.",
      tags: ["WEB PLATFORM", "INTERNAL SYSTEM", "PHP / SQL", "AUTHENTICATION"],
      image: "",
      liveUrl: "",
      githubUrl: "https://github.com/Ladzdzah",
      featured: true
    },
    {
      id: "proj_2",
      title: "Event Photography & Visual Documentation",
      category: "photo",
      year: "2024",
      description: "High-speed shutter sports and ceremonial photography documenting regional martial arts championships, student milestones, and creative campaigns with cinematic color grading in Adobe Lightroom.",
      tags: ["PHOTOGRAPHY", "SPORTS SHUTTER", "LIGHTROOM", "VISUALS"],
      image: "",
      liveUrl: "",
      githubUrl: "",
      featured: false
    },
    {
      id: "proj_3",
      title: "Student Organization Digital Media & Video Production",
      category: "other",
      year: "2022–24",
      description: "Creative media production and social media strategy for Unit Kegiatan Mahasiswa Merpati Putih. Directed promotional video reels, designed campaign visual posters, and established a digital member archive.",
      tags: ["VIDEO PRODUCTION", "SOCIAL MEDIA", "ADOBE PREMIERE"],
      image: "",
      liveUrl: "",
      githubUrl: "",
      featured: false
    },
    {
      id: "proj_4",
      title: "IT Support & Campus Infrastructure Maintenance",
      category: "other",
      year: "2023–25",
      description: "Managed daily technical troubleshooting across 30+ workstations, local routers, laser printers, OS deployments, routine hardware cleaning, and automated backup schedules for academic stability.",
      tags: ["HARDWARE", "NETWORKING", "TROUBLESHOOTING", "WINDOWS & LINUX"],
      image: "",
      liveUrl: "",
      githubUrl: "",
      featured: false
    },
    {
      id: "proj_5",
      title: "Administrative Operations & Document Archiving",
      category: "other",
      year: "2021–23",
      description: "Digitized institutional correspondence, automated administrative spreadsheets, structured filing registers, and managed operational inventory using Microsoft 365 suites.",
      tags: ["DATA MANAGEMENT", "DOCUMENTS", "ADMINISTRATION"],
      image: "",
      liveUrl: "",
      githubUrl: "",
      featured: false
    },
    {
      id: "proj_6",
      title: "Database System & Relational Data Architecture",
      category: "web",
      year: "2024",
      description: "Architected relational SQL schemas with data integrity constraints, automated query reporting, and institutional database maintenance protocols.",
      tags: ["SQL", "DATABASE SCHEMA", "WORKFLOW"],
      image: "",
      liveUrl: "",
      githubUrl: "https://github.com/Ladzdzah",
      featured: false
    }
  ],
  career: [
    {
      id: "car_tmc",
      year: "2025—PRESENT",
      role: "Engineer On Site",
      team: "TMC Surakarta",
      description: "As the On-Site Engineer at the Traffic Management Center (TMC) Surakarta, I am responsible for maintaining the core IT infrastructure that keeps the city's traffic monitoring running flawlessly 24/7. My role focuses on server maintenance, network management of integrated ATCS and CCTV systems, and real-time troubleshooting in the main control room. I bridge the gap between complex IT reliability and smooth public traffic operations.",
      points: "24/7 Monitoring",
      status: "ACTIVE"
    },
    {
      id: "car_1",
      year: "2025",
      role: "Lead Developer — Employee Attendance Web",
      team: "Lembaga Pendidikan SPS TPQ Al Ikhlas",
      description: "Engineered and deployed internal employee attendance system with real-time logging, user validation, and administrative audit trails.",
      points: "Lead Dev",
      status: "COMPLETED"
    },
    {
      id: "car_2",
      year: "2023—2025",
      role: "IT Support & Systems Specialist",
      team: "Lembaga Pendidikan SPS TPQ Al Ikhlas",
      description: "Spearheaded hardware/software troubleshooting, local network configuration, printer and workstation maintenance, and institutional web portal support.",
      points: "99.8% Uptime",
      status: "OPERATIONAL"
    },
    {
      id: "car_3",
      year: "2021—2023",
      role: "Staff Administrasi & Operational Support",
      team: "Lembaga Pendidikan SPS TPQ Al Ikhlas",
      description: "Handled formal correspondence, digital record archiving, procurement inventory tracking, and institutional registry formatting.",
      points: "Records Lead",
      status: "COMPLETED"
    },
    {
      id: "car_4",
      year: "2022—2024",
      role: "Secretary & Media Communications Staff",
      team: "Unit Kegiatan Mahasiswa Merpati Putih",
      description: "Managed organization proposals, member databases, public relations, visual content creation, and promotional video production.",
      points: "Media Lead",
      status: "HONORARY"
    }
  ],
  awards: [
    {
      id: "awd_1",
      year: "2023",
      title: "Juara 1 Indonesia Paku Bumi Open 11th International Championship",
      subtitle: "Kejuaraan Pencak Silat Tingkat Internasional",
      position: "1ST PLACE (GOLD)",
      issuer: "Perguruan Pencak Silat & IPSI Jawa Barat / Indonesia",
      category: "International Martial Arts Championship",
      credentialId: "PBO-XI-INT-2023-GOLD-01",
      description: "Meraih medali emas (Juara 1) pada kejuaraan pencak silat terbuka tingkat internasional yang diikuti oleh ratusan kontingen atlet dari dalam dan luar negeri. Menunjukkan dedikasi tinggi, ketahanan fisik, fokus mental, dan sportivitas kompetitif berstandar internasional."
    },
    {
      id: "awd_2",
      year: "2022",
      title: "Juara 1 Piala Rektor Unsoed Tingkat Jawa Tengah",
      subtitle: "Kejuaraan Pencak Silat Tingkat Regional Jawa Tengah",
      position: "1ST PLACE (GOLD)",
      issuer: "Universitas Jenderal Soedirman & IPSI Jawa Tengah",
      category: "Regional University Championship",
      credentialId: "UNSOED-REKTOR-CUP-2022-P1",
      description: "Meraih podium tertinggi (Juara 1 Medali Emas) pada kejuaraan bergengsi tingkat perguruan tinggi dan regional se-Jawa Tengah, membuktikan keunggulan teknik, konsistensi persiapan fisik, serta ketangguhan mental dalam kompetisi bertaraf provinsi."
    },
    {
      id: "awd_3",
      year: "2018",
      title: "Juara 1 IPSI CUP Karesidenan Pekalongan",
      subtitle: "Kejuaraan Pencak Silat Antar Daerah Karesidenan",
      position: "1ST PLACE (GOLD)",
      issuer: "Ikatan Pencak Silat Indonesia (IPSI) Karesidenan Pekalongan",
      category: "Inter-District Championship",
      credentialId: "IPSI-PKL-REG-2018-01",
      description: "Juara 1 dan peraih medali emas pada kejuaraan resmi IPSI tingkat Karesidenan Pekalongan. Menjadi fondasi awal rekam jejak kedisiplinan atletik, kepemimpinan tim, dan konsistensi kerja keras yang terbawa hingga dunia profesional."
    }
  ],
  contact: {
    heading: "LET'S BUILD SOMETHING EXCEPTIONAL.",
    description: "Available for full-time roles, web engineering contracts, IT system projects, and creative technical collaborations.",
    email: "ladzdzahhanannaafimufidz@gmail.com",
    phone: "085848253569",
    github: "github.com/Ladzdzah",
    linkedin: "https://linkedin.com/in/ladzdzah",
    base: "Pekalongan, Jawa Tengah, Indonesia"
  },
  security: {
    pinEnabled: false,
    pin: "1234"
  }
};
