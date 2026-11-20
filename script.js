const pages = {
  home: {title:"THE ENTRANCE", label:"Home", symbol:"⌂"},
  worlds:{title:"WORLDS & UNIVERSES",label:"Worlds & Universes",symbol:"✧",description:"Realms beyond the horizon, universes with their own laws, and places waiting to be discovered.",index:"SHELF 01"},
  civilizations:{title:"CIVILIZATIONS",label:"Civilizations",symbol:"♜",description:"The rise and fall of peoples, kingdoms, cultures, dynasties and empires.",index:"SHELF 02"},
  characters:{title:"CHARACTERS",label:"Characters",symbol:"♙",description:"Lives, lineages, loyalties and legends belonging to the worlds within this archive.",index:"SHELF 03"},
  powers:{title:"POWERS & SYSTEMS",label:"Powers & Systems",symbol:"⌘",description:"Magic, technology, abilities, ancient laws and the rules that shape possibility.",index:"SHELF 04"},
  literature:{title:"LITERATURE",label:"Literature",symbol:"❧",description:"Novels, poems, manuscripts, oral traditions and stories preserved across ages.",index:"SHELF 05"},
  geography:{title:"GEOGRAPHY",label:"Geography",symbol:"⌖",description:"Continents, oceans, cities, sacred places and the maps of imagined lands.",index:"SHELF 06"},
  history:{title:"HISTORY & TIMELINES",label:"History & Timelines",symbol:"◷",description:"The events, turning points, forgotten eras and chronologies that shaped each world.",index:"SHELF 07"},
  creatures:{title:"CREATURES & ENTITIES",label:"Creatures & Entities",symbol:"♢",description:"Beasts, spirits, strange lifeforms and entities known by many names.",index:"SHELF 08"},
  ideas:{title:"IDEA VAULT",label:"Idea Vault",symbol:"✳",description:"Fragments, concepts, unfinished thoughts and sparks awaiting a world of their own.",index:"SHELF 09"},
  creator:{title:"CREATOR STUDIO",label:"Creator Studio",symbol:"⚿",description:"A future workspace for the keeper of the archive.",index:"RESTRICTED"}
};
const shelfKeys = ["worlds","civilizations","characters","powers","literature","geography","history","creatures","ideas"];
const navLinks = [...document.querySelectorAll(".nav-link[data-page]")];
const sidebar = document.getElementById("sidebar");
const scrim = document.getElementById("scrim");
const menuToggle = document.getElementById("menuToggle");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message){
  toast.textContent=message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
}
function closeMenu(){sidebar.classList.remove("open");scrim.classList.remove("show");menuToggle.setAttribute("aria-expanded","false");}
function navigate(key){
  if(!pages[key]) return;
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"));
  if(key==="home") document.getElementById("page-home").classList.add("active-page");
  else if(key==="creator") document.getElementById("page-creator").classList.add("active-page");
  else {
    document.getElementById("page-section").classList.add("active-page");
    const data=pages[key];
    document.getElementById("sectionTitle").textContent=data.title;
    document.getElementById("sectionDescription").textContent=data.description;
    document.getElementById("sectionEmblem").textContent=data.symbol;
    document.getElementById("sectionIndex").textContent=data.index;
  }
  navLinks.forEach(link=>link.classList.toggle("active",link.dataset.page===key));
  document.getElementById("crumbCurrent").textContent=pages[key].title;
  history.replaceState(null,"","#"+key);
  closeMenu(); searchResults.classList.remove("show"); searchInput.value="";
  window.scrollTo({top:0,behavior:"smooth"});
}
navLinks.forEach(link=>link.addEventListener("click",e=>{e.preventDefault();navigate(link.dataset.page);}));
document.getElementById("enterButton").addEventListener("click",()=>navigate("worlds"));
document.getElementById("backToCollection").addEventListener("click",()=>navigate("home"));
menuToggle.addEventListener("click",()=>{const open=!sidebar.classList.contains("open");sidebar.classList.toggle("open",open);scrim.classList.toggle("show",open);menuToggle.setAttribute("aria-expanded",String(open));});
scrim.addEventListener("click",closeMenu);

const shelfGrid=document.getElementById("shelfGrid");
shelfKeys.forEach(key=>{
  const item=pages[key];
  const a=document.createElement("a");a.className="shelf-item";a.href="#"+key;
  a.innerHTML=`<span class="shelf-symbol">${item.symbol}</span><span><strong>${item.label.toUpperCase()}</strong><small>OPEN THIS SHELF &nbsp; →</small></span>`;
  a.addEventListener("click",e=>{e.preventDefault();navigate(key);});shelfGrid.appendChild(a);
});

function renderSearch(query){
  const q=query.trim().toLowerCase();searchResults.innerHTML="";
  if(!q){searchResults.classList.remove("show");return [];}
  const matches=Object.entries(pages).filter(([key,p])=>(p.label+" "+p.title+" "+key).toLowerCase().includes(q));
  if(matches.length){
    matches.forEach(([key,p])=>{const a=document.createElement("a");a.className="search-result";a.href="#"+key;a.textContent=p.label;a.addEventListener("click",e=>{e.preventDefault();navigate(key);});searchResults.appendChild(a);});
  }else{const empty=document.createElement("div");empty.className="search-empty";empty.textContent="No shelf found. Try “worlds”, “history” or “characters”.";searchResults.appendChild(empty);}
  searchResults.classList.add("show");return matches;
}
searchInput.addEventListener("input",()=>renderSearch(searchInput.value));
searchInput.addEventListener("keydown",e=>{
  if(e.key==="Enter"){const matches=renderSearch(searchInput.value);if(matches.length)navigate(matches[0][0]);else showToast("No matching shelf found in this preview.");}
  if(e.key==="Escape"){searchInput.value="";searchResults.classList.remove("show");searchInput.blur();}
});
document.addEventListener("click",e=>{if(!e.target.closest(".search-wrap"))searchResults.classList.remove("show");});

const initial=location.hash.replace("#","");
if(initial && pages[initial]) navigate(initial);
