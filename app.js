import { survivors } from "./data/survivors.js";
import { killers } from "./data/killers.js";

import {
  survivorPerks,
  killerPerks
} from "./data/perks.js";

import { items } from "./data/items.js";

import {
  survivorChallenges,
  killerChallenges
} from "./data/challenges.js";

import { killerAddons } from "./data/killerAddons.js";

import {
  survivorOfferings,
  killerOfferings
} from "./data/offerings.js";

const button = document.getElementById("generateBtn");
const result = document.getElementById("result");

const modeButtons = document.querySelectorAll(".mode-btn");

let currentMode = "survivor";

// переключение режима
modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    modeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
  });
});

// random
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomUnique(arr, count) {
  const copy = [...arr];
  const result = [];
  const safeCount = Math.min(count, copy.length);

  for (let i = 0; i < safeCount; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy[index]);
    copy.splice(index, 1);
  }

  return result;
}

// SURVIVOR
function generateSurvivorBuild() {
  const survivor = random(survivors);
  const perks = getRandomUnique(survivorPerks, 4);
  const item = random(items);
  const [addon1, addon2] = getRandomUnique(item.addons, 2);
  const offering = random(survivorOfferings);
  const challenge = random(survivorChallenges);

  result.innerHTML = `
    <h2>SURVIVOR BUILD</h2>

    <div class="character-card">
      <img src="${survivor.image}" alt="${survivor.name}">
      <h3>${survivor.name}</h3>
    </div>

    <div class="block">
      <b>PERKS</b><br>
      ${perks.join("<br>")}
    </div>

    <div class="block">
      <b>ITEM</b><br>
      ${item.name}
    </div>

    <div class="block">
      <b>ADDONS</b><br>
      ${addon1.name}<br>
      ${addon2.name}
    </div>

    <div class="block">
      <b>OFFERING</b><br>
      ${offering}
    </div>

    <div class="block">
      <b>CHALLENGE</b><br>
      ${challenge.title}<br>
      <small>${challenge.description}</small>
    </div>
  `;
}

// KILLER
function generateKillerBuild() {
  const killer = random(killers);
  const perks = getRandomUnique(killerPerks, 4);
  const offering = random(killerOfferings);
  const challenge = random(killerChallenges);

  const addonsPool = killerAddons?.[killer.name] || [];

  let addonsText = "NO ADDONS";

  if (addonsPool.length >= 2) {
    const [a1, a2] = getRandomUnique(addonsPool, 2);
    addonsText = `${a1.name}<br>${a2.name}`;
  }

  result.innerHTML = `
    <h2>KILLER BUILD</h2>

    <div class="character-card">
      <img src="${killer.image}" alt="${killer.name}">
      <h3>${killer.name}</h3>
    </div>

    <div class="block">
      <b>PERKS</b><br>
      ${perks.join("<br>")}
    </div>

    <div class="block">
      <b>ADDONS</b><br>
      ${addonsText}
    </div>

    <div class="block">
      <b>OFFERING</b><br>
      ${offering}
    </div>

    <div class="block">
      <b>CHALLENGE</b><br>
      ${challenge.title}<br>
      <small>${challenge.description}</small>
    </div>
  `;
}

// button
button.addEventListener("click", () => {
  if (currentMode === "survivor") generateSurvivorBuild();
  else generateKillerBuild();
});