import React from 'react';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';

import type { Product } from '../../../types/product';
import { DataTable, type DataTableRowMouseEvent } from 'primereact/datatable';

interface ProductTableProps {
    products: Product[];
    onRowClick: (product: Product) => void;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
    products,
    onRowClick,
    onEdit,
    onDelete,
}) => {
    const handleRowClickInternal = (event: DataTableRowMouseEvent) => {
        const product = event.data as Product;
        onRowClick(product);
    };

    const priceBodyTemplate = (rowData: Product) => (
        <span className="font-medium">
            {rowData.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
        </span>
    );

    const categoryBodyTemplate = (rowData: Product) => (
        <Tag value={rowData.categoryName} severity="info" className="px-2 py-1 text-xs" />
    );

    const actionsBodyTemplate = (rowData: Product) => (
        <div className="flex gap-2 justify-content-end">
            <Button
                icon="pi pi-pencil"
                rounded
                text
                severity="info"
                aria-label="Editar"
                onClick={() => onEdit(rowData)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                aria-label="Eliminar"
                onClick={() => onDelete(rowData)}
            />
        </div>
    );

    return (
        <Card className="app-card-elevated">
            <div className="flex justify-content-between align-items-center mb-3">
                <div>
                    <h2 className="text-lg m-0">Listado de productos</h2>
                    <span className="text-sm text-color-secondary">
                        {products.length} producto(s) encontrados
                    </span>
                </div>
            </div>

            <DataTable
                value={products}
                className="mt-2"
                size="small"
                stripedRows
                paginator
                rows={5}
                onRowClick={handleRowClickInternal}
                selectionMode="single"
                dataKey="id"
                emptyMessage="No hay productos."
            >
                <Column field="name" header="Nombre" sortable />
                <Column
                    field="price"
                    header="Precio"
                    body={priceBodyTemplate}
                    sortable
                    style={{ width: '8rem' }}
                />
                <Column
                    field="categoryName"
                    header="Categoría"
                    body={categoryBodyTemplate}
                    sortable
                    style={{ width: '10rem' }}
                />
                <Column
                    header="Acciones"
                    body={actionsBodyTemplate}
                    style={{ width: '7rem' }}
                />
            </DataTable>
        </Card>
    );
};