import express from "express"
import form from "./routes/form.js"
import home from "./routes/home.js"
import handleErrors from "./helper/errorhandler.js"
import mongoose from "mongoose"
import "dotenv/config"
import session from "express-session"
import passport from "passport"
import { User } from "./model/user.js"
import { Strategy } from "passport-google-oauth20";


// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';


// // Get the current directory (workaround for __dirname)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const app = express()
const PORT = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use('/public/uploads',express.static(join(__dirname,'public','uploads')))
app.use(session({
    secret: process.env.SECRET, // A secret string used to sign the session ID cookie
    resave: false, // Don't force a session to be saved if it wasn't modified
    saveUninitialized: false, // Don't save an uninitialized session
    // cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize passport and use passport.session() to handle login sessions
app.use(passport.initialize())
app.use(passport.session())
const GoogleStrategy = Strategy

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:3000/${process.env.GOOGLE_CALLBACK_URL}`,
    cookie:{}
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
        // Check if user exists
        let user = await User.findOne({ googleId: profile.id })

        if (!user) {
          // Create a new user if none is found
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0]?.value,
            avatar: profile.photos[0]?.value,
            provider: 'google',
          });
        }

        // Return the user
        return done(null, user)
      } catch (err) {
        // Pass errors to Passport
        return done(err, null)
      }
    
  }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id); // Store user ID in the session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Retrieve user from database
        done(null, user); // Done with the user object
    } catch (err) {
        done(err, null);
    }
});

app.use(handleErrors)



mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log("succesfully connected to database")
})
.catch((err)=>{
    console.log(err)
})

app.use('/form',form)
app.use('/home',home)

app.get('/', (req,res)=>{
    res.redirect('/home')
} )

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})