import express from 'express';
import ejs from 'ejs';
import pg from 'pg';
import bcrypt from 'bcrypt';
// Importing database login from another file(ignored on git)
import db from "./imports/dbConn.js";
import * as user from "./imports/login_register.js";

const app = express();
const port = 3000;
const saltRounds = 5;
let userId;

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

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
    const data = await db.query("SELECT * FROM notes WHERE userId = $1", [
        userId
    ])
    let content = data.rows;
    res.render("lists.ejs", {
        note: content
    })
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

    user.registerUser(name, email, pwd, db);

    res.render("login.ejs");
})

// User log in
app.post("/login", async (req, res) => {
    let email = req.body.email;
    let userPassword = req.body.pwd;

    try{
        let result = await user.loginUser(email, userPassword, db);
        console.log(result);

        if(typeof result == "number"){
            res.redirect("/lists");
            userId = result;
        }else if(result == "wrong password"){
            res.render("login.ejs", {
                error: "Wrong Password!!"
            })
        }else if(result == "Email not registered"){
            res.render("login.ejs", {
                error: "Email does not exist!!"
            });
        }
    }catch(err){
        console.error(err);
    }
})


//Listening in port 3000
app.listen(port, () => {
    console.log(`Server running at ${port}`)
})