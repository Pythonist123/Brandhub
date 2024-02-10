import express, { response } from "express";
import session from "express-session";
import {
    homeroute,
    regUser,
    logUser,
    loginStore,
    regStore,
    addProduct,
    addCategory,
    logadmin,
    adminRoute
} from "./routes/index.js";
import connectToDatabase from "./database/index.js";
import passport from "passport";
import errorHandler from "./middleware/error.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(session({
    secret: 'your-secret-key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000, // 1 hour in milliseconds
        // expires: new Date(Date.now() + 3600000), // Alternative way using expires option
        // other cookie options...
    }
}));

app.use(passport.initialize());
app.use(express.json());
app.get("/",(req,res)=>{
    return res.send("<h1>Hello world</h1>")
})
app.use(cookieParser());

app.use(homeroute)
app.use(regUser);
app.use(logUser);
app.use(loginStore);
app.use(regStore);
app.use(addProduct);
app.use(addCategory);
app.use(logadmin);
app.use(adminRoute);
app.use(errorHandler);
app.listen(3000,()=>{
    console.log("Server started at port 3000")
    connectToDatabase();
})
