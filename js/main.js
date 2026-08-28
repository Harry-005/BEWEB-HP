/* =====================================================================
   BALAJI ENTERPRISES — MAIN JAVASCRIPT
   Handles:
   - Mobile navigation toggle
   - Sticky navbar on scroll
   - Scroll-reveal animation
   - Dynamic footer year
   - Enquiry form → Backend → MySQL
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
      navToggle.setAttribute(
        'aria-expanded',
        isOpen ? 'true' : 'false'
      );
    });

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

  window.addEventListener('scroll', handleNavbarScroll, {
    passive: true
  });

  handleNavbarScroll();


  /* -------------------------------------------------------------
     3. SCROLL-REVEAL ANIMATIONS
     ------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealEls.length) {

    var revealObserver = new IntersectionObserver(
      function (entries, observer) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    revealEls.forEach(function (el, index) {

      el.style.transitionDelay =
        (index % 6) * 60 + 'ms';

      revealObserver.observe(el);

    });

  } else {

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


  /* -------------------------------------------------------------
     5. ENQUIRY FORM → BACKEND → MYSQL
     ------------------------------------------------------------- */
  var enquiryForm = document.querySelector('.contact-form');

  if (enquiryForm) {

    enquiryForm.addEventListener('submit', async function (event) {

      event.preventDefault();

      var formData = new FormData(enquiryForm);

      var enquiryData = {
        name: formData.get('name'),
        company: formData.get('company'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        product: formData.get('product'),
        quantity: formData.get('quantity'),
        message: formData.get('message')
      };

      try {

        var response = await fetch(
          'http://localhost:3000/api/enquiry',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(enquiryData)
          }
        );

        var result = await response.json();

        if (result.success) {

          alert('Enquiry submitted successfully!');

          enquiryForm.reset();

        } else {

          alert(
            result.message || 'Something went wrong.'
          );

        }

      } catch (error) {

        console.error('Enquiry error:', error);

        alert(
          'Unable to submit enquiry. Please try again.'
        );

      }

    });

  }

});