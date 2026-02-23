import React, { useState } from "react";
import {
    Button,
    Chip,
    Image,
    Skeleton,
    Card,
    CardBody,
    Divider,
    Breadcrumbs,
    BreadcrumbItem
} from "@heroui/react";
import { useParams, useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "@/features/Cart/hooks/useCart";
import {
    FaArrowLeft,
    FaCartPlus,
    FaMinus,
    FaPlus,
    FaStar,
    FaBoxOpen
} from "react-icons/fa6";

const DEFAULT_STOCK_MOCK = 10;

export const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();

    const productId = Number(id);
    const { data: product, isLoading, isError } = useProduct(productId);
    const [quantity, setQuantity] = useState(1);

    const currentStock = (product as any)?.stock ?? DEFAULT_STOCK_MOCK;

    if (isLoading) return (
        <div className="container mx-auto px-4 py-8 max-w-6xl h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <Skeleton className="rounded-xl h-[500px]" />
                <div className="space-y-4 py-8">
                    <Skeleton className="w-1/3 h-6 rounded-lg" />
                    <Skeleton className="w-3/4 h-12 rounded-lg" />
                    <Skeleton className="w-1/4 h-10 rounded-lg" />
                    <div className="space-y-2 pt-4">
                        <Skeleton className="w-full h-4 rounded-lg" />
                        <Skeleton className="w-full h-4 rounded-lg" />
                        <Skeleton className="w-2/3 h-4 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (isError || !product) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <FaBoxOpen className="text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Producto no encontrado</h2>
            <Button
                variant="light"
                color="primary"
                className="mt-4"
                onPress={() => navigate("/products")}
                startContent={<FaArrowLeft />}
            >
                Volver al catálogo
            </Button>
        </div>
    );

    const isOutOfStock = currentStock === 0;
    const isLowStock = currentStock > 0 && currentStock <= 5;

    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => {
            const newVal = prev + delta;
            if (newVal < 1) return 1;
            if (newVal > currentStock) return currentStock;
            return newVal;
        });
    };

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        addItem(product, quantity);
    };

    return (
        <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl bg-gray-50 dark:bg-neutral-900 min-h-screen">

            {/* Breadcrumbs de Navegación */}
            <div className="mb-6">
                <Breadcrumbs size="lg">
                    <BreadcrumbItem onPress={() => navigate("/home")}>Inicio</BreadcrumbItem>
                    <BreadcrumbItem onPress={() => navigate("/products")}>Productos</BreadcrumbItem>
                    <BreadcrumbItem>{product.category}</BreadcrumbItem>
                    <BreadcrumbItem color="primary">{product.name}</BreadcrumbItem>
                </Breadcrumbs>
            </div>

            <Card className="shadow-medium border-none bg-white dark:bg-neutral-800">
                <CardBody className="p-0 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                        {/* Columna Izquierda: Imagen Grande */}
                        <div className="p-8 bg-gray-50 dark:bg-neutral-900/50 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-neutral-700">
                            <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={product.name}
                                className="w-full object-contain h-auto max-h-[500px]"
                                src={product.imageUrl || "https://placehold.co/600x600?text=No+Image"}
                            />
                        </div>

                        {/* Columna Derecha: Información */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center h-full">

                            <div className="flex justify-between items-start mb-4">
                                <Chip color="primary" variant="flat" size="sm" className="uppercase font-bold">
                                    {product.category}
                                </Chip>
                                <div className="flex items-center gap-1 text-warning-500 font-bold">
                                    <FaStar />
                                    <span>{product.rating}</span>
                                    <span className="text-gray-400 font-normal text-sm">/ 5</span>
                                </div>
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                                {product.name}
                            </h1>

                            <p className="text-3xl font-bold text-primary-600 mb-6">
                                ${product.price.toFixed(2)}
                            </p>

                            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                                {product.description}
                            </p>

                            <Divider className="my-6" />

                            {/* Sección de Compra */}
                            <div className="space-y-6">

                                {/* Estado del Stock */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-500">Disponibilidad:</span>
                                    {isOutOfStock ? (
                                        <Chip color="danger" variant="flat">Agotado</Chip>
                                    ) : isLowStock ? (
                                        <Chip color="warning" variant="flat">¡Solo quedan {currentStock}!</Chip>
                                    ) : (
                                        <Chip color="success" variant="flat">En Stock ({currentStock})</Chip>
                                    )}
                                </div>

                                {/* Controles */}
                                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                                    {/* Selector de Cantidad */}
                                    <div className="flex items-center bg-gray-100 dark:bg-neutral-700 rounded-xl px-2 border border-transparent hover:border-gray-300 dark:hover:border-neutral-500 transition-colors">
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            onPress={() => handleQuantityChange(-1)}
                                            isDisabled={quantity <= 1 || isOutOfStock}
                                            radius="full"
                                            size="sm"
                                        >
                                            <FaMinus className="text-gray-600 dark:text-gray-300" />
                                        </Button>

                                        <span className="w-12 text-center font-bold text-lg text-gray-900 dark:text-white">
                                            {quantity}
                                        </span>

                                        <Button
                                            isIconOnly
                                            variant="light"
                                            onPress={() => handleQuantityChange(1)}
                                            isDisabled={quantity >= currentStock || isOutOfStock}
                                            radius="full"
                                            size="sm"
                                        >
                                            <FaPlus className="text-gray-600 dark:text-gray-300" />
                                        </Button>
                                    </div>

                                    {/* Botón Principal */}
                                    <Button
                                        color="primary"
                                        size="lg"
                                        className="flex-1 font-bold shadow-lg shadow-indigo-500/20"
                                        onPress={handleAddToCart}
                                        isDisabled={isOutOfStock}
                                        startContent={!isOutOfStock && <FaCartPlus className="text-xl" />}
                                    >
                                        {isOutOfStock ? "No Disponible" : "Agregar al Carrito"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </main>
    );
};