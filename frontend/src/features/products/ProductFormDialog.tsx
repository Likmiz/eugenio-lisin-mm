import * as Yup from 'yup';

import React from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { useFormik } from 'formik';

import type { Category } from '../../types/category';
import type { Product } from '../../types/product';

export interface ProductFormValues {
    name: string;
    description: string;
    price: number;
    categoryId: number;
}

interface ProductFormDialogProps {
    visible: boolean;
    product: Product | null;
    categories: Category[];
    onHide: () => void;
    onSave: (values: ProductFormValues, productId?: number) => Promise<void> | void;
}

const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
    description: Yup.string()
        .required('La descripción es obligatoria')
        .max(500, 'Máximo 500 caracteres'),
    price: Yup.number().typeError('El precio debe ser un número').positive('Debe ser mayor que 0').required('El precio es obligatorio'),
    categoryId: Yup.number()
        .typeError('La categoría es obligatoria')
        .required('La categoría es obligatoria'),
});

export const ProductFormDialog: React.FC<ProductFormDialogProps> = (props: ProductFormDialogProps) => {
    const { visible, product, categories, onHide, onSave } = props;
    const isEdit = Boolean(product);

    const formik = useFormik<ProductFormValues>({
        initialValues: {
            name: product?.name ?? '',
            description: product?.description ?? '',
            price: product?.price ?? 0,
            categoryId: product?.categoryId ?? (categories[0]?.id ?? 0),
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await onSave(values, product?.id);
            } finally {
                setSubmitting(false);
            }
        },
    });

    React.useEffect(() => {
        if (!visible) {
            formik.resetForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    const getError = (field: keyof ProductFormValues) =>
        formik.touched[field] && formik.errors[field]
            ? (formik.errors[field] as string)
            : null;

    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button
                type="button"
                label="Cancelar"
                icon="pi pi-times"
                text
                onClick={onHide}
                disabled={formik.isSubmitting}
            />
            <Button
                type="button"
                label={isEdit ? 'Guardar cambios' : 'Crear producto'}
                icon="pi pi-check"
                onClick={() => formik.handleSubmit()}
                loading={formik.isSubmitting}
            />
        </div>
    );

    return (
        <Dialog
            header={isEdit ? 'Editar producto' : 'Crear producto'}
            visible={visible}
            modal
            style={{ width: '520px', maxWidth: '95vw' }}
            onHide={onHide}
            footer={footer}
        >
            <form className="flex flex-column gap-3" onSubmit={formik.handleSubmit}>
                {/* Nombre */}
                <div className="flex flex-column gap-1">
                    <label htmlFor="name" className="text-sm font-medium">
                        Nombre
                    </label>
                    <InputText
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={getError('name') ? 'p-invalid' : ''}
                        placeholder="Nombre del producto"
                    />
                    {getError('name') && (
                        <small className="p-error">{getError('name')}</small>
                    )}
                </div>

                {/* Descripción */}
                <div className="flex flex-column gap-1">
                    <label htmlFor="description" className="text-sm font-medium">
                        Descripción
                    </label>
                    <InputTextarea
                        id="description"
                        name="description"
                        rows={3}
                        autoResize
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={getError('description') ? 'p-invalid' : ''}
                        placeholder="Descripción breve del producto"
                    />
                    {getError('description') && (
                        <small className="p-error">{getError('description')}</small>
                    )}
                </div>

                {/* Precio */}
                <div className="flex flex-column gap-1">
                    <label htmlFor="price" className="text-sm font-medium">
                        Precio
                    </label>
                    <InputNumber
                        id="price"
                        name="price"
                        inputId="price-input"
                        value={formik.values.price}
                        onValueChange={(e) => {
                            formik.setFieldValue('price', e.value ?? 0);
                        }}
                        onBlur={() => formik.setFieldTouched('price', true)}
                        mode="currency"
                        currency="EUR"
                        locale="es-ES"
                        className={getError('price') ? 'p-invalid' : ''}
                    />
                    {getError('price') && (
                        <small className="p-error">{getError('price')}</small>
                    )}
                </div>

                {/* Categoría */}
                <div className="flex flex-column gap-1">
                    <label htmlFor="categoryId" className="text-sm font-medium">
                        Categoría
                    </label>
                    <Dropdown
                        id="categoryId"
                        name="categoryId"
                        value={formik.values.categoryId}
                        options={categories}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Selecciona una categoría"
                        onChange={(e) => formik.setFieldValue('categoryId', e.value)}
                        onBlur={() => formik.setFieldTouched('categoryId', true)}
                        className={getError('categoryId') ? 'p-invalid' : ''}
                    />
                    {getError('categoryId') && (
                        <small className="p-error">{getError('categoryId')}</small>
                    )}
                </div>
            </form>
        </Dialog>
    );
};