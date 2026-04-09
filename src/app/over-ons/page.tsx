import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { JsonLd } from '@/shared/ui/json-ld';
import { siteConfig } from '@/shared/lib/config';
import { getVestigingen } from '@/shared/lib/queries';
import {
  ShieldCheckIcon,
  HomeModernIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  MapPinIcon,
  EnvelopeIcon,
  StarIcon,
  HomeIcon,
  ArrowsUpDownIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Over Ons',
  description:
    'Leer meer over Mijn-Kot: kwalitatieve studentenhuisvesting in Leuven met het KU Leuven Kotlabel. Direct contact met de eigenaar, geen bemiddelingskosten, volledig brandveilig gecertificeerd.',
  alternates: { canonical: 'https://mijn-kot.be/over-ons' },
  openGraph: {
    title: 'Over Mijn-Kot | Studentenhuisvesting in Leuven',
    description:
      'Kwalitatieve studentenkoten en studio\'s in Leuven. KU Leuven Kotlabel, brandveiligheid gecertificeerd, direct contact met eigenaar.',
    url: 'https://mijn-kot.be/over-ons',
    type: 'website',
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': `${siteConfig.company.url}/over-ons#page`,
  url: `${siteConfig.company.url}/over-ons`,
  name: 'Over Mijn-Kot',
  description:
    'Kwalitatieve studentenhuisvesting in Leuven met het KU Leuven Kotlabel. Direct contact met eigenaar, geen bemiddelingskosten.',
  mainEntity: {
    '@id': `${siteConfig.company.url}/#organization`,
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.company.url },
      { '@type': 'ListItem', position: 2, name: 'Over ons', item: `${siteConfig.company.url}/over-ons` },
    ],
  },
};

const values = [
  {
    icon: ShieldCheckIcon,
    title: 'Volledig brandveilig',
    desc: 'Elke kamer voldoet aan de veiligheidsvoorschriften van de brandweer Leuven. Jouw veiligheid is onze prioriteit.',
  },
  {
    icon: StarIcon,
    title: 'KU Leuven Kotlabel',
    desc: 'Onze kamers dragen het officiële kwaliteitslabel van KU Leuven, een garantie voor comfort, veiligheid en prijs-kwaliteit.',
  },
  {
    icon: UserGroupIcon,
    title: 'Direct contact met eigenaar',
    desc: 'Geen tussenpersonen, geen bemiddelingskosten. Je huurt rechtstreeks bij ons. Snel, transparant en persoonlijk.',
  },
  {
    icon: WrenchScrewdriverIcon,
    title: 'Eigen onderhoudsdienst',
    desc: 'Een vaste klusjesman staat in voor snel onderhoud. Kleine problemen worden doorgaans binnen de dag opgelost.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Bekijk het aanbod',
    desc: 'Blader door onze kamers en studio\'s in Leuven. Filter op type, locatie en prijs.',
  },
  {
    number: '02',
    title: 'Plan een gratis bezichtiging',
    desc: 'Boek online een bezichtiging: gratis, vrijblijvend en direct bevestigd. Je kiest zelf het moment.',
  },
  {
    number: '03',
    title: 'Teken digitaal',
    desc: 'Je huurovereenkomst wordt digitaal opgesteld en ondertekend. Snel, veilig en juridisch geldig.',
  },
  {
    number: '04',
    title: 'Trek in!',
    desc: 'Ontvang je sleutels en begin je studentenleven in een kwalitatief, volledig gemeubeld kot.',
  },
];


