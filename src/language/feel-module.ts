import {
  type Module,
  type LangiumCoreServices,
  type LangiumSharedCoreServices,
  type PartialLangiumCoreServices,
  type DefaultSharedCoreModuleContext,
  inject,
  createDefaultCoreModule,
  createDefaultSharedCoreModule,
  EmptyFileSystem,
} from 'langium';
import {
  createDefaultSharedModule,
  type DefaultSharedModuleContext,
  type LangiumSharedServices,
} from 'langium/lsp';
import { FeelGeneratedModule, FeelLangiumGeneratedSharedModule } from '../generated/module.js';
import { FeelValidator, registerFeelValidationChecks } from './feel-validator.js';
import { FeelScopeProvider } from './feel-scope.js';
import { FeelHoverProvider } from './feel-hover.js';
import { FeelCompletionProvider } from './feel-completion.js';

export type FeelAddedServices = {
  validation: {
    FeelValidator: FeelValidator;
  };
  lsp: {
    HoverProvider: FeelHoverProvider;
    CompletionProvider: FeelCompletionProvider;
  };
  references: {
    ScopeProvider: FeelScopeProvider;
  };
  /** Registered input variable context for DMN integration */
  context: {
    variables: Array<{ name: string; type: string }>;
  };
};

export type FeelServices = LangiumCoreServices & FeelAddedServices;

export type FeelSharedServices = LangiumSharedCoreServices;

export const FeelModule: Module<FeelServices, PartialLangiumCoreServices & FeelAddedServices> = {
  validation: {
    FeelValidator: (services) => new FeelValidator(services),
  },
  lsp: {
    HoverProvider: (services) => new FeelHoverProvider(services),
    CompletionProvider: (services) => new FeelCompletionProvider(services),
  },
  references: {
    ScopeProvider: (services) => new FeelScopeProvider(services),
  },
  context: {
    variables: () => [],
  },
};

/**
 * Create FEEL services for headless (non-LSP) use, e.g. parsing.
 */
export function createFeelServices(context?: DefaultSharedCoreModuleContext): {
  shared: FeelSharedServices;
  feel: FeelServices;
} {
  const shared = inject(
    createDefaultSharedCoreModule(context ?? EmptyFileSystem),
    FeelLangiumGeneratedSharedModule,
  );
  const feel = inject(
    createDefaultCoreModule({ shared }),
    FeelGeneratedModule,
    FeelModule,
  );
  shared.ServiceRegistry.register(feel);
  registerFeelValidationChecks(feel);
  return { shared, feel };
}

/**
 * Create FEEL services with full LSP support, for use in a language server or Web Worker.
 */
export function createFeelLspServices(context: DefaultSharedModuleContext): {
  shared: LangiumSharedServices;
  feel: FeelServices;
} {
  const shared = inject(
    createDefaultSharedModule(context),
    FeelLangiumGeneratedSharedModule,
  );
  const feel = inject(
    createDefaultCoreModule({ shared }),
    FeelGeneratedModule,
    FeelModule,
  );
  shared.ServiceRegistry.register(feel);
  registerFeelValidationChecks(feel);
  return { shared, feel };
}
