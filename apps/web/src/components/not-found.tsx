import { Link } from "@tanstack/solid-router";

import { Button, buttonClass } from "@keystone-ui/ui/button";

import { useI18n } from "@/lib/i18n";

export function NotFound() {
  const { t } = useI18n();

  return (
    <div class="z-50 -mt-32 flex w-full flex-1 flex-col items-center justify-center gap-4 space-y-2 px-4 text-center">
      <h1 class="mb-8 bg-gradient-to-br from-primary to-muted-foreground bg-clip-text text-9xl font-bold tracking-tighter text-transparent drop-shadow-sm">
        404
      </h1>
      <p class="max-w-md text-muted-foreground">{t("public.runtime.notFound.description")}</p>
      <p class="flex flex-wrap items-center justify-center gap-8">
        <Button type="button" onClick={() => window.history.back()}>
          {t("public.runtime.errors.actions.back")}
        </Button>
        <Link to="/" class={buttonClass({ variant: "secondary" })}>
          {t("public.runtime.errors.actions.home")}
        </Link>
      </p>
    </div>
  );
}
