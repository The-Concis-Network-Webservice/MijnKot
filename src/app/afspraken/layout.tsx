import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Afspraak plannen',
    description: 'Plan een gratis bezichtiging van een MijnKot studentenkamer in Leuven. Kies een moment dat jou past.',
};

export default function AfsprakenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
