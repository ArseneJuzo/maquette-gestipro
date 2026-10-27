/* =========================================================
   GestiPro — maquette interactive (HTML / CSS / JS natif)
   Toutes les données sont fictives et vivent dans le navigateur
   (mémoire + localStorage). Code PIN de démonstration : 1234
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   1. Utilitaires
--------------------------------------------------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sum = (a, f = x => x) => a.reduce((s, x) => s + (+f(x) || 0), 0);
const fmt = n => Math.round(n || 0).toLocaleString('fr-FR');
const F = n => fmt(n) + ' FCFA';
const pad = n => String(n).padStart(2, '0');
const fmtD = iso => { const d = new Date(iso); return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear(); };
const fmtT = iso => { const d = new Date(iso); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
const fmtDT = iso => fmtD(iso) + ' ' + fmtT(iso);
const now = () => new Date().toISOString();
const day0 = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const isToday = iso => day0(iso).getTime() === day0(new Date()).getTime();
const daysTo = iso => Math.round((day0(iso) - day0(new Date())) / 864e5);
const D = (off = 0, h = 9, m = 0) => { const d = new Date(); d.setDate(d.getDate() + off); d.setHours(h, m, 0, 0); return d.toISOString(); };
const uid = p => p + Math.random().toString(36).slice(2, 9);
const initials = n => String(n).replace(/[^A-Za-zÀ-ÿ\s&]/g, ' ').split(/\s+/).filter(w => w && /[A-ZÀ-Ý]/.test(w[0])).slice(0, 2).map(w => w[0]).join('') || '?';
const num = v => { const n = parseFloat(String(v).replace(/[\s  ]/g, '').replace(',', '.')); return isNaN(n) ? 0 : n; };
const short = n => n >= 1e6 ? (n / 1e6).toFixed(1).replace('.', ',') + ' M' : n >= 1e3 ? Math.round(n / 1e3) + ' k' : String(Math.round(n));
const DOW = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];

/* Icônes (tracés SVG) */
const P = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  box: '<path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8"/>',
  clip: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>',
  pos: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  doc: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.8.7 3 2.5 3.5 5.2"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
  down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  swap: '<path d="M7 7h13l-3-3M17 17H4l3 3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  barcode: '<path d="M3 5v14M7 5v14M10 5v14M14 5v14M16 5v14M20 5v14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>', check: '<path d="M5 12l4 4 10-10"/>',
  print: '<path d="M6 9V3h12v6M6 17H4v-6h16v6h-2M7 14h10v7H7z"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>',
  cart: '<path d="M3 4h2l2.5 11h10.5l2-8H6.5"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
  wallet: '<path d="M3 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3zM3 7l12-4v4M17 13h.01"/>',
  wa: '<path d="M21 12a8 8 0 0 1-12 7l-5 1 1-4.5A8 8 0 1 1 21 12z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  bank: '<path d="M3 10h18M5 10v10M19 10v10M12 10v10M3 20h18M12 3l9 5H3z"/>',
  chev: '<path d="M6 9l6 6 6-6"/>', right: '<path d="M9 6l6 6-6 6"/>',
  up: '<path d="M12 20V6M6 12l6-6 6 6"/>', dn: '<path d="M12 4v14M6 12l6 6 6-6"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  pause: '<path d="M9 5v14M15 5v14"/>', undo: '<path d="M9 14l-5-5 5-5M4 9h11a5 5 0 0 1 0 10h-4"/>',
  logout: '<path d="M15 4h4v16h-4M10 17l5-5-5-5M15 12H3"/>',
  sheet: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8l8 8M16 8l-8 8"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
  store: '<path d="M4 9l1-5h14l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6"/>',
  img: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
  truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  percent: '<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
  save: '<path d="M5 3h11l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M8 3v5h7M8 21v-7h8v7"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'
};
const ic = (n, s = 18) => `<svg class="i" viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true">${P[n] || ''}</svg>`;

/* ---------------------------------------------------------
   2. Référentiels
--------------------------------------------------------- */
const DEPOTS = [
  { id: 'DP', name: 'Dépôt principal', site: 'Boutique Centrale' },
  { id: 'MV', name: 'Boutique Mvog-Mbi', site: 'Boutique Mvog-Mbi' },
  { id: 'BA', name: 'Boutique Bastos', site: 'Boutique Bastos' }
];
const depName = id => id === 'all' ? 'Tous les dépôts' : (DEPOTS.find(d => d.id === id) || {}).name;
const siteName = id => id === 'all' ? 'Tous les points de vente' : (DEPOTS.find(d => d.id === id) || {}).site;
const METHODS = {
  cash: { l: 'Espèces', c: '#1E7A46', i: 'cash' },
  om: { l: 'Orange Money', c: '#E8892B' },
  momo: { l: 'MTN MoMo', c: '#E0B000' },
  vir: { l: 'Virement', c: '#3B7DD8', i: 'bank' },
  credit: { l: 'Crédit', c: '#8A5CC2', i: 'wallet' },
  mixte: { l: 'Paiement mixte', c: '#5B6B62', i: 'plus' }
};
const PERMS = [
  ['vendre', 'Encaisser des ventes'], ['remise', 'Accorder remises et crédit'], ['stock', 'Entrées, sorties, transferts'],
  ['prix', 'Créer des produits, modifier les prix'], ['compter', 'Compter un inventaire'], ['inventaire', 'Valider un inventaire'],
  ['factures', 'Créer devis et factures'], ['retours', 'Retours et avoirs'], ['rapports', 'Voir rapports et marges'],
  ['admin', 'Utilisateurs, sauvegardes, export']
];
const INV_REASONS = ['Non justifié', 'Casse / abîmé', 'Vol', 'Périmé / retiré', 'Erreur de saisie', 'Retour non enregistré'];
const OUT_REASONS = ['Casse / abîmé', 'Périmé', 'Perte / vol', 'Consommation interne', 'Don / échantillon'];
const CAT_TONE = { 'Épicerie': ['#E4F2E9', '#17643A'], 'Boissons': ['#E3EEFA', '#1B5596'], 'Hygiène': ['#EFE8FA', '#5B3A99'] };
const DOC = {
  ticket: { l: 'Tickets', one: 'Ticket', p: 'T-' },
  devis: { l: 'Devis', one: 'Devis', p: 'D-' },
  bc: { l: 'Bons de commande', one: 'Bon de commande', p: 'BC-' },
  facture: { l: 'Factures', one: 'Facture', p: 'F-' },
  bl: { l: 'Bons de livraison', one: 'Bon de livraison', p: 'BL-' },
  avoir: { l: 'Avoirs & retours', one: 'Avoir', p: 'AV-' }
};

/* Produits : id, réf, nom, catégorie, achat, détail, gros, seuil, [DP,MV,BA], péremption (jours), promo %, fournisseur, unité */
const PR = [
  ['p1', 'EPI-0127', 'Riz parfumé 25 kg', 'Épicerie', 16500, 19000, 18200, 10, [4, 15, 8], null, 0, 's1', 'Sac'],
  ['p2', 'EPI-0311', 'Huile raffinée 1 L', 'Épicerie', 1250, 1500, 1400, 24, [0, 6, 3], null, 0, 's1', 'Bouteille'],
  ['p3', 'EPI-0402', 'Lait en poudre 400 g', 'Épicerie', 2600, 3100, 2950, 20, [46, 12, 9], 18, 0, 's1', 'Boîte'],
  ['p4', 'EPI-0088', 'Sucre en poudre 1 kg', 'Épicerie', 780, 950, 880, 60, [312, 80, 55], null, 0, 's1', 'Paquet'],
  ['p5', 'BOI-0015', 'Eau minérale 1,5 L (pack de 6)', 'Boissons', 1900, 2400, 2200, 50, [208, 40, 30], 160, 5, 's2', 'Pack'],
  ['p6', 'HYG-0204', 'Savon de ménage 400 g', 'Hygiène', 320, 400, 370, 30, [18, 25, 14], null, 0, 's3', 'Pièce'],
  ['p7', 'EPI-0219', 'Spaghetti 500 g', 'Épicerie', 410, 500, 460, 100, [540, 120, 90], 290, 0, 's1', 'Paquet'],
  ['p8', 'BOI-0087', 'Jus de fruits 1 L', 'Boissons', 850, 1100, 1000, 24, [72, 20, 18], 35, 5, 's2', 'Brique'],
  ['p9', 'EPI-0128', 'Riz parfumé 5 kg', 'Épicerie', 3500, 4200, 3950, 40, [142, 30, 26], null, 0, 's1', 'Sac'],
  ['p10', 'HYG-0110', 'Savon de toilette', 'Hygiène', 240, 350, 310, 50, [220, 60, 45], null, 0, 's3', 'Pièce'],
  ['p11', 'EPI-0312', 'Huile raffinée 5 L', 'Épicerie', 6200, 7400, 6900, 15, [35, 8, 6], null, 0, 's1', 'Bidon'],
  ['p12', 'EPI-0501', 'Café soluble 200 g', 'Épicerie', 2100, 2700, 2500, 10, [22, 5, 4], 240, 0, 's1', 'Pot'],
  ['p13', 'HYG-0330', 'Lessive 5 kg', 'Hygiène', 5400, 6500, 6100, 8, [12, 3, 2], null, 0, 's3', 'Seau'],
  ['p14', 'EPI-0610', 'Tomate concentrée 400 g', 'Épicerie', 450, 600, 550, 40, [96, 30, 22], 200, 0, 's1', 'Boîte']
];

/* ---------------------------------------------------------
   3. Données de démonstration et persistance
--------------------------------------------------------- */
const KEY = 'gestipro.demo.v1';
let S;

function unitPrice(p, t) { return t === 'gros' ? p.wholesale : Math.round(p.retail * (1 - (p.promo || 0) / 100)); }

function seed() {
  const products = PR.map((r, i) => ({
    id: r[0], ref: r[1], name: r[2], cat: r[3], buy: r[4], retail: r[5], wholesale: r[6], min: r[7],
    stock: { DP: r[8][0], MV: r[8][1], BA: r[8][2] }, expiry: r[9] == null ? null : D(r[9]).slice(0, 10),
    promo: r[10], supplier: r[11], unit: r[12], barcode: '600123' + String(4500127 + i * 7919).slice(0, 7)
  }));
  const pp = id => products.find(p => p.id === id);
  const L = (arr, t) => arr.map(([pid, qty, price]) => ({ pid, qty, price: price ?? unitPrice(pp(pid), t) }));
  const docs = [];
  const mk = o => { const d = Object.assign({ id: uid('d'), payments: [], discount: 0, depot: 'DP', user: 'u1', tarif: 'detail' }, o); docs.push(d); return d; };
  const tot = d => Math.max(0, sum(d.lines, l => l.qty * l.price) - (d.discount || 0));

  [[8605, 'c0', D(0, 7, 5), [['p4', 3], ['p7', 4]], 'cash'], [8606, 'c4', D(0, 7, 9), [['p9', 1], ['p5', 2]], 'om'],
   [8607, 'c0', D(0, 7, 14), [['p10', 6], ['p6', 2]], 'cash'], [8608, 'c0', D(0, 7, 20), [['p5', 3], ['p8', 2]], 'momo'],
   [8609, 'c0', D(0, 7, 41), [['p1', 2]], 'cash'], [8610, 'c4', D(0, 7, 44), [['p3', 4], ['p4', 5], ['p12', 1]], 'om'],
   [8611, 'c0', D(0, 7, 46), [['p7', 5], ['p14', 3]], 'cash'], [8612, 'c0', D(0, 7, 48), [['p9', 3], ['p10', 4], ['p4', 6]], 'cash']
  ].forEach(([n, c, dt, ls, m]) => { const d = mk({ type: 'ticket', num: 'T-' + pad5(n), client: c, date: dt, lines: L(ls, 'detail'), user: 'u2' }); d.payments = [{ date: dt, amount: tot(d), method: m }]; });

  let f = mk({ type: 'facture', num: 'F-02291', client: 'c1', date: D(0, 7, 35), tarif: 'gros', lines: L([['p1', 10], ['p11', 20], ['p4', 100]], 'gros'), discount: 4000 });
  f.payments = [{ date: D(0, 7, 36), amount: 150000, method: 'om' }];
  const rest = tot(f) - 150000;
  f.schedule = [{ date: f.date, amount: 150000, label: 'Acompte' }, { date: D(14), amount: Math.round(rest / 2), label: 'Échéance 1' }, { date: D(28), amount: rest - Math.round(rest / 2), label: 'Échéance 2' }];
  f = mk({ type: 'facture', num: 'F-02290', client: 'c4', date: D(-1, 16, 20), lines: L([['p3', 3], ['p4', 10], ['p9', 2]], 'detail') }); f.payments = [{ date: f.date, amount: tot(f), method: 'cash' }];
  mk({ type: 'facture', num: 'F-02289', client: 'c2', date: D(-1, 11, 2), tarif: 'gros', lines: L([['p5', 30], ['p11', 10], ['p14', 48]], 'gros'), due: D(29) });
  f = mk({ type: 'facture', num: 'F-02287', client: 'c6', date: D(-2, 15, 0), tarif: 'gros', lines: L([['p13', 8], ['p6', 60]], 'gros') }); f.payments = [{ date: f.date, amount: tot(f), method: 'vir' }];
  const f84 = mk({ type: 'facture', num: 'F-02284', client: 'c5', date: D(-2, 10, 5), tarif: 'gros', lines: L([['p4', 100], ['p11', 8], ['p10', 40]], 'gros') }); f84.payments = [{ date: f84.date, amount: tot(f84), method: 'cash' }];
  f = mk({ type: 'facture', num: 'F-02271', client: 'c3', date: D(-15, 12, 0), lines: L([['p1', 2], ['p12', 4], ['p8', 6]], 'detail'), due: D(-1) }); f.payments = [{ date: f.date, amount: 30000, method: 'cash' }];
  f = mk({ type: 'facture', num: 'F-02266', client: 'c1', date: D(-17, 9, 0), tarif: 'gros', lines: L([['p1', 12], ['p9', 20]], 'gros') }); f.payments = [{ date: D(-10, 9, 0), amount: tot(f), method: 'vir' }];
  mk({ type: 'devis', num: 'D-00412', client: 'c2', date: D(-1, 10, 0), tarif: 'gros', lines: L([['p5', 40], ['p8', 48], ['p14', 60]], 'gros'), status: 'attente' });
  mk({ type: 'devis', num: 'D-00411', client: 'c5', date: D(-3, 9, 30), tarif: 'gros', lines: L([['p4', 150], ['p7', 200]], 'gros'), status: 'accepte' });
  mk({ type: 'bc', num: 'BC-00118', client: 'c1', date: D(0, 7, 20), tarif: 'gros', lines: L([['p9', 20], ['p7', 100]], 'gros'), status: 'afacturer' });
  mk({ type: 'bl', num: 'BL-00231', client: 'c5', date: D(-2, 10, 30), tarif: 'gros', lines: f84.lines.map(l => ({ ...l })), ref: 'F-02284', status: 'livre' });
  mk({ type: 'avoir', num: 'AV-00004', client: 'c4', date: D(-4, 17, 0), lines: L([['p8', 1]], 'detail'), ref: 'F-02280', reason: 'Produit endommagé', method: 'cash' });

  const movements = [];
  const M = (pid, date, type, depot, qty, after, user, note) => movements.push({ id: uid('m'), pid, date, type, depot, qty, after, user, note });
  M('p1', D(0, 7, 41), 'Vente', 'DP', -2, 4, 'u2', 'Ticket T-08609');
  M('p1', D(-1, 16, 12), 'Transfert', 'DP', -6, 6, 'u4', 'TR-00142 → Boutique Bastos');
  M('p1', D(-2, 10, 5), 'Vente', 'DP', -8, 12, 'u2', 'Ticket T-08540 (gros)');
  M('p1', D(-5, 18, 30), 'Ajustement', 'DP', -1, 20, 'u1', 'Inventaire INV-2026-10 · sac abîmé');
  M('p1', D(-7, 9, 15), 'Entrée', 'DP', 20, 21, 'u4', 'BL fournisseur SD-77310 · Sodicam Distribution');
  products.forEach((p, i) => { if (p.id !== 'p1') M(p.id, D(-3 - (i % 5), 9, 10 + i), 'Entrée', 'DP', Math.max(12, Math.round(p.stock.DP * .6)), p.stock.DP, 'u4', 'Réception fournisseur'); });

  return {
    v: 1, seedDay: fmtD(now()), user: 'u1', depot: 'DP', products, docs, movements,
    clients: [
      { id: 'c0', name: 'Client comptoir', type: 'Comptoir', phone: '', city: '—', limit: 0, since: '—', hist: 0 },
      { id: 'c1', name: 'Ets Fouda & Fils', type: 'Gros', phone: '677 12 34 21', city: 'Mokolo, Yaoundé', limit: 500000, since: '2024', hist: 4100000 },
      { id: 'c2', name: 'Restaurant Le Bon Goût', type: 'Gros', phone: '699 40 18 08', city: 'Bastos, Yaoundé', limit: 400000, since: '2025', hist: 2150000 },
      { id: 'c3', name: 'M. Kamga Joseph', type: 'Détail', phone: '655 23 71 47', city: 'Biyem-Assi, Yaoundé', limit: 100000, since: '2025', hist: 348000 },
      { id: 'c4', name: 'Mme Ngo Bassa', type: 'Détail', phone: '670 88 02 93', city: 'Mvog-Mbi, Yaoundé', limit: 50000, since: '2023', hist: 240000 },
      { id: 'c5', name: 'Boulangerie Atangana', type: 'Gros', phone: '691 55 30 12', city: 'Essos, Yaoundé', limit: 300000, since: '2024', hist: 1640000 },
      { id: 'c6', name: 'Quincaillerie Essomba', type: 'Gros', phone: '682 19 64 30', city: 'Mvan, Yaoundé', limit: 200000, since: '2025', hist: 640000 }
    ],
    suppliers: [
      { id: 's1', name: 'Sodicam Distribution', cat: 'Épicerie', phone: '677 41 20 55', city: 'Douala', due: 1240000, payments: [] },
      { id: 's2', name: 'Boissons du Centre SARL', cat: 'Boissons', phone: '699 02 77 14', city: 'Yaoundé', due: 600000, payments: [] },
      { id: 's3', name: 'Savonnerie de Nkolbisson', cat: 'Hygiène', phone: '651 90 43 28', city: 'Yaoundé', due: 0, payments: [] }
    ],
    users: [
      { id: 'u1', name: 'Alain M.', role: 'gerant', depot: 'all', pin: '1234', active: true, last: D(0, 7, 31), color: '#1E7A46' },
      { id: 'u2', name: 'Aïcha M.', role: 'caissier', depot: 'DP', pin: '1234', active: true, last: D(0, 7, 0), color: '#1D5FA8' },
      { id: 'u3', name: 'Brice K.', role: 'caissier', depot: 'BA', pin: '1234', active: true, last: D(0, 7, 12), color: '#2F6FB5' },
      { id: 'u4', name: 'Paul E.', role: 'magasinier', depot: 'DP', pin: '1234', active: true, last: D(0, 6, 28), color: '#B4580F' },
      { id: 'u5', name: 'Ruth N.', role: 'magasinier', depot: 'DP', pin: '1234', active: true, last: D(-1, 18, 40), color: '#9A4A0B' }
    ],
    roles: {
      gerant: { label: 'Gérant', tone: 'pur', perms: PERMS.map(p => p[0]) },
      caissier: { label: 'Caissier', tone: 'info', perms: ['vendre'] },
      magasinier: { label: 'Magasinier', tone: 'warn', perms: ['stock', 'compter'] }
    },
    activity: [
      { at: D(0, 7, 48), user: 'u2', kind: 'pos', text: 'a encaissé le ticket T-08612' },
      { at: D(0, 7, 40), user: 'u1', kind: 'remise', text: 'a accordé une remise de 4 000 FCFA sur F-02291' },
      { at: D(0, 7, 22), user: 'u4', kind: 'inv', text: 'a compté 48 produits (INV-2026-11)' },
      { at: D(0, 7, 5), user: 'u3', kind: 'secu', text: '— échec de connexion (3 tentatives)' },
      { at: D(-1, 19, 14), user: 'u1', kind: 'edit', text: 'a modifié le prix de gros de « Riz parfumé 25 kg » (18 000 → 18 200 FCFA)' }
    ],
    inventories: [
      { id: 'INV-2026-11', depot: 'DP', status: 'cours', start: D(0, 6, 30), user: 'u1', counts: {
        p1: { q: 3, r: 'Casse / abîmé', by: 'u4' }, p11: { q: 32, r: 'Non justifié', by: 'u4' }, p6: { q: 20, r: 'Erreur de saisie', by: 'u5' },
        p3: { q: 42, r: 'Périmé / retiré', by: 'u5' }, p7: { q: 540, r: '', by: 'u4' }, p4: { q: 308, r: 'Non justifié', by: 'u5' } } },
      { id: 'INV-2026-10', depot: 'DP', status: 'valide', start: D(-5, 7, 0), end: D(-5, 18, 30), value: -21400, count: 14, user: 'u1' },
      { id: 'INV-2026-09', depot: 'BA', status: 'valide', start: D(-26, 7, 0), end: D(-26, 17, 0), value: -6900, count: 14, user: 'u1' }
    ],
    hist7: [1180000, 980000, 1260000, 1050000, 1460000, 1690000],
    soldBase: { p4: 2950, p5: 2480, p9: 1900, p7: 1760, p10: 1350, p1: 380, p3: 600, p8: 520, p11: 290, p6: 800, p12: 8, p13: 10, p14: 15, p2: 240 },
    register: { open: true, openedAt: D(0, 7, 0), float: 50000, user: 'u2' },
    closures: [],
    cart: freshCart(), held: [],
    company: { name: '[NOM DE VOTRE ENTREPRISE]', addr: '[ADRESSE], Yaoundé', nc: '[N° CONTRIBUABLE]', tel: '[TÉLÉPHONE]' },
    backups: [], lastBackup: D(0, 7, 30),
    seq: { ticket: 8612, facture: 2291, devis: 412, bc: 118, bl: 231, avoir: 4, inv: 11, tr: 142 },
    ui: {}
  };
}
function pad5(n) { return String(n).padStart(5, '0'); }
function freshCart() { return { lines: [], client: 'c0', tarif: 'detail', method: 'cash', recv: '', discount: 0, print: true, wa: false, pdf: false }; }
const UI_DEFAULT = { stockDepot: 'all', stockQ: '', stockCat: '', stockStatus: '', docType: 'facture', selDoc: null, docQ: '', docSt: '', party: 'clients', selClient: 'c1', selSup: 's1', partyQ: '', rp: '30', invFilter: 'ecart', invQ: '', mvFilter: '', posCat: '', posQ: '', logUser: '' };

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const s = JSON.parse(raw); if (s && s.v === 1 && s.seedDay === fmtD(now())) return s; }
  } catch (e) { /* stockage indisponible : on repart des données de démo */ }
  return seed();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignoré */ } }

/* ---------------------------------------------------------
   4. Règles métier
--------------------------------------------------------- */
const prod = id => S.products.find(p => p.id === id);
const cli = id => S.clients.find(c => c.id === id) || { name: '—', phone: '' };
const sup = id => S.suppliers.find(s => s.id === id) || { name: '—' };
const usr = id => S.users.find(u => u.id === id) || { name: '—', color: '#5B6B62', role: 'caissier' };
const me = () => usr(S.user);
const can = p => { const r = S.roles[me().role]; return !!(r && r.perms.includes(p)); };
const qtyAt = (p, d) => d === 'all' ? sum(Object.values(p.stock)) : (p.stock[d] || 0);
const ST = { rupture: ['Rupture', 'bad'], seuil: ['Seuil bas', 'warn'], perem: ['Péremption', 'info'], ok: ['En stock', 'ok'] };
function prodStatus(p, d) {
  const q = qtyAt(p, d);
  if (q <= 0) return 'rupture';
  if (q < p.min) return 'seuil';
  if (p.expiry && daysTo(p.expiry) <= 30) return 'perem';
  return 'ok';
}
const docSub = d => sum(d.lines, l => l.qty * l.price);
const docTotal = d => Math.max(0, docSub(d) - (d.discount || 0));
const docPaid = d => sum(d.payments || [], p => p.amount);
const docLeft = d => d.type === 'facture' ? Math.max(0, docTotal(d) - docPaid(d)) : 0;
function docDue(d) {
  if (d.schedule && d.schedule.length) { let c = 0; const paid = docPaid(d); for (const s of d.schedule) { c += s.amount; if (c > paid + .5) return s.date; } return null; }
  return d.due || null;
}
function docStatus(d) {
  if (d.type === 'facture') {
    const left = docLeft(d), paid = docPaid(d), due = docDue(d);
    if (left <= 0) return ['Payée', 'ok'];
    if (due && daysTo(due) < 0) return ['Échue', 'bad'];
    if (d.schedule) return ['Échéancier', 'warn'];
    if (paid > 0) return ['Partielle', 'warn'];
    return ['À crédit', 'info'];
  }
  if (d.type === 'devis') return { attente: ['En attente', 'neu'], accepte: ['Accepté', 'ok'], refuse: ['Refusé', 'bad'] }[d.status] || ['En attente', 'neu'];
  if (d.type === 'bc') return d.status === 'facture' ? ['Facturé', 'ok'] : ['À facturer', 'warn'];
  if (d.type === 'bl') return d.status === 'livre' ? ['Livré', 'ok'] : ['À livrer', 'warn'];
  if (d.type === 'avoir') return ['Remboursé', 'neu'];
  return ['Payé', 'ok'];
}
const salesOf = (dep, pred) => S.docs.filter(d => (d.type === 'ticket' || d.type === 'facture') && (dep === 'all' || d.depot === dep) && pred(d));
const clientBalance = id => sum(S.docs.filter(d => d.type === 'facture' && d.client === id), docLeft);
const clientOverdue = id => S.docs.some(d => d.type === 'facture' && d.client === id && docStatus(d)[0] === 'Échue');
const soldQty = pid => (S.soldBase[pid] || 0) + sum(S.docs.filter(d => d.type === 'ticket' || d.type === 'facture'), d => sum(d.lines.filter(l => l.pid === pid), l => l.qty));
function nextNum(type) { S.seq[type] = (S.seq[type] || 0) + 1; return DOC[type].p + pad5(S.seq[type]); }
function applyStock(pid, dep, delta, type, note, extra = {}) {
  const p = prod(pid); p.stock[dep] = (p.stock[dep] || 0) + delta;
  S.movements.unshift({ id: uid('m'), pid, date: now(), type, depot: dep, qty: delta, after: p.stock[dep], user: S.user, note, ...extra });
}
function log(text, kind = 'edit') { S.activity.unshift({ at: now(), user: S.user, kind, text }); S.activity.length = Math.min(S.activity.length, 300); }
function cartTotals() {
  const c = S.cart; let sub = 0, promo = 0;
  c.lines.forEach(l => { const p = prod(l.pid); const base = c.tarif === 'gros' ? p.wholesale : p.retail; sub += base * l.qty; promo += (base - unitPrice(p, c.tarif)) * l.qty; });
  const total = Math.max(0, sub - promo - (c.discount || 0));
  return { sub, promo, total, items: sum(c.lines, l => l.qty) };
}
function stockAlerts(dep) {
  const out = [];
  S.products.forEach(p => {
    const st = prodStatus(p, dep);
    if (st === 'rupture' || st === 'seuil') out.push({ p, st, txt: `Stock : ${qtyAt(p, dep)} · seuil ${p.min}` });
    if (p.expiry && daysTo(p.expiry) <= 30) out.push({ p, st: 'perem', txt: `Expire le ${fmtD(p.expiry)} (dans ${daysTo(p.expiry)} j)` });
  });
  return out.sort((a, b) => ['rupture', 'seuil', 'perem'].indexOf(a.st) - ['rupture', 'seuil', 'perem'].indexOf(b.st));
}
function notifs() {
  const n = stockAlerts(S.depot).map(a => ({ k: ST[a.st][1], i: a.st === 'perem' ? 'clock' : 'warn', t: a.st === 'rupture' ? `${a.p.name} en rupture` : a.st === 'seuil' ? `${a.p.name} sous le seuil` : `${a.p.name} expire bientôt`, s: a.txt, go: 'produit/' + a.p.id }));
  S.docs.filter(d => d.type === 'facture' && docStatus(d)[0] === 'Échue').forEach(d => n.push({ k: 'bad', i: 'doc', t: `Facture ${d.num} échue`, s: `${cli(d.client).name} · reste ${F(docLeft(d))}`, go: 'ventes', doc: d.id }));
  S.inventories.filter(i => i.status === 'cours').forEach(i => n.push({ k: 'neu', i: 'clip', t: `Inventaire ${i.id} en cours`, s: depName(i.depot), go: 'inventaire' }));
  return n;
}

