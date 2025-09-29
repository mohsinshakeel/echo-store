import express from "express";
import * as productController from "../controller/productController.js";
import verifyToken from "../Middleware/authMiddleware.js";
import upload from "../configuration/multer.js";

const productRouter = express.Router();

productRouter.post("/create", verifyToken, upload.single("image"), productController.create);
productRouter.get("/list", verifyToken, productController.product_list);
productRouter.get("/:product_id", verifyToken, productController.get_product_by_id);
productRouter.put("/update/:product_id", verifyToken, upload.single("image"), productController.update_product);
productRouter.patch("/update/:product_id", verifyToken, upload.single("image"), productController.update_product);
productRouter.delete(
  "/delete/:product_id",
  verifyToken,
  productController.delete_product
);

export default productRouter;
