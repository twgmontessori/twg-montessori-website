document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));

  const form = document.getElementById('tourForm');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const lines = [];
      for (const [key, value] of data.entries()) {
        lines.push(`${key}: ${value}`);
      }
      const subject = encodeURIComponent('Tour Inquiry - Together We Grow Montessori School');
      const body = encodeURIComponent(`Hello Together We Grow Montessori School,\n\nI would like to submit a tour / waitlist inquiry.\n\n${lines.join('\n')}\n\nThank you.`);
      window.location.href = `mailto:cchan@twgmontessori.ca?subject=${subject}&body=${body}`;
    });
  }
});
