import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import { FaTriangleExclamation } from "react-icons/fa6";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    productName?: string;
    isLoading: boolean;
}

export const DeleteModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    productName,
    isLoading,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-danger">
                            Confirmar Eliminación
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex items-center gap-4">
                                <div className="bg-danger-100 p-3 rounded-full text-danger">
                                    <FaTriangleExclamation className="text-2xl" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                                        ¿Estás seguro de eliminar "{productName}"?
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Esta acción no se puede deshacer y el producto desaparecerá del catálogo.
                                    </p>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                                Cancelar
                            </Button>
                            <Button color="danger" onPress={onConfirm} isLoading={isLoading}>
                                Sí, eliminar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};