import {Router} from "express"
import { signUp } from "../controllers/auth";


const authRoutes:Router=Router();
authRoutes.post('/signUp',signUp)
// authRoutes.post('/login',login)

export default authRoutes;