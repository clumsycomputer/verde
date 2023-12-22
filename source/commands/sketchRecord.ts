import { Command, Input, Select } from "../deps/cliffy.ts";
import { Path } from "../deps/path.ts";
import { Zod } from "../deps/zod.ts";
import { throwInvalidPathError } from "../helpers/errors.ts";
import { queryGptData } from "../helpers/queryGptData.ts";
//
import * as Sqlite from "https://deno.land/x/sqlite/mod.ts";

const exampleDatabase = new Sqlite.DB(
  Path.join(Deno.cwd(), "./example/example.db")
);
exampleDatabase.execute(`
CREATE TABLE IF NOT EXISTS music_artists (
  artist_id INTEGER PRIMARY KEY AUTOINCREMENT,
  artist_name TEXT NOT NULL,
  artist_albums TEXT NOT NULL
);`);
exampleDatabase.execute(`
CREATE TABLE IF NOT EXISTS music_albums (
  album_id INTEGER PRIMARY KEY AUTOINCREMENT,
  album_title TEXT NOT NULL
);`);

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
    console.log("querying artist discography...");
    const artistDiscographyGptData = await queryGptData({
      maxTokens: 1024,
      numberOfResults: 1,
      temperature: 0,
      topProbability: 1,
      systemPrompt: getMusicArchivistSystemPrompt({
        dataItemTypeDefinitions: getGptArtistDiscographyTypeDefinitions(),
      }),
      userQuery: getGptArtistDiscograpyUserQuery({
        inputArtistNameResult,
      }),
      dataItemSchema: getGptArtistDiscographySchema(),
    });
    const newMusicAlbumSqliteValues = Object.values(
      artistDiscographyGptData[0]!
    )
      .flat()
      .map(
        (someGptAlbum) => `('${someGptAlbum.albumTitle.replaceAll("'", "''")}')`
      );
    // console.log(newMusicAlbumSqliteValues);
    exampleDatabase.execute(
      `INSERT INTO music_albums (album_title) VALUES ${newMusicAlbumSqliteValues.join(
        ","
      )};`
    );
    const startingAlbumId =
      ((exampleDatabase.query(
        `SELECT seq FROM sqlite_sequence WHERE name = 'music_albums';`
      ) ?? [[newMusicAlbumSqliteValues.length]])[0]![0] as number) -
      newMusicAlbumSqliteValues.length +
      1;
    const newAlbumIds = new Array(newMusicAlbumSqliteValues.length)
      .fill(undefined)
      .map((__, someIndex) => startingAlbumId + someIndex);
    exampleDatabase.execute(
      `INSERT INTO music_artists (artist_name, artist_albums) VALUES ('${inputArtistNameResult}', '${newAlbumIds.join(
        ","
      )}');`
    );
    console.log(
      exampleDatabase
        .queryEntries(`SELECT * FROM music_artists;`)
        .map((someArtistRow) => ({
          artistName: someArtistRow.artist_name,
          artistAlbums: exampleDatabase
            .queryEntries(
              `SELECT * FROM music_albums WHERE album_id in (${someArtistRow.artist_albums});`
            )
            .map((someAlbumRow) => someAlbumRow.album_title),
        }))
    );
  } else {
    throwInvalidPathError("selectDataTypeResult");
  }
}

interface GetMusicArchivistSystemPromptApi {
  dataItemTypeDefinitions: string;
}

function getMusicArchivistSystemPrompt(api: GetMusicArchivistSystemPromptApi) {
  const { dataItemTypeDefinitions } = api;
  return `
the archivist community considers you the foremost expert in the history of music.

your responses are categorized as accessible, accountable, accurate, calculated, complete, comprehensive, deterministic, direct, explicit, exhaustive, forthcoming, plenary, semantic, and total.

you respond exclusively with valid json.

use the type definitions below when responding and make sure to only include the raw json omitting the \`\`\`json\`\`\` markdown

\`\`\`typescript
${dataItemTypeDefinitions}
\`\`\`
`.trim();
}

function getGptArtistDiscographyTypeDefinitions() {
  return `
interface GptArtistDiscography {
  // the complete list, with zero omissions, of every studio album in the artist's discography
  studioAlbums: Array<GptMusicAlbum>;
  // the complete list, with zero omissions, of every collaborative album in the artist's discography
  collaborativeAlbums: Array<GptMusicAlbum>;
  // the complete list, with zero omissions, of every compilation album in the artist's discography
  compilationAlbums: Array<GptMusicAlbum>;
  // the complete list, with zero omissions, of every mixtape album in the artist's discography
  mixtapeAlbums: Array<GptMusicAlbum>;
  // the complete list, with zero omissions, of every live album in the artist's discography
  liveAlbums: Array<GptMusicAlbum>;
  // the complete list, with zero omissions, of every soundtrack album in the artist's discography
  soundtrackAlbums: Array<GptMusicAlbum>;
}

interface GptMusicAlbum {
  albumTitle: string;
}
`.trim();
}

interface GetGptArtistDiscograpyUserQueryApi {
  inputArtistNameResult: string;
}

function getGptArtistDiscograpyUserQuery(
  api: GetGptArtistDiscograpyUserQueryApi
) {
  const { inputArtistNameResult } = api;
  return `discography: ${inputArtistNameResult}`;
}

function getGptArtistDiscographySchema() {
  return Zod.object({
    studioAlbums: Zod.array(
      Zod.object({
        albumTitle: Zod.string(),
      })
    ),
    collaborativeAlbums: Zod.array(
      Zod.object({
        albumTitle: Zod.string(),
      })
    ),
    compilationAlbums: Zod.array(
      Zod.object({
        albumTitle: Zod.string(),
      })
    ),
    mixtapeAlbums: Zod.array(
      Zod.object({
        albumTitle: Zod.string(),
      })
    ),
    liveAlbums: Zod.array(
      Zod.object({
        albumTitle: Zod.string(),
      })
    ),
    soundtrackAlbums: Zod.array(
      Zod.object({
        albumTitle: Zod.string(),
      })
    ),
  });
}
