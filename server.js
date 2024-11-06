import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;
const db = new pg.Client({

  host:"localhost",
  user:"postgres",
  database:"music_player",
  password:"devangshashi",
  port:5432
});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

db.connect();

let songs =[];
async function getSongs(){

  const response = await db.query("SELECT * FROM songs_list");
  songs = response.rows;
}


app.get("/",async(req,res)=>{
  await getSongs();
  res.render("index.ejs",{songs:songs});
});

app.get("/add",async(req,res)=>{

  res.render("new_song.ejs");
});

app.post("/add_new",async(req,res)=>{
  
  const name = req.body.song_name.trim().toLowerCase();
  const url = req.body.url.trim();
  await db.query("INSERT INTO songs_list(name,url) VALUES($1,$2)",[name,url]);
  res.redirect("/");
});

app.listen(port,()=>{
  console.log(`Listening at port ${port}`);
});

