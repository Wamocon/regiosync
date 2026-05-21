import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ImprintPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-card p-8 prose dark:prose-invert max-w-none">

          {/* ── GERMAN ── */}
          <h1>Impressum</h1>
          <p className="text-sm text-muted-foreground">Stand: Mai 2026</p>

          <h2>WAMOCON GmbH</h2>
          <p>
            Mergenthalerallee 79 - 81<br />
            65760 Eschborn<br />
            Deutschland
          </p>

          <h2>Kontakt</h2>
          <p>
            Telefon: +49 6196 5838311<br />
            E-Mail: <a href="mailto:info@wamocon.com">info@wamocon.com</a><br />
            Projektkontakt: <a href="mailto:info@regiosync.eu">info@regiosync.eu</a>
          </p>

          <h2>Vertretungsberechtigter Geschaeftsfuehrer</h2>
          <p>Dipl.-Ing. Waleri Moretz</p>

          <h2>Registereintrag</h2>
          <p>
            Sitz der Gesellschaft: Eschborn<br />
            Handelsregister: Eschborn HRB 123666<br />
            Umsatzsteuer-Identifikationsnummer: DE344930486
          </p>

          <h2>Angaben zum Angebot</h2>
          <p>
            RegioSync ist eine webbasierte Software-as-a-Service-Plattform zur Vernetzung
            lokaler Haendler, Bauern und Produzenten mit regionalen Kaeuferinnen und Kaeufer.
            Das Angebot richtet sich sowohl an Verbraucher als auch an gewerbliche Nutzer.
          </p>

          {/* <hr /> */}

          {/* ── ENGLISH ──
          <h1>Imprint (Legal Notice)</h1>
          <p className="text-sm text-muted-foreground">As of: May 2026</p>

          <h2>WAMOCON GmbH</h2>
          <p>
            Mergenthalerallee 79 - 81<br />
            65760 Eschborn<br />
            Germany
          </p>

          <h2>Contact</h2>
          <p>
            Phone: +49 6196 5838311<br />
            Email: <a href="mailto:info@wamocon.com">info@wamocon.com</a><br />
            Project Contact: <a href="mailto:info@regiosync.eu">info@regiosync.eu</a>
          </p>

          <h2>Authorized Managing Director</h2>
          <p>Dipl.-Ing. Waleri Moretz</p>

          <h2>Registration</h2>
          <p>
            Registered Office: Eschborn<br />
            Commercial Register: Eschborn HRB 123666<br />
            VAT Identification Number: DE344930486
          </p>

          <h2>About the Service</h2>
          <p>
            RegioSync is a web-based Software-as-a-Service platform connecting local farmers,
            artisans, and producers with regional customers. The service is aimed at both
            consumers and commercial users.
          </p> */}

        </div>
      </main>
      <Footer />
    </div>
  );
}
