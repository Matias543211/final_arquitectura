import { Link, useNavigate } from "react-router";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider
} from "@heroui/react";
import { FaUserPlus } from "react-icons/fa6";
import { useAuth } from "../hooks/useAuth";
import { AuthForm } from "../../../components/ui/AuthForm";

export const RegisterPage = () => {
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (data: Record<string, string>) => {
    try {
      await register(data.username, data.email, data.password, data.name);
      navigate('/home');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-900 p-4 transition-colors">


      <Card className="w-full max-w-md shadow-xl border border-gray-100 dark:border-neutral-800">


        <CardHeader className="flex flex-col gap-1 items-center pb-0 pt-8">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 mb-2">
            <FaUserPlus className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Crear cuenta</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Únete a la comunidad educativa
          </p>
        </CardHeader>

        <Divider className="my-4 opacity-50" />

        <CardBody >
          <AuthForm
            onSubmit={handleRegister}
            submitLabel={loading ? "Creando..." : "Registrarse"}
            fields={[
              { name: "name", label: "Nombre completo", type: "text" },
              { name: "username", label: "Usuario", type: "text" },
              { name: "email", label: "Correo electrónico", type: "email" },
              { name: "password", label: "Contraseña", type: "password" },
            ]}
          />
        </CardBody>

        <Divider />

        <CardFooter className="justify-center py-6 bg-gray-50/50 dark:bg-neutral-800/50">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-colors"
            >
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};