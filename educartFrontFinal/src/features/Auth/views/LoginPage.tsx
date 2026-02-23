// src/features/Auth/views/LoginPage.tsx
import { AuthForm } from "../../../components/ui/AuthForm";
import { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { LoadingComponent } from "../../../components/layout/LoadingComponent";

export const LoginPage = () => {

  const { login, loading, error, token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token && user) {

      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
        return;
      }

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [token, user, navigate, location]);

  const handleLogin = async (data: Record<string, string>) => {
    await login(data.username, data.password);

  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
      <AuthForm
        onSubmit={handleLogin}
        submitLabel={loading ? "Cargando..." : "Iniciar sesión"}
        fields={[
          { name: "username", label: "Nombre de usuario", type: "text" },
          { name: "password", label: "Contraseña", type: "password" },
        ]}
      />

      {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}

      <p className="mt-6 text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-indigo-600 font-medium">
          Registrate
        </Link>
      </p>
    </div>
  );
};