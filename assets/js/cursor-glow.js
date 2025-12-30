(function(){
  // Disable on touch devices
  if (!window.matchMedia("(hover: hover)").matches) return;

  const glow = document.querySelector(".cursor-glow");
  if (!glow) return;

  let rafId = null;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  function animate(){
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;

    glow.style.transform = `translate(${currentX}px, ${currentY}px)`;
    rafId = requestAnimationFrame(animate);
  }

  document.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    glow.style.opacity = "1";
    if (!rafId) animate();
  });

  document.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });
})();
