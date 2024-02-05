import { Router } from "express";
import homeController from "../controllers/homeController.js";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";
import adminController from "../controllers/adminController.js";
import storeController from "../controllers/storeController.js";

const router = Router();
// user route
const homeroute = router.get("/home",homeController.handleView)
const regUser = router.post("/register",userController.register);

const logUser = router.post("/login",userController.login);



// admin route
const logadmin = router.post("/admin/login",adminController.login);
// store route
const loginStore = router.post("/store/login",storeController.login);
const regStore = router.post("/store/register",storeController.register);
// admin route

export {
    homeroute,
    regUser,
    logUser,
    loginStore
}
