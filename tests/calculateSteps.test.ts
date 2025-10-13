import test from "node:test";
import assert from "node:assert/strict";

import type { JSX } from "react";

import { calculateSteps } from "../src/utils/calculateSteps";
import { CoffeeRecipeType } from "../src/types";

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
  ],
};

test("calculates increments, cumulative amounts, and formatted actions", () => {
  const steps = calculateSteps(baseRecipe, 20, "sweet");

  assert.equal(steps.length, 4);

  assert.equal(steps[0].timeSec, 30);
  assert.equal(steps[0].incrementMl, 50.4);
  assert.equal(steps[0].cumulativeMl, 50);
  assert.equal(steps[0].action.en, "Pour to 50ml");

  assert.equal(steps[1].timeSec, 60);
  assert.equal(steps[1].incrementMl, 69.6);
  assert.equal(steps[1].cumulativeMl, 120);
  assert.equal(steps[1].action.en, "Pour to 120ml");

  assert.equal(steps[2].timeSec, 90);
  assert.equal(steps[2].incrementMl, 90);
  assert.equal(steps[2].cumulativeMl, 210);
  assert.equal(steps[2].action.en, "Pour to 210ml");

  assert.equal(steps[3].timeSec, 150);
  assert.equal(steps[3].incrementMl, 90);
  assert.equal(steps[3].cumulativeMl, 300);
  assert.equal(steps[3].action.en, "Pour to 300ml");
});

test("adjusts strength-based pours when a light brew is requested", () => {
  const steps = calculateSteps(baseRecipe, 20, "sweet", "light");

  assert.equal(steps.length, 3);

  assert.equal(steps[2].timeSec, 90);
  assert.equal(steps[2].incrementMl, 180);
  assert.equal(steps[2].cumulativeMl, 300);
  assert.equal(steps[2].action.en, "Pour to 300ml");
});

test("spreads strength pours across additional intervals for a strong brew", () => {
  const steps = calculateSteps(baseRecipe, 20, "sweet", "strong");

  assert.equal(steps.length, 5);

  assert.equal(steps[2].timeSec, 90);
  assert.equal(steps[2].incrementMl, 60);
  assert.equal(steps[2].cumulativeMl, 180);

  assert.equal(steps[3].timeSec, 130);
  assert.equal(steps[3].incrementMl, 60);
  assert.equal(steps[3].cumulativeMl, 240);

  assert.equal(steps[4].timeSec, 170);
  assert.equal(steps[4].incrementMl, 60);
  assert.equal(steps[4].cumulativeMl, 300);
});
