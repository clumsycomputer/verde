import { throwInvalidPathError } from '../../source/helpers/throwError.ts';

export interface GetStyledTextApi {
  textSource: string;
  textCodes: Array<number>;
  textDecorations: Array<{
    decorationRange: [number, number];
    decorationCodes: Array<number>;
  }>;
}

export function getStyledText(api: GetStyledTextApi) {
  const { textDecorations, textCodes, textSource } = api;
  const sortedTextDecorations = textDecorations.sort((
    decorationA,
    decorationB,
  ) => decorationA.decorationRange[0] - decorationB.decorationRange[1]);
  const structuredTextCodes = textCodes.reduce(
    (codesResult, someTextCode) => `${codesResult}\x1b[${someTextCode}m`,
    '',
  );
  const styledTextChunks = sortedTextDecorations.reduce(
    (
      styledTextChunksResult,
      someTextDecoration,
      textDecorationIndex,
    ) => {
      const structuredDecorationCodes = someTextDecoration.decorationCodes
        .reduce(
          (codesResult, someDecorationCode) =>
            `${codesResult}\x1b[${someDecorationCode}m`,
          '',
        );
      styledTextChunksResult.push(
        `${structuredTextCodes}${structuredDecorationCodes}${
          textSource.substring(
            someTextDecoration.decorationRange[0],
            someTextDecoration.decorationRange[1],
          )
        }`,
      );
      const nextDecorationRange: [number, number] =
        sortedTextDecorations[textDecorationIndex + 1]
          ?.decorationRange ??
          [textSource.length, NaN];
      styledTextChunksResult.push(
        `${structuredTextCodes}${
          textSource.substring(
            someTextDecoration.decorationRange[1],
            nextDecorationRange[0],
          )
        }`,
      );
      return styledTextChunksResult;
    },
    [
      `${structuredTextCodes}${
        textSource.substring(
          0,
          sortedTextDecorations[0]?.decorationRange[0] ??
            textSource.length,
        )
      }`,
    ],
  );
  return `${styledTextChunks.join('\x1b[0m')}\x1b[0m`;
}
