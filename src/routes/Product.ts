import { Router } from "express";
// import { isLoggedIn } from "../middlewares/Auth";
import ProductController from "../controllers/Product";
const router=Router()

// --------------------
// GET Routes
// --------------------

// Get all Products
router.get('/', ProductController.getAllProducts)

// Get Product By Id
router.get('/:productId', ProductController.getProductById)

// --------------------
// POST Routes
// --------------------

// Create a product
router.post('/', ProductController.addProduct)

// --------------------
// PUT Routes
// --------------------

// Edit product by Id
router.put('/:productId', ProductController.updateProductById)


// --------------------
// DELETE Routes
// --------------------

// Delete product by Id
router.delete('/:productId', ProductController.deleteProductById)


export default router