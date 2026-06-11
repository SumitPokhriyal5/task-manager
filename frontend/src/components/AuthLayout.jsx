const AuthLayout = ({ children }) => (
  <div className="min-h-screen lg:grid lg:grid-cols-2">
    <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-primary p-12 text-white">
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-black/10 blur-2xl" />

      <div className="relative flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
          <span className="font-display text-lg font-bold">T</span>
        </div>
        <span className="font-display text-lg font-semibold tracking-tight">
          TaskFlow
        </span>
      </div>

      <div className="relative">
        <h1 className="font-display text-4xl font-bold leading-tight">
          Where work
          <br />
          finds its order.
        </h1>
        <p className="mt-4 max-w-sm text-white/70">
          Track your tasks, monitor your team, and keep a clear record of
          everything that happens — all in one calm workspace.
        </p>
      </div>

      <div className="relative flex gap-8 text-sm text-white/60">
        <div>
          <p className="font-display text-2xl font-semibold text-white">
            Role-based
          </p>
          <p>access control</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-white">Full</p>
          <p>activity history</p>
        </div>
      </div>
    </div>

    <div className="flex min-h-screen items-center justify-center bg-slatebg p-6 lg:min-h-0">
      <div className="w-full max-w-sm animate-fade-in">{children}</div>
    </div>
  </div>
);

export default AuthLayout;
