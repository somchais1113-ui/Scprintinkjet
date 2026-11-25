/* Compatibility layer: settings are now managed in data/site-data.js. */
window.PROCLEANING_CONFIG = {
  get brand(){const b=window.PROCLEANING_SITE.brand; return b.prefix+b.name;},
  get contactEmail(){return window.PROCLEANING_SITE.contact.email;},
  get contactPhone(){return window.PROCLEANING_SITE.contact.phone;},
  get address(){return window.PROCLEANING_SITE.contact.address;},
  get bookingSubject(){return window.PROCLEANING_SITE.contact.bookingSubject;},
  get currency(){return window.PROCLEANING_SITE.settings.currency;},
  get demoYearlyDiscount(){return Number(window.PROCLEANING_SITE.settings.yearlyDiscount)/100;}
};
