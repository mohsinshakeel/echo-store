'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/common';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Heart, Star, Leaf } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index, viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        <Card className="group overflow-hidden h-32">
          <div className="flex h-full">
            <div className="relative w-40 flex-shrink-0">
              <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 relative overflow-hidden w-full h-full">
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Leaf className="w-8 h-8 text-white" />
                    </div>
                  )}
                </motion.div>
                
                {/* Eco Badge */}
                <div className="absolute top-2 left-2">
                  <motion.div
                    className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Leaf className="w-3 h-3" />
                    Eco
                  </motion.div>
                </div>

                {/* Wishlist Button */}
                <motion.button
                  className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>
            </div>

            {/* Product Info - Right Side */}
            <div className="flex-1 p-4 flex flex-col justify-center">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                  {product.title}
                </h3>

                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid view (existing layout)
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="group overflow-hidden h-full">
        <div className="relative">
          {/* Product Image */}
          <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 relative overflow-hidden h-48 w-full">
            <motion.div
              className="w-full h-full flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Leaf className="w-12 h-12 text-white" />
                </div>
              )}
            </motion.div>
            
            {/* Eco Badge */}
            <div className="absolute top-3 left-3">
              <motion.div
                className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                whileHover={{ scale: 1.1 }}
              >
                <Leaf className="w-3 h-3" />
                Eco
              </motion.div>
            </div>

            {/* Wishlist Button */}
            <motion.button
              className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </motion.button>
          </div>

          {/* Product Info */}
          <div className="p-6">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-500 ml-1">(4.8)</span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              {product.title}
            </h3>

            {/* Price and Capacity */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
