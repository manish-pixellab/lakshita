/**
 * For Lakshita (Devi Ji) — Interactive Digital Time Capsule
 * Orchestration script managing all 12 screens, Three.js 3D crystal hearts,
 * breakable wax seal, voice player, live countdown, secret passcode,
 * typewriter effects, and keepsake export.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Screen state machine (12 screens total)
  const totalScreens = 12;
  let currentScreen = 1;
  const screens = [];
  for (let i = 1; i <= totalScreens; i++) {
    const pad = String(i).padStart(2, '0');
    screens[i] = document.getElementById(`screen${pad}`);
  }

  const screenIndicator = document.getElementById('activeScreenIndicator');
  const soundToggleBtn = document.getElementById('soundToggleBtn');

  // Haptic feedback helper
  function triggerHaptic(pattern = [60, 90, 60]) {
    if (navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  function updateIndicator(screenNum) {
    if (screenIndicator) {
      screenIndicator.textContent = `Screen ${String(screenNum).padStart(2, '0')} / ${totalScreens}`;
    }
  }

  function updateAtmosphere(screenNum) {
    const bodyRoot = document.getElementById('bodyRoot') || document.body;
    const starrySkyLayer = document.getElementById('starrySkyLayer');
    
    // Remove existing theme classes
    bodyRoot.classList.remove('theme-morning', 'theme-afternoon', 'theme-cinema', 'theme-twilight', 'theme-midnight');
    
    if (screenNum <= 2) {
      bodyRoot.classList.add('theme-morning');
      if (starrySkyLayer) starrySkyLayer.classList.add('hidden');
    } else if (screenNum <= 4) {
      bodyRoot.classList.add('theme-afternoon');
      if (starrySkyLayer) starrySkyLayer.classList.add('hidden');
    } else if (screenNum === 5) {
      bodyRoot.classList.add('theme-cinema');
      if (starrySkyLayer) starrySkyLayer.classList.add('hidden');
    } else if (screenNum <= 7) {
      bodyRoot.classList.add('theme-twilight');
      if (starrySkyLayer) starrySkyLayer.classList.add('hidden');
    } else {
      // Screens 8-12: Midnight with twinkling romantic starry sky
      bodyRoot.classList.add('theme-midnight');
      if (starrySkyLayer) starrySkyLayer.classList.remove('hidden');
    }
  }

  function goToScreen(target) {
    if (target < 1 || target > totalScreens) return;
    
    if (screens[currentScreen]) {
      screens[currentScreen].classList.remove('active');
    }

    currentScreen = target;
    updateIndicator(currentScreen);
    updateAtmosphere(currentScreen);

    setTimeout(() => {
      if (screens[currentScreen]) {
        screens[currentScreen].classList.add('active');
        initScreenLogic(currentScreen);
      }
    }, 300);
  }

  // Sound toggle button listener
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const playing = window.capsuleAudio.toggle();
      if (playing) {
        soundToggleBtn.classList.add('playing');
      } else {
        soundToggleBtn.classList.remove('playing');
      }
    });
  }

  // Feature: "Befikar" Track Modal & Player Logic
  const spotifyMusicBtn = document.getElementById('spotifyMusicBtn');
  const spotifyPlayerModal = document.getElementById('spotifyPlayerModal');
  const closeSpotifyModalBtn = document.getElementById('closeSpotifyModalBtn');
  const closeSpotifyModalBackdrop = document.getElementById('closeSpotifyModalBackdrop');
  const tabYoutubeBtn = document.getElementById('tabYoutubeBtn');
  const tabSpotifyBtn = document.getElementById('tabSpotifyBtn');
  const playerViewYoutube = document.getElementById('playerViewYoutube');
  const playerViewSpotify = document.getElementById('playerViewSpotify');
  const youtubeSongIframe = document.getElementById('youtubeSongIframe');

  function openSpotifyModal() {
    if (spotifyPlayerModal) {
      spotifyPlayerModal.classList.remove('hidden');
      triggerHaptic([50, 70]);
      if (window.capsuleAudio) {
        window.capsuleAudio.playFreezeTone();
      }
    }
  }

  function closeSpotifyModal() {
    if (spotifyPlayerModal) {
      spotifyPlayerModal.classList.add('hidden');
      // Pause YouTube iframe audio when closing modal
      if (youtubeSongIframe) {
        try {
          youtubeSongIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } catch (e) {}
      }
    }
  }

  if (tabYoutubeBtn && tabSpotifyBtn && playerViewYoutube && playerViewSpotify) {
    tabYoutubeBtn.addEventListener('click', () => {
      tabYoutubeBtn.classList.add('active');
      tabSpotifyBtn.classList.remove('active');
      playerViewYoutube.classList.remove('hidden');
      playerViewSpotify.classList.add('hidden');
      triggerHaptic([30, 50]);
    });

    tabSpotifyBtn.addEventListener('click', () => {
      tabSpotifyBtn.classList.add('active');
      tabYoutubeBtn.classList.remove('active');
      playerViewSpotify.classList.remove('hidden');
      playerViewYoutube.classList.add('hidden');
      triggerHaptic([30, 50]);
      // Pause YouTube if switching to Spotify
      if (youtubeSongIframe) {
        try {
          youtubeSongIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } catch (e) {}
      }
    });
  }

  if (spotifyMusicBtn) {
    spotifyMusicBtn.addEventListener('click', openSpotifyModal);
  }
  if (closeSpotifyModalBtn) {
    closeSpotifyModalBtn.addEventListener('click', closeSpotifyModal);
  }
  if (closeSpotifyModalBackdrop) {
    closeSpotifyModalBackdrop.addEventListener('click', closeSpotifyModal);
  }

  // Feature 3: Emerald & Tulip Theme Switcher
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const bodyRootEl = document.getElementById('bodyRoot') || document.body;

  function applyEmeraldTheme(isEmerald) {
    if (isEmerald) {
      bodyRootEl.classList.add('theme-emerald-tulip');
      if (themeToggleBtn) {
        themeToggleBtn.classList.add('active-emerald');
        themeToggleBtn.innerHTML = '<span class="theme-icon">✨</span><span class="theme-label">Classic Burgundy</span>';
      }
    } else {
      bodyRootEl.classList.remove('theme-emerald-tulip');
      if (themeToggleBtn) {
        themeToggleBtn.classList.remove('active-emerald');
        themeToggleBtn.innerHTML = '<span class="theme-icon">🌷</span><span class="theme-label">Emerald &amp; Tulip</span>';
      }
    }
  }

  // Check saved theme preference
  try {
    const savedTheme = localStorage.getItem('capsuleTheme');
    if (savedTheme === 'emerald-tulip') {
      applyEmeraldTheme(true);
    }
  } catch (e) {}

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isCurrentlyEmerald = bodyRootEl.classList.contains('theme-emerald-tulip');
      const willBeEmerald = !isCurrentlyEmerald;
      applyEmeraldTheme(willBeEmerald);
      try {
        localStorage.setItem('capsuleTheme', willBeEmerald ? 'emerald-tulip' : 'classic');
      } catch (e) {}

      triggerHaptic([40, 60]);
      window.capsuleAudio.playSecretChime();
      const rect = themeToggleBtn.getBoundingClientRect();
      if (window.spawnTulipSparks) {
        window.spawnTulipSparks(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    });
  }

  // ==========================================================
  // FLOATING FLOWER PETALS & REDDISH-PINK HEARTS CANVAS
  // ==========================================================
  const petalCanvas = document.getElementById('petalCanvas');
  const pCtx = petalCanvas.getContext('2d');
  let petals = [];

  function resizePetalCanvas() {
    petalCanvas.width = window.innerWidth;
    petalCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizePetalCanvas);
  resizePetalCanvas();

  const romanticColors = [
    'rgba(255, 175, 204, ', // soft pink
    'rgba(255, 133, 161, ', // rose pink
    'rgba(255, 77, 109, ',  // vibrant pinkish-red
    'rgba(230, 57, 70, ',   // warm romantic red
    'rgba(201, 24, 74, ',   // deep red rose
    'rgba(203, 178, 121, '  // champagne gold
  ];

  class RomanticPetal {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * petalCanvas.width;
      this.y = -20;
      this.size = Math.random() * 8 + 6;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.04 + 0.01;
      this.color = romanticColors[Math.floor(Math.random() * romanticColors.length)];
      this.alpha = Math.random() * 0.5 + 0.35;
      const rand = Math.random();
      this.shape = rand > 0.5 ? 'tulip' : (rand > 0.25 ? 'heart' : 'petal');
    }
    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.7;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;

      if (this.y > petalCanvas.height + 20 || this.x < -30 || this.x > petalCanvas.width + 30) {
        this.reset();
      }
    }
    draw() {
      pCtx.save();
      pCtx.translate(this.x, this.y);
      pCtx.rotate(this.rotation);
      pCtx.fillStyle = this.color + this.alpha + ')';

      if (this.shape === 'tulip') {
        const s = this.size * 0.9;
        // Central bell petal
        pCtx.beginPath();
        pCtx.moveTo(0, s * 0.4);
        pCtx.bezierCurveTo(-s * 0.4, -s * 0.5, s * 0.4, -s * 0.5, 0, s * 0.4);
        pCtx.fill();
        // Left flank
        pCtx.beginPath();
        pCtx.moveTo(-s * 0.1, s * 0.4);
        pCtx.bezierCurveTo(-s * 0.7, 0, -s * 0.5, -s * 0.6, -s * 0.15, -s * 0.2);
        pCtx.fill();
        // Right flank
        pCtx.beginPath();
        pCtx.moveTo(s * 0.1, s * 0.4);
        pCtx.bezierCurveTo(s * 0.7, 0, s * 0.5, -s * 0.6, s * 0.15, -s * 0.2);
        pCtx.fill();
      } else if (this.shape === 'heart') {
        const s = this.size * 0.7;
        pCtx.beginPath();
        pCtx.moveTo(0, s * 0.3);
        pCtx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.2, 0, s);
        pCtx.bezierCurveTo(s, s * 0.2, s * 0.5, -s * 0.3, 0, s * 0.3);
        pCtx.fill();
      } else {
        pCtx.beginPath();
        pCtx.ellipse(0, 0, this.size * 0.5, this.size, Math.PI / 4, 0, Math.PI * 2);
        pCtx.fill();
      }
      pCtx.restore();
    }
  }

  window.spawnTulipSparks = function(x, y) {
    for (let i = 0; i < 6; i++) {
      const p = new RomanticPetal();
      p.x = x + (Math.random() - 0.5) * 20;
      p.y = y + (Math.random() - 0.5) * 20;
      p.speedY = -(Math.random() * 2.2 + 1.0);
      p.speedX = (Math.random() - 0.5) * 2.5;
      p.size = Math.random() * 6 + 7;
      p.shape = Math.random() > 0.4 ? 'tulip' : 'heart';
      petals.push(p);
      setTimeout(() => {
        const idx = petals.indexOf(p);
        if (idx > -1) petals.splice(idx, 1);
      }, 3500);
    }
  };

  window.addEventListener('pointerdown', (e) => {
    window.spawnTulipSparks(e.clientX, e.clientY);
  });

  for (let i = 0; i < 42; i++) {
    const p = new RomanticPetal();
    p.y = Math.random() * petalCanvas.height;
    petals.push(p);
  }

  function animatePetals() {
    pCtx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
    petals.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animatePetals);
  }
  animatePetals();

  // ==========================================================
  // INTERACTIVE CLICK / TAP BURST (Cute Red & Pink Hearts)
  // ==========================================================
  document.addEventListener('click', (e) => {
    createHeartBurst(e.clientX, e.clientY);
  });

  function createHeartBurst(x, y) {
    const count = 6;
    const heartChars = ['♥', '🌸', '💖', '💕'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'click-burst-heart';
      el.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
      
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const distance = Math.random() * 45 + 30;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 25;
      const rot = (Math.random() - 0.5) * 60;

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.setProperty('--dx', `${dx}px`);
      el.style.setProperty('--dy', `${dy}px`);
      el.style.setProperty('--rot', `${rot}deg`);
      
      const colors = ['#FF4D6D', '#FF758F', '#C9184A', '#E63946', '#FFAFCC'];
      el.style.color = colors[Math.floor(Math.random() * colors.length)];

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  }

  // Feature 5: Grand Finale Celebration Shower (Heart Confetti, Golden Sparkles, Emerald Dust)
  function triggerGrandCelebration() {
    const totalParticles = 48;
    const symbols = ['♥', '🌸', '✨', '💖', '★', '💕', '💎'];
    const colors = ['#FF4D6D', '#FF758F', '#D8B26E', '#2ECC71', '#FFAFCC', '#FFFFFF', '#C9184A'];

    for (let i = 0; i < totalParticles; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'click-burst-heart';
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * (window.innerHeight * 0.5) + 50;
        const dx = (Math.random() - 0.5) * 220;
        const dy = (Math.random() - 0.5) * 200;
        const rot = (Math.random() - 0.5) * 360;

        el.style.left = `${startX}px`;
        el.style.top = `${startY}px`;
        el.style.setProperty('--dx', `${dx}px`);
        el.style.setProperty('--dy', `${dy}px`);
        el.style.setProperty('--rot', `${rot}deg`);
        el.style.color = colors[Math.floor(Math.random() * colors.length)];
        el.style.fontSize = `${Math.random() * 1.5 + 1.2}rem`;

        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1800);
      }, i * 35);
    }
  }

  // ==========================================================
  // 3D CARD TILT WITH PARALLAX DEPTH
  // ==========================================================
  const tiltCards = document.querySelectorAll('.tilt-3d-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });

  // ==========================================================
  // THREE.JS 3D CRYSTAL HEART ENGINE
  // ==========================================================
  function init3DCrystalHeart(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined') return null;

    const width = container.clientWidth || 160;
    const height = container.clientHeight || 140;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 1.5);
    heartShape.bezierCurveTo(0, 1.5, -0.5, 3.5, -2.5, 3.5);
    heartShape.bezierCurveTo(-4.5, 3.5, -4.5, 1.0, -4.5, 1.0);
    heartShape.bezierCurveTo(-4.5, -1.0, -3.0, -3.0, 0, -5.0);
    heartShape.bezierCurveTo(3.0, -3.0, 4.5, -1.0, 4.5, 1.0);
    heartShape.bezierCurveTo(4.5, 1.0, 4.5, 3.5, 2.5, 3.5);
    heartShape.bezierCurveTo(0.5, 3.5, 0, 1.5, 0, 1.5);

    const extrudeSettings = {
      depth: 1.8,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.6,
      bevelThickness: 0.6
    };

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    geometry.center();

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xFF4D6D,
      emissive: 0x5C1924,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.75,
      ior: 1.45,
      reflectivity: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    const heartMesh = new THREE.Mesh(geometry, material);
    scene.add(heartMesh);

    const pointLight1 = new THREE.PointLight(0xFFEAA7, 1.8, 50);
    pointLight1.position.set(10, 10, 15);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xFF758F, 1.5, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.9);
    scene.add(ambientLight);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => isDragging = false);

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };
      heartMesh.rotation.y += deltaMove.x * 0.015;
      heartMesh.rotation.x += deltaMove.y * 0.015;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x,
        y: e.touches[0].clientY - previousMousePosition.y
      };
      heartMesh.rotation.y += deltaMove.x * 0.02;
      heartMesh.rotation.x += deltaMove.y * 0.02;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    let clock = new THREE.Clock();
    function render3D() {
      requestAnimationFrame(render3D);
      const elapsed = clock.getElapsedTime();
      if (!isDragging) {
        heartMesh.rotation.y += 0.012;
        heartMesh.position.y = Math.sin(elapsed * 1.6) * 0.4;
      }
      renderer.render(scene, camera);
    }
    render3D();

    return { scene, heartMesh, renderer };
  }

  init3DCrystalHeart('hero3DContainer');
  init3DCrystalHeart('finale3DContainer');

  // ==========================================================
  // TYPEWRITER EFFECT HELPER
  // ==========================================================
  function runTypewriter(element, text, speed = 35, callback) {
    if (!element) return;
    element.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, speed);
  }

  // ==========================================================
  // SCREEN LOGIC HANDLERS (12 Screens)
  // ==========================================================

  // --- SCREEN 01: THE DAY ---
  const dateShuffleDisplay = document.getElementById('dateShuffleDisplay');
  const stopClockBtn = document.getElementById('stopClockBtn');
  const screen01Reveal = document.getElementById('screen01Reveal');
  const screen01NextBtn = document.getElementById('screen01NextBtn');
  let dateShuffleTimer = null;
  let hasStoppedClock = false;

  const datesList = [
    '14 JANUARY 2024', '03 MARCH 2024', '19 JUNE 2024',
    '28 AUGUST 2024', '11 NOVEMBER 2024', '04 FEBRUARY 2025',
    '18 MAY 2025', '12 JULY 2025', '09 AUGUST 2025',
    '17 SEPTEMBER 2025', '20 SEPTEMBER 2025', '21 SEPTEMBER 2025'
  ];

  function startScreen01DateShuffle() {
    let index = 0;
    let speed = 70;
    dateShuffleTimer = setInterval(() => {
      if (hasStoppedClock) return;
      dateShuffleDisplay.textContent = datesList[index % datesList.length];
      index++;
    }, speed);
  }
  startScreen01DateShuffle();

  if (stopClockBtn) {
    stopClockBtn.addEventListener('click', () => {
      if (hasStoppedClock) return;
      hasStoppedClock = true;
      clearInterval(dateShuffleTimer);
      
      dateShuffleDisplay.textContent = '21 SEPTEMBER 2025';
      dateShuffleDisplay.style.color = '#C9184A';
      dateShuffleDisplay.style.transform = 'scale(1.05)';
      
      triggerHaptic([80, 100, 80]);
      window.capsuleAudio.playFreezeTone();
      stopClockBtn.style.opacity = '0.5';
      stopClockBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        screen01Reveal.classList.remove('hidden');
      }, 900);
    });
  }

  if (screen01NextBtn) {
    screen01NextBtn.addEventListener('click', () => {
      goToScreen(2);
    });
  }

  // --- SCREEN 02: THE JOURNEY (With Typewriter Ink Animation) ---
  const thought01 = document.getElementById('thought01');
  const thought02 = document.getElementById('thought02');
  const thought03 = document.getElementById('thought03');
  const screen02NextBtn = document.getElementById('screen02NextBtn');

  function initScreen02() {
    setTimeout(() => {
      if (thought01) {
        thought01.classList.add('visible');
        const target = thought01.querySelector('.typewriter-target');
        if (target) runTypewriter(target, target.getAttribute('data-text') || target.textContent, 40);
      }
    }, 600);

    setTimeout(() => {
      if (thought02) {
        thought02.classList.add('visible');
        const target = thought02.querySelector('.typewriter-target');
        if (target) runTypewriter(target, target.getAttribute('data-text') || target.textContent, 30);
      }
    }, 3200);

    setTimeout(() => {
      if (thought03) {
        thought03.classList.add('visible');
        const target = thought03.querySelector('.typewriter-target');
        if (target) runTypewriter(target, target.getAttribute('data-text') || target.textContent, 35, () => {
          if (screen02NextBtn) screen02NextBtn.classList.remove('hidden');
        });
      }
    }, 6400);
  }

  if (screen02NextBtn) {
    screen02NextBtn.addEventListener('click', () => {
      goToScreen(3);
    });
  }

  // --- SCREEN 03: LAKE CITY MALL ---
  const chatInteractionBox = document.getElementById('chatInteractionBox');
  const sendChatBtn = document.getElementById('sendChatBtn');
  const outgoingBubble = document.getElementById('outgoingBubble');
  const chatInputBar = document.getElementById('chatInputBar');
  const screen03NextBtn = document.getElementById('screen03NextBtn');



  function initScreen03() {
    setTimeout(() => {
      if (chatInteractionBox) chatInteractionBox.classList.remove('hidden');
    }, 2000);
  }

  if (sendChatBtn) {
    sendChatBtn.addEventListener('click', () => {
      if (outgoingBubble) outgoingBubble.classList.remove('hidden');
      if (chatInputBar) chatInputBar.style.opacity = '0.4';
      sendChatBtn.style.pointerEvents = 'none';
      triggerHaptic([40, 60, 40]);
      window.capsuleAudio.playSecretChime();

      setTimeout(() => {
        if (screen03NextBtn) screen03NextBtn.classList.remove('hidden');
      }, 1200);
    });
  }

  if (screen03NextBtn) {
    screen03NextBtn.addEventListener('click', () => {
      goToScreen(4);
    });
  }

  // --- SCREEN 04: THE FIRST LOOK (11:47:03) ---
  const revealHair = document.getElementById('revealHair');
  const revealForehead = document.getElementById('revealForehead');
  const revealBindi = document.getElementById('revealBindi');
  const revealEyes = document.getElementById('revealEyes');
  const frozenSecondsTimer = document.getElementById('frozenSecondsTimer');
  const firstLookProceedPrompt = document.getElementById('firstLookProceedPrompt');
  const screen04NextBtn = document.getElementById('screen04NextBtn');

  function initScreen04() {
    [revealHair, revealForehead, revealBindi, revealEyes].forEach(el => el && el.classList.remove('revealed'));
    if (frozenSecondsTimer) frozenSecondsTimer.textContent = '11:47:00';

    setTimeout(() => revealHair && revealHair.classList.add('revealed'), 1000);
    setTimeout(() => revealForehead && revealForehead.classList.add('revealed'), 3200);
    setTimeout(() => revealBindi && revealBindi.classList.add('revealed'), 5400);
    setTimeout(() => {
      if (revealEyes) revealEyes.classList.add('revealed');
      setTimeout(() => { if (frozenSecondsTimer) frozenSecondsTimer.textContent = '11:47:01'; }, 1000);
      setTimeout(() => { if (frozenSecondsTimer) frozenSecondsTimer.textContent = '11:47:02'; }, 2000);
      setTimeout(() => { 
        if (frozenSecondsTimer) {
          frozenSecondsTimer.textContent = '11:47:03';
          frozenSecondsTimer.style.color = '#C9184A';
          triggerHaptic([100, 100, 150]);
          window.capsuleAudio.playFreezeTone();
        }
        setTimeout(() => {
          if (firstLookProceedPrompt) firstLookProceedPrompt.classList.remove('hidden');
        }, 3500);
      }, 3000);
    }, 7600);
  }

  if (screen04NextBtn) {
    screen04NextBtn.addEventListener('click', () => {
      goToScreen(5);
    });
  }

  // --- SCREEN 05: THE MOVIE (Baaghi 4) ---
  const cineThoughts = document.querySelectorAll('.cine-thought');
  const cineClimax = document.querySelector('.cine-climax');
  const screen05NextBtn = document.getElementById('screen05NextBtn');

  function initScreen05() {
    cineThoughts.forEach((t, index) => {
      setTimeout(() => {
        t.classList.add('revealed');
      }, (index + 1) * 900);
    });

    setTimeout(() => {
      if (cineClimax) cineClimax.classList.add('revealed');
      if (screen05NextBtn) screen05NextBtn.classList.remove('hidden');
    }, (cineThoughts.length + 1) * 950);
  }


  if (screen05NextBtn) {
    screen05NextBtn.addEventListener('click', () => {
      goToScreen(6);
    });
  }

  // --- SCREEN 06: THE MOMENT I WISH WAS DIFFERENT ---
  const screen06NextBtn = document.getElementById('screen06NextBtn');
  const interactiveFlame = document.getElementById('interactiveFlame');
  const candleGlow = document.getElementById('candleGlow');
  const flameWhisperCard = document.getElementById('flameWhisperCard');

  if (interactiveFlame && flameWhisperCard) {
    interactiveFlame.addEventListener('click', () => {
      flameWhisperCard.classList.remove('hidden');
      if (candleGlow) {
        candleGlow.style.filter = 'drop-shadow(0 0 25px rgba(255, 77, 109, 0.9))';
        candleGlow.style.transform = 'scale(1.25)';
      }
      triggerHaptic([40, 70]);
      window.capsuleAudio.playFreezeTone();
      createHeartBurst(window.innerWidth / 2, window.innerHeight * 0.35);
    });
  }

  if (screen06NextBtn) {
    screen06NextBtn.addEventListener('click', () => {
      goToScreen(7);
    });
  }

  // --- SCREEN 07: THE LITTLE FIGHT & KINTSUGI HEART ---
  const kintsugiHeartBox = document.getElementById('kintsugiHeartBox');
  const kintsugiCrack = document.getElementById('kintsugiCrack');
  const kintsugiHint = document.getElementById('kintsugiHint');
  const screen07NextBtn = document.getElementById('screen07NextBtn');
  let isMended = false;

  function repairKintsugi() {
    if (isMended) return;
    isMended = true;
    if (kintsugiCrack) kintsugiCrack.classList.add('mended');
    if (kintsugiHint) {
      kintsugiHint.textContent = 'Mended with gold & love';
      kintsugiHint.style.color = '#C9184A';
    }
    triggerHaptic([60, 90, 60]);
    window.capsuleAudio.playKintsugiChime();
    setTimeout(() => {
      if (screen07NextBtn) screen07NextBtn.classList.remove('hidden');
    }, 1500);
  }

  if (kintsugiHeartBox) {
    kintsugiHeartBox.addEventListener('click', repairKintsugi);
  }

  if (screen07NextBtn) {
    screen07NextBtn.addEventListener('click', () => {
      goToScreen(8);
    });
  }

  // --- SCREEN 08: THE REWIND ---
  const rewindClock = document.getElementById('rewindClock');
  const screen08NextBtn = document.getElementById('screen08NextBtn');

  function initScreen08() {
    let year = 2026;
    const interval = setInterval(() => {
      if (rewindClock) {
        rewindClock.textContent = `21.09.${year}`;
      }
      if (year <= 2025) {
        clearInterval(interval);
        setTimeout(() => {
          if (screen08NextBtn) screen08NextBtn.classList.remove('hidden');
        }, 1200);
      }
      year--;
    }, 450);
  }

  if (screen08NextBtn) {
    screen08NextBtn.addEventListener('click', () => {
      goToScreen(9);
    });
  }

  // --- SCREEN 09: THE LETTER (Breakable Wax Seal & Stationary Letter) ---
  const openLetterBtn = document.getElementById('openLetterBtn');
  const closeLetterBtn = document.getElementById('closeLetterBtn');
  const letterBackdrop = document.getElementById('letterBackdrop');
  const parchmentSheet = document.getElementById('parchmentSheet');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const sealCrackOverlay = document.getElementById('sealCrackOverlay');
  const envelopeBody = document.getElementById('envelopeBody');
  const screen09NextBtn = document.getElementById('screen09NextBtn');
  const letterContinueBtn = document.getElementById('letterContinueBtn');

  function openTheLetter() {
    if (envelopeBody) envelopeBody.classList.add('opened');
    if (parchmentSheet) parchmentSheet.classList.add('opened');
    if (letterBackdrop) letterBackdrop.classList.remove('hidden');
    if (screen09NextBtn) screen09NextBtn.classList.remove('hidden');
    triggerHaptic([60, 80]);
  }

  function closeTheLetter() {
    if (parchmentSheet) parchmentSheet.classList.remove('opened');
    if (letterBackdrop) letterBackdrop.classList.add('hidden');
  }

  function crackAndOpenEnvelope() {
    if (parchmentSheet && parchmentSheet.classList.contains('opened')) {
      return;
    }
    if (waxSealBtn) waxSealBtn.classList.add('cracking');
    if (sealCrackOverlay) sealCrackOverlay.classList.remove('hidden');

    triggerHaptic([100, 50, 150]);
    window.capsuleAudio.playSealCrackSound();

    setTimeout(() => {
      openTheLetter();
    }, 350);
  }

  if (waxSealBtn) waxSealBtn.addEventListener('click', crackAndOpenEnvelope);
  if (openLetterBtn) openLetterBtn.addEventListener('click', crackAndOpenEnvelope);
  if (closeLetterBtn) closeLetterBtn.addEventListener('click', closeTheLetter);
  if (letterBackdrop) letterBackdrop.addEventListener('click', closeTheLetter);
  if (letterContinueBtn) {
    letterContinueBtn.addEventListener('click', () => {
      closeTheLetter();
      goToScreen(10);
    });
  }

  // Feature 4: "Open When..." Mini Envelopes Logic (Viewport Modals - No Text Collision)
  const openWhenButtons = document.querySelectorAll('[data-open-modal]');
  openWhenButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modalId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.remove('hidden');
        triggerHaptic([60, 80]);
        window.capsuleAudio.playFreezeTone();
      }
    });
  });

  const miniModalCloseBtns = document.querySelectorAll('[data-close]');
  miniModalCloseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modalId = btn.getAttribute('data-close');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('hidden');
      }
    });
  });

  // Feature 3: Pressed Keepsake Tulip in Letter
  const pressedTulipCard = document.getElementById('pressedTulipCard');
  const pressedTulipWhisper = document.getElementById('pressedTulipWhisper');
  if (pressedTulipCard && pressedTulipWhisper) {
    pressedTulipCard.addEventListener('click', (e) => {
      e.stopPropagation();
      pressedTulipWhisper.classList.toggle('hidden');
      triggerHaptic([60, 90]);
      window.capsuleAudio.playSecretChime();
      const rect = pressedTulipCard.getBoundingClientRect();
      window.spawnTulipSparks(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  // Feature 1: Devi Ji's Reply Note Logic
  const sealReplyBtn = document.getElementById('sealReplyBtn');
  const whatsappReplyBtn = document.getElementById('whatsappReplyBtn');
  const deviReplyText = document.getElementById('deviReplyText');
  const replySavedStatus = document.getElementById('replySavedStatus');

  // Load any previously saved note
  try {
    const savedReply = localStorage.getItem('deviJiReply');
    if (savedReply && deviReplyText) {
      deviReplyText.value = savedReply;
      if (whatsappReplyBtn) whatsappReplyBtn.classList.remove('hidden');
    }
  } catch (e) {}

  if (sealReplyBtn && deviReplyText) {
    sealReplyBtn.addEventListener('click', () => {
      const text = deviReplyText.value.trim();
      if (!text) {
        deviReplyText.focus();
        return;
      }

      try {
        localStorage.setItem('deviJiReply', text);
      } catch (e) {}

      if (replySavedStatus) replySavedStatus.classList.remove('hidden');
      if (whatsappReplyBtn) whatsappReplyBtn.classList.remove('hidden');

      triggerHaptic([80, 60, 100]);
      window.capsuleAudio.playSecretChime();
      createHeartBurst(window.innerWidth / 2, window.innerHeight * 0.7);
    });
  }

  if (whatsappReplyBtn && deviReplyText) {
    whatsappReplyBtn.addEventListener('click', () => {
      const text = deviReplyText.value.trim();
      const message = `🌸 From Devi Ji:\n\n"${text}"\n\n— 21.09.2025 → 21.09.2026 Time Capsule ♥`;
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      triggerHaptic([50, 70]);
    });
  }

  if (screen09NextBtn) {
    screen09NextBtn.addEventListener('click', () => {
      goToScreen(10);
    });
  }

  // --- SCREEN 10: THE THINGS I HID (15 Easter Eggs) ---
  const secretCards = document.querySelectorAll('.secret-card');
  const screen10NextBtn = document.getElementById('screen10NextBtn');

  secretCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('revealed-card');
      triggerHaptic([30, 50]);
      window.capsuleAudio.playSecretChime();
    });
  });

  if (screen10NextBtn) {
    screen10NextBtn.addEventListener('click', () => {
      goToScreen(11);
    });
  }

  // --- SCREEN 11: ONE YEAR LATER (Real-Time Live Countdown to 21 September 2026) ---
  const letTimeRunBtn = document.getElementById('letTimeRunBtn');
  const timeRunningConfirmation = document.getElementById('timeRunningConfirmation');
  const cntDays = document.getElementById('cntDays');
  const cntHours = document.getElementById('cntHours');
  const cntMins = document.getElementById('cntMins');
  const cntSecs = document.getElementById('cntSecs');

  function updateLiveCountdown() {
    const targetDate = new Date(2026, 8, 21, 11, 47, 3); // 21 Sept 2026 11:47:03
    const now = new Date();
    let diff = targetDate - now;

    if (diff <= 0) {
      if (cntDays) cntDays.textContent = '365';
      if (cntHours) cntHours.textContent = '00';
      if (cntMins) cntMins.textContent = '00';
      if (cntSecs) cntSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (cntDays) cntDays.textContent = String(days).padStart(2, '0');
    if (cntHours) cntHours.textContent = String(hours).padStart(2, '0');
    if (cntMins) cntMins.textContent = String(minutes).padStart(2, '0');
    if (cntSecs) cntSecs.textContent = String(seconds).padStart(2, '0');
  }
  setInterval(updateLiveCountdown, 1000);
  updateLiveCountdown();

  // Feature 2: Release Sky Lantern Logic
  const releaseLanternBtn = document.getElementById('releaseLanternBtn');
  const skyLanternLayer = document.getElementById('skyLanternLayer');

  if (releaseLanternBtn && skyLanternLayer) {
    releaseLanternBtn.addEventListener('click', () => {
      // Spawn a floating sky lantern
      const lantern = document.createElement('div');
      lantern.className = 'flying-lantern';
      
      // Random horizontal position across screen
      const startX = Math.random() * (window.innerWidth - 80) + 40;
      const sway = (Math.random() - 0.5) * 160;
      
      lantern.style.left = `${startX}px`;
      lantern.style.setProperty('--sway', `${sway}px`);
      
      skyLanternLayer.appendChild(lantern);

      triggerHaptic([50, 70, 90]);
      window.capsuleAudio.playFreezeTone();
      createHeartBurst(startX, window.innerHeight * 0.7);

      // Remove element after animation completes
      setTimeout(() => {
        lantern.remove();
      }, 12500);
    });
  }

  // Feature 5: Build a Tulip Bouquet for Devi Ji Logic
  const pickTulipBtn = document.getElementById('pickTulipBtn');
  const tulipsCollectedRow = document.getElementById('tulipsCollectedRow');
  const bouquetCountStatus = document.getElementById('bouquetCountStatus');
  const bouquetCompletedCard = document.getElementById('bouquetCompletedCard');

  const tulipCollection = [
    { emoji: '🌷', desc: 'Blush Pink Tulip — Soft like your voice' },
    { emoji: '🌷', desc: 'Sunset Coral Tulip — Warm like your smile at 11:47' },
    { emoji: '🌷', desc: 'Cream White Tulip — Pure grace like my Devi Ji' },
    { emoji: '🌷', desc: 'Ruby Red Tulip — For surviving every silly fight with gold' },
    { emoji: '🌷', desc: 'Golden Velvet Tulip — For our Year Two and forever' }
  ];
  let tulipsPickedCount = 0;

  if (pickTulipBtn && tulipsCollectedRow) {
    pickTulipBtn.addEventListener('click', () => {
      if (tulipsPickedCount >= tulipCollection.length) {
        createHeartBurst(window.innerWidth / 2, window.innerHeight * 0.6);
        return;
      }

      const tulipData = tulipCollection[tulipsPickedCount];
      tulipsPickedCount++;

      const item = document.createElement('div');
      item.className = 'collected-tulip-item';
      item.innerHTML = `
        <span class="tulip-flower-icon">${tulipData.emoji}</span>
        <div class="tulip-stem"></div>
      `;
      tulipsCollectedRow.appendChild(item);

      if (bouquetCountStatus) {
        bouquetCountStatus.textContent = `${tulipsPickedCount} / 5: ${tulipData.desc}`;
      }

      triggerHaptic([50, 70]);
      window.capsuleAudio.playSecretChime();
      const rect = pickTulipBtn.getBoundingClientRect();
      window.spawnTulipSparks(rect.left + rect.width / 2, rect.top);

      if (tulipsPickedCount === tulipCollection.length) {
        if (bouquetCompletedCard) bouquetCompletedCard.classList.remove('hidden');
        if (pickTulipBtn) {
          pickTulipBtn.innerHTML = '<span>💐 BOUQUET COMPLETED &hearts;</span>';
          pickTulipBtn.style.opacity = '0.9';
        }
        createHeartBurst(window.innerWidth / 2, window.innerHeight * 0.5);
      }
    });
  }

  // Feature 2: "Constellation of Us" Star Map Logic
  const starPoints = document.querySelectorAll('.star-point');
  const constLine1 = document.getElementById('constLine1');
  const constLine2 = document.getElementById('constLine2');
  const constLine3 = document.getElementById('constLine3');
  const constHeartLine = document.getElementById('constHeartLine');
  const constellationStory = document.getElementById('constellationStory');

  const starStories = {
    '1': '“Star 1 (Sojat Road): The morning sun rose, and my thoughts were only of you.”',
    '2': '“Star 2 (Lake City Mall): 11:47:03... The second my world stopped at the railing.”',
    '3': '“Star 3 (Baaghi 4): The theater was dark, but your face was the only light I saw.”',
    '4': '“Star 4 (21 Sept 2026): Exactly 365 days later... every line leads back to our heart.”'
  };

  starPoints.forEach(star => {
    star.addEventListener('click', () => {
      const starNum = star.getAttribute('data-star');
      star.classList.add('connected');
      triggerHaptic([40, 60]);
      window.capsuleAudio.playSecretChime();

      if (starNum === '1') {
        if (constLine1) constLine1.classList.remove('hidden');
      } else if (starNum === '2') {
        if (constLine1) constLine1.classList.remove('hidden');
        if (constLine2) constLine2.classList.remove('hidden');
      } else if (starNum === '3') {
        if (constLine2) constLine2.classList.remove('hidden');
        if (constLine3) constLine3.classList.remove('hidden');
      } else if (starNum === '4') {
        if (constLine3) constLine3.classList.remove('hidden');
        if (constHeartLine) constHeartLine.classList.remove('hidden');
        createHeartBurst(window.innerWidth / 2, window.innerHeight * 0.5);
      }

      if (constellationStory && starStories[starNum]) {
        constellationStory.textContent = starStories[starNum];
      }
    });
  });

  if (letTimeRunBtn && timeRunningConfirmation) {
    letTimeRunBtn.addEventListener('click', () => {
      letTimeRunBtn.style.opacity = '0.5';
      letTimeRunBtn.style.pointerEvents = 'none';
      timeRunningConfirmation.classList.remove('hidden');
      triggerHaptic([70, 90]);
      window.capsuleAudio.playFreezeTone();

      setTimeout(() => {
        goToScreen(12);
      }, 2400);
    });
  }

  // --- SCREEN 12: THE HEART (The Grand Finale + Keepsake Export) ---
  const finalHeartCard = document.getElementById('finalHeartCard');
  const walkAgainBtn = document.getElementById('walkAgainBtn');
  const closeMemoryBtn = document.getElementById('closeMemoryBtn');
  const closedCurtainScreen = document.getElementById('closedCurtainScreen');
  const reopenCapsuleBtn = document.getElementById('reopenCapsuleBtn');
  const saveKeepsakeBtn = document.getElementById('saveKeepsakeBtn');

  if (finalHeartCard) {
    finalHeartCard.addEventListener('click', () => {
      finalHeartCard.classList.toggle('is-flipped');
      triggerHaptic([50, 70]);
      window.capsuleAudio.playSecretChime();
      if (finalHeartCard.classList.contains('is-flipped')) {
        triggerGrandCelebration();
      }
    });
  }

  if (saveKeepsakeBtn) {
    saveKeepsakeBtn.addEventListener('click', () => {
      triggerHaptic([60, 60]);
      window.print();
    });
  }

  if (walkAgainBtn) {
    walkAgainBtn.addEventListener('click', () => {
      goToScreen(1);
    });
  }

  if (closeMemoryBtn && closedCurtainScreen) {
    closeMemoryBtn.addEventListener('click', () => {
      closedCurtainScreen.classList.remove('hidden');
    });
  }

  // Feature 5: "A Promise to Devi Ji" Digital Ribbon Logic
  const ribbonKnot = document.getElementById('ribbonKnot');
  const ribbonWrap = document.getElementById('ribbonWrap');
  const vowsCard = document.getElementById('vowsCard');

  if (ribbonKnot && vowsCard) {
    ribbonKnot.addEventListener('click', () => {
      if (ribbonWrap) ribbonWrap.style.opacity = '0.3';
      vowsCard.classList.remove('hidden');
      triggerHaptic([80, 50, 100, 50, 120]);
      window.capsuleAudio.playSecretChime();
      triggerGrandCelebration();
    });
  }

  // ==========================================================
  // SECRET PASSCODE VAULT MODAL (114703)
  // ==========================================================
  const openSecretVaultBtn = document.getElementById('openSecretVaultBtn');
  const secretPasscodeModal = document.getElementById('secretPasscodeModal');
  const closePasscodeModal = document.getElementById('closePasscodeModal');
  const passcodeInput = document.getElementById('passcodeInput');
  const submitPasscodeBtn = document.getElementById('submitPasscodeBtn');
  const vaultSecretContent = document.getElementById('vaultSecretContent');

  // Feature 5: Why Devi Ji Modal Logic
  const whyDeviJiBtn = document.getElementById('whyDeviJiBtn');
  const whyDeviJiModal = document.getElementById('whyDeviJiModal');
  const closeWhyDeviModal = document.getElementById('closeWhyDeviModal');

  if (whyDeviJiBtn && whyDeviJiModal) {
    whyDeviJiBtn.addEventListener('click', () => {
      whyDeviJiModal.classList.remove('hidden');
      triggerHaptic([40, 60]);
      window.capsuleAudio.playFreezeTone();
    });
  }

  if (closeWhyDeviModal && whyDeviJiModal) {
    closeWhyDeviModal.addEventListener('click', () => {
      whyDeviJiModal.classList.add('hidden');
    });
  }

  // Feature 1: 7-Petal Blooming Tulip of Devi Ji
  const tulipPetals = document.querySelectorAll('.tulip-petal');
  const petalRevealedMessage = document.getElementById('petalRevealedMessage');
  const tulipReasons = {
    '1': '“01: Your calm, gentle presence that slows down the whole world.”',
    '2': '“02: The way your eyes speak volumes before words even come out.”',
    '3': '“03: How you can be completely quiet and still say everything.”',
    '4': '“04: Because like a rare blooming tulip, nothing else in this world compares to you.”',
    '5': '“05: The grace and forgiveness you carry after our stupid little fights.”',
    '6': '“06: The unhurried dignity with which you carry yourself everywhere.”',
    '7': '“07: Because to me, Devi Ji... you will forever be sacred.”'
  };

  tulipPetals.forEach(petal => {
    petal.addEventListener('click', () => {
      const petalNum = petal.getAttribute('data-petal');
      petal.classList.toggle('unfurled');
      triggerHaptic([50, 70]);
      window.capsuleAudio.playSecretChime();

      if (petalRevealedMessage && tulipReasons[petalNum]) {
        petalRevealedMessage.textContent = tulipReasons[petalNum];
      }
      const rect = petal.getBoundingClientRect();
      window.spawnTulipSparks(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });

  if (openSecretVaultBtn && secretPasscodeModal) {
    openSecretVaultBtn.addEventListener('click', () => {
      secretPasscodeModal.classList.remove('hidden');
      if (passcodeInput) passcodeInput.focus();
    });
  }

  if (closePasscodeModal && secretPasscodeModal) {
    closePasscodeModal.addEventListener('click', () => {
      secretPasscodeModal.classList.add('hidden');
    });
  }

  function handlePasscodeUnlock() {
    const val = (passcodeInput.value || '').trim();
    if (val === '114703' || val === '210925') {
      if (vaultSecretContent) vaultSecretContent.classList.remove('hidden');
      triggerHaptic([100, 50, 100, 50, 150]);
      window.capsuleAudio.playSecretChime();
      createHeartBurst(window.innerWidth / 2, window.innerHeight / 2);
    } else {
      passcodeInput.style.borderColor = '#E63946';
      setTimeout(() => {
        passcodeInput.style.borderColor = '#CBB279';
      }, 1000);
    }
  }

  if (submitPasscodeBtn) {
    submitPasscodeBtn.addEventListener('click', handlePasscodeUnlock);
  }

  if (passcodeInput) {
    passcodeInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') handlePasscodeUnlock();
    });
  }

  // Master Screen Router
  function initScreenLogic(screenNum) {
    switch(screenNum) {
      case 2: initScreen02(); break;
      case 3: initScreen03(); break;
      case 4: initScreen04(); break;
      case 5: initScreen05(); break;
      case 8: initScreen08(); break;
      default: break;
    }
  }

});
