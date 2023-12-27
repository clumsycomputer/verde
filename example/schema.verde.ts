import Verde from "../source/library/index.ts";
export type ExampleSchema = Verde.Schema<Verde.Verify<[CoolestPerson]>>;

type CoolString = "dang";

type CoolestPersonName<T> = T;

interface CoolestPerson
  extends CoolPerson<"coolName", CoolestPersonName<CoolString>>,
    Thang<number>,
    Bbb {
  coolestName: string;
}

type Thang<T> = Aaa<T> & Bbb;

type Ding = Thang<number>;

type Fiz = Ding[];

interface Aaa<T> {
  thing: T;
  thang: number;
}

class Bbb {
  constructor() {
    this.thang = 3;
  }
  thang: number;
}

interface CoolPerson<ThisCoolNameAaa, ThisPersonNameBbb>
  extends Person<ThisPersonNameBbb> {
  coolName: ThisCoolNameAaa;
}

interface Person<ThisPersonNameAaa> {
  personName: ThisPersonNameAaa;
}
