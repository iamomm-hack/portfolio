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
      "Privacy-first identity proofs that verify credentials without exposing personal data.",
    year: "2026",
    status: "Live prototype",
    coreTechnologies: [
      "Next.js",
      "TypeScript",
      "Stellar",
      "Soroban",
      "Zero-Knowledge",
    ],
    src: `${BASE_PATH}/stellarid/landing.png`,
    live: "https://stellarid-id.vercel.app/",
    github: "https://github.com/iamomm-hack/StellarID",
  },
  "chatmint-ai": {
    id: "chatmint-ai",
    category: "Web3",
    title: "ChatMint AI",
    valueProposition:
      "An intelligent studio that turns AI-developed ideas into registered on-chain IP assets.",
    year: "2026",
    status: "Live prototype",
    coreTechnologies: [
      "Next.js",
      "TypeScript",
      "Gemini AI",
      "Story Protocol",
      "IPFS",
    ],
    src: `${BASE_PATH}/chatmint-ai/landing.png`,
    live: "https://chat-mint-ai.vercel.app/",
    github: "https://github.com/iamomm-hack/ChatMint-AI",
  },
  stellartipjar: {
    id: "stellartipjar",
    category: "Web3",
    title: "StellarTipJar",
    valueProposition:
      "Wallet-native creator tipping with instant Stellar payments, analytics, and reporting.",
    year: "2026",
    status: "Live prototype",
    coreTechnologies: ["React", "Vite", "Stellar"],
    src: `${BASE_PATH}/stellartipjar/landing.png`,
    live: "https://stellar-tip-jar.vercel.app/",
    github: "https://github.com/iamomm-hack/StellarTipJar",
  },
  "trustmarket-dex": {
    id: "trustmarket-dex",
    category: "Web3",
    title: "TrustMarket DEX",
    valueProposition:
      "Peer-to-peer trade secured by automated escrow, reputation, and community arbitration.",
    year: "2026",
    status: "Live prototype",
    coreTechnologies: ["Next.js", "TypeScript", "Rust", "Soroban", "Stellar"],
    src: `${BASE_PATH}/trustmarket-dex/landing.png`,
    live: "https://trustmarket-dex.vercel.app/",
    github: "https://github.com/iamomm-hack/TrustMarket-DEX",
  },
  quantx: {
    id: "quantx",
    category: "Web3",
    title: "QuantX",
    valueProposition:
      "Non-custodial infrastructure for automating recurring payments across Web3 products.",
    year: "2026",
    status: "Live prototype",
    coreTechnologies: ["Next.js", "TypeScript", "Rust", "Soroban", "Node.js"],
    src: `${BASE_PATH}/quantx/landing.png`,
    live: "https://quantx-web.vercel.app/",
    github: "https://github.com/iamomm-hack/QuantX",
  },
  revealx: {
    id: "revealx",
    category: "Web3",
    title: "RevealX",
    valueProposition:
      "A time-locked prediction network where audiences stake and outcomes resolve on-chain.",
    year: "2026",
    status: "Source available",
    coreTechnologies: [
      "Next.js",
      "TypeScript",
      "Solidity",
      "Ethereum",
      "IPFS",
    ],
    src: `${BASE_PATH}/revealx/landing.png`,
    live: "",
    github: "https://github.com/iamomm-hack/RevealX",
  },
};
