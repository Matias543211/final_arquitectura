import React, { createContext, useContext, useState, useCallback } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { FaCircleCheck, FaCircleXmark, FaXmark, FaInfo } from "react-icons/fa6";

// Tipos
type ToastType = "success" | "error" | "info";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextProps {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-eliminar a los 3 segundos
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* Contenedor de Toasts (Flotante) */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto animate-slide-in-right">
                        <HeroToast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

// Componente Visual usando HeroUI
const HeroToast = ({ message, type, onClose }: { message: string, type: ToastType, onClose: () => void }) => {
    const styles = {
        success: { icon: <FaCircleCheck />, color: "bg-success-50 dark:bg-success-900/20", text: "text-success-600 dark:text-success-400" },
        error: { icon: <FaCircleXmark />, color: "bg-danger-50 dark:bg-danger-900/20", text: "text-danger-600 dark:text-danger-400" },
        info: { icon: <FaInfo />, color: "bg-primary-50 dark:bg-primary-900/20", text: "text-primary-600 dark:text-primary-400" },
    };

    const style = styles[type];

    return (
        <Card className={`w-80 shadow-lg border-l-4 ${type === 'success' ? 'border-success' : type === 'error' ? 'border-danger' : 'border-primary'}`}>
            <CardBody className="flex flex-row items-center gap-3 p-3 overflow-hidden">
                {/* Icono */}
                <div className={`p-2 rounded-full ${style.color} ${style.text} text-lg`}>
                    {style.icon}
                </div>

                {/* Mensaje */}
                <p className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                    {message}
                </p>

                {/* Botón Cerrar */}
                <Button isIconOnly size="sm" variant="light" onPress={onClose} className="min-w-unit-8 w-8 h-8">
                    <FaXmark className="text-gray-400" />
                </Button>
            </CardBody>
        </Card>
    );
};

// Hook para usarlo
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast debe usarse dentro de ToastProvider");
    return context;
};