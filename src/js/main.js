const header = document.querySelector('[data-header]');
const toggle = document.querySelector('[data-menu-toggle]');
const indicator = document.querySelector('[data-nav-indicator]');
const heroSection = document.querySelector('[data-hero]');
const navItems = [...header.querySelectorAll('[data-nav-item]')];
const desktop = window.matchMedia('(min-width: 80rem)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const OPEN_DELAY = 70;
const CLOSE_DELAY = 180;
const SCROLL_THRESHOLD = 6;
let hoverTimer = 0;
let hoveredLink = null;
let focusedLink = null;
let lastScrollY = window.scrollY;
let scrollFrame = 0;

const triggerOf = (item) => item.querySelector('.main-nav__trigger');
const openItem = () => navItems.find((item) => item.classList.contains('is-open'));
const topLink = (element) => {
  const item = element.closest('.main-nav__list > li');
  return item ? item.querySelector(':scope > a, :scope > .main-nav__trigger') : null;
};

function moveIndicator() {
  const open = openItem();
  const link = hoveredLink || focusedLink || (open && triggerOf(open));
  if (!link || !desktop.matches) {
    indicator.classList.remove('is-visible');
    return;
  }

  const bounds = header.getBoundingClientRect();
  const rect = link.getBoundingClientRect();
  const transform = `translate3d(${(rect.left - bounds.left).toFixed(2)}px, ${(rect.bottom - bounds.top + 6).toFixed(2)}px, 0) scaleX(${(rect.width / 100).toFixed(4)})`;

  if (!indicator.classList.contains('is-visible')) {
    // The first appearance starts under the link instead of sliding from the edge.
    indicator.style.transition = 'none';
    indicator.style.transform = transform;
    void indicator.offsetWidth;
    indicator.style.transition = '';
    indicator.classList.add('is-visible');
  } else {
    indicator.style.transform = transform;
  }
}

function setItem(item, open) {
  item.classList.toggle('is-open', open);
  triggerOf(item).setAttribute('aria-expanded', String(open));
}

function showItem(item) {
  navItems.forEach((other) => setItem(other, other === item));
  header.classList.toggle('is-nav-open', Boolean(item) && desktop.matches);
  if (item) header.classList.remove('is-hidden');
  moveIndicator();
}

function setMenu(open) {
  header.classList.toggle('is-menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  if (open) header.classList.remove('is-hidden');
  else showItem(null);
}

function scheduleItem(item) {
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => showItem(item), item ? OPEN_DELAY : CLOSE_DELAY);
}

function syncScroll() {
  scrollFrame = 0;
  const y = Math.max(0, window.scrollY);
  const limit = heroSection.offsetHeight - header.offsetHeight;
  const locked = header.classList.contains('is-menu-open') || Boolean(openItem());

  header.classList.toggle('is-scrolled', y > limit);

  if (reducedMotion.matches || locked || y <= limit) {
    header.classList.remove('is-hidden');
    lastScrollY = y;
    return;
  }

  if (Math.abs(y - lastScrollY) < SCROLL_THRESHOLD) return;
  header.classList.toggle('is-hidden', y > lastScrollY);
  lastScrollY = y;
}

toggle.addEventListener('click', () => {
  setMenu(toggle.getAttribute('aria-expanded') !== 'true');
});

navItems.forEach((item) => {
  triggerOf(item).addEventListener('click', (event) => {
    clearTimeout(hoverTimer);
    const isOpen = item.classList.contains('is-open');
    // A mouse click keeps a panel opened by hover. Keyboard and touch toggle it.
    const keepOpen = desktop.matches && finePointer.matches && event.detail > 0;
    showItem(isOpen && !keepOpen ? null : item);
  });
});

header.addEventListener('pointerover', (event) => {
  if (event.pointerType !== 'mouse' || !desktop.matches) return;
  hoveredLink = topLink(event.target);
  moveIndicator();

  const item = event.target.closest('[data-nav-item]');
  if (item) {
    if (item === openItem()) clearTimeout(hoverTimer);
    else scheduleItem(item);
  } else if (openItem()) {
    scheduleItem(null);
  }
});

header.addEventListener('pointerleave', (event) => {
  if (event.pointerType !== 'mouse' || !desktop.matches) return;
  hoveredLink = null;
  moveIndicator();
  scheduleItem(null);
});

header.addEventListener('focusin', (event) => {
  header.classList.remove('is-hidden');
  focusedLink = event.target.matches(':focus-visible') ? topLink(event.target) : null;
  moveIndicator();
});

header.addEventListener('focusout', (event) => {
  if (!header.contains(event.relatedTarget)) {
    focusedLink = null;
    moveIndicator();
  }
  const item = openItem();
  if (desktop.matches && item && event.relatedTarget && !item.contains(event.relatedTarget)) {
    showItem(null);
  }
});

document.addEventListener('pointerdown', (event) => {
  if (desktop.matches && !header.contains(event.target)) showItem(null);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const item = openItem();
  if (item) {
    showItem(null);
    triggerOf(item).focus();
  } else if (header.classList.contains('is-menu-open')) {
    setMenu(false);
    toggle.focus();
  }
});

window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(syncScroll);
}, { passive: true });

window.addEventListener('resize', () => {
  moveIndicator();
  syncScroll();
});

desktop.addEventListener('change', () => setMenu(false));
syncScroll();
