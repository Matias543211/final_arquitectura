import {
  FiBook,
  FiBookOpen,
  FiHome,
  FiLogIn,
  FiSettings,
  FiShoppingCart,
} from "react-icons/fi";
import { Link } from "react-router";
import { useAuth } from "../../features/Auth/hooks/useAuth";
import { Avatar, Badge, Button, Popover, PopoverContent, PopoverTrigger, Tooltip } from "@heroui/react";
import { UserMenu } from "./UserMenu";
import { useCart } from "@/features/Cart/hooks/useCart";

export const Header = () => {

  const { user } = useAuth();
  const { items } = useCart();


  return (
    <header className="bg-gradient-to-r from-indigo-300 to-purple-300 px-6 py-4 flex justify-between items-center shadow-lg">
      <Link
        to="/"
        className="flex items-center gap-2 text-white font-bold text-xl"
      >
        <FiBook /> EduCart
        {
          user?.role === 'ADMIN' && (
            <p className="text-sm font-normal text-amber-500 border-2 border-amber-500 px-1">{user.role}</p>
          )
        }
      </Link>
      <nav className="flex justify-between items-center gap-1">
        {/* <ul className="flex gap-6 items-center">
              <li><a href="/" className="flex items-center gap-1 text-white hover:bg-white/10 rounded px-2 py-1"><FiHome /> Home</a></li>
              <li><a href="/products" className="flex items-center gap-1 text-white hover:bg-white/10 rounded px-2 py-1"><FiBookOpen /> Products</a></li>
              <li className="relative">
                <a href="/cart" className="flex items-center gap-1 text-white hover:bg-white/10 rounded px-2 py-1">
                  <FiShoppingCart />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                      {cartCount}
                    </span>
                  )}
                </a>
              </li>
              </ul> */}
        <Link
          to="/home"
          className="flex items-center gap-1 text-white hover:bg-white/10 rounded px-3 py-3 transition"
        >
          <FiHome />
          Home
        </Link>
        <Link
          to="/products"
          className="flex items-center gap-1 text-white hover:bg-white/10 rounded px-3 py-3 transition"
        >
          <FiBookOpen />
          Productos
        </Link>
        <Link
          to="/cart"
          className="flex items-center gap-1 hover:bg-white/10 rounded px-3 py-3 transition"
        >
          <Badge content={items.length == 0 ? false : items.length} size="sm" showOutline={false} color="danger" shape="circle">

            <FiShoppingCart />
          </Badge>
        </Link>
        {
          !user ?
            <Tooltip content="Iniciar sesión">
              <Link
                to="/login"
                className="flex items-center gap-1 text-white hover:bg-white/10 rounded px-3 py-3 transition"
              >
                <FiLogIn />
              </Link>
            </Tooltip>
            :
            <UserMenu />
        }

      </nav>
    </header>
  );
};
