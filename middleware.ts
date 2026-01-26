import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Get pathname
    const pathname = request.nextUrl.pathname;

    // Static assets (images, fonts, etc.) - Long cache
    if (
        pathname.match(/\.(jpg|jpeg|png|webp|avif|gif|svg|ico|woff2?|ttf|eot)$/i)
    ) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=31536000, immutable'
        );
    }

    // JavaScript and CSS bundles - Long cache (Next.js handles versioning)
    if (pathname.match(/\/_next\/static\//)) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=31536000, immutable'
        );
    }

    // API routes - Short cache
    if (pathname.startsWith('/api/')) {
        // Public API routes (kot listings, etc.) - 5 minute cache
        if (pathname.match(/\/(koten|vestigingen|faq)/)) {
            response.headers.set(
                'Cache-Control',
                'public, s-maxage=300, stale-while-revalidate=600'
            );
        } else {
            // Other API routes - no cache
            response.headers.set(
                'Cache-Control',
                'private, no-cache, no-store, must-revalidate'
            );
        }
    }

    // HTML pages - Short cache with revalidation
    if (pathname.match(/\/koten\//)) {
        response.headers.set(
            'Cache-Control',
            'public, s-maxage=300, stale-while-revalidate=600'
        );
    }

    // Security headers
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * 1. /api routes (handled separately above)
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        '/((?!_next/|_static/|[\\w-]+\\.\\w+).*)',
    ],
};
