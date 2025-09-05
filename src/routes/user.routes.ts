import express,{Router} from "express"
import { userLogin, userRegistration ,me } from "../controllers/user.controllers"
import { isLoggedIn } from "../middlewares/login.middlewares"
const router = Router()

router.post('/register',userRegistration)
router.post('/login',userLogin)
router.get('/me',isLoggedIn,me)

export default router