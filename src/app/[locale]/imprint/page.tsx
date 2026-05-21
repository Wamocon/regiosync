import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ImprintPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-card p-8 prose dark:prose-invert max-w-none">
          <h1>Impressum / Imprint</h1>
          <h2>Angaben gemaess 5 TMG</h2>
          <p>WAMOCON GmbH<br/>Musterstrasse 1<br/>12345 Musterstadt<br/>Deutschland / Germany</p>
          <h2>Kontakt / Contact</h2>
          <p>E-Mail: info@wamocon.de</p>
          <h2>Vertreten durch / Represented by</h2>
          <p>Waleri Moretz, CEO</p>
          <h2>Handelsregister / Commercial Register</h2>
          <p>Registergericht: Amtsgericht Musterstadt<br/>Registernummer: HRB XXXXX</p>
          <h2>Umsatzsteuer-ID / VAT ID</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemaess 27a UStG: DE XXXXXXXXX</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
