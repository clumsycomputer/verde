import { Assert } from '../imports/Assert.ts';

export interface AssertAndLogExpectationsApi<ThisData> {
  expectationCases: Array<ExpectationCase>;
  expectedData: ThisData;
  actualData: ThisData;
}

export function assertAndLogExpectations<ThisData>(
  api: AssertAndLogExpectationsApi<ThisData>,
) {
  const { expectedData, actualData, expectationCases } = api;
  Assert.assertEquals(expectedData, actualData);
  // expectationCases.forEach((someExpectationCase) => {
  //   console.log();
  //   someExpectationCase.caseNotes.forEach(
  //     (someCaseNote) => {
  //       console.log(someCaseNote);
  //       console.log();
  //     },
  //   );
  // });
}

export interface ExpectationCase {
  caseKey: string;
  caseNotes: Array<string>
}

