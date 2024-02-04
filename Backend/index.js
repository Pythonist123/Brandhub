import express, { response } from "express";
import { homeroute,logUser,loginStore,regUser } from "./routes/index.js";
import connectToDatabase from "./database/index.js";
import passport from "passport";
import errorHandler from "./middleware/error.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(passport.initialize());
app.use(express.json());
app.get("/",(req,res)=>{
    return res.send("<h1>Hello world</h1>")
})
app.use(cookieParser());

// app.use(homeroute)
// app.use(regUser);
app.use(logUser);
// app.use(loginStore);
app.use(errorHandler);
app.listen(3000,()=>{
    console.log("Server started at port 3000")
    connectToDatabase();
})
