import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

export function PageHeader({
  title,
  description,
  crumbs,
  actions
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 space-y-2">
      {crumbs && crumbs.length > 0 ? (
        <nav className="text-xs text-text-muted flex items-center gap-2">
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center">
              {crumb.href ? (
                <Link className="hover:text-primary" href={crumb.href}>
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
              {index < crumbs.length - 1 ? (
                <span className="mx-2">/</span>
              ) : null}
            </span>
          ))}
        </nav>
      ) : null}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-main">{title}</h1>
          {description ? (
            <p className="text-sm text-text-muted mt-1">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

