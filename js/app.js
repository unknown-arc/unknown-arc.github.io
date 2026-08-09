// Theme toggle + Lucide icon refresh, wired after header markup exists
(function () {
  function applyIcon(btn) {
    if (!btn) return;
    const isDark = document.documentElement.classList.contains("dark");
    btn.innerHTML = isDark
      ? window.SiteRender.icon("sun", "size-4") + '<span class="sr-only">Theme Toggle</span>'
      : window.SiteRender.icon("moon", "size-4") + '<span class="sr-only">Theme Toggle</span>';
    // keep icon color accents consistent with the original design
    const svg = btn.querySelector("svg");
    if (svg) svg.style.color = isDark ? "rgb(253 186 116)" : "rgb(99 102 241)";
    if (window.lucide) window.lucide.createIcons({ nodes: [btn] });
  }

  function initThemeToggle() {
    const btn = document.getElementById("theme-toggle-btn");
    if (!btn) return;
    applyIcon(btn);
    btn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
      } catch (e) {}
      applyIcon(btn);
    });
  }

  window.initThemeToggle = initThemeToggle;
})();
