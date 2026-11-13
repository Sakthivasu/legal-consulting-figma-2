
/* =========================================================
   VERITAS & CO. - SHARED JAVASCRIPT
   Pages:
   1. index.html
   2. regulatory.html
   3. enterprise.html
   4. contact.html
   5. booking.html
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =======================================================
     1. PRELOADER
  ======================================================= */

  const preloader = document.getElementById("preloader");
  const loaderProgress = document.getElementById("loader-progress");
  const loaderText = document.getElementById("loader-text");

  function startPreloader() {
    if (!preloader) {
      document.body.classList.add("page-loaded");
      return;
    }

    let progress = 0;

    const loadingInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;

      if (progress >= 100) {
        progress = 100;
      }

      if (loaderProgress) {
        loaderProgress.style.width = `${progress}%`;
      }

      if (loaderText) {
        loaderText.textContent = `${progress}%`;
      }

      if (progress >= 100) {
        clearInterval(loadingInterval);

        setTimeout(() => {
          preloader.classList.add("hide");
          document.body.classList.add("page-loaded");

          setTimeout(() => {
            preloader.style.display = "none";
          }, 900);
        }, 350);
      }
    }, 65);
  }

  startPreloader();


  /* =======================================================
     2. MOBILE NAVIGATION
  ======================================================= */

  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMobileMenu() {
    if (!menuToggle || !navMenu) return;

    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");

    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && navMenu) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");

      menuToggle.classList.toggle("active", isOpen);
      document.body.classList.toggle("menu-open", isOpen);

      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu = navMenu.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 991) {
        closeMobileMenu();
      }
    });
  }


  /* =======================================================
     3. STICKY HEADER
  ======================================================= */

  const header = document.getElementById("header");

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });


  /* =======================================================
     4. ACTIVE NAVIGATION LINK
  ======================================================= */

  const currentPage = document.body.dataset.page;

  const pageLinks = {
    overview: "index.html",
    regulatory: "regulatory.html",
    enterprise: "enterprise.html",
    contact: "contact.html",
    booking: "booking.html"
  };

  if (currentPage && pageLinks[currentPage]) {
    navLinks.forEach((link) => {
      const linkPath = link.getAttribute("href");

      if (!linkPath) return;

      const cleanPath = linkPath.split("?")[0].split("#")[0];

      if (cleanPath === pageLinks[currentPage]) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }


  /* =======================================================
     5. SCROLL REVEAL ANIMATIONS
  ======================================================= */

  const revealElements = document.querySelectorAll(".reveal");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -45px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }


  /* =======================================================
     6. STAGGERED CARD ANIMATIONS
  ======================================================= */

  const animatedGroups = document.querySelectorAll(
    ".practice-grid, .approach-grid, .legal-service-grid, " +
    ".framework-grid, .enterprise-grid, .stats-grid"
  );

  animatedGroups.forEach((group) => {
    const cards = group.querySelectorAll(
      ".practice-card, .approach-card, .legal-service-card, " +
      ".framework-card, .enterprise-card, .stat-item"
    );

    cards.forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(index * 100, 500)}ms`;
    });
  });


  /* =======================================================
     7. ANIMATED STATISTICS COUNTERS
  ======================================================= */

  const counters = document.querySelectorAll("[data-count]");

  function animateCounter(counter) {
    const target = Number(counter.dataset.count);

    if (!Number.isFinite(target)) return;

    const duration = 1800;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(target * easedProgress);

      counter.textContent = currentValue.toLocaleString("en-IN");

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString("en-IN");
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5
      }
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(animateCounter);
  }


  /* =======================================================
     8. IMAGE LOAD ANIMATION
  ======================================================= */

  const images = document.querySelectorAll("img");

  images.forEach((image) => {
    if (image.complete) {
      image.classList.add("image-loaded");
    } else {
      image.addEventListener("load", () => {
        image.classList.add("image-loaded");
      }, { once: true });

      image.addEventListener("error", () => {
        image.classList.add("image-loaded");
      }, { once: true });
    }
  });


  /* =======================================================
     9. BOOKING SERVICE AUTO SELECTION
  ======================================================= */

  const bookingService = document.getElementById("booking-service");

  if (bookingService) {
    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get("service");

    if (requestedService) {
      const matchingOption = Array.from(
        bookingService.options
      ).find((option) => {
        return (
          option.value.toLowerCase() === requestedService.toLowerCase() ||
          option.textContent.trim().toLowerCase() === requestedService.toLowerCase()
        );
      });

      if (matchingOption) {
        bookingService.value = matchingOption.value;
      }
    }
  }


  /* =======================================================
     10. BOOKING DATE - PREVENT PAST DATES
  ======================================================= */

  const bookingDate = document.getElementById("booking-date");

  if (bookingDate) {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const minimumDate = `${year}-${month}-${day}`;

    bookingDate.setAttribute("min", minimumDate);
  }


  /* =======================================================
     11. FORM FEEDBACK HELPER
  ======================================================= */

  function showFormFeedback(element, message, type) {
    if (!element) return;

    element.textContent = message;
    element.className = `form-feedback ${type}`;
    element.style.display = "block";
    element.setAttribute("role", "status");

    element.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "nearest"
    });
  }

  function countWords(value) {
    return value.trim().split(/\s+/).filter(Boolean).length;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  /* =======================================================
     12. CONTACT FORM
  ======================================================= */

  const contactForm = document.getElementById("contact-form");
  const contactMessage = document.getElementById("contact-message");
  const contactFeedback = document.getElementById("contact-feedback");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const nameField = contactForm.querySelector(
        '[name="name"], #contact-name'
      );

      const emailField = contactForm.querySelector(
        '[name="email"], #contact-email'
      );

      const messageField = contactMessage ||
        contactForm.querySelector(
          '[name="message"], textarea'
        );

      const name = nameField ? nameField.value.trim() : "";
      const email = emailField ? emailField.value.trim() : "";
      const message = messageField ? messageField.value.trim() : "";

      if (name.length < 2) {
        showFormFeedback(
          contactFeedback,
          "Please enter your full name.",
          "error"
        );
        nameField?.focus();
        return;
      }

      if (!validateEmail(email)) {
        showFormFeedback(
          contactFeedback,
          "Please enter a valid email address.",
          "error"
        );
        emailField?.focus();
        return;
      }

      if (countWords(message) < 5) {
        showFormFeedback(
          contactFeedback,
          "Please provide a little more detail in your message.",
          "error"
        );
        messageField?.focus();
        return;
      }

      showFormFeedback(
        contactFeedback,
        "Thank you! Your enquiry has been validated successfully. Please connect a backend or email service to receive and store submissions.",
        "success"
      );

      contactForm.reset();
    });
  }


  /* =======================================================
     13. BOOKING FORM
  ======================================================= */

  const bookingForm = document.getElementById("booking-form");
  const bookingMessage = document.getElementById("booking-message");
  const bookingFeedback = document.getElementById("booking-feedback");

  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }

      const nameField = bookingForm.querySelector(
        '[name="name"], #booking-name'
      );

      const emailField = bookingForm.querySelector(
        '[name="email"], #booking-email'
      );

      const serviceField = bookingForm.querySelector(
        '[name="service"], #booking-service'
      );

      const dateField = bookingForm.querySelector(
        '[name="date"], #booking-date'
      );

      const messageField = bookingMessage ||
        bookingForm.querySelector(
          '[name="message"], textarea'
        );

      const name = nameField ? nameField.value.trim() : "";
      const email = emailField ? emailField.value.trim() : "";
      const service = serviceField ? serviceField.value : "";
      const date = dateField ? dateField.value : "";
      const message = messageField ? messageField.value.trim() : "";

      if (name.length < 2) {
        showFormFeedback(
          bookingFeedback,
          "Please enter your full name.",
          "error"
        );
        nameField?.focus();
        return;
      }

      if (!validateEmail(email)) {
        showFormFeedback(
          bookingFeedback,
          "Please enter a valid email address.",
          "error"
        );
        emailField?.focus();
        return;
      }

      if (!service) {
        showFormFeedback(
          bookingFeedback,
          "Please select a consultation service.",
          "error"
        );
        serviceField?.focus();
        return;
      }

      if (!date) {
        showFormFeedback(
          bookingFeedback,
          "Please select your preferred consultation date.",
          "error"
        );
        dateField?.focus();
        return;
      }

      const selectedDate = new Date(`${date}T00:00:00`);
      const currentDate = new Date();

      currentDate.setHours(0, 0, 0, 0);

      if (selectedDate < currentDate) {
        showFormFeedback(
          bookingFeedback,
          "Please choose today or a future date.",
          "error"
        );
        dateField?.focus();
        return;
      }

      if (countWords(message) < 5) {
        showFormFeedback(
          bookingFeedback,
          "Please describe your consultation requirements in a little more detail.",
          "error"
        );
        messageField?.focus();
        return;
      }

      showFormFeedback(
        bookingFeedback,
        "Your booking request has been validated successfully. This is a frontend confirmation only; connect a backend to save the request and confirm an appointment.",
        "success"
      );

      bookingForm.reset();

      if (bookingDate) {
        bookingDate.setAttribute("min", getTodayDate());
      }
    });
  }


  /* =======================================================
     14. GET TODAY'S DATE
  ======================================================= */

  function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  /* =======================================================
     15. SMOOTH SCROLL FOR INTERNAL LINKS
  ======================================================= */

  const internalLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });


  /* =======================================================
     16. BACK TO TOP BUTTON
  ======================================================= */

  const backToTop = document.querySelector(
    "#back-to-top, .back-to-top"
  );

  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });

    function toggleBackToTop() {
      backToTop.classList.toggle(
        "show",
        window.scrollY > 450
      );
    }

    toggleBackToTop();

    window.addEventListener("scroll", toggleBackToTop, {
      passive: true
    });
  }


  /* =======================================================
     17. CURRENT YEAR IN FOOTER
  ======================================================= */

  const yearElements = document.querySelectorAll(
    "#current-year, .current-year"
  );

  yearElements.forEach((element) => {
    element.textContent = new Date().getFullYear();
  });


  /* =======================================================
     18. PREVENT EMPTY PLACEHOLDER LINKS
  ======================================================= */

  document.querySelectorAll('a[href="#"]').forEach((link) => {
    if (
      link.classList.contains("nav-link") ||
      link.hasAttribute("data-scroll")
    ) {
      return;
    }

    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });


  /* =======================================================
     19. PAGE READY CLASS
  ======================================================= */

  window.addEventListener("load", () => {
    document.body.classList.add("assets-loaded");
  });

});
