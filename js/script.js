const CONFIG = {
  tracks: [
    {
      title: "Midnight Energy",
      artist: "DJ YuvRaj",
      cover: "images/music-01.jpg",
      audio: "audio/track-01.mp3",
      duration: "03:42"
    },
    {
      title: "Afterdark Edit",
      artist: "DJ YuvRaj",
      cover: "images/music-02.jpg",
      audio: "audio/track-02.mp3",
      duration: "04:08"
    },
    {
      title: "Desert Lights",
      artist: "DJ YuvRaj",
      cover: "images/music-01.jpg",
      audio: "audio/track-03.mp3",
      duration: "03:56"
    }
  ],

  links: {
    instagram: "https://www.instagram.com/djyuvrajjaipur/",
    youtube: "https://www.youtube.com/@djyuvrajofficlal",
    spotify: "https://open.spotify.com/artist/30G5vyltXLidrl4OsSzorm",
    soundcloud: "https://soundcloud.com/djyuvrajjaipur",
    hearthis: "https://hearthis.at/djyuvrajjaipur"
  },

  whatsapp: "919928013885",
  bookingEmail: "djyuvrajjaipur@gmail.com"
};


/* =========================================================
   HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];


/* =========================================================
   NAVIGATION
========================================================= */

const header = $(".site-header");
const menu = $(".menu-toggle");
const nav = $(".nav");

if (menu && nav) {
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");

    document.body.classList.toggle("menu-open", open);

    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute(
      "aria-label",
      open ? "Close menu" : "Open menu"
    );
  });
}

$$(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    document.body.classList.remove("menu-open");

    menu?.setAttribute("aria-expanded", "false");
    menu?.setAttribute("aria-label", "Open menu");
  });
});


/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

function updateHeader() {
  if (!header) return;

  header.classList.toggle(
    "scrolled",
    window.scrollY > 40
  );
}

window.addEventListener(
  "scroll",
  updateHeader,
  { passive: true }
);

updateHeader();


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12
  }
);

$$(".reveal, .reveal-left").forEach((element) => {
  revealObserver.observe(element);
});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections = $$("main section[id]");
const navLinks = $$(".nav a[href^='#']");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") ===
            `#${entry.target.id}`
        );
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});


/* =========================================================
   AUDIO PLAYER
========================================================= */

const audio = $("#audio");
const play = $("#play");
const progress = $("#progress");
const volume = $("#volume");

const title = $("#playerTitle");
const artist = $("#playerArtist");
const art = $("#playerArt");
const time = $("#playerTime");
const tracksEl = $("#tracks");

let current = 0;


/* Format seconds */

function fmt(seconds) {
  if (!Number.isFinite(seconds)) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(remainingSeconds).padStart(2, "0")
  );
}


/* Load track */

function loadTrack(index, autoplay = false) {
  if (!audio) return;

  current =
    (index + CONFIG.tracks.length) %
    CONFIG.tracks.length;

  const track = CONFIG.tracks[current];

  audio.src = track.audio;

  if (title) {
    title.textContent = track.title;
  }

  if (artist) {
    artist.textContent = track.artist;
  }

  if (art) {
    art.src = track.cover;
  }

  if (progress) {
    progress.value = 0;
  }

  if (time) {
    time.textContent =
      `00:00 / ${track.duration}`;
  }

  $$(".track").forEach((row, index) => {
    row.classList.toggle(
      "playing",
      index === current
    );
  });

  if (autoplay) {
    audio.play().catch(() => {});
  }
}


/* Create track list */

if (tracksEl) {
  CONFIG.tracks.forEach((track, index) => {
    const row = document.createElement("button");

    row.type = "button";
    row.className = "track";

    row.innerHTML = `
      <img
        src="${track.cover}"
        alt="${track.title} cover"
      >

      <span class="track-name">
        ${track.title}
        <small>${track.artist}</small>
      </span>

      <span class="track-num">
        0${index + 1}
      </span>

      <span class="track-duration">
        ${track.duration}
      </span>
    `;

    row.addEventListener("click", () => {
      loadTrack(index, true);
    });

    tracksEl.appendChild(row);
  });
}


/* Initial track */

loadTrack(0);


/* Play / Pause */

play?.addEventListener("click", () => {
  if (!audio) return;

  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
});


/* Player state */

audio?.addEventListener("play", () => {
  if (play) {
    play.textContent = "Ⅱ";
    play.setAttribute("aria-label", "Pause");
  }
});

audio?.addEventListener("pause", () => {
  if (play) {
    play.textContent = "▶";
    play.setAttribute("aria-label", "Play");
  }
});


/* Track progress */

