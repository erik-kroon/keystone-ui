#!/usr/bin/env bun
import { addCommand } from "./commands/add";
import { initCommand } from "./commands/init";
import { diffCommand, doctorCommand, removeCommand, updateCommand } from "./commands/lifecycle";

type ParsedArgs = {
  command: string | null;
  item: string | null;
  cwd: string;
  registry: string | null;
  yes: boolean;
  force: boolean;
  dryRun: boolean;
};

function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {
    command: argv[0] ?? null,
    item: null,
    cwd: process.cwd(),
    registry: null,
    yes: false,
    force: false,
    dryRun: false,
  };
  for (let index = 1; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--cwd") args.cwd = argv[++index] ?? args.cwd;
    else if (value === "--registry") args.registry = argv[++index] ?? null;
    else if (value === "--yes" || value === "-y") args.yes = true;
    else if (value === "--force") args.force = true;
    else if (value === "--dry-run") args.dryRun = true;
    else if (!args.item) args.item = value ?? null;
  }
  return args;
}

export async function run(argv: string[] = process.argv.slice(2)): Promise<string> {
  const args = parseArgs(argv);
  if (args.command === "init") {
    return initCommand({ cwd: args.cwd, yes: args.yes, force: args.force });
  }
  if (args.command === "add") {
    if (!args.item) throw new Error("Usage: mason add <item> --registry <path>");
    if (!args.registry)
      throw new Error("mason add requires --registry <path> for the first tracer.");
    return addCommand({
      cwd: args.cwd,
      item: args.item,
      registry: args.registry,
      dryRun: args.dryRun,
    });
  }
  if (args.command === "diff") {
    if (!args.item) throw new Error("Usage: mason diff <item> --registry <path>");
    if (!args.registry) throw new Error("mason diff requires --registry <path>.");
    return diffCommand({ cwd: args.cwd, item: args.item, registry: args.registry });
  }
  if (args.command === "update") {
    if (!args.item) throw new Error("Usage: mason update <item> --registry <path>");
    if (!args.registry) throw new Error("mason update requires --registry <path>.");
    return updateCommand({
      cwd: args.cwd,
      item: args.item,
      registry: args.registry,
      dryRun: args.dryRun,
      force: args.force,
    });
  }
  if (args.command === "remove") {
    if (!args.item) throw new Error("Usage: mason remove <item>");
    return removeCommand({
      cwd: args.cwd,
      item: args.item,
      dryRun: args.dryRun,
      force: args.force,
    });
  }
  if (args.command === "doctor") {
    return doctorCommand({ cwd: args.cwd, registry: args.registry });
  }
  throw new Error("Usage: mason init|add|diff|update|remove|doctor");
}

if (import.meta.main) {
  run()
    .then((message) => {
      console.log(message);
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    });
}
