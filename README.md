# org.eclipse.daanse.feel.langium

Langium-based FEEL (Friendly Enough Expression Language) parser with LSP support for DMN.

## Features

- Full FEEL grammar implementation using [Langium](https://langium.org/)
- Language Server Protocol (LSP) support
  - Code completion
  - Hover information
  - Validation
  - Scoping
- Expression evaluator (via [feelin](https://www.npmjs.com/package/feelin))
- Generated AST types and type guards

## Installation

```bash
npm install org.eclipse.daanse.feel.langium
```

## Usage

```typescript
import { createFeelServices } from 'org.eclipse.daanse.feel.langium';

// Create parser services
const services = createFeelServices();

// For LSP integration
import { createFeelLspServices } from 'org.eclipse.daanse.feel.langium';
const lspServices = createFeelLspServices();
```

### Expression Evaluation

```typescript
import { feelEvaluate, feelUnaryTest } from 'org.eclipse.daanse.feel.langium';

feelEvaluate('1 + 2');
feelUnaryTest('> 10', 15);
```

## Development

### Prerequisites

- Node.js 20 or 22
- npm

### Build

```bash
npm install
npm run build
```

### Watch Mode

```bash
npm run watch
```

### Generate Grammar

```bash
npm run langium:generate
```

## Project Structure

```
src/
  grammar/          # FEEL grammar definition (.langium)
  generated/        # Generated AST, grammar, and module
  language/         # LSP services (completion, hover, validation, scoping)
  evaluator/        # Expression evaluator (feelin wrapper)
  index.ts          # Public API exports
```

## License

[EPL-2.0](https://www.eclipse.org/legal/epl-2.0/)