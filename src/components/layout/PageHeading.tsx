import type { ReactNode } from "react";
import { BackButton } from "./BackButton";

/**
 * Back button + page title, shared by the list pages.
 *
 * Two different layouts, per the mockups: mobile stacks them left-aligned
 * (`*-mobile.png`), while from sm: up the title is centred in the row with the
 * back button pinned to the left edge (`*-desktop.png`).
 *
 * Extracted because all three list pages had this block copy-pasted, and every
 * styling tweak so far has had to be applied three times.
 */
export function PageHeading({
  children,
  backHref,
}: {
  children: ReactNode;
  backHref?: string;
}) {
  return (
    <div className="relative flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-0">
      <div className="sm:absolute sm:left-0">
        <BackButton href={backHref} />
      </div>
      <h1 className="text-lg sm:text-3xl">{children}</h1>
    </div>
  );
}
