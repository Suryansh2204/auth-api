import { Router } from "express";
import User from "../model/User.js";
import { registerValidation, loginValidation } from "../validation.js";
import bcrypt from 'bcryptjs';
import { genToken } from "./tokenUtils.js";
const router = Router();

router.post("/register", async (req, res) => {
  console.log(req.body);
  //validating data before creating a user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if the user is already in the database
  const emailExists=await User.findOne({email:req.body.email});
  if(emailExists) return res.status(400).send("Email already already registered")
  
  //creating hashed password
  const salt=await bcrypt.genSalt(10);
  const hashedPasswd=await bcrypt.hash(req.body.password,salt);

  //creating a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPasswd
  });

  //saving the newly created user
  try {
    const savedUser = await user.save();
    res.status(201).send({user:user._id});
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login",async (req,res)=>{
  //validating login details
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //checking if user exists
  const user=await User.findOne({email:req.body.email});
  if(!user) return res.status(400).send("Email isn't registered");
  //checking for password
  const validPass= await bcrypt.compare(req.body.password,user.password);
  if(!validPass)return res.status(400).send("Password is wrong");
  
  //creating and assining token
  const token = genToken(user);
  res.header('auth-token',token).send("Login Successful").status(200);

})

export default router;
