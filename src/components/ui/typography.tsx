import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyH1({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "scroll-m-20 font-display text-heading-1 font-normal tracking-tight",
        className
      )}
    >
      {children}
    </h1>
  );
}
export function TypographyH2({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b border-divider pb-2 font-display text-heading-2 font-normal tracking-tight first:mt-0",
        className
      )}
    >
      {children}
    </h2>
  );
}
export function TypographyH3({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "scroll-m-20 font-display text-heading-3 font-normal tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}
export function TypographyH4({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-lead font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h4>
  );
}
export function TypographyP({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("measure-body text-body [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  );
}
export function TypographyBlockquote({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>
      {children}
    </blockquote>
  );
}
export function TypographyTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("my-6 w-full overflow-y-auto", className)}>
      <table className={cn("w-full")}>
        <thead>
          <tr className={cn("m-0 border-t p-0 even:bg-muted")}>
            <th
              className={cn(
                "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
              )}
            >
              King&apos;s Treasury
            </th>
            <th
              className={cn(
                "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
              )}
            >
              People&apos;s happiness
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className={cn("m-0 border-t p-0 even:bg-muted")}>
            <td
              className={cn(
                "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
              )}
            >
              Empty
            </td>
            <td
              className={cn(
                "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
              )}
            >
              Overflowing
            </td>
          </tr>
          <tr className={cn("m-0 border-t p-0 even:bg-muted")}>
            <td
              className={cn(
                "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
              )}
            >
              Modest
            </td>
            <td
              className={cn(
                "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
              )}
            >
              Satisfied
            </td>
          </tr>
          <tr className={cn("m-0 border-t p-0 even:bg-muted")}>
            <td
              className={cn(
                "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
              )}
            >
              Full
            </td>
            <td
              className={cn(
                "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
              )}
            >
              Ecstatic
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export function TypographyList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>
      {children}
    </ul>
  );
}
export function TypographyInlineCode({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <code
      className={cn(
        "relative rounded-technical bg-muted px-token-2 py-token-1 font-mono text-technical font-semibold",
        className
      )}
    >
      {children}
    </code>
  );
}
export function TypographyLead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("measure-body text-lead text-muted-foreground", className)}>{children}</p>
  );
}
export function TypographyLarge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-body font-semibold", className)}>{children}</div>
  );
}

export function TypographySmall({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <small className={cn("text-technical font-medium leading-none", className)}>
      {children}
    </small>
  );
}
export function TypographyMuted({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-supporting text-muted-foreground", className)}>{children}</p>
  );
}
