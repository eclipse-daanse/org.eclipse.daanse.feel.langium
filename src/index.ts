/**
 * FEEL-Langium: Langium-based FEEL parser with LSP support for DMN
 *
 * @packageDocumentation
 */

// Parser + Services
export { createFeelServices, createFeelLspServices } from './language/feel-module.js';
export type { FeelServices, FeelSharedServices, FeelAddedServices } from './language/feel-module.js';

// LSP Services
export { FeelValidator } from './language/feel-validator.js';
export { FeelScopeProvider } from './language/feel-scope.js';
export { FeelHoverProvider } from './language/feel-hover.js';
export { FeelCompletionProvider } from './language/feel-completion.js';

// Evaluator (re-export from feelin)
export { feelEvaluate, feelUnaryTest } from './evaluator/index.js';

// Generated AST types
export type {
  FeelDocument,
  Expression,
  BinaryExpression,
  UnaryExpression,
  NotExpression,
  DotExpression,
  FunctionCall,
  FilterExpression,
  IfExpression,
  ForExpression,
  FeelIterator,
  QuantifiedExpression,
  BetweenExpression,
  InExpression,
  InstanceOf,
  FunctionDefinition,
  PositiveUnaryTest,
  RangeTest,
  ComparisonTest,
  WildcardTest,
  Range,
  NumberLiteral,
  StringLiteral,
  BooleanLiteral,
  NullLiteral,
  DateTimeLiteral,
  NameReference,
  ListLiteral,
  ContextLiteral,
  ContextEntry,
  ContextKey,
} from './generated/ast.js';

// Generated type guards
export {
  isBinaryExpression,
  isUnaryExpression,
  isNotExpression,
  isDotExpression,
  isFunctionCall,
  isFilterExpression,
  isIfExpression,
  isForExpression,
  isQuantifiedExpression,
  isNameReference,
  isNumberLiteral,
  isStringLiteral,
  isBooleanLiteral,
  isNullLiteral,
  isDateTimeLiteral,
  isListLiteral,
  isContextLiteral,
} from './generated/ast.js';
