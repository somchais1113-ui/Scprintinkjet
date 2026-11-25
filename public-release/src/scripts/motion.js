/* ProCleaning v2.5.5 — accessible, performance-conscious progressive motion.
   This file does not modify the Hero grid, routes, or business data. */
(() => {
  'use strict';
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (reduce?.matches) return;
  const doc = document.documentElement;
  doc.classList.add('pc-motion-ready');

  // Keep a thin reading-progress indicator outside the layout flow.
  const progress = document.createElement('div');
  progress.id = 'pc-scroll-progress';
  progress.setAttribute('aria-hidden','true');
  document.body.append(progress);
  let requested = false;
  function updateProgress() {
    const scrollable = Math.max(doc.scrollHeight - window.innerHeight, 0);
    const fraction = scrollable ? Math.min(1,Math.max(0,window.scrollY / scrollable)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
    requested = false;
  }
  const requestProgress = () => {
    if (!requested) {requested = true;window.requestAnimationFrame(updateProgress);}
  };
  window.addEventListener('scroll', requestProgress,{passive:true});
  window.addEventListener('resize', requestProgress,{passive:true});
  requestProgress();

  // Keep anchor targets on their exact coordinates: headings fade only, no transform.
  const introSelectors = [
    '.section-intro h2','.section-intro__aside',
    '.quote-copy','.about-copy','.pricing-heading',
    '.testimonial-intro','.contact-info',
    '.v24-rfq-inner','.footer-grid > div',
    '.overlap-photos','.testimonial-card','.contact-form-wrap',
    '.service-card','.team-card','.price-card','.blog-card',
    '.feature-pill','.contact-method'
  ];
  const selector = introSelectors.join(',');
  const revealable = new WeakSet();
  let observer = null;

  function attach(items) {
    for (const node of items) {
      if (!(node instanceof Element) || revealable.has(node)) continue;
      // Avoid animations starting invisible on already-visible top-of-page content.
      revealable.add(node);
      node.classList.add('pc-reveal');
      if (node.matches('.section-intro h2,.quote-copy,.about-copy,.pricing-heading,.testimonial-intro,.contact-info')) node.classList.add('pc-reveal--quiet');
      if (node.matches('.service-card,.team-card,.price-card,.blog-card,.feature-pill,.contact-method')) {
        const slot = Array.from(node.parentElement?.children || []).indexOf(node);
        node.style.setProperty('--pc-reveal-delay', `${Math.min(slot % 4,3)*90}ms`);
      }
      if (observer) observer.observe(node); else node.classList.add('is-visible');
    }
  }
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, {rootMargin:'0px 0px -7% 0px',threshold:0.07});
  }
  function scan(root = document) {
    const nodes = root.querySelectorAll?.(selector);
    if (nodes) attach(nodes);
  }
  scan();

  // Site Manager changes language by replacing card DOM. Reattach to new nodes.
  if ('MutationObserver' in window) {
    const monitor = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(selector)) attach([node]);
          scan(node);
        }
      }
    });
    ['servicesGrid','pricingGrid','teamGrid','blogGrid','testimonialCard'].forEach(id => {
      const element=document.getElementById(id);
      if (element) monitor.observe(element,{childList:true,subtree:false});
    });
  }

  // Accessibility preference may change while the page is open.
  reduce?.addEventListener?.('change', event => {
    if (!event.matches) return;
    doc.classList.remove('pc-motion-ready');
    observer?.disconnect();
    progress.remove();
    document.querySelectorAll('.pc-reveal').forEach(el => el.classList.add('is-visible'));
  });
})();
