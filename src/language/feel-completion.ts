import type { LangiumDocument } from 'langium';
import {
  DefaultCompletionProvider,
  type LangiumServices,
} from 'langium/lsp';
import { CompletionItemKind, CompletionList } from 'vscode-languageserver';
import type { CompletionItem, CompletionParams, CancellationToken } from 'vscode-languageserver';
import type { FeelServices } from './feel-module.js';

const FEEL_BUILTINS: Array<{ label: string; detail: string }> = [
  { label: 'abs', detail: 'abs(number) : number' },
  { label: 'ceiling', detail: 'ceiling(number) : number' },
  { label: 'floor', detail: 'floor(number) : number' },
  { label: 'round up', detail: 'round up(number, scale) : number' },
  { label: 'round down', detail: 'round down(number, scale) : number' },
  { label: 'decimal', detail: 'decimal(number, scale) : number' },
  { label: 'modulo', detail: 'modulo(dividend, divisor) : number' },
  { label: 'sqrt', detail: 'sqrt(number) : number' },
  { label: 'log', detail: 'log(number) : number' },
  { label: 'exp', detail: 'exp(number) : number' },
  { label: 'even', detail: 'even(number) : boolean' },
  { label: 'odd', detail: 'odd(number) : boolean' },
  // String
  { label: 'string length', detail: 'string length(string) : number' },
  { label: 'substring', detail: 'substring(string, start, length?) : string' },
  { label: 'upper case', detail: 'upper case(string) : string' },
  { label: 'lower case', detail: 'lower case(string) : string' },
  { label: 'contains', detail: 'contains(string, match) : boolean' },
  { label: 'starts with', detail: 'starts with(string, match) : boolean' },
  { label: 'ends with', detail: 'ends with(string, match) : boolean' },
  { label: 'matches', detail: 'matches(input, pattern) : boolean' },
  { label: 'replace', detail: 'replace(input, pattern, replacement) : string' },
  { label: 'split', detail: 'split(string, delimiter) : list<string>' },
  // List
  { label: 'count', detail: 'count(list) : number' },
  { label: 'sum', detail: 'sum(list) : number' },
  { label: 'mean', detail: 'mean(list) : number' },
  { label: 'min', detail: 'min(list) : number/comparable' },
  { label: 'max', detail: 'max(list) : number/comparable' },
  { label: 'all', detail: 'all(list) : boolean' },
  { label: 'any', detail: 'any(list) : boolean' },
  { label: 'sublist', detail: 'sublist(list, start, length?) : list' },
  { label: 'append', detail: 'append(list, item...) : list' },
  { label: 'concatenate', detail: 'concatenate(list...) : list' },
  { label: 'insert before', detail: 'insert before(list, position, item) : list' },
  { label: 'remove', detail: 'remove(list, position) : list' },
  { label: 'reverse', detail: 'reverse(list) : list' },
  { label: 'index of', detail: 'index of(list, match) : list<number>' },
  { label: 'union', detail: 'union(list...) : list' },
  { label: 'distinct values', detail: 'distinct values(list) : list' },
  { label: 'flatten', detail: 'flatten(list) : list' },
  { label: 'sort', detail: 'sort(list, precedes) : list' },
  // Boolean
  { label: 'not', detail: 'not(boolean) : boolean' },
  // Date/Time
  { label: 'date', detail: 'date(string | year, month, day) : date' },
  { label: 'time', detail: 'time(string | hour, minute, second) : time' },
  { label: 'duration', detail: 'duration(string) : duration' },
  { label: 'now', detail: 'now() : date and time' },
  { label: 'today', detail: 'today() : date' },
  // Conversion
  { label: 'number', detail: 'number(string) : number' },
  { label: 'string', detail: 'string(value) : string' },
];

const FEEL_KEYWORDS = [
  'if', 'then', 'else',
  'for', 'in', 'return',
  'some', 'every', 'satisfies',
  'function',
  'instance', 'of',
  'between', 'and', 'or', 'not',
  'true', 'false', 'null',
];

export class FeelCompletionProvider extends DefaultCompletionProvider {
  private contextVariables: Array<{ name: string; type: string }>;

  constructor(services: FeelServices) {
    super(services as unknown as LangiumServices);
    this.contextVariables = services.context.variables;
  }

  override async getCompletion(
    document: LangiumDocument,
    params: CompletionParams,
    cancelToken?: CancellationToken,
  ): Promise<CompletionList | undefined> {
    const defaultResult = await super.getCompletion(document, params, cancelToken);
    const items: CompletionItem[] = defaultResult?.items ?? [];

    // Add FEEL builtins
    for (const builtin of FEEL_BUILTINS) {
      items.push({
        label: builtin.label,
        kind: CompletionItemKind.Function,
        detail: builtin.detail,
        sortText: `0_${builtin.label}`,
      });
    }

    // Add FEEL keywords
    for (const kw of FEEL_KEYWORDS) {
      items.push({
        label: kw,
        kind: CompletionItemKind.Keyword,
        detail: 'keyword',
        sortText: `1_${kw}`,
      });
    }

    // Add registered context variables (from DMN InputData)
    for (const variable of this.contextVariables) {
      items.push({
        label: variable.name,
        kind: CompletionItemKind.Variable,
        detail: `${variable.name} : ${variable.type}`,
        sortText: `00_${variable.name}`,
      });
    }

    return CompletionList.create(items, true);
  }
}
