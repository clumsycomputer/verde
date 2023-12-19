import { Command } from "../deps/cliffy.ts";
import { sketchRecordCommand } from "./sketchRecord.ts";

export const verdeCommand = new Command()
  .name("verde")
  .description("a data assistant")
  .command(sketchRecordCommand.getName(), sketchRecordCommand);
