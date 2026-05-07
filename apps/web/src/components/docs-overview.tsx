import { Info } from "lucide-solid";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@keystone-ui/ui/default/ui/alert.tsx";

import { DocsPageFrame, PageHeader, PageHeaderHeading } from "@/components/docs-shell";
import { MdxContent, MdxH2, MdxList, MdxP } from "@/components/mdx-components";
import { overviewPage } from "@/lib/docs-data";

const sectionClass = "mt-10 scroll-mt-24 lg:mt-12";
const sectionHeadingClass = "mb-3 font-heading text-2xl leading-tight lg:text-3xl";
const proseClass =
  "max-w-[76ch] text-base leading-7 text-muted-foreground sm:leading-8 [text-wrap:pretty]";
const listClass =
  "my-4 max-w-[76ch] space-y-2 pl-5 text-base leading-7 text-muted-foreground marker:text-muted-foreground sm:leading-8";
const introMeasureClass = "w-full max-w-[76ch]";

export function DocsOverview() {
  return (
    <DocsPageFrame page={overviewPage}>
      <MdxContent id="top">
        <PageHeader class="flex flex-col gap-5 sm:gap-6">
          <div class="flex flex-col gap-2">
            <PageHeaderHeading class="text-4xl lg:text-5xl">Introduction</PageHeaderHeading>
          </div>
          <div class="flex flex-col items-start gap-6">
            <div
              class={`grid ${introMeasureClass} gap-4 text-base text-muted-foreground leading-7 sm:leading-8 [text-wrap:pretty]`}
            >
              <p class="m-0">
                <strong class="font-medium text-foreground">Keystone UI</strong> is a collection of
                beautifully designed, accessible and composable components for modern Solid
                applications. Built on top of{" "}
                <strong class="font-medium text-foreground  underline-offset-4">
                  Keystone Core
                </strong>{" "}
                and styled with{" "}
                <strong class="font-medium text-foreground  underline-offset-4">
                  Tailwind CSS,
                </strong>{" "}
                it's designed for you to copy, paste and own.
              </p>
              <p class="m-0">
                We think accessible, unstyled primitives are the best foundation for modern web
                applications. Keystone Core handles the behavior layer, and Keystone UI gives those
                primitives a design system that's ready to shape into your app.
              </p>
              <p class="m-0">
                This is the component system we're shaping for serious Solid products: dashboards,
                internal tools, developer tools, analytics workspaces and other{" "}
                <strong class="font-medium text-foreground">data-dense interfaces</strong> where
                clarity and keyboard behavior matter.
              </p>
            </div>

            <Alert variant="info">
              <AlertIcon>
                <Info />
              </AlertIcon>
              <AlertTitle>Early Access</AlertTitle>
              <AlertDescription class="[text-wrap:pretty]">
                Keystone UI is in early development. The component source and Core primitives are
                still evolving, so expect breaking changes while the project takes shape. It is not
                recommended for production applications yet.
              </AlertDescription>
            </Alert>
          </div>
        </PageHeader>

        <section id="built-on-keystone-core" class={sectionClass}>
          <MdxH2 class={sectionHeadingClass}>Core</MdxH2>
          <MdxP class={proseClass}>
            Keystone UI is built on{" "}
            <strong class="font-medium text-foreground">Keystone Core</strong> from the ground up.{" "}
            <strong class="font-medium text-foreground">Core</strong> owns the hard primitive
            behavior: accessibility, keyboard navigation, focus management, dismissal, positioning,
            form semantics, SSR, hydration and controlled or uncontrolled state.
          </MdxP>
          <MdxList class={listClass}>
            <li>
              <strong class="font-medium text-foreground">Accessible primitive behavior</strong>{" "}
              without forcing a visual language into Core.
            </li>
            <li>
              <strong class="font-medium text-foreground">
                Product-ready composition patterns
              </strong>{" "}
              for overlays, fields, forms, and data-dense workflows.
            </li>
            <li>
              <strong class="font-medium text-foreground">Thoughtful defaults</strong> optimized for
              modern Solid applications.
            </li>
            <li>
              <strong class="font-medium text-foreground">Consistent design tokens</strong> across
              components, docs, previews, and registry source.
            </li>
          </MdxList>
        </section>

        <section id="own-your-code" class={sectionClass}>
          <MdxH2 class={sectionHeadingClass}>Own your code</MdxH2>
          <MdxP class={proseClass}>
            Keystone follows the source-owned ethos of{" "}
            <strong class="font-medium text-foreground">shadcn/ui</strong>. Readable component files
            live in your project, where you can adapt them as your product changes. Mason is the
            planned registry and CLI layer for that workflow, but the source model comes first.
          </MdxP>
          <MdxList class={listClass}>
            <li>
              <strong class="font-medium text-foreground">Editable source:</strong> components live
              in your app instead of behind an opaque styled runtime.
            </li>
            <li>
              <strong class="font-medium text-foreground">Endless customization:</strong> need to
              change behavior, markup, or styling? Edit the file.
            </li>
            <li>
              <strong class="font-medium text-foreground">Learn by doing:</strong> read the Solid
              source, see how the pieces are composed, and adapt the pattern to your needs.
            </li>
          </MdxList>
          <MdxP class={proseClass}>
            Keystone source is meant to be{" "}
            <strong class="font-medium text-foreground">read, reviewed and changed.</strong>
            Components use explicit Solid code, stable data attributes and predictable files. That
            keeps the system legible as your team adapts it over time.
          </MdxP>
        </section>

        <section id="get-involved" class={sectionClass}>
          <MdxH2 class={sectionHeadingClass}>Get involved</MdxH2>
          <MdxP class={proseClass}>
            Contributions, bug reports, accessibility notes, tests, examples, and docs improvements
            are welcome while Keystone is still forming. Start with the{" "}
            <a
              class="font-medium text-foreground underline underline-offset-4"
              href="/docs/components/button"
            >
              current component docs
            </a>{" "}
            and roadmap, then open an issue or pull request with the behavior, evidence, or source
            change you want to contribute.
          </MdxP>
        </section>
      </MdxContent>
    </DocsPageFrame>
  );
}