/* ---------------------------------------------------------
   5. Briques d'interface
--------------------------------------------------------- */
const chip = (t, c) => `<span class="chip ${c}">${t}</span>`;
function av(u, s = 34) { const x = typeof u === 'string' ? usr(u) : u; return `<span class="av" style="width:${s}px;height:${s}px;background:${x.color};font-size:${Math.round(s * .36)}px">${esc(initials(x.name))}</span>`; }
const TONES = [['#E4F2E9', '#17643A'], ['#E3EEFA', '#1B5596'], ['#FCEBDD', '#9A4A0B'], ['#EFE8FA', '#5B3A99'], ['#EEF2EF', '#3D4B43']];
function pav(name, s = 34) { let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997; const t = TONES[h % TONES.length]; return `<span class="av" style="width:${s}px;height:${s}px;background:${t[0]};color:${t[1]};font-size:${Math.round(s * .35)}px">${esc(initials(name))}</span>`; }
const pInit = p => { const w = p.name.split(/\s+/); return (w[0].slice(0, 1) + (w[1] && /[a-zà-ÿ]/i.test(w[1][0]) ? w[1][0] : w[0].slice(1, 2))).toUpperCase(); };
function thumb(p, s = 38) { const t = CAT_TONE[p.cat] || TONES[4]; return `<span class="thumb" style="width:${s}px;height:${s}px;background:${t[0]};color:${t[1]}">${esc(pInit(p))}</span>`; }
function ph(title, sub, actions = '') { return `<div class="ph"><div><h1>${title}</h1>${sub ? `<p class="muted">${sub}</p>` : ''}</div><div class="ph-a">${actions}</div></div>`; }
function kpi(o) {
  const tag = o.a ? 'button' : 'div';
  return `<${tag} class="card kpi${o.a ? ' click' : ''}${o.on ? ' on' : ''}" ${o.a ? `type="button" ${o.a}` : ''}><span class="kpi-ic" style="background:${o.bg};color:${o.c}">${ic(o.i, 24)}</span><div><div class="kpi-l">${o.l}</div><div class="kpi-v num" style="color:${o.vc || o.c}">${o.v}</div>${o.s ? `<div class="kpi-s">${o.s}</div>` : ''}</div></${tag}>`;
}
const opt = (v, l, sel) => `<option value="${esc(v)}"${String(v) === String(sel) ? ' selected' : ''}>${esc(l)}</option>`;
function roleChip(role) { const r = S.roles[role] || { label: role, tone: 'neu' }; return chip(r.label, r.tone); }
function barcodeSVG(code, w = 190, h = 54) {
  const seq = [1, 0, 1];
  String(code).split('').map(Number).forEach((d, i) => { ((d * 7 + i * 3) % 16).toString(2).padStart(4, '0').split('').forEach(b => seq.push(+b)); seq.push(0, (d + i) % 2); if (i === 6) seq.push(0, 1, 0, 1, 0); });
  seq.push(1, 0, 1);
  const bw = w / seq.length; let bars = '';
  seq.forEach((b, i) => { if (b) bars += `<rect x="${(i * bw).toFixed(2)}" width="${bw.toFixed(2)}" height="${h}"/>`; });
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Code-barres ${code}"><g fill="#17221C">${bars}</g></svg>`;
}

/* Toasts */
function toast(msg, kind = 'ok') {
  const t = document.createElement('div'); t.className = 'toast ' + kind;
  t.innerHTML = ic(kind === 'ok' ? 'check' : 'warn') + `<span>${msg}</span>`;
  $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3600);
}