export default async function OverOnsPage() {
  const vestigingen = await getVestigingen();
  return (
    <>
      <JsonLd data={aboutJsonLd} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/80 uppercase tracking-widest mb-6">
            Studentenhuisvesting · Leuven
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Kwalitatief wonen,<br />
            <span className="text-secondary-300">zonder gedoe.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed">
            Mijn-Kot biedt gemeubelde studentenkamers en studio's in Leuven. Met het officiële KU Leuven Kotlabel,
            gecertificeerde brandveiligheid en direct contact met de eigenaar, transparant en eerlijk.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/koten"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors"
            >
              Bekijk beschikbare kamers
            </Link>
            <Link
              href="/afspraken"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold transition-colors"
            >
              <CalendarDaysIcon className="w-5 h-5" />
              Gratis bezichtiging plannen
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-surface-card border-b border-border-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-center">
            {[
              { value: '4', label: 'Gebouwen in Leuven' },
              { value: 'KU Leuven', label: 'Kotlabel gecertificeerd' },
              { value: '100%', label: 'Brandveilig gecertificeerd' },
              { value: '€0', label: 'Bemiddelingskosten' },
            ].map(({ value, label }) => (
              <div key={label}>
                <dt className="font-display text-3xl font-bold text-primary-700">{value}</dt>
                <dd className="mt-1 text-sm text-neutral-500">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Ons verhaal */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3 block">Ons verhaal</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-5 leading-tight">
              Studentenhuisvesting met een menselijk gezicht
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                Mijn-Kot verhuurt kwalitatieve studentenkamers en studio's in Leuven. We beheren
                vier gebouwen op toplocaties, zowel in het bruisende stadscentrum als in het rustige Heverlee.
              </p>
              <p>
                Wat ons onderscheidt? Wij zijn geen bemiddelingskantoor. Je huurt rechtstreeks bij de
                eigenaar. Snel, eerlijk en zonder verborgen kosten. Al onze kamers zijn gemeubeld,
                brandveilig gecertificeerd en dragen het officiële <strong className="text-primary-800">KU Leuven Kotlabel</strong>.
              </p>
              <p>
                We werken nauw samen met de Kotendienst van KU Leuven en zorgen voor professioneel
                onderhoud via een eigen klusjesman. Als er iets is, lossen we het op.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-50 rounded-2xl p-6 flex flex-col gap-2">
              <AcademicCapIcon className="w-8 h-8 text-primary-600" />
              <p className="font-semibold text-primary-900 text-sm">KU Leuven Kotlabel</p>
              <p className="text-xs text-neutral-500">Officieel kwaliteitslabel voor comfort en veiligheid</p>
            </div>
            <div className="bg-accent-50 rounded-2xl p-6 flex flex-col gap-2">
              <ShieldCheckIcon className="w-8 h-8 text-accent-600" />
              <p className="font-semibold text-primary-900 text-sm">Brandveiligheid</p>
              <p className="text-xs text-neutral-500">Gecertificeerd door brandweer Leuven</p>
            </div>
            <div className="bg-secondary-50 rounded-2xl p-6 flex flex-col gap-2">
              <HomeModernIcon className="w-8 h-8 text-secondary-600" />
              <p className="font-semibold text-primary-900 text-sm">Gemeubeld</p>
              <p className="text-xs text-neutral-500">Kamers van 12–31 m², studio's tot 50 m²</p>
            </div>
            <div className="bg-primary-50 rounded-2xl p-6 flex flex-col gap-2">
              <WrenchScrewdriverIcon className="w-8 h-8 text-primary-600" />
              <p className="font-semibold text-primary-900 text-sm">Eigen onderhoud</p>
              <p className="text-xs text-neutral-500">Snelle opvolging bij technische problemen</p>
            </div>
          </div>
        </div>
      </section>

      {/* Waarden */}
      <section className="bg-surface-main border-y border-border-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3 block">Waarom Mijn-Kot</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900">
              Onze beloftes aan jou
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-surface-card rounded-2xl p-6 border border-border-light hover:border-primary-200 hover:shadow-soft transition-all">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aanbod */}
      <section className="bg-[#f3ede6] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3 block">Kotaanbod</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900">
              Voor elke student de juiste kamer
            </h2>
            <p className="mt-3 text-neutral-500 max-w-xl mx-auto">
              Van compacte studeerruimtes tot ruime studio&apos;s met terras. Wij hebben iets voor elke student en elk budget.
            </p>
          </div>
          <div className="divide-y divide-[#dfd8cd]">
            {[
              { Icon: HomeModernIcon, title: 'Studentenkamers', size: '12–31 m²', desc: 'Individuele kamers, al dan niet met privébadkamer of kitchenette.' },
              { Icon: ArrowsUpDownIcon, title: 'Duplex kamers', size: '25–40 m²', desc: 'Meerniveaukamers voor wie meer ruimte en privacy wil.' },
              { Icon: HomeIcon, title: "Studio's", size: '30–50 m²', desc: "Volledig zelfstandige studio's met eigen keuken en badkamer." },
              { Icon: SunIcon, title: "Studio's met terras", size: '35–50 m²', desc: 'Ruime studio met buitenruimte, ideaal voor zonnige dagen.' },
              { Icon: UserGroupIcon, title: 'Dubbele kamers', size: '30–45 m²', desc: 'Voor twee studenten of koppels die samen willen wonen.' },
            ].map(({ Icon, title, size, desc }) => (
              <div key={title} className="flex items-center gap-5 py-5 group">
                <div className="flex-shrink-0 w-11 h-11 bg-primary-500 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-primary-900">{title}</h3>
                  <p className="text-sm text-neutral-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <div className="flex-shrink-0 pl-4 text-right">
                  <span className="text-base font-bold text-primary-500 tabular-nums">{size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hoe werkt het */}
      <section className="bg-primary-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary-400 mb-3 block">Stappenplan</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Van zoeken naar intrekken in 4 stappen
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ number, title, desc }) => (
              <div key={number} className="relative">
                <div className="text-5xl font-display font-bold text-white/10 mb-3">{number}</div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/afspraken"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors"
            >
              <CalendarDaysIcon className="w-5 h-5" />
              Plan nu een gratis bezichtiging
            </Link>
            <p className="mt-3 text-xs text-white/40">Gratis · Vrijblijvend · Direct bevestiging</p>
          </div>
        </div>
      </section>

      {/* Onze locaties */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3 block">Locaties</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900">
            Onze gebouwen in Leuven
          </h2>
          <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
            Vier gebouwen op toplocaties, centraal in de stad en rustig in Heverlee, altijd dicht bij KU Leuven.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {vestigingen.map((v) => (
            <Link
              key={v.id}
              href={`/vestigingen/${v.id}`}
              className="group relative h-64 rounded-2xl overflow-hidden block"
            >
              {/* Background image */}
              {v.image_url ? (
                <Image
                  src={v.image_url}
                  alt={v.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-primary-100" />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display font-bold text-white text-lg leading-tight">{v.name}</h3>
                    <p className="text-white/70 text-sm flex items-center gap-1 mt-0.5">
                      <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                      {v.city}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-white bg-white/20 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full group-hover:bg-accent-500 group-hover:border-accent-500 transition-colors">
                    Bekijk →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/vestigingen"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border-mid text-primary-700 hover:bg-primary-50 rounded-xl text-sm font-medium transition-colors"
          >
            Bekijk alle locaties en beschikbare kamers →
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-surface-main border-t border-border-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-surface-card border border-border-light rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-900 mb-2">
                Vragen? We helpen je graag.
              </h2>
              <p className="text-neutral-700 max-w-lg">
                Stuur een e-mail naar Dominique of plan meteen een bezichtiging. We antwoorden snel en persoonlijk.
              </p>
              <a
                href="mailto:dominique@mijn-kot.be"
                className="inline-flex items-center gap-2 mt-4 text-primary-600 hover:text-primary-800 font-medium transition-colors"
              >
                <EnvelopeIcon className="w-5 h-5" />
                dominique@mijn-kot.be
              </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-border-mid text-primary-700 hover:bg-primary-50 rounded-xl text-sm font-semibold transition-colors"
              >
                Contactformulier
              </Link>
              <Link
                href="/afspraken"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <CalendarDaysIcon className="w-4 h-4" />
                Bezichtiging plannen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
