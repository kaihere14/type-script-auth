import { Router } from "express";
import { registerUser,loginUser,logoutUser } from "../controller/user.controller";
import { verifyJWT } from "../middleware/verifyJWT";

const router = Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/logout",verifyJWT,logoutUser)

export default router