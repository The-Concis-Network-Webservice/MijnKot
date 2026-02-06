
import Link from 'next/link';

export const runtime = 'edge';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h2 className="text-3xl font-bold font-display text-primary-900 mb-4">Pagina niet gevonden</h2>
            <p className="text-surface-600 mb-8 max-w-md">
                Sorry, we konden de pagina die je zocht niet vinden. Misschien is deze verplaatst of bestaat hij niet meer.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
                Terug naar Home
            </Link>
        </div>
    );
}
