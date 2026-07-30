/* =====================================================================
   BALAJI ENTERPRISES — MAIN JAVASCRIPT
   Handles: mobile navigation toggle, sticky navbar on scroll,
   scroll-reveal animation, and dynamic footer year.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* -------------------------------------------------------------
     1. MOBILE NAVIGATION TOGGLE
     ------------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* Close the mobile menu whenever a nav link is clicked */
    var navLinks = navMenu.querySelectorAll('.navbar__link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------------------------------------------------
     2. STICKY / SHRINKING NAVBAR ON SCROLL
     ------------------------------------------------------------- */
  var navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load in case page is refreshed mid-scroll

  /* -------------------------------------------------------------
     3. SCROLL-REVEAL ANIMATIONS
     Elements marked with [data-reveal] fade + rise into view
     the first time they enter the viewport.
     ------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(function (el, index) {
      /* Slight stagger so grouped elements (e.g. highlight cards) cascade in */
      el.style.transitionDelay = (index % 6) * 60 + 'ms';
      revealObserver.observe(el);
    });
  } else {
    /* Fallback for unsupported browsers: just show everything */
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* -------------------------------------------------------------
     4. DYNAMIC FOOTER YEAR
     ------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
