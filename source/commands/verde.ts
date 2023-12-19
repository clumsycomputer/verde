import { Command } from "../deps/cliffy.ts";
import { outlineCommand } from "./outline.ts";

export const verdeCommand = new Command()
  .name("verde")
  .description("a prototyping assistant")
  .command(outlineCommand.getName(), outlineCommand);
