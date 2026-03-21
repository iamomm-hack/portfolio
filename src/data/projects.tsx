import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { RiNextjsFill, RiNodejsFill, RiReactjsFill } from "react-icons/ri";
import {
  SiExpress,
  SiMongodb,
  SiRust,
  SiShadcnui,
  SiSolidity,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { TbBrandFramerMotion } from "react-icons/tb";
const BASE_PATH = "/assets/projects-screenshots";

const ProjectsLinks = ({ live, repo }: { live: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      {live && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={live}
        >
          <Button variant={"default"} size={"sm"}>
            Visit Website
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
      {repo && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            Github
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};

const PROJECT_SKILLS = {
  next: {
    title: "Next.js",
    bg: "black",
    fg: "white",
    icon: <RiNextjsFill />,
  },
  node: {
    title: "Node.js",
    bg: "black",
    fg: "white",
    icon: <RiNodejsFill />,
  },
  react: {
    title: "React.js",
    bg: "black",
    fg: "white",
    icon: <RiReactjsFill />,
  },
  tailwind: {
    title: "Tailwind CSS",
    bg: "black",
    fg: "white",
    icon: <SiTailwindcss />,
  },
  ts: {
    title: "TypeScript",
    bg: "black",
    fg: "white",
    icon: <SiTypescript />,
  },
  shadcn: {
    title: "Shadcn UI",
    bg: "black",
    fg: "white",
    icon: <SiShadcnui />,
  },
  mongo: {
    title: "MongoDB",
    bg: "black",
    fg: "white",
    icon: <SiMongodb />,
  },
  express: {
    title: "Express",
    bg: "black",
    fg: "white",
    icon: <SiExpress />,
  },
  rust: {
    title: "Rust",
    bg: "black",
    fg: "white",
    icon: <SiRust />,
  },
  solidity: {
    title: "Solidity",
    bg: "black",
    fg: "white",
    icon: <SiSolidity />,
  },
  framerMotion: {
    title: "Framer Motion",
    bg: "black",
    fg: "white",
    icon: <TbBrandFramerMotion />,
  },
  gemini: {
    title: "Gemini AI",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>G</strong>ai
      </span>
    ),
  },
  stellar: {
    title: "Stellar",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>S</strong>lr
      </span>
    ),
  },
  soroban: {
    title: "Soroban",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>S</strong>rb
      </span>
    ),
  },
  storyProtocol: {
    title: "Story Protocol",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>S</strong>P
      </span>
    ),
  },
  ipfs: {
    title: "IPFS (Pinata)",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>IP</strong>FS
      </span>
    ),
  },
  ethereum: {
    title: "Ethereum",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>E</strong>TH
      </span>
    ),
  },
  hardhat: {
    title: "Hardhat",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>H</strong>H
      </span>
    ),
  },
  zustand: {
    title: "Zustand",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>Z</strong>st
      </span>
    ),
  },
  vite: {
    title: "Vite",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>V</strong>t
      </span>
    ),
  },
};

export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};

