const menu=document.querySelector('.menu'), links=document.querySelector('.nav-links');
if(menu) menu.addEventListener('click',()=>{links.classList.toggle('open');links.style.display=links.classList.contains('open')?'flex':'none';links.style.flexDirection='column';links.style.position='absolute';links.style.top='76px';links.style.right='0';links.style.background='#050505';links.style.padding='25px';});
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(x=>obs.observe(x));
const audio=document.getElementById('djAudio'),play=document.getElementById('playBtn'),bar=document.querySelector('.progress i');
if(audio&&play){play.onclick=()=>{if(audio.paused){audio.play();play.textContent='Ⅱ'}else{audio.pause();play.textContent='▶'}};audio.ontimeupdate=()=>bar.style.width=(audio.currentTime/audio.duration*100||0)+'%';}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{if(innerWidth<=800&&links)links.style.display='none'}));
