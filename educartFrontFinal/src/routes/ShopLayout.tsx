
import { Outlet } from "react-router";
import { Header } from "../components/layout/Header";
import { Navigation } from "../components/layout/Navigation";
import { Footer } from "../components/layout/Footer";

export const ShopLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Navigation />

            <main className="flex-1 p-4 bg-gray-50 dark:bg-neutral-900">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};