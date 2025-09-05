import express,{Router} from "express"
import { userRegistration } from "../controllers/register"
const router = Router()

router.post('/register',userRegistration)
export default router