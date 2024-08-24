const express = require("express");
const AdminsController = require("../controller/admin.js");
const CategoryController = require("../controller/category.js");
const ProductsController = require("../controller/product.js");
const { auth } = require("../middleware/auth.js");
const { upload } = require("../middleware/uploader.js");
const router = express.Router();

//admins
router.get("/admins", AdminsController.get);
router.post("/admins/sign-up", AdminsController.registerAdmin);
router.post("/admins/sign-in", AdminsController.loginAdmin);
router.get("/admin/profile", [auth], AdminsController.getProfile);
router.delete("/admins/:id", [auth], AdminsController.delete);
router.patch("/admins/:id", AdminsController.updateAdmin);
router.get("/admins/:id", [auth], AdminsController.getAdmin);
router.patch("/admin/profile", [auth], AdminsController.updateProfile);

//categories
router.get("/categories", CategoryController.get);
router.post("/categories", [auth], CategoryController.create);
router.delete("/category/:id", [auth], CategoryController.delete);
router.patch("/category/:id", [auth], CategoryController.update);

//products
router.get("/products", ProductsController.get);
router.get("/products/category/:id", ProductsController.getCategory);
router.get("/product/:id", ProductsController.getProduct);
router.delete("/product/:id", [auth], ProductsController.delete);
router.post(
  "/product",
  [auth, upload.array("photos")],
  ProductsController.create
);

module.exports = router;
