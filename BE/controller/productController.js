
import productModel from "../Model/productModel.js";
import { v4 as uuidv4 } from 'uuid';


export const create = async (req, res) => {
  try {
    const { title, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "File is required!" });
    }

    const newProductId = uuidv4();

    // Always use the current request host for image URLs
    const image_url = `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`;

    const newProduct = new productModel({
      product_id: newProductId,
      title,
      price,
      image_url,
      image_filename: req.file.filename,
      image_mimetype: req.file.mimetype,
      image_size: req.file.size,
    });

    const savedProduct = await newProduct.save();

    const responseProduct = {
      product_id: savedProduct.product_id,
      title: savedProduct.title,
      price: savedProduct.price,
      image_url: savedProduct.image_url,
      createdAt: savedProduct.createdAt,
      updatedAt: savedProduct.updatedAt
    };

    res.status(201).json(responseProduct);
  } catch (err) {
    console.error("Product creation error:", err);
    res.status(400).json({ error: err.message });
  }
};

export const product_list = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
    req.path
  }`;

  try {
    const totalProduct = await productModel.countDocuments();
    const products = await productModel.find().skip(skip).limit(limit);

    if (products.length === 0) {
      return res.status(404).json({ error: "No product found!" });
    }

    const totalPages = Math.ceil(totalProduct / limit);

    const nextPage =
      page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null;
    const prevPage =
      page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null;

    const cleanProducts = products.map(product => {
      // Extract filename from the stored image_url
      const filename = product.image_url.split('/').pop();
      // Generate new URL with current host
      const currentImageUrl = `${req.protocol}://${req.get("host")}/uploads/products/${filename}`;
      
      return {
        product_id: product.product_id,
        title: product.title,
        price: product.price,
        image_url: currentImageUrl,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    });

    res.status(200).json({
      message: "List of products retrieved successfully",
      page,
      limit,
      totalProduct,
      totalPages,
      nextPage,
      prevPage,
      products: cleanProducts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const get_product_by_id = async (req, res) => {
  try {
    const { product_id } = req.params;
    const product = await productModel.findOne({ product_id });

    if (!product) {
      return res.status(404).json({ error: "No product found!" });
    }

    // Extract filename from the stored image_url and generate new URL with current host
    const filename = product.image_url.split('/').pop();
    const currentImageUrl = `${req.protocol}://${req.get("host")}/uploads/products/${filename}`;
    
    const cleanProduct = {
      product_id: product.product_id,
      title: product.title,
      price: product.price,
      image_url: currentImageUrl,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };

    res.status(200).json({
      message: "product retrieved successfully",
      product: cleanProduct,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const update_product = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { title, price } = req.body;

    const updateData = { title, price };

    if (req.file) {
      updateData.image_url = `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`;
      updateData.image_filename = req.file.filename;
      updateData.image_mimetype = req.file.mimetype;
      updateData.image_size = req.file.size;
    }

    const updatedProduct = await productModel.findOneAndUpdate(
      { product_id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "No product exist with this ID!" });
    }

    // Extract filename from the stored image_url and generate new URL with current host
    const filename = updatedProduct.image_url.split('/').pop();
    const currentImageUrl = `${req.protocol}://${req.get("host")}/uploads/products/${filename}`;
    
    const cleanUpdatedProduct = {
      product_id: updatedProduct.product_id,
      title: updatedProduct.title,
      price: updatedProduct.price,
      image_url: currentImageUrl,
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt
    };

    res.status(200).json({
      message: "Product updated successfully",
      product: cleanUpdatedProduct,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const delete_product = async (req, res) => {
  try {
    const { product_id } = req.params;
    const deletedproduct = await productModel.findOneAndDelete({ product_id });
    if (!deletedproduct) {
      return res.status(404).json({ error: "No product exist with this ID!" });
    }

    // Extract filename from the stored image_url and generate new URL with current host
    const filename = deletedproduct.image_url.split('/').pop();
    const currentImageUrl = `${req.protocol}://${req.get("host")}/uploads/products/${filename}`;
    
    const cleanDeletedProduct = {
      product_id: deletedproduct.product_id,
      title: deletedproduct.title,
      price: deletedproduct.price,
      image_url: currentImageUrl,
      createdAt: deletedproduct.createdAt,
      updatedAt: deletedproduct.updatedAt
    };

    res.status(200).json({
      message: "Product Parmanently deleted successfully",
      product: cleanDeletedProduct,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


