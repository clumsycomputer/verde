import { Typescript } from '../../../imports/Typescript.ts';

export type ElementTypescriptType<ThisTypeResolved> =
  | TypeReferenceElementTypescriptType<ThisTypeResolved>
  | GeneralElementTypescriptType<ThisTypeResolved>;

export interface TypeReferenceElementTypescriptType<
  ThisTypeResolved,
> extends __ElementTypescriptType<'typeReference', ThisTypeResolved> {
  typeSourceSymbol: Typescript.Symbol;
}

export interface GeneralElementTypescriptType<
  ThisTypeResolved,
> extends __ElementTypescriptType<'general', ThisTypeResolved> {}

interface __ElementTypescriptType<ThisTypeKind, ThisTypeResolved> {
  typeKind: ThisTypeKind;
  typeResolved: ThisTypeResolved;
}
