import { CoffeeRecipeType, LanguageType } from "../types";
import { calculateSteps } from "./calculateSteps";
import { translations } from "../translations";

const HOSTNAME = "https://drip-recipes.pages.dev";

export function generateRecipeJsonLd(recipe: CoffeeRecipeType, lang: LanguageType) {
  const beansAmount = recipe.params.find(p => p.key === "beansAmount")?.default || 20;
  const defaultFlavor = recipe.params.find(p => p.key === "flavor")?.default || "neutral";
  const defaultStrength = recipe.params.find(p => p.key === "strength")?.default || "medium";
  
  // Using generateSteps function to generate calculated actual steps
  const calculatedSteps = calculateSteps(recipe, Number(beansAmount), String(defaultFlavor), String(defaultStrength));
  
  // Generate JSONLD instructions from calculated steps without Finish step
  const recipeInstructions = calculatedSteps
    .filter(step => !step.action[lang].includes("Finish") && !step.action[lang].includes("完成"))
    .map((step, index) => {
      return {
        "@type": "HowToStep" as const,
        "name": recipe.steps[index]?.name?.[lang] || step.name?.[lang] || `Step ${index + 1}`,
        "text": step.action[lang],
        "position": index + 1,
      };
    });

  // Calculate total time (estimated by the time of the last step)
  const lastStep = calculatedSteps.slice().reverse().find(step => step.timeSec !== undefined);
  const totalTimeMinutes = lastStep?.timeSec ? Math.ceil(lastStep.timeSec / 60) : 4;
  const totalTime = `PT${totalTimeMinutes}M`;

  // Get the final water amount
  const finalWaterAmount = calculatedSteps.length > 0 
    ? calculatedSteps[calculatedSteps.length - 1].cumulativeMl 
    : Number(beansAmount) * recipe.waterRatio;

  const jsonLd = {
    "@context": "https://schema.org/" as const,
    "@type": "Recipe" as const,
    "name": recipe.name[lang],
    "description": recipe.description[lang],
    "image": recipe.imageUrl ? `${HOSTNAME}${recipe.imageUrl}` : undefined,
    "author": {
      "@type": "Person" as const,
      "name": "Drip Recipes"
    },
    "recipeYield": "1 cup",
    "recipeCategory": "Beverage",
    "recipeCuisine": "Coffee",
    "keywords": "coffee, pour over, drip coffee, brew method",
    "tool": [
      "Coffee dripper",
      "Coffee filter",
      "Kettle",
      "Coffee grinder",
      "Scale"
    ],
    "recipeIngredient": [
      `${beansAmount}g coffee beans`,
      `${finalWaterAmount}ml water`
    ],
    "recipeInstructions": recipeInstructions,
    "totalTime": totalTime,
    "nutrition": {
      "@type": "NutritionInformation" as const,
      "servingSize": "1 cup",
      "calories": "5 calories"
    }
  };

  return jsonLd;
}

export function generateItemListJsonLd(
  recipes: CoffeeRecipeType[],
  lang: LanguageType,
  baseUrl: string = HOSTNAME
) {
  const itemListElements = recipes.map((recipe, index) => {
    return {
      "@type": "ListItem" as const,
      "position": index + 1,
      "name": recipe.name[lang],
      "url": `${baseUrl}/${lang}/recipes/featured/${recipe.id}`
    };
  });

  return {
    "@context": "https://schema.org/" as const,
    "@type": "ItemList" as const,
    "itemListElement": itemListElements,
    "numberOfItems": recipes.length,
    "name": translations[lang].recipeListTitle,
  };
}