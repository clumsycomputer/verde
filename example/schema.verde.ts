// import Verde, { VerdeSchema as Foo } from "verde";
import Verde, { VerdeSchema as Foo } from "../source/library/index.ts";

export type ExampleSchema = Foo<[music_album: MusicAlbum, MusicTrack]>;

interface MusicAlbum {
  albumTitle: string;
  albumArtist: string;
}

interface MusicTrack {
  trackTitle: string;
  trackArtist: string;
}

interface __VERDE_SCHEMA<T> {}
