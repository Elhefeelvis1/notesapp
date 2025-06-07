import express from 'express';
import ejs from 'ejs';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import env from "dotenv";

// Importing database login from another file(ignored on git)
import db from "./imports/dbConn.js";
// Importing login and register from imports folder
import * as userAuth from "./imports/login_register.js";

const app = express();
const port = 3000;
env.config();

let currentDate = new Date().getFullYear() + "-" 
  + (new Date().getMonth() + 1) + "-"
  + new Date().getDate();

// Checks if the checkbox is checked or not
function isChecked(body){
    if(body){
        return true
    }else{
        return false
    }
}

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// Session middleware (Express and passport)
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Connecting to database @ ./imports/dbConn.js
db.connect();

// GET routes for all pages
app.get("/", async (req, res) => {
    if(req.isAuthenticated()){
        let user = req.user;
        res.render("index.ejs", {
            userData: user
        });
    }else{
        res.render("index.ejs");
    }
});

//route for profile
app.get("/profile", async (req, res) =>{
    if(req.isAuthenticated()){
        let user = req.user;
        res.render("profile.ejs", {
            userData: user
        });
    }else{
        res.redirect("/login");
    }
});

// route for a user's lists of notes
app.get("/lists", async (req, res) =>{
    if(req.isAuthenticated()){
        let user = req.user;
        const data = await db.query("SELECT * FROM notes WHERE user_id = $1", [
            user.id
        ]);
        let content = data.rows;
        res.render("lists.ejs", {
            notes: content,
            user: user.id
        });
    }else{
        res.redirect("/login");
    }
});

// Favourites 
app.get("/favourites", async (req, res) => {
    if(req.isAuthenticated()){
        let user = req.user;
        const data = await db.query("SELECT * FROM notes WHERE user_id = $1 AND favourite = $2", [
            user.id, true
        ]);
        let content = data.rows;
        res.render("lists.ejs", {
            notes: content,
            user: user.id
        });
    }else{
        res.redirect("/login");
    }
})

// Uncompleted
app.get("/uncompleted", async (req, res) => {
    if(req.isAuthenticated()){
        let user = req.user;
        const data = await db.query("SELECT * FROM notes WHERE user_id = $1 AND uncompleted = $2", [
            user.id, true
        ]);
        let content = data.rows;
        res.render("lists.ejs", {
            notes: content,
            user: user.id
        });
    }else{
        res.redirect("/login");
    }
})

// Edit route
app.get("/edit", (req,res) => {
    if(req.isAuthenticated()){
        let user = req.user;
        res.render("editList.ejs", {
            user: user.id
        });
    }else{
        res.redirect("/login");
    }
})

// Login and sign up
app.get("/login", async (req, res) =>{
    res.render("login.ejs");
});
app.get("/sign-up", async (req, res) =>{
    res.render("sign-up.ejs");
});

// logout
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if(err){
            console.log(err);
        }else{
            res.redirect("/login")
        }
    })
})

// Link to User details
app.get("/updateProfile", async (req, res) => {
    if(req.isAuthenticated()){
        let user = req.user.id;
        const userDetails = await db.query(
            "SELECT * FROM user_details WHERE user_id = $1", 
            [user]
        )
        res.render("userDetails.ejs", {
            userDetails: userDetails.rows[0],
            userId : user
        })
        console.log(userDetails.rows);
    }else{
        res.redirect("/login");
    }
})

// Google OAuth sign in
app.get("/auth/google", passport.authenticate("google", {
    scope:["profile", "email"]
}));

app.get("/auth/google/lists", passport.authenticate('google', {
    successRedirect: "/lists",
    failureRedirect: "/login"
}))

// -----------POST routes---------------

// Edit lists
app.post("/edit", (req, res) => {
    let id = req.body.editId;
    let title = req.body.editTitle;
    let content = req.body.editContent;
    let favourites = req.body.favourites;
    let uncompleted = req.body.uncompleted;

    res.render("editList.ejs", {
        id: id,
        title: title,
        content: content,
        favourite: favourites,
        uncompleted: uncompleted
    });
});

