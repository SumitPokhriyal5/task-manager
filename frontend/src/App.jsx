import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";

const Placeholder = ({ label }) => (
  <div className="min-h-screen grid place-items-center">
    <div className="rounded-2xl bg-surface shadow-card p-8 text-center animate-fade-in">
      <h1 className="font-display text-xl font-semibold">{label}</h1>
      <p className="mt-1 text-muted text-sm">Coming in a later step.</p>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Placeholder label="My Tasks" />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route
          path="/admin"
          element={<Placeholder label="Admin Dashboard" />}
        />
        <Route
          path="/admin/users"
          element={<Placeholder label="User Management" />}
        />
        <Route
          path="/admin/tasks"
          element={<Placeholder label="Task Monitoring" />}
        />
        <Route
          path="/admin/logs"
          element={<Placeholder label="Activity Logs" />}
        />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
