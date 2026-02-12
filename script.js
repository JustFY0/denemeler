const state = {
  fruitLevel: 1,
  fruitSize: 10,
  machineLevel: 1,
  catapultLevel: 1,
  launchPower: 0,
  score: 0,
  money: 0,
  bestDistance: 0,
  bars: [0, 0, 0],
  activeBar: 0,
};

const el = {
  fruitLevel: document.getElementById("fruitLevel"),
  fruitSize: document.getElementById("fruitSize"),
  launchPower: document.getElementById("launchPower"),
  score: document.getElementById("score"),
  money: document.getElementById("money"),
  bestDistance: document.getElementById("bestDistance"),
  machineLevel: document.getElementById("machineLevel"),
  catapultLevel: document.getElementById("catapultLevel"),
  growBtn: document.getElementById("growBtn"),
  chargeBtn: document.getElementById("chargeBtn"),
  launchBtn: document.getElementById("launchBtn"),
  lastResult: document.getElementById("lastResult"),
  bars: document.getElementById("bars"),
  upgradeMachineBtn: document.getElementById("upgradeMachineBtn"),
  upgradeCatapultBtn: document.getElementById("upgradeCatapultBtn"),
};

const barElements = [];
for (let i = 0; i < 3; i += 1) {
  const bar = document.createElement("div");
  bar.className = "bar";
  const fill = document.createElement("div");
  fill.className = "bar-fill";
  const label = document.createElement("div");
  label.className = "bar-label";
  label.textContent = `Bar ${i + 1} - 0%`;
  bar.append(fill, label);
  el.bars.append(bar);
  barElements.push({ fill, label });
}

function updateUI() {
  el.fruitLevel.textContent = state.fruitLevel;
  el.fruitSize.textContent = state.fruitSize;
  el.launchPower.textContent = state.launchPower;
  el.score.textContent = state.score;
  el.money.textContent = state.money;
  el.bestDistance.textContent = state.bestDistance;
  el.machineLevel.textContent = state.machineLevel;
  el.catapultLevel.textContent = state.catapultLevel;

  const machineCost = 50 + (state.machineLevel - 1) * 35;
  const catapultCost = 75 + (state.catapultLevel - 1) * 45;

  el.upgradeMachineBtn.textContent = `Satın Al (${machineCost})`;
  el.upgradeCatapultBtn.textContent = `Satın Al (${catapultCost})`;
  el.upgradeMachineBtn.disabled = state.money < machineCost;
  el.upgradeCatapultBtn.disabled = state.money < catapultCost;

  const readyToLaunch = state.bars.every((b) => b === 100);
  el.launchBtn.disabled = !readyToLaunch;

  state.bars.forEach((value, i) => {
    barElements[i].fill.style.width = `${value}%`;
    barElements[i].label.textContent = `Bar ${i + 1} - ${value}%`;
  });
}

function resetBars() {
  state.bars = [0, 0, 0];
  state.activeBar = 0;
  state.launchPower = 0;
}

el.growBtn.addEventListener("click", () => {
  const growth = 3 + state.machineLevel * 2;
  state.fruitSize += growth;
  state.fruitLevel = Math.floor(state.fruitSize / 15);
  updateUI();
});

el.chargeBtn.addEventListener("click", () => {
  const idx = state.activeBar;
  if (idx > 2) return;

  const chargeAmount = 20 + Math.floor(Math.random() * 22);
  state.bars[idx] = Math.min(100, state.bars[idx] + chargeAmount);

  if (state.bars[idx] === 100) {
    state.activeBar += 1;
  }

  state.launchPower = Math.round(
    state.bars.reduce((sum, n) => sum + n, 0) / state.bars.length
  );

  updateUI();
});

el.launchBtn.addEventListener("click", () => {
  const powerFactor = state.launchPower / 100;
  const catapultMultiplier = 1 + (state.catapultLevel - 1) * 0.1;

  const distance = Math.round(state.fruitSize * powerFactor * catapultMultiplier * 2.4);
  const gainedScore = distance;
  const gainedMoney = Math.max(5, Math.floor(distance / 3));

  state.score += gainedScore;
  state.money += gainedMoney;
  state.bestDistance = Math.max(state.bestDistance, distance);

  el.lastResult.textContent = `Meyve ${distance} metre gitti! +${gainedScore} puan, +${gainedMoney} para kazandın.`;

  state.fruitSize = 10;
  state.fruitLevel = 1;
  resetBars();
  updateUI();
});

el.upgradeMachineBtn.addEventListener("click", () => {
  const cost = 50 + (state.machineLevel - 1) * 35;
  if (state.money < cost) return;
  state.money -= cost;
  state.machineLevel += 1;
  updateUI();
});

el.upgradeCatapultBtn.addEventListener("click", () => {
  const cost = 75 + (state.catapultLevel - 1) * 45;
  if (state.money < cost) return;
  state.money -= cost;
  state.catapultLevel += 1;
  updateUI();
});

updateUI();
