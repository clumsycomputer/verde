import { Typescript } from '../../../imports/Typescript.ts';

export type ElementNode<ThisResolvedType> =
  | AliasReferenceElementNode<ThisResolvedType>
  | GeneralElementNode<ThisResolvedType>;

export interface AliasReferenceElementNode<ThisResolvedType>
  extends __ElementNode<'aliasReference', ThisResolvedType> {
    nodeAliasSymbol: Typescript.Symbol;
  }

export interface GeneralElementNode<ThisResolvedType>
  extends __ElementNode<'general', ThisResolvedType> {}

interface __ElementNode<ThisNodeKind, ThisResolvedTyped> {
  nodeKind: ThisNodeKind;
  nodeResolvedType: ThisResolvedTyped;
}
