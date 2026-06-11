const PageHeader = ({ title, subtitle, action }) => (
  <div className="mb-6 flex items-end justify-between gap-4">
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;
