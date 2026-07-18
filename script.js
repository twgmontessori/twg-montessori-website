// Microsoft Clarity - Load once across the website
if (typeof window.clarity !== "function") {
  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };

    t = l.createElement(r);
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;

    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", "xgd54msohn");
}
document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const messageScrollBehavior = prefersReducedMotion ? "auto" : "smooth";
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));

  const form = document.getElementById('tourForm');

  if (form) {
    const phoneInput = form.querySelector('[name="Phone"]');

    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
       const digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);
        if (digits.length > 6) {
          phoneInput.value = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        } else if (digits.length > 3) {
          phoneInput.value = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else if (digits.length > 0) {
          phoneInput.value = `(${digits}`;
        }
      });
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const emailInput = form.querySelector('[name="Email"]');

if (!emailInput) {
  console.error("Tour form email field is missing.");
  return;
}

const email = emailInput.value.trim().toLowerCase();

     const typoFixes = {
  'qq.cpm': 'qq.com',
  'qq.cop': 'qq.com',

  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmail.cpm': 'gmail.com',
  'gmail.cop': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.co': 'gmail.com',

  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmail.cpm': 'hotmail.com',
  'hotmail.cop': 'hotmail.com',
  'hotmail.con': 'hotmail.com',

  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outlook.cpm': 'outlook.com',
  'outlook.cop': 'outlook.com',
  'outlook.con': 'outlook.com',

  'icloud.cpm': 'icloud.com',
  'icloud.cop': 'icloud.com',
  'icloud.con': 'icloud.com',

  'yahoo.cpm': 'yahoo.com',
  'yahoo.cop': 'yahoo.com',
  'yahoo.con': 'yahoo.com'
};

      const domain = email.split('@')[1];

      if (domain && typoFixes[domain]) {
        const correctedEmail = email.replace(domain, typoFixes[domain]);
        const confirmFix = confirm(`Did you mean ${correctedEmail}?`);

      if (confirmFix) {
  emailInput.value = correctedEmail.trim().toLowerCase();
  emailInput.dispatchEvent(new Event("input", { bubbles: true }));
} else {
  emailInput.focus();
  return;
  }
}

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.textContent : '';

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
      }

      const data = new FormData(form);
data.set("Email", emailInput.value.trim().toLowerCase());

      try {
        const response = await fetch('/api/tour', {
          method: 'POST',
          body: data
        });

        if (!response.ok) {
          throw new Error('Form submission failed');
        }

        form.reset();
// Google Analytics 4 - Track Inquiry Conversion
if (typeof gtag === "function") {
  gtag("event", "generate_lead", {
    event_category: "Inquiry",
    event_label: "Website Tour Form",
    value: 1
  });
}
       const message = document.getElementById("formMessage");

if (message) {
  message.className = "form-message success";
  message.innerHTML =
    "<strong>✓ Thank you!</strong><br>Your inquiry has been successfully received. We look forward to connecting with your family within <strong>1–2 business days</strong>.";

  message.scrollIntoView({
  behavior: messageScrollBehavior,
  block: "center"
});
}
      } catch (error) {
  const message = document.getElementById("formMessage");

  if (message) {
    message.className = "form-message error";
    message.innerHTML =
      '<strong>Unable to submit.</strong><br>Please try again or email us directly at <strong>info@twgmontessori.ca</strong>.';

   message.scrollIntoView({
  behavior: messageScrollBehavior,
  block: "center"
});
  }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }
// GA4 - Track important website actions
document
  .querySelectorAll('a[href="#tour"], a[href$="index.html#tour"]')
  .forEach((link) => {
    link.addEventListener("click", () => {
      if (typeof gtag === "function") {
        gtag("event", "book_tour_click", {
          event_category: "Engagement",
          event_label: "Book a Tour Button"
        });
      }
    });
  });

document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof gtag === "function") {
      gtag("event", "email_click", {
        event_category: "Contact",
        event_label: link.href
      });
    }
  });
});

document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof gtag === "function") {
      gtag("event", "phone_click", {
        event_category: "Contact",
        event_label: link.href
      });
    }
  });
});

document
  .querySelectorAll(
    'a[href*="google.com/maps"], a[href*="maps.google.com"], a[href*="maps.app.goo.gl"]'
  )
  .forEach((link) => {
    link.addEventListener("click", () => {
      if (typeof gtag === "function") {
        gtag("event", "map_click", {
          event_category: "Contact",
          event_label: link.href
        });
      }
    });
  });
// GA4 - Track Montessori guide selections
document
  .querySelectorAll(
    '.guide-card, .resource-list a[href$=".html"]'
  )
  .forEach((link) => {
    link.addEventListener("click", () => {
      if (typeof gtag !== "function") return;

      const guideTitle =
        link.querySelector("h3")?.textContent.trim() ||
        link.textContent.trim();

      gtag("event", "select_content", {
        content_type: "montessori_guide",
        item_id: link.getAttribute("href"),
        link_text: guideTitle
      });
    });
  });
  // GA4 - Track Parent Resources filter use
document
  .querySelectorAll(".filter-btn[data-filter]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      if (typeof gtag !== "function") return;

      gtag("event", "resource_filter_click", {
        filter_name: button.dataset.filter,
        filter_label: button.textContent.trim(),
        page_path: window.location.pathname
      });
    });
  });
// GA4 - Scroll depth tracking
const scrollMarks = [25, 50, 75, 90];
const scrollTracked = {};

window.addEventListener(
  "scroll",
  () => {
    const scrollTop = window.scrollY;
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (scrollableHeight <= 0) return;

    const scrollPercent = Math.round(
      (scrollTop / scrollableHeight) * 100
    );

    scrollMarks.forEach((mark) => {
      if (scrollPercent >= mark && !scrollTracked[mark]) {
        scrollTracked[mark] = true;

        if (typeof gtag === "function") {
          gtag("event", "scroll_depth", {
            event_category: "Engagement",
            event_label: `${mark}%`,
            percent_scrolled: mark
          });
        }
      }
    });
  },
  { passive: true }
);

// Mobile hamburger menu
  
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
  const header = menuToggle.closest(".site-header");

  if (!nav.id) {
    nav.id = "main-navigation";
  }

  menuToggle.setAttribute("aria-controls", nav.id);

  const setMenuState = (isOpen) => {
    nav.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
    menuToggle.textContent = isOpen ? "×" : "☰";
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    setMenuState(isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuToggle.getAttribute("aria-expanded") === "true"
    ) {
      setMenuState(false);
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen && header && !header.contains(event.target)) {
      setMenuState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) {
      setMenuState(false);
    }
  });
}
});
