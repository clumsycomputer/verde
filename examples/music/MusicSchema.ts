export type MusicSchema = [Music]

type Music = MusicProject | MusicMix | MusicTrack

type MusicProject = MusicSoundtrack | MusicCompilation | MusicAlbum | MusicEp | MusicSingle

interface MusicSoundtrack extends MusicProject__<'soundtrack'> {}

interface MusicCompilation extends MusicProject__<'compilation'> {}

interface MusicAlbum extends MusicProject__<'album'> {}

interface MusicEp extends MusicProject__<'ep'> {}

interface MusicSingle extends MusicProject__<'single'> {}

interface MusicProject__<ProjectKind> extends Music__<'project'> {
  musicProjectKind: ProjectKind;
}

interface MusicMix extends Music__<'mix'> {}

interface MusicTrack extends Music__<'track'> {
  trackMainProject: MusicProject
  trackSecondaryProjects: VerdeSet<MusicProject>
  // trackProjects: VerdeSet<MusicCollection>
}

interface Music__<MusicKind> {
  musicKind: MusicKind;
  musicTitle: string;
  musicArtist: VerdeSet<MusicArtist>;
  musicDate: CalendarDate;
}

type MusicArtist = SoloMusicArtist | GroupMusicArtist;

interface SoloMusicArtist extends __MusicArtist<'solo'> {
  artistPerson: MusicPerson;
}

interface GroupMusicArtist extends __MusicArtist<'group'> {
  groupMembers: VerdeSet<MusicPerson>;
}

interface __MusicArtist<ArtistKind> {
  artistKind: ArtistKind;
  artistName: string;
}

interface MusicPerson {
  personName: PersonName;
  personBirthdate: CalendarDate;
  personBirthplace: HierarchicalLocation;
}

type PersonName = [firstName: string, lastName: string];

type CalendarDate = DayDate | MonthDate | YearDate;

type DayDate = [...MonthDate, day: number];

type MonthDate = [...YearDate, month: number];

type YearDate = [year: number];

type HierarchicalLocation = Array<string>
