// Runs before hydration so there is no flash of the wrong theme.
// Reads a plain (non-httpOnly) cookie first — set by ThemeToggle — falling
// back to localStorage, then to the OS preference.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var m = document.cookie.match(/(?:^|; )theme=(dark|light)/);
    var stored = localStorage.getItem("theme") || (m ? m[1] : null);
    var theme = stored === "dark" || stored === "light"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}
