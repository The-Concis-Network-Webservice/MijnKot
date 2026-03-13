import { siteConfig } from '@/shared/lib/config';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Cookie-instellingen',
  description: `Informatie over het gebruik van cookies op ${siteConfig.company.name} en uw instellingen.`,
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl font-body text-text-main">
      <Link href="/" className="inline-flex items-center text-text-muted hover:text-primary-600 font-medium mb-8 transition-colors">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Terug naar home
      </Link>
      
      <h1 className="text-4xl md:text-5xl font-display text-primary-500 mb-8 font-semibold">Cookie-instellingen & Beleid</h1>
      
      <div className="bg-surface-card rounded-2xl p-8 md:p-12 shadow-soft border border-border-light space-y-6 lg:ml-2">
        <p className="text-lg text-text-muted">Laatst bijgewerkt: {new Date().toLocaleDateString('nl-BE')}</p>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">1. Wat zijn cookies?</h2>
          <p>
            Een cookie is een klein tekstbestand dat door een website op uw computer of mobiele apparaat wordt opgeslagen wanneer u onze website, "${siteConfig.company.name}", bezoekt. Cookies helpen onze website om correct te functioneren, verbeteren uw gebruikerservaring en geven ons inzicht in hoe de website wordt gebruikt.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">2. Welke soorten cookies gebruiken wij?</h2>
          <p>Wij maken op onze website gebruik van de volgende categorieën cookies:</p>
          
          <div className="space-y-4 mt-4">
            <div className="bg-surface-main p-6 rounded-lg border border-border-light">
              <h3 className="font-display text-lg text-primary-600 font-medium mb-2">Strikt noodzakelijke cookies</h3>
              <p className="text-text-main leading-relaxed mt-2">
                Deze cookies zijn essentieel om de website goed te laten werken en om uw voorkeuren te onthouden (bijv. uw taalkeuze of het onthouden van het feit of u de cookie-banner heeft geaccepteerd). Zonder deze cookies kan de website niet naar behoren functioneren. Voor het plaatsen van deze cookies is volgens de Belgische wetgeving geen voorafgaande toestemming nodig.
              </p>
            </div>

            <div className="bg-surface-main p-6 rounded-lg border border-border-light">
              <h3 className="font-display text-lg text-primary-600 font-medium mb-2">Analytische/prestatiecookies</h3>
              <p className="text-text-main leading-relaxed mt-2">
                Met deze cookies verzamelen we anonieme informatie over hoe bezoekers onze website gebruiken (bijv. welke pagina's het meest worden bezocht, hoe lang men op de site blijft en op welke links wordt geklikt). Dit helpt ons om de structuur, navigatie en inhoud van de website te verbeteren. Deze gegevens worden geaggregeerd en zijn niet herleidbaar tot individuele personen.
              </p>
            </div>

            <div className="bg-surface-main p-6 rounded-lg border border-border-light">
              <h3 className="font-display text-lg text-primary-600 font-medium mb-2">Functionele cookies</h3>
              <p className="text-text-main leading-relaxed mt-2">
                Deze cookies stellen de website in staat om extra functies en persoonlijke instellingen aan te bieden, zoals het onthouden van ingevulde formuliergegevens of integratie met diensten zoals kaarten of video's.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">3. Uw toestemming en cookiebeheer</h2>
          <p>
            Bij uw eerste bezoek aan onze website heeft u via onze cookie-banner de mogelijkheid gekregen om in te stemmen met ons gebruik van cookies of om specifieke soorten cookies te weigeren (met uitzondering van strikt noodzakelijke cookies). 
          </p>
          <p>
            U kunt uw cookie-instellingen of uw toestemming op elk moment wijzigen of intrekken door de instellingen van uw webbrowser aan te passen. Afhankelijk van de browser die u gebruikt, kunt u cookies blokkeren, reeds geplaatste cookies verwijderen of een waarschuwing krijgen voordat een cookie wordt opgeslagen.
          </p>
          <p>
            Houd er rekening mee dat het weigeren of uitschakelen van cookies ertoe kan leiden dat bepaalde functies of onderdelen van onze website niet meer optimaal werken.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">4. Wetgeving rond cookies</h2>
          <p>
            Dit cookiebeleid is opgesteld in overeenstemming met de vereisten van de Algemene Verordening Gegevensbescherming (AVG/GDPR) en de Belgische Wet betreffende de elektronische communicatie (waarin de Europese ePrivacy-richtlijn is geïmplementeerd).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-display text-primary-600 font-medium">5. Contact</h2>
          <p>
            Heeft u vragen of opmerkingen over ons gebruik van cookies of ons cookiebeleid? Neem dan gerust contact met ons op. Meer informatie over hoe we omgaan met uw persoonsgegevens vindt u in ons <a href="/privacybeleid" className="text-accent-500 hover:text-accent-600 underline">Privacybeleid</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
