const express=require('express')
const User=require('../models/User');
const router=express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const fetchUser=require('../middleware/fetchUser')

const JWT_SECRET="shoebisagoodboy"
router.post('/createUser',[
    body('name').isLength({min:3}),
    body('email').isEmail(),
    body('password').isLength({min:5})
],async (req,res)=>{
    // console.log(req.body);
    let success=false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.send({success, errors: result.array() }); 
    }
    try{
        let user=await User.findOne({email:req.body.email})
        if(user){
            return res.status(400).json({success,error:"Sorry Already this mail exists"})
        }
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(req.body.password, salt);
        user= await User.create({
            name:req.body.name,
            email:req.body.email,
            password:hash
        })
        const data={
            user:{
                id:user.id
            }
        }
        
        const authToken=jwt.sign(data,JWT_SECRET)
        // console.log(authToken)
        success=true
        res.send({success,authToken})
    }catch(err){
        console.log(err);
        res.status(500).send("Some error has occured")
    }
})
    
    // .then(user=>res.json(user)).catch(err=>console.log(err));
    // res.send(req.body)

    //localhost:5000/api/auth/login
    router.post('/login',[
        body('email',"Enter valid Email").isEmail(),
        body('password',"Password cannot be blank").exists()
    ],async (req,res)=>{
        // console.log(req.body);
        let success=false
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.send({ errors: result.array() }); 
        }
        const {email,password}=req.body;
        try{
            let user=await User.findOne({email});
            if(!user){
                success=false
                return res.status(400).json({error:"Please try with correct credentials"});
            }
            const passwordCompare= await bcrypt.compare(password,user.password);
            if(!passwordCompare){
                success=false
                return res.status(400).json({success,error:"Please try with correct credentials"});
            }
            const data={
                user:{
                    id:user.id
                }
            }
            const authToken=jwt.sign(data,JWT_SECRET)
            // console.log(authToken)
            success=true
            res.send({success,authToken})
        }catch(err){
            console.log(err.message);
            return res.status(500).json({error:"Internal Server Error"});
            
        }
    })



//localhost:5000/api/auth/getUser
//Router-3

router.post('/getUser',fetchUser,async (req,res)=>{
    try{

        const userId=req.user.id;
        const user=await User.findById(userId).select("-password")
        res.send(user)
    }catch(err){
        console.log(err.message);
        return res.status(500).json({error:"Internal Server Error"});
        
    }
})
  


module.exports=router