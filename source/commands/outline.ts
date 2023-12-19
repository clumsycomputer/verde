import { Command, Input } from "../deps/cliffy.ts";
import { Path } from "../deps/path.ts";
import { Zod } from "../deps/zod.ts";
import { throwInvalidPathError } from "../helpers/errors.ts";
import { queryGptData } from "../helpers/queryGptData.ts";

export const outlineCommand = new Command()
  .name("outline")
  .arguments("<outputFilePath>")
  .action(async (___, outputFilePath) => {
    await makeVerdeOutline({
      outputFilePath,
    });
  });

interface MakeVerdeOutlineApi {
  outputFilePath: string;
}

async function makeVerdeOutline(api: MakeVerdeOutlineApi) {
  const { outputFilePath } = api;
  const implementationDescription = await Input.prompt(
    "What do you want to implement?"
  );
  const implementationOutlineGptData = await queryGptData({
    maxTokens: 1024,
    numberOfResults: 1,
    temperature: 1,
    topProbability: 1,
    systemPrompt: getImplementationOutlineSystemPrompt(),
    userQuery: getImplementationOutlineUserQuery({
      implementationDescription,
    }),
    dataItemSchema: getImplementationOutlineDataItemSchema(),
  });
  const implementationOutlineJson =
    implementationOutlineGptData[0] ??
    throwInvalidPathError("implementationOutlineJson");
  console.log(implementationOutlineJson);
  await Deno.writeTextFile(
    Path.join(Deno.cwd(), outputFilePath, `verde.json`),
    JSON.stringify(implementationOutlineJson, null, 2)
  );
}

function getImplementationOutlineSystemPrompt() {
  return `the engineering community considers you the foremost expert in software architecture and system design.

  your responses are categorized as complete, comprehensive, exhaustive, accurate, accessible, accountable, calculated, deterministic, semantic, direct, explicit, and forthcoming.
  
  you respond exclusively with valid json.
  
  use the type definitions below when responding and make sure to only include the raw json omitting the \`\`\`json\`\`\` markdown
  
  \`\`\`typescript
  interface ImplementationOutlineSequence = Array<ImplementationFunction>;

  interface ImplementationFunction {
    functionName: string;
  }
  \`\`\`
  `;
}

interface GetImplementationOutlineUserQueryApi {
  implementationDescription: string;
}

function getImplementationOutlineUserQuery(
  api: GetImplementationOutlineUserQueryApi
) {
  const { implementationDescription } = api;
  return `an implementation outline described by: "${implementationDescription}"`;
}

function getImplementationOutlineDataItemSchema() {
  return Zod.array(getImplementationFunctionSchema());
}

function getImplementationFunctionSchema() {
  return Zod.object({
    functionName: Zod.string(),
    // functionOverview: Zod.string(),
    // functionPurpose: Zod.string(),
    // functionSourcesOfComplexity: Array<string>;
    // functionEdgeCases: Array<string>;
    // functionAssumptions: Array<string>;
    // functionTechninalSuggestions: Array<string>;
  });
}
