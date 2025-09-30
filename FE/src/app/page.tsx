"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/common";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ProductSection from "@/components/sections/ProductSection";
import ContactForm from "@/components/sections/ContactForm";
import Footer from "@/components/sections/Footer";
import { useAuth } from "@/lib/auth-context";
import { useProducts } from "@/hooks/useProducts";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const {
    products,
    getProducts,
    clearProducts,
    isLoading: productsLoading,
  } = useProducts();
  const router = useRouter();
  const hasFetchedProducts = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && !productsLoading && !hasFetchedProducts.current) {
      hasFetchedProducts.current = true;
      // Always clear products and fetch exactly 6 for home page
      clearProducts();
      getProducts(6, 1);
    }
  }, [isAuthenticated, getProducts, clearProducts, productsLoading]);

  // Reset the fetch flag when component unmounts
  useEffect(() => {
    return () => {
      hasFetchedProducts.current = false;
    };
  }, []);

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
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="products">
          {productsLoading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : (
            <ProductSection products={products} />
          )}
        </div>
        <div id="contact">
          <ContactForm />
        </div>
        <Footer />
      </div>
    </main>
  );
}
