// This Index Router is the Master Router
import { Router } from "express";
import authRouter from './Auth'
const router = Router()
router.use('/auth', authRouter)
export default router