/* Fenêtres modales */
const MS = [];
function modal({ title, body = '', foot = '', size = 'md', mount, onClose }) {
  const ov = document.createElement('div'); ov.className = 'overlay'; const id = uid('mt');
  ov.innerHTML = `<div class="modal ${size}" role="dialog" aria-modal="true" aria-labelledby="${id}"><div class="mh"><h2 id="${id}">${title}</h2><button class="ibtn" type="button" data-x aria-label="Fermer">${ic('x')}</button></div><div class="mb">${body}</div>${foot ? `<div class="mf">${foot}</div>` : ''}</div>`;
  const prev = document.activeElement; document.body.appendChild(ov); requestAnimationFrame(() => ov.classList.add('in'));
  const m = {
    el: ov, $: s => ov.querySelector(s), $$: s => [...ov.querySelectorAll(s)],
    close() { if (!ov.isConnected) return; ov.remove(); const i = MS.indexOf(m); if (i > -1) MS.splice(i, 1); onClose && onClose(); if (prev && prev.focus && prev.isConnected) prev.focus(); },
    setBody(h) { ov.querySelector('.mb').innerHTML = h; }
  };
  ov.addEventListener('mousedown', e => { if (e.target === ov) m.close(); });
  ov.addEventListener('click', e => { if (e.target.closest('[data-x]')) m.close(); });
  MS.push(m); if (mount) mount(m);
  const f = ov.querySelector('[autofocus]') || ov.querySelector('.mb input:not([type=checkbox]):not([readonly]), .mb select, .mb textarea') || ov.querySelector('.mf .btn.pri');
  if (f) setTimeout(() => f.focus(), 40);
  return m;
}
function confirmBox(title, msg, ok, cb, danger) {
  modal({ title, size: 'sm', body: `<p class="lead">${msg}</p>`, foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn ${danger ? 'danger' : 'pri'}" type="button" data-ok>${ok}</button>`, mount: m => { m.$('[data-ok]').onclick = () => { m.close(); cb(); }; } });
}
function fieldVals(m) { const o = {}; m.$$('[name]').forEach(el => { o[el.name] = el.type === 'checkbox' ? el.checked : el.value.trim(); }); return o; }
function fieldErr(m, name, msg) { const el = m.$(`[name="${name}"]`); if (el) { el.closest('.fld')?.classList.add('err'); el.focus(); } toast(msg, 'bad'); return false; }

/* Popover (notifications, menu utilisateur) */
let POP = null;
function closePop() { if (POP) { POP.remove(); POP = null; } }
function popover(anchor, html) {
  closePop(); const r = anchor.getBoundingClientRect(); const el = document.createElement('div'); el.className = 'pop'; el.innerHTML = html;
  document.body.appendChild(el);
  el.style.top = (r.bottom + 8) + 'px'; el.style.left = Math.max(12, Math.min(window.innerWidth - el.offsetWidth - 12, r.right - el.offsetWidth)) + 'px';
  POP = el; return el;
}
document.addEventListener('mousedown', e => { if (POP && !POP.contains(e.target) && !e.target.closest('[data-a="notifs"],[data-a="userMenu"]')) closePop(); });

/* Autorisation gérant (quand l'utilisateur n'a pas le droit) */
function guard(perm, reason, cb) {
  if (can(perm)) return cb();
  const managers = S.users.filter(u => u.active && (S.roles[u.role]?.perms || []).includes(perm));
  modal({
    title: 'Autorisation requise', size: 'sm',
    body: `<div class="note o">${ic('lock')} « ${esc(reason)} » nécessite le droit <strong>${esc((PERMS.find(p => p[0] === perm) || [, perm])[1])}</strong>. Un responsable doit valider avec son code.</div>
      <label class="fld">Responsable<select name="u">${managers.map(u => opt(u.id, u.name + ' — ' + S.roles[u.role].label)).join('')}</select></label>
      <label class="fld">Code PIN<input name="pin" type="password" inputmode="numeric" maxlength="4" class="pin-in" autocomplete="off" autofocus><span class="hint">Démo : 1234</span></label>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>Autoriser</button>`,
    mount: m => {
      const go = () => { const v = fieldVals(m); const u = usr(v.u); if (u.pin !== v.pin) { m.$('.modal').classList.remove('shake'); void m.el.offsetWidth; m.$('.modal').classList.add('shake'); return toast('Code incorrect', 'bad'); } m.close(); log(`autorisé par ${u.name} : ${reason}`, 'secu'); cb(); };
      m.$('[data-ok]').onclick = go; m.$('[name=pin]').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    }
  });
}

/* Impression et téléchargements */
function printHTML(html) { $('#print-area').innerHTML = html; setTimeout(() => window.print(), 50); }
window.addEventListener('afterprint', () => { $('#print-area').innerHTML = ''; });
function dlCSV(name, rows) {
  const csv = '﻿' + rows.map(r => r.map(v => { v = String(v ?? ''); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(';')).join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  toast(`Fichier « ${name} » téléchargé`);
}

/* ---------------------------------------------------------
   6. Coquille : navigation, en-tête, routeur
--------------------------------------------------------- */
const NAV = [['dashboard', 'home', 'Tableau de bord'], ['stock', 'box', 'Stock & produits'], ['inventaire', 'clip', 'Inventaire'], ['caisse', 'pos', 'Caisse (POS)'], ['ventes', 'doc', 'Ventes & factures'], ['clients', 'users', 'Clients & fournisseurs'], ['rapports', 'chart', 'Rapports'], ['securite', 'shield', 'Utilisateurs & sécurité']];
const ALLOW = {
  dashboard: () => true, stock: () => can('stock') || can('prix') || can('compter'), produit: () => can('stock') || can('prix') || can('compter'),
  inventaire: () => can('compter') || can('inventaire'), caisse: () => can('vendre'), ventes: () => can('vendre') || can('factures'),
  clients: () => can('factures') || can('remise'), rapports: () => can('rapports'), securite: () => can('admin')
};
const ROUTES = {
  dashboard: { t: 'Tableau de bord', r: pDash }, stock: { t: 'Stock & produits', r: pStock }, produit: { t: 'Fiche produit', r: pProduit, nav: 'stock' },
  inventaire: { t: 'Inventaire', r: pInventaire }, caisse: { t: 'Caisse', r: pCaisse, m: mountCaisse }, ventes: { t: 'Ventes & factures', r: pVentes },
  clients: { t: 'Clients & fournisseurs', r: pClients }, rapports: { t: 'Rapports', r: pRapports }, securite: { t: 'Utilisateurs & sécurité', r: pSecu }
};
let CUR = 'dashboard', ARG = null;

function renderShell() {
  const nAlerts = stockAlerts(S.depot).filter(a => a.st !== 'perem').length;
  const invOpen = S.inventories.some(i => i.status === 'cours');
  $('#nav').innerHTML = NAV.filter(([k]) => ALLOW[k]()).map(([k, i, l]) => {
    const on = (ROUTES[CUR].nav || CUR) === k;
    const badge = k === 'stock' && nAlerts ? `<span class="badge">${nAlerts}</span>` : k === 'inventaire' && invOpen ? `<span class="badge g">En cours</span>` : k === 'caisse' && !S.register.open ? `<span class="badge">Fermée</span>` : '';
    return `<a href="#/${k}" class="${on ? 'on' : ''}"${on ? ' aria-current="page"' : ''}>${ic(i)}${l}${badge}</a>`;
  }).join('');
  const d = DEPOTS.find(x => x.id === S.depot);
  $('#site-card').innerHTML = `<small>Point de vente actuel</small><div class="site-row"><div><div style="font-size:14px;font-weight:600">${esc(d.site)}</div><small>${esc(d.name)}</small></div>${me().depot === 'all' ? ic('chev') : ''}</div>`;
  $('#top-ctx').innerHTML = `<strong>${esc(d.site)}</strong> <span class="muted">— ${esc(ROUTES[CUR].t)}${CUR === 'caisse' ? (S.register.open ? ' · Caisse ouverte' : ' · Caisse fermée') : ''}</span>`;
  $('#top-dot').className = 'dot' + (CUR === 'caisse' && !S.register.open ? ' off' : '');
  const n = notifs().length;
  $('#bell').innerHTML = ic('bell') + (n ? `<span class="pill">${n > 9 ? '9+' : n}</span>` : '');
  $('#bell').setAttribute('aria-label', `Notifications (${n})`);
  $('#me-btn').innerHTML = av(me(), 36);
}
function route() {
  const [r, arg] = (location.hash.replace(/^#\/?/, '') || 'dashboard').split('/');
  let key = ROUTES[r] ? r : 'dashboard';
  if (!ALLOW[key]()) { const first = NAV.find(([k]) => ALLOW[k]()); if (r && ROUTES[r]) toast(`Accès refusé à « ${ROUTES[r].t} » pour le rôle ${S.roles[me().role].label}`, 'warn'); key = first ? first[0] : 'dashboard'; if (location.hash !== '#/' + key) { location.hash = '#/' + key; return; } }
  CUR = key; ARG = arg || null;
  closePop(); document.body.classList.remove('nav-open');
  $('#view').innerHTML = ROUTES[key].r(ARG);
  ROUTES[key].m && ROUTES[key].m(ARG);
  renderShell();
}
function refresh() { const y = window.scrollY; route(); window.scrollTo(0, y); save(); }
function go(path) { if (location.hash === '#/' + path) { route(); window.scrollTo(0, 0); } else location.hash = '#/' + path; }
window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });

function tick() { const d = new Date(); const s = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }); $('#clock').textContent = s.charAt(0).toUpperCase() + s.slice(1) + ' · ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }

/* ---------------------------------------------------------
   7. Pages
--------------------------------------------------------- */

/* 7.1 Tableau de bord */
function pDash() {
  const dep = S.depot, sales = salesOf(dep, d => isToday(d.date)), ca = sum(sales, docTotal), n = sales.length;
  const stockVal = sum(S.products, p => p.buy * qtyAt(p, 'all'));
  const debtors = S.clients.filter(c => clientBalance(c.id) > 0), cre = sum(debtors, c => clientBalance(c.id)), late = S.clients.filter(c => clientOverdue(c.id)).length;
  const alerts = stockAlerts(dep);
  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return d; });
  const vals = [...S.hist7.slice(0, 6), ca], mx = Math.max(...vals, 1) * 1.1;
  const top = [...S.products].sort((a, b) => soldQty(b.id) - soldQty(a.id)).slice(0, 5), topMax = soldQty(top[0].id);
  const pays = {}; S.docs.filter(d => d.depot === dep || dep === 'all').forEach(d => (d.payments || []).filter(p => isToday(p.date)).forEach(p => { pays[p.method] = (pays[p.method] || 0) + p.amount; }));
  const payTot = sum(Object.values(pays)) || 1;
  const cost = sum(sales, d => sum(d.lines, l => l.qty * prod(l.pid).buy)), margin = ca ? (ca - cost) / ca * 100 : 0;
  const recent = [...sales].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const online = S.users.filter(u => u.active && isToday(u.last)).length;

  return ph('Tableau de bord', `Activité de ${esc(siteName(dep))} — aujourd'hui`,
    `${can('stock') ? `<button class="btn" type="button" data-a="move" data-t="in">${ic('down')}Entrée de stock</button>` : ''}${can('vendre') ? `<a class="btn pri" href="#/caisse">${ic('plus')}Nouvelle vente</a>` : ''}`)
  + `<div class="kpis">
      ${kpi({ i: 'cash', bg: '#E4F2E9', c: '#1E7A46', l: "Chiffre d'affaires", v: `${fmt(ca)} <small>FCFA</small>`, s: `Hier : ${F(S.hist7[5])}`, a: can('rapports') ? 'data-a="goto" data-to="rapports"' : '' })}
      ${kpi({ i: 'cart', bg: '#E3EEFA', c: '#1D5FA8', l: 'Ventes', v: `${n} <small>tickets &amp; factures</small>`, s: `Panier moyen ${F(n ? ca / n : 0)}`, a: 'data-a="goto" data-to="ventes" data-type="ticket"' })}
      ${kpi({ i: 'box', bg: '#E6F0EE', c: '#1F6B5E', l: 'Valeur du stock', v: `${short(stockVal)} <small>FCFA</small>`, s: `${S.products.length} références · ${DEPOTS.length} dépôts`, a: 'data-a="goto" data-to="stock"' })}
      ${kpi({ i: 'wallet', bg: '#FCEBDD', c: '#B4580F', l: 'Créances clients', v: `${fmt(cre)} <small>FCFA</small>`, s: `${debtors.length} clients · ${late} en retard`, a: 'data-a="goto" data-to="clients"' })}
    </div>
    <div class="grid-2">
      <section class="card pad stack" style="gap:16px">
        <div class="card-h"><div><h2>Chiffre d'affaires — 7 derniers jours</h2><div class="num" style="font-size:22px;font-weight:700;color:var(--g6);margin-top:6px">${F(sum(vals))}</div></div>${can('rapports') ? `<a class="btn sm" href="#/rapports">Voir les rapports ${ic('right', 16)}</a>` : ''}</div>
        <div class="bars"><div class="yax num"><span>${short(mx)}</span><span>${short(mx * 2 / 3)}</span><span>${short(mx / 3)}</span><span>0</span></div>
          <div class="plot">${days.map((d, i) => `<div class="bar-col"><div class="bar ${i === 6 ? 'on' : ''}" style="height:${Math.max(1.5, vals[i] / mx * 100)}%"><span class="tip">${F(vals[i])}</span></div><span class="bl" style="${i === 6 ? 'font-weight:600;color:var(--ink)' : ''}">${i === 6 ? 'Auj.' : DOW[d.getDay()]}</span></div>`).join('')}</div></div>
      </section>
      <section class="card pad" style="display:flex;flex-direction:column;gap:4px">
        <div class="card-h" style="margin-bottom:6px"><h2>Alertes de stock</h2>${alerts.length ? chip(alerts.length + ' alertes', 'bad') : chip('Aucune alerte', 'ok')}</div>
        ${alerts.slice(0, 5).map(a => { const t = ST[a.st]; const col = { bad: ['#FDE7E5', '#B42318'], warn: ['#FCEBDD', '#B4580F'], info: ['#E3EEFA', '#1D5FA8'] }[t[1]]; return `<a class="alert-row" href="#/produit/${a.p.id}"><span class="alert-ic" style="background:${col[0]};color:${col[1]}">${ic(a.st === 'perem' ? 'clock' : 'warn')}</span><div style="flex:1"><div class="t" style="font-weight:600">${esc(a.p.name)}</div><div class="sub">${a.txt}</div></div>${chip(t[0], t[1])}</a>`; }).join('') || '<p class="muted">Tous les produits sont au-dessus de leur seuil.</p>'}
        ${alerts.length > 5 ? `<button class="btn sm" type="button" style="margin-top:10px;align-self:flex-start" data-a="goto" data-to="stock" data-status="seuil">Voir les ${alerts.length} alertes</button>` : ''}
      </section>
    </div>
    <div class="grid-3">
      <section class="card pad stack" style="gap:14px"><h2 style="font-size:16px">Produits les plus vendus</h2>
        ${top.map(p => `<div><div style="display:flex;justify-content:space-between;font-size:13px;gap:8px"><a class="plink" style="font-weight:500" href="#/produit/${p.id}">${esc(p.name)}</a><strong class="num">${fmt(soldQty(p.id))}</strong></div><div class="hbar"><div style="width:${soldQty(p.id) / topMax * 100}%"></div></div></div>`).join('')}
      </section>
      <section class="card pad stack" style="gap:16px"><h2 style="font-size:16px">Encaissements du jour par moyen de paiement</h2>
        <div class="stackbar">${Object.entries(pays).map(([k, v]) => `<div style="width:${v / payTot * 100}%;background:${METHODS[k].c}" title="${METHODS[k].l}"></div>`).join('')}</div>
        <div class="stack">${['cash', 'om', 'momo', 'vir'].map(k => `<div class="lg-row"><span class="sw" style="background:${METHODS[k].c}"></span><span style="flex:1">${METHODS[k].l}</span><span class="num muted">${fmt(pays[k] || 0)}</span><strong class="num" style="width:44px;text-align:right">${Math.round((pays[k] || 0) / payTot * 100)} %</strong></div>`).join('')}</div>
      </section>
      <section class="card" style="padding:20px 0 8px;display:flex;flex-direction:column;gap:10px">
        <div class="card-h" style="padding:0 20px"><h2>Dernières ventes</h2><a href="#/ventes" style="font-size:13px;font-weight:600" data-a="goto" data-to="ventes" data-type="ticket">Tout voir</a></div>
        <table class="tbl"><thead><tr><th scope="col">N°</th><th scope="col">Client</th><th scope="col" class="r">Montant</th></tr></thead><tbody>
        ${recent.map(d => `<tr class="click" data-a="openDoc" data-id="${d.id}"><td class="num">${d.num}</td><td>${esc(cli(d.client).name)}</td><td class="r num">${fmt(docTotal(d))}${docLeft(d) ? ' ' + chip('Crédit', 'warn') : ''}</td></tr>`).join('') || '<tr><td colspan="3" class="empty">Aucune vente aujourd\'hui</td></tr>'}
        </tbody></table>
      </section>
    </div>
    <div class="card statusbar">
      <div style="display:flex;align-items:center;gap:12px;flex:1 1 280px"><span class="av" style="width:34px;height:34px;background:var(--g6)">${ic('check')}</span><div><div style="font-size:14px;font-weight:600;color:#17643A">Données sauvegardées</div><div class="sub">Dernière sauvegarde à ${fmtT(S.lastBackup)}${isToday(S.lastBackup) ? '' : ' le ' + fmtD(S.lastBackup)}</div></div></div>
      <div><div class="l">Factures émises</div><div class="v num">${sales.filter(d => d.type === 'facture').length}</div></div>
      <div><div class="l">Marge brute du jour</div><div class="v num">${margin.toFixed(1).replace('.', ',')} %</div></div>
      <div><div class="l">Retours / avoirs</div><div class="v num">${S.docs.filter(d => d.type === 'avoir' && isToday(d.date)).length}</div></div>
      <div><div class="l">Utilisateurs actifs aujourd'hui</div><div class="v num">${online}</div></div>
    </div>`;
}

/* 7.2 Stock & produits */
function pStock() {
  const u = S.ui, d = u.stockDepot;
  const cnt = st => S.products.filter(p => st === 'perem' ? (p.expiry && daysTo(p.expiry) <= 30) : prodStatus(p, d) === st).length;
  const cats = [...new Set(S.products.map(p => p.cat))];
  const mini = (st, l, col) => `<button type="button" class="card mini kpi click${u.stockStatus === st ? ' on' : ''}" style="display:block" data-a="stockStatus" data-s="${st}"><div class="l">${l}</div><div class="v num" style="color:${col}">${st ? cnt(st) : S.products.length}</div></button>`;
  return ph('Stock & produits', 'Suivi des entrées, sorties et niveaux de stock par dépôt',
    `<button class="btn" type="button" data-a="exportStock">${ic('down')}Exporter</button>
     ${`<button class="btn" type="button" data-a="move" data-t="tr">${ic('swap')}Transfert</button><button class="btn ghost-r" type="button" data-a="move" data-t="out">${ic('minus')}Sortie</button><button class="btn ghost-g" type="button" data-a="move" data-t="in">${ic('plus')}Entrée</button>`}
     <button class="btn pri" type="button" data-a="newProduct">${ic('plus')}Nouveau produit</button>`)
  + `<div class="kpis" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr))">
      ${mini('', 'Références actives', 'var(--ink)')}${mini('rupture', 'En rupture', '#B42318')}${mini('seuil', 'Sous le seuil minimum', '#B4580F')}${mini('perem', 'Péremption sous 30 jours', '#1D5FA8')}
    </div>
    <section class="card" style="overflow:hidden">
      <div class="tabs" role="tablist" aria-label="Dépôts">${[['all', 'Tous les dépôts'], ...DEPOTS.map(x => [x.id, x.name])].map(([k, l]) => `<button class="tab${d === k ? ' on' : ''}" type="button" role="tab" aria-selected="${d === k}" data-a="stockDepot" data-d="${k}">${l}</button>`).join('')}</div>
      <div class="toolbar">
        <label class="search">${ic('search')}<span class="sr">Rechercher un produit</span><input type="search" data-in="stockQ" data-search value="${esc(u.stockQ)}" placeholder="Nom, référence ou code-barres…"></label>
        <label class="sel-l">Catégorie<select class="in" data-in="stockCat">${opt('', 'Toutes', u.stockCat)}${cats.map(c => opt(c, c, u.stockCat)).join('')}</select></label>
        <label class="sel-l">Statut<select class="in" data-in="stockStatus">${opt('', 'Tous', u.stockStatus)}${opt('rupture', 'En rupture', u.stockStatus)}${opt('seuil', 'Seuil bas', u.stockStatus)}${opt('perem', 'Péremption proche', u.stockStatus)}${opt('ok', 'En stock', u.stockStatus)}</select></label>
        <button class="btn" type="button" data-a="scanFind">${ic('barcode')}Scanner</button>
      </div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Produit</th><th scope="col">Réf.</th><th scope="col">Catégorie</th><th scope="col" class="r">Prix d'achat</th><th scope="col" class="r">Prix détail</th><th scope="col" class="r">Prix gros</th><th scope="col" class="r">Stock</th><th scope="col" class="r">Seuil</th><th scope="col">Péremption</th><th scope="col">Statut</th><th scope="col"><span class="sr">Actions</span></th></tr></thead><tbody id="stock-body">${stockRows()}</tbody></table></div>
      <div class="tfoot" id="stock-foot">${stockFoot()}</div>
    </section>`;
}
function stockList() {
  const u = S.ui, d = u.stockDepot, q = u.stockQ.trim().toLowerCase();
  return S.products.filter(p => (!u.stockCat || p.cat === u.stockCat)
    && (!u.stockStatus || (u.stockStatus === 'perem' ? (p.expiry && daysTo(p.expiry) <= 30) : prodStatus(p, d) === u.stockStatus))
    && (!q || (p.name + ' ' + p.ref + ' ' + p.barcode).toLowerCase().includes(q)));
}
function stockRows() {
  const d = S.ui.stockDepot, list = stockList();
  if (!list.length) return `<tr><td colspan="11" class="empty">Aucun produit ne correspond à ces filtres.</td></tr>`;
  return list.map(p => {
    const q = qtyAt(p, d), st = ST[prodStatus(p, d)], cls = q <= 0 ? 'c-bad' : q < p.min ? 'c-warn' : '';
    const exp = p.expiry ? `<span class="num ${daysTo(p.expiry) <= 30 ? 'c-info b' : ''}">${fmtD(p.expiry)}</span>` : '<span class="muted">—</span>';
    return `<tr><td><div class="pcell">${thumb(p)}<div><a href="#/produit/${p.id}" class="plink">${esc(p.name)}</a><div class="sub num">${p.barcode}</div></div></div></td><td class="num">${p.ref}</td><td>${p.cat}</td>
      <td class="r num">${fmt(p.buy)}</td><td class="r num">${fmt(p.retail)}${p.promo ? ' ' + chip('−' + p.promo + ' %', 'warn') : ''}</td><td class="r num">${fmt(p.wholesale)}</td>
      <td class="r num b ${cls}">${fmt(q)}</td><td class="r num muted">${p.min}</td><td>${exp}</td><td>${chip(st[0], st[1])}</td>
      <td class="acts"><button class="ibtn sm" type="button" data-a="move" data-t="in" data-p="${p.id}" title="Entrée" aria-label="Entrée de stock — ${esc(p.name)}">${ic('plus', 16)}</button><button class="ibtn sm" type="button" data-a="move" data-t="out" data-p="${p.id}" title="Sortie" aria-label="Sortie de stock — ${esc(p.name)}">${ic('minus', 16)}</button><button class="ibtn sm" type="button" data-a="move" data-t="tr" data-p="${p.id}" title="Transfert" aria-label="Transfert — ${esc(p.name)}">${ic('swap', 16)}</button><a class="ibtn sm" href="#/produit/${p.id}" title="Ouvrir la fiche" aria-label="Fiche produit — ${esc(p.name)}">${ic('right', 16)}</a></td></tr>`;
  }).join('');
}
function stockFoot() { const l = stockList(), d = S.ui.stockDepot; return `<span>${l.length} produit${l.length > 1 ? 's' : ''} affiché${l.length > 1 ? 's' : ''} sur ${S.products.length} · ${depName(d)}</span><span>Valeur au prix d'achat : <strong class="num" style="color:var(--ink)">${F(sum(l, p => p.buy * qtyAt(p, d)))}</strong></span>`; }
function refreshStockTable() { const b = $('#stock-body'); if (b) { b.innerHTML = stockRows(); $('#stock-foot').innerHTML = stockFoot(); } }

/* 7.3 Fiche produit */
function pProduit(id) {
  const p = prod(id); if (!p) { setTimeout(() => go('stock')); return ''; }
  const st = ST[prodStatus(p, 'all')], total = qtyAt(p, 'all'), mx = Math.max(...DEPOTS.map(d => p.stock[d.id]), p.min, 1);
  const mvs = S.movements.filter(m => m.pid === id && (!S.ui.mvFilter || m.type === S.ui.mvFilter));
  const tone = { Entrée: 'ok', Vente: 'info', Sortie: 'bad', Transfert: 'neu', Ajustement: 'warn', Retour: 'pur' };
  return ph(`${esc(p.name)} ${chip(st[0], st[1])}`, `Réf. ${p.ref} · ${p.cat} · Fournisseur : ${esc(sup(p.supplier).name)}`,
    `<a class="btn" href="#/stock">${ic('right', 16).replace('<svg', '<svg style="transform:rotate(180deg)"')}Retour</a>
     <button class="btn" type="button" data-a="label" data-p="${p.id}">${ic('print')}Imprimer l'étiquette</button>
     <button class="btn" type="button" data-a="editProduct" data-p="${p.id}">${ic('edit')}Modifier</button>
     <button class="btn pri" type="button" data-a="move" data-t="in" data-p="${p.id}">${ic('plus')}Mouvement de stock</button>`)
  + `<div class="grid-3">
      <section class="card pad stack" style="align-items:center;gap:16px"><div class="photo">${ic('img', 40)}<span>[PHOTO DU PRODUIT]</span></div><div style="text-align:center">${barcodeSVG(p.barcode)}<div class="num" style="font-size:13px;letter-spacing:.12em;margin-top:6px">${p.barcode}</div></div></section>
      <section class="card pad stack" style="gap:16px"><h2 style="font-size:16px">Informations &amp; prix</h2>
        <dl class="dl"><div><dt>Référence</dt><dd class="num">${p.ref}</dd></div><div><dt>Catégorie</dt><dd>${p.cat}</dd></div><div><dt>Unité de vente</dt><dd>${esc(p.unit)}</dd></div><div><dt>Seuil minimum</dt><dd class="num">${p.min}</dd></div>
        <div><dt>Prix d'achat</dt><dd class="num">${F(p.buy)}</dd></div><div><dt>Prix de vente détail</dt><dd class="num" style="color:var(--g6)">${F(p.retail)}${p.promo ? ' ' + chip('Promo −' + p.promo + ' %', 'warn') : ''}</dd></div>
        <div><dt>Prix de gros</dt><dd class="num" style="color:var(--g6)">${F(p.wholesale)}</dd></div><div><dt>Marge détail</dt><dd class="num">${F(p.retail - p.buy)} · ${((p.retail - p.buy) / p.retail * 100).toFixed(1).replace('.', ',')} %</dd></div>
        <div><dt>Péremption</dt><dd class="num">${p.expiry ? fmtD(p.expiry) : 'Non suivie'}</dd></div><div><dt>Vendus (cumul)</dt><dd class="num">${fmt(soldQty(p.id))}</dd></div></dl>
      </section>
      <section class="card pad stack" style="gap:16px">
        <div class="card-h"><h2>Stock par dépôt</h2><span class="num" style="font-size:22px;font-weight:700">${fmt(total)} <span class="muted" style="font-size:13px;font-weight:500">${esc(p.unit.toLowerCase())}s</span></span></div>
        ${DEPOTS.map(d => { const q = p.stock[d.id], low = q < p.min; return `<div><div style="display:flex;justify-content:space-between;font-size:14px"><span>${d.name}</span><strong class="num ${q <= 0 ? 'c-bad' : low ? 'c-warn' : ''}">${q}</strong></div><div class="hbar t"><div style="width:${q / mx * 100}%;background:${low ? '#E8892B' : 'var(--g6)'}"></div></div>${low ? `<div class="sub" style="margin-top:4px">Sous le seuil (${p.min})</div>` : ''}</div>`; }).join('')}
        <div class="info-row" style="margin-top:auto;padding:12px 14px;border-radius:10px;background:#F8FAF9;font-size:13px"><span class="muted">Valeur au prix d'achat</span><strong class="num">${F(total * p.buy)}</strong></div>
        <button class="btn" type="button" data-a="move" data-t="tr" data-p="${p.id}">${ic('swap')}Transférer entre dépôts</button>
      </section>
    </div>
    <section class="card" style="overflow:hidden">
      <div class="card-h" style="padding:16px 20px"><div><h2>Historique des mouvements</h2><p class="muted" style="margin:2px 0 0;font-size:13px">Qui, quand, quelle quantité — chaque mouvement est tracé</p></div>
        <div class="ph-a"><label class="sel-l">Type<select class="in" data-in="mvFilter">${opt('', 'Tous', S.ui.mvFilter)}${['Entrée', 'Sortie', 'Vente', 'Transfert', 'Ajustement', 'Retour'].map(t => opt(t, t, S.ui.mvFilter)).join('')}</select></label><button class="btn" type="button" data-a="exportMoves" data-p="${p.id}">${ic('down')}Exporter</button></div></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Date &amp; heure</th><th scope="col">Type</th><th scope="col">Dépôt</th><th scope="col" class="r">Quantité</th><th scope="col" class="r">Stock après</th><th scope="col">Utilisateur</th><th scope="col">Pièce / motif</th></tr></thead><tbody>
      ${mvs.map(m => `<tr><td class="num">${fmtDT(m.date)}</td><td>${chip(m.type, tone[m.type] || 'neu')}</td><td>${depName(m.depot)}</td><td class="r num b ${m.qty < 0 ? 'c-bad' : 'c-ok'}">${m.qty > 0 ? '+' : '−'}${Math.abs(m.qty)}</td><td class="r num">${m.after}</td><td>${esc(usr(m.user).name)} <span class="sub">(${S.roles[usr(m.user).role]?.label.toLowerCase()})</span></td><td>${esc(m.note || '')}</td></tr>`).join('') || '<tr><td colspan="7" class="empty">Aucun mouvement pour ce filtre.</td></tr>'}
      </tbody></table></div>
    </section>`;
}

/* 7.4 Inventaire */
function curInv() { return S.inventories.find(i => i.status === 'cours'); }
function pInventaire() {
  const inv = curInv(), past = S.inventories.filter(i => i.status === 'valide');
  const head = ph('Inventaire physique', 'Comptez les quantités réelles, puis validez pour corriger les écarts',
    `${inv ? `<button class="btn" type="button" data-a="invSheet">${ic('print')}Feuille de comptage</button><button class="btn" type="button" data-a="invScan">${ic('barcode')}Compter au scanner</button>` : ''}<button class="btn pri" type="button" data-a="invNew">${ic('plus')}Nouvel inventaire</button>`);
  const side = `<section class="card pad aside" style="display:flex;flex-direction:column;gap:4px"><h2 style="font-size:16px;margin-bottom:6px">Inventaires précédents</h2>
    ${past.map(i => `<div class="list-row"><div style="display:flex;justify-content:space-between;gap:8px"><strong>${i.id}</strong>${chip('Validé', 'ok')}</div><div class="sub" style="margin-top:4px">${depName(i.depot)} · ${fmtD(i.end)} · écart <span class="num ${i.value < 0 ? 'c-bad' : 'c-ok'}">${i.value > 0 ? '+' : ''}${fmt(i.value)} FCFA</span></div></div>`).join('') || '<p class="muted">Aucun inventaire validé.</p>'}
    <div class="note" style="margin-top:10px">À la validation, chaque correction crée un mouvement « Ajustement » visible dans l'historique du produit et dans le journal d'activité.</div></section>`;
  if (!inv) return head + `<div class="split"><section class="card grow closed"><span class="big-ic" style="background:var(--g1);color:var(--g6)">${ic('clip', 34)}</span><h2>Aucun inventaire en cours</h2><p class="muted" style="max-width:420px;margin:0">Démarrez un inventaire pour un dépôt : les quantités théoriques sont figées et vous saisissez les quantités comptées.</p><button class="btn pri" type="button" data-a="invNew">${ic('plus')}Démarrer un inventaire</button></section>${side}</div>`;
  const f = S.ui.invFilter;
  return head + `<section class="card pad" id="inv-sum">${invSummary(inv)}</section>
    <div class="split"><section class="card grow" style="overflow:hidden">
      <div class="toolbar" style="justify-content:space-between">
        <label class="search">${ic('search')}<span class="sr">Rechercher</span><input type="search" data-in="invQ" data-search value="${esc(S.ui.invQ)}" placeholder="Rechercher un produit…"></label>
        <div class="seg" role="group" aria-label="Filtre">${[['tous', 'Tous'], ['ecart', `Avec écart (<span id="inv-nd">${invStats(inv).diffs}</span>)`], ['non', 'Non comptés']].map(([k, l]) => `<button type="button" class="${f === k ? 'on' : ''}" data-a="invFilter" data-f="${k}">${l}</button>`).join('')}</div>
      </div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Produit</th><th scope="col" class="r">Théorique</th><th scope="col" class="r">Compté</th><th scope="col" class="r">Écart</th><th scope="col" class="r">Valeur</th><th scope="col">Motif</th><th scope="col">Compté par</th></tr></thead><tbody id="inv-body">${invRows(inv)}</tbody></table></div>
      <div class="mf" style="background:#fff;border-radius:0"><button class="btn ghost-r left" type="button" data-a="invCancel">Annuler l'inventaire</button><button class="btn" type="button" data-a="invDraft">${ic('save')}Enregistrer le brouillon</button><button class="btn pri" type="button" data-a="invValidate">${ic('check')}Valider et corriger les écarts</button></div>
    </section>${side}</div>`;
}
function invStats(inv) {
  let diffs = 0, value = 0; const counted = Object.keys(inv.counts).length;
  Object.entries(inv.counts).forEach(([pid, c]) => { const p = prod(pid); const d = c.q - (p.stock[inv.depot] || 0); if (d) { diffs++; value += d * p.buy; } });
  return { diffs, value, counted, total: S.products.length };
}
function invSummary(inv) {
  const s = invStats(inv), pct = Math.round(s.counted / s.total * 100);
  return `<div style="display:flex;flex-wrap:wrap;gap:20px 40px;align-items:center"><div style="flex:1 1 320px;display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><strong style="font-size:16px">${inv.id} · ${depName(inv.depot)}</strong>${chip('En cours', 'warn')}</div>
      <div class="sub">Démarré le ${fmtD(inv.start)} à ${fmtT(inv.start)} par ${esc(usr(inv.user).name)}</div>
      <div class="progress"><div style="width:${pct}%"></div></div><div class="sub num">${s.counted} produits comptés sur ${s.total} (${pct} %)</div></div>
    <div><div class="sub">Comptés</div><div class="num" style="font-size:22px;font-weight:700">${s.counted}</div></div>
    <div><div class="sub">Écarts détectés</div><div class="num" style="font-size:22px;font-weight:700;color:var(--or)">${s.diffs}</div></div>
    <div><div class="sub">Valeur des écarts</div><div class="num" style="font-size:22px;font-weight:700;color:${s.value < 0 ? 'var(--rd)' : 'var(--g6)'}">${s.value > 0 ? '+' : ''}${F(s.value)}</div></div>
    <div><div class="sub">Restants</div><div class="num" style="font-size:22px;font-weight:700">${s.total - s.counted}</div></div></div>`;
}
function invRow(inv, p) {
  const theo = p.stock[inv.depot] || 0, c = inv.counts[p.id], d = c ? c.q - theo : null;
  const ec = d == null ? '<span class="muted">—</span>' : chip((d > 0 ? '+' : d < 0 ? '−' : '') + Math.abs(d), d < 0 ? 'bad' : d > 0 ? 'ok' : 'neu');
  return `<tr data-row="${p.id}"><td><div style="font-weight:600">${esc(p.name)}</div><div class="sub num">${p.ref}</div></td><td class="r num">${theo}</td>
    <td class="r"><label><span class="sr">Quantité comptée ${esc(p.name)}</span><input class="qty num${d ? ' d' : ''}" inputmode="numeric" data-in="invCount" data-p="${p.id}" value="${c ? c.q : ''}" placeholder="—"></label></td>
    <td class="r" data-c="ec">${ec}</td><td class="r num" data-c="val" style="color:${d < 0 ? 'var(--rd-t)' : d > 0 ? '#17643A' : 'var(--mut)'}">${d == null ? '—' : (d > 0 ? '+' : '') + fmt(d * p.buy)}</td>
    <td><label><span class="sr">Motif</span><select class="sel-sm" data-in="invReason" data-p="${p.id}"${d ? '' : ' disabled'}>${opt('', '—', c && c.r)}${INV_REASONS.map(r => opt(r, r, c && c.r)).join('')}</select></label></td>
    <td class="sub" data-c="by">${c ? esc(usr(c.by).name) : '—'}</td></tr>`;
}
function invRows(inv) {
  const f = S.ui.invFilter, q = S.ui.invQ.toLowerCase();
  const list = S.products.filter(p => { const c = inv.counts[p.id]; const d = c ? c.q - (p.stock[inv.depot] || 0) : 0; return (f === 'tous' || (f === 'ecart' && c && d) || (f === 'non' && !c)) && (!q || (p.name + p.ref + p.barcode).toLowerCase().includes(q)); });
  return list.map(p => invRow(inv, p)).join('') || `<tr><td colspan="7" class="empty">${f === 'ecart' ? 'Aucun écart pour le moment.' : f === 'non' ? 'Tous les produits ont été comptés.' : 'Aucun produit.'}</td></tr>`;
}

/* 7.5 Caisse */
function pCaisse() {
  if (!S.register.open) {
    const last = S.closures[0];
    return ph('Caisse (POS)', `${esc(siteName(S.depot))}`, '') + `<section class="card closed"><span class="big-ic">${ic('lock', 34)}</span><h2>La caisse est fermée</h2>
      <p class="muted" style="margin:0;max-width:440px">${last ? `Dernière clôture le ${fmtDT(last.at)} par ${esc(usr(last.user).name)} · écart de caisse ${F(last.diff)}.` : 'Ouvrez la caisse en déclarant le fond de caisse pour commencer à vendre.'}</p>
      <div class="ph-a">${last ? `<button class="btn" type="button" data-a="printZ">${ic('print')}Réimprimer le rapport Z</button>` : ''}<button class="btn pri" type="button" data-a="openRegister">${ic('key')}Ouvrir la caisse</button></div></section>`;
  }
  const cats = [...new Set(S.products.map(p => p.cat))];
  return `<div class="ph"><div><h1>Caisse 1</h1><p class="muted">${esc(usr(S.register.user).name)} · ouverte à ${fmtT(S.register.openedAt)} · fond de caisse ${F(S.register.float)} · raccourcis F2 recherche, F9 encaisser</p></div>
    <div class="ph-a"><button class="btn" type="button" data-a="held">${ic('pause')}Tickets en attente (${S.held.length})</button><button class="btn" type="button" data-a="returnModal">${ic('undo')}Retour / avoir</button><button class="btn" type="button" data-a="closeRegister">${ic('lock')}Clôturer la caisse</button></div></div>
    <div class="split">
      <section class="grow stack" style="gap:14px">
        <label class="search big">${ic('barcode', 22)}<span class="sr">Scanner ou rechercher un article</span><input id="pos-q" type="search" data-in="posQ" data-search value="${esc(S.ui.posQ)}" placeholder="Scannez le code-barres ou tapez le nom, puis Entrée…" autocomplete="off"></label>
        <div class="pills" role="group" aria-label="Catégories">${[['', 'Tous'], ...cats.map(c => [c, c]), ['promo', 'Promotions']].map(([k, l]) => `<button class="pillb${S.ui.posCat === k ? ' on' : ''}" type="button" data-a="posCat" data-c="${k}">${l}</button>`).join('')}</div>
        <div class="pos-grid" id="pos-grid">${posGrid()}</div>
      </section>
      <section class="card aside ticket" aria-label="Ticket en cours" id="pos-ticket">${posTicket()}</section>
    </div>`;
}
function posList() { const q = S.ui.posQ.trim().toLowerCase(), c = S.ui.posCat; return S.products.filter(p => (!c || (c === 'promo' ? p.promo : p.cat === c)) && (!q || (p.name + ' ' + p.ref + ' ' + p.barcode).toLowerCase().includes(q))); }
function posGrid() {
  const l = posList(); if (!l.length) return `<p class="muted">Aucun article trouvé.</p>`;
  return l.map(p => { const q = p.stock[S.depot] || 0, t = CAT_TONE[p.cat] || TONES[4]; return `<button class="tile" type="button" data-a="cartAdd" data-p="${p.id}"${q <= 0 ? ' disabled' : ''}><span class="ph-img" style="background:${t[0]};color:${t[1]}">${esc(pInit(p))}</span><span class="n">${esc(p.name)}</span><span class="f"><strong class="num" style="color:var(--g6)">${fmt(unitPrice(p, S.cart.tarif))}</strong>${q <= 0 ? chip('Rupture', 'bad') : p.promo && S.cart.tarif === 'detail' ? chip('−' + p.promo + ' %', 'warn') : `<span class="sub num">${q} en stock</span>`}</span></button>`; }).join('');
}
function posTicket() {
  const c = S.cart, t = cartTotals(), recv = num(c.recv), chg = recv - t.total;
  const quick = [...new Set([t.total, Math.ceil(t.total / 1000) * 1000, Math.ceil(t.total / 5000) * 5000, Math.ceil(t.total / 10000) * 10000])].filter(v => v > 0).slice(0, 4);
  return `<div style="padding:16px 18px;border-bottom:1px solid var(--line);display:flex;flex-direction:column;gap:12px">
      <div class="card-h"><strong style="font-size:16px">Ticket ${DOC.ticket.p}${pad5(S.seq.ticket + 1)}</strong>${c.lines.length ? `<button class="btn sm" type="button" data-a="cartClear">${ic('trash', 16)}Vider</button>` : ''}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end">
        <label class="fld" style="flex:1 1 170px">Client<select data-in="cartClient">${S.clients.map(x => opt(x.id, x.name, c.client)).join('')}</select></label>
        <button class="ibtn" type="button" data-a="newParty" data-k="client" data-from="pos" aria-label="Nouveau client" title="Nouveau client" style="border:1px solid var(--bd)">${ic('plus')}</button>
        <div class="fld">Tarif<div class="seg" role="group" aria-label="Type de prix"><button type="button" class="${c.tarif === 'detail' ? 'on' : ''}" data-a="cartTarif" data-t="detail">Détail</button><button type="button" class="${c.tarif === 'gros' ? 'on' : ''}" data-a="cartTarif" data-t="gros">Gros</button></div></div>
      </div>
    </div>
    <div style="padding:4px 18px;max-height:340px;overflow-y:auto">${c.lines.length ? c.lines.map(l => { const p = prod(l.pid), u = unitPrice(p, c.tarif); return `<div class="t-line"><div class="nm"><div>${esc(p.name)}</div><div class="sub num"${p.promo && c.tarif === 'detail' ? ' style="color:var(--or-t)"' : ''}>${fmt(u)} × ${l.qty}${p.promo && c.tarif === 'detail' ? ' · promo −' + p.promo + ' %' : ''}</div></div><div style="display:flex;align-items:center;gap:4px"><button class="step" type="button" data-a="cartQty" data-p="${p.id}" data-d="-1" aria-label="Diminuer">−</button><span class="q num">${l.qty}</span><button class="step" type="button" data-a="cartQty" data-p="${p.id}" data-d="1" aria-label="Augmenter">+</button></div><strong class="num" style="width:74px;text-align:right">${fmt(u * l.qty)}</strong></div>`; }).join('') : `<div class="t-empty">${ic('cart', 30)}<span>Scannez ou touchez un article pour commencer.</span></div>`}</div>
    <div class="totals">
      <div class="row"><span class="muted">Sous-total (${t.items} article${t.items > 1 ? 's' : ''})</span><span class="num">${fmt(t.sub)}</span></div>
      ${t.promo ? `<div class="row"><span class="muted">Remise promotion</span><span class="num c-warn">−${fmt(t.promo)}</span></div>` : ''}
      ${c.discount ? `<div class="row"><span class="muted">Remise accordée <button class="btn sm" type="button" style="min-height:26px;padding:0 6px" data-a="cartDiscountOff" aria-label="Retirer la remise">${ic('x', 14)}</button></span><span class="num c-warn">−${fmt(c.discount)}</span></div>` : ''}
      <div class="row" style="align-items:baseline;margin-top:4px"><strong style="font-size:15px">Total à payer</strong><strong class="num grand">${fmt(t.total)} <span style="font-size:14px">FCFA</span></strong></div>
    </div>
    <div style="padding:14px 18px;display:flex;flex-direction:column;gap:12px">
      <div class="pays" role="group" aria-label="Moyen de paiement">${Object.entries(METHODS).map(([k, m]) => `<button class="pay${c.method === k ? ' on' : ''}" type="button" data-a="cartPay" data-m="${k}" aria-pressed="${c.method === k}">${m.i ? ic(m.i) : `<span class="sw" style="background:${m.c}"></span>`}${m.l}</button>`).join('')}</div>
      ${c.method === 'cash' ? `<div style="display:flex;gap:10px"><label class="fld" style="flex:1">Montant reçu<input class="num" id="pos-recv" inputmode="numeric" data-in="cartRecv" value="${esc(c.recv)}" placeholder="${fmt(t.total)}"></label><div class="fld" style="flex:1">Monnaie à rendre<div class="change num${c.recv !== '' && chg < 0 ? ' neg' : ''}" id="pos-change">${c.recv === '' ? '—' : chg < 0 ? 'Manque ' + fmt(-chg) : fmt(chg)}</div></div></div>
        ${t.total ? `<div class="quick">${quick.map(v => `<button type="button" data-a="cartRecvSet" data-v="${v}">${fmt(v)}</button>`).join('')}</div>` : ''}` : c.method === 'credit' ? `<div class="note o">${c.client === 'c0' ? 'Choisissez un client pour vendre à crédit.' : `Solde actuel de ${esc(cli(c.client).name)} : <strong>${F(clientBalance(c.client))}</strong> · plafond ${F(cli(c.client).limit)}`}</div>` : c.method === 'mixte' ? `<div class="note">La répartition entre moyens de paiement vous sera demandée à l'encaissement.</div>` : `<div class="note">Référence de transaction ${METHODS[c.method].l} demandée à l'encaissement.</div>`}
      <div class="checks"><span class="muted">Reçu :</span><label><input type="checkbox" data-in="cartOpt" data-k="print"${c.print ? ' checked' : ''}>Imprimer</label><label><input type="checkbox" data-in="cartOpt" data-k="wa"${c.wa ? ' checked' : ''}>WhatsApp</label><label><input type="checkbox" data-in="cartOpt" data-k="pdf"${c.pdf ? ' checked' : ''}>PDF</label></div>
      <button class="btn pri lg" type="button" data-a="checkout"${c.lines.length ? '' : ' disabled'}>${ic('check')}Encaisser ${fmt(t.total)} FCFA</button>
      <div style="display:flex;gap:8px"><button class="btn" type="button" style="flex:1" data-a="cartDiscount"${c.lines.length ? '' : ' disabled'}>${ic('percent')}Remise</button><button class="btn" type="button" style="flex:1" data-a="hold"${c.lines.length ? '' : ' disabled'}>${ic('pause')}Mettre en attente</button></div>
    </div>`;
}
function renderPos(grid = true) { if (grid && $('#pos-grid')) $('#pos-grid').innerHTML = posGrid(); if ($('#pos-ticket')) $('#pos-ticket').innerHTML = posTicket(); save(); }
function mountCaisse() { if (S.register.open && !MS.length) setTimeout(() => $('#pos-q')?.focus(), 30); }

/* 7.6 Ventes & factures */
function pVentes() {
  const u = S.ui, type = u.docType, q = u.docQ.toLowerCase();
  const list = S.docs.filter(d => d.type === type && (!q || (d.num + ' ' + cli(d.client).name).toLowerCase().includes(q)) && (!u.docSt || docStatus(d)[0] === u.docSt)).sort((a, b) => b.date.localeCompare(a.date));
  if (!list.find(d => d.id === u.selDoc)) u.selDoc = list[0] ? list[0].id : null;
  const statuses = [...new Set(S.docs.filter(d => d.type === type).map(d => docStatus(d)[0]))];
  const sel = S.docs.find(d => d.id === u.selDoc);
  return ph('Ventes & factures', 'Devis, bons de commande, factures, bons de livraison et avoirs',
    `<button class="btn" type="button" data-a="newDoc" data-t="devis">${ic('plus')}Nouveau devis</button><button class="btn" type="button" data-a="newDoc" data-t="bc">${ic('plus')}Bon de commande</button><button class="btn pri" type="button" data-a="newDoc" data-t="facture">${ic('plus')}Nouvelle facture</button>`)
  + `<div class="split"><section class="card grow" style="overflow:hidden">
      <div class="tabs" role="tablist" aria-label="Type de document">${Object.entries(DOC).map(([k, v]) => `<button class="tab${type === k ? ' on' : ''}" type="button" role="tab" aria-selected="${type === k}" data-a="docType" data-t="${k}">${v.l}<span class="cnt">${S.docs.filter(d => d.type === k).length}</span></button>`).join('')}</div>
      <div class="toolbar"><label class="search">${ic('search')}<span class="sr">Rechercher</span><input type="search" data-in="docQ" data-search value="${esc(u.docQ)}" placeholder="N° de pièce ou client…"></label>
        <label class="sel-l">Statut<select class="in" data-in="docSt">${opt('', 'Tous', u.docSt)}${statuses.map(s => opt(s, s, u.docSt)).join('')}</select></label>
        <button class="btn" type="button" data-a="exportDocs">${ic('down')}Exporter</button></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">N°</th><th scope="col">Date</th><th scope="col">Client</th><th scope="col">Tarif</th><th scope="col" class="r">Montant</th>${type === 'facture' ? '<th scope="col" class="r">Reste dû</th>' : ''}<th scope="col">Statut</th></tr></thead><tbody>
      ${list.map(d => { const s = docStatus(d), left = docLeft(d); return `<tr class="click${d.id === u.selDoc ? ' sel' : ''}" data-a="selDoc" data-id="${d.id}" tabindex="0"><td class="num b">${d.num}</td><td class="num">${fmtD(d.date)}</td><td>${esc(cli(d.client).name)}</td><td>${d.tarif === 'gros' ? 'Gros' : 'Détail'}</td><td class="r num">${fmt(docTotal(d))}</td>${type === 'facture' ? `<td class="r num b ${left ? (s[1] === 'bad' ? 'c-bad' : 'c-warn') : 'muted'}">${fmt(left)}</td>` : ''}<td>${chip(s[0], s[1])}</td></tr>`; }).join('') || `<tr><td colspan="7" class="empty">Aucun document.</td></tr>`}
      </tbody></table></div>
      <div class="tfoot"><span>${list.length} document${list.length > 1 ? 's' : ''}</span><span>Total : <strong class="num" style="color:var(--ink)">${F(sum(list, docTotal))}</strong>${type === 'facture' ? ` · reste dû <strong class="num" style="color:var(--or-t)">${F(sum(list, docLeft))}</strong>` : ''}</span></div>
    </section>
    <section class="card aside" style="overflow:hidden;display:flex;flex-direction:column;min-width:min(100%,400px)">${sel ? docPanel(sel) : `<div class="placeholder">${ic('doc', 36)}<span>Sélectionnez un document pour l'afficher.</span></div>`}</section></div>`;
}
function docHTML(d) {
  const c = cli(d.client), s = docStatus(d), co = S.company;
  let extra = '';
  if (d.type === 'facture') {
    const paid = docPaid(d), tot = docTotal(d);
    if (d.schedule) { let cum = 0; extra += `<div class="box"><div style="font-size:13px;font-weight:600">Échéancier de paiement</div>${d.schedule.map(x => { cum += x.amount; const ok = paid + .5 >= cum, late = !ok && daysTo(x.date) < 0; return `<div class="sched${ok ? ' paid' : late ? ' late' : ''}"><span>${x.label} · ${fmtD(x.date)}</span><span class="num">${fmt(x.amount)}${ok ? ' ✓' : late ? ' · en retard' : ''}</span></div>`; }).join('')}<div class="hbar t"><div style="width:${Math.min(100, paid / tot * 100)}%"></div></div></div>`; }
    if (d.payments.length) extra += `<div class="box"><div style="font-size:13px;font-weight:600">Règlements reçus</div>${d.payments.map(p => `<div class="sched paid"><span>${fmtD(p.date)} · ${METHODS[p.method]?.l || p.method}${p.ref ? ' · ' + esc(p.ref) : ''}</span><span class="num">${fmt(p.amount)}</span></div>`).join('')}<div class="sched"><strong>Reste à payer</strong><strong class="num ${docLeft(d) ? 'c-warn' : 'c-ok'}">${F(docLeft(d))}</strong></div></div>`;
    else if (docLeft(d)) extra += `<div class="note o">Aucun règlement reçu · échéance ${docDue(d) ? 'le ' + fmtD(docDue(d)) : 'non définie'}.</div>`;
  }
  if (d.type === 'ticket') extra += `<div class="box">${d.payments.map(p => `<div class="sched paid"><span>Payé · ${METHODS[p.method]?.l}</span><span class="num">${fmt(p.amount)}</span></div>`).join('')}<div class="sub">Encaissé par ${esc(usr(d.user).name)} · ${depName(d.depot)}</div></div>`;
  if (d.type === 'devis') extra += `<div class="note">Devis valable 15 jours, jusqu'au ${fmtD(new Date(new Date(d.date).getTime() + 15 * 864e5))}.</div>`;
  if (d.type === 'bl') extra += `<div class="box"><div class="sched"><span>Réf. facture</span><strong>${esc(d.ref || '—')}</strong></div><div class="sched"><span>Statut</span><strong>${s[0]}${d.deliveredAt ? ' le ' + fmtD(d.deliveredAt) : ''}</strong></div><div class="fg" style="margin-top:8px"><div style="border:1px dashed var(--bd);border-radius:8px;height:64px;padding:6px;font-size:11px" class="muted">Signature livreur</div><div style="border:1px dashed var(--bd);border-radius:8px;height:64px;padding:6px;font-size:11px" class="muted">Signature client</div></div></div>`;
  if (d.type === 'avoir') extra += `<div class="box"><div class="sched"><span>Pièce d'origine</span><strong>${esc(d.ref || '—')}</strong></div><div class="sched"><span>Motif</span><strong>${esc(d.reason || '—')}</strong></div><div class="sched"><span>Remboursement</span><strong>${METHODS[d.method]?.l || '—'}</strong></div></div>`;
  return `<div class="doc"><div class="doc-h"><div><div class="t">${DOC[d.type].one.toUpperCase()}</div><div class="num muted" style="font-size:13px">${d.num} · ${fmtD(d.date)} ${fmtT(d.date)}</div><div class="sub" style="margin-top:6px">${esc(co.name)}<br>${esc(co.addr)} · ${esc(co.nc)}<br>${esc(co.tel)}</div></div>
    <div style="text-align:right"><div class="sub">${d.type === 'bl' ? 'Livré à' : 'Client'}</div><div style="font-weight:600;font-size:14px">${esc(c.name)}</div><div class="sub">${esc(c.city || '')}${c.phone ? ' · ' + esc(c.phone) : ''}</div><div style="margin-top:6px;display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap">${chip(d.tarif === 'gros' ? 'Tarif gros' : 'Tarif détail', 'neu')}${chip(s[0], s[1])}</div></div></div>
    <div class="tbl-wrap"><table class="tbl" style="font-size:13px"><thead><tr><th scope="col">Article</th><th scope="col" class="r">Qté</th><th scope="col" class="r">P.U.</th><th scope="col" class="r">Total</th></tr></thead><tbody>
    ${d.lines.map(l => `<tr><td>${esc(prod(l.pid)?.name || l.pid)}</td><td class="r num">${l.qty}</td><td class="r num">${fmt(l.price)}</td><td class="r num">${fmt(l.qty * l.price)}</td></tr>`).join('')}
    ${d.discount ? `<tr><td>Remise commerciale</td><td></td><td></td><td class="r num c-warn">−${fmt(d.discount)}</td></tr>` : ''}</tbody></table></div>
    <div class="tot"><strong>${d.type === 'avoir' ? 'Montant remboursé' : 'Total TTC'}</strong><strong class="num" style="font-size:22px;color:var(--g6)">${F(docTotal(d))}</strong></div>${extra}</div>`;
}
function docPanel(d) {
  const t = d.type, left = docLeft(d), b = (a, i, l, cls = '') => `<button class="btn sm ${cls}" type="button" data-a="${a}" data-id="${d.id}">${ic(i, 16)}${l}</button>`;
  let main = '';
  if (t === 'facture') main = `${left ? b('payDoc', 'cash', 'Enregistrer un paiement', 'pri') : ''}${S.docs.some(x => x.type === 'bl' && x.ref === d.num) ? '' : b('genBL', 'truck', 'Générer le bon de livraison')}${b('avoirFrom', 'undo', 'Créer un avoir')}`;
  if (t === 'devis') main = d.status === 'attente' ? `${b('convert', 'doc', 'Convertir en facture', 'pri')}${b('devisRefuse', 'x', 'Marquer refusé')}` : d.status === 'accepte' ? `<span class="sub">Devis accepté${d.converted ? ' · facturé en ' + d.converted : ''}.</span>${d.converted ? '' : b('convert', 'doc', 'Convertir en facture', 'pri')}` : '<span class="sub">Devis refusé par le client.</span>';
  if (t === 'bc') main = d.status !== 'facture' ? b('convert', 'doc', 'Facturer la commande', 'pri') : `<span class="sub">Commande facturée en ${esc(d.converted || '')}.</span>`;
  if (t === 'bl') main = d.status !== 'livre' ? b('delivered', 'check', 'Marquer comme livré', 'pri') : '';
  if (t === 'ticket') main = b('avoirFrom', 'undo', 'Retour / avoir');
  return `<div class="doc-acts">${b('printDoc', 'print', 'Imprimer')}${b('shareDoc', 'wa', 'WhatsApp', 'ghost-g').replace('data-id', 'data-ch="wa" data-id')}${b('shareDoc', 'mail', 'E-mail').replace('data-id', 'data-ch="mail" data-id')}${b('printDoc', 'down', 'PDF').replace('data-a="printDoc"', 'data-a="printDoc" data-pdf="1"')}</div>
    <div style="overflow-y:auto">${docHTML(d)}</div>${main ? `<div class="mf" style="justify-content:flex-start;border-radius:0">${main}</div>` : ''}`;
}

/* 7.7 Clients & fournisseurs */
function pClients() {
  const u = S.ui, isC = u.party === 'clients', q = u.partyQ.toLowerCase();
  const cre = sum(S.clients, c => clientBalance(c.id)), dettes = sum(S.suppliers, s => s.due);
  const lateDocs = S.docs.filter(d => d.type === 'facture' && docStatus(d)[0] === 'Échue');
  const rows = isC ? S.clients.filter(c => c.id !== 'c0' && (!q || (c.name + c.phone).toLowerCase().includes(q))) : S.suppliers.filter(s => !q || (s.name + s.phone).toLowerCase().includes(q));
  const selId = isC ? u.selClient : u.selSup;
  return ph('Clients & fournisseurs', 'Historique des achats, dettes et créances — qui doit quoi',
    `<button class="btn" type="button" data-a="newParty" data-k="supplier">${ic('plus')}Nouveau fournisseur</button><button class="btn pri" type="button" data-a="newParty" data-k="client">${ic('plus')}Nouveau client</button>`)
  + `<div class="kpis">
      ${kpi({ i: 'up', bg: '#FCEBDD', c: '#B4580F', l: 'Créances clients (à recevoir)', v: F(cre), a: 'data-a="party" data-p="clients"' })}
      ${kpi({ i: 'dn', bg: '#E3EEFA', c: '#1D5FA8', l: 'Dettes fournisseurs (à payer)', v: F(dettes), a: 'data-a="party" data-p="fournisseurs"' })}
      ${kpi({ i: 'clock', bg: '#FDE7E5', c: '#B42318', l: 'Échéances dépassées', v: `${new Set(lateDocs.map(d => d.client)).size} client(s) · ${fmt(sum(lateDocs, docLeft))}`, a: lateDocs.length ? `data-a="selParty" data-id="${lateDocs[0].client}"` : '' })}
    </div>
    <div class="split"><section class="card grow" style="overflow:hidden">
      <div class="toolbar" style="justify-content:space-between"><div class="seg" role="tablist" aria-label="Fichier"><button type="button" role="tab" aria-selected="${isC}" class="${isC ? 'on' : ''}" data-a="party" data-p="clients">Clients (${S.clients.length - 1})</button><button type="button" role="tab" aria-selected="${!isC}" class="${!isC ? 'on' : ''}" data-a="party" data-p="fournisseurs">Fournisseurs (${S.suppliers.length})</button></div>
        <label class="search" style="max-width:380px">${ic('search')}<span class="sr">Rechercher</span><input type="search" data-in="partyQ" data-search value="${esc(u.partyQ)}" placeholder="Nom ou téléphone…"></label></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr>${isC ? '<th scope="col">Client</th><th scope="col">Type</th><th scope="col">Téléphone</th><th scope="col" class="r">Achats (12 mois)</th><th scope="col" class="r">Solde dû</th><th scope="col">État</th>' : '<th scope="col">Fournisseur</th><th scope="col">Catégorie</th><th scope="col">Téléphone</th><th scope="col">Ville</th><th scope="col" class="r">Montant dû</th><th scope="col">État</th>'}</tr></thead><tbody>
      ${rows.map(x => isC ? clientRow(x, selId) : `<tr class="click${x.id === selId ? ' sel' : ''}" data-a="selParty" data-id="${x.id}" tabindex="0"><td><div class="pcell">${pav(x.name)}<strong>${esc(x.name)}</strong></div></td><td>${esc(x.cat)}</td><td class="num">${esc(x.phone)}</td><td>${esc(x.city)}</td><td class="r num b ${x.due ? 'c-info' : 'muted'}">${fmt(x.due)}</td><td>${x.due ? chip('À payer', 'info') : chip('Soldé', 'ok')}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Aucun résultat.</td></tr>'}
      </tbody></table></div></section>
      <section class="card pad aside stack" style="gap:16px">${isC ? clientPanel(cli(u.selClient)) : supplierPanel(sup(u.selSup))}</section></div>`;
}
function clientState(c) { const b = clientBalance(c.id); if (!b) return ['À jour', 'ok']; if (clientOverdue(c.id)) return ['En retard', 'bad']; if (S.docs.some(d => d.client === c.id && d.type === 'facture' && d.schedule && docLeft(d))) return ['Échéancier', 'warn']; return ['Crédit', 'info']; }
function clientRow(c, selId) { const b = clientBalance(c.id), st = clientState(c); const buys = c.hist + sum(S.docs.filter(d => d.client === c.id && (d.type === 'facture' || d.type === 'ticket')), docTotal); return `<tr class="click${c.id === selId ? ' sel' : ''}" data-a="selParty" data-id="${c.id}" tabindex="0"><td><div class="pcell">${pav(c.name)}<strong>${esc(c.name)}</strong></div></td><td>${esc(c.type)}</td><td class="num">${esc(c.phone)}</td><td class="r num">${fmt(buys)}</td><td class="r num b ${b ? 'c-' + (st[1] === 'bad' ? 'bad' : st[1]) : 'muted'}">${fmt(b)}</td><td>${chip(st[0], st[1])}</td></tr>`; }
function clientPanel(c) {
  if (!c || c.id === 'c0') return `<div class="placeholder">${ic('users', 34)}Sélectionnez un client.</div>`;
  const b = clientBalance(c.id), docs = S.docs.filter(d => d.client === c.id && (d.type === 'facture' || d.type === 'ticket')).sort((a, x) => x.date.localeCompare(a.date));
  const open = docs.filter(d => docLeft(d)).map(d => ({ d, due: docDue(d) })).filter(x => x.due).sort((a, x) => a.due.localeCompare(x.due));
  let nextAmt = 0; if (open[0]) { const d = open[0].d; if (d.schedule) { let cum = 0; for (const s of d.schedule) { cum += s.amount; if (cum > docPaid(d) + .5) { nextAmt = Math.min(s.amount, cum - docPaid(d)); break; } } } else nextAmt = docLeft(d); }
  return `<div style="display:flex;gap:12px;align-items:center">${pav(c.name, 52)}<div><div style="font-size:17px;font-weight:700">${esc(c.name)}</div><div class="sub">Client ${esc(c.type.toLowerCase())} · ${esc(c.city)} · depuis ${esc(c.since)}</div><div class="sub num">${esc(c.phone)}</div></div></div>
    <div class="fg" style="gap:10px"><div style="padding:12px;border-radius:10px;background:#FFF6EE"><div class="sub">Solde dû</div><div class="num" style="font-size:18px;font-weight:700;color:var(--or-t)">${fmt(b)}</div></div><div style="padding:12px;border-radius:10px;background:#F8FAF9"><div class="sub">Plafond de crédit</div><div class="num" style="font-size:18px;font-weight:700">${fmt(c.limit)}</div></div></div>
    ${c.limit ? `<div><div class="sub">Crédit utilisé : ${Math.round(b / c.limit * 100)} %</div><div class="hbar t"><div style="width:${Math.min(100, b / c.limit * 100)}%;background:${b > c.limit ? 'var(--rd)' : 'var(--g6)'}"></div></div></div>` : ''}
    <div><div style="font-size:13px;font-weight:600;margin-bottom:6px">Derniers achats</div>${docs.slice(0, 4).map(d => { const s = docStatus(d); return `<button type="button" class="pop-i" style="padding:8px 0;font-size:13px;justify-content:space-between" data-a="openDoc" data-id="${d.id}"><span><span class="num">${d.num}</span> · ${fmtD(d.date)}</span><span class="num">${fmt(docTotal(d))} ${chip(s[0], s[1])}</span></button>`; }).join('') || '<p class="muted">Aucun achat.</p>'}</div>
    ${open[0] ? `<div class="info-row" style="padding:12px 14px;border-radius:10px;border:1px solid var(--line);font-size:13px"><span>Prochaine échéance <strong class="num ${daysTo(open[0].due) < 0 ? 'c-bad' : ''}">${fmtD(open[0].due)}</strong>${daysTo(open[0].due) < 0 ? ' (dépassée)' : ''}</span><strong class="num">${fmt(nextAmt)}</strong></div>` : ''}
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri" type="button" style="flex:1 1 140px" data-a="clientPay" data-id="${c.id}"${b ? '' : ' disabled'}>${ic('cash')}Encaisser</button><button class="btn ghost-g" type="button" style="flex:1 1 140px" data-a="remind" data-id="${c.id}"${b ? '' : ' disabled'}>${ic('wa')}Relancer</button>
      <button class="btn" type="button" style="flex:1 1 140px" data-a="statement" data-id="${c.id}">${ic('down')}Relevé de compte</button><button class="btn" type="button" style="flex:1 1 140px" data-a="editParty" data-k="client" data-id="${c.id}">${ic('edit')}Modifier</button></div>`;
}
function supplierPanel(s) {
  if (!s || !s.id) return `<div class="placeholder">${ic('truck', 34)}Sélectionnez un fournisseur.</div>`;
  const entries = S.movements.filter(m => m.type === 'Entrée' && (m.sup === s.id || (m.note || '').includes(s.name))).slice(0, 4);
  const prods = S.products.filter(p => p.supplier === s.id);
  return `<div style="display:flex;gap:12px;align-items:center">${pav(s.name, 52)}<div><div style="font-size:17px;font-weight:700">${esc(s.name)}</div><div class="sub">Fournisseur ${esc(s.cat.toLowerCase())} · ${esc(s.city)}</div><div class="sub num">${esc(s.phone)}</div></div></div>
    <div style="padding:12px;border-radius:10px;background:var(--bl1)"><div class="sub">Montant dû au fournisseur</div><div class="num" style="font-size:20px;font-weight:700;color:var(--bl-t)">${F(s.due)}</div></div>
    <div><div style="font-size:13px;font-weight:600;margin-bottom:6px">Dernières réceptions</div>${entries.map(m => `<div class="info-row" style="font-size:13px"><span>${fmtD(m.date)} · ${esc(prod(m.pid).name)}</span><span class="num">+${m.qty}</span></div>`).join('') || '<p class="muted" style="margin:0">Aucune réception enregistrée.</p>'}</div>
    <div><div style="font-size:13px;font-weight:600;margin-bottom:6px">Produits fournis (${prods.length})</div><div class="sub">${prods.map(p => esc(p.name)).join(' · ') || '—'}</div></div>
    ${s.payments.length ? `<div><div style="font-size:13px;font-weight:600;margin-bottom:6px">Paiements effectués</div>${s.payments.slice(0, 3).map(p => `<div class="info-row" style="font-size:13px"><span>${fmtD(p.date)} · ${METHODS[p.method]?.l}</span><span class="num">${fmt(p.amount)}</span></div>`).join('')}</div>` : ''}
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri" type="button" style="flex:1 1 140px" data-a="supPay" data-id="${s.id}"${s.due ? '' : ' disabled'}>${ic('cash')}Payer</button><button class="btn" type="button" style="flex:1 1 140px" data-a="move" data-t="in" data-s="${s.id}">${ic('truck')}Réceptionner</button><button class="btn" type="button" style="flex:1 1 100%" data-a="editParty" data-k="supplier" data-id="${s.id}">${ic('edit')}Modifier</button></div>`;
}

/* 7.8 Rapports */
function series(per) {
  const todayCA = sum(salesOf('all', d => isToday(d.date)), docTotal);
  if (per === '7') { const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return d; }); return { labels: days.map((d, i) => i === 6 ? 'Auj.' : DOW[d.getDay()] + ' ' + d.getDate()), ca: [...S.hist7.slice(0, 6), todayCA], f: .25, unit: 'jour' }; }
  if (per === '30') { const lab = [], ca = []; for (let i = 29; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); lab.push(pad(d.getDate()) + '/' + pad(d.getMonth() + 1)); ca.push(i === 0 ? todayCA : i <= 6 ? S.hist7[6 - i] : Math.round(1080000 + 240000 * Math.sin(i * 1.7) + (d.getDay() === 6 ? 380000 : 0) + (d.getDay() === 0 ? -300000 : 0))); } return { labels: lab, ca, f: 1, unit: 'jour' }; }
  const base = [21.4, 22.8, 20.9, 23.6, 24.1, 25.8, 27.2, 26.4, 24.9, 29.3, 30.1, 31.2], lab = [];
  for (let i = 11; i >= 0; i--) { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i); lab.push(MONTHS[d.getMonth()]); }
  return { labels: lab, ca: base.map(v => v * 1e6), f: 11, unit: 'mois' };
}
function lineChart(labels, a, b) {
  const W = 640, H = 240, L = 54, R = 14, T = 16, B = 30, mx = Math.max(...a, 1) * 1.12, n = labels.length;
  const x = i => L + (n === 1 ? 0 : i * (W - L - R) / (n - 1)), y = v => T + (H - T - B) * (1 - v / mx);
  const path = arr => arr.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
  const step = n > 12 ? Math.ceil(n / 8) : 1;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Évolution du chiffre d'affaires et de la marge sur ${n} périodes">
    <g stroke="#EEF2EF">${[0, 1, 2, 3].map(k => `<line x1="${L}" x2="${W - R}" y1="${y(mx * k / 4)}" y2="${y(mx * k / 4)}"${k === 0 ? ' stroke="#D5DDD8"' : ''}/>`).join('')}</g>
    <g fill="#5B6B62" font-size="11" font-family="Inter,sans-serif" text-anchor="end">${[0, 1, 2, 3].map(k => `<text x="${L - 8}" y="${y(mx * k / 4) + 4}">${short(mx * k / 4)}</text>`).join('')}</g>
    <path d="${path(a)} L${x(n - 1)} ${y(0)} L${x(0)} ${y(0)} Z" fill="#1E7A46" fill-opacity=".1"/>
    <path d="${path(a)}" fill="none" stroke="#1E7A46" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${path(b)}" fill="none" stroke="#E8892B" stroke-width="2.2" stroke-dasharray="6 5" stroke-linejoin="round"/>
    ${a.map((v, i) => `<circle class="pt" cx="${x(i)}" cy="${y(v)}" r="${n > 12 ? 3 : 4.5}" fill="#1E7A46" stroke="#fff" stroke-width="1.5"><title>${labels[i]} : CA ${F(v)} · marge ${F(b[i])}</title></circle>`).join('')}
    <g fill="#5B6B62" font-size="11" font-family="Inter,sans-serif" text-anchor="middle">${labels.map((l, i) => i % step === 0 || i === n - 1 ? `<text x="${x(i)}" y="${H - 8}">${l}</text>` : '').join('')}</g></svg>`;
}
let REPORT = null;
function pRapports() {
  const per = S.ui.rp, s = series(per), mg = s.ca.map((v, i) => Math.round(v * (.205 + .012 * Math.sin(i))));
  const CA = sum(s.ca), MG = sum(mg), nb = Math.round(CA / 14930);
  const qty = p => Math.round((S.soldBase[p.id] || 0) * s.f) + sum(S.docs.filter(d => d.type === 'ticket' || d.type === 'facture'), d => sum(d.lines.filter(l => l.pid === p.id), l => l.qty));
  const rows = S.products.map(p => { const q = qty(p); return { p, q, ca: q * p.retail, cost: q * p.buy, m: q * (p.retail - p.buy), rate: (p.retail - p.buy) / p.retail * 100 }; });
  const byQ = [...rows].sort((a, b) => b.q - a.q), maxRate = Math.max(...rows.map(r => r.rate));
  const lab = { '7': '7 derniers jours', '30': '30 derniers jours', '12': '12 derniers mois' }[per];
  REPORT = { lab, CA, MG, nb, rows };
  return ph('Rapports', `Chiffre d'affaires, marges, rotation des produits et valeur du stock — ${lab}`,
    `<div class="seg dark" role="group" aria-label="Période">${[['7', '7 jours'], ['30', '30 jours'], ['12', '12 mois']].map(([k, l]) => `<button type="button" class="${per === k ? 'on' : ''}" data-a="rp" data-p="${k}">${l}</button>`).join('')}</div>
     <button class="btn" type="button" data-a="exportReport">${ic('sheet')}Excel (CSV)</button><button class="btn pri" type="button" data-a="printReport">${ic('down')}PDF</button>`)
  + `<div class="kpis">
      <div class="card mini"><div class="l">Chiffre d'affaires</div><div class="v num" style="color:var(--g6)">${short(CA)} FCFA</div><div class="sub" style="color:#17643A;font-weight:600">+8,4 % vs période précédente</div></div>
      <div class="card mini"><div class="l">Marge brute</div><div class="v num">${short(MG)} FCFA</div><div class="sub">Taux de marge ${(MG / CA * 100).toFixed(1).replace('.', ',')} %</div></div>
      <div class="card mini"><div class="l">Nombre de ventes</div><div class="v num">${fmt(nb)}</div><div class="sub">Panier moyen ${F(CA / Math.max(nb, 1))}</div></div>
      <div class="card mini"><div class="l">Valeur totale du stock</div><div class="v num">${short(sum(S.products, p => p.buy * qtyAt(p, 'all')))} FCFA</div><div class="sub">Au prix d'achat · ${DEPOTS.length} dépôts</div></div>
    </div>
    <div class="grid-2">
      <section class="card pad stack chart"><div class="card-h"><h2>Évolution du chiffre d'affaires</h2><div style="display:flex;gap:14px;font-size:12px" class="muted"><span style="display:flex;align-items:center;gap:6px"><span style="width:14px;height:3px;background:#1E7A46;border-radius:2px"></span>CA</span><span style="display:flex;align-items:center;gap:6px"><span style="width:14px;height:0;border-top:2px dashed #E8892B"></span>Marge</span></div></div>${lineChart(s.labels, s.ca, mg)}<p class="sub" style="margin:0">Survolez un point pour voir le détail par ${s.unit}.</p></section>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px">
        <section class="card pad"><h2 style="font-size:15px;margin-bottom:6px">Plus vendus</h2>${byQ.slice(0, 5).map((r, i) => `<div class="alert-row" style="padding:9px 0"><span class="thumb" style="width:24px;height:24px;border-radius:7px;background:var(--g1);color:#17643A">${i + 1}</span><a class="plink" style="flex:1;font-weight:500" href="#/produit/${r.p.id}">${esc(r.p.name)}</a><strong class="num">${fmt(r.q)}</strong></div>`).join('')}</section>
        <section class="card pad"><h2 style="font-size:15px;margin-bottom:6px">Moins vendus</h2>${byQ.slice(-5).reverse().map((r, i) => `<div class="alert-row" style="padding:9px 0"><span class="thumb" style="width:24px;height:24px;border-radius:7px;background:var(--rd1);color:var(--rd-t)">${i + 1}</span><a class="plink" style="flex:1;font-weight:500" href="#/produit/${r.p.id}">${esc(r.p.name)}</a><strong class="num">${fmt(r.q)}</strong></div>`).join('')}</section>
      </div>
    </div>
    <section class="card" style="overflow:hidden"><div class="card-h" style="padding:16px 20px"><h2>Marge bénéficiaire par produit</h2><span class="sub">Trié par marge totale · ${lab}</span></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Produit</th><th scope="col" class="r">Qté vendue</th><th scope="col" class="r">CA</th><th scope="col" class="r">Coût d'achat</th><th scope="col" class="r">Marge</th><th scope="col">Taux de marge</th></tr></thead><tbody>
      ${[...rows].sort((a, b) => b.m - a.m).map(r => `<tr><td><a class="plink" href="#/produit/${r.p.id}">${esc(r.p.name)}</a></td><td class="r num">${fmt(r.q)}</td><td class="r num">${fmt(r.ca)}</td><td class="r num">${fmt(r.cost)}</td><td class="r num b">${fmt(r.m)}</td><td><div style="display:flex;align-items:center;gap:8px"><div class="hbar" style="flex:1;max-width:140px;margin:0"><div style="width:${r.rate / maxRate * 100}%"></div></div><span class="num" style="font-size:13px">${r.rate.toFixed(1).replace('.', ',')} %</span></div></td></tr>`).join('')}
      </tbody></table></div></section>`;
}

