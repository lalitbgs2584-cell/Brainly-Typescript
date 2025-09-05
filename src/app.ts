import express,{Application} from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const app:Application = express()
app.use(cookieParser())
app.use(cors({origin:"*"}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.send("hello")
})

import userRoute from "./routes/user.routes"
app.use('/api/v1/user',userRoute)
export  {app}