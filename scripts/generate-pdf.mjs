/**
 * RegioSync - User Manual PDF Generator
 * Generates a clean, printable PDF from the inline HTML source below.
 * Output: public/regiosync-user-manual.pdf
 *
 * Usage: node scripts/generate-pdf.mjs
 * Requires: puppeteer (npm install puppeteer)
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

async function generatePDF() {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
    puppeteer = puppeteer.default ?? puppeteer;
  } catch {
    console.error('puppeteer not found. Installing...');
    const { execSync } = await import('child_process');
    execSync('npm install puppeteer --save-dev', { stdio: 'inherit', cwd: root });
    puppeteer = (await import('puppeteer')).default;
  }

  const publicDir = join(root, 'public');
  if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

  const pdfHtml = buildPdfHtml();
  const tmpHtml = join(root, 'scripts', '_manual_tmp.html');
  writeFileSync(tmpHtml, pdfHtml, 'utf8');

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto('file:///' + tmpHtml.replace(/\\/g, '/'), {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    const outPath = join(publicDir, 'regiosync-user-manual.pdf');
    await page.pdf({
      path: outPath,
      format: 'A4',
      margin: { top: '20mm', right: '18mm', bottom: '20mm', left: '18mm' },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="width:100%;font-size:8pt;color:#64748b;font-family:Arial,sans-serif;display:flex;justify-content:space-between;padding:0 18mm;">
          <span>RegioSync User Manual</span>
          <span>WAMOCON GmbH</span>
        </div>`,
      footerTemplate: `
        <div style="width:100%;font-size:8pt;color:#64748b;font-family:Arial,sans-serif;display:flex;justify-content:space-between;padding:0 18mm;">
          <span>Version 0.1.0 | May 2026 | info@regiosync.eu</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>`,
    });

    console.log('✓ PDF generated:', outPath);
  } finally {
    await browser.close();
    // Clean up temp file
    try { writeFileSync(tmpHtml, '', 'utf8'); } catch { /* ignore */ }
  }
}

function buildPdfHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>RegioSync User Manual</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;font-size:10pt;color:#1a1a1a;line-height:1.6;background:#fff}
  a{color:#16a34a;text-decoration:none}
  /* Cover page */
  .cover{page-break-after:always;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:40mm 20mm;}
  .cover-logo{width:60px;height:60px;background:#16a34a;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;}
  .cover-logo svg{width:36px;height:36px;stroke:white;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
  .cover h1{font-size:28pt;font-weight:900;color:#0f172a;margin-bottom:8px}
  .cover h2{font-size:16pt;font-weight:400;color:#64748b;margin-bottom:30px}
  .cover-line{width:80px;height:3px;background:#16a34a;margin:0 auto 30px}
  .cover p{font-size:11pt;color:#475569;line-height:1.8}
  .cover .meta{margin-top:40px;font-size:9pt;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:20px}
  /* TOC */
  .toc{page-break-after:always;padding:10mm 0}
  .toc h2{font-size:16pt;font-weight:700;color:#0f172a;margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid #16a34a}
  .toc-item{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px dotted #e2e8f0;font-size:10pt}
  .toc-item.sub{padding-left:20px;font-size:9pt;color:#475569}
  .toc-num{width:30px;color:#16a34a;font-weight:700;flex-shrink:0}
  .toc-title{flex:1}
  /* Content */
  .chapter{page-break-before:always;margin-bottom:0}
  .chapter:first-child{page-break-before:avoid}
  .ch-header{display:flex;align-items:center;gap:12px;margin-bottom:24px;padding-bottom:12px;border-bottom:2px solid #16a34a}
  .ch-num{width:36px;height:36px;border-radius:50%;background:#16a34a;color:#fff;font-size:12pt;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .ch-header h2{font-size:16pt;font-weight:800;color:#0f172a}
  h3{font-size:12pt;font-weight:700;color:#0f172a;margin:18px 0 6px;border-left:3px solid #16a34a;padding-left:8px}
  h4{font-size:9pt;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin:14px 0 4px}
  p{margin-bottom:8px;font-size:10pt;line-height:1.65;color:#1a1a1a}
  ul,ol{margin:4px 0 10px 20px}
  li{margin-bottom:3px;font-size:10pt;line-height:1.5}
  strong{font-weight:700}
  code{background:#f3f4f6;border:1px solid #ddd;border-radius:3px;padding:1px 4px;font-size:9pt;font-family:Consolas,"Courier New",monospace}
  hr{border:none;border-top:1px solid #e2e8f0;margin:16px 0}
  /* Callouts */
  .callout{display:flex;gap:8px;padding:8px 12px;border-radius:6px;margin:8px 0;border-left:3px solid}
  .callout p{margin:0;font-size:9pt}
  .callout strong{display:block;margin-bottom:2px;font-size:9pt}
  .info{background:#eff6ff;border-color:#2563eb}
  .tip{background:#f0fdf4;border-color:#16a34a}
  .warn{background:#fffbeb;border-color:#d97706}
  .danger{background:#fef2f2;border-color:#dc2626}
  /* Steps */
  .steps{list-style:none;margin:8px 0 16px;counter-reset:st;padding:0}
  .steps li{counter-increment:st;display:flex;gap:10px;margin-bottom:10px;align-items:flex-start}
  .steps li::before{content:counter(st);min-width:22px;height:22px;border-radius:50%;background:#16a34a;color:#fff;font-size:8pt;font-weight:900;flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:1px}
  .step-body{flex:1}
  .st{font-weight:700;font-size:10pt;margin-bottom:2px}
  .sd{font-size:9pt;color:#475569}
  /* Tables */
  .tbl{width:100%;border-collapse:collapse;margin:8px 0 14px;font-size:9pt;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden}
  .tbl th{background:#f8fafc;padding:6px 10px;text-align:left;font-weight:700;font-size:8pt;text-transform:uppercase;letter-spacing:.05em;color:#64748b;border-bottom:1px solid #e2e8f0}
  .tbl td{padding:5px 10px;border-bottom:1px solid #e2e8f0;vertical-align:top}
  .tbl tr:last-child td{border-bottom:none}
  .yes{color:#16a34a;font-weight:700}
  .no{color:#dc2626}
  .par{color:#d97706;font-size:8pt}
  /* Cards 2-col */
  .cards{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0 14px}
  .card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px}
  .card h4{margin:0 0 4px;font-size:9pt;color:#0f172a;text-transform:none;letter-spacing:normal}
  .card p{margin:0;font-size:8.5pt;color:#64748b}
  /* Role blocks */
  .role-blk{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;margin:6px 0 12px}
  .role-name{display:flex;align-items:center;gap:6px;font-weight:800;font-size:10pt;margin-bottom:6px}
  .rdot{width:8px;height:8px;border-radius:50%;display:inline-block}
  /* Price grid */
  .price-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:8px 0 14px}
  .pc{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px}
  .pc.pro{border-color:#16a34a;border-width:2px}
  .plan-lbl{font-size:7pt;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:#64748b;margin-bottom:4px}
  .plan-amt{font-size:20pt;font-weight:900;line-height:1;color:#0f172a}
  .plan-unit{font-size:8pt;color:#64748b;margin-bottom:8px}
  .plan-feats{list-style:none;margin:0;padding:0}
  .plan-feats li{display:flex;align-items:flex-start;gap:4px;margin-bottom:3px;font-size:8.5pt}
  .plan-feats li::before{content:"checkmark";color:#16a34a;font-weight:900;flex-shrink:0}
  /* Bilingual side-by-side */
  .bilingual{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:10px 0}
  .bilingual .lang-de,.bilingual .lang-en{font-size:9pt}
  .bilingual .lang-label{font-size:7pt;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:#16a34a;margin-bottom:4px}
  @page{size:A4;margin:20mm 18mm}
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div class="cover-logo">
    <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
  </div>
  <h1>RegioSync</h1>
  <h2>User Manual / Benutzerhandbuch</h2>
  <div class="cover-line"></div>
  <p>
    <strong>RegioSync</strong> is a web-based marketplace platform connecting local traders,<br>
    farmers, artisans, and producers directly with regional buyers.<br><br>
    <strong>RegioSync</strong> ist eine webbasierte Marktplatz-Plattform, die lokale Haendler,<br>
    Landwirte, Handwerker und Produzenten direkt mit regionalen Kaeufe rn verbindet.
  </p>
  <div class="meta">
    Version 0.1.0 | May 2026 | WAMOCON GmbH, Eschborn | info@regiosync.eu
  </div>
</div>

<!-- TABLE OF CONTENTS -->
<div class="toc">
  <h2>Table of Contents / Inhaltsverzeichnis</h2>
  <div class="toc-item"><span class="toc-num">1</span><span class="toc-title">Introduction / Einführung</span></div>
  <div class="toc-item sub"><span class="toc-num"></span><span class="toc-title">What is RegioSync? | System Requirements</span></div>
  <div class="toc-item"><span class="toc-num">2</span><span class="toc-title">Getting Started / Erste Schritte</span></div>
  <div class="toc-item sub"><span class="toc-num"></span><span class="toc-title">Registration | Login | Password Reset | Navigation</span></div>
  <div class="toc-item"><span class="toc-num">3</span><span class="toc-title">User Roles / Benutzerrollen</span></div>
  <div class="toc-item sub"><span class="toc-num"></span><span class="toc-title">Buyer | Seller | Administrator | Role Comparison</span></div>
  <div class="toc-item"><span class="toc-num">4</span><span class="toc-title">Shops &amp; Products / Shops &amp; Produkte</span></div>
  <div class="toc-item sub"><span class="toc-num"></span><span class="toc-title">Browse Shops | Product Categories | Reviews | Product Requests</span></div>
  <div class="toc-item"><span class="toc-num">5</span><span class="toc-title">Interactive Map / Interaktive Karte</span></div>
  <div class="toc-item sub"><span class="toc-num"></span><span class="toc-title">Map Features | Free vs Pro | Using Directions</span></div>
  <div class="toc-item"><span class="toc-num">6</span><span class="toc-title">For Sellers / Für Verkäufer</span></div>
  <div class="toc-item sub"><span class="toc-num"></span><span class="toc-title">Create Shop | Manage Products | Seller Dashboard | Respond to Requests</span></div>
  <div class="toc-item"><span class="toc-num">7</span><span class="toc-title">Administration</span></div>
  <div class="toc-item sub"><span class="toc-num"></span><span class="toc-title">User Management | Reports | Admin Dashboard</span></div>
  <div class="toc-item"><span class="toc-num">8</span><span class="toc-title">Profile &amp; Settings / Profil &amp; Einstellungen</span></div>
  <div class="toc-item"><span class="toc-num">9</span><span class="toc-title">Notifications / Benachrichtigungen</span></div>
  <div class="toc-item"><span class="toc-num">10</span><span class="toc-title">Plans &amp; Pricing / Tarife &amp; Preise</span></div>
  <div class="toc-item"><span class="toc-num">11</span><span class="toc-title">FAQ</span></div>
  <div class="toc-item"><span class="toc-num">12</span><span class="toc-title">Legal &amp; Contact / Rechtliches &amp; Kontakt</span></div>
</div>

<!-- 1. INTRODUCTION -->
<div class="chapter" id="ch1">
  <div class="ch-header"><div class="ch-num">1</div><h2>Introduction / Einführung</h2></div>

  <h3>What is RegioSync? / Was ist RegioSync?</h3>
  <div class="bilingual">
    <div>
      <div class="lang-label">English</div>
      <p>RegioSync is a web-based marketplace platform connecting local traders, farmers, artisans, and producers directly with regional buyers. Fresh regional products can be discovered through an interactive map — without middlemen and without transaction fees. The platform is developed and operated by <strong>WAMOCON GmbH</strong>, Eschborn, Germany.</p>
    </div>
    <div>
      <div class="lang-label">Deutsch</div>
      <p>RegioSync ist eine webbasierte Marktplatz-Plattform, die lokale Haendler, Landwirte, Handwerker und Produzenten direkt mit regionalen Kaeufe rn verbindet. Frische regionale Produkte koennen ueber eine interaktive Karte entdeckt werden - ohne Mittelmaenner und ohne Transaktionsgebuehren. Entwickelt und betrieben von <strong>WAMOCON GmbH</strong>, Eschborn.</p>
    </div>
  </div>

  <h3>Key Features</h3>
  <div class="cards">
    <div class="card"><h4>Local First</h4><p>Discover shops and products from your immediate neighbourhood. Support your community.</p></div>
    <div class="card"><h4>Direct Connection</h4><p>Communicate directly with producers — no platform transaction fees.</p></div>
    <div class="card"><h4>Interactive Map</h4><p>See all regional shops on a live OpenStreetMap and navigate to them (Pro).</p></div>
    <div class="card"><h4>Review System</h4><p>Rate shops 1–5 stars and leave text reviews to help the community decide.</p></div>
  </div>

  <h3>System Requirements</h3>
  <table class="tbl">
    <thead><tr><th>Requirement</th><th>Details</th></tr></thead>
    <tbody>
      <tr><td><strong>Browser</strong></td><td>Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</td></tr>
      <tr><td><strong>Internet</strong></td><td>Any broadband connection</td></tr>
      <tr><td><strong>Account</strong></td><td>Free registration with email address</td></tr>
      <tr><td><strong>App Download</strong></td><td>Not required — fully browser-based</td></tr>
      <tr><td><strong>JavaScript</strong></td><td>Must be enabled in the browser</td></tr>
    </tbody>
  </table>
</div>

<!-- 2. GETTING STARTED -->
<div class="chapter" id="ch2">
  <div class="ch-header"><div class="ch-num">2</div><h2>Getting Started / Erste Schritte</h2></div>

  <h3>Creating an Account (Registration)</h3>
  <p>Registration is free and takes less than two minutes. Navigate to <code>/register</code> or click "Sign Up" in the header.</p>
  <ol class="steps">
    <li><div class="step-body"><div class="st">Open the Registration Page</div><div class="sd">Click <strong>"Sign Up"</strong> in the header or navigate directly to <code>/register</code>.</div></div></li>
    <li><div class="step-body"><div class="st">Choose Your Account Type</div><div class="sd"><strong>Customer (Buyer)</strong>: discover shops and products. <strong>Seller</strong>: create your own shops and product listings.</div></div></li>
    <li><div class="step-body"><div class="st">Enter Your Personal Details</div><div class="sd">Required: Full name, email address, password (min. 8 characters), confirm password.</div></div></li>
    <li><div class="step-body"><div class="st">Verify Your Account by Email</div><div class="sd">You will receive a confirmation email. Click the link to activate your account. Check your spam folder if needed.</div></div></li>
    <li><div class="step-body"><div class="st">First Login</div><div class="sd">After email confirmation you can sign in with your email and password.</div></div></li>
  </ol>

  <h3>Logging In</h3>
  <ol class="steps">
    <li><div class="step-body"><div class="st">Open the Login Page</div><div class="sd">Click <strong>"Login"</strong> in the header or navigate to <code>/login</code>.</div></div></li>
    <li><div class="step-body"><div class="st">Enter Email and Password</div><div class="sd">Enter the email address you registered with and your password. Use the eye icon to show/hide the password.</div></div></li>
    <li><div class="step-body"><div class="st">Click "Login"</div><div class="sd">On success you are automatically redirected to the home page.</div></div></li>
  </ol>

  <h3>Resetting Your Password</h3>
  <ol class="steps">
    <li><div class="step-body"><div class="st">Click "Forgot Password?"</div><div class="sd">This link is on the login page below the password field.</div></div></li>
    <li><div class="step-body"><div class="st">Enter Your Email Address</div><div class="sd">Enter the email linked to your account and click <strong>"Send Reset Link"</strong>.</div></div></li>
    <li><div class="step-body"><div class="st">Open the Reset Link</div><div class="sd">Click the link in the email. It is valid for 60 minutes.</div></div></li>
    <li><div class="step-body"><div class="st">Set a New Password</div><div class="sd">Enter your new password (min. 8 characters) and confirm it.</div></div></li>
  </ol>

  <h3>Navigation Overview</h3>
  <table class="tbl">
    <thead><tr><th>Menu Item</th><th>Description</th><th>Visible for</th></tr></thead>
    <tbody>
      <tr><td><strong>Home</strong></td><td>Home page with overview</td><td>All</td></tr>
      <tr><td><strong>Shops</strong></td><td>Browse all registered shops</td><td>All</td></tr>
      <tr><td><strong>Map</strong></td><td>Interactive map with shop markers</td><td>All</td></tr>
      <tr><td><strong>Pricing</strong></td><td>Compare Free vs. Pro plans</td><td>All</td></tr>
      <tr><td><strong>Dashboard</strong></td><td>Seller overview and management</td><td>Sellers</td></tr>
      <tr><td><strong>Admin</strong></td><td>Full administration panel</td><td>Admins only</td></tr>
      <tr><td><strong>Profile</strong></td><td>Own profile and subscription</td><td>Logged-in users</td></tr>
    </tbody>
  </table>
</div>

<!-- 3. USER ROLES -->
<div class="chapter" id="ch3">
  <div class="ch-header"><div class="ch-num">3</div><h2>User Roles / Benutzerrollen</h2></div>

  <p>RegioSync distinguishes three user roles. The role is chosen at registration and can be changed by an administrator.</p>

  <h3>Buyer (Customer) / Käufer</h3>
  <div class="role-blk">
    <div class="role-name"><span class="rdot" style="background:#8b5cf6"></span>Default role after registration</div>
    <ul>
      <li>Browse and view shops (Free: max. 5 shops)</li>
      <li>View products in shops</li>
      <li>Find shops on the interactive map</li>
      <li>Write reviews (1–5 stars + text comment)</li>
      <li>Send product requests to sellers</li>
      <li>Manage own profile (name, photo, password)</li>
      <li>Receive and read notifications</li>
    </ul>
  </div>

  <h3>Seller / Verkäufer</h3>
  <div class="role-blk">
    <div class="role-name"><span class="rdot" style="background:#16a34a"></span>Can be chosen at registration</div>
    <p>All buyer rights plus:</p>
    <ul>
      <li>Create and manage one or more shops</li>
      <li>Create products with name, description, price, category, image, and discount</li>
      <li>Set shop location via GPS or manual map selection</li>
      <li>Accept or reject incoming product requests</li>
      <li>View statistics: shops, products, reviews, average rating</li>
      <li>Receive notifications for new reviews and requests</li>
    </ul>
  </div>

  <h3>Administrator</h3>
  <div class="role-blk">
    <div class="role-name"><span class="rdot" style="background:#2563eb"></span>System administrator with full access</div>
    <p>All rights of other roles plus:</p>
    <ul>
      <li>Full user management: change roles, ban/unban and delete users</li>
      <li>View and delete all shops and products on the platform</li>
      <li>View and manage reported content</li>
      <li>View system statistics: users, sellers, buyers</li>
    </ul>
  </div>

  <h3>Role Comparison</h3>
  <table class="tbl">
    <thead><tr><th>Feature</th><th>Buyer</th><th>Seller</th><th>Admin</th></tr></thead>
    <tbody>
      <tr><td>Browse shops</td><td><span class="yes">Yes</span></td><td><span class="yes">Yes</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>Use map</td><td><span class="yes">Yes</span></td><td><span class="yes">Yes</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>Write reviews</td><td><span class="yes">Yes</span></td><td><span class="yes">Yes</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>Create shops</td><td><span class="no">No</span></td><td><span class="yes">Yes</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>Add products</td><td><span class="no">No</span></td><td><span class="yes">Yes</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>Manage users</td><td><span class="no">No</span></td><td><span class="no">No</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>Handle reports</td><td><span class="no">No</span></td><td><span class="no">No</span></td><td><span class="yes">Yes</span></td></tr>
    </tbody>
  </table>
</div>

<!-- 4. SHOPS & PRODUCTS -->
<div class="chapter" id="ch4">
  <div class="ch-header"><div class="ch-num">4</div><h2>Shops &amp; Products / Shops &amp; Produkte</h2></div>

  <h3>Browsing Shops</h3>
  <p>Navigate to <strong>Shops</strong> (<code>/shops</code>). All registered local shops are shown as tiles. Use the search bar to filter by shop name or location.</p>
  <div class="callout info"><p><strong>Free vs. Pro:</strong> On the free plan users can view up to 5 shops. Upgrading to Pro removes this restriction and enables unlimited browsing.</p></div>

  <h3>Shop Detail Page</h3>
  <p>Clicking a shop tile opens the detail page with: shop name, description, address, contact details, all available products with price and category, average rating, all reviews, and action buttons.</p>
  <p><strong>Pro users</strong> additionally see a <strong>"Get Directions"</strong> button for turn-by-turn navigation to the shop via OpenStreetMap.</p>

  <h3>Product Categories</h3>
  <div class="cards">
    <div class="card"><p><strong>Fruits</strong> — Fresh regional fruit</p></div>
    <div class="card"><p><strong>Vegetables</strong> — Seasonal vegetables</p></div>
    <div class="card"><p><strong>Dairy</strong> — Milk, cheese, butter</p></div>
    <div class="card"><p><strong>Meat</strong> — Regional meat products</p></div>
    <div class="card"><p><strong>Bakery</strong> — Bread, pastries</p></div>
    <div class="card"><p><strong>Honey</strong> — Local honey products</p></div>
    <div class="card"><p><strong>Eggs</strong> — Free-range eggs</p></div>
    <div class="card"><p><strong>Herbs</strong> — Fresh and dried herbs</p></div>
    <div class="card"><p><strong>Drinks</strong> — Regional beverages</p></div>
    <div class="card"><p><strong>Other</strong> — All other regional products</p></div>
  </div>

  <h3>Writing Reviews</h3>
  <ol class="steps">
    <li><div class="step-body"><div class="st">Open the shop detail page</div></div></li>
    <li><div class="step-body"><div class="st">Click "Write a Review"</div><div class="sd">The review form will appear.</div></div></li>
    <li><div class="step-body"><div class="st">Choose a star rating (1–5)</div></div></li>
    <li><div class="step-body"><div class="st">Write your comment</div><div class="sd">Describe your experience in the text field.</div></div></li>
    <li><div class="step-body"><div class="st">Click "Submit Review"</div><div class="sd">The shop owner is automatically notified.</div></div></li>
  </ol>

  <h3>Sending Product Requests</h3>
  <p>Buyers can send a request for a specific product to the seller. <strong>Status options:</strong> Pending / Accepted / Rejected.</p>
  <ol class="steps">
    <li><div class="step-body"><div class="st">Find a product on the shop detail page</div></div></li>
    <li><div class="step-body"><div class="st">Click "Request Product"</div><div class="sd">The request form opens. The product name is pre-filled.</div></div></li>
    <li><div class="step-body"><div class="st">Describe your request and submit</div><div class="sd">Enter description (e.g. quantity, delivery details) and click "Send Request".</div></div></li>
  </ol>
</div>

<!-- 5. MAP -->
<div class="chapter" id="ch5">
  <div class="ch-header"><div class="ch-num">5</div><h2>Interactive Map / Interaktive Karte</h2></div>

  <p>The map (<code>/map</code>) displays all registered shops as coloured markers on an OpenStreetMap base map. Click a marker to see shop name, address, and a link to the detail page.</p>

  <h3>Map Features: Free vs. Pro</h3>
  <table class="tbl">
    <thead><tr><th>Feature</th><th>Free</th><th>Pro</th></tr></thead>
    <tbody>
      <tr><td>View map</td><td><span class="yes">Yes</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>See shop markers</td><td><span class="yes">Yes</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>Zoom controls</td><td><span class="par">Limited</span></td><td><span class="yes">Full</span></td></tr>
      <tr><td>Get Directions</td><td><span class="no">No</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>My Location</td><td><span class="no">No</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>Fullscreen view</td><td><span class="no">No</span></td><td><span class="yes">Yes</span></td></tr>
    </tbody>
  </table>

  <h3>Using Directions (Pro only)</h3>
  <ol class="steps">
    <li><div class="step-body"><div class="st">Click a shop marker</div><div class="sd">A popup appears with shop name and details.</div></div></li>
    <li><div class="step-body"><div class="st">Click "Directions"</div><div class="sd">The system detects your location (browser permission required) and calculates the route.</div></div></li>
    <li><div class="step-body"><div class="st">Follow navigation instructions</div><div class="sd">The route is drawn on the map. Step-by-step instructions appear in a side panel.</div></div></li>
  </ol>

  <div class="callout tip"><p><strong>Tip:</strong> Allow the browser access to your location when prompted to use "My Location" and route calculation. This is a browser-level permission and can be revoked at any time in browser settings.</p></div>
</div>

<!-- 6. FOR SELLERS -->
<div class="chapter" id="ch6">
  <div class="ch-header"><div class="ch-num">6</div><h2>For Sellers / Für Verkäufer</h2></div>

  <h3>Creating a Shop</h3>
  <p>Navigate to <code>/seller/shops/new</code> or click <strong>"Create Shop"</strong> in the seller dashboard.</p>
  <ol class="steps">
    <li><div class="step-body"><div class="st">Enter Shop Name</div><div class="sd">Choose a descriptive name that represents your shop and its offering.</div></div></li>
    <li><div class="step-body"><div class="st">Write a Description</div><div class="sd">Describe your products and special features. A good description helps buyers find and trust your shop.</div></div></li>
    <li><div class="step-body"><div class="st">Enter Address (with Autocomplete)</div><div class="sd">Type your address. The system suggests addresses via OpenStreetMap. Select an entry — city and coordinates are filled in automatically.</div></div></li>
    <li><div class="step-body"><div class="st">Alternatively: Use GPS Location</div><div class="sd">Click "Use GPS Location". After browser permission is granted, coordinates are filled in automatically.</div></div></li>
    <li><div class="step-body"><div class="st">Save the Shop</div><div class="sd">Click "Create Shop". The shop immediately appears on the map and in the shops list.</div></div></li>
  </ol>

  <h3>Managing Products</h3>
  <p>In the seller dashboard navigate to your shop and click <strong>"Add Product"</strong>.</p>
  <table class="tbl">
    <thead><tr><th>Field</th><th>Description</th><th>Required</th></tr></thead>
    <tbody>
      <tr><td><strong>Product Name</strong></td><td>Clear, descriptive name</td><td><span class="yes">Yes</span></td></tr>
      <tr><td><strong>Description</strong></td><td>Product details and features</td><td><span class="yes">Yes</span></td></tr>
      <tr><td><strong>Price (EUR incl. VAT)</strong></td><td>Price in Euros</td><td><span class="yes">Yes</span></td></tr>
      <tr><td><strong>Quantity Available</strong></td><td>0 = Not available (shown as unavailable to buyers)</td><td><span class="yes">Yes</span></td></tr>
      <tr><td><strong>Category</strong></td><td>Select from the category list</td><td><span class="yes">Yes</span></td></tr>
      <tr><td><strong>Product Image</strong></td><td>Upload a photo of the product</td><td>Optional</td></tr>
      <tr><td><strong>Discount (%)</strong></td><td>Percentage discount off the regular price</td><td>Optional</td></tr>
    </tbody>
  </table>

  <h3>Seller Dashboard</h3>
  <p>The seller dashboard (<code>/seller/dashboard</code>) provides a complete overview of your RegioSync activity.</p>
  <ul>
    <li><strong>Statistics:</strong> Total shops, products, reviews, and average rating at a glance.</li>
    <li><strong>My Shops:</strong> List of all shops with quick access to editing and product management.</li>
    <li><strong>Incoming Requests:</strong> All product requests from buyers, sorted by shop and status (Pending / Accepted / Rejected).</li>
    <li><strong>Review Overview:</strong> All customer reviews in one consolidated view.</li>
  </ul>

  <h3>Responding to Product Requests</h3>
  <ol class="steps">
    <li><div class="step-body"><div class="st">Open Dashboard (<code>/seller/dashboard</code>)</div></div></li>
    <li><div class="step-body"><div class="st">View Incoming Requests</div><div class="sd">New requests appear in the "Incoming Requests" section with status <strong>Pending</strong>.</div></div></li>
    <li><div class="step-body"><div class="st">Accept or Reject</div><div class="sd">Click <strong>"Accept"</strong> (green) or <strong>"Reject"</strong> (red). The buyer is automatically notified via the notification system.</div></div></li>
  </ol>
</div>

<!-- 7. ADMIN -->
<div class="chapter" id="ch7">
  <div class="ch-header"><div class="ch-num">7</div><h2>Administration</h2></div>

  <p>The admin area (<code>/admin</code>) is exclusively accessible to users with the <strong>Administrator</strong> role. It provides tools to manage all users and moderate the platform.</p>

  <h3>Dashboard Metrics</h3>
  <div class="cards">
    <div class="card"><h4>Total Users</h4><p>All registered users on the platform.</p></div>
    <div class="card"><h4>Total Sellers</h4><p>Users with the seller role.</p></div>
    <div class="card"><h4>Total Customers</h4><p>Users with the buyer role.</p></div>
    <div class="card"><h4>Active Users</h4><p>Non-banned users.</p></div>
  </div>

  <h3>User Management</h3>
  <table class="tbl">
    <thead><tr><th>Action</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><strong>Change Role</strong></td><td>Promote or demote user to buyer, seller, or super admin.</td></tr>
      <tr><td><strong>Ban User</strong></td><td>Bans the user. They can no longer log in to the platform.</td></tr>
      <tr><td><strong>Unban User</strong></td><td>Lifts the ban and restores full platform access.</td></tr>
      <tr><td><strong>Delete User</strong></td><td>Permanently deletes the user and all associated data (shops, products, reviews). Irreversible.</td></tr>
    </tbody>
  </table>
  <div class="callout danger"><p><strong>Warning:</strong> Deleting a user is permanent and cannot be undone. All user data — including shops, products, and reviews — will be permanently removed.</p></div>

  <h3>Reported Content (Reports)</h3>
  <p>In the <strong>"Reports"</strong> tab, admins see all content reported by users. For each report:</p>
  <ul>
    <li>Reported user and reporter identity</li>
    <li>Report reason and description</li>
    <li>Date and current status (Open / Resolved)</li>
    <li>Action buttons: Resolve or Dismiss</li>
  </ul>
</div>

<!-- 8. PROFILE -->
<div class="chapter" id="ch8">
  <div class="ch-header"><div class="ch-num">8</div><h2>Profile &amp; Settings / Profil &amp; Einstellungen</h2></div>

  <p>Your personal profile is available at <code>/profile</code>. Here you manage your personal details, profile picture, and subscription.</p>

  <h3>Editing Your Profile</h3>
  <ol class="steps">
    <li><div class="step-body"><div class="st">Open Profile</div><div class="sd">Click your profile picture or name in the header and select "Profile".</div></div></li>
    <li><div class="step-body"><div class="st">Click "Edit Profile"</div><div class="sd">The edit form becomes active. You can now change your full name.</div></div></li>
    <li><div class="step-body"><div class="st">Change Data and Save</div><div class="sd">Update your full name and click <strong>"Save"</strong> to apply changes.</div></div></li>
  </ol>

  <h3>Uploading a Profile Picture</h3>
  <ol class="steps">
    <li><div class="step-body"><div class="st">Click the Camera Icon</div><div class="sd">The camera icon is located over your current profile picture.</div></div></li>
    <li><div class="step-body"><div class="st">Select an Image File</div><div class="sd">Select a JPG or PNG file from your device. The image is uploaded and displayed immediately.</div></div></li>
  </ol>

  <h3>Profile Information</h3>
  <table class="tbl">
    <thead><tr><th>Information</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><strong>Full Name</strong></td><td>Editable via "Edit Profile"</td></tr>
      <tr><td><strong>Email</strong></td><td>Not changeable (set at registration). Contact support to change.</td></tr>
      <tr><td><strong>Role</strong></td><td>Buyer / Seller / Admin — shown as a badge</td></tr>
      <tr><td><strong>Subscription</strong></td><td>Free or Pro with upgrade option</td></tr>
      <tr><td><strong>Member Since</strong></td><td>Account creation date</td></tr>
    </tbody>
  </table>
</div>

<!-- 9. NOTIFICATIONS -->
<div class="chapter" id="ch9">
  <div class="ch-header"><div class="ch-num">9</div><h2>Notifications / Benachrichtigungen</h2></div>

  <p>RegioSync sends automatic notifications on important events. Access via the bell icon in the header or at <code>/notifications</code>.</p>

  <h3>Notification Types</h3>
  <table class="tbl">
    <thead><tr><th>Type</th><th>Recipient</th><th>Trigger</th></tr></thead>
    <tbody>
      <tr><td>New Review</td><td>Seller</td><td>A buyer writes a review for one of your shops</td></tr>
      <tr><td>New Product Request</td><td>Seller</td><td>A buyer sends a product request to your shop</td></tr>
      <tr><td>Request Status Changed</td><td>Buyer</td><td>Seller accepts or rejects a product request</td></tr>
    </tbody>
  </table>

  <h3>Managing Notifications</h3>
  <ul>
    <li><strong>Mark individually as read:</strong> Click the checkmark icon next to a notification.</li>
    <li><strong>Mark all as read:</strong> Click "Mark all as read" in the top-right of the notifications page.</li>
    <li><strong>Unread notifications</strong> are highlighted with a green left border and show a badge counter on the bell icon in the header.</li>
  </ul>
</div>

<!-- 10. PRICING -->
<div class="chapter" id="ch10">
  <div class="ch-header"><div class="ch-num">10</div><h2>Plans &amp; Pricing / Tarife &amp; Preise</h2></div>

  <p>RegioSync is available in two plans. The pricing page is at <code>/pricing</code>.</p>

  <div class="price-grid">
    <div class="pc">
      <div class="plan-lbl">Free</div>
      <div class="plan-amt">0 <span style="font-size:10pt;font-weight:400">EUR</span></div>
      <div class="plan-unit">per month — permanently free</div>
      <ul class="plan-feats">
        <li>Browse up to 5 shops</li>
        <li>Basic map view (no zoom)</li>
        <li>View product listings</li>
        <li>Write reviews</li>
        <li>Send product requests</li>
        <li>Basic search</li>
      </ul>
    </div>
    <div class="pc pro">
      <div class="plan-lbl">Pro</div>
      <div class="plan-amt">4.99 <span style="font-size:10pt;font-weight:400">EUR</span></div>
      <div class="plan-unit">per month | 47.99 EUR / year (save 20%)</div>
      <ul class="plan-feats">
        <li>Unlimited shop browsing</li>
        <li>Full interactive map with zoom</li>
        <li>Get directions to shops</li>
        <li>Priority product requests</li>
        <li>Advanced search and filters</li>
        <li>Exclusive deals and discounts</li>
        <li>PRO badge on profile</li>
        <li>Early access to new shops</li>
      </ul>
    </div>
  </div>

  <h3>Full Feature Comparison</h3>
  <table class="tbl">
    <thead><tr><th>Feature</th><th>Free</th><th>Pro</th></tr></thead>
    <tbody>
      <tr><td>Registration and Login</td><td><span class="yes">Yes</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>Browse shops</td><td>Max. 5</td><td><strong>Unlimited</strong></td></tr>
      <tr><td>Write reviews</td><td><span class="yes">Yes</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>Send product requests</td><td><span class="yes">Yes</span></td><td><span class="yes">Yes (Priority)</span></td></tr>
      <tr><td>Map (full access)</td><td><span class="no">No</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>Get Directions</td><td><span class="no">No</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>Advanced search</td><td><span class="no">No</span></td><td><span class="yes">Yes</span></td></tr>
      <tr><td>Exclusive deals</td><td><span class="no">No</span></td><td><span class="yes">Yes</span></td></tr>
    </tbody>
  </table>

  <h3>Upgrading to Pro</h3>
  <ol class="steps">
    <li><div class="step-body"><div class="st">Open the Pricing Page</div><div class="sd">Navigate to <code>/pricing</code> or click "Upgrade to Pro" in the header.</div></div></li>
    <li><div class="step-body"><div class="st">Choose Billing Period</div><div class="sd">Monthly (4.99 EUR/month) or yearly (47.99 EUR/year — 20% cheaper) using the toggle.</div></div></li>
    <li><div class="step-body"><div class="st">Select Plan</div><div class="sd">Click "Choose Plan" below the Pro tier to begin the upgrade process.</div></div></li>
  </ol>
</div>

<!-- 11. FAQ -->
<div class="chapter" id="ch11">
  <div class="ch-header"><div class="ch-num">11</div><h2>FAQ</h2></div>

  <h3>General</h3>
  <h4>Is RegioSync free?</h4>
  <p>Yes. The basic version is permanently free. The Pro plan costs 4.99 EUR per month and unlocks all features including unlimited shop browsing, full map access, and directions.</p>
  <h4>Do I need an app?</h4>
  <p>No. RegioSync is fully browser-based and works on all modern devices (desktop, tablet, smartphone) without any app download.</p>
  <h4>Which languages are supported?</h4>
  <p>RegioSync supports German and English. The language can be changed at any time via the language switcher in the header.</p>
  <h4>Is RegioSync available on mobile?</h4>
  <p>Yes. RegioSync is responsive and works on all screen sizes via any modern mobile browser.</p>

  <h3>Account and Security</h3>
  <h4>I forgot my password. What should I do?</h4>
  <p>Go to the login page and click "Forgot Password?". Enter your email address and you will receive a reset link by email valid for 60 minutes.</p>
  <h4>Can I change my email address?</h4>
  <p>Currently the email address cannot be changed independently through the app. Please contact support at info@regiosync.eu.</p>
  <h4>My account has been banned. What can I do?</h4>
  <p>Banned accounts cannot log in. Contact us at info@regiosync.eu if you believe the ban was made in error, providing your full name and the email address linked to the account.</p>

  <h3>Sellers</h3>
  <h4>How many shops can I create?</h4>
  <p>There is currently no fixed limit. You can create multiple shops with different products and locations.</p>
  <h4>Are transaction fees charged?</h4>
  <p>No. RegioSync charges no transaction fees. Payment takes place directly between buyer and seller outside the platform.</p>
  <h4>What happens to my shop if I cancel my Pro subscription?</h4>
  <p>Your shops and products remain active. You will revert to the Free tier features (e.g. limited map access for buyers).</p>
</div>

<!-- 12. LEGAL -->
<div class="chapter" id="ch12">
  <div class="ch-header"><div class="ch-num">12</div><h2>Legal &amp; Contact / Rechtliches &amp; Kontakt</h2></div>

  <h3>Provider / Anbieter</h3>
  <p>
    <strong>WAMOCON GmbH</strong><br>
    Hauptstrasse 2<br>
    65760 Eschborn<br>
    Germany<br>
    Email: info@regiosync.eu
  </p>

  <h3>Legal Documents</h3>
  <table class="tbl">
    <thead><tr><th>Document</th><th>URL</th></tr></thead>
    <tbody>
      <tr><td>Imprint / Impressum</td><td>/imprint</td></tr>
      <tr><td>Privacy Policy / Datenschutzerklarung</td><td>/privacy</td></tr>
      <tr><td>Terms and Conditions / AGB</td><td>/terms</td></tr>
    </tbody>
  </table>

  <h3>Support and Help</h3>
  <ul>
    <li><strong>Email:</strong> info@regiosync.eu</li>
    <li><strong>Help page:</strong> /help — Context-sensitive help on every page via the "?" icon</li>
    <li><strong>In-app help:</strong> Every page has a "?" icon. Hover over it to see context-sensitive help text for the current page.</li>
  </ul>

  <hr>
  <p style="font-size:8pt;color:#64748b;text-align:center;margin-top:16px">
    RegioSync User Manual — Version 0.1.0 — May 2026<br>
    WAMOCON GmbH, Eschborn, Germany — info@regiosync.eu — All rights reserved.
  </p>
</div>

</body>
</html>`;
}

generatePDF().catch((err) => {
  console.error('PDF generation failed:', err.message);
  process.exit(1);
});
