const { Products, validateProduct } = require("../models/productSchema.js");
const fs = require("fs");
const path = require("path");

class ProductsController {
  // async get(req, res) {
  //   try {
  //     const { skip = 1, limit = 4, categoryId = null } = req.query;
  //     const products = await Products.find()
  //       .populate([{ path: "adminId", select: ["fname", "username"] }, { path: "categoryId", select: ["title"] },])
  //       .limit(limit)
  //       .skip((skip - 1) * limit)
  //       .sort({ createdAt: -1 });
  //     if (categoryId) {
  //       products = await Products.find({ categoryId })
  //         .limit(limit)
  //         .skip((skip - 1) * limit)
  //         .sort({ createdAt: -1 })
  //     }
  //     if (!products.length) {
  //       return res.status(400).json({
  //         msg: "Products is not defined",
  //         variant: "error",
  //         payload: null,
  //       });
  //     }
  //     let total = await Products.countDocuments();
  //     res.status(200).json({
  //       msg: "All Products",
  //       variant: "success",
  //       payload: products,
  //       total,
  //     });
  //   } catch (err) {
  //     res.status(500).json({
  //       msg: err.message || "Server error",
  //       variant: "error",
  //       payload: null,
  //     });
  //   }
  // }

  async get(req, res) {
    try {
      const { skip = 1, limit = 4, categoryId = null } = req.query;
      let query = {};
      if (categoryId) { query.categoryId = categoryId; }

      const products = await Products.find(query)
        .populate([{ path: "adminId", select: ["fname", "username"] }, { path: "categoryId", select: ["title"] },])
        .limit(limit).skip((skip - 1) * limit).sort({ createdAt: -1 });

      if (!products.length) {
        return res.status(400).json({
          msg: "Products are not defined",
          variant: "error",
          payload: null,
        });
      }

      let total = await Products.countDocuments(query);
      res.status(200).json({
        msg: "All Products",
        variant: "success",
        payload: products,
        total,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message || "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async getCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const products = await Products.find({ categoryId }).populate([
        { path: "adminId", select: ["fname", "username"] },
        { path: "categoryId", select: ["title"] },
      ]);
      if (!products.length) {
        return res.status(400).json({
          msg: "Products is not defined",
          variant: "error",
          payload: null,
        });
      }
      let total = await Products.countDocuments();
      res.status(200).json({
        msg: "All Products",
        variant: "success",
        payload: products,
        total,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message || "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async getProduct(req, res) {
    try {
      const { id } = req.params;
      let product = await Products.findById(id);
      if (!id || !product) {
        return res.status(400).json({
          msg: "Product id is not defined",
          variant: "error",
          payload: null,
        });
      }
      res.status(200).json({
        msg: "Product registered successfully",
        variant: "success",
        payload: product,
      });
    } catch {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async create(req, res) {
    try {
      const urls = req.files
        ? req.files.map(
          (i) => `${req.protocol}://${req.get("host")}/images/${i.filename}`
        )
        : [];

      let newProduct = {
        ...req.body,
        adminId: req.admin._id,
        urls,
      };

      const { error } = validateProduct(newProduct);
      if (error) {
        urls?.forEach((el) => {
          let name = el.split("/").slice(-1)[0];
          const filePath = path.join("files", name);
          fs.unlinkSync(filePath);
        });
        return res.status(400).json({
          msg: error.details[0].message,
          variant: "warning",
          payload: null,
        });
      }
      const product = await Products.create({
        ...newProduct,
        info: req.body.info ? JSON.parse(req.body.info) : [],
      });
      res.status(201).json({
        msg: "Product is created",
        variant: "success",
        payload: product,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message || "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      let product = await Products.findById(id);

      product?.urls?.forEach((el) => {
        let name = el.split("/").slice(-1)[0];
        const filePath = path.join("files", name);
        fs.unlinkSync(filePath);
      });

      await Products.findByIdAndDelete(id);
      res.status(200).json({
        msg: "Delete products",
        variant: "success",
        payload: null,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      const { error } = validateProduct(req.body);
      const productId = await Products.findById(id);
      if (error || !productId) {
        return res.status(400).json({
          msg: error.details[0].message || "Product not found",
          variant: "warning",
          payload: null,
        });
      }
      const product = await Products.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json({
        msg: "Product Updated",
        variant: "success",
        payload: product,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }

}

module.exports = new ProductsController();
