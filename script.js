/* -----------------------
   FREE STOCK API (Groww)
   ----------------------- */
const API = "https://groww.in/v1/api/stocks_data/v1/";

// --- LIVE NIFTY PRICE ---
async function fetchNifty() {
  let r = await fetch(API + "indices/NIFTY_50");
  let d = await r.json();
  document.getElementById("niftyPrice").innerHTML = d.lastPrice;
}

// --- TOP GAINERS ---
async function fetchGainers() {
  let r = await fetch(API + "top_gainers");
  let d = await r.json();
  let html = "";

  d.forEach(s => {
    html += `<div class='stock'>
               <span>${s.symbol}</span>
               <span class='green'>+${s.changePercent}%</span>
             </div>`;
  });

  document.getElementById("gainers").innerHTML = html;
}

// --- TOP LOSERS ---
async function fetchLosers() {
  let r = await fetch(API + "top_losers");
  let d = await r.json();
  let html = "";

  d.forEach(s => {
    html += `<div class='stock'>
               <span>${s.symbol}</span>
               <span class='red'>${s.changePercent}%</span>
             </div>`;
  });

  document.getElementById("losers").innerHTML = html;
}

// --- ALL STOCKS A–Z ---
async function fetchAllStocks() {
  let r = await fetch(API + "all_stocks");
  let d = await r.json();

  window.stockList = d;
  renderStockList(d);
}

function renderStockList(list) {
  let html = "";

  list.forEach(s => {
    html += `<div class='stock'>
               <span>${s.symbol}</span>
               <span>${s.lastPrice}</span>
             </div>`;
  });

  document.getElementById("allStocks").innerHTML = html;
}

// --- SEARCH BAR ---
document.getElementById("searchBar").addEventListener("keyup", () => {
  let q = searchBar.value.toLowerCase();
  let filtered = window.stockList.filter(s =>
    s.symbol.toLowerCase().includes(q)
  );
  renderStockList(filtered);
});

// --- DARK MODE ---
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
  themeToggle.innerText = document.body.classList.contains("dark")
    ? "Light Mode"
    : "Dark Mode";
};

// --- AUTO REFRESH EVERY 1 MIN ---
setInterval(() => {
  fetchNifty();
  fetchGainers();
  fetchLosers();
}, 60000);

// --- INITIAL LOAD ---
fetchNifty();
fetchGainers();
fetchLosers();
fetchAllStocks();
