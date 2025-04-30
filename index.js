import express from 'express';
import ejs from 'ejs';
import pg from 'pg';
import db from "./dbConn"

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

db.connect();

app.get("/", async (req, res) => {
    res.render('index.ejs',{

    })
})