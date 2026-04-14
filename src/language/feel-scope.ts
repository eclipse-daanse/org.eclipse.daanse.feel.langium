import type { Scope, ReferenceInfo } from 'langium';
import { DefaultScopeProvider, EMPTY_SCOPE } from 'langium';
import type { FeelServices } from './feel-module.js';

export class FeelScopeProvider extends DefaultScopeProvider {
  constructor(services: FeelServices) {
    super(services);
  }

  override getScope(context: ReferenceInfo): Scope {
    return super.getScope(context);
  }

  protected override getGlobalScope(_referenceType: string, _context: ReferenceInfo): Scope {
    return EMPTY_SCOPE;
  }
}
