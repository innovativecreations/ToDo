const express = require("express");
const bodyParser = require("body-parser");
const day = require(__dirname + "/day.js");
const mongoose = require("mongoose");
const _ = require("lodash");


mongoose.connect("mongodb+srv://todo:todo@cluster0.rvuamjj.mongodb.net/todo");

const todoSchema = new mongoose.Schema({
  name: String,
});

const Todo = mongoose.model("todo", todoSchema);

const w1 = new Todo({
  name: "Eat",
});
const w2 = new Todo({
  name: "Sleep",
});
const w3 = new Todo({
  name: "Code",
});

const works = [w1, w2, w3];

const nayaListSchema = {
  name: String,
  todo: [todoSchema],
};
const NayaList = mongoose.model("nayalist", nayaListSchema);

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  // const din = day.dateChahia();
  Todo.find({}).then((foundItems) => {
    if (foundItems.length === 0) {
      Todo.insertMany(works)
        .then(function () {
          console.log("Successfully saved defult items to DB");
        })
        .catch(function (err) {
          console.log(err);
        });
      res.redirect("/");
    } else {
      res.render("template", { listKaNaam: "Today", kaam: foundItems , rasta: "Today"});
    }
  });
});

app.post("/", (req, res) => {
  const kaam = req.body.kaam;
  const rasta = req.body.add;
  const kaamDB = new Todo({
    name: kaam,
  });
  if(rasta === "Today"){

  kaamDB.save();
  res.redirect("/");
}
else{
  NayaList.findOne({name: rasta}).then((data)=>{
    data.todo.push(kaamDB);
    data.save();
    res.redirect("/"+rasta);
  })
}
});

app.get("/:newList", (req, res) => {
  const nayaListKaNaam = _.capitalize(req.params.newList);
  NayaList.findOne({ name: nayaListKaNaam })
    .then((data) => {
      if (!data) {
        console.log("Not found");
        const nayaList = new NayaList({
          name: nayaListKaNaam,
          todo: works,
        });
        nayaList.save();
        res.redirect("/"+nayaListKaNaam);
      } else {
        // console.log(data);
        console.log("exists");
        res.render("template", { listKaNaam: data.name, kaam: data.todo});
      }
      
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/delete", (req, res) => {
  const kaam = req.body.checkBox;
  const rasta = req.body.rasta;
  if(rasta === "Today"){
  Todo.findByIdAndRemove(kaam).then(() => {
    console.log("deleted");
    res.redirect("/");
  });}
  else{
    NayaList.findOneAndUpdate({name: rasta}, {$pull:{todo:{_id: kaam}}}).then(()=>{
      res.redirect("/"+rasta);
    })
  }
});

app.listen(process.env.PORT || 3000, ()=>{
conole.log("Server is on");
});
