import Verde from "../source/library/index.ts";
export type ExampleSchema = Verde.Schema<Verde.Verify<[CoolestPerson]>>;

type CoolString = string;

type CoolestPersonName<T> = T;

interface CoolestPerson
  extends CoolPerson<"coolName", CoolestPersonName<CoolString>> {
  coolestName: string;
}

interface CoolPerson<ThisCoolNameAaa, ThisPersonNameBbb>
  extends Person<ThisPersonNameBbb> {
  coolName: ThisCoolNameAaa;
}

interface Person<ThisPersonNameAaa> {
  personName: ThisPersonNameAaa;
}
