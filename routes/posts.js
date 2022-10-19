import { Router } from "express";
import { verify } from "./tokenUtils.js";

const router=Router();
router.get("/",verify,(req,res)=>{
    res.send(req.user);
})

export default router;