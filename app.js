
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Abdfatahi:abuhaneefah@database1.1emyf0j.mongodb.net/?retryWrites=true&w=majority&appName=Database1";
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js")
let ejs = require('ejs');
const app = express();
const port = 7800;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));


let items = ['Welcome to your todo-List !','Hit the + button to add a new item','<-- Hit this to delete an item'];

let workItems = [];


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDB(){
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("TodoData");
    const col = db.collection("TodoList");
    return col
 
}



app.get('/', async(req,res)=>{
  const col = await connectToDB();
  
  const items = await col.find({listType:{$ne:'Work'}}).toArray();
  let day = date();
        res.render('list', {listTittle: day, newListItems:items});
});

app.get('/Work', async(req,res)=>{
  const col = await connectToDB();

  const workItems = await col.find({listType:'Work'}).toArray()

  res.render('list', {listTittle:'Work List', newListItems:workItems});
});

app.post('/', async(req,res)=>{
  let itemContent =  req.body.newItem;

  let listType = req.body.list;

  let currentDate = new Date().toISOString().split('T')[0];
 
  let newItem = {
    content: itemContent,
    listType: listType,
    date: currentDate 
  };

  const col = await connectToDB();
  await col.insertOne(newItem);


   if (req.body.list === "Work") {
    workItems.push(newItem.content);
    res.redirect('/Work')
   } else {
    res.redirect('/')
   }
});

app.get('/search', async(req,res)=>{
  const searchDate = req.query.searchDate;

  if(!searchDate){
    return res.redirect('/')
  }
  
  const col = await connectToDB();

  const items = await col.find({date:searchDate}).toArray();

  if(items.length === 0){
    return res.send('No items found for ' + searchDate)
    console.log(items);
  }

  res.render('list', {listTittle:'To-do List for ' + listTittle, newListItems:items});
});

app.get('/about', (req,res)=>{
    res.render('about')
});

    app.listen(port, ()=>{
        console.log('Server has started at port 7800');
    });
