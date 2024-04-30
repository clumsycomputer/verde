
export interface TestCase {
  caseKey: string;
  caseNotes: Array<string>
}

export interface CaseAssertion {
  assertionPath: Array<string | number>;
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
