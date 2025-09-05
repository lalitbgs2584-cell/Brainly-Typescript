import express,{Router} from "express"
import { getShareLink,shareLink } from "../controllers/share.controllers"
import { isLoggedIn } from "../middlewares/login.middlewares"
const router = Router()

router.post('/share',isLoggedIn,shareLink)
router.get('/share/:shareLink',isLoggedIn,getShareLink)

export default router