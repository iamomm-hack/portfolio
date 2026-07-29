export type ProjectRecord = {
  id: string;
  category: string;
  title: string;
  valueProposition: string;
  year: string;
  status: string;
  coreTechnologies: string[];
  src: string;
  live: string;
  github?: string;
};

const BASE_PATH = "/assets/projects-screenshots";

export const FEATURED_PROJECT_IDS = [
  "stellarid",
  "chatmint-ai",
  "stellartipjar",
] as const;

export const PROJECT_RECORDS: Record<string, ProjectRecord> = {
  stellarid: {
    id: "stellarid",
    category: "Web3",
    title: "StellarID",
    valueProposition:
      "Privacy-first decentralized identity protocol built on Stellar with zero-knowledge credential verification.",
    year: "2026",
    status: "Live prototype",
    coreTechnologies: ["Next.js", "TypeScript", "Stellar", "Soroban", "Zero-Knowledge"],
    src: `${BASE_PATH}/stellarid/landing.png`,
    live: "https://stellarid.vercel.app",
    github: "https://github.com/iamomm-hack/StellarID",
  },
  "chatmint-ai": {
    id: "chatmint-ai",
    category: "Web3",
    title: "ChatMint AI",
    valueProposition:
      "AI-powered intellectual property platform for registering and protecting ideas on-chain.",
    year: "2026",
    status: "Live prototype",
    coreTechnologies: ["Next.js", "TypeScript", "Gemini AI", "Story Protocol", "IPFS"],
    src: `${BASE_PATH}/chatmint-ai/landing.png`,
    live: "https://chatmint-ai.vercel.app",
    github: "https://github.com/iamomm-hack/ChatMintAI",
  },
  stellartipjar: {
    id: "stellartipjar",
    category: "Web3",
    title: "StellarTipJar",
    valueProposition:
      "Wallet-native creator tipping platform with analytics, instant Stellar payments, and donation tracking.",
    year: "2026",
    status: "Live prototype",
    coreTechnologies: ["React", "Vite", "Stellar"],
    src: `${BASE_PATH}/stellartipjar/landing.png`,
    live: "https://stellartipjar.vercel.app",
    github: "https://github.com/iamomm-hack/StellarTipJar",
  },
  matchmesh: {
    id: "matchmesh",
    category: "AI Infrastructure",
    title: "MatchMesh",
    valueProposition:
      "AI infrastructure for football agents using MCP, x402 micropayments, and Injective settlement.",
    year: "2026",
    status: "Live prototype",
    coreTechnologies: ["MCP", "x402", "Injective", "AI Agents"],
    src: `${BASE_PATH}/matchmesh/landing.jpg`,
    live: "https://matchmesh-app.vercel.app/",
    github: "https://github.com/iamomm-hack/MatchMesh",
  },
  veriscope: {
    id: "veriscope",
    category: "Web3",
    title: "Veriscope",
    valueProposition:
      "On-chain AI agent identity, governance, permission capsules, and reputation protocol built on Stellar Soroban.",
    year: "2026",
    status: "Live prototype",
    coreTechnologies: ["Stellar", "Soroban", "AI Agents", "On-chain Identity"],
    src: `${BASE_PATH}/veriscope/landing.jpg`,
    live: "https://veriscope-web.vercel.app/",
    github: "https://github.com/iamomm-hack/Veriscope",
  },
  "injective-intelligence": {
    id: "injective-intelligence",
    category: "Applied AI",
    title: "Injective Intelligence",
    valueProposition:
      "AI behavioral intelligence dashboard that analyzes Injective wallet activity and trader psychology.",
    year: "2026",
    status: "Live prototype",
    coreTechnologies: ["Injective", "AI", "Wallet Analytics", "Behavioral Intelligence"],
    src: `${BASE_PATH}/injective-intelligence/landing.png`,
    live: "https://inj-dna.vercel.app/",
    github: "https://github.com/iamomm-hack/Injective-Intelligence",
  },
  miiso: {
    id: "miiso",
    category: "Web3 Security",
    title: "Miiso",
    valueProposition:
      "Autonomous AI security layer that detects malicious contracts and revokes dangerous approvals before exploits occur.",
    year: "2026",
    status: "Live prototype",
    coreTechnologies: ["AI Agents", "Smart Contracts", "DeFi Security", "On-chain Automation"],
    src: `${BASE_PATH}/miiso/landing.png`,
    live: "https://miiso-ai.vercel.app/",
    github: "https://github.com/SATISH-JALAN/Miiso",
  },
};
