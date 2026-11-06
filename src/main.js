// Entry point of the app. Vite loads this file from index.html.
// For now it only proves that JavaScript runs. In later steps it will
// start the router, the language switcher and the theme switcher.

const check = document.getElementById('js-check');

// textContent (not innerHTML) is a habit we keep everywhere:
// it treats text as text, so it can never run hidden code.
check.textContent = 'JavaScript is working ✓';
check.classList.add('ok');
