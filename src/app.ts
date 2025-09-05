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
import contentRoute from "./routes/content.routes"
import shareRoutes from "./routes/share.routes"
app.use('/api/v1/user',userRoute)
app.use('/api/v1/content',contentRoute)
app.use('/api/v1/brain',shareRoutes)

export  {app}