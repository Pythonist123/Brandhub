import { Router } from "express";
import homeController from "../controllers/homeController.js";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";

const router = Router();
// user route
const homeroute = router.get("/home",homeController.handleView)
const regUser = router.post("/register",userController.register);

const logUser = router.post("/login",userController.login);
// store route
const loginStore = router.get("/store/login",authController.authenticate,(req,res)=>{
    console.log("Request received on login")

    res.json({
        "status":200,
        "Message":"Request Received"
    })
})
// admin route

export {
    homeroute,
    regUser,
    logUser,
    loginStore
}