/* 7.9 Utilisateurs & sécurité */
function pSecu() {
  const lu = S.ui.logUser, acts = S.activity.filter(a => !lu || a.user === lu).slice(0, 10);
  const kindIc = { pos: ['pos', '#E3EEFA', '#1D5FA8'], remise: ['percent', '#FCEBDD', '#B4580F'], inv: ['clip', '#E4F2E9', '#17643A'], secu: ['lock', '#FDE7E5', '#B42318'], edit: ['edit', '#EEF2EF', '#3D4B43'], stock: ['box', '#E4F2E9', '#17643A'], pay: ['cash', '#E4F2E9', '#17643A'], doc: ['doc', '#E3EEFA', '#1D5FA8'] };
  return ph('Utilisateurs & sécurité', 'Comptes, rôles et droits, journal d\'activité, sauvegardes et export comptable', `<button class="btn pri" type="button" data-a="userEdit">${ic('plus')}Nouvel utilisateur</button>`)
  + `<div class="grid-2">
      <section class="card" style="overflow:hidden"><div class="card-h" style="padding:16px 20px"><h2>Comptes utilisateurs</h2><span class="sub">${S.users.filter(u => u.active).length} actifs</span></div>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Utilisateur</th><th scope="col">Rôle</th><th scope="col">Point de vente</th><th scope="col">Dernière connexion</th><th scope="col"><span class="sr">Actions</span></th></tr></thead><tbody>
        ${S.users.map(u => `<tr style="${u.active ? '' : 'opacity:.55'}"><td><div class="pcell">${av(u)}<div><strong>${esc(u.name)}</strong>${u.id === S.user ? '<div class="sub">Vous</div>' : u.active ? '' : '<div class="sub">Désactivé</div>'}</div></div></td><td>${roleChip(u.role)}</td><td>${u.depot === 'all' ? 'Tous' : esc(siteName(u.depot))}</td><td class="num">${fmtD(u.last)} ${fmtT(u.last)}${isToday(u.last) && u.active ? ' ' + chip('Aujourd\'hui', 'ok') : ''}</td>
          <td class="acts"><button class="ibtn sm" type="button" data-a="userEdit" data-id="${u.id}" aria-label="Modifier ${esc(u.name)}" title="Modifier">${ic('edit', 16)}</button>${u.id !== S.user ? `<button class="ibtn sm" type="button" data-a="userToggle" data-id="${u.id}" aria-label="${u.active ? 'Désactiver' : 'Réactiver'} ${esc(u.name)}" title="${u.active ? 'Désactiver' : 'Réactiver'}">${ic(u.active ? 'x' : 'check', 16)}</button>` : ''}</td></tr>`).join('')}
        </tbody></table></div></section>
      <section class="card" style="overflow:hidden"><div class="card-h" style="padding:16px 20px"><h2>Rôles &amp; droits</h2><button class="btn sm" type="button" data-a="rolesEdit">${ic('edit', 16)}Modifier</button></div>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Permission</th>${Object.values(S.roles).map(r => `<th scope="col" class="c">${r.label}</th>`).join('')}</tr></thead><tbody>
        ${PERMS.map(([k, l]) => `<tr><td>${l}</td>${Object.values(S.roles).map(r => `<td class="c">${r.perms.includes(k) ? '<span class="perm-y" aria-label="Oui">✓</span>' : '<span class="perm-n" aria-label="Non">—</span>'}</td>`).join('')}</tr>`).join('')}
        </tbody></table></div><p class="sub" style="padding:0 20px 14px;margin:8px 0 0">Sans le droit requis, l'action demande le code d'un responsable.</p></section>
      <section class="card pad" style="display:flex;flex-direction:column">
        <div class="card-h" style="margin-bottom:4px"><h2>Journal d'activité</h2><div class="ph-a"><label class="sel-l"><span class="sr">Utilisateur</span><select class="in" data-in="logUser" style="min-height:38px">${opt('', 'Tous', lu)}${S.users.map(u => opt(u.id, u.name, lu)).join('')}</select></label><button class="btn sm" type="button" data-a="exportLog">${ic('down', 16)}Exporter</button></div></div>
        ${acts.map(a => { const k = kindIc[a.kind] || kindIc.edit; return `<div class="ev"><span class="ev-ic" style="background:${k[1]};color:${k[2]}">${ic(k[0], 15)}</span><div style="flex:1"><strong>${esc(usr(a.user).name)}</strong> ${esc(a.text)}<div class="sub num">${isToday(a.at) ? fmtT(a.at) : fmtDT(a.at)}</div></div></div>`; }).join('') || '<p class="muted">Aucune activité.</p>'}
      </section>
      <div class="stack" style="gap:16px">
        <section class="card pad stack"><div class="card-h"><h2>Sauvegarde automatique</h2>${chip('Activée', 'ok')}</div>
          <div style="display:flex;gap:12px;align-items:center;padding:12px 14px;border-radius:10px;background:var(--g0)"><span class="av" style="width:34px;height:34px;background:var(--g6)">${ic('check')}</span><div style="font-size:13.5px"><strong>Dernière sauvegarde : ${isToday(S.lastBackup) ? "aujourd'hui" : 'le ' + fmtD(S.lastBackup)} à ${fmtT(S.lastBackup)}</strong><div class="sub">Toutes les 4 heures · disque local + clé USB · 5 versions conservées ici</div></div></div>
          <div class="ph-a"><button class="btn" type="button" data-a="backupNow">${ic('save')}Sauvegarder maintenant</button><button class="btn" type="button" data-a="restore">${ic('refresh')}Restaurer une sauvegarde</button></div></section>
        <section class="card pad stack"><div><h2 style="font-size:16px">Export comptable</h2><p class="sub" style="margin:2px 0 0">Écritures prêtes à importer dans votre logiciel comptable (ex. Sage)</p></div>
          <div class="fg"><label class="fld">Période<select id="exp-per">${opt('m', 'Mois en cours')}${opt('p', 'Mois précédent')}${opt('all', 'Toutes les écritures')}</select></label><label class="fld">Format<select id="exp-fmt">${opt('csv', 'CSV (séparateur ;)')}${opt('xls', 'Excel (.csv compatible)')}</select></label></div>
          <div class="checks"><label><input type="checkbox" id="exp-v" checked>Ventes</label><label><input type="checkbox" id="exp-r" checked>Règlements</label><label><input type="checkbox" id="exp-a" checked>Achats</label></div>
          <button class="btn pri" type="button" data-a="exportCompta">${ic('down')}Générer l'export</button></section>
        <section class="card pad stack"><div class="card-h"><h2>Informations de l'entreprise</h2><button class="btn sm" type="button" data-a="companyEdit">${ic('edit', 16)}Modifier</button></div><div class="sub">${esc(S.company.name)} · ${esc(S.company.addr)} · ${esc(S.company.nc)} · ${esc(S.company.tel)}</div><div class="sub">Ces informations apparaissent sur les reçus, factures et bons de livraison.</div></section>
      </div>
    </div>`;
}

