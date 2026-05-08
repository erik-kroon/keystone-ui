import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
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

    expect(container?.getAttribute("data-scope")).toBe("ui-table");
    expect(container?.getAttribute("data-part")).toBe("container");
    expect(table?.getAttribute("data-slot")).toBe("table");
    expect(caption?.textContent).toBe("Quarterly revenue");
    expect(head?.getAttribute("scope")).toBe("col");
    expect(selectedRow?.getAttribute("data-state")).toBe("selected");
    expect(table?.className).toContain("caption-bottom");

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

    dispose();
  });
});
