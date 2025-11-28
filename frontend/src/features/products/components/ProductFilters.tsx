import React from 'react';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import type { Category } from '../../../types/category';

interface ProductFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    categoryFilter: number | null;
    onCategoryFilterChange: (value: number | null) => void;
    categories: Category[];
    categoriesLoading: boolean;
    onClear: () => void;
    onCreate: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
    search,
    onSearchChange,
    categoryFilter,
    onCategoryFilterChange,
    categories,
    categoriesLoading,
    onClear,
    onCreate,
}) => {
    return (
        <div className="mb-4">
            <Card className="app-card-elevated">
                <div className="flex flex-column sm:flex-row gap-3 justify-content-between align-items-start sm:align-items-end">
                    <div className="flex flex-column gap-2 w-full sm:w-8">
                        <span className="text-sm text-color-secondary">Buscar productos</span>
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-search" />
                            <InputText
                                className="w-full"
                                placeholder="Nombre o descripción..."
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </span>
                    </div>

                    <div className="flex flex-column gap-2 w-full sm:w-4">
                        <span className="text-sm text-color-secondary">Categoría</span>
                        <Dropdown
                            className="w-full"
                            value={categoryFilter}
                            options={categories}
                            optionLabel="name"
                            optionValue="id"
                            placeholder={
                                categoriesLoading ? 'Cargando categorías...' : 'Todas las categorías'
                            }
                            loading={categoriesLoading}
                            showClear
                            onChange={(e) => onCategoryFilterChange(e.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-content-end mt-3 gap-2">
                    <Button
                        label="Limpiar"
                        text
                        icon="pi pi-filter-slash"
                        onClick={onClear}
                    />
                    <Button
                        label="Nuevo producto"
                        icon="pi pi-plus"
                        onClick={onCreate}
                    />
                </div>
            </Card>
        </div>
    );
};