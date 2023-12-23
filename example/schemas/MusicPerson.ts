import Verde from "verde";

export interface CoolMusicPerson extends MusicPersonBase<"cool"> {
  personGroup: Verde.String;
}

export interface SillyMusicPerson extends MusicPersonBase<"silly">, Thing {}

interface MusicPersonBase<PersonType> {
  personType: PersonType;
  personName: Verde.String;
}

interface Thing {
  thingThang: Verde.Float;
}
