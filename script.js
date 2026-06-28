document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));

  const form = document.getElementById('tourForm');
  if (form) {
    form.addEventListener('submit',async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const lines = [];
      for (const [key, value] of data.entries()) {
        lines.push(`${key}: ${value}`);
      }
      const subject = encodeURIComponent('Tour Inquiry - Together We Grow Montessori School');
      const body = encodeURIComponent(`Hello Together We Grow Montessori School,\n\nI would like to submit a tour / waitlist inquiry.\n\n${lines.join('\n')}\n\nThank you.`);
     try {
  const response = await fetch("/api/tour", {
    method: "POST",
    body: data
  });

  if (!response.ok) {
    throw new Error("Form submission failed");
  }

  form.reset();
  alert("Thank you! Your inquiry has been sent. We will contact you shortly.");
} catch (error) {
  alert("Sorry, your inquiry could not be sent. Please email us at info@twgmontessori.ca.");
}
    });
  }
});
