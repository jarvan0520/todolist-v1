const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
const date = require(__dirname + "/date.js")
const _ = require("lodash")

const items = ["Buy food","Cook food","Eat Food"];
let workItems = []
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static("public"))



// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {
//     useNewUrlParser: true});
mongoose.connect("mongodb+srv://jarvanliu0520:LJN67963417@jarvan.utvdyoi.mongodb.net/todolistDB", {
    useNewUrlParser: true});


    
//Created Schema
const itemsSchema = new mongoose.Schema({
  name: String
});
 
//Created model
const Item = mongoose.model("Item", itemsSchema);
 
//Creating items
const item1 = new Item({
  name: "this is a new one."
});
const item2 = new Item({
  name: "auckland newzeland"
});
const item3 = new Item({
  name: "bad weather every day "
});
 
//Storing items into an array
const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name : String,
    items: [itemsSchema],
})
const List = mongoose.model("List",listSchema);

app.get("/",function(req,res){

    Item.find().then(function (foundItems){
        if(foundItems.length === 0){
           Item.insertMany(defaultItems)
                .then(function(){
                    console.log("Successfully saved default items into our DB.");

                })
                .catch(function(err){
                    console.log(err);
                });
                res.redirect("/");
            }else{
                res.render("list", {listTitle: "Today", newListItem: foundItems});
            } 
      });
   
    });


app.post("/",function(req,res){
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name : itemName
    })
    if(listName === "Today"){
        item.save();
        res.redirect("/")
    }else{
        List.findOne({name: listName})
        .then(function(foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        })
        .catch(function(err){
            console.log(err)
        })
    }
  
})
app.post("/work",function(req,res){
    let item = req.body.newItem;

    workItems.push(item)
    res.redirect("/work")
})
app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId)
        .then(function(){
            console.log("Successfully deleted checked item")
            res.redirect("/")
        })
        .catch(function(err){
            console.log(err)
        });
    } else {
        List.findOneAndUpdate({name: listName},{$pull : {items:{_id: checkedItemId}}})
        .then(function(foundList){
            res.redirect("/"+listName )
        })
        .catch(function(err){
            console.log(err)
        })
    }
      
})
      

app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name:customListName})
    .then(function(foundList){
        if(!foundList){
            const list = new List({
                name: customListName,
                items: defaultItems,
            });
            list.save();
            console.log("Saved")
            res.redirect("/"+customListName)
        }
        else{
            res.render("list",{listTitle:foundList.name,newListItem:foundList.items})
        }
        
    }).catch(function(err){})


    
})
app.get("/about",function(req,res){
    res.render("about")
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port,function(){
    console.log("Server has started successfully")
});

// app.listen(3000,function(req,res){
//     console.log("Server has started successfully")
// })



 




