import React from 'react';
import type { ReactNode } from 'react';

// Define las props para el componente Modal
interface ModalProps {
    isOpen: boolean; // Controla si el modal es visible o no
    onClose: () => void; // Función para cerrar el modal (generalmente se pasa al botón de cerrar o al backdrop)
    children: ReactNode; // Contenido del modal
    title?: string; // Título opcional
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {

    // Si el modal no está abierto, no renderiza nada
    if (!isOpen) return null;

    return (
        // 1. TELÓN DE FONDO (BACKDROP)
        // fixed: Fija el modal sobre todo el viewport (pantalla)
        // inset-0: Equivalente a top:0, right:0, bottom:0, left:0 (cubre toda la pantalla)
        // bg-black/50: Fondo negro con 50% de opacidad (oscurece la página)
        // z-50: Asegura que el modal esté por encima de cualquier otro elemento
        <div
            className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
            onClick={onClose} // Cierra el modal si se hace clic fuera de él (en el backdrop)
        >

            {/* 2. CONTENEDOR PRINCIPAL DEL MODAL */}
            <div
                // max-w-lg: Limita el ancho del modal
                // bg-white/dark: Fondo del modal (claro u oscuro)
                // rounded-lg: Bordes redondeados
                // shadow-2xl: Sombra grande para destacar
                // w-full: Asegura que use el ancho completo hasta max-w-lg
                // p-6: Padding interno
                // Animación simple de escala al abrir
                className="max-w-lg w-full bg-white dark:bg-neutral-800 rounded-lg shadow-2xl p-6 transform scale-100 transition-transform duration-300"

                // **IMPORTANTE**: Detiene la propagación del evento onClick
                // para que hacer clic dentro del modal NO lo cierre.
                onClick={(e) => e.stopPropagation()}
            >
                {/* Encabezado del Modal */}
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-neutral-700 pb-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        {/* Icono de cerrar (SVG simple) */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Contenido principal del Modal */}
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};