import React, { useState, useEffect } from "react";
import { useCart } from "../../Cart/hooks/useCart";
import { useCreateOrder } from "../hook/useOrder";
import { useNavigate } from "react-router";

/*
  ============================
  LOCALIDADES DISPONIBLES
  ============================
  Se deja comentado para uso futuro.
  Actualmente el backend acepta `locality` vacío.
*/
/*
const LOCALIDADES = [
  "Ciudad Autónoma de Buenos Aires",
  "Gran Buenos Aires (Norte)",
  "Gran Buenos Aires (Sur)",
  "Gran Buenos Aires (Oeste)",
  "Córdoba Capital",
  "Rosario",
  "Mendoza",
  "Otra"
];
*/

export const CheckoutPage: React.FC = () => {
  const { items, total, fetchCart } = useCart();
  const { mutate: createOrder, isPending, error: mutationError } =
    useCreateOrder();

  /*
    ============================
    ESTADOS DEL FORMULARIO
    ============================
  */

  // Dirección de envío (obligatoria)
  const [address, setAddress] = useState("");

  // Localidad preparada pero no usada en UI actualmente
  // const [locality, setLocality] = useState("");
  const locality = ""; // se envía vacío por defecto

  const navigate = useNavigate();

  /*
    ============================
    EFECTOS
    ============================
  */

  // Trae el carrito al entrar a la pantalla
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Si el carrito está vacío, redirige a productos
  useEffect(() => {
    if (items.length === 0) {
      navigate("/products");
    }
  }, [items, navigate]);

  /*
    ============================
    SUBMIT DEL CHECKOUT
    ============================
  */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación mínima: dirección obligatoria
    if (!address.trim()) {
      alert("Por favor completa la dirección.");
      return;
    }

    // Envío de la orden
    createOrder({
      shipping_address: address,
      locality: locality, // backend acepta vacío
    });
  };

  const errorMessage = mutationError
    ? (mutationError as any).response?.data?.detail ||
      "Error al procesar la orden"
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* ================= FORMULARIO ================= */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            📍 Datos de Envío
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/*
              ============================
              LOCALIDAD / ZONA (OCULTA)
              ============================
              Se deja comentada para futura activación.
            */}
            {/*
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Localidad / Zona
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg"
              >
                <option value="">Selecciona una opción...</option>
                {LOCALIDADES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            */}

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dirección completa
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-neutral-900 dark:text-white"
                placeholder="Calle, Número, Depto..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Error backend */}
            {errorMessage && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={isPending || items.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Procesando..." : `Pagar $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* ================= RESUMEN ================= */}
        <div className="bg-gray-50 dark:bg-neutral-900 p-6 rounded-xl border border-gray-200 dark:border-neutral-700">
          <h3 className="font-semibold text-lg mb-4 dark:text-white">
            Resumen
          </h3>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-sm"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {item.quantity} x {item.name}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg text-indigo-600 dark:text-indigo-400">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
