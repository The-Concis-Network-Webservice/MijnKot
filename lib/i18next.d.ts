export type * from '../../lib/i18n/types';

// Backward compatibility helper type if needed, but we should use standard i18next types
import 'i18next';
import { Dictionary } from './i18n/types';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: {
            translation: Dictionary;
        };
    }
}
