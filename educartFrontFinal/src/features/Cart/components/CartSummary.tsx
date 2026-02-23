// src/features/Cart/components/CartSummary.tsx
import React from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../../Auth/hooks/useAuth";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shipping,
  tax,
  total,
}) => {
  const navigate = useNavigate();
  const { items } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (items.length === 0) return;

    navigate("/checkout");
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 sticky top-4 border border-gray-100 dark:border-neutral-700">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b pb-4 dark:border-neutral-700">
        Resumen del pedido
      </h2>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Envío estimado</span>
          <span className="font-medium">
            {shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Impuestos</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-700 pt-4 flex justify-between items-end">
          <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={items.length === 0}
        className={`w-full py-3.5 rounded-lg font-bold text-lg transition-all shadow-md
          ${items.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-neutral-700"
            : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          }`
        }
      >
        {user ? "Finalizar Compra" : "Ir a Pagar (Login requerido)"}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>o</span>
        <Link
          to="/products"
          className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Continuar comprando
        </Link>
      </div>

      <p className="mt-6 text-xs text-center text-gray-400 dark:text-neutral-500 flex justify-center items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        Checkout seguro SSL
      </p>
    </div>
  );
};