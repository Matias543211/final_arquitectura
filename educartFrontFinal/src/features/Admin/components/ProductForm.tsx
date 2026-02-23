import React, { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
    Input,
    Button,
    Select,
    SelectItem,
    Textarea,
    ModalFooter,
    ModalBody
} from "@heroui/react";
import { useCategories } from "../../Products/hooks/useCategory";

// 1. Esquema de Validación con Zod (Se mantiene igual)
const productSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    description: z.string().min(10, "La descripción es muy corta"),
    price: z.number().min(0.01, "El precio debe ser mayor a 0"),
    sku: z.string().min(3, "SKU requerido"),
    stock_current: z.number().int().min(0, "El stock no puede ser negativo"),
    stock_min: z.number().int().min(1, "El stock mínimo debe ser al menos 1"),
    category_id: z.string().min(1, "Selecciona una categoría"),
    image_url: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialData?: any;
    onSubmit: (data: ProductFormValues) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData, onSubmit, onCancel, isLoading
}) => {
    const { data: categories = [] } = useCategories();

    const getInitialCategoryId = () => {
        if (!initialData) return "";

        // Si por suerte ya viene el ID, úsalo
        if (initialData.category_id) return initialData.category_id.toString();

        // Si viene el NOMBRE ("category"), búscalo en la lista
        if (initialData.category) {
            const found = categories.find(c => c.name === initialData.category);
            return found ? found.id.toString() : "";
        }
        return "";
    };


    // 2. Helper para validar campos individuales con Zod sin usar el adaptador global
    // Esto evita el error de tipos "validatorAdapter does not exist"
    const validate = (field: keyof ProductFormValues, value: any) => {
        // Extraemos la validación específica del campo desde el esquema grande
        const fieldSchema = productSchema.shape[field];
        const result = fieldSchema.safeParse(value);
        return result.success ? undefined : result.error.errors[0].message;
    };

    // 3. Hook de TanStack Form (Sin validatorAdapter para evitar el error)
    const form = useForm({
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            price: Number(initialData?.price) || 0,
            sku: initialData?.sku || "",
            stock_current: Number(initialData?.stock_current || initialData?.stock) || 0,
            stock_min: Number(initialData?.stock_min) || 5,
            category_id: getInitialCategoryId(),
            image_url: initialData?.imageUrl || "",
        },
        onSubmit: async ({ value }) => {
            // Validamos todo el formulario antes de enviar por seguridad
            const result = productSchema.safeParse(value);
            if (result.success) {
                await onSubmit(result.data);
            } else {
                console.error(result.error);
            }
        },
    });

    useEffect(() => {
        if (initialData?.category && categories.length > 0) {
            const currentId = form.getFieldValue("category_id");
            // Si el campo está vacío pero tenemos el nombre, buscamos de nuevo
            if (!currentId) {
                const found = categories.find(c => c.name === initialData.category);
                if (found) {
                    form.setFieldValue("category_id", found.id.toString());
                }
            }
        }
    }, [categories, initialData, form]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
        >
            <ModalBody className="gap-4">
                {/* Campo Nombre */}
                <form.Field
                    name="name"
                    validators={{
                        onChange: ({ value }) => validate("name", value),
                    }}
                    children={(field) => (
                        <Input
                            label="Nombre del Producto"
                            placeholder="Ej: Tablet Educativa"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onValueChange={field.handleChange}
                            isInvalid={!!field.state.meta.errors.length}
                            errorMessage={field.state.meta.errors.join(", ")}
                            variant="bordered"
                        />
                    )}
                />

                <div className="flex gap-4">
                    <form.Field
                        name="sku"
                        validators={{
                            onChange: ({ value }) => validate("sku", value),
                        }}
                        children={(field) => (
                            <Input
                                label="SKU"
                                placeholder="TEC-001"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onValueChange={field.handleChange}
                                isInvalid={!!field.state.meta.errors.length}
                                errorMessage={field.state.meta.errors.join(", ")}
                                variant="bordered"
                                className="flex-1"
                            />
                        )}
                    />
                    <form.Field
                        name="price"
                        validators={{
                            onChange: ({ value }) => validate("price", value),
                        }}
                        children={(field) => (
                            <Input
                                label="Precio ($)"
                                type="number"
                                value={field.state.value.toString()}
                                onBlur={field.handleBlur}
                                onValueChange={(val) => field.handleChange(Number(val))}
                                isInvalid={!!field.state.meta.errors.length}
                                errorMessage={field.state.meta.errors.join(", ")}
                                variant="bordered"
                                className="flex-1"
                            />
                        )}
                    />
                </div>

                <div className="flex gap-4">
                    <form.Field
                        name="stock_current"
                        validators={{
                            onChange: ({ value }) => validate("stock_current", value),
                        }}
                        children={(field) => (
                            <Input
                                label="Stock Actual"
                                type="number"
                                color="primary"
                                value={field.state.value.toString()}
                                onValueChange={(val) => field.handleChange(Number(val))}
                                isInvalid={!!field.state.meta.errors.length}
                                errorMessage={field.state.meta.errors.join(", ")}
                                variant="flat"
                            />
                        )}
                    />
                    <form.Field
                        name="stock_min"
                        validators={{
                            onChange: ({ value }) => validate("stock_min", value),
                        }}
                        children={(field) => (
                            <Input
                                label="Stock Mínimo"
                                type="number"
                                color="warning"
                                value={field.state.value.toString()}
                                onValueChange={(val) => field.handleChange(Number(val))}
                                isInvalid={!!field.state.meta.errors.length}
                                errorMessage={field.state.meta.errors.join(", ")}
                                variant="flat"
                            />
                        )}
                    />
                </div>

                <form.Field
                    name="category_id"
                    validators={{
                        onChange: ({ value }) => validate("category_id", value),
                    }}
                    children={(field) => (
                        <Select
                            label="Categoría"
                            selectedKeys={field.state.value ? [field.state.value] : []}
                            onSelectionChange={(keys) => field.handleChange(Array.from(keys)[0] as string)}
                            isInvalid={!!field.state.meta.errors.length}
                            errorMessage={field.state.meta.errors.join(", ")}
                            variant="bordered"

                        >
                            {categories.map((cat) => (
                                <SelectItem key={cat.id.toString()} textValue={cat.name.toString()}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </Select>
                    )}
                />

                <form.Field
                    name="image_url"
                    validators={{
                        onChange: ({ value }) => validate("image_url", value),
                    }}
                    children={(field) => (
                        <Input
                            label="URL Imagen"
                            value={field.state.value || ""}
                            onValueChange={field.handleChange}
                            isInvalid={!!field.state.meta.errors.length}
                            errorMessage={field.state.meta.errors.join(", ")}
                            variant="bordered"
                        />
                    )}
                />

                <form.Field
                    name="description"
                    validators={{
                        onChange: ({ value }) => validate("description", value),
                    }}
                    children={(field) => (
                        <Textarea
                            label="Descripción"
                            value={field.state.value}
                            onValueChange={field.handleChange}
                            isInvalid={!!field.state.meta.errors.length}
                            errorMessage={field.state.meta.errors.join(", ")}
                            variant="bordered"
                        />
                    )}
                />
            </ModalBody>

            <ModalFooter>
                <Button color="danger" variant="light" onPress={onCancel}>
                    Cancelar
                </Button>
                <Button color="primary" type="submit" isLoading={isLoading}>
                    {initialData ? "Guardar Cambios" : "Crear Producto"}
                </Button>
            </ModalFooter>
        </form>
    );
};