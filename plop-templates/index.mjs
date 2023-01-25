import { componentGenerator } from './component/component-generator.mjs';
import { gqlQueryGenerator } from './gql-query/gql-query-generator.mjs';
import { gqlMutationGenerator } from './gql-mutation/gql-mutation-generator.mjs';
import { composableGenerator } from './composable/composable-generator.mjs';

export const plopHelpers = [];
export const plopGenerators = [componentGenerator, gqlQueryGenerator, gqlMutationGenerator, composableGenerator];
