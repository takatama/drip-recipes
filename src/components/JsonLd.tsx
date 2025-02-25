import React from 'react';

type JsonLdType = {
  "@context": "https://schema.org/";
  "@type": "Recipe" | "ItemList" | "BreadcrumbList";
  itemListElement?: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    url: string;
  }>;
  numberOfItems?: number;
  name?: string;
  // Recipe specific properties
  description?: string;
  image?: string | string[];
  author?: {
    "@type": "Person";
    name: string;
  };
  recipeYield?: string;
  recipeCategory?: string;
  recipeCuisine?: string;
  keywords?: string;
  recipeIngredient?: string[];
  recipeInstructions?: Array<{
    "@type": "HowToStep";
    name: string;
    text: string;
    position: number;
  }>;
  totalTime?: string;
  nutrition?: {
    "@type": "NutritionInformation";
    servingSize: string;
    calories: string;
  };
};

interface JsonLdProps {
  data: JsonLdType;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}