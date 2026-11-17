/**
 * The node and context shapes the repo's oxlint rules share. Each rule types
 * a node by the few fields it reads, so no types come from oxlint, whose JS
 * plugin API is still in alpha.
 */

/** Any node: oxlint hands every handler its whole node union. */
export interface AstNode {
  type: string
}

/** What a rule reports through. */
export interface RuleContext {
  report: (descriptor: {
    node: { range: [number, number] }
    message: string
  }) => void
}
