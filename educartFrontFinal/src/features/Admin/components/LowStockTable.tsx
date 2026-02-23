import React, { useMemo } from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    User, Chip, Button
} from "@heroui/react";
import { FaBoxesStacked, FaTriangleExclamation } from "react-icons/fa6";
import { Link } from "react-router";
import { IProduct } from "@/features/Products/types/Product";

interface LowStockTableProps {
    products: IProduct[];
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ products }) => {

    // Filtrar productos con problemas (Agotados o bajo stock)
    // Usamos useMemo para que no recalcule en cada render si los productos no cambian
    const alertProducts = useMemo(() => {
        return products.filter(p =>
            p.stock === 0 || p.stock <= p.stock_min
        ).slice(0, 5); // Top 5 para no saturar el dashboard
    }, [products]);

    return (
        <div className="flex flex-col gap-4">
            {/* Cabecera de la sección */}
            <div className="flex justify-between items-center px-2">
                <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                    <FaTriangleExclamation /> Alertas de Inventario
                </h3>
                <Chip size="sm" color="danger" variant="flat">
                    {alertProducts.length} Requieren Atención
                </Chip>
            </div>

            <Table aria-label="Tabla de bajo stock" removeWrapper>
                <TableHeader>
                    <TableColumn>PRODUCTO</TableColumn>
                    <TableColumn>SKU</TableColumn>
                    <TableColumn>STOCK</TableColumn>
                    <TableColumn>ESTADO</TableColumn>
                    <TableColumn>ACCIÓN</TableColumn>
                </TableHeader>
                <TableBody emptyContent="Todo el inventario está saludable.">
                    {alertProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <User
                                    avatarProps={{ radius: "lg", src: product.imageUrl, fallback: <FaBoxesStacked /> }}
                                    description={`Mínimo: ${product.stock_min}`}
                                    name={product.name}
                                >
                                    {product.name}
                                </User>
                            </TableCell>
                            <TableCell>{product.sku || "N/A"}</TableCell>
                            <TableCell>
                                <span className="font-bold text-lg">{product.stock}</span>
                            </TableCell>
                            <TableCell>
                                {product.stock === 0 ? (
                                    <Chip color="danger" variant="dot" size="sm">Agotado</Chip>
                                ) : (
                                    <Chip color="warning" variant="dot" size="sm">Bajo Stock</Chip>
                                )}
                            </TableCell>
                            <TableCell>
                                {/* Botón que lleva a la gestión de inventario */}
                                <Button
                                    as={Link}
                                    to="/admin/inventory"
                                    size="sm"
                                    color="primary"
                                    variant="light"
                                >
                                    Reponer
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};