/* ---------------------------------------------------------
   8. Fenêtres d'action
--------------------------------------------------------- */

/* Produit : création / modification */
function mProduct(id) {
  const p = id ? prod(id) : null, cats = [...new Set(S.products.map(x => x.cat))];
  guard('prix', p ? 'Modifier un produit' : 'Créer un produit', () => modal({
    title: p ? `Modifier « ${esc(p.name)} »` : 'Nouveau produit', size: 'lg',
    body: `<div class="fg"><label class="fld" style="grid-column:1/-1">Désignation *<input name="name" value="${esc(p?.name || '')}" placeholder="Ex. Riz parfumé 25 kg"></label>
      <label class="fld">Référence<input name="ref" value="${esc(p?.ref || 'EPI-' + String(700 + S.products.length).padStart(4, '0'))}"></label>
      <label class="fld">Code-barres<input name="barcode" class="num" value="${esc(p?.barcode || '600123' + String(Date.now()).slice(-7))}"></label>
      <label class="fld">Catégorie<select name="cat">${cats.map(c => opt(c, c, p?.cat)).join('')}${opt('__new', '+ Nouvelle catégorie…')}</select></label>
      <label class="fld" id="newcat" hidden>Nom de la catégorie<input name="newcat"></label>
      <label class="fld">Unité de vente<input name="unit" value="${esc(p?.unit || 'Unité')}"></label>
      <label class="fld">Fournisseur principal<select name="supplier">${S.suppliers.map(s => opt(s.id, s.name, p?.supplier)).join('')}</select></label></div>
      <div class="sec-t">Prix</div>
      <div class="fg3"><label class="fld">Prix d'achat *<input name="buy" class="num" inputmode="numeric" value="${p?.buy || ''}"></label><label class="fld">Prix de vente détail *<input name="retail" class="num" inputmode="numeric" value="${p?.retail || ''}"></label><label class="fld">Prix de gros<input name="wholesale" class="num" inputmode="numeric" value="${p?.wholesale || ''}"></label></div>
      <div class="note g" id="margin-note">Saisissez les prix pour calculer la marge.</div>
      <div class="sec-t">Stock</div>
      <div class="fg3"><label class="fld">Seuil minimum d'alerte<input name="min" class="num" inputmode="numeric" value="${p?.min ?? 10}"></label><label class="fld">Date de péremption<input name="expiry" type="date" value="${p?.expiry || ''}"><span class="hint">Laisser vide si non périssable</span></label><label class="fld">Promotion (%)<input name="promo" class="num" inputmode="numeric" value="${p?.promo || 0}"></label></div>
      ${p ? '' : `<div class="fg3">${DEPOTS.map(d => `<label class="fld">Stock initial — ${d.name}<input name="st_${d.id}" class="num" inputmode="numeric" value="0"></label>`).join('')}</div>`}`,
    foot: `${p ? `<button class="btn ghost-r left" type="button" data-del>${ic('trash', 16)}Supprimer</button>` : ''}<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('check')}${p ? 'Enregistrer' : 'Créer le produit'}</button>`,
    mount: m => {
      const upd = () => { const v = fieldVals(m), b = num(v.buy), r = num(v.retail), w = num(v.wholesale); m.$('#newcat').hidden = v.cat !== '__new'; const n = m.$('#margin-note'); if (b && r) { const ok = r > b; n.className = 'note ' + (ok ? 'g' : 'o'); n.innerHTML = ok ? `Marge détail : <strong>${F(r - b)}</strong> (${((r - b) / r * 100).toFixed(1).replace('.', ',')} %)${w ? ` · marge gros : <strong>${F(w - b)}</strong>` : ''}` : 'Attention : le prix de vente est inférieur ou égal au prix d\'achat.'; } };
      m.el.addEventListener('input', upd); upd();
      m.$('[data-ok]').onclick = () => {
        const v = fieldVals(m); m.$$('.fld.err').forEach(x => x.classList.remove('err'));
        if (!v.name) return fieldErr(m, 'name', 'La désignation est obligatoire');
        if (!num(v.buy)) return fieldErr(m, 'buy', 'Le prix d\'achat est obligatoire');
        if (!num(v.retail)) return fieldErr(m, 'retail', 'Le prix de vente est obligatoire');
        const cat = v.cat === '__new' ? (v.newcat || 'Divers') : v.cat;
        const data = { name: v.name, ref: v.ref, barcode: v.barcode, cat, unit: v.unit || 'Unité', supplier: v.supplier, buy: num(v.buy), retail: num(v.retail), wholesale: num(v.wholesale) || num(v.retail), min: num(v.min), expiry: v.expiry || null, promo: num(v.promo) };
        if (p) { const changes = []; if (p.retail !== data.retail) changes.push(`prix détail ${fmt(p.retail)} → ${fmt(data.retail)}`); if (p.wholesale !== data.wholesale) changes.push(`prix de gros ${fmt(p.wholesale)} → ${fmt(data.wholesale)}`); Object.assign(p, data); log(`a modifié « ${p.name} »${changes.length ? ' (' + changes.join(', ') + ')' : ''}`); toast('Produit enregistré'); }
        else { const np = { id: uid('p'), ...data, stock: {} }; DEPOTS.forEach(d => { np.stock[d.id] = 0; }); S.products.push(np); DEPOTS.forEach(d => { const q = num(v['st_' + d.id]); if (q) applyStock(np.id, d.id, q, 'Entrée', 'Stock initial'); }); log(`a créé le produit « ${np.name} »`, 'stock'); toast('Produit créé'); m.close(); return go('produit/' + np.id); }
        m.close(); refresh();
      };
      const del = m.$('[data-del]'); if (del) del.onclick = () => confirmBox('Supprimer le produit', `Supprimer définitivement « ${esc(p.name)} » ? Son historique sera conservé dans le journal.`, 'Supprimer', () => { S.products = S.products.filter(x => x.id !== p.id); log(`a supprimé le produit « ${p.name} »`); m.close(); toast('Produit supprimé', 'warn'); go('stock'); }, true);
    }
  }));
}

