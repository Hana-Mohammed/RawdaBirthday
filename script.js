/* =========================================================
   HEY BABE — script.js
   ========================================================= */

/* -----------------------------------------------------------
   ✏️  EDIT ME — replace with your own letter.
   Line breaks (\n) become new lines in the typewriter animation.
----------------------------------------------------------- */
const LETTER_MESSAGE =
`To Rawda, 🤍

We may not always say it, but having you in our lives has made such a difference. With time, you have changed something in each one of us and helped us discover parts of ourselves we never knew were there.

Thank you for every moment you stood by our side, every laugh, every memory, and every time you were there without us even having to ask.

We are truly grateful for everything beautiful you have added to our lives, for the impact you have had on us, and for every moment you have made better simply by being there.

We wish you a year filled with success, happiness, and ease. May you achieve everything you dream of, and may we always see you as the happiest person in the world.

Happy Birthday, Rawda. 🤍
We are truly lucky to have you in our lives.`;

/* ===========================================================
   Ambient background — floating hearts + twinkling sparkles
   =========================================================== */
(function ambientEffects(){
  const heartsLayer = document.getElementById('ambientHearts');
  const sparkleLayer = document.getElementById('ambientSparkles');
  const HEART_GLYPHS = ['♡', '❤', '♥'];

  function spawnHeart(){
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = HEART_GLYPHS[Math.floor(Math.random() * HEART_GLYPHS.length)];
    const left = Math.random() * 100;
    const size = 12 + Math.random() * 18;
    const duration = 9 + Math.random() * 8;
    const drift = (Math.random() * 80 - 40) + 'px';
    heart.style.left = left + 'vw';
    heart.style.fontSize = size + 'px';
    heart.style.animationDuration = duration + 's';
    heart.style.setProperty('--drift', drift);
    heartsLayer.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000 + 500);
  }

  function spawnSparkle(){
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + 'vw';
    sparkle.style.top = Math.random() * 100 + 'vh';
    sparkle.style.animationDuration = (2 + Math.random() * 3) + 's';
    sparkleLayer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 6000);
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 700);
  for (let i = 0; i < 14; i++) setTimeout(spawnSparkle, i * 200);

  setInterval(spawnHeart, 1600);
  setInterval(spawnSparkle, 900);
})();

/* ===========================================================
   Background music — starts on first user interaction
   =========================================================== */
(function musicSetup(){
  const music = document.getElementById('bgMusic');
  const toggle = document.getElementById('musicToggle');
  let started = false;

  function startMusic(){
    if (started) return;
    started = true;
    music.volume = 0.55;
    music.play().catch(() => {
      /* Autoplay blocked or file missing — user can still use the toggle. */
    });
  }

  ['click', 'touchstart', 'keydown'].forEach(evt =>
    window.addEventListener(evt, startMusic, { once: true, passive: true })
  );

  toggle.addEventListener('click', () => {
    if (music.paused){
      music.play().catch(() => {});
      toggle.setAttribute('aria-pressed', 'true');
    } else {
      music.pause();
      toggle.setAttribute('aria-pressed', 'false');
    }
  });
})();

/* ===========================================================
   Envelope opening sequence
   =========================================================== */
(function envelopeSequence(){
  const waxSeal = document.getElementById('waxSeal');
  const letterText = document.getElementById('letterText');
  const letterSignoff = document.getElementById('letterSignoff');
  const seeAttachmentsBtn = document.getElementById('seeAttachmentsBtn');
  let opened = false;

  waxSeal.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    document.body.classList.add('envelope-opening');

    // flap swings open immediately, letter peeks a beat later
    setTimeout(() => document.body.classList.add('envelope-open'), 50);

    // unlock scroll + reveal the letter screen, then glide to it
    setTimeout(() => {
      document.body.classList.add('unlocked');
      document.getElementById('letterScreen').scrollIntoView({ behavior: 'smooth' });
    }, 900);

    // begin typewriter once the "camera" has settled on the letter
    setTimeout(typeLetter, 1700);
  });

  function typeLetter(){
  letterText.textContent = LETTER_MESSAGE;
  letterSignoff.classList.add('show');
  seeAttachmentsBtn.classList.add('show');
}

  seeAttachmentsBtn.addEventListener('click', () => {
    document.getElementById('attachmentsScreen').scrollIntoView({ behavior: 'smooth' });
  });
})();

/* ===========================================================
   Reveal attachments as they scroll into view
   =========================================================== */
(function revealOnScroll(){
  const attachments = document.querySelectorAll('.attachment');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.2 });

  attachments.forEach(el => observer.observe(el));
})();

/* ===========================================================
   Lightbox gallery
   =========================================================== */
(function lightboxSetup(){
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');

  function open(src, alt){
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Expanded photo';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function close(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.gallery-item, .attachment-hero').forEach(el => {
    el.addEventListener('click', () => {
      const img = el.tagName === 'IMG' ? el : el.querySelector('img');
      if (img) open(img.src, img.alt);
    });
    el.style.cursor = 'zoom-in';
  });

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

/* ===========================================================
   Confetti — fires once the ending screen comes into view
   =========================================================== */
(function confettiSetup(){
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  const endingScreen = document.getElementById('endingScreen');
  const outroMusic = document.getElementById('outroMusic');
  const COLORS = ['#f4a9c2', '#dd7999', '#ffffff', '#fde7ee', '#c0273b'];
  let particles = [];
  let running = false;
  let fired = false;

  function resize(){
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);

  function makeParticle(){
    return {
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speedY: 1.5 + Math.random() * 2.5,
      speedX: (Math.random() - 0.5) * 1.6,
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 6,
    };
  }

  function launch(){
    resize();
    particles = Array.from({ length: 140 }, makeParticle);
    if (!running){
      running = true;
      requestAnimationFrame(tick);
    }
  }

  function tick(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let stillFalling = false;

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.spin;
      if (p.y < canvas.height + 20) stillFalling = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (stillFalling){
      requestAnimationFrame(tick);
    } else {
      running = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !fired){
  fired = true;

  launch();

  outroMusic.volume = 0.7;
  outroMusic.currentTime = 0;
  outroMusic.play().catch(() => {});

  setTimeout(launch, 1200);
}
    });
  }, { threshold: 0.4 });

  observer.observe(endingScreen);
})();
