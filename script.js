const reveals = document.querySelectorAll('.section-reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
menuButton?.addEventListener('click', () => {
  const open = nav.style.display === 'flex';
  nav.style.display = open ? 'none' : 'flex';
  nav.style.position = 'absolute';
  nav.style.top = '74px';
  nav.style.left = '18px';
  nav.style.right = '18px';
  nav.style.flexDirection = 'column';
  nav.style.alignItems = 'stretch';
  nav.style.background = 'rgba(252,250,246,.98)';
  nav.style.padding = '18px';
  nav.style.borderRadius = '22px';
  nav.style.boxShadow = '0 20px 50px rgba(0,0,0,.12)';
});
