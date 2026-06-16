import { survivors } from "./data/survivors.js";
import { killers } from "./data/killers.js";

import { survivorPerks, killerPerks } from "./data/perks.js";

import { items } from "./data/items.js";

import { survivorChallenges, killerChallenges } from "./data/challenges.js";

import { killerAddons } from "./data/killerAddons.js";

import { survivorOfferings, killerOfferings } from "./data/offerings.js";

import { changelog } from "./data/changelog.js";

const button = document.getElementById("generateBtn");
const result = document.getElementById("result");
const sidebarHistory = document.getElementById("sidebarHistory");
const modeButtons = document.querySelectorAll(".mode-btn");

const BUILD_HISTORY_KEY = "entityChoiceBuildHistory";

let currentMode = "survivor";
let currentBuild = null;
let buildHistory = loadBuildHistory();
let activeHistoryIndex = null;

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    currentMode = btn.dataset.mode;

    renderBuildHistory();
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

function renderChallenge(challenge) {
  return `
    <div class="challenge-box">
      <div class="challenge-image">
        ${renderImage(challenge.image, challenge.title)}
      </div>

      <div class="challenge-content">
        <div class="challenge-title">${challenge.title}</div>
        <div class="challenge-description">${challenge.description}</div>
      </div>
    </div>
  `;
}

function renderSectionTitle(title, rerollType) {
  return `
    <div class="section-title">
      ${title}
      <button class="reroll-icon" type="button" data-reroll="${rerollType}" title="Reroll ${title}">🎲</button>
    </div>
  `;
}

function createSurvivorBuild() {
  const item = random(items);

  return {
    type: "survivor",
    character: random(survivors),
    perks: getRandomUnique(survivorPerks, 4),
    item,
    addons: getRandomUnique(item.addons, 2),
    offering: random(survivorOfferings),
    challenge: random(survivorChallenges),
  };
}

function createKillerBuild() {
  const killer = random(killers);
  const addonsPool = killerAddons?.[killer.name] || [];

  return {
    type: "killer",
    character: killer,
    perks: getRandomUnique(killerPerks, 4),
    addons: getRandomUnique(addonsPool, 2),
    offering: random(killerOfferings),
    challenge: random(killerChallenges),
  };
}

function renderBuild() {
  if (!currentBuild) return;

  if (currentBuild.type === "survivor") {
    result.innerHTML = `
      <h2>SURVIVOR BUILD</h2>

      <div class="survivor-layout">

        <section class="build-row top-row">

          <div class="character-box">
            <div class="character-name">
              ${currentBuild.character.name}
              <button class="reroll-icon" type="button" data-reroll="character" title="Reroll Character">🎲</button>
            </div>

            <div class="character-image">
              <img
                src="${currentBuild.character.image}"
                alt="${currentBuild.character.name}"
                style="
                  --character-scale:${currentBuild.character.scale || 1};
                  --character-x:${currentBuild.character.x || 0}px;
                  --character-y:${currentBuild.character.y || 0}px;
           "
           >
            </div>
          </div>

          <div class="item-box">
            ${renderSectionTitle("ITEM", "item")}
            ${renderCard(currentBuild.item, "item-card")}
          </div>

          <div class="item-addons-box">
            ${renderSectionTitle("ITEM ADDONS", "addons")}

            <div class="cards-row">
              ${currentBuild.addons.map((addon) => renderCard(addon, "addon-card")).join("")}
            </div>
          </div>

        </section>

        <section class="build-row">
          ${renderSectionTitle("PERKS", "perks")}

          <div class="cards-row perks-row">
            ${currentBuild.perks.map((p) => renderCard(p, "perk-card")).join("")}
          </div>
        </section>

        <section class="build-row">
          ${renderSectionTitle("OFFERING", "offering")}

          <div class="cards-row">
            ${renderCard(currentBuild.offering, "offering-card")}
          </div>
        </section>

        <section class="build-row">
          ${renderSectionTitle("CHALLENGE", "challenge")}
          ${renderChallenge(currentBuild.challenge)}
        </section>

      </div>
    `;
  }

  if (currentBuild.type === "killer") {
    result.innerHTML = `
      <h2>KILLER BUILD</h2>

      <div class="survivor-layout">

        <section class="build-row top-row">

          <div class="character-box">
            <div class="character-name">
              ${currentBuild.character.name}
              <button class="reroll-icon" type="button" data-reroll="character" title="Reroll Character">🎲</button>
            </div>

            <div class="character-image">
              <img
                src="${currentBuild.character.image}"
                alt="${currentBuild.character.name}"
                style="
                  --character-scale:${currentBuild.character.scale || 1};
                  --character-x:${currentBuild.character.x || 0}px;
                  --character-y:${currentBuild.character.y || 0}px;
                "
                >
            </div>
          </div>

          <div class="item-addons-box">
            ${renderSectionTitle("ADDONS", "addons")}

            <div class="cards-row">
              ${
                currentBuild.addons.length
                  ? currentBuild.addons
                      .map((addon) => renderCard(addon, "addon-card"))
                      .join("")
                  : `<div class="text-line">NO ADDONS</div>`
              }
            </div>
          </div>

        </section>

        <section class="build-row">
          ${renderSectionTitle("PERKS", "perks")}

          <div class="cards-row perks-row">
            ${currentBuild.perks.map((p) => renderCard(p, "perk-card")).join("")}
          </div>
        </section>

        <section class="build-row">
          ${renderSectionTitle("OFFERING", "offering")}

          <div class="cards-row">
            ${renderCard(currentBuild.offering, "offering-card")}
          </div>
        </section>

        <section class="build-row">
          ${renderSectionTitle("CHALLENGE", "challenge")}
          ${renderChallenge(currentBuild.challenge)}
        </section>

      </div>
    `;
  }
}

