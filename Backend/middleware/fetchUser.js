var jwt = require('jsonwebtoken');
const JWT_SECRET="shoebisagoodboy"
const fetchUser=(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        // res.send(401).json({error:"Please enter correct details"});
        res.sendStatus(401)
    }
    try{
        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next()
    }catch(error){
        // res.send(401).json({error:"Please enter correct details"});
        res.sendStatus(401)
    }
}

module.exports=fetchUser;