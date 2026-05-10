import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

describe("Table", () => {
  test("renders native table anatomy with stable styling hooks", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <TableContainer aria-label="Revenue table">
          <Table>
            <TableCaption>Quarterly revenue</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Quarter</TableHead>
                <TableHead scope="col">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow data-state="selected">
                <TableCell>Q1</TableCell>
                <TableCell>$120k</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>$120k</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ),
      host,
    );

    const container = host.querySelector("[data-slot='table-container']");
    const table = host.querySelector("table");
    const caption = host.querySelector("caption");
    const head = host.querySelector("th");
    const selectedRow = host.querySelector("tbody tr");
    const footer = host.querySelector("tfoot");

    expect(container?.getAttribute("data-scope")).toBe("ui-table");
    expect(container?.getAttribute("data-part")).toBe("container");
    expect(container?.getAttribute("data-variant")).toBe("default");
    expect(table?.getAttribute("data-slot")).toBe("table");
    expect(table?.getAttribute("data-variant")).toBe("default");
    expect(caption?.textContent).toBe("Quarterly revenue");
    expect(head?.getAttribute("scope")).toBe("col");
    expect(selectedRow?.getAttribute("data-state")).toBe("selected");
    expect(footer?.getAttribute("data-part")).toBe("footer");
    expect(table?.className).toContain("caption-bottom");
    expect(table?.className).toContain("border-collapse");

    dispose();
  });

  test("allows app-layer components to override data scope and parts", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <TableContainer data-scope="ui-data-table" data-part="viewport">
          <Table data-scope="ui-data-table" data-part="table">
            <TableBody data-scope="ui-data-table" data-part="body" />
          </Table>
        </TableContainer>
      ),
      host,
    );

    const container = host.querySelector("[data-part='viewport']");
    const table = host.querySelector("table");
    const body = host.querySelector("tbody");

    expect(container?.getAttribute("data-scope")).toBe("ui-data-table");
    expect(table?.getAttribute("data-scope")).toBe("ui-data-table");
    expect(body?.getAttribute("data-part")).toBe("body");
    expect(table?.getAttribute("data-variant")).toBe("default");

    dispose();
  });

  test("uses TableContainer card variant as styling context for table parts", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <TableContainer variant="card">
          <Table>
            <TableCaption>Release channels</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Channel</TableHead>
                <TableHead scope="col">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow data-selected="">
                <TableCell>Stable</TableCell>
                <TableCell>Ready</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Canary</TableCell>
                <TableCell>Review</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Count</TableCell>
                <TableCell>2</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ),
      host,
    );

    const container = host.querySelector("[data-slot='table-container']");
    const table = host.querySelector("table");
    const body = host.querySelector("tbody");
    const footer = host.querySelector("tfoot");
    const cell = host.querySelector("td");
    const caption = host.querySelector("caption");

    expect(container?.getAttribute("data-variant")).toBe("card");
    expect(container?.className).toContain("data-[variant=card]:rounded-2xl");
    expect(table?.getAttribute("data-variant")).toBe("card");
    expect(table?.className).toContain("data-[variant=card]:border-separate");
    expect(body?.className).toContain("in-data-[variant=card]:[&_tr>td]:bg-card");
    expect(body?.className).toContain(
      "in-data-[variant=card]:[&_tr[data-selected]>td]:bg-muted/48",
    );
    expect(footer?.className).toContain("in-data-[variant=card]:[&_td]:bg-transparent");
    expect(cell?.className).toContain("in-data-[variant=card]:px-4");
    expect(caption?.className).toContain("in-data-[variant=card]:pt-2");

    dispose();
  });

  test("allows Table variant prop to override container context", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <TableContainer variant="default">
          <Table variant="card">
            <TableBody />
          </Table>
        </TableContainer>
      ),
      host,
    );

    const container = host.querySelector("[data-slot='table-container']");
    const table = host.querySelector("table");

    expect(container?.getAttribute("data-variant")).toBe("default");
    expect(table?.getAttribute("data-variant")).toBe("card");

    dispose();
  });
});
