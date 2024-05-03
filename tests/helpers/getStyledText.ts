import { throwInvalidPathError } from '../../source/helpers/throwError.ts';

export const styledText = getStyledText

export interface GetStyledTextApi {
  textSource: string;
  textPatterns: Array<{
    patternRegex: RegExp;
    patternStyle: Array<number>;    
    getFilteredPattern?: (api: GetFilteredPatternApi) => Array<RegExpMatchArray>;
  }>;
}

interface GetFilteredPatternApi {
  patternMatches: Array<RegExpMatchArray>;
}

export function getStyledText(api: GetStyledTextApi) {
  const { textPatterns, textSource } = api;
  const sortedTextChunks = textPatterns.reduce<
    Array<{
      chunkStylePrefix: string;
      chunkRange: [number, number];
    }>
  >(
    (
      textChunksResult,
      {
        patternStyle,
        patternRegex,
        getFilteredPattern = ({ patternMatches }) => patternMatches,
      },
    ) => {
      const patternStylePrefix = patternStyle.reduce(
        (stylePrefixResult, someStyleCode) =>
          `${stylePrefixResult}\x1b[${someStyleCode}m`,
        '',
      );
      return [
        ...textChunksResult,
        ...getFilteredPattern({
          patternMatches: Array.from(
            textSource.matchAll(
              new RegExp(patternRegex.source, 'gd'),
            ),
          ),
        })
          .map((someDecorationMatch) => ({
            chunkStylePrefix: patternStylePrefix,
            chunkRange:
              someDecorationMatch.indices && someDecorationMatch.indices[0] ||
              throwInvalidPathError('threadDecorationRange'),
          })),
      ];
    },
    [],
  ).sort((decorationA, decorationB) =>
    decorationA.chunkRange[0] - decorationB.chunkRange[0]
  );
  const styledTextChunks = sortedTextChunks.reduce(
    (
      styledTextChunksResult,
      { chunkStylePrefix, chunkRange },
      decorationIndex,
    ) => {
      styledTextChunksResult.push(
        `${chunkStylePrefix}${
          textSource.substring(
            chunkRange[0],
            chunkRange[1],
          )
        }`,
      );
      const nextChunkRange: [number, number] =
        sortedTextChunks[decorationIndex + 1]
          ?.chunkRange ??
          [textSource.length, NaN];
          styledTextChunksResult.push(
        textSource.substring(
          chunkRange[1],
          nextChunkRange[0],
        ),
      );
      return styledTextChunksResult;
    },
    [
      textSource.substring(
        0,
        sortedTextChunks[0]?.chunkRange[0] ??
          throwInvalidPathError('sortedTextDecorations[0]'),
      ),
    ],
  );
  return `${styledTextChunks.join('\x1b[0m')}\x1b[0m`;
}
