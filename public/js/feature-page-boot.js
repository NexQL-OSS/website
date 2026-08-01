/**
 * Minimal chrome for /features/* — theme picker, banner, mobile nav.
 */
(function initFeaturePage() {
  function syncSiteHeaderOffset() {
    const header = document.querySelector(".site-header.landing-topbar");
    if (!header) return;
    document.documentElement.style.setProperty(
      "--site-header-offset",
      `${Math.ceil(header.getBoundingClientRect().height)}px`,
    );
  }

  function wireReleaseBanner() {
    const closeBtn = document.getElementById("btn-close-banner");
    if (!closeBtn) return;
    const dismissKey = "nexql-release-2.0.0-banner-dismissed";
    if (localStorage.getItem(dismissKey) === "true") {
      document.body.classList.add("banner-dismissed");
    }
    closeBtn.addEventListener("click", () => {
      localStorage.setItem(dismissKey, "true");
      document.body.classList.add("banner-dismissed");
      syncSiteHeaderOffset();
    });
  }

  function wireMobileNav() {
    const btn = document.getElementById("btn-toggle-topbar");
    const nav = document.getElementById("site-nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("show");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      requestAnimationFrame(syncSiteHeaderOffset);
    });
  }

  function wireHeaderScroll() {
    const header = document.querySelector(".site-header.landing-topbar");
    if (!header) return;
    const sync = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", sync, { passive: true });
    sync();
  }

  function boot() {
    wireReleaseBanner();
    wireMobileNav();
    wireHeaderScroll();
    syncSiteHeaderOffset();
    window.addEventListener("resize", syncSiteHeaderOffset, { passive: true });
    if (window.NexqlThemes?.ready) {
      void window.NexqlThemes.ready.then(syncSiteHeaderOffset).catch(() => {});
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
