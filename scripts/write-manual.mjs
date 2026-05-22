import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const html = `<!DOCTYPE html>
<html lang="de" data-lang="de" data-theme="light">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>RegioSync - Benutzerhandbuch / User Manual | WAMOCON GmbH</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --green:#16a34a;--green-dk:#15803d;--green-bg:rgba(22,163,74,.1);
  --blue:#2563eb;--amber:#d97706;--red:#dc2626;
  --bg:#ffffff;--bg2:#f8fafc;--bg3:#f1f5f9;
  --text:#0f172a;--muted:#64748b;--dim:#94a3b8;
  --border:#e2e8f0;
  --sidebar:260px;--header:60px;--max:1200px;
  --font:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,system-ui,sans-serif;
}
[data-theme="dark"]{--bg:#0f172a;--bg2:#1e293b;--bg3:#1e293b;--text:#f1f5f9;--muted:#94a3b8;--dim:#64748b;--border:#334155;}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.7;transition:background .2s,color .2s}
a{color:var(--green);text-decoration:none}
a:hover{text-decoration:underline}
/* Topbar */
.topbar{position:sticky;top:0;z-index:300;height:var(--header);background:var(--bg);border-bottom:1px solid var(--border);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;gap:1rem;}
.tb-brand{display:flex;align-items:center;gap:.6rem;font-weight:800;font-size:1rem;color:var(--text)}
.tb-dot{width:28px;height:28px;border-radius:8px;background:var(--green);display:flex;align-items:center;justify-content:center}
.tb-dot svg{width:16px;height:16px;stroke:white;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.tb-right{display:flex;align-items:center;gap:.5rem}
.pill{display:flex;background:var(--bg3);border-radius:8px;padding:2px;border:1px solid var(--border)}
.pill button{padding:.25rem .55rem;border-radius:6px;font-size:.72rem;font-weight:800;border:none;cursor:pointer;background:transparent;color:var(--muted);transition:.2s}
.pill button.on{background:var(--green);color:#fff}
.icon-btn{padding:.4rem;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--muted);cursor:pointer;display:flex;align-items:center;transition:.2s}
.icon-btn:hover{border-color:var(--green);color:var(--green)}
.dl-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.4rem .9rem;border-radius:8px;background:var(--green);color:#fff;font-size:.78rem;font-weight:700;border:none;cursor:pointer;transition:.2s;text-decoration:none}
.dl-btn:hover{background:var(--green-dk);color:#fff;text-decoration:none}
/* Layout */
.layout{display:flex;max-width:var(--max);margin:0 auto;min-height:calc(100vh - var(--header))}
/* Sidebar */
.sidebar{width:var(--sidebar);flex-shrink:0;position:sticky;top:var(--header);height:calc(100vh - var(--header));overflow-y:auto;padding:1.5rem 1rem 3rem;border-right:1px solid var(--border);scrollbar-width:thin;scrollbar-color:var(--border) transparent;}
.sidebar::-webkit-scrollbar{width:4px}
.sidebar::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
.nav-lbl{font-size:.65rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);padding:.5rem .6rem .3rem;margin-top:1rem}
.nav-lbl:first-child{margin-top:0}
.nav-a{display:flex;align-items:center;gap:.55rem;padding:.38rem .65rem;border-radius:7px;font-size:.83rem;font-weight:500;color:var(--muted);cursor:pointer;transition:.15s;text-decoration:none;border:1px solid transparent;margin-bottom:2px}
.nav-a:hover{background:var(--bg2);color:var(--text);text-decoration:none}
.nav-a.active{background:var(--green-bg);color:var(--green);font-weight:700;border-color:rgba(22,163,74,.2)}
.num{width:20px;height:20px;border-radius:50%;background:var(--bg3);color:var(--dim);font-size:.65rem;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:.15s}
.nav-a.active .num,.nav-a:hover .num{background:var(--green);color:#fff}
/* Main */
.main{flex:1;min-width:0;padding:2.5rem 3rem 6rem 2.5rem}
@media(max-width:900px){.sidebar{display:none}.main{padding:1.5rem 1.25rem 4rem}}
/* Sections */
.section{margin-bottom:4rem;padding-top:.5rem}
.sec-hdr{display:flex;align-items:center;gap:.9rem;margin-bottom:2rem;padding-bottom:1rem;border-bottom:2px solid var(--border)}
.badge{width:36px;height:36px;border-radius:50%;background:var(--green);color:#fff;font-weight:900;font-size:.95rem;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sec-hdr h2{font-size:1.55rem;font-weight:800;line-height:1.25}
h3{font-size:1.05rem;font-weight:700;margin:2rem 0 .6rem;color:var(--text)}
h4{font-size:.8rem;font-weight:700;margin:1.25rem 0 .35rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
p{margin-bottom:.85rem;font-size:.93rem;line-height:1.75;color:var(--text)}
ul,ol{margin:.4rem 0 .9rem 1.4rem}
li{margin-bottom:.3rem;font-size:.93rem;line-height:1.6;color:var(--text)}
strong{font-weight:700}
hr{border:none;border-top:1px solid var(--border);margin:2.5rem 0}
code{background:var(--bg3);border:1px solid var(--border);border-radius:4px;padding:.05rem .35rem;font-size:.84rem;font-family:Consolas,monospace}
/* Callouts */
.callout{display:flex;gap:.75rem;padding:.85rem 1.1rem;border-radius:10px;margin:1rem 0;border-left:3px solid}
.ci{font-size:1.1rem;flex-shrink:0;line-height:1.4}
.callout p{margin:0;font-size:.88rem}
.callout strong{display:block;margin-bottom:.15rem;font-size:.85rem}
.info{background:rgba(37,99,235,.07);border-color:var(--blue)}
.tip{background:var(--green-bg);border-color:var(--green)}
.warn{background:rgba(217,119,6,.07);border-color:var(--amber)}
.danger{background:rgba(220,38,38,.07);border-color:var(--red)}
/* Steps */
.steps{list-style:none;margin:.75rem 0 1.5rem;counter-reset:st;padding:0}
.steps li{counter-increment:st;display:flex;gap:.9rem;margin-bottom:1.1rem;align-items:flex-start}
.steps li::before{content:counter(st);min-width:26px;height:26px;border-radius:50%;background:var(--green);color:#fff;font-size:.72rem;font-weight:900;flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:.15rem}
.sb{flex:1}
.st{font-weight:700;font-size:.93rem;margin-bottom:.2rem}
.sd{font-size:.87rem;color:var(--muted);margin:0}
/* Tables */
.tbl{overflow-x:auto;margin:1rem 0 1.5rem;border-radius:10px;border:1px solid var(--border)}
table{width:100%;border-collapse:collapse;font-size:.87rem}
th{background:var(--bg2);padding:.6rem .85rem;text-align:left;font-weight:700;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);border-bottom:1px solid var(--border)}
td{padding:.55rem .85rem;border-bottom:1px solid var(--border);vertical-align:top}
tr:last-child td{border-bottom:none}
.yes{color:var(--green);font-weight:700}
.no{color:var(--red)}
.par{color:var(--amber)}
/* Cards */
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:.9rem;margin:1rem 0 1.5rem}
.card{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:1.1rem}
.card h4{margin:0 0 .4rem;font-size:.82rem;color:var(--text);text-transform:none;letter-spacing:normal}
.card p{margin:0;font-size:.83rem;color:var(--muted)}
.card .icon{font-size:1.3rem;margin-bottom:.5rem}
/* Role blocks */
.role-blk{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:1.25rem;margin:.75rem 0 1.25rem}
.role-name{display:flex;align-items:center;gap:.5rem;font-weight:800;font-size:.95rem;margin-bottom:.5rem}
.rdot{width:10px;height:10px;border-radius:50%}
/* Price grid */
.price-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0 1.5rem}
@media(max-width:560px){.price-grid{grid-template-columns:1fr}}
.pc{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:1.5rem}
.pc.pro{border-color:var(--green);border-width:2px}
.plan-lbl{font-size:.7rem;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:.5rem}
.plan-amt{font-size:2.2rem;font-weight:900;line-height:1}
.plan-unit{font-size:.82rem;color:var(--muted);margin-bottom:1rem}
.plan-feats{list-style:none;margin:0;padding:0}
.plan-feats li{display:flex;align-items:flex-start;gap:.45rem;margin-bottom:.4rem;font-size:.85rem}
.plan-feats li::before{content:"✓";color:var(--green);font-weight:900;flex-shrink:0}
/* i18n */
[data-lang="en"] .de{display:none!important}
[data-lang="de"] .en{display:none!important}
/* Footer */
.footer{border-top:1px solid var(--border);padding:1.5rem 2rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;font-size:.82rem;color:var(--muted)}
/* Print */
@media print{
  .topbar,.sidebar,.footer{display:none!important}
  .layout{display:block}
  .main{padding:0}
  body{font-size:10.5pt;color:#000;background:#fff}
  .section{page-break-inside:avoid;margin-bottom:2rem}
  h2{font-size:14pt}h3{font-size:11pt}
  .callout,.card,.role-blk,.pc{border:1px solid #ccc}
  a{color:#16a34a}
  code{background:#f3f4f6;border:1px solid #ddd}
}
</style>
</head>
<body>

<header class="topbar">
  <div class="tb-brand">
    <div class="tb-dot">
      <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    </div>
    <span>RegioSync</span>
    <span style="color:var(--dim);font-weight:400;font-size:.8rem;margin-left:.25rem">
      <span class="de">Benutzerhandbuch</span><span class="en">User Manual</span>
    </span>
  </div>
  <div class="tb-right">
    <div class="pill">
      <button id="btn-de" class="on" onclick="setLang('de')">DE</button>
      <button id="btn-en" onclick="setLang('en')">EN</button>
    </div>
    <button class="icon-btn" onclick="toggleTheme()" title="Toggle theme">
      <span id="theme-icon">&#127769;</span>
    </button>
    <a class="dl-btn" href="/regiosync-user-manual.pdf" download="RegioSync-User-Manual.pdf">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      <span class="de">PDF herunterladen</span><span class="en">Download PDF</span>
    </a>
    <button class="icon-btn" onclick="window.print()" title="Print">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
    </button>
  </div>
</header>

<div class="layout">
  <!-- SIDEBAR -->
  <nav class="sidebar">
    <div class="nav-lbl de">Inhalt</div>
    <div class="nav-lbl en">Contents</div>
    <a class="nav-a active" href="#s1"><span class="num">1</span><span class="de">Einf&#252;hrung</span><span class="en">Introduction</span></a>
    <a class="nav-a" href="#s2"><span class="num">2</span><span class="de">Erste Schritte</span><span class="en">Getting Started</span></a>
    <a class="nav-a" href="#s3"><span class="num">3</span><span class="de">Benutzerrollen</span><span class="en">User Roles</span></a>
    <a class="nav-a" href="#s4"><span class="num">4</span><span class="de">Shops &amp; Produkte</span><span class="en">Shops &amp; Products</span></a>
    <a class="nav-a" href="#s5"><span class="num">5</span><span class="de">Interaktive Karte</span><span class="en">Interactive Map</span></a>
    <a class="nav-a" href="#s6"><span class="num">6</span><span class="de">F&#252;r Verk&#228;ufer</span><span class="en">For Sellers</span></a>
    <a class="nav-a" href="#s7"><span class="num">7</span><span class="de">Administration</span><span class="en">Administration</span></a>
    <a class="nav-a" href="#s8"><span class="num">8</span><span class="de">Profil &amp; Einstellungen</span><span class="en">Profile &amp; Settings</span></a>
    <a class="nav-a" href="#s9"><span class="num">9</span><span class="de">Benachrichtigungen</span><span class="en">Notifications</span></a>
    <a class="nav-a" href="#s10"><span class="num">10</span><span class="de">Tarife &amp; Preise</span><span class="en">Plans &amp; Pricing</span></a>
    <a class="nav-a" href="#s11"><span class="num">11</span>FAQ</a>
    <a class="nav-a" href="#s12"><span class="num">12</span><span class="de">Rechtliches</span><span class="en">Legal</span></a>
  </nav>

  <!-- MAIN -->
  <main class="main" id="main-content">

    <!-- 1 INTRODUCTION -->
    <section class="section" id="s1">
      <div class="sec-hdr"><div class="badge">1</div><h2><span class="de">Einf&#252;hrung</span><span class="en">Introduction</span></h2></div>
      <h3><span class="de">Was ist RegioSync?</span><span class="en">What is RegioSync?</span></h3>
      <p class="de">RegioSync ist eine webbasierte Marktplatz-Plattform, die lokale H&#228;ndler, Landwirte, Handwerker und Produzenten direkt mit regionalen K&#228;ufern verbindet. Frische regionale Produkte k&#246;nnen &#252;ber eine interaktive Karte entdeckt werden &#8211; ohne Mittelm&#228;nner und ohne Transaktionsgeb&#252;hren.</p>
      <p class="en">RegioSync is a web-based marketplace platform connecting local traders, farmers, artisans, and producers directly with regional buyers. Fresh regional products can be discovered through an interactive map &#8211; without middlemen and without transaction fees.</p>
      <div class="cards">
        <div class="card"><div class="icon">&#127807;</div><h4 class="de">Lokal zuerst</h4><h4 class="en">Local First</h4><p class="de">Shops und Produkte aus Ihrer unmittelbaren Nachbarschaft entdecken und die Gemeinschaft unterst&#252;tzen.</p><p class="en">Discover shops and products from your immediate neighbourhood and support your community.</p></div>
        <div class="card"><div class="icon">&#128279;</div><h4 class="de">Direkte Verbindung</h4><h4 class="en">Direct Connection</h4><p class="de">Direkt mit Produzenten kommunizieren &#8211; ohne Plattform-Transaktionsgeb&#252;hren.</p><p class="en">Communicate directly with producers &#8211; no platform transaction fees.</p></div>
        <div class="card"><div class="icon">&#128506;&#65039;</div><h4 class="de">Interaktive Karte</h4><h4 class="en">Interactive Map</h4><p class="de">Alle regionalen Shops auf einer Live-Karte sehen und zu ihnen navigieren.</p><p class="en">See all regional shops on a live map and navigate to them.</p></div>
        <div class="card"><div class="icon">&#11088;</div><h4 class="de">Bewertungssystem</h4><h4 class="en">Review System</h4><p class="de">Shops und Produkte bewerten und der Community bei Entscheidungen helfen.</p><p class="en">Rate shops and products and help the community make informed decisions.</p></div>
      </div>
      <h3><span class="de">Mission &amp; Vision</span><span class="en">Mission &amp; Vision</span></h3>
      <p class="de">RegioSync &#252;berbr&#252;ckt den lokalen Handel mit digitaler Reichweite. Lokal einkaufen soll einfacher, transparenter und zug&#228;nglicher werden &#8211; f&#252;r K&#228;ufer ebenso wie f&#252;r kleine Produzenten. Die Plattform wird entwickelt und betrieben von der <strong>WAMOCON GmbH</strong>, Eschborn.</p>
      <p class="en">RegioSync bridges local commerce with digital reach. Shopping locally should be easier, more transparent, and more accessible &#8211; for buyers as well as small producers. The platform is developed and operated by <strong>WAMOCON GmbH</strong>, Eschborn.</p>
      <h3><span class="de">Systemanforderungen</span><span class="en">System Requirements</span></h3>
      <div class="tbl"><table>
        <thead><tr><th><span class="de">Anforderung</span><span class="en">Requirement</span></th><th><span class="de">Details</span><span class="en">Details</span></th></tr></thead>
        <tbody>
          <tr><td><strong><span class="de">Browser</span><span class="en">Browser</span></strong></td><td>Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</td></tr>
          <tr><td><strong><span class="de">Internetverbindung</span><span class="en">Internet Connection</span></strong></td><td><span class="de">Breitband empfohlen</span><span class="en">Broadband recommended</span></td></tr>
          <tr><td><strong><span class="de">Konto</span><span class="en">Account</span></strong></td><td><span class="de">Kostenlose Registrierung mit E-Mail</span><span class="en">Free registration with email address</span></td></tr>
          <tr><td><strong><span class="de">App-Download</span><span class="en">App Download</span></strong></td><td><span class="de">Nicht erforderlich &#8211; vollst&#228;ndig browserbasiert</span><span class="en">Not required &#8211; fully browser-based</span></td></tr>
          <tr><td><strong>JavaScript</strong></td><td><span class="de">Muss aktiviert sein</span><span class="en">Must be enabled</span></td></tr>
        </tbody>
      </table></div>
    </section>

    <!-- 2 GETTING STARTED -->
    <section class="section" id="s2">
      <div class="sec-hdr"><div class="badge">2</div><h2><span class="de">Erste Schritte</span><span class="en">Getting Started</span></h2></div>
      <h3><span class="de">Konto erstellen (Registrierung)</span><span class="en">Creating an Account (Registration)</span></h3>
      <p class="de">Die Registrierung bei RegioSync ist kostenlos und dauert weniger als zwei Minuten.</p>
      <p class="en">Registering on RegioSync is free and takes less than two minutes.</p>
      <ol class="steps">
        <li><div class="sb"><div class="st de">Registrierungsseite &#246;ffnen</div><div class="st en">Open the Registration Page</div><div class="sd de">Klicken Sie auf <strong>&#8222;Jetzt registrieren&#8220;</strong> in der Kopfzeile oder navigieren Sie zu <code>/register</code>.</div><div class="sd en">Click <strong>"Sign Up"</strong> in the header or navigate to <code>/register</code>.</div></div></li>
        <li><div class="sb"><div class="st de">Kontotyp w&#228;hlen</div><div class="st en">Choose Your Account Type</div><div class="sd de">W&#228;hlen Sie Ihre Rolle: <strong>K&#228;ufer (Customer)</strong> &#8211; Shops und Produkte entdecken. <strong>Verk&#228;ufer (Seller)</strong> &#8211; Eigene Shops und Produkte anlegen.</div><div class="sd en">Select your role: <strong>Customer (Buyer)</strong> &#8211; discover shops and products. <strong>Seller</strong> &#8211; create your own shops and product listings.</div></div></li>
        <li><div class="sb"><div class="st de">Pers&#246;nliche Daten eingeben</div><div class="st en">Enter Your Personal Details</div><div class="sd de">Pflichtfelder: Vollst&#228;ndiger Name, E-Mail-Adresse, Passwort (mind. 8 Zeichen), Passwort best&#228;tigen.</div><div class="sd en">Required fields: Full name, email address, password (at least 8 characters), confirm password.</div></div></li>
        <li><div class="sb"><div class="st de">Konto per E-Mail best&#228;tigen</div><div class="st en">Verify Your Account by Email</div><div class="sd de">Nach dem Absenden erhalten Sie eine Best&#228;tigungs-E-Mail. Klicken Sie auf den Link, um Ihr Konto zu aktivieren. Pr&#252;fen Sie ggf. den Spam-Ordner.</div><div class="sd en">After submitting you will receive a confirmation email. Click the link to activate your account. Check your spam folder if necessary.</div></div></li>
        <li><div class="sb"><div class="st de">Erste Anmeldung</div><div class="st en">First Login</div><div class="sd de">Nach der E-Mail-Best&#228;tigung k&#246;nnen Sie sich mit Ihrer E-Mail und Ihrem Passwort anmelden.</div><div class="sd en">After email confirmation you can sign in with your email and password.</div></div></li>
      </ol>
      <h3><span class="de">Anmelden</span><span class="en">Logging In</span></h3>
      <ol class="steps">
        <li><div class="sb"><div class="st de">Login-Seite aufrufen</div><div class="st en">Open the Login Page</div><div class="sd de">Klicken Sie auf <strong>&#8222;Anmelden&#8220;</strong> in der Kopfzeile oder navigieren Sie zu <code>/login</code>.</div><div class="sd en">Click <strong>"Login"</strong> in the header or navigate to <code>/login</code>.</div></div></li>
        <li><div class="sb"><div class="st de">E-Mail und Passwort eingeben</div><div class="st en">Enter Email and Password</div><div class="sd de">Geben Sie die bei der Registrierung verwendete E-Mail-Adresse und Ihr Passwort ein. Das Augensymbol zeigt/versteckt das Passwort.</div><div class="sd en">Enter the email address you registered with and your password. The eye icon shows/hides the password.</div></div></li>
        <li><div class="sb"><div class="st de">Auf &#8222;Anmelden&#8220; klicken</div><div class="st en">Click "Login"</div><div class="sd de">Bei Erfolg werden Sie automatisch auf die Startseite weitergeleitet.</div><div class="sd en">On success you are automatically redirected to the home page.</div></div></li>
      </ol>
      <h3><span class="de">Passwort zur&#252;cksetzen</span><span class="en">Resetting Your Password</span></h3>
      <ol class="steps">
        <li><div class="sb"><div class="st de">&#8222;Passwort vergessen?&#8220; anklicken</div><div class="st en">Click "Forgot Password?"</div><div class="sd de">Dieser Link befindet sich auf der Anmeldeseite unterhalb des Passwortfeldes.</div><div class="sd en">This link is on the login page below the password field.</div></div></li>
        <li><div class="sb"><div class="st de">E-Mail-Adresse eingeben</div><div class="st en">Enter Your Email Address</div><div class="sd de">Geben Sie die mit Ihrem Konto verkn&#252;pfte E-Mail ein und klicken Sie auf <strong>&#8222;Link senden&#8220;</strong>.</div><div class="sd en">Enter the email linked to your account and click <strong>"Send Reset Link"</strong>.</div></div></li>
        <li><div class="sb"><div class="st de">Zur&#252;cksetzungs-Link &#246;ffnen</div><div class="st en">Open the Reset Link</div><div class="sd de">Klicken Sie auf den Link in der E-Mail. Er ist 60 Minuten g&#252;ltig.</div><div class="sd en">Click the link in the email. It is valid for 60 minutes.</div></div></li>
        <li><div class="sb"><div class="st de">Neues Passwort festlegen</div><div class="st en">Set a New Password</div><div class="sd de">Geben Sie Ihr neues Passwort (mind. 8 Zeichen) ein und best&#228;tigen Sie es.</div><div class="sd en">Enter your new password (at least 8 characters) and confirm it.</div></div></li>
      </ol>
      <h3><span class="de">Navigation</span><span class="en">Navigation</span></h3>
      <div class="tbl"><table>
        <thead><tr><th><span class="de">Men&#252;punkt</span><span class="en">Menu Item</span></th><th><span class="de">Beschreibung</span><span class="en">Description</span></th><th><span class="de">Sichtbar f&#252;r</span><span class="en">Visible for</span></th></tr></thead>
        <tbody>
          <tr><td><strong>Home</strong></td><td class="de">Startseite</td><td class="en">Home page</td><td class="de">Alle</td><td class="en">All</td></tr>
          <tr><td><strong>Shops</strong></td><td class="de">Alle Shops durchsuchen</td><td class="en">Browse all shops</td><td class="de">Alle</td><td class="en">All</td></tr>
          <tr><td><strong><span class="de">Karte</span><span class="en">Map</span></strong></td><td class="de">Interaktive Karte</td><td class="en">Interactive map</td><td class="de">Alle</td><td class="en">All</td></tr>
          <tr><td><strong><span class="de">Preise</span><span class="en">Pricing</span></strong></td><td class="de">Free vs. Pro Vergleich</td><td class="en">Free vs. Pro comparison</td><td class="de">Alle</td><td class="en">All</td></tr>
          <tr><td><strong>Dashboard</strong></td><td class="de">Verk&#228;ufer-&#220;bersicht</td><td class="en">Seller overview</td><td class="de">Verk&#228;ufer</td><td class="en">Sellers</td></tr>
          <tr><td><strong>Admin</strong></td><td class="de">Administrationsbereich</td><td class="en">Administration area</td><td class="de">Admins</td><td class="en">Admins only</td></tr>
          <tr><td><strong><span class="de">Profil</span><span class="en">Profile</span></strong></td><td class="de">Eigenes Profil</td><td class="en">Own profile</td><td class="de">Angemeldete Nutzer</td><td class="en">Logged-in users</td></tr>
        </tbody>
      </table></div>
    </section>

    <!-- 3 USER ROLES -->
    <section class="section" id="s3">
      <div class="sec-hdr"><div class="badge">3</div><h2><span class="de">Benutzerrollen &amp; Zugriffsrechte</span><span class="en">User Roles &amp; Access Rights</span></h2></div>
      <p class="de">RegioSync unterscheidet drei Benutzerrollen. Die Rolle wird bei der Registrierung gew&#228;hlt und kann vom Administrator ge&#228;ndert werden.</p>
      <p class="en">RegioSync distinguishes three user roles. The role is chosen at registration and can be changed by an administrator.</p>
      <h3><span class="de">K&#228;ufer (Customer)</span><span class="en">Buyer (Customer)</span></h3>
      <div class="role-blk">
        <div class="role-name"><span class="rdot" style="background:#8b5cf6"></span><span class="de">Standardrolle nach der Registrierung</span><span class="en">Default role after registration</span></div>
        <ul>
          <li class="de">Shops durchsuchen und anzeigen (Free: max. 5 Shops)</li><li class="en">Browse and view shops (Free: max. 5 shops)</li>
          <li class="de">Produkte in Shops anzeigen</li><li class="en">View products in shops</li>
          <li class="de">Shops auf der interaktiven Karte finden</li><li class="en">Find shops on the interactive map</li>
          <li class="de">Bewertungen schreiben (1&#8211;5 Sterne + Textkommentar)</li><li class="en">Write reviews (1&#8211;5 stars + text comment)</li>
          <li class="de">Produktanfragen an Verk&#228;ufer senden</li><li class="en">Send product requests to sellers</li>
          <li class="de">Eigenes Profil verwalten (Name, Foto, Passwort)</li><li class="en">Manage own profile (name, photo, password)</li>
          <li class="de">Benachrichtigungen empfangen und lesen</li><li class="en">Receive and read notifications</li>
        </ul>
      </div>
      <h3><span class="de">Verk&#228;ufer (Seller)</span><span class="en">Seller</span></h3>
      <div class="role-blk">
        <div class="role-name"><span class="rdot" style="background:#16a34a"></span><span class="de">Kann bei der Registrierung gew&#228;hlt werden</span><span class="en">Can be chosen at registration</span></div>
        <p class="de">Alle Rechte des K&#228;ufers plus:</p><p class="en">All buyer rights plus:</p>
        <ul>
          <li class="de">Einen oder mehrere Shops erstellen und verwalten</li><li class="en">Create and manage one or more shops</li>
          <li class="de">Produkte mit Name, Beschreibung, Preis, Kategorie, Bild und Rabatt anlegen</li><li class="en">Create products with name, description, price, category, image, and discount</li>
          <li class="de">Shop-Standort per GPS oder manuelle Kartenauswahl festlegen</li><li class="en">Set shop location via GPS or manual map selection</li>
          <li class="de">Eingehende Produktanfragen annehmen oder ablehnen</li><li class="en">Accept or reject incoming product requests</li>
          <li class="de">Statistiken einsehen: Shops, Produkte, Bewertungen, Durchschnittsbewertung</li><li class="en">View statistics: shops, products, reviews, average rating</li>
        </ul>
      </div>
      <h3><span class="de">Administrator</span><span class="en">Administrator</span></h3>
      <div class="role-blk">
        <div class="role-name"><span class="rdot" style="background:#2563eb"></span><span class="de">Systemadministrator mit Vollzugriff</span><span class="en">System administrator with full access</span></div>
        <p class="de">Alle Rechte der anderen Rollen plus:</p><p class="en">All rights of other roles plus:</p>
        <ul>
          <li class="de">Vollst&#228;ndige Benutzerverwaltung: Rollen &#228;ndern, Benutzer sperren/entsperren und l&#246;schen</li><li class="en">Full user management: change roles, ban/unban and delete users</li>
          <li class="de">Alle Shops und Produkte auf der Plattform anzeigen und l&#246;schen</li><li class="en">View and delete all shops and products on the platform</li>
          <li class="de">Gemeldete Inhalte anzeigen und bearbeiten</li><li class="en">View and manage reported content</li>
          <li class="de">Systemstatistiken einsehen</li><li class="en">View system statistics</li>
        </ul>
      </div>
      <h4><span class="de">Rollenvergleich</span><span class="en">Role Comparison</span></h4>
      <div class="tbl"><table>
        <thead><tr><th><span class="de">Funktion</span><span class="en">Feature</span></th><th><span class="de">K&#228;ufer</span><span class="en">Buyer</span></th><th><span class="de">Verk&#228;ufer</span><span class="en">Seller</span></th><th>Admin</th></tr></thead>
        <tbody>
          <tr><td class="de">Shops durchsuchen</td><td class="en">Browse shops</td><td><span class="yes">&#10003;</span></td><td><span class="yes">&#10003;</span></td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td class="de">Karte nutzen</td><td class="en">Use map</td><td><span class="yes">&#10003;</span></td><td><span class="yes">&#10003;</span></td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td class="de">Bewertungen schreiben</td><td class="en">Write reviews</td><td><span class="yes">&#10003;</span></td><td><span class="yes">&#10003;</span></td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td class="de">Shops erstellen</td><td class="en">Create shops</td><td><span class="no">&#10007;</span></td><td><span class="yes">&#10003;</span></td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td class="de">Produkte anlegen</td><td class="en">Add products</td><td><span class="no">&#10007;</span></td><td><span class="yes">&#10003;</span></td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td class="de">Benutzer verwalten</td><td class="en">Manage users</td><td><span class="no">&#10007;</span></td><td><span class="no">&#10007;</span></td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td class="de">Meldungen bearbeiten</td><td class="en">Handle reports</td><td><span class="no">&#10007;</span></td><td><span class="no">&#10007;</span></td><td><span class="yes">&#10003;</span></td></tr>
        </tbody>
      </table></div>
    </section>

    <!-- 4 SHOPS AND PRODUCTS -->
    <section class="section" id="s4">
      <div class="sec-hdr"><div class="badge">4</div><h2><span class="de">Shops &amp; Produkte (f&#252;r K&#228;ufer)</span><span class="en">Shops &amp; Products (for Buyers)</span></h2></div>
      <h3><span class="de">Shops durchsuchen</span><span class="en">Browsing Shops</span></h3>
      <p class="de">Navigieren Sie zu <strong>Shops</strong> (<code>/shops</code>). Alle registrierten lokalen Shops werden als Kacheln angezeigt. Nutzen Sie die Suchleiste, um nach Shop-Name oder Ort zu filtern.</p>
      <p class="en">Navigate to <strong>Shops</strong> (<code>/shops</code>). All registered local shops are shown as tiles. Use the search bar to filter by shop name or location.</p>
      <div class="callout info"><div class="ci">&#8505;&#65039;</div><div><strong class="de">Free vs. Pro:</strong><strong class="en">Free vs. Pro:</strong><p class="de">Im kostenlosen Plan k&#246;nnen Benutzer bis zu 5 Shops anzeigen. Ein Upgrade auf Pro hebt diese Einschr&#228;nkung auf und erm&#246;glicht unbegrenztes Browsing.</p><p class="en">On the free plan users can view up to 5 shops. Upgrading to Pro removes this restriction and enables unlimited browsing.</p></div></div>
      <h3><span class="de">Shop-Detailseite</span><span class="en">Shop Detail Page</span></h3>
      <p class="de">Ein Klick auf eine Shop-Kachel &#246;ffnet die Detailseite mit: Name, Beschreibung, Adresse, Kontaktdaten, allen verf&#252;gbaren Produkten mit Preis und Kategorie, Durchschnittsbewertung, allen Rezensionen sowie Schaltfl&#228;chen f&#252;r Bewertung, Produktanfrage und Karte.</p>
      <p class="en">Clicking a shop tile opens the detail page with: name, description, address, contact details, all available products with price and category, average rating, all reviews, and buttons for review, product request, and map.</p>
      <p class="de">Pro-Nutzer sehen zus&#228;tzlich eine <strong>Routenbeschreibung</strong>-Schaltfl&#228;che f&#252;r Turn-by-Turn-Navigation zum Shop.</p>
      <p class="en">Pro users also see a <strong>Get Directions</strong> button for turn-by-turn navigation to the shop.</p>
      <h3><span class="de">Produktkategorien</span><span class="en">Product Categories</span></h3>
      <div class="cards">
        <div class="card"><p>&#127822; <strong><span class="de">Obst</span><span class="en">Fruits</span></strong></p></div>
        <div class="card"><p>&#129382; <strong><span class="de">Gem&#252;se</span><span class="en">Vegetables</span></strong></p></div>
        <div class="card"><p>&#129371; <strong><span class="de">Milchprodukte</span><span class="en">Dairy</span></strong></p></div>
        <div class="card"><p>&#129385; <strong><span class="de">Fleisch</span><span class="en">Meat</span></strong></p></div>
        <div class="card"><p>&#127838; <strong><span class="de">Backwaren</span><span class="en">Bakery</span></strong></p></div>
        <div class="card"><p>&#127855; <strong><span class="de">Honig</span><span class="en">Honey</span></strong></p></div>
        <div class="card"><p>&#129368; <strong><span class="de">Eier</span><span class="en">Eggs</span></strong></p></div>
        <div class="card"><p>&#127807; <strong><span class="de">Kr&#228;uter</span><span class="en">Herbs</span></strong></p></div>
        <div class="card"><p>&#127866; <strong><span class="de">Getr&#228;nke</span><span class="en">Drinks</span></strong></p></div>
        <div class="card"><p>&#128230; <strong><span class="de">Sonstiges</span><span class="en">Other</span></strong></p></div>
      </div>
      <h3><span class="de">Bewertungen schreiben</span><span class="en">Writing Reviews</span></h3>
      <ol class="steps">
        <li><div class="sb"><div class="st de">Shop-Detailseite &#246;ffnen</div><div class="st en">Open the shop detail page</div></div></li>
        <li><div class="sb"><div class="st de">&#8222;Bewertung schreiben&#8220; anklicken</div><div class="st en">Click "Write a Review"</div><div class="sd de">Das Bewertungsformular wird eingeblendet.</div><div class="sd en">The review form will appear.</div></div></li>
        <li><div class="sb"><div class="st de">Sternebewertung w&#228;hlen (1&#8211;5)</div><div class="st en">Choose a star rating (1&#8211;5)</div></div></li>
        <li><div class="sb"><div class="st de">Kommentar verfassen</div><div class="st en">Write your comment</div><div class="sd de">Beschreiben Sie Ihre Erfahrung im Textfeld.</div><div class="sd en">Describe your experience in the text field.</div></div></li>
        <li><div class="sb"><div class="st de">Auf &#8222;Bewertung senden&#8220; klicken</div><div class="st en">Click "Submit Review"</div><div class="sd de">Der Shopinhaber wird automatisch per Benachrichtigung informiert.</div><div class="sd en">The shop owner is automatically notified.</div></div></li>
      </ol>
      <h3><span class="de">Produktanfragen senden</span><span class="en">Sending Product Requests</span></h3>
      <p class="de">K&#228;ufer k&#246;nnen eine Anfrage f&#252;r ein bestimmtes Produkt an den Verk&#228;ufer senden. Status: <strong>Ausstehend / Angenommen / Abgelehnt</strong>.</p>
      <p class="en">Buyers can send a request for a specific product to the seller. Status: <strong>Pending / Accepted / Rejected</strong>.</p>
      <ol class="steps">
        <li><div class="sb"><div class="st de">Produkt auf der Shop-Detailseite finden</div><div class="st en">Find a product on the shop detail page</div></div></li>
        <li><div class="sb"><div class="st de">&#8222;Produkt anfragen&#8220; anklicken</div><div class="st en">Click "Request Product"</div><div class="sd de">Das Anfrageformular &#246;ffnet sich. Der Produktname ist vorausgef&#252;llt.</div><div class="sd en">The request form opens. The product name is pre-filled.</div></div></li>
        <li><div class="sb"><div class="st de">Anfrage beschreiben und absenden</div><div class="st en">Describe and submit</div><div class="sd de">Beschreibung eingeben (z.B. Menge, Lieferdetails) und auf <strong>&#8222;Anfrage senden&#8220;</strong> klicken.</div><div class="sd en">Enter description (e.g. quantity, delivery details) and click <strong>"Send Request"</strong>.</div></div></li>
      </ol>
    </section>

    <!-- 5 MAP -->
    <section class="section" id="s5">
      <div class="sec-hdr"><div class="badge">5</div><h2><span class="de">Interaktive Karte</span><span class="en">Interactive Map</span></h2></div>
      <p class="de">Die Karte (<code>/map</code>) zeigt alle registrierten Shops als farbige Markierungen auf einer OpenStreetMap-Basiskarte. Klicken Sie auf eine Markierung, um Shop-Name, Adresse und einen Link zur Detailseite zu sehen.</p>
      <p class="en">The map (<code>/map</code>) displays all registered shops as coloured markers on an OpenStreetMap base map. Click a marker to see the shop name, address, and a link to the detail page.</p>
      <div class="tbl"><table>
        <thead><tr><th><span class="de">Funktion</span><span class="en">Feature</span></th><th>Free</th><th>Pro</th></tr></thead>
        <tbody>
          <tr><td class="de">Karte anzeigen</td><td class="en">View map</td><td><span class="yes">&#10003;</span></td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td class="de">Shop-Markierungen sehen</td><td class="en">See shop markers</td><td><span class="yes">&#10003;</span></td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td class="de">Zoom-Steuerung</td><td class="en">Zoom controls</td><td><span class="par">Eingeschr&#228;nkt / Limited</span></td><td><span class="yes">&#10003; Vollst&#228;ndig / Full</span></td></tr>
          <tr><td class="de">Routenbeschreibung</td><td class="en">Get Directions</td><td><span class="no">&#10007;</span></td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td class="de">Mein Standort</td><td class="en">My Location</td><td><span class="no">&#10007;</span></td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td class="de">Vollbildansicht</td><td class="en">Fullscreen view</td><td><span class="no">&#10007;</span></td><td><span class="yes">&#10003;</span></td></tr>
        </tbody>
      </table></div>
      <h3><span class="de">Routenbeschreibung verwenden (Pro)</span><span class="en">Using Directions (Pro)</span></h3>
      <ol class="steps">
        <li><div class="sb"><div class="st de">Shop-Markierung anklicken</div><div class="st en">Click a shop marker</div><div class="sd de">Ein Pop-up erscheint mit Shop-Name und Details.</div><div class="sd en">A popup appears with shop name and details.</div></div></li>
        <li><div class="sb"><div class="st de">&#8222;Route&#8220; anklicken</div><div class="st en">Click "Directions"</div><div class="sd de">Das System erkennt Ihren Standort (Browsererlaubnis erforderlich) und berechnet die Route.</div><div class="sd en">The system detects your location (browser permission required) and calculates the route.</div></div></li>
        <li><div class="sb"><div class="st de">Navigationsanweisungen folgen</div><div class="st en">Follow navigation instructions</div><div class="sd de">Die Route wird auf der Karte eingezeichnet. Schritt-f&#252;r-Schritt-Anweisungen erscheinen in einem Seitenbereich.</div><div class="sd en">The route is drawn on the map. Step-by-step instructions appear in a side panel.</div></div></li>
      </ol>
      <div class="callout tip"><div class="ci">&#128161;</div><div><p class="de"><strong>Tipp:</strong> Erlauben Sie dem Browser den Zugriff auf Ihren Standort, wenn Sie dazu aufgefordert werden, um &#8222;Mein Standort&#8220; und Routenberechnung zu nutzen.</p><p class="en"><strong>Tip:</strong> Allow the browser access to your location when prompted to use "My Location" and route calculation.</p></div></div>
    </section>

    <!-- 6 FOR SELLERS -->
    <section class="section" id="s6">
      <div class="sec-hdr"><div class="badge">6</div><h2><span class="de">F&#252;r Verk&#228;ufer</span><span class="en">For Sellers</span></h2></div>
      <h3><span class="de">Shop erstellen</span><span class="en">Creating a Shop</span></h3>
      <p class="de">Navigieren Sie zu <code>/seller/shops/new</code> oder klicken Sie im Verk&#228;ufer-Dashboard auf <strong>&#8222;Shop erstellen&#8220;</strong>.</p>
      <p class="en">Navigate to <code>/seller/shops/new</code> or click <strong>"Create Shop"</strong> in the seller dashboard.</p>
      <ol class="steps">
        <li><div class="sb"><div class="st de">Shop-Name eingeben</div><div class="st en">Enter Shop Name</div><div class="sd de">W&#228;hlen Sie einen aussagekr&#228;ftigen Namen, der Ihren Shop und Ihr Angebot beschreibt.</div><div class="sd en">Choose a descriptive name representing your shop and its offering.</div></div></li>
        <li><div class="sb"><div class="st de">Beschreibung verfassen</div><div class="st en">Write a Description</div><div class="sd de">Beschreiben Sie Ihre Produkte und Besonderheiten. Eine gute Beschreibung hilft K&#228;ufern, Ihren Shop zu finden.</div><div class="sd en">Describe your products and special features. A good description helps buyers find your shop.</div></div></li>
        <li><div class="sb"><div class="st de">Adresse eingeben (Autovervollst&#228;ndigung)</div><div class="st en">Enter Address (Autocomplete)</div><div class="sd de">Tippen Sie Ihre Adresse. Das System schl&#228;gt &#252;ber OpenStreetMap Adressen vor. Ausw&#228;hlen &#8211; Ort und Koordinaten werden automatisch ausgef&#252;llt.</div><div class="sd en">Type your address. The system suggests addresses via OpenStreetMap. Select an entry &#8211; city and coordinates are filled in automatically.</div></div></li>
        <li><div class="sb"><div class="st de">Alternativ: GPS-Standort verwenden</div><div class="st en">Alternatively: Use GPS Location</div><div class="sd de">Klicken Sie auf <strong>&#8222;GPS-Standort verwenden&#8220;</strong>. Nach Freigabe im Browser werden die Koordinaten automatisch eingetragen.</div><div class="sd en">Click <strong>"Use GPS Location"</strong>. After browser permission is granted, coordinates are filled in automatically.</div></div></li>
        <li><div class="sb"><div class="st de">Shop speichern</div><div class="st en">Save the Shop</div><div class="sd de">Klicken Sie auf <strong>&#8222;Shop erstellen&#8220;</strong>. Der Shop erscheint sofort auf der Karte und in der Shops-Liste.</div><div class="sd en">Click <strong>"Create Shop"</strong>. The shop immediately appears on the map and in the shops list.</div></div></li>
      </ol>
      <h3><span class="de">Produkte verwalten</span><span class="en">Managing Products</span></h3>
      <p class="de">Navigieren Sie im Dashboard zu Ihrem Shop und klicken Sie auf <strong>&#8222;Produkt hinzuf&#252;gen&#8220;</strong>.</p>
      <p class="en">In the dashboard navigate to your shop and click <strong>"Add Product"</strong>.</p>
      <div class="tbl"><table>
        <thead><tr><th><span class="de">Feld</span><span class="en">Field</span></th><th><span class="de">Beschreibung</span><span class="en">Description</span></th><th><span class="de">Pflicht</span><span class="en">Required</span></th></tr></thead>
        <tbody>
          <tr><td><strong><span class="de">Produktname</span><span class="en">Product Name</span></strong></td><td class="de">Deutlicher, beschreibender Name</td><td class="en">Clear, descriptive name</td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td><strong><span class="de">Beschreibung</span><span class="en">Description</span></strong></td><td class="de">Details zum Produkt</td><td class="en">Product details</td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td><strong><span class="de">Preis (EUR, inkl. MwSt.)</span><span class="en">Price (EUR incl. VAT)</span></strong></td><td class="de">Preis in Euro</td><td class="en">Price in Euros</td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td><strong><span class="de">Menge</span><span class="en">Quantity Available</span></strong></td><td class="de">0 = Nicht verf&#252;gbar</td><td class="en">0 = Not available</td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td><strong><span class="de">Kategorie</span><span class="en">Category</span></strong></td><td class="de">Aus der Liste w&#228;hlen</td><td class="en">Select from list</td><td><span class="yes">&#10003;</span></td></tr>
          <tr><td><strong><span class="de">Produktbild</span><span class="en">Product Image</span></strong></td><td class="de">Foto hochladen</td><td class="en">Upload photo</td><td class="de">Optional</td><td class="en">Optional</td></tr>
          <tr><td><strong><span class="de">Rabatt (%)</span><span class="en">Discount (%)</span></strong></td><td class="de">Prozentualer Nachlass</td><td class="en">Percentage discount</td><td class="de">Optional</td><td class="en">Optional</td></tr>
        </tbody>
      </table></div>
      <h3><span class="de">Verk&#228;ufer-Dashboard</span><span class="en">Seller Dashboard</span></h3>
      <p class="de">Das Dashboard (<code>/seller/dashboard</code>) gibt einen vollst&#228;ndigen &#220;berblick &#252;ber Ihre Aktivit&#228;ten auf RegioSync.</p>
      <p class="en">The dashboard (<code>/seller/dashboard</code>) gives a complete overview of your activity on RegioSync.</p>
      <ul>
        <li class="de"><strong>Statistiken:</strong> Shops, Produkte, Bewertungen, Durchschnittsbewertung auf einen Blick.</li><li class="en"><strong>Statistics:</strong> Shops, products, reviews, average rating at a glance.</li>
        <li class="de"><strong>Meine Shops:</strong> Liste aller Shops mit Schnellzugriff auf Bearbeitung und Produkte.</li><li class="en"><strong>My Shops:</strong> List of all shops with quick access to editing and products.</li>
        <li class="de"><strong>Eingehende Anfragen:</strong> Alle Produktanfragen von K&#228;ufern, sortiert nach Shop und Status.</li><li class="en"><strong>Incoming Requests:</strong> All product requests from buyers, sorted by shop and status.</li>
        <li class="de"><strong>Bewertungs&#252;bersicht:</strong> Alle Kundenrezensionen im &#220;berblick.</li><li class="en"><strong>Review Overview:</strong> All customer reviews in one view.</li>
      </ul>
      <h3><span class="de">Auf Produktanfragen reagieren</span><span class="en">Responding to Product Requests</span></h3>
      <ol class="steps">
        <li><div class="sb"><div class="st de">Dashboard &#246;ffnen</div><div class="st en">Open Dashboard</div><div class="sd de">Navigieren Sie zu <code>/seller/dashboard</code>.</div><div class="sd en">Navigate to <code>/seller/dashboard</code>.</div></div></li>
        <li><div class="sb"><div class="st de">Anfragen anzeigen</div><div class="st en">View Requests</div><div class="sd de">Neue Anfragen erscheinen im Abschnitt &#8222;Eingegangene Anfragen&#8220; mit Status <strong>Ausstehend</strong>.</div><div class="sd en">New requests appear in the "Incoming Requests" section with status <strong>Pending</strong>.</div></div></li>
        <li><div class="sb"><div class="st de">Annehmen oder ablehnen</div><div class="st en">Accept or Reject</div><div class="sd de">Klicken Sie auf <strong>&#8222;Annehmen&#8220;</strong> (gr&#252;n) oder <strong>&#8222;Ablehnen&#8220;</strong> (rot). Der K&#228;ufer wird automatisch per Benachrichtigung informiert.</div><div class="sd en">Click <strong>"Accept"</strong> (green) or <strong>"Reject"</strong> (red). The buyer is automatically notified.</div></div></li>
      </ol>
    </section>

    <!-- 7 ADMIN -->
    <section class="section" id="s7">
      <div class="sec-hdr"><div class="badge">7</div><h2><span class="de">Administration</span><span class="en">Administration</span></h2></div>
      <p class="de">Der Admin-Bereich (<code>/admin</code>) ist ausschlie&#223;lich f&#252;r Benutzer mit der Rolle <strong>Administrator</strong> zug&#228;nglich.</p>
      <p class="en">The admin area (<code>/admin</code>) is exclusively accessible to users with the <strong>Administrator</strong> role.</p>
      <h3><span class="de">Dashboard-Kennzahlen</span><span class="en">Dashboard Metrics</span></h3>
      <div class="cards">
        <div class="card"><h4 class="de">Gesamtbenutzer</h4><h4 class="en">Total Users</h4><p class="de">Alle registrierten Benutzer</p><p class="en">All registered users</p></div>
        <div class="card"><h4 class="de">Verk&#228;ufer gesamt</h4><h4 class="en">Total Sellers</h4><p class="de">Benutzer mit Verk&#228;ufer-Rolle</p><p class="en">Users with seller role</p></div>
        <div class="card"><h4 class="de">K&#228;ufer gesamt</h4><h4 class="en">Total Customers</h4><p class="de">Benutzer mit K&#228;ufer-Rolle</p><p class="en">Users with buyer role</p></div>
        <div class="card"><h4 class="de">Aktive Benutzer</h4><h4 class="en">Active Users</h4><p class="de">Nicht gesperrte Benutzer</p><p class="en">Non-banned users</p></div>
      </div>
      <h3><span class="de">Benutzerverwaltung</span><span class="en">User Management</span></h3>
      <div class="tbl"><table>
        <thead><tr><th><span class="de">Aktion</span><span class="en">Action</span></th><th><span class="de">Beschreibung</span><span class="en">Description</span></th></tr></thead>
        <tbody>
          <tr><td class="de"><strong>Rolle &#228;ndern</strong></td><td class="en"><strong>Change Role</strong></td><td class="de">Benutzer zu K&#228;ufer, Verk&#228;ufer oder Super-Admin bestandern oder zur&#252;ckstufen.</td><td class="en">Promote or demote user to buyer, seller, or super admin.</td></tr>
          <tr><td class="de"><strong>Benutzer sperren</strong></td><td class="en"><strong>Ban User</strong></td><td class="de">Sperrt den Benutzer. Er kann sich nicht mehr anmelden.</td><td class="en">Bans the user. They can no longer log in.</td></tr>
          <tr><td class="de"><strong>Sperre aufheben</strong></td><td class="en"><strong>Unban User</strong></td><td class="de">Hebt die Sperre auf und stellt den Zugang wieder her.</td><td class="en">Lifts the ban and restores access.</td></tr>
          <tr><td class="de"><strong>Benutzer l&#246;schen</strong></td><td class="en"><strong>Delete User</strong></td><td class="de">L&#246;scht den Benutzer dauerhaft (unumkehrbar).</td><td class="en">Permanently deletes the user (irreversible).</td></tr>
        </tbody>
      </table></div>
      <div class="callout danger"><div class="ci">&#128680;</div><div><p class="de"><strong>Achtung:</strong> Das L&#246;schen eines Benutzers ist dauerhaft. Alle Daten des Benutzers (Shops, Produkte, Bewertungen) werden ebenfalls entfernt. Diese Aktion kann nicht r&#252;ckg&#228;ngig gemacht werden.</p><p class="en"><strong>Warning:</strong> Deleting a user is permanent. All user data (shops, products, reviews) will also be removed. This action cannot be undone.</p></div></div>
      <h3><span class="de">Gemeldete Inhalte</span><span class="en">Reported Content</span></h3>
      <p class="de">Im Tab <strong>&#8222;Meldungen&#8220;</strong> sehen Admins alle von Benutzern gemeldeten Inhalte mit: gemeldeter Benutzer, Melder, Meldungsgrund, Datum, Status (Offen / Gel&#246;st) und Aktionsschaltfl&#228;chen.</p>
      <p class="en">In the <strong>"Reports"</strong> tab admins see all reported content with: reported user, reporter, report reason, date, status (Open / Resolved), and action buttons.</p>
    </section>

    <!-- 8 PROFILE -->
    <section class="section" id="s8">
      <div class="sec-hdr"><div class="badge">8</div><h2><span class="de">Profil &amp; Einstellungen</span><span class="en">Profile &amp; Settings</span></h2></div>
      <p class="de">Ihr pers&#246;nliches Profil erreichen Sie unter <code>/profile</code>.</p>
      <p class="en">Your personal profile is available at <code>/profile</code>.</p>
      <h3><span class="de">Profil bearbeiten</span><span class="en">Editing Your Profile</span></h3>
      <ol class="steps">
        <li><div class="sb"><div class="st de">Profil &#246;ffnen</div><div class="st en">Open Profile</div><div class="sd de">Klicken Sie auf Ihr Profilbild oder Ihren Namen in der Kopfzeile und w&#228;hlen Sie <strong>&#8222;Profil&#8220;</strong>.</div><div class="sd en">Click your profile picture or name in the header and select <strong>"Profile"</strong>.</div></div></li>
        <li><div class="sb"><div class="st de">&#8222;Profil bearbeiten&#8220; anklicken</div><div class="st en">Click "Edit Profile"</div></div></li>
        <li><div class="sb"><div class="st de">Namen &#228;ndern und speichern</div><div class="st en">Change name and save</div><div class="sd de">Klicken Sie auf <strong>&#8222;Speichern&#8220;</strong>, um die &#196;nderungen zu &#252;bernehmen.</div><div class="sd en">Click <strong>"Save"</strong> to apply the changes.</div></div></li>
      </ol>
      <h3><span class="de">Profilbild hochladen</span><span class="en">Uploading a Profile Picture</span></h3>
      <ol class="steps">
        <li><div class="sb"><div class="st de">Kamerasymbol anklicken</div><div class="st en">Click the Camera Icon</div><div class="sd de">Das Symbol befindet sich &#252;ber Ihrem aktuellen Profilbild.</div><div class="sd en">The icon is located over your current profile picture.</div></div></li>
        <li><div class="sb"><div class="st de">Bilddatei ausw&#228;hlen</div><div class="st en">Select Image File</div><div class="sd de">W&#228;hlen Sie eine JPG- oder PNG-Datei von Ihrem Ger&#228;t. Das Bild wird sofort hochgeladen und angezeigt.</div><div class="sd en">Select a JPG or PNG file from your device. The image is uploaded and displayed immediately.</div></div></li>
      </ol>
      <div class="tbl"><table>
        <thead><tr><th><span class="de">Information</span><span class="en">Information</span></th><th><span class="de">Beschreibung</span><span class="en">Description</span></th></tr></thead>
        <tbody>
          <tr><td class="de"><strong>Vollst&#228;ndiger Name</strong></td><td class="en"><strong>Full Name</strong></td><td class="de">Bearbeitbar &#252;ber &#8222;Profil bearbeiten&#8220;</td><td class="en">Editable via "Edit Profile"</td></tr>
          <tr><td class="de"><strong>E-Mail</strong></td><td class="en"><strong>Email</strong></td><td class="de">Nicht &#228;nderbar (E-Mail vom Anmeldetag)</td><td class="en">Not changeable (email from registration)</td></tr>
          <tr><td class="de"><strong>Rolle</strong></td><td class="en"><strong>Role</strong></td><td class="de">K&#228;ufer / Verk&#228;ufer / Admin</td><td class="en">Buyer / Seller / Admin</td></tr>
          <tr><td class="de"><strong>Abonnement</strong></td><td class="en"><strong>Subscription</strong></td><td class="de">Free oder Pro mit Upgrade-Option</td><td class="en">Free or Pro with upgrade option</td></tr>
          <tr><td class="de"><strong>Mitglied seit</strong></td><td class="en"><strong>Member Since</strong></td><td class="de">Datum der Kontoerstellung</td><td class="en">Account creation date</td></tr>
        </tbody>
      </table></div>
    </section>

    <!-- 9 NOTIFICATIONS -->
    <section class="section" id="s9">
      <div class="sec-hdr"><div class="badge">9</div><h2><span class="de">Benachrichtigungen</span><span class="en">Notifications</span></h2></div>
      <p class="de">RegioSync sendet automatische Benachrichtigungen bei wichtigen Ereignissen. Zug&#228;nglich &#252;ber das Glockensymbol in der Kopfzeile oder unter <code>/notifications</code>.</p>
      <p class="en">RegioSync sends automatic notifications on important events. Accessible via the bell icon in the header or at <code>/notifications</code>.</p>
      <div class="tbl"><table>
        <thead><tr><th><span class="de">Typ</span><span class="en">Type</span></th><th><span class="de">Empf&#228;nger</span><span class="en">Recipient</span></th><th><span class="de">Ausl&#246;ser</span><span class="en">Trigger</span></th></tr></thead>
        <tbody>
          <tr><td class="de">Neue Bewertung</td><td class="en">New Review</td><td class="de">Verk&#228;ufer</td><td class="en">Seller</td><td class="de">Ein K&#228;ufer schreibt eine Bewertung f&#252;r einen Ihrer Shops</td><td class="en">A buyer writes a review for one of your shops</td></tr>
          <tr><td class="de">Neue Produktanfrage</td><td class="en">New Product Request</td><td class="de">Verk&#228;ufer</td><td class="en">Seller</td><td class="de">Ein K&#228;ufer sendet eine Produktanfrage</td><td class="en">A buyer sends a product request</td></tr>
          <tr><td class="de">Anfrage-Status ge&#228;ndert</td><td class="en">Request Status Changed</td><td class="de">K&#228;ufer</td><td class="en">Buyer</td><td class="de">Verk&#228;ufer nimmt Anfrage an oder lehnt sie ab</td><td class="en">Seller accepts or rejects the request</td></tr>
        </tbody>
      </table></div>
      <ul>
        <li class="de"><strong>Einzeln als gelesen markieren:</strong> Klicken Sie auf das H&#228;kchen-Symbol neben der Benachrichtigung.</li><li class="en"><strong>Mark individually as read:</strong> Click the checkmark icon next to the notification.</li>
        <li class="de"><strong>Alle als gelesen markieren:</strong> Schaltfl&#228;che oben rechts auf der Benachrichtigungsseite.</li><li class="en"><strong>Mark all as read:</strong> Button in the top-right corner of the notifications page.</li>
        <li class="de"><strong>Ungelesene Benachrichtigungen</strong> werden mit gr&#252;nem linken Rand hervorgehoben und zeigen einen Badge am Glockensymbol.</li><li class="en"><strong>Unread notifications</strong> are highlighted with a green left border and show a badge on the bell icon.</li>
      </ul>
    </section>

    <!-- 10 PRICING -->
    <section class="section" id="s10">
      <div class="sec-hdr"><div class="badge">10</div><h2><span class="de">Tarife &amp; Preise</span><span class="en">Plans &amp; Pricing</span></h2></div>
      <p class="de">RegioSync ist in zwei Tarifen verf&#252;gbar. Die Preisseite erreichen Sie unter <code>/pricing</code>.</p>
      <p class="en">RegioSync is available in two plans. The pricing page is at <code>/pricing</code>.</p>
      <div class="price-grid">
        <div class="pc">
          <div class="plan-lbl">Free</div>
          <div class="plan-amt">0 <span style="font-size:1rem;font-weight:400">EUR</span></div>
          <div class="plan-unit de">pro Monat &#8211; dauerhaft kostenlos</div>
          <div class="plan-unit en">per month &#8211; permanently free</div>
          <ul class="plan-feats">
            <li class="de">Bis zu 5 Shops durchsuchen</li><li class="en">Browse up to 5 shops</li>
            <li class="de">Einfache Kartenansicht (kein Zoom)</li><li class="en">Basic map view (no zoom)</li>
            <li class="de">Produktlisten anzeigen</li><li class="en">View product listings</li>
            <li class="de">Bewertungen schreiben</li><li class="en">Write reviews</li>
            <li class="de">Produktanfragen senden</li><li class="en">Send product requests</li>
          </ul>
        </div>
        <div class="pc pro">
          <div class="plan-lbl">Pro</div>
          <div class="plan-amt">4.99 <span style="font-size:1rem;font-weight:400">EUR</span></div>
          <div class="plan-unit de">pro Monat | 47,99 EUR / Jahr (20% sparen)</div>
          <div class="plan-unit en">per month | 47.99 EUR / year (save 20%)</div>
          <ul class="plan-feats">
            <li class="de">Unbegrenztes Shop-Browsing</li><li class="en">Unlimited shop browsing</li>
            <li class="de">Vollst&#228;ndige interaktive Karte mit Zoom</li><li class="en">Full interactive map with zoom</li>
            <li class="de">Routenbeschreibungen zu Shops</li><li class="en">Directions to shops</li>
            <li class="de">Priorit&#228;ts-Produktanfragen</li><li class="en">Priority product requests</li>
            <li class="de">Erweiterte Suche &amp; Filter</li><li class="en">Advanced search &amp; filters</li>
            <li class="de">Exklusive Angebote &amp; Rabatte</li><li class="en">Exclusive deals &amp; discounts</li>
            <li class="de">PRO-Badge im Profil</li><li class="en">PRO badge on profile</li>
            <li class="de">Fr&#252;her Zugang zu neuen Shops</li><li class="en">Early access to new shops</li>
          </ul>
        </div>
      </div>
      <h3><span class="de">Auf Pro upgraden</span><span class="en">Upgrading to Pro</span></h3>
      <ol class="steps">
        <li><div class="sb"><div class="st de">Preisseite &#246;ffnen</div><div class="st en">Open the Pricing Page</div><div class="sd de">Navigieren Sie zu <code>/pricing</code> oder klicken Sie auf <strong>&#8222;Auf Pro upgraden&#8220;</strong> in der Kopfzeile.</div><div class="sd en">Navigate to <code>/pricing</code> or click <strong>"Upgrade to Pro"</strong> in the header.</div></div></li>
        <li><div class="sb"><div class="st de">Abrechnungszeitraum w&#228;hlen</div><div class="st en">Choose Billing Period</div><div class="sd de">Monatlich (4,99 EUR/Monat) oder j&#228;hrlich (47,99 EUR/Jahr &#8211; 20% g&#252;nstiger) &#252;ber den Umschalter oben.</div><div class="sd en">Monthly (4.99 EUR/month) or yearly (47.99 EUR/year &#8211; 20% cheaper) using the toggle above.</div></div></li>
        <li><div class="sb"><div class="st de">Plan ausw&#228;hlen</div><div class="st en">Select Plan</div><div class="sd de">Klicken Sie auf <strong>&#8222;Plan w&#228;hlen&#8220;</strong> unter dem Pro-Tarif.</div><div class="sd en">Click <strong>"Choose Plan"</strong> below the Pro tier.</div></div></li>
      </ol>
    </section>

    <!-- 11 FAQ -->
    <section class="section" id="s11">
      <div class="sec-hdr"><div class="badge">11</div><h2>FAQ</h2></div>
      <h3><span class="de">Allgemein</span><span class="en">General</span></h3>
      <h4 class="de">Ist RegioSync kostenlos?</h4><h4 class="en">Is RegioSync free?</h4>
      <p class="de">Ja. Die Basisversion ist dauerhaft kostenlos. Der Pro-Tarif kostet 4,99 EUR pro Monat und schaltet alle Funktionen frei.</p>
      <p class="en">Yes. The basic version is permanently free. The Pro plan costs 4.99 EUR per month and unlocks all features.</p>
      <h4 class="de">Brauche ich eine App?</h4><h4 class="en">Do I need an app?</h4>
      <p class="de">Nein. RegioSync ist vollst&#228;ndig browserbasiert und funktioniert ohne App-Download auf allen modernen Ger&#228;ten.</p>
      <p class="en">No. RegioSync is fully browser-based and works without any app download on all modern devices.</p>
      <h4 class="de">Welche Sprachen werden unterst&#252;tzt?</h4><h4 class="en">Which languages are supported?</h4>
      <p class="de">RegioSync unterst&#252;tzt Deutsch und Englisch. Die Sprache kann &#252;ber den Umschalter in der Kopfzeile jederzeit ge&#228;ndert werden.</p>
      <p class="en">RegioSync supports German and English. The language can be changed at any time via the switcher in the header.</p>
      <h3><span class="de">Konto &amp; Sicherheit</span><span class="en">Account &amp; Security</span></h3>
      <h4 class="de">Ich habe mein Passwort vergessen. Was tun?</h4><h4 class="en">I forgot my password. What should I do?</h4>
      <p class="de">Gehen Sie zur Anmeldeseite und klicken Sie auf <strong>&#8222;Passwort vergessen?&#8220;</strong>. Sie erhalten einen Zur&#252;cksetzungs-Link per E-Mail.</p>
      <p class="en">Go to the login page and click <strong>"Forgot Password?"</strong>. You will receive a reset link by email.</p>
      <h4 class="de">Kann ich meine E-Mail-Adresse &#228;ndern?</h4><h4 class="en">Can I change my email address?</h4>
      <p class="de">Derzeit kann die E-Mail-Adresse nicht selbstst&#228;ndig ge&#228;ndert werden. Bitte kontaktieren Sie den Support unter <a href="mailto:info@regiosync.eu">info@regiosync.eu</a>.</p>
      <p class="en">Currently the email address cannot be changed independently. Please contact support at <a href="mailto:info@regiosync.eu">info@regiosync.eu</a>.</p>
      <h4 class="de">Mein Konto wurde gesperrt. Was kann ich tun?</h4><h4 class="en">My account has been banned. What can I do?</h4>
      <p class="de">Gesperrte Konten k&#246;nnen sich nicht anmelden. Kontaktieren Sie uns unter <a href="mailto:info@regiosync.eu">info@regiosync.eu</a>, wenn Sie glauben, dass die Sperrung irrt&#252;mlich erfolgt ist.</p>
      <p class="en">Banned accounts cannot log in. Contact us at <a href="mailto:info@regiosync.eu">info@regiosync.eu</a> if you believe the ban was made in error.</p>
      <h3><span class="de">Verk&#228;ufer</span><span class="en">Sellers</span></h3>
      <h4 class="de">Wie viele Shops kann ich erstellen?</h4><h4 class="en">How many shops can I create?</h4>
      <p class="de">Es gibt derzeit keine feste Begrenzung. Sie k&#246;nnen mehrere Shops mit unterschiedlichen Produkten und Standorten erstellen.</p>
      <p class="en">There is currently no fixed limit. You can create multiple shops with different products and locations.</p>
      <h4 class="de">Werden Transaktionsgeb&#252;hren erhoben?</h4><h4 class="en">Are transaction fees charged?</h4>
      <p class="de">Nein. RegioSync erhebt keine Transaktionsgeb&#252;hren. Die Bezahlung erfolgt direkt zwischen K&#228;ufer und Verk&#228;ufer au&#223;erhalb der Plattform.</p>
      <p class="en">No. RegioSync charges no transaction fees. Payment takes place directly between buyer and seller outside the platform.</p>
    </section>

    <!-- 12 LEGAL -->
    <section class="section" id="s12">
      <div class="sec-hdr"><div class="badge">12</div><h2><span class="de">Rechtliches &amp; Kontakt</span><span class="en">Legal &amp; Contact</span></h2></div>
      <h3><span class="de">Anbieter</span><span class="en">Provider</span></h3>
      <p><strong>WAMOCON GmbH</strong><br>Hauptstra&#223;e 2<br>65760 Eschborn<br>Deutschland / Germany</p>
      <p><span class="de">E-Mail:</span><span class="en">Email:</span> <a href="mailto:info@regiosync.eu">info@regiosync.eu</a></p>
      <h3><span class="de">Rechtliche Dokumente</span><span class="en">Legal Documents</span></h3>
      <div class="tbl"><table>
        <thead><tr><th><span class="de">Dokument</span><span class="en">Document</span></th><th>URL</th></tr></thead>
        <tbody>
          <tr><td class="de">Impressum</td><td class="en">Imprint</td><td><a href="/de/imprint">/imprint</a></td></tr>
          <tr><td class="de">Datenschutzerkl&#228;rung</td><td class="en">Privacy Policy</td><td><a href="/de/privacy">/privacy</a></td></tr>
          <tr><td class="de">Allgemeine Gesch&#228;ftsbedingungen</td><td class="en">Terms &amp; Conditions</td><td><a href="/de/terms">/terms</a></td></tr>
        </tbody>
      </table></div>
      <h3><span class="de">Support &amp; Hilfe</span><span class="en">Support &amp; Help</span></h3>
      <ul>
        <li><strong class="de">E-Mail:</strong><strong class="en">Email:</strong> <a href="mailto:info@regiosync.eu">info@regiosync.eu</a></li>
        <li class="de"><strong>Hilfeseite:</strong> <a href="/de/help">/help</a> &#8211; Kontextbezogene Hilfe auf jeder Seite &#252;ber das <strong>?</strong>-Symbol</li>
        <li class="en"><strong>Help page:</strong> <a href="/en/help">/help</a> &#8211; Context-sensitive help on every page via the <strong>?</strong> icon</li>
      </ul>
      <hr>
      <p style="font-size:.82rem;color:var(--muted)" class="de">Version 0.1.0 &mdash; Stand: Mai 2026 &mdash; RegioSync von WAMOCON GmbH. Alle Rechte vorbehalten.</p>
      <p style="font-size:.82rem;color:var(--muted)" class="en">Version 0.1.0 &mdash; As of: May 2026 &mdash; RegioSync by WAMOCON GmbH. All rights reserved.</p>
    </section>

  </main>
</div>

<footer class="footer">
  <div>
    <strong>RegioSync</strong> &mdash;
    <span class="de">Benutzerhandbuch v0.1.0 &mdash; WAMOCON GmbH, Eschborn</span>
    <span class="en">User Manual v0.1.0 &mdash; WAMOCON GmbH, Eschborn</span>
    <br><a href="mailto:info@regiosync.eu">info@regiosync.eu</a>
  </div>
  <div style="display:flex;gap:.75rem;flex-wrap:wrap">
    <a href="/de/imprint" class="de">Impressum</a><a href="/en/imprint" class="en">Imprint</a>
    <a href="/de/privacy" class="de">Datenschutz</a><a href="/en/privacy" class="en">Privacy</a>
    <a href="/de/terms" class="de">AGB</a><a href="/en/terms" class="en">Terms</a>
  </div>
</footer>

<script>
function setLang(l){
  document.documentElement.setAttribute('data-lang',l);
  document.getElementById('btn-de').classList.toggle('on',l==='de');
  document.getElementById('btn-en').classList.toggle('on',l==='en');
  localStorage.setItem('rs-lang',l);
}
function toggleTheme(){
  var t=document.documentElement.getAttribute('data-theme')==='light'?'dark':'light';
  document.documentElement.setAttribute('data-theme',t);
  document.getElementById('theme-icon').textContent=t==='dark'?'\u2600\uFE0F':'\uD83C\uDF19';
  localStorage.setItem('rs-theme',t);
}
var sections=document.querySelectorAll('.section');
var navItems=document.querySelectorAll('.nav-a');
function onScroll(){
  var y=window.scrollY+100;
  sections.forEach(function(s){
    if(s.offsetTop<=y&&s.offsetTop+s.offsetHeight>y){
      navItems.forEach(function(n){n.classList.remove('active')});
      var lnk=document.querySelector('.nav-a[href="#'+s.id+'"]');
      if(lnk)lnk.classList.add('active');
    }
  });
}
window.addEventListener('scroll',onScroll,{passive:true});
(function(){
  var lang=localStorage.getItem('rs-lang')||'de';
  var theme=localStorage.getItem('rs-theme')||'light';
  setLang(lang);
  document.documentElement.setAttribute('data-theme',theme);
  document.getElementById('theme-icon').textContent=theme==='dark'?'\u2600\uFE0F':'\uD83C\uDF19';
})();
</script>
</body>
</html>`;

writeFileSync(join(root, 'docs', 'manual', 'index.html'), html, 'utf8');
console.log('✓ docs/manual/index.html written, size:', html.length, 'chars');
