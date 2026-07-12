document.addEventListener('DOMContentLoaded', () => {
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
        let digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);

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
      const email = emailInput ? emailInput.value.trim().toLowerCase() : '';

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
    behavior: "smooth",
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
      behavior: "smooth",
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
// Highlight the current page in the shared navigation
const currentPage =
  window.location.pathname.split("/").pop() || "index.html";

const currentSectionMap = {
  "parent-resources.html": "resources",
  "admissions.html": "admissions",
  "team.html": "team"
};

const currentSection = currentSectionMap[currentPage];

if (currentSection) {
  const currentNavLink = document.querySelector(
    `.nav a[data-nav-section="${currentSection}"]`
  );

  if (currentNavLink) {
    currentNavLink.setAttribute("aria-current", "page");
  }
}
  
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuToggle.textContent = isOpen ? "×" : "☰";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}
});
