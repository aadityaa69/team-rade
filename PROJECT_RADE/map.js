/* DOM refs */
const dustbinsContainer = document.getElementById("dustbinsContainer");

const dustbinPopup = document.getElementById("dustbinPopup");
const popupMapContainer = document.getElementById("popupMapContainer");
const popupMarker = document.getElementById("popupMarker");

const viewPopup = document.getElementById("viewDustbinPopup");
const viewMarker = document.getElementById("viewPopupMarker");
const viewName = document.getElementById("viewDustbinName");
const viewImage = document.getElementById("viewDustbinImage");

const mainMarkers = document.getElementById("mainMarkers");
const mapContainer = document.getElementById("mapContainer");
const mapImage = document.getElementById("mapImage");

let clickXPercent = null;
let clickYPercent = null;

/* PAGE NAVIGATION */
function goPage(p){ window.location.href = p; }

/* OPEN POPUP */
function openDustbinForm(){
  document.getElementById("dustbinName").value = "";
  document.getElementById("dustbinImage").value = "";
  clickXPercent = null;
  clickYPercent = null;
  popupMarker.style.display = "none";
  dustbinPopup.style.display = "flex";
}

function closeDustbinForm(){ dustbinPopup.style.display = "none"; }

/* CLICK ON POPUP MAP */
popupMapContainer.addEventListener("click", (e)=>{
  const rect = popupMapContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  clickXPercent = x / rect.width;
  clickYPercent = y / rect.height;

  popupMarker.style.left = x + "px";
  popupMarker.style.top = y + "px";
  popupMarker.style.display = "block";
});

/* SAVE DUSTBIN */
function saveDustbin(){
  const name = document.getElementById("dustbinName").value.trim();
  const file = document.getElementById("dustbinImage").files[0];

  if(!name || !file || clickXPercent === null){
    alert("Enter name, upload image & pick location!");
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev)=>{
    const dustbins = JSON.parse(localStorage.getItem("dustbins") || "[]");

    dustbins.push({
      name,
      image: ev.target.result,
      xPercent: clickXPercent,
      yPercent: clickYPercent
    });

    localStorage.setItem("dustbins", JSON.stringify(dustbins));

    renderDustbins();
    closeDustbinForm();
  };
  reader.readAsDataURL(file);
}

/* RENDER CARDS + MARKERS */
function renderDustbins(){
  dustbinsContainer.innerHTML = "";
  mainMarkers.innerHTML = "";

  const dustbins = JSON.parse(localStorage.getItem("dustbins") || "[]");
  const rect = mapContainer.getBoundingClientRect();
  const W = rect.width;
  const H = rect.height;

  dustbins.forEach((d, idx) => {

    /* --- CARD --- */
    const card = document.createElement("div");
    card.className = "dustbin-card";

    card.innerHTML = `
      <img src="${d.image}">
      <h3>${d.name}</h3>
      <button class="delete-btn">🗑️</button>
    `;

    /* DELETE BUTTON */
    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", (e)=>{
      e.stopPropagation(); // don't open view popup
      if(confirm("Delete this dustbin?")){
        dustbins.splice(idx,1);
        localStorage.setItem("dustbins", JSON.stringify(dustbins));
        renderDustbins();
      }
    });

    card.onclick = ()=>openViewPopup(d);
    dustbinsContainer.appendChild(card);

    /* --- MAIN MAP MARKER --- */
    const marker = document.createElement("div");
    marker.className = "marker";
    marker.style.left = (d.xPercent * W) + "px";
    marker.style.top  = (d.yPercent * H) + "px";

    marker.onclick = (e)=>{
      e.stopPropagation();
      openViewPopup(d);
    };

    mainMarkers.appendChild(marker);
  });
}

/* VIEW POPUP */
function openViewPopup(d){
  viewPopup.style.display = "flex";
  viewName.innerText = d.name;
  viewImage.src = d.image;

  const rect = document.getElementById("viewPopupMapContainer").getBoundingClientRect();
  viewMarker.style.left = (d.xPercent * rect.width) + "px";
  viewMarker.style.top  = (d.yPercent * rect.height) + "px";
  viewMarker.style.display = "block";
}

function closeViewDustbinForm(){
  viewPopup.style.display = "none";
  viewMarker.style.display = "none";
}

/* Re-render when map loads or window resizes */
mapImage.addEventListener("load", renderDustbins);
window.addEventListener("resize", renderDustbins);

renderDustbins();