app.post("/update", async (req, res) => {
    let id = req.body.editId;
    let title = req.body.editTitle;
    let content = req.body.editContent;
    let favourites = isChecked(req.body.favourites);
    let uncompleted = isChecked(req.body.uncompleted);

    console.log(uncompleted);
    console.log(favourites);

    const update = await db.query("UPDATE notes SET title = $1, content = $2, favourite = $3, uncompleted = $4 WHERE id = $5", [
        title, content, favourites, uncompleted, id
    ])
    res.redirect("/lists");
});

app.post("/addNew", async (req, res) => {
    if(req.isAuthenticated()){
        let title = req.body.title;
        let content = req.body.content;
        let favourites = isChecked(req.body.favourites)
        let uncompleted = isChecked(req.body.uncompleted);
        let user = req.body.userId;

        const noteId = await db.query(
            "INSERT INTO notes (title, content, last_updated, favourite, uncompleted, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", 
            [title, content, currentDate, favourites, uncompleted, user]
        )
        console.log(noteId.rows[0]);
        // checks if a new note was added if it has an Id
        if (noteId.rows[0]){
            res.redirect("/lists");
        }else{
            res.redirect("/edit")
        }
    }else{
        res.redirect("/login");
    }
})

// Edit profile
app.post("/saveUpdate", async (req, res) => {
    try{
        let userId = req.body.userId;
        let id = req.body.id;
        let fullName = req.body.fullName;
        let country = req.body.country;
        let hobbies = req.body.hobbies;
        let gender = req.body.gender;
        console.log(id);

        console.log(typeof(id))

        if(id){
            await db.query("UPDATE user_details SET full_name = $1, country = $2, hobbies = $3", [
                fullName, country, hobbies
            ]);
            res.redirect("/updateProfile");
        }else{
            await db.query("INSERT INTO user_details (full_name, country, gender, hobbies, user_id) VALUES ($1, $2, $3, $4, $5)", 
                            [fullName, country, gender, hobbies, userId]
                          );
            res.redirect("/updateProfile");
        }
    }catch(err){
        console.error(err)
    }
})

// Update User details
app.get("/updateProfile", async (req, res) => {
    if(req.isAuthenticated()){
        let user = req.user.id
        console.log(user)
    }else{
        res.redirect("/login");
    }
})

// Register new user
app.post("/register", async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let pwd = req.body.pwd;

    userAuth.registerUser(name, email, pwd, db);

    res.redirect("/login");
})

// User log in
app.post("/login", passport.authenticate("local", {
    successRedirect: "/lists",
    failureRedirect: "/login"
}));

// Passport Authentication
// Passport Google OAuth
passport.use('google', new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/lists",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },async(accessToken, refreshToken, profile, cb)=>{
        let profileEmail = profile.emails[0].value;
        console.log(profileEmail);
        try{
            const result = await db.query("SELECT * FROM users WHERE email = $1", [profileEmail]);
            if(result.rows.length === 0){
                const user = await db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",[
                    "Anonymous", profileEmail, "google"
                ]);

                cb(null, user.rows[0]);
            }else{
                cb(null, result.rows[0]);
            }
        }catch(err){
            cb(err);
        }
    }
))
// Passport local Auth
passport.use('local', new Strategy ({
    usernameField: 'email'
}, async function verify(username, password, cb){
    try{
        let user = await userAuth.loginUser(username, password, db);

        if(user == "wrong password"){
            return cb(null, false);
        }else if(user == "Email not registered"){
            return cb(null, false, { message: 'Email not registered.' });
        }else{
            return cb(null, user);
        }
    }catch(err){
        return cb(err);
    }
}))

passport.serializeUser((user, cb) => {
    cb(null, user);
})
passport.deserializeUser((user, cb) => {
    cb(null, user)
})

//Listening at port >> 3000
app.listen(port, () => {
    console.log(`Server running at ${port}`)
})