(() => {
  'use strict';
  // A small code-inspired control, with the outline showing page progress.
  const toTop = document.createElement('button');
  toTop.className = 'code-to-top';
  toTop.type = 'button';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.disabled = true;
  toTop.innerHTML = `<svg class="top-progress" viewBox="0 0 60 60" aria-hidden="true"><rect class="top-track" x="2" y="2" width="56" height="56" rx="19"/><rect class="top-meter" x="2" y="2" width="56" height="56" rx="19" pathLength="100"/></svg><svg class="top-code" viewBox="0 0 32 32" aria-hidden="true"><path class="top-brackets" d="m10 10-6 6 6 6m12-12 6 6-6 6"/><path class="top-arrow" d="M16 24V8m-5 5 5-5 5 5"/></svg><span class="top-label" aria-hidden="true">Back to top <span>↑</span></span>`;
  document.body.append(toTop);
  let topFrame = false;
  function updateTop() {
    const maximum = document.documentElement.scrollHeight - innerHeight;
    const progress = maximum > 0 ? Math.min(100, Math.max(0, scrollY / maximum * 100)) : 0;
    const visible = scrollY > 320;
    toTop.style.setProperty('--scroll-progress', progress);
    toTop.classList.toggle('is-visible', visible);
    toTop.disabled = !visible;
    topFrame = false;
  }
  function queueTopUpdate() {
    if (!topFrame) { topFrame = true; requestAnimationFrame(updateTop); }
  }
  window.addEventListener('scroll', queueTopUpdate, {passive:true});
  window.addEventListener('resize', queueTopUpdate);
  toTop.addEventListener('click', () => {
    document.querySelector('.wordmark')?.focus({preventScroll:true});
    window.scrollTo({top:0, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
  updateTop();
  document.querySelectorAll('.case-showcase').forEach(showcase => {
    const buttons=[...showcase.querySelectorAll('[data-case-device]')];
    buttons.forEach(button=>button.addEventListener('click',()=>{
      const mobile=button.dataset.caseDevice==='mobile';
      showcase.classList.toggle('is-mobile',mobile);
      buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      showcase.querySelector('.case-preview-status').textContent=mobile?'Mobile view selected':'Desktop view selected';
    }));
    if(matchMedia('(hover:hover) and (prefers-reduced-motion: no-preference)').matches){
      const stage=showcase.querySelector('.case-stage');
      stage.addEventListener('pointermove',event=>{
        const bounds=stage.getBoundingClientRect();
        stage.style.setProperty('--device-tilt',((event.clientX-bounds.left)/bounds.width-.5)*5+'deg');
      });
      stage.addEventListener('pointerleave',()=>stage.style.setProperty('--device-tilt','0deg'));
    }
  });
  document.querySelector('[data-copy-email]')?.addEventListener('click', async event => {
    const button = event.currentTarget;
    const status = document.querySelector('.qr-copy-status');
    try {
      await navigator.clipboard.writeText(button.dataset.copyEmail);
      status.textContent = 'Email address copied. Your next chapter starts with hello.';
    } catch {
      status.textContent = 'Select the email address above to open your email app, or copy it manually.';
    }
  });
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const closeMenu = () => { nav?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); };
  menu?.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav?.classList.contains('open')) { closeMenu(); menu.focus(); } });
  const showcase = document.querySelector('.showcase');
  if (showcase) {
    const projects = [
      ['novara', 'Novara Property Care', 'https://www.novarapropertycare.co.uk/'],
      ['cdm', 'CDM Capital', 'https://cdmcapital.co.uk/'],
      ['clearpath', 'Clear Path Waste', 'https://clearpathwaste.co.uk/']
    ];
    let active = 0, scheduled = false, manual = false;
    const buttons = [...document.querySelectorAll('[data-project]')];
    function show(index) {
      if (active === index) return;
      active = index;
      const [slug, name] = projects[index];
      const desktop = document.getElementById('desktop-preview'), mobile = document.getElementById('mobile-preview');
      desktop.src = `/assets/images/projects/${slug}-desktop.webp`;
      desktop.alt = `${name} website desktop preview`;
      mobile.src = `/assets/images/projects/${slug}-mobile.webp`;
      mobile.alt = `${name} website mobile preview`;
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      document.getElementById('preview-status').textContent = `${name} · Website design & development`;
    }
    buttons.forEach((button, index) => button.addEventListener('click', () => {manual = true; show(index);}));
    document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
      showcase.classList.toggle('mobile-view', button.dataset.mode === 'mobile');
      document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    }));
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) window.addEventListener('scroll', () => {
      if (scheduled || manual) return;
      scheduled = true;
      requestAnimationFrame(() => {
        const hero = document.querySelector('.hero');
        const progress = Math.max(0, Math.min(.99, window.scrollY / (hero.offsetHeight * .85)));
        if (window.scrollY < hero.offsetHeight) show(Math.floor(progress * projects.length));
        scheduled = false;
      });
    }, {passive:true});
  }
  const filters = [...document.querySelectorAll('[data-filter]')];
  const search = document.getElementById('article-search');
  let category = new URLSearchParams(location.search).get('category') || 'all';
  const items = [...document.querySelectorAll('[data-category]')];
  if (!filters.some(b => b.dataset.filter === category)) category = 'all';
  function filter() {
    let count = 0;
    const term = (search?.value || '').trim().toLowerCase();
    items.forEach(item => {const visible = (category === 'all' || item.dataset.category === category) && item.textContent.toLowerCase().includes(term); item.hidden = !visible; if (visible) count++;});
    filters.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === category)));
    const status = document.getElementById('filter-count');
    if(status) status.textContent = `${count} ${document.body.dataset.listType || 'articles'}${term ? ` matching “${search.value.trim()}”` : ''}`;
    const empty = document.getElementById('filter-empty');
    if(empty) empty.hidden = count !== 0;
  }
  filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; filter(); const url = new URL(location.href); category === 'all' ? url.searchParams.delete('category') : url.searchParams.set('category', category); history.replaceState(null, '', url); }));
  search?.addEventListener('input', filter);
  if (items.length) filter();
})();
