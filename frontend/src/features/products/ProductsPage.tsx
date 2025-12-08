import React, { useEffect, useRef, useState } from 'react';

import { Toast } from 'primereact/toast';

import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCategories } from '../categories/categoriesSlice';

import { ProductFilters } from './components/ProductFilters';
import { ProductTable } from './components/ProductTable';
import { ProductDetailDialog } from './components/ProductDetailDialog';
import { ProductFormDialog } from './ProductFormDialog';

import type { Category } from '../../types/category';
import type { Product } from '../../types/product';
import type { ProductFormValues } from './ProductFormDialog';

import { createProduct, updateProduct, deleteProduct } from '../../api/productsApi';

const mockProducts: Product[] = [
    {
        id: 1,
        name: 'Auriculares Bluetooth',
        description: 'Auriculares inalámbricos con cancelación de ruido.',
        price: 79.9,
        categoryId: 1,
        categoryName: 'Electrónica',
    },
    {
        id: 2,
        name: 'Camiseta básica',
        description: 'Camiseta de algodón orgánico.',
        price: 19.99,
        categoryId: 2,
        categoryName: 'Ropa',
    },
];

export const ProductsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const toastRef = useRef<Toast | null>(null);

    const {
        items: categories,
        loading: categoriesLoading,
        error: categoriesError,
    } = useAppSelector((state) => state.categories);

    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Loading categories during mounting
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Show a toast if there is an error loading categories
    useEffect(() => {
        if (categoriesError && toastRef.current) {
            toastRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: categoriesError,
                life: 3000,
            });
        }
    }, [categoriesError]);

    const handleRowClick = (product: Product) => {
        setSelectedProduct(product);
        setIsDetailOpen(true);
    };

    const handleCreateClick = () => {
        setSelectedProduct(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (product: Product) => {
        setSelectedProduct(product);
        setIsFormOpen(true);
    };

    const handleDeleteClick = async (product: Product) => {
        try {
            await deleteProduct(product.id);

            setProducts((prev) => prev.filter((p) => p.id !== product.id));

            toastRef.current?.show({
                severity: 'success',
                summary: 'Producto eliminado',
                detail: `El producto "${product.name}" se ha eliminado correctamente.`,
                life: 2500,
            });
        } catch (error) {
            console.error('Error al eliminar el producto:', error);

            toastRef.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se ha podido eliminar el producto. Inténtalo de nuevo.',
                life: 3000,
            });
        }
    };

    const handleSaveProduct = async (values: ProductFormValues, productId?: number) => {
        const findCategoryName = (categoryId: number): string =>
            categories.find((c) => c.id === categoryId)?.name || 'Sin categoría';

        try {
            const payload = {
                name: values.name,
                description: values.description,
                price: values.price,
                categoryId: values.categoryId,
            };

            if (productId) {
                // UPDATE (PUT)
                const updatedFromApi = await updateProduct(productId, payload);

                const normalizedUpdated: Product = {
                    ...updatedFromApi,
                    categoryName: updatedFromApi.categoryName ?? findCategoryName(updatedFromApi.categoryId),
                };

                setProducts((prev) =>
                    prev.map((p) => (p.id === productId ? normalizedUpdated : p)),
                );

                toastRef.current?.show({
                    severity: 'success',
                    summary: 'Producto actualizado',
                    detail: `El producto "${values.name}" se ha actualizado correctamente.`,
                    life: 2500,
                });
            } else {
                // CREATE (POST)
                const createdFromApi = await createProduct(payload);

                const normalizedCreated: Product = {
                    ...createdFromApi,
                    categoryName: createdFromApi.categoryName ?? findCategoryName(createdFromApi.categoryId),
                };

                setProducts((prev) => [...prev, normalizedCreated]);

                toastRef.current?.show({
                    severity: 'success',
                    summary: 'Producto creado',
                    detail: `El producto "${values.name}" se ha creado correctamente.`,
                    life: 2500,
                });
            }

            setIsFormOpen(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error('Error al guardar el producto:', error);

            toastRef.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se ha podido guardar el producto. Inténtalo de nuevo.',
                life: 3000,
            });
        }
    };

    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            !search ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            !categoryFilter || p.categoryId === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    const handleClearFilters = () => {
        setSearch('');
        setCategoryFilter(null);
    };

    const categoryOptions: Category[] = categories;

    return (
        <>
            <Toast ref={toastRef} />

            <ProductFilters
                search={search}
                onSearchChange={setSearch}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                categories={categoryOptions}
                categoriesLoading={categoriesLoading}
                onClear={handleClearFilters}
                onCreate={handleCreateClick}
            />

            <ProductTable
                products={filteredProducts}
                onRowClick={handleRowClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            <ProductDetailDialog
                visible={isDetailOpen}
                product={selectedProduct}
                onHide={() => setIsDetailOpen(false)}
                onEdit={() => {
                    setIsDetailOpen(false);
                    if (selectedProduct) {
                        setIsFormOpen(true);
                    }
                }}
            />

            <ProductFormDialog
                visible={isFormOpen}
                product={selectedProduct}
                categories={categoryOptions}
                onHide={() => {
                    setIsFormOpen(false);
                    setSelectedProduct(null);
                }}
                onSave={handleSaveProduct}
            />
        </>
    );
};