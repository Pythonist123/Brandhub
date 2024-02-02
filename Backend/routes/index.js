import { Router } from "express";
import homeController from "../controllers/homeController.js";

const router = Router();
// user route
const homeroute = router.get("/home",homeController.handleView)
// store route
const loginStore = router.post("/store/login",(req,res)=>{

})
// admin route

export {
    homeroute
}
