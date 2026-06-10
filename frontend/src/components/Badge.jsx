import { cn } from "../lib/cn";

const styles = {
  Completed: "bg-success-soft text-success",
  Pending: "bg-warning-soft text-warning",
  Active: "bg-success-soft text-success",
  Inactive: "bg-slatebg text-muted",
  Admin: "bg-primary-soft text-primary",
  User: "bg-slatebg text-muted",
};

const Badge = ({ children }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
      styles[children] || "bg-slatebg text-muted",
    )}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
    {children}
  </span>
);

export default Badge;
