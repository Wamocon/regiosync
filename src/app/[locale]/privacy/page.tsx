import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-card p-8 prose dark:prose-invert max-w-none">
          <h1>Datenschutzerklaerung / Privacy Policy</h1>
          <h2>1. Datenschutz auf einen Blick / Privacy at a Glance</h2>
          <p>Die folgenden Hinweise geben einen einfachen Ueberblick darueber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
          <p>The following information provides a simple overview of what happens to your personal data when you visit this website.</p>
          <h2>2. Datenerfassung / Data Collection</h2>
          <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber (WAMOCON GmbH). Wir erheben und speichern personenbezogene Daten nur im notwendigen Umfang.</p>
          <p>Data processing on this website is carried out by the website operator (WAMOCON GmbH). We only collect and store personal data to the extent necessary.</p>
          <h2>3. Ihre Rechte / Your Rights</h2>
          <p>Sie haben jederzeit das Recht, unentgeltlich Auskunft ueber Herkunft, Empfaenger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten.</p>
          <p>You have the right at any time to obtain information free of charge about the origin, recipients, and purpose of your stored personal data.</p>
          <h2>4. Hosting</h2>
          <p>Diese Website wird bei Vercel Inc. gehostet. Die Datenbank wird bei Supabase gehostet.</p>
          <p>This website is hosted with Vercel Inc. The database is hosted with Supabase.</p>
          <h2>5. Kontakt / Contact</h2>
          <p>Bei Fragen zum Datenschutz wenden Sie sich bitte an: info@wamocon.de</p>
          <p>For questions regarding data protection, please contact: info@wamocon.de</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
