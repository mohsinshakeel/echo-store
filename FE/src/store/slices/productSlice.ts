import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  productService,
  Product,
  CreateProductData,
  UpdateProductData,
} from "../../services/productService";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  totalPages: 1,
  currentPage: 1,
  totalProducts: 0,
};

// Async thunks
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (data: CreateProductData, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(data);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to create product",
      );
    }
  },
);

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productService.getProduct(id);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to fetch product",
      );
    }
  },
);

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (
    { limit, page }: { limit?: number; page?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await productService.getProducts(limit, page);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to fetch products",
      );
    }
  },
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (
    { id, data }: { id: string; data: UpdateProductData },
    { rejectWithValue },
  ) => {
    try {
      const response = await productService.updateProduct(id, data);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to update product",
      );
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to delete product",
      );
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setCurrentProduct: (state, action: PayloadAction<Product>) => {
      state.currentProduct = action.payload;
    },
    clearProducts: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isCreating = false;
        state.products.push(action.payload);
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })

      // Get Product
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalProducts = action.payload.totalProducts;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload,
        );
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearCurrentProduct,
  setCurrentProduct,
  clearProducts,
} = productSlice.actions;
export default productSlice.reducer;
