import Link from "next/link";
import { footer } from "./config";
import SocialMediaButtons from "../social/social-media-icons";
import { config } from "@/data/config";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t border-border px-[var(--gutter-page)] py-6 sm:flex-row sm:justify-between">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        © {year} {config.author}. All rights reserved.
      </p>
      <SocialMediaButtons />
      <nav aria-label="Footer navigation" className="flex gap-4 sm:gap-6 z-10">
        {footer.map((link) => {
          const { title, href } = link;

          return (
            <Link
              className="inline-flex min-h-11 items-center rounded-control px-token-3 text-xs underline-offset-4 hover:underline"
              href={href}
              key={href}
            >
              {title}
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}

export default Footer;
