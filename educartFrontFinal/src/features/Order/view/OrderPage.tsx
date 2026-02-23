import React from "react";
import { useMyOrders, useUpdateOrderStatus } from "../hook/useOrder";
import { Link } from "react-router";
import {
    Accordion,
    AccordionItem,
    Chip,
    Card,
    CardBody,
    Divider,
    Button,
    Skeleton
} from "@heroui/react";
import {
    FaBagShopping,
    FaArrowLeft,
    FaTruckFast,
    FaRegCalendarDays,
    FaCircleCheck,
    FaClock,
    FaCheck
} from "react-icons/fa6";
import { OrderItemRow } from "../components/OrderItemRow";


const getStatusConfig = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
        case 'completed': return { color: "success" as const, icon: <FaCircleCheck /> };
        case 'pending': return { color: "warning" as const, icon: <FaClock /> };
        case 'cancelled': return { color: "danger" as const, icon: null };
        default: return { color: "default" as const, icon: null };
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

export const OrderPage: React.FC = () => {
    const { data: orders = [], isLoading, isError } = useMyOrders();
    const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

    if (isLoading) return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-4">
            <Skeleton className="h-12 w-1/3 rounded-lg" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
        </div>
    );

    if (isError) return <div className="p-10 text-center text-red-500">Error cargando órdenes.</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">


            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <FaBagShopping className="text-indigo-600" />
                        Mis Compras
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Historial de tus pedidos recientes
                    </p>
                </div>
                <Button
                    as={Link}
                    to="/products"
                    variant="flat"
                    color="primary"
                    startContent={<FaArrowLeft />}
                >
                    Ir a la tienda
                </Button>
            </div>

            {orders.length === 0 ? (
                <Card className="py-10 text-center bg-gray-50 dark:bg-neutral-800 border-none shadow-none">
                    <CardBody>
                        <p className="text-gray-500 mb-4">No tienes órdenes registradas.</p>
                        <Button as={Link} to="/products" color="primary">Comprar ahora</Button>
                    </CardBody>
                </Card>
            ) : (
                <Accordion variant="splitted" className="px-0">
                    {orders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);

                        return (
                            <AccordionItem
                                key={order.id}
                                aria-label={`Orden #${order.id}`}
                                classNames={{
                                    base: "group-[.is-splitted]:bg-white dark:group-[.is-splitted]:bg-neutral-800 group-[.is-splitted]:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-neutral-700",
                                    title: "font-semibold text-gray-700 dark:text-gray-200",
                                    subtitle: "text-gray-400"
                                }}
                                startContent={
                                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                                        #{order.id}
                                    </div>
                                }
                                title={
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span>Orden de Compra</span>
                                        <Chip
                                            color={statusConfig.color}
                                            variant="flat"
                                            size="sm"
                                            startContent={statusConfig.icon}
                                            className="capitalize"
                                        >
                                            {order.status}
                                        </Chip>
                                    </div>
                                }
                                subtitle={
                                    <div className="flex items-center gap-2 text-xs mt-1">
                                        <FaRegCalendarDays />
                                        {formatDate(order.orderDate)}
                                    </div>
                                }
                            >

                                <div className="pt-2 pb-4">


                                    <div className="flex items-start gap-3 p-3 mb-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-100 dark:border-neutral-800">
                                        <div className="p-2 bg-white dark:bg-neutral-800 rounded-full shadow-sm text-gray-500">
                                            <FaTruckFast />
                                        </div>
                                        <div className='flex-1'>
                                            <p className="text-xs font-bold text-gray-500 uppercase">Envío a domicilio</p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {order.shippingAddress}
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {order.locality}
                                            </p>

                                        </div>

                                        {order.status === "Completed" ? (

                                            <div className="ml-auto flex items-center gap-1 text-success font-medium text-sm border border-success-200 bg-success-50 px-3 py-1 rounded-full">
                                                <FaCheck />
                                                <span>Entregado</span>
                                            </div>
                                        ) : (

                                            <Button
                                                className="ml-auto"
                                                color="success"
                                                variant="solid"
                                                size="sm"
                                                onPress={() => updateStatus({ id: order.id, status: "Completed" })}
                                                isLoading={isUpdating}
                                                startContent={!isUpdating && <FaCheck />}
                                            >
                                                Confirmar llegada
                                            </Button>
                                        )}</div>

                                    <Divider className="my-4 opacity-50" />


                                    <div className="space-y-1">
                                        {order.items.map((item, idx) => (
                                            <OrderItemRow key={`${order.id}-${idx}`} item={item} />
                                        ))}
                                    </div>

                                    <Divider className="my-4 opacity-50" />


                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Total pagado</span>
                                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                            ${order.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            )}
        </div>
    );
};