// CartPage.tsx
import React, { useEffect } from "react";
import { Link } from "react-router";
import { CartItem } from "../components/CartItem";
import { CartSummary } from "../components/CartSummary";
import { useCart } from "../hooks/useCart";
import type { ICartItem } from "../types/Cart";
import { useAuth } from "@/features/Auth/hooks/useAuth";

export const CartPage: React.FC = () => {
  const { items, fetchCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);


  // Calcular totales (por si el backend no lo devuelve)
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + shipping + tax;

  return (
    <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50 dark:bg-neutral-900 transition-colors">
      <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-8">
        Tu carrito de compras
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
            <div className="hidden md:grid grid-cols-12 bg-gray-100 dark:bg-neutral-700 p-4 font-medium text-gray-700 dark:text-gray-200">
              <div className="col-span-5">Producto</div>
              <div className="col-span-2 text-center">Precio</div>
              <div className="col-span-3 text-center">Cantidad</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.length > 0 ? (
              items.map((item: ICartItem) => (
                <CartItem
                  key={item.productId}
                  item={{
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image_url: item.image_url,
                  }}
                />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <h3 className="text-xl font-medium mb-2">Tu carrito está vacío</h3>
                <p className="mb-4">
                  Parece que aún no has agregado nada a tu carrito
                </p>
                <Link
                  to="/products"
                  className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors"
                >
                  Buscar productos
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/3">
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={grandTotal}
          />
        </div>
      </div>
    </main>
  );
};
