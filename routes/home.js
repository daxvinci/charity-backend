import { Router } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config"

const router = Router()

router.get('/', 
    // passport.authenticate('google', { failureRedirect: '/form/login' }),
    (req,res,next)=>{
        console.log('Session:', req.session);
        console.log('isAuthenticated:', req.isAuthenticated());
        console.log('User:', req.user);
        if (req.isAuthenticated()) {
            // User is already authenticated, show their data
            console.log("google was authenticated")
            return res.json({username: req.user.username, email: req.user.email})
        }
            console.log('req.headers: ', req.headers)
            const token = req.headers['authorization']?.split(' ')[1];// Bearer TOKEN from front end
        // const token = req.params.id

        if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided" })
        
        try{
            const verified = jwt.verify(token,process.env.SECRET)
            if(!verified){
                res.json({message:"User not verified"})
            }
            console.log(verified)
            res.json({username: verified.username, email: verified.email});
        }catch(err){
            next(err)
        }
        
})


export default router