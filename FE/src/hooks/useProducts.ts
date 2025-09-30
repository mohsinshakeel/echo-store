import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useCallback } from "react";
import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  clearError,
  clearCurrentProduct,
  setCurrentProduct,
  clearProducts,
} from "@/store/slices/productSlice";
import { Product } from "@/services/productService";

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const {
    products,
    currentProduct,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    totalPages,
    currentPage,
    totalProducts,
  } = useAppSelector((state) => state.product);

  const createNewProduct = async (data: {
    title: string;
    price: string;
    image_url: string;
  }) => {
    const result = await dispatch(createProduct(data));
    return result.type.endsWith("fulfilled");
  };

  const fetchProduct = async (id: string) => {
    const result = await dispatch(getProduct(id));
    return result.type.endsWith("fulfilled");
  };

  const fetchProducts = useCallback(
    async (limit?: number, page?: number) => {
      const result = await dispatch(getProducts({ limit, page }));
      return result.type.endsWith("fulfilled");
    },
    [dispatch],
  );

  const updateExistingProduct = async (
    id: string,
    data: { title?: string; price?: string; image_url?: string },
  ) => {
    const result = await dispatch(updateProduct({ id, data }));
    return result.type.endsWith("fulfilled");
  };

  const deleteExistingProduct = async (id: string) => {
    const result = await dispatch(deleteProduct(id));
    return result.type.endsWith("fulfilled");
  };

  const clearProductError = () => {
    dispatch(clearError());
  };

  const clearCurrent = () => {
    dispatch(clearCurrentProduct());
  };

  const setCurrent = (product: Product) => {
    dispatch(setCurrentProduct(product));
  };

  const clearAllProducts = useCallback(() => {
    dispatch(clearProducts());
  }, [dispatch]);

  return {
    products,
    currentProduct,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    totalPages,
    currentPage,
    totalProducts,
    createProduct: createNewProduct,
    getProduct: fetchProduct,
    getProducts: fetchProducts,
    updateProduct: updateExistingProduct,
    deleteProduct: deleteExistingProduct,
    clearError: clearProductError,
    clearCurrentProduct: clearCurrent,
    setCurrentProduct: setCurrent,
    clearProducts: clearAllProducts,
  };
};
