import pg from "pg";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"toDoList",
  password:"Your password",
  port:5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try{
    const result=await db.query("Select * from items order by id ASC");
    items=result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }
  catch(err)
  {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  //items.push({ title: item });
  try{
    await db.query("Insert into items (title) values ($1)",[item]);
    res.redirect("/");
  }
  catch(err)
  {
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {
  const item=req.body.updatedItemTitle;
  const id=req.body.updatedItemId;
  try{
    await db.query("Update items set title=$1 where id=$2",[item,id]);
    res.redirect("/");
  }
  catch(err)
  {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const delId=req.body.deleteItemId;
  try{
    await db.query("Delete from items where id=$1",[delId]);
    res.redirect("/");
  }
  catch(err)
  {
    console.log(err);
  }
  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
