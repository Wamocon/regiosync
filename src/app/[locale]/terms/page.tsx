import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-card p-8 prose dark:prose-invert max-w-none">
          <h1>AGB / Terms and Conditions</h1>
          <h2>1. Geltungsbereich / Scope</h2>
          <p>Diese Allgemeinen Geschaeftsbedingungen gelten fuer die Nutzung der Plattform RegioSync, betrieben von der WAMOCON GmbH.</p>
          <p>These Terms and Conditions apply to the use of the RegioSync platform, operated by WAMOCON GmbH.</p>
          <h2>2. Registrierung / Registration</h2>
          <p>Fuer die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich. Der Nutzer verpflichtet sich, wahrheitsgemasse Angaben zu machen.</p>
          <p>Registration is required for the use of certain features. The user agrees to provide truthful information.</p>
          <h2>3. Nutzungsrechte / Usage Rights</h2>
          <p>Der Nutzer erhaelt ein einfaches, nicht uebertragbares Recht zur Nutzung der Plattform.</p>
          <p>The user receives a simple, non-transferable right to use the platform.</p>
          <h2>4. Haftung / Liability</h2>
          <p>WAMOCON GmbH haftet nur bei Vorsatz und grober Fahrlaessigkeit.</p>
          <p>WAMOCON GmbH is only liable for intent and gross negligence.</p>
          <h2>5. Kuendigung / Termination</h2>
          <p>Beide Parteien koennen das Nutzungsverhaeltnis jederzeit kuendigen.</p>
          <p>Both parties may terminate the usage relationship at any time.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
