
function setTheme(theme) { document.body.classList.remove("dark","amoled"); if (theme==="dark") document.body.classList.add("dark"); if (theme==="amoled") document.body.classList.add("amoled"); }
let currentTheme="light"; function toggleTheme() { if(currentTheme==="light"){setTheme("dark");currentTheme="dark";}else if(currentTheme==="dark"){setTheme("amoled");currentTheme="amoled";}else{setTheme("light");currentTheme="light";} }
async function fetchDashboard() {
  const API="https://financialmodelingprep.com/api/v3/";
  let nifty=await fetch(API+"quote/%5ENSEI?apikey=demo").then(r=>r.json());
  if(nifty && nifty[0]) document.getElementById("niftyPrice").innerText=nifty[0].price;
  let banknifty=await fetch(API+"quote/%5ENSEBANK?apikey=demo").then(r=>r.json());
  if(banknifty && banknifty[0]) document.getElementById("bankniftyPrice").innerText=banknifty[0].price;
  let gainers=await fetch(API+"stock_market/gainers?apikey=demo").then(r=>r.json());
  document.getElementById("gainers").innerHTML=gainers.slice(0,5).map(s=>`<div class="stock"><span>${s.symbol}</span><span class="green">+${s.changesPercentage}%</span></div>`).join("");
  let losers=await fetch(API+"stock_market/losers?apikey=demo").then(r=>r.json());
  document.getElementById("losers").innerHTML=losers.slice(0,5).map(s=>`<div class="stock"><span>${s.symbol}</span><span class="red">${s.changesPercentage}%</span></div>`).join("");
}
let watchlist=JSON.parse(localStorage.getItem("watchlist")||"[]");
function addWatch(symbol){symbol=symbol.toUpperCase(); if(!watchlist.includes(symbol)){watchlist.push(symbol); localStorage.setItem("watchlist",JSON.stringify(watchlist)); renderWatchlist();}}
function removeWatch(symbol){watchlist=watchlist.filter(s=>s!==symbol); localStorage.setItem("watchlist",JSON.stringify(watchlist)); renderWatchlist();}
async function renderWatchlist(){let container=document.getElementById("watchlistContainer"); if(!container) return; container.innerHTML=""; for(let s of watchlist){let data=await fetch("https://financialmodelingprep.com/api/v3/quote/"+s+"?apikey=demo").then(r=>r.json()).catch(e=>null); if(data && data[0]){let stock=data[0]; let div=document.createElement("div"); div.className="stock"; div.innerHTML=`<span>${stock.symbol}</span><span>${stock.price}</span><button onclick="removeWatch('${stock.symbol}')">❌</button>`; container.appendChild(div);}}}
async function fetchNews(){const API="https://financialmodelingprep.com/api/v3/stock_news?limit=10&apikey=demo"; let news=await fetch(API).then(r=>r.json()).catch(e=>[]); let container=document.getElementById("newsContainer"); if(!container) return; container.innerHTML=news.map(n=>`<div class="card"><h3>${n.title}</h3><p>${n.text.substring(0,120)}...</p><a href="${n.url}" target="_blank">Read more</a></div>`).join("");}
window.onload=()=>{fetchDashboard(); renderWatchlist(); fetchNews(); setInterval(fetchDashboard,60000); setInterval(fetchNews,600000);};
