import { Router } from "express";
import * as authCtrl from "../controllers/auth.controllers";

const router = Router();

// Route to sign up a new Tanker
router.post("/signUpTanker", authCtrl.signUpTanker);

// Route to sign up a new Admin
router.post("/signUpAdmin", authCtrl.signUpAdmin);



export default router;
