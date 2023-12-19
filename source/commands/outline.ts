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
  const solutionBriefDescription = await Input.prompt(
    "A brief description of a solution:"
  );
  const solutionOutlineGptData = await queryGptData({
    maxTokens: 1024,
    numberOfResults: 1,
    temperature: 0,
    topProbability: 1,
    systemPrompt: getSolutionOutlineSystemPrompt(),
    userQuery: getSolutionOutlineUserQuery({
      solutionBriefDescription,
    }),
    dataItemSchema: getSolutionOutlineDataItemSchema(),
  });
  const solutionOutlineJson =
    solutionOutlineGptData[0] ?? throwInvalidPathError("solutionOutlineJson");
  console.log(solutionOutlineJson);
  await Deno.writeTextFile(
    Path.join(Deno.cwd(), outputFilePath, `verde.json`),
    JSON.stringify(solutionOutlineJson, null, 2)
  );
}

function getSolutionOutlineSystemPrompt() {
  return `the engineering community considers you the foremost expert in software architecture and system design.

  your responses are categorized as complete, comprehensive, exhaustive, accurate, accessible, accountable, calculated, deterministic, semantic, direct, explicit, and forthcoming.
  
  you respond exclusively with valid json.
  
  use the type definitions below when responding and make sure to only include the raw json omitting the \`\`\`json\`\`\` markdown
  
  \`\`\`typescript
  type PseudoCodeOutline = Array<PseudoCodeFunction>
  
  interface PseudoCodeFunction  {
     functionName: string;
     functionOverview: string;
     functionPurpose:  string;
  }
  \`\`\`
  `;
}

interface GetSolutionOutlineUserQueryApi {
  solutionBriefDescription: string;
}

function getSolutionOutlineUserQuery(api: GetSolutionOutlineUserQueryApi) {
  const { solutionBriefDescription } = api;
  return `an outline for an implementation described by: "${solutionBriefDescription}"`;
}

function getSolutionOutlineDataItemSchema() {
  return PseudoCodeOutlineSchema;
}

const PseudoCodeFunctionSchema = Zod.object({
  functionName: Zod.string(),
  functionOverview: Zod.string(),
  functionPurpose: Zod.string(),
  // functionSourcesOfComplexity: Array<string>;
  // functionEdgeCases: Array<string>;
  // functionAssumptions: Array<string>;
  // functionTechninalSuggestions: Array<string>;
});

const PseudoCodeOutlineSchema = Zod.array(PseudoCodeFunctionSchema);
