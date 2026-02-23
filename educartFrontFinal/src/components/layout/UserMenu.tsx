// src/components/layout/Header/UserMenu.tsx
import React from 'react';
import { Link } from 'react-router'; // Asumiendo React Router
import { useAuth } from '@/features/Auth/hooks/useAuth';
import { useTheme } from '@/features/Settings/hooks/useTheme';
import { Button } from '@heroui/button';
import { Avatar, Badge, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { FaBoxesStacked } from 'react-icons/fa6';

// Iconos (puedes usar lucide-react, heroicons, o SVGs como aquí)
const UserIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
const OrderIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>;
const DashboardIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>;
const LogoutIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;

export const UserMenu = ({ onClose }: { onClose?: () => void }) => {
    const [currentTheme, setCurrentTheme] = useTheme();
    const { user, logoutUser } = useAuth(); // Asumo que 'user' trae datos como name, email, role

    // Helper para cerrar el popover al hacer click en un link
    const handleLinkClick = () => {
        if (onClose) onClose();
    };

    return (

        <Popover placement="bottom" >
            <PopoverTrigger>
                <button>
                    <Avatar isBordered color='secondary' className='text-neutral-50 bg-neutral-700 ml-2' size="sm" radius="full" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 rounded-2xl">
                <div className="w-full rounded-2xl flex flex-col bg-white dark:bg-neutral-800">

                    {/* 1. Cabecera con info del usuario */}
                    <div className="px-4 py-3 rounded-t-2xl border-b border-gray-100 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user?.name || "Usuario"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email || "usuario@educart.com"}
                        </p>
                    </div>

                    {/* 2. Navegación Principal */}
                    <div className="py-1">
                        {/* Solo mostrar Dashboard si es ADMIN  */}
                        {user?.role === 'ADMIN' && (
                            <Link
                                to="/admin/dashboard"
                                onClick={handleLinkClick}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <DashboardIcon /> Admin Dashboard
                            </Link>
                        )}

                        <Link
                            to="/profile"
                            onClick={handleLinkClick}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <UserIcon /> Mi Perfil
                        </Link>

                        {/* Enlace a "Mis Órdenes" (Requisito RF-AUTH-03) [cite: 195] */}
                        <Link
                            to="/my-orders"
                            onClick={handleLinkClick}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <OrderIcon /> Mis Compras
                        </Link>
                        {user?.role === 'admin' && (
                            <>
                                <Link
                                    to="/admin/dashboard"
                                    className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                                >
                                    <DashboardIcon /> Panel Admin
                                </Link>
                                <Link
                                    to="/admin/inventory"
                                    onClick={handleLinkClick}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                                >
                                    <FaBoxesStacked className="w-4 h-4 mr-2" /> Inventario
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-neutral-700 my-1"></div>

                    {/* 3. Selector de Tema (Estilo Segmented Control) */}
                    <div className="px-4 py-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Apariencia</p>
                        <div className="flex bg-gray-100 dark:bg-neutral-900 p-1 rounded-lg">
                            {['light', 'system', 'dark'].map((theme) => (
                                <button
                                    key={theme}
                                    onClick={() => setCurrentTheme(theme as "light" | "dark" | "system")}
                                    className={`flex-1 text-xs py-1.5 rounded-md capitalize font-medium transition-all ${currentTheme === theme
                                        ? 'bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {theme === 'system' ? 'Auto' : theme === 'light' ? '☀' : '☾'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-neutral-700 my-1"></div>

                    {/* 4. Logout */}
                    <div className="p-2 text-center">
                        <Button
                            onPress={logoutUser}
                            variant="light"
                            color="danger"
                        >
                            <LogoutIcon /> Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>


    );
};