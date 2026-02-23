import React from "react";
import { Modal, ModalContent, ModalHeader } from "@heroui/react";
import { ProductForm } from "./ProductForm";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingProduct: any | null;
    onSubmit: (data: any) => Promise<void>;
    isLoading: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
    isOpen,
    onClose,
    editingProduct,
    onSubmit,
    isLoading,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
            backdrop="blur"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                        </ModalHeader>
                        {/* Renderizamos el formulario aislado */}
                        <ProductForm
                            initialData={editingProduct}
                            onSubmit={onSubmit}
                            onCancel={onClose}
                            isLoading={isLoading}
                        />
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};