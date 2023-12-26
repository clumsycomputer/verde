import Verde from "../../source/library/index.ts";

export interface MusicTrack extends MusicTrackBase<string> {}

interface MusicTrackBase<SomeThang> {
  trackTitle: "what";
  trackArtist: SomeThang;
}

interface Thang {
  foo: string;
}