function rerollBuildPart(part) {
  if (!currentBuild) return;

  if (currentBuild.type === "survivor") {
    if (part === "character") {
      currentBuild.character = random(survivors);
    }

    if (part === "perks") {
      currentBuild.perks = getRandomUnique(survivorPerks, 4);
    }

    if (part === "item") {
      currentBuild.item = random(items);
      currentBuild.addons = getRandomUnique(currentBuild.item.addons, 2);
    }

    if (part === "addons") {
      currentBuild.addons = getRandomUnique(currentBuild.item.addons, 2);
    }

    if (part === "offering") {
      currentBuild.offering = random(survivorOfferings);
    }

    if (part === "challenge") {
      currentBuild.challenge = random(survivorChallenges);
    }
  }

  if (currentBuild.type === "killer") {
    if (part === "character") {
      currentBuild.character = random(killers);

      const addonsPool = killerAddons?.[currentBuild.character.name] || [];
      currentBuild.addons = getRandomUnique(addonsPool, 2);
    }

    if (part === "perks") {
      currentBuild.perks = getRandomUnique(killerPerks, 4);
    }

    if (part === "addons") {
      const addonsPool = killerAddons?.[currentBuild.character.name] || [];
      currentBuild.addons = getRandomUnique(addonsPool, 2);
    }

    if (part === "offering") {
      currentBuild.offering = random(killerOfferings);
    }

    if (part === "challenge") {
      currentBuild.challenge = random(killerChallenges);
    }
  }

  renderBuild();
}

function cloneBuild(build) {
  return structuredClone(build);
}

function loadBuildHistory() {
  const savedHistory = localStorage.getItem(BUILD_HISTORY_KEY);

  if (!savedHistory) {
    return [];
  }

  try {
    return JSON.parse(savedHistory);
  } catch {
    return [];
  }
}

function saveBuildHistory() {
  localStorage.setItem(BUILD_HISTORY_KEY, JSON.stringify(buildHistory));
}

function addBuildToHistory(build) {
  buildHistory.unshift(cloneBuild(build));

  if (buildHistory.length > 5) {
    buildHistory = buildHistory.slice(0, 5);
  }

  saveBuildHistory();
}

