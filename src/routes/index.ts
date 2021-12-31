// This Index Router is the Master Router
import { Router } from "express";
import authRouter from './Auth'
import userRouter from './User'
import productRouter from './Product'
import biddingRouter from "./Bidding"
const router = Router()

// Adding All Auth Routes
router.use('/auth', authRouter)

// Adding All User Routes
router.use('/user', userRouter)

// Adding All product Routes
router.use('/product', productRouter)

// Adding Bid Roter
router.use('/bid', biddingRouter)
export default router