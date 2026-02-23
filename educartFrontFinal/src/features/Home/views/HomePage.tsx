import React from "react";
import { Link } from "react-router";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  CardHeader
} from "@heroui/react";
import { FaArrowRight, FaRocket, FaBookOpen, FaLaptopCode, FaPenRuler } from "react-icons/fa6";

interface Feature {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  linkText: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    id: 1,
    title: "Material de Estudio",
    description: "Libros esenciales y recursos académicos para potenciar tu aprendizaje.",
    image: "https://images.pexels.com/photos/5185074/pexels-photo-5185074.jpeg",
    link: "/products?category=libros",
    linkText: "Ver Libros",
    icon: <FaBookOpen />,
  },
  {
    id: 2,
    title: "Tecnología Educativa",
    description: "Dispositivos y gadgets diseñados para estudiantes modernos.",
    image: "https://images.pexels.com/photos/6968105/pexels-photo-6968105.jpeg",
    link: "/products?category=herramientas-tecnologicas",
    linkText: "Ver Tecnología",
    icon: <FaLaptopCode />,
  },
  {
    id: 3,
    title: "Espacio de Trabajo",
    description: "Todo lo necesario para organizar tu escritorio y papelería.",
    image: "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg",
    link: "/products?category=material-de-oficina",
    linkText: "Ver Papelería",
    icon: <FaPenRuler />,
  },
];

export const HomePage: React.FC = () => {
  return (
    <main className="flex-grow bg-gray-50 dark:bg-neutral-900 transition-colors min-h-screen">

      <section className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900 text-white py-24 px-4 overflow-hidden">

        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight animate-appearance-in">
            Tu futuro académico <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              comienza aquí
            </span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            EduCart es el marketplace inteligente que conecta a estudiantes y docentes con las mejores herramientas para el aprendizaje.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              to="/products"
              size="lg"
              className="bg-white text-indigo-600 font-bold shadow-lg hover:bg-gray-100"
              endContent={<FaArrowRight />}
            >
              Explorar Catálogo
            </Button>
            <Button
              as={Link}
              to="/register"
              size="lg"
              variant="bordered"
              className="text-white border-white hover:bg-white/10 font-semibold"
              startContent={<FaRocket />}
            >
              Unirse ahora
            </Button>
          </div>
        </div>
      </section>


      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Todo lo que necesitas
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Seleccionamos las mejores categorías para potenciar tu estudio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="py-4 border-none shadow-medium hover:scale-[1.02] transition-transform duration-300"
            >
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <div className="flex justify-between w-full items-center mb-2">
                  <p className="text-tiny uppercase font-bold text-indigo-500">Destacado</p>
                  <div className="text-indigo-600 dark:text-indigo-400 text-xl">
                    {feature.icon}
                  </div>
                </div>
                <h4 className="font-bold text-large text-gray-900 dark:text-white">{feature.title}</h4>
                <p className="text-default-500 text-sm mt-1 line-clamp-2">
                  {feature.description}
                </p>
              </CardHeader>

              <CardBody className="overflow-visible py-2 items-center">
                <Image
                  alt={feature.title}
                  className="object-cover rounded-xl w-full h-48"
                  src={feature.image}
                  width={400}
                  isZoomed
                  shadow="sm"
                />
              </CardBody>

              <CardFooter className="pt-2">
                <Button
                  as={Link}
                  to={feature.link}
                  variant="light"
                  color="primary"
                  className="w-full font-semibold"
                  endContent={<FaArrowRight className="text-sm" />}
                >
                  {feature.linkText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>


      <section className="bg-white dark:bg-neutral-800 py-16 border-t border-gray-100 dark:border-neutral-700">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-4">
              <h3 className="text-4xl font-bold text-indigo-600 mb-2">+5000</h3>
              <p className="text-gray-600 dark:text-gray-300">Productos Educativos</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-bold text-purple-600 mb-2">24h</h3>
              <p className="text-gray-600 dark:text-gray-300">Envío Rápido</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-bold text-pink-600 mb-2">100%</h3>
              <p className="text-gray-600 dark:text-gray-300">Garantía de Calidad</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};