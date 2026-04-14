import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { FeelServices } from './feel-module.js';
import type { FeelLangiumAstType, FeelDocument, BinaryExpression } from '../generated/ast.js';

export function registerFeelValidationChecks(services: FeelServices): void {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.FeelValidator;
  const checks: ValidationChecks<FeelLangiumAstType> = {
    FeelDocument: validator.checkDocument,
    BinaryExpression: validator.checkBinaryExpression,
  };
  registry.register(checks, validator);
}

export class FeelValidator {
  constructor(_services: FeelServices) {
    // services available for future use
  }

  checkDocument(document: FeelDocument, accept: ValidationAcceptor): void {
    if (document.expressions.length === 0) {
      accept('hint', 'FEEL document is empty.', { node: document });
    }
  }

  checkBinaryExpression(expr: BinaryExpression, accept: ValidationAcceptor): void {
    if (!expr.right) {
      accept('error', `Missing right-hand side of '${expr.op}' expression.`, { node: expr });
    }
  }
}
