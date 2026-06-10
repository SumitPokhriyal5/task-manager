import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { cn } from "../lib/cn";

const userNav = [{ to: "/dashboard", label: "My Tasks", icon: TaskIcon }];

const adminNav = [
  { to: "/admin", label: "Overview", icon: GridIcon, end: true },
  { to: "/admin/users", label: "Users", icon: UsersIcon },
  { to: "/admin/tasks", label: "All Tasks", icon: TaskIcon },
  { to: "/admin/logs", label: "Activity", icon: PulseIcon },
];

const NavItem = ({ to, label, icon: Icon, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
        isActive
          ? "text-primary"
          : "text-muted hover:text-ink hover:bg-slatebg",
      )
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <span
            className="absolute inset-0 rounded-xl bg-primary-soft"
            aria-hidden
          />
        )}
        <Icon className="relative h-[18px] w-[18px]" />
        <span className="relative">{label}</span>
      </>
    )}
  </NavLink>
);

const Sidebar = ({ onNavigate }) => {
  const { isAdmin } = useAuth();

  return (
    <nav className="flex h-full flex-col gap-1 p-4" onClick={onNavigate}>
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white">
          <span className="font-display text-lg font-bold">T</span>
        </div>
        <span className="font-display text-lg font-semibold tracking-tight">
          TaskFlow
        </span>
      </div>

      <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted/70">
        Workspace
      </p>
      {userNav.map((item) => (
        <NavItem key={item.to} {...item} />
      ))}

      {isAdmin && (
        <>
          <p className="px-3 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-muted/70">
            Admin
          </p>
          {adminNav.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </>
      )}
    </nav>
  );
};

function GridIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function UsersIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
function TaskIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}
function PulseIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export default Sidebar;
