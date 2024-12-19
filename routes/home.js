import { Router } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config"

const router = Router()

router.get('/', 
    // passport.authenticate('google', { failureRedirect: '/form/login' }),
    (req,res,next)=>{
        
        if (req.isAuthenticated()) {
            // User is already authenticated, show their data
            res.send(`Welcome ${req.user.username} with email of ${req.user.email}`)
        } else {
            // const authHeader = req.headers['authorization']
        // const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN for front end
        const token = req.params.id

        if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided" })
        
        try{
            const verified = jwt.verify(token,process.env.SECRET)
            if(!verified){
                res.json({message:"User not verified"})
            }
            console.log(verified)
            res.send(`Welcome ${verified.username}, with email: ${verified.email}`);
        }catch(err){
            next(err)
        }
            // Redirect unauthenticated users to login
            res.redirect('/form/login')
        }
})

export default router