import Link from "next/link";

const NotFoundPage = () => {
  return (
    <main className="container flex min-h-screen max-w-content flex-col items-center justify-center gap-token-6 text-center">
      <p className="text-technical text-muted-foreground">404 · Signal lost</p>
      <h1 className="text-balance font-display text-heading-1 text-bone">
        This experiment does not exist.
      </h1>
      <Link
        href="/"
        className="rounded-control border border-border px-token-6 py-token-3 text-supporting"
      >
        Return to the lab
      </Link>
    </main>
  );
};

export default NotFoundPage;
