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

let currentDate = new Date().getFullYear() + "-" 
  + (new Date().getMonth() + 1) + "-"
  + new Date().getDate();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// Seddion middleware (Express and passport)
app.use(session({
    secret: "MYPERSONALSECRETKEY",
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
    res.render('index.ejs');
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

// Edit route
app.get("/edit", (req,res) => {
    res.render("editList.ejs");
})

// Login and sign up
app.get("/login", async (req, res) =>{
    res.render("login.ejs");
});
app.get("/sign-up", async (req, res) =>{
    res.render("sign-up.ejs");
});

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
// -----------POST routes---------------

// Edit lists
app.post("/edit", (req, res) => {
    let id = req.body.editId;
    let title = req.body.editTitle;
    let content = req.body.editContent;

    console.log(content)
    res.render("editList.ejs", {
        id: id,
        title: title,
        content: content
    });
});

app.post("/update", async (req, res) => {
    if(req.isAuthenticated()){
        let id = req.body.editId;
        let title = req.body.editTitle;
        let content = req.body.editContent;

        const update = await db.query("UPDATE notes SET title = $1, content = $2 WHERE id = $3", [
            title, content, id
        ])
        console.log(update);
        res.redirect("/lists");
    }else{
        res.redirect("/login");
    }
});

app.post("/addNew", async (req, res) => {
    if(req.isAuthenticated()){
        let title = req.body.title;
        let content = req.body.content;
        let user = req.user.id;

        const noteId = await db.query(
            "INSERT INTO notes (title, content, last_updated, user_id) VALUES ($1, $2, $3, $4) RETURNING id", 
            [title, content, currentDate, user]
        )

        if (noteId){
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
passport.use(new Strategy ({
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