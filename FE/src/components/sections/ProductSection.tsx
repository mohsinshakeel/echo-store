"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container, Button } from "@/components/common";
import ProductCard from "./ProductCard";
import { Product } from "@/types";
import { ArrowRight, Filter, Grid, List, Leaf } from "lucide-react";
import { useState } from "react";

interface ProductSectionProps {
  products: Product[];
  limit?: number;
}

const ProductSection: React.FC<ProductSectionProps> = ({ products, limit }) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<string>("all");

  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true;
    const price = parseFloat(product.price);
    if (filter === "under-30") return price < 30;
    if (filter === "30-40") return price >= 30 && price <= 40;
    if (filter === "over-40") return price > 40;
    return true;
  });

  // Apply limit if specified
  const displayProducts = limit
    ? filteredProducts.slice(0, limit)
    : filteredProducts;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our Eco-Friendly Collection
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover our range of sustainable water bottles designed for every
            lifestyle. Each product is crafted with the environment in mind.
          </p>
        </motion.div>

        {/* Filters and View Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 mb-8"
        >
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All Products" },
                { value: "under-30", label: "Under $30" },
                { value: "30-40", label: "$30 - $40" },
                { value: "over-40", label: "Over $40" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-3 py-1 rounded-full text-sm transition-all duration-300 whitespace-nowrap ${
                    filter === option.value
                      ? "bg-green-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20"
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
              Showing {displayProducts.length} of {products.length} products
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                View:
              </span>
              <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-green-500 text-white"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-green-500 text-white"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className={`grid gap-8 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {displayProducts.length > 0 ? (
            displayProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                viewMode={viewMode}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <Leaf className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p>
                  Try adjusting your filters or check back later for new
                  products.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="w-full flex justify-center items-center"
          >
            <Button
              variant="outline"
              size="lg"
              className="group flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm">View All Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-20"
        >
          {[
            { number: "10K+", label: "Bottles Sold" },
            { number: "500+", label: "Trees Saved" },
            { number: "2M+", label: "Plastic Bottles Prevented" },
            { number: "99%", label: "Customer Satisfaction" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default ProductSection;
