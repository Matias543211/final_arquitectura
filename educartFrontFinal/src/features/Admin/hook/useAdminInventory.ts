import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../../Products/services/productService";
import { useToast } from "../../../components/ui/ToastProvider";

export const useAdminInventory = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToast(); // <--- Usamos nuestro hook

    // 1. Crear Producto
    const createProductMutation = useMutation({
        mutationFn: productService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            // Usamos el toast de HeroUI
            addToast("Producto creado exitosamente", "success");
        },
        onError: () => addToast("Error al crear producto", "error"),
    });

    // 2. Actualizar Producto
    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            productService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            addToast("Producto actualizado correctamente", "success");
        },
        onError: () => addToast("Error al actualizar", "error"),
    });

    // 3. Eliminar Producto
    const deleteProductMutation = useMutation({
        mutationFn: productService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            addToast("Producto eliminado del inventario", "success");
        },
        onError: () => addToast("No se pudo eliminar el producto", "error"),
    });

    return {
        createProduct: createProductMutation.mutateAsync,
        updateProduct: updateProductMutation.mutateAsync,
        deleteProduct: deleteProductMutation.mutateAsync,
        isCreating: createProductMutation.isPending,
        isUpdating: updateProductMutation.isPending,
    };
};