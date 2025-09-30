import express from "express";
import multer from "multer";
import * as productController from "../controller/productController.js";
import verifyToken from "../Middleware/authMiddleware.js";
import upload from "../configuration/multer.js";

const productRouter = express.Router();

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

productRouter.post("/create", verifyToken, upload.single("image"), handleMulterError, productController.create);
productRouter.get("/list", verifyToken, productController.product_list);
productRouter.get("/:product_id", verifyToken, productController.get_product_by_id);
productRouter.put("/update/:product_id", verifyToken, upload.single("image"), handleMulterError, productController.update_product);
productRouter.patch("/update/:product_id", verifyToken, upload.single("image"), handleMulterError, productController.update_product);
productRouter.delete(
  "/delete/:product_id",
  verifyToken,
  productController.delete_product
);

export default productRouter;
