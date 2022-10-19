import jwt from 'jsonwebtoken';

const genToken=(user)=>(
    jwt.sign({_id:user._id},process.env.TOKEN_KEY)
);

const verify=(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token)return res.status(401).send('Access Denied');
    
    try{
        const verified=jwt.verify(token,process.env.TOKEN_KEY);
        req.user=verified;
        next();
    }catch (err){
        res.send('Invalid Token').status(400);
    }
};

export {genToken,verify};