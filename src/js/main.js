const header = document.querySelector('[data-header]');
const toggle = document.querySelector('[data-menu-toggle]');
const navItems = [...header.querySelectorAll('[data-nav-item]')];
const desktop = window.matchMedia('(min-width: 80rem)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const OPEN_DELAY = 70;
const CLOSE_DELAY = 180;
let hoverTimer = 0;

const triggerOf = (item) => item.querySelector('.main-nav__trigger');
const openItem = () => navItems.find((item) => item.classList.contains('is-open'));

function setItem(item, open) {
  item.classList.toggle('is-open', open);
  triggerOf(item).setAttribute('aria-expanded', String(open));
}

function showItem(item) {
  navItems.forEach((other) => setItem(other, other === item));
  header.classList.toggle('is-nav-open', Boolean(item) && desktop.matches);
}

function setMenu(open) {
  header.classList.toggle('is-menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  if (!open) showItem(null);
}

function scheduleItem(item) {
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => showItem(item), item ? OPEN_DELAY : CLOSE_DELAY);
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
  const item = event.target.closest('[data-nav-item]');
  if (item) {
    if (item === openItem()) clearTimeout(hoverTimer);
    else scheduleItem(item);
  } else if (openItem()) {
    scheduleItem(null);
  }
});

header.addEventListener('pointerleave', (event) => {
  if (event.pointerType === 'mouse' && desktop.matches) scheduleItem(null);
});

header.addEventListener('focusout', (event) => {
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

desktop.addEventListener('change', () => setMenu(false));
