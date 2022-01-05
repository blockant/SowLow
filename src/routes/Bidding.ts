// Deleting and modifying bids are not allowed
import { Router } from "express";
// import { isLoggedIn } from "../middlewares/Auth";
import BiddingController from "../controllers/Bidding";
const router=Router()

// --------------------
// GET Routes
// --------------------

// Get all Bids
router.get('/', BiddingController.viewAllBids)

// Get Bid By Id
router.get('/:bidId', BiddingController.getBidById)

// --------------------
// POST Routes
// --------------------



export default router