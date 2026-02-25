const express=require("express")
const cors=require("cors")
const jwt = require('jsonwebtoken');
const User=require('../Models/usersModel.js')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieParser = require("cookie-parser");
const connectDb =require('../Config/db.js')
const router=require('../Routes/routes.js')
require('dotenv').config();

const path = require('path');

connectDb()
const app=express();


const port= process.env.PORT ;
const allowedOrigins = [
  process.env.CORS_ORIGIN_ADMIN,
  process.env.CORS_ORIGIN_USER
];
app.use(cookieParser());


app.use(
  cors({
    origin: allowedOrigins,  // React dev server URL
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true
  })
);
app.get('/favicon.ico', (req, res) => res.status(204));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(passport.initialize());
app.use("/api",router)

const findUserByGoogleId = async (id) => {
    return await User.findOne({ googleId: id });
};

const createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};
// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // 1️⃣ googleId irukkaa?
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        // 2️⃣ same email irukkaa?
        user = await User.findOne({ email });
        if (user) {
          // 🔗 googleId link pannunga
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        // 3️⃣ new user create
        user = await User.create({
          name: profile.displayName,
          email: email,
          googleId: profile.id,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);



// Routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set JWT cookie
        res.cookie('token', token, { httpOnly: true,secure: false, // true in production (https)
  sameSite: "lax" });

        // Redirect to frontend dashboard
        res.redirect( `${process.env.CORS_ORIGIN_USER}/login?google=true`);
    }
);


app.get('/',(req,res)=>{
    res.send("Backend Running")

})
app.listen(port,()=>{
    console.log("server is running on port 5000")
})

