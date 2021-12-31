import { Router } from "express";
import { isLoggedIn } from "../middlewares/Auth";
import ProductController from "../controllers/Product";
import BiddingController from "../controllers/Bidding";
const router=Router()

// --------------------
// GET Routes
// --------------------

// Get all Products
router.get('/', ProductController.getAllProducts)

// Get all Bids of a product
router.get('/:productId/bid', BiddingController.viewAllBids)

// Get Winning Bid for current product
router.get('/:productId/bid/winning', BiddingController.getCurrentWinningBid)


// Get Product By Id
router.get('/:productId', ProductController.getProductById)

// --------------------
// POST Routes
// --------------------

// Create a product
router.post('/', ProductController.addProduct)

// Create A Bid
router.post('/:productId/bid', [isLoggedIn], BiddingController.createNewBid)

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