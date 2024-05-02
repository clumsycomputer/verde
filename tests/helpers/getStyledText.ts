import { throwInvalidPathError } from '../../source/helpers/throwError.ts';

export interface GetStyledTextApi {
  textSource: string;
  textDecorationThreads: Array<{
    threadCodes: Array<number>;
    threadRegex: RegExp;
    getFilteredThread?: (api: GetFilteredThreadApi) => Array<RegExpMatchArray>;
  }>;
}

interface GetFilteredThreadApi {
  threadMatches: Array<RegExpMatchArray>;
}

export function getStyledText(api: GetStyledTextApi) {
  const { textDecorationThreads, textSource } = api;
  const sortedTextDecorations = textDecorationThreads.reduce<
    Array<{
      decorationCodePrefix: string;
      decorationRange: [number, number];
    }>
  >(
    (
      textDecorationsResult,
      {
        threadCodes,
        threadRegex,
        getFilteredThread = ({ threadMatches }) => threadMatches,
      },
    ) => {
      const currentDecorationCodePrefix = threadCodes.reduce(
        (codePrefixResult, someDecorationCode) =>
          `${codePrefixResult}\x1b[${someDecorationCode}m`,
        '',
      );
      return [
        ...textDecorationsResult,
        ...getFilteredThread({
          threadMatches: Array.from(
            textSource.matchAll(
              new RegExp(threadRegex.source, 'gd'),
            ),
          ),
        })
          .map((someDecorationMatch) => ({
            decorationCodePrefix: currentDecorationCodePrefix,
            decorationRange:
              someDecorationMatch.indices && someDecorationMatch.indices[0] ||
              throwInvalidPathError('threadDecorationRange'),
          })),
      ];
    },
    [],
  ).sort((decorationA, decorationB) =>
    decorationA.decorationRange[0] - decorationB.decorationRange[0]
  );
  const decoratedTextChunks = sortedTextDecorations.reduce(
    (
      decoratedTextChunksResult,
      { decorationCodePrefix, decorationRange },
      decorationIndex,
    ) => {
      decoratedTextChunksResult.push(
        `${decorationCodePrefix}${
          textSource.substring(
            decorationRange[0],
            decorationRange[1],
          )
        }`,
      );
      const nextDecorationRange: [number, number] =
        sortedTextDecorations[decorationIndex + 1]
          ?.decorationRange ??
          [textSource.length, NaN];
      decoratedTextChunksResult.push(
        textSource.substring(
          decorationRange[1],
          nextDecorationRange[0],
        ),
      );
      return decoratedTextChunksResult;
    },
    [
      textSource.substring(
        0,
        sortedTextDecorations[0]?.decorationRange[0] ??
          throwInvalidPathError('sortedTextDecorations[0]'),
      ),
    ],
  );
  return `${decoratedTextChunks.join('\x1b[0m')}\x1b[0m`;
}