/* Mouvements de stock : entrée, sortie, transfert */
function mMove(type = 'in', pid, supId) {
  guard('stock', 'Mouvement de stock', () => {
    const st = { type, pid: pid || '' };
    const m = modal({
      title: 'Mouvement de stock', size: 'lg', body: '',
      foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('check')}Valider le mouvement</button>`,
      mount: m => {
        const draw = () => {
          const p = prod(st.pid), t = st.type;
          m.setBody(`<div class="seg" role="group" aria-label="Type de mouvement">${[['in', 'Entrée (réception)'], ['out', 'Sortie'], ['tr', 'Transfert']].map(([k, l]) => `<button type="button" class="${t === k ? 'on' : ''}" data-t="${k}">${l}</button>`).join('')}</div>
            <div class="fg"><label class="fld" style="grid-column:1/-1">Produit *<select name="pid">${opt('', 'Choisir un produit…', st.pid)}${S.products.map(x => opt(x.id, `${x.name} — ${x.ref}`, st.pid)).join('')}</select></label>
            <label class="fld">${t === 'tr' ? 'Dépôt de départ' : 'Dépôt'}<select name="dep">${DEPOTS.map(d => opt(d.id, d.name, st.dep || S.depot)).join('')}</select></label>
            ${t === 'tr' ? `<label class="fld">Dépôt d'arrivée<select name="to">${DEPOTS.map(d => opt(d.id, d.name, st.to || DEPOTS.find(x => x.id !== (st.dep || S.depot)).id)).join('')}</select></label>` : ''}
            <label class="fld">Quantité *<input name="qty" class="num" inputmode="numeric" value="${st.qty || ''}" placeholder="0"></label>
            ${t === 'in' ? `<label class="fld">Fournisseur<select name="sup">${S.suppliers.map(s => opt(s.id, s.name, st.sup || supId || p?.supplier)).join('')}</select></label><label class="fld">N° du bon de livraison<input name="bl" placeholder="Ex. SD-77412"></label><label class="fld">Prix d'achat unitaire<input name="price" class="num" inputmode="numeric" value="${p ? p.buy : ''}"></label><label class="fld">Date de péremption du lot<input name="exp" type="date" value="${p?.expiry || ''}"></label><label class="fld" style="flex-direction:row;align-items:center;gap:8px;color:var(--ink)"><input type="checkbox" name="paid">Livraison déjà réglée au fournisseur</label>` : ''}
            ${t === 'out' ? `<label class="fld">Motif<select name="reason">${OUT_REASONS.map(r => opt(r, r)).join('')}</select></label>` : ''}
            <label class="fld" style="grid-column:1/-1">Commentaire<input name="note" placeholder="Facultatif"></label></div>
            <div class="note${p ? '' : ' o'}" id="mv-info">${p ? '' : 'Choisissez un produit.'}</div>`);
          m.$$('[data-t]').forEach(b => b.onclick = () => { keep(); st.type = b.dataset.t; draw(); });
          info();
        };
        const keep = () => { const v = fieldVals(m); st.pid = v.pid; st.dep = v.dep; st.to = v.to; st.qty = v.qty; st.sup = v.sup; };
        const info = () => { const v = fieldVals(m), p = prod(v.pid), el = m.$('#mv-info'); if (!p) { el.className = 'note o'; el.textContent = 'Choisissez un produit.'; return; } const q = num(v.qty), cur = p.stock[v.dep] || 0; let after = st.type === 'in' ? cur + q : cur - q; el.className = 'note' + (after < 0 ? ' o' : ' g'); el.innerHTML = `Stock actuel ${depName(v.dep)} : <strong>${cur}</strong> → après mouvement : <strong>${after}</strong>${st.type === 'tr' ? ` · ${depName(v.to)} : ${p.stock[v.to] || 0} → <strong>${(p.stock[v.to] || 0) + q}</strong>` : ''}${st.type === 'in' && num(v.price) ? ` · montant de la réception : <strong>${F(q * num(v.price))}</strong>` : ''}${after < 0 ? ' · stock insuffisant' : ''}`; };
        m.el.addEventListener('input', e => { if (e.target.name === 'pid') { keep(); draw(); } else info(); });
        m.$('[data-ok]').onclick = () => {
          const v = fieldVals(m), p = prod(v.pid), q = Math.round(num(v.qty));
          if (!p) return fieldErr(m, 'pid', 'Choisissez un produit');
          if (q <= 0) return fieldErr(m, 'qty', 'Saisissez une quantité positive');
          if (st.type !== 'in' && q > (p.stock[v.dep] || 0)) return fieldErr(m, 'qty', `Stock insuffisant (${p.stock[v.dep] || 0} disponibles)`);
          if (st.type === 'tr' && v.to === v.dep) return fieldErr(m, 'to', 'Choisissez un dépôt d\'arrivée différent');
          if (st.type === 'in') {
            const s = sup(v.sup), price = num(v.price) || p.buy;
            applyStock(p.id, v.dep, q, 'Entrée', `${v.bl ? 'BL ' + v.bl + ' · ' : ''}${s.name}${v.note ? ' · ' + v.note : ''}`, { sup: s.id });
            if (price !== p.buy) p.buy = price; if (v.exp) p.expiry = v.exp;
            if (!v.paid) s.due += q * price;
            log(`a réceptionné ${q} × « ${p.name} » (${s.name})`, 'stock'); toast(`Entrée enregistrée : +${q} ${p.name}`);
          } else if (st.type === 'out') {
            applyStock(p.id, v.dep, -q, 'Sortie', v.reason + (v.note ? ' · ' + v.note : ''));
            log(`a sorti ${q} × « ${p.name} » (${v.reason})`, 'stock'); toast(`Sortie enregistrée : −${q} ${p.name}`);
          } else {
            const tr = 'TR-' + pad5(++S.seq.tr);
            applyStock(p.id, v.dep, -q, 'Transfert', `${tr} → ${depName(v.to)}`); applyStock(p.id, v.to, q, 'Transfert', `${tr} ← ${depName(v.dep)}`);
            log(`a transféré ${q} × « ${p.name} » de ${depName(v.dep)} vers ${depName(v.to)}`, 'stock'); toast(`Transfert ${tr} effectué`);
          }
          m.close(); refresh();
        };
        draw();
      }
    });
  });
}

/* Étiquettes */
function mLabel(pid) {
  const p = prod(pid);
  const lbl = () => `<div class="label"><div style="font-size:13px;font-weight:600">${esc(p.name)}</div><div class="p num">${F(unitPrice(p, 'detail'))}</div>${p.promo ? `<div class="sub" style="text-decoration:line-through">${F(p.retail)}</div>` : ''}${barcodeSVG(p.barcode, 180, 40)}<div class="num" style="font-size:11px;letter-spacing:.1em">${p.barcode}</div></div>`;
  modal({
    title: 'Imprimer des étiquettes', size: 'md',
    body: `<div class="label-prev">${lbl()}</div><div class="fg"><label class="fld">Nombre d'étiquettes<input name="n" class="num" inputmode="numeric" value="${Math.max(1, p.stock[S.depot] || 1)}"></label><label class="fld">Format<select name="f">${opt('a4', 'Planche A4 (24 par page)')}${opt('roll', 'Rouleau thermique 58 mm')}</select></label></div>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('print')}Imprimer</button>`,
    mount: m => { m.$('[data-ok]').onclick = () => { const n = Math.min(200, Math.max(1, Math.round(num(fieldVals(m).n)))); m.close(); printHTML(`<div class="label-prev">${Array(n).fill(lbl()).join('')}</div>`); toast(`${n} étiquette(s) envoyée(s) à l'impression`); }; }
  });
}

/* Recherche par scanner (stock) */
function mScanFind() {
  modal({
    title: 'Rechercher par code-barres', size: 'sm',
    body: `<div class="note">Scannez l'article (le lecteur agit comme un clavier) ou tapez le code puis Entrée.</div><label class="fld">Code-barres ou référence<input name="code" class="num" autofocus autocomplete="off"></label><div id="scan-r"></div>`,
    mount: m => { m.$('[name=code]').addEventListener('keydown', e => { if (e.key !== 'Enter') return; const v = e.target.value.trim().toLowerCase(); const p = S.products.find(x => x.barcode === v || x.ref.toLowerCase() === v) || S.products.find(x => x.name.toLowerCase().includes(v)); if (p) { m.close(); go('produit/' + p.id); } else { m.$('#scan-r').innerHTML = '<div class="note o">Aucun produit trouvé pour ce code.</div>'; e.target.select(); } }); }
  });
}

/* Caisse : ouverture, clôture, remise, attente, paiement mixte, reçu, retour */
function mOpenRegister() {
  modal({
    title: 'Ouvrir la caisse', size: 'sm',
    body: `<div class="info-row"><span class="muted">Caissier</span><strong>${esc(me().name)}</strong></div><div class="info-row"><span class="muted">Point de vente</span><strong>${esc(siteName(S.depot))}</strong></div><label class="fld">Fond de caisse (espèces) *<input name="f" class="num" inputmode="numeric" value="50000" autofocus></label>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('key')}Ouvrir la caisse</button>`,
    mount: m => { m.$('[data-ok]').onclick = () => { const f = num(fieldVals(m).f); S.register = { open: true, openedAt: now(), float: f, user: S.user }; log(`a ouvert la caisse (fond ${F(f)})`, 'pos'); m.close(); toast('Caisse ouverte'); refresh(); }; }
  });
}
function registerFigures() {
  const since = S.register.openedAt, docs = S.docs.filter(d => d.depot === S.depot && d.date >= since);
  const by = {}; S.docs.forEach(d => (d.payments || []).filter(p => p.date >= since && (d.depot === S.depot)).forEach(p => { by[p.method] = (by[p.method] || 0) + p.amount; }));
  const refunds = sum(docs.filter(d => d.type === 'avoir' && d.method === 'cash'), docTotal);
  return { by, refunds, expected: S.register.float + (by.cash || 0) - refunds, count: docs.filter(d => d.type === 'ticket').length, total: sum(docs.filter(d => d.type === 'ticket' || d.type === 'facture'), docTotal) };
}
function mCloseRegister() {
  const f = registerFigures();
  modal({
    title: 'Clôturer la caisse — rapport Z', size: 'md',
    body: `<div class="box stack" style="gap:2px"><div class="info-row"><span class="muted">Ouverte à</span><strong>${fmtT(S.register.openedAt)} par ${esc(usr(S.register.user).name)}</strong></div><div class="info-row"><span class="muted">Tickets encaissés</span><strong class="num">${f.count}</strong></div><div class="info-row"><span class="muted">Chiffre d'affaires de la session</span><strong class="num">${F(f.total)}</strong></div></div>
      <div class="sec-t">Encaissements</div><div class="box stack" style="gap:2px">${['cash', 'om', 'momo', 'vir'].map(k => `<div class="info-row"><span>${METHODS[k].l}</span><span class="num">${F(f.by[k] || 0)}</span></div>`).join('')}<div class="info-row"><span>Remboursements espèces</span><span class="num c-bad">−${F(f.refunds)}</span></div></div>
      <div class="fg"><div class="fld">Espèces attendues<input readonly class="num" value="${F(f.expected)}"><span class="hint">Fond ${F(S.register.float)} + espèces encaissées − remboursements</span></div><label class="fld">Espèces comptées *<input name="counted" class="num" inputmode="numeric" placeholder="Comptez le tiroir" autofocus></label></div>
      <div class="note" id="z-diff">Saisissez le montant compté pour calculer l'écart.</div>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('lock')}Clôturer et imprimer le Z</button>`,
    mount: m => {
      m.el.addEventListener('input', () => { const c = fieldVals(m).counted, d = num(c) - f.expected, el = m.$('#z-diff'); if (c === '') return; el.className = 'note ' + (d === 0 ? 'g' : 'o'); el.innerHTML = d === 0 ? 'Caisse juste : aucun écart.' : `Écart de caisse : <strong>${d > 0 ? '+' : ''}${F(d)}</strong> (${d > 0 ? 'excédent' : 'manquant'})`; });
      m.$('[data-ok]').onclick = () => { const c = fieldVals(m).counted; if (c === '') return fieldErr(m, 'counted', 'Saisissez les espèces comptées'); const z = { at: now(), user: S.user, openedAt: S.register.openedAt, float: S.register.float, ...f, counted: num(c), diff: num(c) - f.expected }; S.closures.unshift(z); S.register = { ...S.register, open: false }; log(`a clôturé la caisse (écart ${F(z.diff)})`, 'pos'); m.close(); printZ(z); toast('Caisse clôturée'); refresh(); };
    }
  });
}
function printZ(z = S.closures[0]) { if (!z) return; const co = S.company; printHTML(`<div class="receipt"><div class="ctr"><strong>${esc(co.name)}</strong><br>${esc(siteName(S.depot))}<br>RAPPORT Z — CLÔTURE</div><hr><div class="rw"><span>Ouverture</span><span>${fmtDT(z.openedAt)}</span></div><div class="rw"><span>Clôture</span><span>${fmtDT(z.at)}</span></div><div class="rw"><span>Caissier</span><span>${esc(usr(z.user).name)}</span></div><hr><div class="rw"><span>Tickets</span><span>${z.count}</span></div><div class="rw"><span>CA session</span><span>${fmt(z.total)}</span></div>${['cash', 'om', 'momo', 'vir'].map(k => `<div class="rw"><span>${METHODS[k].l}</span><span>${fmt(z.by[k] || 0)}</span></div>`).join('')}<hr><div class="rw"><span>Fond de caisse</span><span>${fmt(z.float)}</span></div><div class="rw"><span>Espèces attendues</span><span>${fmt(z.expected)}</span></div><div class="rw"><span>Espèces comptées</span><span>${fmt(z.counted)}</span></div><div class="rw"><strong>Écart</strong><strong>${fmt(z.diff)}</strong></div></div>`); }
function mDiscount() {
  const t = cartTotals();
  guard('remise', 'Accorder une remise', () => modal({
    title: 'Accorder une remise', size: 'sm',
    body: `<div class="seg" role="group" aria-label="Type de remise"><button type="button" class="on" data-k="amt">Montant (FCFA)</button><button type="button" data-k="pct">Pourcentage (%)</button></div><label class="fld">Valeur<input name="v" class="num" inputmode="numeric" autofocus></label><div class="note g" id="d-prev">Total actuel : ${F(t.total + (S.cart.discount || 0))}</div>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>Appliquer</button>`,
    mount: m => {
      let k = 'amt'; const base = t.total + (S.cart.discount || 0);
      const calc = () => { const v = num(fieldVals(m).v); return Math.min(base, Math.round(k === 'pct' ? base * v / 100 : v)); };
      m.$$('[data-k]').forEach(b => b.onclick = () => { k = b.dataset.k; m.$$('[data-k]').forEach(x => x.classList.toggle('on', x === b)); m.el.dispatchEvent(new Event('input')); });
      m.el.addEventListener('input', () => { m.$('#d-prev').innerHTML = `Remise : <strong>${F(calc())}</strong> · nouveau total : <strong>${F(base - calc())}</strong>`; });
      m.$('[data-ok]').onclick = () => { S.cart.discount = calc(); log(`a accordé une remise de ${F(S.cart.discount)} en caisse`, 'remise'); m.close(); renderPos(false); };
    }
  }));
}
function mHeld() {
  modal({
    title: 'Tickets en attente', size: 'md',
    body: S.held.length ? S.held.map(h => `<div class="box" style="display:flex;align-items:center;gap:12px"><div style="flex:1"><strong>${esc(cli(h.cart.client).name)}</strong><div class="sub">${fmtT(h.at)} · ${sum(h.cart.lines, l => l.qty)} articles · ${esc(usr(h.user).name)}</div></div><button class="btn sm" type="button" data-del="${h.id}">${ic('trash', 16)}</button><button class="btn sm pri" type="button" data-res="${h.id}">Reprendre</button></div>`).join('') : `<div class="placeholder" style="padding:30px">${ic('pause', 30)}Aucun ticket en attente.</div>`,
    mount: m => {
      m.$$('[data-res]').forEach(b => b.onclick = () => { const i = S.held.findIndex(h => h.id === b.dataset.res); const h = S.held.splice(i, 1)[0]; if (S.cart.lines.length) S.held.push({ id: uid('h'), at: now(), user: S.user, cart: S.cart }); S.cart = h.cart; m.close(); refresh(); toast('Ticket repris'); });
      m.$$('[data-del]').forEach(b => b.onclick = () => { S.held = S.held.filter(h => h.id !== b.dataset.del); m.close(); refresh(); toast('Ticket en attente supprimé', 'warn'); });
    }
  });
}
function mMixed(total, cb) {
  modal({
    title: 'Paiement mixte', size: 'sm',
    body: `<div class="info-row"><span>Total à payer</span><strong class="num">${F(total)}</strong></div>${['cash', 'om', 'momo', 'vir'].map((k, i) => `<label class="fld">${METHODS[k].l}<input name="${k}" class="num" inputmode="numeric" value="${i === 0 ? total : ''}"${i === 0 ? ' autofocus' : ''}></label>`).join('')}<div class="note" id="mx">Reste à répartir : 0 FCFA</div>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>Valider</button>`,
    mount: m => {
      const left = () => total - sum(['cash', 'om', 'momo', 'vir'], k => num(fieldVals(m)[k]));
      m.el.addEventListener('input', () => { const l = left(); m.$('#mx').className = 'note ' + (l === 0 ? 'g' : 'o'); m.$('#mx').textContent = l === 0 ? 'Répartition complète.' : l > 0 ? `Reste à répartir : ${F(l)}` : `Trop perçu : ${F(-l)}`; });
      m.$('[data-ok]').onclick = () => { if (left() !== 0) return toast('La somme des paiements doit égaler le total', 'bad'); const v = fieldVals(m); m.close(); cb(['cash', 'om', 'momo', 'vir'].filter(k => num(v[k]) > 0).map(k => ({ date: now(), amount: num(v[k]), method: k }))); };
    }
  });
}
function mMobileRef(method, total, cb) {
  modal({
    title: `Paiement ${METHODS[method].l}`, size: 'sm',
    body: `<div class="info-row"><span>Montant</span><strong class="num">${F(total)}</strong></div><label class="fld">Numéro du payeur<input name="tel" inputmode="tel" placeholder="6XX XX XX XX" autofocus></label><label class="fld">Référence de la transaction<input name="ref" placeholder="Ex. MP2610.1234.A56789"><span class="hint">Visible dans le SMS de confirmation reçu par la boutique</span></label>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('check')}Confirmer le paiement</button>`,
    mount: m => { m.$('[data-ok]').onclick = () => { const v = fieldVals(m); if (!v.ref) return fieldErr(m, 'ref', 'Saisissez la référence de la transaction'); m.close(); cb(v.ref); }; }
  });
}
function checkout() {
  const c = S.cart; if (!c.lines.length) return toast('Le ticket est vide', 'warn');
  for (const l of c.lines) { const p = prod(l.pid); if (l.qty > (p.stock[S.depot] || 0)) return toast(`Stock insuffisant pour ${p.name} (${p.stock[S.depot] || 0} disponibles)`, 'bad'); }
  const t = cartTotals();
  if (c.method === 'credit') {
    if (c.client === 'c0') return toast('Sélectionnez un client pour vendre à crédit', 'warn');
    const cl = cli(c.client), after = clientBalance(cl.id) + t.total;
    const go2 = () => guard('remise', 'Vente à crédit', () => finalize([], 'facture'));
    if (after > cl.limit) return confirmBox('Plafond de crédit dépassé', `Après cette vente, ${esc(cl.name)} devra ${F(after)} pour un plafond de ${F(cl.limit)}. Continuer avec l'accord d'un responsable ?`, 'Continuer', () => guard('admin', 'Dépassement du plafond de crédit', () => finalize([], 'facture')), true);
    return go2();
  }
  if (c.method === 'mixte') return mMixed(t.total, pays => finalize(pays, 'ticket'));
  if (c.method === 'om' || c.method === 'momo') return mMobileRef(c.method, t.total, ref => finalize([{ date: now(), amount: t.total, method: c.method, ref }], 'ticket'));
  if (c.method === 'vir') return mMobileRef('vir', t.total, ref => finalize([{ date: now(), amount: t.total, method: 'vir', ref }], 'ticket'));
  if (c.recv !== '' && num(c.recv) < t.total) return toast('Montant reçu insuffisant', 'bad');
  finalize([{ date: now(), amount: t.total, method: 'cash' }], 'ticket');
}
function finalize(pays, type) {
  const c = S.cart, change = c.method === 'cash' && c.recv !== '' ? num(c.recv) - cartTotals().total : 0;
  const d = { id: uid('d'), type, num: nextNum(type), client: c.client, date: now(), tarif: c.tarif, lines: c.lines.map(l => ({ pid: l.pid, qty: l.qty, price: unitPrice(prod(l.pid), c.tarif) })), discount: c.discount || 0, payments: pays, depot: S.depot, user: S.user };
  if (type === 'facture') d.due = D(30);
  S.docs.push(d); d.lines.forEach(l => applyStock(l.pid, S.depot, -l.qty, 'Vente', `${DOC[type].one} ${d.num}`));
  log(`a encaissé ${type === 'ticket' ? 'le ticket' : 'la vente à crédit'} ${d.num} · ${F(docTotal(d))}`, 'pos');
  const o = { print: c.print, wa: c.wa, pdf: c.pdf };
  S.cart = { ...freshCart(), print: c.print, wa: c.wa, pdf: c.pdf };
  S.ui.posQ = ''; refresh(); mReceipt(d, change, o);
}
function receiptHTML(d, change = 0) {
  const co = S.company;
  return `<div class="receipt"><div class="ctr"><strong>${esc(co.name)}</strong><br>${esc(siteName(d.depot))} · ${esc(co.tel)}<br>${esc(co.nc)}</div><hr>
    <div class="rw"><span>${DOC[d.type].one} ${d.num}</span><span>${fmtDT(d.date)}</span></div><div class="rw"><span>Client</span><span>${esc(cli(d.client).name)}</span></div><div class="rw"><span>Caissier</span><span>${esc(usr(d.user).name)}</span></div><hr>
    ${d.lines.map(l => `<div>${esc(prod(l.pid)?.name)}</div><div class="rw"><span>&nbsp;&nbsp;${l.qty} × ${fmt(l.price)}</span><span>${fmt(l.qty * l.price)}</span></div>`).join('')}
    ${d.discount ? `<div class="rw"><span>Remise</span><span>−${fmt(d.discount)}</span></div>` : ''}<hr>
    <div class="rw" style="font-size:15px"><strong>TOTAL</strong><strong>${fmt(docTotal(d))} FCFA</strong></div>
    ${d.payments.map(p => `<div class="rw"><span>${METHODS[p.method].l}${p.ref ? ' (' + esc(p.ref) + ')' : ''}</span><span>${fmt(p.amount)}</span></div>`).join('')}
    ${change > 0 ? `<div class="rw"><span>Monnaie rendue</span><span>${fmt(change)}</span></div>` : ''}${d.type === 'facture' ? `<div class="rw"><span>À payer avant le</span><span>${fmtD(d.due)}</span></div>` : ''}<hr><div class="ctr">Merci de votre visite !</div></div>`;
}
function mReceipt(d, change, o = {}) {
  modal({
    title: 'Vente enregistrée', size: 'md',
    body: `<div class="ok-big"><span class="c">${ic('check', 28)}</span><strong style="font-size:18px">${F(docTotal(d))}</strong>${change > 0 ? `<div class="note g" style="font-size:16px">Monnaie à rendre : <strong>${F(change)}</strong></div>` : ''}</div>${receiptHTML(d, change)}`,
    foot: `<button class="btn ghost-g" type="button" data-wa>${ic('wa')}WhatsApp</button><button class="btn" type="button" data-pdf>${ic('down')}PDF</button><button class="btn" type="button" data-pr>${ic('print')}Imprimer</button><button class="btn pri" type="button" data-x>${ic('plus')}Nouvelle vente</button>`,
    onClose: () => { if (CUR === 'caisse') $('#pos-q')?.focus(); },
    mount: m => {
      m.$('[data-pr]').onclick = () => printHTML(receiptHTML(d, change)); m.$('[data-pdf]').onclick = () => { printHTML(receiptHTML(d, change)); toast('Choisissez « Enregistrer au format PDF » dans la fenêtre d\'impression'); };
      m.$('[data-wa]').onclick = () => mShare(d, 'wa');
      if (o.print) setTimeout(() => toast('Reçu envoyé à l\'imprimante ticket'), 300);
      if (o.wa) setTimeout(() => cli(d.client).phone ? toast(`Reçu envoyé par WhatsApp au ${cli(d.client).phone}`) : toast('Client comptoir : pas de numéro WhatsApp', 'warn'), 600);
    }
  });
}
function mReturn(preId) {
  const docs = S.docs.filter(d => d.type === 'ticket' || d.type === 'facture').sort((a, b) => b.date.localeCompare(a.date)).slice(0, 40);
  modal({
    title: 'Retour d\'articles / avoir', size: 'lg', body: '',
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('undo')}Enregistrer l'avoir</button>`,
    mount: m => {
      let id = preId || docs[0]?.id;
      const returned = (d, pid) => sum(S.docs.filter(x => x.type === 'avoir' && x.ref === d.num), x => sum(x.lines.filter(l => l.pid === pid), l => l.qty));
      const draw = () => {
        const d = S.docs.find(x => x.id === id);
        m.setBody(`<label class="fld">Pièce d'origine (ticket ou facture)<select name="doc">${docs.map(x => opt(x.id, `${x.num} · ${fmtDT(x.date)} · ${cli(x.client).name} · ${fmt(docTotal(x))} FCFA`, id)).join('')}</select></label>
          ${d ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Article</th><th scope="col" class="r">Vendu</th><th scope="col" class="r">Déjà retourné</th><th scope="col" class="r">P.U.</th><th scope="col" class="r">Qté à retourner</th></tr></thead><tbody>${d.lines.map((l, i) => { const r = returned(d, l.pid); return `<tr><td>${esc(prod(l.pid)?.name)}</td><td class="r num">${l.qty}</td><td class="r num">${r}</td><td class="r num">${fmt(l.price)}</td><td class="r"><input class="qty num" name="q${i}" inputmode="numeric" value="0" data-max="${l.qty - r}" aria-label="Quantité à retourner"${l.qty - r <= 0 ? ' disabled' : ''}></td></tr>`; }).join('')}</tbody></table></div>` : ''}
          <div class="fg"><label class="fld">Motif<select name="reason">${['Produit endommagé', 'Produit périmé', 'Erreur de commande', 'Client insatisfait'].map(r => opt(r, r)).join('')}</select></label><label class="fld">Remboursement<select name="method">${opt('cash', 'Espèces')}${opt('om', 'Orange Money')}${opt('momo', 'MTN MoMo')}${d && d.type === 'facture' ? opt('credit', 'Déduire du solde client') : ''}</select></label>
          <label class="fld" style="flex-direction:row;align-items:center;gap:8px;color:var(--ink)"><input type="checkbox" name="restock" checked>Remettre les articles en stock</label></div>
          <div class="note g" id="rt">Montant de l'avoir : 0 FCFA</div>`);
        m.$('[name=doc]').onchange = e => { id = e.target.value; draw(); };
      };
      const amount = () => { const d = S.docs.find(x => x.id === id); return d ? d.lines.reduce((s, l, i) => s + Math.min(num(m.$(`[name=q${i}]`)?.value), num(m.$(`[name=q${i}]`)?.dataset.max)) * l.price, 0) : 0; };
      m.el.addEventListener('input', () => { const t = m.$('#rt'); if (t) t.innerHTML = `Montant de l'avoir : <strong>${F(amount())}</strong>`; });
      m.$('[data-ok]').onclick = () => {
        const d = S.docs.find(x => x.id === id), v = fieldVals(m);
        const lines = d.lines.map((l, i) => ({ pid: l.pid, qty: Math.min(Math.round(num(v['q' + i])), num(m.$(`[name=q${i}]`).dataset.max)), price: l.price })).filter(l => l.qty > 0);
        if (!lines.length) return toast('Indiquez au moins un article à retourner', 'warn');
        guard('retours', 'Retour / avoir', () => {
          const av = { id: uid('d'), type: 'avoir', num: nextNum('avoir'), client: d.client, date: now(), tarif: d.tarif, lines, discount: 0, payments: [], depot: S.depot, user: S.user, ref: d.num, reason: v.reason, method: v.method };
          S.docs.push(av); if (v.restock) lines.forEach(l => applyStock(l.pid, S.depot, l.qty, 'Retour', `Avoir ${av.num} (${d.num})`));
          if (v.method === 'credit') d.payments.push({ date: now(), amount: docTotal(av), method: 'credit', ref: av.num });
          log(`a créé l'avoir ${av.num} sur ${d.num} · ${F(docTotal(av))}`, 'doc'); m.close(); toast(`Avoir ${av.num} enregistré`); refresh();
        });
      };
      draw();
    }
  });
}

