import { Command } from "../deps/cliffy.ts";
import { processSchemaCommand } from "./processSchema.ts";

export const verdeCommand = new Command()
  .name("verde")
  .description(
    "a database for communities and individuals"
  )
  .command(processSchemaCommand.getName(), processSchemaCommand);
