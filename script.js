const menuBtn=document.querySelector('.menu-btn'),nav=document.querySelector('.nav-menu');
if(menuBtn)menuBtn.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav-menu a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
