
export interface TestCase {
  caseKey: string;
  caseLabel: string;
  caseTechnicalLabel: string;
  caseAssertions: Array<CaseAssertion>;
}

export type CaseAssertion = DirectCaseAssertion | ProxyCaseAssertion;

interface DirectCaseAssertion extends __CaseAssertion<'direct'> {
  assertionHighlights: Array<AssertionHighlight>;
}

interface AssertionHighlight {
  highlightSource: string;
  highlightScopes: Array<HighlightScope>
}

interface HighlightScope {
  scopeRange: [number, number];
  scopeHighlights: Array<ScopeHighlight>
}

interface ScopeHighlight {
  highlightRange: [number, number];
}

interface ProxyCaseAssertion extends __CaseAssertion<'proxy'> {}

interface __CaseAssertion<ThisAssertionKind> {
  assertionKind: ThisAssertionKind;
  assertionPath: Array<string | number>;
}