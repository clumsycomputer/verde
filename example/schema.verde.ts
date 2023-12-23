import Verde from "../source/library/index.ts";
import { MusicAlbum } from "./schemas/MusicAlbum.ts";
import { CoolMusicPerson, SillyMusicPerson } from "./schemas/MusicPerson.ts";
import { MusicTrack } from "./schemas/MusicTrack.ts";

export type ExampleSchema = Verde.Schema<
  [MusicAlbum, MusicTrack, CoolMusicPerson, SillyMusicPerson]
>;
