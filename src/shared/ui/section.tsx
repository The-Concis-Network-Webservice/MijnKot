import { ReactNode } from "react";

export function Section({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="font-display text-3xl font-bold text-text-main">
            {title}
          </h2>
          {description ? (
            <p className="text-text-muted mt-2 max-w-2xl">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

