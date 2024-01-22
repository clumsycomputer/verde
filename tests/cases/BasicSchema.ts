import { VerdeSchema, VerdeVerify } from '../imports/Verde.ts';

export type BasicSchema = VerdeSchema<
  VerdeVerify<[BasicItem]>
>;

interface BasicItem {
  basicString: string;
  basicNumber: number;
  basicNull: null;
}
