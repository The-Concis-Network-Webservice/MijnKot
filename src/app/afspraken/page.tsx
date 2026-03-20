import { CalendarDaysIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { SimplybookWidget } from "./_components/simplybook-widget";

export const runtime = 'edge';

export const metadata = {
    title: 'Afspraak plannen',
    description: 'Plan een gratis bezichtiging van een MijnKot studentenkamer in Leuven. Kies een moment dat jou past.',
};

export default function AfsprakenPage() {
    return (
        <div className="min-h-screen bg-surface-main">

            {/* Page header */}
            <div className="bg-secondary-100 border-b border-border-light">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent-500 mb-3">
                        Gratis &amp; vrijblijvend
                    </p>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-700 mb-3 leading-tight">
                        Plan een bezichtiging
                    </h1>
                    <p className="text-neutral-400 text-sm leading-relaxed max-w-sm mx-auto mb-7">
                        Kies een locatie en een moment dat jou past. We bevestigen je afspraak direct.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-5">
                        <span className="flex items-center gap-2 text-sm text-neutral-400">
                            <ClockIcon className="w-4 h-4 text-primary-500 shrink-0" />
                            30 minuten
                        </span>
                        <span className="flex items-center gap-2 text-sm text-neutral-400">
                            <MapPinIcon className="w-4 h-4 text-primary-500 shrink-0" />
                            Meerdere locaties in Leuven
                        </span>
                        <span className="flex items-center gap-2 text-sm text-neutral-400">
                            <CalendarDaysIcon className="w-4 h-4 text-primary-500 shrink-0" />
                            Direct bevestiging
                        </span>
                    </div>
                </div>
            </div>

            {/* Widget */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-surface-card rounded-2xl border border-border-light shadow-soft overflow-hidden p-4 md:p-6">
                    <SimplybookWidget />
                </div>

                <p className="text-center text-sm text-text-muted mt-6">
                    Liever via mail?{' '}
                    <a href="/contact" className="text-primary-600 hover:text-primary-800 font-medium underline underline-offset-2 transition-colors">
                        Stuur ons een bericht
                    </a>
                </p>
            </div>
        </div>
    );
}
