import { Link } from "@tanstack/solid-router";
import { Box, Code2, FileText, Layers } from "lucide-solid";
import { For } from "solid-js";

export default function Header() {
  const links = [
    { to: "/", label: "Overview" },
    { to: "/docs/keystone/dialog", label: "Keystone Dialog" },
    { to: "/docs/mason/dialog", label: "Mason Dialog" },
    { to: "/#release", label: "0.1.0" },
  ];

  return (
    <header class="site-header">
      <Link to="/" class="brand-mark" aria-label="Keystone UI home">
        <span class="brand-symbol">
          <Layers size={18} stroke-width={2.1} />
        </span>
        <span>
          <span class="brand-name">Keystone UI</span>
          <span class="brand-subtitle">Solid primitives and source registry</span>
        </span>
      </Link>

      <div class="header-actions">
        <nav class="header-nav" aria-label="Primary navigation">
          <For each={links}>
            {(link) => (
              <Link to={link.to} class="nav-link">
                {link.label}
              </Link>
            )}
          </For>
        </nav>

        <div class="icon-links" aria-label="Project links">
          <a class="icon-link" href="#release" aria-label="Release status">
            <Box size={17} />
          </a>
          <a class="icon-link" href="#docs" aria-label="Documentation map">
            <FileText size={17} />
          </a>
          <a
            class="icon-link"
            href="https://github.com/erik-kroon/keystone-ui"
            rel="noreferrer"
            target="_blank"
            aria-label="GitHub repository"
          >
            <Code2 size={17} />
          </a>
        </div>
      </div>
    </header>
  );
}
