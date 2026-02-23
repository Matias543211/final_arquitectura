import React from 'react';
import { useForm } from '@tanstack/react-form';
import { useCreateProduct } from '../hooks/useCreateProduct'; // Ajusta la ruta
import { useCategories } from '../hooks/useCategory';

type ProductCreateForm = {
    name: string;
    price: number;
    description: string;
    rating: number;
    image_url: string;
    category_id: number;
    stock_current: 0,
    stock_min: 0
};

interface ProductCreateProps {
    onClose: () => void;
}

export const ProductCreate = ({ onClose }: ProductCreateProps) => {

    const createProductMutation = useCreateProduct();
    const { data: categories } = useCategories();

    const form = useForm({
        defaultValues: {
            name: '',
            price: 0,
            description: '',
            rating: 0,
            category_id: 0,
            image_url: ''
        } as ProductCreateForm,


        validators: {
            onSubmit: (values) => {
                const errors: Partial<Record<keyof ProductCreateForm, string[]>> = {};

                if (values.value.name.length < 3) {
                    errors.name = ['El nombre debe tener al menos 3 caracteres.'];
                }

                if (values.value.price <= 0 || isNaN(values.value.price)) {
                    errors.price = ['El precio debe ser un número positivo.'];
                }

                if (values.value.category_id === 0) {
                    errors.category_id = ['Debe seleccionar una categoría.'];
                }

                return Object.keys(errors).length > 0 ? errors : undefined;
            },
        },

        onSubmit: async ({ value }) => {

            try {

                await createProductMutation.mutateAsync({
                    ...value,
                    category_id: value.category_id,
                });

                onClose();

            } catch (error) {
                // El error ya es manejado por useMutation
                console.error("Falló la creación del producto:", error);
            }
        },
    });

    // Determina el estado de carga y envío
    const isSaving = form.state.isSubmitting || createProductMutation.isPending;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-4 overflow-auto max-h-[70vh] pa-4 px-10"
        >

            {/* 1. Campo Nombre */}
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

            {/* 2. Campo Precio */}
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
                            // Usamos el valor (que es 0 por defecto)
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
                            Calificación
                        </label>
                        <input
                            id={field.name}
                            name={field.name}
                            type="number"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                            step="1"
                            max="5"
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
                name="image_url"
                children={(field) => (
                    <div>
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            URL de la Imagen
                        </label>
                        <input
                            id={field.name}
                            name={field.name}
                            type="text"
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

            {/* 3. Campo Categoría (Select) */}
            <form.Field
                name="category_id"
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
                            onChange={(e) => field.handleChange(e.target.value ? parseInt(e.target.value, 10) : 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white p-2"
                            required
                        >
                            {categories ? (
                                <>
                                    <option value="">Seleccione una...</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </>
                            ) : null}
                        </select>
                        {field.state.meta.errors ? (
                            <em className="text-red-500 text-xs mt-1 block">{field.state.meta.errors.join(', ')}</em>
                        ) : null}
                    </div>
                )}
            />

            {/* Botones de Acción */}
            <div className="pt-4 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-neutral-600 dark:text-gray-200 dark:hover:bg-neutral-500 transition-colors"
                    disabled={isSaving}
                >
                    Cancelar
                </button>

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <button
                            type="submit"
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${isSaving || !canSubmit
                                ? 'bg-green-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'}`}
                            disabled={!canSubmit || isSaving}
                        >
                            {isSaving ? 'Creando...' : 'Crear Producto'}
                        </button>
                    )}
                />
            </div>
        </form>
    );
};