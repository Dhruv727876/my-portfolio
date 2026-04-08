// ADD NEW PROJECTS HERE (Top releases shown in Recent Releases)
const PROJECTS_DATA = [
  {
    title: "CORESHIFT",
    description: "The modern, all-in-one HR platform designed for scaling teams. Managed workforce with intelligence and speed.",
    category: "functional",
    image: "PROJECT21thumbnail.webp",
    link: "https://dhruv727876.github.io/coreshift/",
    tags: ["NEXT.JS 16", "BUN", "HRMS"],
    special: "Intelligent workforce management",
    buttonText: "Launch Platform",
    buttonColor: "!bg-[#EF4444] !text-white"
  },
  {
    title: "FOLIO OS DESKTOP",
    description: "An elite celestial desktop operating system experience built for high-density technical portfolios and immersive navigation.",
    category: "functional",
    image: "PROJECT20thumbnail.webp",
    link: "https://dhruv727876.github.io/folio-os-Portfolio/",
    tags: ["GSAP 3", "THREE.JS", "GLASSMORPHISM V4"],
    special: "Celestial 'Aura' Particle Engine",
    buttonText: "Enter Environment",
    buttonColor: "!bg-cyber-cyan !text-black"
  },
  {
    title: "OBSIDIAN NOIR",
    description: "A premium cinematic fitness platform with a \"Silent Authority\" design system and HUD-driven interactions.",
    category: "functional",
    image: "PROJECT19thumbnail.webp",
    link: "https://dhruv727876.github.io/ObsidianGym/",
    tags: ["NEXT.JS 15", "CINEMATIC UI", "Silent Authority"],
    special: "HUD-driven \"Silent Authority\" patterns",
    buttonText: "Launch Experience",
    buttonColor: "!bg-white !text-black"
  },
  {
    title: "AURA",
    description: "An elite Next.js SaaS architecture featuring fluid structural animations and deep structural design.",
    category: "functional",
    image: "PROJECT18thumbnail.webp",
    link: "https://dhruv727876.github.io/AuraSaasProject/",
    tags: ["STRUCTURAL UX", "NEXT.JS 15", "Elite Architecture"],
    special: "Fluid structural transitions",
    buttonText: "Launch Experience",
    buttonColor: "!bg-[#f59e0b] !text-black"
  },
  {
    title: "ATELIER ORIGINE ",
    description: "A cinematic restaurant template featuring reservation rituals and buttery smooth animations.",
    category: "functional",
    image: "PROJECT17thumbnail.webp",
    link: "https://dhruv727876.github.io/AtelierOrigin-Restraunt/",
    tags: ["NEXT.JS 15", "LUXURY UX", "Ritual Dining"],
    special: "Cinematic reservation rituals",
    buttonText: "Launch Experience",
    buttonColor: "bg-cyber-cyan"
  },
  {
    title: "PEARLCREST ",
    description: "A luxury dental clinic landing page engineered purely with Vanilla JS and CSS3.",
    category: "functional",
    image: "PROJECT16thumbnail.webp",
    link: "https://dhruv727876.github.io/PearlCrest-DentalStudio/",
    tags: ["VANILLA JS", "PERFORMANCE", "Dental Studio"],
    special: "Zero-dependency architecture",
    buttonText: "Visit Studio",
    buttonColor: "!bg-[#0ea5a0] !text-white"
  },
  {
    title: "ROOTHEA ",
    description: "A high-end, botanical-rooted sanctuary web app with GSAP reveal animations.",
    category: "functional",
    image: "PROJECT15thumbnail.webp",
    link: "https://dhruv727876.github.io/Roothea-premium-salon-web/",
    tags: ["BOTANICAL UI", "GSAP", "Organic Wellness"],
    special: "GSAP-powered organic reveals",
    buttonText: "Enter Sanctuary",
    buttonColor: "!bg-[#8a9e65] !text-white"
  },
  {
    title: "VELOUR ",
    description: "A high-performance luxury salon web experience with adaptive grid systems.",
    category: "functional",
    image: "PROJECT14thumbnail.webp",
    link: "https://dhruv727876.github.io/VelourHairSalon/",
    tags: ["CSS GRID", "PERFORMANCE UX", "Digital Flagship"],
    special: "Adaptive adaptive grid systems",
    buttonText: "Enter Flagship",
    buttonColor: "bg-[#d4af37]"
  },
  {
    title: "LUMINA ",
    description: "A high-end, luxury clinical web app with complex scroll-parallax animations.",
    category: "functional",
    image: "PROJECT13thumbnail.webp",
    link: "PROJECT13/index.html",
    tags: ["LUXURY UI", "REACTION", "Premium Dental"],
    special: "Complex parallax orchestration",
    buttonText: "Experience Luxury",
    buttonColor: "bg-[#c5a880]"
  },
  {
    title: "ELYX ",
    description: "The operating system for autonomous agents with multi-layered orchestration.",
    category: "functional",
    image: "PROJECT12thumbnail.webp",
    link: "PROJECT12/index.html",
    tags: ["NEXT.JS 15", "AI OS", "Autonomous Agent"],
    special: "Multi-layered orchestration",
    buttonText: "Initialize OS",
    buttonColor: "bg-cyber-cyan"
  },
  {
    title: "Drip Fashion ",
    description: "A high-contrast, maximalist e-commerce web app with fluid glassmorphism.",
    category: "functional",
    image: "PROJECT11thumbnail.webp",
    link: "PROJECT11/index.html",
    tags: ["NEXT.JS", "BRUTALIST UI", "Brutalist"],
    special: "Kinetic typography system",
    buttonText: "Enter Runway",
    buttonColor: "!bg-pink-500 !text-white"
  },
  {
    title: "ORYON GENESIS ",
    description: "A cinematic hardware visualization featuring orbital 3D cylinder deconstruction.",
    category: "functional",
    image: "PROJECT10thumbnail.webp",
    link: "https://dhruv727876.github.io/oryon-genesis/",
    tags: ["3D ORBIT", "RTX LIGHTING", "Snapdragon"],
    special: "Hardware-accelerated rendering",
    buttonText: "Initialize Core",
    buttonColor: "bg-cyber-cyan"
  },
  {
    title: "NEXUS ",
    description: "A futuristic UI kit featuring advanced glassmorphism and physics-based card interactions.",
    category: "landing",
    image: "PROJECT9thumbnail.webp",
    link: "PROJECT9/index.html",
    tags: ["REACT", "FRAMER", "Glassmorphism UI"],
    special: "Liquid glassmorphism kit",
    buttonText: "Launch System",
    buttonColor: "bg-emerald-500"
  },
  {
    title: "Physics Lamp Login // ",
    description: "A creative login interface featuring a physics-based pull cord and dynamic radial lighting.",
    category: "landing",
    image: "PROJECT7thumbnail.webp",
    link: "https://dhruv727876.github.io/interactive-lamp-login/",
    tags: ["VANILLA JS", "PHYSICS ENGINE"],
    special: "Entropy physics cord logic",
    buttonText: "Pull The Cord",
    buttonColor: "bg-yellow-400"
  },
  {
    title: "Modern UI/UX System // ",
    description: "High-fidelity interface design featuring advanced auto-layout components and interactive prototyping.",
    category: "landing",
    image: "PROJECT8thumbnail.webp",
    link: "https://www.figma.com/design/jNCuFUklwyyFRrUk8Kw54J/Untitled?node-id=1-1375&t=iXS1C2NhueaHFZjE-1",
    tags: ["FIGMA", "SYSTEM DESIGN", "Figma"],
    special: "Advanced auto-layout kit",
    buttonText: "View Prototype",
    buttonColor: "!bg-pink-500 !text-white"
  },
  {
    title: "Apple Watch 9 // GSAP",
    description: "A cinematic product landing page using GSAP ScrollTrigger to orchestrate complex 3D camera movements.",
    category: "3d",
    image: "PROJECT6thumbnail.webp",
    link: "PROJECT6/index.html",
    tags: ["GSAP", "WEBGL"],
    special: "3D camera pathing",
    buttonText: "View Experience",
    buttonColor: "!bg-blue-500 !text-white"
  },
  {
    title: "Nike 3D Configurator // Three.js",
    description: "An immersive 3D product customization tool with real-time state management and WebGL rendering.",
    category: "3d",
    image: "PROJECT5thumbnail.webp",
    link: "PROJECT5/index.html",
    tags: ["THREE.JS", "REACT"],
    special: "Real-time state config",
    buttonText: "Launch 3D App",
    buttonColor: "bg-amber-500"
  },
  {
    title: "SENTIENT // Real-Time AI",
    description: "A high-performance computer vision system running entirely in the browser using Google's EfficientDet-Lite model.",
    category: "cyber",
    image: "PROJECT4thumbnail.webp",
    link: "PROJECT4/index.html",
    tags: ["TENSORFLOW", "AI/ML"],
    special: "EfficientDet-Lite edge AI",
    buttonText: "Launch Vision",
    buttonColor: "bg-green-500"
  },
  {
    title: "NODEHUNTER // Global IP Tracker",
    description: "A real-time network surveillance tool that hunts down IP addresses and visualizes ISP data center locations.",
    category: "cyber",
    image: "PROJECT3thumbnail.webp",
    link: "PROJECT3/index.html",
    tags: ["LEAFLET.JS", "OSINT"],
    special: "Global packet visualization",
    buttonText: "Initiate Scan",
    buttonColor: "!bg-blue-500 !text-white"
  },
  {
    title: "PixelCipher // Steganography",
    description: "A browser-based spy tool that hides secret text messages inside ordinary image files using bit-manipulation algorithms (LSB).",
    category: "cyber",
    image: "PROJECT2thumbnail.webp",
    link: "PROJECT2/index.html",
    tags: ["CANVAS API", "SECURITY"],
    special: "Bit-level manipulation",
    buttonText: "Launch Tool",
    buttonColor: "bg-green-500"
  },

  {
    title: "iPhone 17 Pro Clone",
    description: "A pixel-perfect replica of Apple's launch page featuring scroll-triggered animations and bento-grid layouts.",
    category: "functional",
    image: "PROJECT1thumbnail.webp",
    link: "PROJECT1/indexAI.html",
    tags: ["REACT", "GSAP"],
    special: "Pixel-perfect bento UI",
    buttonText: "Launch Experience",
    buttonColor: "bg-cyber-cyan"
  }
];
