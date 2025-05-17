import express from 'express';
import ejs from 'ejs';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from "passport-local";

// Importing database login from another file(ignored on git)
import db from "./imports/dbConn.js";
// Importing login and register from imports folder
import * as userAuth from "./imports/login_register.js";

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// Seddion middleware (Express and passport)
app.use(session({
    secret: "MYPERSONALSECRETKEY",
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

// Connecting to database @ ./imports/dbConn.js
db.connect();

// GET routes for all pages
app.get("/", async (req, res) => {
    res.render('index.ejs')
})
//route for profile
app.get("/profile", async (req, res) =>{
    res.render("profile.ejs")
})
// route for all user lists
app.get("/lists", async (req, res) =>{
    if(req.isAuthenticated()){
        // const data = await db.query("SELECT * FROM notes WHERE user_id = $1", [
        //     result.id
        // ])
        // let content = data.rows;
        // res.render("lists.ejs", {
        //     notes: content
        // })
        res.render("lists.ejs")
    }else{
        res.redirect("/login")
    }
})
// Login and sign up
app.get("/login", async (req, res) =>{
    res.render("login.ejs")
})
app.get("/sign-up", async (req, res) =>{
    res.render("sign-up.ejs")
})

// POST routes

// Register new user
app.post("/register", async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let pwd = req.body.pwd;

    userAuth.registerUser(name, email, pwd, db);

    res.render("login.ejs");
})

// User log in
app.post("/login", passport.authenticate("local", {
    successRedirect: "/lists",
    failureRedirect: "/login"
}))

passport.use(new Strategy ({
    usernameField: 'email'
}, async function verify(username, password, cb){
    console.log("Running passport");
    try{
        let user = await userAuth.loginUser(username, password, db);
        console.log("From passport" + user);

        if(user == "wrong password"){
            return cb(null, false);
        }else if(user == "Email not registered"){
            return cb(null, false, { message: 'Email not registered.' })
        }else{
            return cb(null, user);
        }
    }catch(err){
        return cb(err)
    }
}))

passport.serializeUser((user, cb) => {
    cb(null, user);
})
passport.deserializeUser((user, cb) => {
    cb(null, user)
})

//Listening in port 3000
app.listen(port, () => {
    console.log(`Server running at ${port}`)
})