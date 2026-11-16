"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="section-pad bg-surface-alt min-h-[70vh]">
      <div className="container-site max-w-xl">
        <p className="eyebrow mb-3 text-bad">Something went wrong</p>
        <h1 className="heading-3 mb-3">We hit an unexpected error</h1>
        <p className="mb-6 text-sm text-body">
          Please try again. If this keeps happening, start a new free assessment
          or return home.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="primary" size="md" onClick={reset}>
            Try again
          </Button>
          <ButtonLink href="/audit" variant="secondaryLight" size="md">
            Free assessment
          </ButtonLink>
          <ButtonLink href="/" variant="ghost" size="md">
            Home
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
