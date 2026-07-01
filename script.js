document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));

  const form = document.getElementById('tourForm');

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const emailInput = form.querySelector('[name="Email"]');
      const email = emailInput ? emailInput.value.trim().toLowerCase() : '';

      const typoFixes = {
        'qq.cpm': 'qq.com',
        'gamil.com': 'gmail.com',
        'hotmial.com': 'hotmail.com',
        'hotmai.com': 'hotmail.com',
        'outlok.com': 'outlook.com',
        'outloo.com': 'outlook.com'
      };

      const domain = email.split('@')[1];

      if (domain && typoFixes[domain]) {
        const correctedEmail = email.replace(domain, typoFixes[domain]);
        const confirmFix = confirm(`Did you mean ${correctedEmail}?`);

        if (confirmFix) {
          emailInput.value = correctedEmail;
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

      try {
        const response = await fetch('/api/tour', {
          method: 'POST',
          body: data
        });

        if (!response.ok) {
          throw new Error('Form submission failed');
        }

        form.reset();

        alert(
          'Thank you! Your inquiry has been successfully received. We look forward to connecting with your family within 1–2 business days.'
        );
      } catch (error) {
        alert(
          'Sorry, something went wrong. Please try again or email us at info@twgmontessori.ca.'
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }
});
