// === GAME DATA ===
let game = {
  money: 0,
  parts: [],
  builtPCs: [],
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
    case "shop":
      content.innerHTML = `
        <h2>🛒 Shop</h2>
        <p>Buy parts here. (Coming soon)</p>
      `;
      break;
    case "inventory":
      content.innerHTML = `
        <h2>📦 Inventory</h2>
        <p>View your parts. (Coming soon)</p>
      `;
      break;
    case "build":
      content.innerHTML = `
        <h2>🧰 Build PC</h2>
        <p>Assemble compatible parts. (Coming soon)</p>
      `;
      break;
    case "crypto":
      renderCryptoScreen();
      break;
    case "saves":
      renderSaveScreen();
      break;
    default:
      content.innerHTML = `<p>Welcome back to <b>Build & Mine</b>!</p>`;
  }
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
  html += `<p style="margin-top:10px;">Prices change every few seconds...</p>`;
  document.getElementById("content").innerHTML = html;
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

// === AUTOSAVE ===
function autoSave() {
  localStorage.setItem("autosave", JSON.stringify(game));
}
autosaveTimer = setInterval(autoSave, 1000);

window.onload = () => {
  const data = localStorage.getItem("autosave");
  if (data) {
    game = JSON.parse(data);
    console.log("Autosave loaded.");
  }
  openScreen("menu");
};
