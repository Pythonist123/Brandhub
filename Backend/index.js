import express, { response } from "express";
import { homeroute } from "./routes/index.js";

const app = express();


app.get("/",(req,res)=>{
    return res.send("<h1>Hello world</h1>")
})
app.use(homeroute)
app.listen(3000,()=>{
    console.log("Server started at port 3000")
})
