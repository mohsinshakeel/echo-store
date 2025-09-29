import api from './api';

export interface Product {
  id: string;
  title: string;
  price: string;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductData {
  title: string;
  price: string;
  image_url: string;
}

export interface UpdateProductData {
  title?: string;
  price?: string;
  image_url?: string;
}

export const productService = {

  createProduct: async (data: CreateProductData): Promise<Product> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('price', data.price);
    formData.append('image_url', data.image_url);
    
    const response = await api.post('/product/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/product/${id}`);
    return response.data;
  },

  getProducts: async (limit?: number, page?: number): Promise<{ products: Product[]; totalPages: number; currentPage: number; totalProducts: number }> => {
    const params: any = {};
    if (limit) params.limit = limit;
    if (page) params.page = page;
    
    const response = await api.get('/product/list', { params });
    
    const transformedProducts = response.data.products.map((product: any) => ({
      id: product.product_id,
      title: product.title.replace(/"/g, ''),
      price: product.price.replace(/"/g, ''),
      image_url: product.image_url,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    }));

    const totalProducts = response.data.totalProduct || transformedProducts.length;
    const totalPages = response.data.totalPages || (limit ? Math.ceil(totalProducts / limit) : 1);
    const currentPage = response.data.page || page || 1;

    return {
      products: transformedProducts,
      totalPages,
      currentPage,
      totalProducts
    };
  },

  updateProduct: async (id: string, data: UpdateProductData): Promise<Product> => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.price) formData.append('price', data.price);
    if (data.image_url) formData.append('image_url', data.image_url);
    
    const response = await api.put(`/product/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/product/delete/${id}`);
  },
};
