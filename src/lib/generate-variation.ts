import { type Variation, type VariationOption } from "@prisma/client";

export type VariationWithOptions = Variation & {
  options: VariationOption[]
}

export type VariationCombination = Record<string, VariationOption>;

export function generateVariationCombinations(variations: VariationWithOptions[]): VariationCombination[] {
  const requiredVariations = variations.filter(v => v.required);
  const optionalVariations = variations.filter(v => !v.required);

  function generateCombinations(
    vars: VariationWithOptions[], 
    current: VariationCombination = {}
  ): VariationCombination[] {
    if (vars.length === 0) {
      return [current];
    }

    const [firstVar, ...restVars] = vars;
    const combinations: VariationCombination[] = [];

    for (const option of firstVar.options) {
      const newCurrent = { ...current, [firstVar.name]: option };
      combinations.push(...generateCombinations(restVars, newCurrent));
    }

    return combinations;
  }

  const requiredCombinations = generateCombinations(requiredVariations);
  
  // 为每个必选组合添加可选变体的所有可能组合
  return requiredCombinations.flatMap(reqCombo => {
    const withOptional = generateCombinations(optionalVariations, reqCombo);
    return withOptional.length > 0 ? withOptional : [reqCombo];
  });
}
