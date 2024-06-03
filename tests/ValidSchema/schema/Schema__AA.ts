import { VerdeArray, VerdeTable } from '../../../source/library/module.ts';
import { Model__BB, Model__CC } from './Model__BB.ts';

export type Schema__AA = Model__AA | Alias__AA | Model__BB | Model__FF;

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

interface Model__FF extends Model__CC, Model__GG<Model__AA> {
  ffProperty__AA: Model__BB;
}

interface Model__GG<GgParameter__AA> {
  ggProperty__AA: VerdeTable<GgParameter__AA>;
  ggProperty__BB: VerdeTable<Model__AA>;
  ggProperty__CC: VerdeTable<Model__AA | Alias__AA | GgParameter__AA>;
  ggProperty__DD: VerdeArray<boolean>;
  ggProperty__EE: VerdeArray<number>;
  ggProperty__FF: VerdeArray<Model__AA>;
  ggProperty__GG: VerdeArray<Alias__AA>;
  ggProperty__HH: VerdeArray<GgParameter__AA>;
  ggProperty__II: VerdeArray<
    boolean | number | string | Model__AA | Alias__AA | GgParameter__AA
  >;
}