/* Documents commerciaux : création / conversion */
function mDocEditor(type, from) {
  const run = () => {
    const ed = { client: from ? from.client : 'c0', tarif: from ? from.tarif : 'detail', lines: from ? from.lines.map(l => ({ ...l })) : [{ pid: '', qty: 1, price: 0 }], discount: from ? from.discount || 0 : 0, acompte: 0, method: 'cash', n: 0, every: 30 };
    const title = from ? `Convertir ${from.num} en facture` : `${type === 'devis' ? 'Nouveau devis' : type === 'bc' ? 'Nouveau bon de commande' : 'Nouvelle facture'}`;
    const m = modal({
      title, size: 'xl',
      body: `<div class="fg3"><div class="fld">Client *<div style="display:flex;gap:8px"><select name="client" style="flex:1">${S.clients.map(c => opt(c.id, c.name, ed.client)).join('')}</select><button class="btn" type="button" data-newc aria-label="Nouveau client">${ic('plus')}</button></div></div>
          <div class="fld">Tarif appliqué<div class="seg" role="group" aria-label="Tarif"><button type="button" data-tarif="detail" class="${ed.tarif === 'detail' ? 'on' : ''}">Détail</button><button type="button" data-tarif="gros" class="${ed.tarif === 'gros' ? 'on' : ''}">Gros</button></div></div>
          <label class="fld">Date<input readonly value="${fmtD(now())}"></label></div>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col" style="min-width:260px">Article</th><th scope="col" class="r">Dispo.</th><th scope="col" class="r">Qté</th><th scope="col" class="r">P.U.</th><th scope="col" class="r">Total</th><th scope="col"><span class="sr">Retirer</span></th></tr></thead><tbody id="ed-lines"></tbody></table></div>
        <div><button class="btn sm" type="button" data-addl>${ic('plus', 16)}Ajouter un article</button></div>
        <div class="split" style="align-items:stretch"><div class="grow stack" id="ed-pay"></div><div class="aside box stack" style="gap:6px"><div class="info-row"><span class="muted">Sous-total</span><span class="num" id="ed-sub"></span></div><label class="info-row" style="align-items:center"><span class="muted">Remise</span><input class="qty num" data-p="discount" value="${ed.discount || ''}" placeholder="0" inputmode="numeric"${can('remise') ? '' : ' readonly title="Remise réservée au gérant"'}></label><div id="ed-tot"></div></div></div>`,
      foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('check')}Enregistrer ${type === 'devis' ? 'le devis' : type === 'bc' ? 'la commande' : 'la facture'}</button>`,
      mount: m => {
        const total = () => Math.max(0, sum(ed.lines.filter(l => l.pid), l => l.qty * l.price) - ed.discount);
        const drawLines = () => {
          m.$('#ed-lines').innerHTML = ed.lines.map((l, i) => { const p = prod(l.pid), dispo = p ? p.stock[S.depot] || 0 : null; return `<tr><td><select class="sel-sm" style="width:100%" data-l="pid" data-i="${i}" aria-label="Article ${i + 1}">${opt('', 'Choisir…', l.pid)}${S.products.map(x => opt(x.id, x.name, l.pid)).join('')}</select></td><td class="r num ${p && l.qty > dispo ? 'c-bad b' : 'muted'}">${p ? dispo : '—'}</td><td class="r"><input class="qty num" data-l="qty" data-i="${i}" value="${l.qty}" inputmode="numeric" aria-label="Quantité"></td><td class="r"><input class="qty num" style="width:100px" data-l="price" data-i="${i}" value="${l.price || ''}" inputmode="numeric" aria-label="Prix unitaire"${can('prix') ? '' : ' readonly title="Modification des prix réservée au gérant"'}></td><td class="r num b" data-tot="${i}">${fmt(l.qty * l.price)}</td><td class="acts"><button class="ibtn sm" type="button" data-rm="${i}" aria-label="Retirer la ligne">${ic('trash', 16)}</button></td></tr>`; }).join('');
          drawTot();
        };
        const drawPay = () => {
          if (type !== 'facture') { m.$('#ed-pay').innerHTML = `<div class="note">${type === 'devis' ? 'Le devis ne modifie pas le stock. Il pourra être converti en facture une fois accepté.' : 'Le bon de commande réserve la demande du client ; le stock sort à la facturation.'}</div><label class="fld">Note pour le client<textarea name="note" placeholder="Conditions, délai de livraison…"></textarea></label>`; return; }
          m.$('#ed-pay').innerHTML = `<div class="sec-t">Règlement</div><div class="fg3"><label class="fld">Acompte reçu<input class="num" data-p="acompte" inputmode="numeric" value="${ed.acompte || ''}" placeholder="0"></label><label class="fld">Moyen<select data-p="method">${['cash', 'om', 'momo', 'vir'].map(k => opt(k, METHODS[k].l, ed.method)).join('')}</select></label><label class="fld">Solde en<select data-p="n">${[0, 1, 2, 3, 4, 6].map(n => opt(n, n === 0 ? 'Une fois (30 jours)' : n + ' échéance' + (n > 1 ? 's' : ''), ed.n)).join('')}</select></label></div>${ed.n ? `<label class="fld" style="max-width:220px">Intervalle<select data-p="every">${[7, 14, 15, 30].map(n => opt(n, 'Tous les ' + n + ' jours', ed.every)).join('')}</select></label>` : ''}<div id="ed-sched"></div>`;
          drawTot();
        };
        const drawTot = () => {
          const t = total(), sub = sum(ed.lines.filter(l => l.pid), l => l.qty * l.price), rest = Math.max(0, t - ed.acompte);
          m.$('#ed-sub').textContent = fmt(sub);
          m.$('#ed-tot').innerHTML = `<div class="info-row" style="align-items:baseline;border-top:1px solid var(--line);padding-top:8px"><strong>Total TTC</strong><strong class="num" style="font-size:22px;color:var(--g6)">${F(t)}</strong></div>${type === 'facture' ? `<div class="info-row"><span class="muted">Acompte</span><span class="num">${fmt(ed.acompte)}</span></div><div class="info-row"><strong>Reste à payer</strong><strong class="num c-warn">${F(rest)}</strong></div>` : ''}`;
          const sch = m.$('#ed-sched'); if (sch) sch.innerHTML = rest > 0 ? `<div class="box stack" style="gap:4px">${(ed.n ? [...Array(ed.n)].map((_, i) => `<div class="sched"><span>Échéance ${i + 1} · ${fmtD(D((i + 1) * ed.every))}</span><span class="num">${fmt(i === ed.n - 1 ? rest - Math.round(rest / ed.n) * (ed.n - 1) : Math.round(rest / ed.n))}</span></div>`).join('') : `<div class="sched"><span>Paiement attendu le ${fmtD(D(30))}</span><span class="num">${fmt(rest)}</span></div>`)}</div>` : '<div class="note g">Facture réglée intégralement.</div>';
        };
        m.el.addEventListener('input', e => {
          const el = e.target, i = +el.dataset.i;
          if (el.dataset.l === 'pid') { const p = prod(el.value); ed.lines[i].pid = el.value; ed.lines[i].price = p ? unitPrice(p, ed.tarif) : 0; drawLines(); }
          else if (el.dataset.l) { ed.lines[i][el.dataset.l] = num(el.value); m.$(`[data-tot="${i}"]`).textContent = fmt(ed.lines[i].qty * ed.lines[i].price); drawTot(); }
          else if (el.dataset.p) { const k = el.dataset.p; ed[k] = k === 'method' ? el.value : num(el.value); if (k === 'n') drawPay(); else drawTot(); }
          else if (el.name === 'client') ed.client = el.value;
        });
        m.el.addEventListener('click', e => {
          const t = e.target.closest('[data-tarif],[data-addl],[data-rm],[data-newc]'); if (!t) return;
          if (t.dataset.tarif) { ed.tarif = t.dataset.tarif; m.$$('[data-tarif]').forEach(b => b.classList.toggle('on', b === t)); ed.lines.forEach(l => { const p = prod(l.pid); if (p) l.price = unitPrice(p, ed.tarif); }); drawLines(); }
          if (t.dataset.addl !== undefined) { ed.lines.push({ pid: '', qty: 1, price: 0 }); drawLines(); m.$$('[data-l="pid"]').pop().focus(); }
          if (t.dataset.rm !== undefined) { ed.lines.splice(+t.dataset.rm, 1); if (!ed.lines.length) ed.lines.push({ pid: '', qty: 1, price: 0 }); drawLines(); }
          if (t.dataset.newc !== undefined) mParty('client', null, id => { ed.client = id; m.$('[name=client]').innerHTML = S.clients.map(c => opt(c.id, c.name, id)).join(''); });
        });
        m.$('[data-ok]').onclick = () => {
          const lines = ed.lines.filter(l => l.pid && l.qty > 0).map(l => ({ pid: l.pid, qty: Math.round(l.qty), price: Math.round(l.price) }));
          if (!lines.length) return toast('Ajoutez au moins un article', 'bad');
          const tot = Math.max(0, sum(lines, l => l.qty * l.price) - ed.discount);
          if (type === 'facture') {
            for (const l of lines) { const p = prod(l.pid); if (l.qty > (p.stock[S.depot] || 0)) return toast(`Stock insuffisant pour ${p.name} (${p.stock[S.depot] || 0} disponibles)`, 'bad'); }
            if (ed.client === 'c0' && ed.acompte < tot) return toast('Un client comptoir doit régler la totalité : choisissez ou créez un client', 'bad');
            if (ed.acompte > tot) return toast('L\'acompte dépasse le total', 'bad');
          }
          const d = { id: uid('d'), type, num: nextNum(type), client: ed.client, date: now(), tarif: ed.tarif, lines, discount: ed.discount, payments: [], depot: S.depot, user: S.user };
          if (from) d.ref = from.num;
          if (type === 'devis') d.status = 'attente'; if (type === 'bc') d.status = 'afacturer';
          if (type === 'facture') {
            if (ed.acompte) d.payments.push({ date: now(), amount: ed.acompte, method: ed.method });
            const rest = tot - ed.acompte;
            if (ed.n && rest > 0) { d.schedule = [...(ed.acompte ? [{ date: d.date, amount: ed.acompte, label: 'Acompte' }] : [])]; for (let i = 0; i < ed.n; i++) d.schedule.push({ date: D((i + 1) * ed.every), amount: i === ed.n - 1 ? rest - Math.round(rest / ed.n) * (ed.n - 1) : Math.round(rest / ed.n), label: 'Échéance ' + (i + 1) }); }
            else d.due = D(30);
            lines.forEach(l => applyStock(l.pid, S.depot, -l.qty, 'Vente', `Facture ${d.num}`));
          }
          if (from) { from.status = from.type === 'bc' ? 'facture' : 'accepte'; from.converted = d.num; }
          if (ed.discount) log(`a accordé une remise de ${F(ed.discount)} sur ${d.num}`, 'remise');
          S.docs.push(d); log(`a créé ${DOC[type].one.toLowerCase()} ${d.num} · ${esc(cli(d.client).name)} · ${F(tot)}`, 'doc');
          S.ui.docType = type; S.ui.selDoc = d.id; S.ui.docQ = ''; S.ui.docSt = '';
          m.close(); toast(`${DOC[type].one} ${d.num} enregistré${type === 'facture' ? 'e' : ''}`); go('ventes');
        };
        drawLines(); drawPay();
      }
    });
  };
  can('factures') ? run() : guard('factures', 'Créer un document commercial', run);
}
function mPayment(id) {
  const d = S.docs.find(x => x.id === id), left = docLeft(d);
  let suggest = left; if (d.schedule) { let cum = 0; for (const s of d.schedule) { cum += s.amount; if (cum > docPaid(d) + .5) { suggest = Math.min(left, cum - docPaid(d)); break; } } }
  modal({
    title: `Paiement — ${d.num}`, size: 'sm',
    body: `<div class="box stack" style="gap:2px"><div class="info-row"><span class="muted">Client</span><strong>${esc(cli(d.client).name)}</strong></div><div class="info-row"><span class="muted">Total facture</span><span class="num">${F(docTotal(d))}</span></div><div class="info-row"><span class="muted">Déjà payé</span><span class="num">${F(docPaid(d))}</span></div><div class="info-row"><strong>Reste dû</strong><strong class="num c-warn">${F(left)}</strong></div></div>
      <label class="fld">Montant reçu *<input name="amt" class="num" inputmode="numeric" value="${suggest}" autofocus><span class="hint">${d.schedule ? 'Montant de la prochaine échéance proposé' : 'Solde proposé'}</span></label>
      <div class="fg"><label class="fld">Moyen de paiement<select name="method">${['cash', 'om', 'momo', 'vir'].map(k => opt(k, METHODS[k].l)).join('')}</select></label><label class="fld">Référence<input name="ref" placeholder="Facultatif"></label></div>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('check')}Enregistrer le paiement</button>`,
    mount: m => { m.$('[data-ok]').onclick = () => { const v = fieldVals(m), a = Math.round(num(v.amt)); if (a <= 0) return fieldErr(m, 'amt', 'Montant invalide'); if (a > left) return fieldErr(m, 'amt', `Le montant dépasse le reste dû (${F(left)})`); d.payments.push({ date: now(), amount: a, method: v.method, ref: v.ref }); log(`a enregistré un paiement de ${F(a)} sur ${d.num}`, 'pay'); m.close(); toast(docLeft(d) ? `Paiement enregistré · reste ${F(docLeft(d))}` : `Facture ${d.num} soldée`); refresh(); }; }
  });
}
function mShare(d, ch) {
  const c = cli(d.client), co = S.company;
  const text = `Bonjour ${c.name},\n\nVeuillez trouver ${d.type === 'facture' ? 'votre facture' : d.type === 'devis' ? 'notre devis' : 'votre ' + DOC[d.type].one.toLowerCase()} ${d.num} du ${fmtD(d.date)} d'un montant de ${F(docTotal(d))}.${docLeft(d) ? `\nReste à payer : ${F(docLeft(d))}${docDue(d) ? ' avant le ' + fmtD(docDue(d)) : ''}.` : ''}\n\nMerci de votre confiance.\n${co.name}`;
  modal({
    title: ch === 'wa' ? 'Envoyer par WhatsApp' : 'Envoyer par e-mail', size: 'md',
    body: `<div class="fg">${ch === 'wa' ? `<label class="fld">Numéro WhatsApp<input name="to" inputmode="tel" value="${esc(c.phone)}" placeholder="6XX XX XX XX"></label>` : `<label class="fld">Adresse e-mail<input name="to" type="email" placeholder="client@exemple.cm"></label>`}<label class="fld">Pièce jointe<input readonly value="${d.num}.pdf"></label></div><label class="fld">Message<textarea name="msg" style="min-height:170px">${esc(text)}</textarea></label>`,
    foot: `<button class="btn left" type="button" data-copy>${ic('copy', 16)}Copier le message</button><button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic(ch === 'wa' ? 'wa' : 'mail')}Envoyer</button>`,
    mount: m => {
      m.$('[data-copy]').onclick = () => { try { navigator.clipboard.writeText(fieldVals(m).msg); toast('Message copié'); } catch (e) { toast('Copie impossible dans ce navigateur', 'warn'); } };
      m.$('[data-ok]').onclick = () => { const v = fieldVals(m); if (!v.to) return fieldErr(m, 'to', ch === 'wa' ? 'Saisissez un numéro' : 'Saisissez une adresse e-mail'); log(`a envoyé ${d.num} ${ch === 'wa' ? 'par WhatsApp' : 'par e-mail'} à ${v.to}`, 'doc'); m.close(); toast(`${d.num} envoyé à ${v.to}`); };
    }
  });
}
function mRemind(cid) {
  const c = cli(cid), b = clientBalance(cid), late = S.docs.filter(d => d.type === 'facture' && d.client === cid && docLeft(d));
  const text = `Bonjour ${c.name},\n\nSauf erreur de notre part, votre compte présente un solde de ${F(b)} :\n${late.map(d => `• ${d.num} du ${fmtD(d.date)} — reste ${F(docLeft(d))}${docDue(d) ? ' (échéance ' + fmtD(docDue(d)) + ')' : ''}`).join('\n')}\n\nMerci de régulariser par Orange Money, MTN MoMo ou en boutique.\n${S.company.name}`;
  modal({
    title: `Relancer ${esc(c.name)}`, size: 'md',
    body: `<div class="seg" role="group" aria-label="Canal"><button type="button" class="on" data-ch="wa">WhatsApp</button><button type="button" data-ch="sms">SMS</button><button type="button" data-ch="call">Appel noté</button></div><label class="fld">Numéro<input name="to" value="${esc(c.phone)}"></label><label class="fld">Message<textarea name="msg" style="min-height:190px">${esc(text)}</textarea></label>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('wa')}Envoyer la relance</button>`,
    mount: m => { let ch = 'wa'; m.$$('[data-ch]').forEach(b => b.onclick = () => { ch = b.dataset.ch; m.$$('[data-ch]').forEach(x => x.classList.toggle('on', x === b)); }); m.$('[data-ok]').onclick = () => { log(`a relancé ${c.name} (${{ wa: 'WhatsApp', sms: 'SMS', call: 'appel' }[ch]}) pour ${F(b)}`, 'pay'); m.close(); toast(`Relance envoyée à ${c.name}`); }; }
  });
}
function mClientPay(cid) {
  const c = cli(cid), b = clientBalance(cid);
  const open = S.docs.filter(d => d.type === 'facture' && d.client === cid && docLeft(d)).sort((a, x) => a.date.localeCompare(x.date));
  modal({
    title: `Encaisser — ${esc(c.name)}`, size: 'md',
    body: `<div class="info-row"><span>Solde dû</span><strong class="num c-warn">${F(b)}</strong></div><div class="fg"><label class="fld">Montant reçu *<input name="amt" class="num" inputmode="numeric" value="${b}" autofocus></label><label class="fld">Moyen de paiement<select name="method">${['cash', 'om', 'momo', 'vir'].map(k => opt(k, METHODS[k].l)).join('')}</select></label></div>
      <div class="sec-t">Imputation (factures les plus anciennes d'abord)</div><div class="box stack" style="gap:4px" id="imp"></div>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('check')}Enregistrer</button>`,
    mount: m => {
      const alloc = a => open.map(d => { const x = Math.min(docLeft(d), a); a -= x; return { d, x }; });
      const draw = () => { m.$('#imp').innerHTML = alloc(num(fieldVals(m).amt)).map(({ d, x }) => `<div class="sched${x >= docLeft(d) ? ' paid' : ''}"><span>${d.num} · reste ${fmt(docLeft(d))}</span><span class="num">${x ? fmt(x) + (x >= docLeft(d) ? ' ✓ soldée' : '') : '—'}</span></div>`).join(''); };
      m.el.addEventListener('input', draw); draw();
      m.$('[data-ok]').onclick = () => { const v = fieldVals(m), a = Math.round(num(v.amt)); if (a <= 0 || a > b) return fieldErr(m, 'amt', `Saisissez un montant entre 1 et ${fmt(b)}`); alloc(a).forEach(({ d, x }) => { if (x) d.payments.push({ date: now(), amount: x, method: v.method }); }); log(`a encaissé ${F(a)} de ${c.name}`, 'pay'); m.close(); toast(`Paiement de ${F(a)} enregistré`); refresh(); };
    }
  });
}
function mSupPay(sid) {
  const s = sup(sid);
  modal({
    title: `Payer ${esc(s.name)}`, size: 'sm',
    body: `<div class="info-row"><span>Montant dû</span><strong class="num c-info">${F(s.due)}</strong></div><label class="fld">Montant payé *<input name="amt" class="num" inputmode="numeric" value="${s.due}" autofocus></label><div class="fg"><label class="fld">Moyen<select name="method">${['vir', 'cash', 'om', 'momo'].map(k => opt(k, METHODS[k].l)).join('')}</select></label><label class="fld">Référence<input name="ref" placeholder="N° de virement…"></label></div>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('check')}Enregistrer</button>`,
    mount: m => { m.$('[data-ok]').onclick = () => { const v = fieldVals(m), a = Math.round(num(v.amt)); if (a <= 0 || a > s.due) return fieldErr(m, 'amt', `Saisissez un montant entre 1 et ${fmt(s.due)}`); guard('admin', 'Payer un fournisseur', () => { s.due -= a; s.payments.unshift({ date: now(), amount: a, method: v.method, ref: v.ref }); log(`a payé ${F(a)} à ${s.name}`, 'pay'); m.close(); toast('Paiement fournisseur enregistré'); refresh(); }); }; }
  });
}
function mParty(kind, id, cb) {
  const isC = kind === 'client', x = id ? (isC ? cli(id) : sup(id)) : null;
  modal({
    title: x ? `Modifier ${esc(x.name)}` : isC ? 'Nouveau client' : 'Nouveau fournisseur', size: 'md',
    body: `<div class="fg"><label class="fld" style="grid-column:1/-1">Nom ou raison sociale *<input name="name" value="${esc(x?.name || '')}"></label>
      ${isC ? `<label class="fld">Type de client<select name="type">${opt('Détail', 'Détail', x?.type)}${opt('Gros', 'Gros (revendeur)', x?.type)}</select></label>` : `<label class="fld">Catégorie<select name="cat">${['Épicerie', 'Boissons', 'Hygiène', 'Divers'].map(c => opt(c, c, x?.cat)).join('')}</select></label>`}
      <label class="fld">Téléphone / WhatsApp<input name="phone" inputmode="tel" value="${esc(x?.phone || '')}" placeholder="6XX XX XX XX"></label>
      <label class="fld">Quartier, ville<input name="city" value="${esc(x?.city || '')}" placeholder="Ex. Mokolo, Yaoundé"></label>
      ${isC ? `<label class="fld">Plafond de crédit (FCFA)<input name="limit" class="num" inputmode="numeric" value="${x?.limit ?? 0}"><span class="hint">0 = vente à crédit interdite</span></label>` : ''}</div>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('check')}Enregistrer</button>`,
    mount: m => { m.$('[data-ok]').onclick = () => { const v = fieldVals(m); if (!v.name) return fieldErr(m, 'name', 'Le nom est obligatoire'); const data = isC ? { name: v.name, type: v.type, phone: v.phone, city: v.city, limit: num(v.limit) } : { name: v.name, cat: v.cat, phone: v.phone, city: v.city }; let nid = id; if (x) Object.assign(x, data); else { nid = uid(isC ? 'c' : 's'); (isC ? S.clients : S.suppliers).push(isC ? { id: nid, since: String(new Date().getFullYear()), hist: 0, ...data } : { id: nid, due: 0, payments: [], ...data }); if (isC) S.ui.selClient = nid; else S.ui.selSup = nid; } log(`a ${x ? 'modifié' : 'créé'} la fiche ${isC ? 'client' : 'fournisseur'} « ${v.name} »`); m.close(); toast(x ? 'Fiche mise à jour' : `${isC ? 'Client' : 'Fournisseur'} créé`); if (cb) { save(); cb(nid); } else refresh(); }; }
  });
}
function printStatement(cid) {
  const c = cli(cid), docs = S.docs.filter(d => d.client === cid && d.type === 'facture').sort((a, b) => a.date.localeCompare(b.date));
  printHTML(`<div class="prt"><h1>Relevé de compte — ${esc(c.name)}</h1><p>${esc(S.company.name)} · édité le ${fmtDT(now())}</p><table class="tbl"><thead><tr><th>Date</th><th>Facture</th><th class="r">Montant</th><th class="r">Payé</th><th class="r">Reste</th><th>Statut</th></tr></thead><tbody>${docs.map(d => `<tr><td>${fmtD(d.date)}</td><td>${d.num}</td><td class="r">${fmt(docTotal(d))}</td><td class="r">${fmt(docPaid(d))}</td><td class="r">${fmt(docLeft(d))}</td><td>${docStatus(d)[0]}</td></tr>`).join('')}</tbody></table><h1 style="margin-top:16px">Solde dû : ${F(clientBalance(cid))}</h1></div>`);
}

/* Inventaire : nouveau, scanner, validation */
function mInvNew() {
  if (curInv()) return toast(`Terminez d'abord l'inventaire ${curInv().id} en cours`, 'warn');
  guard('inventaire', 'Démarrer un inventaire', () => modal({
    title: 'Nouvel inventaire', size: 'sm',
    body: `<label class="fld">Dépôt à inventorier<select name="dep">${DEPOTS.map(d => opt(d.id, d.name, S.depot)).join('')}</select></label><div class="note o">Les ventes sur ce dépôt restent possibles, mais il est conseillé de compter en dehors des heures d'ouverture pour éviter les écarts.</div>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>Démarrer</button>`,
    mount: m => { m.$('[data-ok]').onclick = () => { const id = `INV-${new Date().getFullYear()}-${pad(++S.seq.inv)}`; S.inventories.unshift({ id, depot: fieldVals(m).dep, status: 'cours', start: now(), user: S.user, counts: {} }); S.ui.invFilter = 'tous'; log(`a démarré l'inventaire ${id}`, 'inv'); m.close(); toast(`Inventaire ${id} démarré`); refresh(); }; }
  }));
}
function mInvScan() {
  const inv = curInv();
  modal({
    title: 'Compter au scanner', size: 'md',
    body: `<div class="note">Chaque lecture ajoute la quantité indiquée au produit scanné.</div><div class="fg"><label class="fld">Code-barres, référence ou nom<input name="code" autocomplete="off" autofocus></label><label class="fld">Quantité par lecture<input name="q" class="num" value="1" inputmode="numeric"></label></div><div id="scan-log" class="stack" style="gap:6px"></div>`,
    foot: `<button class="btn pri" type="button" data-x>Terminer</button>`,
    onClose: () => refresh(),
    mount: m => {
      const logs = [];
      m.$('[name=code]').addEventListener('keydown', e => {
        if (e.key !== 'Enter') return; const v = e.target.value.trim().toLowerCase(); if (!v) return;
        const p = S.products.find(x => x.barcode === v || x.ref.toLowerCase() === v) || S.products.find(x => x.name.toLowerCase().includes(v));
        if (!p) { logs.unshift(`<div class="note o">« ${esc(v)} » introuvable</div>`); }
        else { const add = Math.max(1, Math.round(num(fieldVals(m).q))); const c = inv.counts[p.id] || { q: 0, r: '', by: S.user }; c.q += add; c.by = S.user; if (c.q !== (p.stock[inv.depot] || 0) && !c.r) c.r = 'Non justifié'; inv.counts[p.id] = c; logs.unshift(`<div class="info-row box" style="padding:8px 12px"><span>${esc(p.name)} <span class="sub">+${add}</span></span><strong class="num">${c.q} compté(s) · théorique ${p.stock[inv.depot] || 0}</strong></div>`); save(); }
        m.$('#scan-log').innerHTML = logs.slice(0, 6).join(''); e.target.value = '';
      });
    }
  });
}
function mInvValidate() {
  const inv = curInv(), st = invStats(inv);
  const diffs = Object.entries(inv.counts).map(([pid, c]) => ({ p: prod(pid), c, d: c.q - (prod(pid).stock[inv.depot] || 0) })).filter(x => x.d);
  guard('inventaire', 'Valider un inventaire', () => modal({
    title: `Valider l'inventaire ${inv.id}`, size: 'lg',
    body: `${st.counted < st.total ? `<div class="note o">${st.total - st.counted} produit(s) n'ont pas été comptés : leur stock ne sera pas modifié.</div>` : ''}
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Produit</th><th scope="col" class="r">Théorique</th><th scope="col" class="r">Compté</th><th scope="col" class="r">Écart</th><th scope="col" class="r">Valeur</th><th scope="col">Motif</th></tr></thead><tbody>${diffs.map(x => `<tr><td>${esc(x.p.name)}</td><td class="r num">${x.p.stock[inv.depot]}</td><td class="r num">${x.c.q}</td><td class="r num b ${x.d < 0 ? 'c-bad' : 'c-ok'}">${x.d > 0 ? '+' : ''}${x.d}</td><td class="r num">${fmt(x.d * x.p.buy)}</td><td>${esc(x.c.r || 'Non justifié')}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Aucun écart : le stock est conforme.</td></tr>'}</tbody></table></div>
      <div class="info-row box"><strong>Valeur totale des écarts</strong><strong class="num ${st.value < 0 ? 'c-bad' : 'c-ok'}">${st.value > 0 ? '+' : ''}${F(st.value)}</strong></div>`,
    foot: `<button class="btn" type="button" data-x>Revenir au comptage</button><button class="btn pri" type="button" data-ok>${ic('check')}Valider ${diffs.length} correction(s)</button>`,
    mount: m => { m.$('[data-ok]').onclick = () => { diffs.forEach(x => applyStock(x.p.id, inv.depot, x.d, 'Ajustement', `Inventaire ${inv.id} · ${x.c.r || 'Non justifié'}`)); Object.assign(inv, { status: 'valide', end: now(), value: st.value, count: st.counted }); log(`a validé l'inventaire ${inv.id} (écart ${F(st.value)})`, 'inv'); m.close(); toast(`Inventaire ${inv.id} validé · ${diffs.length} correction(s)`); refresh(); }; }
  }));
}

/* Utilisateurs, rôles, sauvegardes, entreprise */
function mUser(id) {
  const u = id ? usr(id) : null;
  guard('admin', 'Gérer les utilisateurs', () => modal({
    title: u ? `Modifier ${esc(u.name)}` : 'Nouvel utilisateur', size: 'md',
    body: `<div class="fg"><label class="fld" style="grid-column:1/-1">Nom affiché *<input name="name" value="${esc(u?.name || '')}" placeholder="Ex. Marie T."></label>
      <label class="fld">Rôle<select name="role"${u && u.id === S.user ? ' disabled' : ''}>${Object.entries(S.roles).map(([k, r]) => opt(k, r.label, u?.role || 'caissier')).join('')}</select></label>
      <label class="fld">Point de vente<select name="depot">${opt('all', 'Tous', u?.depot)}${DEPOTS.map(d => opt(d.id, d.site, u?.depot || S.depot)).join('')}</select></label>
      <label class="fld">${u ? 'Nouveau code PIN' : 'Code PIN *'} (4 chiffres)<input name="pin" type="password" inputmode="numeric" maxlength="4" class="pin-in" placeholder="${u ? 'inchangé' : ''}"></label>
      <label class="fld">Confirmer le code<input name="pin2" type="password" inputmode="numeric" maxlength="4" class="pin-in"></label></div>
      <div class="note" id="role-info"></div>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('check')}Enregistrer</button>`,
    mount: m => {
      const info = () => { const r = S.roles[m.$('[name=role]').value]; m.$('#role-info').innerHTML = `<strong>${r.label}</strong> : ${r.perms.map(p => PERMS.find(x => x[0] === p)[1].toLowerCase()).join(', ') || 'aucun droit'}.`; };
      m.el.addEventListener('input', info); info();
      m.$('[data-ok]').onclick = () => {
        const v = fieldVals(m); if (!v.name) return fieldErr(m, 'name', 'Le nom est obligatoire');
        if ((!u || v.pin) && !/^\d{4}$/.test(v.pin)) return fieldErr(m, 'pin', 'Le code PIN doit comporter 4 chiffres');
        if (v.pin !== v.pin2) return fieldErr(m, 'pin2', 'Les deux codes ne correspondent pas');
        if (u) { u.name = v.name; if (u.id !== S.user) u.role = v.role; u.depot = v.depot; if (v.pin) u.pin = v.pin; log(`a modifié le compte de ${u.name}`, 'secu'); }
        else { const colors = ['#1D5FA8', '#7A4BB0', '#B4580F', '#1F6B5E', '#A3211A']; S.users.push({ id: uid('u'), name: v.name, role: v.role, depot: v.depot, pin: v.pin, active: true, last: now(), color: colors[S.users.length % colors.length] }); log(`a créé le compte de ${v.name} (${S.roles[v.role].label})`, 'secu'); }
        m.close(); toast('Compte enregistré'); refresh();
      };
    }
  }));
}
function mRoles() {
  guard('admin', 'Modifier les droits', () => modal({
    title: 'Modifier les rôles et droits', size: 'lg',
    body: `<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Permission</th>${Object.values(S.roles).map(r => `<th scope="col" class="c">${r.label}</th>`).join('')}</tr></thead><tbody>${PERMS.map(([k, l]) => `<tr><td>${l}</td>${Object.entries(S.roles).map(([rk, r]) => `<td class="c"><input type="checkbox" data-r="${rk}" data-p="${k}"${r.perms.includes(k) ? ' checked' : ''}${rk === 'gerant' ? ' disabled' : ''} aria-label="${l} — ${r.label}"></td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="note">Le rôle Gérant conserve tous les droits pour éviter de se retrouver sans administrateur.</div>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>${ic('check')}Enregistrer les droits</button>`,
    mount: m => { m.$('[data-ok]').onclick = () => { Object.entries(S.roles).forEach(([rk, r]) => { if (rk === 'gerant') return; r.perms = m.$$(`[data-r="${rk}"]`).filter(c => c.checked).map(c => c.dataset.p); }); log('a modifié les droits des rôles', 'secu'); m.close(); toast('Droits mis à jour'); refresh(); }; }
  }));
}
function snapshot() { const c = { ...S, backups: [] }; return JSON.stringify(c); }
function mBackup() {
  const m = modal({ title: 'Sauvegarde en cours', size: 'sm', body: `<div class="stack"><div class="sub" id="bk-t">Préparation des données…</div><div class="progress"><div id="bk-p" style="width:5%"></div></div></div>` });
  const steps = ['Copie des produits et du stock…', 'Copie des ventes et factures…', 'Copie des clients et fournisseurs…', 'Vérification de l\'intégrité…'];
  let i = 0; const t = setInterval(() => { i++; const p = m.$('#bk-p'); if (!p) return clearInterval(t); p.style.width = Math.min(100, i * 25) + '%'; m.$('#bk-t').textContent = steps[Math.min(i, steps.length) - 1] || ''; if (i >= 4) { clearInterval(t); const data = snapshot(); S.lastBackup = now(); S.backups.unshift({ id: uid('b'), at: S.lastBackup, user: S.user, size: data.length, data }); S.backups.length = Math.min(S.backups.length, 5); log('a lancé une sauvegarde manuelle', 'secu'); setTimeout(() => { m.close(); toast(`Sauvegarde terminée (${Math.round(data.length / 1024)} Ko)`); refresh(); }, 350); } }, 380);
}
function mRestore() {
  guard('admin', 'Restaurer une sauvegarde', () => modal({
    title: 'Restaurer une sauvegarde', size: 'md',
    body: S.backups.length ? `<div class="note o">La restauration remplace toutes les données actuelles par celles de la sauvegarde choisie.</div>${S.backups.map(b => `<div class="box" style="display:flex;align-items:center;gap:12px"><span class="av" style="width:34px;height:34px;background:var(--g1);color:var(--g6)">${ic('save', 16)}</span><div style="flex:1"><strong>${fmtDT(b.at)}</strong><div class="sub">${Math.round(b.size / 1024)} Ko · par ${esc(usr(b.user).name)}</div></div><button class="btn sm" type="button" data-rs="${b.id}">Restaurer</button></div>`).join('')}` : `<div class="placeholder" style="padding:30px">${ic('save', 30)}Aucune sauvegarde dans cette session.<button class="btn pri" type="button" data-now>Sauvegarder maintenant</button></div>`,
    mount: m => {
      m.$$('[data-rs]').forEach(b => b.onclick = () => { const bk = S.backups.find(x => x.id === b.dataset.rs); confirmBox('Confirmer la restauration', `Revenir à l'état du ${fmtDT(bk.at)} ? Les opérations faites depuis seront perdues.`, 'Restaurer', () => { const keep = S.backups; S = JSON.parse(bk.data); S.backups = keep; S.ui = { ...UI_DEFAULT, ...S.ui }; log(`a restauré la sauvegarde du ${fmtDT(bk.at)}`, 'secu'); m.close(); toast('Données restaurées'); refresh(); }, true); });
      const n = m.$('[data-now]'); if (n) n.onclick = () => { m.close(); mBackup(); };
    }
  }));
}
function mCompany() {
  const c = S.company;
  modal({
    title: "Informations de l'entreprise", size: 'md',
    body: `<div class="fg"><label class="fld" style="grid-column:1/-1">Raison sociale<input name="name" value="${esc(c.name)}"></label><label class="fld">Adresse<input name="addr" value="${esc(c.addr)}"></label><label class="fld">N° contribuable (NIU)<input name="nc" value="${esc(c.nc)}"></label><label class="fld">Téléphone<input name="tel" value="${esc(c.tel)}"></label></div>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>Enregistrer</button>`,
    mount: m => { m.$('[data-ok]').onclick = () => { Object.assign(S.company, fieldVals(m)); log("a modifié les informations de l'entreprise"); m.close(); toast('Informations enregistrées'); refresh(); }; }
  });
}
function exportCompta() {
  guard('admin', 'Export comptable', () => {
    const per = $('#exp-per').value, nowD = new Date();
    const inPer = iso => { const d = new Date(iso); if (per === 'all') return true; const ref = new Date(nowD.getFullYear(), nowD.getMonth() - (per === 'p' ? 1 : 0), 1); return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth(); };
    const rows = [['Date', 'Journal', 'Compte', 'Pièce', 'Libellé', 'Débit', 'Crédit']];
    const acc = { cash: '571000', om: '585100', momo: '585200', vir: '521000', credit: '411000' };
    if ($('#exp-v').checked) S.docs.filter(d => (d.type === 'ticket' || d.type === 'facture') && inPer(d.date)).forEach(d => { const t = docTotal(d); rows.push([fmtD(d.date), 'VT', '411000', d.num, cli(d.client).name, t, ''], [fmtD(d.date), 'VT', '701000', d.num, 'Ventes de marchandises', '', t]); });
    if ($('#exp-r').checked) S.docs.forEach(d => (d.payments || []).filter(p => inPer(p.date) && p.method !== 'credit').forEach(p => rows.push([fmtD(p.date), 'BQ', acc[p.method], d.num, 'Règlement ' + cli(d.client).name, p.amount, ''], [fmtD(p.date), 'BQ', '411000', d.num, 'Règlement ' + cli(d.client).name, '', p.amount])));
    if ($('#exp-a').checked) S.movements.filter(mv => mv.type === 'Entrée' && inPer(mv.date)).forEach(mv => { const v = mv.qty * prod(mv.pid).buy; rows.push([fmtD(mv.date), 'AC', '601000', mv.note, prod(mv.pid).name, v, ''], [fmtD(mv.date), 'AC', '401000', mv.note, sup(mv.sup || prod(mv.pid).supplier).name, '', v]); });
    log(`a généré l'export comptable (${rows.length - 1} écritures)`, 'secu');
    dlCSV(`export-comptable-${per === 'all' ? 'complet' : per === 'p' ? 'mois-precedent' : 'mois-en-cours'}.csv`, rows);
  });
}

/* Choix du point de vente, notifications, menu utilisateur, aide */
function mSite() {
  if (me().depot !== 'all') return toast(`Votre compte est rattaché à ${siteName(me().depot)}`, 'warn');
  modal({
    title: 'Changer de point de vente', size: 'md',
    body: `<div class="choice">${DEPOTS.map(d => `<button type="button" class="${d.id === S.depot ? 'on' : ''}" data-d="${d.id}">${ic('store', 22)}<strong>${d.site}</strong><span class="sub">${d.name} · ${fmt(sum(S.products, p => p.stock[d.id] || 0))} articles</span></button>`).join('')}</div>`,
    mount: m => { m.$$('[data-d]').forEach(b => b.onclick = () => { if (S.cart.lines.length && b.dataset.d !== S.depot) { S.held.push({ id: uid('h'), at: now(), user: S.user, cart: S.cart }); S.cart = freshCart(); toast('Le ticket en cours a été mis en attente', 'warn'); } S.depot = b.dataset.d; m.close(); toast(`Point de vente : ${siteName(S.depot)}`); refresh(); }); }
  });
}
function showNotifs(btn) {
  if (POP) return closePop();
  const n = notifs(), col = { bad: ['#FDE7E5', '#B42318'], warn: ['#FCEBDD', '#B4580F'], info: ['#E3EEFA', '#1D5FA8'], neu: ['#EEF2EF', '#3D4B43'] };
  const el = popover(btn, `<div class="pop-h"><strong>Notifications</strong><span class="sub">${n.length}</span></div>${n.map((x, i) => `<button type="button" class="pop-i" data-n="${i}"><span class="alert-ic" style="width:32px;height:32px;background:${col[x.k][0]};color:${col[x.k][1]}">${ic(x.i, 16)}</span><span><strong style="font-size:13.5px">${esc(x.t)}</strong><br><span class="sub">${esc(x.s)}</span></span></button>`).join('') || '<div class="placeholder" style="padding:30px">Aucune notification.</div>'}`);
  el.querySelectorAll('[data-n]').forEach(b => b.onclick = () => { const x = n[+b.dataset.n]; closePop(); if (x.doc) { const d = S.docs.find(y => y.id === x.doc); S.ui.docType = d.type; S.ui.selDoc = d.id; } go(x.go); });
}
function showUserMenu(btn) {
  if (POP) return closePop();
  const u = me();
  const el = popover(btn, `<div class="pop-h" style="justify-content:flex-start;gap:12px">${av(u, 40)}<div><strong>${esc(u.name)}</strong><div>${roleChip(u.role)}</div></div></div>
    <button class="menu-i" type="button" data-m="pin">${ic('key')}Changer mon code PIN</button><button class="menu-i" type="button" data-m="switch">${ic('users')}Changer d'utilisateur</button><button class="menu-i" type="button" data-m="lock">${ic('lock')}Verrouiller (Ctrl+L)</button><button class="menu-i" type="button" data-m="out" style="color:var(--rd-t)">${ic('logout')}Se déconnecter</button>`);
  el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { closePop(); const k = b.dataset.m; if (k === 'pin') mPin(); if (k === 'switch') showLock('switch'); if (k === 'lock') showLock('lock'); if (k === 'out') { log("s'est déconnecté", 'secu'); showLock('login'); } });
}
function mPin() {
  modal({
    title: 'Changer mon code PIN', size: 'sm',
    body: `<label class="fld">Code actuel<input name="old" type="password" inputmode="numeric" maxlength="4" class="pin-in" autofocus></label><label class="fld">Nouveau code<input name="n1" type="password" inputmode="numeric" maxlength="4" class="pin-in"></label><label class="fld">Confirmer<input name="n2" type="password" inputmode="numeric" maxlength="4" class="pin-in"></label>`,
    foot: `<button class="btn" type="button" data-x>Annuler</button><button class="btn pri" type="button" data-ok>Enregistrer</button>`,
    mount: m => { m.$('[data-ok]').onclick = () => { const v = fieldVals(m); if (v.old !== me().pin) return fieldErr(m, 'old', 'Code actuel incorrect'); if (!/^\d{4}$/.test(v.n1)) return fieldErr(m, 'n1', '4 chiffres requis'); if (v.n1 !== v.n2) return fieldErr(m, 'n2', 'Les codes ne correspondent pas'); me().pin = v.n1; log('a changé son code PIN', 'secu'); m.close(); toast('Code PIN modifié'); save(); }; }
  });
}
function mHelp() {
  modal({
    title: 'Aide et raccourcis', size: 'md',
    body: `<div class="sec-t">Raccourcis clavier</div><div class="box stack" style="gap:2px">${[['F2', 'Aller à la caisse / rechercher un article'], ['F9', 'Encaisser le ticket en cours'], ['Entrée', 'Dans la recherche caisse : ajouter l\'article scanné'], ['Ctrl + K', 'Rechercher dans la page'], ['Ctrl + L', 'Verrouiller la session'], ['Échap', 'Fermer la fenêtre ouverte']].map(([k, l]) => `<div class="info-row"><span>${l}</span><kbd style="font-family:inherit;font-weight:600;background:#EEF2EF;border-radius:6px;padding:2px 8px">${k}</kbd></div>`).join('')}</div>
      <div class="sec-t">Démonstration</div><div class="note">Comptes de démo : Alain M. (gérant), Aïcha M. et Brice K. (caissiers), Paul E. et Ruth N. (magasiniers). Code PIN : <strong>1234</strong>. Connectez-vous avec un autre rôle pour voir les menus et droits changer.</div>
      <div class="note o">Les données sont fictives et enregistrées dans ce navigateur uniquement.</div>`,
    foot: `<button class="btn ghost-r left" type="button" data-reset>${ic('refresh', 16)}Réinitialiser la démo</button><button class="btn pri" type="button" data-x>Fermer</button>`,
    mount: m => { m.$('[data-reset]').onclick = () => confirmBox('Réinitialiser la démo', 'Toutes les opérations effectuées seront effacées et les données d\'exemple rechargées.', 'Réinitialiser', () => { S = seed(); S.ui = { ...UI_DEFAULT }; save(); m.close(); toast('Données de démonstration rechargées'); go('dashboard'); }, true); }
  });
}

/* ---------------------------------------------------------
   9. Connexion / verrouillage
--------------------------------------------------------- */
const LK = { sel: null, pin: '', mode: 'login', tries: 0 };
function showLock(mode = 'login') { LK.mode = mode; LK.sel = mode === 'lock' ? S.user : (mode === 'switch' ? null : S.user); LK.pin = ''; closePop(); MS.slice().forEach(m => m.close()); $('#lock').hidden = false; renderLock(); if (mode === 'lock') { log('a verrouillé la session', 'secu'); save(); } }
function renderLock(err = '') {
  const u = LK.sel ? usr(LK.sel) : null, locked = LK.mode === 'lock';
  $('#lock').innerHTML = `<div class="lock-l"><div class="brand"><span class="brand-ic">${ic('box')}</span><span class="brand-t">GestiPro</span></div><div><h1>Gestion de stock et de ventes pour vos boutiques.</h1><p style="margin-top:14px">Caisse, factures, inventaires et rapports — même sans connexion internet. Les données de cette maquette sont fictives.</p></div><p class="sub" style="color:#A9C2B3">${esc(S.company.name)} · ${DEPOTS.length} points de vente</p></div>
    <div class="lock-r"><div class="lock-box">
      <div><h2 style="font-size:24px">${locked ? 'Session verrouillée' : 'Connexion'}</h2><p class="muted" style="margin:6px 0 0">${locked ? `Saisissez le code de ${esc(u.name)} pour reprendre.` : 'Choisissez votre compte puis saisissez votre code PIN.'}</p></div>
      ${locked ? `<div style="display:flex;align-items:center;gap:12px">${av(u, 48)}<div><strong>${esc(u.name)}</strong><div>${roleChip(u.role)}</div></div></div>` : `<div class="users" role="group" aria-label="Comptes">${S.users.map(x => `<button type="button" class="ucard${x.id === LK.sel ? ' on' : ''}" data-u="${x.id}"${x.active ? '' : ' disabled'} aria-pressed="${x.id === LK.sel}">${av(x, 40)}<strong>${esc(x.name)}</strong><small>${S.roles[x.role].label}</small></button>`).join('')}</div>`}
      ${u ? `<div class="pin-dots" aria-label="${LK.pin.length} chiffres saisis sur 4">${[0, 1, 2, 3].map(i => `<span class="${i < LK.pin.length ? 'f' : ''}"></span>`).join('')}</div><div class="err-msg" role="alert">${err}</div>
      <div class="pinpad" id="pinpad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button type="button" data-k="${n}">${n}</button>`).join('')}<button type="button" class="act" data-k="clr">Effacer</button><button type="button" data-k="0">0</button><button type="button" class="act" data-k="back" aria-label="Supprimer le dernier chiffre">←</button></div>` : '<p class="muted">Sélectionnez un compte.</p>'}
      <p class="sub" style="text-align:center">Démo : code <strong>1234</strong> pour tous les comptes${locked ? ` · <button type="button" data-sw style="border:0;background:none;color:var(--g6);font-weight:600;cursor:pointer;padding:6px">Changer d'utilisateur</button>` : ''}</p>
    </div></div>`;
  $$('#lock [data-u]').forEach(b => b.onclick = () => { LK.sel = b.dataset.u; LK.pin = ''; renderLock(); });
  $$('#lock [data-k]').forEach(b => b.onclick = () => pinKey(b.dataset.k));
  const sw = $('#lock [data-sw]'); if (sw) sw.onclick = () => { LK.mode = 'switch'; LK.sel = null; renderLock(); };
}
function pinKey(k) {
  if (!LK.sel) return;
  if (k === 'clr') LK.pin = ''; else if (k === 'back') LK.pin = LK.pin.slice(0, -1); else if (LK.pin.length < 4) LK.pin += k;
  if (LK.pin.length === 4) {
    const u = usr(LK.sel);
    if (u.pin === LK.pin) {
      const prev = S.user; S.user = u.id; u.last = now(); LK.tries = 0;
      if (u.depot !== 'all') { if (S.depot !== u.depot && S.cart.lines.length) { S.held.push({ id: uid('h'), at: now(), user: prev, cart: S.cart }); S.cart = freshCart(); } S.depot = u.depot; }
      if (LK.mode !== 'lock') log("s'est connecté", 'secu');
      $('#lock').hidden = true; $('#lock').innerHTML = ''; save();
      toast(`Bonjour ${u.name} — ${S.roles[u.role].label}`);
      if (!ALLOW[CUR]()) go(NAV.find(([k2]) => ALLOW[k2]())[0]); else refresh();
      return;
    }
    LK.tries++; LK.pin = ''; renderLock(LK.tries >= 3 ? 'Code incorrect — 3 tentatives, l\'événement est enregistré' : 'Code incorrect');
    if (LK.tries === 3) { const keep = S.user; S.user = LK.sel; log(`— échec de connexion (3 tentatives)`, 'secu'); S.user = keep; }
    $('#pinpad')?.classList.add('shake'); return;
  }
  renderLock();
}

/* ---------------------------------------------------------
   10. Actions (délégation d'évènements)
--------------------------------------------------------- */
const A = {
  goto: ds => { if (ds.type) { S.ui.docType = ds.type; S.ui.selDoc = null; } if (ds.status !== undefined) { S.ui.stockStatus = ds.status; } go(ds.to); },
  openNav: () => document.body.classList.add('nav-open'), closeNav: () => document.body.classList.remove('nav-open'),
  lock: () => showLock('lock'), pickSite: mSite, help: mHelp,
  notifs: (ds, el) => showNotifs(el), userMenu: (ds, el) => showUserMenu(el),
  move: ds => mMove(ds.t || 'in', ds.p, ds.s), newProduct: () => mProduct(), editProduct: ds => mProduct(ds.p), label: ds => mLabel(ds.p), scanFind: mScanFind,
  stockDepot: ds => { S.ui.stockDepot = ds.d; refresh(); }, stockStatus: ds => { S.ui.stockStatus = S.ui.stockStatus === ds.s ? '' : ds.s; refresh(); },
  exportStock: () => { const d = S.ui.stockDepot; dlCSV(`stock-${d === 'all' ? 'tous-depots' : d}.csv`, [['Référence', 'Code-barres', 'Produit', 'Catégorie', "Prix d'achat", 'Prix détail', 'Prix gros', 'Stock', 'Seuil', 'Péremption', 'Statut', 'Valeur achat'], ...stockList().map(p => [p.ref, p.barcode, p.name, p.cat, p.buy, p.retail, p.wholesale, qtyAt(p, d), p.min, p.expiry ? fmtD(p.expiry) : '', ST[prodStatus(p, d)][0], p.buy * qtyAt(p, d)])]); },
  exportMoves: ds => { const p = prod(ds.p); dlCSV(`mouvements-${p.ref}.csv`, [['Date', 'Type', 'Dépôt', 'Quantité', 'Stock après', 'Utilisateur', 'Pièce / motif'], ...S.movements.filter(m => m.pid === p.id).map(m => [fmtDT(m.date), m.type, depName(m.depot), m.qty, m.after, usr(m.user).name, m.note])]); },
  // Inventaire
  invNew: mInvNew, invScan: mInvScan, invValidate: mInvValidate,
  invFilter: ds => { S.ui.invFilter = ds.f; refresh(); },
  invDraft: () => { save(); toast('Brouillon enregistré'); },
  invSheet: () => { const inv = curInv(); printHTML(`<div class="prt"><h1>Feuille de comptage — ${inv.id}</h1><p>${depName(inv.depot)} · imprimée le ${fmtDT(now())}</p><table class="tbl"><thead><tr><th>Réf.</th><th>Produit</th><th>Unité</th><th style="width:120px">Compté</th><th style="width:160px">Observations</th></tr></thead><tbody>${S.products.map(p => `<tr><td>${p.ref}</td><td>${esc(p.name)}</td><td>${esc(p.unit)}</td><td style="border-bottom:1px solid #999"></td><td style="border-bottom:1px solid #999"></td></tr>`).join('')}</tbody></table><p style="margin-top:20px">Compté par : ____________________ Signature : ____________________</p></div>`); },
  invCancel: () => { const inv = curInv(); guard('inventaire', 'Annuler un inventaire', () => confirmBox('Annuler l\'inventaire', `Abandonner ${inv.id} ? Les quantités saisies seront perdues et le stock ne sera pas modifié.`, 'Annuler l\'inventaire', () => { S.inventories = S.inventories.filter(i => i !== inv); log(`a annulé l'inventaire ${inv.id}`, 'inv'); toast('Inventaire annulé', 'warn'); refresh(); }, true)); },
  // Caisse
  openRegister: mOpenRegister, closeRegister: mCloseRegister, printZ: () => printZ(), held: mHeld, returnModal: () => mReturn(),
  posCat: ds => { S.ui.posCat = ds.c; $$('.pillb').forEach(b => b.classList.toggle('on', b.dataset.c === ds.c)); renderPos(); },
  cartAdd: ds => { const p = prod(ds.p), l = S.cart.lines.find(x => x.pid === ds.p), have = l ? l.qty : 0; if (have + 1 > (p.stock[S.depot] || 0)) return toast(`Stock insuffisant pour ${p.name}`, 'bad'); if (l) l.qty++; else S.cart.lines.push({ pid: ds.p, qty: 1 }); renderPos(false); },
  cartQty: ds => { const l = S.cart.lines.find(x => x.pid === ds.p); const p = prod(ds.p); if (+ds.d > 0 && l.qty + 1 > (p.stock[S.depot] || 0)) return toast(`Stock insuffisant pour ${p.name}`, 'bad'); l.qty += +ds.d; if (l.qty <= 0) S.cart.lines = S.cart.lines.filter(x => x !== l); renderPos(false); },
  cartClear: () => confirmBox('Vider le ticket', 'Retirer tous les articles du ticket en cours ?', 'Vider', () => { S.cart = { ...freshCart(), print: S.cart.print, wa: S.cart.wa, pdf: S.cart.pdf }; renderPos(false); }, true),
  cartTarif: ds => { const go2 = () => { S.cart.tarif = ds.t; renderPos(); }; ds.t === 'gros' ? guard('remise', 'Appliquer le tarif de gros', go2) : go2(); },
  cartPay: ds => { S.cart.method = ds.m; renderPos(false); },
  cartRecvSet: ds => { S.cart.recv = String(ds.v); renderPos(false); },
  cartDiscount: mDiscount, cartDiscountOff: () => { S.cart.discount = 0; renderPos(false); },
  hold: () => { S.held.push({ id: uid('h'), at: now(), user: S.user, cart: S.cart }); S.cart = { ...freshCart(), print: S.cart.print }; toast('Ticket mis en attente'); refresh(); },
  checkout,
  // Ventes
  docType: ds => { S.ui.docType = ds.t; S.ui.selDoc = null; S.ui.docSt = ''; refresh(); },
  selDoc: ds => { S.ui.selDoc = ds.id; refresh(); },
  openDoc: ds => { const d = S.docs.find(x => x.id === ds.id); if (!ALLOW.ventes()) return; S.ui.docType = d.type; S.ui.selDoc = d.id; S.ui.docQ = ''; S.ui.docSt = ''; go('ventes'); },
  newDoc: ds => mDocEditor(ds.t),
  convert: ds => mDocEditor('facture', S.docs.find(x => x.id === ds.id)),
  payDoc: ds => mPayment(ds.id),
  printDoc: ds => { const d = S.docs.find(x => x.id === ds.id); printHTML(d.type === 'ticket' ? receiptHTML(d) : docHTML(d)); if (ds.pdf) toast('Choisissez « Enregistrer au format PDF » dans la fenêtre d\'impression'); },
  shareDoc: ds => mShare(S.docs.find(x => x.id === ds.id), ds.ch),
  genBL: ds => { const d = S.docs.find(x => x.id === ds.id); const bl = { id: uid('d'), type: 'bl', num: nextNum('bl'), client: d.client, date: now(), tarif: d.tarif, lines: d.lines.map(l => ({ ...l })), discount: d.discount, payments: [], depot: d.depot, user: S.user, ref: d.num, status: 'preparer' }; S.docs.push(bl); log(`a généré le bon de livraison ${bl.num} pour ${d.num}`, 'doc'); S.ui.docType = 'bl'; S.ui.selDoc = bl.id; toast(`Bon de livraison ${bl.num} créé`); refresh(); },
  delivered: ds => { const d = S.docs.find(x => x.id === ds.id); d.status = 'livre'; d.deliveredAt = now(); log(`a marqué ${d.num} comme livré`, 'doc'); toast(`${d.num} livré`); refresh(); },
  devisRefuse: ds => confirmBox('Marquer le devis comme refusé', 'Le client a refusé ce devis ?', 'Confirmer', () => { const d = S.docs.find(x => x.id === ds.id); d.status = 'refuse'; log(`a marqué le devis ${d.num} comme refusé`, 'doc'); refresh(); }),
  avoirFrom: ds => mReturn(ds.id),
  exportDocs: () => dlCSV(`${S.ui.docType}s.csv`, [['N°', 'Date', 'Client', 'Tarif', 'Montant', 'Payé', 'Reste', 'Statut'], ...S.docs.filter(d => d.type === S.ui.docType).map(d => [d.num, fmtD(d.date), cli(d.client).name, d.tarif, docTotal(d), docPaid(d), docLeft(d), docStatus(d)[0]])]),
  // Clients
  party: ds => { S.ui.party = ds.p; refresh(); },
  selParty: ds => { if (ds.id.startsWith('s')) { S.ui.party = 'fournisseurs'; S.ui.selSup = ds.id; } else { S.ui.party = 'clients'; S.ui.selClient = ds.id; } refresh(); },
  newParty: ds => mParty(ds.k, null, ds.from === 'pos' ? id => { S.cart.client = id; renderPos(false); } : null),
  editParty: ds => mParty(ds.k, ds.id),
  clientPay: ds => mClientPay(ds.id), remind: ds => mRemind(ds.id), statement: ds => printStatement(ds.id), supPay: ds => mSupPay(ds.id),
  // Rapports
  rp: ds => { S.ui.rp = ds.p; refresh(); },
  exportReport: () => { const r = REPORT; dlCSV(`rapport-marges-${r.lab.replace(/\s+/g, '-')}.csv`, [['Produit', 'Qté vendue', 'CA', "Coût d'achat", 'Marge', 'Taux de marge %'], ...r.rows.map(x => [x.p.name, x.q, x.ca, x.cost, x.m, x.rate.toFixed(1)])]); },
  printReport: () => { const r = REPORT; printHTML(`<div class="prt"><h1>Rapport d'activité — ${r.lab}</h1><p>${esc(S.company.name)} · édité le ${fmtDT(now())}</p><p>Chiffre d'affaires : <strong>${F(r.CA)}</strong> · Marge brute : <strong>${F(r.MG)}</strong> · Ventes : <strong>${fmt(r.nb)}</strong></p><table class="tbl"><thead><tr><th>Produit</th><th class="r">Qté</th><th class="r">CA</th><th class="r">Marge</th><th class="r">Taux</th></tr></thead><tbody>${[...r.rows].sort((a, b) => b.m - a.m).map(x => `<tr><td>${esc(x.p.name)}</td><td class="r">${fmt(x.q)}</td><td class="r">${fmt(x.ca)}</td><td class="r">${fmt(x.m)}</td><td class="r">${x.rate.toFixed(1)} %</td></tr>`).join('')}</tbody></table></div>`); toast('Choisissez « Enregistrer au format PDF » pour obtenir le fichier'); },
  // Sécurité
  userEdit: ds => mUser(ds.id), rolesEdit: mRoles, backupNow: () => guard('admin', 'Sauvegarde', mBackup), restore: mRestore, companyEdit: () => guard('admin', "Modifier l'entreprise", mCompany), exportCompta,
  userToggle: ds => { const u = usr(ds.id); guard('admin', 'Gérer les utilisateurs', () => confirmBox(u.active ? 'Désactiver le compte' : 'Réactiver le compte', `${u.active ? 'Désactiver' : 'Réactiver'} le compte de ${esc(u.name)} ?${u.active ? ' Il ne pourra plus se connecter.' : ''}`, u.active ? 'Désactiver' : 'Réactiver', () => { u.active = !u.active; log(`a ${u.active ? 'réactivé' : 'désactivé'} le compte de ${u.name}`, 'secu'); refresh(); }, u.active)); },
  exportLog: () => dlCSV('journal-activite.csv', [['Date', 'Utilisateur', 'Action'], ...S.activity.map(a => [fmtDT(a.at), usr(a.user).name, a.text])])
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el || el.disabled) return;
  if (el.closest('#lock')) return;
  const fn = A[el.dataset.a]; if (!fn) return;
  if (el.tagName === 'A' && el.dataset.a === 'goto') e.preventDefault();
  fn(el.dataset, el, e);
});
document.addEventListener('keydown', e => {
  // Lignes de tableau cliquables accessibles au clavier
  if (e.key === 'Enter' && e.target.matches && e.target.matches('tr[data-a]')) { e.target.click(); }
});

/* Champs : filtres et saisies en direct */
const IN = {
  stockQ: v => { S.ui.stockQ = v; refreshStockTable(); }, stockCat: v => { S.ui.stockCat = v; refreshStockTable(); }, stockStatus: v => { S.ui.stockStatus = v; refresh(); },
  mvFilter: v => { S.ui.mvFilter = v; refresh(); },
  invQ: v => { S.ui.invQ = v; $('#inv-body').innerHTML = invRows(curInv()); },
  invCount: (v, el) => {
    const inv = curInv(), p = prod(el.dataset.p), raw = v.replace(/[^\d]/g, '');
    if (raw !== v) el.value = raw;
    if (raw === '') delete inv.counts[p.id]; else { const c = inv.counts[p.id] || { q: 0, r: '', by: S.user }; c.q = +raw; c.by = S.user; const d = c.q - (p.stock[inv.depot] || 0); if (d && !c.r) c.r = 'Non justifié'; if (!d) c.r = ''; inv.counts[p.id] = c; }
    const tr = el.closest('tr'), tmp = document.createElement('tbody'); tmp.innerHTML = invRow(inv, p); const nr = tmp.firstElementChild;
    ['ec', 'val', 'by'].forEach(k => { tr.querySelector(`[data-c="${k}"]`).replaceWith(nr.querySelector(`[data-c="${k}"]`)); });
    const sel = tr.querySelector('select'), nsel = nr.querySelector('select'); sel.disabled = nsel.disabled; sel.value = nsel.value;
    el.classList.toggle('d', !!(inv.counts[p.id] && inv.counts[p.id].q !== (p.stock[inv.depot] || 0)));
    $('#inv-sum').innerHTML = invSummary(inv); const nd = $('#inv-nd'); if (nd) nd.textContent = invStats(inv).diffs; save();
  },
  invReason: (v, el) => { const c = curInv().counts[el.dataset.p]; if (c) { c.r = v; save(); } },
  posQ: v => { S.ui.posQ = v; $('#pos-grid').innerHTML = posGrid(); },
  cartClient: v => { S.cart.client = v; if (v !== 'c0' && cli(v).type === 'Gros' && S.cart.tarif === 'detail') toast(`${cli(v).name} est un client de gros : pensez au tarif Gros`, 'warn'); renderPos(false); },
  cartRecv: (v, el) => { const raw = v.replace(/[^\d]/g, ''); S.cart.recv = raw; if (raw !== v) el.value = raw; const t = cartTotals(), chg = num(raw) - t.total, out = $('#pos-change'); out.textContent = raw === '' ? '—' : chg < 0 ? 'Manque ' + fmt(-chg) : fmt(chg); out.classList.toggle('neg', raw !== '' && chg < 0); save(); },
  cartOpt: (v, el) => { S.cart[el.dataset.k] = el.checked; save(); },
  docQ: v => { S.ui.docQ = v; refreshKeepFocus('docQ'); }, docSt: v => { S.ui.docSt = v; refresh(); },
  partyQ: v => { S.ui.partyQ = v; refreshKeepFocus('partyQ'); },
  logUser: v => { S.ui.logUser = v; refresh(); }
};
function refreshKeepFocus(key) { const el = document.activeElement, pos = el && el.selectionStart; refresh(); const n = $(`[data-in="${key}"]`); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) { /* ignoré */ } } }
document.addEventListener('input', e => { const el = e.target.closest('[data-in]'); if (!el || el.closest('.overlay')) return; const f = IN[el.dataset.in]; if (f) f(el.value, el, e); });

