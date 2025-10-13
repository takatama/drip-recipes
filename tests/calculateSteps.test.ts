import test from "node:test";
import assert from "node:assert/strict";

import type { JSX } from "react";

import { calculateSteps } from "../src/utils/calculateSteps";
import { CalculatedStep, CoffeeRecipeType } from "../src/types";

const dummyElement = {} as unknown as JSX.Element;

const baseRecipe: CoffeeRecipeType = {
  id: "test",
  name: { en: "Test", ja: "テスト" },
  description: { en: "", ja: "" },
  imageUrl: "",
  youTubeVideoId: "",
  equipments: { en: dummyElement, ja: dummyElement },
  params: [],
  waterRatio: 15,
  steps: [
    {
      time: 30,
      waterAmountType: "flavor1",
      action: { en: "Pour to ${cumulative}ml", ja: "${cumulative}mlまで注ぐ" },
      actionType: "pour",
    },
    {
      time: 60,
      waterAmountType: "flavor2",
      action: { en: "Pour to ${cumulative}ml", ja: "${cumulative}mlまで注ぐ" },
      actionType: "pour",
    },
    {
      time: 90,
      waterAmountType: "strength",
      action: { en: "Pour to ${cumulative}ml", ja: "${cumulative}mlまで注ぐ" },
      actionType: "pour",
    },
    {
      calcTime: true,
      waterAmountType: "strength",
      action: { en: "Pour to ${cumulative}ml", ja: "${cumulative}mlまで注ぐ" },
      actionType: "pour",
    },
    {
      calcTime: true,
      waterAmountType: "strength",
      action: { en: "Pour to ${cumulative}ml", ja: "${cumulative}mlまで注ぐ" },
      actionType: "pour",
    },
    {
      time: 210,
      action: {
        en: "Serve at ${cumulative}ml (target ${cumulative}ml)",
        ja: "${cumulative}mlで提供（目標${cumulative}ml）",
      },
      actionType: "none",
    },
  ],
};

test("calculates increments, cumulative amounts, and formatted actions", () => {
  const steps = calculateSteps(baseRecipe, 20, "sweet");

  assert.equal(steps.length, 5);
  assert.deepEqual(
    steps.map(step => step.timeSec),
    [30, 60, 90, 150, 210],
  );

  assert.equal(steps[0].incrementMl, 50.4);
  assert.equal(steps[0].cumulativeMl, 50);
  assert.equal(steps[0].action.en, "Pour to 50ml");

  assert.equal(steps[1].incrementMl, 69.6);
  assert.equal(steps[1].cumulativeMl, 120);
  assert.equal(steps[1].action.en, "Pour to 120ml");

  assert.equal(steps[2].incrementMl, 90);
  assert.equal(steps[2].cumulativeMl, 210);
  assert.equal(steps[2].action.en, "Pour to 210ml");

  assert.equal(steps[3].incrementMl, 90);
  assert.equal(steps[3].cumulativeMl, 300);
  assert.equal(steps[3].action.en, "Pour to 300ml");

  assert.equal(steps[4].incrementMl, 0);
  assert.equal(steps[4].cumulativeMl, 300);
  assert.equal(steps[4].action.en, "Serve at 300ml (target 300ml)");
  assert.equal(steps[4].action.ja, "300mlで提供（目標300ml）");
});

test("adjusts strength-based pours when a light brew is requested", () => {
  const steps = calculateSteps(baseRecipe, 20, "sweet", "light");

  assert.equal(steps.length, 4);
  assert.deepEqual(
    steps.map(step => step.timeSec),
    [30, 60, 90, 210],
  );

  assert.equal(steps[2].incrementMl, 180);
  assert.equal(steps[2].cumulativeMl, 300);
  assert.equal(steps[2].action.en, "Pour to 300ml");

  assert.equal(steps[3].incrementMl, 0);
  assert.equal(steps[3].cumulativeMl, 300);
  assert.equal(steps[3].action.en, "Serve at 300ml (target 300ml)");
});

test("spreads strength pours across additional intervals for a strong brew", () => {
  const steps = calculateSteps(baseRecipe, 20, "sweet", "strong");

  assert.equal(steps.length, 6);
  assert.deepEqual(
    steps.map(step => step.timeSec),
    [30, 60, 90, 130, 170, 210],
  );

  assert.equal(steps[2].incrementMl, 60);
  assert.equal(steps[2].cumulativeMl, 180);

  assert.equal(steps[3].incrementMl, 60);
  assert.equal(steps[3].cumulativeMl, 240);

  assert.equal(steps[4].incrementMl, 60);
  assert.equal(steps[4].cumulativeMl, 300);

  assert.equal(steps[5].incrementMl, 0);
  assert.equal(steps[5].cumulativeMl, 300);
  assert.equal(steps[5].action.en, "Serve at 300ml (target 300ml)");
});

test("divides five-pour recipes into even increments", () => {
  const fivePourRecipe: CoffeeRecipeType = {
    ...baseRecipe,
    steps: Array.from({ length: 5 }, (_, index) => ({
      time: index * 30,
      waterAmountType: "fivePour",
      action: {
        en: `Step ${index + 1}: pour to ${"${cumulative}"}ml`,
        ja: `第${index + 1}回: ${"${cumulative}"}mlまで注ぐ`,
      },
      actionType: "pour",
    })),
  };

  const steps = calculateSteps(fivePourRecipe, 20, "neutral");

  assert.equal(steps.length, 5);
  assert.deepEqual(
    steps.map(step => step.incrementMl),
    [60, 60, 60, 60, 60],
  );
  assert.deepEqual(
    steps.map(step => step.cumulativeMl),
    [60, 120, 180, 240, 300],
  );
  assert.ok(steps.every(step => step.action.en.includes(`${step.cumulativeMl}ml`)));
  assert.ok(steps.every(step => step.action.ja.includes(`${step.cumulativeMl}ml`)));
});

test("falls back to the medium distribution for unknown strength values", () => {
  const defaultSteps = calculateSteps(baseRecipe, 20, "sweet");
  const unknownStrengthSteps = calculateSteps(baseRecipe, 20, "sweet", "extra-strong");

  const serialize = (step: CalculatedStep) => ({
    time: step.timeSec,
    increment: step.incrementMl,
    cumulative: step.cumulativeMl,
  });

  assert.deepEqual(
    unknownStrengthSteps.map(serialize),
    defaultSteps.map(serialize),
  );
});
