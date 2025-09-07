(function () {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const nav = document.querySelector('nav');

  let isMenuOpen = false;
  const MENU_TRANSITION_MS = 280;

  function measureMenuHeight() {
    const prevMax = mobileMenu.style.maxHeight;
    const prevOpacity = mobileMenu.style.opacity;
    mobileMenu.style.maxHeight = 'none';
    mobileMenu.style.opacity = '1';
    let h = mobileMenu.scrollHeight;
    if (!h) {
      const inner = mobileMenu.firstElementChild;
      if (inner) h = inner.getBoundingClientRect().height;
    }
    mobileMenu.style.maxHeight = prevMax || '0px';
    mobileMenu.style.opacity = prevOpacity || '0';
    return h || 0;
  }

  function setMenuState(open) {
    isMenuOpen = !!open;
    if (!mobileMenuBtn || !mobileMenu || !menuIcon) return;

    const targetMax = isMenuOpen ? (measureMenuHeight() + 'px') : '0px';
    mobileMenu.style.maxHeight = targetMax;
    mobileMenu.style.opacity   = isMenuOpen ? '1' : '0';
    mobileMenu.setAttribute('aria-hidden', isMenuOpen ? 'false' : 'true');
    mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');

    menuIcon.classList.toggle('fa-bars', !isMenuOpen);
    menuIcon.classList.toggle('fa-xmark', isMenuOpen);
  }

  function toggleMobileMenu() { setMenuState(!isMenuOpen); }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  document.addEventListener('click', (e) => {
    if (!isMenuOpen) return;
    if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      setMenuState(false);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) setMenuState(false);
  });

  function scrollToHash(hash) {
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;
    const navHeight = (nav && nav.offsetHeight) || 72;
    const cushion = 6;
    const y = target.getBoundingClientRect().top + window.pageYOffset - navHeight - cushion;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const runScroll = () => scrollToHash(href);

      if (isMenuOpen) {
        setMenuState(false);
        let finished = false;
        const onEnd = (evt) => {
          if (evt && evt.target !== mobileMenu) return;
          if (finished) return;
          finished = true;
          mobileMenu.removeEventListener('transitionend', onEnd);
          requestAnimationFrame(runScroll);
        };
        mobileMenu.addEventListener('transitionend', onEnd, { once: true });
        setTimeout(() => { if (!finished) onEnd({ target: mobileMenu }); }, MENU_TRANSITION_MS + 40);
      } else {
        runScroll();
      }
    });
  });
})();