// Deleting and modifying bids are not allowed
import { Router } from "express";
// import { isLoggedIn } from "../middlewares/Auth";
import WinnerController from "../controllers/Winner";
const router=Router()

// --------------------
// GET Routes
// --------------------

// Get Bid By Id
router.get('/', WinnerController.getAllWins)



export default router