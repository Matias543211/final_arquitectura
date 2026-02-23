import React, { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    Button,
    Input,
    ModalBody,
    ModalFooter
} from "@heroui/react";
import { FaPlus, FaMagnifyingGlass, FaTriangleExclamation } from "react-icons/fa6";
import { useProducts } from "../../Products/hooks/useProducts";
import { useAdminInventory } from "./../hook/useAdminInventory";
import { ProductForm } from "../components/ProductForm"; // El formulario con TanStack Form
import { InventoryTable } from "../components/InventoryTable"; // La tabla con TanStack Table
import { ProductModal } from "../components/ProductModal";
import { DeleteModal } from "../components/DeleteModal";

export const InventoryPage = () => {
    const { data: products = [], isLoading } = useProducts({});
    const { createProduct, updateProduct, deleteProduct, isCreating, isUpdating } = useAdminInventory();


    // --- ESTADOS UI ---
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<any | null>(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [filterText, setFilterText] = useState("");


    // --- LÓGICA DE BORRADO ---
    const confirmDelete = (product: any) => {
        // Aquí recibimos el producto completo desde la tabla (no solo ID)
        // O si recibes solo ID, busca el producto en la lista 'products'
        // Como tu tabla pasa ID en onDelete={handleDelete}, ajustamos aquí:

        // Si tu InventoryTable pasa ID:
        const productToDelete = products.find(p => p.id === product);
        setDeletingProduct(productToDelete);
    };


    const openCreateModal = () => {
        setEditingProduct(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (product: any) => {
        setEditingProduct(product);
        setIsFormModalOpen(true);
    };

    const executeDelete = async () => {
        if (!deletingProduct) return;

        setIsDeleteLoading(true);
        try {
            await deleteProduct(deletingProduct.id);
            setDeletingProduct(null); // Cierra modal automáticamente
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleteLoading(false);
        }
    };

    // Manejo de Submit (viene desde TanStack Form)
    const handleSubmit = async (values: any) => {
        // Parseo de datos numéricos seguro
        const payload = {
            ...values,
            price: Number(values.price),
            stock_current: Number(values.stock_current),
            stock_min: Number(values.stock_min),
            category_id: Number(values.category_id),
            rating: editingProduct?.rating || 0 // Mantener rating o 0
        };


        try {
            if (editingProduct) {
                await updateProduct({ id: editingProduct.id, data: payload });
            } else {
                await createProduct(payload);
            }
            setIsFormModalOpen(false);
            setEditingProduct(null);
        } catch (error) {
            console.error("Error saving product", error);
        }
    };



    const tableData = products.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku || "N/A", // Valor por defecto si falta
        price: product.price,
        stock: product.stock,
        stockMin: product.stock_min, // Aquí hacemos el puente de tipos
        category: product.category,
        imageUrl: product.imageUrl || "",
    }));

    // Filtrado sobre los datos transformados
    const filteredProducts = tableData.filter(p =>
        p.name.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-end mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Inventario</h1>
                    <p className="text-gray-500">Gestión de productos y existencias</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Input
                        placeholder="Buscar producto..."
                        startContent={<FaMagnifyingGlass className="text-gray-400" />}
                        value={filterText}
                        onValueChange={setFilterText}
                        className="w-full sm:w-64"
                    />
                    <Button color="primary" endContent={<FaPlus />} onPress={openCreateModal}>
                        Nuevo
                    </Button>
                </div>
            </div>

            {/* Tabla (TanStack Table + HeroUI) */}
            <InventoryTable
                data={filteredProducts}
                onEdit={openEditModal}
                onDelete={(id) => confirmDelete(id)}
            />

            <ProductModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                editingProduct={editingProduct}
                onSubmit={handleSubmit}
                isLoading={isCreating || isUpdating}
            />

            <DeleteModal
                isOpen={!!deletingProduct}
                onClose={() => setDeletingProduct(null)}
                onConfirm={executeDelete}
                productName={deletingProduct?.name}
                isLoading={isDeleteLoading}
            />

        </div>
    );
};