audio?.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  if (progress) {
    progress.value =
      (audio.currentTime / audio.duration) * 100;
  }

  if (time) {
    time.textContent =
      `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
  }
});


/* Auto next track */

audio?.addEventListener("ended", () => {
  loadTrack(current + 1, true);
});


/* Seek */

progress?.addEventListener("input", () => {
  if (!audio?.duration) return;

  audio.currentTime =
    (progress.value / 100) *
    audio.duration;
});


/* Volume */

volume?.addEventListener("input", () => {
  if (!audio) return;

  audio.volume = Number(volume.value);
});

if (audio) {
  audio.volume = 0.8;
}


/* Previous / Next */

$("#prev")?.addEventListener("click", () => {
  loadTrack(current - 1, true);
});

$("#next")?.addEventListener("click", () => {
  loadTrack(current + 1, true);
});


/* =========================================================
   GALLERY LIGHTBOX
========================================================= */

const gallery = $$(".gallery-item");
const lightbox = $("#lightbox");
const lbImg = $("#lightboxImage");

let lbIndex = 0;


/* Open */

function openLb(index) {
  if (!gallery.length || !lightbox || !lbImg) {
    return;
  }

  lbIndex = index;

  const image =
    gallery[index].querySelector("img");

  if (!image) return;

  lbImg.src = image.src;
  lbImg.alt = image.alt;

  lightbox.classList.add("open");

  lightbox.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add("menu-open");
}


/* Close */

function closeLb() {
  if (!lightbox) return;

  lightbox.classList.remove("open");

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove("menu-open");
}


/* Move */

function moveLb(direction) {
  if (!gallery.length) return;

  openLb(
    (lbIndex + direction + gallery.length) %
      gallery.length
  );
}


/* Gallery click */

gallery.forEach((item, index) => {
  item.addEventListener("click", () => {
    openLb(index);
  });
});


/* Lightbox controls */

$(".lightbox-close")?.addEventListener(
  "click",
  closeLb
);

$(".lightbox-prev")?.addEventListener(
  "click",
  () => moveLb(-1)
);

$(".lightbox-next")?.addEventListener(
  "click",
  () => moveLb(1)
);


/* Click outside image */

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLb();
  }
});


/* Keyboard controls */

window.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLb();
  }

  if (event.key === "ArrowLeft") {
    moveLb(-1);
  }

  if (event.key === "ArrowRight") {
    moveLb(1);
  }
});


/* =========================================================
   BOOKING FORM
========================================================= */

const bookingForm = $("#bookingForm");
const budget = $("#budget");
const budgetValue = $("#budgetValue");


/* Budget display */

budget?.addEventListener("input", () => {
  if (budgetValue) {
    budgetValue.textContent = budget.value;
  }
});


/* Form submit */

if (bookingForm) {
  bookingForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }

      const submitButton =
        bookingForm.querySelector(
          'button[type="submit"]'
        );

      const originalText =
        submitButton?.innerHTML || "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = "Sending…";
      }

      const formData = new FormData();

      formData.append(
        "entry.274821221",
        bookingForm.name.value
      );

      formData.append(
        "entry.610284649",
        bookingForm.email.value
      );

      formData.append(
        "entry.1010500656",
        bookingForm.phone.value
      );

      formData.append(
        "entry.1454081700",
        bookingForm.event.value
      );

      formData.append(
        "entry.693021019",
        bookingForm.date.value
      );


      /* Venue + City */

      const venue =
        bookingForm.venue?.value || "";

      const city =
        bookingForm.city?.value || "";

      formData.append(
        "entry.1658684155",
        `${venue}, ${city}`
      );


      /* Additional booking details */

      const details = [
        `Start time: ${
          bookingForm.startTime?.value || "—"
        }`,

        `Duration: ${
          bookingForm.duration?.value || "—"
        }`,

        `Genre: ${
          bookingForm.genre?.value || "—"
        }`,

        `Sound & lighting: ${
          bookingForm.soundLighting?.value || "—"
        }`,

        `Referral: ${
          bookingForm.referral?.value || "—"
        }`,

        `Budget flexibility: ${
          bookingForm.budget?.value || "5"
        }/10`,

        `Details: ${
          bookingForm.message?.value || "—"
        }`
      ].join("\n");


      formData.append(
        "entry.756000062",
        details
      );


      try {
        await fetch(
          "https://docs.google.com/forms/d/e/1FAIpQLScu743pB-gsipTX6S2FFkc_pl3oZ49XEke3ECJ6jSifCkD5-Q/formResponse",
          {
            method: "POST",
            mode: "no-cors",
            body: formData
          }
        );

        alert(
          "Thank you! Your booking enquiry has been sent successfully."
        );

        bookingForm.reset();

        if (budgetValue) {
          budgetValue.textContent = "5";
        }

      } catch (error) {
        console.error(error);

        alert(
          "Something went wrong. Please try again or contact us on WhatsApp."
        );

      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        }
      }
    }
  );
}


/* =========================================================
   WHATSAPP
========================================================= */

const whatsapp = $(".whatsapp");

if (whatsapp) {
  whatsapp.href =
    `https://wa.me/${CONFIG.whatsapp}`;
}


/* =========================================================
   BOOKING EMAIL
========================================================= */

$$('a[href^="mailto:"]').forEach((link) => {
  link.href =
    `mailto:${CONFIG.bookingEmail}`;
});


/* =========================================================
   HERO PARALLAX
========================================================= */

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

window.addEventListener(
  "scroll",
  () => {
    const hero =
      document.querySelector(".hero-media");

    if (
      window.innerWidth > 900 &&
      hero &&
      !reduceMotion.matches
    ) {
      hero.style.transform =
        `scale(1.045) translateY(${window.scrollY * 0.055}px)`;
    }
  },
  {
    passive: true
  }
);
