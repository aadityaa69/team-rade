// ===== LOGIN CHECK & WELCOME =====
const currentUser=JSON.parse(localStorage.getItem('currentUser'));
if(!currentUser){ alert('Please login first!'); window.location.href='index.html'; }
document.getElementById("welcomeText").textContent=`Hi ${currentUser.username}, let's change the ecosystem!`;
function goPage(page){ window.location.href=page; }

// ===== BEFORE/AFTER LOGIC =====
function openPopup(){ document.getElementById("limitPopup").style.display="flex"; }
function closePopup(){ document.getElementById("limitPopup").style.display="none"; }
function getCompareData(){ 
  let data=JSON.parse(localStorage.getItem("compareLimit"))||{count:0,lastReset:Date.now()};
  const now=Date.now();
  if(now-data.lastReset>=86400000){ data.count=0; data.lastReset=now; localStorage.setItem("compareLimit",JSON.stringify(data)); }
  return data;
}
function recordCompare(){ let data=getCompareData(); data.count++; localStorage.setItem("compareLimit",JSON.stringify(data)); }
function compareAllowed(){ if(getCompareData().count>=10){ openPopup(); return false; } return true; }

let beforeImg=new Image(), afterImg=new Image();
const beforePreview=document.getElementById('beforePreview');
const afterPreview=document.getElementById('afterPreview');

document.getElementById("beforeInput").onchange=e=>{ const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader(); reader.onload=ev=>{ beforeImg.src=ev.target.result; beforePreview.src=ev.target.result; beforePreview.style.display="block"; }; reader.readAsDataURL(file);
};
document.getElementById("afterInput").onchange=e=>{ const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader(); reader.onload=ev=>{ afterImg.src=ev.target.result; afterPreview.src=ev.target.result; afterPreview.style.display="block"; }; reader.readAsDataURL(file);
};
function compareImages(){
  if(!compareAllowed()) return;
  if(!beforeImg.src||!afterImg.src){ alert("Upload both images first!"); return; }
  recordCompare();
  const canvas1=document.createElement('canvas'),canvas2=document.createElement('canvas');
  const ctx1=canvas1.getContext('2d'),ctx2=canvas2.getContext('2d'); const width=300,height=300;
  canvas1.width=canvas2.width=width; canvas1.height=canvas2.height=height;
  ctx1.drawImage(beforeImg,0,0,width,height); ctx2.drawImage(afterImg,0,0,width,height);
  const beforeData=ctx1.getImageData(0,0,width,height).data;
  const afterData=ctx2.getImageData(0,0,width,height).data;
  let diffCount=0;
  for(let i=0;i<beforeData.length;i+=4){
    const diff=Math.abs(beforeData[i]-afterData[i])+Math.abs(beforeData[i+1]-afterData[i+1])+Math.abs(beforeData[i+2]-afterData[i+2]);
    if(diff>60) diffCount++;
  }
  const cleanliness=((diffCount/(width*height))*100).toFixed(2);
  let points=0;
  if(cleanliness<20) points=1; else if(cleanliness<50) points=2; else if(cleanliness<80) points=4; else points=10;
  let users=JSON.parse(localStorage.getItem('users'))||[];
  for(let i=0;i<users.length;i++){ if(users[i].username===currentUser.username){ users[i].points=(users[i].points||0)+points; currentUser.points=users[i].points; } }
  const today=new Date(); today.setHours(0,0,0,0);
  if(!currentUser.lastUpload){ currentUser.streak=1; } else {
    const lastDate=new Date(currentUser.lastUpload); lastDate.setHours(0,0,0,0);
    const diffDays=Math.floor((today-lastDate)/(1000*60*60*24));
    if(diffDays===1){ currentUser.streak=(currentUser.streak||0)+1; } else if(diffDays>1){ currentUser.streak=1; }
  }
  currentUser.lastUpload=today.toISOString();
  localStorage.setItem('users',JSON.stringify(users));
  localStorage.setItem('currentUser',JSON.stringify(currentUser));
  document.getElementById("result").innerText=`Cleanliness🧹: ${cleanliness}% | Points🌳: ${points} | Total: ${currentUser.points}`;
  beforeImg=new Image(); afterImg=new Image(); beforePreview.style.display="none"; afterPreview.style.display="none";
  document.getElementById("beforeInput").value=""; document.getElementById("afterInput").value="";
}

