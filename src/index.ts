import express,{Express,Request,Response} from "express"
import { PORT } from "./secret"
import authRoutes from "./route/auths";

import { PrismaClient } from "@prisma/client"
import { errorMiddleWare } from "./middleware/error"
import rootRouter from "./route";

export const prismaClient=new PrismaClient({
 log:['query']
})
const app=express()
app.use(errorMiddleWare)


app.use(express.json())//should be next to the express function

app.use('/api',rootRouter)


app.listen(PORT,()=>{
    console.log("the app  is working")
})      