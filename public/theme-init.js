// Runs before the page is drawn, so a family that picked a theme never sees
// a flash of the other one. Kept in a separate file (not inline in the HTML)
// so our Content-Security-Policy can forbid inline scripts in Step 4.
(function () {
  try {
    var saved = localStorage.getItem('pap-theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) {
    // Storage blocked (private mode): just follow the phone's setting.
  }
})();
