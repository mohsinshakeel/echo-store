'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/common';
import ProductCard from '@/components/sections/ProductCard';
import { useAuth } from '@/lib/auth-context';
import { useProducts } from '@/hooks/useProducts';
import { Filter, Grid, List } from 'lucide-react';

export default function ProductsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { products, getProducts, clearProducts, isLoading: productsLoading, totalPages: reduxTotalPages, currentPage: reduxCurrentPage, totalProducts } = useProducts();
  const router = useRouter();
  const hasFetchedProducts = useRef(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && !productsLoading && !hasFetchedProducts.current) {
      hasFetchedProducts.current = true;
      clearProducts();
      getProducts(10, currentPage); // Set limit to 10 and current page
    }
  }, [isAuthenticated, productsLoading, getProducts, clearProducts, currentPage]);

  // Reset the fetch flag when component unmounts
  useEffect(() => {
    return () => {
      hasFetchedProducts.current = false;
    };
  }, []);

  // Filter products based on price
  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    const price = parseFloat(product.price);
    if (filter === 'under-30') return price < 30;
    if (filter === '30-40') return price >= 30 && price <= 40;
    if (filter === 'over-40') return price > 40;
    return true;
  });

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    hasFetchedProducts.current = false; // Reset flag to allow new fetch
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              All Products
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse our complete collection of eco-friendly water bottles. Use filters to find exactly what you're looking for.
            </p>
          </div>

          {/* Filters and View Controls */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Filters Row */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
              </div>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All Products' },
                  { value: 'under-30', label: 'Under $30' },
                  { value: '30-40', label: '$30 - $40' },
                  { value: 'over-40', label: 'Over $40' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                      filter === option.value
                        ? 'bg-green-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Count and View Controls Row */}
            <div className="flex justify-between items-center">
              {/* Products Count */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredProducts.length} of {totalProducts} products (Page {currentPage} of {reduxTotalPages})
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
                <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-green-500 text-white'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list'
                        ? 'bg-green-500 text-white'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {productsLoading ? (
              <div className="py-20 text-center">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : (
              <div className={`grid gap-8 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

          {/* Pagination */}
          {reduxTotalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-300 dark:border-gray-600'
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: reduxTotalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-green-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === reduxTotalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === reduxTotalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-300 dark:border-gray-600'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
