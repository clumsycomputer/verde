import { Command } from "../deps/cliffy.ts";
import { setupProjectCommand } from "./setupProject.ts";

export const verdeCommand = new Command()
  .name("verde")
  .description(
    "a tool for managing small-ish datasets (curations, catalogs, .etc)"
  )
  .command(setupProjectCommand.getName(), setupProjectCommand);
