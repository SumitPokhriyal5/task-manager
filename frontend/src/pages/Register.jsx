import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import AuthLayout from "../components/AuthLayout";
import Spinner from "../components/Spinner";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await register(form);
      navigate(user.role === "Admin" ? "/admin" : "/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-muted">
          Start organizing your work in minutes.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-ink"
            htmlFor="name"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={update}
            placeholder="Jane Cooper"
            className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm transition focus:border-primary"
            autoComplete="name"
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-ink"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={update}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm transition focus:border-primary"
            autoComplete="email"
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-ink"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={update}
            placeholder="At least 6 characters"
            className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm transition focus:border-primary"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && <Spinner />}
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary hover:text-primary-hover"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
