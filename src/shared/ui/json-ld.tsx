export function JsonLd({ data }: { data: Record<string, any> }) {
    // Escape </script> sequences to prevent script tag breakout in user-supplied strings
    const json = JSON.stringify(data).replace(/<\/script>/gi, '<\\/script>');
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: json }}
        />
    );
}
