import Verde from "../source/library/index.ts";
import { MusicAlbum } from "./schemas/MusicAlbum.ts";
import { MusicPersonSchema } from "./schemas/MusicPerson.ts";
import { MusicTrack } from "./schemas/MusicTrack.ts";

export type ExampleSchema = Verde.Schema<
  Verde.Verify<[MusicAlbum, MusicTrack, ...MusicPersonSchema]>
>;
