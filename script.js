// === GAME DATA ===
let game = {
  money: 0,
  parts: [],
  builtPCs: [],
  darkMode: true,
  cryptos: {
    bitcoin: { amount: 0, price: 50000 },
    rufuscoin: { amount: 0, price: 200 }
  }
};

let currentScreen = "menu";
let autosaveTimer;

// === NAVIGATION ===
function openScreen(screen) {
  currentScreen = screen;
  const content = document.getElementById("content");
  switch (screen) {
    case "mainmenu":
      renderMainMenu();
      break;
    case "shop":
      content.innerHTML = `
        <h2>🛒 Shop</h2>
        <p>Buy parts here. (Coming soon)</p>
        <button onclick="openScreen('menu')">🏠 Main Menu</button>
      `;
      break;
    case "inventory":
      content.innerHTML = `
        <h2>📦 Inventory</h2>
        <p>View your parts. (Coming soon)</p>
        <button onclick="openScreen('menu')">🏠 Main Menu</button>
      `;
      break;
    case "build":
      content.innerHTML = `
        <h2>🧰 Build PC</h2>
        <p>Assemble compatible parts. (Coming soon)</p>
        <button onclick="simulateSell()">💵 Simulate Sell</button><br>
        <button onclick="openScreen('menu')">🏠 Main Menu</button>
      `;
      break;
    case "crypto":
      renderCryptoScreen();
      break;
    case "saves":
      renderSaveScreen();
      break;
    case "settings":
      renderSettings();
      break;
    default:
      renderMainMenu();
  }
}

// === MAIN MENU ===
function renderMainMenu() {
  document.getElementById("content").innerHTML = `
    <h2>🏠 Main Menu</h2>
    <button onclick="openScreen('saves')">▶️ Play</button>
    <button onclick="openScreen('settings')">⚙️ Settings</button>
  `;
}

// === IN-GAME MENU ===
function openGameMenu() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>💻 PC Miner Tycoon</h2>
    <button onclick="openScreen('shop')">Shop</button>
    <button onclick="openScreen('inventory')">Inventory</button>
    <button onclick="openScreen('build')">Build</button>
    <button onclick="openScreen('crypto')">Crypto</button>
    <button onclick="openScreen('mainmenu')">🏠 Main Menu</button>
  `;
}

// === CRYPTO SCREEN ===
function renderCryptoScreen() {
  const content = document.getElementById("content");
  let html = `<h2>💰 Crypto Mining</h2>`;
  for (let [key, coin] of Object.entries(game.cryptos)) {
    html += `
      <div>
        <b>${key}</b> — Owned: ${coin.amount.toFixed(2)} | 
        Price: $${coin.price.toFixed(2)}
        <br><button onclick="mineCrypto('${key}')">Mine +1</button>
        <button onclick="sellCrypto('${key}')">Sell All</button>
      </div>
    `;
  }
  html += `<p style="margin-top:10px;">Prices change every few seconds...</p>
  <button onclick="openScreen('menu')">🏠 Main Menu</button>`;
  content.innerHTML = html;
}

function mineCrypto(coin) {
  game.cryptos[coin].amount += 1;
}

function sellCrypto(coin) {
  let c = game.cryptos[coin];
  let value = c.amount * c.price;
  game.money += value;
  c.amount = 0;
  alert(`Sold ${coin} for $${value.toFixed(2)}!`);
}

setInterval(() => {
  for (let c of Object.values(game.cryptos)) {
    let change = 1 + (Math.random() * 0.4 - 0.2); // ±20%
    c.price = Math.max(1, c.price * change);
  }
  if (currentScreen === "crypto") renderCryptoScreen();
}, 5000);

// === SELL PRICE SIMULATION (TEMP) ===
function simulateSell() {
  // example part prices (replace with actual inventory later)
  let parts = [100, 50, 0];
  let sum = parts.reduce((a, b) => a + b, 0);
  let total = (sum + 100) * (0.9 + Math.random() * 0.3);
  alert(`This PC sells for $${total.toFixed(2)}.`);
}

// === SAVE SYSTEM ===
function renderSaveScreen() {
  const content = document.getElementById("content");
  let html = `<h2>💾 Save Files</h2>`;
  for (let i = 1; i <= 5; i++) {
    const saveName = localStorage.getItem(`save${i}-name`) || `Save ${i}`;
    const exists = localStorage.getItem(`save${i}`);
    html += `
      <div class="save-slot">
        <b>${saveName}</b>
        ${exists ? "(Saved)" : "(Empty)"}
        <br>
        <button onclick="saveGame(${i})">💾 Save</button>
        <button onclick="loadGame(${i})">📂 Load</button>
        <button onclick="renameSave(${i})">✏️ Rename</button>
        <button onclick="deleteSave(${i})">🗑 Delete</button>
      </div>
    `;
  }
  html += `<button onclick="openScreen('mainmenu')">🏠 Main Menu</button>`;
  content.innerHTML = html;
}

function saveGame(slot) {
  localStorage.setItem(`save${slot}`, JSON.stringify(game));
  alert(`Game saved to slot ${slot}`);
  renderSaveScreen();
}

function loadGame(slot) {
  const data = localStorage.getItem(`save${slot}`);
  if (!data) return alert("No save data here.");
  game = JSON.parse(data);
  alert(`Loaded slot ${slot}`);
  openScreen("menu");
  openGameMenu();
}

function renameSave(slot) {
  const newName = prompt("Enter a new name for this save:");
  if (newName) {
    localStorage.setItem(`save${slot}-name`, newName);
    renderSaveScreen();
  }
}

function deleteSave(slot) {
  if (confirm("Are you sure you want to delete this save?")) {
    localStorage.removeItem(`save${slot}`);
    localStorage.removeItem(`save${slot}-name`);
    renderSaveScreen();
  }
}

// === SETTINGS ===
function renderSettings() {
  const content = document.getElementById("content");
  const mode = game.darkMode ? "Dark" : "Light";
  content.innerHTML = `
    <h2>⚙️ Settings</h2>
    <p>Current Theme: <b>${mode}</b></p>
    <button onclick="toggleDarkMode()">Toggle Dark Mode</button><br><br>
    <button onclick="openScreen('mainmenu')">🏠 Main Menu</button>
  `;
}

function toggleDarkMode() {
  game.darkMode = !game.darkMode;
  document.body.classList.toggle("light-mode", !game.darkMode);
  renderSettings();
}

// === AUTOSAVE ===
function autoSave() {
  localStorage.setItem("autosave", JSON.stringify(game));
}
autosaveTimer = setInterval(autoSave, 1000);

window.onload = () => {
  const data = localStorage.getItem("autosave");
  if (data) {
    game = JSON.parse(data);
    if (!game.hasOwnProperty("darkMode")) game.darkMode = true;
    document.body.classList.toggle("light-mode", !game.darkMode);
    console.log("Autosave loaded.");
  }
  openScreen("mainmenu");
};
