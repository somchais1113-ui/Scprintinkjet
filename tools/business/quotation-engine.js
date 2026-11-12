/* ProCleaning v2.4 quotation arithmetic — deterministic, no server, VAT configurable.
   All sales/profit metrics exclude output VAT; costs and charges are estimates. */
(function (global) {
  'use strict';
  const round = n => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  const nonnegative = (value, label) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || n > 1e10) throw Error(`${label} must be a finite non-negative number`);
    return n;
  };
  const text = (v, max = 180) => String(v ?? '').trim().slice(0, max);
  const FIELDS = ['material', 'outsourcing', 'labor', 'finishing', 'logistics', 'other'];
  function normalize(input) {
    if (!input || typeof input !== 'object') throw Error('Missing quotation');
    if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > 30) throw Error('Please enter 1–30 line items');
    const items = input.items.map((i, idx) => {
      const description = text(i.description, 160);
      if (!description) throw Error(`Line item ${idx + 1} needs a description`);
      const quantity = nonnegative(i.quantity, 'Quantity');
      if (quantity <= 0 || quantity > 1000000) throw Error('Quantity must be greater than 0 and <= 1,000,000');
      return { description, quantity, unit: text(i.unit || 'pcs', 20), unitPrice: nonnegative(i.unitPrice, 'Unit price'), unitCost: nonnegative(i.unitCost ?? 0, 'Unit direct cost') };
    });
    const costs = {};
    for (const f of FIELDS) costs[f] = nonnegative(input.costs?.[f] ?? 0, `${f} cost`);
    const discountType = input.discountType === 'percent' ? 'percent' : 'amount';
    const discountValue = nonnegative(input.discountValue ?? 0, 'Discount');
    if (discountType === 'percent' && discountValue > 100) throw Error('Discount cannot exceed 100%');
    const shippingCharge = nonnegative(input.shippingCharge ?? 0, 'Shipping charge');
    const vatRate = nonnegative(input.vatRate ?? 7, 'VAT percentage');
    if (vatRate > 100) throw Error('VAT rate cannot exceed 100%');
    return { items, costs, discountType, discountValue, shippingCharge, vatEnabled: input.vatEnabled !== false && vatRate > 0, vatRate, validityDays: Math.min(365, Math.max(1, Math.round(nonnegative(input.validityDays ?? 14, 'Validity days')))), terms: text(input.terms ?? '', 800), notes: text(input.notes ?? '', 800) };
  }
  function calculate(input) {
    const q = normalize(input);
    const rows = q.items.map(i => ({ ...i, lineTotal: round(i.quantity * i.unitPrice), lineCost: round(i.quantity * i.unitCost) }));
    const subtotal = round(rows.reduce((sum, i) => sum + i.lineTotal, 0));
    const rawDiscount = q.discountType === 'percent' ? subtotal * q.discountValue / 100 : q.discountValue;
    const discount = round(Math.min(subtotal, rawDiscount));
    const netSales = round(subtotal - discount + q.shippingCharge); // revenue excludes output VAT
    const vat = round(netSales * (q.vatEnabled ? q.vatRate : 0) / 100);
    const grandTotal = round(netSales + vat);
    const lineCost = round(rows.reduce((sum, i) => sum + i.lineCost, 0));
    const extras = round(FIELDS.reduce((sum, k) => sum + q.costs[k], 0));
    const directCost = round(lineCost + extras);
    const grossProfit = round(netSales - directCost);
    const grossMargin = netSales > 0 ? round(grossProfit / netSales * 100) : null;
    return { ...q, rows, subtotal, discount, netSales, vat, grandTotal, lineCost, extras, directCost, grossProfit, grossMargin };
  }
  global.PCQuoteEngine = Object.freeze({ normalize, calculate, round, COST_FIELDS: Object.freeze([...FIELDS]) });
})(window);
