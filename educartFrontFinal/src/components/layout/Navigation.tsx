import { NavLink } from "react-router";

const navItems = [
  { to: "/home", label: "Home" },
  { to: "/products", label: "Productos" },
  { to: "/cart", label: "Cart" },
  { to: "/login", label: "Inicio de session" },
  { to: "/settings", label: "Configuraciones" },
];

export const Navigation = () => {
  return (
    <nav className="md:hidden bg-indigo-50 text-indigo-800 px-4 py-3 flex justify-around shadow-sm">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `text-sm font-medium transition ${
              isActive ? "text-indigo-700" : "text-slate-500 hover:text-indigo-600"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
