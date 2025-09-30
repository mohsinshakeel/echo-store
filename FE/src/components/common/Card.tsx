"use client";

import { motion } from "framer-motion";
import { CardProps } from "@/types";

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = true,
}) => {
  return (
    <motion.div
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700
        ${hover ? "hover:shadow-xl hover:shadow-green-500/10" : ""}
        transition-all duration-300
        ${className}
      `}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
