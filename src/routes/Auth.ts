import { Router } from "express";
import Auth from "../controllers/Auth";
const router=Router()

router.post('/signup', Auth.signup)

export default router