const projects: Project[] = [
  {
    id: "chatmint-ai",
    category: "Web3",
    title: "ChatMint AI",
    src: `${BASE_PATH}/chatmint-ai/landing.png`,
    screenshots: ["landing.png", "idea-chat-studio.png", "visual-ip.png", "register.png"],
    live: "https://chat-mint-ai.vercel.app/",
    github: "https://github.com/iamomm-hack/ChatMint-AI",
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.gemini,
      ],
      backend: [
        PROJECT_SKILLS.storyProtocol,
        PROJECT_SKILLS.ipfs,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            ChatMint AI is an Intelligent IP Studio that combines AI-powered idea
            generation with blockchain-based intellectual property registration.
            Chat with Gemini AI to spark creative ideas, then register your
            visual creations as IP assets on Story Protocol.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">
            AI-Powered Idea Generation
          </TypographyH3>
          <p className="font-mono mb-2">
            Powered by Google Gemini 2.5 Flash, ChatMint AI helps you brainstorm
            and generate creative ideas through an intelligent chat interface.
            Turn conversations into visual IP assets.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/chatmint-ai/landing.png`,
              `${BASE_PATH}/chatmint-ai/idea-chat-studio.png`,
              `${BASE_PATH}/chatmint-ai/visual-ip.png`,
              `${BASE_PATH}/chatmint-ai/register.png`,
            ]}
          />
          <TypographyH3 className="my-4 mt-8">
            Blockchain IP Registration
          </TypographyH3>
          <p className="font-mono mb-2">
            Register your creations as intellectual property on Story Protocol
            (Aeneid testnet). Assets are stored on Pinata IPFS for
            decentralized, permanent storage.
          </p>
        </div>
      );
    },
  },
  {
    id: "stellartipjar",
    category: "Web3",
    title: "StellarTipJar",
    src: `${BASE_PATH}/stellartipjar/landing.png`,
    screenshots: ["landing.png", "send_tip.png", "analytics.png", "history.png"],
    live: "https://stellar-tip-jar.vercel.app/",
    github: "https://github.com/iamomm-hack/StellarTipJar",
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.vite,
      ],
      backend: [
        PROJECT_SKILLS.stellar,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            A feature-rich, interactive Stellar tipping application designed for
            content creators. Built with React and Stellar SDK, seamlessly
            bridging the gap between creators and their supporters.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Core Tipping</TypographyH3>
          <p className="font-mono mb-2">
            Supports Freighter wallet integration with instant tips (1, 5, 10
            XLM) or custom values. Real-time USD/XLM conversion rates update
            automatically.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/stellartipjar/landing.png`,
              `${BASE_PATH}/stellartipjar/send_tip.png`,
              `${BASE_PATH}/stellartipjar/analytics.png`,
              `${BASE_PATH}/stellartipjar/history.png`,
            ]}
          />
          <TypographyH3 className="my-4 mt-8">
            Analytics & Reporting
          </TypographyH3>
          <p className="font-mono mb-2">
            Includes chart.js analytics, PDF reporting via jspdf, QR code
            generation, and canvas-confetti visual effects for a delightful user
            experience.
          </p>
        </div>
      );
    },
  },
  {
    id: "trustmarket-dex",
    category: "Web3",
    title: "TrustMarket DEX",
    src: `${BASE_PATH}/trustmarket-dex/landing.png`,
    screenshots: ["landing.png", "dashboard.png", "create-trade.png", "stake.png", "docs.png"],
    live: "https://trustmarket-dex.vercel.app/",
    github: "https://github.com/iamomm-hack/TrustMarket-DEX",
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.zustand,
      ],
      backend: [
        PROJECT_SKILLS.rust,
        PROJECT_SKILLS.soroban,
        PROJECT_SKILLS.stellar,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            TrustMarket DEX is a decentralized peer-to-peer marketplace built on
            the Stellar network using Soroban smart contracts. It solves core
            problems of internet trading — scams, lack of accountability, and
            high middleman fees — through automated escrow, soulbound on-chain
            reputation (TRUST tokens), and decentralized community arbitration.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">
            Automated Escrow & Reputation
          </TypographyH3>
          <p className="font-mono mb-2">
            Smart contract-powered escrow ensures secure peer-to-peer trades.
            Soulbound TRUST tokens build on-chain reputation that
            can&apos;t be transferred or faked.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/trustmarket-dex/landing.png`,
              `${BASE_PATH}/trustmarket-dex/dashboard.png`,
              `${BASE_PATH}/trustmarket-dex/create-trade.png`,
              `${BASE_PATH}/trustmarket-dex/stake.png`,
              `${BASE_PATH}/trustmarket-dex/docs.png`,
            ]}
          />
          <TypographyH3 className="my-4 mt-8">
            CI/CD Pipeline
          </TypographyH3>
          <p className="font-mono mb-2">
            GitHub Actions runs on every push to main — TypeScript type-check +
            Next.js production build for frontend, and Rust/Soroban WASM
            compilation for contracts.
          </p>
        </div>
      );
    },
  },
  {
    id: "quantx",
    category: "Web3",
    title: "QuantX",
    src: `${BASE_PATH}/quantx/landing.png`,
    screenshots: ["landing.png", "dashboard.png", "plans.png", "stream.png"],
    live: "https://quantx-web.vercel.app/",
    github: "https://github.com/iamomm-hack/QuantX",
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.shadcn,
      ],
      backend: [
        PROJECT_SKILLS.rust,
        PROJECT_SKILLS.soroban,
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.express,
        PROJECT_SKILLS.mongo,
        PROJECT_SKILLS.stellar,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            QuantX is a Recurring Finance Infrastructure (RFI) protocol built on
            Stellar&apos;s Soroban smart contract platform. It solves the
            critical automation gap in Web3 by enabling trustless, non-custodial
            recurring payments using stablecoins (USDC/XLM).
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">
            Smart Contract Vault System
          </TypographyH3>
          <p className="font-mono mb-2">
            Unlike traditional Web3 transactions requiring manual signing,
            QuantX implements a smart contract vault system allowing users to
            pre-authorize recurring payments while maintaining full custody of
            their assets.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/quantx/landing.png`,
              `${BASE_PATH}/quantx/dashboard.png`,
              `${BASE_PATH}/quantx/plans.png`,
              `${BASE_PATH}/quantx/stream.png`,
            ]}
          />
          <TypographyH3 className="my-4 mt-8">
            Full-Stack Architecture
          </TypographyH3>
          <p className="font-mono mb-2">
            Includes a TypeScript SDK (quantx-sdk), off-chain keeper/executor
            service for monitoring due payments, Telegram bot for managing
            subscriptions, and Freighter + Albedo wallet integration.
          </p>
        </div>
      );
    },
  },
  {
    id: "revealx",
    category: "Web3",
    title: "RevealX",
    src: `${BASE_PATH}/revealx/landing.png`,
    screenshots: ["landing.png", "create.png", "leaderboard.png", "profile.png"],
    live: "",
    github: "https://github.com/iamomm-hack/RevealX",
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.shadcn,
      ],
      backend: [
        PROJECT_SKILLS.solidity,
        PROJECT_SKILLS.ethereum,
        PROJECT_SKILLS.hardhat,
        PROJECT_SKILLS.ipfs,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            RevealX is a decentralized time-locked prediction protocol — a
            social platform where future posts are locked on-chain, audiences
            stake on predictions, and truth is revealed at a fixed time.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">
            On-Chain Predictions
          </TypographyH3>
          <p className="font-mono mb-2">
            Built on Ethereum with Solidity 0.8.20 and Hardhat. Uses
            OpenZeppelin ReentrancyGuard and custom prediction logic for secure,
            trustless time-locked content.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/revealx/landing.png`,
              `${BASE_PATH}/revealx/create.png`,
              `${BASE_PATH}/revealx/leaderboard.png`,
              `${BASE_PATH}/revealx/profile.png`,
            ]}
          />
          <TypographyH3 className="my-4 mt-8">
            Encryption & Storage
          </TypographyH3>
          <p className="font-mono mb-2">
            Content is encrypted with AES-256 via CryptoJS with
            signature-based key derivation. Encrypted data is stored on IPFS
            through Pinata for decentralized, permanent storage.
          </p>
        </div>
      );
    },
  },
];

export default projects;
