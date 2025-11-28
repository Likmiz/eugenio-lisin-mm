import React from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

import type { Product } from '../../../types/product';

interface ProductDetailDialogProps {
    visible: boolean;
    product: Product | null;
    onHide: () => void;
    onEdit: () => void;
}

export const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
    visible,
    product,
    onHide,
    onEdit,
}) => {
    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button
                label="Cerrar"
                icon="pi pi-times"
                text
                onClick={onHide}
            />
            {product && (
                <Button
                    label="Editar"
                    icon="pi pi-pencil"
                    onClick={onEdit}
                />
            )}
        </div>
    );

    return (
        <Dialog
            header={product ? product.name : 'Detalle de producto'}
            visible={visible}
            modal
            style={{ width: '450px', maxWidth: '95vw' }}
            onHide={onHide}
            footer={footer}
        >
            {product ? (
                <div className="flex flex-column gap-3">
                    <div>
                        <span className="text-xs text-color-secondary">Descripción</span>
                        <p>{product.description}</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex flex-column">
                            <span className="text-xs text-color-secondary">Precio</span>
                            <span className="font-semibold">
                                {product.price.toLocaleString('es-ES', {
                                    style: 'currency',
                                    currency: 'EUR',
                                })}
                            </span>
                        </div>
                        <div className="flex flex-column">
                            <span className="text-xs text-color-secondary">Categoría</span>
                            <Tag value={product.categoryName} severity="info" />
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-color-secondary">No hay producto seleccionado.</p>
            )}
        </Dialog>
    );
};