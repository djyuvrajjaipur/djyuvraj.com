const loader=document.getElementById("loader"),enter=document.getElementById("enterBtn");
enter.addEventListener("click",()=>loader.classList.add("hide"));
window.addEventListener("load",()=>setTimeout(()=>loader.classList.add("hide"),1800));
document.getElementById("menuBtn").addEventListener("click",()=>alert("Use the menu links by scrolling to the sections."));
document.getElementById("bookingForm").addEventListener("submit",e=>{
 e.preventDefault();
 const f=new FormData(e.target);
 const text=`Hi DJ YuvRaj, I want to enquire about an event.%0A%0AName: ${f.get("name")}%0APhone: ${f.get("phone")}%0AEmail: ${f.get("email")}%0AEvent: ${f.get("event")}%0ADate: ${f.get("date")}%0AVenue: ${f.get("venue")}%0A%0A${f.get("message")}`;
 document.getElementById("formMsg").textContent="Opening WhatsApp to send your enquiry…";
 window.open("https://wa.me/919694196417?text="+text,"_blank");
});
