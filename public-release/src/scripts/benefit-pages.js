/* Thai copy is in the HTML. Only English and local link preferences need JS. */
(() => {
  'use strict';
  const english = new URLSearchParams(location.search).get('lang')?.toLowerCase() === 'en';
  if (!english) return;
  document.documentElement.lang = 'en';
  document.querySelectorAll('[data-en]').forEach(node => { node.textContent = node.dataset.en; });
  document.querySelectorAll('[data-en-alt]').forEach(node => { node.setAttribute('alt', node.dataset.enAlt); });
  document.querySelectorAll('[data-en-content]').forEach(node => {
    node.setAttribute('content', node.dataset.enContent);
  });
  document.querySelectorAll('[data-en-label]').forEach(node => {
    node.setAttribute('aria-label', node.dataset.enLabel);
  });
  document.querySelector('.benefit-locale [hreflang="th"]').removeAttribute('aria-current');
  document.querySelector('.benefit-locale [hreflang="en"]').setAttribute('aria-current', 'page');
  document.querySelectorAll('[data-benefit-local]').forEach(anchor => {
    const href = anchor.getAttribute('href').replace(/([?&]lang=)th(?=#|&|$)/, '$1en');
    anchor.setAttribute('href', href);
  });
})();
