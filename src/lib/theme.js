// Light / dark mode switch.
// - With no choice saved, the app follows the phone's setting.
// - Pressing the button saves the family's choice on this device only
//   (localStorage). Nothing is sent to a server.

const STORAGE_KEY = 'pap-theme';
const root = document.documentElement;
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

/** The theme on screen right now: 'light' or 'dark'. */
export function currentTheme() {
  const chosen = root.dataset.theme;
  if (chosen === 'light' || chosen === 'dark') return chosen;
  return systemDark.matches ? 'dark' : 'light';
}

function save(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage blocked: the choice lasts until the page is closed. That's fine.
  }
}

// Colors the phone's status bar / browser bar to match the header.
function updateThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const headerColor = getComputedStyle(root).getPropertyValue('--header-bg').trim();
  meta.setAttribute('content', headerColor);
}

function updateButton(button) {
  const dark = currentTheme() === 'dark';
  // aria-pressed tells screen readers whether "Dark mode" is on.
  button.setAttribute('aria-pressed', String(dark));
  // toggleAttribute (not .hidden = ...) because the icons are SVG drawings,
  // and the .hidden shortcut only works on HTML elements.
  button.querySelector('.icon-moon').toggleAttribute('hidden', dark);
  button.querySelector('.icon-sun').toggleAttribute('hidden', !dark);
}

/** Connects a <button> to the theme switch. */
export function initThemeToggle(button) {
  if (!button) return;

  button.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    save(next);
    updateButton(button);
    updateThemeColor();
  });

  // If the phone switches modes (e.g. at sunset) and the family never
  // picked one, follow along.
  systemDark.addEventListener('change', () => {
    updateButton(button);
    updateThemeColor();
  });

  updateButton(button);
  updateThemeColor();
}
