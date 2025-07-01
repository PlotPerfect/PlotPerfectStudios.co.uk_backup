// mobile.js - Mobile-only carousel for .services-cards
// Adds swipe and button navigation for service cards on mobile

document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth > 800) return; // Only run on mobile

  const cardsContainer = document.querySelector('.services-cards');
  if (!cardsContainer) return;
  const cards = Array.from(cardsContainer.children);
  if (cards.length <= 1) return;

  let current = 0;

  // Navigation buttons
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '<';
  prevBtn.className = 'carousel-btn carousel-btn-prev';
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '>';
  nextBtn.className = 'carousel-btn carousel-btn-next';
  cardsContainer.parentElement.insertBefore(prevBtn, cardsContainer);
  cardsContainer.parentElement.appendChild(nextBtn);

  // Carousel indicators
  let indicators = document.querySelector('.carousel-indicators');
  if (!indicators) {
    indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    cardsContainer.parentElement.appendChild(indicators);
  }
  indicators.innerHTML = '';
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'carousel-indicator' + (i === 0 ? ' active' : '');
    indicators.appendChild(dot);
  });
  const dots = Array.from(indicators.children);

  function updateStack(newIndex) {
    if (newIndex < 0) newIndex = 0;
    if (newIndex > cards.length - 1) newIndex = cards.length - 1;
    cards.forEach((card, i) => {
      card.classList.remove('active', 'next', 'prev');
      if (i === newIndex) card.classList.add('active');
      else if (i === newIndex + 1) card.classList.add('next');
      else if (i === newIndex - 1) card.classList.add('prev');
    });
    current = newIndex;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', function () {
    updateStack(current - 1);
  });
  nextBtn.addEventListener('click', function () {
    updateStack(current + 1);
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => updateStack(i));
  });

  // Touch/swipe support
  let startX = 0;
  let isDragging = false;
  cardsContainer.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
      isDragging = true;
    }
  });
  cardsContainer.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    // Optionally, add drag effect here
  });
  cardsContainer.addEventListener('touchend', function (e) {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    if (dx > 50 && current > 0) {
      updateStack(current - 1);
    } else if (dx < -50 && current < cards.length - 1) {
      updateStack(current + 1);
    }
    isDragging = false;
  });

  // Initial state
  updateStack(0);

});
