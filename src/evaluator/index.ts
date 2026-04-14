/**
 * Re-export feelin's evaluate/unaryTest for direct FEEL evaluation.
 * The Langium grammar provides parsing + LSP features,
 * while feelin handles runtime evaluation.
 */
export {
  evaluate as feelEvaluate,
  unaryTest as feelUnaryTest,
} from 'feelin';
