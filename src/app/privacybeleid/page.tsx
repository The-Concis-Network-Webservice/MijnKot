import { siteConfig } from '@/shared/lib/config';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Privacybeleid',
  description: `Lees het privacybeleid van ${siteConfig.company.name} en leer hoe we met uw gegevens omgaan.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl font-body text-text-main">
      <Link href="/" className="inline-flex items-center text-text-muted hover:text-primary-600 font-medium mb-8 transition-colors">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Terug naar home
      </Link>
      
      <h1 className="text-4xl md:text-5xl font-display text-primary-500 mb-8 font-semibold">Privacybeleid</h1>
      
      <div className="bg-surface-card rounded-2xl p-8 md:p-12 shadow-soft border border-border-light space-y-6 lg:ml-2">
        <p className="text-lg text-text-muted">Laatst bijgewerkt: 24 maart 2026</p>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">1. Inleiding</h2>
          <p>
            Welkom bij {siteConfig.company.name}. Wij hechten veel waarde aan uw privacy en beschermen uw persoonsgegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG/GDPR) en de Belgische privacywetgeving. Dit privacybeleid legt uit welke gegevens wij verzamelen, hoe we deze gebruiken en wat uw rechten zijn.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">2. Verwerkingsverantwoordelijke</h2>
          <p>
            {siteConfig.company.legalName} is de verwerkingsverantwoordelijke voor de persoonsgegevens die via deze website worden verzameld. Voor vragen over uw privacy kunt u contact met ons opnemen via de contactgegevens op onze website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">3. Welke gegevens verzamelen wij?</h2>
          <p>Wij kunnen de volgende persoonsgegevens verzamelen en verwerken:</p>
          <ul className="list-disc pl-6 space-y-4 text-text-main marker:text-primary-500 leading-relaxed">
            <li><strong>Identificatiegegevens:</strong> naam, voornaam.</li>
            <li><strong>Contactgegevens:</strong> e-mailadres, telefoonnummer.</li>
            <li><strong>Aanvraaggegevens:</strong> informatie met betrekking tot uw zoektocht naar een studentenkot of studio.</li>
            <li><strong>Technische gegevens:</strong> IP-adres, browsertype, apparaatinformatie (verzameld via cookies).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">4. Doeleinden van de verwerking</h2>
          <p>Wij verwerken uw persoonsgegevens voor de volgende doeleinden:</p>
          <ul className="list-disc pl-6 space-y-4 text-text-main marker:text-primary-500 leading-relaxed">
            <li>Het beantwoorden van uw vragen en contactverzoeken.</li>
            <li>Het beheren van bezichtigingen en verhuur van studentenkamers.</li>
            <li>Het verbeteren van onze website en dienstverlening.</li>
            <li>Het voldoen aan onze wettelijke verplichtingen (zoals boekhouding en belastingen in België).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">5. Rechtsgrond voor de verwerking</h2>
          <p>De verwerking van uw gegevens is gebaseerd op:</p>
          <ul className="list-disc pl-6 space-y-4 text-text-main marker:text-primary-500 leading-relaxed">
            <li>Uw uitdrukkelijke toestemming (bijv. bij het invullen van een contactformulier).</li>
            <li>De uitvoering van een overeenkomst of precontractuele maatregelen (bijv. bij het huren van een kot).</li>
            <li>Ons gerechtvaardigd belang (bijv. voor de beveiliging en verbetering van onze website).</li>
            <li>Wettelijke verplichtingen.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">6. Delen van uw gegevens</h2>
          <p>
            Wij verkopen uw persoonsgegevens niet aan derden. Wij delen uw gegevens alleen met derde partijen wanneer dit noodzakelijk is voor de uitvoering van onze diensten (bijv. IT-dienstverleners, software voor vastgoedbeheer) of om te voldoen aan een wettelijke verplichting. Met deze verwerkers sluiten wij verwerkersovereenkomsten af om de veiligheid van uw gegevens te garanderen.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">7. Bewaartermijn</h2>
          <p>
            Wij bewaren uw persoonsgegevens niet langer dan strikt noodzakelijk is om de doelen te realiseren waarvoor uw gegevens worden verzameld. Gegevens gekoppeld aan een huurovereenkomst worden bewaard volgens de wettelijke Belgische bewaartermijnen (doorgaans 7 tot 10 jaar).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">8. Uw rechten</h2>
          <p>Onder de AVG heeft u de volgende rechten met betrekking tot uw persoonsgegevens:</p>
          <ul className="list-disc pl-6 space-y-4 text-text-main marker:text-primary-500 leading-relaxed">
            <li><strong>Recht op inzage:</strong> U mag opvragen welke gegevens wij van u hebben.</li>
            <li><strong>Recht op rectificatie:</strong> U mag vragen om onjuiste gegevens te corrigeren.</li>
            <li><strong>Recht op gegevenswissing ("recht om vergeten te worden"):</strong> U kunt vragen om uw gegevens te verwijderen, tenzij wij wettelijk verplicht zijn deze te bewaren.</li>
            <li><strong>Recht op beperking van de verwerking.</strong></li>
            <li><strong>Recht op overdraagbaarheid van gegevens (dataportabiliteit).</strong></li>
            <li><strong>Recht van bezwaar:</strong> U kunt bezwaar maken tegen de verwerking van uw gegevens.</li>
          </ul>
          <p>
            Om uw rechten uit te oefenen, kunt u contact met ons opnemen. We proberen uw verzoek binnen één maand na ontvangst te behandelen.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">9. Klachten</h2>
          <p>
            Indien u vindt dat wij uw gegevens niet correct behandelen, heeft u het recht om een klacht in te dienen bij de Belgische Gegevensbeschermingsautoriteit (GBA):
          </p>
          <address className="not-italic text-text-muted bg-surface-main p-4 rounded-lg mt-2 inline-block">
            <strong>Gegevensbeschermingsautoriteit</strong><br />
            Drukpersstraat 35, 1000 Brussel<br />
            Telefoon: +32 (0)2 274 48 00<br />
            Website: <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:text-accent-600 underline">www.gegevensbeschermingsautoriteit.be</a>
          </address>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">10. Wijzigingen aan dit beleid</h2>
          <p>
            Wij behouden ons het recht voor om dit privacybeleid te allen tijde te wijzigen. De meest recente versie is altijd beschikbaar op deze pagina.
          </p>
        </section>
      </div>
    </div>
  );
}
