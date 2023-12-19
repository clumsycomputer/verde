import { Command, Input, Select } from "../deps/cliffy.ts";
import { Path } from "../deps/path.ts";
import { Zod } from "../deps/zod.ts";
import { throwInvalidPathError } from "../helpers/errors.ts";
import { queryGptData } from "../helpers/queryGptData.ts";

export const sketchRecordCommand = new Command()
  .name("sketch")
  .arguments("<outputDirectoryPath>")
  .action(async (___, outputDirectoryPath) => {
    await startRecordSketch({
      outputDirectoryPath,
    });
  });

interface StartRecordSketchApi {
  outputDirectoryPath: string;
}

async function startRecordSketch(api: StartRecordSketchApi) {
  const { outputDirectoryPath } = api;
  const selectDataTypeResult = await Select.prompt<
    "musicArtist" | "musicAlbum" | "musicTrack"
  >({
    message: "item type:",
    options: [
      {
        value: "musicArtist",
        name: "artist",
      },
      {
        value: "musicAlbum",
        name: "album",
        disabled: true,
      },
      {
        value: "musicTrack",
        name: "song",
        disabled: true,
      },
    ],
  });
  if (selectDataTypeResult === "musicArtist") {
    const inputArtistNameResult = await Input.prompt("artist name:");
    console.log("querying discography albums...");
    const discographyAlbumsGptData = await queryGptData({
      maxTokens: 1024,
      numberOfResults: 1,
      temperature: 0,
      topProbability: 1,
      systemPrompt: getMusicArchivalistSystemPrompt({
        dataItemTypeDefinitions: getMusicAlbumTypeDefinitions(),
      }),
      userQuery: getMusicAlbumUserQuery({
        inputArtistNameResult,
      }),
      dataItemSchema: getMusicArtistSchema(),
    });
    Deno.writeTextFile(
      Path.join(
        Deno.cwd(),
        outputDirectoryPath,
        `${inputArtistNameResult.trim().replace(" ", "-")}.json`
      ),
      JSON.stringify(
        {
          artistName: inputArtistNameResult,
          artistDiscography: {
            discographyAlbums: discographyAlbumsGptData[0]?.discographyAlbums,
          },
        },
        null,
        2
      )
    );
  } else {
    throwInvalidPathError("selectDataTypeResult");
  }
}

interface GetMusicArchivalistSystemPromptApi {
  dataItemTypeDefinitions: string;
}

function getMusicArchivalistSystemPrompt(
  api: GetMusicArchivalistSystemPromptApi
) {
  const { dataItemTypeDefinitions } = api;
  return `
the archivalist community considers you the foremost expert in the curation and cataloging of music.

your responses are categorized as accessible, accountable, accurate, calculated, complete, comprehensive, deterministic, direct, explicit, exhaustive, forthcoming, plenary, semantic, and total.

you respond exclusively with valid json.

use the type definitions below when responding and make sure to only include the raw json omitting the \`\`\`json\`\`\` markdown

\`\`\`typescript
${dataItemTypeDefinitions}
\`\`\`
`.trim();
}

function getMusicAlbumTypeDefinitions() {
  return `
interface GptDiscographyAlbums {
  // the complete list, with zero omissions, of every album in the artist's discography
  discographyAlbums: Array<GptMusicAlbum>
}

interface GptMusicAlbum {
  albumTitle: string;
}
`.trim();
}

interface GetMusicAlbumUserQueryApi {
  inputArtistNameResult: string;
}

function getMusicAlbumUserQuery(api: GetMusicAlbumUserQueryApi) {
  const { inputArtistNameResult } = api;
  return `every album in the discography of ${inputArtistNameResult}`;
}

function getMusicArtistSchema() {
  return Zod.object({
    discographyAlbums: Zod.array(
      Zod.object({
        albumTitle: Zod.string(),
      })
    ),
  });
}
