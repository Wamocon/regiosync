import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-card p-8 prose dark:prose-invert max-w-none">

          {/* ── GERMAN ── */}
          <h1>Datenschutzerklaerung</h1>
          <p className="text-sm text-muted-foreground">Stand: Mai 2026</p>

          <h2>1. Verantwortlicher</h2>
          <p>
            Verantwortlicher im Sinne der DSGVO ist:<br />
            WAMOCON GmbH, Mergenthalerallee 79 - 81, 65760 Eschborn<br />
            Telefon: +49 6196 5838311 | E-Mail: <a href="mailto:info@wamocon.com">info@wamocon.com</a><br />
            Projektkontakt: <a href="mailto:info@regiosync.eu">info@regiosync.eu</a><br />
            Geschaeftsfuehrer: Dipl.-Ing. Waleri Moretz | Handelsregister: Eschborn HRB 123666 | USt-ID: DE344930486
          </p>

          <h2>2. Ueberblick ueber die Datenverarbeitung</h2>
          <p>
            Diese Datenschutzerklaerung gilt fuer die Webanwendung RegioSync (www.regiosync.eu).
            Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer
            funktionsfaehigen Plattform und unserer Leistungen erforderlich ist.
          </p>

          <h2>3. Rechtsgrundlagen</h2>
          <ul>
            <li><strong>Einwilligung</strong> - Art. 6 Abs. 1 lit. a DSGVO</li>
            <li><strong>Vertragserfullung</strong> - Art. 6 Abs. 1 lit. b DSGVO</li>
            <li><strong>Rechtliche Verpflichtung</strong> - Art. 6 Abs. 1 lit. c DSGVO</li>
            <li><strong>Berechtigtes Interesse</strong> - Art. 6 Abs. 1 lit. f DSGVO</li>
          </ul>

          <h2>4. Hosting und Infrastruktur</h2>
          <p><strong>Vercel Inc.:</strong> Hosting der Webanwendung. Verarbeitete Daten: IP-Adresse, Zeitstempel, Browserinformationen. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>
          <p><strong>Supabase Inc.:</strong> Datenbank, Authentifizierung, Dateispeicher. Verarbeitete Daten: Authentifizierungsdaten, Session-Informationen, Nutzerdaten, gespeicherte Medien. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>

          <h2>5. Erhebung personenbezogener Daten</h2>
          <p><strong>Registrierung:</strong> Name, E-Mail-Adresse und Passwort (Vertragserfuellung, Art. 6 Abs. 1 lit. b DSGVO).</p>
          <p><strong>Nutzerprofil:</strong> Optionale Profilangaben wie Adresse und Profilbild.</p>
          <p><strong>Verkaeufer:</strong> Shopname, Standortdaten (GPS-Koordinaten), Produktinformationen und Bilder.</p>
          <p><strong>Server-Logfiles:</strong> IP-Adresse, Datum/Uhrzeit, aufgerufene Seite, Referrer-URL, Browser-Typ. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>

          <h2>6. Cookies und Tracking</h2>
          <p>Die Plattform verwendet ausschliesslich technisch notwendige Cookies fuer Session-Management und Authentifizierung. Es werden keine Tracking- oder Marketing-Cookies eingesetzt. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>

          <h2>7. Rechte der betroffenen Personen</h2>
          <p>Sie haben das Recht auf: <strong>Auskunft</strong> (Art. 15), <strong>Berichtigung</strong> (Art. 16), <strong>Loeschung</strong> (Art. 17), <strong>Einschraenkung</strong> (Art. 18), <strong>Datenuebertragbarkeit</strong> (Art. 20), <strong>Widerspruch</strong> (Art. 21) und <strong>Widerruf</strong> erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO). Sie haben ausserdem das Recht, sich bei der zustaendigen Aufsichtsbehoerde zu beschweren (Art. 77 DSGVO).</p>
          <p>Kontakt: <a href="mailto:info@regiosync.eu">info@regiosync.eu</a></p>

          <h2>8. Datensicherheit</h2>
          <p>Wir setzen technische und organisatorische Sicherheitsmassnahmen nach dem Stand der Technik ein. Die Uebertragung erfolgt verschluesselt ueber HTTPS/TLS.</p>

          <h2>9. Aenderungen</h2>
          <p>Wir behalten uns vor, diese Datenschutzerklaerung anzupassen, um sie an geaenderte Rechtslagen oder Plattformfunktionen anzupassen.</p>

          {/* <hr /> */}

          {/* ── ENGLISH ── */}
          {/* <h1>Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">As of: May 2026</p>

          <h2>1. Data Controller</h2>
          <p>
            The Data Controller under the GDPR is:<br />
            WAMOCON GmbH, Mergenthalerallee 79 - 81, 65760 Eschborn, Germany<br />
            Phone: +49 6196 5838311 | Email: <a href="mailto:info@wamocon.com">info@wamocon.com</a><br />
            Project Contact: <a href="mailto:info@regiosync.eu">info@regiosync.eu</a><br />
            Managing Director: Dipl.-Ing. Waleri Moretz | Commercial Register: Eschborn HRB 123666 | VAT ID: DE344930486
          </p>

          <h2>2. Overview of Data Processing</h2>
          <p>
            This Privacy Policy applies to the web application RegioSync (www.regiosync.eu).
            We process personal data only insofar as this is necessary to provide a functional
            platform and our services.
          </p>

          <h2>3. Legal Basis for Processing</h2>
          <ul>
            <li><strong>Consent</strong> - Art. 6(1)(a) GDPR</li>
            <li><strong>Performance of Contract</strong> - Art. 6(1)(b) GDPR</li>
            <li><strong>Legal Obligation</strong> - Art. 6(1)(c) GDPR</li>
            <li><strong>Legitimate Interest</strong> - Art. 6(1)(f) GDPR</li>
          </ul>

          <h2>4. Hosting and Infrastructure</h2>
          <p><strong>Vercel Inc.:</strong> Hosting of the web application. Data processed: IP address, timestamps, browser information. Legal basis: Art. 6(1)(f) GDPR.</p>
          <p><strong>Supabase Inc.:</strong> Database, authentication, file storage. Data processed: authentication data, session information, user data, stored media. Legal basis: Art. 6(1)(b) GDPR.</p>

          <h2>5. Collection of Personal Data</h2>
          <p><strong>Registration:</strong> Name, email address, and password (performance of contract, Art. 6(1)(b) GDPR).</p>
          <p><strong>User Profile:</strong> Optional profile information such as address and profile picture.</p>
          <p><strong>Sellers:</strong> Shop name, location data (GPS coordinates), product information, and images.</p>
          <p><strong>Server Log Files:</strong> IP address, date/time, page accessed, referrer URL, browser type. Legal basis: Art. 6(1)(f) GDPR.</p>

          <h2>6. Cookies and Tracking</h2>
          <p>The platform uses only technically necessary cookies for session management and authentication. No tracking or marketing cookies are used. Legal basis: Art. 6(1)(f) GDPR.</p>

          <h2>7. Rights of Data Subjects</h2>
          <p>You have the right to: <strong>Access</strong> (Art. 15), <strong>Rectification</strong> (Art. 16), <strong>Erasure</strong> (Art. 17), <strong>Restriction of processing</strong> (Art. 18), <strong>Data portability</strong> (Art. 20), <strong>Object</strong> (Art. 21), and <strong>Withdraw consent</strong> (Art. 7(3) GDPR). You also have the right to lodge a complaint with the competent supervisory authority (Art. 77 GDPR).</p>
          <p>Contact: <a href="mailto:info@regiosync.eu">info@regiosync.eu</a></p>

          <h2>8. Data Security</h2>
          <p>We employ state-of-the-art technical and organisational security measures. All data transmission is encrypted via HTTPS/TLS.</p>

          <h2>9. Changes to this Privacy Policy</h2>
          <p>We reserve the right to amend this Privacy Policy to reflect changes in the law or changes to the platform.</p> */}

        </div>
      </main>
      <Footer />
    </div>
  );
}