/* Recherche caisse : Entrée = ajouter l'article trouvé */
document.addEventListener('keydown', e => {
  if (e.target.id === 'pos-q' && e.key === 'Enter') {
    const v = e.target.value.trim().toLowerCase(); if (!v) return;
    const exact = S.products.find(p => p.barcode === v || p.ref.toLowerCase() === v), list = posList();
    const p = exact || (list.length === 1 ? list[0] : null);
    if (!p) return toast(list.length ? 'Plusieurs articles correspondent : touchez celui voulu' : 'Article introuvable', 'warn');
    A.cartAdd({ p: p.id }); S.ui.posQ = ''; e.target.value = ''; $('#pos-grid').innerHTML = posGrid();
  }
});

/* Raccourcis globaux */
document.addEventListener('keydown', e => {
  if (!$('#lock').hidden) {
    if (/^\d$/.test(e.key)) pinKey(e.key); else if (e.key === 'Backspace') pinKey('back'); else if (e.key === 'Escape') pinKey('clr');
    return;
  }
  if (e.key === 'Escape') { if (POP) return closePop(); if (MS.length) { MS[MS.length - 1].close(); return; } document.body.classList.remove('nav-open'); }
  if (MS.length) return;
  if (e.key === 'F2') { e.preventDefault(); if (CUR !== 'caisse' && ALLOW.caisse()) go('caisse'); else $('#pos-q')?.focus(); }
  if (e.key === 'F9' && CUR === 'caisse' && S.register.open) { e.preventDefault(); checkout(); }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { const s = $('[data-search]'); if (s) { e.preventDefault(); s.focus(); s.select(); } }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') { e.preventDefault(); showLock('lock'); }
});

/* ---------------------------------------------------------
   11. Démarrage
--------------------------------------------------------- */
S = load(); S.ui = { ...UI_DEFAULT, ...(S.ui || {}) };
if (!S.backups) S.backups = [];
tick(); setInterval(tick, 20000);
route();
showLock('login');
