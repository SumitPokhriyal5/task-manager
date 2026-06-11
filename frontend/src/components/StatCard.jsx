import { cn } from "../lib/cn";

const accents = {
  primary: "from-primary to-primary/40",
  success: "from-success to-success/40",
  warning: "from-warning to-warning/40",
  ink: "from-ink to-ink/40",
};

const StatCard = ({
  label,
  value,
  accent = "primary",
  icon: Icon,
  iconWrap,
  loading,
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:shadow-pop">
    <div
      className={cn(
        "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
        accents[accent],
      )}
    />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted">{label}</p>
        {loading ? (
          <div className="mt-2 h-9 w-16 animate-pulse rounded-md bg-slatebg" />
        ) : (
          <p className="mt-1 font-display text-3xl font-semibold text-ink">
            {value}
          </p>
        )}
      </div>
      {Icon && (
        <div
          className={cn(
            "grid h-10 w-10 place-items-center rounded-xl",
            iconWrap,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
