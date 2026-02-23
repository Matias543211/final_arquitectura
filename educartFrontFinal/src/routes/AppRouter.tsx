// src/routes/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ProductsPage } from "../features/Products/views/ProductsPage";
import { ProductDetailPage } from "../features/Products/views/ProductDetailPage";
import { CartPage } from "../features/Cart/views/CartPage";
import { LoginPage } from "../features/Auth/views/LoginPage";
import { RegisterPage } from "../features/Auth/views/RegisterPage";
import { Setting } from "../features/Settings/views/Settings";
import { HomePage } from "../features/Home/views/HomePage";
import { CheckoutPage } from "../features/Order/view/CheckoutPage";
import { ProtectedLayout } from "./ProtectedLayout";
import { ShopLayout } from "./ShopLayout";
import { OrderPage } from "@/features/Order/view/OrderPage";
import { AdminGuard } from "./AdminGuard";
import { AdminDashboard } from "@/features/Admin/views/AdminDashboard";
import { InventoryPage } from "@/features/Admin/views/InventoryPage";
import { ProfilePage } from "@/features/Auth/views/ProfilePage";

export const AppRouter = () => {
  return (
    <BrowserRouter>

      <Routes>
        {/* 1. RUTAS DE AUTENTICACIÓN (Públicas restringidas) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 2. RUTAS DE LA TIENDA (Públicas abiertas - Visitantes y Clientes) */}
        <Route element={<ShopLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        {/* 3. RUTAS PROTEGIDAS (Solo Clientes Autenticados) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-orders" element={<OrderPage />} />


          {/* RUTAS SOLO ADMIN  */}
          <Route element={<AdminGuard />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/inventory" element={<InventoryPage />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="/*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};