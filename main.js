const STORAGE_KEY = "goldfish-water-garden-save-v1";
const missions = [
  { id: "rescue", text: "Rescue the goldfish.", done: false },
  { id: "name", text: "Name your goldfish.", done: false },
  { id: "plants2", text: "Add 2 aquatic plants.", done: false },
  { id: "pebbles3", text: "Place 3 pebbles.", done: false },
  { id: "watch30", text: "Watch the aquarium for 30 seconds.", done: false },
  { id: "lamp", text: "Turn on warm lamp mode.", done: false },
];

const state = {
  scene: "rescue",
  fishName: "",
  happiness: 20,
  selectedItem: null,
  placements: [],
  inventoryCounts: { plant: 0, pebbles: 0, driftwood: 0, ornament: 0 },
  watchSeconds: 0,
  warmLamp: false,
  idle: false,
  missions,
};

const ui = {
  scenes: {
    rescue: document.getElementById("scene-rescue"), transition: document.getElementById("scene-transition"), aquarium: document.getElementById("scene-aquarium"),
  },
  net: document.getElementById("net"), stream: document.getElementById("stream"), streamFish: document.getElementById("stream-fish"),
  toAquarium: document.getElementById("to-aquarium"), aquarium: document.getElementById("aquarium"),
  missionCard: document.getElementById("mission-card"), happinessFill: document.getElementById("happiness-fill"),
  inventory: document.getElementById("inventory"), fishNameInput: document.getElementById("fish-name"), saveName: document.getElementById("save-name"),
  lampToggle: document.getElementById("lamp-toggle"), idleToggle: document.getElementById("idle-toggle"),
};

const inventoryItems = [
  { id: "plant", label: "🌿 Plant" },
  { id: "pebbles", label: "🪨 Pebbles" },
  { id: "driftwood", label: "🪵 Driftwood" },
  { id: "ornament", label: "🏞️ Lake Ornament" },
];

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try { Object.assign(state, JSON.parse(raw)); } catch {}
}
function setScene(name) {
  state.scene = name;
  Object.entries(ui.scenes).forEach(([k, el]) => el.classList.toggle("active", k === name));
  save(); render();
}
function updateMission(id, done = true) {
  const mission = state.missions.find((m) => m.id === id); if (mission) mission.done = done;
}
function renderMission() {
  const next = state.missions.find((m) => !m.done);
  ui.missionCard.innerHTML = `<strong>Today's Mission:</strong> ${next ? next.text : "All cozy tasks complete. Enjoy the water garden."}`;
}
function renderHappiness() { ui.happinessFill.style.width = `${Math.min(100, state.happiness)}%`; }
function renderInventory() {
  ui.inventory.innerHTML = "";
  inventoryItems.forEach((item) => {
    const btn = document.createElement("button");
    btn.className = "item";
    btn.draggable = true;
    btn.textContent = item.label;
    btn.onclick = () => (state.selectedItem = item.id);
    btn.ondragstart = (e) => e.dataTransfer.setData("text/plain", item.id);
    ui.inventory.appendChild(btn);
  });
}
function makeDecor(type, x, y) {
  const d = document.createElement("div");
  d.className = "decor";
  const emojis = { plant: "🌿", pebbles: "🪨", driftwood: "🪵", ornament: "🏞️" };
  d.textContent = emojis[type] || "•";
  d.style.left = `${x}px`; d.style.top = `${y}px`; d.style.fontSize = type === "pebbles" ? "1.1rem" : "1.6rem";
  ui.aquarium.appendChild(d);
}
function applyPlacements() {
  ui.aquarium.querySelectorAll(".decor").forEach((e) => e.remove());
  state.placements.forEach((p) => makeDecor(p.type, p.x, p.y));
}
function render() {
  renderMission(); renderHappiness(); applyPlacements();
  document.body.classList.toggle("warm-lamp", state.warmLamp);
  document.body.classList.toggle("idle", state.idle);
  ui.lampToggle.textContent = `Warm Lamp: ${state.warmLamp ? "On" : "Off"}`;
}

function initRescue() {
  ui.stream.addEventListener("pointermove", (e) => {
    const r = ui.stream.getBoundingClientRect();
    ui.net.style.left = `${e.clientX - r.left}px`; ui.net.style.top = `${e.clientY - r.top}px`;
  });
  ui.stream.addEventListener("click", () => {
    const netR = ui.net.getBoundingClientRect();
    const fishR = ui.streamFish.getBoundingClientRect();
    const overlap = !(netR.right < fishR.left || netR.left > fishR.right || netR.bottom < fishR.top || netR.top > fishR.bottom);
    if (overlap) {
      updateMission("rescue"); state.happiness += 12; setScene("transition");
    }
  });
}

function initAquarium() {
  ui.toAquarium.onclick = () => setScene("aquarium");
  ui.saveName.onclick = () => {
    state.fishName = ui.fishNameInput.value.trim();
    if (state.fishName) { updateMission("name"); state.happiness += 8; }
    save(); render();
  };
  ui.lampToggle.onclick = () => {
    state.warmLamp = !state.warmLamp;
    if (state.warmLamp) { updateMission("lamp"); state.happiness += 10; }
    save(); render();
  };
  ui.idleToggle.onclick = () => {
    state.idle = !state.idle;
    ui.idleToggle.textContent = state.idle ? "Exit Calm Idle Mode" : "Enter Calm Idle Mode";
    save(); render();
  };
  const placeAt = (clientX, clientY, type) => {
    if (!type) return;
    const r = ui.aquarium.getBoundingClientRect();
    const x = Math.max(5, Math.min(clientX - r.left, r.width - 24));
    const y = Math.max(30, Math.min(clientY - r.top, r.height - 24));
    state.placements.push({ type, x, y });
    state.inventoryCounts[type]++;
    if (state.inventoryCounts.plant >= 2) updateMission("plants2");
    if (state.inventoryCounts.pebbles >= 3) updateMission("pebbles3");
    state.happiness += 3;
    save(); render();
  };
  ui.aquarium.addEventListener("click", (e) => placeAt(e.clientX, e.clientY, state.selectedItem));
  ui.aquarium.addEventListener("dragover", (e) => e.preventDefault());
  ui.aquarium.addEventListener("drop", (e) => {
    e.preventDefault();
    placeAt(e.clientX, e.clientY, e.dataTransfer.getData("text/plain"));
  });
}

setInterval(() => {
  if (state.scene === "aquarium") {
    state.watchSeconds += 1;
    if (state.watchSeconds >= 30) updateMission("watch30");
    save(); renderMission();
  }
}, 1000);

function spawnBubbles() {
  const wrap = document.getElementById("bubbles");
  for (let i = 0; i < 8; i++) {
    const b = document.createElement("span");
    b.style.left = `${10 + i * 11}%`;
    b.style.animationDelay = `${Math.random() * 6}s`;
    b.style.animationDuration = `${6 + Math.random() * 5}s`;
    wrap.appendChild(b);
  }
}

load();
setScene(state.scene);
ui.fishNameInput.value = state.fishName;
renderInventory();
initRescue();
initAquarium();
spawnBubbles();
render();
