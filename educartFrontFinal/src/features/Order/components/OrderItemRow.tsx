import React from "react";
import { Avatar, Chip } from "@heroui/react";
import { FaBoxOpen } from "react-icons/fa6";

interface OrderItemRowProps {
    item: {
        quantity: number;
        price: number;
        product: {
            name: string;
            imageUrl: string;
        };
    };
}

export const OrderItemRow: React.FC<OrderItemRowProps> = ({ item }) => {
    const totalItem = item.price * item.quantity;

    return (
        <div className="flex items-center justify-between p-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl group">
            {/* Sección Izquierda: Imagen y Datos */}
            <div className="flex items-center gap-4 overflow-hidden">
                <Avatar
                    src={item.product.imageUrl}
                    showFallback
                    fallback={<FaBoxOpen className="text-white text-lg" />}
                    radius="lg"
                    size="lg"
                    classNames={{
                        base: "bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md shrink-0",
                        icon: "text-white",
                    }}
                />

                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate pr-2">
                        {item.product.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                        <Chip size="sm" variant="flat" color="primary" className="h-5 text-xs px-1">
                            Cant: {item.quantity}
                        </Chip>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            x ${item.price.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Sección Derecha: Precio Total */}
            <div className="pl-4 text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                    ${totalItem.toFixed(2)}
                </p>
            </div>
        </div>
    );
};