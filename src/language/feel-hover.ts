import type { AstNode, MaybePromise } from 'langium';
import { AstNodeHoverProvider, type LangiumServices } from 'langium/lsp';
import type { Hover } from 'vscode-languageserver';
import type { FeelServices } from './feel-module.js';
import {
  isBinaryExpression,
  isIfExpression,
  isForExpression,
  isQuantifiedExpression,
  isFunctionCall,
  isNameReference,
  isNumberLiteral,
  isStringLiteral,
  isBooleanLiteral,
  isNullLiteral,
  isListLiteral,
  isContextLiteral,
  isUnaryExpression,
  isNotExpression,
  isDotExpression,
} from '../generated/ast.js';

const BUILTIN_DOCS: Record<string, string> = {
  abs: '`abs(n)` - Returns the absolute value of n',
  ceiling: '`ceiling(n)` - Rounds n up to the next integer',
  floor: '`floor(n)` - Rounds n down to the previous integer',
  sum: '`sum(list)` - Returns the sum of all numbers in the list',
  count: '`count(list)` - Returns the number of elements in the list',
  mean: '`mean(list)` - Returns the arithmetic mean of the list',
  min: '`min(list)` / `min(a, b, ...)` - Returns the minimum value',
  max: '`max(list)` / `max(a, b, ...)` - Returns the maximum value',
  date: '`date(string)` / `date(year, month, day)` - Creates a date value',
  time: '`time(string)` / `time(hour, minute, second)` - Creates a time value',
  duration: '`duration(string)` - Creates a duration value (e.g. "P1D", "PT2H")',
  number: '`number(string)` - Converts a string to a number',
  string: '`string(value)` - Converts a value to its string representation',
  contains: '`contains(string, match)` - True if string contains match',
  not: '`not(boolean)` - Negates a boolean value',
  sort: '`sort(list, precedes)` - Sorts list using a comparison function',
  flatten: '`flatten(list)` - Flattens nested lists into a single list',
  reverse: '`reverse(list)` - Reverses the order of elements',
  append: '`append(list, item...)` - Appends items to the end of list',
  concatenate: '`concatenate(list...)` - Concatenates multiple lists',
  now: '`now()` - Returns the current date and time',
  today: '`today()` - Returns the current date',
};

export class FeelHoverProvider extends AstNodeHoverProvider {
  private contextVariables: Array<{ name: string; type: string }>;

  constructor(services: FeelServices) {
    super(services as unknown as LangiumServices);
    this.contextVariables = services.context.variables;
  }

  protected override getAstNodeHoverContent(node: AstNode): MaybePromise<Hover | undefined> {
    const content = this.getHoverText(node);
    if (content) {
      return {
        contents: {
          kind: 'markdown',
          value: content,
        },
      };
    }
    return undefined;
  }

  private getHoverText(node: AstNode): string | undefined {
    if (isNameReference(node)) {
      const name = node.name;
      // Check builtins
      if (BUILTIN_DOCS[name]) {
        return `**FEEL Built-in**\n\n${BUILTIN_DOCS[name]}`;
      }
      // Check context variables
      const variable = this.contextVariables.find(v => v.name === name);
      if (variable) {
        return `**Input Variable**\n\n\`${variable.name}\` : \`${variable.type}\``;
      }
      return `**Name**: \`${name}\``;
    }
    if (isBinaryExpression(node)) {
      return `**${this.opDescription(node.op)}** expression`;
    }
    if (isIfExpression(node)) {
      return '**if-then-else** conditional expression';
    }
    if (isForExpression(node)) {
      return '**for-in-return** iteration expression';
    }
    if (isQuantifiedExpression(node)) {
      return `**${node.quantifier}** quantified expression`;
    }
    if (isFunctionCall(node)) {
      return '**Function call**';
    }
    if (isNumberLiteral(node)) {
      return `**Number**: \`${node.value}\``;
    }
    if (isStringLiteral(node)) {
      return `**String**: \`${node.value}\``;
    }
    if (isBooleanLiteral(node)) {
      return `**Boolean**: \`${node.value}\``;
    }
    if (isNullLiteral(node)) {
      return '**null** literal';
    }
    if (isListLiteral(node)) {
      return `**List** with ${node.elements.length} element(s)`;
    }
    if (isContextLiteral(node)) {
      return `**Context** with ${node.entries.length} entry/entries`;
    }
    if (isUnaryExpression(node)) {
      return '**Unary negation** expression';
    }
    if (isNotExpression(node)) {
      return '**not()** negation';
    }
    if (isDotExpression(node)) {
      return `**Path**: access \`.${node.member}\``;
    }
    return undefined;
  }

  private opDescription(op: string): string {
    switch (op) {
      case '+': return 'Addition';
      case '-': return 'Subtraction';
      case '*': return 'Multiplication';
      case '/': return 'Division';
      case '**': return 'Exponentiation';
      case '=': return 'Equality';
      case '!=': return 'Inequality';
      case '<': return 'Less than';
      case '>': return 'Greater than';
      case '<=': return 'Less than or equal';
      case '>=': return 'Greater than or equal';
      case 'and': return 'Logical AND';
      case 'or': return 'Logical OR';
      default: return op;
    }
  }
}
