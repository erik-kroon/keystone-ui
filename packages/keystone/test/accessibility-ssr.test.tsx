import { describe, expect, test } from "vitest";
import { expectSsrSmoke } from "./accessibility";

describe("primitive accessibility SSR smoke", () => {
  test("validates Dialog server fixture IDs, ARIA relationships, and force-mounted portal content", () => {
    const html = expectSsrSmoke({
      html: `<button type="button" data-scope="dialog" data-part="trigger">Open dialog</button><div role="dialog" data-scope="dialog" data-part="content" aria-labelledby="dialog-title" aria-describedby="dialog-description"><h2 id="dialog-title" data-scope="dialog" data-part="title">Project settings</h2><p id="dialog-description" data-scope="dialog" data-part="description">Change project metadata.</p></div>`,
      expectedText: "Project settings",
    });

    expect(html).toContain("Open dialog");
    expect(html).toContain('data-scope="dialog"');
    expect(html).toContain('data-part="content"');
    expect(html).toContain("aria-labelledby=");
    expect(html).toContain("aria-describedby=");
  });

  test("validates FormControl server fixture stable IDs and relationships", () => {
    const html = expectSsrSmoke({
      html: `<form><div id="project-root" data-scope="form-control" data-part="root"><label id="project-label" for="project" data-scope="form-control" data-part="label">Project</label><input id="project" aria-labelledby="project-label" aria-describedby="project-description project-error-message" aria-invalid="true" value="alpha" data-scope="form-control" data-part="control"><p id="project-description" data-scope="form-control" data-part="description">Choose the active project.</p><p id="project-error-message" data-scope="form-control" data-part="error-message">Project is required.</p><input type="hidden" name="project" value="alpha" data-scope="form-control" data-part="hidden-input"></div></form>`,
      expectedText: "Project",
    });

    expect(html).toContain('id="project-label"');
    expect(html).toContain('aria-labelledby="project-label"');
    expect(html).toContain("project-description");
    expect(html).toContain("project-error-message");
    expect(html).toContain('data-part="hidden-input"');
  });
});
