import { Router } from "express";
import bcrypt from "bcrypt";
import { User } from "../model/user.js";
import passport from "passport";
import "dotenv/config"
import jwt from "jsonwebtoken";

const router = Router()
router.get('/login', (req, res) => {
    res.redirect('http://localhost:5173/loginRegister')
  })

router.post('/register',async (req,res,next)=>{
    const {username,email,password} = req.body
    if(!username || !password || !email){
        res.send("missing input fields")
    }
    try{
        const existingUserByEmail = await User.findOne({ email });
        const existingUserByUsername = await User.findOne({ username });

        if (existingUserByEmail) {
            return res.status(400).send("Email already in use");
        }

        if (existingUserByUsername) {
            return res.status(400).send("Username already in use");
        }

        const hashedPassword = await bcrypt.hash(password,10)
        if(hashedPassword){
            const user = new User({
                username,
                email,
                passwordHash:hashedPassword
            })
            const saved = await user.save()
            const token = jwt.sign(
                {
                    username,
                    email
                },
                process.env.SECRET,
                {expiresIn:'1h'}
            )
            console.log('user:',token,'saved:',saved)
            res.json(token)
        }else{
            res.send('Something went wrong')
        }
    }catch(err){
        // if (err.code === 11000) {
        //     const error = new Error("Username or Email already exists")
        //     error.status = 400
        //     return next(error) // Pass to error handler
        // }
        next(err)
    }
})

router.post('/login',async (req,res)=>{
    const {email,password} = req.body
    if(!password || !email){
        res.send("missing input fields")
    }
    try{
        const hashedPassword = await findOne({email:email},'passwordHash')
        if(!hashedPassword){
            res.send({message:'cant find user please confirm email or register'})
        }
        const valid = await bcrypt.compare(password,hashedPassword.passwordHash)
        if(valid){
            const token = jwt.sign(
                {
                    username,
                    email
                },
                process.env.SECRET,
                {expiresIn:'1h'}
            )
            console.log(token)
            res.json(token)
        }else{
            res.send({message:'Incorrect Password'})
        }
    }catch(err){
        next(err)
    }
})

router.get('/logout', (req, res) => {
    // localStorage.removeItem('token')
    req.logout(err => {
      if (err) {
        return res.status(500).send("Error logging out")
      }
      req.session.destroy(() => {
        res.redirect('/')
      })
    })
  })
  

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }))
  
router.get(`/${process.env.GOOGLE_CALLBACK_URL}`, 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home
      res.redirect('/home');
});

export default router