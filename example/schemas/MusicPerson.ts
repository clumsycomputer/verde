import Verde from "verde";

export type MusicPersonSchema = [CoolMusicPerson, SillyMusicPerson];

interface CoolMusicPerson extends MusicPersonBase<"cool"> {
  personGroup: Verde.String;
}

interface SillyMusicPerson extends MusicPersonBase<"silly">, Thing {}

interface MusicPersonBase<PersonType> {
  personType: PersonType;
  personName: Verde.String;
}

interface Thing extends DeepFoo {
  thingThang: Verde.Float;
}

interface DeepFoo {
  whoa: string;
}
