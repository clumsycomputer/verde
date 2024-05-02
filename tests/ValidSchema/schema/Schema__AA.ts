import { VerdeArray, VerdeTable } from '../../../source/library/module.ts';
import { Model__BB } from './Model__BB.ts';

export type Schema__AA = [Model__AA, Alias__AA, Model__BB];

interface Model__AA {
  aaProperty__AA: true;
  aaProperty__BB: 123;
  aaProperty__CC: 'hello';
  aaProperty__DD: boolean;
  aaProperty__EE: number;
  aaProperty__FF: string;
  aaProperty__GG: Model__AA;
  aaProperty__HH: Alias__AA;
  aaProperty__II: VerdeTable<Alias__AA>;
  aaProperty__JJ: VerdeArray<string>;
  aaProperty__KK: string | null;
  aaProperty__LL: [__llProperty__AA: number];
  aaProperty__MM: {
    __mmProperty__AA: string;
  };
}

type Alias__AA = Model__AA;
