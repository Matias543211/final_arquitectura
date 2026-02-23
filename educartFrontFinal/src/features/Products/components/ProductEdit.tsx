import React from 'react';
import { useForm } from '@tanstack/react-form';
import type { IProduct } from '../types/Product';
import { useUpdateProduct } from '../hooks/useUpdateProduct';
import { useCategories } from '../hooks/useCategory';

type ProductEditForm = {
    name: string;
    price: number;
    category: string;
};

interface ProductEditProps {
    product: IProduct;
    onClose: () => void;
    onSave: (updatedProduct: IProduct) => void;
}


export const ProductEdit = ({ product, onClose, onSave }: ProductEditProps) => {

    const updateProductMutation = useUpdateProduct();
    const { data: categories } = useCategories();

    const form = useForm({
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            rating: product.rating,
            image_url: product.imageUrl || '',
            category: product.category,
        },


        validators: {
            onSubmit: (values) => {
                const errors: Partial<Record<keyof ProductEditForm, string[]>> = {};

                if (values.value.name.length < 3) {
                    errors.name = ['El nombre debe tener al menos 3 caracteres.'];
                }

                if (values.value.price <= 0 || isNaN(values.value.price)) {
                    errors.price = ['El precio debe ser un número positivo.'];
                }

                if (values.value.category.length === 0 || values.value.category === "Seleccione una...") {
                    errors.category = ['Debe seleccionar una categoría.'];
                }

                return Object.keys(errors).length > 0 ? errors : undefined;
            },
            onSubmitAsync: async ({ value }) => {
                try {
                    await updateProductMutation.mutateAsync({
                        id: product.id,
                        ...value
                    });

                    const updatedProduct = {
                        id: product.id,
                        name: (value as any).name,
                        description: (value as any).description,
                        price: (value as any).price,
                        rating: (value as any).rating,
                        imageUrl: (value as any).image_url ?? (value as any).imageUrl ?? '',
                        category: (value as any).category,
                    } as IProduct;

                    onSave(updatedProduct);
                    onClose();

                } catch (error) {

                    console.error("Falló el guardado del formulario:", error);
                }
            },
        },

    });


    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-4 overflow-auto p-4 max-h-[70vh]"
        >

            <form.Field
                name="name"
                children={(field) => (
                    <div>
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nombre del Producto
                        </label>
                        <input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white p-2"
                            required
                        />
                        {field.state.meta.errors ? (
                            <em className="text-red-500 text-xs mt-1 block">{field.state.meta.errors.join(', ')}</em>
                        ) : null}
                    </div>
                )}
            />


            <form.Field
                name="description"
                children={(field) => (
                    <div>
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Descripción
                        </label>
                        <textarea
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white p-2"
                            required
                        />
                        {field.state.meta.errors ? (
                            <em className="text-red-500 text-xs mt-1 block">{field.state.meta.errors.join(', ')}</em>
                        ) : null}
                    </div>
                )}
            />

            <form.Field
                name="rating"
                children={(field) => (
                    <div>
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Rating
                        </label>
                        <input
                            id={field.name}
                            name={field.name}
                            type="number"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                            step="0.1"
                            min="0"
                            max="5"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white p-2"
                            required
                        />
                        {field.state.meta.errors ? (
                            <em className="text-red-500 text-xs mt-1 block">{field.state.meta.errors.join(', ')}</em>
                        ) : null}
                    </div>
                )}
            />

            <form.Field
                name="image_url"
                children={(field) => (
                    <div>
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            URL de la Imagen
                        </label>
                        <input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white p-2"
                            required
                        />
                        {field.state.meta.errors ? (
                            <em className="text-red-500 text-xs mt-1 block">{field.state.meta.errors.join(', ')}</em>
                        ) : null}
                    </div>
                )}
            />

            <form.Field
                name="price"
                children={(field) => (
                    <div>
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Precio
                        </label>
                        <input
                            id={field.name}
                            name={field.name}
                            type="number"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            // Convertimos el valor a float al cambiar el campo
                            onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                            step="0.01"
                            min="0"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white p-2"
                            required
                        />
                        {field.state.meta.errors ? (
                            <em className="text-red-500 text-xs mt-1 block">{field.state.meta.errors.join(', ')}</em>
                        ) : null}
                    </div>
                )}
            />

            <form.Field
                name="category"
                children={(field) => (
                    <div>
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Categoría
                        </label>
                        <select
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white p-2"
                            required
                        >

                            {categories?.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {field.state.meta.errors ? (
                            <em className="text-red-500 text-xs mt-1 block">{field.state.meta.errors.join(', ')}</em>
                        ) : null}
                    </div>
                )}
            />

            <div className="pt-4 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-neutral-600 dark:text-gray-200 dark:hover:bg-neutral-500 transition-colors"
                    disabled={form.state.isSubmitting}
                >
                    Cancelar
                </button>

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <button
                            type="submit"
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${isSubmitting || !canSubmit
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    )}
                />
            </div>
        </form>
    );
};