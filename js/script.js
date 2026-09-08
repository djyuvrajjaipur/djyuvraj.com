const CONFIG={
  tracks:[
    {title:"Midnight Energy",artist:"DJ YuvRaj",cover:"images/music-01.jpg",audio:"audio/track-01.mp3",duration:"03:42"},
    {title:"Afterdark Edit",artist:"DJ YuvRaj",cover:"images/music-02.jpg",audio:"audio/track-02.mp3",duration:"04:08"},
    {title:"Desert Lights",artist:"DJ YuvRaj",cover:"images/music-01.jpg",audio:"audio/track-03.mp3",duration:"03:56"}
  ],
  links:{instagram:"#",youtube:"#",spotify:"#",soundcloud:"#",hearthis:"#"},
  whatsapp:"919999999999",
  bookingEmail:"booking@djyuvaraj.in"
};

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const header=$(".site-header"), menu=$(".menu-toggle"), nav=$(".nav");
menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");document.body.classList.toggle("menu-open",open);menu.setAttribute("aria-expanded",open)});
$$(".nav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");document.body.classList.remove("menu-open");menu.setAttribute("aria-expanded","false")}));

addEventListener("scroll",()=>header.classList.toggle("scrolled",scrollY>40),{passive:true});

const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
$$(".reveal,.reveal-left").forEach(el=>observer.observe(el));

const audio=$("#audio"), play=$("#play"), progress=$("#progress"), volume=$("#volume"), title=$("#playerTitle"), artist=$("#playerArtist"), art=$("#playerArt"), time=$("#playerTime"), tracksEl=$("#tracks");
let current=0;
function fmt(s){if(!Number.isFinite(s))return"00:00";return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(Math.floor(s%60)).padStart(2,"0")}`}
function loadTrack(i,autoplay=false){current=(i+CONFIG.tracks.length)%CONFIG.tracks.length;const t=CONFIG.tracks[current];audio.src=t.audio;title.textContent=t.title;artist.textContent=t.artist;art.src=t.cover;progress.value=0;time.textContent=`00:00 / ${t.duration}`;$$(".track").forEach((x,n)=>x.classList.toggle("playing",n===current));if(autoplay)audio.play().catch(()=>{})}
CONFIG.tracks.forEach((t,i)=>{const row=document.createElement("button");row.className="track";row.innerHTML=`<img src="${t.cover}" alt=""><span class="track-name">${t.title}<small>${t.artist}</small></span><span class="track-num">0${i+1}</span><span class="track-duration">${t.duration}</span>`;row.addEventListener("click",()=>loadTrack(i,true));tracksEl.appendChild(row)});
loadTrack(0);
play.onclick=()=>{if(audio.paused)audio.play().catch(()=>{});else audio.pause()};
audio.addEventListener("play",()=>play.textContent="Ⅱ");audio.addEventListener("pause",()=>play.textContent="▶");
audio.addEventListener("timeupdate",()=>{if(audio.duration){progress.value=audio.currentTime/audio.duration*100;time.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration)}`}});
audio.addEventListener("ended",()=>loadTrack(current+1,true));
progress.oninput=()=>{if(audio.duration)audio.currentTime=progress.value/100*audio.duration};
volume.oninput=()=>audio.volume=volume.value;audio.volume=.8;
$("#prev").onclick=()=>loadTrack(current-1,true);$("#next").onclick=()=>loadTrack(current+1,true);

const gallery=$$(".gallery-item"), lightbox=$("#lightbox"), lbImg=$("#lightboxImage");let lbIndex=0;
function openLb(i){lbIndex=i;lbImg.src=gallery[i].querySelector("img").src;lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");document.body.classList.add("menu-open")}
function closeLb(){lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");document.body.classList.remove("menu-open")}
function moveLb(d){openLb((lbIndex+d+gallery.length)%gallery.length)}
gallery.forEach((g,i)=>g.onclick=()=>openLb(i));$(".lightbox-close").onclick=closeLb;$(".lightbox-prev").onclick=()=>moveLb(-1);$(".lightbox-next").onclick=()=>moveLb(1);
lightbox.onclick=e=>{if(e.target===lightbox)closeLb()};addEventListener("keydown",e=>{if(!lightbox.classList.contains("open"))return;if(e.key==="Escape")closeLb();if(e.key==="ArrowLeft")moveLb(-1);if(e.key==="ArrowRight")moveLb(1)});

$$("[data-edit]").forEach(a=>a.addEventListener("click",e=>{if(a.getAttribute("href")==="#"){e.preventDefault();console.info("Replace this link in CONFIG.links:",a.dataset.edit)}}));
$("#bookingForm").addEventListener("submit",e=>{e.preventDefault();const form=e.currentTarget;if(!form.checkValidity()){form.reportValidity();return}alert("Booking enquiry validated. Connect this form to your Formspree/API/backend in js/script.js.");});
document.querySelector(".whatsapp").href=`https://wa.me/${CONFIG.whatsapp}`;
$$('a[href^="mailto:"]').forEach(a=>a.href=`mailto:${CONFIG.bookingEmail}`);

let lastY=0;addEventListener("scroll",()=>{const hero=document.querySelector(".hero-media");if(innerWidth>900&&hero){lastY=scrollY*.08;hero.style.transform=`scale(1.04) translateY(${lastY}px)`}},{passive:true});