// ===== NEWS SYSTEM =====
const newsContainer=document.getElementById("newsContainer");
const newsPopup=document.getElementById("newsPopup");
const viewNewsPopup=document.getElementById("viewNewsPopup");
function openNewsPopup(){ document.getElementById("newsTitle").value=""; document.getElementById("newsContent").value=""; document.getElementById("newsImage").value=""; newsPopup.style.display="flex"; }
function closeNewsPopup(){ newsPopup.style.display="none"; }
function openViewNewsPopup(item){ document.getElementById("viewNewsTitle").innerText=item.title; document.getElementById("viewNewsContent").innerText=item.content; document.getElementById("viewNewsImage").src=item.image||""; viewNewsPopup.style.display="flex"; }
function closeViewNewsPopup(){ viewNewsPopup.style.display="none"; }

function saveNews(){
  const title=document.getElementById("newsTitle").value.trim();
  const content=document.getElementById("newsContent").value.trim();
  const file=document.getElementById("newsImage").files[0];
  if(!title||!content){ alert("Enter title and content!"); return; }
  const reader=new FileReader();
  reader.onload=ev=>{
    const news=JSON.parse(localStorage.getItem("news"))||[];
    news.push({id:Date.now(),title,content,image:file?ev.target.result:""});
    localStorage.setItem("news",JSON.stringify(news));
    // Award 10 points
    let users=JSON.parse(localStorage.getItem("users"))||[];
    for(let i=0;i<users.length;i++){ if(users[i].username===currentUser.username){ users[i].points=(users[i].points||0)+10; currentUser.points=users[i].points; } }
    localStorage.setItem('users',JSON.stringify(users));
    localStorage.setItem('currentUser',JSON.stringify(currentUser));
    renderNews(); closeNewsPopup();
  }
  if(file) reader.readAsDataURL(file); else reader.onload({target:{result:""}});
}

function renderNews(){
  newsContainer.innerHTML="";
  const news=JSON.parse(localStorage.getItem("news"))||[];
  news.forEach(item=>{
    const card=document.createElement("div");
    card.className="news-card";
    card.innerHTML=`
      ${item.image?`<img src="${item.image}">`:``}
      <div class="news-card-content">
        <h3>${item.title}</h3>
        <p>${item.content.length>60?item.content.substring(0,60)+"...":item.content}</p>
      </div>
      <button class="news-delete-btn" onclick="deleteNews(${item.id},event)">Delete</button>
    `;
    card.onclick=e=>{ if(!e.target.classList.contains("news-delete-btn")) openViewNewsPopup(item); }
    newsContainer.appendChild(card);
  });
}

function deleteNews(id,event){
  event.stopPropagation();
  let news=JSON.parse(localStorage.getItem("news"))||[];
  news=news.filter(n=>n.id!==id);
  localStorage.setItem("news",JSON.stringify(news));
  renderNews();
}

renderNews();
function fetchWeather(){
  if(!navigator.geolocation){
    document.getElementById("weatherLocation").innerText = "Geolocation not supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(async position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const apiKey = "YOUR_OPENWEATHER_API_KEY"; // get from OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      document.getElementById("weatherLocation").innerText = data.name || "Your location";
      document.getElementById("weatherTemp").innerText = `${Math.round(data.main.temp)}°C`;
      document.getElementById("weatherDesc").innerText = data.weather[0].description;
      document.getElementById("weatherIcon").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    } catch(e){
      console.error(e);
      document.getElementById("weatherLocation").innerText = "Unable to fetch weather";
    }
  }, error => {
    console.error(error);
    document.getElementById("weatherLocation").innerText = "Location permission denied";
  });
}

// Call it once page loads
fetchWeather();
