(() => {
  const config = window.AIZEN_CONFIG || {};
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const toast = $('.toast');
  let toastTimer;
  const notify = (message) => {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
  };
  $$('[data-profile-name]').forEach(el => el.textContent = config.discordName || config.name || 'Aizen');
  $$('[data-discord-id]').forEach(el => el.textContent = config.discordId || '');
  $$('[data-discord-profile]').forEach(el => {
    const url = config.discordProfileUrl || (config.discordId ? `https://discord.com/users/${config.discordId}` : '');
    if (url) el.href = url; else { el.removeAttribute('href'); el.addEventListener('click', e => { e.preventDefault(); notify('Add your Discord profile URL in config.js'); }); }
  });
  $('#year').textContent = new Date().getFullYear();
  const copyValues = {
    discordId: () => config.discordId || '',
    discordName: () => config.discordName || config.name || 'Aizen'
  };
  $$('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const key = button.dataset.copy;
    const value = copyValues[key]?.();
    if (!value) { notify('Add this detail in config.js first'); return; }
    try {
      await navigator.clipboard.writeText(value);
      notify(key === 'discordId' ? 'Discord ID copied' : 'Discord name copied');
    } catch {
      const field = document.createElement('textarea'); field.value = value; field.style.position = 'fixed'; field.style.opacity = '0'; document.body.appendChild(field); field.select();
      const ok = document.execCommand('copy'); field.remove(); notify(ok ? 'Copied to clipboard' : `Copy this: ${value}`);
    }
  }));
  $$('.filter-button').forEach(button => button.addEventListener('click', () => {
    $$('.filter-button').forEach(b => b.classList.toggle('active', b === button));
    const filter = button.dataset.filter;
    $$('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
    });
  }));
  $$('[data-project-link]').forEach(link => {
    const key = link.dataset.projectLink;
    const projectUrl = config.projects?.[key];
    if (projectUrl && /^https?:\/\//i.test(projectUrl)) {
      link.href = projectUrl; link.target = '_blank'; link.rel = 'noreferrer'; link.textContent = 'Open project';
      const arrow = document.createElement('span'); arrow.textContent = ' ↗'; link.appendChild(arrow);
    } else {
      link.href = '#contact';
      link.addEventListener('click', () => { const heading = $('#contact .contact-content .eyebrow'); if (heading) heading.textContent = `ASK ABOUT: ${key.toUpperCase()}`; });
    }
  });
  const menuButton = $('.menu-toggle');
  const nav = $('.desktop-nav');
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('nav-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  $$('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('nav-open'); menuButton.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open');
  }));

  // Lightweight sakura atmosphere: canvas-based, decorative, and disabled for reduced motion.
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const canvas = document.createElement('canvas');
    canvas.className = 'sakura-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d', { alpha: true });
    if (ctx) {
      let width = 0, height = 0, raf = 0, lastFrame = 0;
      const petals = [];
      const colors = ['rgba(214,55,69,.46)', 'rgba(232,170,183,.42)', 'rgba(255,220,226,.24)'];
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth; height = window.innerHeight;
        canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
        canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.min(24, Math.max(9, Math.floor(width / 48)));
        while (petals.length < count) petals.push(makePetal(true));
        while (petals.length > count) petals.pop();
      };
      function makePetal(randomY = false) {
        return { x: Math.random() * (width || window.innerWidth), y: randomY ? Math.random() * (height || window.innerHeight) : -15,
          size: 2 + Math.random() * 4, speed: .25 + Math.random() * .55, drift: .25 + Math.random() * .55,
          phase: Math.random() * Math.PI * 2, spin: (Math.random() - .5) * .035, color: colors[Math.floor(Math.random() * colors.length)] };
      }
      function draw(now) {
        raf = requestAnimationFrame(draw);
        if (now - lastFrame < 32) return;
        lastFrame = now;
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < petals.length; i++) {
          const p = petals[i]; p.y += p.speed; p.x += Math.sin(now * .00035 + p.phase) * p.drift; p.phase += p.spin;
          if (p.y > height + 12 || p.x < -20 || p.x > width + 20) petals[i] = makePetal(false);
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.phase);
          ctx.fillStyle = p.color; ctx.beginPath(); ctx.ellipse(0, 0, p.size * .72, p.size * 1.35, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
      }
      resize();
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      window.addEventListener('resize', resize, { passive: true });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else if (!reduced.matches) { lastFrame = 0; raf = requestAnimationFrame(draw); }
      });
      raf = requestAnimationFrame(draw);
    }
  }

  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add('is-visible'));

  // Touch / pointer interaction: the crimson aura follows a finger or cursor,
  // and the profile card tilts gently with movement.
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let lastRipple = 0;
    const card = $('.identity-card');
    const moveAura = (clientX, clientY) => {
      const x = Math.max(0, Math.min(window.innerWidth, clientX));
      const y = Math.max(0, Math.min(window.innerHeight, clientY));
      document.documentElement.style.setProperty('--touch-x', `${x}px`);
      document.documentElement.style.setProperty('--touch-y', `${y}px`);
      if (card && window.innerWidth > 700) {
        const rect = card.getBoundingClientRect();
        const dx = (x - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (y - (rect.top + rect.height / 2)) / (rect.height / 2);
        card.style.setProperty('--tilt-y', `${Math.max(-3, Math.min(3, dx * 3))}deg`);
        card.style.setProperty('--tilt-x', `${Math.max(-2, Math.min(2, -dy * 2))}deg`);
        card.classList.add('touch-tilt');
      }
    };
    window.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen' || e.pointerType === 'mouse') {
        moveAura(e.clientX, e.clientY);
      }
    }, { passive: true });
    window.addEventListener('pointerleave', () => {
      if (card) { card.classList.remove('touch-tilt'); card.style.removeProperty('--tilt-x'); card.style.removeProperty('--tilt-y'); }
    }, { passive: true });
    window.addEventListener('pointerdown', e => {
      // Small ring feedback on touch/tap, throttled to avoid clutter while scrolling.
      const now = Date.now();
      if (now - lastRipple < 180) return;
      lastRipple = now;
      const ring = document.createElement('span');
      ring.className = 'touch-ripple';
      ring.setAttribute('aria-hidden', 'true');
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      document.body.appendChild(ring);
      ring.addEventListener('animationend', () => ring.remove(), { once: true });
    }, { passive: true });
  }

})();
