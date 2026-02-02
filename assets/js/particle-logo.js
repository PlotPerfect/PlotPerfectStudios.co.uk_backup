import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const CONFIG = {
  imageUrl: "/assets/images/PlotPerfectLogoNew.png",
  particleStep: 3,          // lower = more particles (2–5 recommended)
  alphaThreshold: 40,       // ignore transparent pixels
  bgDiffThreshold: 70,      // ignore pixels similar to background (0-765)
  scale: 2.5,              // overall logo scale inside container
  zDepth: 0.0,

  // Mouse interaction
  influenceRadius: 0.22,    // in normalized logo space (0–1-ish)
  repelStrength: 0.055,
  swirlStrength: 0.015,
  returnStrength: 0.06,
  damping: 0.90,

  // Visual
  baseColor: 0xffffff,
  glowColor: 0xff6a00,
  pointSize: 0.015,         // relative-ish (tuned in code)
  maxParticles: 14000,      // safety cap
};

function prefersReducedMotion(){
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getContainerConfig(container){
  const imageUrl = container.dataset.imageUrl || CONFIG.imageUrl;
  const alt = container.dataset.alt || "Plot Perfect Studios Ltd logo";
  const bgDiffThreshold = Number(container.dataset.bgDiffThreshold || CONFIG.bgDiffThreshold);
  const particleStep = Number(container.dataset.particleStep || CONFIG.particleStep);
  const alphaThreshold = Number(container.dataset.alphaThreshold || CONFIG.alphaThreshold);
  return { imageUrl, alt };
}

async function loadImage(url){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function sampleParticlesFromImage(img, step, alphaThreshold, maxParticles, bgDiffThreshold){
  // draw onto offscreen canvas
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d", { willReadFrequently: true });

  // Keep enough resolution for detail but avoid huge counts
  const target = 420; // sampling canvas size
  const aspect = img.width / img.height;
  c.width = aspect >= 1 ? target : Math.round(target * aspect);
  c.height = aspect >= 1 ? Math.round(target / aspect) : target;

  ctx.clearRect(0,0,c.width,c.height);

  // contain fit inside canvas with padding
  const pad = 22;
  const drawW = c.width - pad * 2;
  const drawH = c.height - pad * 2;

  ctx.drawImage(img, pad, pad, drawW, drawH);

  const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);

  // Estimate background color from corners (helps when logos have opaque backgrounds)
  const corners = [
    0,
    (width - 1) * 4,
    (height - 1) * width * 4,
    ((height - 1) * width + (width - 1)) * 4,
  ];
  let bgR = 0, bgG = 0, bgB = 0, bgA = 0;
  for (const idx of corners){
    bgR += data[idx];
    bgG += data[idx + 1];
    bgB += data[idx + 2];
    bgA += data[idx + 3];
  }
  bgR /= corners.length;
  bgG /= corners.length;
  bgB /= corners.length;
  bgA /= corners.length;

  // If background is transparent, rely on alpha only.
  const hasOpaqueBackground = bgA > alphaThreshold;

  const positions = [];
  for (let y = 0; y < height; y += step){
    for (let x = 0; x < width; x += step){
      const i = (y * width + x) * 4;
      const a = data[i + 3];
      if (a > alphaThreshold){
        if (hasOpaqueBackground){
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
          // Skip pixels that look like the (opaque) background
          if (diff < bgDiffThreshold) continue;
        }
        // normalize to center (-0.5..0.5), flip Y for Three.js
        const nx = (x / width) - 0.5;
        const ny = 0.5 - (y / height);
        positions.push(nx, ny, 0);
        if (positions.length / 3 >= maxParticles) break;
      }
    }
    if (positions.length / 3 >= maxParticles) break;
  }

  // Auto-fit: normalise sampled points to remove excess whitespace around the logo.
  // This helps when the source (especially SVGs) has a large viewBox margin.
  if (positions.length >= 6){
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < positions.length; i += 3){
      const x = positions[i];
      const y = positions[i + 1];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    const w = Math.max(0.0001, maxX - minX);
    const h = Math.max(0.0001, maxY - minY);
    const maxDim = Math.max(w, h);
    const target = 0.95; // fill 95% of unit square
    const scale = target / maxDim;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    for (let i = 0; i < positions.length; i += 3){
      positions[i] = (positions[i] - cx) * scale;
      positions[i + 1] = (positions[i + 1] - cy) * scale;
    }
  }

  return new Float32Array(positions);
}

function createGlowSprite(){
  // small radial gradient sprite for soft glow points
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  g.addColorStop(0.0, "rgba(255,106,0,0.85)");
  g.addColorStop(0.35, "rgba(255,106,0,0.28)");
  g.addColorStop(1.0, "rgba(255,106,0,0.0)");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,size,size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

async function initContainer(container){
  if (!container) return;

  const { imageUrl, alt, bgDiffThreshold, particleStep, alphaThreshold } = getContainerConfig(container);

  // Reduced motion: just show the logo image (still looks premium)
  if (prefersReducedMotion()){
    container.innerHTML = `<img src="${imageUrl}" alt="${alt}" />`;
    return;
  }

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Scene + Camera (orthographic for clean 2D logo)
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 2;

  // Build particle positions from PNG
  let img;
  try{
    img = await loadImage(imageUrl);
  }catch{
    img = await loadImage(CONFIG.imageUrl);
  }
  const basePositions = sampleParticlesFromImage(
    img,
    particleStep,
    alphaThreshold,
    CONFIG.maxParticles
    ,
    bgDiffThreshold
  );

  // Geometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(basePositions.slice(), 3));
  geometry.setAttribute("base", new THREE.BufferAttribute(basePositions, 3)); // store original
  const count = basePositions.length / 3;

  // Velocity buffer (for interaction)
  const velocity = new Float32Array(basePositions.length);

  // Materials (base + glow layer)
  const glowTex = createGlowSprite();

  const pointsMaterial = new THREE.PointsMaterial({
    color: CONFIG.baseColor,
    size: 0.006,              // will be scaled on resize
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const glowMaterial = new THREE.PointsMaterial({
    map: glowTex,
    color: CONFIG.glowColor,
    size: 0.014,              // will be scaled on resize
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, pointsMaterial);
  const glow = new THREE.Points(geometry, glowMaterial);

  points.scale.setScalar(CONFIG.scale);
  glow.scale.setScalar(CONFIG.scale);

  scene.add(glow);
  scene.add(points);

  // Mouse tracking in normalized logo space
  const pointer = { x: 999, y: 999, active: false };
  const rectForPointer = () => container.getBoundingClientRect();

  function setPointerFromEvent(e){
    const r = rectForPointer();
    const px = (e.clientX - r.left) / r.width;  // 0..1
    const py = (e.clientY - r.top) / r.height;  // 0..1
    // convert to scene space (-1..1) then scale (~logo space)
    pointer.x = (px * 2 - 1) / CONFIG.scale;
    pointer.y = (-(py * 2 - 1)) / CONFIG.scale;
    pointer.active = true;
  }

  function clearPointer(){
    pointer.active = false;
    pointer.x = 999;
    pointer.y = 999;
  }

  // Mouse + touch
  container.addEventListener("mousemove", setPointerFromEvent, { passive: true });
  container.addEventListener("mouseleave", clearPointer, { passive: true });
  container.addEventListener("touchstart", (e) => setPointerFromEvent(e.touches[0]), { passive: true });
  container.addEventListener("touchmove", (e) => setPointerFromEvent(e.touches[0]), { passive: true });
  container.addEventListener("touchend", clearPointer, { passive: true });

  // Resize handling
  function resize(){
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);

    // scale point sizes with container size (keeps it looking consistent)
    const s = Math.min(w, h);
    pointsMaterial.size = Math.max(0.004, (s / 520) * 0.010);
    glowMaterial.size   = Math.max(0.008, (s / 520) * 0.018);
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  // Animation loop
  const posAttr = geometry.getAttribute("position");
  const baseAttr = geometry.getAttribute("base");

  function animate(){
    requestAnimationFrame(animate);

    const p = posAttr.array;
    const b = baseAttr.array;

    for (let i = 0; i < p.length; i += 3){
      const x = p[i];
      const y = p[i + 1];

      // spring back to base
      const bx = b[i];
      const by = b[i + 1];

      let vx = velocity[i];
      let vy = velocity[i + 1];

      // Return force (reform)
      vx += (bx - x) * CONFIG.returnStrength;
      vy += (by - y) * CONFIG.returnStrength;

      // Mouse repel + swirl
      if (pointer.active){
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const dist2 = dx*dx + dy*dy;
        const r = CONFIG.influenceRadius;

        if (dist2 < r*r){
          const dist = Math.max(0.0001, Math.sqrt(dist2));
          const falloff = 1 - (dist / r);

          // Repel
          vx += (dx / dist) * (CONFIG.repelStrength * falloff);

          // Swirl (perpendicular force)
          vx += (-dy / dist) * (CONFIG.swirlStrength * falloff);
          vy += ( dx / dist) * (CONFIG.swirlStrength * falloff);
        }
      }

      // Damping
      vx *= CONFIG.damping;
      vy *= CONFIG.damping;

      // Apply
      p[i]     = x + vx;
      p[i + 1] = y + vy;
      p[i + 2] = CONFIG.zDepth;

      velocity[i] = vx;
      velocity[i + 1] = vy;
    }

    posAttr.needsUpdate = true;
    renderer.render(scene, camera);
  }

  animate();
}

async function init(){
  const containers = document.querySelectorAll(".particle-logo");
  if (!containers.length) return;

  for (const container of containers){
    try{
      await initContainer(container);
    }catch (err){
      const { imageUrl, alt } = getContainerConfig(container);
      // Fallback to image if WebGL fails or logo can’t be sampled
      container.innerHTML = `<img src="${imageUrl}" alt="${alt}" />`;
      console.error("Particle logo init failed:", err);
    }
  }
}

init();
