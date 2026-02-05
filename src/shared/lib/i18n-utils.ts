export function getLocalizedData<T>(obj: T, field: string, locale: string): string {
    if (!obj) return '';

    // If locale is 'en', try to find field_en
    if (locale === 'en') {
        const enField = `${field}_en` as keyof T;
        const val = obj[enField];
        if (typeof val === 'string' && val.trim().length > 0) {
            return val;
        }
    }

    // Fallback to original field (default 'nl')
    const val = obj[field as keyof T];
    return typeof val === 'string' ? val : '';
}
