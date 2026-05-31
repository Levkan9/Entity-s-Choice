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

modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    modeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
  });
});

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

function renderImage(src, alt) {
  if (!src) {
    return `<div class="empty-image">NO IMAGE</div>`;
  }

  return `<img src="${src}" alt="${alt}">`;
}

function renderCard(item, className = "") {
  return `
    <div class="build-card ${className} ${item.rarity || ""}">
      <div class="card-name">${item.name}</div>
      <div class="card-image">
        ${renderImage(item.image, item.name)}
      </div>
    </div>
  `;
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

    <div class="survivor-layout">

      <section class="build-row top-row">

        <div class="character-box">
          <div class="character-name">${survivor.name}</div>

          <div class="character-image">
            <img src="${survivor.image}" alt="${survivor.name}">
          </div>
        </div>

        <div class="item-box">
          <div class="section-title">ITEM</div>
          ${renderCard(item, "item-card")}
        </div>

        <div class="item-addons-box">
          <div class="section-title">ITEM ADDONS</div>

          <div class="cards-row">
            ${renderCard(addon1, "addon-card")}
            ${renderCard(addon2, "addon-card")}
          </div>
        </div>

      </section>

      <section class="build-row">
        <div class="section-title">PERKS</div>

        <div class="cards-row perks-row">
          ${perks.map(p => renderCard(p, "perk-card")).join("")}
        </div>
      </section>

      <section class="build-row">
        <div class="section-title">OFFERING</div>

        <div class="cards-row">
          ${renderCard(offering, "offering-card")}
        </div>
      </section>

      <section class="build-row">
        <div class="section-title">CHALLENGE</div>

        <div class="challenge-box">
          <div class="challenge-title">${challenge.title}</div>
          <div class="challenge-description">${challenge.description}</div>
        </div>
      </section>

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

  let addonsText = `<div class="text-line">NO ADDONS</div>`;

  if (addonsPool.length >= 2) {
    const [a1, a2] = getRandomUnique(addonsPool, 2);

    addonsText = `
      ${renderCard(a1, "addon-card")}
      ${renderCard(a2, "addon-card")}
    `;
  }

  result.innerHTML = `
    <h2>KILLER BUILD</h2>

    <div class="survivor-layout">

      <section class="build-row top-row">

        <div class="character-box">
          <div class="character-name">${killer.name}</div>

          <div class="character-image">
            <img src="${killer.image}" alt="${killer.name}">
          </div>
        </div>

        <div class="item-addons-box">
          <div class="section-title">ADDONS</div>

          <div class="cards-row">
            ${addonsText}
          </div>
        </div>

      </section>

      <section class="build-row">
        <div class="section-title">PERKS</div>

        <div class="cards-row perks-row">
          ${perks.map(p => renderCard(p, "perk-card")).join("")}
        </div>
      </section>

      <section class="build-row">
        <div class="section-title">OFFERING</div>

        <div class="cards-row">
          ${renderCard(offering, "offering-card")}
        </div>
      </section>

      <section class="build-row">
        <div class="section-title">CHALLENGE</div>

        <div class="challenge-box">
          <div class="challenge-title">${challenge.title}</div>
          <div class="challenge-description">${challenge.description}</div>
        </div>
      </section>

    </div>
  `;
}

button.addEventListener("click", () => {
  if (currentMode === "survivor") generateSurvivorBuild();
  else generateKillerBuild();
});