import { throwInvalidPathError } from '../../source/helpers/throwError.ts';

export interface GetStyledTextApi {
  textSource: string;
  textStyleCodes: Array<number>;
  textDecorations: Array<{
    decorationRange: [number, number];
  }>;
}

export function getStyledText(api: GetStyledTextApi) {
  const { textDecorations, textStyleCodes, textSource } = api;
  const sortedTextDecorations = textDecorations.sort((
    decorationA,
    decorationB,
  ) => decorationA.decorationRange[0] - decorationB.decorationRange[1]);
  const structuredTextStyleCodes = textStyleCodes.reduce(
    (codesResult, someStyleCode) => `${codesResult}\x1b[${someStyleCode}m`,
    '',
  );
  const styledTextChunks = textDecorations.length > 0
    ? sortedTextDecorations.reduce(
      (
        styledTextChunksResult,
        someTextDecoration,
        textDecorationIndex,
      ) => {
        styledTextChunksResult.push(
          `${structuredTextStyleCodes}${
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
          textSource.substring(
            someTextDecoration.decorationRange[1],
            nextDecorationRange[0],
          ),
        );
        return styledTextChunksResult;
      },
      [
        textSource.substring(
          0,
          sortedTextDecorations[0]?.decorationRange[0] ??
            throwInvalidPathError('styledTextChunks[0]'),
        ),
      ],
    )
    : [`${structuredTextStyleCodes}${
      textSource.substring(
        0,
        textSource.length,
      )
    }`];
  return `${styledTextChunks.join('\x1b[0m')}\x1b[0m`;
}
