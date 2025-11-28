import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../../types/category';
import { getCategories } from '../../api/categoriesApi';

export interface CategoriesState {
    items: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoriesState = {
    items: [],
    loading: false,
    error: null,
};

// thunk for loading categories
export const fetchCategories = createAsyncThunk<Category[], void>(
    'categories/fetchCategories',
    async (_, thunkApi) => {
        try {
            const categories = await getCategories();
            return categories;
        } catch (error: any) {
            return thunkApi.rejectWithValue(
                error?.response?.data?.message || 'Error al cargar las categorías',
            );
        }
    },
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearCategories(state) {
            state.items = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchCategories.fulfilled,
                (state, action: PayloadAction<Category[]>) => {
                    state.loading = false;
                    state.items = action.payload;
                },
            )
            .addCase(
                fetchCategories.rejected,
                (state, action: PayloadAction<any | undefined>) => {
                    state.loading = false;
                    state.error =
                        typeof action.payload === 'string'
                            ? action.payload
                            : 'Error al cargar las categorías';
                },
            );
    },
});

export const { clearCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;