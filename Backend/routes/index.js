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
const getProduct = router.get("/store/:productId",storeController.getProduct);
const getProductsByCategory = router.get("/:storeName/:categoryName",storeController.getProductsByCategory);

const logUser = router.post("/login",userController.login);



// admin route
const logadmin = router.post("/admin/login",adminController.login);
// store route
const loginStore = router.post("/store/login",storeController.login);
const regStore = router.post("/store/register",storeController.register);
const addProduct = router.post("/store/addProduct",authController.authenticate,authController.isStore,storeController.addProduct);
const addCategory = router.post("/store/addCategory",authController.authenticate,authController.isStore,storeController.addCategory);

// admin route
const adminRoute = router.get("/admin/dashboard",authController.authenticate,authController.isAdmin,(req,res,next)=>{
    return res.status(200).json({
        message:"Admin dashboard",
    })
})
export {
    homeroute,
    regUser,
    logUser,
    loginStore,
    regStore,
    addProduct,
    addCategory,
    logadmin,
    adminRoute,
    
}