function renderBuildHistory() {
  if (!sidebarHistory) return;

  if (!buildHistory.length) {
    sidebarHistory.innerHTML = "";
    return;
  }

  sidebarHistory.innerHTML = `
    <div class="sidebar-history-header">
      <div class="sidebar-history-title">ENTITY ARCHIVE</div>
      <button class="clear-history-btn" type="button" data-clear-history>Очистить</button>
    </div>

    <div class="sidebar-history-list">
      ${buildHistory
        .map(
          (build, index) => `
        <button
          class="sidebar-history-build ${activeHistoryIndex === index ? "active" : ""}"
          type="button"
          data-history-index="${index}"
        >
          <span>${build.type === "survivor" ? "SURVIVOR" : "KILLER"}</span>
          <strong>${build.character.name}</strong>
          <small>${build.perks.length} перка • ${build.addons?.length || 0} аддона</small>
        </button>
      `,
        )
        .join("")}
    </div>
  `;
}

button.addEventListener("click", () => {
  currentBuild =
    currentMode === "survivor" ? createSurvivorBuild() : createKillerBuild();

  addBuildToHistory(currentBuild);

  activeHistoryIndex = 0;

  renderBuild();
  renderBuildHistory();
});

result.addEventListener("click", (event) => {
  const rerollButton = event.target.closest("[data-reroll]");

  if (rerollButton) {
    rerollBuildPart(rerollButton.dataset.reroll);
    return;
  }
});

sidebarHistory?.addEventListener("click", (event) => {
  const clearButton = event.target.closest("[data-clear-history]");

  if (clearButton) {
    buildHistory = [];
    saveBuildHistory();
    renderBuildHistory();
    return;
  }
  const historyButton = event.target.closest("[data-history-index]");

  if (!historyButton) return;

  const index = Number(historyButton.dataset.historyIndex);

  activeHistoryIndex = index;
  currentBuild = cloneBuild(buildHistory[index]);

  renderBuild();
  renderBuildHistory();
});

renderBuildHistory();

/* PATCH NOTES */

const patchBtn = document.getElementById("patchNotesBtn");
const patchModal = document.getElementById("patchNotesModal");
const closePatchBtn = document.getElementById("closePatchNotes");
const patchList = document.getElementById("patchList");
const patchDetails = document.getElementById("patchDetails");

let selectedPatchIndex = 0;

function getPatchSectionClass(title) {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("новое")) {
    return "patch-section-new";
  }

  if (normalizedTitle.includes("редкости")) {
    return "patch-section-rarity";
  }

  if (normalizedTitle.includes("визуальные")) {
    return "patch-section-visual";
  }

  if (normalizedTitle.includes("исправления")) {
    return "patch-section-fixes";
  }

  return "";
}

function renderChangelogTabs() {
  patchList.innerHTML = changelog
    .map(
      (update, index) => `
    <button 
      class="patch-tab ${index === selectedPatchIndex ? "active" : ""}" 
      type="button"
      data-index="${index}"
    >
      <span>${update.version}</span>
      <strong>${update.title}</strong>
    </button>
  `,
    )
    .join("");
}

function renderChangelogDetails() {
  const update = changelog[selectedPatchIndex];

  patchDetails.classList.remove("patch-details-animate");
  void patchDetails.offsetWidth;
  patchDetails.classList.add("patch-details-animate");

  patchDetails.innerHTML = `
    <div class="patch-details-header">
      <div class="patch-details-version">${update.version}</div>
      <h2>${update.title}</h2>
      ${update.date ? `<div class="patch-details-date">${update.date}</div>` : ""}
    </div>

    ${update.sections
      .map(
        (section) => `
      <div class="patch-section ${getPatchSectionClass(section.title)}">
        <h3>${section.title}</h3>
        <ul>
          ${section.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `,
      )
      .join("")}
  `;
}

function renderChangelog() {
  renderChangelogTabs();
  renderChangelogDetails();

  document.querySelectorAll(".patch-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      selectedPatchIndex = Number(tab.dataset.index);
      renderChangelog();
    });
  });
}

patchBtn?.addEventListener("click", () => {
  selectedPatchIndex = 0;
  renderChangelog();
  patchModal.classList.remove("hidden");
});

closePatchBtn?.addEventListener("click", () => {
  patchModal.classList.add("hidden");
});

patchModal?.addEventListener("click", (event) => {
  if (event.target === patchModal) {
    patchModal.classList.add("hidden");
  }
});
