import express from 'express';
import ejs from 'ejs';
import pg from 'pg';
// Importing database login from another file(ignored)
import db from "./dbConn.js"

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// db.connect();

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
    res.render("lists.ejs")
})
// Login and sign up
app.get("/login", async (req, res) =>{
    res.render("login.ejs")
})
app.get("/sign-up", async (req, res) =>{
    res.render("sign-up.ejs")
})

// POST routes
app.post("/register", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let pwd = req.body.pwd;

    console.log([name, email, pwd]);

    res.render("login.ejs")
})


//Listening in port 3000
app.listen(port, () => {
    console.log(`Server running at ${port}`)
})