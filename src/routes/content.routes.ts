import express,{Router} from "express"
import { addContent,getContent,deleteContent } from "../controllers/content.controllers"
import { isLoggedIn } from "../middlewares/login.middlewares"
const router = Router()

router.post('/add-content',isLoggedIn,addContent)
router.get('/get-content',isLoggedIn,getContent)
router.delete('/delete-content/:id',isLoggedIn,deleteContent)
export default router