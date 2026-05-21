import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-card p-8 prose dark:prose-invert max-w-none">

          {/* ── GERMAN ── */}
          <h1>Allgemeine Geschaeftsbedingungen (AGB)</h1>
          <p className="text-sm text-muted-foreground">Stand: Mai 2026</p>

          <h2>§ 1 Geltungsbereich</h2>
          <p>(1) Diese Allgemeinen Geschaeftsbedingungen (nachfolgend &quot;AGB&quot;) der WAMOCON GmbH, Mergenthalerallee 79 - 81, 65760 Eschborn (nachfolgend &quot;Anbieter&quot;), gelten fuer alle Vertraege ueber die Nutzung der Software-as-a-Service-Plattform RegioSync (nachfolgend &quot;Plattform&quot;), die ueber die Website www.regiosync.eu bereitgestellt wird.</p>
          <p>(2) Die Plattform richtet sich an Verbraucher sowie an Unternehmen und gewerbliche Nutzer (nachfolgend &quot;Nutzer&quot;).</p>
          <p>(3) Abweichende AGB des Nutzers werden nicht Vertragsbestandteil, es sei denn, der Anbieter stimmt schriftlich zu.</p>

          <h2>§ 2 Vertragsschluss</h2>
          <p>(1) Die Darstellung der Plattform auf der Website stellt kein verbindliches Angebot dar, sondern eine Aufforderung zur Abgabe eines Angebots (invitatio ad offerendum).</p>
          <p>(2) Der Nutzer gibt ein verbindliches Angebot ab, indem er den Registrierungsprozess abschliesst und diese AGB akzeptiert.</p>
          <p>(3) Der Vertrag kommt zustande, wenn der Anbieter das Angebot durch Freischaltung des Zugangs annimmt.</p>

          <h2>§ 3 Leistungsbeschreibung</h2>
          <p>(1) Der Anbieter stellt dem Nutzer die Plattform als Software-as-a-Service (SaaS) ueber das Internet zur Verfuegung.</p>
          <p>(2) Der Funktionsumfang richtet sich nach dem gewahlten Tarif (Free oder Pro). Der genaue Umfang ist auf der Preisseite beschrieben.</p>
          <p>(3) Der Anbieter ist berechtigt, die Plattform weiterzuentwickeln. Wesentliche Einschraenkungen werden vorab mitgeteilt.</p>

          <h2>§ 4 Nutzungsrechte</h2>
          <p>(1) Der Anbieter raeumt dem Nutzer fuer die Vertragslaufzeit ein einfaches, nicht uebertragbares, nicht unterlizenzierbares Recht zur Nutzung der Plattform ein.</p>
          <p>(2) Der Nutzer darf die Plattform nur fuer eigene Zwecke nutzen und nicht an Dritte weitergeben.</p>

          <h2>§ 5 Pflichten des Nutzers</h2>
          <p>(1) Der Nutzer verpflichtet sich, seine Zugangsdaten geheim zu halten und vor dem Zugriff Dritter zu schuetzen.</p>
          <p>(2) Der Nutzer stellt sicher, dass die Nutzung der Plattform im Einklang mit geltendem Recht erfolgt. Insbesondere sind folgende Inhalte verboten: illegale, beleidigende, diskriminierende oder irrefuehrende Informationen sowie Spam.</p>
          <p>(3) Verkaeufer verpflichten sich, nur tatsaechlich verfuegbare Produkte anzubieten und korrekte Standortdaten anzugeben.</p>

          <h2>§ 6 Verfuegbarkeit</h2>
          <p>(1) Der Anbieter bemuehrt sich um eine Verfuegbarkeit der Plattform von 99,5 % im Jahresmittel.</p>
          <p>(2) Geplante Wartungsarbeiten, die vorab angekuendigt werden, gelten nicht als Ausfallzeit.</p>

          <h2>§ 7 Datenschutz</h2>
          <p>Die Verarbeitung personenbezogener Daten erfolgt gemaess der Datenschutzerklaerung des Anbieters und den Bestimmungen der DSGVO.</p>

          <h2>§ 8 Haftung</h2>
          <p>(1) Der Anbieter haftet unbeschraenkt fuer Schaeden aus der Verletzung des Lebens, des Koerpers oder der Gesundheit sowie bei Vorsatz und grober Fahrlaessigkeit.</p>
          <p>(2) Im Uebrigen ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt.</p>
          <p>(3) Fuer Inhalte, die Nutzer oder Verkaeufer auf der Plattform einstellen, uebernimmt der Anbieter keine Haftung.</p>

          <h2>§ 9 Vertragslaufzeit und Kuendigung</h2>
          <p>(1) Der Free-Tarif ist jederzeit kuendbar. Der Pro-Tarif kann mit einer Frist von einem Monat zum Monatsende gekuendigt werden.</p>
          <p>(2) Das Recht zur ausserordentlichen Kuendigung aus wichtigem Grund bleibt unberuehrt.</p>
          <p>(3) Im Falle eines schwerwiegenden Verstosses gegen diese AGB ist der Anbieter berechtigt, den Zugang des Nutzers sofort zu sperren.</p>

          <h2>§ 10 Schlussbestimmungen</h2>
          <p>(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.</p>
          <p>(2) Gerichtsstand ist Eschborn, sofern der Nutzer Kaufmann ist.</p>
          <p>(3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der uebrigen Bestimmungen davon unberuehrt.</p>

          {/* <hr /> */}

          {/* ── ENGLISH ── */}
          {/* <h1>Terms and Conditions</h1>
          <p className="text-sm text-muted-foreground">As of: May 2026</p>

          <h2>§ 1 Scope</h2>
          <p>(1) These Terms and Conditions (&quot;T&amp;C&quot;) of WAMOCON GmbH, Mergenthalerallee 79 - 81, 65760 Eschborn (&quot;Provider&quot;), apply to all contracts for the use of the Software-as-a-Service platform RegioSync (&quot;Platform&quot;), provided via www.regiosync.eu.</p>
          <p>(2) The Platform is aimed at consumers as well as businesses and commercial users (&quot;Users&quot;).</p>
          <p>(3) Deviating T&amp;C of the User shall not become part of the contract unless the Provider expressly agrees in writing.</p>

          <h2>§ 2 Conclusion of Contract</h2>
          <p>(1) The presentation of the Platform on the website does not constitute a binding offer but an invitation to submit an offer (invitatio ad offerendum).</p>
          <p>(2) The User submits a binding offer by completing the registration process and accepting these T&amp;C.</p>
          <p>(3) The contract is concluded when the Provider accepts the offer by activating access.</p>

          <h2>§ 3 Service Description</h2>
          <p>(1) The Provider makes the Platform available as Software-as-a-Service (SaaS) via the Internet.</p>
          <p>(2) The scope of features depends on the chosen plan (Free or Pro). The exact scope is described on the pricing page.</p>
          <p>(3) The Provider is entitled to further develop the Platform. Material restrictions will be communicated in advance.</p>

          <h2>§ 4 Usage Rights</h2>
          <p>(1) The Provider grants the User a simple, non-transferable, non-sublicensable right to use the Platform for the duration of the contract.</p>
          <p>(2) The User may only use the Platform for their own purposes and may not transfer it to third parties.</p>

          <h2>§ 5 User Obligations</h2>
          <p>(1) The User shall keep their access credentials confidential and protect them from third-party access.</p>
          <p>(2) The User ensures that use of the Platform complies with applicable law. Prohibited content includes: illegal, offensive, discriminatory or misleading information, and spam.</p>
          <p>(3) Sellers commit to listing only actually available products and providing accurate location data.</p>

          <h2>§ 6 Availability</h2>
          <p>(1) The Provider shall endeavour to maintain an annual average availability of 99.5%.</p>
          <p>(2) Scheduled maintenance windows announced in advance shall not count as downtime.</p>

          <h2>§ 7 Data Protection</h2>
          <p>The processing of personal data is governed by the Provider&apos;s Privacy Policy and the provisions of the GDPR.</p>

          <h2>§ 8 Liability</h2>
          <p>(1) The Provider shall be fully liable for damages arising from injury to life, body, or health, as well as for intent and gross negligence.</p>
          <p>(2) Otherwise, liability is limited to foreseeable, typically occurring damages.</p>
          <p>(3) The Provider assumes no liability for content posted by Users or Sellers on the Platform.</p>

          <h2>§ 9 Contract Duration and Termination</h2>
          <p>(1) The Free plan may be terminated at any time. The Pro plan may be terminated with one month&apos;s notice to the end of a calendar month.</p>
          <p>(2) The right to extraordinary termination for good cause remains unaffected.</p>
          <p>(3) In the event of a serious breach of these T&amp;C, the Provider is entitled to immediately suspend the User&apos;s access.</p>

          <h2>§ 10 Final Provisions</h2>
          <p>(1) The law of the Federal Republic of Germany shall apply, excluding the UN Convention on Contracts for the International Sale of Goods.</p>
          <p>(2) The place of jurisdiction is Eschborn, provided the User is a merchant.</p>
          <p>(3) Should individual provisions be invalid, the validity of the remaining provisions shall remain unaffected.</p> */}

        </div>
      </main>
      <Footer />
    </div>
  );
}

