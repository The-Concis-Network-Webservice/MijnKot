import { siteConfig } from '@/shared/lib/config';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden',
  description: `Lees de algemene voorwaarden van ${siteConfig.company.name} voor het huren van studentenkoten.`,
};

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl font-body text-text-main">
      <Link href="/" className="inline-flex items-center text-text-muted hover:text-primary-600 font-medium mb-8 transition-colors">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Terug naar home
      </Link>
      
      <h1 className="text-4xl md:text-5xl font-display text-primary-500 mb-8 font-semibold">Algemene Voorwaarden</h1>
      
      <div className="bg-surface-card rounded-2xl p-8 md:p-12 shadow-soft border border-border-light space-y-6 lg:ml-2">
        <p className="text-lg text-text-muted">Laatst bijgewerkt: {new Date().toLocaleDateString('nl-BE')}</p>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">1. Toepassingsgebied</h2>
          <p>
            Deze algemene voorwaarden zijn van toepassing op elk gebruik van de website "${siteConfig.company.name}" en op alle diensten, informatie en reserveringsaanvragen die via deze website worden aangeboden. Door gebruik te maken van onze website gaat u akkoord met deze voorwaarden.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">2. Informatie op de website</h2>
          <p>
            De informatie, foto's, prijzen en beschikbaarheden van de studentenkamers en studio's (koten) op deze website worden met de grootste zorg samengesteld en up-to-date gehouden. Desondanks verbinden deze gegevens ons niet contractueel. Prijzen, voorschotten, oppervlaktes en beschikbaarheid zijn louter indicatief en kunnen op elk moment worden gewijzigd zonder voorafgaande kennisgeving.
          </p>
          <p>
            Pas bij het ondertekenen van een bindende (studenten)huurovereenkomst worden de definitieve voorwaarden van de huur, waaronder de huurprijs, kosten en waarborgsom, vastgelegd conform de relevante wetgeving, zoals het Vlaams Woninghuurdecreet (voor panden in Vlaanderen).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">3. Contact en Reserveringen</h2>
          <p>
            Een aanvraag via de website (bijv. via het contactformulier of door een bezichtiging aan te vragen) geldt niet als een bindende overeenkomst of een definitieve reservering van een kot. {siteConfig.company.name} behoudt zich het recht voor om, zonder opgave van redenen, aanvragen te weigeren of prioriteit te geven aan bepaalde kandidaten op basis van eigen toewijzingscriteria en de wettelijke antidiscriminatiewetgeving.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">4. Huurovereenkomsten</h2>
          <p>
            Voor studentenkamers is de specifieke landelijke en regionale regelgeving rond huurcontracten van toepassing. Dit omvat onder andere de bepalingen over de duur van de huurovereenkomst, voortijdige opzegging (bijv. bij stopzetting studie), de huurwaarborg en de aanrekening van nutsvoorzieningen (all-in of met voorschotten). De exacte voorwaarden worden per pand verduidelijkt en opgenomen in het huurcontract.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">5. Aansprakelijkheid</h2>
          <p>
            {siteConfig.company.name} kan niet aansprakelijk worden gesteld voor enige directe of indirecte schade die voortvloeit uit het gebruik van de website of de onmogelijkheid om de website te raadplegen (bijv. door technische storingen). Evenmin kunnen wij aansprakelijk worden gesteld voor eventuele fouten in de verstrekte informatie, tenzij in geval van opzet of zware fout onzentwege.
          </p>
          <p>
            De website kan links bevatten naar websites van derden, waarover {siteConfig.company.name} geen controle heeft. Wij zijn niet verantwoordelijk voor de inhoud of het privacybeleid van deze externe websites.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">6. Intellectuele eigendom</h2>
          <p>
            Alle teksten, afbeeldingen, logo's, grafische elementen en de structuur van deze website zijn beschermd door intellectuele eigendomsrechten, waaronder het auteursrecht. Het is niet toegestaan om zonder voorafgaande schriftelijke toestemming van {siteConfig.company.name} de inhoud van de website te kopiëren, te verspreiden, te wijzigen of voor commerciële doeleinden te gebruiken.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">7. Toepasselijk recht en bevoegde rechtbanken</h2>
          <p>
            Deze algemene voorwaarden zijn onderworpen aan het Belgisch recht. In geval van een geschil betreffende de geldigheid, interpretatie of uitvoering van deze voorwaarden of uw gebruik van de website, zijn uitsluitend de rechtbanken van het arrondissement waar {siteConfig.company.name} gevestigd is, bevoegd.
          </p>
        </section>
      </div>
    </div>
  );
}
