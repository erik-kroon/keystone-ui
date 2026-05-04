import { Link } from "@tanstack/solid-router";
import { Code2, FileText, Layers } from "lucide-solid";
import { For } from "solid-js";

export default function Header() {
  const links = [
    { to: "/", label: "Overview" },
    { to: "/docs/preview", label: "Preview" },
    { to: "/#core", label: "Core" },
    { to: "/#ui", label: "UI" },
    { to: "/#reference", label: "Reference" },
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
          <a class="icon-link" href="#shape" aria-label="Documentation shape">
            <FileText size={17} />
          </a>
          <a
            class="icon-link"
            href="https://github.com/erik-kroon/core-ui"
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
